"use client";

import { useState } from "react";
import {
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Package,
  Users,
  ArrowUpRight,
  MoreVertical,
  Star,
  CheckCircle2,
  Clock,
  Filter
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function EcommerceDemoPage() {
  const salesData = [
    { month: "Jan", sales: 4000, profit: 2400 },
    { month: "Feb", sales: 6500, profit: 3800 },
    { month: "Mar", sales: 5100, profit: 3000 },
    { month: "Apr", sales: 8900, profit: 5400 },
    { month: "May", sales: 11200, profit: 7100 },
    { month: "Jun", sales: 9800, profit: 6200 },
    { month: "Jul", sales: 14500, profit: 9300 },
  ];

  const recentOrders = [
    { id: "ORD-9482", customer: "Alice Smith", product: "Pro Shortener Tier", price: "$49.00", status: "Delivered", date: "Today, 14:20" },
    { id: "ORD-9481", customer: "Bob Jones", product: "Enterprise API Key", price: "$299.00", status: "Processing", date: "Today, 11:45" },
    { id: "ORD-9480", customer: "Charlie Brown", product: "Custom Domain Addon", price: "$19.00", status: "Delivered", date: "Yesterday" },
    { id: "ORD-9479", customer: "Diana Prince", product: "Pro Shortener Tier", price: "$49.00", status: "Delivered", date: "Yesterday" },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-8 shadow-lg shadow-blue-500/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            MaterialM eCommerce Suite
          </span>
          <h1 className="text-3xl font-black tracking-tight mt-2">eCommerce Overview</h1>
          <p className="text-blue-100 text-sm mt-1">
            Real-time trackings for subscription plans, API credits, and custom domain sales.
          </p>
        </div>

        <button className="bg-white text-blue-600 hover:bg-blue-50 font-bold text-xs px-6 py-3 rounded-2xl shadow-md transition-all">
          Generate Financial Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Total Revenue</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">$48,290</h3>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% this month
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Orders Processed</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">1,482</h3>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +8.7% growth
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Active Subscriptions</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">892</h3>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +22.4% ARR
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Avg Order Value</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">$64.50</h3>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +3.1% overall
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Sales Growth Chart */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Revenue & Profit Growth</h3>
            <p className="text-xs text-slate-400">Monthly breakdown for 2026</p>
          </div>
          <MoreVertical className="w-4 h-4 text-slate-400" />
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#1E293B", borderRadius: "12px", color: "#fff" }} />
              <Area type="monotone" dataKey="sales" stroke="#2563EB" strokeWidth={3} fill="url(#salesGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Recent Customer Orders</h3>
          <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl hover:bg-slate-200">
            <Filter className="w-3.5 h-3.5" /> Filter Orders
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] text-slate-400 uppercase font-bold tracking-wider">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Product / Plan</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4 font-bold text-blue-600">{ord.id}</td>
                  <td className="py-4 px-4 font-bold text-slate-900">{ord.customer}</td>
                  <td className="py-4 px-4">{ord.product}</td>
                  <td className="py-4 px-4 font-bold text-slate-900">{ord.price}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      ord.status === "Delivered" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-400">{ord.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
