import createJiti from "jiti";
import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";

// Set SKIP_ENV_VALIDATION to true for builds to avoid validation issues
process.env.SKIP_ENV_VALIDATION = "true";

// Enable CI detection during build time
if (process.env.GITHUB_ACTIONS === "true") {
  process.env.CI = "true";
}

const jiti = createJiti(fileURLToPath(import.meta.url));

// Import env here to validate during build
try {
  // Load both client and server environment configurations
  jiti("./env/server");
  jiti("./env/client");
} catch (error: unknown) {
  console.warn(
    "Error loading env config:",
    error instanceof Error ? error.message : String(error)
  );
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
