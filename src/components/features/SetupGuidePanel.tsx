"use client";

import { t, type Locale } from "@/i18n/t";
import { CopyButton } from "@/components/ui/CopyButton";
import {
  MANUAL_CLIENTS,
  type SetupManualPasteContent,
} from "@/lib/setup-manual";

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

function FileBlock({
  tag,
  value,
  locale,
  testid,
}: {
  tag: string;
  value: string;
  locale: Locale;
  testid?: string;
}) {
  return (
    <div className="codeblock codeblock--file">
      <div className="codeblock-head">
        <span className="codeblock-tag">{tag}</span>
        <CopyButton
          className="codeblock-copy"
          value={value}
          label={t(locale, "admin.keys.copy")}
          copiedLabel={t(locale, "admin.common.copied")}
          data-testid={testid}
        />
      </div>
      <pre className="codeblock-text mono">{value}</pre>
    </div>
  );
}

function ManualPasteNote({ locale, path }: { locale: Locale; path: string }) {
  return (
    <p className="setup-manual-note">
      {t(locale, "admin.guide.manual_paste_prefix")}
      <code>{path}</code>
      {t(locale, "admin.guide.manual_paste_suffix")}
    </p>
  );
}

function manualCommandForClient(
  manualPaste: SetupManualPasteContent,
  clientId: string,
): string {
  if (clientId === "claude") return manualPaste.claudeCommand;
  if (clientId === "codex") return manualPaste.codexCommand;
  throw new Error(`setup-manual: missing command for ${clientId}`);
}

export function SetupGuidePanel({
  locale,
  setupPromptSentence,
  manualPaste,
}: {
  locale: Locale;
  setupPromptSentence: string;
  manualPaste: SetupManualPasteContent;
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

        <div className="setup-manual" data-testid="setup-manual">
          <h3 className="section-subtitle">
            {t(locale, "admin.guide.manual_title")}
          </h3>
          <p className="field-note">{t(locale, "admin.guide.manual_body")}</p>
          <FileBlock
            tag="mcp.json"
            value={manualPaste.mcpSample}
            locale={locale}
            testid="copy-manual-mcp"
          />
          <p className="field-note">
            {t(locale, "admin.guide.manual_paths_intro")}
          </p>
          <ul className="setup-manual-paths">
            {MANUAL_CLIENTS.map((client) => (
              <li key={client.id}>
                <span className="setup-manual-client">{client.label}</span>
                {client.type === "command" ? (
                  <CmdBlock
                    value={manualCommandForClient(manualPaste, client.id)}
                    locale={locale}
                    testid={`copy-manual-${client.id}`}
                  />
                ) : (
                  <ManualPasteNote locale={locale} path={client.path} />
                )}
              </li>
            ))}
          </ul>
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
