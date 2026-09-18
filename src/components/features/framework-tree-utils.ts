import type { TreeNode } from "@/github/sync";

/** Collect paths for top-level directories (one-level default expand). */
export function topLevelDirPaths(nodes: TreeNode[]): string[] {
  return nodes
    .filter((node) => node.type === "dir")
    .map((node) => node.name);
}

export function formatTopLevelDirLabel(name: string): string {
  const base = name.replace(/[/\\]+$/, "");
  if (!base) return name;
  return base.charAt(0).toUpperCase() + base.slice(1);
}

export function formatChildEntryLabel(name: string): string {
  return name.replace(/[/\\]+$/, "");
}
