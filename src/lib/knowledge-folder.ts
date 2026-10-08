import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Locale } from "@/i18n/t";
import {
  isValidInstructionsContentPath,
  resolveInstructionsTabLabel,
} from "@/core/seeds/instructions-tabs-config";
import { renderPortalMarkdown } from "@/lib/features-catalog";
import { resolveCachedVersion } from "@/core/sync/cache";
import {
  type KnowledgeArticleResult,
  type KnowledgeFolderListing,
  type KnowledgeIndexDocument,
  type KnowledgeIndexEntryFile,
  type ResolvedKnowledgeListEntry,
  validateKnowledgeIndex,
  validateKnowledgePathSegments,
} from "@/lib/knowledge-folder-shared";

export type {
  KnowledgeArticleResult,
  KnowledgeFolderListing,
  KnowledgeIndexDocument,
  KnowledgeIndexEntry,
  KnowledgeIndexEntryFile,
  KnowledgeIndexEntryFolder,
  KnowledgeOpenMode,
  ResolvedKnowledgeListEntry,
} from "@/lib/knowledge-folder-shared";

export {
  buildKnowledgeArticlePath,
  parseKnowledgePathParam,
  validateKnowledgeIndex,
  validateKnowledgePathSegments,
} from "@/lib/knowledge-folder-shared";

const PACKAGE_CONTENT_ROOTS = [
  join(process.cwd(), "src"),
  join(process.cwd(), "pack.framework.sdd.works"),
] as const;

const FOLDER_SEGMENT = /^[a-z0-9-]+$/;

function readJsonFile(path: string): unknown | null {
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf8")) as unknown;
  } catch {
    return null;
  }
}

function indexRelativePath(rootPath: string, segments: string[]): string {
  const parts = [rootPath, ...segments, ".index.json"].filter(Boolean);
  return parts.join("/");
}

function readMarkdownAt(
  relPath: string,
  unpackedPath: string | null,
): { markdown: string; contentSource: "cache" | "package" } | null {
  if (unpackedPath) {
    const cacheFile = join(unpackedPath, relPath);
    if (existsSync(cacheFile)) {
      return {
        markdown: readFileSync(cacheFile, "utf8"),
        contentSource: "cache",
      };
    }
  }
  for (const root of PACKAGE_CONTENT_ROOTS) {
    const packageFile = join(root, relPath);
    if (!existsSync(packageFile)) continue;
    return {
      markdown: readFileSync(packageFile, "utf8"),
      contentSource: "package",
    };
  }
  return null;
}

function readIndexCandidates(
  relIndex: string,
  unpackedPath: string | null,
): unknown[] {
  const candidates: unknown[] = [];
  if (unpackedPath) {
    const fromCache = readJsonFile(join(unpackedPath, relIndex));
    if (fromCache !== null) candidates.push(fromCache);
  }
  for (const root of PACKAGE_CONTENT_ROOTS) {
    const fromPackage = readJsonFile(join(root, relIndex));
    if (fromPackage !== null) candidates.push(fromPackage);
  }
  return candidates;
}

function loadIndexDocument(
  rootPath: string,
  segments: string[],
  unpackedPath: string | null,
):
  | { ok: true; document: KnowledgeIndexDocument }
  | { ok: false; error: string } {
  const pathError = validateKnowledgePathSegments(segments);
  if (pathError) {
    return { ok: false, error: pathError };
  }

  if (!isValidInstructionsContentPath(rootPath)) {
    return { ok: false, error: "invalid rootPath" };
  }

  const relIndex = indexRelativePath(rootPath, segments);
  const candidates = readIndexCandidates(relIndex, unpackedPath);

  if (candidates.length === 0) {
    return { ok: false, error: "index not found" };
  }

  const errors: string[] = [];
  for (const raw of candidates) {
    const validated = validateKnowledgeIndex(raw);
    if (validated.ok) {
      return { ok: true, document: validated.document };
    }
    errors.push(validated.errors.join("; "));
  }

  return {
    ok: false,
    error: errors[0] ?? "index invalid",
  };
}

export function resolveKnowledgeFolderListing(
  rootPath: string,
  segments: string[],
  locale: Locale,
): { ok: true; listing: KnowledgeFolderListing } | { ok: false; error: string } {
  const resolved = resolveCachedVersion();
  const unpackedPath = "code" in resolved ? null : resolved.unpackedPath;

  const loaded = loadIndexDocument(rootPath, segments, unpackedPath);
  if (!loaded.ok) {
    return loaded;
  }

  const { document } = loaded;
  const folderTitle = document.labels
    ? resolveInstructionsTabLabel(document.labels, locale)
    : null;

  const entries: ResolvedKnowledgeListEntry[] = document.entries.map(
    (entry) => {
      const label = resolveInstructionsTabLabel(entry.labels, locale);
      if (entry.kind === "folder") {
        return {
          kind: "folder",
          id: entry.id,
          label,
          path: entry.path,
        };
      }
      return {
        kind: "file",
        id: entry.id,
        label,
        open: entry.open,
      };
    },
  );

  return {
    ok: true,
    listing: {
      folderTitle,
      entries,
      sourceLocale: locale,
    },
  };
}

export function resolveKnowledgeArticle(
  rootPath: string,
  segments: string[],
  docId: string,
  locale: Locale,
):
  | { ok: true; article: KnowledgeArticleResult }
  | { ok: false; error: string } {
  if (!FOLDER_SEGMENT.test(docId)) {
    return { ok: false, error: "invalid doc id" };
  }

  const resolved = resolveCachedVersion();
  const unpackedPath = "code" in resolved ? null : resolved.unpackedPath;

  const loaded = loadIndexDocument(rootPath, segments, unpackedPath);
  if (!loaded.ok) {
    return loaded;
  }

  const fileEntry = loaded.document.entries.find(
    (e): e is KnowledgeIndexEntryFile =>
      e.kind === "file" && e.id === docId,
  );
  if (!fileEntry) {
    return { ok: false, error: "unknown doc id in this folder" };
  }

  const folderPrefix = segments.length ? `${segments.join("/")}/` : "";
  const paths = fileEntry.paths;
  const preferred = paths[locale];
  const tryPaths = [preferred, paths.en].filter(
    (p): p is string => typeof p === "string" && p.length > 0,
  );

  for (let i = 0; i < tryPaths.length; i += 1) {
    const relMd = tryPaths[i]!;
    const fullRel = [rootPath, folderPrefix, relMd]
      .join("/")
      .replace(/\/+/g, "/");
    const read = readMarkdownAt(fullRel, unpackedPath);
    if (read) {
      const usedLocale: Locale = i === 0 && preferred ? locale : "en";
      return {
        ok: true,
        article: {
          html: renderPortalMarkdown(read.markdown),
          sourceLocale: usedLocale,
          contentSource: read.contentSource,
        },
      };
    }
  }

  return { ok: false, error: "markdown not found" };
}
