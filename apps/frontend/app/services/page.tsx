import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function ServicesPage() {
  const services = [
    {
      title: "Intelligent Link Shortening",
      description: "Custom aliases, branded domains, and instant high-availability redirection with sub-millisecond cache resolution.",
      icon: "link",
    },
    {
      title: "Real-time Telemetry & Click Analytics",
      description: "Track click flux, geographical distribution, device metrics, and referral funnels live as traffic flows.",
      icon: "analytics",
    },
    {
      title: "Custom Domain Routing",
      description: "Connect your enterprise domains with automated SSL generation and edge TLS termination.",
      icon: "dns",
    },
    {
      title: "Developer API & Webhooks",
      description: "Programmatically generate short links, inspect real-time click streams, and integrate into automated workflows.",
      icon: "api",
    },
  ];

  return (
    <div className="bg-[#070708] text-[#e5e2e3] font-body-md antialiased selection:bg-[#5E6BFF] selection:text-white min-h-screen">
      <Navbar />

      <main className="max-w-[1400px] mx-auto pt-[120px] pb-20 px-6 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-mono text-[#5E6BFF] uppercase tracking-[0.2em] px-3 py-1 bg-[#5E6BFF]/10 rounded-full border border-[#5E6BFF]/20">
            Romer Infrastructure
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#e5e2e3] tracking-tight">
            High-Performance Link Services
          </h1>
          <p className="text-lg text-[#9A9DA3] leading-relaxed">
            Enterprise-grade URL management engine designed for high-scale applications, marketing telemetry, and developer APIs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="border border-[#232426] bg-[#0c0c0e] rounded-2xl p-8 hover:border-[#5E6BFF]/50 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#161619] border border-[#232426] flex items-center justify-center mb-6 text-[#50d8e9] group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl">{service.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-[#e5e2e3] mb-3 group-hover:text-white transition-colors">
                {service.title}
              </h3>
              <p className="text-[#9A9DA3] leading-relaxed text-sm">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 border border-[#232426] bg-[#0f0f12] rounded-2xl p-10 text-center space-y-6">
          <h2 className="text-2xl font-bold text-white">Ready to streamline your links?</h2>
          <p className="text-[#9A9DA3] max-w-xl mx-auto text-sm">
            Join thousands of teams leveraging Romer's click analytics and URL shortening engine.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Link
              href="/login?mode=signup"
              className="bg-white text-black px-6 py-3 rounded-lg font-bold text-sm hover:bg-zinc-200 transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              href="/contact"
              className="bg-[#1a1b1d] border border-[#232426] text-[#e5e2e3] px-6 py-3 rounded-lg font-medium text-sm hover:bg-[#232426] transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}