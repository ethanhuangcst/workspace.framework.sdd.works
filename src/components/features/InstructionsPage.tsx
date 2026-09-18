"use client";

import { t, type Locale } from "@/i18n/t";
import { AuthShell } from "@/components/layout/AuthShell";
import { CopyButton } from "@/components/ui/CopyButton";
import { Logo } from "@/components/ui/Logo";

const SETUP_PROMPT =
  "Fetch and execute the setup instructions from https://framework.sdd.works/agent-setup";

const MCP_CONFIG = `{
  "mcpServers": {
    "framework.sdd.works": {
      "url": "https://framework.sdd.works/mcp"
    }
  }
}`;

const CURL_FALLBACK = "curl -fsSL https://framework.sdd.works/install | sh";

const INSTALL_CMD = "sdd_install_framework";

const AGENT_LOGOS = [
  { src: "/guide/claude.png", alt: "Claude" },
  { src: "/guide/cursor.png", alt: "Cursor" },
  { src: "/guide/codex.png", alt: "Codex" },
  { src: "/guide/codebuddy.png", alt: "CodeBuddy" },
] as const;

const TOOLS = [
  {
    name: "sdd_list_versions",
    channelKey: "admin.guide.cap_channel_both",
    bodyKey: "admin.guide.tool_list_versions",
  },
  {
    name: "sdd_get_key",
    channelKey: "admin.guide.cap_channel_http",
    bodyKey: "admin.guide.tool_get_key",
  },
  {
    name: "sdd_install_framework",
    channelKey: "admin.guide.cap_channel_both",
    bodyKey: "admin.guide.tool_install",
  },
  {
    name: "sdd_update_framework",
    channelKey: "admin.guide.cap_channel_both",
    bodyKey: "admin.guide.tool_update",
  },
] as const;

function AgentToolIcons() {
  return (
    <span className="setup-pill-icons" aria-hidden="true">
      {AGENT_LOGOS.map((logo) => (
        // eslint-disable-next-line @next/next/no-img-element -- small static brand marks
        <img
          key={logo.src}
          className="setup-pill-icon"
          src={logo.src}
          alt=""
          width={18}
          height={18}
        />
      ))}
    </span>
  );
}

function CmdBlock({
  value,
  locale,
  testid,
}: {
  value: string;
  locale: Locale;
  testid?: string;
}) {
  return (
    <div className="codeblock">
      <pre className="codeblock-text mono">{value}</pre>
      <CopyButton
        className="codeblock-copy"
        value={value}
        label={t(locale, "admin.keys.copy")}
        copiedLabel={t(locale, "admin.common.copied")}
        data-testid={testid}
      />
    </div>
  );
}

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
      className="guide-shell"
    >
      <article className="guide" data-testid="instructions-guide">
        <header className="guide-hero">
          <div className="guide-hero-title">
            <Logo size="header" href="/" />
            <h1>{t(locale, "admin.guide.title")}</h1>
          </div>
          <p className="guide-hero-tag">{t(locale, "admin.guide.lead")}</p>
        </header>

        <section className="guide-section" id="setup">
          <h2 className="section-subtitle">{t(locale, "admin.guide.h_setup")}</h2>
          <p>{t(locale, "admin.guide.setup_body")}</p>

          <div className="setup-card">
            <span className="setup-card-label">
              {t(locale, "admin.guide.setup_prompt_label")}
            </span>
            <CmdBlock
              value={SETUP_PROMPT}
              locale={locale}
              testid="copy-setup-prompt-block"
            />
            <CopyButton
              className="setup-pill"
              value={SETUP_PROMPT}
              label={
                <>
                  <span className="setup-pill-text">
                    {t(locale, "admin.guide.copy_prompt")}
                  </span>
                  <span className="setup-pill-divider" aria-hidden="true" />
                  <AgentToolIcons />
                </>
              }
              copiedLabel={
                <>
                  <span className="setup-pill-text">
                    {t(locale, "admin.common.copied")}
                  </span>
                  <span className="setup-pill-divider" aria-hidden="true" />
                  <AgentToolIcons />
                </>
              }
              data-testid="copy-setup-prompt"
            />

            <div className="setup-after">
              <p>{t(locale, "admin.guide.setup_after_prompt")}</p>
              <CmdBlock
                value={t(locale, "admin.guide.setup_install_phrase")}
                locale={locale}
                testid="copy-install-phrase"
              />
              <p>{t(locale, "admin.guide.setup_after_tool")}</p>
              <CmdBlock
                value={INSTALL_CMD}
                locale={locale}
                testid="copy-install-cmd"
              />
            </div>
          </div>

          <div className="setup-manual">
            <h3 className="section-subtitle">
              {t(locale, "admin.guide.manual_title")}
            </h3>
            <p className="field-note">{t(locale, "admin.guide.manual_body")}</p>
            <div className="codeblock codeblock--file">
              <div className="codeblock-head">
                <span className="codeblock-tag">mcp.json</span>
                <CopyButton
                  className="codeblock-copy"
                  value={MCP_CONFIG}
                  label={t(locale, "admin.keys.copy")}
                  copiedLabel={t(locale, "admin.common.copied")}
                  data-testid="copy-mcp-config"
                />
              </div>
              <pre className="codeblock-text mono">{MCP_CONFIG}</pre>
            </div>
            <div className="setup-fallback">
              <p className="setup-fallback-label">
                {t(locale, "admin.guide.setup_fallback_label")}
              </p>
              <CmdBlock
                value={CURL_FALLBACK}
                locale={locale}
                testid="copy-curl-fallback"
              />
            </div>
          </div>
        </section>

        <section className="guide-section" id="tools">
          <h2 className="section-subtitle">{t(locale, "admin.guide.h_tools")}</h2>
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
      </article>
    </AuthShell>
  );
}
