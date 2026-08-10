"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import {
  Activity,
  MousePointerClick,
  Users,
  Radio,
  RefreshCw,
  AlertCircle,
  Clock,
  Globe,
  Smartphone
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RealtimeData {
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

export default function AdminRealtimePage() {
  const [data, setData] = useState<RealtimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  async function loadRealtime(silent = false) {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const res = await apiFetch("/api/admin/analytics/realtime");
      setData(res);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err.message || "Failed to load realtime analytics");
    } finally {
      if (!silent) setLoading(false);
    }
  }

  useEffect(() => {
    loadRealtime();

    let interval: NodeJS.Timeout | null = null;
    if (autoRefresh) {
      interval = setInterval(() => {
        loadRealtime(true);
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  return (
    <div className="space-y-6">
      {/* Realtime Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-100 p-6 rounded-3xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Real-Time Telemetry Stream
            </h1>
            <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-3 py-0.5 rounded-full text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              LIVE
            </span>
          </div>
          <p className="text-xs text-slate-500">
            ClickHouse real-time 5-minute sliding window event ingestion
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-mono">
            Updated {lastUpdated.toLocaleTimeString()}
          </span>

          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold border transition-all flex items-center gap-2 ${
              autoRefresh
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-slate-50 text-slate-600 border-slate-200"
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${autoRefresh ? "animate-pulse" : ""}`} />
            {autoRefresh ? "Auto-Refresh ON (5s)" : "Auto-Refresh OFF"}
          </button>

          <button
            onClick={() => loadRealtime(false)}
            className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 p-2.5 rounded-2xl transition-colors"
            title="Refresh now"
          >
            <RefreshCw className="w-4 h-4 text-blue-600" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400 space-y-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p>Connecting to ClickHouse streaming pipeline...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-3xl p-6 text-center space-y-3 max-w-lg mx-auto">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <p className="text-xs text-red-600 font-mono">{error}</p>
          <button
            onClick={() => loadRealtime(false)}
            className="bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">Clicks (Last 5 Minutes)</p>
                <p className="text-3xl font-black text-slate-900 mt-1">
                  {data?.clicksLast5Min.toLocaleString()}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600">
                <MousePointerClick className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">Unique Active Users (Last 5 Min)</p>
                <p className="text-3xl font-black text-slate-900 mt-1">
                  {data?.uniqueUsersLast5Min.toLocaleString()}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-sky-50 text-sky-600">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Sliding Window Chart */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Minute-by-Minute Traffic Pattern</h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">5-Minute Horizon</span>
            </div>

            {(() => {
              // Ensure we always have 5 discrete minute points for a smooth area chart instead of a single dot
              const now = new Date();
              const chartData: Array<{ minute: string; clicks: number }> = [];

              for (let i = 4; i >= 0; i--) {
                const d = new Date(now.getTime() - i * 60 * 1000);
                const timeLabel = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                // Match against ClickHouse minute timestamp
                const match = data?.clicksPerMinute?.find((item) => {
                  const itemDate = new Date(item.minute.includes("T") ? item.minute : item.minute.replace(" ", "T"));
                  return !isNaN(itemDate.getTime()) && itemDate.getMinutes() === d.getMinutes();
                });

                chartData.push({
                  minute: timeLabel,
                  clicks: match ? match.clicks : (i === 0 && data?.clicksLast5Min ? data.clicksLast5Min : 0),
                });
              }

              return (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="realtimeGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="minute" stroke="#94A3B8" fontSize={11} tickLine={false} />
                      <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1E293B",
                          borderRadius: "12px",
                          fontSize: "12px",
                          color: "#fff",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="clicks"
                        stroke="#10B981"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#realtimeGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              );
            })()}
          </div>

          {/* Event Stream Table Log */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Live Ingested Event Log</h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Kafka + ClickHouse Engine</span>
            </div>

            {!data?.recentClicks || data.recentClicks.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                Listening for incoming event telemetry stream...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-mono text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-400 uppercase font-bold">
                      <th className="py-3 px-4">Short Code</th>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Country</th>
                      <th className="py-3 px-4">Device Type</th>
                      <th className="py-3 px-4 text-right">IP Hash</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.recentClicks.map((click, index) => (
                      <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 text-blue-600 font-bold">/{click.shortCode}</td>
                        <td className="py-3 px-4 text-slate-900 font-sans">{click.timestamp}</td>
                        <td className="py-3 px-4 text-purple-600">{click.country}</td>
                        <td className="py-3 px-4 text-emerald-600 font-sans capitalize">{click.deviceType}</td>
                        <td className="py-3 px-4 text-right text-slate-400 truncate max-w-xs">
                          {click.ipHash ? `${click.ipHash.slice(0, 16)}...` : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
