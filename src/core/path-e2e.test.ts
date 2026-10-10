/**
 * Automated equivalent of mcp-tests.md §5 (VERIF-01).
 * Uses temp HOME + HTTP install plan — no operator Mac session required.
 */
import { afterEach, describe, expect, it } from "vitest";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { clearPathDetectCache, detectClient } from "./path-detect";
import {
  MANIFEST_FILENAME,
  packageTarPath,
  unpackedDir,
} from "./sync/paths";
import { parseToolJson } from "./tools/errors";
import { installFrameworkHttp } from "./tools/install-http";
import { applyPlannedFiles, writeLedgerFile } from "./tools/apply-plan";
import type { InstallPlan } from "./tools/install-plan";

type InstallHttpBody = {
  plan: InstallPlan;
  manifest?: Parameters<typeof writeLedgerFile>[1];
  root?: string;
  resolution_source?: string;
};

const originalCacheDir = process.env.SDD_PACKAGE_CACHE_DIR;

function seedCache(sha: string): string {
  const dir = mkdtempSync(join(tmpdir(), "sdd-path-e2e-cache-"));
  process.env.SDD_PACKAGE_CACHE_DIR = dir;
  const unpacked = unpackedDir(sha);
  mkdirSync(join(unpacked, "skills/tdd"), { recursive: true });
  mkdirSync(join(unpacked, "rules"), { recursive: true });
  writeFileSync(join(unpacked, "skills/tdd/SKILL.md"), "# tdd\n");
  writeFileSync(join(unpacked, "rules/sdd-dod.mdc"), "# dod\n");
  writeFileSync(packageTarPath(sha), "tar");
  writeFileSync(
    join(dir, MANIFEST_FILENAME),
    JSON.stringify({
      latestCommit: sha,
      latestVersion: "main",
      versions: [{ id: "main", commitSha: sha }],
      inventory: { skills: ["tdd"], rules: ["dod"], agents: [], workflows: [], other: [] },
      syncedAt: "2026-01-01T00:00:00.000Z",
    }),
  );
  return dir;
}

async function installAndApply(
  sha: string,
  args: Parameters<typeof installFrameworkHttp>[0],
  ctx: Parameters<typeof installFrameworkHttp>[1],
) {
  const result = await installFrameworkHttp(args, ctx);
  const body = parseToolJson<InstallHttpBody>(result);
  if (result.isError || body.plan.action !== "apply") return body;
  const clientRoot = body.root ?? join(ctx.home ?? "", ".cursor");
  applyPlannedFiles(unpackedDir(sha), clientRoot, body.plan);
  if (body.manifest) writeLedgerFile(clientRoot, body.manifest);
  return body;
}

afterEach(() => {
  clearPathDetectCache();
  if (originalCacheDir === undefined) {
    delete process.env.SDD_PACKAGE_CACHE_DIR;
  } else {
    process.env.SDD_PACKAGE_CACHE_DIR = originalCacheDir;
  }
});

describe("path determination E2E (§5 automated)", () => {
  it("test1_cursor_auto_detect_maps_clientInfo_name", () => {
    expect(detectClient({ name: "cursor" })).toBe("cursor");
    expect(detectClient({ name: "Cursor" })).toBe("cursor");
  });

  it("test2_CLAUDE_CONFIG_DIR_relocation", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-path-e2e-claude-"));
    mkdirSync(join(home, "skills"), { recursive: true });
    const sha = "sha-claude";
    seedCache(sha);
    const body = await installAndApply(
      sha,
      { client: "claude", os: "darwin" },
      {
        channel: "http",
        home,
        userProfile: home,
        env: { HOME: home, CLAUDE_CONFIG_DIR: home },
        skipLlm: true,
      },
    );
    expect(body.resolution_source).toBe("seed");
    expect(body.root).toBe(`${home}/.claude`);
    expect(existsSync(join(home, ".claude/skills/tdd/SKILL.md"))).toBe(true);
    rmSync(home, { recursive: true, force: true });
  });

  it("test3_CODEX_HOME_relocation", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-path-e2e-codex-"));
    const sha = "sha-codex";
    seedCache(sha);
    const body = await installAndApply(
      sha,
      { client: "codex", os: "darwin" },
      {
        channel: "http",
        home,
        userProfile: home,
        env: { HOME: home, CODEX_HOME: home },
        skipLlm: true,
      },
    );
    expect(body.resolution_source).toBe("seed");
    expect(body.root).toBe(`${home}/.agents`);
    rmSync(home, { recursive: true, force: true });
  });

  it("test4_seed_fallback_without_env", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-path-e2e-seed-"));
    const sha = "sha-seed";
    seedCache(sha);
    const body = await installAndApply(
      sha,
      { client: "cursor", os: "darwin" },
      {
        channel: "http",
        home,
        userProfile: home,
        env: { HOME: home },
        skipLlm: true,
      },
    );
    expect(body.resolution_source).toBe("seed");
    expect(body.root).toBe(`${home}/.cursor`);
    rmSync(home, { recursive: true, force: true });
  });

  it("test5_unrecognized_client_fails_closed", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-path-e2e-unknown-"));
    seedCache("sha-unknown");
    const before = readdirSync(home);
    const result = await installFrameworkHttp(
      {},
      {
        channel: "http",
        clientInfo: { name: "unknown-cli-xyz" },
        home,
        userProfile: home,
        env: { HOME: home },
        skipLlm: true,
      },
    );
    const body = parseToolJson<{ error?: { code: string } }>(result);
    expect(body.error?.code).toBe("client_unknown");
    expect(readdirSync(home)).toEqual(before);
    rmSync(home, { recursive: true, force: true });
  });
});
