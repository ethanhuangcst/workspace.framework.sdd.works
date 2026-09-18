/**
 * Freshness regression suite (ADR-055) — runs in default CI with fixtures.
 * Live GitHub scenarios: sync-e2e.test.ts (opt-in via SDD_E2E_GITHUB_REPO).
 */
import { createHmac } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST as webhookPost } from "@/app/api/github/webhook/route";
import { POST as cronPost } from "@/app/api/sync/cron/route";
import { clearPathDetectCache } from "@/core/path-detect";
import {
  setEnsureCacheFreshDepsForTests,
} from "@/core/sync/ensure-cache-fresh";
import { readPackageManifest } from "@/core/sync/manifest";
import {
  MANIFEST_FILENAME,
  packageTarPath,
  unpackedDir,
} from "@/core/sync/paths";
import {
  resetScheduledSyncIntervalForTests,
  startScheduledSyncInterval,
} from "@/core/sync/scheduled-sync";
import { parseToolJson } from "@/core/tools/errors";
import { installFramework } from "@/core/tools/install";
import { ensurePackageCacheFresh } from "./ensure-cache-fresh";
import { setSyncJobDepsForTests } from "./sync-job";

const runScheduledSyncMock = vi.fn();

vi.mock("./run-scheduled-sync", () => ({
  runScheduledSync: (...args: unknown[]) => runScheduledSyncMock(...args),
}));

const syncFrameworkRepoMock = vi.fn();
const clearListVersionsCacheMock = vi.fn();

vi.mock("./sync-job", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./sync-job")>();
  return {
    ...actual,
    syncFrameworkRepo: (...args: unknown[]) => syncFrameworkRepoMock(...args),
  };
});

vi.mock("@/core/tools/list-versions", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/core/tools/list-versions")>();
  return {
    ...actual,
    clearListVersionsCache: (...args: unknown[]) =>
      clearListVersionsCacheMock(...args),
  };
});

const originalCacheDir = process.env.SDD_PACKAGE_CACHE_DIR;
const originalGithubToken = process.env.GITHUB_TOKEN;
const originalWebhookSecret = process.env.GITHUB_WEBHOOK_SECRET;
const originalCronSecret = process.env.CRON_SECRET;

type HttpInstallBody = {
  packageUrl?: string;
  commitSha?: string;
  extract_recommended?: boolean;
  local_commit_matches?: boolean;
  cache_refresh?: string;
  cache_stale?: boolean;
  manifest?: { files: { skills: string[] } };
  error?: { code: string };
};

function seedCache(
  sha: string,
  version: string,
  skills: string[],
  syncedAt = new Date().toISOString(),
): string {
  const dir = mkdtempSync(join(tmpdir(), "sdd-fresh-reg-"));
  process.env.SDD_PACKAGE_CACHE_DIR = dir;
  mkdirSync(join(unpackedDir(sha), "skills"), { recursive: true });
  for (const skill of skills) {
    mkdirSync(join(unpackedDir(sha), "skills", skill), { recursive: true });
    writeFileSync(
      join(unpackedDir(sha), "skills", skill, "SKILL.md"),
      `# ${skill}\n`,
    );
  }
  writeFileSync(packageTarPath(sha), `tar-${sha}`);
  writeFileSync(
    join(dir, MANIFEST_FILENAME),
    JSON.stringify({
      latestCommit: sha,
      latestVersion: version,
      versions: [{ id: version, commitSha: sha }],
      inventory: {
        skills,
        rules: [],
        agents: [],
        workflows: [],
        other: [],
      },
      syncedAt,
    }),
  );
  return dir;
}

function httpInstall(
  home: string,
  args: {
    installed_commit?: string;
    installed_version?: string;
    force?: boolean;
  } = {},
): Promise<HttpInstallBody> {
  return installFramework(
    { client: "cursor", os: "darwin", ...args },
    {
      channel: "http",
      home,
      userProfile: home,
      env: { HOME: home },
      skipLlm: true,
    },
  ).then((r) => parseToolJson<HttpInstallBody>(r));
}

function writeLocalManifest(
  home: string,
  commit: string,
  version: string,
  skills: string[],
): void {
  mkdirSync(join(home, ".cursor"), { recursive: true });
  writeFileSync(
    join(home, ".cursor/.sdd-installed.json"),
    JSON.stringify({
      version: 1,
      package_version: version,
      package_commit: commit,
      installed_at: "2026-01-01T00:00:00.000Z",
      files: {
        skills,
        rules: [],
        agents: [],
        workflows: [],
      },
    }),
  );
}

