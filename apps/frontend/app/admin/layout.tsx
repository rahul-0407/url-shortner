"use client";

import { useEffect, useState, useRef } from "react";
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
  ChevronDown,
  Check,
  X,
  Calendar,
  SlidersHorizontal,
  User as UserIcon,
  Sparkles
} from "lucide-react";

interface NotificationItem {
  id: number;
  title: string;
  subtitle: string;
  time: string;
  color: string;
  bg: string;
}

interface MessageItem {
  id: number;
  name: string;
  message: string;
  time: string;
  avatarBg: string;
  avatarText: string;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Dropdown states for header popups
  const [langOpen, setLangOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [msgOpen, setMsgOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [selectedLang, setSelectedLang] = useState<{ code: string; label: string; flag: string }>({
    code: "en",
    label: "English (UK)",
    flag: "🇬🇧",
  });

  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const langRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const msgRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

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

  // Close popups when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
      if (msgRef.current && !msgRef.current.contains(event.target as Node)) {
        setMsgOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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

  // Dashboard Items with DISTINCT hrefs to avoid multiple active items simultaneously!
  const dashboardItems = [
    { label: "eCommerce", href: "/admin/ecommerce", icon: ShoppingBag },
    { label: "Analytics", href: "/admin", icon: BarChart3 },
    { label: "CRM (Top URLs)", href: "/admin/top-urls", icon: Users },
    { label: "Realtime Stream", href: "/admin/realtime", icon: Activity },
    { label: "Landingpage", href: "/admin/landingpage", icon: Layers },
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

  const languages = [
    { code: "en", label: "English (UK)", flag: "🇬🇧" },
    { code: "zh", label: "中文 (Chinese)", flag: "🇨🇳" },
    { code: "fr", label: "français (French)", flag: "🇫🇷" },
    { code: "ar", label: "عربي (Arabic)", flag: "🇸🇦" },
  ];

  const notifications: NotificationItem[] = [
    {
      id: 1,
      title: "Launch Admin",
      subtitle: "Just see the my new...",
      time: "9:30 AM",
      color: "text-pink-600",
      bg: "bg-pink-100",
    },
    {
      id: 2,
      title: "Event Today",
      subtitle: "Just a reminder that you...",
      time: "9:15 AM",
      color: "text-sky-600",
      bg: "bg-sky-100",
    },
    {
      id: 3,
      title: "Settings",
      subtitle: "You can customize this...",
      time: "4:38 PM",
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      id: 4,
      title: "Launch Admin",
      subtitle: "Just see the my new...",
      time: "9:30 AM",
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
    {
      id: 5,
      title: "Event Today",
      subtitle: "Just a reminder that you...",
      time: "9:15 AM",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
  ];

  const messages: MessageItem[] = [
    {
      id: 1,
      name: "Michell Flintoff",
      message: "You: Yesterday was great...",
      time: "just now",
      avatarBg: "bg-[#E0F2FE]",
      avatarText: "text-sky-600",
    },
    {
      id: 2,
      name: "Bianca Anderson",
      message: "Nice looking dress you...",
      time: "5 mins ago",
      avatarBg: "bg-[#FCE7F3]",
      avatarText: "text-pink-600",
    },
    {
      id: 3,
      name: "Andrew Johnson",
      message: "Sent a photo",
      time: "10 mins ago",
      avatarBg: "bg-[#FEF3C7]",
      avatarText: "text-amber-600",
    },
    {
      id: 4,
      name: "Jolly Cummins",
      message: "If I don't like something",
      time: "5 days ago",
      avatarBg: "bg-[#DCFCE7]",
      avatarText: "text-emerald-600",
    },
    {
      id: 5,
      name: "Josh Macklow",
      message: "Check out the new design update",
      time: "1 year ago",
      avatarBg: "bg-[#E0F2FE]",
      avatarText: "text-blue-600",
    },
  ];

  return (
    <div
      className={`flex h-screen overflow-hidden ${
        isDarkMode ? "bg-[#0B0F19] text-white" : "bg-[#F4F7FB] text-[#1E293B]"
      } font-sans`}
    >
      {/* Leftmost Mini Icon Sidebar (MaterialM Style) */}
      <aside
        className={`w-16 ${
          isDarkMode ? "bg-[#111827] border-[#1F2937]" : "bg-white border-slate-200/80"
        } border-r flex flex-col items-center py-4 z-50 hidden lg:flex shrink-0`}
      >
        <Link href="/admin">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#60A5FA] flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-500/20 mb-6 cursor-pointer hover:scale-105 transition-transform">
            M
          </div>
        </Link>

        <div className="flex-1 flex flex-col gap-4 text-[#64748B]">
          <Link
            href="/admin"
            className={`p-2.5 rounded-xl transition-colors ${
              pathname === "/admin"
                ? "bg-blue-50 text-[#2563EB]"
                : "hover:bg-slate-100 hover:text-slate-900"
            }`}
            title="Analytics Overview"
          >
            <LayoutDashboard className="w-5 h-5" />
          </Link>
          <Link
            href="/admin/top-urls"
            className={`p-2.5 rounded-xl transition-colors ${
              pathname.startsWith("/admin/top-urls")
                ? "bg-blue-50 text-[#2563EB]"
                : "hover:bg-slate-100 hover:text-slate-900"
            }`}
            title="CRM Top URLs"
          >
            <BarChart3 className="w-5 h-5" />
          </Link>
          <Link
            href="/admin/realtime"
            className={`p-2.5 rounded-xl transition-colors ${
              pathname.startsWith("/admin/realtime")
                ? "bg-blue-50 text-[#2563EB]"
                : "hover:bg-slate-100 hover:text-slate-900"
            }`}
            title="Realtime Stream"
          >
            <Activity className="w-5 h-5" />
          </Link>
          <Link
            href="/admin/ecommerce"
            className={`p-2.5 rounded-xl transition-colors ${
              pathname.startsWith("/admin/ecommerce")
                ? "bg-blue-50 text-[#2563EB]"
                : "hover:bg-slate-100 hover:text-slate-900"
            }`}
            title="eCommerce Dashboard"
          >
            <ShoppingBag className="w-5 h-5" />
          </Link>
        </div>

        <div className="mt-auto">
          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white">
            {user?.email?.[0]?.toUpperCase() || "A"}
          </div>
        </div>
      </aside>

      {/* Main Drawer Navigation Sidebar with Slide Open/Close Animation */}
      <aside
        className={`${
          sidebarOpen ? "w-60 opacity-100" : "w-0 opacity-0 border-0 p-0 overflow-hidden"
        } ${
          isDarkMode ? "bg-[#111827] border-[#1F2937]" : "bg-white border-slate-200/80"
        } border-r flex flex-col h-full z-40 transition-all duration-300 ease-in-out shrink-0`}
      >
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
                // STRICT SINGLE ACTIVE MATCH so only ONE item is highlighted at a time!
                const isActive = pathname === item.href;

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
        <header
          className={`h-16 ${
            isDarkMode ? "bg-[#111827] border-[#1F2937]" : "bg-white border-slate-200/80"
          } border-b px-6 flex items-center justify-between shrink-0 z-30 relative`}
        >
          <div className="flex items-center gap-4 flex-1 max-w-md">
            {/* Top Three Horizontal Line Hamburger Button -> Slide Toggles Sidebar */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title="Toggle Sidebar Navigation"
              className="text-slate-600 hover:text-slate-900 p-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 hidden sm:block">
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
            {/* Dark Mode Switcher */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors"
              title="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Language Flag Selector & Dropdown (Screenshot 1) */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => {
                  setLangOpen(!langOpen);
                  setNotifOpen(false);
                  setMsgOpen(false);
                  setProfileOpen(false);
                }}
                className="text-slate-700 hover:text-slate-900 p-2 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-1 text-sm font-semibold"
              >
                <span>{selectedLang.flag}</span>
              </button>

              {langOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setSelectedLang(lang);
                        setLangOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </div>
                      {selectedLang.code === lang.code && (
                        <Check className="w-3.5 h-3.5 text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Messages Inbox Dropdown Modal (Screenshot 3) */}
            <div className="relative" ref={msgRef}>
              <button
                onClick={() => {
                  setMsgOpen(!msgOpen);
                  setLangOpen(false);
                  setNotifOpen(false);
                  setProfileOpen(false);
                }}
                className="relative text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors"
                title="Messages"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  3
                </span>
              </button>

              {msgOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-100 rounded-3xl shadow-2xl p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-900">Inbox</h3>
                    <span className="bg-amber-100 text-amber-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      3 new
                    </span>
                  </div>

                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {messages.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full ${item.avatarBg} ${item.avatarText} flex items-center justify-center font-bold text-xs shrink-0`}
                          >
                            {item.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="truncate">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {item.name}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate">
                              {item.message}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0 font-medium ml-2">
                          {item.time}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button className="w-full border border-blue-500 text-blue-600 hover:bg-blue-50 text-xs font-bold py-2.5 rounded-2xl transition-colors">
                    See All Messages
                  </button>
                </div>
              )}
            </div>

            {/* Notifications Dropdown Modal (Screenshot 2) */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => {
                  setNotifOpen(!notifOpen);
                  setLangOpen(false);
                  setMsgOpen(false);
                  setProfileOpen(false);
                }}
                className="relative text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#2563EB] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  5
                </span>
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-100 rounded-3xl shadow-2xl p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-900">Notifications</h3>
                    <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      5 new
                    </span>
                  </div>

                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {notifications.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center font-bold text-xs shrink-0`}
                          >
                            <Bell className="w-4 h-4" />
                          </div>
                          <div className="truncate">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {item.title}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate">
                              {item.subtitle}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0 font-medium ml-2">
                          {item.time}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button className="w-full bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-2xl shadow-md shadow-blue-500/20 transition-all">
                    See All Notifications
                  </button>
                </div>
              )}
            </div>

            {/* Profile Avatar & Dropdown */}
            <div className="relative pl-2 border-l border-slate-200" ref={profileRef}>
              <button
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setLangOpen(false);
                  setNotifOpen(false);
                  setMsgOpen(false);
                }}
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-xs hover:ring-2 hover:ring-blue-500 transition-all"
              >
                {user?.email?.[0]?.toUpperCase() || "A"}
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-3xl shadow-xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-3">
                  <div className="pb-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">{user?.email}</p>
                    <p className="text-[10px] text-emerald-600 font-semibold">Super Administrator</p>
                  </div>

                  <div className="space-y-1 text-xs font-medium text-slate-700">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      <span>User Console</span>
                    </Link>
                    <button
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4 text-slate-400" />
                        <span>Dark Canvas</span>
                      </div>
                      <span className="text-[10px] font-bold text-blue-600">
                        {isDarkMode ? "ON" : "OFF"}
                      </span>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Page Children */}
        <main
          className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 ${
            isDarkMode ? "bg-[#0B0F19]" : "bg-[#F4F7FB]"
          }`}
        >
          {children}
        </main>

        {/* MaterialM Floating Settings Action Gear Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-12 h-12 rounded-full bg-[#00A3FF] hover:bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/40 hover:scale-105 transition-all"
            title="Quick Theme Toggle"
          >
            <Settings className="w-5 h-5 animate-spin-slow" />
          </button>
        </div>
      </div>
    </div>
  );
}
