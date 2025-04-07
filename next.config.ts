import type { NextConfig } from "next";

// Set SKIP_ENV_VALIDATION to true for builds to avoid validation issues
process.env.SKIP_ENV_VALIDATION = "true";

// Enable CI detection during build time
if (process.env.GITHUB_ACTIONS === "true") {
  process.env.CI = "true";
}

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
  // use by pdf-viewer.tsx
  swcMinify: false,
};

export default nextConfig;
