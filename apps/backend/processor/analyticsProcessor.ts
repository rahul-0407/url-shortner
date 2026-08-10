import { Kafka, Consumer, logLevel } from "kafkajs";
import { env } from "../src/config/env";
import { initClickHouse, insertClickEventsBatch, closeClickHouse } from "../src/db/clickhouse";
import type { ClickEvent } from "../src/types";

const BATCH_SIZE = 100;
const FLUSH_INTERVAL_MS = 1000;
const MAX_RETRIES = 3;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const kafka = new Kafka({
  clientId: "analytics-stream-processor",
  brokers: env.kafkaBrokers.split(",").map((b) => b.trim()),
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
flushBuffer
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

  await consumer.connect();
  await consumer.subscribe({ topic: env.kafkaTopic, fromBeginning: false });

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

  console.log(`[stream-processor] Listening to topic '${env.kafkaTopic}'...`);
}

// Auto-start if executed directly via CLI
if (import.meta.main || require.main === module) {
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  startProcessor().catch((err) => {
    console.error("[stream-processor] Fatal error starting stream processor:", err);
    process.exit(1);
  });
}
