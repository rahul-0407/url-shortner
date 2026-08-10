"use client";

import { useState } from "react";
import {
  Layers,
  Sparkles,
  Globe,
  Layout,
  ExternalLink,
  Smartphone,
  Eye,
  Zap,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function LandingpageDemoPage() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-3xl p-8 shadow-lg shadow-purple-500/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            MaterialM Landing Showcase
          </span>
          <h1 className="text-3xl font-black tracking-tight mt-2">Public Landing Page Studio</h1>
          <p className="text-purple-100 text-sm mt-1">
            Preview, customize, and configure public marketing pages for your shortener service.
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          className="bg-white text-purple-600 hover:bg-purple-50 font-bold text-xs px-6 py-3 rounded-2xl shadow-md transition-all flex items-center gap-2"
        >
          <ExternalLink className="w-4 h-4" /> Live Site Preview
        </Link>
      </div>

      {/* Feature Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Layout className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Hero Section Layout</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            High-converting CTA headline, dynamic link shortening input console, and floating micro-animations.
          </p>
          <span className="inline-block text-xs font-bold text-blue-600">Active Blueprint</span>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Real-time Telemetry Card</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Live analytics preview displaying click speed, country flags, and instant QR code generators.
          </p>
          <span className="inline-block text-xs font-bold text-pink-600">Active Blueprint</span>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Global Edge CDN</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Sub-millisecond redirect routing backed by Kafka stream processing and ClickHouse columnar DB.
          </p>
          <span className="inline-block text-xs font-bold text-emerald-600">Active Blueprint</span>
        </div>
      </div>

      {/* Interactive Visual Studio Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xs text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Landing Page Theme Customizer</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Manage brand colors, typography, hero banners, and SEO metadata directly from the MaterialM admin console.
        </p>

        <div className="pt-4 flex justify-center gap-4">
          <Link
            href="/"
            className="bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold px-6 py-3 rounded-2xl shadow-md transition-all flex items-center gap-2"
          >
            Visit Landingpage <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
