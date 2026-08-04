"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (mode === "signup" && !agreedTerms) {
      setError("Please agree to the Terms & Conditions to proceed.");
      return;
    }

    setLoading(true);

    const cleanEmail = email.trim();
    const { error } =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email: cleanEmail, password })
        : await supabase.auth.signUp({ email: cleanEmail, password });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function handleSocialAuth(provider: "google" | "github") {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      setError(error.message);
    }
  }

  return (
    <div className="w-full max-w-[1020px] bg-[#141221] border border-[#27233a] rounded-[24px] p-3 sm:p-4 shadow-2xl grid grid-cols-1 lg:grid-cols-2 gap-4 my-8">
      {/* Left Visual Banner Section */}
      <div
        className="relative rounded-[18px] overflow-hidden min-h-[460px] lg:min-h-[560px] flex flex-col justify-between p-6 sm:p-8 bg-cover bg-center border border-white/10"
        style={{ backgroundImage: "url('/login-banner.png')" }}
      >
        {/* Gradient dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#100d1b] via-[#100d1b]/40 to-transparent pointer-events-none"></div>

        {/* Top Header inside Banner */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#5E6BFF] flex items-center justify-center text-white font-bold text-sm shadow-md shadow-[#5E6BFF]/30">
              R
            </div>
            <span className="font-bold text-white tracking-tight text-lg group-hover:text-[#bec2ff] transition-colors">
              Romer
            </span>
          </Link>

          <Link
            href="/"
            className="text-xs text-white/90 hover:text-white bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1 font-medium"
          >
            Back to website <span className="text-sm">→</span>
          </Link>
        </div>

        {/* Bottom Tagline inside Banner */}
        <div className="relative z-10 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight tracking-tight">
            Shorten Links,
            <br />
            Track Real-Time Clicks
          </h2>
          <p className="text-xs text-white/70 max-w-xs leading-relaxed">
            Create clean short URLs, generate instant QR codes, and monitor detailed click analytics with Romer.
          </p>

          {/* Slider Pagination Dots */}
          <div className="flex items-center gap-1.5 pt-2">
            <div className="w-6 h-1 rounded-full bg-white"></div>
            <div className="w-2 h-1 rounded-full bg-white/40"></div>
            <div className="w-2 h-1 rounded-full bg-white/40"></div>
          </div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="flex flex-col justify-center px-4 sm:px-8 py-6 lg:py-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {mode === "signup" ? "Create an account" : "Welcome back"}
          </h1>
          <p className="text-xs sm:text-sm text-[#9590a8] mt-1">
            {mode === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setError(null);
                setMode(mode === "signup" ? "login" : "signup");
              }}
              className="text-[#8e87ff] hover:text-[#b4afff] font-medium underline underline-offset-2 transition-colors ml-1"
            >
              {mode === "signup" ? "Log in" : "Sign up"}
            </button>
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#b5afd0]" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@domain.com"
              className="w-full rounded-xl px-4 py-3 text-sm bg-[#1e1b2d] border border-[#322d4a] text-white placeholder-[#686180] focus:border-[#7b73ff] focus:ring-1 focus:ring-[#7b73ff] outline-none transition-all"
            />
          </div>

          {/* Password Field with Eye Toggle */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#b5afd0]" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl px-4 py-3 text-sm bg-[#1e1b2d] border border-[#322d4a] text-white placeholder-[#686180] focus:border-[#7b73ff] focus:ring-1 focus:ring-[#7b73ff] outline-none transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7d7699] hover:text-white transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          {/* Terms Checkbox (Signup mode) */}
          {mode === "signup" && (
            <div className="flex items-center gap-2 pt-1">
              <input
                id="terms"
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="w-4 h-4 rounded border-[#3d3856] bg-[#1e1b2d] text-[#6B66DA] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#6B66DA]"
              />
              <label htmlFor="terms" className="text-xs text-[#9590a8] cursor-pointer">
                I agree to the{" "}
                <Link href="/terms" target="_blank" className="text-[#8e87ff] hover:underline">
                  Terms & Conditions
                </Link>
              </label>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-[#3b1820] border border-[#6b2533] text-xs text-[#ff8093] leading-normal">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#6B66DA] hover:bg-[#5954c7] text-white rounded-xl py-3 text-sm font-semibold transition-colors shadow-lg shadow-[#6B66DA]/25 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Processing..." : mode === "signup" ? "Create account" : "Log in"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-2">
          <div className="border-t border-[#29243d] w-full"></div>
          <span className="bg-[#141221] px-3 text-[11px] text-[#716a8a] font-medium whitespace-nowrap uppercase tracking-wider absolute">
            Or {mode === "signup" ? "register" : "sign in"} with
          </span>
        </div>

        {/* Social Login Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => handleSocialAuth("google")}
            className="w-full bg-[#1c192b] hover:bg-[#252139] border border-[#2f2a47] rounded-xl py-2.5 px-4 text-xs font-medium text-white flex items-center justify-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.1 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.8s.7 5.1 1.9 7.5l3.7-2.9c-.6-.7-1-1.7-1-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.1-6.4-5.2L1.9 16.1C3.7 19.8 7.5 23 12 23z"
              />
            </svg>
            Google
          </button>

          <button
            type="button"
            onClick={() => handleSocialAuth("github")}
            className="w-full bg-[#1c192b] hover:bg-[#252139] border border-[#2f2a47] rounded-xl py-2.5 px-4 text-xs font-medium text-white flex items-center justify-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[#090712] text-[#FAFAFA]">
      <Suspense fallback={<div className="text-zinc-500 text-sm">Loading login terminal...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}