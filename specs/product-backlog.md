# Product overview — framework.sdd.works

> **Purpose**: Record what framework.sdd.works must do in Phase 2, where the boundary is, and how to accept it.
> **Status**: v1.9 · as_of 2026-09-29
> **Related**: [`architecture.md`](./architecture.md) · [`deployment.md`](./deployment.md) · [`sprint-backlog.md`](./sprint-backlog.md) · [`artifacts-map.md`](./artifacts-map.md)
> **Practices**: [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) is what, how, and when (jobs, templates, table conventions).
> **Framework**: [`scrum-in-sdd.md`](./framework/seeds/templates/EN/scrum-in-sdd.md) is names and meaning. HanS: [`scrum-in-sdd.md`](./framework/seeds/templates/HanS/scrum-in-sdd.md).
> **Schedule**: The `Sprint` field on each backlog item is a projection of [`sprint-backlog.md`](./sprint-backlog.md). Schedule changes belong in that file.
> **Phase 1 archive**: [`phase1-process-specs/`](./phase1-process-specs/) (closed). Do not reopen those items here.

framework.sdd.works is an MCP service plus an admin portal that installs and updates an SDD framework in the calling AI client. Phase 1 is closed. Phase 2 ships that pack: the guide, practices, project templates, ethan, rules, and skills. Files under `specs/` in this repo are process assets for building the pack. They are not installed for users.

## Index

