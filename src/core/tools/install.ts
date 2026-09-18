import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import type { PathRoots } from "@sdd/paths";
import {
  detectClient,
  resolveClientPaths,
  type PathDetectOptions,
  type ResolvedClientPaths,
} from "@/core/path-detect";
import {
  CACHE_STALE_MINUTES,
  resolveCachedVersion,
} from "@/core/sync/cache";
import { ensurePackageCacheFresh } from "@/core/sync/ensure-cache-fresh";
import { fetchPackage, getSddServerUrl } from "./package-fetch";
import { toolError, toolOk } from "./errors";

const MANIFEST_NAME = ".sdd-installed.json";

export type InstallArgs = {
  version?: string;
  client?: string;
  os?: string;
  force?: boolean;
  /** When AI read local manifest first (HTTP channel idempotency). */
  installed_commit?: string;
  installed_version?: string;
};

export type InstallContext = PathDetectOptions & {
  channel: "stdio" | "http";
  clientInfo?: { name?: string };
};

type Manifest = {
  version: number;
  package_version: string;
  package_commit?: string;
  installed_at: string;
  files: {
    skills: string[];
    rules: string[];
    agents: string[];
    workflows: string[];
  };
};

function listNames(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((n) => n !== MANIFEST_NAME && !n.startsWith("."));
}

function copyTree(from: string, to: string): void {
  if (!existsSync(from)) return;
  mkdirSync(dirname(to), { recursive: true });
  cpSync(from, to, { recursive: true });
}

function removeListed(root: string, names: string[]): void {
  for (const name of names) {
    const abs = join(root, name.replace(/\/$/, ""));
    if (existsSync(abs)) {
      rmSync(abs, { recursive: true, force: true });
    }
  }
}

function readManifest(clientRoot: string): Manifest | null {
  const path = join(clientRoot, MANIFEST_NAME);
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf8")) as Manifest;
  } catch {
    return null;
  }
}

function writeManifest(clientRoot: string, manifest: Manifest): void {
  mkdirSync(clientRoot, { recursive: true });
  writeFileSync(join(clientRoot, MANIFEST_NAME), JSON.stringify(manifest, null, 2));
}

function verifyManifestIntegrity(roots: PathRoots, manifest: Manifest): boolean {
  const checks: [string, string[]][] = [
    [roots.skills, manifest.files.skills],
    [roots.rules, manifest.files.rules],
    [roots.agents, manifest.files.agents],
    [roots.workflows, manifest.files.workflows],
  ];
  for (const [root, names] of checks) {
    for (const name of names) {
      const rel = name.replace(/[/\\]+$/, "");
      if (!existsSync(join(root, rel))) {
        return false;
      }
    }
  }
  return true;
}

function clientRootFromSkills(skills: string): string {
  return dirname(skills.replace(/[/\\]+$/, ""));
}

function inventoryFromUnpacked(unpackedPath: string): Manifest["files"] {
  return {
    skills: listNames(join(unpackedPath, "skills")),
    rules: listNames(join(unpackedPath, "rules")),
    agents: listNames(join(unpackedPath, "agents")),
    workflows: listNames(join(unpackedPath, "workflows")),
  };
}

function buildHttpInstallInstructions(
  extractTarget: string,
  manifestPath: string,
  packageUrl: string,
  options?: { cacheStale?: boolean; cacheAgeMinutes?: number },
): string {
  const lines = [
    "HTTP MCP cannot write the local filesystem. Execute these steps on the developer machine:",
    "Before calling install with installed_commit / installed_version, confirm every file listed in the local manifest still exists under the returned paths. If any are missing, omit installed_commit so the tool returns the package for re-extraction.",
    `1. Read ${manifestPath} if it exists (previousManifest). Remove files listed under files.* before extracting.`,
    `2. Download and extract: curl -fsSL "${packageUrl}" | tar xz -C "${extractTarget}" --strip-components 1`,
    `3. Write the manifest JSON returned in this response to ${manifestPath}.`,
    "4. Verify skills, rules, agents, and workflows exist under the paths returned.",
  ];
  if (options?.cacheStale) {
    const age = Math.round(options.cacheAgeMinutes ?? CACHE_STALE_MINUTES);
    lines.push(
      `Note: package cache may be stale (last synced ${age} min ago). Ask the operator to run sync, or retry shortly.`,
    );
  }
  return lines.join("\n");
}

function applyPackage(pkgDir: string, roots: PathRoots): Manifest["files"] {
  const files: Manifest["files"] = {
    skills: listNames(join(pkgDir, "skills")),
    rules: listNames(join(pkgDir, "rules")),
    agents: listNames(join(pkgDir, "agents")),
    workflows: listNames(join(pkgDir, "workflows")),
  };
  copyTree(join(pkgDir, "skills"), roots.skills);
  copyTree(join(pkgDir, "rules"), roots.rules);
  copyTree(join(pkgDir, "agents"), roots.agents);
  copyTree(join(pkgDir, "workflows"), roots.workflows);
  return files;
}

