import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  rmSync,
} from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  fetchRepoTree,
  getGitHubPortForRepo,
  GitHubConfigError,
  GitHubSyncError,
} from "@/github/sync";
import { db } from "@/lib/db";
import { parseGithubRepoUrl } from "@/lib/settings";
import {
  inventoryFromTree,
  readPackageManifest,
  writePackageManifest,
  type PackageManifest,
  type VersionEntry,
} from "./manifest";
import {
  commitDir,
  getPackageCacheDir,
  packageTarPath,
  unpackedDir,
} from "./paths";

const RETAIN_COMMITS = 5;

export type SyncResult =
  | { status: "synced"; commitSha: string; version: string }
  | { status: "unchanged"; commitSha: string; version: string }
  | { code: "sync_error"; message: string };

type SyncDeps = {
  getRepoUrl: () => Promise<string | null>;
  materialize: (
    owner: string,
    repo: string,
    ref: string,
    destDir: string,
  ) => Promise<{ commitSha: string }>;
  resolveCommit: (owner: string, repo: string, ref: string) => Promise<string>;
  listTags: (owner: string, repo: string) => Promise<VersionEntry[]>;
  fetchTree: (owner: string, repo: string) => Promise<ReturnType<typeof inventoryFromTree>>;
};

export type LiveCommitRef =
  | { commitSha: string; version: string }
  | { code: "sync_error"; message: string };

function defaultDeps(): SyncDeps {
  return {
    async getRepoUrl() {
      const row = await db.setting.findUnique({ where: { id: "singleton" } });
      return row?.githubUrl?.trim() ?? null;
    },
    async materialize(owner, repo, ref, destDir) {
      const port = getGitHubPortForRepo(owner);
      return port.materializePackage(owner, repo, ref, destDir);
    },
    async resolveCommit(owner, repo, ref) {
      const port = getGitHubPortForRepo(owner);
      return port.resolveCommitSha(owner, repo, ref);
    },
    async listTags(owner, repo) {
      const port = getGitHubPortForRepo(owner);
      const tags = await port.listRepoTags(owner, repo);
      return tags.map((t) => ({ id: t.id, published_at: t.published_at }));
    },
    async fetchTree(owner, repo) {
      const tree = await fetchRepoTree(owner, repo);
      return inventoryFromTree(tree);
    },
  };
}

let depsOverride: SyncDeps | null = null;

export function setSyncJobDepsForTests(deps: SyncDeps | null): void {
  depsOverride = deps;
}

function getDeps(): SyncDeps {
  return depsOverride ?? defaultDeps();
}

function cleanupOldCommits(keepSha: string): void {
  const cacheDir = getPackageCacheDir();
  if (!existsSync(cacheDir)) return;
  const entries = readdirSync(cacheDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name !== keepSha)
    .map((e) => e.name)
    .sort()
    .reverse();

  for (const sha of entries.slice(RETAIN_COMMITS - 1)) {
    rmSync(commitDir(sha), { recursive: true, force: true });
  }
}

export async function resolveLatestLiveCommit(): Promise<LiveCommitRef> {
  const deps = getDeps();
  const url = await deps.getRepoUrl();
  if (!url) {
    return { code: "sync_error", message: "No GitHub repository is configured in Settings." };
  }

  const parsed = parseGithubRepoUrl(url);
  if (!parsed) {
    return { code: "sync_error", message: "Settings GitHub URL is invalid." };
  }

  try {
    const tags = await deps.listTags(parsed.owner, parsed.repo);
    const latestVersion = tags[0]?.id ?? "main";
    const commitSha = await deps.resolveCommit(
      parsed.owner,
      parsed.repo,
      latestVersion,
    );
    return { commitSha, version: latestVersion };
  } catch (error) {
    if (error instanceof GitHubSyncError || error instanceof GitHubConfigError) {
      return { code: "sync_error", message: error.message };
    }
    if (error instanceof Error) {
      return { code: "sync_error", message: error.message };
    }
    throw error;
  }
}

export async function syncFrameworkRepo(options?: {
  force?: boolean;
}): Promise<SyncResult> {
  const deps = getDeps();
  const url = await deps.getRepoUrl();
  if (!url) {
    return { code: "sync_error", message: "No GitHub repository is configured in Settings." };
  }

  const parsed = parseGithubRepoUrl(url);
  if (!parsed) {
    return { code: "sync_error", message: "Settings GitHub URL is invalid." };
  }

  try {
    const tags = await deps.listTags(parsed.owner, parsed.repo);
    const latestVersion = tags[0]?.id ?? "main";
    const tempRoot = mkdtempSync(join(tmpdir(), "sdd-sync-"));
    const { commitSha } = await deps.materialize(
      parsed.owner,
      parsed.repo,
      latestVersion,
      tempRoot,
    );

    const existing = readPackageManifest();
    if (!options?.force && existing?.latestCommit === commitSha) {
      rmSync(tempRoot, { recursive: true, force: true });
      return { status: "unchanged", commitSha, version: latestVersion };
    }

    const dest = commitDir(commitSha);
    const unpacked = join(tempRoot, "unpacked");
    const srcUnpacked = existsSync(unpacked) ? unpacked : tempRoot;
    mkdirSync(dest, { recursive: true });
    cpSync(srcUnpacked, unpackedDir(commitSha), { recursive: true });

    const tarSrc = join(tempRoot, "pkg.tgz");
    if (existsSync(tarSrc)) {
      cpSync(tarSrc, packageTarPath(commitSha));
    } else {
      const { spawnSync } = await import("node:child_process");
      const result = spawnSync(
        "tar",
        [
          "-czf",
          packageTarPath(commitSha),
          "-C",
          unpackedDir(commitSha),
          ".",
        ],
        { encoding: "utf8" },
      );
      if (result.status !== 0) {
        throw new GitHubSyncError(result.stderr || "tarball create failed");
      }
    }

    const inventory = await deps.fetchTree(parsed.owner, parsed.repo);
    const versions: VersionEntry[] = tags.length
      ? tags.map((t) =>
          t.id === latestVersion ? { ...t, commitSha } : t,
        )
      : [{ id: "main", commitSha }];

    const manifest: PackageManifest = {
      latestCommit: commitSha,
      latestVersion,
      versions,
      inventory,
      syncedAt: new Date().toISOString(),
    };
    writePackageManifest(manifest);
    cleanupOldCommits(commitSha);
    rmSync(tempRoot, { recursive: true, force: true });

    return { status: "synced", commitSha, version: latestVersion };
  } catch (error) {
    if (error instanceof GitHubSyncError || error instanceof GitHubConfigError) {
      return { code: "sync_error", message: error.message };
    }
    if (error instanceof Error) {
      return { code: "sync_error", message: error.message };
    }
    throw error;
  }
}
