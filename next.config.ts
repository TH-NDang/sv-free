import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "loremflickr.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "svfree.services.wfip.tech",
      },
      {
        protocol: "https",
        hostname: "supabasekong-fgcg4kwc44g8k4kskw8k088o.services.wfip.tech",
      },
    ],
  },
  experimental: {
    ppr: "incremental",
  },
  crossOrigin: "anonymous",
};

export default nextConfig;
