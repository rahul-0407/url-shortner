"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { isAdminUser } from "@/lib/auth";

export default function Navbar() {
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
    setUser(null);
    router.push("/");
    router.refresh();
  }

  const isAdmin = isAdminUser(user);

  return (
    <header className="bg-[#070708]/90 backdrop-blur-md w-full top-0 h-20 border-b border-[#232426] z-50 fixed">
      <div className="flex justify-between items-center w-full px-6 md:px-8 max-w-[1728px] mx-auto h-full">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full border border-[#9A9DA3]/40 bg-[#0e0e0f] flex items-center justify-center text-[#e5e2e3] font-bold text-lg group-hover:border-[#5E6BFF] transition-colors">
            R
          </div>
          <span className="text-xl font-bold tracking-tight text-[#e5e2e3] group-hover:text-white transition-colors">
            Romer
          </span>
        </Link>

        <nav className="hidden md:flex gap-6 h-full items-center">
          <Link
            className={`text-sm transition-colors duration-200 ${
              pathname === "/" ? "text-[#bec2ff] font-semibold" : "text-[#c6c5d8] hover:text-[#bec2ff]"
            }`}
            href="/"
          >
            Platform
          </Link>

          {user && (
            <Link
              className={`text-sm transition-colors duration-200 ${
                pathname.startsWith("/dashboard") || pathname.startsWith("/admin")
                  ? "text-[#bec2ff] font-semibold"
                  : "text-[#c6c5d8] hover:text-[#bec2ff]"
              }`}
              href={isAdmin ? "/admin" : "/dashboard"}
            >
              {isAdmin ? "Admin Console" : "Dashboard"}
            </Link>
          )}

          <Link
            className={`text-sm transition-colors duration-200 ${
              pathname === "/services" ? "text-[#bec2ff] font-semibold" : "text-[#c6c5d8] hover:text-[#bec2ff]"
            }`}
            href="/services"
          >
            Services
          </Link>
          <Link
            className={`text-sm transition-colors duration-200 ${
              pathname === "/contact" ? "text-[#bec2ff] font-semibold" : "text-[#c6c5d8] hover:text-[#bec2ff]"
            }`}
            href="/contact"
          >
            Contact
          </Link>
          <Link
            className={`text-sm transition-colors duration-200 ${
              pathname === "/terms" ? "text-[#bec2ff] font-semibold" : "text-[#c6c5d8] hover:text-[#bec2ff]"
            }`}
            href="/terms"
          >
            Terms
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {loading ? (
            <div className="w-20 h-9 rounded bg-[#1a1b1d] animate-pulse"></div>
          ) : user ? (
            <>
              {isAdmin && (
                <span className="text-[10px] uppercase font-bold tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full">
                  Admin Access
                </span>
              )}
              <Link
                className="text-sm bg-[#1a1b1d] border border-[#232426] text-[#e5e2e3] px-4 py-2 rounded hover:bg-[#232426] hover:text-white transition-colors duration-200 font-medium"
                href={isAdmin ? "/admin" : "/dashboard"}
              >
                {isAdmin ? "Admin Portal" : "Dashboard"}
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm text-[#9A9DA3] hover:text-white transition-colors duration-200 px-3 py-2"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                className="text-sm text-[#c6c5d8] hover:text-[#bec2ff] transition-colors duration-200 px-4 py-2 rounded border border-[#232426]"
                href="/login"
              >
                Log in
              </Link>
              <Link
                className="text-sm bg-white text-black px-4 py-2 rounded hover:bg-opacity-90 transition-colors duration-200 font-bold"
                href="/login?mode=signup"
              >
                Start free
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
