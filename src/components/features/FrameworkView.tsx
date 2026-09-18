"use client";

import { useCallback, useEffect, useState } from "react";
import { t, type Locale } from "@/i18n/t";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import type { TreeNode } from "@/github/sync";

const POLL_MS = 30_000;

type FrameworkPayload =
  | { empty: true }
  | {
      empty: false;
      source: string;
      tree?: TreeNode[];
      slow?: boolean;
      error?: { key: string };
    };

function TreeItems({ nodes }: { nodes: TreeNode[] }) {
  return (
    <>
      {nodes.map((node) => (
        <li key={`${node.type}:${node.name}`}>
          {node.type === "dir" ? (
            <>
              <span className="tree-dir">{node.name}</span>
              {node.children && node.children.length > 0 ? (
                <ul>
                  <TreeItems nodes={node.children} />
                </ul>
              ) : null}
            </>
          ) : (
            node.name
          )}
        </li>
      ))}
    </>
  );
}

function FrameworkPageHead({
  locale,
  source,
  showRepo,
}: {
  locale: Locale;
  source?: string;
  showRepo: boolean;
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
          <p className="field-note">
            <a href="/admin/settings">{t(locale, "admin.framework.change_repo")}</a>
          </p>
        </div>
      ) : null}
    </div>
  );
}

export function FrameworkView({ locale }: { locale: Locale }) {
  const [data, setData] = useState<FrameworkPayload | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
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
    return (
      <FrameworkPageHead locale={locale} showRepo={false} />
    );
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

  return (
    <>
      <FrameworkPageHead
        locale={locale}
        source={data.source}
        showRepo={Boolean(data.source)}
      />
      {data.error ? (
        <div data-testid="framework-error">
          <Callout variant="error">{t(locale, data.error.key)}</Callout>
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
            <TreeItems nodes={data.tree!} />
          </ul>
        </>
      ) : null}
    </>
  );
}
