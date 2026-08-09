import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <div className="bg-[#070708] text-[#e5e2e3] font-body-md antialiased selection:bg-[#5E6BFF] selection:text-white min-h-screen">
      <Navbar />

      <main className="max-w-[1728px] mx-auto mt-20">
        <section className="px-8 relative pt-24 lg:pt-32 pb-20">
          <div className="max-w-379 mx-auto">
            <div className="flex flex-col lg:flex-row justify-between lg:items-end mb-12 gap-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5E6BFF]/10 border border-[#5E6BFF]/25 text-[#bec2ff] text-xs font-medium mb-6">
                  <span className="w-2 h-2 rounded-full bg-[#50d8e9] animate-pulse"></span>
                  Fast, Intelligent URL Shortener & Analytics
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-[72px] font-bold text-[#e5e2e3] mb-6 max-w-250 leading-[1.1] tracking-[-0.04em]">
                  Shorten Links.
                  <br />
                  Track Clicks. Grow Reach.
                </h1>
                <p className="text-lg text-[#9A9DA3] mb-8 max-w-2xl leading-relaxed">
                  Romer turns long, unwieldy URLs into clean, memorable short links with real-time click analytics, QR code generation, and custom alias management.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/login?mode=signup"
                    className="bg-white text-black px-7 py-3.5 rounded-xl text-base font-bold hover:bg-zinc-200 transition-colors inline-block shadow-lg shadow-white/10"
                  >
                    Shorten a Link Now
                  </Link>
                  <Link
                    href="/dashboard"
                    className="bg-[#1a1b1d] border border-[#232426] text-[#e5e2e3] px-7 py-3.5 rounded-xl text-base hover:bg-[#232426] transition-colors inline-block font-medium"
                  >
                    Explore Dashboard
                  </Link>
                </div>
              </div>

              <div className="hidden lg:block text-right pb-2">
                <Link
                  className="text-[#9A9DA3] font-mono text-xs hover:text-[#bec2ff] flex items-center gap-1.5 justify-end group"
                  href="/dashboard"
                >
                  <span>Live Link Analytics Terminal</span>
                  <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>

            <div className="w-full bg-[#050505] rounded-2xl border border-white/8 overflow-hidden flex flex-col lg:flex-row h-auto lg:h-155 shadow-2xl relative">
              <div className="flex w-full h-full flex-col lg:flex-row">
                <div className="w-full lg:w-75 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col bg-[#070708]">
                  <div className="p-6 border-b border-white/5">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-2 h-2 rounded-full bg-[#50d8e9] shadow-[0_0_8px_rgba(80,216,233,0.5)]"></div>
                      <span className="text-[11px] font-mono text-[#e5e2e3] font-bold tracking-widest uppercase">
                        URL_SHORTENER_ENGINE
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-[#50d8e9] tracking-[0.15em] ml-5">
                      STATUS: ACTIVE & ONLINE
                    </div>
                  </div>

                  <div className="flex-1 p-6 flex flex-col gap-8">
                    <div>
                      <span className="text-[10px] font-mono text-[#9A9DA3] uppercase tracking-[0.15em] block mb-2 border-b border-white/5 pb-2">
                        TOTAL SHORT LINKS
                      </span>
                      <div className="flex justify-between items-end mb-1">
                        <span className="text-[24px] font-mono text-[#e5e2e3] font-semibold leading-none">
                          1,429,812
                        </span>
                        <span className="text-[10px] font-mono text-[#50d8e9]">ACTIVE</span>
                      </div>
                      <svg className="w-full h-8 mt-2" preserveAspectRatio="none" viewBox="0 0 100 20">
                        <path
                          d="M0,15 L10,12 L20,18 L30,5 L40,10 L50,8 L60,14 L70,2 L80,12 L90,8 L100,10"
                          fill="none"
                          opacity="0.6"
                          stroke="#50d8e9"
                          strokeWidth="1.5"
                        ></path>
                      </svg>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-[#9A9DA3] uppercase tracking-[0.15em] block mb-2 border-b border-white/5 pb-2">
                        TOTAL CLICKS TRACKED
                      </span>
                      <div className="flex justify-between items-end mb-1">
                        <span className="text-[24px] font-mono text-[#e5e2e3] font-semibold leading-none">
                          8,942,105
                        </span>
                        <span className="text-[10px] font-mono text-[#5E6BFF]">+14.2%</span>
                      </div>
                      <svg className="w-full h-8 mt-2" preserveAspectRatio="none" viewBox="0 0 100 20">
                        <path
                          d="M0,10 L10,8 L20,12 L30,4 L40,15 L50,5 L60,10 L70,8 L80,12 L90,6 L100,8"
                          fill="none"
                          opacity="0.6"
                          stroke="#5E6BFF"
                          strokeWidth="1.5"
                        ></path>
                      </svg>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-[#9A9DA3] uppercase tracking-[0.15em] block mb-2 border-b border-white/5 pb-2">
                        AVG REDIRECT SPEED
                      </span>
                      <div className="flex justify-between items-end mb-1">
                        <span className="text-[24px] font-mono text-[#e5e2e3] font-semibold leading-none">
                          0.84 ms
                        </span>
                        <span className="text-[10px] font-mono text-[#50d8e9]">SUB-MS</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex flex-col relative bg-[#050505] min-h-75">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.015) 1px, transparent 1px)",
                      backgroundSize: "80px 80px",
                    }}
                  ></div>
                  <div className="flex justify-between items-center px-8 py-5 border-b border-white/5 z-10 bg-[#050505]/80 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-[#50d8e9]"></span>
                      <span className="text-[11px] font-mono text-[#e5e2e3] uppercase tracking-widest font-semibold">
                        REAL-TIME CLICK ANALYTICS // PAST 24 HOURS
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-mono text-[#9A9DA3] uppercase tracking-[0.15em]">
                        REDIRECT ENGINE: OPTIMAL
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 relative p-8 z-10 flex flex-col justify-end pb-14">
                    <div className="absolute inset-0 px-8 py-12 flex flex-col justify-between pointer-events-none">
                      <div className="border-t border-white/3 w-full relative">
                        <span className="absolute -top-3 -left-2 text-[9px] font-mono text-[#9A9DA3]">100K Clicks</span>
                      </div>
                      <div className="border-t border-white/3 w-full relative">
                        <span className="absolute -top-3 -left-2 text-[9px] font-mono text-[#9A9DA3]">50K Clicks</span>
                      </div>
                      <div className="border-t border-white/3 w-full relative">
                        <span className="absolute -top-3 -left-2 text-[9px] font-mono text-[#9A9DA3]">0 Clicks</span>
                      </div>
                    </div>

                    <div className="absolute inset-0 px-8 py-12">
                      <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 400">
                        <path
                          d="M0,250 C150,250 250,150 400,150 C550,150 650,300 800,300 C950,300 1000,200 1000,200"
                          fill="none"
                          stroke="#50d8e9"
                          strokeWidth="2"
                        ></path>
                        <path
                          d="M0,250 C150,250 250,150 400,150 C550,150 650,300 800,300 C950,300 1000,200 1000,200 L1000,400 L0,400 Z"
                          fill="url(#primary-fade)"
                          opacity="0.15"
                        ></path>
                        <circle cx="400" cy="150" fill="#050505" r="4" stroke="#50d8e9" strokeWidth="2"></circle>
                        <circle cx="800" cy="300" fill="#050505" r="4" stroke="#50d8e9" strokeWidth="2"></circle>

                        <g transform="translate(415, 140)">
                          <text fill="#50d8e9" fontFamily="Inter" fontSize="10" fontWeight="600">
                            CAMPAIGN LAUNCH PEAK
                          </text>
                          <line opacity="0.6" stroke="#50d8e9" strokeWidth="1" x1="-12" x2="-6" y1="12" y2="6"></line>
                        </g>
                        <g transform="translate(815, 290)">
                          <text fill="#50d8e9" fontFamily="Inter" fontSize="10" fontWeight="600">
                            ORGANIC CLICK TRAFFIC
                          </text>
                          <line opacity="0.6" stroke="#50d8e9" strokeWidth="1" x1="-12" x2="-6" y1="12" y2="6"></line>
                        </g>

                        <defs>
                          <linearGradient id="primary-fade" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#50d8e9" stopOpacity="1"></stop>
                            <stop offset="100%" stopColor="#50d8e9" stopOpacity="0"></stop>
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>

                    <div className="absolute bottom-4 left-8 right-8 flex justify-between text-[9px] font-mono text-[#9A9DA3] uppercase tracking-[0.15em] z-20">
                      <span>12:00 AM</span>
                      <span>06:00 AM</span>
                      <span>12:00 PM</span>
                      <span>06:00 PM</span>
                      <span>NOW</span>
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-[320px] border-t lg:border-t-0 lg:border-l border-white/5 flex flex-col bg-[#070708]">
                  <div className="p-6 border-b border-white/5">
                    <span className="text-[10px] font-mono text-[#9A9DA3] uppercase tracking-[0.15em] block mb-4">
                      SYSTEM MODULE STATUS
                    </span>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-2.5 border border-white/5 bg-[#0a0a0b] rounded-lg">
                        <div className="flex items-center gap-2.5">
                          <div className="w-2 h-2 rounded-full bg-[#50d8e9]"></div>
                          <span className="text-[11px] font-mono text-white">URL SHORTENER</span>
                        </div>
                        <span className="text-[10px] font-mono text-[#50d8e9]">OK // 100%</span>
                      </div>
                      <div className="flex justify-between items-center p-2.5 border border-white/5 bg-[#0a0a0b] rounded-lg">
                        <div className="flex items-center gap-2.5">
                          <div className="w-2 h-2 rounded-full bg-[#5E6BFF]"></div>
                          <span className="text-[11px] font-mono text-white">CLICK TRACKER</span>
                        </div>
                        <span className="text-[10px] font-mono text-[#5E6BFF]">ACTIVE</span>
                      </div>
                      <div className="flex justify-between items-center p-2.5 border border-white/5 bg-[#0a0a0b] rounded-lg">
                        <div className="flex items-center gap-2.5">
                          <div className="w-2 h-2 rounded-full bg-[#50d8e9]"></div>
                          <span className="text-[11px] font-mono text-white">QR GENERATOR</span>
                        </div>
                        <span className="text-[10px] font-mono text-[#50d8e9]">READY</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col bg-[#050505]">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-mono text-[#9A9DA3] uppercase tracking-[0.15em]">
                        LIVE CLICK STREAM
                      </span>
                      <span className="text-[9px] font-mono text-[#50d8e9] border border-[#50d8e9]/30 px-2 py-0.5 rounded bg-[#50d8e9]/10">
                        LIVE
                      </span>
                    </div>
                    <div className="space-y-4">
                      <div className="p-3 rounded-lg border border-white/5 bg-[#0c0c0e] space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-mono text-[#9A9DA3]">
                          <span>08:42:11 AM</span>
                          <span className="text-[#50d8e9]">DIRECT CLICK</span>
                        </div>
                        <p className="text-xs font-mono text-white font-medium">romer.app/summer-sale</p>
                      </div>

                      <div className="p-3 rounded-lg border border-white/5 bg-[#0c0c0e] space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-mono text-[#9A9DA3]">
                          <span>08:41:05 AM</span>
                          <span className="text-[#5E6BFF]">QR SCAN</span>
                        </div>
                        <p className="text-xs font-mono text-white font-medium">romer.app/launch2026</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-8 border-t border-[#232426] relative pt-24 pb-24">
          <div className="max-w-379 w-full mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-3">
              <span className="text-xs font-mono text-[#5E6BFF] uppercase tracking-[0.2em] px-3.5 py-1 bg-[#5E6BFF]/10 rounded-full border border-[#5E6BFF]/20">
                Core URL Shortener Features
              </span>
              <h2 className="text-3xl lg:text-5xl font-bold text-[#e5e2e3] tracking-tight">
                Everything you need to shorten & track your links
              </h2>
              <p className="text-base text-[#9A9DA3]">
                Powerful URL management built for individual creators, growth teams, and developers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="border border-[#232426] rounded-2xl p-8 bg-[#0c0c0e] relative flex flex-col justify-between hover:border-[#5E6BFF]/50 transition-all duration-300 group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#17171a] border border-[#232426] flex items-center justify-center mb-6 text-[#5E6BFF] group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-2xl">link</span>
                  </div>
                  <div className="font-mono text-[#5E6BFF] mb-2 text-xs font-semibold tracking-wider">
                    01 / SHORT & CUSTOM ALIASES
                  </div>
                  <h3 className="text-xl font-bold text-[#e5e2e3] mb-3 group-hover:text-white transition-colors">
                    Instant Link Shortening
                  </h3>
                  <p className="text-[#9A9DA3] text-sm leading-relaxed">
                    Transform long, clunky URLs into short, memorable links. Customize your short links with custom aliases to increase click-through rates.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-[#1a1b1d] text-xs font-mono text-[#71717A]">
                  • Custom Slugs • Sub-millisecond Redirects
                </div>
              </div>

              <div className="border border-[#232426] rounded-2xl p-8 bg-[#0c0c0e] relative flex flex-col justify-between hover:border-[#50d8e9]/50 transition-all duration-300 group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#17171a] border border-[#232426] flex items-center justify-center mb-6 text-[#50d8e9] group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-2xl">monitoring</span>
                  </div>
                  <div className="font-mono text-[#50d8e9] mb-2 text-xs font-semibold tracking-wider">
                    02 / REAL-TIME ANALYTICS
                  </div>
                  <h3 className="text-xl font-bold text-[#e5e2e3] mb-3 group-hover:text-white transition-colors">
                    Deep Click Intelligence
                  </h3>
                  <p className="text-[#9A9DA3] text-sm leading-relaxed">
                    Track link performance as it happens. Inspect total clicks, referrers, geographic breakdown, device categories, and top performing links.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-[#1a1b1d] text-xs font-mono text-[#71717A]">
                  • Live Click Logs • Referrer Breakdown
                </div>
              </div>

              <div className="border border-[#232426] rounded-2xl p-8 bg-[#0c0c0e] relative flex flex-col justify-between hover:border-[#E5FD17]/50 transition-all duration-300 group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#17171a] border border-[#232426] flex items-center justify-center mb-6 text-[#E5FD17] group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-2xl">qr_code_2</span>
                  </div>
                  <div className="font-mono text-[#E5FD17] mb-2 text-xs font-semibold tracking-wider">
                    03 / AUTOMATED QR CODES
                  </div>
                  <h3 className="text-xl font-bold text-[#e5e2e3] mb-3 group-hover:text-white transition-colors">
                    Instant QR Generator
                  </h3>
                  <p className="text-[#9A9DA3] text-sm leading-relaxed">
                    Every shortened link automatically comes with a downloadable, high-resolution QR code perfect for print materials and mobile access.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-[#1a1b1d] text-xs font-mono text-[#71717A]">
                  • High-Res PNG • Vector Ready
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-8 border-t border-[#232426] flex items-center bg-[#050505] py-24">
          <div className="max-w-379 w-full mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 bg-[#D1EBEB] rounded-2xl p-10 flex flex-col justify-between h-90">
              <p className="text-2xl lg:text-3xl text-black font-bold leading-tight max-w-2xl">
                "Romer makes link sharing so simple. The real-time click tracking gives our marketing team exact insights on what content converts best."
              </p>
              <div>
                <div className="font-bold text-black text-lg">Sarah Jenkins</div>
                <div className="text-black/70 text-sm">Growth Lead, Northline Media</div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-[#C4FF44] rounded-2xl p-10 flex flex-col justify-between h-90">
              <p className="text-xl lg:text-2xl text-black font-bold leading-tight">
                "The fastest URL shortener we've used. Custom aliases, QR codes, and sub-millisecond redirects out of the box."
              </p>
              <div>
                <div className="font-bold text-black text-lg">David Chen</div>
                <div className="text-black/70 text-sm">Tech Director, Meridian Apps</div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-8 border-t border-[#232426] flex flex-col justify-center items-center text-center py-28 bg-[#070708]">
          <div className="max-w-2xl space-y-6">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#e5e2e3] tracking-tight">
              Start shortening links in seconds.
            </h2>
            <p className="text-lg text-[#9A9DA3]">
              Create your free Romer account and start tracking your links with instant click analytics.
            </p>
            <div className="flex justify-center gap-4 pt-2">
              <Link
                href="/login?mode=signup"
                className="bg-white text-black px-8 py-3.5 rounded-xl text-base font-bold hover:bg-zinc-200 transition-colors shadow-lg shadow-white/10"
              >
                Create Free Account
              </Link>
              <Link
                href="/contact"
                className="bg-transparent border border-[#232426] text-[#e5e2e3] px-8 py-3.5 rounded-xl text-base hover:bg-[#1a1b1d] transition-colors font-medium"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}