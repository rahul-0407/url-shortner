import Redis from "ioredis";
import { env } from "../config/env";

export const redis = new Redis(env.redisUrl, {
  maxRetriesPerRequest: 3,
})

redis.on("error", (err) => {
  console.error("[redis] connection error:", err.message);
});


const CACHE_TTL_SECONDS = 86_400;

export async function cacheGet(shortCode: string): Promise<string | null> {
  return redis.get(`cache:${shortCode}`);
}

export async function cacheSet(shortCode: string, longUrl: string): Promise<void> {
  await redis.set(`cache:${shortCode}`, longUrl, "EX", CACHE_TTL_SECONDS);
}

export async function cacheTouch(shortCode: string): Promise<void> {
  await redis.expire(`cache:${shortCode}`, CACHE_TTL_SECONDS);
}

export async function cacheDelete(shortCode: string): Promise<void> {
  await redis.del(`cache:${shortCode}`);
}

