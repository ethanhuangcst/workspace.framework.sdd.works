import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { homedir } from "node:os";
import { expandHome, resolve, resolveTemplates, type PathRoots } from "@sdd/paths";
import { validateExpandedPath } from "@/core/path-policy";
import {
  detectClient,
  type PathDetectOptions,
  type ResolvedClientPaths,
} from "@/core/path-detect";
import type { InstallLedger } from "./install-plan";
import { toolError } from "./errors";

export const MANIFEST_NAME = ".sdd-installed.json";

export type InstallArgs = {
  version?: string;
  client?: string;
  os?: string;
  force?: boolean;
  /** HTTP hint only — AI read from local manifest; never used for already_up_to_date. */
  installed_commit?: string;
  installed_version?: string;
  /** Present when the caller read the disk. Omitted means ledger null and missing []. */
  inventory?: {
    ledger: InstallLedger | null;
    missing: string[];
  };
  /** Agent-detected client root. Server validates against path policy (ADR-131). */
  root?: string;
};

export type InstallContext = PathDetectOptions & {
  channel: "http";
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

function templatesRoot(clientRoot: string): string {
  return join(clientRoot, "templates");
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

export {
  inventoryFromUnpacked,
  hasInstallHome,
  templatesRoot,
  readManifest as readInstallManifest,
};

function rootsFromClientRoot(clientRoot: string, win: boolean): PathRoots {
  const sep = win ? "\\" : "/";
  const base = clientRoot.replace(/[/\\]+$/, "");
  return {
    skills: `${base}${sep}skills${sep}`,
    rules: `${base}${sep}rules${sep}`,
    agents: `${base}${sep}agents${sep}`,
    workflows: `${base}${sep}workflows${sep}`,
    other: `${base}${sep}sdd${sep}`,
  };
}

function resolveUnknownClientRoot(
  args: InstallArgs,
  home: string,
  userProfile: string,
  os: string,
  detected: string,
): InstallContextResult {
  const trimmed = args.root?.trim();
  if (!trimmed) {
    return {
      ok: false,
      result: toolError(
        "root_required",
        "Send root for this client after asking the person where the IDE stores skills and rules.",
      ),
    };
  }
  const expanded = expandHome(trimmed, home, userProfile);
  const pathErr = validateExpandedPath(expanded, home, userProfile);
  if (pathErr) {
    const message =
      pathErr.code === "path_rejected" ? pathErr.reason : pathErr.code;
    return {
      ok: false,
      result: toolError("path_rejected", message),
    };
  }
  const win = os === "win32";
  const roots = rootsFromClientRoot(expanded, win);
  const resolved: ResolvedClientPaths = {
    primary: roots,
    compat: [],
    source: "agent",
  };
  return {
    ok: true,
    ctx: { detected, resolved, roots, clientRoot: expanded },
  };
}

export async function resolveInstallContextForHttp(
  args: InstallArgs,
  ctx: InstallContext,
): Promise<InstallContextResult> {
  return resolveInstallContext(args, ctx);
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
        const fallbackHome = homedir();
        return resolveUnknownClientRoot(
          args,
          fallbackHome,
          fallbackHome,
          os,
          detected,
        );
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

  const home = ctx.home ?? ctx.env?.HOME ?? homedir();
  const userProfile = ctx.userProfile ?? ctx.env?.USERPROFILE ?? home;
  const seed = resolve(detected, os, undefined, { home, userProfile });
  if ("code" in seed) {
    if (seed.code === "client_unknown") {
      return resolveUnknownClientRoot(
        args,
        home,
        userProfile,
        os,
        detected,
      );
    }
    if (seed.code === "os_unsupported") {
      return {
        ok: false,
        result: toolError("os_unsupported", `Unsupported OS for ${detected}`),
      };
    }
    if (seed.code === "path_rejected") {
      return {
        ok: false,
        result: toolError("path_rejected", seed.reason),
      };
    }
    return {
      ok: false,
      result: toolError("client_unknown", `Unknown client: ${detected}`),
    };
  }

  const roots: PathRoots = {
    skills: seed.skills,
    rules: seed.rules,
    agents: seed.agents,
    workflows: seed.workflows,
    other: seed.other,
  };
  const clientRoot = clientRootFromSkills(roots.skills);
  const resolvedPaths: ResolvedClientPaths = {
    primary: roots,
    compat: seed.compat ?? [],
    source: "seed",
  };
  return {
    ok: true,
    ctx: { detected, resolved: resolvedPaths, roots, clientRoot },
  };
}

export async function installFramework(
  args: InstallArgs,
  ctx: InstallContext,
): Promise<CallToolResult> {
  const { installFrameworkHttp } = await import("./install-http");
  return installFrameworkHttp(args, ctx);
}

export async function updateFramework(
  args: InstallArgs,
  ctx: InstallContext,
): Promise<CallToolResult> {
  const { updateFrameworkHttp } = await import("./install-http");
  return updateFrameworkHttp(args, ctx);
}
