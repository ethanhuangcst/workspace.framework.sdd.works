"use client";

import { useCallback, useEffect, useState } from "react";
import { t, type Locale } from "@/i18n/t";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import type { TreeNode } from "@/github/sync";
import {
  formatChildEntryLabel,
  formatTopLevelDirLabel,
  topLevelDirPaths,
} from "./framework-tree-utils";

const POLL_MS = 30_000;

type FrameworkPayload =
  | { empty: true }
  | {
      empty: false;
      source: string;
      tree?: TreeNode[];
      cache_missing?: boolean;
      slow?: boolean;
      error?: { key: string };
    };

function TreeItems({
  nodes,
  locale,
  expanded,
  onToggle,
  pathPrefix = "",
  depth = 0,
}: {
  nodes: TreeNode[];
  locale: Locale;
  expanded: Set<string>;
  onToggle: (path: string) => void;
  pathPrefix?: string;
  depth?: number;
}) {
  return (
    <>
      {nodes.map((node) => {
        const nodePath = `${pathPrefix}${node.name}`;
        if (node.type === "dir") {
          const isExpanded = expanded.has(nodePath);
          const toggleLabel = isExpanded
            ? t(locale, "admin.framework.tree_collapse", {
                name: formatTopLevelDirLabel(node.name),
              })
            : t(locale, "admin.framework.tree_expand", {
                name: formatTopLevelDirLabel(node.name),
              });
          const hasChildren = Boolean(node.children && node.children.length > 0);

          if (depth === 0) {
            return (
              <li key={nodePath} className="tree-branch">
                {hasChildren ? (
                  <button
                    type="button"
                    className="tree-toggle"
                    aria-expanded={isExpanded}
                    aria-label={toggleLabel}
                    data-testid={`framework-tree-toggle-${nodePath.replace(/\//g, "-")}`}
                    onClick={() => onToggle(nodePath)}
                  >
                    {isExpanded ? "−" : "+"}
                  </button>
                ) : null}
                <span className="tree-dir">{formatTopLevelDirLabel(node.name)}</span>
                {isExpanded && hasChildren ? (
                  <ul className="tree-children">
                    <TreeItems
                      nodes={node.children!}
                      locale={locale}
                      expanded={expanded}
                      onToggle={onToggle}
                      pathPrefix={nodePath}
                      depth={depth + 1}
                    />
                  </ul>
                ) : null}
              </li>
            );
          }

          if (depth === 1) {
            return (
              <li key={nodePath} className="tree-child tree-child-dir">
                {hasChildren ? (
                  <button
                    type="button"
                    className="tree-toggle tree-toggle-nested"
                    aria-expanded={isExpanded}
                    aria-label={toggleLabel}
                    data-testid={`framework-tree-toggle-${nodePath.replace(/\//g, "-")}`}
                    onClick={() => onToggle(nodePath)}
                  >
                    {isExpanded ? "−" : "+"}
                  </button>
                ) : null}
                <span>{formatChildEntryLabel(node.name)}</span>
                {isExpanded && hasChildren ? (
                  <ul className="tree-nested">
                    <TreeItems
                      nodes={node.children!}
                      locale={locale}
                      expanded={expanded}
                      onToggle={onToggle}
                      pathPrefix={nodePath}
                      depth={depth + 1}
                    />
                  </ul>
                ) : null}
              </li>
            );
          }

          return (
            <li key={nodePath}>
              <button
                type="button"
                className="tree-toggle tree-toggle-nested"
                aria-expanded={isExpanded}
                aria-label={toggleLabel}
                data-testid={`framework-tree-toggle-${nodePath.replace(/\//g, "-")}`}
                onClick={() => onToggle(nodePath)}
              >
                {isExpanded ? "−" : "+"}
              </button>
              <span className="tree-dir">{node.name}</span>
              {isExpanded && hasChildren ? (
                <ul>
                  <TreeItems
                    nodes={node.children!}
                    locale={locale}
                    expanded={expanded}
                    onToggle={onToggle}
                    pathPrefix={nodePath}
                    depth={depth + 1}
                  />
                </ul>
              ) : null}
            </li>
          );
        }

        if (depth <= 1) {
          return (
            <li key={nodePath} className="tree-child">
              <span>{node.name}</span>
            </li>
          );
        }

        return <li key={nodePath}>{node.name}</li>;
      })}
    </>
  );
}

