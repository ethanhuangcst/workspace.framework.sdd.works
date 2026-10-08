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

function parentSegments(segments: string[]): string[] {
  if (segments.length === 0) return [];
  return segments.slice(0, -1);
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

  const showBack = folderSegments.length > 0 || Boolean(doc);
  const atRootList = folderSegments.length === 0 && !doc;

  function onBack() {
    if (doc) {
      navigate(buildFolderUrl(pathname, queryParam, folderSegments));
      return;
    }
    navigate(
      buildFolderUrl(pathname, queryParam, parentSegments(folderSegments)),
    );
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
      <div className="knowledge-browser" data-testid="knowledge-browser">
        <p className="knowledge-error" role="alert">
          {t(locale, "admin.guide.knowledge_error")}
        </p>
      </div>
    );
  }

  if (doc && articleHtml) {
    return (
      <div className="knowledge-browser" data-testid="knowledge-browser">
        <div className="knowledge-article-toolbar">
          <button
            type="button"
            className="knowledge-back"
            onClick={onBack}
            data-testid="knowledge-back"
          >
            {t(locale, "admin.guide.knowledge_back")}
          </button>
        </div>
        <article
          className="guide-section guide-md-body guide-md-body--prose"
          data-testid="knowledge-article-body"
          dangerouslySetInnerHTML={{ __html: articleHtml }}
        />
      </div>
    );
  }

  if (doc && !articleHtml) {
    return (
      <div className="knowledge-browser" data-testid="knowledge-browser">
        <p className="knowledge-error" role="alert">
          {t(locale, "admin.guide.knowledge_error")}
        </p>
      </div>
    );
  }

  return (
    <div className="knowledge-browser" data-testid="knowledge-browser">
      {showBack ? (
        <div className="knowledge-article-toolbar">
          <button
            type="button"
            className="knowledge-back"
            onClick={onBack}
            data-testid="knowledge-back"
          >
            {t(locale, "admin.guide.knowledge_back")}
          </button>
        </div>
      ) : null}

      {!atRootList && listing?.folderTitle ? (
        <h2 className="knowledge-list-title">{listing.folderTitle}</h2>
      ) : null}

      {listing ? (
        <ul className="knowledge-list" data-testid="knowledge-list">
          {listing.entries.map((entry) => (
            <li key={entry.id} className="knowledge-list-item">
              {entry.kind === "folder" ? (
                <button
                  type="button"
                  className="knowledge-link"
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
                  className="knowledge-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`knowledge-file-${entry.id}`}
                >
                  {entry.label}
                  <span className="knowledge-link-note">
                    {t(locale, "admin.guide.knowledge_new_tab_hint")}
                  </span>
                </Link>
              ) : (
                <button
                  type="button"
                  className="knowledge-link"
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
        <p className="knowledge-loading">{t(locale, "admin.guide.knowledge_loading")}</p>
      )}
    </div>
  );
}