function signWebhook(body: string, secret: string): string {
  const digest = createHmac("sha256", secret).update(body).digest("hex");
  return `sha256=${digest}`;
}

afterEach(() => {
  setEnsureCacheFreshDepsForTests(null);
  setSyncJobDepsForTests(null);
  clearPathDetectCache();
  resetScheduledSyncIntervalForTests();
  runScheduledSyncMock.mockReset();
  syncFrameworkRepoMock.mockReset();
  clearListVersionsCacheMock.mockReset();
  vi.useRealTimers();

  if (originalCacheDir === undefined) {
    delete process.env.SDD_PACKAGE_CACHE_DIR;
  } else {
    process.env.SDD_PACKAGE_CACHE_DIR = originalCacheDir;
  }
  if (originalGithubToken === undefined) {
    delete process.env.GITHUB_TOKEN;
  } else {
    process.env.GITHUB_TOKEN = originalGithubToken;
  }
  if (originalWebhookSecret === undefined) {
    delete process.env.GITHUB_WEBHOOK_SECRET;
  } else {
    process.env.GITHUB_WEBHOOK_SECRET = originalWebhookSecret;
  }
  if (originalCronSecret === undefined) {
    delete process.env.CRON_SECRET;
  } else {
    process.env.CRON_SECRET = originalCronSecret;
  }
});

describe("freshness regression — HTTP install (F1, F5, F9)", () => {
  beforeEach(() => {
    setEnsureCacheFreshDepsForTests({
      readManifest: readPackageManifest,
      resolveLive: async () => {
        const m = readPackageManifest();
        return m
          ? { commitSha: m.latestCommit, version: m.latestVersion }
          : { code: "sync_error", message: "no cache" };
      },
      sync: async () => ({
        status: "unchanged" as const,
        commitSha: readPackageManifest()?.latestCommit ?? "sha",
        version: readPackageManifest()?.latestVersion ?? "main",
      }),
      clearVersionsCache: () => {},
    });
  });

  it("F1: local manifest matches repo but files deleted — never already_up_to_date", async () => {
    seedCache("sha-same", "main", ["tdd", "atdd"]);
    const home = mkdtempSync(join(tmpdir(), "sdd-home-f1-"));
    writeLocalManifest(home, "sha-same", "main", ["tdd", "atdd", "dod"]);
    // Skills deleted on disk — only manifest remains.

    const body = await httpInstall(home, {
      installed_commit: "sha-same",
      installed_version: "main",
    });

    expect(body.error?.code).not.toBe("already_up_to_date");
    expect(body.packageUrl).toContain("/api/sdd/package");
    expect(body.extract_recommended).toBe(true);
    expect(body.local_commit_matches).toBe(true);
    expect(existsSync(join(home, ".cursor/skills/tdd"))).toBe(false);
  });

  it("F5: repo/local commit mismatch — returns new package after cache refresh", async () => {
    seedCache("sha-old", "main", ["tdd"]);
    setEnsureCacheFreshDepsForTests({
      readManifest: readPackageManifest,
      resolveLive: async () => ({ commitSha: "sha-new", version: "main" }),
      sync: async () => {
        const dir = process.env.SDD_PACKAGE_CACHE_DIR!;
        mkdirSync(join(unpackedDir("sha-new"), "skills/a-tdd"), { recursive: true });
        mkdirSync(join(unpackedDir("sha-new"), "skills/tdd"), { recursive: true });
        writeFileSync(join(unpackedDir("sha-new"), "skills/a-tdd/SKILL.md"), "# a-tdd\n");
        writeFileSync(join(unpackedDir("sha-new"), "skills/tdd/SKILL.md"), "# tdd\n");
        writeFileSync(packageTarPath("sha-new"), "tar-new");
        writeFileSync(
          join(dir, MANIFEST_FILENAME),
          JSON.stringify({
            latestCommit: "sha-new",
            latestVersion: "main",
            versions: [{ id: "main", commitSha: "sha-new" }],
            inventory: {
              skills: ["a-tdd", "tdd"],
              rules: [],
              agents: [],
              workflows: [],
              other: [],
            },
            syncedAt: new Date().toISOString(),
          }),
        );
        return { status: "synced", commitSha: "sha-new", version: "main" };
      },
      clearVersionsCache: () => {},
    });

    const home = mkdtempSync(join(tmpdir(), "sdd-home-f5-"));
    writeLocalManifest(home, "sha-old", "main", ["tdd"]);

    const body = await httpInstall(home, {
      installed_commit: "sha-old",
      installed_version: "main",
    });

    expect(body.commitSha).toBe("sha-new");
    expect(body.local_commit_matches).toBe(false);
    expect(body.extract_recommended).toBe(true);
    expect(body.cache_refresh).toBe("refreshed");
    expect(body.manifest?.files.skills).toContain("a-tdd");
  });

  it("F9: stale syncedAt surfaces cache_stale advisory", async () => {
    seedCache("sha-stale", "main", ["tdd"], "2020-01-01T00:00:00.000Z");
    const home = mkdtempSync(join(tmpdir(), "sdd-home-f9-"));
    const body = await httpInstall(home);
    expect(body.cache_stale).toBe(true);
    expect(body.packageUrl).toBeDefined();
  });
});

