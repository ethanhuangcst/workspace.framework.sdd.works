"use client";

import { useEffect, useState, type FormEvent } from "react";
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
  const [secretName, setSecretName] = useState("");
  const [secretValue, setSecretValue] = useState<string | null>(null);
  const [secretErrorKey, setSecretErrorKey] = useState<string | null>(null);
  const [secretLookingUp, setSecretLookingUp] = useState(false);

  useEffect(() => {
    const selector =
      secretValue != null
        ? "[data-testid='secret-result']"
        : secretErrorKey
          ? "[data-testid='secret-error']"
          : null;
    if (!selector) return;
    const node = document.querySelector(selector);
    if (node && typeof (node as HTMLElement).scrollIntoView === "function") {
      (node as HTMLElement).scrollIntoView({
        block: "start",
        behavior: "smooth",
      });
    }
  }, [secretValue, secretErrorKey]);

  async function lookupSecret() {
    const name = secretName.trim();
    setSecretValue(null);
    setSecretErrorKey(null);
    if (!name) {
      setSecretErrorKey("admin.guide.secret_empty");
      return;
    }
    if (secretLookingUp) return;
    setSecretLookingUp(true);
    try {
      const res = await fetch("/api/sdd/secret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key_name: name }),
      });
      let data: { key_value?: string; error?: { key: string } } = {};
      try {
        data = (await res.json()) as {
          key_value?: string;
          error?: { key: string };
        };
      } catch {
        data = {};
      }
      if (!res.ok || data.key_value == null) {
        setSecretErrorKey(
          data.error?.key ?? "admin.guide.secret_missing",
        );
        return;
      }
      setSecretValue(data.key_value);
    } catch {
      setSecretErrorKey("admin.guide.secret_missing");
    } finally {
      setSecretLookingUp(false);
    }
  }

  function onSecretSubmit(event: FormEvent) {
    event.preventDefault();
    event.stopPropagation();
    void lookupSecret();
  }

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

      <section className="guide-section" id="setup-secret">
        <div className="secret-stack">
          <form
            className="secret-lookup"
            data-testid="secret-lookup"
            onSubmit={onSecretSubmit}
          >
            <input
              className="input-box"
              type="text"
              name="secret_name"
              autoComplete="off"
              spellCheck={false}
              placeholder={t(locale, "admin.guide.secret_hint")}
              value={secretName}
              onChange={(event) => setSecretName(event.target.value)}
              data-testid="secret-name"
            />
            <button
              className="btn"
              type="button"
              data-testid="secret-get"
              disabled={secretLookingUp}
              onClick={() => {
                void lookupSecret();
              }}
            >
              {t(locale, "admin.guide.secret_button")}
            </button>
          </form>
          {secretValue != null ? (
            <div
              className="codeblock secret-result-block"
              data-testid="secret-result"
              aria-live="polite"
            >
              <pre className="codeblock-text mono">{secretValue}</pre>
              <CopyButton
                className="codeblock-copy"
                value={secretValue}
                label={t(locale, "admin.keys.copy")}
                copiedLabel={t(locale, "admin.common.copied")}
                data-testid="secret-result-copy"
              />
            </div>
          ) : null}
          {secretErrorKey ? (
            <p
              className="field-note secret-error"
              data-testid="secret-error"
              aria-live="polite"
            >
              {t(locale, secretErrorKey)}
            </p>
          ) : null}
        </div>
      </section>
    </>
  );
}
