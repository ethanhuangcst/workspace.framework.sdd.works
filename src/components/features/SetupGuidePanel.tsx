"use client";

import { t, type Locale } from "@/i18n/t";
import { CopyButton } from "@/components/ui/CopyButton";

const SETUP_SENTENCE =
  "Fetch and execute the setup instructions from https://framework.sdd.works/setup";

const MCP_CONFIG = `{
  "mcpServers": {
    "framework.sdd.works": {
      "command": "\${userHome}/.sdd/sdd-mcp",
      "env": {
        "SDD_SERVER_URL": "https://framework.sdd.works"
      }
    }
  }
}`;

const INSTALL_CMD = "sdd_install_framework";

const AGENT_LOGOS = [
  { src: "/guide/claude.png", alt: "Claude" },
  { src: "/guide/cursor.png", alt: "Cursor" },
  { src: "/guide/codex.png", alt: "Codex" },
  { src: "/guide/codebuddy.png", alt: "CodeBuddy" },
] as const;

const AGENT_ROSTER = [
  { icon: "/guide/claude.png", name: "Claude Code" },
  { icon: "/guide/codex.png", name: "Codex" },
  { icon: "/guide/cursor.png", name: "Cursor" },
  { icon: "/guide/codebuddy.png", name: "CodeBuddy CN / CodeBuddy / WorkBuddy CN" },
  { icon: "/guide/trae.png", name: "TraeCode CN / TRAE" },
  { icon: "/guide/copilot.png", name: "GitHub Copilot" },
  { icon: "/guide/kiro.png", name: "AWS Kiro" },
] as const;

const TOOLS = [
  {
    name: "sdd_install_framework",
    bodyKey: "admin.guide.tool_install",
  },
  {
    name: "sdd_update_framework",
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

export function SetupGuidePanel({ locale }: { locale: Locale }) {
  return (
    <>
      <section className="guide-section" id="setup">
        <div className="setup-card">
          <CopyButton
            className="setup-pill"
            value={SETUP_SENTENCE}
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
        </div>
      </section>

      <section className="guide-section" id="agents">
        <h2 className="section-subtitle">{t(locale, "admin.guide.h_agents")}</h2>
        <p>{t(locale, "admin.guide.agents_intro")}</p>
        <ol className="agent-roster" data-testid="guide-agents">
          {AGENT_ROSTER.map((agent) => (
            <li key={agent.name} className="agent-roster-row">
              <span className="agent-roster-mark" aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element -- small static brand marks */}
                <img
                  className="agent-roster-icon"
                  src={agent.icon}
                  alt=""
                  width={18}
                  height={18}
                />
              </span>
              <span className="agent-roster-name">{agent.name}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="guide-section" id="tools">
        <h2 className="section-subtitle">{t(locale, "admin.guide.h_tools")}</h2>
        <div className="table-wrap">
          <table className="guide-caps-table">
            <thead>
              <tr>
                <th>{t(locale, "admin.guide.cap_col_tool")}</th>
                <th>{t(locale, "admin.guide.cap_col_body")}</th>
              </tr>
            </thead>
            <tbody>
              {TOOLS.map((tool) => (
                <tr key={tool.name}>
                  <td>
                    <code>{tool.name}</code>
                  </td>
                  <td>{t(locale, tool.bodyKey)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
