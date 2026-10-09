import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
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
} from "./install";
import { composeInstallPlan, type InstallLedger } from "./install-plan";
import { getSddServerUrl } from "./package-fetch";
import { toolError, toolOk } from "./errors";

export const WRITER_ASSETS = [
  "sdd-mcp-darwin-arm64",
  "sdd-mcp-darwin-x64",
  "sdd-mcp-linux-arm64",
  "sdd-mcp-linux-x64",
  "sdd-mcp-windows-x64.exe",
] as const;

const RELEASE_REPO =
  "https://github.com/ethanhuangcst/workspace.framework.sdd.works/releases";

function asLedger(value: unknown): InstallLedger | null {
  if (!value || typeof value !== "object") return null;
  return value as InstallLedger;
}

function planInstruction(
  action: "noop" | "rewrite_ledger" | "apply",
  packageUrl: string,
  deletePaths: string[],
  writePaths: string[],
): string {
  if (action === "noop") {
    return "Do not write files. The pack is already up to date. Do not extract an archive into the client root.";
  }
  if (action === "rewrite_ledger") {
    return "Rewrite .sdd-installed.json with pack_complete true. Do not copy files. Do not extract an archive into the client root.";
  }
  const deletes = deletePaths.length ? deletePaths.join(", ") : "(none)";
  const writes = writePaths.length ? writePaths.join(", ") : "(none)";
  return [
    "Download the pack from the packageUrl to a temp path outside the client root.",
    `Delete only these recorded files, and do not delete a parent directory: ${deletes}.`,
    `Copy only these paths from the pack: ${writes}.`,
    "Write .sdd-installed.json last with pack_complete true.",
    "Do not extract the archive into the client root.",
    `packageUrl: ${packageUrl}`,
  ].join("\n");
}

function writerInstruction(serverUrl: string, cacheStale: boolean, cacheAgeMinutes: number): string {
  const lines = [
    "The local program must write the pack. Do not extract an archive into the client root.",
    `Download one matching asset from ${RELEASE_REPO}/latest/download/<asset>.`,
    `Assets: ${WRITER_ASSETS.join(", ")}.`,
    "Save it as the home directory plus .sdd/sdd-mcp. Expand the home directory first. Do not leave a tilde in the path. On Windows the file name is sdd-mcp.exe.",
    `Run that file once with --write, --client, and --os. Set SDD_SERVER_URL to ${serverUrl}.`,
    "Do not put that path in mcp.json. mcp.json stays a url entry only.",
  ];
  if (cacheStale) {
    const age = Math.round(cacheAgeMinutes);
    lines.push(
      `Note: package cache may be stale (last synced ${age} min ago). Ask the operator to run sync, or retry shortly.`,
    );
  }
  return lines.join("\n");
}

/**
 * HTTP install/update. No inventory: ask for the local writer.
 * Inventory present: return the server plan. This module stays out of the stdio binary.
 */
export async function installFrameworkHttp(
  args: InstallArgs,
  ctx: InstallContext,
): Promise<CallToolResult> {
  const installCtx = await resolveInstallContextForHttp(args, ctx);
  if (!installCtx.ok) return installCtx.result;
  const { detected, resolved } = installCtx.ctx;

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
  const serverUrl = getSddServerUrl().replace(/\/+$/, "");
  const packageUrl = `${serverUrl}/api/sdd/package?version=${encodeURIComponent(versionParam)}`;
  const files = inventoryFromUnpacked(cached.unpackedPath);
  const cacheAgeMinutes =
    (Date.now() - Date.parse(cached.syncedAt)) / (60 * 1000);
  const cacheStale = cacheAgeMinutes > CACHE_STALE_MINUTES;
  const cache = {
    cache_synced_at: cached.syncedAt,
    cache_age_minutes: Math.round(cacheAgeMinutes * 10) / 10,
    cache_stale: cacheStale,
    cache_refresh: "code" in fresh ? undefined : fresh.status,
  };

  if (!args.inventory) {
    return toolOk({
      code: "writer_required",
      packageUrl,
      version: cached.version,
      commitSha: cached.commitSha,
      client: detected,
      assets: [...WRITER_ASSETS],
      release_repo: RELEASE_REPO,
      resolution_source: resolved.source,
      ...cache,
      instructions: writerInstruction(serverUrl, cacheStale, cacheAgeMinutes),
    });
  }

  const ledger = asLedger(args.inventory.ledger);
  const plan = composeInstallPlan({
    ledger,
    missing: args.inventory.missing ?? [],
    force: args.force,
    packageVersion: cached.version,
    packageCommit: cached.commitSha,
    packFiles: files,
  });
  const installedAt = new Date().toISOString();
  const manifest = {
    version: 1 as const,
    package_version: cached.version,
    package_commit: cached.commitSha,
    installed_at: installedAt,
    pack_complete: true as const,
    files,
  };

  return toolOk({
    packageUrl,
    version: cached.version,
    commitSha: cached.commitSha,
    client: detected,
    plan,
    manifest,
    resolution_source: resolved.source,
    ...cache,
    instructions: planInstruction(plan.action, packageUrl, plan.delete, plan.write),
  });
}

export async function updateFrameworkHttp(
  args: InstallArgs,
  ctx: InstallContext,
): Promise<CallToolResult> {
  return installFrameworkHttp(args, ctx);
}
