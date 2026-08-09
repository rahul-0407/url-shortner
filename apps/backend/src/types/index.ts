export interface UrlRecord {
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
    isAdmin: boolean;
    role?: string;
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

export interface AnalyticsOverviewDto {
    totalClicks: number;
    totalUniqueUsers: number;
    totalUrls: number;
    clicksToday: number;
    topCountries: Array<{ country: string; clicks: number }>;
    topDeviceTypes: Array<{ deviceType: string; clicks: number }>;
}

export interface UrlAnalyticsDto {
    shortCode: string;
    totalClicks: number;
    uniqueUsers: number;
    clicksPerDay: Array<{ date: string; clicks: number }>;
    countryBreakdown: Array<{ country: string; clicks: number }>;
    deviceBreakdown: Array<{ deviceType: string; clicks: number }>;
    recentClicks: Array<{
        timestamp: string;
        country: string;
        deviceType: string;
        ipHash: string;
    }>;
}

export interface TopUrlItemDto {
    shortCode: string;
    longUrl: string | null;
    totalClicks: number;
    uniqueUsers: number;
}

export interface TopUrlsResponseDto {
    data: TopUrlItemDto[];
    pagination: {
        limit: number;
        offset: number;
        total: number;
    };
}

export interface RealtimeAnalyticsDto {
    clicksLast5Min: number;
    uniqueUsersLast5Min: number;
    clicksPerMinute: Array<{ minute: string; clicks: number }>;
    recentClicks: Array<{
        shortCode: string;
        timestamp: string;
        country: string;
        deviceType: string;
        ipHash: string;
    }>;
}