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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Activity className="w-6 h-6 text-emerald-400" />
              Real-Time Traffic Telemetry
            </h1>
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              LIVE
            </span>
          </div>
          <p className="text-xs text-[#9590a8]">
            ClickHouse real-time 5-minute sliding window stream
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-[#9590a8] font-mono">
            Updated {lastUpdated.toLocaleTimeString()}
          </span>

          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
              autoRefresh
                ? "bg-emerald-950/40 text-emerald-400 border-emerald-800/50"
                : "bg-[#1c192b] text-[#9590a8] border-[#2f2a47]"
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${autoRefresh ? "animate-pulse" : ""}`} />
            {autoRefresh ? "Auto-Refresh ON (5s)" : "Auto-Refresh OFF"}
          </button>

          <button
            onClick={() => loadRealtime(false)}
            className="bg-[#1c192b] hover:bg-[#252139] border border-[#2f2a47] text-white p-2 rounded-xl transition-colors"
            title="Refresh now"
          >
            <RefreshCw className="w-4 h-4 text-[#8e87ff]" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-[#9590a8] space-y-3">
          <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p>Connecting to ClickHouse streaming pipeline...</p>
        </div>
      ) : error ? (
        <div className="bg-[#241217] border border-[#591d28] rounded-2xl p-6 text-center space-y-3 max-w-lg mx-auto">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
          <p className="text-xs text-red-400 font-mono">{error}</p>
          <button
            onClick={() => loadRealtime(false)}
            className="bg-[#3b1820] text-white text-xs font-semibold px-4 py-2 rounded-xl border border-red-800/40"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#141221] border border-[#27233a] rounded-2xl p-5 shadow-lg flex items-center justify-between">
              <div>
                <p className="text-xs text-[#9590a8] font-medium">Clicks (Last 5 Minutes)</p>
                <p className="text-3xl font-bold text-white mt-1">{data?.clicksLast5Min.toLocaleString()}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-400/10 border border-emerald-400/20 text-emerald-400">
                <MousePointerClick className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-[#141221] border border-[#27233a] rounded-2xl p-5 shadow-lg flex items-center justify-between">
              <div>
                <p className="text-xs text-[#9590a8] font-medium">Unique Active Users (Last 5 Min)</p>
                <p className="text-3xl font-bold text-white mt-1">{data?.uniqueUsersLast5Min.toLocaleString()}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#50d8e9]/10 border border-[#50d8e9]/20 text-[#50d8e9]">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-[#141221] border border-[#27233a] rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-[#231f38] pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Minute-by-Minute Traffic Pattern</h3>
              </div>
              <span className="text-[10px] text-[#9590a8] font-mono">5-Minute Horizon</span>
            </div>

            {!data?.clicksPerMinute || data.clicksPerMinute.length === 0 ? (
              <div className="h-56 flex items-center justify-center text-xs text-[#7d7699]">
                No traffic recorded in the last 5 minutes.
              </div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.clicksPerMinute} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="realtimeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="minute" stroke="#686180" fontSize={11} tickLine={false} />
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
                    <Area
                      type="monotone"
                      dataKey="clicks"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#realtimeGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="bg-[#141221] border border-[#27233a] rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-[#231f38] pb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#50d8e9]" />
                <h3 className="text-sm font-bold text-white">Live Event Stream Log</h3>
              </div>
              <span className="text-[10px] text-[#9590a8] font-mono">Recent Kafka standard ingestion</span>
            </div>

            {!data?.recentClicks || data.recentClicks.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#7d7699]">
                Waiting for incoming click events...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-mono text-xs">
                  <thead>
                    <tr className="bg-[#100d1b] border-b border-[#27233a] text-[10px] text-[#9590a8] uppercase">
                      <th className="py-2.5 px-3">Short Code</th>
                      <th className="py-2.5 px-3">Timestamp</th>
                      <th className="py-2.5 px-3">Country</th>
                      <th className="py-2.5 px-3">Device Type</th>
                      <th className="py-2.5 px-3 text-right">IP Hash</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#231f38]">
                    {data.recentClicks.map((click, index) => (
                      <tr key={index} className="hover:bg-[#1a162b] transition-colors">
                        <td className="py-2.5 px-3 text-[#50d8e9] font-bold">/{click.shortCode}</td>
                        <td className="py-2.5 px-3 text-white">{click.timestamp}</td>
                        <td className="py-2.5 px-3 text-[#8e87ff]">{click.country}</td>
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
        </>
      )}
    </div>
  );
}