describe("freshness regression — auto sync on install (F2, F8)", () => {
  it("F2: repo moved ahead of cache — ensurePackageCacheFresh syncs before install", async () => {
    seedCache("sha-old", "main", ["atdd"]);
    let syncCalls = 0;
    setEnsureCacheFreshDepsForTests({
      readManifest: readPackageManifest,
      resolveLive: async () => ({ commitSha: "sha-new", version: "main" }),
      sync: async () => {
        syncCalls += 1;
        const dir = process.env.SDD_PACKAGE_CACHE_DIR!;
        mkdirSync(join(unpackedDir("sha-new"), "skills/a-tdd"), { recursive: true });
        writeFileSync(
          join(unpackedDir("sha-new"), "skills/a-tdd/SKILL.md"),
          "# a-tdd\n",
        );
        writeFileSync(packageTarPath("sha-new"), "tar-new");
        writeFileSync(
          join(dir, MANIFEST_FILENAME),
          JSON.stringify({
            latestCommit: "sha-new",
            latestVersion: "main",
            versions: [{ id: "main", commitSha: "sha-new" }],
            inventory: {
              skills: ["a-tdd"],
              rules: [],
              agents: [],
              workflows: [],
              other: [],
            },
            syncedAt: new Date().toISOString(),
          }),
        );
        return { status: "synced", commitSha: "sha-new", version: "main" };
      },
      clearVersionsCache: () => {},
    });

    const home = mkdtempSync(join(tmpdir(), "sdd-home-f2-"));
    const body = await httpInstall(home);
    expect(syncCalls).toBe(1);
    expect(body.commitSha).toBe("sha-new");
    expect(body.manifest?.files.skills).toEqual(["a-tdd"]);
  });

  it("F8: live tip lookup fails — falls back to full sync", async () => {
    seedCache("sha-a", "main", ["tdd"]);
    let syncCalls = 0;
    setEnsureCacheFreshDepsForTests({
      readManifest: readPackageManifest,
      resolveLive: async () => ({ code: "sync_error", message: "GitHub down" }),
      sync: async () => {
        syncCalls += 1;
        return { status: "unchanged", commitSha: "sha-a", version: "main" };
      },
      clearVersionsCache: () => {},
    });

    const result = await ensurePackageCacheFresh();
    expect(syncCalls).toBe(1);
    expect(result).toEqual({
      status: "unchanged",
      commitSha: "sha-a",
      version: "main",
    });
  });
});

describe("freshness regression — sync failure (F3)", () => {
  it("F3a: sync fails with existing cache — install still serves cached package", async () => {
    seedCache("sha-preserved", "main", ["tdd"]);
    setEnsureCacheFreshDepsForTests({
      readManifest: readPackageManifest,
      resolveLive: async () => ({ commitSha: "sha-new", version: "main" }),
      sync: async () => ({ code: "sync_error", message: "GitHub down" }),
      clearVersionsCache: () => {},
    });

    const home = mkdtempSync(join(tmpdir(), "sdd-home-f3a-"));
    const body = await httpInstall(home);
    expect(body.error).toBeUndefined();
    expect(body.commitSha).toBe("sha-preserved");
  });

  it("F3b: sync fails with no cache — install returns sync_pending", async () => {
    process.env.SDD_PACKAGE_CACHE_DIR = mkdtempSync(join(tmpdir(), "sdd-empty-"));
    setEnsureCacheFreshDepsForTests({
      readManifest: () => null,
      resolveLive: async () => ({ code: "sync_error", message: "No repo" }),
      sync: async () => ({ code: "sync_error", message: "No repo" }),
      clearVersionsCache: () => {},
    });

    const home = mkdtempSync(join(tmpdir(), "sdd-home-f3b-"));
    const body = await httpInstall(home);
    expect(body.error?.code).toBe("sync_pending");
  });
});

