import { describe, expect, it } from "vitest";
import {
  composeInstallPlan,
  type LedgerFiles,
} from "./install-plan";

const packFiles: LedgerFiles = {
  skills: ["skills/tdd/SKILL.md"],
  rules: ["rules/sdd-dod.mdc"],
  agents: [],
  workflows: [],
  templates: [],
};

const currentLedger = {
  version: 1,
  package_version: "main",
  package_commit: "sha-1",
  pack_complete: true,
  files: {
    skills: ["skills/tdd/SKILL.md"],
    rules: ["rules/sdd-dod.mdc"],
  },
};

describe("composeInstallPlan", () => {
  it("should_noop_when_version_commit_match_and_missing_is_empty", () => {
    const plan = composeInstallPlan({
      ledger: currentLedger,
      missing: [],
      packageVersion: "main",
      packageCommit: "sha-1",
      packFiles,
    });
    expect(plan.action).toBe("noop");
    expect(plan.write).toEqual([]);
    expect(plan.delete).toEqual([]);
  });

  it("should_rewrite_ledger_when_pack_complete_is_absent", () => {
    const ledger = {
      version: currentLedger.version,
      package_version: currentLedger.package_version,
      package_commit: currentLedger.package_commit,
      files: currentLedger.files,
    };
    const plan = composeInstallPlan({
      ledger,
      missing: [],
      packageVersion: "main",
      packageCommit: "sha-1",
      packFiles,
    });
    expect(plan.action).toBe("rewrite_ledger");
    expect(plan.write).toEqual([]);
  });

  it("should_apply_when_a_recorded_path_is_missing", () => {
    const plan = composeInstallPlan({
      ledger: currentLedger,
      missing: ["skills/tdd/SKILL.md"],
      packageVersion: "main",
      packageCommit: "sha-1",
      packFiles,
    });
    expect(plan.action).toBe("apply");
    expect(plan.write).toContain("skills/tdd/SKILL.md");
    expect(plan.delete).toContain("skills/tdd/SKILL.md");
  });

  it("should_apply_when_commit_changes", () => {
    const plan = composeInstallPlan({
      ledger: currentLedger,
      missing: [],
      packageVersion: "main",
      packageCommit: "sha-2",
      packFiles,
    });
    expect(plan.action).toBe("apply");
  });

  it("should_apply_when_ledger_is_absent", () => {
    const plan = composeInstallPlan({
      ledger: null,
      missing: [],
      packageVersion: "main",
      packageCommit: "sha-1",
      packFiles,
    });
    expect(plan.action).toBe("apply");
    expect(plan.delete).toEqual([]);
    expect(plan.write).toContain("skills/tdd/SKILL.md");
  });

  it("should_apply_when_force_is_true", () => {
    const plan = composeInstallPlan({
      ledger: currentLedger,
      missing: [],
      force: true,
      packageVersion: "main",
      packageCommit: "sha-1",
      packFiles,
    });
    expect(plan.action).toBe("apply");
  });
});
