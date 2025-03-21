import type { NextConfig } from "next";

// Set SKIP_ENV_VALIDATION to true for builds to avoid validation issues
process.env.SKIP_ENV_VALIDATION = "true";

// Enable CI detection during build time
if (process.env.GITHUB_ACTIONS === "true") {
  process.env.CI = "true";
}

const nextConfig: NextConfig = {
  images: {
    domains: ["loremflickr.com"],
  },
  output: "standalone",
  // Add the packages in transpilePackages
  transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],
};

export default nextConfig;
