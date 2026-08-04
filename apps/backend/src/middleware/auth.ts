import { createRemoteJWKSet, jwtVerify } from "jose";
import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env";
import type { UserTier } from "../types";

interface SupabaseJwtPayload {
  sub: string;
  email?: string;
  app_metadata?: { tier?: UserTier };
}

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJWKS() {
  if (!jwks) {
    const url = `${env.supabaseUrl.replace(/\/$/, "")}/auth/v1/.well-known/jwks.json`;
    jwks = createRemoteJWKSet(new URL(url));
  }
  return jwks;
}

export async function attachAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization ?? null;

  if (!authHeader?.startsWith("Bearer ")) {
    req.auth = { userId: null, tier: "anon" };
    return next();
  }

  const token = authHeader.slice("Bearer ".length);

  try {
    const { payload } = await jwtVerify(token, getJWKS());
    const supabasePayload = payload as unknown as SupabaseJwtPayload;
    req.auth = {
      userId: supabasePayload.sub ?? null,
      tier: supabasePayload.app_metadata?.tier ?? "free",
    };
  } catch (error) {
    console.error("[auth] Token verification failed:", error);
    req.auth = { userId: null, tier: "anon" };
  }

  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.auth?.userId) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  next();
}