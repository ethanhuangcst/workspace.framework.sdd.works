import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import type { TreeNode } from "@/github/sync";

function compareDirEntries(
  a: { name: string; isDirectory(): boolean },
  b: { name: string; isDirectory(): boolean },
): number {
  if (a.isDirectory() !== b.isDirectory()) {
    return a.isDirectory() ? -1 : 1;
  }
  return a.name.localeCompare(b.name);
}

function walkDir(absPath: string, relPrefix: string): TreeNode[] {
  if (!existsSync(absPath)) return [];
  const entries = readdirSync(absPath, { withFileTypes: true }).sort(compareDirEntries);
  const nodes: TreeNode[] = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const childAbs = join(absPath, entry.name);
    if (entry.isDirectory()) {
      const dirName = `${entry.name}/`;
      nodes.push({
        name: dirName,
        type: "dir",
        children: walkDir(childAbs, relPrefix ? `${relPrefix}${dirName}` : dirName),
      });
    } else if (entry.isFile()) {
      nodes.push({ name: entry.name, type: "file" });
    }
  }

  return nodes;
}

/** Build portal tree nodes from SYNK-01 unpacked package directory. */
export function buildTreeFromUnpacked(unpackedPath: string): TreeNode[] {
  if (!existsSync(unpackedPath)) return [];
  const stat = statSync(unpackedPath);
  if (!stat.isDirectory()) return [];
  return walkDir(unpackedPath, "");
}
