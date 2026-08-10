import { createClient } from "@/lib/supabase/client";

const RAILWAY_BACKEND = "https://url-shortner-production-4773.up.railway.app";

function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!envUrl || envUrl.includes("localhost") || envUrl.includes("vercel.app")) {
    return RAILWAY_BACKEND;
  }
  return envUrl;
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  const baseUrl = getApiBaseUrl().replace(/\/$/, "");
  const fullPath = path.startsWith("/") ? path : `/${path}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (session?.access_token) {
    headers["Authorization"] = `Bearer ${session.access_token}`;
  }

  const res = await fetch(`${baseUrl}${fullPath}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(errorData.error || `API error: ${res.status}`);
  }

  if (res.status === 204) {
    return null;
  }

  return res.json();
}