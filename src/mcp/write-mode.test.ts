import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { clearPathDetectCache } from "@/core/path-detect";
import { applyPlannedFiles, planIsSafe } from "@/core/tools/apply-plan";
import { runWriteMode } from "./write-mode";

const homes: string[] = [];

afterEach(() => {
  clearPathDetectCache();
  for (const home of homes.splice(0)) {
    rmSync(home, { recursive: true, force: true });
  }
});

describe("applyPlannedFiles", () => {
  it("should_copy_only_planned_paths", () => {
    const root = mkdtempSync(join(tmpdir(), "sdd-apply-"));
    homes.push(root);
    const pkg = join(root, "pkg");
    const client = join(root, "client");
    mkdirSync(join(pkg, "skills/tdd"), { recursive: true });
    mkdirSync(join(pkg, "skills/extra"), { recursive: true });
    writeFileSync(join(pkg, "skills/tdd/SKILL.md"), "pack");
    writeFileSync(join(pkg, "skills/extra/SKILL.md"), "extra");
    mkdirSync(client, { recursive: true });
    mkdirSync(join(client, "skills/old"), { recursive: true });
    writeFileSync(join(client, "skills/old/SKILL.md"), "old");

    applyPlannedFiles(pkg, client, {
      action: "apply",
      delete: ["skills/old/SKILL.md"],
      write: ["skills/tdd/SKILL.md"],
    });

    expect(readFileSync(join(client, "skills/tdd/SKILL.md"), "utf8")).toBe("pack");
    expect(existsSync(join(client, "skills/extra/SKILL.md"))).toBe(false);
    expect(existsSync(join(client, "skills/old/SKILL.md"))).toBe(false);
  });
});

describe("planIsSafe", () => {
  it("should_reject_a_delete_that_is_not_in_the_ledger", () => {
    const ok = planIsSafe(
      { action: "apply", delete: ["skills/other/SKILL.md"], write: [] },
      { files: { skills: ["skills/tdd/SKILL.md"] } },
      "/Users/me/.cursor",
    );
    expect(ok).toBe(false);
  });
});

describe("runWriteMode", () => {
  it("should_stop_without_writes_when_the_plan_is_noop", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-write-"));
    homes.push(home);
    process.env.HOME = home;
    process.env.USERPROFILE = home;
    mkdirSync(join(home, ".cursor"), { recursive: true });
    writeFileSync(join(home, ".cursor/notes.txt"), "keep");
    const code = await runWriteMode(["--client", "cursor", "--os", "darwin"], {
      postPlan: async () => ({ plan: { action: "noop", delete: [], write: [] } }),
    });
    expect(code).toBe(0);
    expect(readFileSync(join(home, ".cursor/notes.txt"), "utf8")).toBe("keep");
  });
});
