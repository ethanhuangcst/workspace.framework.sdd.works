/**
 * Fixture equivalents of mcp-test.md §6 S2–S5 and §7.4 M1 (VERIF-02).
 */
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
import { parseToolJson } from "@/core/tools/errors";
import { installFramework } from "@/core/tools/install";
import {
  setEnsureCacheFreshDepsForTests,
} from "@/core/sync/ensure-cache-fresh";
import { setPackageFetchForTests } from "@/core/tools/package-fetch";
import { readPackageManifest } from "./manifest";
import {
  getPackageCacheDir,
  MANIFEST_FILENAME,
  packageTarPath,
  unpackedDir,
} from "./paths";
import { setSyncJobDepsForTests, syncFrameworkRepo } from "./sync-job";

const originalCacheDir = process.env.SDD_PACKAGE_CACHE_DIR;

function withTempCache(fn: () => Promise<void>): Promise<void> {
  const dir = mkdtempSync(join(tmpdir(), "sdd-sync-scenario-"));
  process.env.SDD_PACKAGE_CACHE_DIR = dir;
  return fn();
}

afterEach(() => {
  setSyncJobDepsForTests(null);
  setPackageFetchForTests(null);
  setEnsureCacheFreshDepsForTests(null);
  if (originalCacheDir === undefined) {
    delete process.env.SDD_PACKAGE_CACHE_DIR;
  } else {
    process.env.SDD_PACKAGE_CACHE_DIR = originalCacheDir;
  }
});

