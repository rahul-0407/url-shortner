"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { createClient } from "@/lib/supabase/client";
import {
  Link2,
  Plus,
  Search,
  RefreshCw,
  Copy,
  Trash2,
  ExternalLink,
  Layers,
  Info,
  BookOpen,
  LogOut,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles
} from "lucide-react";

interface UrlRecord {
  shortCode: string;
  longUrl: string;
  createdAt: number;
  expiresAt: number | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [urls, setUrls] = useState<UrlRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [longUrl, setLongUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [selectedUrl, setSelectedUrl] = useState<UrlRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  async function loadUrls() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch("/api/v1/urls");
      const list = data.urls || [];
      setUrls(list);
      if (list.length > 0 && !selectedUrl) {
        setSelectedUrl(list[0]);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load URLs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUrls();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!longUrl.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const created = await apiFetch("/api/v1/urls", {
        method: "POST",
        body: JSON.stringify({ longUrl: longUrl.trim() }),
      });
      setLongUrl("");
      const updatedList = [created, ...urls];
      setUrls(updatedList);
      setSelectedUrl(created);
    } catch (err: any) {
      setError(err.message || "Failed to create short URL");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(shortCode: string) {
    if (!confirm(`Are you sure you want to delete /${shortCode}?`)) return;

    try {
      await apiFetch(`/api/v1/urls/${shortCode}`, { method: "DELETE" });
      const filtered = urls.filter((u) => u.shortCode !== shortCode);
      setUrls(filtered);
      if (selectedUrl?.shortCode === shortCode) {
        setSelectedUrl(filtered[0] || null);
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete URL");
    }
  }

  function handleCopy(shortCode: string) {
    const domain =
      process.env.NEXT_PUBLIC_SHORT_DOMAIN ||
      "https://url-shortner-production-4773.up.railway.app";
    const fullUrl = `${domain}/${shortCode}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedCode(shortCode);
    setTimeout(() => setCopiedCode(null), 2000);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const filteredUrls = urls.filter(
    (u) =>
      u.shortCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.longUrl.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#F4F7FB] text-[#1E293B] font-sans antialiased">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col h-full z-40 hidden md:flex shrink-0">
        <div className="p-5 flex items-center gap-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#60A5FA] flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-500/20">
            M
          </div>
          <div>
            <h2 className="font-extrabold text-sm text-slate-900 tracking-tight">
              MaterialM URL
            </h2>
            <p className="text-[10px] text-slate-400 font-medium">Link Management Console</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">
              Dashboard
            </div>
            <nav className="space-y-1">
              <Link
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#2563EB] bg-[#EBF3FE] shadow-xs"
                href="/dashboard"
              >
                <Layers className="w-4 h-4" />
                <span>My Short URLs</span>
              </Link>
              <Link
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
                href="/services"
              >
                <Info className="w-4 h-4 text-slate-400" />
                <span>Services</span>
              </Link>
              <Link
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
                href="/contact"
              >
                <BookOpen className="w-4 h-4 text-slate-400" />
                <span>Support</span>
              </Link>
              <Link
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
                href="/admin"
              >
                <BarChart3 className="w-4 h-4 text-slate-400" />
                <span>Admin Analytics</span>
              </Link>
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 space-y-3">
          <button
            onClick={() => {
              const el = document.getElementById("create-link-input");
              el?.focus();
            }}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-2xl bg-[#2563EB] text-white text-xs font-bold shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all"
          >
            <Plus className="w-4 h-4" />
            New Short URL
          </button>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-red-500 hover:bg-red-50 text-xs font-bold transition-all w-full"
          >
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#F4F7FB]">
        {/* Header Bar */}
        <header className="px-6 py-5 bg-white border-b border-slate-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              URL Management Console
            </h1>
            <p className="text-xs text-slate-500">
              High-performance link shortening & redirection suite
            </p>
          </div>

          <div className="flex gap-4">
            <div className="px-4 py-2 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center gap-3">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Total Links</p>
                <p className="text-base font-black text-slate-900">{urls.length}</p>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            </div>

            <div className="px-4 py-2 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center gap-3">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Engine Status</p>
                <p className="text-base font-black text-blue-600">Active</p>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping"></span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 flex overflow-hidden flex-col lg:flex-row">
          {/* URL Creation & Table List Column */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 border-r border-slate-200/80">
            {/* Create Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Shorten a New Destination URL
              </h2>
              <form onSubmit={handleCreate} className="flex gap-3">
                <input
                  id="create-link-input"
                  type="url"
                  required
                  placeholder="https://example.com/very-long-destination-url"
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#2563EB] hover:bg-blue-700 text-white px-6 py-2.5 rounded-2xl text-xs font-bold shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all"
                >
                  {submitting ? "Shortening..." : "Shorten URL"}
                </button>
              </form>
              {error && <p className="text-xs text-red-500 mt-2 font-medium">{error}</p>}
            </div>

            {/* List Controls */}
            <div className="flex justify-between items-center">
              <div className="relative w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search short code or URL..."
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <button
                onClick={loadUrls}
                className="bg-white border border-slate-200 rounded-2xl px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                Refresh
              </button>
            </div>

            {/* URL List Table */}
            <div className="bg-white border border-slate-100 rounded-3xl shadow-xs overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[11px] text-slate-400 uppercase font-bold tracking-wider">
                    <th className="py-3.5 px-4 w-8"></th>
                    <th className="py-3.5 px-4">Short Code</th>
                    <th className="py-3.5 px-4">Destination URL</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700 font-mono">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-slate-400 font-sans">
                        Loading short URLs...
                      </td>
                    </tr>
                  ) : filteredUrls.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-slate-400 font-sans">
                        No short links created yet.
                      </td>
                    </tr>
                  ) : (
                    filteredUrls.map((item) => {
                      const isSelected = selectedUrl?.shortCode === item.shortCode;
                      return (
                        <tr
                          key={item.shortCode}
                          onClick={() => setSelectedUrl(item)}
                          className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${
                            isSelected ? "bg-blue-50/50 border-l-4 border-l-blue-600" : ""
                          }`}
                        >
                          <td className="py-3.5 px-4 text-center">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-blue-600">
                            /{item.shortCode}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 max-w-xs sm:max-w-md truncate font-sans">
                            {item.longUrl}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => handleCopy(item.shortCode)}
                                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-sans text-slate-700 font-semibold"
                              >
                                {copiedCode === item.shortCode ? "Copied!" : "Copy"}
                              </button>
                              <button
                                onClick={() => handleDelete(item.shortCode)}
                                className="px-3 py-1 bg-red-50 hover:bg-red-100 rounded-xl text-xs font-sans text-red-600 font-semibold"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Selected URL Inspector Sidebar */}
          <div className="w-full lg:w-96 bg-white flex flex-col h-full border-t lg:border-t-0 border-slate-200/80 shrink-0">
            {selectedUrl ? (
              <>
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      ACTIVE
                    </span>
                    <a
                      href={`${process.env.NEXT_PUBLIC_SHORT_DOMAIN || "https://url-shortner-production-4773.up.railway.app"}/${selectedUrl.shortCode}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    /{selectedUrl.shortCode}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono break-all line-clamp-2">
                    {selectedUrl.longUrl}
                  </p>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <section className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Link Telemetry Specs
                    </h4>
                    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase">Short Code</p>
                        <p className="text-xs font-mono font-bold text-slate-900">{selectedUrl.shortCode}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase">Cache Layer</p>
                        <p className="text-xs font-mono font-bold text-blue-600">Redis L1</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase">Analytics Engine</p>
                        <p className="text-xs font-mono font-bold text-purple-600">ClickHouse DB</p>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-2">
                    <button
                      onClick={() => handleCopy(selectedUrl.shortCode)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-left hover:bg-slate-100 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Copy className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-bold text-slate-800">Copy Short Link</span>
                      </div>
                      <span className="text-[10px] font-bold text-blue-600">
                        {copiedCode === selectedUrl.shortCode ? "COPIED" : "COPY"}
                      </span>
                    </button>
                  </section>
                </div>

                <div className="p-4 border-t border-slate-100">
                  <button
                    onClick={() => handleDelete(selectedUrl.shortCode)}
                    className="w-full bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl py-3 text-xs font-bold transition-colors flex justify-center items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Short URL
                  </button>
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs font-medium">
                Select a link to view details
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
