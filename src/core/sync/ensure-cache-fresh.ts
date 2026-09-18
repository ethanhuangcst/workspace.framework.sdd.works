import { clearListVersionsCache } from "@/core/tools/list-versions";
import { readPackageManifest } from "./manifest";
import {
  resolveLatestLiveCommit,
  syncFrameworkRepo,
  type LiveCommitRef,
  type SyncResult,
} from "./sync-job";

export type EnsureFreshResult =
  | { status: "fresh" }
  | { status: "refreshed"; commitSha: string; version: string }
  | { status: "unchanged"; commitSha: string; version: string }
  | { code: "sync_error"; message: string };

type EnsureFreshDeps = {
  readManifest: () => ReturnType<typeof readPackageManifest>;
  resolveLive: () => Promise<LiveCommitRef>;
  sync: () => Promise<SyncResult>;
  clearVersionsCache: () => void;
};

function defaultDeps(): EnsureFreshDeps {
  return {
    readManifest: readPackageManifest,
    resolveLive: resolveLatestLiveCommit,
    sync: syncFrameworkRepo,
    clearVersionsCache: clearListVersionsCache,
  };
}

let depsOverride: EnsureFreshDeps | null = null;

export function setEnsureCacheFreshDepsForTests(deps: EnsureFreshDeps | null): void {
  depsOverride = deps;
}

function getDeps(): EnsureFreshDeps {
  return depsOverride ?? defaultDeps();
}

/** Compare cached manifest to live GitHub tip; sync when they differ. */
export async function ensurePackageCacheFresh(): Promise<EnsureFreshResult> {
  const deps = getDeps();
  const manifest = deps.readManifest();
  const live = await deps.resolveLive();

  if ("code" in live) {
    if (manifest) return { status: "fresh" };
    return live;
  }

  if (!manifest || manifest.latestCommit !== live.commitSha) {
    const sync = await deps.sync();
    deps.clearVersionsCache();
    if ("code" in sync) return sync;
    if (sync.status === "synced") {
      return {
        status: "refreshed",
        commitSha: sync.commitSha,
        version: sync.version,
      };
    }
    return {
      status: "unchanged",
      commitSha: sync.commitSha,
      version: sync.version,
    };
  }

  return { status: "fresh" };
}
