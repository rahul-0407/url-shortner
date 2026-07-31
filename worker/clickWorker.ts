import { redis } from "../src/lib/redis";
import { connectDb } from "../src/db/client";
import type { ClickEvent } from "../src/types";
import * as repo from "../src/db/urlRepository";

const CLICK_QUEUE_KEY = "queue:clicks";
const BATCH_SIZE = 100;
const POLL_INTERVAL_MS = 500;

await connectDb()
console.log("click worker started")

async function drainOnce(): Promise<number> {
    const counts = new Map<string, number>();

    for(let i = 0; i < BATCH_SIZE; i++){
        const raw = await redis.rpop(CLICK_QUEUE_KEY);
        if(!raw) break;

        const event = JSON.parse(raw) as ClickEvent;
        counts.set(event.shortCode, (counts.get(event.shortCode) ?? 0) + 1)
    }

    for(let [shortCode, count] of counts){
        await repo.incrementClicks(shortCode, count);
    }

    return counts.size;
}

while(true){
    const updated = await drainOnce();
    if(updated == 0){
        await Bun.sleep(POLL_INTERVAL_MS)
    }
}