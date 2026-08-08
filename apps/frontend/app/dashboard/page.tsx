"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { createClient } from "@/lib/supabase/client";

interface UrlRecord {
  shortCode: string;
  longUrl: string;
  clickCount?: number;
  clicks?: number;
  createdAt: number;
  expiresAt: number | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [urls, setUrls] = useState<UrlRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [longUrl, setLongUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // UI State
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
    const fullUrl = `http://localhost:4000/${shortCode}`;
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

  const totalClicks = urls.reduce(
    (acc, curr) => acc + (curr.clickCount ?? curr.clicks ?? 0),
    0,
  );

  return (
    <div className="flex h-screen overflow-hidden antialiased font-body-md text-body-md bg-[#131314] text-[#e5e2e3]">
      {/* SideNavBar Component */}
      <nav className="bg-[#0e0e0f] border-r border-[#454655]/40 flex flex-col h-full fixed left-0 top-0 z-40 w-64 pt-4 pb-6 hidden md:flex">
        <div className="px-4 mb-8 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-[#454655] flex items-center justify-center font-bold text-white bg-[#201f21]">
            R
          </div>
          <div>
            <h2 className="font-h4 text-base font-bold text-[#e5e2e3]">
              ROMER INFRA
            </h2>
            <div className="text-xs text-[#c6c5d8] font-mono opacity-70">
              v2.4.0-stable
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-1 px-2">
          <Link
            className="group flex items-center gap-3 px-3 py-2 rounded text-[#50d8e9] bg-[#1c1b1d] border-r-2 border-[#50d8e9]"
            href="/dashboard"
          >
            <span className="material-symbols-outlined text-[18px]">
              terminal
            </span>
            <span className="text-xs uppercase tracking-widest font-semibold">
              My Links
            </span>
          </Link>

          <Link
            className="group flex items-center gap-3 px-3 py-2 rounded text-[#c6c5d8] hover:text-[#e5e2e3] hover:bg-[#353436] transition-all"
            href="/dashboard/stats"
          >
            <span className="material-symbols-outlined text-[18px]">
              analytics
            </span>
            <span className="text-xs uppercase tracking-widest font-semibold">
              Analytics & Stats
            </span>
          </Link>

          <Link
            className="group flex items-center gap-3 px-3 py-2 rounded text-[#c6c5d8] hover:text-[#e5e2e3] hover:bg-[#353436] transition-all"
            href="/services"
          >
            <span className="material-symbols-outlined text-[18px]">
              sensors
            </span>
            <span className="text-xs uppercase tracking-widest font-semibold">
              Services
            </span>
          </Link>

          <Link
            className="group flex items-center gap-3 px-3 py-2 rounded text-[#c6c5d8] hover:text-[#e5e2e3] hover:bg-[#353436] transition-all"
            href="/contact"
          >
            <span className="material-symbols-outlined text-[18px]">
              contact_support
            </span>
            <span className="text-xs uppercase tracking-widest font-semibold">
              Support
            </span>
          </Link>
        </div>

        <div className="px-2 mt-auto flex flex-col gap-2 border-t border-[#454655]/40 pt-4">
          <button
            onClick={() => {
              const el = document.getElementById("create-link-input");
              el?.focus();
            }}
            className="mb-2 flex items-center justify-center gap-2 w-full py-2 px-3 rounded bg-[#5E6BFF] text-[#F0F1F2] text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            New Short URL
          </button>

          <button
            onClick={handleSignOut}
            className="group flex items-center gap-3 px-3 py-2 rounded text-red-400 hover:text-red-300 hover:bg-[#353436] transition-all w-full text-left"
          >
            <span className="material-symbols-outlined text-[18px]">
              logout
            </span>
            <span className="text-xs uppercase tracking-widest font-semibold">
              Log out
            </span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 ml-0 md:ml-64 flex flex-col h-full overflow-hidden bg-[#131314]">
        {/* Page Header */}
        <div className="px-6 py-6 border-b border-[#1B1C1E] flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 bg-[#0e0e0f]">
          <div>
            <h1 className="text-2xl font-bold text-[#e5e2e3] mb-1">
              URL Infrastructure & Telemetry
            </h1>
            <p className="text-[#c6c5d8] font-mono text-xs opacity-80">
              High-performance link shortening, Redis caching & click tracking
            </p>
          </div>

          {/* Summary Metrics */}
          <div className="flex gap-4 bg-[#101112] border border-[#232426] rounded p-2">
            <div className="px-4 py-1 border-r border-[#1B1C1E]">
              <div className="text-[10px] font-semibold text-[#c6c5d8] uppercase tracking-widest mb-1">
                Total Links
              </div>
              <div className="text-xl font-bold text-[#e5e2e3] flex items-center gap-2">
                <span className="status-dot status-amber"></span> {urls.length}
              </div>
            </div>

            <div className="px-4 py-1 border-r border-[#1B1C1E]">
              <div className="text-[10px] font-semibold text-[#c6c5d8] uppercase tracking-widest mb-1">
                Total Clicks
              </div>
              <div className="text-xl font-bold text-[#e5e2e3] flex items-center gap-2">
                <span className="status-dot status-green"></span> {totalClicks}
              </div>
            </div>

            <div className="px-4 py-1">
              <div className="text-[10px] font-semibold text-[#c6c5d8] uppercase tracking-widest mb-1">
                Cache Status
              </div>
              <div className="text-xl font-bold text-[#50d8e9] flex items-center gap-2">
                <span className="status-dot status-green"></span> Active
              </div>
            </div>
          </div>
        </div>

        {/* Content Split: Creation Bar + Table + Right Drawer */}
        <div className="flex-1 flex overflow-hidden flex-col lg:flex-row">
          {/* Main Queue & Creation Area */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar border-r border-[#1B1C1E] flex flex-col gap-6">
            {/* Create Short URL Form */}
            <div className="bg-[#101112] border border-[#232426] rounded p-5">
              <h2 className="text-sm uppercase tracking-wider font-semibold text-[#9A9DA3] mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#5E6BFF]">
                  link
                </span>
                Create New Short URL
              </h2>
              <form onSubmit={handleCreate} className="flex gap-3">
                <input
                  id="create-link-input"
                  type="url"
                  required
                  placeholder="https://example.com/very-long-destination-url"
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                  className="flex-1 bg-[#070708] border border-[#1B1C1E] rounded px-4 py-2.5 text-sm text-[#e5e2e3] placeholder:text-[#454655] focus:border-[#5E6BFF] focus:outline-none font-mono"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-white hover:bg-zinc-200 text-black px-6 py-2.5 rounded text-xs font-bold uppercase tracking-wider disabled:opacity-50 transition-colors"
                >
                  {submitting ? "Shortening..." : "Shorten URL"}
                </button>
              </form>

              {error && (
                <p className="text-xs text-red-400 mt-2 font-mono">{error}</p>
              )}
            </div>

            {/* Table Controls */}
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[#c6c5d8] text-[16px]">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search short code or URL..."
                    className="bg-[#101112] border border-[#1B1C1E] rounded pl-8 pr-3 py-1.5 text-xs w-64 focus:border-[#5E6BFF] focus:outline-none text-[#e5e2e3] placeholder:text-[#454655] font-mono"
                  />
                </div>
              </div>

              <button
                onClick={loadUrls}
                className="bg-[#101112] border border-[#1B1C1E] rounded px-3 py-1.5 text-xs text-[#e5e2e3] hover:bg-[#151617] flex items-center gap-2 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">
                  refresh
                </span>{" "}
                Refresh List
              </button>
            </div>

            {/* Link Table */}
            <div className="w-full bg-[#101112] border border-[#1B1C1E] rounded overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#151617] border-b border-[#1B1C1E]">
                    <th className="py-2.5 px-3 text-[10px] text-[#c6c5d8] uppercase tracking-widest font-semibold w-8"></th>
                    <th className="py-2.5 px-3 text-[10px] text-[#c6c5d8] uppercase tracking-widest font-semibold">
                      Short Code
                    </th>
                    <th className="py-2.5 px-3 text-[10px] text-[#c6c5d8] uppercase tracking-widest font-semibold">
                      Original Destination URL
                    </th>
                    <th className="py-2.5 px-3 text-[10px] text-[#c6c5d8] uppercase tracking-widest font-semibold">
                      Clicks
                    </th>
                    <th className="py-2.5 px-3 text-[10px] text-[#c6c5d8] uppercase tracking-widest font-semibold text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="font-mono text-xs">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-8 text-center text-[#c6c5d8]"
                      >
                        Loading links telemetry...
                      </td>
                    </tr>
                  ) : filteredUrls.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-8 text-center text-[#c6c5d8]"
                      >
                        No shortened URLs found. Create one above!
                      </td>
                    </tr>
                  ) : (
                    filteredUrls.map((item) => {
                      const isSelected =
                        selectedUrl?.shortCode === item.shortCode;
                      return (
                        <tr
                          key={item.shortCode}
                          onClick={() => setSelectedUrl(item)}
                          className={`border-b border-[#1B1C1E] hover:bg-[#151617] cursor-pointer transition-colors h-[44px] ${
                            isSelected
                              ? "bg-[#151617] border-l-2 border-l-[#5E6BFF]"
                              : ""
                          }`}
                        >
                          <td className="py-2 px-3 text-center">
                            <span className="status-dot status-green"></span>
                          </td>
                          <td className="py-2 px-3 text-[#50d8e9] font-bold">
                            /{item.shortCode}
                          </td>
                          <td className="py-2 px-3 text-[#c6c5d8] max-w-md truncate">
                            {item.longUrl}
                          </td>
                          <td className="py-2 px-3 text-[#e5e2e3]">
                            {item.clickCount ?? item.clicks ?? 0}
                          </td>
                          <td className="py-2 px-3 text-right">
                            <div
                              className="flex justify-end gap-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => handleCopy(item.shortCode)}
                                className="px-2 py-1 bg-[#191A1C] hover:bg-[#25272a] border border-[#232426] rounded text-[10px] text-[#e5e2e3] font-sans"
                              >
                                {copiedCode === item.shortCode
                                  ? "Copied!"
                                  : "Copy"}
                              </button>
                              <button
                                onClick={() => handleDelete(item.shortCode)}
                                className="px-2 py-1 bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 rounded text-[10px] text-red-400 font-sans"
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

          {/* Detail Drawer (Right Side) */}
          <div className="w-full lg:w-96 bg-[#131314] flex flex-col h-full border-t lg:border-t-0 border-[#1B1C1E] z-10">
            {selectedUrl ? (
              <>
                {/* Detail Header */}
                <div className="p-6 border-b border-[#1B1C1E] bg-[#101112]">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="status-dot status-amber"></span>
                      <span className="text-xs font-mono text-[#c6c5d8]">
                        /{selectedUrl.shortCode}
                      </span>
                    </div>
                    <a
                      href={`http://localhost:4000/${selectedUrl.shortCode}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#c6c5d8] hover:text-white transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        open_in_new
                      </span>
                    </a>
                  </div>
                  <h3 className="text-lg font-bold text-[#e5e2e3] mb-1">
                    http://localhost:4000/{selectedUrl.shortCode}
                  </h3>
                  <div className="text-xs text-[#c6c5d8] font-mono break-all line-clamp-2">
                    {selectedUrl.longUrl}
                  </div>
                </div>

                {/* Detail Content */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar flex flex-col gap-6 bg-[#0e0e0f]">
                  {/* Context Section */}
                  <section>
                    <h4 className="text-xs font-semibold text-[#c6c5d8] uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px]">
                        info
                      </span>{" "}
                      Telemetry Specs
                    </h4>
                    <div className="bg-[#151617] border border-[#1B1C1E] rounded p-3 grid grid-cols-2 gap-y-3 gap-x-4">
                      <div>
                        <div className="text-[10px] text-[#454655] uppercase mb-1">
                          Short Code
                        </div>
                        <div className="text-xs text-[#e5e2e3] font-mono">
                          {selectedUrl.shortCode}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[#454655] uppercase mb-1">
                          Total Clicks
                        </div>
                        <div className="text-xs text-[#50d8e9] font-mono font-bold">
                          {selectedUrl.clickCount ?? selectedUrl.clicks ?? 0}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[#454655] uppercase mb-1">
                          Cache Layer
                        </div>
                        <div className="text-xs text-[#50d8e9] font-mono">
                          Redis L1
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[#454655] uppercase mb-1">
                          Storage
                        </div>
                        <div className="text-xs text-[#e5e2e3] font-mono">
                          MongoDB
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Quick Actions */}
                  <section>
                    <h4 className="text-xs font-semibold text-[#c6c5d8] uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px]">
                        bolt
                      </span>{" "}
                      Link Actions
                    </h4>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleCopy(selectedUrl.shortCode)}
                        className="bg-[#151617] border border-[#1B1C1E] rounded p-3 text-left hover:border-[#454655] transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px] text-[#5E6BFF]">
                            content_copy
                          </span>
                          <span className="text-xs text-[#e5e2e3]">
                            Copy Short URL
                          </span>
                        </div>
                        <span className="text-[10px] text-[#c6c5d8] font-mono">
                          {copiedCode === selectedUrl.shortCode
                            ? "COPIED"
                            : "COPY"}
                        </span>
                      </button>

                      <Link
                        href="/dashboard/stats"
                        className="bg-[#151617] border border-[#1B1C1E] rounded p-3 text-left hover:border-[#454655] transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px] text-[#50d8e9]">
                            bar_chart
                          </span>
                          <span className="text-xs text-[#e5e2e3]">
                            View Detailed Analytics
                          </span>
                        </div>
                        <span className="text-[10px] text-[#c6c5d8] font-mono">
                          OPEN
                        </span>
                      </Link>
                    </div>
                  </section>
                </div>

                {/* Sticky Action Footer */}
                <div className="p-4 bg-[#101112] border-t border-[#1B1C1E]">
                  <button
                    onClick={() => handleDelete(selectedUrl.shortCode)}
                    className="w-full bg-red-950/50 border border-red-800/50 text-red-400 rounded py-2 text-xs font-semibold hover:bg-red-900/60 transition-colors flex justify-center items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      delete
                    </span>{" "}
                    Delete Link
                  </button>
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-[#c6c5d8] text-xs">
                Select a link from the table to view details
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
