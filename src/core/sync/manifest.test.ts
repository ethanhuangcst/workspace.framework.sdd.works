import { describe, expect, it } from "vitest";
import type { TreeNode } from "@/github/sync";
import { inventoryFromTree } from "./manifest";

describe("inventoryFromTree", () => {
  it("should_map_skill_Rules_and_templates_aliases", () => {
    const tree: TreeNode[] = [
      {
        name: "skill",
        type: "dir",
        children: [{ name: "tdd", type: "dir", children: [] }],
      },
      {
        name: "Rules",
        type: "dir",
        children: [{ name: "sdd-dod.mdc", type: "file" }],
      },
      {
        name: "templates",
        type: "dir",
        children: [{ name: "framework.sdd.works", type: "dir", children: [] }],
      },
      {
        name: "agents",
        type: "dir",
        children: [{ name: "ethan.md", type: "file" }],
      },
      { name: "src", type: "dir", children: [] },
      { name: ".gitignore", type: "file" },
    ];

    const inv = inventoryFromTree(tree);
    expect(inv.skills).toEqual(["tdd"]);
    expect(inv.rules).toEqual(["sdd-dod.mdc"]);
    expect(inv.templates).toEqual(["framework.sdd.works"]);
    expect(inv.agents).toEqual(["ethan.md"]);
    expect(inv.other).toContain("src");
    expect(inv.other).toContain(".gitignore");
    expect(inv.other).not.toContain("skill");
    expect(inv.other).not.toContain("Rules");
    expect(inv.other).not.toContain("templates");
  });

  it("should_put_root_lite_pack_allowlist_in_other", () => {
    const tree: TreeNode[] = [
      { name: "lite-pack.allowlist.json", type: "file" },
      {
        name: "skills/",
        type: "dir",
        children: [{ name: "tdd", type: "dir", children: [] }],
      },
    ];
    const inv = inventoryFromTree(tree);
    expect(inv.other).toContain("lite-pack.allowlist.json");
    expect(inv.skills).toEqual(["tdd"]);
  });
});
