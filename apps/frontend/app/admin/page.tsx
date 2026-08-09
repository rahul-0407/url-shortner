"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import {
  MousePointerClick,
  Users,
  Link2,
  Calendar,
  Globe,
  Smartphone,
  RefreshCw,
  AlertCircle,
  BarChart2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface OverviewData {
  totalClicks: number;
  totalUniqueUsers: number;
  totalUrls: number;
  clicksToday: number;
  topCountries: Array<{ country: string; clicks: number }>;
  topDeviceTypes: Array<{ deviceType: string; clicks: number }>;
}

const COLORS = ["#6B66DA", "#50d8e9", "#f59e0b", "#10b981", "#ec4899", "#8b5cf6"];

export default function AdminOverviewPage() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadOverview() {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch("/api/admin/analytics/overview");
      setData(res);
    } catch (err: any) {
      setError(err.message || "Failed to load admin analytics overview");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOverview();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-[#1a162b] animate-pulse rounded-lg"></div>
          <div className="h-8 w-28 bg-[#1a162b] animate-pulse rounded-lg"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-[#141221] border border-[#27233a] rounded-2xl animate-pulse"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-72 bg-[#141221] border border-[#27233a] rounded-2xl animate-pulse"></div>
          <div className="h-72 bg-[#141221] border border-[#27233a] rounded-2xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#241217] border border-[#591d28] rounded-2xl p-6 text-center space-y-4 max-w-lg mx-auto my-12">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
        <div>
          <h3 className="text-lg font-bold text-white">Failed to load overview analytics</h3>
          <p className="text-xs text-[#ff8093] mt-1">{error}</p>
        </div>
        <button
          onClick={loadOverview}
          className="bg-[#3b1820] hover:bg-[#4d1f2a] text-white text-xs font-semibold py-2 px-4 rounded-xl border border-red-800/40 transition-colors inline-flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry
        </button>
      </div>
    );
  }

  const kpis = [
    {
      label: "Total Clicks",
      value: data?.totalClicks.toLocaleString() ?? "0",
      icon: MousePointerClick,
      color: "text-[#50d8e9]",
      bg: "bg-[#50d8e9]/10",
      border: "border-[#50d8e9]/20",
    },
    {
      label: "Unique Users",
      value: data?.totalUniqueUsers.toLocaleString() ?? "0",
      icon: Users,
      color: "text-[#6B66DA]",
      bg: "bg-[#6B66DA]/10",
      border: "border-[#6B66DA]/20",
    },
    {
      label: "Total URLs",
      value: data?.totalUrls.toLocaleString() ?? "0",
      icon: Link2,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      border: "border-amber-400/20",
    },
    {
      label: "Clicks Today",
      value: data?.clicksToday.toLocaleString() ?? "0",
      icon: Calendar,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      border: "border-emerald-400/20",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-[#6B66DA]" />
            System Analytics Overview
          </h1>
          <p className="text-xs text-[#9590a8] mt-1">
            Real-time aggregate telemetry powered by ClickHouse columnar store
          </p>
        </div>
        <button
          onClick={loadOverview}
          className="bg-[#1c192b] hover:bg-[#252139] border border-[#2f2a47] text-white text-xs font-medium px-3.5 py-2 rounded-xl transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#8e87ff]" />
          Refresh Metrics
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className={`bg-[#141221] border border-[#27233a] rounded-2xl p-5 shadow-lg flex items-center justify-between relative overflow-hidden`}
            >
              <div>
                <p className="text-xs text-[#9590a8] font-medium">{kpi.label}</p>
                <p className="text-2xl font-bold text-white mt-1 tracking-tight">{kpi.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${kpi.bg} border ${kpi.border} ${kpi.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#141221] border border-[#27233a] rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-[#231f38] pb-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#50d8e9]" />
              <h3 className="text-sm font-bold text-white">Top Geographic Locations</h3>
            </div>
            <span className="text-[10px] text-[#9590a8] font-mono">By Click Volume</span>
          </div>

          {!data?.topCountries || data.topCountries.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-xs text-[#7d7699]">
              No country telemetry data recorded yet.
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.topCountries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="country" stroke="#686180" fontSize={11} tickLine={false} />
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
                  <Bar dataKey="clicks" fill="#6B66DA" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-[#141221] border border-[#27233a] rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-[#231f38] pb-3">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Device Type Distribution</h3>
            </div>
            <span className="text-[10px] text-[#9590a8] font-mono">User Agent Specs</span>
          </div>

          {!data?.topDeviceTypes || data.topDeviceTypes.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-xs text-[#7d7699]">
              No device type data recorded yet.
            </div>
          ) : (
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.topDeviceTypes}
                    dataKey="clicks"
                    nameKey="deviceType"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry: any) =>
                      `${entry.deviceType || entry.name} (${((entry.percent || 0) * 100).toFixed(0)}%)`
                    }
                  >
                    {data.topDeviceTypes.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
    </div>
  );
}