- [Scope boundary](#scope-boundary)
- [Requirements](#requirements)
  - [Spec](#spec)
  - [Agent](#agent)
  - [Rule](#rule)
  - [Skill](#skill)
  - [Spec-seeds](#spec-seeds)
  - [MCP](#mcp)
  - [Web-portal](#web-portal)
  - [i18n](#i18n)
  - [Definition of Done](#definition-of-done)
- [Product Backlog](#product-backlog)
- [Change record](#change-record)

---------

## Scope boundary

### What Phase 2 does

- Define the sdd-scrum guide: names and meaning of terminologies, events, and artifacts.
- Define sdd-scrum practices: what, how, and when for each event.
- Define artifact templates and `artifacts-map.md` so project files stay aligned with sdd-scrum.
- Build harness rules and skills. Workflows have no PBI until a workflow is planned. Same-category rows stay together: [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) §3.1.
- Build agent ethan to run sdd-scrum events. Presence is a local client agent ([D1](./sprint-backlog.md#rid-d1) Closed). Design: [`framework/framework-design.md`](./framework/framework-design.md).
- Install and update copy the pack allow-list onto `{client_root}` and write `{client_root}/.sdd-installed.json` with each pack file path and `pack_complete: true`. End-user MCP transport is a local stdio program (`~/.sdd/sdd-mcp`) as the primary path, with Streamable HTTP (`https://framework.sdd.works/mcp`) as the fallback. Building and publishing that program is [MCP-02](#pb-75). Design: [`mcp/mcp-design.md`](./mcp/mcp-design.md) §2.1 and §2.1b. The instructions page copies one sentence that fetches `https://framework.sdd.works/setup` ([ADR-061](./adr/ADR-061-setup-prompt-public-path.md)). The model-facing tool list omits `sdd_list_versions` ([MCP-03](#pb-78), [ADR-063](./adr/ADR-063-unregister-sdd-list-versions.md)).

Acceptance is the requirement under each feature name, plus the Definition of Done checklist. `Category` is one word. `PBI Code` is that word plus a two-digit number. Rows with the same category stay together. Parent bundles pb-2, pb-3, pb-4, pb-5, pb-12, pb-13, and pb-14 are removed. pb-31 and pb-51–pb-62 are removed. Do not reuse those numbers. Skill folders start with `sdd-`.

### Explicitly out of scope

- Phase 1 admin portal behavior that is already shipped.
- MCP behavior that is already shipped and is not named in [pb-16](#pb-16).
- Hosting ethan on remote MCP. The installer MCP stays separate. See [`framework/framework-design.md`](./framework/framework-design.md).

[Back to top](#index)

---------

# Requirements

> The requirement for each feature is the paragraph under that feature name. The Product Backlog table carries a short description, relations, the sprint projection, and status. Back-references prefer the PBI code and the item name. Feature lines are plain Markdown.

A grouping label is not a PBI. Each pack file, rule, and skill below is one row. Rows in the table stay grouped by category. `specs/` in this repo is the process record for building the framework. It is not a second deliverable.

---------

## Spec

Closed process note for this repo. Not a pack file.

- [Spec-01](#pb-1) Archive Phase 1 Scrum files
  Archive Phase 1 under `phase1-process-specs/`. Live process files use this shape.

[Back to top](#index)

---------

## Agent

### Capabilities

- [Agent-01](#pb-6) POC
  Proof of concept for ethan as a local Cursor agent ([D1](./sprint-backlog.md#rid-d1) Closed).
- [Agent-02](#pb-7) Initial capabilities
  Ethan answers what to do now and next from live process files without editing the repo.
- [Agent-03](#pb-8) Facilitate events
  Ethan runs sdd-scrum events by calling the matching skills.
- [Agent-04](#pb-9) Governance artifacts
  Ethan maintains process and tracking artifacts within the rules the guide names.
- [Agent-05](#pb-10) Knowledgeable coach
  Ethan coaches from the guide, practices, and knowledge trees (`adr/`, `knowledge/`).
- [Agent-06](#pb-11) Chat
  Ethan replies from free-form chat input while staying inside harness and process boundaries.
- [Agent-07](#pb-17) Pack receipt start gate
  On start, Ethan reads only `{client_root}/.sdd-installed.json`. Missing ledger or `pack_complete` not true is a fatal stop. He may set `pack_complete` to false when a later job needs a missing framework file. He does not set it to true.
- [Agent-15](#pb-63) `agents/ethan.md` in the pack
  The ethan prompt in the seed tree. Pack publish is go-live, not this row.

### Jobs

Practices jobs 4–8 are still unfilled. [Agent-10](#pb-44)–[Agent-14](#pb-48) include writing those sections.

- [Agent-08](#pb-42) Start a new project
  Retired by [ADR-079](./adr/ADR-079-one-job-update-project.md). The job is [Agent-09](#pb-43).
- [Agent-09](#pb-43) Update project settings
  Ethan runs practices job 3 via `skill_update_project`. On `Uninitialized` he says the next step is to start a new project. On `Index broken` he says the next step is to update the project. After confirm, he follows `sdd-update-project`. [ADR-079](./adr/ADR-079-one-job-update-project.md).
- [Agent-10](#pb-44) Refine product backlog
  Ethan runs practices job 4 via `skill_refine_pb`. That practices section is still unfilled. This PBI includes writing it.
- [Agent-11](#pb-45) Sprint planning
  Ethan runs practices job 5 via `skill_plan_sprint`. That practices section is still unfilled. This PBI includes writing it.
- [Agent-12](#pb-46) Report status
  Ethan runs practices job 6 via `skill_get_status`. The practices section points at `sdd-review-status`.
- [Agent-13](#pb-47) Retrospective
  Ethan runs practices job 7 via `skill_retrospective`. That practices section is still unfilled. This PBI includes writing it.
- [Agent-14](#pb-48) Close / start sprint
  Ethan runs practices job 8 via `skill_close_sprint`. That practices section is still unfilled. This PBI includes writing it.

[Back to top](#index)

---------

## Rule

- [Rule-01](#pb-18) `dod.mdc`
  Definition of Done rule file in the pack.
- [Rule-02](#pb-19) `incremental-delivery.mdc`
  Incremental delivery rule file in the pack.
- [Rule-03](#pb-20) `realtime-status.mdc`
  Real-time status rule file in the pack.
- [Rule-04](#pb-85) `artifacts-map.mdc`
  Retired by [ADR-077](./adr/ADR-077-no-artifacts-map-rule.md). The pack does not ship this rule.

[Back to top](#index)

---------

## Skill

Workflows: none until a workflow is planned. No workflow PBI.

- [Skill-01](#pb-21) `sdd-atdd`
  ATDD skill folder in the pack.
- [Skill-02](#pb-22) `sdd-tdd`
  TDD skill folder in the pack.
- [Skill-03](#pb-23) `sdd-kickoff-project`
  Retired by [ADR-078](./adr/ADR-078-update-project-one-skill.md). The pack does not ship this skill. Update project settings uses `sdd-update-project`.
- [Skill-04](#pb-24) `sdd-update-project`
  Update-project skill (`skill_update_project`). The job is Update project settings. [ADR-079](./adr/ADR-079-one-job-update-project.md).
- [Skill-05](#pb-25) `sdd-refine-pb`
  Refine-product-backlog skill (`skill_refine_pb`).
- [Skill-06](#pb-26) `sdd-plan-sprint`
  Sprint-planning skill (`skill_plan_sprint`).
- [Skill-07](#pb-27) `sdd-update-status`
  Retired by [ADR-076](./adr/ADR-076-review-status-one-skill.md). Do not add this folder. Report status is [Skill-15](#pb-86).
- [Skill-08](#pb-28) `sdd-retrospective`
  Retrospective skill (`skill_retrospective`). The record uses three headings: Learnings, Opportunities, and Future actions.
- [Skill-09](#pb-29) `sdd-close-sprint`
  Close / start sprint skill (`skill_close_sprint`).
- [Skill-10](#pb-30) `sdd-audit-artifacts`
  Read-only audit (`skill_audit_artifacts`). After the pack gate it reads `{workspace}/artifacts-map.md` and opens each stored path as `{workspace}/<path>`. It returns one verdict: `Uninitialized`, `Index broken`, or `Usable`. It reports paths opened, paths that failed, and whether `locale` is empty. It does not write a project file or the ledger.
- [Skill-12](#pb-64) `sdd-update-specs`
  Keep the specs that a change touches aligned with the implementation.
- [Skill-13](#pb-65) `sdd-implement`
  Implement one SBI (`sdd-implement`). Load the skills the Definition of Done and the acceptance criteria require.
- [Skill-14](#pb-80) `sdd-design`
  Design and plan before implementing an SBI (`sdd-design`).
- [Skill-15](#pb-86) `sdd-review-status`
  Compare the board with the current sprint's named work, list each mismatch, and write only after the second yes (`skill_get_status`).
- [Skill-16](#pb-87) `sdd-create-skill`
  Create or revise a skill (`skill_create_skill`). Writes `{client_root}/{skills_dir}/<name>/SKILL.md` after confirm. Not a practices job. Not scheduled on the current sprint.
- [Skill-17](#pb-89) `prompt-optimizer`
  The pack skill `prompt-optimizer` optimizes a prompt. It does not match ECC components.

[Back to top](#index)

---------

## Spec-seeds

Pack source: [ethanhuangcst/framework.sdd.works](https://github.com/ethanhuangcst/framework.sdd.works). That repo must contain `agents/` and `templates/` before install has those trees to copy.

The seed tree is [`specs/framework/seeds/`](./framework/seeds/). Locale files live under `templates/EN/` and `templates/HanS/`. `constants.json` sits beside those locale folders, at `templates/constants.json`.

Every Spec-seeds row has the same acceptance criteria: the user has reviewed and confirmed the seed, it is stored in that tree, associated specs are updated, and a cross-review of the whole seed tree shows it is consistent. HanS and HanT bodies are [i18n](#i18n). Copying the seed folder to the pack repo, pushing it, and syncing the admin portal are [Go-live](./framework/framework-design.md#go-live). They are not a Spec-seeds task and they are not Spec-seeds acceptance criteria.

- [Spec-seeds-01](#pb-32) `constants.json` (beside locale folders; not copied into workspace `specs/`)
  Lookup file for path names, skill keys, and rule keys. Not inside a locale folder. Lives on `{client_root}/templates/framework.sdd.works/constants.json` after install. [ADR-081](./adr/ADR-081-constants-json.md).
- [Spec-seeds-02](#pb-33) `scrum-in-sdd.md`
  Framework guide for every project: names and meaning. It does not take what, how, and when from practices.
- [Spec-seeds-03](#pb-34) `sdd-scrum-practices.md`
  Framework practices for every project: what, how, and when. It does not redefine guide terms. Jobs 4–8 are filled under [Agent-10](#pb-44)–[Agent-14](#pb-48).
- [Spec-seeds-04](#pb-35) `artifacts-map.md`
  Retired by [ADR-080](./adr/ADR-080-no-artifacts-map-seed.md). There is no template seed. The example is in the artifacts-map section of `sdd-scrum-practices.md`.
- [Spec-seeds-05](#pb-36) `product-backlog.md`
  Example product backlog a new project copies. Not this repo's product backlog.
- [Spec-seeds-06](#pb-37) `sprint-backlog.md`
  Generic sprint-backlog starter for a new project.
- [Spec-seeds-07](#pb-38) `status.md`
  Generic status starter for a new project. Not this repo's `status.md`. Title: `The latest status of [product name]`. Sections: (1) Project progress — rows Project kickoff and Initial product backlog refined, each `ToDo`, `WIP`, or `Done`, then one sprint table `Sprint`, `Status`, `Note`. There is no Sprint Goal column. Consecutive `Done` sprints share one row, such as `Sprint 1 - 3`. Consecutive `ToDo` sprints share one row. A `WIP` sprint stays its own row. The sprint backlog stays the SBI list. (2) where we are now — the current sprint with its status, then one sentence, and the current SBI. (3) what could be the next — the next items, proposed from the current sprint, the current SBI, and the sprint item order. The seed keeps those headings and empty lines. (4) Current OGT(On-going Tasks) — an OGT is a temporary or side task, not an SBI split from a PBI. Columns: `#`, Task Name, Affected SBIs, Created, Status. Created is the sprint name. Affected SBIs may be empty or list several items. Each item is its own bullet in the cell. The bullet is the code and the SBI name. Status is `ToDo`, `WIP`, or `Done`. (5) Last 15 closed OGTs — columns `#`, Task Name, Affected SBIs, Created, Closed. Closed is the sprint name when the row closed. A `Done` row leaves the open table and is inserted as row 1 of this table. A 16th closed row drops the oldest. An open defect is not an OGT row. In each OGT table the newest row stays on top. `#` is that row's place in that table and is rewritten from 1 through n on every insert or move. It is not a permanent id. The number a task had while open ends when the row moves to the closed table. The file ends with `Last updated`, a timestamp, and the agent name.
- [Spec-seeds-08](#pb-39) `changes-log.md`
  Generic change-log starter for a new project. A conclusion record: what changed, why, and how it was verified.
- [Spec-seeds-09](#pb-40) `architecture.md`
  Generic architecture starter for a new project.
- [Spec-seeds-10](#pb-41) `deployment.md`
  Generic deployment starter for a new project.
- [Spec-seeds-11](#pb-66) `.secrets`
  Secrets file named in the guide. The seed holds names and where values live. It holds no secret values.
- [Spec-seeds-12](#pb-82) `features.md` under `content/features`
  Review and finalize the three Features catalog seeds under `content/features/` in the pack repo: `features.en.md`, `features.zh-Hans.md`, and `features.zh-Hant.md`.
- [Spec-seeds-13](#pb-84) `issues-log.md`
  Generic issues-log starter for a new project. A defect record. Two tables, in order: Open issues, then Closed issues. Open columns: `Id`, `Title`, `Component`, `Priority`, `Description`, `Related`, `Close Check`, `Status`, `Added time`. Status in that table is `Open`, `Fixed`, or `Deferred`. `Fixed` means a fix exists and the close check is not confirmed. `Deferred` means accepted and not scheduled. Closed columns: `Id`, `Title`, `Component`, `Priority`, `Description`, `Related`, `Close Check`, `Closed Sprint`, `Closed time`. A row moves there only when it is `Closed`. Priority is `Fatal`, `High`, `Medium`, or `Low`. `Id` does not change when a row is sorted or moves. `Description` is under 3 lines. `Close Check` is shorter. Bullets when a sentence is not enough. `Related` is a spec id, a link, and the name. Both tables sort by component A to Z, then by time, oldest first. Dates look like `30/Sep/2026`. An open defect is not an OGT row. A concluded fix still gets a change-log entry. [ADR-075](./adr/ADR-075-issues-log-tables.md).
- [Spec-seeds-14](#pb-90) `test-strategy.md`
  Generic test-strategy starter for a new project. Not this repo's test strategy.

[Back to top](#index)

---------

## MCP

### [MCP-01](#pb-16) Installer

- `sdd_install_framework` and `sdd_update_framework` copy the pack allow-list onto `{client_root}` (stdio primary, ADR-058; HTTP fallback, ADR-054)
- Write `{client_root}/.sdd-installed.json` with `pack_complete: true` when the copy finishes (ADR-057). `files` lists each pack file path, not the folder name (ADR-059).

### [MCP-02](#pb-75) Local binary `~/.sdd/sdd-mcp`

- Zero client dependencies. The running program does not need Node, npm, Bun, Python, or any other runtime. Bun is the build machine only ([ADR-051](./adr/ADR-051-zero-dep-stdio-binary.md)).
- One executable for macOS, Windows, and Linux (ADR-051 targets: `darwin-arm64`, `darwin-x64`, `linux-arm64`, `linux-x64`, `windows-x64`).
- The same program is the stdio `command` for every client in [`mcp-design.md`](./mcp/mcp-design.md) §4.1: Cursor, Cursor Agents, CodeBuddy CN, TRAE, TRAE CN, Claude Code, and Cline. Codex and Copilot use it after their paths are verified.
- The program does the stdio write in [`mcp-design.md`](./mcp/mcp-design.md): `sdd_install_framework` and `sdd_update_framework` copy the pack allow-list onto `{client_root}` and write `.sdd-installed.json` with `pack_complete: true` and file paths. It does not write `framework.sdd.works.json`.
- The binary holds no operator secrets and writes only under the allow-listed client root. Setup tells the agent to run the local file `~/.sdd/sdd-mcp`. It does not tell the agent to download an executable from the network and run it. That download is what agent tools block.

### [MCP-03](#pb-78) MCP tools without `sdd_list_versions`

- The person in the IDE installs or updates the latest pack. They do not pick a version from an MCP tool.
- `sdd_install_framework` already resolves omitted `version` to latest via the sync cache and `GET /api/sdd/package`. The model does not need a catalog call first.
- MCP has no private tool. If a name is on `tools/list`, the model can call it. Keep version listing off that list.
- Pack contents for people are the Features tab (three synced markdown files, [Web-portal-07](#pb-73)), not an agent tool.
- Keep `listVersions()` and `GET /api/sdd/versions` as server-internal APIs. Do not register `sdd_list_versions` on stdio or HTTP. Do not mirror the payload as an MCP resource ([ADR-063](./adr/ADR-063-unregister-sdd-list-versions.md)).

[Back to top](#index)

---------

## Web-portal

- [Web-portal-01](#pb-15) Per-client call-up. Research before writing. Cursor `/ethan` and TRAE CN `@` are known.
  The instructions page gains a section on how each agent tool calls up an agent. Research comes before the section is written.
- [Web-portal-02](#pb-49) Install, update, the install ledger, and the fatal stop when `pack_complete` is not true.
  The instructions page covers install and update, `{client_root}/.sdd-installed.json`, and the fatal stop when `pack_complete` is not true.
- [Web-portal-03](#pb-50) The public site shows that instructions page. No new portal features.
  The public site at framework.sdd.works shows the instructions page. No new portal features.
- [Web-portal-04](#pb-70) Setup markdown: stdio binary + HTTP fallback (ADR-058). Public path `GET /setup` ([ADR-061](./adr/ADR-061-setup-prompt-public-path.md)).
  `public/agent-setup/prompt.md` tells the agent to download `~/.sdd/sdd-mcp`, write a `command` MCP entry with `SDD_SERVER_URL`, and use `"url": "https://framework.sdd.works/mcp"` when the binary cannot be installed or the client accepts only a URL. The public path is `GET /setup` ([ADR-061](./adr/ADR-061-setup-prompt-public-path.md)). The person does not edit the MCP file by hand. Pack install is a later step.
- [Web-portal-05](#pb-71) Instructions page re-design. Sprint 13 still owns per-client call-up research.
  The public instructions page matches the Setup / Features mock. Setup copies `Fetch and execute the setup instructions from https://framework.sdd.works/setup`. Manual setup is one stdio `command` `mcp.json`. Features lists Agents, Skills, Rules, and Templates as fixed rows. A secret name field and Get secret button are visible and do not return a value in this item. There is no Back to home link.
- [Web-portal-06](#pb-72) Instructions page copies the one-line `GET /setup` prompt. Manual setup is one `command` `mcp.json`.
  The instructions page copies one sentence: `Fetch and execute the setup instructions from https://framework.sdd.works/setup`. That URL returns the stdio setup markdown. `GET /agent-setup` redirects to `GET /setup`. Manual setup shows one `mcp.json` with the `command` entry. The page does not show a second `mcp.json` or `curl`. Page labels are i18n keys. The copied sentence is the same protocol line in every locale.
- [Web-portal-07](#pb-73) Features tab reads three synced markdown files. If the sync cache cannot be read, the page reads the same files from `src/content/features/`. No admin editor.
  The Features tab on `/` and `/instructions` shows markdown from the synced pack. Three files sit at `content/features/` in the pack repo: `features.en.md`, `features.zh-Hans.md`, and `features.zh-Hant.md` ([ADR-071](./adr/ADR-071-portal-content-paths.md)). The same three files ship in the server package at `src/content/features/`. The page reads the latest local unpack at `.data/sdd-packages/<commit>/unpacked/content/features/` first. It does not call GitHub. The active locale picks the file. A missing zh-Hans or zh-Hant file in that source shows that source’s English file. If the sync cache cannot be read, the page reads `src/content/features/` instead. Setup and Get secret stay usable. Manual sync and the 30-minute sync publish edits without an app deploy. A failed sync keeps the previous cache. There is no admin editor and no unavailable message. Install does not copy these files onto `{client_root}`. The file body is free markdown. Tab labels stay i18n keys.
- [Web-portal-08](#pb-74) Instructions page looks up one secret by name. No token in the setup prompt.
  On the Features tab, after the template list, a text field and a button look up one secret from the admin key store. The field hint is “Enter the name of the secret, example: sdd-trial-googlemaps” (简体: “输入要获得的密钥名称，例如：sdd-trial-googlemaps”; 繁體: “輸入要取得的密鑰名稱，例如：sdd-trial-googlemaps”). The button is “Get secret” (简体: “获取密钥”; 繁體: “獲取密鑰”). The page shows that secret’s value. Placement on Features is superseded by [Web-portal-13](#pb-83). The setup prompt and `mcp.json` stay without a token. `sdd_get_key` stays off the stdio tool list.
- [Web-portal-09](#pb-76) Public landing is instructions; fixed footer; reset success → login; password gate when hash already set.
  `/` serves the instructions guide (logo-card home goes away). Site footer is fixed to the viewport on auth and admin shells. After reset mail is sent, the link is Back to login → `/login`. An admin with a non-empty `passwordHash` is not shown the empty-account set-password lead and can sign in. An admin with an empty hash still sees the lead and can set a password. E2E setup does not overwrite an existing seed password hash.
- [Web-portal-10](#pb-77) Reset submit stays on-page with success or keyed error; Features tab switches the panel.
  Reset request stays on `/reset-password` (no full document reload). Success shows `admin.reset.sent` and Back to login. Failed send or request shows a keyed error and keeps the form. Features tab on `/` and `/instructions` switches to the features panel and is the hit target at its center.
- [Web-portal-11](#pb-79) Reset success uses the previous `admin.reset.sent` sentence; no `?email=` reload.
  After a successful reset request, the success callout uses the previous `admin.reset.sent` sentence (en: “If that email is an admin account, a reset mail is on its way. Check inbox and junk.”; zh-Hans and zh-Hant matching). It does not interpolate `{email}`. The request lead is hidden. The document stays on `/reset-password` with no `?email=` navigation. The submit control cannot issue a document GET.
- [Web-portal-12](#pb-81) Instructions tab: Scrum in SDD
  On `/` and `/instructions`, a third tab sits after Features. Order: Setup, Features, Scrum in SDD. The label is i18n key `admin.guide.tab_scrum` with the same string `Scrum in SDD` in `en`, `zh-Hans`, and `zh-Hant`. Query `?tab=scrum-in-sdd` opens that panel on a full load. The panel reads `scrum-in-sdd.{locale}.md` from `<unpacked>/content/scrum-in-sdd/` first, then `src/content/scrum-in-sdd/` ([ADR-071](./adr/ADR-071-portal-content-paths.md)). A missing Chinese file in the chosen source uses that source’s English file. A failed sync that keeps the previous unpack stays `source: cache`. Public `GET /api/sdd/scrum-in-sdd?locale=` returns `{ locale, sourceLocale, source, html }` and no key values. HTML rules use `.scrum-body`: an `h1` is larger than an `h2` and has space above it except when it is the first block. List items keep inline markdown. There is no Features em-dash name/description split. Install does not copy the three portal files onto `{client_root}`. Template seeds under `templates/{locale}/scrum-in-sdd.md` stay the project seeds. Setup, Features, and Get secret on Setup stay as they are. The guide panel has no secret form.
- [Web-portal-13](#pb-83) Get secret moves to Setup
  The secret form leaves the bottom of Features and sits at the bottom of Setup, after the tools table. Features does not show the form. Lookup, copy, not-found, and empty-name behavior stay as [Web-portal-08](#pb-74).
- [Web-portal-14](#pb-88) Enriched README.md for IDE invoke differences
  The repo `README.md` explains how each IDE starts an agent. Cursor `/ethan` starts the chat, and later jobs in that chat are plain text. TRAE and TRAE CN use `@` (TRAE CN also @智能体). `/ethan` does not start Ethan there. Claude Code, CodeBuddy CN, and Cline are listed as not verified, with the agent file path and the reason. Codex and Copilot stay out until a root is recorded. The page points at [`framework-design.md`](./framework/framework-design.md) and [`ide-agent-invoke.md`](./knowledge/agent/ide-agent-invoke.md). It does not claim a gesture that has not been checked. The instructions page stays [Web-portal-01](#pb-15).

[Back to top](#index)

---------

## i18n

HanS and HanT bodies for the locale template folders. One PBI per artifact group. Spec-seeds rows own the EN starter only. These rows do not add a locale as its own filename PBI.

- [i18n-01](#pb-67) Framework definition: `scrum-in-sdd.md`, `sdd-scrum-practices.md`, and the other framework-definition prose in the locale folders
  HanS and HanT bodies of the framework-definition seeds match the EN meaning. Files: `scrum-in-sdd.md`, `sdd-scrum-practices.md`, and any other framework-definition prose placed in the locale template folders.
- [i18n-02](#pb-68) Process artifacts: `product-backlog.md`, `sprint-backlog.md`, `status.md`, `changes-log.md`
  HanS and HanT starters for the four process artifacts match the EN starter meaning. Files: `product-backlog.md`, `sprint-backlog.md`, `status.md`, `changes-log.md`. There is no `artifacts-map.md` template seed.
- [i18n-03](#pb-69) Engineering artifacts: `architecture.md`, `{stem}-stories.md`, `{stem}-design.md`, `{stem}-tests.md`, `deployment.md`, `.secrets`, `test-strategy.md`
  HanS and HanT starters for the engineering artifacts match the EN starter meaning. Files: `architecture.md`, `{stem}-stories.md`, `{stem}-design.md`, `{stem}-tests.md`, `deployment.md`, `.secrets`, `test-strategy.md`.

[Back to top](#index)

---------

## Definition of Done

Every Product Backlog item uses this checklist. Mark the row `Done` only when every check passes.

- Follow rule DoD
- Feature confirmed usable by user
- Acceptance criteria (story mapping spec names with links) passed
- Quality meets [agent test](./framework/framework-tests.md) · [MCP test](./mcp/mcp-tests.md) · [portal test](./admin-portal/app-tests.md)

[Back to top](#index)

---------

# Product Backlog

| Category | PBI Code | PBI | Description | Related | Sprint | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Spec | Spec-01 | Archive Phase 1 Scrum files | Archive Phase 1 under `phase1-process-specs/`. | [`artifacts-map.md`](./artifacts-map.md) | Sprint 1 | Done |
| Agent | Agent-01 | agent ethan — POC | Proof of concept for ethan as a local Cursor agent ([D1](./sprint-backlog.md#rid-d1) Closed). | [`framework/framework-design.md`](./framework/framework-design.md) · [D1](./sprint-backlog.md#rid-d1) | Sprint 1 | Done |
| Agent | Agent-02 | agent ethan — initial capabilities | Ethan answers what to do now and next from live process files without editing the repo. | [`framework/framework-design.md`](./framework/framework-design.md) · [Agent-01](#pb-6) | Sprint 11 | ToDo |
| Agent | Agent-03 | agent ethan — facilitate events | Ethan runs sdd-scrum events by calling the matching skills. | [`framework/framework-design.md`](./framework/framework-design.md) · [Skill-06](#pb-26) | Sprint 7 | ToDo |
| Agent | Agent-04 | agent ethan — governance artifacts | Ethan maintains process and tracking artifacts within the rules the guide names. | [`changes-log.md`](./changes-log.md) · [`framework/framework-design.md`](./framework/framework-design.md) | Sprint 6 | ToDo |
| Agent | Agent-05 | agent ethan — knowledgeable coach | Ethan coaches from the guide, practices, and knowledge trees (`adr/`, `knowledge/`). | [`scrum-in-sdd.md`](./framework/seeds/templates/EN/scrum-in-sdd.md) · [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) · [`artifacts-map.md`](./artifacts-map.md) | Sprint 11 | ToDo |
| Agent | Agent-06 | agent ethan — chat | Ethan replies from free-form chat input while staying inside harness and process boundaries. | [`framework/framework-design.md`](./framework/framework-design.md) · [Agent-02](#pb-7) | Sprint 11 | ToDo |
| Agent | Agent-07 | agent ethan — pack receipt start gate | On start, Ethan reads only `{client_root}/.sdd-installed.json`. | [`framework/framework-design.md`](./framework/framework-design.md) §2.4 · [`framework/framework-stories.md`](./framework/framework-stories.md) · [MCP-01](#pb-16) | Sprint 2 | Done |
| Agent | Agent-08 | Job: Start a new project | Retired by [ADR-079](./adr/ADR-079-one-job-update-project.md). The job is Agent-09. | [Agent-09](#pb-43) · [ADR-078](./adr/ADR-078-update-project-one-skill.md) | — | Retired |
| Agent | Agent-09 | Job: Update project settings | Ethan runs practices job 3 via `skill_update_project`. | [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) · [Skill-04](#pb-24) · [ADR-079](./adr/ADR-079-one-job-update-project.md) | Sprint 5 | ToDo |
| Agent | Agent-10 | Job: Refine product backlog | Ethan runs practices job 4 via `skill_refine_pb`. | [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) · [Skill-05](#pb-25) | Sprint 6 | ToDo |
| Agent | Agent-11 | Job: Sprint planning | Ethan runs practices job 5 via `skill_plan_sprint`. | [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) · [Skill-06](#pb-26) | Sprint 7 | ToDo |
| Agent | Agent-12 | Job: Report status | Ethan runs practices job 6 via `skill_get_status`. | [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) · [Skill-15](#pb-86) · [ADR-076](./adr/ADR-076-review-status-one-skill.md) | Sprint 8 | ToDo |
| Agent | Agent-13 | Job: Retrospective | Ethan runs practices job 7 via `skill_retrospective`. | [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) · [Skill-08](#pb-28) | Sprint 9 | ToDo |
| Agent | Agent-14 | Job: Close / start sprint | Ethan runs practices job 8 via `skill_close_sprint`. | [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) · [Skill-09](#pb-29) | Sprint 10 | ToDo |
| Agent | Agent-15 | Pack file: agents/ethan.md | The ethan prompt in the seed tree. | [Agent-01](#pb-6) · [MCP-01](#pb-16) | Sprint 2 | Done |
| Rule | Rule-01 | Rule: dod.mdc | Definition of Done rule file in the pack. | [Spec-seeds-01](#pb-32) | Sprint 12 | ToDo |
| Rule | Rule-02 | Rule: incremental-delivery.mdc | Incremental delivery rule file in the pack. | [Spec-seeds-01](#pb-32) | Sprint 12 | ToDo |
| Rule | Rule-03 | Rule: realtime-status.mdc | Real-time status rule file in the pack. | [Spec-seeds-01](#pb-32) | Sprint 12 | ToDo |
| Rule | Rule-04 | Rule: artifacts-map.mdc | Retired by [ADR-077](./adr/ADR-077-no-artifacts-map-rule.md). The pack does not ship this rule. | [ADR-077](./adr/ADR-077-no-artifacts-map-rule.md) · [ADR-072](./adr/ADR-072-rule-artifacts-map.md) | — | Retired |
| Skill | Skill-01 | Skill: sdd-atdd | ATDD skill folder in the pack. | — | Sprint 13 | ToDo |
| Skill | Skill-02 | Skill: sdd-tdd | TDD skill folder in the pack. | — | Sprint 13 | ToDo |
| Skill | Skill-03 | Skill: sdd-kickoff-project | Retired by [ADR-078](./adr/ADR-078-update-project-one-skill.md). Constants keep one key, `skill_update_project`. | [Skill-04](#pb-24) · [ADR-069](./adr/ADR-069-skill-kickoff-project.md) | — | Retired |
| Skill | Skill-04 | Skill: sdd-update-project | Update project settings (`skill_update_project`). | [Agent-09](#pb-43) · [ADR-079](./adr/ADR-079-one-job-update-project.md) | Sprint 5 | ToDo |
| Skill | Skill-05 | Skill: sdd-refine-pb | Refine-product-backlog skill (`skill_refine_pb`). | [Agent-10](#pb-44) | Sprint 6 | ToDo |
| Skill | Skill-06 | Skill: sdd-plan-sprint | Sprint-planning skill (`skill_plan_sprint`). | [Agent-11](#pb-45) | Sprint 7 | ToDo |
| Skill | Skill-07 | Skill: sdd-update-status | Retired by [ADR-076](./adr/ADR-076-review-status-one-skill.md). Do not add `skill_update_status`. | [Skill-15](#pb-86) · [ADR-065](./adr/ADR-065-skill-update-status.md) | — | Retired |
| Skill | Skill-08 | Skill: sdd-retrospective | Retrospective skill (`skill_retrospective`). The record uses three headings: Learnings, Opportunities, and Future actions. | [Agent-13](#pb-47) | Sprint 9 | ToDo |
| Skill | Skill-09 | Skill: sdd-close-sprint | Close / start sprint skill (`skill_close_sprint`). | [Agent-14](#pb-48) | Sprint 10 | ToDo |
| Skill | Skill-10 | Skill: sdd-audit-artifacts | Read-only audit (`skill_audit_artifacts`). | [`framework-design.md`](./framework/framework-design.md#sdd-audit-artifacts) · [`framework-stories.md`](./framework/framework-stories.md#sdd-audit-artifacts) · [ADR-073](./adr/ADR-073-skill-get-status.md) | Sprint 4 | Done |
| Skill | Skill-12 | Skill: sdd-update-specs | Keep the specs that a change touches aligned with the implementation. | [Skill-13](#pb-65) | Sprint 13 | ToDo |
| Skill | Skill-13 | Skill: sdd-implement | Implement one SBI (`sdd-implement`). | [Skill-12](#pb-64) · [Skill-02](#pb-22) · [Skill-14](#pb-80) · [ADR-066](./adr/ADR-066-sdd-design-before-implementation.md) | Sprint 13 | ToDo |
| Skill | Skill-14 | Skill: sdd-design | Design and plan before implementing an SBI (`sdd-design`). | [Skill-13](#pb-65) · [ADR-066](./adr/ADR-066-sdd-design-before-implementation.md) | Sprint 13 | ToDo |
| Skill | Skill-15 | Skill: sdd-review-status | Compare the board with the current sprint's named work and write only after the second yes (`skill_get_status`). | [ADR-076](./adr/ADR-076-review-status-one-skill.md) · [ADR-073](./adr/ADR-073-skill-get-status.md) · [Skill-10](#pb-30) | Sprint 4 | ToDo |
| Skill | Skill-16 | Skill: sdd-create-skill | Create or revise a skill (`skill_create_skill`). | [ADR-074](./adr/ADR-074-sdd-create-skill.md) | — | ToDo |
| Skill | Skill-17 | Skill: prompt-optimizer | The pack skill `prompt-optimizer` optimizes a prompt. It does not match ECC components. | [prompt-optimizer](./framework/seeds/skills/prompt-optimizer/SKILL.md) | Sprint 5 | ToDo |
| Spec-seeds | Spec-seeds-01 | Seed: constants.json | Lookup file for path names, skill keys, and rule keys. | [MCP-01](#pb-16) · [ADR-081](./adr/ADR-081-constants-json.md) · [ADR-060](./adr/ADR-060-constants-on-client-root.md) | Sprint 2 | Done |
| Spec-seeds | Spec-seeds-02 | Seed: scrum-in-sdd.md | Framework guide for every project: names and meaning. | [MCP-01](#pb-16) · [i18n-01](#pb-67) | Sprint 1 | Done |
| Spec-seeds | Spec-seeds-03 | Seed: sdd-scrum-practices.md | Framework practices for every project: what, how, and when. | [MCP-01](#pb-16) · [i18n-01](#pb-67) | Sprint 1 | Done |
| Spec-seeds | Spec-seeds-04 | Seed: artifacts-map.md | Retired by [ADR-080](./adr/ADR-080-no-artifacts-map-seed.md). No template seed. | [ADR-080](./adr/ADR-080-no-artifacts-map-seed.md) | — | Retired |
| Spec-seeds | Spec-seeds-05 | Seed: product-backlog.md | Example product backlog a new project copies. | [MCP-01](#pb-16) · [i18n-02](#pb-68) | Sprint 6 | ToDo |
| Spec-seeds | Spec-seeds-06 | Seed: sprint-backlog.md | Generic sprint-backlog starter for a new project. | [MCP-01](#pb-16) · [i18n-02](#pb-68) | Sprint 4 | Done |
| Spec-seeds | Spec-seeds-07 | Seed: status.md | Generic status starter for a new project. | [MCP-01](#pb-16) · [i18n-02](#pb-68) | Sprint 4 | Done |
| Spec-seeds | Spec-seeds-08 | Seed: changes-log.md | Generic change-log starter for a new project. | [MCP-01](#pb-16) · [i18n-02](#pb-68) · [ADR-070](./adr/ADR-070-change-log-and-issues-log.md) | Sprint 4 | WIP |
| Spec-seeds | Spec-seeds-09 | Seed: architecture.md | Generic architecture starter for a new project. | [MCP-01](#pb-16) · [i18n-03](#pb-69) | Sprint 15 | ToDo |
| Spec-seeds | Spec-seeds-10 | Seed: deployment.md | Generic deployment starter for a new project. | [MCP-01](#pb-16) · [i18n-03](#pb-69) | Sprint 15 | ToDo |
| Spec-seeds | Spec-seeds-11 | Seed: .secrets | Secrets file named in the guide. | [MCP-01](#pb-16) · [Spec-seeds-10](#pb-41) · [i18n-03](#pb-69) | Sprint 15 | ToDo |
| Spec-seeds | Spec-seeds-12 | Seeds: features.md under content/features | Finalize the three Features catalog seeds. | [Web-portal-07](#pb-73) · [MCP-01](#pb-16) | Sprint 16 | ToDo |
| Spec-seeds | Spec-seeds-13 | Seed: issues-log.md | Generic issues-log starter. Open and Closed tables. | [ADR-070](./adr/ADR-070-change-log-and-issues-log.md) · [ADR-075](./adr/ADR-075-issues-log-tables.md) · [Spec-seeds-08](#pb-39) | Sprint 4 | WIP |
| Spec-seeds | Spec-seeds-14 | Seed: test-strategy.md | Generic test-strategy starter for a new project. | [Spec-seeds-03](#pb-34) · [i18n-03](#pb-69) | Sprint 15 | ToDo |
| MCP | MCP-01 | Installer: pack allow-list + ledger | `sdd_install_framework` and `sdd_update_framework` copy the pack allow-list onto `{client_root}`. | [`mcp/mcp-design.md`](./mcp/mcp-design.md) · [`framework/framework-design.md`](./framework/framework-design.md) §2.4 · [ADR-058](./adr/ADR-058-stdio-end-user-http-fallback.md) · [MCP-02](#pb-75) | Sprint 16 | ToDo |
| MCP | MCP-02 | Local binary: ~/.sdd/sdd-mcp | One local stdio program at `~/.sdd/sdd-mcp` for macOS, Windows, and Linux. | [ADR-051](./adr/ADR-051-zero-dep-stdio-binary.md) · [ADR-053](./adr/ADR-053-server-side-sync-thin-stdio.md) · [ADR-058](./adr/ADR-058-stdio-end-user-http-fallback.md) · [`mcp/mcp-design.md`](./mcp/mcp-design.md) §2.1 and §4.1 · [MCP-01](#pb-16) | Sprint 2 | Done |
| MCP | MCP-03 | MCP tools without sdd_list_versions | Unregister `sdd_list_versions` from stdio and HTTP MCP. | [ADR-063](./adr/ADR-063-unregister-sdd-list-versions.md) · [`mcp/mcp-design.md`](./mcp/mcp-design.md) §3 · [`mcp/mcp-stories.md`](./mcp/mcp-stories.md) `sdd-mcp-tool-surface` · [MCP-02](#pb-75) · [Web-portal-07](#pb-73) | Sprint 3 | Done |
| Web-portal | Web-portal-01 | Instructions: per-client agent call-up | The instructions page gains a section on how each agent tool calls up an agent. | [`framework/framework-design.md`](./framework/framework-design.md) · [`mcp/client.paths.md`](./mcp/client.paths.md) | Sprint 14 | ToDo |
| Web-portal | Web-portal-02 | Instructions: install, receipt, fatal stop | Instructions cover install, the ledger, and the fatal stop. | [Web-portal-01](#pb-15) · [MCP-01](#pb-16) · [Agent-07](#pb-17) | Sprint 14 | ToDo |
| Web-portal | Web-portal-03 | Website shows instructions | The public site at framework.sdd.works shows the instructions page. | [Web-portal-01](#pb-15) · [Web-portal-02](#pb-49) | Sprint 14 | ToDo |
| Web-portal | Web-portal-04 | Agent-setup: stdio prompt + HTTP fallback | Setup prompt installs local stdio and falls back to HTTP. | [MCP-02](#pb-75) · [ADR-058](./adr/ADR-058-stdio-end-user-http-fallback.md) · [ADR-061](./adr/ADR-061-setup-prompt-public-path.md) · [`mcp/mcp-stories.md`](./mcp/mcp-stories.md) `sdd-mcp-prompt-setup` | Sprint 2 | Done |
| Web-portal | Web-portal-05 | Instructions page re-design | The public instructions page matches the Setup / Features mock. | [`admin-portal/ui-mockup/01-home.html`](./admin-portal/ui-mockup/01-home.html) · [ADR-061](./adr/ADR-061-setup-prompt-public-path.md) · [Web-portal-06](#pb-72) | Sprint 2 | Done |
| Web-portal | Web-portal-06 | Instructions: MCP auto-connect prompt | Instructions copy one setup sentence. | [Web-portal-04](#pb-70) · [`mcp/mcp-design.md`](./mcp/mcp-design.md) §2.1 · [ADR-061](./adr/ADR-061-setup-prompt-public-path.md) | Sprint 2 | Done |
| Web-portal | Web-portal-07 | Features tab reads synced markdown | The Features tab on `/` and `/instructions` shows markdown from the synced pack. | [Web-portal-05](#pb-71) · [`mcp/mcp-design.md`](./mcp/mcp-design.md) sync cache · [`admin-portal/app-design.md`](./admin-portal/app-design.md) · [`admin-portal/app-stories.md`](./admin-portal/app-stories.md) | Sprint 3 | Done |
| Web-portal | Web-portal-08 | Instructions page — Get secret | On the Features tab, after the template list, a text field and a button look up one secret from the admin key store. | [`mcp/mcp-stories.md`](./mcp/mcp-stories.md) `sdd-mcp-get-key` · [`admin-portal/app-stories.md`](./admin-portal/app-stories.md) AC7 · [`admin-portal/ui-mockup/13-instructions.html`](./admin-portal/ui-mockup/13-instructions.html) · [`issues-log.md`](./issues-log.md) WA-09 · WA-11 · [ADR-067](./adr/ADR-067-get-secret-on-setup.md) | Sprint 3 | Done |
| Web-portal | Web-portal-09 | Public landing, footer, reset link, password gate | `/` serves the instructions guide (logo-card home goes away). | [`issues-log.md`](./issues-log.md) WA-01–WA-04 · [`admin-portal/app-stories.md`](./admin-portal/app-stories.md) · [`admin-portal/app-design.md`](./admin-portal/app-design.md) | Sprint 3 | Done |
| Web-portal | Web-portal-10 | Reset submit and Features tab | Reset request stays on `/reset-password` (no full document reload). | [`issues-log.md`](./issues-log.md) WA-05–WA-06 · [`admin-portal/app-stories.md`](./admin-portal/app-stories.md) · [`admin-portal/app-design.md`](./admin-portal/app-design.md) | Sprint 3 | Done |
| Web-portal | Web-portal-11 | Reset success stays on page with previous sentence | Reset success keeps the previous sentence and stays on the page. | [`issues-log.md`](./issues-log.md) WA-08 · WA-10 · [`admin-portal/app-stories.md`](./admin-portal/app-stories.md) · [`admin-portal/app-design.md`](./admin-portal/app-design.md) | Sprint 3 | Done |
| Web-portal | Web-portal-12 | Instructions tab: Scrum in SDD | On `/` and `/instructions`, a third tab sits after Features. | [Spec-seeds-02](#pb-33) · [`admin-portal/app-design.md`](./admin-portal/app-design.md) `/instructions` · [ADR-068](./adr/ADR-068-scrum-in-sdd-filename.md) · [`scrum-in-sdd.en.md`](../src/content/scrum-in-sdd/scrum-in-sdd.en.md) | Sprint 3 | Done |
| Web-portal | Web-portal-13 | Get secret moves to Setup | The secret form leaves the bottom of Features and sits at the bottom of Setup, after the tools table. | [ADR-067](./adr/ADR-067-get-secret-on-setup.md) · [Web-portal-08](#pb-74) · [`admin-portal/ui-mockup/13-instructions.html`](./admin-portal/ui-mockup/13-instructions.html) | Sprint 3 | Done |
| Web-portal | Web-portal-14 | Enriched README.md for IDE invoke differences | The repo README explains how each IDE starts an agent, and which clients are not verified. | [Web-portal-01](#pb-15) · [`framework-design.md`](./framework/framework-design.md) · [`ide-agent-invoke.md`](./knowledge/agent/ide-agent-invoke.md) | — | ToDo |
| i18n | i18n-01 | Framework definition locales | HanS and HanT bodies of the framework-definition seeds match the EN meaning. | [`scrum-in-sdd.md`](./framework/seeds/templates/EN/scrum-in-sdd.md) · [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) | Sprint 16 | ToDo |
| i18n | i18n-02 | Process artifact locales | HanS and HanT starters for the four process artifacts match the EN starter meaning. | [Spec-seeds-05](#pb-36) · [Spec-seeds-06](#pb-37) · [Spec-seeds-07](#pb-38) · [Spec-seeds-08](#pb-39) | Sprint 16 | ToDo |
| i18n | i18n-03 | Engineering artifact locales | HanS and HanT starters for the engineering artifacts match the EN starter meaning. | [Spec-seeds-09](#pb-40) · [Spec-seeds-10](#pb-41) · [Spec-seeds-11](#pb-66) · [Spec-seeds-14](#pb-90) | Sprint 16 | ToDo |

[Back to top](#index)

---------

## Change record

| Date | Change |
| --- | --- |
| 2026-09-21 | Replaced the sample-product draft with Phase 2 items SPEC-01, ARTIFACTS-01, COACH-01, and TEMPLATES-01. |
| 2026-09-21 | Split Phase 2: practices SSOT, four templates, six process skills, coach-ethan (presence TBD), Instructions page. |
| 2026-09-22 | Priority: `sdd-scrum-guide.md` as framework SSOT; coach-ethan as three MVPs (Sprint 2–4); other themes cleared from Sprint. |
| 2026-09-22 | coach-ethan presence: local Cursor agent ([D1](./sprint-backlog.md#rid-d1) Closed). Design at [`framework/framework-design.md`](./framework/framework-design.md). |
| 2026-09-23 | Dropped HTML table width hacks for pipe Markdown. Sprint backlog aligned to Phase 2 scope map. |
| 2026-09-23 | Product Backlog rows match Requirements (specs, ethan, harness) in the pipe table (`#`, Category, Parent, PBI, Description, Acceptance criteria, Related, Sprint, Status). |
| 2026-09-23 | Removed HTML id anchors. Added pb-14 Initialize framework.sdd.works v2 POC (Sprint 1). |
| 2026-09-24 | Added pb-15 Instructions: per-client agent call-up. Research before writing the section. Not scheduled. |
| 2026-09-24 | Consolidated backlog to pb-50: installer full pack + receipt (pb-16), ethan receipt start gate (pb-17), per-rule / per-skill / per-seed / per-job PBIs, instructions install page (pb-49), website (pb-50). pb-12 and pb-13 stay parent bundles. Not scheduled. |
| 2026-09-24 | Requirements rewritten in pb order. Live spec files split into pb-51–pb-62. Pack agent file is pb-63. Row anchors restored so `#pb-N` links resolve. |
| 2026-09-24 | Added skills pb-64 `update-specs` and pb-65 `implement-feature` (spec update, then TDD). Not scheduled. |
| 2026-09-24 | Requirements give `constants.md` its own heading. It is not a locale seed. |
| 2026-09-24 | Category is one word. Added PBI Code. Removed parent bundles pb-2, pb-3, pb-4, pb-5, pb-12, and pb-13. Those numbers stay unused. |
| 2026-09-24 | Removed the `#` column and the Journey section (pb-14). Skill folders use the `sdd-` prefix, including `sdd-atdd`, `sdd-tdd`, `sdd-update-spec`, and `sdd-implement-feature`. |
| 2026-09-24 | Removed `sdd-update-artifacts` (pb-31). Kept `sdd-update-specs` (Skill-12). pb-31 stays unused. |
| 2026-09-24 | Removed Spec-02–Spec-13 (pb-51–pb-62). `specs/` in this repo is process, not the pack. Guide acceptance is Spec-seeds-02. Table rows are grouped by category. |
| 2026-09-24 | Scope item 4 points at practices §3.1 for same-category rows. Sprint shape is [`framework-design.md`](./framework/framework-design.md). |
| 2026-09-24 | The product backlog column stays `Category`. Sprint items use `Type`. Same-category order is in practices §3.1. |
| 2026-09-24 | Sprint shape file renamed to [`framework-design.md`](./framework/framework-design.md). `Feature` is a delivered capability. `Task` is supporting work. |
| 2026-09-24 | Added [Spec-seeds-11](#pb-66) `.secrets` (guide name). Scheduled [Spec-seeds-08](#pb-39) on Sprint 5 and [Spec-seeds-09](#pb-40), [Spec-seeds-10](#pb-41), and Spec-seeds-11 on Sprint 14. |
| 2026-09-25 | Added category i18n: [i18n-01](#pb-67) framework definition, [i18n-02](#pb-68) five process artifacts, [i18n-03](#pb-69) engineering artifacts. Sprint 15. Spec-seeds rows stay the file-existence owners. |
| 2026-09-25 | HanS and HanT bodies moved off Spec-seeds acceptance. Spec-seeds own the EN starter. Sprint 1 HanS guide, HanT guide, and HanS/HanT practices are Sprint 15. |
| 2026-09-25 | Spec-seeds acceptance is the same four checks for every row: user review, stored in `specs/framework/seeds/`, associated specs updated, seed tree cross-reviewed. |
| 2026-09-25 | Sprint 1 closed. Spec-seeds-02 and Spec-seeds-03 Done. Phase 1 archive path is `phase1-process-specs/`. |
| 2026-09-25 | Agent-15 is the seed file `agents/ethan.md`. Pack copy and admin sync are go-live, not Spec-seeds acceptance. |
| 2026-09-25 | Agent-07 Done: seed prompt gates on `.sdd-installed.json` `pack_complete`. Stories and design §14 hold the prompt. |
| 2026-09-25 | ADR-058: end-user stdio primary, HTTP fallback. MCP-01 and Agent-07 use `.sdd-installed.json`. Added [Web-portal-04](#pb-70) agent-setup prompt for Sprint 2. |
| 2026-09-25 | Scope: install allow-list + file-level ledger; [Web-portal-04](#pb-70) paste prompt downloads `~/.sdd/sdd-mcp` and writes `command`, HTTP URL as fallback. |
| 2026-09-25 | Added [Web-portal-05](#pb-71) on Sprint 2: instructions page re-design (Setup / Features mock). |
| 2026-09-25 | Phase 2 scope names stdio primary and HTTP fallback, linked to [`mcp-design.md`](./mcp/mcp-design.md). Added [Web-portal-06](#pb-72): instructions-page auto-connect prompt. |
| 2026-09-25 | Renamed Spec-seeds-01 to `constants.md`. Lives on the client root only ([ADR-060](./adr/ADR-060-constants-on-client-root.md)). Not copied into workspace `specs/`. |
| 2026-09-25 | Added [Web-portal-07](#pb-73) on Sprint 2: the Features tab reads pack `features.md` from the sync cache. |
| 2026-09-25 | [ADR-061](./adr/ADR-061-setup-prompt-public-path.md): paste URL is `https://framework.sdd.works/setup`. Manual setup is one `command` `mcp.json`. |
| 2026-09-25 | Sprint 2 `backend-01`: one-line prompt connects agent tools to MCP. Moved [Web-portal-07](#pb-73) to Sprint 3. |
| 2026-09-25 | Added [Web-portal-08](#pb-74) on Sprint 3: the Features tab looks up one secret by name. |
| 2026-09-26 | Added [Web-portal-09](#pb-76): `/` is instructions, fixed footer, reset → login, password gate. Issues WA-01–WA-04. |
| 2026-09-26 | [Web-portal-09](#pb-76) Done. WA-01–WA-04 closed after Playwright retest. |
| 2026-09-26 | Added [Web-portal-10](#pb-77): reset stays on-page; Features tab switches. Issues WA-05–WA-06. |
| 2026-09-26 | [Web-portal-10](#pb-77) Done. WA-05–WA-06 closed after browser and Playwright retest. |
| 2026-09-26 | [Web-portal-08](#pb-74) description names 繁體 hint and button. Sprint 3 feature-04 design: stories AC7, app-design secret form, app-test cases. |
| 2026-09-25 | Added [MCP-02](#pb-75): build and publish `~/.sdd/sdd-mcp` (ADR-051). Sprint 2 feature-14. |
| 2026-09-25 | [MCP-02](#pb-75) requirements: zero client runtimes, macOS/Windows/Linux, every §4.1 client, stdio writes from [`mcp-design.md`](./mcp/mcp-design.md), and no agent-side download of an executable. |
| 2026-09-25 | Spec-seeds-01 Done: user confirmed `constants.md` seed. |
| 2026-09-26 | Added [MCP-03](#pb-78): unregister `sdd_list_versions` from MCP ([ADR-063](./adr/ADR-063-unregister-sdd-list-versions.md)). Sprint 3. Person installs latest; no private MCP tool; Features tab owns the catalog; `GET /api/sdd/versions` stays. |
| 2026-09-26 | Added [Web-portal-11](#pb-79) (WA-08): reset success names `{email}` and no `?email=` reload. Extended [Web-portal-08](#pb-74) (WA-09): Get secret stays on Features; code block or not-found. |
| 2026-09-26 | [Web-portal-11](#pb-79) amended (WA-10): restore previous `admin.reset.sent` without `{email}`. [Web-portal-08](#pb-74) (WA-11): Get secret result scrolls into view; found value is code block with copy, lookup-row width. |
| 2026-09-26 | Sprint 2 closed. [Agent-01](#pb-6) Done with its Sprint 1 spike. [MCP-01](#pb-16) stays ToDo for go-live. |
| 2026-09-26 | Moved [MCP-01](#pb-16) from Sprint 2 to Sprint 15. Sprint 2 installer stories stay Done. The open slice is pack copy, GitHub Releases for the five `sdd-mcp` binaries, and admin-portal sync. |
| 2026-09-26 | [Web-portal-07](#pb-73) uses three markdown files. The page prefers the sync cache. If that cache cannot be read, it reads `src/content/features/`. There is no unavailable message. Sprint 3 feature-05 absorbs the old feature-06. |
| 2026-09-26 | Added [Web-portal-12](#pb-81) on Sprint 3: instructions page gains an sdd-scrum guide tab. Added [Spec-seeds-12](#pb-82) on Sprint 15: review and finalize the three `features.*.md` files at the pack root. |
| 2026-09-26 | Added [Web-portal-13](#pb-83) on Sprint 3: Get secret moves from Features to the bottom of Setup ([ADR-067](./adr/ADR-067-get-secret-on-setup.md)). |
| 2026-09-26 | [Web-portal-13](#pb-83) Done: Get secret on Setup confirmed usable. |
| 2026-09-27 | [Web-portal-12](#pb-81) Done. Ethan confirmed the Scrum in SDD tab layout. |
| 2026-09-27 | [ADR-070](./adr/ADR-070-change-log-and-issues-log.md): `change-log.md` is the conclusion record and `issues-log.md` is the defect record. [Spec-seeds-08](#pb-39) moves to Sprint 3. Added [Spec-seeds-13](#pb-84). |
| 2026-09-27 | [ADR-072](./adr/ADR-072-rule-artifacts-map.md): rule `artifacts-map.mdc`. [Rule-04](#pb-85) is Sprint 3. The EN guide lists it. |
| 2026-09-27 | [ADR-071](./adr/ADR-071-portal-content-paths.md): portal markdown is read from `<unpacked>/content/features/` and `<unpacked>/content/scrum-in-sdd/`, not the pack root. |
| 2026-09-29 | DoD cells use the default checks: DoD rule, user confirmation, linked acceptance criteria, and the test specs. |
| 2026-09-29 | Added [Skill-16](#pb-87) `sdd-create-skill` ([ADR-074](./adr/ADR-074-sdd-create-skill.md)). Not scheduled. The pack does not ship `skill-creator` or `create-skill`. |
| 2026-09-30 | Added [Web-portal-14](#pb-88): repo `README.md` explains IDE differences when invoking an agent. Not scheduled. |
| 2026-09-29 | [Spec-seeds-07](#pb-38) records the `status.md` starter: project progress, current item, next items, open OGTs, and the latest 15 closed OGTs. `#` is the row's place in that table. |
| 2026-09-29 | Product Backlog requirements sit under each feature name. The table Description is a short summary. The DoD column is removed. One Definition of Done checklist sits above the table. |
| 2026-09-29 | Row anchors sit on the feature name. The Product Backlog table cells are plain Markdown. |
| 2026-09-29 | [Spec-seeds-07](#pb-38): the progress table has no Sprint Goal column. Consecutive Done sprints share one row. Consecutive ToDo sprints share one row. Where we are now adds one sentence after the sprint name. What is next follows the current sprint, the current SBI, and the item order. Affected SBIs shows the code and the SBI name. The file ends with Last updated, a timestamp, and the agent name. |
| 2026-09-29 | [Spec-seeds-07](#pb-38): each Affected SBIs item is its own bullet in the cell. The bullet is the code and the SBI name. |
| 2026-09-30 | [Spec-seeds-07](#pb-38) confirmed. Sprint 4 feature-27 is Done. |
| 2026-09-30 | [ADR-075](./adr/ADR-075-issues-log-tables.md): [Spec-seeds-13](#pb-84) uses an Open issues table and a Closed issues table. Status in the Open table is `Open`, `Fixed`, or `Deferred`. |
| 2026-09-30 | Feature lines are plain Markdown. HTML anchors are removed. |
| 2026-09-30 | Requirements use tight lists: each requirement sits on the line after its feature name, with no blank line. A loose list stopped Cursor preview. |
| 2026-09-30 | [Spec-seeds-08](#pb-39) and [Spec-seeds-13](#pb-84) confirmed. Sprint 4 feature-21 is Done. |
| 2026-10-01 | Moved [Spec-seeds-06](#pb-37) from Sprint 7 to Sprint 4. Sprint 4 feature-04 is the next ToDo, before feature-24. |
| 2026-10-01 | [Spec-seeds-07](#pb-38) reopened. Sprint 4 feature-27 is WIP: the `status.md` seed is under review with the seed artifacts building guide. |
| 2026-10-01 | [Spec-seeds-06](#pb-37) confirmed. Sprint 4 feature-04 is Done. |
| 2026-10-01 | [Spec-seeds-08](#pb-39) and [Spec-seeds-13](#pb-84) reopened. Sprint 4 feature-21 is WIP: the `changes-log.md` and `issues-log.md` seeds are under review with the seed artifacts building guide. |
| 2026-10-01 | Sprint 4 feature-20 moves to Sprint 5 as ToDo, with [Skill-03](#pb-23). Sprint 4 feature-13 and feature-15 move to Sprint 13 as ToDo: design before implement ([Skill-14](#pb-80), [Skill-13](#pb-65)). Sprint 4 feature-12 and feature-14 fold into feature-30 ([Skill-07](#pb-27)), still Sprint 4 ToDo. feature-29 is a task. |
| 2026-10-01 | [Spec-seeds-07](#pb-38) confirmed. Sprint 4 feature-27 is Done. Section rules for `status.md` live as Template and How to write in `sdd-scrum-practices.md`. |
| 2026-10-01 | Sprint 4 feature-03 is renamed Seed: artifacts-map.md. It builds the EN authoring seed for [Spec-seeds-04](#pb-35). |
| 2026-10-01 | [Spec-seeds-04](#pb-35) reopened. Sprint 4 feature-03 is WIP: the `artifacts-map.md` seed is under review with the seed artifacts building guide. |
| 2026-10-02 | Added [Skill-17](#pb-89) `prompt-optimizer`. Sprint 5 feature-31 removes ECC from that skill. |
| 2026-10-03 | Added [Spec-seeds-14](#pb-90) `test-strategy.md` on Sprint 15, with the other engineering starters. |
| 2026-10-03 | [ADR-080](./adr/ADR-080-no-artifacts-map-seed.md): no `artifacts-map.md` template seed. The Pokymon example stays in the practices artifacts-map section. [Spec-seeds-04](#pb-35) and Sprint 4 feature-03 are Retired. |
| 2026-10-03 | [ADR-081](./adr/ADR-081-constants-json.md): Spec-seeds-01 is `constants.json`. Living readers use that file. |
| 2026-10-03 | [ADR-082](./adr/ADR-082-artifacts-map-json.md): the project path file is `artifacts-map.json`. Living readers and audit fixtures use that file. |

[Back to top](#index)
