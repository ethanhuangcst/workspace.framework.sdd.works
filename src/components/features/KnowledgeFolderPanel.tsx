"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { t, type Locale } from "@/i18n/t";
import {
  buildKnowledgeArticlePath,
  type KnowledgeFolderListing,
  type ResolvedKnowledgeListEntry,
} from "@/lib/knowledge-folder-shared";

export type KnowledgeFolderPanelProps = {
  locale: Locale;
  queryParam: string;
  rootPath: string;
  folderSegments: string[];
  doc: string | null;
  listing: KnowledgeFolderListing | null;
  articleHtml: string | null;
  error: string | null;
};

function buildFolderUrl(
  pathname: string,
  queryParam: string,
  segments: string[],
): string {
  const params = new URLSearchParams();
  params.set("tab", queryParam);
  if (segments.length > 0) {
    params.set("path", segments.join("/"));
  }
  const q = params.toString();
  return `${pathname}?${q}`;
}

type PathSegment =
  | { kind: "link"; label: string; href: string; depth: number }
  | { kind: "current"; label: string };

function buildPathSegments(
  pathname: string,
  queryParam: string,
  folderSegments: string[],
  doc: string | null,
): PathSegment[] {
  const segments: PathSegment[] = [];
  const trail = [queryParam, ...folderSegments, ...(doc ? [doc] : [])];

  if (trail.length === 1) {
    return [{ kind: "current", label: queryParam }];
  }

  segments.push({
    kind: "link",
    label: queryParam,
    href: buildFolderUrl(pathname, queryParam, []),
    depth: 0,
  });

  for (let i = 0; i < folderSegments.length; i += 1) {
    const label = folderSegments[i]!;
    const isLast = i === folderSegments.length - 1 && !doc;
    if (isLast) {
      segments.push({ kind: "current", label });
    } else {
      segments.push({
        kind: "link",
        label,
        href: buildFolderUrl(pathname, queryParam, folderSegments.slice(0, i + 1)),
        depth: i + 1,
      });
    }
  }

  if (doc) {
    segments.push({ kind: "current", label: doc });
  }

  return segments;
}

function GuideFolderPath({
  locale,
  queryParam,
  folderSegments,
  doc,
  pathname,
}: {
  locale: Locale;
  queryParam: string;
  folderSegments: string[];
  doc: string | null;
  pathname: string;
}) {
  const parts = buildPathSegments(pathname, queryParam, folderSegments, doc);

  return (
    <nav
      className="guide-folder-path"
      aria-label={t(locale, "admin.guide.knowledge_path_label")}
      data-testid="knowledge-path"
    >
      {parts.map((part, index) => (
        <span key={`${part.label}-${index}`} className="guide-folder-path-part">
          {index > 0 ? (
            <span className="guide-folder-path-sep" aria-hidden="true">
              /
            </span>
          ) : null}
          {part.kind === "link" ? (
            <Link href={part.href} className="guide-inline-link">
              {part.label}
            </Link>
          ) : (
            <span className="guide-folder-path-current">{part.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function KnowledgeFolderPanel({
  locale,
  queryParam,
  rootPath: _rootPath,
  folderSegments,
  doc,
  listing,
  articleHtml,
  error,
}: KnowledgeFolderPanelProps) {
  const pathname = usePathname() || "/";
  const router = useRouter();

  function navigate(href: string) {
    router.push(href);
    router.refresh();
  }

  function onFolder(entry: Extract<ResolvedKnowledgeListEntry, { kind: "folder" }>) {
    const sub = entry.path.split("/").filter(Boolean);
    navigate(
      buildFolderUrl(pathname, queryParam, folderSegments.concat(sub)),
    );
  }

  function onSameTabFile(
    entry: Extract<ResolvedKnowledgeListEntry, { kind: "file" }>,
  ) {
    navigate(
      buildKnowledgeArticlePath(
        pathname,
        queryParam,
        folderSegments,
        entry.id,
      ),
    );
  }

  if (error) {
    return (
      <section
        className="guide-section guide-folder-browser"
        data-testid="knowledge-browser"
      >
        <p className="guide-folder-status guide-folder-status--error" role="alert">
          {t(locale, "admin.guide.knowledge_error")}
        </p>
      </section>
    );
  }

  if (doc && articleHtml) {
    return (
      <section
        className="guide-section guide-folder-browser"
        data-testid="knowledge-browser"
      >
        <GuideFolderPath
          locale={locale}
          queryParam={queryParam}
          folderSegments={folderSegments}
          doc={doc}
          pathname={pathname}
        />
        <article
          className="guide-section guide-md-body guide-md-body--prose"
          data-testid="knowledge-article-body"
          dangerouslySetInnerHTML={{ __html: articleHtml }}
        />
      </section>
    );
  }

  if (doc && !articleHtml) {
    return (
      <section
        className="guide-section guide-folder-browser"
        data-testid="knowledge-browser"
      >
        <p className="guide-folder-status guide-folder-status--error" role="alert">
          {t(locale, "admin.guide.knowledge_error")}
        </p>
      </section>
    );
  }

  return (
    <section
      className="guide-section guide-folder-browser"
      data-testid="knowledge-browser"
    >
      <GuideFolderPath
        locale={locale}
        queryParam={queryParam}
        folderSegments={folderSegments}
        doc={doc}
        pathname={pathname}
      />

      {listing ? (
        <ul className="guide-folder-list" data-testid="knowledge-list">
          {listing.entries.map((entry) => (
            <li key={entry.id} className="guide-folder-list-item">
              {entry.kind === "folder" ? (
                <button
                  type="button"
                  className="guide-inline-link"
                  onClick={() => onFolder(entry)}
                  data-testid={`knowledge-folder-${entry.id}`}
                >
                  {entry.label}
                </button>
              ) : entry.open === "new_tab" ? (
                <Link
                  href={buildKnowledgeArticlePath(
                    pathname,
                    queryParam,
                    folderSegments,
                    entry.id,
                  )}
                  className="guide-inline-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`knowledge-file-${entry.id}`}
                >
                  {entry.label}
                  <span className="guide-folder-hint">
                    {t(locale, "admin.guide.knowledge_new_tab_hint")}
                  </span>
                </Link>
              ) : (
                <button
                  type="button"
                  className="guide-inline-link"
                  onClick={() => onSameTabFile(entry)}
                  data-testid={`knowledge-file-${entry.id}`}
                >
                  {entry.label}
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="guide-folder-status guide-folder-status--loading">
          {t(locale, "admin.guide.knowledge_loading")}
        </p>
      )}
    </section>
  );
}
