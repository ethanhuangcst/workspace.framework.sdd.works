"use client";

import { t, type Locale } from "@/i18n/t";
import { AuthShell } from "@/components/layout/AuthShell";

const TOOLS = [
  {
    name: "sdd_list_versions",
    channelKey: "admin.guide.cap_channel_both",
    bodyKey: "admin.guide.tool_list_versions",
  },
  {
    name: "sdd_get_key",
    channelKey: "admin.guide.cap_channel_both",
    bodyKey: "admin.guide.tool_get_key",
  },
  {
    name: "sdd_install_framework",
    channelKey: "admin.guide.cap_channel_stdio",
    bodyKey: "admin.guide.tool_install",
  },
  {
    name: "sdd_update_framework",
    channelKey: "admin.guide.cap_channel_stdio",
    bodyKey: "admin.guide.tool_update",
  },
] as const;

export function InstructionsPage({
  locale,
  onLocaleChange,
}: {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}) {
  return (
    <AuthShell
      locale={locale}
      onLocaleChange={onLocaleChange}
      variant="home"
    >
      <article className="guide" data-testid="instructions-guide">
        <header className="page-head">
          <p className="eyebrow">{t(locale, "admin.guide.eyebrow")}</p>
          <h1>{t(locale, "admin.guide.title")}</h1>
          <p>{t(locale, "admin.guide.lead")}</p>
          <nav className="guide-toc" aria-label="Contents">
            <a href="#tools">{t(locale, "admin.guide.toc_tools")}</a>
            <a href="#stdio">{t(locale, "admin.guide.toc_stdio")}</a>
            <a href="#http">{t(locale, "admin.guide.toc_http")}</a>
          </nav>
        </header>
        <section className="guide-section" id="tools">
          <h2>{t(locale, "admin.guide.h_tools")}</h2>
          <p>{t(locale, "admin.guide.tools_intro")}</p>
          <div className="table-wrap">
            <table className="guide-caps-table">
              <thead>
                <tr>
                  <th>{t(locale, "admin.guide.cap_col_tool")}</th>
                  <th>{t(locale, "admin.guide.cap_col_channel")}</th>
                  <th>{t(locale, "admin.guide.cap_col_body")}</th>
                </tr>
              </thead>
              <tbody>
                {TOOLS.map((tool) => (
                  <tr key={tool.name}>
                    <td>
                      <code>{tool.name}</code>
                    </td>
                    <td>{t(locale, tool.channelKey)}</td>
                    <td>{t(locale, tool.bodyKey)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="guide-section" id="stdio">
          <h2>{t(locale, "admin.guide.h_stdio")}</h2>
          <p>{t(locale, "admin.guide.stdio_body")}</p>
          <p className="field-note mono">
            npx tsx src/mcp/stdio.ts
          </p>
        </section>
        <section className="guide-section" id="http">
          <h2>{t(locale, "admin.guide.h_http")}</h2>
          <p>{t(locale, "admin.guide.http_body")}</p>
          <p className="field-note mono">
            http://localhost:3041/mcp
          </p>
        </section>
      </article>
    </AuthShell>
  );
}
