import { afterEach, describe, expect, it } from "vitest";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { openCachedPackageTar, resolveCachedVersion } from "./cache";
import { MANIFEST_FILENAME, packageTarPath, unpackedDir } from "./paths";

const originalCacheDir = process.env.SDD_PACKAGE_CACHE_DIR;

afterEach(() => {
  if (originalCacheDir === undefined) {
    delete process.env.SDD_PACKAGE_CACHE_DIR;
  } else {
    process.env.SDD_PACKAGE_CACHE_DIR = originalCacheDir;
  }
});

describe("package cache", () => {
  it("should_return_sync_pending_without_manifest", () => {
    process.env.SDD_PACKAGE_CACHE_DIR = mkdtempSync(join(tmpdir(), "sdd-cache-empty-"));
    expect(resolveCachedVersion()).toEqual({ code: "sync_pending" });
  });

  it("should_resolve_latest_version", () => {
    const dir = mkdtempSync(join(tmpdir(), "sdd-cache-"));
    process.env.SDD_PACKAGE_CACHE_DIR = dir;
    const sha = "sha-v1";
    mkdirSync(unpackedDir(sha), { recursive: true });
    writeFileSync(packageTarPath(sha), "tarball");
    writeFileSync(join(dir, MANIFEST_FILENAME), JSON.stringify({
      latestCommit: sha,
      latestVersion: "v1.0.0",
      versions: [{ id: "v1.0.0", commitSha: sha }],
      inventory: { skills: [], rules: [], agents: [], workflows: [], other: [] },
      syncedAt: "2026-01-01T00:00:00.000Z",
    }));

    const resolved = resolveCachedVersion("latest");
    expect("code" in resolved).toBe(false);
    if (!("code" in resolved)) {
      expect(resolved.commitSha).toBe(sha);
      expect(resolved.version).toBe("v1.0.0");
      expect(resolved.syncedAt).toBe("2026-01-01T00:00:00.000Z");
      expect(existsSync(resolved.tarPath)).toBe(true);
    }
  });

  it("should_return_version_not_found_for_unknown_version", () => {
    const dir = mkdtempSync(join(tmpdir(), "sdd-cache-"));
    process.env.SDD_PACKAGE_CACHE_DIR = dir;
    const sha = "sha-v1";
    writeFileSync(join(dir, MANIFEST_FILENAME), JSON.stringify({
      latestCommit: sha,
      latestVersion: "v1.0.0",
      versions: [{ id: "v1.0.0", commitSha: sha }],
      inventory: { skills: [], rules: [], agents: [], workflows: [], other: [] },
      syncedAt: "2026-01-01T00:00:00.000Z",
    }));

    expect(resolveCachedVersion("v9.9.9")).toEqual({ code: "version_not_found" });
  });

  it("should_open_tar_stream_for_cached_package", () => {
    const dir = mkdtempSync(join(tmpdir(), "sdd-cache-"));
    process.env.SDD_PACKAGE_CACHE_DIR = dir;
    const sha = "sha-v1";
    mkdirSync(unpackedDir(sha), { recursive: true });
    writeFileSync(packageTarPath(sha), "tarball");
    writeFileSync(join(dir, MANIFEST_FILENAME), JSON.stringify({
      latestCommit: sha,
      latestVersion: "v1.0.0",
      versions: [{ id: "v1.0.0", commitSha: sha }],
      inventory: { skills: [], rules: [], agents: [], workflows: [], other: [] },
      syncedAt: "2026-01-01T00:00:00.000Z",
    }));

    const opened = openCachedPackageTar("v1.0.0");
    expect("code" in opened).toBe(false);
    if (!("code" in opened)) {
      expect(opened.commitSha).toBe(sha);
      expect(opened.version).toBe("v1.0.0");
      opened.stream.destroy();
    }
  });
});
