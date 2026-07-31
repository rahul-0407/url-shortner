import type { Request, Response } from "express";
import * as urlService from "../services/urlService";

export async function redirect(req: Request, res: Response): Promise<void> {

    const longUrl = await urlService.resolveShortUrl(req.params.shortCode as string)

    if (!longUrl) {
        res.status(404).send("Not found");
        return;
    }

    res.redirect(302, longUrl)
}