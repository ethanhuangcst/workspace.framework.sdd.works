import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  isFixturePortCommitSha,
  isFixtureStubUnpacked,
  isRefusedFixturePack,
} from "./fixture-pack";

const dirs: string[] = [];

afterEach(() => {
  for (const dir of dirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

describe("fixture pack detection", () => {
  it("should_treat_semver_fixture_commits_as_fixture", () => {
    expect(isFixturePortCommitSha("sha-v1.0.0")).toBe(true);
    expect(isFixturePortCommitSha("sha-v2.10.3")).toBe(true);
    expect(isFixturePortCommitSha("sha-v1")).toBe(false);
    expect(isFixturePortCommitSha("sha-old")).toBe(false);
    expect(isFixturePortCommitSha("abcd1234abcd1234abcd1234abcd1234abcd1234")).toBe(
      false,
    );
  });

  it("should_detect_fixture_stub_tree", () => {
    const root = mkdtempSync(join(tmpdir(), "sdd-fixture-stub-"));
    dirs.push(root);
    mkdirSync(join(root, "skills/tdd"), { recursive: true });
    mkdirSync(join(root, "skills/atdd"), { recursive: true });
    writeFileSync(join(root, "skills/tdd/SKILL.md"), "# tdd v1.0.0\n", "utf8");
    writeFileSync(join(root, "skills/atdd/SKILL.md"), "# atdd v1.0.0\n", "utf8");
    mkdirSync(join(root, "rules"), { recursive: true });
    writeFileSync(join(root, "rules/sdd-dod.mdc"), "# dod\n", "utf8");
    mkdirSync(join(root, "agents"), { recursive: true });
    writeFileSync(join(root, "agents/code-reviewer.md"), "# reviewer\n", "utf8");
    mkdirSync(join(root, "workflows"), { recursive: true });
    writeFileSync(join(root, "workflows/new-feature.md"), "# workflow\n", "utf8");
    expect(isFixtureStubUnpacked(root)).toBe(true);
    expect(
      isRefusedFixturePack("sha-http-test", root),
    ).toBe(true);
  });
});
