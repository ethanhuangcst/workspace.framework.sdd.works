import type { NextConfig } from "next";
import { SETUP_REDIRECTS, SETUP_REWRITES } from "./src/mcp/setup-paths";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  transpilePackages: ["@sdd/paths"],
  async redirects() {
    return [...SETUP_REDIRECTS];
  },
  async rewrites() {
    return [...SETUP_REWRITES];
  },
};

export default nextConfig;
