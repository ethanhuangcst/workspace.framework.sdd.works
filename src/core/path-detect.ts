import { expandHome, resolve, type PathRoots } from "@sdd/paths";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { validateExpandedPath } from "@/core/path-policy";
import { discoverPathsWithLlm, type LlmPort } from "@/core/path-resolve-llm";

export type ResolutionSource = "env" | "config" | "seed" | "llm";

export type ResolvedClientPaths = {
  primary: PathRoots;
  compat: PathRoots[];
  source: ResolutionSource;
};

export type PathDetectError =
  | { code: "client_unknown"; client: string }
  | { code: "os_unsupported"; client: string; os: string }
  | { code: "path_rejected"; reason: string; raw: string }
  | { code: "client_config_unresolved" }
  | { code: "llm_unavailable" };

const CLIENT_ALIASES: Array<{ ids: string[]; client: string }> = [
  { ids: ["trae-cn", "traecode cn", "trae cn", "traecode-cn", "traecode"], client: "trae-cn" },
  { ids: ["trae-intl", "trae international", "trae"], client: "trae" },
  { ids: ["workbuddy-cn", "workbuddy cn", "codebuddy", "workbuddy"], client: "codebuddy" },
  { ids: ["claude-code", "claude code", "claude"], client: "claude" },
  { ids: ["github-copilot", "copilot"], client: "copilot" },
  { ids: ["gemini-cli", "gemini"], client: "gemini" },
  { ids: ["cursor"], client: "cursor" },
  { ids: ["cline"], client: "cline" },
  { ids: ["codex"], client: "codex" },
  { ids: ["kiro"], client: "kiro" },
  { ids: ["continue"], client: "continue" },
  { ids: ["windsurf"], client: "windsurf" },
  { ids: ["opencode"], client: "opencode" },
];

const ENV_VARS: Record<string, { varName: string; skillsSubpath: string }> = {
  claude: { varName: "CLAUDE_CONFIG_DIR", skillsSubpath: "skills" },
  cline: { varName: "CLINE_DIR", skillsSubpath: "skills" },
  kiro: { varName: "KIRO_HOME", skillsSubpath: "skills" },
  gemini: { varName: "GEMINI_CLI_HOME", skillsSubpath: "skills" },
};

const CONFIG_FILES: Record<string, string> = {
  claude: "~/.claude.json",
  cursor: "~/.cursor/mcp.json",
  codebuddy: "~/.codebuddy/mcp.json",
  trae: "~/.trae/argv.json",
  "trae-cn": "~/.trae-cn/skill-config.json",
};

export type PathDetectOptions = {
  env?: NodeJS.Dict<string>;
  home?: string;
  userProfile?: string;
  os?: string;
  readFile?: (absPath: string) => string | null;
  llmPort?: LlmPort | null;
  skipLlm?: boolean;
};

const sessionCache = new Map<string, ResolvedClientPaths>();

export function clearPathDetectCache(): void {
  sessionCache.clear();
}

export function detectClient(clientInfo?: { name?: string } | string | null): string | null {
  const name =
    typeof clientInfo === "string" ? clientInfo : (clientInfo?.name ?? "");
  const key = name.trim().toLowerCase();
  if (!key) return null;
  for (const row of CLIENT_ALIASES) {
    if (row.ids.includes(key)) return row.client;
  }
  return null;
}

function joinRoot(root: string, sub: string, win: boolean): string {
  const sep = win ? "\\" : "/";
  const base = root.replace(/[/\\]+$/, "");
  const slash = win ? "\\" : "/";
  return `${base}${sep}${sub}${slash}`;
}

function rootsFromHomeDir(root: string, win: boolean): PathRoots {
  return {
    skills: joinRoot(root, "skills", win),
    rules: joinRoot(root, "rules", win),
    agents: joinRoot(root, "agents", win),
    workflows: joinRoot(root, "workflows", win),
    other: joinRoot(root, "sdd", win),
  };
}

function validateRoots(
  roots: PathRoots,
  home: string,
  userProfile: string,
): PathDetectError | null {
  for (const value of Object.values(roots)) {
    const err = validateExpandedPath(value, home, userProfile);
    if (err) return err;
  }
  return null;
}

function readFileDefault(absPath: string): string | null {
  try {
    return readFileSync(absPath, "utf8");
  } catch {
    return null;
  }
}

function parseSkillsFromConfig(raw: string): string | null {
  try {
    const json = JSON.parse(raw) as Record<string, unknown>;
    const skills =
      (typeof json.skillsRoot === "string" && json.skillsRoot) ||
      (typeof json.skills === "string" && json.skills) ||
      null;
    return skills;
  } catch {
    return null;
  }
}

