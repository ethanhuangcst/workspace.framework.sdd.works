/**
 * Opt-in E2E against a real GitHub test repo (ethanhuangcst/test.sdd).
 * Set SDD_E2E_GITHUB_REPO=https://github.com/{owner}/{repo} and GITHUB_TOKEN.
 */
import { afterEach, describe, expect, it } from "vitest";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  setEnsureCacheFreshDepsForTests,
} from "@/core/sync/ensure-cache-fresh";
import { parseToolJson } from "@/core/tools/errors";
import { installFramework } from "@/core/tools/install";
import { ensurePackageCacheFresh } from "./ensure-cache-fresh";
import { readPackageManifest } from "./manifest";
import {
  MANIFEST_FILENAME,
  unpackedDir,
} from "./paths";
import {
  resolveLatestLiveCommit,
  setSyncJobDepsForTests,
  syncFrameworkRepo,
} from "./sync-job";

const e2eRepo = process.env.SDD_E2E_GITHUB_REPO?.trim();
const hasToken = Boolean(process.env.GITHUB_TOKEN?.trim());
const originalCacheDir = process.env.SDD_PACKAGE_CACHE_DIR;
const originalGithubFixture = process.env.GITHUB_FIXTURE;

function liveSyncDeps() {
  return {
    async getRepoUrl() {
      return e2eRepo!;
    },
    async materialize(owner: string, repo: string, ref: string, destDir: string) {
      const { getGitHubPortForRepo } = await import("@/github/sync");
      return getGitHubPortForRepo(owner).materializePackage(
        owner,
        repo,
        ref,
        destDir,
      );
    },
    async resolveCommit(owner: string, repo: string, ref: string) {
      const { getGitHubPortForRepo } = await import("@/github/sync");
      return getGitHubPortForRepo(owner).resolveCommitSha(owner, repo, ref);
    },
    async listTags(owner: string, repo: string) {
      const { getGitHubPortForRepo } = await import("@/github/sync");
      const tags = await getGitHubPortForRepo(owner).listRepoTags(owner, repo);
      return tags.map((t) => ({ id: t.id, published_at: t.published_at }));
    },
    async fetchTree(owner: string, repo: string) {
      const { fetchRepoTree } = await import("@/github/sync");
      const { inventoryFromTree } = await import("./manifest");
      return inventoryFromTree(await fetchRepoTree(owner, repo));
    },
  };
}

