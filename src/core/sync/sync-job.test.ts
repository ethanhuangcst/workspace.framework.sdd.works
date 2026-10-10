import { afterEach, describe, expect, it } from "vitest";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { readPackageManifest } from "./manifest";
import {
  commitDir,
  getPackageCacheDir,
  MANIFEST_FILENAME,
  packageTarPath,
  unpackedDir,
} from "./paths";
import { LITE_PACK_ALLOWLIST_FILENAME } from "@/core/seeds/lite-install-manifest";
import { setSyncJobDepsForTests, syncFrameworkRepo } from "./sync-job";

const originalCacheDir = process.env.SDD_PACKAGE_CACHE_DIR;

function withTempCache(fn: () => Promise<void> | void): Promise<void> | void {
  const dir = mkdtempSync(join(tmpdir(), "sdd-sync-cache-"));
  process.env.SDD_PACKAGE_CACHE_DIR = dir;
  return fn();
}

afterEach(() => {
  setSyncJobDepsForTests(null);
  if (originalCacheDir === undefined) {
    delete process.env.SDD_PACKAGE_CACHE_DIR;
  } else {
    process.env.SDD_PACKAGE_CACHE_DIR = originalCacheDir;
  }
});

describe("syncFrameworkRepo", () => {
  it("should_store_files_and_manifest_on_initial_sync", async () => {
    await withTempCache(async () => {
      const pkgRoot = mkdtempSync(join(tmpdir(), "sdd-sync-pkg-"));
      mkdirSync(join(pkgRoot, "skills/tdd"), { recursive: true });
      writeFileSync(join(pkgRoot, "skills/tdd/SKILL.md"), "# tdd\n");
      writeFileSync(join(pkgRoot, "pkg.tgz"), "fake-tar");

      setSyncJobDepsForTests({
        async getRepoUrl() {
          return "https://github.com/fixture/sdd-framework";
        },
        async materialize(_o, _r, ref, destDir) {
          mkdirSync(join(destDir, "unpacked"), { recursive: true });
          cpSync(pkgRoot, join(destDir, "unpacked"), { recursive: true });
          writeFileSync(join(destDir, "pkg.tgz"), "fake-tar");
          return { commitSha: `sha-${ref}` };
        },
        async resolveCommit(_o, _r, ref) {
          return `sha-${ref}`;
        },
        async listTags() {
          return [{ id: "v1.0.0", published_at: "2026-01-01T00:00:00.000Z" }];
        },
        async fetchTree() {
          return {
            skills: ["tdd"],
            rules: [],
            agents: [],
            workflows: [],
            other: [],
          };
        },
      });

      const result = await syncFrameworkRepo();
      expect(result).toEqual({
        status: "synced",
        commitSha: "sha-v1.0.0",
        version: "v1.0.0",
      });
      expect(existsSync(unpackedDir("sha-v1.0.0"))).toBe(true);
      expect(existsSync(packageTarPath("sha-v1.0.0"))).toBe(true);
      const manifest = readPackageManifest();
      expect(manifest?.latestCommit).toBe("sha-v1.0.0");
      expect(manifest?.inventory.skills).toContain("tdd");
    });
  });

  it("should_copy_lite_pack_allowlist_at_unpack_root", async () => {
    await withTempCache(async () => {
      const pkgRoot = mkdtempSync(join(tmpdir(), "sdd-sync-pkg-lite-"));
      mkdirSync(join(pkgRoot, "skills/testing-expert"), { recursive: true });
      writeFileSync(join(pkgRoot, "skills/testing-expert/SKILL.md"), "# testing-expert\n");
      mkdirSync(join(pkgRoot, "rules"), { recursive: true });
      writeFileSync(join(pkgRoot, "rules/friendly-language.mdc"), "# friendly\n");
      writeFileSync(
        join(pkgRoot, LITE_PACK_ALLOWLIST_FILENAME),
        JSON.stringify({
          skills: ["skills/testing-expert/SKILL.md"],
          rules: ["rules/friendly-language.mdc"],
        }),
      );
      writeFileSync(join(pkgRoot, "pkg.tgz"), "fake-tar");

      setSyncJobDepsForTests({
        async getRepoUrl() {
          return "https://github.com/fixture/sdd-framework";
        },
        async materialize(_o, _r, ref, destDir) {
          mkdirSync(join(destDir, "unpacked"), { recursive: true });
          cpSync(pkgRoot, join(destDir, "unpacked"), { recursive: true });
          writeFileSync(join(destDir, "pkg.tgz"), "fake-tar");
          return { commitSha: `sha-${ref}` };
        },
        async resolveCommit(_o, _r, ref) {
          return `sha-${ref}`;
        },
        async listTags() {
          return [{ id: "v1.0.0", published_at: "2026-01-01T00:00:00.000Z" }];
        },
        async fetchTree() {
          return {
            skills: ["testing-expert"],
            rules: ["friendly-language.mdc"],
            agents: [],
            workflows: [],
            other: [LITE_PACK_ALLOWLIST_FILENAME],
          };
        },
      });

      const result = await syncFrameworkRepo();
      expect("status" in result && result.status).toBe("synced");
      const commitSha = "sha-v1.0.0";
      const allowlistPath = join(unpackedDir(commitSha), LITE_PACK_ALLOWLIST_FILENAME);
      expect(existsSync(allowlistPath)).toBe(true);
      const raw = readFileSync(allowlistPath, "utf8");
      expect(JSON.parse(raw).skills).toContain("skills/testing-expert/SKILL.md");
    });
  });

  it("should_rematerialize_when_force_true_and_commit_unchanged", async () => {
    await withTempCache(async () => {
      const sha = "sha-main";
      const unpacked = unpackedDir(sha);
      mkdirSync(unpacked, { recursive: true });
      writeFileSync(join(unpacked, "stale.txt"), "old");
      writeFileSync(packageTarPath(sha), "tar");
      writeFileSync(join(getPackageCacheDir(), MANIFEST_FILENAME), JSON.stringify({
        latestCommit: sha,
        latestVersion: "main",
        versions: [{ id: "main", commitSha: sha }],
        inventory: { skills: ["tdd"], rules: [], agents: [], workflows: [], other: [] },
        syncedAt: "2026-01-01T00:00:00.000Z",
      }));

      const pkgRoot = mkdtempSync(join(tmpdir(), "sdd-force-pkg-"));
      mkdirSync(join(pkgRoot, "skills/tdd"), { recursive: true });
      writeFileSync(join(pkgRoot, "skills/tdd/SKILL.md"), "# refreshed\n");

      setSyncJobDepsForTests({
        async getRepoUrl() {
          return "https://github.com/fixture/sdd-framework";
        },
        async materialize(_o, _r, _ref, destDir) {
          mkdirSync(join(destDir, "unpacked"), { recursive: true });
          cpSync(pkgRoot, join(destDir, "unpacked"), { recursive: true });
          writeFileSync(join(destDir, "pkg.tgz"), "new-tar");
          return { commitSha: sha };
        },
        async resolveCommit() {
          return sha;
        },
        async listTags() {
          return [{ id: "main" }];
        },
        async fetchTree() {
          return { skills: ["tdd"], rules: [], agents: [], workflows: [], other: [] };
        },
      });

      const result = await syncFrameworkRepo({ force: true });
      expect(result).toEqual({ status: "synced", commitSha: sha, version: "main" });
      expect(readFileSync(join(unpacked, "skills/tdd/SKILL.md"), "utf8")).toBe(
        "# refreshed\n",
      );
    });
  });

  it("should_noop_when_commit_unchanged", async () => {
    await withTempCache(async () => {
      const sha = "sha-main";
      mkdirSync(unpackedDir(sha), { recursive: true });
      writeFileSync(packageTarPath(sha), "tar");
      writeFileSync(join(getPackageCacheDir(), MANIFEST_FILENAME), JSON.stringify({
        latestCommit: sha,
        latestVersion: "main",
        versions: [{ id: "main", commitSha: sha }],
        inventory: { skills: [], rules: [], agents: [], workflows: [], other: [] },
        syncedAt: "2026-01-01T00:00:00.000Z",
      }));

      setSyncJobDepsForTests({
        async getRepoUrl() {
          return "https://github.com/fixture/sdd-framework";
        },
        async materialize() {
          return { commitSha: sha };
        },
        async resolveCommit() {
          return sha;
        },
        async listTags() {
          return [{ id: "main" }];
        },
        async fetchTree() {
          return { skills: [], rules: [], agents: [], workflows: [], other: [] };
        },
      });

      const result = await syncFrameworkRepo();
      expect(result).toEqual({ status: "unchanged", commitSha: sha, version: "main" });
      const saved = JSON.parse(
        readFileSync(join(getPackageCacheDir(), MANIFEST_FILENAME), "utf8"),
      ) as { syncedAt: string; latestCommit: string; latestVersion: string };
      expect(saved.syncedAt).not.toBe("2026-01-01T00:00:00.000Z");
      expect(saved.latestCommit).toBe(sha);
      expect(saved.latestVersion).toBe("main");
    });
  });

  it("should_refresh_syncedAt_only_on_unchanged_commit", async () => {
    await withTempCache(async () => {
      const sha = "sha-unchanged-receipt";
      const oldSyncedAt = "2020-06-15T12:00:00.000Z";
      mkdirSync(unpackedDir(sha), { recursive: true });
      writeFileSync(packageTarPath(sha), "tar");
      writeFileSync(join(getPackageCacheDir(), MANIFEST_FILENAME), JSON.stringify({
        latestCommit: sha,
        latestVersion: "main",
        versions: [{ id: "main", commitSha: sha }],
        inventory: { skills: ["atdd"], rules: [], agents: [], workflows: [], other: [] },
        syncedAt: oldSyncedAt,
      }));

      setSyncJobDepsForTests({
        async getRepoUrl() {
          return "https://github.com/fixture/sdd-framework";
        },
        async materialize() {
          return { commitSha: sha };
        },
        async resolveCommit() {
          return sha;
        },
        async listTags() {
          return [{ id: "main" }];
        },
        async fetchTree() {
          return { skills: [], rules: [], agents: [], workflows: [], other: [] };
        },
      });

      const before = readPackageManifest();
      expect(before?.syncedAt).toBe(oldSyncedAt);

      const result = await syncFrameworkRepo();
      expect(result).toEqual({ status: "unchanged", commitSha: sha, version: "main" });

      const after = readPackageManifest();
      expect(after?.latestCommit).toBe(sha);
      expect(after?.syncedAt).not.toBe(oldSyncedAt);
      expect(Date.parse(after!.syncedAt)).toBeGreaterThan(Date.parse(oldSyncedAt));
    });
  });

  it("should_preserve_cache_on_github_error", async () => {
    await withTempCache(async () => {
      const sha = "sha-old";
      mkdirSync(commitDir(sha), { recursive: true });
      writeFileSync(packageTarPath(sha), "tar");
      writeFileSync(join(getPackageCacheDir(), MANIFEST_FILENAME), JSON.stringify({
        latestCommit: sha,
        latestVersion: "v0.9.0",
        versions: [{ id: "v0.9.0", commitSha: sha }],
        inventory: { skills: ["atdd"], rules: [], agents: [], workflows: [], other: [] },
        syncedAt: "2026-01-01T00:00:00.000Z",
      }));

      setSyncJobDepsForTests({
        async getRepoUrl() {
          return "https://github.com/fixture/sdd-framework";
        },
        async materialize() {
          throw new Error("GitHub down");
        },
        async resolveCommit() {
          throw new Error("GitHub down");
        },
        async listTags() {
          throw new Error("GitHub down");
        },
        async fetchTree() {
          return { skills: [], rules: [], agents: [], workflows: [], other: [] };
        },
      });

      const result = await syncFrameworkRepo();
      expect("code" in result && result.code).toBe("sync_error");
      expect(readFileSync(join(getPackageCacheDir(), MANIFEST_FILENAME), "utf8")).toContain(
        sha,
      );
    });
  });

  it("should_update_manifest_when_new_commit", async () => {
    await withTempCache(async () => {
      const oldSha = "sha-old";
      mkdirSync(unpackedDir(oldSha), { recursive: true });
      writeFileSync(packageTarPath(oldSha), "old-tar");
      writeFileSync(join(getPackageCacheDir(), MANIFEST_FILENAME), JSON.stringify({
        latestCommit: oldSha,
        latestVersion: "main",
        versions: [{ id: "main", commitSha: oldSha }],
        inventory: { skills: ["tdd"], rules: [], agents: [], workflows: [], other: [] },
        syncedAt: "2026-01-01T00:00:00.000Z",
      }));

      const newPkg = mkdtempSync(join(tmpdir(), "sdd-sync-new-"));
      mkdirSync(join(newPkg, "skills/test-driven-dev"), { recursive: true });
      writeFileSync(
        join(newPkg, "skills/test-driven-dev/SKILL.md"),
        "# test-driven-dev\n",
      );

      setSyncJobDepsForTests({
        async getRepoUrl() {
          return "https://github.com/fixture/sdd-framework";
        },
        async materialize(_o, _r, _ref, destDir) {
          mkdirSync(join(destDir, "unpacked"), { recursive: true });
          cpSync(newPkg, join(destDir, "unpacked"), { recursive: true });
          writeFileSync(join(destDir, "pkg.tgz"), "new-tar");
          return { commitSha: "sha-new" };
        },
        async resolveCommit() {
          return "sha-new";
        },
        async listTags() {
          return [{ id: "main" }];
        },
        async fetchTree() {
          return {
            skills: ["test-driven-dev"],
            rules: [],
            agents: [],
            workflows: [],
            other: [],
          };
        },
      });

      const result = await syncFrameworkRepo();
      expect(result).toEqual({
        status: "synced",
        commitSha: "sha-new",
        version: "main",
      });
      const manifest = readPackageManifest();
      expect(manifest?.latestCommit).toBe("sha-new");
      expect(manifest?.inventory.skills).toContain("test-driven-dev");
      expect(existsSync(unpackedDir("sha-new"))).toBe(true);
    });
  });
});
