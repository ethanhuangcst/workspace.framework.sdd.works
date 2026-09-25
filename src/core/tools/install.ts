import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { resolveTemplates, type PathRoots } from "@sdd/paths";
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
  /** HTTP hint only — AI read from local manifest; never used for already_up_to_date. */
  installed_commit?: string;
  installed_version?: string;
};

export type InstallContext = PathDetectOptions & {
  channel: "stdio" | "http";
  clientInfo?: { name?: string };
};

type ManifestFiles = {
  skills: string[];
  rules: string[];
  agents: string[];
  workflows: string[];
  templates: string[];
};

type Manifest = {
  version: number;
  package_version: string;
  package_commit?: string;
  installed_at: string;
  /** Absent on older ledgers; false when Ethan cleared the gate; true after a successful copy. */
  pack_complete?: boolean;
  files: ManifestFiles;
};

/** Walk a directory and return file paths as `{prefix}/{relative}`, skipping dotfiles. */
function listPackFiles(dir: string, prefix: string): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  const walk = (current: string, rel: string): void => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      if (entry.name.startsWith(".") || entry.name === MANIFEST_NAME) continue;
      const childRel = rel ? `${rel}/${entry.name}` : entry.name;
      const abs = join(current, entry.name);
      if (entry.isDirectory()) {
        walk(abs, childRel);
      } else if (entry.isFile()) {
        out.push(`${prefix}/${childRel}`);
      }
    }
  };
  walk(dir, "");
  return out;
}

function copyTree(from: string, to: string): void {
  if (!existsSync(from)) return;
  mkdirSync(dirname(to), { recursive: true });
  cpSync(from, to, { recursive: true });
}

function isClientRelativePath(name: string): boolean {
  return /[/\\]/.test(name.replace(/[/\\]+$/, ""));
}

function resolveListedPath(
  clientRoot: string,
  categoryRoot: string,
  name: string,
): string {
  const rel = name.replace(/[/\\]+$/, "");
  if (isClientRelativePath(rel)) {
    return join(clientRoot, rel);
  }
  return join(categoryRoot, rel);
}

function removeListed(
  clientRoot: string,
  categoryRoot: string,
  names: string[],
): void {
  for (const name of names) {
    const abs = resolveListedPath(clientRoot, categoryRoot, name);
    if (!existsSync(abs)) continue;
    // ADR-059: a directory name in an older ledger is not a delete of that directory.
    if (lstatSync(abs).isDirectory()) continue;
    rmSync(abs, { force: true });
  }
}

function readManifest(clientRoot: string): Manifest | null {
  const path = join(clientRoot, MANIFEST_NAME);
  if (!existsSync(path)) return null;
  try {
    const parsed = JSON.parse(readFileSync(path, "utf8")) as Manifest;
    return {
      ...parsed,
      files: {
        skills: parsed.files?.skills ?? [],
        rules: parsed.files?.rules ?? [],
        agents: parsed.files?.agents ?? [],
        workflows: parsed.files?.workflows ?? [],
        templates: parsed.files?.templates ?? [],
      },
    };
  } catch {
    return null;
  }
}

function writeManifest(clientRoot: string, manifest: Manifest): void {
  mkdirSync(clientRoot, { recursive: true });
  writeFileSync(join(clientRoot, MANIFEST_NAME), JSON.stringify(manifest, null, 2));
}

function templatesRoot(clientRoot: string): string {
  return join(clientRoot, "templates");
}

function verifyManifestIntegrity(
  roots: PathRoots,
  clientRoot: string,
  manifest: Manifest,
): boolean {
  const checks: [string, string[]][] = [
    [roots.skills, manifest.files.skills],
    [roots.rules, manifest.files.rules],
    [roots.agents, manifest.files.agents],
    [roots.workflows, manifest.files.workflows],
    [templatesRoot(clientRoot), manifest.files.templates],
  ];
  for (const [categoryRoot, names] of checks) {
    for (const name of names) {
      if (!existsSync(resolveListedPath(clientRoot, categoryRoot, name))) {
        return false;
      }
    }
  }
  return true;
}

