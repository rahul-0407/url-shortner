import { getDb } from "./client";
import type { UrlRecord } from "../types";

const COLLECTION = "urls";


export async function insertUrl(record: UrlRecord): Promise<void> {
    await getDb().collection<UrlRecord>(COLLECTION).insertOne(record);
}

export async function findByCode(shortCode: string): Promise<UrlRecord | null> {
    return getDb().collection<UrlRecord>(COLLECTION).findOne({shortCode}, {projection: {_id:0}});
}

export async function findByUser(userId: string, limit = 50, offset = 0): Promise<UrlRecord[] | null> {
    return getDb().collection<UrlRecord>(COLLECTION).find({userId}, {projection: {_id:0}}).sort({createdAt: -1}).skip(offset).limit(limit).toArray();
}

export async function deleteByCode(shortCode: string,  userId: string): Promise<boolean> {
    const result = getDb().collection<UrlRecord>(COLLECTION).deleteOne({shortCode, userId});
    return (await result).deletedCount > 0;
}

export async function incrementClicks(shortCode: string, by = 1): Promise<void> {
  await getDb().collection<UrlRecord>(COLLECTION).updateOne({shortCode}, {$inc: {clickCount: by}});
}
