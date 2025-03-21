import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["loremflickr.com"],
  },
  output: "standalone",
  // Add the packages in transpilePackages
  transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],
};

export default nextConfig;
