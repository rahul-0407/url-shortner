import { Snowflake } from "../lib/snowflake";
import { cacheGet, cacheSet, cacheTouch, cacheDelete } from "../lib/redis";
import * as repo from "../db/urlRepository";
import { env } from "../config/env";
import type { CreateUrlInput, UrlRecord } from "../types";

const snowflake = new Snowflake(env.workerId);

export async function createShortUrl(input: CreateUrlInput): Promise<UrlRecord> {
    const shortCode = snowflake.nextShortCode();
    const now = Date.now();

    const record: UrlRecord = {
        shortCode,
        longUrl: input.longUrl,
        userId: input.userId,
        createdAt: now,
        expiresAt: input.ttlSeconds ? now + input.ttlSeconds * 1000 : null,
        clickCount: 0
    };

    await repo.insertUrl(record);
    await cacheSet(shortCode, record.longUrl);

    return record;
}

export async function resolveShortUrl(shortCode: string): Promise<string | null> {
    const cached = await cacheGet(shortCode);

    let longUrl: string | null = cached;

    if (longUrl) {
        await cacheTouch(shortCode);
    } else {
        const record = await repo.findByCode(shortCode);
        if (!record) return null;

        if (record.expiresAt && record.expiresAt < Date.now()) {
            return null;
        }

        longUrl = record.longUrl;
        await cacheSet(shortCode, longUrl);
    }

    return longUrl;
}

export async function listUserUrls(userId: string, limit?: number, offset?: number) {
    return repo.findByUser(userId, limit, offset);
}

export async function deleteShortUrl(shortCode: string, userId: string): Promise<boolean> {
    const deleted = await repo.deleteByCode(shortCode, userId);
    if (deleted) {
        await cacheDelete(shortCode);
    }
    return deleted;
}