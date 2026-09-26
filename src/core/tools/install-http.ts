import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { join } from "node:path";
import {
  CACHE_STALE_MINUTES,
  resolveCachedVersion,
} from "@/core/sync/cache";
import { ensurePackageCacheFresh } from "@/core/sync/ensure-cache-fresh";
import {
  type InstallArgs,
  type InstallContext,
  resolveInstallContextForHttp,
  inventoryFromUnpacked,
  buildHttpInstallInstructions,
  readInstallManifest,
  hasInstallHome,
  templatesRoot,
  MANIFEST_NAME,
} from "./install";
import { getSddServerUrl } from "./package-fetch";
import { toolError, toolOk } from "./errors";

/**
 * HTTP install/update: returns packageUrl + ledger for the AI to write.
 * Kept in a separate module so the stdio binary never imports Prisma sync.
 */
export async function installFrameworkHttp(
  args: InstallArgs,
  ctx: InstallContext,
): Promise<CallToolResult> {
  const installCtx = await resolveInstallContextForHttp(args, ctx);
  if (!installCtx.ok) return installCtx.result;
  const { detected, resolved, roots, clientRoot } = installCtx.ctx;

  const fresh = await ensurePackageCacheFresh();

  const cached = resolveCachedVersion(args.version);
  if ("code" in cached) {
    if (cached.code === "sync_pending") {
      return toolError(
        "sync_pending",
        "Package cache not ready. Operator must run sync first.",
      );
    }
    return toolError("version_not_found", "Requested version not in cache.");
  }

  const versionParam = args.version?.trim() || "latest";
  const packageUrl = `${getSddServerUrl()}/api/sdd/package?version=${encodeURIComponent(versionParam)}`;
  const manifestPath = join(clientRoot, MANIFEST_NAME);
  const previousManifest = hasInstallHome(ctx)
    ? readInstallManifest(clientRoot)
    : null;
  const files = inventoryFromUnpacked(cached.unpackedPath);
  const installedAt = new Date().toISOString();
  const manifest = {
    version: 1 as const,
    package_version: cached.version,
    package_commit: cached.commitSha,
    installed_at: installedAt,
    pack_complete: true as const,
    files,
  };

  const cacheAgeMinutes =
    (Date.now() - Date.parse(cached.syncedAt)) / (60 * 1000);
  const cacheStale = cacheAgeMinutes > CACHE_STALE_MINUTES;
  const localCommitMatches =
    Boolean(args.installed_commit) &&
    args.installed_commit === cached.commitSha &&
    args.installed_version === cached.version;

  return toolOk({
    packageUrl,
    version: cached.version,
    commitSha: cached.commitSha,
    extract_recommended: true,
    local_commit_matches: localCommitMatches,
    client: detected,
    paths: {
      ...roots,
      templates: templatesRoot(clientRoot),
    },
    manifestPath,
    manifest,
    previousManifest,
    extractTarget: clientRoot,
    cache_synced_at: cached.syncedAt,
    cache_age_minutes: Math.round(cacheAgeMinutes * 10) / 10,
    cache_stale: cacheStale,
    cache_refresh: "code" in fresh ? undefined : fresh.status,
    instructions: buildHttpInstallInstructions(
      clientRoot,
      manifestPath,
      packageUrl,
      { cacheStale, cacheAgeMinutes },
    ),
    resolution_source: resolved.source,
  });
}

export async function updateFrameworkHttp(
  args: InstallArgs,
  ctx: InstallContext,
): Promise<CallToolResult> {
  return installFrameworkHttp(args, ctx);
}
