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
    // use by pdf-viewer.tsx
    turbo: {
      resolveAlias: {
        canvas: "./empty-module.ts",
      },
    },
  },
  rewrites: async () => {
    return [
      {
        source: "/api/agent-proxy/:path*",
        destination: `${process.env.NEXT_PUBLIC_AGENT_URL || "http://localhost:7777"}/v1/playground/:path*`,
      },
    ];
  },
};

export default nextConfig;
