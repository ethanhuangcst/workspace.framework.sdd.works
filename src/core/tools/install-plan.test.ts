import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  checkCandidateRoot,
  composeInstallPlan,
  resolveAcceptedClientRoot,
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
    const { pack_complete: _dropped, ...ledger } = currentLedger;
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

describe("checkCandidateRoot", () => {
  it("should_reject_a_path_outside_the_home_directory", () => {
    const result = checkCandidateRoot("/etc/passwd", "/Users/me", "/Users/me");
    expect(result?.code).toBe("path_rejected");
  });

  it("should_accept_a_path_under_the_home_directory", () => {
    expect(checkCandidateRoot("/Users/me/.cursor", "/Users/me", "/Users/me")).toBeNull();
  });
});

describe("resolveAcceptedClientRoot", () => {
  const home = "/Users/me";

  it("should_keep_the_path_table_root_for_a_known_client", () => {
    const table = join(home, ".codebuddy");
    const other = join(home, "other-agent");
    const result = resolveAcceptedClientRoot(
      table,
      other,
      "seed",
      home,
      home,
    );
    expect(result).toEqual({ acceptedRoot: table });
  });

  it("should_reject_a_candidate_outside_the_home_directory", () => {
    const table = join(home, ".cursor");
    const result = resolveAcceptedClientRoot(
      table,
      "/etc/evil",
      "seed",
      home,
      home,
    );
    expect(result).toMatchObject({ error: { code: "path_rejected" } });
  });
});
