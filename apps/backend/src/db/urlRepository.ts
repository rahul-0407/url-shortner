import { getPool, getSupabase, getDbMode } from "./client";
import type { UrlRecord } from "../types";

const COLLECTION = "urls";


export async function insertUrl(record: UrlRecord): Promise<void> {
  const mode = getDbMode();
  if (mode === "pg") {
    const pool = getPool();
    await pool.query(
      `INSERT INTO urls (short_code, long_url, user_id, created_at, expires_at, click_count)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        record.shortCode,
        record.longUrl,
        record.userId,
        record.createdAt,
        record.expiresAt,
        record.clickCount ?? 0,
      ]
    );
  } else {
    const supabase = getSupabase();
    const { error } = await supabase.from("urls").insert({
      short_code: record.shortCode,
      long_url: record.longUrl,
      user_id: record.userId,
      created_at: record.createdAt,
      expires_at: record.expiresAt,
      click_count: record.clickCount ?? 0,
    });
    if (error) throw new Error(`Supabase insert error: ${error.message}`);
  }
}

export async function findByCode(shortCode: string): Promise<UrlRecord | null> {
  const mode = getDbMode();
  if (mode === "pg") {
    const pool = getPool();
    const res = await pool.query(
      `SELECT short_code, long_url, user_id, created_at, expires_at, click_count
       FROM urls WHERE short_code = $1 LIMIT 1`,
      [shortCode]
    );
    if (res.rows.length === 0) return null;
    const row = res.rows[0];
    return {
      shortCode: row.short_code,
      longUrl: row.long_url,
      userId: row.user_id,
      createdAt: Number(row.created_at),
      expiresAt: row.expires_at ? Number(row.expires_at) : null,
      clickCount: Number(row.click_count),
    };
  } else {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("urls")
      .select("short_code, long_url, user_id, created_at, expires_at, click_count")
      .eq("short_code", shortCode)
      .maybeSingle();

    if (error || !data) return null;
    return {
      shortCode: data.short_code,
      longUrl: data.long_url,
      userId: data.user_id,
      createdAt: Number(data.created_at),
      expiresAt: data.expires_at ? Number(data.expires_at) : null,
      clickCount: Number(data.click_count),
    };
  }
}

export async function findByUser(userId: string, limit = 50, offset = 0): Promise<UrlRecord[] | null> {
  const mode = getDbMode();
  if (mode === "pg") {
    const pool = getPool();
    const res = await pool.query(
      `SELECT short_code, long_url, user_id, created_at, expires_at, click_count
       FROM urls WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return res.rows.map((row) => ({
      shortCode: row.short_code,
      longUrl: row.long_url,
      userId: row.user_id,
      createdAt: Number(row.created_at),
      expiresAt: row.expires_at ? Number(row.expires_at) : null,
      clickCount: Number(row.click_count),
    }));
  } else {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("urls")
      .select("short_code, long_url, user_id, created_at, expires_at, click_count")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error || !data) return [];
    return data.map((row: any) => ({
      shortCode: row.short_code,
      longUrl: row.long_url,
      userId: row.user_id,
      createdAt: Number(row.created_at),
      expiresAt: row.expires_at ? Number(row.expires_at) : null,
      clickCount: Number(row.click_count),
    }));
  }
}

export async function deleteByCode(shortCode: string, userId: string): Promise<boolean> {
  const mode = getDbMode();
  if (mode === "pg") {
    const pool = getPool();
    const res = await pool.query(
      `DELETE FROM urls WHERE short_code = $1 AND user_id = $2`,
      [shortCode, userId]
    );
    return (res.rowCount ?? 0) > 0;
  } else {
    const supabase = getSupabase();
    const { count, error } = await supabase
      .from("urls")
      .delete({ count: "exact" })
      .eq("short_code", shortCode)
      .eq("user_id", userId);

    if (error) return false;
    return (count ?? 0) > 0;
  }
}

export async function incrementClicks(shortCode: string, by = 1): Promise<void> {
  const mode = getDbMode();
  if (mode === "pg") {
    const pool = getPool();
    await pool.query(
      `UPDATE urls SET click_count = click_count + $1 WHERE short_code = $2`,
      [by, shortCode]
    );
  } else {
    const supabase = getSupabase();
    const { data } = await supabase
      .from("urls")
      .select("click_count")
      .eq("short_code", shortCode)
      .maybeSingle();

    if (data) {
      await supabase
        .from("urls")
        .update({ click_count: (data.click_count || 0) + by })
        .eq("short_code", shortCode);
    }
  }
}
