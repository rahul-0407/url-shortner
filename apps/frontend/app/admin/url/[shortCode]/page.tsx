"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import {
  ArrowLeft,
  MousePointerClick,
  Users,
  Globe,
  Smartphone,
  History,
  Calendar,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface UrlAnalyticsData {
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

const COLORS = ["#6B66DA", "#50d8e9", "#f59e0b", "#10b981", "#ec4899", "#8b5cf6"];

export default function AdminSingleUrlAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const shortCode = String(params.shortCode || "");

  const [data, setData] = useState<UrlAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function loadAnalytics() {
    if (!shortCode) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch(`/api/admin/analytics/url/${shortCode}`);
      setData(res);
    } catch (err: any) {
      setError(err.message || "Failed to load URL analytics");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnalytics();
  }, [shortCode]);

  function handleCopy() {
    const fullUrl = `http://localhost:4000/${shortCode}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-[#1a162b] animate-pulse rounded-lg"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-28 bg-[#141221] border border-[#27233a] rounded-2xl animate-pulse"></div>
          <div className="h-28 bg-[#141221] border border-[#27233a] rounded-2xl animate-pulse"></div>
        </div>
        <div className="h-72 bg-[#141221] border border-[#27233a] rounded-2xl animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#241217] border border-[#591d28] rounded-2xl p-6 text-center space-y-4 max-w-lg mx-auto my-12">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
        <div>
          <h3 className="text-lg font-bold text-white">Error fetching analytics for /{shortCode}</h3>
          <p className="text-xs text-[#ff8093] mt-1">{error}</p>
        </div>
        <div className="flex gap-3 justify-center pt-2">
          <button
            onClick={loadAnalytics}
            className="bg-[#3b1820] hover:bg-[#4d1f2a] text-white text-xs font-semibold py-2 px-4 rounded-xl border border-red-800/40 transition-colors inline-flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
          <Link
            href="/admin/top-urls"
            className="bg-[#1c192b] text-xs font-semibold py-2 px-4 rounded-xl border border-[#2f2a47] text-white"
          >
            Back to Top URLs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#231f38] pb-5">
        <div>
          <Link
            href="/admin/top-urls"
            className="inline-flex items-center gap-1.5 text-xs text-[#8e87ff] hover:text-[#b4afff] transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Top URLs
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <span className="text-[#50d8e9] font-mono">/{shortCode}</span>
            <span className="text-xs bg-[#6B66DA]/20 text-[#8e87ff] border border-[#6B66DA]/30 px-2.5 py-1 rounded-full font-sans font-medium">
              ClickHouse Deep Telemetry
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="bg-[#1c192b] hover:bg-[#252139] border border-[#2f2a47] text-white text-xs font-medium px-3.5 py-2 rounded-xl transition-colors flex items-center gap-2"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#50d8e9]" />}
            {copied ? "Copied" : "Copy Short URL"}
          </button>

          <a
            href={`http://localhost:4000/${shortCode}`}
            target="_blank"
            rel="noreferrer"
            className="bg-[#6B66DA] hover:bg-[#5954c7] text-white text-xs font-medium px-3.5 py-2 rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-[#6B66DA]/20"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Test Link
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#141221] border border-[#27233a] rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs text-[#9590a8] font-medium">Total Clicks Recorded</p>
            <p className="text-3xl font-bold text-white mt-1">{data?.totalClicks.toLocaleString()}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#50d8e9]/10 border border-[#50d8e9]/20 text-[#50d8e9]">
            <MousePointerClick className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#141221] border border-[#27233a] rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs text-[#9590a8] font-medium">Unique User Visitors</p>
            <p className="text-3xl font-bold text-white mt-1">{data?.uniqueUsers.toLocaleString()}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#6B66DA]/10 border border-[#6B66DA]/20 text-[#6B66DA]">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="bg-[#141221] border border-[#27233a] rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-[#231f38] pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#8e87ff]" />
            <h3 className="text-sm font-bold text-white">Daily Traffic Trend (Last 30 Days)</h3>
          </div>
          <span className="text-[10px] text-[#9590a8] font-mono">Aggregated Daily Clicks</span>
        </div>

        {!data?.clicksPerDay || data.clicksPerDay.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-xs text-[#7d7699]">
            No daily traffic data available for the last 30 days.
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.clicksPerDay} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="clickGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6B66DA" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6B66DA" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#686180" fontSize={11} tickLine={false} />
                <YAxis stroke="#686180" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1c192b",
                    borderColor: "#322d4a",
                    borderRadius: "12px",
                    fontSize: "12px",
                    color: "#fff",
                  }}
                />
                <Area type="monotone" dataKey="clicks" stroke="#6B66DA" strokeWidth={2.5} fillOpacity={1} fill="url(#clickGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#141221] border border-[#27233a] rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-2 border-b border-[#231f38] pb-3">
            <Globe className="w-4 h-4 text-[#50d8e9]" />
            <h3 className="text-sm font-bold text-white">Geographic Breakdown</h3>
          </div>

          {!data?.countryBreakdown || data.countryBreakdown.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-xs text-[#7d7699]">
              No country data recorded.
            </div>
          ) : (
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.countryBreakdown}
                    dataKey="clicks"
                    nameKey="country"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry: any) => `${entry.country || entry.name} (${((entry.percent || 0) * 100).toFixed(0)}%)`}
                  >
                    {data.countryBreakdown.map((_, idx) => (
                      <Cell key={`country-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1c192b",
                      borderColor: "#322d4a",
                      borderRadius: "12px",
                      fontSize: "12px",
                      color: "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-[#141221] border border-[#27233a] rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-2 border-b border-[#231f38] pb-3">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Device Type Breakdown</h3>
          </div>

          {!data?.deviceBreakdown || data.deviceBreakdown.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-xs text-[#7d7699]">
              No device type data recorded.
            </div>
          ) : (
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.deviceBreakdown}
                    dataKey="clicks"
                    nameKey="deviceType"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry: any) => `${entry.deviceType || entry.name} (${((entry.percent || 0) * 100).toFixed(0)}%)`}
                  >
                    {data.deviceBreakdown.map((_, idx) => (
                      <Cell key={`device-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1c192b",
                      borderColor: "#322d4a",
                      borderRadius: "12px",
                      fontSize: "12px",
                      color: "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#141221] border border-[#27233a] rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-[#231f38] pb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Recent Raw Click Log</h3>
          </div>
          <span className="text-[10px] text-[#9590a8] font-mono">Last 20 Click Events</span>
        </div>

        {!data?.recentClicks || data.recentClicks.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#7d7699]">
            No recent click logs found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="bg-[#100d1b] border-b border-[#27233a] text-[10px] text-[#9590a8] uppercase">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Country</th>
                  <th className="py-2.5 px-3">Device Type</th>
                  <th className="py-2.5 px-3 text-right">Anonymized IP Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#231f38]">
                {data.recentClicks.map((click, i) => (
                  <tr key={i} className="hover:bg-[#1a162b] transition-colors">
                    <td className="py-2.5 px-3 text-white">{click.timestamp}</td>
                    <td className="py-2.5 px-3 text-[#50d8e9]">{click.country}</td>
                    <td className="py-2.5 px-3 text-emerald-400 capitalize">{click.deviceType}</td>
                    <td className="py-2.5 px-3 text-right text-[#7d7699] truncate max-w-xs">
                      {click.ipHash ? `${click.ipHash.slice(0, 16)}...` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