describe("freshness regression — scheduled sync (F4)", () => {
  it("F4a: interval fires runScheduledSync every 30 minutes", async () => {
    vi.useFakeTimers();
    process.env.GITHUB_TOKEN = "ghp_test";
    runScheduledSyncMock.mockResolvedValue({ status: "unchanged" });

    startScheduledSyncInterval();
    expect(runScheduledSyncMock).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(30 * 60 * 1000);
    expect(runScheduledSyncMock).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(30 * 60 * 1000);
    expect(runScheduledSyncMock).toHaveBeenCalledTimes(2);
  });

  it("F4b: scheduled sync skipped when GITHUB_TOKEN unset", () => {
    delete process.env.GITHUB_TOKEN;
    startScheduledSyncInterval();
    expect(runScheduledSyncMock).not.toHaveBeenCalled();
  });
});

describe("freshness regression — webhook + cron triggers (F6, F7)", () => {
  it("F6: GitHub webhook push triggers syncFrameworkRepo", async () => {
    process.env.GITHUB_WEBHOOK_SECRET = "wh-secret";
    syncFrameworkRepoMock.mockResolvedValue({
      status: "synced",
      commitSha: "sha-wh",
      version: "main",
    });

    const body = JSON.stringify({ ref: "refs/heads/main" });
    const req = new Request("http://localhost/api/github/webhook", {
      method: "POST",
      headers: {
        "x-hub-signature-256": signWebhook(body, "wh-secret"),
        "x-github-event": "push",
      },
      body,
    });
    const res = await webhookPost(req);
    expect(res.status).toBe(200);
    expect(syncFrameworkRepoMock).toHaveBeenCalledOnce();
    expect(clearListVersionsCacheMock).toHaveBeenCalledOnce();
  });

  it("F7: cron route triggers runScheduledSync", async () => {
    process.env.CRON_SECRET = "cron-secret";
    runScheduledSyncMock.mockResolvedValue({
      status: "unchanged",
      commitSha: "sha-cron",
      version: "main",
    });

    const res = await cronPost(
      new Request("http://localhost/api/sync/cron", {
        method: "POST",
        headers: { authorization: "Bearer cron-secret" },
      }),
    );
    expect(res.status).toBe(200);
    expect(runScheduledSyncMock).toHaveBeenCalledOnce();
  });
});

describe("freshness regression — stdio self-heal (F10)", () => {
  it("F10: stdio reinstalls when manifest exists but skill files deleted", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-home-f10-"));
    const pkg = mkdtempSync(join(tmpdir(), "sdd-pkg-f10-"));
    mkdirSync(join(pkg, "skills/tdd"), { recursive: true });
    mkdirSync(join(pkg, "rules"), { recursive: true });
    mkdirSync(join(pkg, "agents"), { recursive: true });
    mkdirSync(join(pkg, "workflows"), { recursive: true });
    writeFileSync(join(pkg, "skills/tdd/SKILL.md"), "# tdd\n");
    writeFileSync(join(pkg, "rules/dod.mdc"), "# dod\n");

    const { setPackageFetchForTests } = await import("@/core/tools/package-fetch");
    setPackageFetchForTests(async () => ({
      version: "main",
      commitSha: "sha-stdio",
      tempDir: pkg,
    }));

    const ctx = {
      channel: "stdio" as const,
      home,
      userProfile: home,
      env: { HOME: home },
      skipLlm: true,
    };
    await installFramework({ client: "cursor", os: "darwin" }, ctx);
    rmSync(join(home, ".cursor/skills/tdd"), { recursive: true, force: true });

    const second = await installFramework({ client: "cursor", os: "darwin" }, ctx);
    const body = parseToolJson<{ version: string; error?: { code: string } }>(
      second,
    );
    expect(body.error?.code).not.toBe("already_up_to_date");
    expect(body.version).toBe("main");
    expect(existsSync(join(home, ".cursor/skills/tdd/SKILL.md"))).toBe(true);

    setPackageFetchForTests(null);
  });
});
