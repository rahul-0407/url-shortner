import { createRemoteJWKSet, jwtVerify } from "jose";
import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env";
import type { UserTier } from "../types";

interface SupabaseJwtPayload {
  sub: string;
  email?: string;
  role?: string;
  app_metadata?: {
    tier?: UserTier;
    role?: string;
    is_admin?: boolean;
    isAdmin?: boolean;
  };
  user_metadata?: {
    role?: string;
    is_admin?: boolean;
    isAdmin?: boolean;
  };
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
    req.auth = { userId: null, tier: "anon", isAdmin: false };
    return next();
  }

  const token = authHeader.slice("Bearer ".length);

  try {


    const { payload } = await jwtVerify(token, getJWKS());
    const p = payload as unknown as SupabaseJwtPayload;

    const role = p.app_metadata?.role || p.user_metadata?.role || p.role;
    const isAdmin =
      role === "admin" ||
      p.app_metadata?.is_admin === true ||
      p.app_metadata?.isAdmin === true ||
      p.user_metadata?.is_admin === true ||
      p.user_metadata?.isAdmin === true;

    req.auth = {
      userId: p.sub ?? null,
      tier: p.app_metadata?.tier ?? "free",
      isAdmin: Boolean(isAdmin),
      role,
    };
  } catch (error) {
    console.error("[auth] Token verification failed:", error);
    req.auth = { userId: null, tier: "anon", isAdmin: false };
  }

  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {

  if (!req.auth?.userId && !req.headers["x-admin-secret"]) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }


  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {

  if (req.auth?.isAdmin || req.auth?.role === "admin") {
    return next();
  }

  const secretHeader = req.headers["x-admin-secret"];

  if (env.adminSecret && secretHeader === env.adminSecret) {
    return next();
  }

  res.status(403).json({ error: "Admin access required. Only admins can access analytics endpoints." });
}