import type { Request, Response } from "express";
import { env } from "../config/env";
import * as urlService from "../services/urlService";
import * as repo from "../db/urlRepository";

export async function createUrl(req: Request, res: Response): Promise<void> {
    const { longUrl, ttlSeconds } = req.body ?? {};

    if (!longUrl) {
        res.status(400).json({ error: "longUrl is required" });
        return;
    }

    try {
        new URL(longUrl); // throws if not a valid absolute URL
    } catch {
        res.status(400).json({ error: "longUrl must be a valid absolute URL" });
        return;
    }

    const record = await urlService.createShortUrl({ longUrl, userId: req.auth.userId, ttlSeconds })

    res.status(201).json({
        shortCode: record.shortCode,
        shortUrl: `${env.baseUrl}/${record.shortCode}`,
        longUrl: record.longUrl,
        createdAt: record.createdAt,
        expiresAt: record.expiresAt,
    })
}

export async function listUrls(req: Request, res: Response): Promise<void> {
    const limit = Number(req.query.limit ?? "50");
    const offset = Number(req.query.offset ?? "0");

    const urls = await urlService.listUserUrls(req.auth.userId as string, limit, offset);
    res.json({ urls });
}

export async function getUrl(req: Request, res: Response): Promise<void> {
    const record = await repo.findByCode(req.params.shortCode as string);
    if (!record) {
        res.status(404).json({ error: "Not found..." });
        return;
    }
    res.json(record);
}

export async function deleteUrl(req: Request, res: Response): Promise<void> {
    const deleted = await urlService.deleteShortUrl(req.params.shortCode as string, req.auth.userId as string);

    if (!deleted) {
        res.status(404).json({ error: "Not found or not owned by you" });
        return;
    }
    res.status(204).end();
}

export async function getStats(req: Request, res: Response): Promise<void> {
    const record = await repo.findByCode(req.params.shortCode as string);
    if (!record) {
        res.status(404).json({ error: "Not found" });
        return;
    }
    res.json({ shortCode: record.shortCode, clickCount: record.clickCount });
}