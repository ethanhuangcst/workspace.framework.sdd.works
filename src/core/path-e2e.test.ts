/**
 * Automated equivalent of mcp-test.md §5 (VERIF-01).
 * Uses temp HOME + installFramework — no operator Mac session required.
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
import { setPackageFetchForTests } from "./tools/package-fetch";
import {
  MANIFEST_FILENAME,
  packageTarPath,
  unpackedDir,
} from "./sync/paths";
import { parseToolJson } from "./tools/errors";
import { installFramework } from "./tools/install";

const originalCacheDir = process.env.SDD_PACKAGE_CACHE_DIR;

function seedCache(sha: string): string {
  const dir = mkdtempSync(join(tmpdir(), "sdd-path-e2e-cache-"));
  process.env.SDD_PACKAGE_CACHE_DIR = dir;
  const unpacked = unpackedDir(sha);
  mkdirSync(join(unpacked, "skills/tdd"), { recursive: true });
  mkdirSync(join(unpacked, "rules"), { recursive: true });
  writeFileSync(join(unpacked, "skills/tdd/SKILL.md"), "# tdd\n");
  writeFileSync(join(unpacked, "rules/dod.mdc"), "# dod\n");
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
  setPackageFetchForTests(async () => ({
    version: "main",
    tempDir: unpacked,
    commitSha: sha,
  }));
  return dir;
}

afterEach(() => {
  clearPathDetectCache();
  setPackageFetchForTests(null);
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
    seedCache("sha-claude");
    const result = await installFramework(
      { client: "claude", os: "darwin" },
      {
        channel: "stdio",
        home,
        userProfile: home,
        env: { HOME: home, CLAUDE_CONFIG_DIR: home },
        skipLlm: true,
      },
    );
    const body = parseToolJson<{
      resolution_source?: string;
      paths?: { skills?: string };
      error?: { code: string };
    }>(result);
    expect(body.error?.code).not.toBe("client_unknown");
    expect(body.resolution_source).toBe("env");
    expect(body.paths?.skills).toBe(`${home}/skills/`);
    expect(existsSync(join(home, "skills/tdd/SKILL.md"))).toBe(true);
    rmSync(home, { recursive: true, force: true });
  });

  it("test3_CODEX_HOME_relocation", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-path-e2e-codex-"));
    seedCache("sha-codex");
    const result = await installFramework(
      { client: "codex", os: "darwin" },
      {
        channel: "stdio",
        home,
        userProfile: home,
        env: { HOME: home, CODEX_HOME: home },
        skipLlm: true,
      },
    );
    const body = parseToolJson<{
      resolution_source?: string;
      paths?: { skills?: string };
    }>(result);
    expect(body.resolution_source).toBe("env");
    expect(body.paths?.skills).toContain(home);
    rmSync(home, { recursive: true, force: true });
  });

  it("test4_seed_fallback_without_env", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-path-e2e-seed-"));
    seedCache("sha-seed");
    const result = await installFramework(
      { client: "cursor", os: "darwin" },
      {
        channel: "stdio",
        home,
        userProfile: home,
        env: { HOME: home },
        skipLlm: true,
      },
    );
    const body = parseToolJson<{
      resolution_source?: string;
      paths?: { skills?: string };
    }>(result);
    expect(body.resolution_source).toBe("seed");
    expect(body.paths?.skills).toBe(`${home}/.cursor/skills/`);
    rmSync(home, { recursive: true, force: true });
  });

  it("test5_unrecognized_client_fails_closed", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-path-e2e-unknown-"));
    seedCache("sha-unknown");
    const before = readdirSync(home);
    const result = await installFramework(
      {},
      {
        channel: "stdio",
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