function clientRootFromSkills(skills: string): string {
  return dirname(skills.replace(/[/\\]+$/, ""));
}

function defaultOs(): string {
  return process.platform === "win32" || process.platform === "linux"
    ? process.platform
    : "darwin";
}

function hasInstallHome(ctx: InstallContext): boolean {
  return Boolean(ctx.home);
}

/** Resolve pack source dir with aliases: skill→skills, Rules→rules (case-insensitive). */
function resolvePackSourceDir(pkgDir: string, kind: "skills" | "rules"): string | null {
  if (kind === "skills") {
    for (const name of ["skills", "skill"]) {
      const p = join(pkgDir, name);
      if (existsSync(p)) return p;
    }
    return null;
  }
  for (const name of ["rules", "Rules"]) {
    const p = join(pkgDir, name);
    if (existsSync(p)) return p;
  }
  // Case-insensitive scan for rules*
  if (existsSync(pkgDir)) {
    for (const entry of readdirSync(pkgDir)) {
      if (entry.toLowerCase() === "rules") {
        return join(pkgDir, entry);
      }
    }
  }
  return null;
}

function inventoryFromUnpacked(unpackedPath: string): ManifestFiles {
  const skillsDir = resolvePackSourceDir(unpackedPath, "skills");
  const rulesDir = resolvePackSourceDir(unpackedPath, "rules");
  return {
    skills: skillsDir ? listPackFiles(skillsDir, "skills") : [],
    rules: rulesDir ? listPackFiles(rulesDir, "rules") : [],
    agents: listPackFiles(join(unpackedPath, "agents"), "agents"),
    workflows: listPackFiles(join(unpackedPath, "workflows"), "workflows"),
    templates: listPackFiles(join(unpackedPath, "templates"), "templates"),
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
    "Always verify local files from the manifest exist before skipping extraction. If any skill, rule, agent, workflow, or template file is missing, you MUST run step 2.",
    `1. Read ${manifestPath} if it exists (previousManifest). Remove only the files listed under files.* before extracting. Do not delete a parent directory for a listed file path.`,
    `2. Download and extract only pack allow-list folders (agents, skills|skill, rules|Rules, workflows, templates): curl -fsSL "${packageUrl}" | tar xz -C "${extractTarget}" --strip-components 1`,
    `3. Write the manifest JSON returned in this response to ${manifestPath} last (after extract and verify). The manifest includes pack_complete: true and each pack file path.`,
    "4. Verify skills, rules, agents, workflows, and templates exist under the paths returned.",
  ];
  if (options?.cacheStale) {
    const age = Math.round(options.cacheAgeMinutes ?? CACHE_STALE_MINUTES);
    lines.push(
      `Note: package cache may be stale (last synced ${age} min ago). Ask the operator to run sync, or retry shortly.`,
    );
  }
  return lines.join("\n");
}

