import { Pool } from "pg";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { env } from "../config/env";

let pool: Pool | null = null;
let supabase: SupabaseClient | null = null;
let dbMode: "pg" | "supabase" = "pg";

export async function connectDb(): Promise<void> {
  if (pool || supabase) return;

  if (env.databaseUrl) {
    dbMode = "pg";
    const needsSsl = env.databaseUrl.includes("supabase.co") || env.databaseUrl.includes("sslmode=require") || !env.databaseUrl.includes("localhost");
    
    const p = new Pool({
      connectionString: env.databaseUrl,
      ssl: needsSsl ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    try {
      const client = await p.connect();
      try {
        await client.query(`
          CREATE TABLE IF NOT EXISTS urls (
            short_code VARCHAR(64) PRIMARY KEY,
            long_url TEXT NOT NULL,
            user_id VARCHAR(255),
            created_at BIGINT NOT NULL,
            expires_at BIGINT,
            click_count INT NOT NULL DEFAULT 0
          );

          CREATE INDEX IF NOT EXISTS idx_urls_user_id ON urls(user_id);
        `);
        console.log("[db] Connected to PostgreSQL (Supabase) via TCP pool successfully.");
        pool = p;
        return;
      } finally {
        client.release();
      }
    } catch (err: any) {
      console.warn(`[db] PostgreSQL pool connection failed (${err.message}).`);
      await p.end().catch(() => {});
      pool = null;
      if (env.supabaseUrl && env.supabaseServiceKey) {
        console.log("[db] Falling back to Supabase HTTP SDK client...");
      } else {
        throw err;
      }
    }
  }

  if (env.supabaseUrl && env.supabaseServiceKey) {
    dbMode = "supabase";
    supabase = createClient(env.supabaseUrl, env.supabaseServiceKey);
    console.log("[db] Connected to Supabase via HTTP SDK.");
  } else {
    console.warn("[db] Neither DATABASE_URL nor SUPABASE_SERVICE_ROLE_KEY configured properly.");
  }
}

export function getPool(): Pool {
  if (!pool && dbMode === "pg") {
    throw new Error("PostgreSQL pool not initialized - call connectDb() first");
  }
  return pool!;
}

export function getSupabase(): SupabaseClient {
  if (!supabase || dbMode !== "supabase") {
    // If fallback occurred, return supabase client
    if (supabase) return supabase;
    throw new Error("Supabase client not initialized - call connectDb() first");
  }
  return supabase!;
}

export function getDbMode(): "pg" | "supabase" {
  return dbMode;
}

export async function closeDb(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
  supabase = null;
}
