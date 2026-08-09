import { getClickHouseClient } from "../db/clickhouse";
import * as repo from "../db/urlRepository";
import type {
  AnalyticsOverviewDto,
  UrlAnalyticsDto,
  TopUrlsResponseDto,
  TopUrlItemDto,
  RealtimeAnalyticsDto,
} from "../types";

export async function getOverviewAnalytics(): Promise<AnalyticsOverviewDto> {
  const client = getClickHouseClient();

  const [totalClicksRes, uniqueUsersRes, clicksTodayRes, topCountriesRes, topDevicesRes, totalUrls] =
    await Promise.all([
      client.query({ query: "SELECT count() AS total FROM raw_clicks", format: "JSONEachRow" }),
      client.query({ query: "SELECT uniq(ip_hash) AS total FROM raw_clicks", format: "JSONEachRow" }),
      client.query({ query: "SELECT count() AS total FROM raw_clicks WHERE toDate(timestamp) = today()", format: "JSONEachRow" }),
      client.query({ query: "SELECT country, count() AS clicks FROM raw_clicks GROUP BY country ORDER BY clicks DESC LIMIT 10", format: "JSONEachRow" }),
      client.query({ query: "SELECT device_type AS deviceType, count() AS clicks FROM raw_clicks GROUP BY deviceType ORDER BY clicks DESC", format: "JSONEachRow" }),
      repo.getTotalUrlsCount(),
    ]);

  const [totalClicksRows, uniqueUsersRows, clicksTodayRows, topCountries, topDeviceTypes] = await Promise.all([
    totalClicksRes.json<{ total: string | number }>(),
    uniqueUsersRes.json<{ total: string | number }>(),
    clicksTodayRes.json<{ total: string | number }>(),
    topCountriesRes.json<{ country: string; clicks: string | number }>(),
    topDevicesRes.json<{ deviceType: string; clicks: string | number }>(),
  ]);

  return {
    totalClicks: Number(totalClicksRows[0]?.total ?? 0),
    totalUniqueUsers: Number(uniqueUsersRows[0]?.total ?? 0),
    totalUrls,
    clicksToday: Number(clicksTodayRows[0]?.total ?? 0),
    topCountries: topCountries.map((c) => ({ country: c.country, clicks: Number(c.clicks) })),
    topDeviceTypes: topDeviceTypes.map((d) => ({ deviceType: d.deviceType, clicks: Number(d.clicks) })),
  };
}

export async function getUrlAnalytics(shortCode: string): Promise<UrlAnalyticsDto> {
  const client = getClickHouseClient();

  const queryParams = { shortCode };

  const [
    totalClicksRes,
    uniqueUsersRes,
    clicksPerDayRes,
    countryBreakdownRes,
    deviceBreakdownRes,
    recentClicksRes,
  ] = await Promise.all([
    client.query({
      query: "SELECT count() AS total FROM raw_clicks WHERE short_code = {shortCode: String}",
      query_params: queryParams,
      format: "JSONEachRow",
    }),
    client.query({
      query: "SELECT uniq(ip_hash) AS total FROM raw_clicks WHERE short_code = {shortCode: String}",
      query_params: queryParams,
      format: "JSONEachRow",
    }),
    client.query({
      query: "SELECT toString(toDate(timestamp)) AS date, count() AS clicks FROM raw_clicks WHERE short_code = {shortCode: String} AND timestamp >= now() - INTERVAL 30 DAY GROUP BY date ORDER BY date ASC",
      query_params: queryParams,
      format: "JSONEachRow",
    }),
    client.query({
      query: "SELECT country, count() AS clicks FROM raw_clicks WHERE short_code = {shortCode: String} GROUP BY country ORDER BY clicks DESC LIMIT 10",
      query_params: queryParams,
      format: "JSONEachRow",
    }),
    client.query({
      query: "SELECT device_type AS deviceType, count() AS clicks FROM raw_clicks WHERE short_code = {shortCode: String} GROUP BY deviceType ORDER BY clicks DESC",
      query_params: queryParams,
      format: "JSONEachRow",
    }),
    client.query({
      query: "SELECT toString(timestamp) AS timestamp, country, device_type AS deviceType, ip_hash AS ipHash FROM raw_clicks WHERE short_code = {shortCode: String} ORDER BY timestamp DESC LIMIT 20",
      query_params: queryParams,
      format: "JSONEachRow",
    }),
  ]);

  const [
    totalClicksRows,
    uniqueUsersRows,
    clicksPerDay,
    countryBreakdown,
    deviceBreakdown,
    recentClicks,
  ] = await Promise.all([
    totalClicksRes.json<{ total: string | number }>(),
    uniqueUsersRes.json<{ total: string | number }>(),
    clicksPerDayRes.json<{ date: string; clicks: string | number }>(),
    countryBreakdownRes.json<{ country: string; clicks: string | number }>(),
    deviceBreakdownRes.json<{ deviceType: string; clicks: string | number }>(),
    recentClicksRes.json<{ timestamp: string; country: string; deviceType: string; ipHash: string }>(),
  ]);

  return {
    shortCode,
    totalClicks: Number(totalClicksRows[0]?.total ?? 0),
    uniqueUsers: Number(uniqueUsersRows[0]?.total ?? 0),
    clicksPerDay: clicksPerDay.map((cpd) => ({ date: cpd.date, clicks: Number(cpd.clicks) })),
    countryBreakdown: countryBreakdown.map((cb) => ({ country: cb.country, clicks: Number(cb.clicks) })),
    deviceBreakdown: deviceBreakdown.map((db) => ({ deviceType: db.deviceType, clicks: Number(db.clicks) })),
    recentClicks,
  };
}

