import type { Request, Response, NextFunction } from "express";
import { redis } from "../lib/redis";
import { env } from "../config/env";
import type { AuthContext } from "../types";

const TOKEN_BUCKET_SCRIPT = `
local key = KEYS[1]
local capacity = tonumber(ARGV[1])
local refillRate = tonumber(ARGV[2])
local now = tonumber(ARGV[3])
local requested = tonumber(ARGV[4])

local bucket = redis.call("HMGET", key, "tokens", "timestamp")
local tokens = tonumber(bucket[1])
local timestamp = tonumber(bucket[2])

if tokens == nil then
  tokens = capacity
  timestamp = now
end

local elapsedSeconds = math.max(0, (now - timestamp) / 1000)
tokens = math.min(capacity, tokens + elapsedSeconds * refillRate)

local allowed = 0

if tokens >= requested then
  tokens = tokens - requested
  allowed = 1
end

redis.call("HMSET", key, "tokens", tokens, "timestamp", now)
redis.call("EXPIRE", key, 3600)

return { allowed, math.floor(tokens) }
`;



type Bucket = "create" | "read";

interface LimitConfig {
    capacity: number;
    refillPerSecond: number;
}

function limitFor(tier: AuthContext["tier"], bucket: Bucket): LimitConfig {
    const perMinute = env.rateLimits[tier][bucket];
    return {
        capacity: perMinute,
        refillPerSecond: perMinute / 60
    }
}

export interface RateLimitResult{
    allowed: boolean;
    remaining: number;
}

export async function checkRateLimit(auth: AuthContext, bucket: Bucket): Promise<RateLimitResult> {
    const key = `ratelimit:${auth.userId ?? "anon"}:${bucket}`;
    const { capacity, refillPerSecond} = limitFor(auth.tier, bucket)
    const [allowed, remaining] = (await redis.eval(
        TOKEN_BUCKET_SCRIPT,
        1,
        key,
        capacity,
        refillPerSecond,
        Date.now(),
        1
    )) as [number, number]

    return { allowed: allowed === 1, remaining }; 
}

export function rateLimit(bucket: Bucket) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { allowed, remaining } = await checkRateLimit(req.auth, bucket);
        res.setHeader("X-RateLimit-Remaining", String(remaining));

        if(!allowed) {
            res.status(429).json({error: "Rate limit exceeded"});
            return;
        }

        next();
    };
}