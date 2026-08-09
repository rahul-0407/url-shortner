"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <main className="min-h-screen bg-[#090712] text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#141221] border border-[#27233a] rounded-2xl p-8 text-center shadow-2xl space-y-6">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">403 - Access Denied</h1>
          <p className="text-sm text-[#9590a8] leading-relaxed">
            You do not have administrator permissions to access the ClickHouse Analytics console. Only users with the <code className="text-[#8e87ff]">admin</code> role can view system-wide analytics.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="w-full bg-[#6B66DA] hover:bg-[#5954c7] text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-colors shadow-lg shadow-[#6B66DA]/20 inline-block"
          >
            Back to User Dashboard
          </Link>
          <Link
            href="/"
            className="w-full bg-[#1c192b] hover:bg-[#252139] border border-[#2f2a47] text-[#c6c5d8] font-medium py-2.5 px-4 rounded-xl text-sm transition-colors inline-block"
          >
            Home Page
          </Link>
        </div>
      </div>
    </main>
  );
}
