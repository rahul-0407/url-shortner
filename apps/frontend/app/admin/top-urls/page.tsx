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
  Search,
  CheckCircle2,
  Clock,
  MoreVertical
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
  const [searchTerm, setSearchTerm] = useState("");
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

  const filteredData = data?.data.filter(
    (item) =>
      item.shortCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.longUrl && item.longUrl.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-100 p-6 rounded-3xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              CRM & Top Performing URLs
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Ranked traffic destinations powered by ClickHouse columnar store analytics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadTopUrls}
            className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#2563EB]" />
            Refresh Table
          </button>
        </div>
      </div>

      {/* Main Table Card (MaterialM Style) */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-xs overflow-hidden">
        {/* Table Filters & Search */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search code or destination URL..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="text-slate-400">Status Filter:</span>
            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-xl">All URLs</span>
            <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-xl">Active High-Volume</span>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400 space-y-3">
            <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p>Fetching top records from ClickHouse database...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
            <p className="text-xs text-red-500 font-mono">{error}</p>
            <button
              onClick={loadTopUrls}
              className="bg-red-50 text-red-600 text-xs font-bold px-4 py-2 rounded-xl border border-red-200"
            >
              Retry
            </button>
          </div>
        ) : !filteredData || filteredData.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">
            No shortened URLs found matching your query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[11px] text-slate-400 uppercase font-bold tracking-wider">
                  <th className="py-3.5 px-4 w-12 text-center">#</th>
                  <th className="py-3.5 px-4">Short Code</th>
                  <th className="py-3.5 px-4">Destination Long URL</th>
                  <th className="py-3.5 px-4 text-right">Total Clicks</th>
                  <th className="py-3.5 px-4 text-right">Unique Users</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {filteredData.map((item, index) => {
                  const rank = offset + index + 1;
                  return (
                    <tr key={item.shortCode} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4 text-center font-bold text-slate-400">{rank}</td>
                      <td className="py-4 px-4 font-bold text-blue-600 font-mono">
                        /{item.shortCode}
                      </td>
                      <td className="py-4 px-4 text-slate-700 max-w-xs sm:max-w-md truncate">
                        {item.longUrl || <span className="text-slate-400 italic">No destination set</span>}
                      </td>
                      <td className="py-4 px-4 text-right font-black text-slate-900">
                        {item.totalClicks.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right font-black text-purple-600">
                        {item.uniqueUsers.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-block bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          Confirmed
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Link
                          href={`/admin/url/${item.shortCode}`}
                          className="inline-flex items-center gap-1 bg-slate-100 hover:bg-[#2563EB] text-slate-700 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
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

        {/* Pagination Footer */}
        {data && data.pagination.total > limit && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <div className="text-xs text-slate-500 font-medium">
              Showing <span className="text-slate-900 font-bold">{offset + 1}</span> to{" "}
              <span className="text-slate-900 font-bold">
                {Math.min(offset + limit, data.pagination.total)}
              </span>{" "}
              of <span className="text-slate-900 font-bold">{data.pagination.total}</span> entries
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={offset === 0}
                onClick={() => setOffset(Math.max(0, offset - limit))}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 disabled:opacity-30 hover:bg-slate-100 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-slate-600 font-semibold px-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={offset + limit >= data.pagination.total}
                onClick={() => setOffset(offset + limit)}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 disabled:opacity-30 hover:bg-slate-100 transition-colors"
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
