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
