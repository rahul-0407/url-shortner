"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { isAdminUser } from "@/lib/auth";
import ForbiddenPage from "../403/page";
import {
  LayoutDashboard,
  TrendingUp,
  Activity,
  ArrowLeft,
  LogOut,
  ShieldCheck,
  Loader2,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090712] text-white flex items-center justify-center flex-col gap-3">
        <Loader2 className="w-8 h-8 text-[#5E6BFF] animate-spin" />
        <span className="text-xs text-[#9590a8] font-mono">Verifying ClickHouse Admin Credentials...</span>
      </div>
    );
  }

  if (!isAdminUser(user)) {
    return <ForbiddenPage />;
  }

  const navItems = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Top URLs", href: "/admin/top-urls", icon: TrendingUp },
    { label: "Realtime", href: "/admin/realtime", icon: Activity },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#090712] text-[#FAFAFA] font-sans">
      <aside className="w-64 bg-[#100d1b] border-r border-[#231f38] flex flex-col h-full z-40 md:flex">
        <div className="p-5 border-b border-[#231f38] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-[#6B66DA] to-[#453fbb] flex items-center justify-center text-white font-bold text-sm shadow-md shadow-[#6B66DA]/30">
              R
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                Admin Console
              </h2>
              <p className="text-[10px] text-[#8e87ff] font-mono">ClickHouse + Kafka</p>
            </div>
          </div>
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#6B66DA] text-white shadow-lg shadow-[#6B66DA]/25"
                    : "text-[#9590a8] hover:text-white hover:bg-[#1a162b]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[#231f38] space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#9590a8] hover:text-white hover:bg-[#1a162b] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#8e87ff]" />
            <span>User Dashboard</span>
          </Link>

          <div className="p-3 rounded-xl bg-[#141024] border border-[#272140] flex items-center justify-between">
            <div className="truncate pr-2">
              <p className="text-[11px] font-medium text-white truncate">{user?.email}</p>
              <p className="text-[9px] text-emerald-400 font-mono">● Admin Access</p>
            </div>
            <button
              onClick={handleSignOut}
              title="Log out"
              className="text-[#9590a8] hover:text-red-400 transition-colors p-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="md:hidden bg-[#100d1b] border-b border-[#231f38] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#6B66DA] flex items-center justify-center text-white font-bold text-xs">
              R
            </div>
            <span className="font-bold text-sm text-white">Admin Console</span>
          </div>

          <div className="flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                  pathname === item.href ? "bg-[#6B66DA] text-white" : "text-[#9590a8]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#090712]">
          {children}
        </main>
      </div>
    </div>
  );
}
