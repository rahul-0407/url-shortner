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
  Search,
  Bell,
  MessageSquare,
  Moon,
  Sun,
  Globe,
  Settings,
  Menu,
  Grid,
  ShoppingBag,
  BarChart3,
  Users,
  Layers,
  Home,
  Info,
  BookOpen,
  Mail,
  Briefcase,
  DollarSign,
  ChevronDown
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
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
      <div className="min-h-screen bg-[#F4F7FB] text-[#1E293B] flex items-center justify-center flex-col gap-3">
        <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin" />
        <span className="text-xs text-[#64748B] font-medium">Loading MaterialM Dashboard...</span>
      </div>
    );
  }

  if (!isAdminUser(user)) {
    return <ForbiddenPage />;
  }

  const dashboardItems = [
    { label: "eCommerce", href: "/admin", icon: ShoppingBag },
    { label: "Analytics", href: "/admin", icon: BarChart3 },
    { label: "CRM (Top URLs)", href: "/admin/top-urls", icon: Users },
    { label: "Realtime Stream", href: "/admin/realtime", icon: Activity },
  ];

  const pageItems = [
    { label: "Homepage", href: "/", icon: Home },
    { label: "My Links", href: "/dashboard", icon: Layers },
    { label: "Services", href: "/services", icon: Info },
    { label: "Blog", href: "/contact", icon: BookOpen },
    { label: "Contact Us", href: "/contact", icon: Mail },
    { label: "Portfolio", href: "/dashboard", icon: Briefcase },
    { label: "Pricing", href: "/services", icon: DollarSign },
  ];

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? "bg-[#0B0F19] text-white" : "bg-[#F4F7FB] text-[#1E293B]"} font-sans`}>
      {/* Leftmost Mini Icon Sidebar (MaterialM Style) */}
      <aside className={`w-16 ${isDarkMode ? "bg-[#111827] border-[#1F2937]" : "bg-white border-slate-200/80"} border-r flex flex-col items-center py-4 z-50 hidden lg:flex shrink-0`}>
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#60A5FA] flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-500/20 mb-6 cursor-pointer">
          M
        </div>

        <div className="flex-1 flex flex-col gap-4 text-[#64748B]">
          <button className="p-2.5 rounded-xl bg-blue-50 text-[#2563EB] hover:bg-blue-100 transition-colors">
            <LayoutDashboard className="w-5 h-5" />
          </button>
          <button className="p-2.5 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <BarChart3 className="w-5 h-5" />
          </button>
          <button className="p-2.5 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <Users className="w-5 h-5" />
          </button>
          <button className="p-2.5 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <Layers className="w-5 h-5" />
          </button>
          <button className="p-2.5 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-auto">
          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white">
            {user?.email?.[0]?.toUpperCase() || "A"}
          </div>
        </div>
      </aside>

      {/* Main Drawer Navigation Sidebar */}
      <aside className={`w-60 ${isDarkMode ? "bg-[#111827] border-[#1F2937]" : "bg-white border-slate-200/80"} border-r flex flex-col h-full z-40 hidden md:flex shrink-0`}>
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="font-extrabold text-lg tracking-tight text-slate-900">
              Dashboards
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-6">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">
              Dashboards
            </div>
            <nav className="space-y-1">
              {dashboardItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-[#EBF3FE] text-[#2563EB] shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">
              Frontend Pages
            </div>
            <nav className="space-y-1">
              {pageItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
                  >
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
            <div className="truncate pr-2">
              <p className="text-xs font-semibold text-slate-900 truncate">{user?.email}</p>
              <p className="text-[10px] text-emerald-600 font-medium">● Online Admin</p>
            </div>
            <button
              onClick={handleSignOut}
              title="Log out"
              className="text-slate-400 hover:text-red-500 transition-colors p-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header Navbar */}
        <header className={`h-16 ${isDarkMode ? "bg-[#111827] border-[#1F2937]" : "bg-white border-slate-200/80"} border-b px-6 flex items-center justify-between shrink-0 z-30`}>
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <button className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100">
              <Menu className="w-5 h-5" />
            </button>
            <button className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100">
              <Grid className="w-5 h-5" />
            </button>
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search dashboard or metrics..."
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <button className="text-slate-600 hover:text-slate-900 p-2 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-1">
              <span className="text-xs font-semibold">🇬🇧</span>
            </button>

            <button className="relative text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-blue-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            <button className="relative text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors">
              <MessageSquare className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-pink-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                5
              </span>
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-xs">
                {user?.email?.[0]?.toUpperCase() || "A"}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Children */}
        <main className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 ${isDarkMode ? "bg-[#0B0F19]" : "bg-[#F4F7FB]"}`}>
          {children}
        </main>

        {/* MaterialM Floating Settings Action Gear Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <button className="w-12 h-12 rounded-full bg-[#00A3FF] hover:bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/40 hover:scale-105 transition-all">
            <Settings className="w-5 h-5 animate-spin-slow" />
          </button>
        </div>
      </div>
    </div>
  );
}
