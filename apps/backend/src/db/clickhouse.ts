import { createClient, ClickHouseClient } from "@clickhouse/client";
import { env } from "../config/env";
import type { ClickEvent } from "../types";

let clickhouseClient: ClickHouseClient | null = null;

export function getClickHouseClient(): ClickHouseClient {
  if (!clickhouseClient) {
    clickhouseClient = createClient({
      url: env.clickhouseHost,
      username: env.clickhouseUsername,
      password: env.clickhousePassword,
      database: env.clickhouseDatabase,
      request_timeout: 10000,
    });
  }
  return clickhouseClient;
}

export async function initClickHouse(): Promise<void> {
  const client = getClickHouseClient();

  try {
    await client.command({
      query: `
        CREATE TABLE IF NOT EXISTS raw_clicks (
          short_code String,
          timestamp DateTime64(3, 'UTC'),
          ip_hash String,
          country LowCardinality(String),
          device_type LowCardinality(String),
          user_agent_hash String,
          user_id Nullable(String),
          created_at DateTime DEFAULT now()
        ) ENGINE = MergeTree()
        ORDER BY (short_code, timestamp);
      `,
    });

    await client.command({
      query: `
        CREATE TABLE IF NOT EXISTS daily_clicks (
          date Date,
          short_code String,
          clicks SimpleAggregateFunction(sum, UInt64)
        ) ENGINE = SummingMergeTree()
        ORDER BY (date, short_code);
      `,
    });

    await client.command({
      query: `
        CREATE MATERIALIZED VIEW IF NOT EXISTS daily_clicks_mv
        TO daily_clicks AS
        SELECT
          toDate(timestamp) AS date,
          short_code,
          count() AS clicks
        FROM raw_clicks
        GROUP BY date, short_code;
      `,
    });

    await client.command({
      query: `
        CREATE TABLE IF NOT EXISTS daily_unique_users (
          date Date,
          short_code String,
          unique_ips AggregateFunction(uniq, String)
        ) ENGINE = AggregatingMergeTree()
        ORDER BY (date, short_code);
      `,
    });

    await client.command({
      query: `
        CREATE MATERIALIZED VIEW IF NOT EXISTS daily_unique_users_mv
        TO daily_unique_users AS
        SELECT
          toDate(timestamp) AS date,
          short_code,
          uniqState(ip_hash) AS unique_ips
        FROM raw_clicks
        GROUP BY date, short_code;
      `,
    });

    console.log("[clickhouse] Connected and initialized tables/views successfully.");
  } catch (err: any) {
    console.error("[clickhouse] Error initializing ClickHouse schema:", err.message);
    throw err;
  }
}

export async function insertClickEventsBatch(events: ClickEvent[]): Promise<void> {
  if (events.length === 0) return;
  const client = getClickHouseClient();

  const formattedValues = events.map((e) => ({
    short_code: e.shortCode,
    timestamp: e.timestamp,
    ip_hash: e.ipHash,
    country: e.country,
    device_type: e.deviceType,
    user_agent_hash: e.userAgentHash,
    user_id: e.userId ?? null,
  }));

  await client.insert({
    table: "raw_clicks",
    values: formattedValues,
    format: "JSONEachRow",
  });
}

export async function closeClickHouse(): Promise<void> {
  if (clickhouseClient) {
    await clickhouseClient.close();
    clickhouseClient = null;
  }
}
