"use client";

import { t, type Locale } from "@/i18n/t";
import { CopyButton } from "@/components/ui/CopyButton";

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

export function SetupGuidePanel({
  locale,
  setupPromptSentence,
  nodePrerequisiteSentence,
}: {
  locale: Locale;
  setupPromptSentence: string;
  nodePrerequisiteSentence: string;
}) {
  return (
    <>
      <section className="guide-section" id="setup">
        <div className="setup-card">
          <p className="setup-highlight" data-testid="setup-highlight">
            {t(locale, "admin.guide.setup_highlight")}
          </p>
          <CopyButton
            className="setup-pill"
            value={setupPromptSentence}
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

        <div className="setup-card setup-node-card">
          <h2 className="section-subtitle">
            {t(locale, "admin.guide.setup_node_section_title")}
          </h2>
          <p className="setup-node-lead">
            {t(locale, "admin.guide.setup_node_section_lead")}
          </p>
          <CopyButton
            className="setup-pill"
            value={nodePrerequisiteSentence}
            label={
              <>
                <span className="setup-pill-text">
                  {t(locale, "admin.guide.copy_node_prompt")}
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
            data-testid="copy-node-setup-prompt"
          />
        </div>
      </section>

      <section className="guide-section" id="agents">
        <p
          className="setup-after setup-update-preface"
          data-testid="setup-update-preface"
        >
          {t(locale, "admin.guide.setup_update_tool")}
        </p>
        <h2 className="section-subtitle">{t(locale, "admin.guide.h_agents")}</h2>
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
    </>
  );
}
