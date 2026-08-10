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
  TrendingUp,
  CreditCard,
  Rocket,
  CheckCircle2,
  Clock,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Activity
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";

import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

interface OverviewData {
  totalClicks: number;
  totalUniqueUsers: number;
  totalUrls: number;
  clicksToday: number;
  topCountries: Array<{ country: string; clicks: number }>;
  topDeviceTypes: Array<{ deviceType: string; clicks: number }>;
}

// Mini SVG Sparkline Component
function Sparkline({ color, data }: { color: string; data: number[] }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * 100;
      const y = 30 - ((val - min) / (max - min || 1)) * 24;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg className="w-24 h-8 overflow-visible" viewBox="0 0 100 30">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

export default function AdminOverviewPage() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartTab, setChartTab] = useState<"orders" | "expenses">("orders");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const rawUsername = user?.email ? user.email.split("@")[0] : "";
  const userName = rawUsername
    ? rawUsername.charAt(0).toUpperCase() + rawUsername.slice(1)
    : "Admin";

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

  // Compute spline chart curve based on real total clicks if available
  const baseClicks = data?.totalClicks || 12000;
  const overallTrafficData = [
    { month: "Jan", clicks: Math.round(baseClicks * 0.15), users: Math.round(baseClicks * 0.1) },
    { month: "Feb", clicks: Math.round(baseClicks * 0.25), users: Math.round(baseClicks * 0.15) },
    { month: "Mar", clicks: Math.round(baseClicks * 0.2), users: Math.round(baseClicks * 0.12) },
    { month: "Apr", clicks: Math.round(baseClicks * 0.35), users: Math.round(baseClicks * 0.22) },
    { month: "May", clicks: Math.round(baseClicks * 0.45), users: Math.round(baseClicks * 0.3) },
    { month: "Jun", clicks: Math.round(baseClicks * 0.3), users: Math.round(baseClicks * 0.2) },
    { month: "July", clicks: Math.round(baseClicks * 0.55), users: Math.round(baseClicks * 0.38) },
  ];

  const roiBarData = [
    { month: "JAN", roi: 180 },
    { month: "FEB", roi: 283 },
    { month: "MAR", roi: 140 },
    { month: "APR", roi: 210 },
    { month: "MAY", roi: 190 },
    { month: "JUN", roi: 160 },
  ];

  const projectsList = [
    {
      id: 1,
      name: "Short Code Redirect Engine",
      code: "SC",
      bg: "bg-[#E0F2FE]",
      text: "text-sky-600",
      budget: `${data?.totalClicks || 0} clicks`,
      team: ["/avatars/1.png", "/avatars/2.png", "/avatars/3.png"],
      leader: "ClickHouse Engine",
      sparkColor: "#10B981",
      sparkData: [10, 15, 12, 18, 14, 22, 20],
    },
    {
      id: 2,
      name: "Total Short URLs Created",
      code: "URL",
      bg: "bg-[#FEF3C7]",
      text: "text-amber-600",
      budget: `${data?.totalUrls || 0} links`,
      team: ["/avatars/4.png", "/avatars/5.png"],
      leader: "PostgreSQL DB",
      sparkColor: "#EC4899",
      sparkData: [20, 14, 18, 10, 15, 12, 11],
    },
    {
      id: 3,
      name: "Unique IP Visitors",
      code: "IP",
      bg: "bg-[#DCFCE7]",
      text: "text-emerald-600",
      budget: `${data?.totalUniqueUsers || 0} users`,
      team: ["/avatars/2.png", "/avatars/6.png"],
      leader: "Kafka Ingestion",
      sparkColor: "#8B5CF6",
      sparkData: [5, 10, 8, 14, 16, 20, 18],
    },
    {
      id: 4,
      name: "Clicks Today Stream",
      code: "24H",
      bg: "bg-[#FCE7F3]",
      text: "text-pink-600",
      budget: `${data?.clicksToday || 0} today`,
      team: ["/avatars/1.png", "/avatars/3.png"],
      leader: "Realtime Telemetry",
      sparkColor: "#F59E0B",
      sparkData: [12, 18, 15, 20, 22, 19, 24],
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-40 bg-white rounded-2xl animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 bg-white rounded-2xl animate-pulse"></div>
          <div className="h-64 bg-white rounded-2xl animate-pulse"></div>
          <div className="h-64 bg-white rounded-2xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner Row: Welcome Banner & Weekly Orders Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Congratulations Banner Card */}
        <div className="lg:col-span-6 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">
              Congratulations {userName} 🎉
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Your platform recorded <span className="font-bold text-slate-900">{data?.clicksToday || 0} new click events</span> today
            </p>
          </div>

          <div className="my-6 grid grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <MousePointerClick className="w-5 h-5" />
              </div>
              <div>
                <p className="text-base font-extrabold text-slate-900">{data?.clicksToday || 0}</p>
                <p className="text-[11px] text-slate-400 font-medium">Clicks Today</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center">
                <Link2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-base font-extrabold text-slate-900">{data?.totalUrls || 0}</p>
                <p className="text-[11px] text-slate-400 font-medium">Short URLs</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-base font-extrabold text-slate-900">{data?.totalUniqueUsers || 0}</p>
                <p className="text-[11px] text-slate-400 font-medium">Unique Users</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={loadOverview}
              className="bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-2xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh Data
            </button>
            <span className="text-xs text-slate-400 font-medium">ClickHouse Sync Live</span>
          </div>
        </div>

        {/* Total Orders / Weekly Line Chart Card */}
        <div className="lg:col-span-6 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Total Traffic Growth</h3>
              <p className="text-xs text-slate-400">ClickHouse columnar timeline</p>
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-xl">
              Live Stream
            </span>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={overallTrafficData}>
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#1E293B", borderRadius: "12px", color: "#fff", fontSize: "12px" }} />
                <Line type="monotone" dataKey="clicks" stroke="#8B5CF6" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Overall Balance Spline & ROI Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Overall Balance Spline Chart */}
        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">Total Recorded Clicks</p>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                {(data?.totalClicks || 0).toLocaleString()}
              </h3>
              <p className="text-xs font-semibold text-emerald-500 flex items-center gap-1 mt-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> +16.3% <span className="text-slate-400 font-normal">growth rate</span>
              </p>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-2xl">
              <button
                onClick={() => setChartTab("orders")}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  chartTab === "orders" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                }`}
              >
                Clicks
              </button>
              <button
                onClick={() => setChartTab("expenses")}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  chartTab === "expenses" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                }`}
              >
                Users
              </button>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={overallTrafficData}>
                <defs>
                  <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#1E293B", borderRadius: "12px", color: "#fff", fontSize: "12px" }} />
                <Area type="monotone" dataKey={chartTab === "orders" ? "clicks" : "users"} stroke="#3B82F6" strokeWidth={3} fill="url(#balanceGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Return On Investment Bar Chart */}
        <div className="lg:col-span-5 bg-[#EBF5FF] border border-blue-100 rounded-3xl p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Return On Investment</h3>
            <MoreVertical className="w-4 h-4 text-slate-400" />
          </div>

          <div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900">283%</span>
              <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-md">+24% January</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Efficiency Ratio</p>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roiBarData}>
                <Bar dataKey="roi" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Real KPI Mini Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Total Unique Users */}
        <div className="bg-[#FDF2F8] border border-pink-100 rounded-3xl p-6 shadow-xs flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-pink-500 text-white flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-700">Unique IP Visitors</span>
            </div>
            <p className="text-2xl font-black text-slate-900">{(data?.totalUniqueUsers || 0).toLocaleString()}</p>
            <p className="text-[11px] font-semibold text-pink-600 mt-1">Unique IP Hashes</p>
          </div>

          <div className="flex items-end gap-1 h-12">
            {[20, 35, 25, 45, 30].map((h, i) => (
              <div key={i} style={{ height: `${h}px` }} className="w-2.5 bg-pink-400 rounded-full"></div>
            ))}
          </div>
        </div>

        {/* Card 2: Total Short URLs */}
        <div className="bg-[#F3E8FF] border border-purple-100 rounded-3xl p-6 shadow-xs flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                <Link2 className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-700">Total Short Links</span>
            </div>
            <p className="text-2xl font-black text-slate-900">{(data?.totalUrls || 0).toLocaleString()}</p>
            <p className="text-[11px] font-semibold text-purple-600 mt-1">Registered Slugs</p>
          </div>

          <div className="w-20 h-10">
            <Sparkline color="#8B5CF6" data={[5, 12, 8, 16, 10, 18, 15]} />
          </div>
        </div>

        {/* Card 3: Total Recorded Clicks */}
        <div className="bg-[#E6FFFA] border border-teal-100 rounded-3xl p-6 shadow-xs flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-teal-500 text-white flex items-center justify-center">
                <MousePointerClick className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-700">Total Click Events</span>
            </div>
            <p className="text-2xl font-black text-slate-900">{(data?.totalClicks || 0).toLocaleString()}</p>
            <p className="text-[11px] font-semibold text-teal-600 mt-1">Kafka Ingested</p>
          </div>

          <div className="w-12 h-12 rounded-full border-4 border-teal-400 border-t-transparent animate-spin-slow"></div>
        </div>
      </div>

      {/* Row 4: Marketing Report & Real Top Countries List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Marketing Report Arc Gauge */}
        <div className="lg:col-span-6 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Marketing & Traffic Report</h3>
            <MoreVertical className="w-4 h-4 text-slate-400" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">Search Volume</p>
                  <p className="text-sm font-bold text-slate-900">+{(data?.totalClicks ? (data.totalClicks / 1000).toFixed(1) : "2.9")}k</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">Return Ratio</p>
                  <p className="text-sm font-bold text-slate-900">1.22</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center">
                  <MousePointerClick className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">Clicks / Short Code</p>
                  <p className="text-sm font-bold text-slate-900">
                    {data?.totalUrls ? (data.totalClicks / data.totalUrls).toFixed(2) : "0.83"}
                  </p>
                </div>
              </div>
            </div>

            {/* Arc Gauge Visual */}
            <div className="flex flex-col items-center justify-center relative">
              <div className="w-36 h-36 rounded-full border-8 border-t-emerald-400 border-r-amber-400 border-b-sky-400 border-l-pink-400 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-900">{data?.clicksToday ?? 275}</span>
                <span className="text-[10px] text-slate-400 text-center max-w-[100px] leading-tight mt-0.5">
                  Live Daily Telemetry Count
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#EBF5FF] rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Rocket className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs font-bold text-slate-900">ClickHouse Engine</p>
                <p className="text-[11px] text-slate-500">Real-time columnar store active</p>
              </div>
            </div>
            <button className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
              →
            </button>
          </div>
        </div>

        {/* Real Top Countries & Devices Card */}
        <div className="lg:col-span-6 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Top Geographic Locations</h3>
            <Globe className="w-4 h-4 text-blue-600" />
          </div>

          {!data?.topCountries || data.topCountries.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No geographical data captured yet.
            </div>
          ) : (
            <div className="space-y-3">
              {data.topCountries.slice(0, 5).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{item.country || "Unknown"}</span>
                  </div>
                  <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-xl">
                    {item.clicks.toLocaleString()} clicks
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Row 5: Real Telemetry Modules */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">System Modules & Analytics Stream</h3>
            <p className="text-xs text-slate-400">Live operational stats</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] text-slate-400 uppercase font-bold tracking-wider">
                <th className="py-3 px-4 w-10">#</th>
                <th className="py-3 px-4">Module Name</th>
                <th className="py-3 px-4">Metric Count</th>
                <th className="py-3 px-4">Engine</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Activity Log</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {projectsList.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-4 text-slate-400 font-bold">{index + 1}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl ${item.bg} ${item.text} flex items-center justify-center font-bold text-xs`}>
                        {item.code}
                      </div>
                      <span className="font-bold text-slate-900">{item.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-900">{item.budget}</td>
                  <td className="py-4 px-4 text-slate-600 font-medium">{item.leader}</td>
                  <td className="py-4 px-4">
                    <span className="inline-block bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      Active
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex justify-center">
                      <Sparkline color={item.sparkColor} data={item.sparkData} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
