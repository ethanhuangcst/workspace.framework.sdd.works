# Product overview — framework.sdd.works

> **Purpose**: Record what framework.sdd.works must do in Phase 2, where the boundary is, and how to accept it.
> **Status**: v1.8 · as_of 2026-09-25
> **Related**: [`architecture.md`](./architecture.md) · [`deployment.md`](./deployment.md) · [`sprint-backlog.md`](./sprint-backlog.md) · [`artifacts-map.md`](./artifacts-map.md)
> **Practices**: [`sdd-scrum-practices.md`](./framework.seeds/templates/EN/sdd-scrum-practices.md) is what, how, and when (jobs, templates, table conventions).
> **Framework**: [`sdd-scrum-guide.md`](./framework.seeds/templates/EN/sdd-scrum-guide.md) is names and meaning. HanS: [`sdd-scrum-guide.md`](./framework.seeds/templates/HanS/sdd-scrum-guide.md).
> **Schedule**: The `Sprint` field on each backlog item is a projection of [`sprint-backlog.md`](./sprint-backlog.md). Schedule changes belong in that file.
> **Phase 1 archive**: [`phase1-process-specs/`](./phase1-process-specs/) (closed). Do not reopen those items here.

framework.sdd.works is an MCP service plus an admin portal that installs and updates an SDD framework in the calling AI client. Phase 1 is closed. Phase 2 ships that pack: the guide, practices, project templates, ethan, rules, and skills. Files under `specs/` in this repo are process assets for building the pack. They are not installed for users.

---------
## Scope boundary

### What Phase 2 does

