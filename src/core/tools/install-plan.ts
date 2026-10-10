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

export { EMPTY_FILES };
