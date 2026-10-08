import type { InstructionsTabLabels } from "@/core/seeds/instructions-tabs-config";
import type { Locale } from "@/i18n/t";

const FOLDER_SEGMENT = /^[a-z0-9-]+$/;

function isValidInstructionsContentPath(path: string): boolean {
  if (!path || path.includes("\0")) return false;
  if (path.startsWith("/") || path.includes("\\")) return false;
  if (path.includes("..")) return false;
  const segments = path.split("/");
  if (segments.some((s) => s === "" || s === "." || s === "..")) return false;
  return true;
}

export type KnowledgeOpenMode = "same_tab" | "new_tab";

export type KnowledgeIndexEntryFolder = {
  kind: "folder";
  id: string;
  labels: InstructionsTabLabels;
  path: string;
};

export type KnowledgeIndexEntryFile = {
  kind: "file";
  id: string;
  labels: InstructionsTabLabels;
  paths: Record<string, string>;
  open: KnowledgeOpenMode;
};

export type KnowledgeIndexEntry =
  | KnowledgeIndexEntryFolder
  | KnowledgeIndexEntryFile;

export type KnowledgeIndexDocument = {
  version: 1;
  labels?: InstructionsTabLabels;
  entries: KnowledgeIndexEntry[];
};

export type ResolvedKnowledgeListEntry =
  | {
      kind: "folder";
      id: string;
      label: string;
      path: string;
    }
  | {
      kind: "file";
      id: string;
      label: string;
      open: KnowledgeOpenMode;
    };

export type KnowledgeFolderListing = {
  folderTitle: string | null;
  entries: ResolvedKnowledgeListEntry[];
  sourceLocale: Locale;
};

export type KnowledgeArticleResult = {
  html: string;
  sourceLocale: Locale;
  contentSource: "cache" | "package";
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function parseKnowledgePathParam(pathParam: string | undefined): string[] {
  if (!pathParam?.trim()) return [];
  return pathParam
    .split("/")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function validateKnowledgePathSegments(segments: string[]): string | null {
  for (const segment of segments) {
    if (!FOLDER_SEGMENT.test(segment)) {
      return `invalid path segment: ${segment}`;
    }
  }
  return null;
}

export function validateKnowledgeIndex(
  input: unknown,
): { ok: true; document: KnowledgeIndexDocument } | { ok: false; errors: string[] } {
  const errors: string[] = [];

  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, errors: ["index must be a JSON object"] };
  }

  const record = input as Record<string, unknown>;
  if (record.version !== 1) {
    errors.push("version must be 1");
  }

  const entriesRaw = record.entries;
  if (!Array.isArray(entriesRaw)) {
    errors.push("entries must be an array");
    return { ok: false, errors };
  }

  if (entriesRaw.length === 0) {
    errors.push("entries must not be empty");
  }

  const seenIds = new Set<string>();

  for (let i = 0; i < entriesRaw.length; i += 1) {
    const prefix = `entries[${i}]`;
    const entryRaw = entriesRaw[i];
    if (
      entryRaw === null ||
      typeof entryRaw !== "object" ||
      Array.isArray(entryRaw)
    ) {
      errors.push(`${prefix} must be an object`);
      continue;
    }
    const entry = entryRaw as Record<string, unknown>;
    const kind = entry.kind;
    if (kind !== "folder" && kind !== "file") {
      errors.push(`${prefix}.kind must be folder or file`);
      continue;
    }

    if (!isNonEmptyString(entry.id) || !FOLDER_SEGMENT.test(entry.id)) {
      errors.push(`${prefix}.id must be a slug [a-z0-9-]+`);
    } else if (seenIds.has(entry.id)) {
      errors.push(`duplicate entry id: ${entry.id}`);
    } else {
      seenIds.add(entry.id);
    }

    const labelsRaw = entry.labels;
    if (
      labelsRaw === null ||
      typeof labelsRaw !== "object" ||
      Array.isArray(labelsRaw)
    ) {
      errors.push(`${prefix}.labels must be an object`);
    } else {
      const labels = labelsRaw as Record<string, unknown>;
      if (!isNonEmptyString(labels.en)) {
        errors.push(`${prefix}.labels.en is required`);
      }
    }

    if (kind === "folder") {
      if (!isNonEmptyString(entry.path)) {
        errors.push(`${prefix}.path is required for folder`);
      } else if (!isValidInstructionsContentPath(entry.path)) {
        errors.push(`${prefix}.path is unsafe: ${entry.path}`);
      }
    }

    if (kind === "file") {
      const open = entry.open;
      if (open !== "same_tab" && open !== "new_tab") {
        errors.push(`${prefix}.open must be same_tab or new_tab`);
      }
      const pathsRaw = entry.paths;
      if (
        pathsRaw === null ||
        typeof pathsRaw !== "object" ||
        Array.isArray(pathsRaw)
      ) {
        errors.push(`${prefix}.paths must be an object`);
      } else {
        const paths = pathsRaw as Record<string, unknown>;
        if (!isNonEmptyString(paths.en)) {
          errors.push(`${prefix}.paths.en is required`);
        }
        for (const value of Object.values(paths)) {
          if (typeof value !== "string" || !value.endsWith(".md")) {
            errors.push(`${prefix}.paths values must be .md files`);
            break;
          }
        }
      }
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, document: record as KnowledgeIndexDocument };
}

export function buildKnowledgeArticlePath(
  pathname: string,
  tabQueryParam: string,
  folderSegments: string[],
  docId: string,
): string {
  const params = new URLSearchParams();
  params.set("tab", tabQueryParam);
  if (folderSegments.length > 0) {
    params.set("path", folderSegments.join("/"));
  }
  params.set("doc", docId);
  const q = params.toString();
  return `${pathname}?${q}`;
}