function applyPackage(
  pkgDir: string,
  roots: PathRoots,
  clientRoot: string,
): ManifestFiles {
  const skillsSrc = resolvePackSourceDir(pkgDir, "skills");
  const rulesSrc = resolvePackSourceDir(pkgDir, "rules");
  const agentsSrc = join(pkgDir, "agents");
  const workflowsSrc = join(pkgDir, "workflows");
  const templatesSrc = join(pkgDir, "templates");
  const templatesDest = templatesRoot(clientRoot);

  if (skillsSrc) copyTree(skillsSrc, roots.skills);
  if (rulesSrc) copyTree(rulesSrc, roots.rules);
  if (existsSync(agentsSrc)) copyTree(agentsSrc, roots.agents);
  if (existsSync(workflowsSrc)) copyTree(workflowsSrc, roots.workflows);
  if (existsSync(templatesSrc)) copyTree(templatesSrc, templatesDest);

  return {
    skills: skillsSrc ? listPackFiles(skillsSrc, "skills") : [],
    rules: rulesSrc ? listPackFiles(rulesSrc, "rules") : [],
    agents: listPackFiles(agentsSrc, "agents"),
    workflows: listPackFiles(workflowsSrc, "workflows"),
    templates: listPackFiles(templatesSrc, "templates"),
  };
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

  const os = args.os ?? ctx.os ?? defaultOs();

  if (ctx.channel === "http" && !hasInstallHome(ctx)) {
    const templates = resolveTemplates(detected, os);
    if ("code" in templates) {
      if (templates.code === "client_unknown") {
        return {
          ok: false,
          result: toolError("client_unknown", `Unknown client: ${detected}`),
        };
      }
      return {
        ok: false,
        result: toolError(
          "os_unsupported",
          `Unsupported OS for ${detected}`,
        ),
      };
    }
    const clientRoot = clientRootFromSkills(templates.skills);
    const resolved: ResolvedClientPaths = {
      primary: templates,
      compat: [],
      source: "seed",
    };
    return {
      ok: true,
      ctx: { detected, resolved, roots: templates, clientRoot },
    };
  }

  const resolved = await resolveClientPaths(detected, {
    ...ctx,
    os,
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

    const versionParam = args.version?.trim() || "latest";
    const packageUrl = `${getSddServerUrl()}/api/sdd/package?version=${encodeURIComponent(versionParam)}`;
    const manifestPath = join(clientRoot, MANIFEST_NAME);
    const previousManifest = hasInstallHome(ctx) ? readManifest(clientRoot) : null;
    const files = inventoryFromUnpacked(cached.unpackedPath);
    const installedAt = new Date().toISOString();
    const manifest: Manifest = {
      version: 1,
      package_version: cached.version,
      package_commit: cached.commitSha,
      installed_at: installedAt,
      pack_complete: true,
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
    if (
      sameCommit &&
      sameVersion &&
      verifyManifestIntegrity(roots, clientRoot, previous)
    ) {
      // Missing pack_complete: rewrite flag only (scenario 6a). Present true/false: already up to date.
      if (previous.pack_complete === undefined) {
        const installedAt = new Date().toISOString();
        writeManifest(clientRoot, {
          version: previous.version ?? 1,
          package_version: previous.package_version,
          package_commit: previous.package_commit,
          installed_at: installedAt,
          pack_complete: true,
          files: previous.files,
        });
        return toolOk({
          version: pkg.version,
          paths: {
            ...roots,
            templates: templatesRoot(clientRoot),
          },
          manifestPath: join(clientRoot, MANIFEST_NAME),
          ledger_rewritten: true,
          resolution_source: resolved.source,
        });
      }
      return toolError(
        "already_up_to_date",
        `Framework ${pkg.version} is already installed.`,
      );
    }
  }

  if (previous) {
    removeListed(clientRoot, roots.skills, previous.files.skills);
    removeListed(clientRoot, roots.rules, previous.files.rules);
    removeListed(clientRoot, roots.agents, previous.files.agents);
    removeListed(clientRoot, roots.workflows, previous.files.workflows);
    removeListed(clientRoot, templatesRoot(clientRoot), previous.files.templates);
  }

  const files = applyPackage(pkg.tempDir, roots, clientRoot);
  const installedAt = new Date().toISOString();
  writeManifest(clientRoot, {
    version: 1,
    package_version: pkg.version,
    package_commit: pkg.commitSha,
    installed_at: installedAt,
    pack_complete: true,
    files,
  });

  return toolOk({
    version: pkg.version,
    paths: {
      ...roots,
      templates: templatesRoot(clientRoot),
    },
    manifestPath: join(clientRoot, MANIFEST_NAME),
    asset_counts: {
      skills: files.skills.length,
      rules: files.rules.length,
      agents: files.agents.length,
      workflows: files.workflows.length,
      templates: files.templates.length,
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
