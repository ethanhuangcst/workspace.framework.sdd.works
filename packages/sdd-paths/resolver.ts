import pathsData from "./paths.json";

export type PathOs = "darwin" | "linux" | "win32";

export type PathRoots = {
  skills: string;
  rules: string;
  agents: string;
  workflows: string;
  other: string;
};

export type ResolvedPaths = PathRoots & {
  compat: PathRoots[];
};

export type PathError =
  | { code: "client_unknown"; client: string }
  | { code: "os_unsupported"; client: string; os: string }
  | { code: "path_rejected"; reason: string; raw: string };

type ClientEntry = {
  default: PathRoots;
  darwin?: PathRoots;
  linux?: PathRoots;
  win32?: PathRoots;
  compat?: PathRoots[];
};

export type PathMap = {
  version: number;
  updated_at: string;
  clients: Record<string, ClientEntry>;
};

export const pathMap = pathsData as PathMap;

export function getPathsVersion(): number {
  return pathMap.version;
}

export function expandHome(raw: string, home: string, userProfile: string): string {
  let out = raw;
  if (out.startsWith("~")) {
    out = home + out.slice(1);
  }
  out = out.replace(/%USERPROFILE%/gi, userProfile);
  return out;
}

export function isUnderHome(
  expanded: string,
  home: string,
  userProfile: string,
): boolean {
  const normalized = expanded.replace(/\\/g, "/");
  const homeNorm = home.replace(/\\/g, "/").replace(/\/+$/, "");
  const profileNorm = userProfile.replace(/\\/g, "/").replace(/\/+$/, "");
  return (
    normalized === homeNorm ||
    normalized.startsWith(homeNorm + "/") ||
    normalized === profileNorm ||
    normalized.startsWith(profileNorm + "/")
  );
}

export function validatePathTemplate(raw: string): PathError | null {
  if (raw.includes("..")) {
    return { code: "path_rejected", reason: "path_escape", raw };
  }
  if (!raw.startsWith("~") && !raw.toUpperCase().includes("%USERPROFILE%")) {
    return { code: "path_rejected", reason: "not_under_home_template", raw };
  }
  return null;
}

function expandRoots(
  roots: PathRoots,
  home: string,
  userProfile: string,
): PathRoots | PathError {
  const expanded: PathRoots = {
    skills: expandHome(roots.skills, home, userProfile),
    rules: expandHome(roots.rules, home, userProfile),
    agents: expandHome(roots.agents, home, userProfile),
    workflows: expandHome(roots.workflows, home, userProfile),
    other: expandHome(roots.other, home, userProfile),
  };
  for (const [kind, value] of Object.entries(expanded)) {
    if (value.includes("..") || !isUnderHome(value, home, userProfile)) {
      return {
        code: "path_rejected",
        reason: `escape_after_expand:${kind}`,
        raw: value,
      };
    }
  }
  return expanded;
}

/** Seed-map path templates without expanding home (for HTTP MCP portable responses). */
export function resolveTemplates(
  client: string,
  os: string,
  overrides?: Partial<PathRoots>,
): PathRoots | PathError {
  const entry = pathMap.clients[client];
  if (!entry) {
    return { code: "client_unknown", client };
  }

  const osKey = os as PathOs;
  const roots: PathRoots | undefined = entry[osKey] ?? entry.default ?? undefined;

  if (!roots) {
    return { code: "os_unsupported", client, os };
  }

  const merged: PathRoots = {
    skills: overrides?.skills ?? roots.skills,
    rules: overrides?.rules ?? roots.rules,
    agents: overrides?.agents ?? roots.agents,
    workflows: overrides?.workflows ?? roots.workflows,
    other: overrides?.other ?? roots.other,
  };

  for (const raw of Object.values(merged)) {
    const err = validatePathTemplate(raw);
    if (err) return err;
  }

  return merged;
}

export function resolve(
  client: string,
  os: string,
  overrides?: Partial<PathRoots>,
  env: { home?: string; userProfile?: string } = {},
): ResolvedPaths | PathError {
  const entry = pathMap.clients[client];
  if (!entry) {
    return { code: "client_unknown", client };
  }

  const osKey = os as PathOs;
  const roots: PathRoots | undefined = entry[osKey] ?? entry.default ?? undefined;

  if (!roots) {
    return { code: "os_unsupported", client, os };
  }

  const merged: PathRoots = {
    skills: overrides?.skills ?? roots.skills,
    rules: overrides?.rules ?? roots.rules,
    agents: overrides?.agents ?? roots.agents,
    workflows: overrides?.workflows ?? roots.workflows,
    other: overrides?.other ?? roots.other,
  };

  for (const raw of Object.values(merged)) {
    const err = validatePathTemplate(raw);
    if (err) return err;
  }

  const home = env.home ?? process.env.HOME ?? "";
  const userProfile =
    env.userProfile ?? process.env.USERPROFILE ?? process.env.HOME ?? "";

  const expanded = expandRoots(merged, home, userProfile);
  if ("code" in expanded) return expanded;

  const compat: PathRoots[] = [];
  for (const row of entry.compat ?? []) {
    for (const raw of Object.values(row)) {
      const err = validatePathTemplate(raw);
      if (err) return err;
    }
    const expandedCompat = expandRoots(row, home, userProfile);
    if ("code" in expandedCompat) return expandedCompat;
    compat.push(expandedCompat);
  }

  return { ...expanded, compat };
}
