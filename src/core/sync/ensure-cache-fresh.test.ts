import { afterEach, describe, expect, it } from "vitest";
import {
  ensurePackageCacheFresh,
  setEnsureCacheFreshDepsForTests,
} from "./ensure-cache-fresh";

const originalCacheDir = process.env.SDD_PACKAGE_CACHE_DIR;

afterEach(() => {
  setEnsureCacheFreshDepsForTests(null);
  if (originalCacheDir === undefined) {
    delete process.env.SDD_PACKAGE_CACHE_DIR;
  } else {
    process.env.SDD_PACKAGE_CACHE_DIR = originalCacheDir;
  }
});

describe("ensurePackageCacheFresh", () => {
  it("should_return_fresh_when_cache_matches_live_tip", async () => {
    setEnsureCacheFreshDepsForTests({
      readManifest: () => ({
        latestCommit: "sha-a",
        latestVersion: "main",
        versions: [{ id: "main", commitSha: "sha-a" }],
        inventory: { skills: [], rules: [], agents: [], workflows: [], other: [] },
        syncedAt: new Date().toISOString(),
      }),
      resolveLive: async () => ({ commitSha: "sha-a", version: "main" }),
      sync: async () => {
        throw new Error("sync should not run");
      },
      clearVersionsCache: () => {},
    });

    const result = await ensurePackageCacheFresh();
    expect(result).toEqual({ status: "fresh" });
  });

  it("should_sync_when_cache_differs_from_live_tip", async () => {
    let syncCalled = false;
    setEnsureCacheFreshDepsForTests({
      readManifest: () => ({
        latestCommit: "sha-old",
        latestVersion: "main",
        versions: [{ id: "main", commitSha: "sha-old" }],
        inventory: { skills: [], rules: [], agents: [], workflows: [], other: [] },
        syncedAt: "2026-01-01T00:00:00.000Z",
      }),
      resolveLive: async () => ({ commitSha: "sha-new", version: "main" }),
      sync: async () => {
        syncCalled = true;
        return { status: "synced", commitSha: "sha-new", version: "main" };
      },
      clearVersionsCache: () => {},
    });

    const result = await ensurePackageCacheFresh();
    expect(syncCalled).toBe(true);
    expect(result).toEqual({
      status: "refreshed",
      commitSha: "sha-new",
      version: "main",
    });
  });

  it("should_treat_live_lookup_failure_as_fresh_when_cache_exists", async () => {
    setEnsureCacheFreshDepsForTests({
      readManifest: () => ({
        latestCommit: "sha-a",
        latestVersion: "main",
        versions: [{ id: "main", commitSha: "sha-a" }],
        inventory: { skills: [], rules: [], agents: [], workflows: [], other: [] },
        syncedAt: new Date().toISOString(),
      }),
      resolveLive: async () => ({ code: "sync_error", message: "GitHub down" }),
      sync: async () => {
        throw new Error("sync should not run");
      },
      clearVersionsCache: () => {},
    });

    const result = await ensurePackageCacheFresh();
    expect(result).toEqual({ status: "fresh" });
  });

  it("should_propagate_error_when_no_cache_and_live_lookup_fails", async () => {
    setEnsureCacheFreshDepsForTests({
      readManifest: () => null,
      resolveLive: async () => ({ code: "sync_error", message: "No repo" }),
      sync: async () => ({ status: "synced", commitSha: "sha", version: "main" }),
      clearVersionsCache: () => {},
    });

    const result = await ensurePackageCacheFresh();
    expect(result).toEqual({ code: "sync_error", message: "No repo" });
  });
});
