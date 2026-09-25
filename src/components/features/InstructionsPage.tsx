"use client";

import { useState, type FormEvent } from "react";
import { t, type Locale } from "@/i18n/t";
import { AuthShell } from "@/components/layout/AuthShell";
import { CopyButton } from "@/components/ui/CopyButton";
import { Logo } from "@/components/ui/Logo";

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
    name: "sdd_list_versions",
    bodyKey: "admin.guide.tool_list_versions",
  },
  {
    name: "sdd_install_framework",
    bodyKey: "admin.guide.tool_install",
  },
  {
    name: "sdd_update_framework",
    bodyKey: "admin.guide.tool_update",
  },
] as const;

const FEATURE_AGENTS = [
  { name: "ethan", summaryKey: "admin.guide.feat_ethan" },
] as const;

const FEATURE_SKILLS = [
  { name: "sdd-atdd", summaryKey: "admin.guide.feat_sdd_atdd" },
  { name: "sdd-tdd", summaryKey: "admin.guide.feat_sdd_tdd" },
  { name: "sdd-new-project", summaryKey: "admin.guide.feat_sdd_new_project" },
  { name: "sdd-update-project", summaryKey: "admin.guide.feat_sdd_update_project" },
  { name: "sdd-refine-pb", summaryKey: "admin.guide.feat_sdd_refine_pb" },
  { name: "sdd-plan-sprint", summaryKey: "admin.guide.feat_sdd_plan_sprint" },
  { name: "sdd-update-status", summaryKey: "admin.guide.feat_sdd_update_status" },
  { name: "sdd-retrospective", summaryKey: "admin.guide.feat_sdd_retrospective" },
  { name: "sdd-close-sprint", summaryKey: "admin.guide.feat_sdd_close_sprint" },
  { name: "sdd-audit-artifacts", summaryKey: "admin.guide.feat_sdd_audit_artifacts" },
  { name: "sdd-update-specs", summaryKey: "admin.guide.feat_sdd_update_specs" },
  { name: "sdd-implement-feature", summaryKey: "admin.guide.feat_sdd_implement_feature" },
] as const;

const FEATURE_RULES = [
  { name: "dod.mdc", summaryKey: "admin.guide.feat_dod" },
  { name: "incremental-delivery.mdc", summaryKey: "admin.guide.feat_incremental" },
  { name: "realtime-status.mdc", summaryKey: "admin.guide.feat_realtime" },
] as const;

const FEATURE_TEMPLATES = [
  { name: "product-backlog.md", summaryKey: "admin.guide.feat_product_backlog" },
  { name: "sprint-backlog.md", summaryKey: "admin.guide.feat_sprint_backlog" },
  { name: "status.md", summaryKey: "admin.guide.feat_status" },
  { name: "change-log.md", summaryKey: "admin.guide.feat_change_log" },
  { name: "artifacts-map.md", summaryKey: "admin.guide.feat_artifacts_map" },
  { name: "architecture.md", summaryKey: "admin.guide.feat_architecture" },
  { name: "design.md", summaryKey: "admin.guide.feat_design" },
  { name: "test.md", summaryKey: "admin.guide.feat_test" },
  { name: "deployment.md", summaryKey: "admin.guide.feat_deployment" },
] as const;

type GuideTab = "setup" | "features";

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

function FeatureList({
  locale,
  items,
}: {
  locale: Locale;
  items: readonly { name: string; summaryKey: string }[];
}) {
  return (
    <ul className="feature-list">
      {items.map((item) => (
        <li key={item.name}>
          <span className="feature-name">{item.name}</span>
          <span className="feature-summary">{t(locale, item.summaryKey)}</span>
        </li>
      ))}
    </ul>
  );
}

export function InstructionsPage({
  locale,
  onLocaleChange,
}: {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}) {
  const [tab, setTab] = useState<GuideTab>("setup");
  const [secretName, setSecretName] = useState("");

  function onSecretSubmit(event: FormEvent) {
    event.preventDefault();
    // feature-10: form is visible only; live lookup is Web-portal-08.
  }

  return (
    <AuthShell
      locale={locale}
      onLocaleChange={onLocaleChange}
      variant="home"
      className="guide-shell"
      footerVariant="guide"
    >
      <article className="guide" data-testid="instructions-guide">
        <header className="guide-hero">
          <div className="guide-hero-title">
            <Logo size="header" href="/" />
            <h1>{t(locale, "admin.guide.title")}</h1>
          </div>
          <p className="guide-hero-tag">{t(locale, "admin.guide.lead")}</p>
        </header>

        <div
          className="guide-tabs"
          role="tablist"
          aria-label={t(locale, "admin.guide.tabs_label")}
        >
          <button
            type="button"
            className={tab === "setup" ? "guide-tab is-active" : "guide-tab"}
            role="tab"
            id="tab-setup"
            aria-selected={tab === "setup"}
            aria-controls="panel-setup"
            data-tab="setup"
            data-testid="guide-tab-setup"
            onClick={() => setTab("setup")}
          >
            {t(locale, "admin.guide.tab_setup")}
          </button>
          <button
            type="button"
            className={tab === "features" ? "guide-tab is-active" : "guide-tab"}
            role="tab"
            id="tab-features"
            aria-selected={tab === "features"}
            aria-controls="panel-features"
            data-tab="features"
            data-testid="guide-tab-features"
            onClick={() => setTab("features")}
          >
            {t(locale, "admin.guide.tab_features")}
          </button>
        </div>

        <div
          className="guide-tab-panel"
          role="tabpanel"
          id="panel-setup"
          aria-labelledby="tab-setup"
          data-panel="setup"
          hidden={tab !== "setup"}
        >
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
        </div>

        <div
          className="guide-tab-panel"
          role="tabpanel"
          id="panel-features"
          aria-labelledby="tab-features"
          data-panel="features"
          hidden={tab !== "features"}
          data-testid="panel-features"
        >
          <section className="guide-section feature-section" id="features-agents">
            <h2 className="section-subtitle">
              {t(locale, "admin.guide.features_h_agents")}
            </h2>
            <FeatureList locale={locale} items={FEATURE_AGENTS} />
          </section>

          <section className="guide-section feature-section" id="features-skills">
            <h2 className="section-subtitle">
              {t(locale, "admin.guide.features_h_skills")}
            </h2>
            <FeatureList locale={locale} items={FEATURE_SKILLS} />
          </section>

          <section className="guide-section feature-section" id="features-rules">
            <h2 className="section-subtitle">
              {t(locale, "admin.guide.features_h_rules")}
            </h2>
            <FeatureList locale={locale} items={FEATURE_RULES} />
          </section>

          <section className="guide-section feature-section" id="features-templates">
            <h2 className="section-subtitle">
              {t(locale, "admin.guide.features_h_templates")}
            </h2>
            <FeatureList locale={locale} items={FEATURE_TEMPLATES} />
          </section>

          <section className="guide-section" id="features-secret">
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
                type="submit"
                data-testid="secret-get"
              >
                {t(locale, "admin.guide.secret_button")}
              </button>
            </form>
          </section>
        </div>
      </article>
    </AuthShell>
  );
}
