import { describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildTreeFromUnpacked } from "./cache-tree";

describe("buildTreeFromUnpacked", () => {
  it("should_build_nested_tree_from_unpacked_dir", () => {
    const root = mkdtempSync(join(tmpdir(), "sdd-unpacked-"));
    mkdirSync(join(root, "skills/tdd"), { recursive: true });
    mkdirSync(join(root, "rules"), { recursive: true });
    writeFileSync(join(root, "skills/tdd/SKILL.md"), "# tdd\n");
    writeFileSync(join(root, "rules/dod.mdc"), "# dod\n");

    const tree = buildTreeFromUnpacked(root);
    expect(tree).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "skills/",
          type: "dir",
          children: expect.arrayContaining([
            expect.objectContaining({
              name: "tdd/",
              type: "dir",
              children: expect.arrayContaining([
                { name: "SKILL.md", type: "file" },
              ]),
            }),
          ]),
        }),
        expect.objectContaining({
          name: "rules/",
          type: "dir",
        }),
      ]),
    );
  });

  it("should_sort_dirs_before_files_then_by_name", () => {
    const root = mkdtempSync(join(tmpdir(), "sdd-unpacked-"));
    mkdirSync(join(root, "skills/zeta-skill"), { recursive: true });
    mkdirSync(join(root, "skills/alpha-skill"), { recursive: true });
    writeFileSync(join(root, "skills/README.md"), "# skills\n");
    writeFileSync(join(root, "skills/notes.txt"), "notes\n");

    const skills = buildTreeFromUnpacked(root).find((node) => node.name === "skills/");
    expect(skills?.children?.map((node) => node.name)).toEqual([
      "alpha-skill/",
      "zeta-skill/",
      "notes.txt",
      "README.md",
    ]);
  });

  it("should_return_empty_when_path_missing", () => {
    expect(buildTreeFromUnpacked("/nonexistent/path")).toEqual([]);
  });
});