function FrameworkPageHead({
  locale,
  source,
  showRepo,
  onSync,
  syncing,
}: {
  locale: Locale;
  source?: string;
  showRepo: boolean;
  onSync?: () => void;
  syncing?: boolean;
}) {
  return (
    <div className="page-head">
      <p className="eyebrow">{t(locale, "admin.framework.eyebrow")}</p>
      <h1>{t(locale, "admin.framework.title")}</h1>
      {showRepo && source ? (
        <div className="framework-repo-block">
          <p className="lead mono" data-testid="framework-source">
            {source}
          </p>
          <div className="framework-repo-actions">
            <Button
              variant="page"
              href="/admin/settings"
              data-testid="framework-change-repo"
            >
              {t(locale, "admin.framework.change_repo")}
            </Button>
            {onSync ? (
              <Button
                variant="page"
                data-testid="framework-sync-repo"
                disabled={syncing}
                onClick={onSync}
              >
                {syncing
                  ? t(locale, "admin.framework.syncing")
                  : t(locale, "admin.framework.sync_repo")}
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function FrameworkView({ locale }: { locale: Locale }) {
  const [data, setData] = useState<FrameworkPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());

  const load = useCallback(async (options?: { resetTreeExpansion?: boolean }) => {
    try {
      const res = await fetch("/api/admin/framework");
      if (!res.ok) {
        setData({
          empty: false,
          source: "",
          error: { key: "admin.framework.sync_error" },
        });
        return;
      }
      const json = (await res.json()) as FrameworkPayload;
      setData(json);
      if (!json.empty && json.tree && json.tree.length > 0) {
        setExpanded((prev) => {
          if (options?.resetTreeExpansion || prev.size === 0) {
            return new Set(topLevelDirPaths(json.tree!));
          }
          return prev;
        });
      }
    } catch {
      setData({
        empty: false,
        source: "",
        error: { key: "admin.framework.sync_error" },
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const syncRepo = useCallback(async () => {
    setSyncing(true);
    try {
      const res = await fetch("/api/admin/sync", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ force: true }),
      });
      if (!res.ok) {
        setData((prev) =>
          prev && !prev.empty
            ? { ...prev, error: { key: "admin.framework.sync_error" } }
            : prev,
        );
        return;
      }
      await load({ resetTreeExpansion: true });
    } catch {
      setData((prev) =>
        prev && !prev.empty
          ? { ...prev, error: { key: "admin.framework.sync_error" } }
          : prev,
      );
    } finally {
      setSyncing(false);
    }
  }, [load]);

  const toggleDir = useCallback((path: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }, []);

  useEffect(() => {
    const boot = window.setTimeout(() => {
      void load();
    }, 0);
    const id = window.setInterval(() => {
      void load();
    }, POLL_MS);
    return () => {
      window.clearTimeout(boot);
      window.clearInterval(id);
    };
  }, [load]);

  if (loading && !data) {
    return <FrameworkPageHead locale={locale} showRepo={false} />;
  }

  if (!data || data.empty) {
    return (
      <>
        <FrameworkPageHead locale={locale} showRepo={false} />
        <div className="empty" data-testid="framework-empty">
          <p>{t(locale, "admin.framework.empty")}</p>
          <Button href="/admin/settings" data-testid="framework-to-settings">
            {t(locale, "admin.framework.to_settings")}
          </Button>
        </div>
      </>
    );
  }

  const showTree = Boolean(data.tree && data.tree.length > 0 && !data.error);
  const cacheMissing = Boolean(data.cache_missing && !data.error);

  return (
    <>
      <FrameworkPageHead
        locale={locale}
        source={data.source}
        showRepo={Boolean(data.source)}
        onSync={syncRepo}
        syncing={syncing}
      />
      {data.error ? (
        <div data-testid="framework-error">
          <Callout variant="error">{t(locale, data.error.key)}</Callout>
        </div>
      ) : null}
      {cacheMissing ? (
        <div className="empty" data-testid="framework-cache-missing">
          <p>{t(locale, "admin.framework.cache_missing")}</p>
          <Button
            variant="page"
            data-testid="framework-sync-repo"
            disabled={syncing}
            onClick={() => void syncRepo()}
          >
            {syncing
              ? t(locale, "admin.framework.syncing")
              : t(locale, "admin.framework.sync_repo")}
          </Button>
        </div>
      ) : null}
      {data.slow ? (
        <p className="field-note" data-testid="framework-slow">
          {t(locale, "admin.framework.slow_sync")}
        </p>
      ) : null}
      {showTree ? (
        <>
          <h2
            className="section-subtitle tree-subtitle"
            data-testid="framework-artifacts"
          >
            {t(locale, "admin.framework.artifacts")}
          </h2>
          <ul className="tree" data-testid="framework-tree">
            <TreeItems
              nodes={data.tree!}
              locale={locale}
              expanded={expanded}
              onToggle={toggleDir}
            />
          </ul>
        </>
      ) : null}
    </>
  );
}
