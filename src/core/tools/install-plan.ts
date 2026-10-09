import { validateExpandedPath } from "@/core/path-policy";

export type LedgerFiles = {
  skills: string[];
  rules: string[];
  agents: string[];
  workflows: string[];
  templates: string[];
};

export type InstallLedger = {
  version?: number;
  package_version?: string;
  package_commit?: string;
  pack_complete?: boolean;
  files?: Partial<LedgerFiles>;
};

export type PlanAction = "noop" | "rewrite_ledger" | "apply";

export type InstallPlan = {
  action: PlanAction;
  delete: string[];
  write: string[];
};

export type ComposeInstallPlanInput = {
  ledger: InstallLedger | null;
  missing: string[];
  force?: boolean;
  packageVersion: string;
  packageCommit: string;
  packFiles: LedgerFiles;
};

const EMPTY_FILES: LedgerFiles = {
  skills: [],
  rules: [],
  agents: [],
  workflows: [],
  templates: [],
};

export function ledgerFiles(ledger: InstallLedger | null): LedgerFiles {
  return {
    skills: ledger?.files?.skills ?? [],
    rules: ledger?.files?.rules ?? [],
    agents: ledger?.files?.agents ?? [],
    workflows: ledger?.files?.workflows ?? [],
    templates: ledger?.files?.templates ?? [],
  };
}

export function recordedPaths(files: LedgerFiles): string[] {
  return [
    ...files.skills,
    ...files.rules,
    ...files.agents,
    ...files.workflows,
    ...files.templates,
  ];
}

export function composeInstallPlan(input: ComposeInstallPlanInput): InstallPlan {
  const previous = ledgerFiles(input.ledger);
  const recorded = recordedPaths(previous);
  const write = recordedPaths(input.packFiles);
  const missing = new Set(input.missing);
  const apply: InstallPlan = {
    action: "apply",
    delete: recorded,
    write,
  };

  if (!input.ledger || input.force) {
    return apply;
  }

  const sameCommit =
    Boolean(input.ledger.package_commit) &&
    input.ledger.package_commit === input.packageCommit;
  const sameVersion = input.ledger.package_version === input.packageVersion;
  const recordedPresent = recorded.every((path) => !missing.has(path));

  if (!sameCommit || !sameVersion || !recordedPresent) {
    return apply;
  }

  if (input.ledger.pack_complete === undefined) {
    return { action: "rewrite_ledger", delete: [], write: [] };
  }

  return { action: "noop", delete: [], write: [] };
}

export function checkCandidateRoot(
  candidate: string,
  home: string,
  userProfile: string,
): { code: "path_rejected"; reason: string; raw: string } | null {
  const error = validateExpandedPath(candidate, home, userProfile);
  if (!error || error.code !== "path_rejected") return null;
  return error;
}

/** Known clients use the path table. Other clients may use an accepted candidate. */
export function resolveAcceptedClientRoot(
  tableRoot: string,
  candidate: string | undefined,
  resolutionSource: string,
  home: string,
  userProfile: string,
):
  | { acceptedRoot: string }
  | { error: NonNullable<ReturnType<typeof checkCandidateRoot>> } {
  const tableCheck = checkCandidateRoot(tableRoot, home, userProfile);
  if (tableCheck) return { error: tableCheck };

  const trimmed = candidate?.trim();
  if (!trimmed || trimmed === tableRoot) {
    return { acceptedRoot: tableRoot };
  }

  const candidateCheck = checkCandidateRoot(trimmed, home, userProfile);
  if (candidateCheck) return { error: candidateCheck };

  const known =
    resolutionSource === "seed" ||
    resolutionSource === "env" ||
    resolutionSource === "config";

  return { acceptedRoot: known ? tableRoot : trimmed };
}

export { EMPTY_FILES };
