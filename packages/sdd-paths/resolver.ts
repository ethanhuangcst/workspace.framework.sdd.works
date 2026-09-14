import pathsData from "./paths.json";

export type PathOs = "darwin" | "linux" | "win32";

export type ResolvedPaths = {
  skills: string;
  rules: string;
  other: string;
};

export type PathError =
  | { code: "client_unknown"; client: string }
  | { code: "os_unsupported"; client: string; os: string }
  | { code: "path_rejected"; reason: string; raw: string };

export type PathRoots = {
  skills: string;
  rules: string;
  other: string;
};

type ClientEntry = {
  default: PathRoots;
  darwin?: PathRoots;
  linux?: PathRoots;
  win32?: PathRoots;
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

function expandHome(raw: string, home: string, userProfile: string): string {
  let out = raw;
  if (out.startsWith("~")) {
    out = home + out.slice(1);
  }
  out = out.replace(/%USERPROFILE%/gi, userProfile);
  return out;
}

function isUnderHome(expanded: string, home: string, userProfile: string): boolean {
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
  const roots: PathRoots | undefined =
    entry[osKey] ?? entry.default ?? undefined;

  if (!roots) {
    return { code: "os_unsupported", client, os };
  }

  const merged: PathRoots = {
    skills: overrides?.skills ?? roots.skills,
    rules: overrides?.rules ?? roots.rules,
    other: overrides?.other ?? roots.other,
  };

  for (const raw of Object.values(merged)) {
    const err = validatePathTemplate(raw);
    if (err) return err;
  }

  const home = env.home ?? process.env.HOME ?? "";
  const userProfile =
    env.userProfile ?? process.env.USERPROFILE ?? process.env.HOME ?? "";

  const expanded: ResolvedPaths = {
    skills: expandHome(merged.skills, home, userProfile),
    rules: expandHome(merged.rules, home, userProfile),
    other: expandHome(merged.other, home, userProfile),
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