type ResolvedInstallContext = {
  detected: string;
  resolved: ResolvedClientPaths;
  roots: PathRoots;
  clientRoot: string;
};

type InstallContextResult =
  | { ok: true; ctx: ResolvedInstallContext }
  | { ok: false; result: CallToolResult };

async function resolveInstallContext(
  args: InstallArgs,
  ctx: InstallContext,
): Promise<InstallContextResult> {
  const detected = args.client ?? detectClient(ctx.clientInfo) ?? undefined;
  if (!detected) {
    return {
      ok: false,
      result: toolError(
        "client_unknown",
        "Unable to detect MCP client. Pass client explicitly.",
      ),
    };
  }

  const resolved = await resolveClientPaths(detected, {
    ...ctx,
    os: args.os ?? ctx.os,
    skipLlm: ctx.skipLlm,
  });
  if ("code" in resolved) {
    const code = resolved.code;
    if (code === "client_unknown") {
      return {
        ok: false,
        result: toolError("client_unknown", `Unknown client: ${detected}`),
      };
    }
    if (code === "os_unsupported") {
      return {
        ok: false,
        result: toolError("os_unsupported", `Unsupported OS for ${detected}`),
      };
    }
    if (code === "path_rejected") {
      return {
        ok: false,
        result: toolError("path_rejected", resolved.reason),
      };
    }
    if (code === "llm_unavailable") {
      return {
        ok: false,
        result: toolError("llm_unavailable", "Qwen path discovery failed"),
      };
    }
    return {
      ok: false,
      result: toolError("client_config_unresolved", "Could not resolve client paths"),
    };
  }

  const roots = resolved.primary;
  const clientRoot = clientRootFromSkills(roots.skills);
  return { ok: true, ctx: { detected, resolved, roots, clientRoot } };
}

export async function installFramework(
  args: InstallArgs,
  ctx: InstallContext,
): Promise<CallToolResult> {
  const installCtx = await resolveInstallContext(args, ctx);
  if (!installCtx.ok) return installCtx.result;
  const { detected, resolved, roots, clientRoot } = installCtx.ctx;

  if (ctx.channel === "http") {
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

    if (
      !args.force &&
      args.installed_commit &&
      args.installed_version &&
      args.installed_commit === cached.commitSha &&
      args.installed_version === cached.version
    ) {
      return toolError(
        "already_up_to_date",
        `Framework ${cached.version} is already installed.`,
      );
    }

    const versionParam = args.version?.trim() || "latest";
    const packageUrl = `${getSddServerUrl()}/api/sdd/package?version=${encodeURIComponent(versionParam)}`;
    const manifestPath = join(clientRoot, MANIFEST_NAME);
    const previousManifest = readManifest(clientRoot);
    const files = inventoryFromUnpacked(cached.unpackedPath);
    const manifest: Manifest = {
      version: 1,
      package_version: cached.version,
      package_commit: cached.commitSha,
      installed_at: new Date().toISOString(),
      files,
    };

    const cacheAgeMinutes =
      (Date.now() - Date.parse(cached.syncedAt)) / (60 * 1000);
    const cacheStale = cacheAgeMinutes > CACHE_STALE_MINUTES;

    return toolOk({
      packageUrl,
      version: cached.version,
      commitSha: cached.commitSha,
      client: detected,
      paths: roots,
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

  const pkg = await fetchPackage(args.version);
  if ("code" in pkg) {
    return toolError("package_unavailable", pkg.message);
  }

  const previous = readManifest(clientRoot);
  if (previous && !args.force) {
    const sameCommit =
      Boolean(previous.package_commit) &&
      previous.package_commit === pkg.commitSha;
    const sameVersion = previous.package_version === pkg.version;
    if (sameCommit && sameVersion && verifyManifestIntegrity(roots, previous)) {
      return toolError(
        "already_up_to_date",
        `Framework ${pkg.version} is already installed.`,
      );
    }
  }

  if (previous) {
    removeListed(roots.skills, previous.files.skills);
    removeListed(roots.rules, previous.files.rules);
    removeListed(roots.agents, previous.files.agents);
    removeListed(roots.workflows, previous.files.workflows);
  }

  const files = applyPackage(pkg.tempDir, roots);
  writeManifest(clientRoot, {
    version: 1,
    package_version: pkg.version,
    package_commit: pkg.commitSha,
    installed_at: new Date().toISOString(),
    files,
  });

  return toolOk({
    version: pkg.version,
    paths: roots,
    asset_counts: {
      skills: files.skills.length,
      rules: files.rules.length,
      agents: files.agents.length,
      workflows: files.workflows.length,
    },
    resolution_source: resolved.source,
  });
}

export async function updateFramework(
  args: InstallArgs,
  ctx: InstallContext,
): Promise<CallToolResult> {
  return installFramework(args, ctx);
}
