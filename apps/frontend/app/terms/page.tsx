import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function TermsPage() {
  return (
    <div className="bg-[#070708] text-[#e5e2e3] font-body-md antialiased selection:bg-[#5E6BFF] selection:text-white min-h-screen">
      <Navbar />

      <main className="max-w-[1000px] mx-auto pt-[120px] pb-20 px-6 sm:px-8 space-y-8">
        <div className="border-b border-[#232426] pb-6 space-y-2">
          <span className="text-xs font-mono text-[#5E6BFF] uppercase tracking-[0.2em]">Legal & Compliance</span>
          <h1 className="text-4xl font-bold text-white">Terms of Service & Acceptable Use</h1>
          <p className="text-sm text-[#71717A]">Last updated: August 2026</p>
        </div>

        <div className="space-y-6 text-[#9A9DA3] text-sm leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-white">1. Acceptable Use Policy</h2>
            <p>
              Romer provides high-performance URL shortening and real-time click telemetry services. You agree not to use Romer links to distribute malware, phishing campaigns, deceptive content, or illicit materials.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-white">2. Rate Limits & Telemetry Fair Use</h2>
            <p>
              Free accounts are subject to standard API rate limits. Enterprise telemetry streaming and high-volume redirect pipelines require an active Romer tier subscription.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-white">3. Analytics & Data Privacy</h2>
            <p>
              Click telemetry collected by Romer is aggregated and processed securely. We strictly comply with global privacy standards and do not sell link redirect metrics to third-party ad brokers.
            </p>
          </section>
        </div>

        <div className="pt-6 border-t border-[#232426]">
          <Link href="/" className="text-sm text-[#5E6BFF] hover:underline flex items-center gap-1 font-medium">
            &larr; Return to Romer Platform
          </Link>
        </div>
      </main>
    </div>
  );
}