import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { resolveCachedVersion } from "@/core/sync/cache";
import { readBundledPack } from "@/core/sync/bundled-pack";
import { ensurePackageCacheFresh } from "@/core/sync/ensure-cache-fresh";
import { isRefusedFixturePack } from "@/core/sync/fixture-pack";
import {
  type InstallArgs,
  type InstallContext,
  resolveInstallContextForHttp,
  inventoryFromUnpacked,
} from "./install";
import { composeInstallPlan, type InstallLedger } from "./install-plan";
import { getSddServerUrl } from "./package-fetch";
import { toolError, toolOk } from "./errors";

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

type ResolvedPack = {
  version: string;
  commitSha: string;
  unpackedPath: string;
  syncedAt: string;
  packSource: "cache" | "bundled";
};

function resolvePackForInstall(
  requested?: string,
): ResolvedPack | CallToolResult {
  const cached = resolveCachedVersion(requested);
  if (!("code" in cached)) {
    if (isRefusedFixturePack(cached.commitSha, cached.unpackedPath)) {
      const bundled = readBundledPack();
      if (!bundled) {
        return toolError(
          "invalid_input",
          "Cached pack is a fixture and bundled fallback is missing.",
        );
      }
      return {
        version: bundled.version,
        commitSha: bundled.commitSha,
        unpackedPath: bundled.unpackedPath,
        syncedAt: new Date().toISOString(),
        packSource: "bundled",
      };
    }
    return {
      version: cached.version,
      commitSha: cached.commitSha,
      unpackedPath: cached.unpackedPath,
      syncedAt: cached.syncedAt,
      packSource: "cache",
    };
  }

  const trimmed = requested?.trim();
  if (cached.code === "version_not_found" && trimmed && trimmed !== "latest") {
    return toolError(
      "invalid_input",
      `Version ${trimmed} is not in the package cache.`,
    );
  }

  const bundled = readBundledPack();
  if (!bundled) {
    return toolError(
      "invalid_input",
      "Package cache is empty and bundled fallback is missing.",
    );
  }
  return {
    version: bundled.version,
    commitSha: bundled.commitSha,
    unpackedPath: bundled.unpackedPath,
    syncedAt: new Date().toISOString(),
    packSource: "bundled",
  };
}

function isToolResult(value: unknown): value is CallToolResult {
  return (
    typeof value === "object" &&
    value !== null &&
    "content" in value &&
    Array.isArray((value as CallToolResult).content)
  );
}

/**
 * HTTP install/update (ADR-131). Validates agent root, uses cache or bundled pack, returns plan + tarball URL.
 */
export async function installFrameworkHttp(
  args: InstallArgs,
  ctx: InstallContext,
): Promise<CallToolResult> {
  const installCtx = await resolveInstallContextForHttp(args, ctx);
  if (!installCtx.ok) return installCtx.result;
  const { detected, resolved, clientRoot } = installCtx.ctx;

  await ensurePackageCacheFresh();

  const packResult = resolvePackForInstall(args.version);
  if (isToolResult(packResult)) return packResult;
  const pack = packResult;

  const versionParam =
    args.version?.trim() ||
    (pack.packSource === "bundled" ? pack.version : "latest");
  const serverUrl = getSddServerUrl().replace(/\/+$/, "");
  const packageUrl = `${serverUrl}/api/sdd/package?version=${encodeURIComponent(versionParam)}`;
  const files = inventoryFromUnpacked(pack.unpackedPath);

  const ledger = asLedger(args.inventory?.ledger ?? null);
  const missing = args.inventory?.missing ?? [];
  const plan = composeInstallPlan({
    ledger,
    missing,
    force: args.force,
    packageVersion: pack.version,
    packageCommit: pack.commitSha,
    packFiles: files,
  });
  const installedAt = new Date().toISOString();
  const manifest = {
    version: 1 as const,
    package_version: pack.version,
    package_commit: pack.commitSha,
    installed_at: installedAt,
    pack_complete: true as const,
    files,
  };

  const rootForResponse = clientRoot;

  const body: Record<string, unknown> = {
    action: plan.action,
    root: rootForResponse,
    version: pack.version,
    commitSha: pack.commitSha,
    client: detected,
    plan,
    manifest,
    resolution_source: resolved.source,
    pack_source: pack.packSource,
    cache_synced_at: pack.syncedAt,
    instructions: planInstruction(
      plan.action,
      plan.action === "apply" ? packageUrl : "",
      plan.delete,
      plan.write,
    ),
  };

  if (plan.action === "apply") {
    body.packageUrl = packageUrl;
  }

  return toolOk(body);
}

export async function updateFrameworkHttp(
  args: InstallArgs,
  ctx: InstallContext,
): Promise<CallToolResult> {
  return installFrameworkHttp(args, ctx);
}