export async function resolveClientPaths(
  client: string,
  options: PathDetectOptions = {},
): Promise<ResolvedClientPaths | PathDetectError> {
  const env = options.env ?? process.env;
  const home = options.home ?? env.HOME ?? homedir();
  const userProfile = options.userProfile ?? env.USERPROFILE ?? home;
  const os =
    options.os ??
    (process.platform === "win32" || process.platform === "linux"
      ? process.platform
      : "darwin");
  const fingerprint = `${client}:${os}:${env.CLAUDE_CONFIG_DIR ?? ""}:${env.CODEX_HOME ?? ""}:${env.CLINE_DIR ?? ""}:${env.KIRO_HOME ?? ""}`;
  const cached = sessionCache.get(fingerprint);
  if (cached) return cached;

  const win = os === "win32";
  const readFile = options.readFile ?? readFileDefault;

  const envSpec = ENV_VARS[client];
  if (envSpec && env[envSpec.varName]) {
    const base = env[envSpec.varName] as string;
    const primary = rootsFromHomeDir(base, win);
    if (envSpec.skillsSubpath !== "skills") {
      primary.skills = joinRoot(base, envSpec.skillsSubpath, win);
    }
    const err = validateRoots(primary, home, userProfile);
    if (err) return err;
    const result: ResolvedClientPaths = { primary, compat: [], source: "env" };
    sessionCache.set(fingerprint, result);
    return result;
  }

  if (client === "codex" && env.CODEX_HOME) {
    const base = env.CODEX_HOME;
    const primary: PathRoots = {
      skills: joinRoot(join(base, ".agents"), "skills", win),
      rules: joinRoot(base, "rules", win),
      agents: joinRoot(base, "agents", win),
      workflows: joinRoot(base, "workflows", win),
      other: joinRoot(base, "sdd", win),
    };
    const err = validateRoots(primary, home, userProfile);
    if (err) return err;
    const result: ResolvedClientPaths = { primary, compat: [], source: "env" };
    sessionCache.set(fingerprint, result);
    return result;
  }

  if (client === "kiro" && env.KIRO_HOME) {
    const primary = rootsFromHomeDir(env.KIRO_HOME, win);
    const err = validateRoots(primary, home, userProfile);
    if (err) return err;
    const result: ResolvedClientPaths = { primary, compat: [], source: "env" };
    sessionCache.set(fingerprint, result);
    return result;
  }

  const configRel = CONFIG_FILES[client];
  if (configRel) {
    const abs = expandHome(configRel, home, userProfile);
    const body = readFile(abs);
    if (body) {
      const custom = parseSkillsFromConfig(body);
      if (custom) {
        const expanded = expandHome(custom, home, userProfile);
        const primary = rootsFromHomeDir(
          expanded.replace(/[/\\]+skills[/\\]*$/, "").replace(/[/\\]+$/, ""),
          win,
        );
        if (custom.toLowerCase().includes("skills")) {
          primary.skills = expanded.endsWith("/") || expanded.endsWith("\\")
            ? expanded
            : `${expanded}${win ? "\\" : "/"}`;
        }
        const err = validateRoots(primary, home, userProfile);
        if (err) return err;
        const result: ResolvedClientPaths = {
          primary,
          compat: [],
          source: "config",
        };
        sessionCache.set(fingerprint, result);
        return result;
      }
    }
  }

  const seed = resolve(client, os, undefined, { home, userProfile });
  if (!("code" in seed)) {
    const result: ResolvedClientPaths = {
      primary: {
        skills: seed.skills,
        rules: seed.rules,
        agents: seed.agents,
        workflows: seed.workflows,
        other: seed.other,
      },
      compat: seed.compat,
      source: "seed",
    };
    sessionCache.set(fingerprint, result);
    return result;
  }

  if (seed.code === "client_unknown" || seed.code === "os_unsupported") {
    if (options.skipLlm) {
      return seed.code === "client_unknown"
        ? { code: "client_unknown", client }
        : seed;
    }
    const llm = await discoverPathsWithLlm([], {
      port: options.llmPort ?? undefined,
    });
    if (!llm.ok) {
      if (seed.code === "client_unknown") {
        return { code: "client_unknown", client };
      }
      return { code: "client_config_unresolved" };
    }
    const primary: PathRoots = {
      skills: expandHome(llm.proposal.skillsRoot, home, userProfile),
      rules: expandHome(llm.proposal.rulesRoot, home, userProfile),
      agents: expandHome(llm.proposal.agentsRoot, home, userProfile),
      workflows: expandHome(llm.proposal.workflowsRoot, home, userProfile),
      other: expandHome(
        llm.proposal.skillsRoot.replace(/skills\/?$/, "sdd/"),
        home,
        userProfile,
      ),
    };
    const err = validateRoots(primary, home, userProfile);
    if (err) return err;
    const result: ResolvedClientPaths = { primary, compat: [], source: "llm" };
    sessionCache.set(fingerprint, result);
    return result;
  }

  return seed;
}
