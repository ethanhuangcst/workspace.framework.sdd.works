import { describe, expect, it } from "vitest";
import {
  formatChildEntryLabel,
  formatTopLevelDirLabel,
  topLevelDirPaths,
} from "./framework-tree-utils";

describe("framework-tree-utils", () => {
  it("should_collect_top_level_dir_paths", () => {
    expect(
      topLevelDirPaths([
        { name: "skills/", type: "dir", children: [] },
        { name: "rules/", type: "dir", children: [] },
        { name: "readme.md", type: "file" },
      ]),
    ).toEqual(["skills/", "rules/"]);
  });

  it("should_format_top_level_labels_title_case_without_slash", () => {
    expect(formatTopLevelDirLabel("agents/")).toBe("Agents");
    expect(formatTopLevelDirLabel("skills/")).toBe("Skills");
  });

  it("should_format_child_labels_without_trailing_slash", () => {
    expect(formatChildEntryLabel("dod.mdc")).toBe("dod.mdc");
    expect(formatChildEntryLabel("tdd/")).toBe("tdd");
  });
});
