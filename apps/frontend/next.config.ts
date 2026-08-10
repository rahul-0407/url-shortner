import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://url-shortner-production-4773.up.railway.app/api/:path*",
      },
    ];
  },
};

export default nextConfig;
