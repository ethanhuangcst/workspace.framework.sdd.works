/**
 * Opt-in E2E against a real GitHub test repo.
 * Set SDD_E2E_GITHUB_REPO=https://github.com/{owner}/{repo} and GITHUB_TOKEN.
 */
import { afterEach, describe, expect, it } from "vitest";
import {
  existsSync,
  mkdtempSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { readPackageManifest } from "./manifest";
import { setSyncJobDepsForTests, syncFrameworkRepo } from "./sync-job";
import { unpackedDir } from "./paths";

const e2eRepo = process.env.SDD_E2E_GITHUB_REPO?.trim();
const hasToken = Boolean(process.env.GITHUB_TOKEN?.trim());
const originalCacheDir = process.env.SDD_PACKAGE_CACHE_DIR;
const originalGithubFixture = process.env.GITHUB_FIXTURE;

describe.skipIf(!e2eRepo || !hasToken)("sync E2E (real GitHub repo)", () => {
  afterEach(() => {
    setSyncJobDepsForTests(null);
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
    "should_sync_from_real_github_repo",
    async () => {
    delete process.env.GITHUB_FIXTURE;
    const cacheDir = mkdtempSync(join(tmpdir(), "sdd-e2e-cache-"));
    process.env.SDD_PACKAGE_CACHE_DIR = cacheDir;

    setSyncJobDepsForTests({
      async getRepoUrl() {
        return e2eRepo!;
      },
      async materialize(owner, repo, ref, destDir) {
        const { getGitHubPortForRepo } = await import("@/github/sync");
        return getGitHubPortForRepo(owner).materializePackage(
          owner,
          repo,
          ref,
          destDir,
        );
      },
      async resolveCommit(owner, repo, ref) {
        const { getGitHubPortForRepo } = await import("@/github/sync");
        return getGitHubPortForRepo(owner).resolveCommitSha(owner, repo, ref);
      },
      async listTags(owner, repo) {
        const { getGitHubPortForRepo } = await import("@/github/sync");
        const tags = await getGitHubPortForRepo(owner).listRepoTags(owner, repo);
        return tags.map((t) => ({ id: t.id, published_at: t.published_at }));
      },
      async fetchTree(owner, repo) {
        const { fetchRepoTree } = await import("@/github/sync");
        const { inventoryFromTree } = await import("./manifest");
        return inventoryFromTree(await fetchRepoTree(owner, repo));
      },
    });

    const first = await syncFrameworkRepo();
    expect("status" in first).toBe(true);
    if ("status" in first) {
      expect(first.status).toBe("synced");
      expect(existsSync(unpackedDir(first.commitSha))).toBe(true);
      const manifest = readPackageManifest();
      expect(manifest?.latestCommit).toBe(first.commitSha);
      expect(manifest?.latestVersion).toBe("main");
      expect(manifest?.inventory.skills).toEqual(
        expect.arrayContaining(["tdd", "atdd", "dod"]),
      );
      expect(manifest?.inventory.rules).toContain("dod.mdc");
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
});