describe.skipIf(!e2eRepo || !hasToken)("sync E2E (real GitHub test repo)", () => {
  afterEach(() => {
    setSyncJobDepsForTests(null);
    setEnsureCacheFreshDepsForTests(null);
    if (originalCacheDir === undefined) {
      delete process.env.SDD_PACKAGE_CACHE_DIR;
    } else {
      process.env.SDD_PACKAGE_CACHE_DIR = originalCacheDir;
    }
    if (originalGithubFixture === undefined) {
      delete process.env.GITHUB_FIXTURE;
    } else {
      process.env.GITHUB_FIXTURE = originalGithubFixture;
    }
  });

  it(
    "LE1: should_sync_from_test_repo_and_idempotent_resync",
    async () => {
      delete process.env.GITHUB_FIXTURE;
      const cacheDir = mkdtempSync(join(tmpdir(), "sdd-e2e-cache-"));
      process.env.SDD_PACKAGE_CACHE_DIR = cacheDir;
      setSyncJobDepsForTests(liveSyncDeps());

      const first = await syncFrameworkRepo();
      expect("status" in first).toBe(true);
      if ("status" in first) {
        expect(first.status).toBe("synced");
        expect(existsSync(unpackedDir(first.commitSha))).toBe(true);
        const manifest = readPackageManifest();
        expect(manifest?.latestCommit).toBe(first.commitSha);
        expect(manifest?.latestVersion).toBe("main");
        expect(manifest?.inventory.skills).toEqual(
          expect.arrayContaining(["tdd", "a-tdd"]),
        );
      }

      const second = await syncFrameworkRepo();
      if ("status" in first && "status" in second) {
        expect(second.status).toBe("unchanged");
        expect(second.commitSha).toBe(first.commitSha);
      }

      rmSync(cacheDir, { recursive: true, force: true });
    },
    60_000,
  );

  it(
    "LE2: live tip should match cache after sync",
    async () => {
      delete process.env.GITHUB_FIXTURE;
      const cacheDir = mkdtempSync(join(tmpdir(), "sdd-e2e-live-"));
      process.env.SDD_PACKAGE_CACHE_DIR = cacheDir;
      setSyncJobDepsForTests(liveSyncDeps());

      const synced = await syncFrameworkRepo();
      expect("status" in synced).toBe(true);

      const live = await resolveLatestLiveCommit();
      expect("code" in live).toBe(false);
      if ("code" in live) return;

      const manifest = readPackageManifest();
      expect(manifest?.latestCommit).toBe(live.commitSha);

      const fresh = await ensurePackageCacheFresh();
      expect(fresh).toEqual({ status: "fresh" });

      rmSync(cacheDir, { recursive: true, force: true });
    },
    60_000,
  );

  it(
    "LE3: stale cache manifest should refresh to live tip on install check",
    async () => {
      delete process.env.GITHUB_FIXTURE;
      const cacheDir = mkdtempSync(join(tmpdir(), "sdd-e2e-stale-"));
      process.env.SDD_PACKAGE_CACHE_DIR = cacheDir;
      setSyncJobDepsForTests(liveSyncDeps());

      const synced = await syncFrameworkRepo();
      expect("status" in synced).toBe(true);
      if (!("status" in synced)) return;

      const manifest = readPackageManifest();
      expect(manifest).not.toBeNull();

      writeFileSync(
        join(cacheDir, MANIFEST_FILENAME),
        JSON.stringify({
          ...manifest,
          latestCommit: "0000000000000000000000000000000000000000",
          syncedAt: "2020-01-01T00:00:00.000Z",
        }),
      );

      setEnsureCacheFreshDepsForTests(null);
      const fresh = await ensurePackageCacheFresh();
      expect("status" in fresh && fresh.status).toBe("refreshed");

      const updated = readPackageManifest();
      expect(updated?.latestCommit).toBe(synced.commitSha);

      rmSync(cacheDir, { recursive: true, force: true });
    },
    60_000,
  );

  it(
    "LE5: cached tarball content matches GitHub main for a-tdd/SKILL.md",
    async () => {
      delete process.env.GITHUB_FIXTURE;
      const cacheDir = mkdtempSync(join(tmpdir(), "sdd-e2e-content-"));
      process.env.SDD_PACKAGE_CACHE_DIR = cacheDir;
      setSyncJobDepsForTests(liveSyncDeps());

      const synced = await syncFrameworkRepo();
      expect("status" in synced).toBe(true);
      if (!("status" in synced)) return;

      const token = process.env.GITHUB_TOKEN!.trim();
      const githubRes = await fetch(
        "https://api.github.com/repos/ethanhuangcst/test.sdd/contents/skills/a-tdd/SKILL.md?ref=main",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.raw",
          },
        },
      );
      expect(githubRes.ok).toBe(true);
      const githubContent = await githubRes.text();

      const cachedPath = join(
        unpackedDir(synced.commitSha),
        "skills/a-tdd/SKILL.md",
      );
      expect(existsSync(cachedPath)).toBe(true);
      const cachedContent = readFileSync(cachedPath, "utf8");
      expect(cachedContent).toBe(githubContent);

      rmSync(cacheDir, { recursive: true, force: true });
    },
    60_000,
  );

  it(
    "LE4: HTTP install never returns already_up_to_date against live cache",
    async () => {
      delete process.env.GITHUB_FIXTURE;
      const cacheDir = mkdtempSync(join(tmpdir(), "sdd-e2e-http-"));
      process.env.SDD_PACKAGE_CACHE_DIR = cacheDir;
      setSyncJobDepsForTests(liveSyncDeps());
      setEnsureCacheFreshDepsForTests(null);

      await syncFrameworkRepo();
      const manifest = readPackageManifest();
      expect(manifest).not.toBeNull();

      const home = mkdtempSync(join(tmpdir(), "sdd-e2e-home-"));
      const result = await installFramework(
        {
          client: "cursor",
          os: "darwin",
          installed_commit: manifest!.latestCommit,
          installed_version: manifest!.latestVersion,
        },
        {
          channel: "http",
          home,
          userProfile: home,
          env: { HOME: home },
          skipLlm: true,
        },
      );

      const body = parseToolJson<{
        packageUrl?: string;
        extract_recommended?: boolean;
        error?: { code: string };
      }>(result);

      expect(body.error?.code).not.toBe("already_up_to_date");
      expect(body.packageUrl).toContain("/api/sdd/package");
      expect(body.extract_recommended).toBe(true);

      rmSync(cacheDir, { recursive: true, force: true });
    },
    60_000,
  );
});