describe("sync scenarios (fixture S2–S5, M1)", () => {
  it("S2_should_update_manifest_when_new_commit", async () => {
    await withTempCache(async () => {
      const oldSha = "sha-old";
      mkdirSync(unpackedDir(oldSha), { recursive: true });
      writeFileSync(
        join(getPackageCacheDir(), MANIFEST_FILENAME),
        JSON.stringify({
          latestCommit: oldSha,
          latestVersion: "main",
          versions: [{ id: "main", commitSha: oldSha }],
          inventory: { skills: ["tdd"], rules: [], agents: [], workflows: [], other: [] },
          syncedAt: "2026-01-01T00:00:00.000Z",
        }),
      );

      const pkg = mkdtempSync(join(tmpdir(), "sdd-s2-pkg-"));
      mkdirSync(join(pkg, "skills/a-tdd"), { recursive: true });
      writeFileSync(join(pkg, "skills/a-tdd/SKILL.md"), "# a-tdd\n");

      setSyncJobDepsForTests({
        async getRepoUrl() {
          return "https://github.com/fixture/sdd-framework";
        },
        async materialize(_o, _r, _ref, destDir) {
          mkdirSync(join(destDir, "unpacked"), { recursive: true });
          cpSync(pkg, join(destDir, "unpacked"), { recursive: true });
          writeFileSync(join(destDir, "pkg.tgz"), "tar");
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
            skills: ["a-tdd"],
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
      expect(readPackageManifest()?.inventory.skills).toContain("a-tdd");
    });
  });

  it("S3_should_reflect_skill_rename_in_inventory", async () => {
    await withTempCache(async () => {
      const sha = "sha-rename";
      const pkg = mkdtempSync(join(tmpdir(), "sdd-s3-pkg-"));
      mkdirSync(join(pkg, "skills/a-tdd"), { recursive: true });
      writeFileSync(join(pkg, "skills/a-tdd/SKILL.md"), "# a-tdd\n");

      setSyncJobDepsForTests({
        async getRepoUrl() {
          return "https://github.com/fixture/sdd-framework";
        },
        async materialize(_o, _r, _ref, destDir) {
          mkdirSync(join(destDir, "unpacked"), { recursive: true });
          cpSync(pkg, join(destDir, "unpacked"), { recursive: true });
          writeFileSync(join(destDir, "pkg.tgz"), "tar");
          return { commitSha: sha };
        },
        async resolveCommit() {
          return sha;
        },
        async listTags() {
          return [{ id: "main" }];
        },
        async fetchTree() {
          return {
            skills: ["a-tdd"],
            rules: [],
            agents: [],
            workflows: [],
            other: [],
          };
        },
      });

      await syncFrameworkRepo();
      const manifest = readPackageManifest();
      expect(manifest?.inventory.skills).toEqual(["a-tdd"]);
      expect(
        existsSync(join(unpackedDir(sha), "skills/a-tdd/SKILL.md")),
      ).toBe(true);
    });
  });

  it("S4_should_remove_deleted_skill_from_inventory", async () => {
    await withTempCache(async () => {
      const sha = "sha-delete";
      const pkg = mkdtempSync(join(tmpdir(), "sdd-s4-pkg-"));
      mkdirSync(join(pkg, "skills/tdd"), { recursive: true });
      writeFileSync(join(pkg, "skills/tdd/SKILL.md"), "# tdd\n");

      setSyncJobDepsForTests({
        async getRepoUrl() {
          return "https://github.com/fixture/sdd-framework";
        },
        async materialize(_o, _r, _ref, destDir) {
          mkdirSync(join(destDir, "unpacked"), { recursive: true });
          cpSync(pkg, join(destDir, "unpacked"), { recursive: true });
          writeFileSync(join(destDir, "pkg.tgz"), "tar");
          return { commitSha: sha };
        },
        async resolveCommit() {
          return sha;
        },
        async listTags() {
          return [{ id: "main" }];
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

      await syncFrameworkRepo();
      expect(readPackageManifest()?.inventory.skills).toEqual(["tdd"]);
      expect(existsSync(join(unpackedDir(sha), "skills/atdd"))).toBe(false);
    });
  });

  it("S5_should_preserve_cache_on_github_error", async () => {
    await withTempCache(async () => {
      const sha = "sha-stale";
      writeFileSync(
        join(getPackageCacheDir(), MANIFEST_FILENAME),
        JSON.stringify({
          latestCommit: sha,
          latestVersion: "main",
          versions: [{ id: "main", commitSha: sha }],
          inventory: { skills: ["tdd"], rules: [], agents: [], workflows: [], other: [] },
          syncedAt: "2026-01-01T00:00:00.000Z",
        }),
      );

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

  it("M1_http_install_reflects_renamed_inventory_after_sync", async () => {
    await withTempCache(async () => {
      const sha = "sha-m1";
      const unpacked = unpackedDir(sha);
      mkdirSync(join(unpacked, "skills/a-tdd"), { recursive: true });
      writeFileSync(join(unpacked, "skills/a-tdd/SKILL.md"), "# a-tdd\n");
      writeFileSync(packageTarPath(sha), "tar");
      writeFileSync(
        join(getPackageCacheDir(), MANIFEST_FILENAME),
        JSON.stringify({
          latestCommit: sha,
          latestVersion: "main",
          versions: [{ id: "main", commitSha: sha }],
          inventory: { skills: ["a-tdd"], rules: [], agents: [], workflows: [], other: [] },
          syncedAt: "2026-01-01T00:00:00.000Z",
        }),
      );

      setEnsureCacheFreshDepsForTests({
        readManifest: readPackageManifest,
        resolveLive: async () => ({
          commitSha: sha,
          version: "main",
        }),
        sync: async () => ({
          status: "synced",
          commitSha: sha,
          version: "main",
        }),
        clearVersionsCache: () => {},
      });

      const home = mkdtempSync(join(tmpdir(), "sdd-m1-home-"));
      const result = await installFramework(
        { client: "cursor", os: "darwin" },
        {
          channel: "http",
          home,
          userProfile: home,
          env: { HOME: home },
          skipLlm: true,
        },
      );
      const body = parseToolJson<{
        manifest?: { files?: { skills?: string[] } };
        packageUrl?: string;
      }>(result);
      expect(body.packageUrl).toContain("/api/sdd/package");
      expect(body.manifest?.files?.skills).toContain("skills/a-tdd/SKILL.md");
    });
  });
});
