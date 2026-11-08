import type { NextConfig } from "next";

type SetupPaths = typeof import("./config/setup-paths");

// Resolved from this file's directory (not the process cwd), so the config
// loads no matter which directory the `next` command runs from.
function loadSetupPaths(): SetupPaths {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require(
    require.resolve("./config/setup-paths", { paths: [__dirname] }),
  ) as SetupPaths;
}

const { SETUP_REDIRECTS, SETUP_REWRITES } = loadSetupPaths();

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  outputFileTracingRoot: process.cwd(),
  transpilePackages: ["@sdd/paths"],
  async redirects() {
    return [...SETUP_REDIRECTS];
  },
  async rewrites() {
    return [...SETUP_REWRITES];
  },
};

export default nextConfig;
