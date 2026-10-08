#!/usr/bin/env node
/**
 * Regenerate admin note mockup HTML from src/content/.admin-note.md
 * (same renderPortalMarkdown pipeline as portal content tabs).
 *
 * Run: npx tsx scripts/sync-admin-note-mockup.mjs
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const dir = dirname(fileURLToPath(import.meta.url));
const root = join(dir, "..");
const inline = join(dir, "sync-admin-note-mockup.inline.ts");
const result = spawnSync("npx", ["tsx", inline], {
  cwd: root,
  stdio: "inherit",
});
process.exit(result.status ?? 1);
