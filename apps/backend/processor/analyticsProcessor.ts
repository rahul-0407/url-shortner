import { Kafka, Consumer, logLevel } from "kafkajs";
import { env } from "../src/config/env";
import { initClickHouse, insertClickEventsBatch, closeClickHouse } from "../src/db/clickhouse";
import type { ClickEvent } from "../src/types";

const BATCH_SIZE = 100;
const FLUSH_INTERVAL_MS = 1000;
const MAX_RETRIES = 3;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function getSslConfig() {
  if (!env.kafkaSsl) return undefined;
  if (env.kafkaCaCert && env.kafkaClientKey && env.kafkaClientCert) {
    return {
      rejectUnauthorized: env.kafkaRejectUnauthorized,
      ca: [env.kafkaCaCert],
      key: env.kafkaClientKey,
      cert: env.kafkaClientCert,
    };
  }
  return {
    rejectUnauthorized: env.kafkaRejectUnauthorized,
  };
}

const kafka = new Kafka({
  clientId: "analytics-stream-processor",
  brokers: env.kafkaBrokers.split(",").map((b) => b.trim()),
  ssl: getSslConfig(),
  sasl: env.kafkaSaslUsername
    ? {
        mechanism: (env.kafkaSaslMechanism as any) || "scram-sha-512",
        username: env.kafkaSaslUsername,
        password: env.kafkaSaslPassword,
      }
    : undefined,
  logLevel: logLevel.WARN,
  retry: {
    initialRetryTime: 500,
    retries: 10,
  },
});

const consumer: Consumer = kafka.consumer({
  groupId: "analytics-consumer-group",
});

let buffer: ClickEvent[] = [];
let flushTimer: any = null;
let isShuttingDown = false;

async function flushBuffer(): Promise<void> {
  if (buffer.length === 0) return;

  const batchToInsert = [...buffer];
  buffer = [];

  let attempt = 0;
  while (attempt < MAX_RETRIES) {
    try {
      attempt++;
      await insertClickEventsBatch(batchToInsert);
      console.log(`[stream-processor] Batch of ${batchToInsert.length} events inserted into ClickHouse.`);
      return;
    } catch (err: any) {
      console.error(`[stream-processor] Error inserting batch into ClickHouse (attempt ${attempt}/${MAX_RETRIES}):`, err.message);
      if (attempt < MAX_RETRIES) {
        await sleep(1000 * attempt);
      } else {
        console.error(`[stream-processor] FATAL: Dropped ${batchToInsert.length} events after ${MAX_RETRIES} failed attempts.`);
      }
    }
  }
}

async function ensureTopicExists(): Promise<void> {
  const admin = kafka.admin();
  try {
    await admin.connect();
    const topics = await admin.listTopics();
    if (!topics.includes(env.kafkaTopic)) {
      await admin.createTopics({
        topics: [{ topic: env.kafkaTopic, numPartitions: 1, replicationFactor: 1 }],
      });
      console.log(`[stream-processor] Created Kafka topic '${env.kafkaTopic}' in Aiven Kafka`);
    }
  } catch (err: any) {
    console.warn(`[stream-processor] Auto topic creation warning: ${err.message}`);
  } finally {
    await admin.disconnect().catch(() => {});
  }
}

export async function startProcessor(): Promise<void> {
  console.log("[stream-processor] Starting Kafka -> ClickHouse analytics stream processor...");

  let clickhouseReady = false;
  for (let i = 1; i <= 10; i++) {
    try {
      await initClickHouse();
      clickhouseReady = true;
      break;
    } catch (err: any) {
      console.warn(`[stream-processor] ClickHouse not ready yet (attempt ${i}/10): ${err.message}. Retrying in 3s...`);
      await sleep(3000);
    }
  }

  if (!clickhouseReady) {
    console.error("[stream-processor] Could not connect to ClickHouse. Skipping stream processor startup...");
    return;
  }

  await ensureTopicExists();

  let consumerConnected = false;
  for (let attempt = 1; attempt <= 10; attempt++) {
    try {
      await consumer.connect();
      await consumer.subscribe({ topic: env.kafkaTopic, fromBeginning: false });
      consumerConnected = true;
      console.log(`[stream-processor] Kafka consumer connected and subscribed to '${env.kafkaTopic}' on Aiven Kafka`);
      break;
    } catch (err: any) {
      console.warn(`[stream-processor] Kafka consumer connection attempt ${attempt}/10 failed: ${err.message}. Retrying in 5s...`);
      await sleep(5000);
    }
  }

  if (!consumerConnected) {
    console.error("[stream-processor] Could not connect Kafka consumer. Stream processor disabled.");
    return;
  }

  flushTimer = setInterval(() => {
    if (!isShuttingDown && buffer.length > 0) {
      flushBuffer().catch((err) => console.error("[stream-processor] Error in periodic flush:", err.message));
    }
  }, FLUSH_INTERVAL_MS);

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (isShuttingDown || !message.value) return;

      try {
        const event = JSON.parse(message.value.toString()) as ClickEvent;
        buffer.push(event);

        if (buffer.length >= BATCH_SIZE) {
          await flushBuffer();
        }
      } catch (err: any) {
        console.error("[stream-processor] Error parsing message from Kafka:", err.message);
      }
    },
  });
}

export async function stopProcessor(): Promise<void> {
  isShuttingDown = true;
  if (flushTimer) clearInterval(flushTimer);
  await flushBuffer();
  await consumer.disconnect().catch(() => {});
  await closeClickHouse().catch(() => {});
}
