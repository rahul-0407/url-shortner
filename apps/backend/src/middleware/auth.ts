import jwt from "jsonwebtoken"
import type { Request, Response, NextFunction } from "express"
import { env } from "../config/env"
import type { UserTier } from "../types"

interface SuperbaseJwtPayload {
    sub: string;
    email?: string;
    app_metadata?: { tier?: UserTier };
}

export function attachAuth(req: Request, _res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization ?? null;

    if (!authHeader?.startsWith("Bearer ")) {
        req.auth = { userId: null, tier: "anon" }
        return next();
    }

    const token = authHeader.slice("Bearer ".length)

    try {
        const payload = jwt.verify(token, env.supabaseJwtSecret) as SuperbaseJwtPayload;
        req.auth = {
            userId: payload.sub,
            tier: payload.app_metadata?.tier ?? "free",
        };
    } catch (error) {
        req.auth = { userId: null, tier: "anon" };
    }

    next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
    if (!req.auth.userId) {
        res.status(401).json({ error: "Authentication required" });
        return;
    }
    next();
}