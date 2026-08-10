"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

interface UrlItem {
  shortCode: string;
  longUrl: string;
  clickCount?: number;
  clicks?: number;
  createdAt: number;
  expiresAt: number | null;
}

interface StatsDetail {
  shortCode: string;
  clickCount: number;
}

export default function StatsPage() {
  const [urls, setUrls] = useState<UrlItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStats, setSelectedStats] = useState<StatsDetail | null>(null);
  const [fetchingStats, setFetchingStats] = useState<string | null>(null);

  async function loadUrls() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch("/api/v1/urls");
      setUrls(data.urls || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load link statistics";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let ignore = false;
    async function init() {
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetch("/api/v1/urls");
        if (!ignore) {
          setUrls(data.urls || []);
        }
      } catch (err: unknown) {
        if (!ignore) {
          const msg = err instanceof Error ? err.message : "Failed to load link statistics";
          setError(msg);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    init();
    return () => {
      ignore = true;
    };
  }, []);

  async function handleInspectStats(shortCode: string) {
    setFetchingStats(shortCode);
    try {
      const data = await apiFetch(`/api/v1/urls/${shortCode}/stats`);
      setSelectedStats(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : `Failed to fetch stats for /${shortCode}`;
      setError(msg);
    } finally {
      setFetchingStats(null);
    }
  }

  const totalClicks = urls.reduce((acc, curr) => acc + (curr.clickCount ?? curr.clicks ?? 0), 0);

  return (
    <div className="flex h-screen overflow-hidden antialiased font-body-md text-body-md bg-[#131314] text-[#e5e2e3]">
      <nav className="bg-[#0e0e0f] border-r border-[#454655]/40 flex flex-col h-full fixed left-0 top-0 z-40 w-64 pt-4 pb-6 md:flex">
        <div className="px-4 mb-8 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-[#454655] flex items-center justify-center font-bold text-white bg-[#201f21]">
            R
          </div>
          <div>
            <h2 className="font-h4 text-base font-bold text-[#e5e2e3]">ROMER INFRA</h2>
            <div className="text-xs text-[#c6c5d8] font-mono opacity-70">v2.4.0-stable</div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-1 px-2">
          <Link
            className="group flex items-center gap-3 px-3 py-2 rounded text-[#c6c5d8] hover:text-[#e5e2e3] hover:bg-[#353436] transition-all"
            href="/dashboard"
          >
            <span className="material-symbols-outlined text-[18px]">terminal</span>
            <span className="text-xs uppercase tracking-widest font-semibold">My Links</span>
          </Link>

          <Link
            className="group flex items-center gap-3 px-3 py-2 rounded text-[#50d8e9] bg-[#1c1b1d] border-r-2 border-[#50d8e9]"
            href="/dashboard/stats"
          >
            <span className="material-symbols-outlined text-[18px]">analytics</span>
            <span className="text-xs uppercase tracking-widest font-semibold">Analytics & Stats</span>
          </Link>

          <Link
            className="group flex items-center gap-3 px-3 py-2 rounded text-[#c6c5d8] hover:text-[#e5e2e3] hover:bg-[#353436] transition-all"
            href="/services"
          >
            <span className="material-symbols-outlined text-[18px]">sensors</span>
            <span className="text-xs uppercase tracking-widest font-semibold">Services</span>
          </Link>

          <Link
            className="group flex items-center gap-3 px-3 py-2 rounded text-[#c6c5d8] hover:text-[#e5e2e3] hover:bg-[#353436] transition-all"
            href="/contact"
          >
            <span className="material-symbols-outlined text-[18px]">contact_support</span>
            <span className="text-xs uppercase tracking-widest font-semibold">Support</span>
          </Link>
        </div>
      </nav>

      <main className="flex-1 ml-0 md:ml-64 flex flex-col h-full overflow-y-auto bg-[#131314]">
        <div className="p-8 max-w-5xl mx-auto w-full">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[#e5e2e3]">Link Analytics & Telemetry</h1>
              <p className="text-xs text-[#c6c5d8] font-mono mt-1">Real-time click engagement across short codes</p>
            </div>
            <button
              onClick={loadUrls}
              className="bg-[#101112] border border-[#232426] hover:bg-[#191A1C] text-[#e5e2e3] text-xs font-semibold px-4 py-2 rounded flex items-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">refresh</span> Refresh Telemetry
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-[#101112] border border-[#232426] rounded-lg p-5">
              <span className="text-xs uppercase tracking-widest font-semibold text-[#c6c5d8]">Active Short Codes</span>
              <p className="text-3xl font-bold text-[#e5e2e3] mt-2 font-mono">{urls.length}</p>
            </div>
            <div className="bg-[#101112] border border-[#232426] rounded-lg p-5">
              <span className="text-xs uppercase tracking-widest font-semibold text-[#c6c5d8]">Total Click Events</span>
              <p className="text-3xl font-bold text-[#50d8e9] mt-2 font-mono">{totalClicks}</p>
            </div>
          </div>

          {error && <p className="text-red-400 text-xs font-mono mb-4">{error}</p>}

          <div className="bg-[#101112] border border-[#232426] rounded-lg overflow-hidden">
            <div className="p-4 border-b border-[#232426] flex justify-between items-center bg-[#151617]">
              <h2 className="text-sm font-semibold text-[#e5e2e3] uppercase tracking-wider">Per-URL Performance</h2>
            </div>

            {loading ? (
              <div className="p-6 text-[#c6c5d8] text-xs font-mono">Loading telemetry...</div>
            ) : urls.length === 0 ? (
              <div className="p-6 text-center text-[#c6c5d8] text-xs">No link data to show.</div>
            ) : (
              <div className="divide-y divide-[#1B1C1E]">
                {urls.map((url) => (
                  <div key={url.shortCode} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold text-[#50d8e9]">/{url.shortCode}</span>
                        <span className="text-xs bg-[#1c1b1d] text-[#c6c5d8] border border-[#232426] px-2 py-0.5 rounded font-mono">
                          {url.clickCount ?? url.clicks ?? 0} clicks
                        </span>
                      </div>
                      <p className="text-xs text-[#c6c5d8] font-mono truncate max-w-lg">{url.longUrl}</p>
                    </div>

                    <button
                      onClick={() => handleInspectStats(url.shortCode)}
                      disabled={fetchingStats === url.shortCode}
                      className="text-xs bg-[#191A1C] hover:bg-[#25272a] text-[#e5e2e3] border border-[#232426] px-3 py-1.5 rounded transition-colors disabled:opacity-50 font-mono"
                    >
                      {fetchingStats === url.shortCode ? "Inspecting..." : "Get Live Count"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedStats && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-[#101112] border border-[#232426] rounded-lg p-6 max-w-md w-full shadow-2xl space-y-4">
                <h3 className="text-lg font-bold text-[#e5e2e3]">Live Telemetry: /{selectedStats.shortCode}</h3>
                <div className="bg-[#070708] border border-[#232426] rounded p-6 text-center">
                  <span className="text-xs uppercase tracking-widest text-[#c6c5d8] font-semibold">Total Clicks Recorded</span>
                  <p className="text-5xl font-extrabold text-[#50d8e9] mt-2 font-mono">{selectedStats.clickCount}</p>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setSelectedStats(null)}
                    className="bg-white hover:bg-zinc-200 text-black text-xs font-bold px-5 py-2 rounded transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
