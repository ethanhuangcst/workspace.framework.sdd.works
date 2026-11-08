import { defineConfig } from "vitest/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    env: {
      SESSION_SECRET:
        process.env.SESSION_SECRET ?? "ci-session-secret-at-least-16",
      DATABASE_URL:
        process.env.DATABASE_URL ??
        "postgresql://framework_sdd:framework_sdd@localhost:5435/framework_sdd",
      KEYS_ENCRYPTION_KEY:
        process.env.KEYS_ENCRYPTION_KEY ??
        "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    },
    include: [
      "app/**/*.test.ts",
      "app/**/*.test.tsx",
      "app/shared/packages/**/*.test.ts",
    ],
    exclude: ["node_modules", "**/.next", "app/web/e2e"],
  },
  resolve: {
    alias: {
      "@web": path.resolve(root, "./app/web"),
      "@mcp": path.resolve(root, "./app/mcp"),
      "@shared": path.resolve(root, "./app/shared"),
      "@sdd/paths": path.resolve(root, "./app/shared/packages/sdd-paths"),
    },
  },
});
