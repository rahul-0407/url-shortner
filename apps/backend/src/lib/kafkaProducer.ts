import { Kafka, Producer, logLevel } from "kafkajs";
import { env } from "../config/env";
import type { ClickEvent } from "../types";

let producer: Producer | null = null;
let isConnecting = false;

function getSslConfig() {
  if (!env.kafkaSsl) return undefined;
  return {
    rejectUnauthorized: false,
  };
}

const kafka = new Kafka({
  clientId: env.kafkaClientId,
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
    initialRetryTime: 300,
    retries: 3,
  },
});

async function getProducer(): Promise<Producer | null> {
  if (producer) return producer;
  if (isConnecting) return null;

  isConnecting = true;
  try {
    const p = kafka.producer();
    await p.connect();
    producer = p;
    console.log("[kafka] Kafka producer connected successfully.");
    return producer;
  } catch (err: any) {
    console.error("[kafka] Failed to connect Kafka producer:", err.message);
    return null;
  } finally {
    isConnecting = false;
  }
}

export function publishClickEvent(event: ClickEvent): void {
  (async () => {
    try {
      const p = await getProducer();
      if (!p) {
        console.warn("[kafka] Kafka producer unavailable, dropping event for:", event.shortCode);
        return;
      }

      await p.send({
        topic: env.kafkaTopic,
        messages: [
          {
            key: event.shortCode,
            value: JSON.stringify(event),
          },
        ],
      });
    } catch (err: any) {
      console.error("[kafka] Error producing click event to Kafka:", err.message);
    }
  })();
}

export async function disconnectKafkaProducer(): Promise<void> {
  if (producer) {
    await producer.disconnect().catch(() => {});
    producer = null;
  }
}
