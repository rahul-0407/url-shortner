export interface UrlRecord{
    shortCode: string;
    longUrl: string;
    userId: string | null;
    createdAt: number;
    expiresAt: number | null;
    clickCount: number;
}

export interface CreateUrlInput {
    longUrl: string;
    userId: string | null;
    ttlSeconds?: number;
}

export type UserTier = "anon" | "free" | "pro";

export interface AuthContext {
    userId: string | null;
    tier: UserTier;
}

export interface ClickEvent {
    shortCode: string;
    timestamp: number;
    ipHash: string;
    country: string;
    deviceType: "mobile" | "desktop" | "tablet" | "bot" | "unknown";
    userAgentHash: string;
    userId: string | null;
}