- Define the sdd-scrum guide: names and meaning of terminologies, events, and artifacts.
- Define sdd-scrum practices: what, how, and when for each event.
- Define artifact templates and `artifacts-map.md` so project files stay aligned with sdd-scrum.
- Build harness rules and skills. Workflows have no PBI until a workflow is planned. Same-category rows stay together: [`sdd-scrum-practices.md`](./framework.seeds/templates/EN/sdd-scrum-practices.md) §3.1.
- Build agent ethan to run sdd-scrum events. Presence is a local client agent ([D1](./sprint-backlog.md#rid-d1) Closed). Design: [`agent-ethan/agent-design.md`](./agent-ethan/agent-design.md).
- Install and update copy every top-level folder from the artifact repo onto `{client_root}`, and publish instructions on the public site.

Acceptance → the Product Backlog table. `Category` is one word. `PBI Code` is that word plus a two-digit number, and it carries the row anchor. Rows with the same category stay together. Parent bundles pb-2, pb-3, pb-4, pb-5, pb-12, pb-13, and pb-14 are removed. pb-31 and pb-51–pb-62 are removed. Do not reuse those numbers. Skill folders start with `sdd-`.

### Explicitly out of scope

- Phase 1 admin portal behavior that is already shipped.
- MCP behavior that is already shipped and is not named in [pb-16](#pb-16).
- Hosting ethan on remote MCP. The installer MCP stays separate. See [`agent-ethan/agent-design.md`](./agent-ethan/agent-design.md).

---------
# Requirements

> Executable detail is in the Product Backlog items below. Back-references prefer the PBI code and the item name. The row anchor sits on the PBI Code cell.

A grouping label is not a PBI. Each pack file, rule, and skill below is one row. Rows in the table stay grouped by category. `specs/` in this repo is the process record for building the framework. It is not a second deliverable.

---------
## Spec

Closed process note for this repo. Not a pack file.

- [Spec-01](#pb-1) Archive Phase 1 Scrum files

---------
## Agent

### Capabilities

- [Agent-01](#pb-6) POC
- [Agent-02](#pb-7) Initial capabilities
- [Agent-03](#pb-8) Facilitate events
- [Agent-04](#pb-9) Governance artifacts
- [Agent-05](#pb-10) Knowledgeable coach
- [Agent-06](#pb-11) Chat
- [Agent-07](#pb-17) Pack receipt start gate
- [Agent-15](#pb-63) `agents/ethan.md` in the pack

### Jobs

Practices jobs 4–8 are still unfilled. [Agent-10](#pb-44)–[Agent-14](#pb-48) include writing those sections.

- [Agent-08](#pb-42) Start a new project
- [Agent-09](#pb-43) Update project settings
- [Agent-10](#pb-44) Refine product backlog
- [Agent-11](#pb-45) Sprint planning
- [Agent-12](#pb-46) Report status
- [Agent-13](#pb-47) Retrospective
- [Agent-14](#pb-48) Close / start sprint

---------
## Rule

- [Rule-01](#pb-18) `sdd-dod.mdc`
- [Rule-02](#pb-19) `sdd-incremental-delivery.mdc`
- [Rule-03](#pb-20) `sdd-realtime-status.mdc`

---------
## Skill

Workflows: none until a workflow is planned. No workflow PBI.

- [Skill-01](#pb-21) `sdd-atdd`
- [Skill-02](#pb-22) `sdd-tdd`
- [Skill-03](#pb-23) `sdd-new-project`
- [Skill-04](#pb-24) `sdd-update-project`
- [Skill-05](#pb-25) `sdd-refine-pb`
- [Skill-06](#pb-26) `sdd-plan-sprint`
- [Skill-07](#pb-27) `sdd-update-status`
- [Skill-08](#pb-28) `sdd-retrospective`
- [Skill-09](#pb-29) `sdd-close-sprint`
- [Skill-10](#pb-30) `sdd-audit-artifacts`
- [Skill-12](#pb-64) `sdd-update-specs`
- [Skill-13](#pb-65) `sdd-implement-feature`

---------
## Spec-seeds

Pack source: [ethanhuangcst/framework.sdd.works](https://github.com/ethanhuangcst/framework.sdd.works). That repo must contain `agents/` and `templates/` before install has those trees to copy.

The seed tree is [`specs/framework.seeds/`](./framework.seeds/). Locale files live under `templates/EN/` and `templates/HanS/`. `project-constants.md` sits beside those locale folders, at `templates/project-constants.md`.

Every Spec-seeds row has the same acceptance criteria: the user has reviewed and confirmed the seed, it is stored in that tree, associated specs are updated, and a cross-review of the whole seed tree shows it is consistent. HanS and HanT bodies are [i18n](#i18n).

- [Spec-seeds-02](#pb-33) `sdd-scrum-guide.md`
- [Spec-seeds-03](#pb-34) `sdd-scrum-practices.md`
- [Spec-seeds-04](#pb-35) `artifacts-map.md`
- [Spec-seeds-05](#pb-36) `product-backlog.md`
- [Spec-seeds-06](#pb-37) `sprint-backlog.md`
- [Spec-seeds-07](#pb-38) `status.md`
- [Spec-seeds-08](#pb-39) `change-log.md`
- [Spec-seeds-09](#pb-40) `architecture.md`
- [Spec-seeds-10](#pb-41) `deployment.md`
- [Spec-seeds-11](#pb-66) `.secrets`

---------
## MCP

### [MCP-01](#pb-16) Installer

- `sdd_install_framework` and `sdd_update_framework` copy every top-level folder from the artifact repo onto `{client_root}`
- Write `{client_root}/framework.sdd.works.json` with `pack_complete: true` when the copy finishes

---------
## Web-portal

- [Web-portal-01](#pb-15) Per-client call-up. Research before writing. Cursor `/ethan` and TRAE CN `@` are known.
- [Web-portal-02](#pb-49) Install, update, the pack receipt, and the fatal stop when `pack_complete` is not true.
- [Web-portal-03](#pb-50) The public site shows that instructions page. No new portal features.

---------
## i18n

<a id="i18n"></a>HanS and HanT bodies for the locale template folders. One PBI per artifact group. Spec-seeds rows own the EN starter only. These rows do not add a locale as its own filename PBI.

- [i18n-01](#pb-67) Framework definition: `sdd-scrum-guide.md`, `sdd-scrum-practices.md`, and the other framework-definition prose in the locale folders
- [i18n-02](#pb-68) Process artifacts: `product-backlog.md`, `sprint-backlog.md`, `status.md`, `change-log.md`, `artifacts-map.md`
- [i18n-03](#pb-69) Engineering artifacts: `architecture.md`, `{model}-stories`, `{model}-design.md`, `{model}-test.md`, `deployment.md`, `.secrets`

---------
# Product Backlog

| Category | PBI Code | PBI | Description | Acceptance criteria | Related | Sprint | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Spec | <a id="pb-1"></a>Spec-01 | Archive Phase 1 Scrum files | Archive Phase 1 under `phase1-process-specs/`. Live process files use this shape. | Phase 1 Scrum files are only under `phase1-process-specs/`. Live process files exist at `specs/` for this product. No application code change for this item. | [`artifacts-map.md`](./artifacts-map.md) | Sprint 1 | Done |
| Agent | <a id="pb-6"></a>Agent-01 | agent ethan — POC | Proof of concept for ethan as a local Cursor agent ([D1](./sprint-backlog.md#rid-d1) Closed). | A local Cursor agent prompt for ethan exists and can be invoked. Presence matches [D1](./sprint-backlog.md#rid-d1). Design: [`agent-ethan/agent-design.md`](./agent-ethan/agent-design.md). | [`agent-ethan/agent-design.md`](./agent-ethan/agent-design.md) · [D1](./sprint-backlog.md#rid-d1) | Sprint 1 | ToDo |
| Agent | <a id="pb-7"></a>Agent-02 | agent ethan — initial capabilities | Ethan answers what to do now and next from live process files without editing the repo. | From a chat turn, ethan answers “what now / what next” using the guide plus live backlog and sprint backlog, without writing files or calling skills. | [`agent-ethan/agent-design.md`](./agent-ethan/agent-design.md) · [Agent-01](#pb-6) | Sprint 10 | ToDo |
| Agent | <a id="pb-8"></a>Agent-03 | agent ethan — facilitate events | Ethan runs sdd-scrum events by calling the matching skills. | Ethan can run at least one named event (for example `sdd-plan-sprint`) via its skill and leave a verifiable change in the process artifact that event owns. | [`agent-ethan/agent-design.md`](./agent-ethan/agent-design.md) · [Skill-06](#pb-26) | Sprint 6 | ToDo |
| Agent | <a id="pb-9"></a>Agent-04 | agent ethan — governance artifacts | Ethan maintains process and tracking artifacts within the rules the guide names. | From a chat turn, ethan applies one small backlog refinement and one change-log entry without violating guide maintenance rules. | [`change-log.md`](./change-log.md) · [`agent-ethan/agent-design.md`](./agent-ethan/agent-design.md) | Sprint 5 | ToDo |
| Agent | <a id="pb-10"></a>Agent-05 | agent ethan — knowledgeable coach | Ethan coaches from the guide, practices, and knowledge trees (`adr/`, `knowledge/`). | Ethan answers a coaching question by citing the guide or practices (and knowledge when present) without inventing process rules. | [`sdd-scrum-guide.md`](./framework.seeds/templates/EN/sdd-scrum-guide.md) · [`sdd-scrum-practices.md`](./framework.seeds/templates/EN/sdd-scrum-practices.md) · [`artifacts-map.md`](./artifacts-map.md) | Sprint 10 | ToDo |
| Agent | <a id="pb-11"></a>Agent-06 | agent ethan — chat | Ethan replies from free-form chat input while staying inside harness and process boundaries. | A chat turn that is not an event verb still gets a useful reply grounded in live artifacts, without unauthorized file edits. | [`agent-ethan/agent-design.md`](./agent-ethan/agent-design.md) · [Agent-02](#pb-7) | Sprint 10 | ToDo |
| Agent | <a id="pb-17"></a>Agent-07 | agent ethan — pack receipt start gate | On start, Ethan reads only `{client_root}/framework.sdd.works.json`. Missing receipt or `pack_complete` not true is a fatal stop. He may set `pack_complete` to false when a later job needs a missing framework file. He does not set it to true. | A start without a true receipt sends the instructions URL and stops with no job list. A start with `pack_complete: true` continues into project-file load. Setting the flag false causes the next start to stop until install or update writes true. | [`agent-ethan/agent-design.md`](./agent-ethan/agent-design.md) §2.4 · [MCP-01](#pb-16) | Sprint 2 | ToDo |
| Agent | <a id="pb-42"></a>Agent-08 | Job: Start a new project | Ethan runs practices job 2 via `skill_start_project` after the pack receipt passes. | From a confirmed request, ethan opens `sdd-new-project`, leaves a verifiable `artifacts-map.md` and `status.md` under the artifacts root, and does not invent process rules. | [`sdd-scrum-practices.md`](./framework.seeds/templates/EN/sdd-scrum-practices.md) · [Skill-03](#pb-23) · [Agent-07](#pb-17) | Sprint 3 | ToDo |
| Agent | <a id="pb-43"></a>Agent-09 | Job: Update project settings | Ethan runs practices job 3 via `skill_update_project`. | From a confirmed request, ethan opens `sdd-update-project` and updates locale and/or artifacts-map without overwriting filled working copies unless the user confirms. | [`sdd-scrum-practices.md`](./framework.seeds/templates/EN/sdd-scrum-practices.md) · [Skill-04](#pb-24) | Sprint 4 | ToDo |
| Agent | <a id="pb-44"></a>Agent-10 | Job: Refine product backlog | Ethan runs practices job 4 via `skill_refine_pb`. That practices section is still unfilled. This PBI includes writing it. | From a confirmed request, ethan opens `sdd-refine-pb` and leaves a verifiable change in `product-backlog.md`. | [`sdd-scrum-practices.md`](./framework.seeds/templates/EN/sdd-scrum-practices.md) · [Skill-05](#pb-25) | Sprint 5 | ToDo |
| Agent | <a id="pb-45"></a>Agent-11 | Job: Sprint planning | Ethan runs practices job 5 via `skill_plan_sprint`. That practices section is still unfilled. This PBI includes writing it. | From a confirmed request, ethan opens `sdd-plan-sprint` and leaves a verifiable Sprint Backlog for the planned sprint. | [`sdd-scrum-practices.md`](./framework.seeds/templates/EN/sdd-scrum-practices.md) · [Skill-06](#pb-26) | Sprint 6 | ToDo |
| Agent | <a id="pb-46"></a>Agent-12 | Job: Report status | Ethan runs practices job 6 via `skill_update_status`. That practices section is still unfilled. This PBI includes writing it. | From a confirmed request, ethan opens `sdd-update-status` and leaves a verifiable update in `status.md`. | [`sdd-scrum-practices.md`](./framework.seeds/templates/EN/sdd-scrum-practices.md) · [Skill-07](#pb-27) | Sprint 7 | ToDo |
| Agent | <a id="pb-47"></a>Agent-13 | Job: Retrospective | Ethan runs practices job 7 via `skill_retrospective`. That practices section is still unfilled. This PBI includes writing it. | From a confirmed request, ethan opens `sdd-retrospective` and leaves a verifiable retrospective record per practices. | [`sdd-scrum-practices.md`](./framework.seeds/templates/EN/sdd-scrum-practices.md) · [Skill-08](#pb-28) | Sprint 8 | ToDo |
| Agent | <a id="pb-48"></a>Agent-14 | Job: Close / start sprint | Ethan runs practices job 8 via `skill_close_sprint`. That practices section is still unfilled. This PBI includes writing it. | From a confirmed request, ethan opens `sdd-close-sprint` and leaves a verifiable close or next-sprint change in `sprint-backlog.md` and `status.md`. | [`sdd-scrum-practices.md`](./framework.seeds/templates/EN/sdd-scrum-practices.md) · [Skill-09](#pb-29) | Sprint 9 | ToDo |
| Agent | <a id="pb-63"></a>Agent-15 | Pack file: agents/ethan.md | The ethan prompt shipped in the artifact repo. | `agents/ethan.md` exists in the artifact repo and installs to `{client_root}/agents/ethan.md`. | [Agent-01](#pb-6) · [MCP-01](#pb-16) | Sprint 2 | ToDo |
| Rule | <a id="pb-18"></a>Rule-01 | Rule: sdd-dod.mdc | Definition of Done rule file in the pack. | `sdd-dod.mdc` is in the artifact repo and installs under `{client_root}/rules/`. | [Spec-seeds-01](#pb-32) | Sprint 11 | ToDo |
| Rule | <a id="pb-19"></a>Rule-02 | Rule: sdd-incremental-delivery.mdc | Incremental delivery rule file in the pack. | `sdd-incremental-delivery.mdc` is in the artifact repo and installs under `{client_root}/rules/`. | [Spec-seeds-01](#pb-32) | Sprint 11 | ToDo |
| Rule | <a id="pb-20"></a>Rule-03 | Rule: sdd-realtime-status.mdc | Real-time status rule file in the pack. | `sdd-realtime-status.mdc` is in the artifact repo and installs under `{client_root}/rules/`. | [Spec-seeds-01](#pb-32) | Sprint 11 | ToDo |
| Skill | <a id="pb-21"></a>Skill-01 | Skill: sdd-atdd | ATDD skill folder in the pack. | `sdd-atdd/` with `SKILL.md` is in the artifact repo and installs under `{client_root}/skills/`. | — | Sprint 12 | ToDo |
| Skill | <a id="pb-22"></a>Skill-02 | Skill: sdd-tdd | TDD skill folder in the pack. | `sdd-tdd/` with `SKILL.md` is in the artifact repo and installs under `{client_root}/skills/`. | — | Sprint 12 | ToDo |
| Skill | <a id="pb-23"></a>Skill-03 | Skill: sdd-new-project | Start-a-new-project skill (`skill_start_project`). | `sdd-new-project/` with `SKILL.md` is in the artifact repo and installs under `{client_root}/skills/`. | [Agent-08](#pb-42) | Sprint 3 | ToDo |
| Skill | <a id="pb-24"></a>Skill-04 | Skill: sdd-update-project | Update-project-settings skill (`skill_update_project`). | `sdd-update-project/` with `SKILL.md` is in the artifact repo and installs under `{client_root}/skills/`. | [Agent-09](#pb-43) | Sprint 4 | ToDo |
| Skill | <a id="pb-25"></a>Skill-05 | Skill: sdd-refine-pb | Refine-product-backlog skill (`skill_refine_pb`). | `sdd-refine-pb/` with `SKILL.md` is in the artifact repo and installs under `{client_root}/skills/`. | [Agent-10](#pb-44) | Sprint 5 | ToDo |
| Skill | <a id="pb-26"></a>Skill-06 | Skill: sdd-plan-sprint | Sprint-planning skill (`skill_plan_sprint`). | `sdd-plan-sprint/` with `SKILL.md` is in the artifact repo and installs under `{client_root}/skills/`. | [Agent-11](#pb-45) | Sprint 6 | ToDo |
| Skill | <a id="pb-27"></a>Skill-07 | Skill: sdd-update-status | Report-status skill (`skill_update_status`). | `sdd-update-status/` with `SKILL.md` is in the artifact repo and installs under `{client_root}/skills/`. | [Agent-12](#pb-46) | Sprint 7 | ToDo |
| Skill | <a id="pb-28"></a>Skill-08 | Skill: sdd-retrospective | Retrospective skill (`skill_retrospective`). | `sdd-retrospective/` with `SKILL.md` is in the artifact repo and installs under `{client_root}/skills/`. | [Agent-13](#pb-47) | Sprint 8 | ToDo |
| Skill | <a id="pb-29"></a>Skill-09 | Skill: sdd-close-sprint | Close / start sprint skill (`skill_close_sprint`). | `sdd-close-sprint/` with `SKILL.md` is in the artifact repo and installs under `{client_root}/skills/`. | [Agent-14](#pb-48) | Sprint 9 | ToDo |
| Skill | <a id="pb-30"></a>Skill-10 | Skill: sdd-audit-artifacts | Audit-artifacts skill (`skill_audit_artifacts`). | `sdd-audit-artifacts/` with `SKILL.md` is in the artifact repo and installs under `{client_root}/skills/`. | — | Sprint 12 | ToDo |
| Skill | <a id="pb-64"></a>Skill-12 | Skill: sdd-update-specs | Keep the specs that a change touches aligned with the implementation. | `sdd-update-specs/SKILL.md` is in the artifact repo and installs under `{client_root}/skills/`. The skill names which spec files to update for the change and does not leave those files describing the previous behavior. | [Skill-13](#pb-65) | Sprint 12 | ToDo |
| Skill | <a id="pb-65"></a>Skill-13 | Skill: sdd-implement-feature | Common flow: update the relevant specs, then implement with TDD. | `sdd-implement-feature/SKILL.md` is in the artifact repo and installs under `{client_root}/skills/`. The skill runs spec update via [Skill-12](#pb-64), then the TDD cycle via [Skill-02](#pb-22), and finishes with specs and code describing the same behavior. | [Skill-12](#pb-64) · [Skill-02](#pb-22) | Sprint 12 | ToDo |
| Spec-seeds | <a id="pb-32"></a>Spec-seeds-01 | Seed: project-constants.md | Lookup file for path names, skill keys, and rule keys. Not inside a locale folder. | The user has reviewed and confirmed this seed. It is stored in the seed tree. Associated specs are updated. The whole seed tree has been cross-reviewed and is consistent. | [MCP-01](#pb-16) | Sprint 2 | ToDo |
| Spec-seeds | <a id="pb-33"></a>Spec-seeds-02 | Seed: sdd-scrum-guide.md | Framework guide for every project: names and meaning. It does not take what, how, and when from practices. | The user has reviewed and confirmed this seed. It is stored in the seed tree. Associated specs are updated. The whole seed tree has been cross-reviewed and is consistent. | [MCP-01](#pb-16) · [i18n-01](#pb-67) | Sprint 1 | Done |
| Spec-seeds | <a id="pb-34"></a>Spec-seeds-03 | Seed: sdd-scrum-practices.md | Framework practices for every project: what, how, and when. It does not redefine guide terms. Jobs 4–8 are filled under [Agent-10](#pb-44)–[Agent-14](#pb-48). | The user has reviewed and confirmed this seed. It is stored in the seed tree. Associated specs are updated. The whole seed tree has been cross-reviewed and is consistent. | [MCP-01](#pb-16) · [i18n-01](#pb-67) | Sprint 1 | Done |
| Spec-seeds | <a id="pb-35"></a>Spec-seeds-04 | Seed: artifacts-map.md | Generic artifacts-map starter for a new project. | The user has reviewed and confirmed this seed. It is stored in the seed tree. Associated specs are updated. The whole seed tree has been cross-reviewed and is consistent. | [MCP-01](#pb-16) · [i18n-02](#pb-68) | Sprint 3 | ToDo |
| Spec-seeds | <a id="pb-36"></a>Spec-seeds-05 | Seed: product-backlog.md | Example product backlog a new project copies. Not this repo's product backlog. | The user has reviewed and confirmed this seed. It is stored in the seed tree. Associated specs are updated. The whole seed tree has been cross-reviewed and is consistent. | [MCP-01](#pb-16) · [i18n-02](#pb-68) | Sprint 5 | ToDo |
| Spec-seeds | <a id="pb-37"></a>Spec-seeds-06 | Seed: sprint-backlog.md | Generic sprint-backlog starter for a new project. | The user has reviewed and confirmed this seed. It is stored in the seed tree. Associated specs are updated. The whole seed tree has been cross-reviewed and is consistent. | [MCP-01](#pb-16) · [i18n-02](#pb-68) | Sprint 6 | ToDo |
| Spec-seeds | <a id="pb-38"></a>Spec-seeds-07 | Seed: status.md | Generic status starter for a new project. | The user has reviewed and confirmed this seed. It is stored in the seed tree. Associated specs are updated. The whole seed tree has been cross-reviewed and is consistent. | [MCP-01](#pb-16) · [i18n-02](#pb-68) | Sprint 3 | ToDo |
| Spec-seeds | <a id="pb-39"></a>Spec-seeds-08 | Seed: change-log.md | Generic change-log starter for a new project. | The user has reviewed and confirmed this seed. It is stored in the seed tree. Associated specs are updated. The whole seed tree has been cross-reviewed and is consistent. | [MCP-01](#pb-16) · [i18n-02](#pb-68) | Sprint 5 | ToDo |
| Spec-seeds | <a id="pb-40"></a>Spec-seeds-09 | Seed: architecture.md | Generic architecture starter for a new project. | The user has reviewed and confirmed this seed. It is stored in the seed tree. Associated specs are updated. The whole seed tree has been cross-reviewed and is consistent. | [MCP-01](#pb-16) · [i18n-03](#pb-69) | Sprint 14 | ToDo |
| Spec-seeds | <a id="pb-41"></a>Spec-seeds-10 | Seed: deployment.md | Generic deployment starter for a new project. | The user has reviewed and confirmed this seed. It is stored in the seed tree. Associated specs are updated. The whole seed tree has been cross-reviewed and is consistent. | [MCP-01](#pb-16) · [i18n-03](#pb-69) | Sprint 14 | ToDo |
| Spec-seeds | <a id="pb-66"></a>Spec-seeds-11 | Seed: .secrets | Secrets file named in the guide. The seed holds names and where values live. It holds no secret values. | The user has reviewed and confirmed this seed. It is stored in the seed tree. Associated specs are updated. The whole seed tree has been cross-reviewed and is consistent. | [MCP-01](#pb-16) · [Spec-seeds-10](#pb-41) · [i18n-03](#pb-69) | Sprint 14 | ToDo |
| MCP | <a id="pb-16"></a>MCP-01 | Installer: full pack + receipt | `sdd_install_framework` and `sdd_update_framework` copy every top-level folder from [ethanhuangcst/framework.sdd.works](https://github.com/ethanhuangcst/framework.sdd.works) onto `{client_root}`. When the copy finishes they write `{client_root}/framework.sdd.works.json` with `pack_complete: true`, `installed_at`, `package_version`, and `files`. HTTP returns a package that includes the receipt; stdio writes the same file after the copy. `.sdd-installed.json` stays the merge ledger. | After install or update, every top-level folder from the artifact repo is under `{client_root}`, and `framework.sdd.works.json` exists with `pack_complete: true` and a `files` list that matches what was written. | [`mcp/mcp-design.md`](./mcp/mcp-design.md) · [`agent-ethan/agent-design.md`](./agent-ethan/agent-design.md) §2.4 | Sprint 2 | ToDo |
| Web-portal | <a id="pb-15"></a>Web-portal-01 | Instructions: per-client agent call-up | The instructions page gains a section on how each agent tool calls up an agent. Research comes before the section is written. | The section states the call-up that each covered client’s own docs show (Cursor `/ethan`, TRAE CN `@`, and the others only after research). It cites those sources. It does not describe a gesture the client docs do not show. | [`agent-ethan/agent-design.md`](./agent-ethan/agent-design.md) · [`mcp/client.paths.md`](./mcp/client.paths.md) | Sprint 13 | ToDo |
| Web-portal | <a id="pb-49"></a>Web-portal-02 | Instructions: install, receipt, fatal stop | The instructions page covers install and update, `{client_root}/framework.sdd.works.json`, and the fatal stop when `pack_complete` is not true. | A reader can follow the page to install or update, find the receipt path, and know that Ethan stops without a true flag. | [Web-portal-01](#pb-15) · [MCP-01](#pb-16) · [Agent-07](#pb-17) | Sprint 13 | ToDo |
| Web-portal | <a id="pb-50"></a>Web-portal-03 | Website shows instructions | The public site at framework.sdd.works shows the instructions page. No new portal features. | Visiting the instructions URL on the live site shows the current instructions content for install, receipt, call-up, and fatal stop. | [Web-portal-01](#pb-15) · [Web-portal-02](#pb-49) | Sprint 13 | ToDo |
| i18n | <a id="pb-67"></a>i18n-01 | Framework definition locales | HanS and HanT bodies of the framework-definition seeds match the EN meaning. Files: `sdd-scrum-guide.md`, `sdd-scrum-practices.md`, and any other framework-definition prose placed in the locale template folders. | HanS is Simplified Chinese and HanT is Traditional Chinese. Neither locale file is the English text under a locale folder name. [Spec-seeds-02](#pb-33) and [Spec-seeds-03](#pb-34) own the EN file only. | [`sdd-scrum-guide.md`](./framework.seeds/templates/EN/sdd-scrum-guide.md) · [`sdd-scrum-practices.md`](./framework.seeds/templates/EN/sdd-scrum-practices.md) | Sprint 15 | ToDo |
| i18n | <a id="pb-68"></a>i18n-02 | Process artifact locales | HanS and HanT starters for the five process artifacts match the EN starter meaning. Files: `product-backlog.md`, `sprint-backlog.md`, `status.md`, `change-log.md`, `artifacts-map.md`. | Each of the five filenames has a HanS body and a HanT body that are translations of the EN starter, not this repo's filled `specs/` files. [Spec-seeds-04](#pb-35) through [Spec-seeds-08](#pb-39) own the EN starter only. | [Spec-seeds-04](#pb-35) · [Spec-seeds-05](#pb-36) · [Spec-seeds-06](#pb-37) · [Spec-seeds-07](#pb-38) · [Spec-seeds-08](#pb-39) | Sprint 15 | ToDo |
| i18n | <a id="pb-69"></a>i18n-03 | Engineering artifact locales | HanS and HanT starters for the engineering artifacts match the EN starter meaning. Files: `architecture.md`, `{model}-stories`, `{model}-design.md`, `{model}-test.md`, `deployment.md`, `.secrets`. | Each named file has a HanS body and a HanT body that are translations of the EN starter. Stories, design, and test have no Spec-seeds row; this PBI owns their locale starters. [Spec-seeds-09](#pb-40), [Spec-seeds-10](#pb-41), and [Spec-seeds-11](#pb-66) own the EN architecture, deployment, and `.secrets` starters. The `.secrets` starter still contains no secret values. | [Spec-seeds-09](#pb-40) · [Spec-seeds-10](#pb-41) · [Spec-seeds-11](#pb-66) | Sprint 15 | ToDo |

---------

## Change record

| Date | Change |
| --- | --- |
| 2026-09-21 | Replaced the sample-product draft with Phase 2 items SPEC-01, ARTIFACTS-01, COACH-01, and TEMPLATES-01. |
| 2026-09-21 | Split Phase 2: practices SSOT, four templates, six process skills, coach-ethan (presence TBD), Instructions page. |
| 2026-09-22 | Priority: `sdd-scrum-guide.md` as framework SSOT; coach-ethan as three MVPs (Sprint 2–4); other themes cleared from Sprint. |
| 2026-09-22 | coach-ethan presence: local Cursor agent ([D1](./sprint-backlog.md#rid-d1) Closed). Design at [`agent-ethan/agent-design.md`](./agent-ethan/agent-design.md). |
| 2026-09-23 | Dropped HTML table width hacks for pipe Markdown. Sprint backlog aligned to Phase 2 scope map. |
| 2026-09-23 | Product Backlog rows match Requirements (specs, ethan, harness) in the pipe table (`#`, Category, Parent, PBI, Description, Acceptance criteria, Related, Sprint, Status). |
| 2026-09-23 | Removed HTML id anchors. Added pb-14 Initialize framework.sdd.works v2 POC (Sprint 1). |
| 2026-09-24 | Added pb-15 Instructions: per-client agent call-up. Research before writing the section. Not scheduled. |
| 2026-09-24 | Consolidated backlog to pb-50: installer full pack + receipt (pb-16), ethan receipt start gate (pb-17), per-rule / per-skill / per-seed / per-job PBIs, instructions install page (pb-49), website (pb-50). pb-12 and pb-13 stay parent bundles. Not scheduled. |
| 2026-09-24 | Requirements rewritten in pb order. Live spec files split into pb-51–pb-62. Pack agent file is pb-63. Row anchors restored so `#pb-N` links resolve. |
| 2026-09-24 | Added skills pb-64 `update-specs` and pb-65 `implement-feature` (spec update, then TDD). Not scheduled. |
| 2026-09-24 | Requirements give `project-constants.md` its own heading. It is not a locale seed. |
| 2026-09-24 | Category is one word. Added PBI Code. Removed parent bundles pb-2, pb-3, pb-4, pb-5, pb-12, and pb-13. Those numbers stay unused. |
| 2026-09-24 | Removed the `#` column and the Journey section (pb-14). Skill folders use the `sdd-` prefix, including `sdd-atdd`, `sdd-tdd`, `sdd-update-spec`, and `sdd-implement-feature`. |
| 2026-09-24 | Removed `sdd-update-artifacts` (pb-31). Kept `sdd-update-specs` (Skill-12). pb-31 stays unused. |
| 2026-09-24 | Removed Spec-02–Spec-13 (pb-51–pb-62). `specs/` in this repo is process, not the pack. Guide acceptance is Spec-seeds-02. Table rows are grouped by category. |
| 2026-09-24 | Scope item 4 points at practices §3.1 for same-category rows. Sprint shape is [`framework-design.md`](./framework.seeds/templates/EN/framework-design.md). |
| 2026-09-24 | The product backlog column stays `Category`. Sprint items use `Type`. Same-category order is in practices §3.1. |
| 2026-09-24 | Sprint shape file renamed to [`framework-design.md`](./framework.seeds/templates/EN/framework-design.md). `Feature` is a delivered capability. `Task` is supporting work. |
| 2026-09-24 | Added [Spec-seeds-11](#pb-66) `.secrets` (guide name). Scheduled [Spec-seeds-08](#pb-39) on Sprint 5 and [Spec-seeds-09](#pb-40), [Spec-seeds-10](#pb-41), and Spec-seeds-11 on Sprint 14. |
| 2026-09-25 | Added category i18n: [i18n-01](#pb-67) framework definition, [i18n-02](#pb-68) five process artifacts, [i18n-03](#pb-69) engineering artifacts. Sprint 15. Spec-seeds rows stay the file-existence owners. |
| 2026-09-25 | HanS and HanT bodies moved off Spec-seeds acceptance. Spec-seeds own the EN starter. Sprint 1 HanS guide, HanT guide, and HanS/HanT practices are Sprint 15. |
| 2026-09-25 | Spec-seeds acceptance is the same four checks for every row: user review, stored in `specs/framework.seeds/`, associated specs updated, seed tree cross-reviewed. |
| 2026-09-25 | Sprint 1 closed. Spec-seeds-02 and Spec-seeds-03 Done. Phase 1 archive path is `phase1-process-specs/`. |