export async function getTopUrls(limit = 20, offset = 0): Promise<TopUrlsResponseDto> {
  const client = getClickHouseClient();

  const safeLimit = Math.min(Math.max(1, limit), 100);
  const safeOffset = Math.max(0, offset);

  const [topUrlsRes, totalCountRes] = await Promise.all([
    client.query({
      query: `
        SELECT 
          short_code AS shortCode, 
          count() AS totalClicks, 
          uniq(ip_hash) AS uniqueUsers 
        FROM raw_clicks 
        GROUP BY shortCode 
        ORDER BY totalClicks DESC 
        LIMIT {limit: UInt32} OFFSET {offset: UInt32}
      `,
      query_params: { limit: safeLimit, offset: safeOffset },
      format: "JSONEachRow",
    }),
    client.query({
      query: "SELECT uniqExact(short_code) AS total FROM raw_clicks",
      format: "JSONEachRow",
    }),
  ]);

  const [topUrlsRows, totalRows] = await Promise.all([
    topUrlsRes.json<{ shortCode: string; totalClicks: string | number; uniqueUsers: string | number }>(),
    totalCountRes.json<{ total: string | number }>(),
  ]);

  const shortCodes = topUrlsRows.map((r) => r.shortCode);
  const urlMap = await repo.findByCodesBatch(shortCodes);

  const data: TopUrlItemDto[] = topUrlsRows.map((row) => ({
    shortCode: row.shortCode,
    longUrl: urlMap.get(row.shortCode) ?? null,
    totalClicks: Number(row.totalClicks),
    uniqueUsers: Number(row.uniqueUsers),
  }));

  const total = Number(totalRows[0]?.total ?? 0);

  return {
    data,
    pagination: {
      limit: safeLimit,
      offset: safeOffset,
      total,
    },
  };
}

export async function getRealtimeAnalytics(): Promise<RealtimeAnalyticsDto> {
  const client = getClickHouseClient();

  const [clicks5mRes, uniqueUsers5mRes, clicksPerMinRes, recentClicksRes] = await Promise.all([
    client.query({
      query: "SELECT count() AS total FROM raw_clicks WHERE timestamp >= now() - INTERVAL 5 MINUTE",
      format: "JSONEachRow",
    }),
    client.query({
      query: "SELECT uniq(ip_hash) AS total FROM raw_clicks WHERE timestamp >= now() - INTERVAL 5 MINUTE",
      format: "JSONEachRow",
    }),
    client.query({
      query: "SELECT formatDateTime(toStartOfMinute(timestamp), '%Y-%m-%d %H:%M:%S') AS minute, count() AS clicks FROM raw_clicks WHERE timestamp >= now() - INTERVAL 5 MINUTE GROUP BY minute ORDER BY minute ASC",
      format: "JSONEachRow",
    }),
    client.query({
      query: "SELECT short_code AS shortCode, toString(timestamp) AS timestamp, country, device_type AS deviceType, ip_hash AS ipHash FROM raw_clicks WHERE timestamp >= now() - INTERVAL 5 MINUTE ORDER BY timestamp DESC LIMIT 20",
      format: "JSONEachRow",
    }),
  ]);

  const [clicks5mRows, uniqueUsers5mRows, clicksPerMinute, recentClicks] = await Promise.all([
    clicks5mRes.json<{ total: string | number }>(),
    uniqueUsers5mRes.json<{ total: string | number }>(),
    clicksPerMinRes.json<{ minute: string; clicks: string | number }>(),
    recentClicksRes.json<{ shortCode: string; timestamp: string; country: string; deviceType: string; ipHash: string }>(),
  ]);

  return {
    clicksLast5Min: Number(clicks5mRows[0]?.total ?? 0),
    uniqueUsersLast5Min: Number(uniqueUsers5mRows[0]?.total ?? 0),
    clicksPerMinute: clicksPerMinute.map((c) => ({ minute: c.minute, clicks: Number(c.clicks) })),
    recentClicks,
  };
}
