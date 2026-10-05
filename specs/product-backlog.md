# Product overview — [framework.sdd.works](http://framework.sdd.works)

> Type: Framework (process) artifact of framework.sdd.works
> as_of: 2026-10-05
> [Definition](./framework/seeds/templates/EN/sdd-scrum-practices.md#product-backlogmd)

---

- framework.sdd.works is an MCP service plus an admin portal that installs and updates an SDD framework in the calling AI client.
- Phase 1 is closed.
- Phase 2 ships the guide, practices, project templates, ethan, rules, and skills.
- Files under `specs/` in this repo are process assets for building the pack.
- Install leaves the files under `specs/` in this repo.

## Index

- [Scope boundary](#scope-boundary)
- [Requirements](#requirements)
  - [framework](#framework)
  - [mcp](#mcp)
  - [web-portal](#web-portal)
  - [Definition of Done](#definition-of-done)
- [Product Backlog](#product-backlog)
- [Change record](#change-record)

---



## Scope boundary



### What Phase 2 does



#### 1. Define Scrum in SDD framework: a SDD framework integrated with Scrum, under Harness principles

**Framework artifacts**

- Core artifacts 
- Framework(process) artifacts templates
- Engineering artifacts templates
**Default local client agent: ethan**
**Framework harness rules and skills**



#### 2. **Updated web portal**: [sdd.works](http://sdd.works)

- Updated instruction page
- Framework installation promp on first page



#### 3. **Updated framework installer MCP**

- Updated MCP v2 with only 2 tools
- Updated installer with local stdio solution



### Explicitly out of scope

- Phase 1 admin portal behavior that is already shipped.
- MCP behavior that is already shipped and is outside [MCP-01](#pb-16).

[Back to top](#index)

---



# Requirements

## framework

### agents: ethan

- <a id="req-pb-6"></a>[Agent-01](#pb-6) Local Cursor agent
  - Ethan runs as a local Cursor agent.
  - Proof of concept is closed ([D1](./sprint-backlog.md#rid-d1) Closed).
  - The pack includes the ethan prompt in the seed tree.
  - Pack publish is go-live, not this row.
- <a id="req-pb-8"></a>[Agent-02](#pb-8) Skill call for a named job
  - Ethan calls the proper skill to complete the job the user names.
  - The steps stay in that skill.
  - Where the project is comes from `sdd-review-status`.
  - Ethan writes a project file only after the user confirms.
- <a id="req-pb-10"></a>[Agent-03](#pb-10) Guiding proposals from framework knowledge
  - Ethan reads the framework artifacts and knowledge.
  - Ethan gives guiding proposals in chat.
- <a id="req-pb-17"></a>[Agent-04](#pb-17) Agent ethan onboard with pack receipt start gate
  - On start, Ethan reads only `{client_root}/.sdd-installed.json`.
  - Missing ledger or `pack_complete` not true is a fatal stop.
  - He may set `pack_complete` to false when a later job needs a missing framework file.
  - He does not set it to true.



### skills

Workflows: none until a workflow is planned. No workflow PBI.

- <a id="req-pb-21"></a>[Skill-01](#pb-21) Pack skill sdd-atdd
  - The pack includes the ATDD skill folder.
- <a id="req-pb-24"></a>[Skill-03](#pb-24) Pack skill sdd-update-project
  - The pack includes the update-project skill (`skill_update_project`).
  - The job is Update project settings. [ADR-079](./adr/ADR-079-one-job-update-project.md).
- <a id="req-pb-25"></a>[Skill-04](#pb-25) Pack skill sdd-refine-backlog
  - The pack includes the refine-product-backlog skill (`skill_refine_pb`).
- <a id="req-pb-26"></a>[Skill-05](#pb-26) Pack skill sdd-plan-sprint
  - The pack includes the sprint-planning skill (`skill_plan_sprint`).
- <a id="req-pb-28"></a>[Skill-06](#pb-28) Pack skill sdd-retrospective
  - The pack includes the retrospective skill (`skill_retrospective`).
  - The record uses three headings: Learnings, Opportunities, and Future actions.
- <a id="req-pb-29"></a>[Skill-07](#pb-29) Pack skill sdd-close-sprint
  - The pack includes the close / start sprint skill (`skill_close_sprint`).
- <a id="req-pb-30"></a>[Skill-08](#pb-30) Pack skill sdd-audit-artifacts
  - After the pack gate the skill reads `{workspace}/artifacts-map.json` and opens each stored path as `{workspace}/<path>`.
  - It returns one verdict: `Uninitialized`, `Index broken`, or `Usable`.
  - It reports paths opened, paths that failed, and whether `locale` is empty.
  - It does not write a project file or the ledger.
- <a id="req-pb-64"></a>[Skill-09](#pb-64) Pack skill sdd-update-specs
  - The skill keeps the specs that a change touches aligned with the implementation.
- <a id="req-pb-80"></a>[Skill-11](#pb-80) Pack skill sdd-spec-to-build
  - The skill consolidates the requirement, writes the design, and implements one SBI (`sdd-spec-to-build`).
  - It loads `sdd-update-specs` and `sdd-atdd` when the Definition of Done and the acceptance criteria require them.
  - [ADR-085](./adr/ADR-085-sdd-spec-to-build.md). Supersedes [ADR-066](./adr/ADR-066-sdd-design-before-implementation.md).
- <a id="req-pb-86"></a>[Skill-12](#pb-86) Pack skill sdd-review-status
  - The skill compares the board with the current sprint's named work, lists each mismatch, records each choice, and writes once (`skill_get_status`).
- <a id="req-pb-87"></a>[Skill-13](#pb-87) Pack skill sdd-create-skill
  - The skill creates or revises a skill (`skill_create_skill`).
  - It writes `{client_root}/{skills_dir}/<name>/SKILL.md` after confirm.
  - Pack folder `sdd-create-skill` avoids Cursor built-in `create-skill`. [ADR-092](./adr/ADR-092-pack-authoring-skill-sdd-prefix.md).
  - It is not a practices job.
- <a id="req-pb-89"></a>[Skill-14](#pb-89) Pack skill prompt-optimizer
  - The pack skill `prompt-optimizer` optimizes a prompt.
  - It does not match ECC components.
- <a id="req-pb-93"></a>[Skill-15](#pb-93) Pack skill sdd-build-agent
  - The pack includes the build-agent skill (`skill_build_agent`).
  - The skill writes one agent file under `{client_root}/{agents_dir}/` after confirm.
  - Pack folder `sdd-build-agent`. [ADR-092](./adr/ADR-092-pack-authoring-skill-sdd-prefix.md).
- <a id="req-pb-94"></a>[Skill-16](#pb-94) Pack skill sdd-create-rule
  - The pack includes the create-rule skill (`skill_create_rule`).
  - The skill writes one rule file under `{client_root}/{rules_dir}/` after confirm.
  - Pack folder `sdd-create-rule` avoids Cursor built-in `create-rule`. [ADR-092](./adr/ADR-092-pack-authoring-skill-sdd-prefix.md).



### rules

- <a id="req-pb-18"></a>[Rule-01](#pb-18) Pack rule dod.mdc
  - The pack includes the Definition of Done rule file.
- <a id="req-pb-19"></a>[Rule-02](#pb-19) Pack rule incremental-delivery.mdc
  - The pack includes the incremental delivery rule file.
- <a id="req-pb-20"></a>[Rule-03](#pb-20) Pack rule realtime-status.mdc
  - **Retired.** [ADR-091](./adr/ADR-091-retire-realtime-status-rule.md). `status.md` updates on DoD close live in `dod.mdc`.
- <a id="req-pb-95"></a>[Rule-04](#pb-95) Pack rule friendly-language.mdc
  - The pack includes `rules/friendly-language.mdc`.
  - The constants key is `friendly-language`.
  - The rule replaces personal `writing-style.mdc` and loads with `alwaysApply: true`.
  - Skills link this file for wording checks. They do not copy the check list.



### template seeds



#### EN



##### Core artifacts

- <a id="req-pb-33"></a>[Spec-seeds-01](#pb-33) Seed scrum-in-sdd.md
  - The seed is the framework guide for every project: names and meaning.
  - It does not take what, how, and when from practices.
- <a id="req-pb-34"></a>[Spec-seeds-02](#pb-34) Seed sdd-scrum-practices.md
  - The seed is the framework practices for every project: what, how, and when.
  - It does not redefine guide terms.
  - Workflow steps live in skills.
- <a id="req-pb-32"></a>[Spec-seeds-03](#pb-32) Seed constants.json
  - The seed is the lookup file for path names, skill keys, and rule keys.
  - It is not inside a locale folder.
  - After install it lives on `{client_root}/templates/framework.sdd.works/constants.json`. [ADR-081](./adr/ADR-081-constants-json.md).
- <a id="req-pb-35"></a>[Spec-seeds-04](#pb-35) Project file artifacts-map.json
  - The project path file is `{workspace}/artifacts-map.json`.
  - There is no template seed.
  - The example is in the artifacts-map section of `sdd-scrum-practices.md`. [ADR-080](./adr/ADR-080-no-artifacts-map-seed.md). [ADR-082](./adr/ADR-082-artifacts-map-json.md). Optional `adr` and `knowledge` keys name directory roots. [ADR-090](./adr/ADR-090-adr-knowledge-map-roots.md).



##### Process artifacts

- <a id="req-pb-36"></a>[Spec-seeds-05](#pb-36) Seed product-backlog.md
  - The seed is the example product backlog a new project copies.
  - It is not this repo's product backlog.
- <a id="req-pb-37"></a>[Spec-seeds-06](#pb-37) Seed sprint-backlog.md
  - The seed is the generic sprint-backlog starter for a new project.
- <a id="req-pb-38"></a>[Spec-seeds-07](#pb-38) Seed status.md
  - The seed is the status starter for a new project.
  - Column and row rules are in [status.md](./framework/seeds/templates/EN/sdd-scrum-practices.md#statusmd).
- <a id="req-pb-39"></a>[Spec-seeds-08](#pb-39) Seed changes-log.md
  - The seed is the generic change-log starter for a new project.
  - A conclusion record: what changed, why, and how it was verified.
- <a id="req-pb-84"></a>[Spec-seeds-09](#pb-84) Seed issues-log.md
  - The seed is the issues-log starter for a new project.
  - Column and row rules are in [issues-log.md](./framework/seeds/templates/EN/sdd-scrum-practices.md#issues-logmd).



##### Engineering artifacts

- <a id="req-pb-40"></a>[Spec-seeds-10](#pb-40) Seed architecture.md
  - The seed is the generic architecture starter for a new project.
- <a id="req-pb-41"></a>[Spec-seeds-11](#pb-41) Seed deployment.md
  - The seed is the generic deployment starter for a new project.
- <a id="req-pb-66"></a>[Spec-seeds-12](#pb-66) Seed .secrets
  - The seed is the secrets file named in the guide.
  - It holds names and where values live. It holds no secret values.
- <a id="req-pb-90"></a>[Spec-seeds-13](#pb-90) Seed test-strategy.md
  - The seed is the generic test-strategy starter for a new project.
  - It is not this repo's test strategy.



#### HanS and HanT

HanS and HanT bodies for the locale template folders. Spec-seeds rows own the EN starter only. One PBI covers both locales.

- <a id="req-pb-67"></a>[i18n-01](#pb-67) HanS and HanT core artifacts
  - HanS and HanT bodies of `scrum-in-sdd.md` and the other core prose in that locale folder match the EN meaning.
  - `sdd-scrum-practices.md` stays EN only. HanS and HanT `scrum-in-sdd.md` link [Terminology in practice](./framework/seeds/templates/EN/sdd-scrum-practices.md#terminology-in-practice) and the practices sections their jobs need.
- <a id="req-pb-68"></a>[i18n-02](#pb-68) HanS and HanT process artifacts
  - HanS and HanT starters for `product-backlog.md`, `sprint-backlog.md`, `status.md`, `changes-log.md`, and `issues-log.md` match the EN starter meaning.
  - There is no `artifacts-map.md` template seed.
- <a id="req-pb-69"></a>[i18n-03](#pb-69) HanS and HanT engineering artifacts
  - HanS and HanT starters for `architecture.md`, `{stem}-stories.md`, `{stem}-design.md`, `{stem}-tests.md`, `deployment.md`, `.secrets`, and `test-strategy.md` match the EN starter meaning.

[Back to top](#index)

---



## mcp

- <a id="req-pb-16"></a>[MCP-01](#pb-16) Installer allow-list and file ledger
  - `sdd_install_framework` and `sdd_update_framework` copy the pack allow-list onto `{client_root}`.
  - The tools write `{client_root}/.sdd-installed.json` with `pack_complete: true` when the copy finishes (ADR-057).
  - `files` lists each pack file path, not the folder name (ADR-059).
  - Sprint 2 installer SBIs parent this PBI. [MCP-04](#pb-92) owns production go-live.
- <a id="req-pb-92"></a>[MCP-04](#pb-92) Pack go-live on the client root
  - Publish the five `sdd-mcp` binaries on GitHub Releases.
  - Admin portal sync ships the pack end users install in production.
  - End-user install stays stdio primary ([ADR-058](./adr/ADR-058-stdio-end-user-http-fallback.md)) with HTTP fallback ([ADR-054](./adr/ADR-054-hybrid-http-ai-tarball.md)).
- <a id="req-pb-75"></a>[MCP-02](#pb-75) Local binary ~/.sdd/sdd-mcp
  - The running program does not need Node, npm, Bun, Python, or any other runtime. Bun is the build machine only ([ADR-051](./adr/ADR-051-zero-dep-stdio-binary.md)).
  - One executable covers macOS, Windows, and Linux (ADR-051 targets: `darwin-arm64`, `darwin-x64`, `linux-arm64`, `linux-x64`, `windows-x64`).
  - The same program is the stdio `command` for every client in `[mcp-design.md](./mcp/mcp-design.md)` §4.1: Cursor, Cursor Agents, CodeBuddy CN, TRAE, TRAE CN, Claude Code, and Cline. Codex and Copilot use it after their paths are verified.
  - The program does the stdio write in `[mcp-design.md](./mcp/mcp-design.md)`: `sdd_install_framework` and `sdd_update_framework` copy the pack allow-list onto `{client_root}` and write `.sdd-installed.json` with `pack_complete: true` and file paths. It does not write `framework.sdd.works.json`.
  - The binary holds no operator secrets and writes only under the allow-listed client root.
  - Setup tells the agent to run the local file `~/.sdd/sdd-mcp`. It does not tell the agent to download an executable from the network and run it.
- <a id="req-pb-78"></a>[MCP-03](#pb-78) MCP tools without sdd_list_versions
  - The person in the IDE installs or updates the latest pack. They do not pick a version from an MCP tool.
  - `sdd_install_framework` already resolves omitted `version` to latest via the sync cache and `GET /api/sdd/package`. The model does not need a catalog call first.
  - MCP has no private tool. If a name is on `tools/list`, the model can call it. Keep version listing off that list.
  - Pack contents for people are the Features tab (three synced markdown files, [Web-portal-07](#pb-73)), not an agent tool.
  - Keep `listVersions()` and `GET /api/sdd/versions` as server-internal APIs. Do not register `sdd_list_versions` on stdio or HTTP. Do not mirror the payload as an MCP resource ([ADR-063](./adr/ADR-063-unregister-sdd-list-versions.md)).

[Back to top](#index)

---



## web-portal

- <a id="req-pb-15"></a>[Web-portal-01](#pb-15) Per-client call-up on the instructions page
  - The instructions page gains a section on how each agent tool calls up an agent.
  - Research comes before the section is written.
  - Cursor `/ethan` and TRAE CN `@` are known.
- <a id="req-pb-49"></a>[Web-portal-02](#pb-49) Install and update on the instructions page
  - The instructions page covers install and update, `{client_root}/.sdd-installed.json`, and the fatal stop when `pack_complete` is not true.
- <a id="req-pb-70"></a>[Web-portal-04](#pb-70) Setup markdown for stdio and HTTP
  - `public/agent-setup/prompt.md` tells the agent to download `~/.sdd/sdd-mcp`, write a `command` MCP entry with `SDD_SERVER_URL`, and use `"url": "https://framework.sdd.works/mcp"` when the binary cannot be installed or the client accepts only a URL.
  - The public path is `GET /setup` ([ADR-061](./adr/ADR-061-setup-prompt-public-path.md)).
  - The person does not edit the MCP file by hand.
  - Pack install is a later step.
- <a id="req-pb-71"></a>[Web-portal-05](#pb-71) Instructions page layout
  - The public instructions page matches the Setup / Features mock.
  - Setup copies `Fetch and execute the setup instructions from https://framework.sdd.works/setup`.
  - Manual setup is one stdio `command` `mcp.json`.
  - Features lists Agents, Skills, Rules, and Templates as fixed rows.
  - A secret name field and Get secret button are visible and do not return a value in this item.
  - There is no Back to home link.
  - Per-client call-up research stays on unscheduled [Web-portal-01](#pb-15).
- <a id="req-pb-72"></a>[Web-portal-06](#pb-72) One-line GET /setup copy
  - The instructions page copies one sentence: `Fetch and execute the setup instructions from https://framework.sdd.works/setup`.
  - That URL returns the stdio setup markdown.
  - `GET /agent-setup` redirects to `GET /setup`.
  - Manual setup shows one `mcp.json` with the `command` entry.
  - The page does not show a second `mcp.json` or `curl`.
  - Page labels are i18n keys. The copied sentence is the same protocol line in every locale.
- <a id="req-pb-73"></a>[Web-portal-07](#pb-73) Features tab from three markdown files
  - The Features tab on `/` and `/instructions` shows markdown from the synced pack.
  - Three files sit at `content/features/` in the pack repo: `features.en.md`, `features.zh-Hans.md`, and `features.zh-Hant.md` ([ADR-071](./adr/ADR-071-portal-content-paths.md)).
  - The same three files ship in the server package at `src/content/features/`.
  - The page reads the latest local unpack at `.data/sdd-packages/<commit>/unpacked/content/features/` first. It does not call GitHub.
  - The active locale picks the file. A missing zh-Hans or zh-Hant file in that source shows that source’s English file.
  - If the sync cache cannot be read, the page reads `src/content/features/` instead.
  - Setup and Get secret stay usable.
  - Manual sync and the 30-minute sync publish edits without an app deploy. A failed sync keeps the previous cache.
  - There is no admin editor and no unavailable message.
  - Install does not copy these files onto `{client_root}`.
  - The file body is free markdown. Tab labels stay i18n keys.
- <a id="req-pb-74"></a>[Web-portal-08](#pb-74) Secret lookup by name
  - A text field and a button look up one secret from the admin key store.
  - The field hint is “Enter the name of the secret, example: sdd-trial-googlemaps” (简体: “输入要获得的密钥名称，例如：sdd-trial-googlemaps”; 繁體: “輸入要取得的密鑰名稱，例如：sdd-trial-googlemaps”).
  - The button is “Get secret” (简体: “获取密钥”; 繁體: “獲取密鑰”).
  - The page shows that secret’s value.
  - Placement on Features is superseded by [Web-portal-13](#pb-83).
  - The setup prompt and `mcp.json` stay without a token.
  - `sdd_get_key` stays off the stdio tool list.
- <a id="req-pb-76"></a>[Web-portal-09](#pb-76) Public landing, footer, and password gate
  - `/` serves the instructions guide (logo-card home goes away).
  - Site footer is fixed to the viewport on auth and admin shells.
  - After reset mail is sent, the link is Back to login → `/login`.
  - An admin with a non-empty `passwordHash` is not shown the empty-account set-password lead and can sign in.
  - An admin with an empty hash still sees the lead and can set a password.
  - E2E setup does not overwrite an existing seed password hash.
- <a id="req-pb-77"></a>[Web-portal-10](#pb-77) On-page reset submit and Features tab switch
  - Reset request stays on `/reset-password` (no full document reload).
  - Success shows `admin.reset.sent` and Back to login.
  - Failed send or request shows a keyed error and keeps the form.
  - Features tab on `/` and `/instructions` switches to the features panel and is the hit target at its center.
- <a id="req-pb-79"></a>[Web-portal-11](#pb-79) Reset success without email in the URL
  - After a successful reset request, the success callout uses the previous `admin.reset.sent` sentence (en: “If that email is an admin account, a reset mail is on its way. Check inbox and junk.”; zh-Hans and zh-Hant matching).
  - It does not interpolate `{email}`.
  - The request lead is hidden.
  - The document stays on `/reset-password` with no `?email=` navigation.
  - The submit control cannot issue a document GET.
- <a id="req-pb-81"></a>[Web-portal-12](#pb-81) Scrum in SDD tab
  - On `/` and `/instructions`, a third tab sits after Features. Order: Setup, Features, Scrum in SDD.
  - The label is i18n key `admin.guide.tab_scrum` with the same string `Scrum in SDD` in `en`, `zh-Hans`, and `zh-Hant`.
  - Query `?tab=scrum-in-sdd` opens that panel on a full load.
  - The panel reads `scrum-in-sdd.{locale}.md` from `<unpacked>/content/scrum-in-sdd/` first, then `src/content/scrum-in-sdd/` ([ADR-071](./adr/ADR-071-portal-content-paths.md)).
  - A missing Chinese file in the chosen source uses that source’s English file.
  - A failed sync that keeps the previous unpack stays `source: cache`.
  - Public `GET /api/sdd/scrum-in-sdd?locale=` returns `{ locale, sourceLocale, source, html }` and no key values.
  - HTML rules use `.scrum-body`: an `h1` is larger than an `h2` and has space above it except when it is the first block. List items keep inline markdown. There is no Features em-dash name/description split.
  - Install does not copy the three portal files onto `{client_root}`. Template seeds under `templates/{locale}/scrum-in-sdd.md` stay the project seeds.
  - Setup, Features, and Get secret on Setup stay as they are. The guide panel has no secret form.
- <a id="req-pb-83"></a>[Web-portal-13](#pb-83) Get secret on Setup
  - The secret form leaves the bottom of Features and sits at the bottom of Setup, after the tools table.
  - Features does not show the form.
  - Lookup, copy, not-found, and empty-name behavior stay as [Web-portal-08](#pb-74).
- <a id="req-pb-88"></a>[Web-portal-14](#pb-88) README for IDE invoke differences
  - The repo `README.md` explains how each IDE starts an agent.
  - Cursor `/ethan` starts the chat, and later jobs in that chat are plain text.
  - TRAE and TRAE CN use `@` (TRAE CN also @智能体). `/ethan` does not start Ethan there.
  - Claude Code, CodeBuddy CN, and Cline are listed as not verified, with the agent file path and the reason.
  - Codex and Copilot stay out until a root is recorded.
  - The page points at `[framework-design.md](./framework/framework-design.md)` and `[ide-agent-invoke.md](./knowledge/agent/ide-agent-invoke.md)`.
  - It does not claim a gesture that has not been checked.
  - The instructions page stays [Web-portal-01](#pb-15).
- <a id="req-pb-91"></a>[Web-portal-15](#pb-91) Unified public site
  - sdd.works and framework.sdd.works share one public site strategy. One hostname is canonical for marketing and instructions entry. The other redirects or serves the same app without a second copy of setup flows.
  - The redesigned first page leads with the framework install prompt and links to setup and instructions.
  - Setup, Features, and Scrum in SDD on the instructions surface stay usable after the redesign.
  - Admin login, reset, and operator routes stay separate from the public site unless a later Implementable PBI changes them.
- <a id="req-pb-82"></a>[Spec-seeds-14](#pb-82) Seed features.md under content/features
  - Review and finalize the three Features catalog seeds under `content/features/` in the pack repo: `features.en.md`, `features.zh-Hans.md`, and `features.zh-Hant.md`.

[Back to top](#index)

---



## Definition of Done

Every Product Backlog item uses this checklist. Mark the row `Done` only when every check passes.

- Follow rule DoD
- Feature confirmed usable by user
- Acceptance criteria (story mapping spec names with links) passed
- Quality meets [agent test](./framework/framework-tests.md) · [MCP test](./mcp/mcp-tests.md) · [portal test](./admin-portal/app-tests.md)

[Back to top](#index)

---



# Product Backlog


| # | Component | PBI Code | Description | Size | Related | Sprint | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | framework | <a id="pb-6"></a>[Agent-01](#req-pb-6) | Local Cursor agent | Implementable | - [`framework/framework-design.md`](./framework/framework-design.md)<br>- [D1](./sprint-backlog.md#rid-d1)<br>- [MCP-01](#pb-16) | Sprint 1 | Done |
| 2 | framework | <a id="pb-8"></a>[Agent-02](#req-pb-8) | Skill call for a named job | Epic | - `[framework/framework-design.md](./framework/framework-design.md)`<br>- [Skill-03](#pb-24)<br>- [Skill-04](#pb-25)<br>- [Skill-05](#pb-26)<br>- [Skill-12](#pb-86)<br>- [Skill-06](#pb-28)<br>- [Skill-07](#pb-29) | — | ToDo |
| 3 | framework | <a id="pb-10"></a>[Agent-03](#req-pb-10) | Guiding proposals from framework knowledge | Implementable | - `[scrum-in-sdd.md](./framework/seeds/templates/EN/scrum-in-sdd.md)`<br>- `[sdd-scrum-practices.md](./framework/seeds/templates/EN/sdd-scrum-practices.md)`<br>- `[artifacts-map.json](../artifacts-map.json)` | Sprint 8 | ToDo |
| 4 | framework | <a id="pb-17"></a>[Agent-04](#req-pb-17) | Agent ethan onboard with pack receipt start gate | Implementable | - `[framework/framework-design.md](./framework/framework-design.md)` §2.4 - `[framework/framework-stories.md](./framework/framework-stories.md)`<br>- [MCP-01](#pb-16) | Sprint 2 | Done |
| 5 | framework | <a id="pb-21"></a>[Skill-01](#req-pb-21) | Pack skill sdd-atdd | Implementable | — | Sprint 7 | ToDo |
| 6 | framework | <a id="pb-24"></a>[Skill-03](#req-pb-24) | Pack skill sdd-update-project | Implementable | - [Agent-02](#pb-8)<br>- [ADR-079](./adr/ADR-079-one-job-update-project.md) | Sprint 5 | Done |
| 7 | framework | <a id="pb-25"></a>[Skill-04](#req-pb-25) | Pack skill sdd-refine-backlog | Implementable | [Agent-02](#pb-8) | Sprint 5 | Done |
| 8 | framework | <a id="pb-26"></a>[Skill-05](#req-pb-26) | Pack skill sdd-plan-sprint | Implementable | - [Agent-02](#pb-8)<br>- [sdd-plan-sprint](./framework/seeds/skills/sdd-plan-sprint/SKILL.md) | Sprint 5 | Done |
| 9 | framework | <a id="pb-28"></a>[Skill-06](#req-pb-28) | Pack skill sdd-retrospective | Implementable | [Agent-02](#pb-8) | Sprint 6 | ToDo |
| 10 | framework | <a id="pb-29"></a>[Skill-07](#req-pb-29) | Pack skill sdd-close-sprint | Implementable | [Agent-02](#pb-8) | Sprint 6 | ToDo |
| 11 | framework | <a id="pb-30"></a>[Skill-08](#req-pb-30) | Pack skill sdd-audit-artifacts | Implementable | - [`framework-design.md`](./framework/framework-design.md#sdd-audit-artifacts)<br>- [`framework-stories.md`](./framework/framework-stories.md#sdd-audit-artifacts)<br>- [ADR-073](./adr/ADR-073-skill-get-status.md) | Sprint 4 | Done |
| 12 | framework | <a id="pb-64"></a>[Skill-09](#req-pb-64) | Pack skill sdd-update-specs | Implementable | [Skill-11](#pb-80) | Sprint 7 | ToDo |
| 13 | framework | <a id="pb-80"></a>[Skill-11](#req-pb-80) | Pack skill sdd-spec-to-build | Implementable | - [Skill-09](#pb-64)<br>- [Skill-01](#pb-21)<br>- [ADR-085](./adr/ADR-085-sdd-spec-to-build.md) | Sprint 7 | ToDo |
| 14 | framework | <a id="pb-86"></a>[Skill-12](#req-pb-86) | Pack skill sdd-review-status | Implementable | - [ADR-076](./adr/ADR-076-review-status-one-skill.md)<br>- [ADR-073](./adr/ADR-073-skill-get-status.md)<br>- [Skill-08](#pb-30) | Sprint 4 | Done |
| 15 | framework | <a id="pb-87"></a>[Skill-13](#req-pb-87) | Pack skill sdd-create-skill | Implementable | - [ADR-074](./adr/ADR-074-sdd-create-skill.md)<br>- [ADR-092](./adr/ADR-092-pack-authoring-skill-sdd-prefix.md)<br>- [sdd-create-skill](./framework/seeds/skills/sdd-create-skill/SKILL.md) | Sprint 5 | Done |
| 16 | framework | <a id="pb-89"></a>[Skill-14](#req-pb-89) | Pack skill prompt-optimizer | Implementable | [prompt-optimizer](./framework/seeds/skills/prompt-optimizer/SKILL.md) | Sprint 7 | ToDo |
| 17 | framework | <a id="pb-93"></a>[Skill-15](#req-pb-93) | Pack skill sdd-build-agent | Implementable | - [ADR-092](./adr/ADR-092-pack-authoring-skill-sdd-prefix.md)<br>- [framework-design § sdd-build-agent](./framework/framework-design.md#sdd-build-agent)<br>- [sdd-build-agent](./framework/seeds/skills/sdd-build-agent/SKILL.md) | Sprint 5 | Done |
| 18 | framework | <a id="pb-94"></a>[Skill-16](#req-pb-94) | Pack skill sdd-create-rule | Implementable | - [ADR-092](./adr/ADR-092-pack-authoring-skill-sdd-prefix.md)<br>- [sdd-create-rule](./framework/seeds/skills/sdd-create-rule/SKILL.md)<br>- [framework-design § sdd-create-rule](./framework/framework-design.md#sdd-create-rule) | Sprint 5 | Done |
| 19 | framework | <a id="pb-18"></a>[Rule-01](#req-pb-18) | Pack rule dod.mdc | Implementable | [Spec-seeds-03](#pb-32) | Sprint 6 | Done |
| 20 | framework | <a id="pb-19"></a>[Rule-02](#req-pb-19) | Pack rule incremental-delivery.mdc | Implementable | [Spec-seeds-03](#pb-32) | Sprint 6 | Done |
| 21 | framework | <a id="pb-20"></a>[Rule-03](#req-pb-20) | Pack rule realtime-status.mdc | Implementable | [ADR-091](./adr/ADR-091-retire-realtime-status-rule.md) | Sprint 6 | Retired |
| 22 | framework | <a id="pb-95"></a>[Rule-04](#req-pb-95) | Pack rule friendly-language.mdc | Implementable | - [Spec-seeds-03](#pb-32)<br>- [framework-design § friendly-language.mdc](./framework/framework-design.md#friendly-languagemdc) | — | Done |
| 23 | framework | <a id="pb-33"></a>[Spec-seeds-01](#req-pb-33) | Seed scrum-in-sdd.md | Implementable | - [MCP-01](#pb-16)<br>- [i18n-01](#pb-67) | Sprint 1 | Done |
| 24 | framework | <a id="pb-34"></a>[Spec-seeds-02](#req-pb-34) | Seed sdd-scrum-practices.md | Implementable | - [MCP-01](#pb-16)<br>- [i18n-01](#pb-67) | Sprint 1 | Done |
| 25 | framework | <a id="pb-32"></a>[Spec-seeds-03](#req-pb-32) | Seed constants.json | Implementable | - [MCP-01](#pb-16)<br>- [ADR-081](./adr/ADR-081-constants-json.md)<br>- [ADR-060](./adr/ADR-060-constants-on-client-root.md) | Sprint 2 | Done |
| 26 | framework | <a id="pb-35"></a>[Spec-seeds-04](#req-pb-35) | Project file artifacts-map.json | Implementable | - [ADR-080](./adr/ADR-080-no-artifacts-map-seed.md)<br>- [ADR-082](./adr/ADR-082-artifacts-map-json.md) | Sprint 4 | Done |
| 27 | framework | <a id="pb-36"></a>[Spec-seeds-05](#req-pb-36) | Seed product-backlog.md | Implementable | - [MCP-01](#pb-16)<br>- [i18n-02](#pb-68) | Sprint 6 | ToDo |
| 28 | framework | <a id="pb-37"></a>[Spec-seeds-06](#req-pb-37) | Seed sprint-backlog.md | Implementable | - [MCP-01](#pb-16)<br>- [i18n-02](#pb-68) | Sprint 4 | Done |
| 29 | framework | <a id="pb-38"></a>[Spec-seeds-07](#req-pb-38) | Seed status.md | Implementable | - [MCP-01](#pb-16)<br>- [i18n-02](#pb-68) | Sprint 4 | Done |
| 30 | framework | <a id="pb-39"></a>[Spec-seeds-08](#req-pb-39) | Seed changes-log.md | Implementable | - [MCP-01](#pb-16)<br>- [i18n-02](#pb-68)<br>- [ADR-070](./adr/ADR-070-change-log-and-issues-log.md) | Sprint 4 | Done |
| 31 | framework | <a id="pb-84"></a>[Spec-seeds-09](#req-pb-84) | Seed issues-log.md | Implementable | - [ADR-070](./adr/ADR-070-change-log-and-issues-log.md)<br>- [ADR-075](./adr/ADR-075-issues-log-tables.md)<br>- [Spec-seeds-08](#pb-39) | Sprint 4 | Done |
| 32 | framework | <a id="pb-40"></a>[Spec-seeds-10](#req-pb-40) | Seed architecture.md | Implementable | - [MCP-01](#pb-16)<br>- [i18n-03](#pb-69) | Sprint 7 | ToDo |
| 33 | framework | <a id="pb-41"></a>[Spec-seeds-11](#req-pb-41) | Seed deployment.md | Implementable | - [MCP-01](#pb-16)<br>- [i18n-03](#pb-69) | Sprint 7 | ToDo |
| 34 | framework | <a id="pb-66"></a>[Spec-seeds-12](#req-pb-66) | Seed .secrets | Implementable | - [MCP-01](#pb-16)<br>- [Spec-seeds-11](#pb-41)<br>- [i18n-03](#pb-69) | Sprint 7 | ToDo |
| 35 | framework | <a id="pb-90"></a>[Spec-seeds-13](#req-pb-90) | Seed test-strategy.md | Implementable | - [Spec-seeds-02](#pb-34)<br>- [i18n-03](#pb-69) | Sprint 7 | ToDo |
| 36 | framework | <a id="pb-67"></a>[i18n-01](#req-pb-67) | HanS and HanT core artifacts | Theme | - `[scrum-in-sdd.md](./framework/seeds/templates/EN/scrum-in-sdd.md)`<br>- `[sdd-scrum-practices.md](./framework/seeds/templates/EN/sdd-scrum-practices.md)` | — | ToDo |
| 37 | framework | <a id="pb-68"></a>[i18n-02](#req-pb-68) | HanS and HanT process artifacts | Theme | - [Spec-seeds-05](#pb-36)<br>- [Spec-seeds-06](#pb-37)<br>- [Spec-seeds-07](#pb-38)<br>- [Spec-seeds-08](#pb-39) | — | ToDo |
| 38 | framework | <a id="pb-69"></a>[i18n-03](#req-pb-69) | HanS and HanT engineering artifacts | Implementable | - [Spec-seeds-10](#pb-40)<br>- [Spec-seeds-11](#pb-41)<br>- [Spec-seeds-12](#pb-66)<br>- [Spec-seeds-13](#pb-90) | — | ToDo |
| 39 | mcp | <a id="pb-16"></a>[MCP-01](#req-pb-16) | Installer allow-list and file ledger | Implementable | - `[mcp/mcp-design.md](./mcp/mcp-design.md)`<br>- [ADR-057](./adr/ADR-057-install-ledger-pack-complete.md)<br>- [ADR-059](./adr/ADR-059-ledger-lists-pack-files.md)<br>- [MCP-04](#pb-92) | Sprint 2 | Done |
| 40 | mcp | <a id="pb-92"></a>[MCP-04](#req-pb-92) | Pack go-live on the client root | Theme | - [MCP-01](#pb-16)<br>- [MCP-02](#pb-75)<br>- [ADR-058](./adr/ADR-058-stdio-end-user-http-fallback.md) | — | ToDo |
| 41 | mcp | <a id="pb-75"></a>[MCP-02](#req-pb-75) | Local binary ~/.sdd/sdd-mcp | Implementable | - [ADR-051](./adr/ADR-051-zero-dep-stdio-binary.md)<br>- [ADR-053](./adr/ADR-053-server-side-sync-thin-stdio.md)<br>- [ADR-058](./adr/ADR-058-stdio-end-user-http-fallback.md) - `[mcp/mcp-design.md](./mcp/mcp-design.md)` §2.1 and §4.1<br>- [MCP-01](#pb-16) | Sprint 2 | Done |
| 42 | mcp | <a id="pb-78"></a>[MCP-03](#req-pb-78) | MCP tools without sdd_list_versions | Implementable | - [ADR-063](./adr/ADR-063-unregister-sdd-list-versions.md) - `[mcp/mcp-design.md](./mcp/mcp-design.md)` §3 - `[mcp/mcp-stories.md](./mcp/mcp-stories.md)` `sdd-mcp-tool-surface`<br>- [MCP-02](#pb-75)<br>- [Web-portal-07](#pb-73) | Sprint 3 | Done |
| 43 | webapp | <a id="pb-15"></a>[Web-portal-01](#req-pb-15) | Per-client call-up on the instructions page | Implementable | - `[framework/framework-design.md](./framework/framework-design.md)`<br>- `[mcp/client.paths.md](./mcp/client.paths.md)` | — | ToDo |
| 44 | webapp | <a id="pb-49"></a>[Web-portal-02](#req-pb-49) | Install and update on the instructions page | Implementable | - [Web-portal-01](#pb-15)<br>- [MCP-01](#pb-16)<br>- [MCP-04](#pb-92)<br>- [Agent-04](#pb-17) | — | ToDo |
| 45 | webapp | <a id="pb-70"></a>[Web-portal-04](#req-pb-70) | Setup markdown for stdio and HTTP | Implementable | - [MCP-02](#pb-75)<br>- [ADR-058](./adr/ADR-058-stdio-end-user-http-fallback.md)<br>- [ADR-061](./adr/ADR-061-setup-prompt-public-path.md) - `[mcp/mcp-stories.md](./mcp/mcp-stories.md)` `sdd-mcp-prompt-setup` | Sprint 2 | Done |
| 46 | webapp | <a id="pb-71"></a>[Web-portal-05](#req-pb-71) | Instructions page layout | Implementable | - `[admin-portal/ui-mockup/01-home.html](./admin-portal/ui-mockup/01-home.html)`<br>- [ADR-061](./adr/ADR-061-setup-prompt-public-path.md)<br>- [Web-portal-06](#pb-72) | Sprint 2 | Done |
| 47 | webapp | <a id="pb-72"></a>[Web-portal-06](#req-pb-72) | One-line GET /setup copy | Implementable | - [Web-portal-04](#pb-70) - `[mcp/mcp-design.md](./mcp/mcp-design.md)` §2.1<br>- [ADR-061](./adr/ADR-061-setup-prompt-public-path.md) | Sprint 2 | Done |
| 48 | webapp | <a id="pb-73"></a>[Web-portal-07](#req-pb-73) | Features tab from three markdown files | Implementable | - [MCP-03](#pb-78)<br>- [ADR-071](./adr/ADR-071-portal-content-paths.md) - `[admin-portal/app-design.md](./admin-portal/app-design.md)` Features catalog | Sprint 3 | Done |
| 49 | webapp | <a id="pb-74"></a>[Web-portal-08](#req-pb-74) | Secret lookup by name | Implementable | - `[mcp/mcp-stories.md](./mcp/mcp-stories.md)` `sdd-mcp-get-key` - `[admin-portal/app-stories.md](./admin-portal/app-stories.md)` AC7 - `[admin-portal/ui-mockup/13-instructions.html](./admin-portal/ui-mockup/13-instructions.html)` - `[issues-log.md](./issues-log.md)` WA-09 - WA-11<br>- [ADR-067](./adr/ADR-067-get-secret-on-setup.md) | Sprint 3 | Done |
| 50 | webapp | <a id="pb-76"></a>[Web-portal-09](#req-pb-76) | Public landing, footer, and password gate | Implementable | - `[issues-log.md](./issues-log.md)` WA-01–WA-04<br>- `[admin-portal/app-stories.md](./admin-portal/app-stories.md)`<br>- `[admin-portal/app-design.md](./admin-portal/app-design.md)` | Sprint 3 | Done |
| 51 | webapp | <a id="pb-77"></a>[Web-portal-10](#req-pb-77) | On-page reset submit and Features tab switch | Implementable | - `[issues-log.md](./issues-log.md)` WA-05–WA-06<br>- `[admin-portal/app-stories.md](./admin-portal/app-stories.md)`<br>- `[admin-portal/app-design.md](./admin-portal/app-design.md)` | Sprint 3 | Done |
| 52 | webapp | <a id="pb-79"></a>[Web-portal-11](#req-pb-79) | Reset success without email in the URL | Implementable | - `[issues-log.md](./issues-log.md)` WA-08 - WA-10<br>- `[admin-portal/app-stories.md](./admin-portal/app-stories.md)`<br>- `[admin-portal/app-design.md](./admin-portal/app-design.md)` | Sprint 3 | Done |
| 53 | webapp | <a id="pb-81"></a>[Web-portal-12](#req-pb-81) | Scrum in SDD tab | Implementable | - [Spec-seeds-01](#pb-33) - `[admin-portal/app-design.md](./admin-portal/app-design.md)` `/instructions`<br>- [ADR-068](./adr/ADR-068-scrum-in-sdd-filename.md) - `[scrum-in-sdd.en.md](../src/content/scrum-in-sdd/scrum-in-sdd.en.md)` | Sprint 3 | Done |
| 54 | webapp | <a id="pb-83"></a>[Web-portal-13](#req-pb-83) | Get secret on Setup | Implementable | - [ADR-067](./adr/ADR-067-get-secret-on-setup.md)<br>- [Web-portal-08](#pb-74) - `[admin-portal/ui-mockup/13-instructions.html](./admin-portal/ui-mockup/13-instructions.html)` | Sprint 3 | Done |
| 55 | webapp | <a id="pb-88"></a>[Web-portal-14](#req-pb-88) | README for IDE invoke differences | Implementable | - [Web-portal-01](#pb-15)<br>- `[framework-design.md](./framework/framework-design.md)`<br>- `[ide-agent-invoke.md](./knowledge/agent/ide-agent-invoke.md)` | — | ToDo |
| 56 | webapp | <a id="pb-91"></a>[Web-portal-15](#req-pb-91) | Unified public site | Epic | - [Web-portal-07](#pb-73)<br>- [Web-portal-09](#pb-76)<br>- [MCP-04](#pb-92) | — | ToDo |
| 57 | webapp | <a id="pb-82"></a>[Spec-seeds-14](#req-pb-82) | Seed features.md under content/features | Implementable | - [Web-portal-07](#pb-73)<br>- [MCP-04](#pb-92) | — | ToDo |


[Back to top](#index)

---



## Change record


| Date       | Change                                                                                                                                                                                                                                                                                                                                                                                                          |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-09-21 | Replaced the sample-product draft with Phase 2 items SPEC-01, ARTIFACTS-01, COACH-01, and TEMPLATES-01.                                                                                                                                                                                                                                                                                                         |
| 2026-09-21 | Split Phase 2: practices SSOT, four templates, six process skills, coach-ethan (presence TBD), Instructions page.                                                                                                                                                                                                                                                                                               |
| 2026-09-22 | Priority: `sdd-scrum-guide.md` as framework SSOT; coach-ethan as three MVPs (Sprint 2–4); other themes cleared from Sprint.                                                                                                                                                                                                                                                                                     |
| 2026-09-22 | coach-ethan presence: local Cursor agent ([D1](./sprint-backlog.md#rid-d1) Closed). Design at `[framework/framework-design.md](./framework/framework-design.md)`.                                                                                                                                                                                                                                               |
| 2026-09-23 | Dropped HTML table width hacks for pipe Markdown. Sprint backlog aligned to Phase 2 scope map.                                                                                                                                                                                                                                                                                                                  |
| 2026-09-23 | Product Backlog rows match Requirements (specs, ethan, harness) in the pipe table (`#`, Category, Parent, PBI, Description, Acceptance criteria, Related, Sprint, Status).                                                                                                                                                                                                                                      |
| 2026-09-23 | Removed HTML id anchors. Added pb-14 Initialize framework.sdd.works v2 POC (Sprint 1).                                                                                                                                                                                                                                                                                                                          |
| 2026-09-24 | Added pb-15 Instructions: per-client agent call-up. Research before writing the section. Not scheduled.                                                                                                                                                                                                                                                                                                         |
| 2026-09-24 | Consolidated backlog to pb-50: installer full pack + receipt (pb-16), ethan receipt start gate (pb-17), per-rule / per-skill / per-seed / per-job PBIs, instructions install page (pb-49), website (pb-50). pb-12 and pb-13 stay parent bundles. Not scheduled.                                                                                                                                                 |
| 2026-09-24 | Requirements rewritten in pb order. Live spec files split into pb-51–pb-62. Pack agent file is pb-63. Row anchors restored so `#pb-N` links resolve.                                                                                                                                                                                                                                                            |
| 2026-09-24 | Added skills pb-64 `update-specs` and pb-65 `implement-feature` (spec update, then TDD). Not scheduled.                                                                                                                                                                                                                                                                                                         |
| 2026-09-24 | Requirements give `constants.md` its own heading. It is not a locale seed.                                                                                                                                                                                                                                                                                                                                      |
| 2026-09-24 | Category is one word. Added PBI Code. Removed parent bundles pb-2, pb-3, pb-4, pb-5, pb-12, and pb-13. Those numbers stay unused.                                                                                                                                                                                                                                                                               |
| 2026-09-24 | Removed the `#` column and the Journey section (pb-14). Skill folders use the `sdd-` prefix, including `sdd-atdd`, `sdd-tdd`, `sdd-update-spec`, and `sdd-implement-feature`.                                                                                                                                                                                                                                   |
| 2026-09-24 | Removed `sdd-update-artifacts` (pb-31). Kept `sdd-update-specs` (Skill-12). pb-31 stays unused.                                                                                                                                                                                                                                                                                                                 |
| 2026-09-24 | Removed Spec-02–Spec-13 (pb-51–pb-62). `specs/` in this repo is process, not the pack. Guide acceptance is Spec-seeds-02. Table rows are grouped by category.                                                                                                                                                                                                                                                   |
| 2026-09-24 | Scope item 4 points at practices §3.1 for same-category rows. Sprint shape is `[framework-design.md](./framework/framework-design.md)`.                                                                                                                                                                                                                                                                         |
| 2026-09-24 | The product backlog column stays `Category`. Sprint items use `Type`. Same-category order is in practices §3.1.                                                                                                                                                                                                                                                                                                 |
| 2026-09-24 | Sprint shape file renamed to `[framework-design.md](./framework/framework-design.md)`. `Feature` is a delivered capability. `Task` is supporting work.                                                                                                                                                                                                                                                          |
| 2026-09-24 | Added [Spec-seeds-11](#pb-66) `.secrets` (guide name). Scheduled [Spec-seeds-08](#pb-39) on Sprint 5 and [Spec-seeds-09](#pb-40), [Spec-seeds-10](#pb-41), and Spec-seeds-11 on Sprint 14.                                                                                                                                                                                                                      |
| 2026-09-25 | Added category i18n: [i18n-01](#pb-67) framework definition, [i18n-02](#pb-68) five process artifacts, [i18n-03](#pb-69) engineering artifacts. Sprint 15. Spec-seeds rows stay the file-existence owners.                                                                                                                                                                                                      |
| 2026-09-25 | HanS and HanT bodies moved off Spec-seeds acceptance. Spec-seeds own the EN starter. Sprint 1 HanS guide, HanT guide, and HanS/HanT practices are Sprint 15.                                                                                                                                                                                                                                                    |
| 2026-09-25 | Spec-seeds acceptance is the same four checks for every row: user review, stored in `specs/framework/seeds/`, associated specs updated, seed tree cross-reviewed.                                                                                                                                                                                                                                               |
| 2026-09-25 | Sprint 1 closed. Spec-seeds-02 and Spec-seeds-03 Done. Phase 1 archive path is `phase1-process-specs/`.                                                                                                                                                                                                                                                                                                         |
| 2026-09-25 | Agent-15 is the seed file `agents/ethan.md`. Pack copy and admin sync are go-live, not Spec-seeds acceptance.                                                                                                                                                                                                                                                                                                   |
| 2026-09-25 | Agent-07 Done: seed prompt gates on `.sdd-installed.json` `pack_complete`. Stories and design §14 hold the prompt.                                                                                                                                                                                                                                                                                              |
| 2026-09-25 | ADR-058: end-user stdio primary, HTTP fallback. MCP-01 and Agent-07 use `.sdd-installed.json`. Added [Web-portal-04](#pb-70) agent-setup prompt for Sprint 2.                                                                                                                                                                                                                                                   |
| 2026-09-25 | Scope: install allow-list + file-level ledger; [Web-portal-04](#pb-70) paste prompt downloads `~/.sdd/sdd-mcp` and writes `command`, HTTP URL as fallback.                                                                                                                                                                                                                                                      |
| 2026-09-25 | Added [Web-portal-05](#pb-71) on Sprint 2: instructions page re-design (Setup / Features mock).                                                                                                                                                                                                                                                                                                                 |
| 2026-09-25 | Phase 2 scope names stdio primary and HTTP fallback, linked to `[mcp-design.md](./mcp/mcp-design.md)`. Added [Web-portal-06](#pb-72): instructions-page auto-connect prompt.                                                                                                                                                                                                                                    |
| 2026-09-25 | Renamed Spec-seeds-01 to `constants.md`. Lives on the client root only ([ADR-060](./adr/ADR-060-constants-on-client-root.md)). Not copied into workspace `specs/`.                                                                                                                                                                                                                                              |
| 2026-09-25 | Added [Web-portal-07](#pb-73) on Sprint 2: the Features tab reads pack `features.md` from the sync cache.                                                                                                                                                                                                                                                                                                       |
| 2026-09-25 | [ADR-061](./adr/ADR-061-setup-prompt-public-path.md): paste URL is `https://framework.sdd.works/setup`. Manual setup is one `command` `mcp.json`.                                                                                                                                                                                                                                                               |
| 2026-09-25 | Sprint 2 `backend-01`: one-line prompt connects agent tools to MCP. Moved [Web-portal-07](#pb-73) to Sprint 3.                                                                                                                                                                                                                                                                                                  |
| 2026-09-25 | Added [Web-portal-08](#pb-74) on Sprint 3: the Features tab looks up one secret by name.                                                                                                                                                                                                                                                                                                                        |
| 2026-09-26 | Added [Web-portal-09](#pb-76): `/` is instructions, fixed footer, reset → login, password gate. Issues WA-01–WA-04.                                                                                                                                                                                                                                                                                             |
| 2026-09-26 | [Web-portal-09](#pb-76) Done. WA-01–WA-04 closed after Playwright retest.                                                                                                                                                                                                                                                                                                                                       |
| 2026-09-26 | Added [Web-portal-10](#pb-77): reset stays on-page; Features tab switches. Issues WA-05–WA-06.                                                                                                                                                                                                                                                                                                                  |
| 2026-09-26 | [Web-portal-10](#pb-77) Done. WA-05–WA-06 closed after browser and Playwright retest.                                                                                                                                                                                                                                                                                                                           |
| 2026-09-26 | [Web-portal-08](#pb-74) description names 繁體 hint and button. Sprint 3 feature-04 design: stories AC7, app-design secret form, app-test cases.                                                                                                                                                                                                                                                                  |
| 2026-09-25 | Added [MCP-02](#pb-75): build and publish `~/.sdd/sdd-mcp` (ADR-051). Sprint 2 feature-14.                                                                                                                                                                                                                                                                                                                      |
| 2026-09-25 | [MCP-02](#pb-75) requirements: zero client runtimes, macOS/Windows/Linux, every §4.1 client, stdio writes from `[mcp-design.md](./mcp/mcp-design.md)`, and no agent-side download of an executable.                                                                                                                                                                                                             |
| 2026-09-25 | Spec-seeds-01 Done: user confirmed `constants.md` seed.                                                                                                                                                                                                                                                                                                                                                         |
| 2026-09-26 | Added [MCP-03](#pb-78): unregister `sdd_list_versions` from MCP ([ADR-063](./adr/ADR-063-unregister-sdd-list-versions.md)). Sprint 3. Person installs latest; no private MCP tool; Features tab owns the catalog; `GET /api/sdd/versions` stays.                                                                                                                                                                |
| 2026-09-26 | Added [Web-portal-11](#pb-79) (WA-08): reset success names `{email}` and no `?email=` reload. Extended [Web-portal-08](#pb-74) (WA-09): Get secret stays on Features; code block or not-found.                                                                                                                                                                                                                  |
| 2026-09-26 | [Web-portal-11](#pb-79) amended (WA-10): restore previous `admin.reset.sent` without `{email}`. [Web-portal-08](#pb-74) (WA-11): Get secret result scrolls into view; found value is code block with copy, lookup-row width.                                                                                                                                                                                    |
| 2026-09-26 | Sprint 2 closed. [Agent-01](#pb-6) Done with its Sprint 1 spike. [MCP-01](#pb-16) stays ToDo for go-live.                                                                                                                                                                                                                                                                                                       |
| 2026-09-26 | Moved [MCP-01](#pb-16) from Sprint 2 to Sprint 15. Sprint 2 installer stories stay Done. The open slice is pack copy, GitHub Releases for the five `sdd-mcp` binaries, and admin-portal sync.                                                                                                                                                                                                                   |
| 2026-09-26 | [Web-portal-07](#pb-73) uses three markdown files. The page prefers the sync cache. If that cache cannot be read, it reads `src/content/features/`. There is no unavailable message. Sprint 3 feature-05 absorbs the old feature-06.                                                                                                                                                                            |
| 2026-09-26 | Added [Web-portal-12](#pb-81) on Sprint 3: instructions page gains an sdd-scrum guide tab. Added [Spec-seeds-12](#pb-82) on Sprint 15: review and finalize the three `features.*.md` files at the pack root.                                                                                                                                                                                                    |
| 2026-09-26 | Added [Web-portal-13](#pb-83) on Sprint 3: Get secret moves from Features to the bottom of Setup ([ADR-067](./adr/ADR-067-get-secret-on-setup.md)).                                                                                                                                                                                                                                                             |
| 2026-09-26 | [Web-portal-13](#pb-83) Done: Get secret on Setup confirmed usable.                                                                                                                                                                                                                                                                                                                                             |
| 2026-09-27 | [Web-portal-12](#pb-81) Done. Ethan confirmed the Scrum in SDD tab layout.                                                                                                                                                                                                                                                                                                                                      |
| 2026-09-27 | [ADR-070](./adr/ADR-070-change-log-and-issues-log.md): `change-log.md` is the conclusion record and `issues-log.md` is the defect record. [Spec-seeds-08](#pb-39) moves to Sprint 3. Added [Spec-seeds-13](#pb-84).                                                                                                                                                                                             |
| 2026-09-27 | [ADR-072](./adr/ADR-072-rule-artifacts-map.md): rule `artifacts-map.mdc`. Rule-04 is Sprint 3. The EN guide lists it.                                                                                                                                                                                                                                                                                           |
| 2026-09-27 | [ADR-071](./adr/ADR-071-portal-content-paths.md): portal markdown is read from `<unpacked>/content/features/` and `<unpacked>/content/scrum-in-sdd/`, not the pack root.                                                                                                                                                                                                                                        |
| 2026-09-29 | DoD cells use the default checks: DoD rule, user confirmation, linked acceptance criteria, and the test specs.                                                                                                                                                                                                                                                                                                  |
| 2026-09-29 | Added [Skill-16](#pb-87) `sdd-create-skill` ([ADR-074](./adr/ADR-074-sdd-create-skill.md)). Not scheduled. The pack does not ship `skill-creator` or `create-skill`.                                                                                                                                                                                                                                            |
| 2026-09-30 | Added [Web-portal-14](#pb-88): repo `README.md` explains IDE differences when invoking an agent. Not scheduled.                                                                                                                                                                                                                                                                                                 |
| 2026-09-29 | [Spec-seeds-07](#pb-38) records the `status.md` starter: project progress, current item, next items, open OGTs, and the latest 15 closed OGTs. `#` is the row's place in that table.                                                                                                                                                                                                                            |
| 2026-09-29 | Product Backlog requirements sit under each feature name. The table Description is a short summary. The DoD column is removed. One Definition of Done checklist sits above the table.                                                                                                                                                                                                                           |
| 2026-09-29 | Row anchors sit on the feature name. The Product Backlog table cells are plain Markdown.                                                                                                                                                                                                                                                                                                                        |
| 2026-09-29 | [Spec-seeds-07](#pb-38): the progress table has no Sprint Goal column. Consecutive Done sprints share one row. Consecutive ToDo sprints share one row. Where we are now adds one sentence after the sprint name. What is next follows the current sprint, the current SBI, and the item order. Affected SBIs shows the code and the SBI name. The file ends with Last updated, a timestamp, and the agent name. |
| 2026-09-29 | [Spec-seeds-07](#pb-38): each Affected SBIs item is its own bullet in the cell. The bullet is the code and the SBI name.                                                                                                                                                                                                                                                                                        |
| 2026-09-30 | [Spec-seeds-07](#pb-38) confirmed. Sprint 4 feature-27 is Done.                                                                                                                                                                                                                                                                                                                                                 |
| 2026-09-30 | [ADR-075](./adr/ADR-075-issues-log-tables.md): [Spec-seeds-13](#pb-84) uses an Open issues table and a Closed issues table. Status in the Open table is `Open`, `Fixed`, or `Deferred`.                                                                                                                                                                                                                         |
| 2026-09-30 | Feature lines are plain Markdown. HTML anchors are removed.                                                                                                                                                                                                                                                                                                                                                     |
| 2026-09-30 | Requirements use tight lists: each requirement sits on the line after its feature name, with no blank line. A loose list stopped Cursor preview.                                                                                                                                                                                                                                                                |
| 2026-09-30 | [Spec-seeds-08](#pb-39) and [Spec-seeds-13](#pb-84) confirmed. Sprint 4 feature-21 is Done.                                                                                                                                                                                                                                                                                                                     |
| 2026-10-01 | Moved [Spec-seeds-06](#pb-37) from Sprint 7 to Sprint 4. Sprint 4 feature-04 is the next ToDo, before feature-24.                                                                                                                                                                                                                                                                                               |
| 2026-10-01 | [Spec-seeds-07](#pb-38) reopened. Sprint 4 feature-27 is WIP: the `status.md` seed is under review with the seed artifacts building guide.                                                                                                                                                                                                                                                                      |
| 2026-10-01 | [Spec-seeds-06](#pb-37) confirmed. Sprint 4 feature-04 is Done.                                                                                                                                                                                                                                                                                                                                                 |
| 2026-10-01 | [Spec-seeds-08](#pb-39) and [Spec-seeds-13](#pb-84) reopened. Sprint 4 feature-21 is WIP: the `changes-log.md` and `issues-log.md` seeds are under review with the seed artifacts building guide.                                                                                                                                                                                                               |
| 2026-10-01 | Sprint 4 feature-20 moves to Sprint 5 as ToDo, with [Skill-03](#pb-23). Sprint 4 feature-13 and feature-15 move to Sprint 13 as ToDo: design before implement ([Skill-14](#pb-80), [Skill-13](#pb-65)). Sprint 4 feature-12 and feature-14 fold into feature-30 ([Skill-07](#pb-27)), still Sprint 4 ToDo. feature-29 is a task.                                                                                |
| 2026-10-01 | [Spec-seeds-07](#pb-38) confirmed. Sprint 4 feature-27 is Done. Section rules for `status.md` live as Template and How to write in `sdd-scrum-practices.md`.                                                                                                                                                                                                                                                    |
| 2026-10-01 | Sprint 4 feature-03 is renamed Seed: artifacts-map.md. It builds the EN authoring seed for [Spec-seeds-04](#pb-35).                                                                                                                                                                                                                                                                                             |
| 2026-10-01 | [Spec-seeds-04](#pb-35) reopened. Sprint 4 feature-03 is WIP: the `artifacts-map.md` seed is under review with the seed artifacts building guide.                                                                                                                                                                                                                                                               |
| 2026-10-02 | Added [Skill-17](#pb-89) `prompt-optimizer`. Sprint 5 feature-31 removes ECC from that skill.                                                                                                                                                                                                                                                                                                                   |
| 2026-10-03 | Added [Spec-seeds-14](#pb-90) `test-strategy.md` on Sprint 15, with the other engineering starters.                                                                                                                                                                                                                                                                                                             |
| 2026-10-03 | [ADR-080](./adr/ADR-080-no-artifacts-map-seed.md): no `artifacts-map.md` template seed. The Pokymon example stays in the practices artifacts-map section. [Spec-seeds-04](#pb-35) and Sprint 4 feature-03 are Retired.                                                                                                                                                                                          |
| 2026-10-03 | [ADR-081](./adr/ADR-081-constants-json.md): Spec-seeds-01 is `constants.json`. Living readers use that file.                                                                                                                                                                                                                                                                                                    |
| 2026-10-03 | [ADR-082](./adr/ADR-082-artifacts-map-json.md): the project path file is `artifacts-map.json`. Living readers and audit fixtures use that file.                                                                                                                                                                                                                                                                 |
| 2026-10-03 | [Skill-15](#pb-86) is WIP. Sprint 4 feature-30 and feature-24 are WIP.                                                                                                                                                                                                                                                                                                                                          |
| 2026-10-03 | Sprint 4 feature-21 and feature-24 are Done. [Spec-seeds-08](#pb-39) and [Spec-seeds-13](#pb-84) are Done. [Skill-15](#pb-86) stays WIP. feature-30 stays WIP. [Spec-seeds-04](#pb-35) is `artifacts-map.json`, WIP, with no template seed. feature-03 is Project path file artifacts-map.json, WIP.                                                                                                            |
| 2026-10-03 | Sprint 4 feature-30 is Retired. Practices job 6 is Retired. Report status is `sdd-review-status`. [Skill-15](#pb-86) is Done. Agent-12 stays ToDo on Sprint 8.                                                                                                                                                                                                                                                  |
| 2026-10-03 | The EN practices file no longer lists numbered jobs. The heading is Scrum in SDD practices. Workflow steps live in skills and agent PBIs.                                                                                                                                                                                                                                                                       |
| 2026-10-03 | [Spec-seeds-04](#pb-35) confirmed. Sprint 4 feature-03 is Done. The project path file is `artifacts-map.json`. There is no template seed. The example is in `sdd-scrum-practices.md`.                                                                                                                                                                                                                           |
| 2026-10-03 | Sprint 4 is Done. The user confirmed the sprint usable. Sprint 5 stays ToDo.                                                                                                                                                                                                                                                                                                                                    |
| 2026-10-03 | Agent-02 through Agent-06 name the capability or the limit. Agent-03 points at Agent-09 through Agent-14. Job steps stay in the skill.                                                                                                                                                                                                                                                                          |
| 2026-10-03 | Agent-09 through Agent-14 are Retired. Ethan calls the proper skill from [Agent-03](#pb-8). The skill rows stay. Sprint items that run a job now parent Agent-03.                                                                                                                                                                                                                                               |
| 2026-10-03 | Spec-01 and the Retired rows are removed from this file. Requirements sit under framework, mcp, and web-portal. Anchors for those deleted rows are not reused.                                                                                                                                                                                                                                                  |
| 2026-10-03 | Each Requirements item is the PBI code, one noun, and bullets. The table columns are `#`, Component, PBI Code, Description, Related, Sprint, Status. Web-portal rows use Component `webapp`.                                                                                                                                                                                                                    |
| 2026-10-04 | The header is three lines: Type, as_of, and Definition. Scope and Requirements leave column rules in `sdd-scrum-practices.md`. [Spec-seeds-07](#pb-38) and [Spec-seeds-13](#pb-84) link those sections. |
| 2026-10-04 | Agent-02 and Agent-04 are removed. Their bullets sit on [Agent-03](#pb-8). `#pb-7` and `#pb-9` stay unused. Sprint rows that named those items now name Agent-03.                                                                                                                                                                                                         |
| 2026-10-04 | [Skill-05](#pb-25) folder name is `sdd-refine-backlog`. Constants key stays `skill_refine_pb`. Living guides, catalogs, and Sprint 6 feature-01 use the new name. No `SKILL.md` yet.                                                                                                                                                                                    |
| 2026-10-04 | Agent-15 merges into Agent-01. Agent-05 and Agent-06 merge into Agent-03 Guiding proposals. Agent-07 becomes Agent-04 onboard with pack receipt. Skill and Spec-seeds codes are sequential. Web-portal-15 (`#pb-91`) is Integrated sites. Unused: `#pb-11`, `#pb-63`. |
| 2026-10-04 | [Skill-11](#pb-80) is `sdd-spec-to-build` ([ADR-085](./adr/ADR-085-sdd-spec-to-build.md)). [Skill-02](#pb-22) and [Skill-10](#pb-65) are Retired. Living catalogs drop `sdd-tdd`, `sdd-design`, and `sdd-implement`. |
| 2026-10-04 | Removed Sprint 5–16 from [`sprint-backlog.md`](./sprint-backlog.md). Those PBIs use `Sprint` `—` and appear in Unplanned PBIs after Sprint 4. |
| 2026-10-04 | [Terminology in practice](./framework/seeds/templates/EN/sdd-scrum-practices.md#terminology-in-practice) is a six-row table (PBI, SBI, Feature, Task, OGT, MVP). Artifact Definition links point at Artifacts writing guideline sections. |
| 2026-10-04 | `sdd-refine-backlog`: [MCP-01](./product-backlog.md#pb-16) is Done for the installer slice (Sprint 2). [MCP-04](./product-backlog.md#pb-92) is go-live. Added [Skill-15](./product-backlog.md#pb-93) and [Skill-16](./product-backlog.md#pb-94). Removed retired Skill-02 and Skill-10 rows. [Skill-05](./product-backlog.md#pb-26) is WIP. |
| 2026-10-04 | `sdd-refine-backlog`: [Web-portal-15](./product-backlog.md#pb-91) is Theme **Unified public site** (sdd.works + framework.sdd.works integration and redesign). [Web-portal-03](./product-backlog.md#pb-50) is Done ([Web-portal-09](./product-backlog.md#pb-76)). [Agent-02](./product-backlog.md#pb-8), [MCP-04](./product-backlog.md#pb-92), and [i18n-01](./product-backlog.md#pb-67) are Theme. |
| 2026-10-04 | `sdd-refine-backlog` (user picks): Added [Web-portal-07](./product-backlog.md#pb-73) table row. Removed Web-portal-03. [Web-portal-12](./product-backlog.md#pb-81) Done. [Web-portal-15](./product-backlog.md#pb-91) Epic **Unified public site**. Agent-03 `artifacts-map.json` link fixed. Sprint backlog `#rid-d1` on D-1. |
| 2026-10-04 | Requirements use `req-pb-N` and link `[PBI code](#pb-N)` to the table. The Product Backlog table links `[PBI code](#req-pb-N)` to Requirements. `#pb-N` stays on the table for sprint-backlog and Related. |
| 2026-10-04 | [Rule-04](#pb-95) **Done**: pack rule `friendly-language.mdc` (constants key `friendly-language`). Repo audit found no `sdd-friendly-language`. Guides, features catalogs, framework design/stories/tests, and admin portal AC list four harness rules. |
| 2026-10-04 | `sdd-refine-backlog` accept all: Unplanned PBIs adds Rule-04; Spec-seeds Related sync; Skill-05 ToDo; i18n-01 EN-only practices; Web-portal-05 points call-up research at Web-portal-01. |
| 2026-10-04 | [Agent-02](./product-backlog.md#pb-8) `Size` is **Epic** on the Product Backlog table and Unplanned PBIs. Child skill PBIs stay Implementable until split or schedule. |
| 2026-10-05 | [Skill-13](./product-backlog.md#pb-87), [Skill-15](./product-backlog.md#pb-93), [Skill-16](./product-backlog.md#pb-94): pack folders `create-skill`, `build-agent`, `create-rule` ([ADR-089](./adr/ADR-089-pack-authoring-skill-names.md)). Constants keys unchanged. Superseded same day by [ADR-092](./adr/ADR-092-pack-authoring-skill-sdd-prefix.md) revert to `sdd-*` folders. |
| 2026-10-05 | [ADR-092](./adr/ADR-092-pack-authoring-skill-sdd-prefix.md): pack authoring folders `sdd-create-skill`, `sdd-build-agent`, `sdd-create-rule`. Seeds, constants, specs, and operator `~/.cursor/skills/` synced. Unprefixed pack copies removed on update. |
| 2026-10-05 | [Spec-seeds-04](./product-backlog.md#pb-35): optional `adr` and `knowledge` map keys name directory roots ([ADR-090](./adr/ADR-090-adr-knowledge-map-roots.md)). |
| 2026-10-05 | [Rule-03](./product-backlog.md#pb-20) **Retired**: `realtime-status.mdc` removed; `status.md` on close in `dod.mdc` ([ADR-091](./adr/ADR-091-retire-realtime-status-rule.md)). |
| 2026-10-05 | `sdd-refine-backlog` accept all: [i18n-02](./product-backlog.md#pb-68) Size **Theme**. Skill-13, Skill-15, Skill-16 Related and ADR-089 install-folder bullets. Unplanned PBIs synced. [Web-portal-15](./product-backlog.md#pb-91) Size **Epic** on the table (not Theme). |
| 2026-10-05 | `sdd-plan-sprint` Option A: [Skill-03](./product-backlog.md#pb-24), [Skill-04](./product-backlog.md#pb-25), [Skill-05](./product-backlog.md#pb-26), [Skill-13](./product-backlog.md#pb-87), [Skill-15](./product-backlog.md#pb-93), [Skill-16](./product-backlog.md#pb-94) scheduled **Sprint 5**. [Rule-04](./product-backlog.md#pb-95) stays Done, unscheduled. |
| 2026-10-05 | Sprint 5 Done. User confirmed usable. [Skill-03](./product-backlog.md#pb-24) through [Skill-16](./product-backlog.md#pb-94) (planning loop and pack authoring seeds) marked **Done**. |
| 2026-10-05 | `sdd-plan-sprint` Option A for Sprints 6–8: process rules and skills + Spec-seeds-05 (S6); engineering skills and seeds (S7); [Agent-03](./product-backlog.md#pb-10) plus Agent-02 and CE-SKILL tasks (S8). OGT refine [i18n-03](./product-backlog.md#pb-69). |
| 2026-10-05 | EN [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) §5 Feature break down. [`sdd-refine-backlog`](./framework/seeds/skills/sdd-refine-backlog/SKILL.md) and [`sdd-plan-sprint`](./framework/seeds/skills/sdd-plan-sprint/SKILL.md) Knowledge rows point at that section. |
| 2026-10-05 | [Rule-01](./product-backlog.md#pb-18) and [Rule-02](./product-backlog.md#pb-19) **Done**. User confirmed usable. Sprint 6 [feature-37](./sprint-backlog.md#sprint-6)–[feature-39](./sprint-backlog.md#sprint-6) **Done**. [Rule-03](./product-backlog.md#pb-20) stays **Retired** (no rule shipped). |




[Back to top](#index)
