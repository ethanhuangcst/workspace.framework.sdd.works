import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  transpilePackages: ["@sdd/paths"],
  async rewrites() {
    return [{ source: "/agent-setup", destination: "/api/agent-setup" }];
  },
};

export default nextConfig;
