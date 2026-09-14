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
      <div className="page-head">
        <p className="eyebrow">{t(locale, "admin.framework.eyebrow")}</p>
        <h1>{t(locale, "admin.framework.title")}</h1>
        <p>{t(locale, "admin.framework.lead")}</p>
      </div>
    );
  }

  if (!data || data.empty) {
    return (
      <>
        <div className="page-head">
          <p className="eyebrow">{t(locale, "admin.framework.eyebrow")}</p>
          <h1>{t(locale, "admin.framework.title")}</h1>
          <p>{t(locale, "admin.framework.lead")}</p>
        </div>
        <div className="empty" data-testid="framework-empty">
          <p>{t(locale, "admin.framework.empty")}</p>
          <Button href="/admin/settings" data-testid="framework-to-settings">
            {t(locale, "admin.framework.to_settings")}
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-head">
        <p className="eyebrow">{t(locale, "admin.framework.eyebrow")}</p>
        <h1>{t(locale, "admin.framework.title")}</h1>
        <p>{t(locale, "admin.framework.lead")}</p>
        {data.source ? (
          <p className="field-note">
            {t(locale, "admin.framework.source")}:{" "}
            <span className="mono" data-testid="framework-source">
              {data.source}
            </span>
          </p>
        ) : null}
      </div>
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
      {data.tree && data.tree.length > 0 && !data.error ? (
        <ul className="tree" data-testid="framework-tree">
          <TreeItems nodes={data.tree} />
        </ul>
      ) : null}
    </>
  );
}
