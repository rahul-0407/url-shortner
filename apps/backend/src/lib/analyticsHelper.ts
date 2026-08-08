import crypto from "crypto";
import geoip from "geoip-lite";
import { UAParser } from "ua-parser-js";

export function hashString(value: string): string {
  return crypto.createHash("sha256").update(value || "unknown").digest("hex");
}

export function getCountryFromIp(ip: string): string {
  if (!ip || ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168.") || ip.startsWith("10.")) {
    return "LOCAL";
  }
  const cleanIp = (ip || "").split(",")[0]?.trim() || "127.0.0.1";
  const geo = geoip.lookup(cleanIp);
  return geo?.country || "UNKNOWN";
}

export function parseDeviceType(userAgent: string): "mobile" | "desktop" | "tablet" | "bot" | "unknown" {
  if (!userAgent) return "unknown";

  const lowerUa = userAgent.toLowerCase();
  if (
    lowerUa.includes("bot") ||
    lowerUa.includes("crawler") ||
    lowerUa.includes("spider") ||
    lowerUa.includes("slurp") ||
    lowerUa.includes("lighthouse")
  ) {
    return "bot";
  }

  const parser = new UAParser(userAgent);
  const device = parser.getDevice();

  if (device.type === "mobile") return "mobile";
  if (device.type === "tablet") return "tablet";

  if (/ipad|tablet|playbook|silk/i.test(userAgent)) return "tablet";
  if (/mobile|iphone|android|touch|blackberry|opera mini/i.test(userAgent)) return "mobile";

  return "desktop";
}
