import type { Request, Response } from "express";
import * as adminAnalyticsService from "../services/adminAnalyticsService";

export async function getOverview(_req: Request, res: Response): Promise<void> {

  try {

    const data = await adminAnalyticsService.getOverviewAnalytics();
    res.json(data);

  } catch (error: any) {
    console.error("[admin-analytics] Error getting overview:", error.message);
    res.status(500).json({ error: "Failed to fetch analytics overview" });
  }
}



export async function getUrlAnalytics(req: Request, res: Response): Promise<void> {

  const shortCode = String(req.params.shortCode || "");

  if (!shortCode) {
    res.status(400).json({ error: "shortCode parameter is required" });
    return;
  }

  try {
    const data = await adminAnalyticsService.getUrlAnalytics(shortCode);
    res.json(data);
  } catch (error: any) {
    console.error(`[admin-analytics] Error getting URL analytics for ${shortCode}:`, error.message);
    res.status(500).json({ error: "Failed to fetch URL analytics" });
  }
}

export async function getTopUrls(req: Request, res: Response): Promise<void> {

  const limitParam = req.query.limit ? parseInt(String(req.query.limit), 10) : 20;
  const offsetParam = req.query.offset ? parseInt(String(req.query.offset), 10) : 0;

  const limit = isNaN(limitParam) ? 20 : limitParam;
  const offset = isNaN(offsetParam) ? 0 : offsetParam;

  try {

    const data = await adminAnalyticsService.getTopUrls(limit, offset);
    res.json(data);

  } catch (error: any) {
    console.error("[admin-analytics] Error getting top URLs:", error.message);
    res.status(500).json({ error: "Failed to fetch top URLs analytics" });
  }
}




export async function getRealtime(_req: Request, res: Response): Promise<void> {
  try {
    const data = await adminAnalyticsService.getRealtimeAnalytics();
    res.json(data);
  } catch (error: any) {
    console.error("[admin-analytics] Error getting realtime analytics:", error.message);
    res.status(500).json({ error: "Failed to fetch realtime analytics" });
  }
}
