import { MongoClient, type Db } from "mongodb"
import { env } from "../config/env";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectDb(): Promise<Db> {
    if (db) return db;

    client = new MongoClient(env.mongoUrl)
    await client.connect();
    db = await client.db(env.mongoDbName);

    const urls = db.collection("urls");
    await urls.createIndex({ shortCode: 1 }, { unique: true });
    await urls.createIndex({ userId: 1 });

    return db;
}

export function getDb(): Db {
    if (!db) {
        throw new Error("Database not connected - call connectDb() first");
    }
    return db;
}

export async function closeDb(): Promise<void> {
    await client?.close();
    client = null;
    db = null;
}
