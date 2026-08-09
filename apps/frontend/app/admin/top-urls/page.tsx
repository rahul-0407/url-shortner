"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import {
  TrendingUp,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  BarChart3,
} from "lucide-react";

interface TopUrlItem {
  shortCode: string;
  longUrl: string | null;
  totalClicks: number;
  uniqueUsers: number;
}

interface TopUrlsResponse {
  data: TopUrlItem[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

export default function AdminTopUrlsPage() {
  const [data, setData] = useState<TopUrlsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const limit = 20;

  async function loadTopUrls() {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch(`/api/admin/analytics/top-urls?limit=${limit}&offset=${offset}`);
      setData(res);
    } catch (err: any) {
      setError(err.message || "Failed to load top URLs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTopUrls();
  }, [offset]);

  const totalPages = Math.ceil((data?.pagination.total || 0) / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-[#50d8e9]" />
            Top Performing Short URLs
          </h1>
          <p className="text-xs text-[#9590a8] mt-1">
            Highest traffic destination URLs ranked by ClickHouse event frequency
          </p>
        </div>

        <button
          onClick={loadTopUrls}
          className="bg-[#1c192b] hover:bg-[#252139] border border-[#2f2a47] text-white text-xs font-medium px-3.5 py-2 rounded-xl transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#50d8e9]" />
          Refresh Table
        </button>
      </div>

      <div className="bg-[#141221] border border-[#27233a] rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-[#9590a8] space-y-3">
            <div className="w-6 h-6 border-2 border-[#6B66DA] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p>Querying ClickHouse high-volume index...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
            <p className="text-xs text-red-400 font-mono">{error}</p>
            <button
              onClick={loadTopUrls}
              className="bg-[#2a1a24] text-red-300 text-xs font-semibold px-4 py-2 rounded-xl border border-red-900/50 hover:bg-[#3b1820] transition-colors"
            >
              Retry Load
            </button>
          </div>
        ) : !data || data.data.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#9590a8]">
            No traffic recorded for any URLs yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#100d1b] border-b border-[#27233a] text-[11px] text-[#9590a8] uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Short Code</th>
                  <th className="py-3 px-4">Destination Long URL</th>
                  <th className="py-3 px-4 text-right">Total Clicks</th>
                  <th className="py-3 px-4 text-right">Unique Users</th>
                  <th className="py-3 px-4 text-center">Analytics</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#231f38] text-xs">
                {data.data.map((item, index) => {
                  const rank = offset + index + 1;
                  return (
                    <tr
                      key={item.shortCode}
                      className="hover:bg-[#1a162b] transition-colors group font-mono"
                    >
                      <td className="py-3.5 px-4 text-center font-bold text-[#7d7699]">
                        {rank}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#50d8e9]">
                        /{item.shortCode}
                      </td>
                      <td className="py-3.5 px-4 text-[#c6c5d8] max-w-xs sm:max-w-md truncate font-sans">
                        {item.longUrl || <span className="text-[#686180] italic">Not available</span>}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-white">
                        {item.totalClicks.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-[#8e87ff]">
                        {item.uniqueUsers.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Link
                          href={`/admin/url/${item.shortCode}`}
                          className="inline-flex items-center gap-1.5 bg-[#1c192b] hover:bg-[#6B66DA] text-[#c6c5d8] hover:text-white px-3 py-1.5 rounded-lg text-xs font-sans font-medium transition-all border border-[#2f2a47]"
                        >
                          <BarChart3 className="w-3.5 h-3.5" />
                          <span>View Stats</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {data && data.pagination.total > limit && (
          <div className="p-4 border-t border-[#231f38] bg-[#100d1b] flex items-center justify-between">
            <div className="text-xs text-[#9590a8]">
              Showing <span className="text-white font-semibold">{offset + 1}</span> to{" "}
              <span className="text-white font-semibold">
                {Math.min(offset + limit, data.pagination.total)}
              </span>{" "}
              of <span className="text-white font-semibold">{data.pagination.total}</span> top URLs
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={offset === 0}
                onClick={() => setOffset(Math.max(0, offset - limit))}
                className="p-2 rounded-xl bg-[#1c192b] border border-[#2f2a47] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#252139] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-[#9590a8] font-mono px-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={offset + limit >= data.pagination.total}
                onClick={() => setOffset(offset + limit)}
                className="p-2 rounded-xl bg-[#1c192b] border border-[#2f2a47] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#252139] transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
