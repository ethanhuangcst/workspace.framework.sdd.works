import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  LITE_PACK_ALLOWLIST_FILENAME,
  validateLiteInstallManifest,
} from "./lite-install-manifest";

export type LoadLitePackFilesErrorCode =
  | "lite_manifest_missing"
  | "lite_manifest_invalid";

export type LoadLitePackFilesResult =
  | { ok: true; files: string[] }
  | { ok: false; code: LoadLitePackFilesErrorCode; message: string };

export function isValidRelativePackPath(path: string): boolean {
  if (!path || path.includes("\0")) return false;
  if (path.startsWith("/") || path.includes("\\")) return false;
  if (path.includes("..")) return false;
  const segments = path.split("/");
  if (segments.some((s) => s === "" || s === "." || s === "..")) return false;
  return true;
}

function sortedCombinedFiles(skills: string[], rules: string[]): string[] {
  return [...skills, ...rules].sort((a, b) => a.localeCompare(b));
}

export function loadLitePackFilesFromUnpacked(
  unpackedRoot: string,
): LoadLitePackFilesResult {
  const manifestPath = join(unpackedRoot, LITE_PACK_ALLOWLIST_FILENAME);
  if (!existsSync(manifestPath)) {
    return {
      ok: false,
      code: "lite_manifest_missing",
      message: `${LITE_PACK_ALLOWLIST_FILENAME} is not in the sync cache unpack.`,
    };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(manifestPath, "utf8")) as unknown;
  } catch {
    return {
      ok: false,
      code: "lite_manifest_invalid",
      message: `${LITE_PACK_ALLOWLIST_FILENAME} is not valid JSON.`,
    };
  }

  const validation = validateLiteInstallManifest(parsed, {
    seedRoot: unpackedRoot,
    checkFilesExist: true,
    requireExactLists: false,
  });

  if (!validation.ok) {
    return {
      ok: false,
      code: "lite_manifest_invalid",
      message: validation.errors[0] ?? "lite allow-list failed validation.",
    };
  }

  const record = parsed as { skills: string[]; rules: string[] };
  return { ok: true, files: sortedCombinedFiles(record.skills, record.rules) };
}

export function resolveUnpackedFilePath(
  unpackedRoot: string,
  relativePath: string,
  allowedFiles: readonly string[],
): string | null {
  if (!isValidRelativePackPath(relativePath)) return null;
  if (!allowedFiles.includes(relativePath)) return null;
  const abs = join(unpackedRoot, relativePath);
  if (!existsSync(abs)) return null;
  return abs;
}

export function contentTypeForPackPath(relativePath: string): string {
  if (relativePath.endsWith(".mdc") || relativePath.endsWith(".md")) {
    return "text/markdown; charset=utf-8";
  }
  return "application/octet-stream";
}
