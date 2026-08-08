import type { Request, Response } from "express";
import * as urlService from "../services/urlService";
import { publishClickEvent } from "../lib/kafkaProducer";
import { hashString, getCountryFromIp, parseDeviceType } from "../lib/analyticsHelper";
import type { ClickEvent } from "../types";

export async function redirect(req: Request, res: Response): Promise<void> {
    const shortCode = req.params.shortCode as string;
    const longUrl = await urlService.resolveShortUrl(shortCode);

    if (!longUrl) {
        res.status(404).send("Not found");
        return;
    }

    const rawIp = (req.headers["x-forwarded-for"] as string) || req.ip || req.socket.remoteAddress || "127.0.0.1";
    const userAgent = (req.headers["user-agent"] as string) || "";

    const event: ClickEvent = {
        shortCode,
        timestamp: Date.now(),
        ipHash: hashString(rawIp),
        country: getCountryFromIp(rawIp),
        deviceType: parseDeviceType(userAgent),
        userAgentHash: hashString(userAgent),
        userId: (req as any).user?.id ?? null,
    }

    publishClickEvent(event)

    res.redirect(302, longUrl);
}