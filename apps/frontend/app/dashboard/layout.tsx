"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#131314] text-[#e5e2e3] flex flex-col">
      <header className="flex justify-between items-center h-12 px-md sticky top-0 z-50 bg-[#131314]/80 backdrop-blur-md border-b border-[#232426]">
        <div className="font-bold tracking-tighter">ROMER</div>
        <button onClick={handleLogout} className="text-xs text-on-surface-variant hover:text-white px-sm py-xs border border-[#232426] rounded">
          Log out
        </button>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <nav className="hidden md:flex flex-col w-64 pt-md pb-lg bg-[#0e0e0f] border-r border-[#232426]">
          <div className="flex flex-col gap-xs flex-1 px-sm">
            <Link href="/dashboard" className="px-md py-sm text-sm text-secondary bg-[#1c1b1d]">My Links</Link>
            <Link href="/dashboard/stats" className="px-md py-sm text-sm text-on-surface-variant hover:text-white">Stats</Link>
          </div>
        </nav>
        <main className="flex-1 overflow-y-auto p-lg">{children}</main>
      </div>
    </div>
  );
}