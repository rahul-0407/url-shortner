"use client";

import Navbar from "@/components/Navbar";

export default function ContactPage() {
  return (
    <div className="bg-[#070708] text-[#e5e2e3] font-body-md antialiased selection:bg-[#5E6BFF] selection:text-white min-h-screen">
      <Navbar />

      <main className="max-w-350 mx-auto pt-30 pb-20 px-6 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <span className="text-xs font-mono text-[#5E6BFF] uppercase tracking-[0.2em] px-3 py-1 bg-[#5E6BFF]/10 rounded-full border border-[#5E6BFF]/20">
            Get In Touch
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#e5e2e3]">
            Talk to the Romer Team
          </h1>
          <p className="text-lg text-[#9A9DA3]">
            Have questions about custom plans, API integrations, or enterprise SLAs? We're here to help.
          </p>
        </div>

        <div className="max-w-xl mx-auto bg-[#0d0d0f] border border-[#232426] rounded-2xl p-8 shadow-2xl space-y-6">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-xs font-mono text-[#9A9DA3] uppercase tracking-wider mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Alex Morgan"
                className="w-full bg-[#141417] border border-[#232426] rounded-lg px-4 py-3 text-sm text-white placeholder-[#52525B] focus:outline-none focus:border-[#5E6BFF] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[#9A9DA3] uppercase tracking-wider mb-2">
                Work Email
              </label>
              <input
                type="email"
                placeholder="alex@company.com"
                className="w-full bg-[#141417] border border-[#232426] rounded-lg px-4 py-3 text-sm text-white placeholder-[#52525B] focus:outline-none focus:border-[#5E6BFF] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[#9A9DA3] uppercase tracking-wider mb-2">
                Message
              </label>
              <textarea
                rows={4}
                placeholder="Tell us about your URL shortening requirements or telemetry workload..."
                className="w-full bg-[#141417] border border-[#232426] rounded-lg px-4 py-3 text-sm text-white placeholder-[#52525B] focus:outline-none focus:border-[#5E6BFF] transition-colors resize-none"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-[#5E6BFF] hover:bg-[#4d5ceb] text-white font-semibold py-3 rounded-lg text-sm transition-colors shadow-lg shadow-[#5E6BFF]/25"
            >
              Send Message
            </button>
          </form>

          <div className="pt-6 border-t border-[#232426] text-center space-y-2">
            <p className="text-xs text-[#71717A]">
              Direct support email:{" "}
              <a href="mailto:support@romer.app" className="text-[#50d8e9] hover:underline">
                support@romer.app
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}