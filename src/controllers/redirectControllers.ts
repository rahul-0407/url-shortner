import type { Request, Response } from "express";

export async function redirect(req: Request, res: Response): Promise<void> {

    const longUrl = "abcd"

    if (!longUrl) {
        res.status(404).send("Not found");
        return;
    }

    res.redirect(302, longUrl)
}