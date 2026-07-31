import { redis, cacheGet, cacheSet, cacheTouch, cacheDelete } from "../lib/redis";
import * as repo from "../db/urlRepository";
import { env } from "../config/env";
import type { CreateUrlInput, UrlRecord, ClickEvent } from "../types";

const CLICK_QUEUE_KEY = "queue:clicks";

export async function resolveShortUrl(shortCode: string): Promise<string | null> {
    const cached = await cacheGet(shortCode)

    let longUrl: string | null = cached;

    if(longUrl){
        await cacheTouch(shortCode)
    } else {
        const record = await repo.findByCode(shortCode);
        if(!record) return null;

        if(record.expiresAt && record.expiresAt < Date.now()){
            return null;
        }

        longUrl = record.longUrl;
        await cacheSet(shortCode, longUrl)
    }

    await enqueueClick(shortCode);
    return longUrl;
}

async function enqueueClick(shortCode: string): Promise<void> {
    const event: ClickEvent = { shortCode, timestamp: Date.now()};
    await redis.lpush(CLICK_QUEUE_KEY, JSON.stringify(event));
}