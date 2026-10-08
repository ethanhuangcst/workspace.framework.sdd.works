# Product overview — [framework.sdd.works](http://framework.sdd.works)

> Type: Framework (process) artifact of framework.sdd.works
> as_of: 2026-10-08
> [Definition](../pack.framework.sdd.works/templates/sdd-scrum-practices.md#product-backlogmd)

---

## Index

- [Product overview](#product-overview)
- [Definition of Done](#definition-of-done)
- [Requirements](#requirements)
  - [framework](#component-framework)
  - [mcp](#mcp)
  - [web-portal](#web-portal)
  - [lite installer](#category-framework-http-lite-installer-through-local-agent)
- [Product Backlog](#product-backlog)
- [Change record](#change-record)

---

# Product overview

- You use framework.sdd.works to install and update an SDD framework pack in your AI client through a web portal and a local MCP (Model Context Protocol) installer.
- Phase 1 is closed.
- Phase 2 ships the guide, practices, project templates, ethan, rules, and skills.
- Files under `specs/` in this repo are process assets for building the pack.
- Install leaves the files under `specs/` in this repo.

[Back to top](#index)

---



<a id="definition-of-done"></a>

# Definition of Done

This section lists additional product checks on top of the standard Definition of Done in `[sdd-dod.mdc](../pack.framework.sdd.works/rules/sdd-dod.mdc)`. Mark a PBI or SBI **Done** only when every standard check and every additional check here passes. `[sprint-backlog.md](./sprint-backlog.md)` links here instead of duplicating this list ([ADR-098](./adr/ADR-098-sprint-backlog-dod-link-product-backlog.md)).

- Quality meets [agent test](./framework/framework-tests.md) · [MCP test](./mcp/mcp-tests.md) · [portal test](./admin-portal/app-tests.md)

[Back to top](#index)

---



# Requirements



<a id="component-framework"></a>

## Component: framework

### agents

#### ethan

- <a id="pb-6"></a>[Agent-01](#pb-6) Local Cursor agent
  - Ethan runs as a local Cursor agent.
  - Proof of concept is closed ([D1](./sprint-backlog.md#rid-d1) Closed).
  - The pack includes the ethan prompt in the seed tree.
  - Pack publish is go-live, not this row.
- <a id="pb-8"></a>[Agent-02](#pb-8) Skill call for a named job
  - `ethan.md` lists each named job from `constants.json` and routes the chat to the matching pack skill folder.
  - Ethan does not embed skill steps in the agent file.
  - Where the project is comes from `sdd-review-status`.
  - Ethan writes a project file only after the user confirms.
- <a id="pb-10"></a>[Agent-03](#pb-10) Guiding proposals from framework knowledge
  - Ethan reads the framework artifacts and knowledge, including `coach-knowledge.md` per [ADR-106](./adr/ADR-106-coach-knowledge-file.md).
  - Ethan gives guiding proposals in chat.
- <a id="pb-17"></a>[Agent-04](#pb-17) Agent ethan onboard with pack receipt start gate
  - On start, Ethan reads only `{client_root}/.sdd-installed.json`.
  - Missing ledger or `pack_complete` not true is a fatal stop.
  - He may set `pack_complete` to false when a later job needs a missing framework file.
  - He does not set it to true.




### skills

- <a id="pb-21"></a>[Skill-01](#pb-21) Pack skill atdd-expert
  - The pack ships `pack.framework.sdd.works/skills/atdd-expert/` with `SKILL.md` and `reference.md` for user stories and Gherkin acceptance criteria. `sdd-spec-to-build` may load it for stories files.
- <a id="pb-24"></a>[Skill-03](#pb-24) Pack skill sdd-update-project
  - The pack includes the update-project skill (`skill_update_project`).
  - The job is Update project settings. [ADR-079](./adr/ADR-079-one-job-update-project.md).
  - Task 8 recommends `{artifacts_root}/.secrets` for products that use database, API, or auth secrets; copies the locale seed when missing after confirm; adds the path to `artifacts-map.json` when the Confirm summary kept that line. Empty workspace: one yes-or-no question. Spec: [framework-stories § sdd-update-project](./framework/framework-stories.md#sdd-update-project), **CE-SKILL-22**.
- <a id="pb-25"></a>[Skill-04](#pb-25) Pack skill sdd-refine-backlog
  - The pack includes the refine-product-backlog skill (`skill_refine_pb`).
- <a id="pb-26"></a>[Skill-05](#pb-26) Pack skill sdd-plan-sprint
  - The pack includes the sprint-planning skill (`skill_plan_sprint`).
- <a id="pb-28"></a>[Skill-06](#pb-28) Pack skill sdd-retrospective
  - The pack includes the retrospective skill (`skill_retrospective`).
  - The record uses three headings: Learnings, Opportunities, and Future actions.
- <a id="pb-29"></a>[Skill-07](#pb-29) Pack skill sdd-close-sprint **Retired**
  - No pack seed. Sprint open and close stay in practices and planning skills ([ADR-076](./adr/ADR-076-review-status-one-skill.md)). Sprint 6 [feature-41](./sprint-backlog.md#sprint-6) records retirement **Done**.
- <a id="pb-30"></a>[Skill-08](#pb-30) Pack skill sdd-audit-artifacts
  - After the pack gate the skill reads `{workspace}/artifacts-map.json` and opens each stored path as `{workspace}/<path>`.
  - It returns one verdict: `Uninitialized`, `Index broken`, or `Usable`.
  - It reports paths opened, paths that failed, and whether `locale` is empty.
  - It does not write a project file or the ledger.
- <a id="pb-64"></a>[Skill-09](#pb-64) Pack skill sdd-update-specs
  - The skill keeps the specs that a change touches aligned with the implementation.
- <a id="pb-80"></a>[Skill-11](#pb-80) Pack skill sdd-spec-to-build
  - The pack ships `pack.framework.sdd.works/skills/sdd-spec-to-build/` with `SKILL.md` and `readiness.md`.
  - The skill brings one feature or SBI to engineering readiness before a build: applicable stories, tests, UI specs, and technical design.
  - It loads `atdd-expert`, `testing-expert`, `sdd-update-specs`, `frontend-designer`, `frontend-developer`, and `fullstack-engineer` per job. After readiness confirm, it proposes domain implement skills per [ADR-108](./adr/ADR-108-no-pack-sdd-build-skill.md). It does not implement the feature and does not ship `sdd-build`.
  - [ADR-085](./adr/ADR-085-sdd-spec-to-build.md). Supersedes [ADR-066](./adr/ADR-066-sdd-design-before-implementation.md).
- <a id="pb-86"></a>[Skill-12](#pb-86) Pack skill sdd-review-status
  - The skill compares the board with the current sprint's named work, lists each mismatch, records each choice, and writes once (`skill_get_status`).
- <a id="pb-87"></a>[Skill-13](#pb-87) Pack skill sdd-create-skill
  - The skill creates or revises a skill (`skill_create_skill`).
  - It writes `{client_root}/{skills_dir}/<name>/SKILL.md` after confirm.
  - Pack folder `sdd-create-skill` avoids Cursor built-in `create-skill`. [ADR-092](./adr/ADR-092-pack-authoring-skill-sdd-prefix.md).
  - It is not a practices job.
- <a id="pb-89"></a>[Skill-14](#pb-89) Pack skill improve-prompt
  - The pack ships `pack.framework.sdd.works/skills/improve-prompt/` with `SKILL.md` and `examples.md`.
  - The skill improves a draft prompt for copy-paste use. It is advisory only and does not execute the task.
  - The body follows [TRUE AGENT](./framework/framework-design.md#true-agent): Capabilities, Knowledge, Limits, and Anti-patterns. It does not match ECC or other fixed component catalogs.
  - Frontmatter is `name` and `description` only. Description triggers are English phrases; the reply matches the user's input language.
  - No row in `constants.json`. Not a practices job. [ADR-099](./adr/ADR-099-improve-prompt-skill-name.md).
- <a id="pb-93"></a>[Skill-15](#pb-93) Pack skill sdd-build-agent
  - The pack includes the build-agent skill (`skill_build_agent`).
  - The skill writes one agent file under `{client_root}/{agents_dir}/` after confirm.
  - Pack folder `sdd-build-agent`. [ADR-092](./adr/ADR-092-pack-authoring-skill-sdd-prefix.md).
- <a id="pb-94"></a>[Skill-16](#pb-94) Pack skill sdd-create-rule
  - The pack includes the create-rule skill (`skill_create_rule`).
  - The skill writes one rule file under `{client_root}/{rules_dir}/` after confirm.
  - Pack folder `sdd-create-rule` avoids Cursor built-in `create-rule`. [ADR-092](./adr/ADR-092-pack-authoring-skill-sdd-prefix.md).
- <a id="pb-113"></a>[Skill-17](#pb-113) Pack skill frontend-designer
  - The pack ships `pack.framework.sdd.works/skills/frontend-designer/` with `SKILL.md` and `LICENSE.txt` ([ADR-105](./adr/ADR-105-frontend-designer-pack-skill-name.md)).
  - The skill guides distinctive UI design for new screens or redesigns: typography, palette, layout, motion, and subject-grounded direction. Minimal SDD coupling; optional load from `sdd-spec-to-build` for UI SBIs.
  - Production UI names **i18n-support** and **common-test-strategy** when those rules exist on `{client_root}`; the skill does not ship hard-coded product copy as the contract.
  - Pack folder and frontmatter `name`: `frontend-designer`. Upstream craft may refresh from [anthropics/skills frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design). No `constants.json` row.
  - Not a numbered practices job until practices assign one.
- <a id="pb-114"></a>[Skill-18](#pb-114) Pack skill testing-expert
  - The pack ships `pack.framework.sdd.works/skills/testing-expert/` with `SKILL.md`, `browser.md`, `LICENSE.txt`, report templates under `templates/`, `scripts/with_server.py`, and `examples/` ([ADR-102](./adr/ADR-102-testing-expert-pack-skill-name.md)).
  - The skill does five jobs for one feature: design the testing strategy, define methods and tools, create the tests, run them, and write the report. Running tests that already exist is only the run step.
  - Layers follow the test pyramid in **common-test-strategy** when that rule is present: unit and component (about 70%), integration and API (about 20%), browser end-to-end (about 10%). Each run covers the happy path and one failure path.
  - Default tools, with the project's existing choice as the escape hatch: Vitest or Jest plus Testing Library for JavaScript unit and component tests; pytest for Python unit tests; HTTP calls against the app for API tests; Playwright for browser E2E (server helper, screenshot, console, role or test-id selectors) bundled in the seed. The skill does not depend on `webapp-testing` or other testing skills.
  - The report is one short table: check name, pass or fail or skip, and evidence (command, screenshot path, or log line), plus one summary line of counts.
  - Minimal SDD coupling. The skill does not require a sprint backlog, `artifacts-map.json`, or process files. When `test-strategy.md` exists, update it with the strategy after the user confirms. When it does not, state the strategy in chat and write tests in the project.
  - The skill does not mark a backlog row **Done** unless the user asks.
  - Pack folder and frontmatter `name`: `testing-expert`. No `constants.json` row. Not a practices job until practices assign one.
  - `sdd-spec-to-build` may load this skill when a feature needs tests. The skill runs without that load.
- <a id="pb-115"></a>[Skill-19](#pb-115) Pack skill frontend-developer
  - The pack ships `pack.framework.sdd.works/skills/frontend-developer/` with `SKILL.md` and optional `next-cache-components.md` ([ADR-103](./adr/ADR-103-frontend-developer-pack-skill-name.md)).
  - The skill is a strong frontend implementation skill: components, pages, client state, data loading, forms, accessibility, and performance in the project's UI stack. It is not a Next.js cache-only guide.
  - Minimal framework dependency. The skill does not require a sprint backlog, `artifacts-map.json`, or process files. `sdd-spec-to-build` may load it for a UI SBI. The skill runs without that load. No `constants.json` row.
  - Visual direction stays on [Skill-17](#pb-113). Verification stays on [Skill-18](#pb-114). The body follows [TRUE AGENT](./framework/framework-design.md#true-agent): capabilities, knowledge, and limits. The host picks the order.
  - It follows **i18n-support** for user-facing strings and **friendly-language** for interface copy when those rules exist on `{client_root}`.
  - Pack folder and frontmatter `name`: `frontend-developer`. Not a practices job until practices assign one.
  - The personal folder `~/.cursor/skills/frontend-developer/` is a Cache Components guide (`name`: `cache-components`). The pack seed may reuse its cache facts as one knowledge file. It is not a copy of that file as the whole skill.
- <a id="pb-116"></a>[Skill-20](#pb-116) Pack skill fullstack-engineer
  - The pack ships `pack.framework.sdd.works/skills/fullstack-engineer/` with `SKILL.md` ([ADR-104](./adr/ADR-104-fullstack-engineer-pack-skill-name.md)).
  - The skill builds one web feature across the frontend, the backend API, the database, and auth in the stack the project already uses. Visual direction stays on [Skill-17](#pb-113). UI-only work stays on [Skill-19](#pb-115). Verification stays on [Skill-18](#pb-114).
  - Minimal SDD coupling. The body follows [TRUE AGENT](./framework/framework-design.md#true-agent). It does not default to a pinned web stack in the skill text.
  - It follows **i18n-support** for user-facing strings and **common-test-strategy** for tests when those rules exist on `{client_root}`.
  - Pack folder and frontmatter `name`: `fullstack-engineer`. No `constants.json` row until a later confirm. Not a practices job until practices assign one.
  - Distinct from the personal folder `~/.cursor/skills/Fullstack/`. The pack seed is not a copy of that file unless a later confirm says so.
- <a id="pb-117"></a>[Skill-21](#pb-117) Pack skill ai-architect
  - The pack ships `pack.framework.sdd.works/skills/ai-architect/` with `SKILL.md` and `terms.md`.
  - The skill understands current AI terminology, concepts, technologies, techniques, and practices. It checks current provider and standards docs before it treats a term or a product as current.
  - The skill understands current AI solutions and architectures, including enterprise scale: model serving, gateways, evaluation, governance, cost, and rollout. Retrieval design stays on [Skill-23](#pb-119). MCP (Model Context Protocol) server design stays on [Skill-22](#pb-118).
  - The skill proposes one recommended design from the facts in the thread and in the project. It states constraints, options, what ships first, and what is costly to reverse. It does not invent prices, quotas, or benchmark numbers.
  - The skill returns a design proposal. It writes the project's design spec only after the user confirms.
  - Confirmed architect jobs in the seed: choose the lightest style that meets the constraints, compare build and buy, add enterprise controls only when scale or regulation requires them, gate a release on an evaluation suite with rollback, treat retrieved text and tool output as untrusted, size cost from stated constraints, and state the operating design without running an incident. Terms live in `terms.md`.
  - Pack folder `ai-architect`. No `constants.json` row until a later confirm. Not a practices job until practices assign one.
  - Distinct from the personal folder `~/.cursor/skills/ai-architect-expert/`. The pack seed is not a copy of that file unless a later confirm says so.
- <a id="pb-118"></a>[Skill-22](#pb-118) Pack skill mcp-expert
  - The pack ships `pack.framework.sdd.works/skills/mcp-expert/` with `SKILL.md`.
  - The skill understands current MCP (Model Context Protocol) patterns: tools, resources, prompts, transports, tool-surface shape, annotations, elicitation, MCP Apps, and MCPB (a local bundle). It checks the current specification and SDK docs before it treats a pattern or a method name as current.
  - The skill understands where a person finds an existing server. It searches the official MCP Registry at `registry.modelcontextprotocol.io` first, then the client directory and community directories a fresh search names. It does not keep a ranked marketplace list inside the seed.
  - The skill proposes one solution from the facts in the thread and in those sources: reuse a published server, configure one, or build one. It states constraints, options, what ships first, and what is costly to reverse. It writes code or a design file only after the user confirms.
  - Other architect jobs in the same skill: tool and schema design, transport and auth choice, client config, a failed connection, and registry publish metadata. A wider AI system stays on [Skill-21](#pb-117). A web feature around the server stays on [Skill-20](#pb-116). Test runs stay on [Skill-18](#pb-114).
  - Pack folder `mcp-expert`. No `constants.json` row until a later confirm. Not a practices job until practices assign one.
  - Distinct from `~/.cursor/skills/mcp-server-patterns/` and from public builder skills such as `mcp-builder` and `build-mcp-server`. The pack seed is not a copy of those files.
- <a id="pb-119"></a>[Skill-23](#pb-119) Pack skill rag-expert
  - The pack ships `pack.framework.sdd.works/skills/rag-expert/` with `SKILL.md` and `reference.md`.
  - The skill understands current RAG (retrieval-augmented generation) patterns and architectures: ingestion and parsing, chunking, embeddings, vector and keyword indexes, hybrid search, reranking, GraphRAG, agentic or corrective retrieval, grounding with citations, and evaluation. It checks current sources before it treats a pattern, model name, or default as current. It does not keep a ranked model or product table inside the seed.
  - The skill understands where a person finds RAG products and solutions, paid and free: vector stores, hosted file search, rerankers, and evaluation tools. It searches current vendor and open-source docs in the thread. It does not keep a marketplace ranking inside the seed.
  - The skill proposes one architecture from the facts in the thread and in those sources. It states constraints, options, what ships first, and what is costly to reverse. It may recommend skipping a custom vector stack when long context, hosted file search, tools, or a structured store fits. It writes code or a design file only after the user confirms.
  - Other architect jobs in the same skill: corpus and access control, freshness and re-index, retrieval failure diagnosis, abstention when passages do not answer, and an evaluation set before tuning. A wider AI system stays on [Skill-21](#pb-117). A web feature around the assistant stays on [Skill-20](#pb-116). Test runs stay on [Skill-18](#pb-114).
  - Provider keys are read by name from `.secrets`. A production path does not return fabricated retrieval results.
  - Pack folder `rag-expert`. No `constants.json` row until a later confirm. Not a practices job until practices assign one.
  - Distinct from `~/.cursor/skills/rag-implementation/` and from public skills such as `rag-system`, `rag-architect`, `ai-rag`, `building-rag-pipelines`, and `langchain-rag`. The pack seed is not a copy of those files.
- <a id="pb-120"></a>[Skill-24](#pb-120) Pack skill sdd-retrospective
  - [Skill-06](#pb-28) **Done** (Sprint 6) shipped the first `sdd-retrospective` seed. This PBI brings the seed to the current pack skill bar for Sprint 8.
  - The pack ships or revises `pack.framework.sdd.works/skills/sdd-retrospective/` (`SKILL.md` and sibling files per [sdd-pack-authoring](../pack.framework.sdd.works/rules/sdd-pack-authoring.mdc)).
  - The skill runs after DoD, at sprint-end, or on demand: classify lessons as ADR or knowledge, append the sprint **Retrospective** block, and report **Retrospective Summary**. **Close confirm** for backlog **Done** stays on `sdd-dod.mdc`, not on retrospective alone ([ADR-097](./adr/ADR-097-done-runs-retrospective.md)).
  - **CE-SKILL-10** passes. [Agent-02](#pb-8) lists the named job when [task-01](./sprint-backlog.md#sprint-8) updates `ethan.md`.
  - Constants key `skill_retrospective` stays on [Spec-seeds-03](#pb-32). Pack folder `sdd-retrospective`.



### rules

- <a id="pb-18"></a>[Rule-01](#pb-18) Pack rule sdd-dod.mdc
  - The pack includes the Definition of Done rule file.
- <a id="pb-19"></a>[Rule-02](#pb-19) Pack rule sdd-incremental-delivery.mdc
  - The pack includes the incremental delivery rule file.
- <a id="pb-20"></a>[Rule-03](#pb-20) Pack rule sdd-realtime-status.mdc
  - WIP checkpoints for the five process files: draft, confirm, write. Done stays on `sdd-dod.mdc`. [ADR-096](./adr/ADR-096-sdd-realtime-status-rule-name.md) ([ADR-093](./adr/ADR-093-keep-update-wip-rule.md) charter). Unprefixed `realtime-status.mdc` stays retired ([ADR-091](./adr/ADR-091-retire-realtime-status-rule.md)).
- <a id="pb-95"></a>[Rule-04](#pb-95) Pack rule friendly-language.mdc
  - The pack includes `rules/friendly-language.mdc`.
  - The constants key is `friendly-language`.
  - The rule replaces personal `writing-style.mdc` and loads with `alwaysApply: true`.
  - Skills link this file for wording checks. They do not copy the check list.




### template seeds



#### EN



##### Core artifacts

- <a id="pb-33"></a>[Spec-seeds-01](#pb-33) Seed pack-scrum-in-sdd.md
  - The seed is the AI-read framework guide: names and meaning. [ADR-126](./adr/ADR-126-ai-read-pack-templates-and-pack-scrum-in-sdd-filename.md).
  - Authoring: `pack.framework.sdd.works/templates/pack-scrum-in-sdd.md`. After install: `{client_root}/templates/framework.sdd.works/pack-scrum-in-sdd.md`.
  - It sits beside `constants.json`. It is not inside a locale folder. It is not copied into the workspace.
  - It does not take what, how, and when from practices. Human portal copy is `content/scrum-in-sdd/scrum-in-sdd.{locale}.md` ([Web-portal-12](#pb-81)).
- <a id="pb-34"></a>[Spec-seeds-02](#pb-34) Seed sdd-scrum-practices.md
  - The seed is the AI-read framework practices: what, how, and when.
  - Authoring: `pack.framework.sdd.works/templates/sdd-scrum-practices.md`. After install: `{client_root}/templates/framework.sdd.works/sdd-scrum-practices.md`.
  - It sits beside `constants.json` and `pack-scrum-in-sdd.md`. It is not copied into the workspace.
  - It does not redefine guide terms. Workflow steps live in skills.
- <a id="pb-32"></a>[Spec-seeds-03](#pb-32) Seed constants.json
  - The seed is the lookup file for path names, skill keys, and rule keys.
  - It is not inside a locale folder.
  - After install it lives on `{client_root}/templates/framework.sdd.works/constants.json`. [ADR-081](./adr/ADR-081-constants-json.md).
- <a id="pb-35"></a>[Spec-seeds-04](#pb-35) Project file artifacts-map.json
  - The project path file is `{workspace}/artifacts-map.json`.
  - There is no template seed.
  - The example is in the artifacts-map section of `sdd-scrum-practices.md`. [ADR-080](./adr/ADR-080-no-artifacts-map-seed.md). [ADR-082](./adr/ADR-082-artifacts-map-json.md). Optional `adr` and `knowledge` keys name directory roots. [ADR-090](./adr/ADR-090-adr-knowledge-map-roots.md).



##### Process artifacts

- <a id="pb-36"></a>[Spec-seeds-05](#pb-36) Seed product-backlog.md
  - The seed is the placeholder template product backlog a new project copies.
  - It is not this repo's product backlog.
- <a id="pb-37"></a>[Spec-seeds-06](#pb-37) Seed sprint-backlog.md
  - The seed is the generic sprint-backlog starter for a new project.
- <a id="pb-38"></a>[Spec-seeds-07](#pb-38) Seed status.md
  - The seed is the status starter for a new project.
  - Column and row rules are in [status.md](../pack.framework.sdd.works/templates/sdd-scrum-practices.md#statusmd).
- <a id="pb-39"></a>[Spec-seeds-08](#pb-39) Seed changes-log.md
  - The seed is the generic change-log starter for a new project.
  - A conclusion record: what changed, why, and how it was verified.
- <a id="pb-84"></a>[Spec-seeds-09](#pb-84) Seed issues-log.md
  - The seed is the issues-log starter for a new project.
  - Column and row rules are in [issues-log.md](../pack.framework.sdd.works/templates/sdd-scrum-practices.md#issues-logmd).



##### Engineering artifacts

- <a id="pb-40"></a>[Spec-seeds-10](#pb-40) Seed architecture.md
  - The seed is the generic architecture starter for a new project.
- <a id="pb-41"></a>[Spec-seeds-11](#pb-41) Seed release.md
  - The seed is the generic release starter for a new project (local startup and go-live order).
- <a id="pb-66"></a>[Spec-seeds-12](#pb-66) Seed .secrets
  - The seed is the dotenv-shaped `.secrets` starter at `pack.framework.sdd.works/templates/EN/.secrets`.
  - Each line is `NAME=` with an empty value; `#` comments state rules, groups, and where values live.
  - It holds no secret values. Delete sample keys the product does not need.
- <a id="pb-90"></a>[Spec-seeds-13](#pb-90) Seed test-strategy.md
  - The seed is the generic test-strategy starter for a new project.
  - It is not this repo's test strategy.
- <a id="pb-110"></a>[Spec-seeds-16](#pb-110) Pack instructions tabs JSON
  - The pack repo ships `content/.instructions-tabs.json`. The bundled fallback is [`src/content/.instructions-tabs.json`](../src/content/.instructions-tabs.json) in the web app repo.
  - The file has `version` and a `tabs` array. **Tab order on the instructions page is array order.**
  - Each row has `type` (`code`, `content`, `embedded_external_page`, or **`internal_page_folder`** per [Web-portal-36](#pb-133)), `id`, **`labels`** (locale map, `en` required), `queryParam`, and `panelTestId`. **`labelKey` is not used** ([ADR-119](./adr/ADR-119-instructions-tab-labels-in-pack-config.md)).
  - **`code`:** built-in portal panel; `id` must match an app allowlist (today `setup` only). See [`app-design.md`](./admin-portal/app-design.md) instructions tabs section.
  - **`content`:** `paths` maps locale to a relative markdown path under the sync unpack (at least `en`; zh locales optional with en fallback). Same read order as Features ([ADR-071](./adr/ADR-071-portal-content-paths.md)).
  - **`internal_page_folder`:** `rootPath` points at a pack folder tree with per-folder `.index.json` files ([Web-portal-36](#pb-133)).
  - The default seed reproduces Setup (`code`), Features, and Scrum in SDD (`content`) ([Web-portal-07](#pb-73), [Web-portal-12](#pb-81)).
  - Operator rules for this file also live in [`content/.admin-note.md`](../src/content/.admin-note.md) ([Web-portal-26](#pb-123)).
- <a id="pb-121"></a>[Spec-seeds-17](#pb-121) Reviewed full pack seeds file
  - The pack ships one reviewed manifest of the full seed tree under `pack.framework.sdd.works/` (path named in [framework-design](./framework/framework-design.md)).
  - The manifest lists every installable pack path: agents, skills, rules, workflows, and templates, grouped the same way as [MCP-01](#pb-16) allow-list and [ADR-059](./adr/ADR-059-ledger-lists-pack-files.md).
  - The manifest matches the authoring tree at delivery time. A person can confirm each row against disk and against installer copy rules in [seed-artifacts-building-guide.md](./seed-artifacts-building-guide.md).
  - Pack markdown links follow [pack-deliverable-links](./framework/framework-design.md#pack-deliverable-links) (OGT 2): no link into this repo's `specs/adr/` or `specs/knowledge/`; `npm run check:pack-seeds` passes; AC1–AC4 in [`framework-stories.md`](./framework/framework-stories.md#sdd-pack-deliverable-links--ogt-2-pack-link-placeholders).
  - The pack includes an authoring seed [`pack.framework.sdd.works/.sdd-installed.example.json`](../pack.framework.sdd.works/.sdd-installed.example.json). It shows ledger shape for Ethan and audit fixtures ([Agent-04](#pb-17), [ADR-057](./adr/ADR-057-install-ledger-pack-complete.md)). The live client receipt stays `{client_root}/.sdd-installed.json`.
  - The git seed keeps `pack_complete` false and empty or placeholder version fields. Install and stdio copy set `pack_complete` true on `{client_root}`; the git tree does not commit a true ledger.
  - The manifest documents how `files.skills`, `files.rules`, `files.agents`, `files.workflows`, and `files.templates` relate to that seed example.



#### Locale (i18n) for HanS and HanT

- <a id="pb-67"></a>[i18n-01](#pb-67) HanS and HanT core artifacts **Retired**
  - Superseded by [i18n-04](#pb-102). `sdd-scrum-practices.md` stays EN only.
- <a id="pb-68"></a>[i18n-02](#pb-68) HanS and HanT process artifacts **Retired**
  - Superseded by [i18n-05](#pb-103).
- <a id="pb-102"></a>[i18n-04](#pb-102) HanS and HanT scrum-in-sdd.md **Retired**
  - Superseded by [ADR-126](./adr/ADR-126-ai-read-pack-templates-and-pack-scrum-in-sdd-filename.md). AI-read `pack-scrum-in-sdd.md` is EN only beside `constants.json`. Human zh-Hans and zh-Hant guides stay under `content/scrum-in-sdd/`.
- <a id="pb-103"></a>[i18n-05](#pb-103) HanS and HanT process template seeds
  - HanS and HanT starters for `product-backlog.md`, `sprint-backlog.md`, `status.md`, `changes-log.md`, and `issues-log.md` match the EN starter meaning.
  - There is no `artifacts-map.md` template seed.
- <a id="pb-69"></a>[i18n-03](#pb-69) HanS and HanT engineering artifacts
  - HanS and HanT starters for `architecture.md`, `{stem}-stories.md`, `{stem}-design.md`, `{stem}-tests.md`, `release.md`, `.secrets`, and `test-strategy.md` match the EN starter meaning.

[Back to top](#index)

---



## **Component: mcp**

- <a id="pb-16"></a>[MCP-01](#pb-16) Installer allow-list and file ledger
  - You install or update the full framework pack through the local MCP tools `sdd_install_framework` and `sdd_update_framework`.
  - The tools copy every allow-listed pack file onto your client root and write `.sdd-installed.json` with `pack_complete: true` when the copy finishes ([ADR-057](./adr/ADR-057-install-ledger-pack-complete.md)).
  - The ledger lists each pack file path, not folder names only ([ADR-059](./adr/ADR-059-ledger-lists-pack-files.md)).
  - The lite HTTP installer ([Category: framework HTTP lite installer](#category-framework-http-lite-installer-through-local-agent)) does not change this full install path.
- <a id="pb-92"></a>[MCP-04](#pb-92) Pack go-live on the client root **Retired**
  - Superseded by [MCP-06](#pb-104) and [MCP-07](#pb-105).
- <a id="pb-104"></a>[MCP-06](#pb-104) sdd-mcp GitHub Releases
  - Operators publish the five `sdd-mcp` release binaries for end-user stdio setup ([ADR-058](./adr/ADR-058-stdio-end-user-http-fallback.md)).
  - Release assets match the OS and CPU matrix in [MCP-02](#pb-75).
- <a id="pb-105"></a>[MCP-07](#pb-105) Production pack sync for install
  - Admin portal sync ships the pack commit end users install in production.
  - End-user full install stays stdio primary with HTTP tarball fallback ([ADR-054](./adr/ADR-054-hybrid-http-ai-tarball.md)).
  - Sync cache and the install tarball include pack-root `lite-pack.allowlist.json` ([ADR-107](./adr/ADR-107-lite-pack-allowlist-filename.md), [Spec-seeds-15](#pb-97)).
- <a id="pb-75"></a>[MCP-02](#pb-75) Local binary ~/.sdd/sdd-mcp
  - You run one local program with no Node, npm, Bun, Python, or other runtime on the client machine. Bun is build-only ([ADR-051](./adr/ADR-051-zero-dep-stdio-binary.md)).
  - One executable covers macOS, Windows, and Linux ([ADR-051](./adr/ADR-051-zero-dep-stdio-binary.md) targets: `darwin-arm64`, `darwin-x64`, `linux-arm64`, `linux-x64`, `windows-x64`).
  - The same program is the stdio `command` for supported clients in [`mcp-design.md`](./mcp/mcp-design.md) §4.1.
  - The program runs full install and update through MCP-01. It does not write `framework.sdd.works.json`.
  - The binary holds no operator secrets and writes only under the allow-listed client root.
  - Setup tells you to run `~/.sdd/sdd-mcp`. It does not tell you to download and run an executable from the network ad hoc.
- <a id="pb-78"></a>[MCP-03](#pb-78) MCP tools without sdd_list_versions
  - You install or update the latest pack from the IDE. You do not pick a version from an MCP tool list.
  - `sdd_install_framework` resolves omitted `version` to latest via the sync cache and `GET /api/sdd/package`.
  - Pack contents for people appear on the Features tab ([Web-portal-07](#pb-73)), not as a version-list MCP tool.
  - `listVersions()` and `GET /api/sdd/versions` stay server-internal. `sdd_list_versions` is not on stdio or HTTP ([ADR-063](./adr/ADR-063-unregister-sdd-list-versions.md)).
- <a id="pb-101"></a>[MCP-05](#pb-101) Partial install ledger for subset copy **Retired**
  - Superseded by the lite HTTP installer category. Lite copy does not write `.sdd-installed.json`. Full install ledger stays on [MCP-01](#pb-16).

[Back to top](#index)

---



## **Component: web-portal**

#### Instructions page

- <a id="pb-15"></a>[Web-portal-01](#pb-15) Invoking agents, skills, and rules tab
  - You see a tab on the instructions page for invoking agents, skills, and rules.
  - The tab renders synced markdown like Features and Scrum in SDD: `invoke-agents.en.md`, `invoke-agents.zh-Hans.md`, and `invoke-agents.zh-Hant.md` under `content/invoke-agents/` ([ADR-071](./adr/ADR-071-portal-content-paths.md)).
  - The portal uses the admin sync cache, then bundled fallbacks. A missing locale file shows English from the same source.
  - The markdown documents how each supported client starts an agent, a skill, or a rule (for example Cursor `/` and TRAE CN `@`). Unverified clients stay marked unknown until checked.
  - There is no separate repo README for this tab. Pack-owned locale files are the source of truth. Supersedes [Web-portal-14](#pb-88) **Retired**.
- <a id="pb-70"></a>[Web-portal-04](#pb-70) Setup markdown for stdio and HTTP
  - `GET /setup` returns markdown that tells your agent to install the local MCP program and register stdio, or use the HTTP MCP URL when the client allows only a URL ([ADR-061](./adr/ADR-061-setup-prompt-public-path.md)).
  - You do not edit the MCP config file by hand for the default path.
  - Full pack install is a separate step after setup.
- <a id="pb-71"></a>[Web-portal-05](#pb-71) Instructions page layout
  - The public instructions page matches the Setup and Features layout in the portal mock.
  - Setup offers one copy action for the setup sentence (see [Web-portal-06](#pb-72)).
  - Features lists Agents, Skills, Rules, and Templates as fixed rows.
  - Invoke and skills guidance lives on the pack-driven **Knowledge** tab ([Web-portal-36](#pb-133)).
- <a id="pb-72"></a>[Web-portal-06](#pb-72) One-line GET /setup copy
  - You copy one sentence from the instructions page: `Fetch and execute the setup instructions from https://framework.sdd.works/setup`.
  - That URL returns the stdio setup markdown. `GET /agent-setup` redirects to `GET /setup`.
  - Manual setup shows one `mcp.json` with the `command` entry. The page does not show a second `mcp.json` or `curl`.
  - Tab labels use i18n keys. The copied setup sentence is the same in every locale.
- <a id="pb-73"></a>[Web-portal-07](#pb-73) Features tab from three markdown files
  - You open the Features tab on `/` and `/instructions` and read markdown synced from the pack.
  - The pack ships `features.en.md`, `features.zh-Hans.md`, and `features.zh-Hant.md` under `content/features/` ([ADR-071](./adr/ADR-071-portal-content-paths.md)).
  - The portal prefers the latest admin sync cache, then bundled fallbacks. A missing locale file shows English from the same source.
  - Setup and Get secret stay usable while Features loads. A failed sync keeps the previous cache.
  - Full install does not copy these markdown files onto your client root.
- <a id="pb-81"></a>[Web-portal-12](#pb-81) Scrum in SDD tab
  - You see a Scrum in SDD tab after Setup and Features on `/` and `/instructions`.
  - The tab label uses i18n key `admin.guide.tab_scrum`. Query `?tab=scrum-in-sdd` opens that panel on load.
  - The panel reads synced `scrum-in-sdd.{locale}.md` with the same locale fallback as Features ([ADR-071](./adr/ADR-071-portal-content-paths.md)).
  - Full install does not copy portal content onto your client root. Project template seeds under `templates/{locale}/` stay separate.
- <a id="pb-83"></a>[Web-portal-13](#pb-83) Get secret on Setup
  - **Done** for Sprint 3 Setup placement. Live placement moved to the Learn Scrum tab ([Web-portal-31](#pb-128), [ADR-115](./adr/ADR-115-get-secret-on-learn-tab.md)).
  - Lookup behavior unchanged: i18n hint and button; found value in a code block with copy; not-found and empty-name messages; scroll into view. Setup and MCP config stay without a token. Supersedes Features placement from [Web-portal-08](#pb-74) **Retired**.
- <a id="pb-88"></a>[Web-portal-14](#pb-88) README for IDE invoke differences **Retired**
  - Superseded by [Web-portal-36](#pb-133) Knowledge tab articles under `content/knowledge/`.
- <a id="pb-111"></a>[Web-portal-24](#pb-111) Instructions tabs config API
  - `GET /api/sdd/instructions-tabs?locale=` resolves tab config from the synced pack cache first ([ADR-071](./adr/ADR-071-portal-content-paths.md)).
  - When the cache file is missing or invalid, the handler uses **only** the bundled [`src/content/.instructions-tabs.json`](../src/content/.instructions-tabs.json). There is no partial merge.
  - The response lists tabs in file order. Each `content` tab includes rendered markdown metadata for the requested locale (cache then package fallback per path). Each `code` tab includes metadata only (no markdown body).
  - The handler does not call GitHub at request time.
- <a id="pb-112"></a>[Web-portal-25](#pb-112) Dynamic instructions tab UI
  - `/` and `/instructions` render the tab list and panels from the same resolver as the API ([Web-portal-24](#pb-111)), not hard-coded Features and Scrum rows ([Web-portal-07](#pb-73), [Web-portal-12](#pb-81)).
  - **Default selected tab** when the URL has no `?tab=` is always **Setup** (`queryParam` `setup`), regardless of array order.
  - Tab **display order** follows the resolved config array. Tab labels use **`labels`** from config ([ADR-119](./adr/ADR-119-instructions-tab-labels-in-pack-config.md)). Setup copy stays on the `setup` code panel ([Web-portal-06](#pb-72)). Get secret stays on the Learn tab ([Web-portal-31](#pb-128)).
- <a id="pb-124"></a>[Web-portal-27](#pb-124) Learn Scrum in SDD tab
  - The instructions page adds a tab with type **`embedded_external_page`** ([ADR-110](./adr/ADR-110-embedded-external-page-tab.md)), id **`learn-scrum-in-sdd`**, query param **`learn-scrum-in-sdd`**, and label key **`admin.guide.tab_learn_scrum`**. It is not a **`code`** tab and not the **`scrum-in-sdd`** markdown tab ([Web-portal-12](#pb-81)).
  - Bundled and pack [`content/.instructions-tabs.json`](../pack.framework.sdd.works/content/.instructions-tabs.json) include the row. **`urls.en`**, **`urls.zh-Hans`**, and **`urls.zh-Hant`** are all `https://sdd.works/en/learn-embedded/` until separate locale pages exist. A missing locale URL uses `urls.en`.
  - The portal renders one iframe panel for this type. The iframe `src` is the resolved URL. The host must be on the app allowlist (`sdd.works`). Tab label, iframe title, and the open-in-new-tab fallback use i18n keys only.
  - The iframe has no border and `width: 100%` of the guide column ([ADR-112](./adr/ADR-112-learn-embed-frame.md)). Height follows the embed document via postMessage ([ADR-114](./adr/ADR-114-learn-embed-auto-height.md)). Portal CSS does not restyle the WordPress page inside the frame.
  - Intro copy tells the visitor to complete the nine modules to learn Scrum in SDD ([ADR-113](./adr/ADR-113-learn-embed-copy-and-fallback.md)). The new-tab link text is one i18n string and opens `https://learn.sdd.works`. The iframe `src` stays the embed URL from tab config.
  - Flush left grid and tile scale on the embed page are sdd.works changes under ADR-114. This PBI does not crop or scale the iframe.
  - **Setup** stays a **`code`** tab and the default when the URL has no `?tab=` ([Web-portal-25](#pb-112)).
  - Depends on [Web-portal-25](#pb-112) and [ADR-110](./adr/ADR-110-embedded-external-page-tab.md).
- <a id="pb-125"></a>[Web-portal-28](#pb-125) Content tab heading anchors
  - Every instructions tab with `type` **`content`** renders headings with GitHub-style `id` attributes ([ADR-109](./adr/ADR-109-content-tab-heading-anchors.md)). An in-page link such as `#part-i-the-2020-scrum-guide-summary` scrolls to that heading. The same renderer covers Features, Scrum in SDD, Invoke custom agents, and any later content tab from [Web-portal-25](#pb-112).
  - The slug uses the heading’s plain text. Bold and other inline marks are stripped. The first duplicate slug is bare. Later duplicates use `slug-1`, `slug-2`. The counter resets per document.
  - Features em-dash list rows stay unchanged ([Web-portal-07](#pb-73)). Pack markdown files are not edited to add HTML ids.
  - Headings in the guide body use `scroll-margin-top` so the sticky guide header ([ADR-111](./adr/ADR-111-guide-header-sticky.md), [Web-portal-29](#pb-126)) does not cover the target.
  - A repeated Index fragment still opens the first matching heading. A separate target for a later duplicate heading waits on a markdown change, which this PBI does not do.
- <a id="pb-126"></a>[Web-portal-29](#pb-126) Sticky guide header
  - On `/` and `/instructions`, the logo and title, the tagline `SKILLS.RULES.AGENTS.TEMPLATES`, and the tab names stay on screen while the tab body scrolls ([ADR-111](./adr/ADR-111-guide-header-sticky.md)).
  - The hairline under the tagline is removed. The tab row keeps its underline and the active tab mark.
  - The locale switch and the site footer are unchanged. The locale switch is not part of the sticky block.
  - A narrow viewport may wrap the title inside the sticky block and may scroll the tab row sideways inside that block. The page does not scroll sideways.
  - In-page heading links still land fully in view ([Web-portal-28](#pb-125)).
- <a id="pb-128"></a>[Web-portal-31](#pb-128) Get secret on Learn Scrum tab
  - The secret lookup form moves from Setup to the Learn Scrum in SDD tab ([ADR-115](./adr/ADR-115-get-secret-on-learn-tab.md)).
  - Order on that tab: intro, iframe, secret stack (`#learn-secret`), then the fallback link to `https://learn.sdd.works` ([ADR-113](./adr/ADR-113-learn-embed-copy-and-fallback.md)).
  - Setup, Features, and other content tabs have no `secret-lookup`. Lookup behavior matches [ADR-067](./adr/ADR-067-get-secret-on-setup.md) item 3 (exact name, scroll, width, i18n keys, empty name skips API).
  - Submit stays on the Learn tab; anchor `#learn-secret` for scroll after lookup.
- <a id="pb-129"></a>[Web-portal-32](#pb-129) Learn embed loading skeleton
  - While `learn-scrum-iframe` loads the sdd.works embed, show a 3×3 skeleton overlay in the frame host ([ADR-118](./adr/ADR-118-learn-embed-loading-skeleton.md)).
  - Fallback link and Get secret stay visible below the host. Label key `admin.guide.learn_scrum_embed_loading` in three locales. AC32 in [`app-stories.md`](./admin-portal/app-stories.md).
- <a id="pb-130"></a>[Web-portal-33](#pb-130) Instructions tab labels in pack JSON
  - Tab titles live in `labels` on each row in `content/.instructions-tabs.json` for all tab types. Remove `labelKey` from schema, validator, API, and UI ([ADR-119](./adr/ADR-119-instructions-tab-labels-in-pack-config.md), [WA-16](./issues-log.md)).
  - Rename or add a tab by editing the pack file and syncing; no portal `messages/*.json` edit for tab bar text. AC33 in [`app-stories.md`](./admin-portal/app-stories.md).
- <a id="pb-131"></a>[Web-portal-34](#pb-131) SDD WORKS wordmark logo
  - Replace the portal wordmark with art from [`src/618x618.logos.png`](../src/618x618.logos.png) (718×256 RGBA) per [ADR-121](./adr/ADR-121-sdd-works-wordmark-logo.md).
  - Copy to `public/sdd-logo.png`; keep URL `/sdd-logo.png`. Update `Logo.tsx` intrinsic size and sync mockup asset. Mockup approved 2026-10-08; production asset swap remains.
  - `sdd-mark.png`, favicon, and apple-touch stay unchanged in this PBI. AC35 in [`app-stories.md`](./admin-portal/app-stories.md).
- <a id="pb-132"></a>[Web-portal-35](#pb-132) Instructions guide hero and Setup tab
  - Hero title **Built on Harness. Ready for Scrum** (`admin.guide.title`, same English in three locales). Antonio headline and hero wordmark scale per [ADR-122](./adr/ADR-122-instructions-guide-hero-and-setup-tab.md).
  - Setup: highlight line, copy prompt, install phrase + `sdd_install_framework`; update hint above agents; **no** on-page Manual setup or Tools table. Mockup approved 2026-10-08. AC36 in [`app-stories.md`](./admin-portal/app-stories.md).
- <a id="pb-133"></a>[Web-portal-36](#pb-133) Internal page folder tab
  - Add instructions tab type **`internal_page_folder`**. Pack content lives under a configured **root folder** (for example `content/knowledge/`). Each folder may ship **`.index.json`** that lists subfolders and markdown files and how each entry opens.
  - **Example tree (pack cache):** `content/knowledge/.index.json` lists `how-to-invoke-agent.md`, `how-to-call-skills.md`, and subfolder `archived/`. `content/knowledge/archived/.index.json` lists `invoke-agent-cursor.md` and `invoke-agent-trae.md`. Markdown files render in the guide like existing **`content`** tabs ([ADR-071](./adr/ADR-071-portal-content-paths.md)).
  - **`.index.json` contract (versioned):** entries declare `kind` (`folder` | `file`), stable `id` or slug, **`labels`** per locale (`en` required), relative `path`, and for files required **`open`** (`same_tab` | `new_tab`). [ADR-124](./adr/ADR-124-internal-page-folder-index-json.md) defines listing UI and navigation per value.
  - **Tab row in `content/.instructions-tabs.json`:** `type` `internal_page_folder`, `id`, `queryParam`, `panelTestId`, **`labels`**, and **`rootPath`** (relative to pack unpack, no `..`). Validator rejects escape outside `rootPath`. Bundled fallback follows [Spec-seeds-16](#pb-110).
  - **UI:** Selecting the tab shows the root `.index.json` listing (titles from `labels`). Folder rows drill in on the same tab. File rows use **`open`**: **`same_tab`** replaces the panel with markdown and **Back**; **`new_tab`** keeps the listing and opens the article in a new browser tab with a distinct row affordance. URL carries `?tab=<queryParam>` and **`path=`** under `rootPath`; browser history applies to **`same_tab`** articles only.
  - **API:** Extend `GET /api/sdd/instructions-tabs` (or add a sibling route) so the portal resolves folder indexes and file bodies from cache then bundled package ([Web-portal-24](#pb-111)). No GitHub fetch at request time.
  - **i18n:** Folder and file titles come from pack **`labels`** only. Back control and empty-state copy use message keys in `en`, `zh-Hans`, and `zh-Hant`.
  - **Security:** Only `.md` files under `rootPath`; reject `..`, absolute paths, and symlinks outside the root. Same markdown renderer and heading anchors as **`content`** tabs ([Web-portal-28](#pb-125)).
  - **Out of scope for this PBI:** editing markdown in Admin; full-text search across the tree; non-markdown file types.
  - Depends on [Web-portal-25](#pb-112), [Spec-seeds-16](#pb-110), and [ADR-071](./adr/ADR-071-portal-content-paths.md). Engineering landed in workspace; close after E2E, DoD quality gate, and spec sync.
- <a id="pb-134"></a>[Web-portal-37](#pb-134) Unified guide markdown body
  - All `type: "content"` tab panels use `guide-section guide-md-body` with `--catalog` (Features) or `--prose` (default) per [ADR-123](./adr/ADR-123-unified-guide-markdown-body.md).
  - GFM tables wrap in `<div class="content-table">` for every content tab, including Features.
  - Tab-specific test ids stay unchanged (`features-body`, `scrum-body`, and so on). Resolves [WA-18](./issues-log.md) when verified and closed.
  - Depends on [Web-portal-25](#pb-112), [Web-portal-07](#pb-73), [Web-portal-12](#pb-81).
- <a id="pb-82"></a>[Spec-seeds-14](#pb-82) Seed features.md under content/features
  - You finalize the three Features catalog seeds under `content/features/` in the pack repo.

#### Public site

- <a id="pb-76"></a>[Web-portal-09](#pb-76) Public landing, footer, and password gate
  - `/` serves the instructions guide. The old logo-card home goes away.
  - The site footer stays fixed on auth and admin shells.
  - After reset mail is sent, Back to login goes to `/login`.
  - An admin with a password can sign in. An admin without a password sees the set-password lead first.
- <a id="pb-106"></a>[Web-portal-20](#pb-106) Canonical public hostname
  - One hostname is canonical for marketing and instructions. The other redirects or serves the same app without duplicating setup flows.
  - Operators document redirect and routing rules.
  - The concrete hostname cutover is [Web-portal-30](#pb-127).
- <a id="pb-127"></a>[Web-portal-30](#pb-127) Hostnames learn.sdd.works and sdd.works
  - The WordPress learn site moves from `sdd.works` to `learn.sdd.works`.
  - The framework portal (today `framework.sdd.works`) becomes the public site at `sdd.works`.
  - DNS, TLS, host config, and redirects land so visitors and bookmarks reach the new hosts. `framework.sdd.works` redirects to `sdd.works`. Old WordPress paths on `sdd.works` redirect to `learn.sdd.works` where needed.
  - App and pack strings that name the hosts update: Learn embed and fallback URLs ([Web-portal-27](#pb-124)), iframe allowlist, setup copy (`GET /setup`), and operator docs.
  - Admin routes stay off the public entry hostname or path per [Web-portal-22](#pb-108).
  - Depends on [Web-portal-20](#pb-106) intent and [Web-portal-09](#pb-76). Coordinates with [Web-portal-27](#pb-124) URL rows.
- <a id="pb-107"></a>[Web-portal-21](#pb-107) Install-first public landing
  - The partner public site (for example 2study.ai) landing leads with the framework lite or full install prompt and links to setup and instructions.
  - This PBI is not framework.sdd.works `/` redesign; that site already serves the instructions guide ([Web-portal-09](#pb-76)).
- <a id="pb-108"></a>[Web-portal-22](#pb-108) Admin routes off public hostname
  - Admin login, reset, and operator routes stay off the public marketing and instructions entry hostname or path.

#### Admin

- <a id="pb-123"></a>[Web-portal-26](#pb-123) Pack repo file note on Admin Settings
  - A signed-in admin on Admin Settings sees a note that names which files belong in the pack GitHub repository, and the content and format of each file.
  - Admin Settings loads the note body from `content/.admin-note.md` in the synced pack. The authoring seed is [`src/content/.admin-note.md`](../src/content/.admin-note.md).
  - The note includes `lite-pack.allowlist.json` at the repo root: top-level `skills` and `rules` arrays of sorted relative paths.
  - The note documents `content/.instructions-tabs.json`: tab types (`code`, `content`), field rules, display order, bundled fallback, and default Setup selection ([Spec-seeds-16](#pb-110)).
  - The note states that `{client_root}/.sdd-lite-installed.json` and `{client_root}/.sdd-installed.json` are written on the client after a successful copy. They are not pack files to commit or to sync. Do not commit `framework.sdd.works.json`.
  - Public pages do not show the note. Labels around the note use i18n keys. The note body is the markdown file.

#### Account and secrets

- <a id="pb-74"></a>[Web-portal-08](#pb-74) Secret lookup by name **Retired**
  - Superseded by [Web-portal-13](#pb-83) on Setup. Sprint 3 shipped lookup on Features first.
- <a id="pb-77"></a>[Web-portal-10](#pb-77) On-page reset submit and Features tab switch
  - Reset request stays on `/reset-password` without a full document reload.
  - Success and error states use keyed messages. The Features tab switches panels when you select it.
- <a id="pb-79"></a>[Web-portal-11](#pb-79) Reset success without email in the URL
  - After a successful reset request, the success message does not show the email address in the page or URL.
  - The document stays on `/reset-password` with no `?email=` navigation.


<a id="category-framework-http-lite-installer-through-local-agent"></a>

#### framework HTTP lite installer through local agent

This path is **not** the framework.sdd.works MCP installer. Full install stays: copy the setup prompt from framework.sdd.works, register MCP stdio, then run `sdd_install_framework` or `sdd_update_framework`.

The **lite.sdd.works HTTP installer** is a shorter path for partner sites (for example 2study.ai): you copy a one-line prompt, the sdd.works server returns allow-listed pack file links, your local agent picks `{client_root}` for the running tool, and copies only the listed skills and rules. The pack GitHub URL is the same as Admin Settings sync. The pack repo adds `lite-pack.allowlist.json` at the repo root. Lite copy does **not** write `.sdd-installed.json` and does **not** set `pack_complete`. After a successful lite copy, the agent writes a separate lite receipt on `{client_root}` ([Spec-seeds-18](#pb-122)).

- <a id="pb-97"></a>[Spec-seeds-15](#pb-97) Lite install manifest file
  - Pack-root basename is `lite-pack.allowlist.json` ([ADR-107](./adr/ADR-107-lite-pack-allowlist-filename.md)).
  - The pack includes that file at the repo root.
  - The file lists relative skill and rule paths the lite installer may copy.
  - Pack sync and the install tarball include that file.
- <a id="pb-98"></a>[Web-portal-17](#pb-98) Lite install file links API
  - You call an HTTP route that reads `lite-pack.allowlist.json` from the synced pack cache and returns same-origin download links for those paths only.
  - Unknown or out-of-pack paths fail. The route does not call GitHub at request time.
- <a id="pb-122"></a>[Spec-seeds-18](#pb-122) Lite install client receipt
  - Lite copy uses `{client_root}/.sdd-lite-installed.json`. It is not `.sdd-installed.json` and does not set `pack_complete`.
  - The pack includes an authoring seed that documents the receipt shape. The product repo holds the canonical JSON schema and merge rules in framework design.
  - Before delete or copy, the agent reads the receipt and compares it with the current server manifest from [Web-portal-17](#pb-98). When `package_version`, `package_commit`, and every listed file on disk already match, the agent stops.
  - The agent downloads every new file before it deletes a path that left the manifest. It deletes a local file only when that path is in the previous receipt and absent from the new server list.
  - The agent writes the receipt only after every path in the new server list is on disk. The receipt lists that full set plus version and commit. A partial copy does not write a new receipt. A first failed install leaves no receipt. A later failed install keeps the previous receipt.
- <a id="pb-99"></a>[Web-portal-18](#pb-99) Lite install prompt and one-line copy
  - This PBI has **two parts**. Both must ship before the row is **Done** (same split as full MCP setup: fetched markdown plus paste line for [Web-portal-06](#pb-72)).
  - **Part 1 — Agent markdown (server):** `GET /setup/install` (or equivalent public path per [ADR-061](./adr/ADR-061-setup-prompt-public-path.md)) returns markdown for your agent. The body tells the agent to call the lite file-links route, resolve `{client_root}` for the running tool, follow [Spec-seeds-18](#pb-122) merge and receipt rules, and copy only manifest-listed paths. It does not instruct `sdd_install_framework` and does not instruct writing `.sdd-installed.json`.
  - **Part 2 — Visitor copy (portal):** On framework.sdd.works Setup (and the partner public site when live), a control copies one English sentence that fetches Part 1, for example `Fetch and execute the setup instructions from https://framework.sdd.works/setup/install`. That protocol sentence is the same in every locale. Surrounding labels use i18n keys ([Web-portal-06](#pb-72)). The visitor can start lite install without leaving the guide shell.
- <a id="pb-100"></a>[Web-portal-19](#pb-100) Lite install one-line copy **Retired**
  - Merged into [Web-portal-18](#pb-99) Part 2. AC21 in [`admin-portal/app-stories.md`](./admin-portal/app-stories.md) still names the copy behavior.

[Back to top](#index)

---


# Product Backlog


| #   | Component | PBI Code                     | Description                                      | Size          | Related                                                                                                                                                                                                                                                                                                                                     | Sprint   | Status  |
| --- | --------- | ---------------------------- | ------------------------------------------------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------- |
| 1   | framework | [Agent-01](#pb-6)        | Local Cursor agent                               | Implementable | - `[framework/framework-design.md](./framework/framework-design.md)` - [D1](./sprint-backlog.md#rid-d1) - [MCP-01](#pb-16)                                                                                                                                                                                                                  | Sprint 1 | Done    |
| 2   | framework | [Agent-02](#pb-8)        | Skill call for a named job                       | Implementable | - `[framework/framework-design.md](./framework/framework-design.md)` - [Skill-03](#pb-24) - [Skill-04](#pb-25) - [Skill-05](#pb-26) - [Skill-12](#pb-86) - [Skill-06](#pb-28) - [Skill-07](#pb-29) **Retired** - [ethan.md](../pack.framework.sdd.works/agents/ethan.md)                                                                                  | Sprint 8 | Done    |
| 3   | framework | [Agent-03](#pb-10)       | Guiding proposals from framework knowledge       | Implementable | - `[pack-scrum-in-sdd.md](../pack.framework.sdd.works/templates/pack-scrum-in-sdd.md)` - `[coach-knowledge.md](../pack.framework.sdd.works/templates/coach-knowledge.md)` - `[sdd-scrum-practices.md](../pack.framework.sdd.works/templates/sdd-scrum-practices.md)` - [ADR-106](./adr/ADR-106-coach-knowledge-file.md) - `[artifacts-map.json](../artifacts-map.json)`                                                                                                                               | Sprint 8 | Done    |
| 4   | framework | [Agent-04](#pb-17)       | Agent ethan onboard with pack receipt start gate | Implementable | - `[framework/framework-design.md](./framework/framework-design.md)` §2.4 - `[framework/framework-stories.md](./framework/framework-stories.md)` - [MCP-01](#pb-16)                                                                                                                                                                         | Sprint 2 | Done    |
| 5   | framework | [Skill-01](#pb-21)       | Pack skill atdd-expert                           | Implementable | —                                                                                                                                                                                                                                                                                                                                           | Sprint 7 | Done    |
| 6   | framework | [Skill-03](#pb-24)       | Pack skill sdd-update-project                    | Implementable | - [Agent-02](#pb-8) - [ADR-079](./adr/ADR-079-one-job-update-project.md)                                                                                                                                                                                                                                                                    | Sprint 5 | Done    |
| 7   | framework | [Skill-04](#pb-25)       | Pack skill sdd-refine-backlog                    | Implementable | [Agent-02](#pb-8)                                                                                                                                                                                                                                                                                                                           | Sprint 5 | Done    |
| 8   | framework | [Skill-05](#pb-26)       | Pack skill sdd-plan-sprint                       | Implementable | - [Agent-02](#pb-8) - [sdd-plan-sprint](../pack.framework.sdd.works/skills/sdd-plan-sprint/SKILL.md)                                                                                                                                                                                                                                                  | Sprint 5 | Done    |
| 9   | framework | [Skill-06](#pb-28)       | Pack skill sdd-retrospective                     | Implementable | [Agent-02](#pb-8)                                                                                                                                                                                                                                                                                                                           | Sprint 6 | Done    |
| 10  | framework | [Skill-07](#pb-29)       | Pack skill sdd-close-sprint                      | Implementable | [Agent-02](#pb-8)                                                                                                                                                                                                                                                                                                                           | Sprint 6 | Retired |
| 11  | framework | [Skill-08](#pb-30)       | Pack skill sdd-audit-artifacts                   | Implementable | - `[framework-design.md](./framework/framework-design.md#sdd-audit-artifacts)` - `[framework-stories.md](./framework/framework-stories.md#sdd-audit-artifacts)` - [ADR-073](./adr/ADR-073-skill-get-status.md)                                                                                                                              | Sprint 4 | Done    |
| 12  | framework | [Skill-09](#pb-64)       | Pack skill sdd-update-specs                      | Implementable | [Skill-11](#pb-80)                                                                                                                                                                                                                                                                                                                          | Sprint 7 | Done    |
| 13  | framework | [Skill-11](#pb-80)       | Pack skill sdd-spec-to-build                     | Implementable | - [Skill-09](#pb-64) - [Skill-01](#pb-21) - [ADR-085](./adr/ADR-085-sdd-spec-to-build.md)                                                                                                                                                                                                                                                   | Sprint 7 | Done    |
| 14  | framework | [Skill-12](#pb-86)       | Pack skill sdd-review-status                     | Implementable | - [ADR-076](./adr/ADR-076-review-status-one-skill.md) - [ADR-073](./adr/ADR-073-skill-get-status.md) - [Skill-08](#pb-30)                                                                                                                                                                                                                   | Sprint 4 | Done    |
| 15  | framework | [Skill-13](#pb-87)       | Pack skill sdd-create-skill                      | Implementable | - [ADR-074](./adr/ADR-074-sdd-create-skill.md) - [ADR-092](./adr/ADR-092-pack-authoring-skill-sdd-prefix.md) - [sdd-create-skill](../pack.framework.sdd.works/skills/sdd-create-skill/SKILL.md)                                                                                                                                                       | Sprint 5 | Done    |
| 16  | framework | [Skill-14](#pb-89) | Pack skill improve-prompt                        | Implementable | - [ADR-099](./adr/ADR-099-improve-prompt-skill-name.md) - [framework-design § improve-prompt](./framework/framework-design.md#improve-prompt) - [improve-prompt](../pack.framework.sdd.works/skills/improve-prompt/SKILL.md) - **CE-SKILL-13**                                                                                                          | Sprint 7 | Done    |
| 17  | framework | [Skill-15](#pb-93)       | Pack skill sdd-build-agent                       | Implementable | - [ADR-092](./adr/ADR-092-pack-authoring-skill-sdd-prefix.md) - [framework-design § sdd-build-agent](./framework/framework-design.md#sdd-build-agent) - [sdd-build-agent](../pack.framework.sdd.works/skills/sdd-build-agent/SKILL.md)                                                                                                                | Sprint 5 | Done    |
| 18  | framework | [Skill-16](#pb-94)       | Pack skill sdd-create-rule                       | Implementable | - [ADR-092](./adr/ADR-092-pack-authoring-skill-sdd-prefix.md) - [sdd-create-rule](../pack.framework.sdd.works/skills/sdd-create-rule/SKILL.md) - [framework-design § sdd-create-rule](./framework/framework-design.md#sdd-create-rule)                                                                                                                | Sprint 5 | Done    |
| 19  | framework | [Skill-17](#pb-113)      | Pack skill frontend-designer                       | Implementable | - [Skill-11](#pb-80) - [Skill-01](#pb-21) - [Spec-seeds-13](#pb-90) - [ADR-105](./adr/ADR-105-frontend-designer-pack-skill-name.md)                                                                                                                                                                                                          | Sprint 7 | Done    |
| 20  | framework | [Skill-18](#pb-114)      | Pack skill testing-expert                        | Implementable | - [ADR-102](./adr/ADR-102-testing-expert-pack-skill-name.md) - [Skill-11](#pb-80) - [Spec-seeds-13](#pb-90) - [Skill-17](#pb-113)                                                                                                                                                                                                         | Sprint 7 | Done    |
| 21  | framework | [Skill-19](#pb-115)      | Pack skill frontend-developer                    | Implementable | - [Skill-17](#pb-113) - [Skill-18](#pb-114) - [Skill-11](#pb-80)                                                                                                                                                                                                                                                                         | Sprint 7 | Done    |
| 22  | framework | [Skill-20](#pb-116)      | Pack skill fullstack-engineer                    | Implementable | - [ADR-104](./adr/ADR-104-fullstack-engineer-pack-skill-name.md) - [Skill-17](#pb-113) - [Skill-18](#pb-114) - [Skill-19](#pb-115) - [Skill-11](#pb-80) | Sprint 7 | Done    |
| 23  | framework | [Skill-21](#pb-117)      | Pack skill ai-architect                          | Implementable | - [Skill-22](#pb-118) - [Skill-23](#pb-119) - [Skill-11](#pb-80) | Sprint 7 | Done    |
| 24  | framework | [Skill-22](#pb-118)      | Pack skill mcp-expert                            | Implementable | - [MCP-02](#pb-75) - [Skill-18](#pb-114) - [Skill-11](#pb-80) | Sprint 7 | Done    |
| 25  | framework | [Skill-23](#pb-119)      | Pack skill rag-expert                            | Implementable | - [Spec-seeds-12](#pb-66) - [Skill-18](#pb-114) - [Skill-11](#pb-80) | Sprint 7 | Done    |
| 26  | framework | [Skill-24](#pb-120)      | Pack skill sdd-retrospective                     | Implementable | - [Skill-06](#pb-28) - [Skill-12](#pb-86) - [Agent-02](#pb-8) - [ADR-097](./adr/ADR-097-done-runs-retrospective.md) - **CE-SKILL-10** | Sprint 8 | Done    |
| 27  | framework | [Rule-01](#pb-18)        | Pack rule sdd-dod.mdc                            | Implementable | [Spec-seeds-03](#pb-32)                                                                                                                                                                                                                                                                                                                     | Sprint 6 | Done    |
| 28  | framework | [Rule-02](#pb-19)        | Pack rule sdd-incremental-delivery.mdc           | Implementable | [Spec-seeds-03](#pb-32)                                                                                                                                                                                                                                                                                                                     | Sprint 6 | Done    |
| 29  | framework | [Rule-03](#pb-20)        | Pack rule sdd-realtime-status.mdc                | Implementable | [ADR-096](./adr/ADR-096-sdd-realtime-status-rule-name.md)                                                                                                                                                                                                                                                                                   | Sprint 6 | Done    |
| 30  | framework | [Rule-04](#pb-95)        | Pack rule friendly-language.mdc                  | Implementable | - [Spec-seeds-03](#pb-32) - [framework-design § friendly-language.mdc](./framework/framework-design.md#friendly-languagemdc)                                                                                                                                                                                                                | Sprint 7 | Done    |
| 31  | framework | [Spec-seeds-01](#pb-33)  | Seed pack-scrum-in-sdd.md                        | Implementable | - [MCP-01](#pb-16) - [i18n-01](#pb-67) - [ADR-126](./adr/ADR-126-ai-read-pack-templates-and-pack-scrum-in-sdd-filename.md)                                                                                                                                                                                                                   | Sprint 1 | Done    |
| 32  | framework | [Spec-seeds-02](#pb-34)  | Seed sdd-scrum-practices.md                      | Implementable | - [MCP-01](#pb-16) - [i18n-01](#pb-67)                                                                                                                                                                                                                                                                                                      | Sprint 1 | Done    |
| 33  | framework | [Spec-seeds-03](#pb-32)  | Seed constants.json                              | Implementable | - [MCP-01](#pb-16) - [ADR-081](./adr/ADR-081-constants-json.md) - [ADR-060](./adr/ADR-060-constants-on-client-root.md)                                                                                                                                                                                                                      | Sprint 2 | Done    |
| 34  | framework | [Spec-seeds-04](#pb-35)  | Project file artifacts-map.json                  | Implementable | - [ADR-080](./adr/ADR-080-no-artifacts-map-seed.md) - [ADR-082](./adr/ADR-082-artifacts-map-json.md)                                                                                                                                                                                                                                        | Sprint 4 | Done    |
| 35  | framework | [Spec-seeds-05](#pb-36)  | Seed product-backlog.md                          | Implementable | - [MCP-01](#pb-16) - [i18n-02](#pb-68)                                                                                                                                                                                                                                                                                                      | Sprint 6 | Done    |
| 36  | framework | [Spec-seeds-06](#pb-37)  | Seed sprint-backlog.md                           | Implementable | - [MCP-01](#pb-16) - [i18n-02](#pb-68)                                                                                                                                                                                                                                                                                                      | Sprint 4 | Done    |
| 37  | framework | [Spec-seeds-07](#pb-38)  | Seed status.md                                   | Implementable | - [MCP-01](#pb-16) - [i18n-02](#pb-68)                                                                                                                                                                                                                                                                                                      | Sprint 4 | Done    |
| 38  | framework | [Spec-seeds-08](#pb-39)  | Seed changes-log.md                              | Implementable | - [MCP-01](#pb-16) - [i18n-02](#pb-68) - [ADR-070](./adr/ADR-070-change-log-and-issues-log.md)                                                                                                                                                                                                                                              | Sprint 4 | Done    |
| 39  | framework | [Spec-seeds-09](#pb-84)  | Seed issues-log.md                               | Implementable | - [ADR-070](./adr/ADR-070-change-log-and-issues-log.md) - [ADR-075](./adr/ADR-075-issues-log-tables.md) - [Spec-seeds-08](#pb-39)                                                                                                                                                                                                           | Sprint 4 | Done    |
| 40  | framework | [Spec-seeds-10](#pb-40)  | Seed architecture.md                             | Implementable | - [MCP-01](#pb-16) - [i18n-03](#pb-69)                                                                                                                                                                                                                                                                                                      | Sprint 7 | Done    |
| 41  | framework | [Spec-seeds-11](#pb-41)  | Seed release.md                                  | Implementable | - [MCP-01](#pb-16) - [i18n-03](#pb-69)                                                                                                                                                                                                                                                                                                      | Sprint 7 | Done    |
| 42  | framework | [Spec-seeds-12](#pb-66)  | Seed .secrets                                    | Implementable | - [MCP-01](#pb-16) - [Spec-seeds-11](#pb-41) - [i18n-03](#pb-69)                                                                                                                                                                                                                                                                            | Sprint 7 | Done    |
| 43  | framework | [Spec-seeds-13](#pb-90)  | Seed test-strategy.md                            | Implementable | - [Spec-seeds-02](#pb-34) - [i18n-03](#pb-69)                                                                                                                                                                                                                                                                                               | Sprint 7 | Done    |
| 44  | framework | [i18n-01](#pb-67)        | HanS and HanT core artifacts                     | Theme         | - [i18n-04](#pb-102)                                                                                                                                                                                                                                                        | —        | Retired |
| 45  | framework | [i18n-02](#pb-68)        | HanS and HanT process artifacts                  | Theme         | - [i18n-05](#pb-103)                                                                                                                                                                                                                                                        | —        | Retired |
| 46  | framework | [i18n-03](#pb-69)        | HanS and HanT engineering artifacts              | Implementable | - [Spec-seeds-10](#pb-40) - [Spec-seeds-11](#pb-41) - [Spec-seeds-12](#pb-66) - [Spec-seeds-13](#pb-90)                                                                                                                                                                                                                                     | —        | ToDo    |
| 47  | mcp       | [MCP-01](#pb-16)         | Installer allow-list and file ledger             | Implementable | - `[mcp/mcp-design.md](./mcp/mcp-design.md)` - [ADR-057](./adr/ADR-057-install-ledger-pack-complete.md) - [ADR-059](./adr/ADR-059-ledger-lists-pack-files.md) - [MCP-04](#pb-92)                                                                                                                                                            | Sprint 2 | Done    |
| 48  | mcp       | [MCP-04](#pb-92)         | Pack go-live on the client root                  | Theme         | - [MCP-06](#pb-104) - [MCP-07](#pb-105)                                                                                                                                                                                                                                     | —        | Retired |
| 49  | mcp       | [MCP-02](#pb-75)         | Local binary ~/.sdd/sdd-mcp                      | Implementable | - [ADR-051](./adr/ADR-051-zero-dep-stdio-binary.md) - [ADR-053](./adr/ADR-053-server-side-sync-thin-stdio.md) - [ADR-058](./adr/ADR-058-stdio-end-user-http-fallback.md) - `[mcp/mcp-design.md](./mcp/mcp-design.md)` §2.1 and §4.1 - [MCP-01](#pb-16)                                                                                      | Sprint 2 | Done    |
| 50  | mcp       | [MCP-03](#pb-78)         | MCP tools without sdd_list_versions              | Implementable | - [ADR-063](./adr/ADR-063-unregister-sdd-list-versions.md) - `[mcp/mcp-design.md](./mcp/mcp-design.md)` §3 - `[mcp/mcp-stories.md](./mcp/mcp-stories.md)` `sdd-mcp-tool-surface` - [MCP-02](#pb-75) - [Web-portal-07](#pb-73)                                                                                                               | Sprint 3 | Done    |
| 51  | webapp    | [Web-portal-01](#pb-15)  | Invoking agents, skills, and rules tab           | Implementable | - [Web-portal-36](#pb-133) - [ADR-071](./adr/ADR-071-portal-content-paths.md) - [Web-portal-14](#pb-88) **Retired**                                                                                                                                                                                                                       | —        | Retired |
| 52  | webapp    | [Web-portal-04](#pb-70)  | Setup markdown for stdio and HTTP                | Implementable | - [MCP-02](#pb-75) - [ADR-058](./adr/ADR-058-stdio-end-user-http-fallback.md) - [ADR-061](./adr/ADR-061-setup-prompt-public-path.md) - `[mcp/mcp-stories.md](./mcp/mcp-stories.md)` `sdd-mcp-prompt-setup`                                                                                                                                  | Sprint 2 | Done    |
| 53  | webapp    | [Web-portal-05](#pb-71)  | Instructions page layout                         | Implementable | - `[admin-portal/ui-mockup/01-home.html](./admin-portal/ui-mockup/01-home.html)` - [ADR-061](./adr/ADR-061-setup-prompt-public-path.md) - [Web-portal-06](#pb-72)                                                                                                                                                                           | Sprint 2 | Done    |
| 54  | webapp    | [Web-portal-06](#pb-72)  | One-line GET /setup copy                         | Implementable | - [Web-portal-04](#pb-70) - `[mcp/mcp-design.md](./mcp/mcp-design.md)` §2.1 - [ADR-061](./adr/ADR-061-setup-prompt-public-path.md)                                                                                                                                                                                                          | Sprint 2 | Done    |
| 55  | webapp    | [Web-portal-07](#pb-73)  | Features tab from three markdown files           | Implementable | - [MCP-03](#pb-78) - [ADR-071](./adr/ADR-071-portal-content-paths.md) - `[admin-portal/app-design.md](./admin-portal/app-design.md)` Features catalog                                                                                                                                                                                       | Sprint 3 | Done    |
| 56  | webapp    | [Web-portal-08](#pb-74)  | Secret lookup by name                            | Implementable | - [Web-portal-13](#pb-83) - [ADR-067](./adr/ADR-067-get-secret-on-setup.md)                                                                                                                                                                                                                                                                 | Sprint 3 | Retired |
| 57  | webapp    | [Web-portal-09](#pb-76)  | Public landing, footer, and password gate        | Implementable | - `[issues-log.md](./issues-log.md)` WA-01–WA-04 - `[admin-portal/app-stories.md](./admin-portal/app-stories.md)` - `[admin-portal/app-design.md](./admin-portal/app-design.md)`                                                                                                                                                            | Sprint 3 | Done    |
| 58  | webapp    | [Web-portal-10](#pb-77)  | On-page reset submit and Features tab switch     | Implementable | - `[issues-log.md](./issues-log.md)` WA-05–WA-06 - `[admin-portal/app-stories.md](./admin-portal/app-stories.md)` - `[admin-portal/app-design.md](./admin-portal/app-design.md)`                                                                                                                                                            | Sprint 3 | Done    |
| 59  | webapp    | [Web-portal-11](#pb-79)  | Reset success without email in the URL           | Implementable | - `[issues-log.md](./issues-log.md)` WA-08 - WA-10 - `[admin-portal/app-stories.md](./admin-portal/app-stories.md)` - `[admin-portal/app-design.md](./admin-portal/app-design.md)`                                                                                                                                                          | Sprint 3 | Done    |
| 60  | webapp    | [Web-portal-12](#pb-81)  | Scrum in SDD tab                                 | Implementable | - [Spec-seeds-01](#pb-33) - `[admin-portal/app-design.md](./admin-portal/app-design.md)` `/instructions` - [ADR-068](./adr/ADR-068-scrum-in-sdd-filename.md) - `[scrum-in-sdd.en.md](../src/content/scrum-in-sdd/scrum-in-sdd.en.md)`                                                                                                       | Sprint 3 | Done    |
| 61  | webapp    | [Web-portal-13](#pb-83)  | Get secret on Setup                              | Implementable | - [ADR-067](./adr/ADR-067-get-secret-on-setup.md) - `[admin-portal/ui-mockup/13-instructions.html](./admin-portal/ui-mockup/13-instructions.html)` - `[mcp/mcp-stories.md](./mcp/mcp-stories.md)` `sdd-mcp-get-key`                                                                                                                                                                                          | Sprint 3 | Done    |
| 62  | webapp    | [Web-portal-14](#pb-88)  | README for IDE invoke differences                | Implementable | - [Web-portal-36](#pb-133)                                                                                                                                                                                                                                                                                                                  | —        | Retired |
| 63  | webapp    | [Spec-seeds-14](#pb-82)  | Seed features.md under content/features          | Implementable | - [Web-portal-07](#pb-73) - [MCP-07](#pb-105)                                                                                                                                                                                                                                                                                               | —        | ToDo    |
| 64  | framework | [Spec-seeds-15](#pb-97)  | Lite install manifest file                       | Implementable | - [ADR-107](./adr/ADR-107-lite-pack-allowlist-filename.md) - [Web-portal-17](#pb-98) - [Spec-seeds-18](#pb-122) - [MCP-07](#pb-105)                                                                                                                                                                                                                                                                                               | Sprint 8 | ToDo    |
| 65  | mcp       | [MCP-05](#pb-101)        | Partial install ledger for subset copy           | Implementable | - [Category: lite installer](#category-framework-http-lite-installer-through-local-agent) - [MCP-01](#pb-16)                                                                                                                                                                                                                                | —        | Retired |
| 66  | webapp    | [Web-portal-17](#pb-98)  | Lite install file links API                      | Implementable | - [Spec-seeds-15](#pb-97) - [Spec-seeds-18](#pb-122) - [MCP-07](#pb-105)                                                                                                                                                                                                                                                                                               | Sprint 8 | Done    |
| 67  | framework | [Spec-seeds-18](#pb-122) | Lite install client receipt                      | Implementable | - [Spec-seeds-15](#pb-97) - [Web-portal-17](#pb-98) - [Web-portal-18](#pb-99) - [MCP-01](#pb-16)                                                                                                                                                                                                                                          | Sprint 8 | Done    |
| 68  | webapp    | [Web-portal-18](#pb-99)  | Lite install prompt and one-line copy (two parts) | Implementable | - [Web-portal-17](#pb-98) - [Spec-seeds-18](#pb-122) - [Web-portal-04](#pb-70) - [Web-portal-06](#pb-72) - [ADR-061](./adr/ADR-061-setup-prompt-public-path.md) - [`admin-portal/app-stories.md`](./admin-portal/app-stories.md) AC20–AC21                                                                                                                                                                                          | Sprint 8 | Done    |
| 69  | webapp    | [Web-portal-19](#pb-100) | Lite install one-line copy                       | Implementable | - [Web-portal-18](#pb-99) **Retired** (merged)                                                                                                                                                                                                                                                                                              | —        | Retired |
| 70  | framework | [i18n-04](#pb-102)       | HanS and HanT scrum-in-sdd.md                    | Implementable | - [Spec-seeds-01](#pb-33) - [i18n-01](#pb-67) - [ADR-126](./adr/ADR-126-ai-read-pack-templates-and-pack-scrum-in-sdd-filename.md)                                                                                                                                                                                                            | —        | Retired |
| 71  | framework | [i18n-05](#pb-103)       | HanS and HanT process template seeds             | Implementable | - [Spec-seeds-05](#pb-36) - [Spec-seeds-06](#pb-37) - [Spec-seeds-07](#pb-38) - [Spec-seeds-08](#pb-39) - [i18n-02](#pb-68) **Retired**                                                                                                                                                                                                    | —        | ToDo    |
| 72  | mcp       | [MCP-06](#pb-104)        | sdd-mcp GitHub Releases                          | Implementable | - [MCP-02](#pb-75) - [ADR-058](./adr/ADR-058-stdio-end-user-http-fallback.md) - [MCP-04](#pb-92) **Retired**                                                                                                                                                                                                                                | —        | ToDo    |
| 73  | mcp       | [MCP-07](#pb-105)        | Production pack sync for install                 | Implementable | - [MCP-01](#pb-16) - [MCP-04](#pb-92) **Retired** - [Spec-seeds-14](#pb-82)                                                                                                                                                                                                                                                                | —        | ToDo    |
| 74  | webapp    | [Web-portal-20](#pb-106) | Canonical public hostname                        | Implementable | - [Web-portal-09](#pb-76) - [Web-portal-21](#pb-107) - [Web-portal-22](#pb-108)                                                                                                                                                                                                                                                            | —        | ToDo    |
| 75  | webapp    | [Web-portal-21](#pb-107) | Install-first public landing                     | Implementable | - [Web-portal-07](#pb-73) - [Web-portal-06](#pb-72) - [Web-portal-20](#pb-106)                                                                                                                                                                                                                                                             | —        | ToDo    |
| 76  | webapp    | [Web-portal-22](#pb-108) | Admin routes off public hostname                 | Implementable | - [Web-portal-09](#pb-76) - [Web-portal-20](#pb-106)                                                                                                                                                                                                                                                                                        | —        | ToDo    |
| 77  | framework | [Spec-seeds-16](#pb-110) | Pack instructions tabs JSON                      | Implementable | - [Web-portal-24](#pb-111) - [Web-portal-25](#pb-112) - [ADR-071](./adr/ADR-071-portal-content-paths.md)                                                                                                                                                                                                                        | Sprint 8 | Done    |
| 78  | webapp    | [Web-portal-24](#pb-111) | Instructions tabs config API                     | Implementable | - [Spec-seeds-16](#pb-110) - [MCP-01](#pb-16) - [ADR-071](./adr/ADR-071-portal-content-paths.md)                                                                                                                                                                                                                                           | Sprint 8 | Done    |
| 79  | webapp    | [Web-portal-25](#pb-112) | Dynamic instructions tab UI                      | Implementable | - [Web-portal-24](#pb-111) - [Web-portal-05](#pb-71) - [Web-portal-10](#pb-77) - `[admin-portal/app-design.md](./admin-portal/app-design.md)`                                                                                                                                                                                              | Sprint 8 | Done    |
| 80  | framework | [Spec-seeds-17](#pb-121) | Reviewed full pack seeds file                    | Implementable | - [MCP-01](#pb-16) - [Agent-04](#pb-17) - [ADR-057](./adr/ADR-057-install-ledger-pack-complete.md) - [ADR-059](./adr/ADR-059-ledger-lists-pack-files.md) - [seed-artifacts-building-guide.md](./seed-artifacts-building-guide.md) - [`.sdd-installed.example.json`](../pack.framework.sdd.works/.sdd-installed.example.json) | —        | ToDo    |
| 81  | webapp    | [Web-portal-26](#pb-123) | Pack repo file note on Admin Settings            | Implementable | - [ADR-107](./adr/ADR-107-lite-pack-allowlist-filename.md) - [Spec-seeds-15](#pb-97) - [Spec-seeds-16](#pb-110) - [Spec-seeds-18](#pb-122) - [MCP-07](#pb-105) - [`src/content/.admin-note.md`](../src/content/.admin-note.md) | —        | ToDo    |
| 82  | webapp    | [Web-portal-27](#pb-124) | Learn Scrum in SDD tab                           | Implementable | - [Web-portal-25](#pb-112) - [Spec-seeds-16](#pb-110) - [Web-portal-12](#pb-81) - WordPress portfolio embed on sdd.works - [`admin-portal/app-design.md`](./admin-portal/app-design.md)                                                                                                                                                          | Sprint 8 | Done    |
| 83  | webapp    | [Web-portal-28](#pb-125) | Content tab heading anchors                      | Implementable | - [ADR-109](./adr/ADR-109-content-tab-heading-anchors.md) - [Web-portal-24](#pb-111) - [Web-portal-25](#pb-112) - [Web-portal-07](#pb-73) - [Web-portal-12](#pb-81)                                                                                                                                                                     | Sprint 8 | Done    |
| 84  | webapp    | [Web-portal-29](#pb-126) | Sticky guide header                              | Implementable | - [ADR-111](./adr/ADR-111-guide-header-sticky.md) - [Web-portal-05](#pb-71) - [Web-portal-25](#pb-112) - [Web-portal-28](#pb-125) - [feature-81](./sprint-backlog.md#sprint-8)                                                                                                                                                           | Sprint 8 | Done    |
| 85  | webapp    | [Web-portal-30](#pb-127) | Hostnames learn.sdd.works and sdd.works          | Implementable | - [Web-portal-20](#pb-106) - [Web-portal-09](#pb-76) - [Web-portal-22](#pb-108) - [Web-portal-27](#pb-124)                                                                                                                                                                                                                            | Sprint 9 | ToDo    |
| 86  | webapp    | [Web-portal-31](#pb-128) | Get secret on Learn Scrum tab                    | Implementable | - [ADR-115](./adr/ADR-115-get-secret-on-learn-tab.md) - [Web-portal-27](#pb-124) - [Web-portal-13](#pb-83) - [ADR-113](./adr/ADR-113-learn-embed-copy-and-fallback.md)                                                                                                                                                               | Sprint 9 | ToDo    |
| 87  | webapp    | [Web-portal-32](#pb-129) | Learn embed loading skeleton                     | Implementable | - [ADR-118](./adr/ADR-118-learn-embed-loading-skeleton.md) - [Web-portal-27](#pb-124) - AC32 [`app-stories.md`](./admin-portal/app-stories.md)                                                                                                                                                                                         | Sprint 9 | ToDo    |
| 88  | webapp / pack | [Web-portal-33](#pb-130) | Instructions tab labels in pack JSON           | Implementable | - [ADR-119](./adr/ADR-119-instructions-tab-labels-in-pack-config.md) - [WA-16](./issues-log.md) - [Spec-seeds-16](#pb-110) - [Web-portal-25](#pb-112) - AC33 [`app-stories.md`](./admin-portal/app-stories.md)                                                                                                                        | Sprint 9 | ToDo    |
| 89  | webapp    | [Web-portal-34](#pb-131) | SDD WORKS wordmark logo                          | Implementable | - [ADR-121](./adr/ADR-121-sdd-works-wordmark-logo.md) - [`src/618x618.logos.png`](../src/618x618.logos.png) - AC35 [`app-stories.md`](./admin-portal/app-stories.md) - mockup approved - [feature-78](./sprint-backlog.md#sprint-9)                                                                                                    | Sprint 9 | ToDo    |
| 90  | webapp    | [Web-portal-35](#pb-132) | Instructions guide hero and Setup tab            | Implementable | - [ADR-122](./adr/ADR-122-instructions-guide-hero-and-setup-tab.md) - AC36 [`app-stories.md`](./admin-portal/app-stories.md) - mockup `01-home.html`, `13-instructions.html` - pairs with [Web-portal-34](#pb-131) - [feature-79](./sprint-backlog.md#sprint-9)                                                                       | Sprint 9 | ToDo    |
| 91  | webapp / pack | [Web-portal-36](#pb-133) | Internal page folder tab                     | Implementable | - [Web-portal-25](#pb-112) - [ADR-124](./adr/ADR-124-internal-page-folder-index-json.md) - [ADR-071](./adr/ADR-071-portal-content-paths.md) - pack `content/knowledge/` - [feature-74](./sprint-backlog.md#sprint-9)                                                                                                                  | Sprint 9 | ToDo    |
| 92  | webapp    | [Web-portal-37](#pb-134) | Unified guide markdown body                      | Implementable | - [ADR-123](./adr/ADR-123-unified-guide-markdown-body.md) - [WA-18](./issues-log.md) - AC37 [`app-stories.md`](./admin-portal/app-stories.md) - [feature-77](./sprint-backlog.md#sprint-9)                                                                                                                                              | Sprint 9 | ToDo    |



[Back to top](#index)

---



# Change record


| Date       | Change                                                                                                                                                                                                                                                                                                                                                                                                          |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-10-08 | `sdd-refine-backlog` accept all: [Web-portal-01](#pb-15) **Retired** (superseded by [Web-portal-36](#pb-133)). [Web-portal-29](#pb-126) **Done** on Sprint 8 as [feature-81](./sprint-backlog.md#sprint-8). Added [Web-portal-37](#pb-134) and [feature-77](./sprint-backlog.md#sprint-9). [Web-portal-34](#pb-131) and [Web-portal-35](#pb-132) on Sprint 9 as [feature-78](./sprint-backlog.md#sprint-9) and [feature-79](./sprint-backlog.md#sprint-9). Unplanned PBIs drop retired [i18n-04](#pb-102) and [Web-portal-01](#pb-15). |
| 2026-10-08 | Added [Web-portal-36](#pb-133) **internal_page_folder** tab type (pack folder tree + `.index.json`, in-panel vs new-tab open). Scheduled on [Sprint 9](./sprint-backlog.md#sprint-9) as [feature-74](./sprint-backlog.md#sprint-9). |
| 2026-10-08 | Sprint 9 SBIs [feature-75](./sprint-backlog.md#sprint-9) ([Web-portal-32](#pb-129)) and [feature-76](./sprint-backlog.md#sprint-9) ([Web-portal-33](#pb-130)) added to match Product Backlog Sprint 9 rows. |
| 2026-10-07 | User confirmed [feature-51](./sprint-backlog.md#sprint-8) and [task-01](./sprint-backlog.md#sprint-8) usable. [Agent-03](#pb-10) and [Agent-02](#pb-8) **Done**. Sprint 8 **Done**. |
| 2026-10-07 | Pack field example renamed to [`.sdd-installed.example.json`](../pack.framework.sdd.works/.sdd-installed.example.json). Client ledger stays `{client_root}/.sdd-installed.json`. |
| 2026-10-07 | Added [Spec-seeds-17](#pb-121) reviewed full pack seeds manifest plus authoring [`.sdd-installed.json`](../pack.framework.sdd.works/.sdd-installed.json) seed. Unscheduled. |
| 2026-10-07 | Added [Skill-24](#pb-120) `sdd-retrospective` on **Sprint 8** ([feature-69](./sprint-backlog.md#sprint-8)). [Skill-06](#pb-28) stays **Done** (Sprint 6 first delivery). |
| 2026-10-06 | `sdd-refine-backlog` accept all: every Product Backlog row has a `pb-N` anchor and one `pb-N` anchor on every Requirements line. Links to removed Skill-02, Skill-03 (old), Skill-10, and Skill-13 (old) ids are plain text. [Web-portal-21](#pb-107) is Sprint 8 (parent of task-03). [Skill-22](#pb-118) drops the confirmation bullet. Sprint 8 task-02 moved to an OGT on `status.md`. |
| 2026-10-06 | Sprint 7 **Done**; Sprint 8 **WIP** with eleven scheduled SBIs (install-first MVP). |
| 2026-10-06 | User **close confirm** for [feature-61](./sprint-backlog.md#sprint-7), [feature-62](./sprint-backlog.md#sprint-7), [feature-64](./sprint-backlog.md#sprint-7) through [feature-68](./sprint-backlog.md#sprint-7): [Skill-17](#pb-113) through [Skill-23](#pb-119) **Done**. |
| 2026-10-06 | All pack skill seeds: [`framework-design`](./framework/framework-design.md#pack-skill-seed-catalog) catalog, § **sdd-spec-to-build**, sibling files on Skill-01, Skill-11, Skill-18, Skill-23, and **CE-SKILL-04** / **19** / **20** aligned with the authoring tree. |
| 2026-10-06 | [Skill-22](#pb-118) `mcp-expert` seed matches the confirmed requirement: current patterns, a registry search, and one MCP solution before code. |
| 2026-10-06 | [Skill-21](#pb-117) `ai-architect`: `framework-design`, `framework-stories`, and **CE-SKILL-17** match the seed (`terms.md`, style, operating design). feature stays **WIP** until close confirm. |
| 2026-10-06 | [Skill-21](#pb-117) `ai-architect`: seed adds the seven confirmed architect jobs and `terms.md`. feature stays **WIP** until close confirm. |
| 2026-10-06 | [Skill-21](#pb-117) `ai-architect`: the skill covers current AI terms and enterprise architecture, and it proposes a design from known facts. Extra architect jobs wait for chat confirm. Seed not rewritten. |
| 2026-10-06 | [Skill-20](#pb-116) renamed to `fullstack-engineer` per [ADR-104](./adr/ADR-104-fullstack-engineer-pack-skill-name.md). Seed at `pack.framework.sdd.works/skills/fullstack-engineer/`. feature-65 stays **ToDo**. |
| 2026-10-06 | [Skill-19](#pb-115) `frontend-developer`: strong UI implementation skill with minimal framework dependency. Not a copy of the personal Cache Components skill. Sprint row stays [feature-64](./sprint-backlog.md#sprint-7) **ToDo**. |
| 2026-10-06 | [Skill-18](#pb-114) `testing-expert`: the skill designs the strategy, defines tools, creates tests, runs the pyramid, and writes the report. It does not only run tests that already exist. |
| 2026-10-06 | [Skill-20](#pb-116) `fullstack-engineer`, [Skill-21](#pb-117) `ai-architect`, [Skill-22](#pb-118) `mcp-expert`, and [Skill-23](#pb-119) `rag-expert` are **WIP**: seeds exist under `pack.framework.sdd.works/skills/`. Each closes after its CE-SKILL case and user confirm. |
| 2026-10-06 | Added [Skill-20](#pb-116) `fullstack-developer`, [Skill-21](#pb-117) `ai-architect`, [Skill-22](#pb-118) `mcp-expert`, and [Skill-23](#pb-119) `rag-expert` as Sprint 7 feature-65 to feature-68 **ToDo**. |
| 2026-10-06 | [Skill-18](#pb-114) renamed to `testing-expert` per [ADR-102](./adr/ADR-102-testing-expert-pack-skill-name.md). feature-62 stays **WIP**. Seed not written. |
| 2026-10-06 | Sprint 7: [feature-61](./sprint-backlog.md#sprint-7) and [feature-62](./sprint-backlog.md#sprint-7) **WIP**. Added [Skill-19](#pb-115) `frontend-developer` as Sprint 7 feature-64 **ToDo**. Skill-18 scope widened to generic testing. |
| 2026-10-06 | [Skill-17](#pb-113) pack folder renamed to `frontend-designer` per [ADR-105](./adr/ADR-105-frontend-designer-pack-skill-name.md). Authoring seed shipped; feature-61 stays **WIP** until CE-SKILL-15 and close confirm. |
| 2026-10-05 | Sprint 7: [Skill-17](#pb-113) **feature-61**, [Skill-18](#pb-114) **feature-62** **ToDo**; [Rule-04](#pb-95) **feature-63** **Done** (PBI closed 2026-10-04, sprint row added for accounting). |
| 2026-10-05 | Added [Skill-17](#pb-113) `sdd-frontend-design` and [Skill-18](#pb-114) `sdd-tester` (unscheduled **ToDo**). Unplanned PBIs table synced on [`sprint-backlog.md`](./sprint-backlog.md). No pack seeds yet.                                                                                                                                                              |
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
| 2026-09-25 | Spec-seeds acceptance is the same four checks for every row: user review, stored in `pack.framework.sdd.works/`, associated specs updated, seed tree cross-reviewed.                                                                                                                                                                                                                                               |
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
| 2026-10-01 | Sprint 4 feature-20 moves to Sprint 5 as ToDo, with Skill-03. Sprint 4 feature-13 and feature-15 move to Sprint 13 as ToDo: design before implement ([Skill-14](#pb-80), Skill-13). Sprint 4 feature-12 and feature-14 fold into feature-30 (Skill-07), still Sprint 4 ToDo. feature-29 is a task.                                                                                |
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
| 2026-10-04 | The header is three lines: Type, as_of, and Definition. Scope and Requirements leave column rules in `sdd-scrum-practices.md`. [Spec-seeds-07](#pb-38) and [Spec-seeds-13](#pb-84) link those sections.                                                                                                                                                                                                         |
| 2026-10-04 | Agent-02 and Agent-04 are removed. Their bullets sit on [Agent-03](#pb-8). `#pb-7` and `#pb-9` stay unused. Sprint rows that named those items now name Agent-03.                                                                                                                                                                                                                                               |
| 2026-10-04 | [Skill-05](#pb-25) folder name is `sdd-refine-backlog`. Constants key stays `skill_refine_pb`. Living guides, catalogs, and Sprint 6 feature-01 use the new name. No `SKILL.md` yet.                                                                                                                                                                                                                            |
| 2026-10-04 | Agent-15 merges into Agent-01. Agent-05 and Agent-06 merge into Agent-03 Guiding proposals. Agent-07 becomes Agent-04 onboard with pack receipt. Skill and Spec-seeds codes are sequential. Web-portal-15 (`#pb-91`) is Integrated sites. Unused: `#pb-11`, `#pb-63`.                                                                                                                                           |
| 2026-10-04 | [Skill-11](#pb-80) is `sdd-spec-to-build` ([ADR-085](./adr/ADR-085-sdd-spec-to-build.md)). Skill-02 and Skill-10 are Retired. Living catalogs drop `sdd-tdd`, `sdd-design`, and `sdd-implement`.                                                                                                                                                                                            |
| 2026-10-04 | Removed Sprint 5–16 from `[sprint-backlog.md](./sprint-backlog.md)`. Those PBIs use `Sprint` `—` and appear in Unplanned PBIs after Sprint 4.                                                                                                                                                                                                                                                                   |
| 2026-10-04 | [Terminology in practice](../pack.framework.sdd.works/templates/sdd-scrum-practices.md#terminology-in-practice) is a six-row table (PBI, SBI, Feature, Task, OGT, MVP). Artifact Definition links point at Artifacts writing guideline sections.                                                                                                                                                                       |
| 2026-10-04 | `sdd-refine-backlog`: [MCP-01](#pb-16) is Done for the installer slice (Sprint 2). [MCP-04](#pb-92) is go-live. Added [Skill-15](#pb-93) and [Skill-16](#pb-94). Removed retired Skill-02 and Skill-10 rows. [Skill-05](#pb-26) is WIP.                                                                     |
| 2026-10-04 | `sdd-refine-backlog`: Web-portal-15 is Theme **Unified public site** (sdd.works + framework.sdd.works integration and redesign). Web-portal-03 is Done ([Web-portal-09](#pb-76)). [Agent-02](#pb-8), [MCP-04](#pb-92), and [i18n-01](#pb-67) are Theme.             |
| 2026-10-04 | `sdd-refine-backlog` (user picks): Added [Web-portal-07](#pb-73) table row. Removed Web-portal-03. [Web-portal-12](#pb-81) Done. Web-portal-15 Epic **Unified public site**. Agent-03 `artifacts-map.json` link fixed. Sprint backlog `#rid-d1` on D-1.                                                                                   |
| 2026-10-04 | Requirements use one `pb-N` anchor. The Requirements line and Product Backlog table both link `[PBI code](#pb-N)` to that anchor. Cross-file links from `sprint-backlog.md` use `./product-backlog.md#L{line}`.                                                                                                                                                                                                      |
| 2026-10-04 | [Rule-04](#pb-95) **Done**: pack rule `friendly-language.mdc` (constants key `friendly-language`). Repo audit found no `sdd-friendly-language`. Guides, features catalogs, framework design/stories/tests, and admin portal AC list four harness rules.                                                                                                                                                         |
| 2026-10-04 | `sdd-refine-backlog` accept all: Unplanned PBIs adds Rule-04; Spec-seeds Related sync; Skill-05 ToDo; i18n-01 EN-only practices; Web-portal-05 points call-up research at Web-portal-01.                                                                                                                                                                                                                        |
| 2026-10-04 | [Agent-02](#pb-8) `Size` is **Epic** on the Product Backlog table and Unplanned PBIs. Child skill PBIs stay Implementable until split or schedule.                                                                                                                                                                                                                                          |
| 2026-10-05 | [Skill-13](#pb-87), [Skill-15](#pb-93), [Skill-16](#pb-94): pack folders `create-skill`, `build-agent`, `create-rule` ([ADR-089](./adr/ADR-089-pack-authoring-skill-names.md)). Constants keys unchanged. Superseded same day by [ADR-092](./adr/ADR-092-pack-authoring-skill-sdd-prefix.md) revert to `sdd-*` folders.                             |
| 2026-10-05 | [ADR-092](./adr/ADR-092-pack-authoring-skill-sdd-prefix.md): pack authoring folders `sdd-create-skill`, `sdd-build-agent`, `sdd-create-rule`. Seeds, constants, specs, and operator `~/.cursor/skills/` synced. Unprefixed pack copies removed on update.                                                                                                                                                       |
| 2026-10-05 | [Spec-seeds-04](#pb-35): optional `adr` and `knowledge` map keys name directory roots ([ADR-090](./adr/ADR-090-adr-knowledge-map-roots.md)).                                                                                                                                                                                                                                                |
| 2026-10-05 | [Rule-03](#pb-20) **Retired**: `realtime-status.mdc` removed; `status.md` on close in `sdd-dod.mdc` ([ADR-091](./adr/ADR-091-retire-realtime-status-rule.md)).                                                                                                                                                                                                                              |
| 2026-10-05 | [Rule-03](#pb-20) reopened as **sdd-keep-update.mdc** WIP sync ([ADR-093](./adr/ADR-093-keep-update-wip-rule.md)); Sprint 6 feature-43 **WIP**.                                                                                                                                                                                                                                             |
| 2026-10-05 | [Skill-14](#pb-89) seed **improve-prompt** ([ADR-099](./adr/ADR-099-improve-prompt-skill-name.md)); replaces `prompt-optimizer`; TRUE AGENT body, no ECC catalog.                                                                                                                                                                                                                           |
| 2026-10-05 | [Skill-14](#pb-89) living specs: framework-design § improve-prompt, **CE-SKILL-13**, expanded PBI bullets, English-only seed triggers/examples.                                                                                                                                                                                                                                            |
| 2026-10-05 | Framework-bound pack rules use `sdd-` filenames ([ADR-094](./adr/ADR-094-sdd-prefix-framework-rules.md)): `sdd-dod.mdc`, `sdd-incremental-delivery.mdc`, `sdd-keep-update.mdc`; `friendly-language.mdc` unchanged. Rule-01–03 titles and constants values updated.                                                                                                                                              |
| 2026-10-05 | `sdd-refine-backlog` accept all: [i18n-02](#pb-68) Size **Theme**. Skill-13, Skill-15, Skill-16 Related and ADR-089 install-folder bullets. Unplanned PBIs synced. Web-portal-15 Size **Epic** on the table (not Theme).                                                                                                                                      |
| 2026-10-05 | `sdd-plan-sprint` Option A: [Skill-03](#pb-24), [Skill-04](#pb-25), [Skill-05](#pb-26), [Skill-13](#pb-87), [Skill-15](#pb-93), [Skill-16](#pb-94) scheduled **Sprint 5**. [Rule-04](#pb-95) stays Done, unscheduled.                                               |
| 2026-10-05 | Sprint 5 Done. User confirmed usable. [Skill-03](#pb-24) through [Skill-16](#pb-94) (planning loop and pack authoring seeds) marked **Done**.                                                                                                                                                                                                                           |
| 2026-10-05 | `sdd-plan-sprint` Option A for Sprints 6–8: process rules and skills + Spec-seeds-05 (S6); engineering skills and seeds (S7); [Agent-03](#pb-10) plus Agent-02 and CE-SKILL tasks (S8). OGT refine [i18n-03](#pb-69).                                                                                                                                                   |
| 2026-10-05 | EN `[sdd-scrum-practices.md](../pack.framework.sdd.works/templates/sdd-scrum-practices.md)` §5 Feature break down. `[sdd-refine-backlog](../pack.framework.sdd.works/skills/sdd-refine-backlog/SKILL.md)` and `[sdd-plan-sprint](../pack.framework.sdd.works/skills/sdd-plan-sprint/SKILL.md)` Knowledge rows point at that section.                                                                                                       |
| 2026-10-05 | [Rule-01](#pb-18) and [Rule-02](#pb-19) **Done**. User confirmed usable. Sprint 6 [feature-37](./sprint-backlog.md#sprint-6)–[feature-39](./sprint-backlog.md#sprint-6) **Done**. [Rule-03](#pb-20) stays **Retired** (no rule shipped).                                                                                                            |
| 2026-10-05 | OGT 4–6 closed: `release.md` seed ([Spec-seeds-11](#pb-41)), `test-strategy.md` seed ([Spec-seeds-13](#pb-90)), `artifacts-map.json` as SDD Core artifact in practices and guides.                                                                                                                                                                                      |
| 2026-10-05 | Status review: RIDs D-2, D-3, R-1 closed. [Spec-seeds-11](#pb-41) and [Spec-seeds-13](#pb-90) **WIP**; [feature-48](./sprint-backlog.md#sprint-7) and [feature-50](./sprint-backlog.md#sprint-7) **WIP**.                                                                                                                                                               |
| 2026-10-05 | [Rule-03](#pb-20) renamed to **sdd-realtime-status.mdc**; constants key `realtime-status` ([ADR-096](./adr/ADR-096-sdd-realtime-status-rule-name.md)). feature-43 **WIP**.                                                                                                                                                                                                                  |
| 2026-10-05 | User confirmed feature-43 usable: [Rule-03](#pb-20) **Done**. [Skill-07](#pb-29) **Retired**; Sprint 6 feature-41 **Done**. [Skill-06](#pb-28) and feature-40 **WIP**.                                                                                                                                                                              |
| 2026-10-05 | Status review: [feature-37](./sprint-backlog.md#sprint-6) and [Rule-01](#pb-18) **WIP**. Sprint 7 atdd SBI **feature-52**; Sprint 7 all **ToDo**. ethan.md: no close-sprint job.                                                                                                                                                                                                            |
| 2026-10-05 | User confirmed usable: [Spec-seeds-05](#pb-36) and Sprint 6 [feature-42](./sprint-backlog.md#sprint-6) **Done** after **sdd-retrospective**.                                                                                                                                                                                                                                                |
| 2026-10-05 | User confirmed usable: [Rule-01](#pb-18) and [Skill-06](#pb-28); Sprint 6 [feature-37](./sprint-backlog.md#sprint-6) and [feature-40](./sprint-backlog.md#sprint-6) **Done** after **sdd-retrospective**. [Spec-seeds-05](#pb-36) and [feature-42](./sprint-backlog.md#sprint-6) **WIP** again.                                                     |
| 2026-10-05 | User confirmed usable: [Spec-seeds-05](#pb-36) and Sprint 6 [feature-42](./sprint-backlog.md#sprint-6) **Done** after **sdd-retrospective** (re-close; Learnings **#4**).                                                                                                                                                                                                                   |
| 2026-10-05 | Sprint 6 [task-01](./sprint-backlog.md#sprint-6) cross-review of five process files **Done**; [pb-36](#pb-36) wording aligned to placeholder template.                                                                                                                                                                                                                              |
| 2026-10-05 | User confirmed Sprint 6 usable; [Sprint 6](./sprint-backlog.md#sprint-6) **Status: Done** on `[sprint-backlog.md](./sprint-backlog.md)`.                                                                                                                                                                                                                                                                        |
| 2026-10-05 | [ADR-098](./adr/ADR-098-sprint-backlog-dod-link-product-backlog.md): **Definition of Done** is canonical here; `sprint-backlog.md` links to `#definition-of-done` instead of duplicating checks.                                                                                                                                                                                                                |
| 2026-10-05 | Added Epic Web-portal-16: prompt-driven install of core pack skills and rules only (2study.ai copy line; framework.sdd.works backend; pack from separate Git repo).                                                                                                                                                                                                                                   |
| 2026-10-05 | `sdd-refine-backlog`: split Web-portal-16 into Implementable [Spec-seeds-15](#pb-97), [MCP-05](#pb-101), [Web-portal-17](#pb-98), [Web-portal-18](#pb-99), [Web-portal-19](#pb-100). Epic stays ToDo until children Done.                                                                                                                                                                             |
| 2026-10-05 | `sdd-plan-sprint`: Sprint 8 adds Web-portal-15 task-03, [Spec-seeds-15](#pb-97), [MCP-05](#pb-101), [Web-portal-17](#pb-98)–[Web-portal-19](#pb-100) (feature-53–57). Epics Web-portal-15 and Web-portal-16 stay unscheduled. Agent-03 and ethan tasks remain on Sprint 8.                                                                                                        |
| 2026-10-05 | `sdd-refine-backlog`: All Epic and Theme PBIs split or retired. [Agent-02](#pb-8) **Implementable** Sprint 8. New: [i18n-04](#pb-102), [i18n-05](#pb-103), [MCP-06](#pb-104), [MCP-07](#pb-105), [Web-portal-20](#pb-106)–[Web-portal-22](#pb-108). Retired: [i18n-01](#pb-67), [i18n-02](#pb-68), [MCP-04](#pb-92), Web-portal-15, Web-portal-16. |
| 2026-10-05 | Added Theme Web-portal-23: configurable instructions tabs (Setup fixed default; Features, Scrum in SDD, and future tabs from pack JSON; sync cache; i18n). |
| 2026-10-05 | `sdd-refine-backlog` + `sdd-plan-sprint`: split Web-portal-23 into [Spec-seeds-16](#pb-110), [Web-portal-24](#pb-111), [Web-portal-25](#pb-112) on **Sprint 8** (feature-58–60). |
| 2026-10-05 | User confirmed usable: Sprint 7 [feature-52](./sprint-backlog.md#sprint-7), [feature-44](./sprint-backlog.md#sprint-7), [feature-46](./sprint-backlog.md#sprint-7), [feature-47](./sprint-backlog.md#sprint-7), [feature-48](./sprint-backlog.md#sprint-7), [feature-50](./sprint-backlog.md#sprint-7) **Done**. [Skill-01](#pb-21), [Skill-09](#pb-64), [Skill-14](#pb-89), [Spec-seeds-10](#pb-40), [Spec-seeds-11](#pb-41), [Spec-seeds-13](#pb-90) **Done**. [Skill-11](#pb-80) and [Spec-seeds-12](#pb-66) stay **ToDo**. |
| 2026-10-05 | User confirmed [feature-49](./sprint-backlog.md#sprint-7) usable. [Spec-seeds-12](#pb-66) **Done**. EN [`.secrets`](../pack.framework.sdd.works/templates/EN/.secrets) seed and practices `#secrets` updated. Sprint 7 open: [feature-45](./sprint-backlog.md#sprint-7) only. |
| 2026-10-07 | Readable Requirements rewrite, lite installer category ([Spec-seeds-15](#pb-97), [Web-portal-17](#pb-98)–[Web-portal-19](#pb-100)), [MCP-05](#pb-101) **Retired** (no partial ledger on lite path). Practices writing guide; related specs aligned. See [`changes-log.md`](./changes-log.md) 2026-10-07. |
| 2026-10-07 | Removed split epic or theme rows Web-portal-15, Web-portal-16, Web-portal-23 from Requirements and Product Backlog table. Anchors `#pb-91`, `#pb-96`, `#pb-109` unused. Work stays on [Web-portal-20](#pb-106)–[Web-portal-22](#pb-108), lite PBIs, and [Spec-seeds-16](#pb-110) / [Web-portal-24](#pb-111) / [Web-portal-25](#pb-112). |
| 2026-10-07 | Merged [Web-portal-14](#pb-88) into [Web-portal-01](#pb-15) (synced invoke-agents markdown tab). Retired [Web-portal-08](#pb-74); [Web-portal-13](#pb-83) owns Get secret. Web-portal-02 is the **Install and update** markdown tab after MCP setup (full pack only). |
| 2026-10-07 | Removed Web-portal-02 from Requirements and Product Backlog table. Anchor `#pb-49` unused. Full install stays on Setup, Features, and MCP. |
| 2026-10-07 | `sdd-plan-sprint`: Sprint 8 eleven SBIs aligned to Sprint 8 PBIs; **feature-54** (MCP-05) removed from sprint table. |
| 2026-10-07 | Removed Sprint 8 **task-03**; [Web-portal-21](#pb-107) unscheduled (2study.ai partner landing, not framework `/`). |
| 2026-10-07 | Merged [Web-portal-19](#pb-100) into [Web-portal-18](#pb-99) (Part 1 agent markdown, Part 2 one-line copy). Sprint **feature-57** removed; **feature-56** owns both AC20 and AC21. |
| 2026-10-07 | Added [Spec-seeds-18](#pb-122) lite client receipt (`.sdd-lite-installed.json`, merge rules). Sprint **feature-57** reused for receipt SBI; lite HTTP order **feature-55** → **feature-57** → **feature-56**. |
| 2026-10-07 | `sdd-review-status` rows 1–4: [Agent-02](#pb-8) and [Agent-03](#pb-10) **WIP**; Agent-03 **Related** adds `coach-knowledge.md` and [ADR-106](./adr/ADR-106-coach-knowledge-file.md). |
| 2026-10-07 | Added [Web-portal-26](#pb-123) admin-only Settings note for pack GitHub files. Unscheduled. |
| 2026-10-07 | [ADR-107](./adr/ADR-107-lite-pack-allowlist-filename.md): lite pack allow-list basename `lite-pack.allowlist.json`. |
| 2026-10-07 | [Web-portal-26](#pb-123) loads the Admin Settings note from `content/.admin-note.md`. Seed: `src/content/.admin-note.md`. |
| 2026-10-07 | User confirmed [feature-57](../sprint-backlog.md#sprint-8) usable. [Spec-seeds-18](#pb-122) **Done**. |
| 2026-10-07 | Instructions tabs design confirmed: pack `content/.instructions-tabs.json` + bundled fallback only; `code` and `content` types; default tab always Setup; operator rules in [`src/content/.admin-note.md`](../src/content/.admin-note.md). Updated [Spec-seeds-16](#pb-110), [Web-portal-24](#pb-111), [Web-portal-25](#pb-112), [`app-design.md`](./admin-portal/app-design.md), AC22–AC24. |
| 2026-10-07 | Pack authoring tree moved from `specs/framework/seeds/` to [`pack.framework.sdd.works/`](../pack.framework.sdd.works/). Living requirement path strings and Definition links retargeted. See [`changes-log.md`](./changes-log.md). |
| 2026-10-07 | Added [Web-portal-27](#pb-124) **Learn Scrum in SDD** instructions **`code`** tab. Sprint 8 **feature-70**. |
| 2026-10-07 | [Web-portal-27](#pb-124): requirements set to **`code`** tab embedding **WordPress portfolio** learn pages on sdd.works with locale **i18n** (not a pack markdown tab). |
| 2026-10-07 | [ADR-109](./adr/ADR-109-content-tab-heading-anchors.md): content tabs emit GitHub-style heading ids. Added [Web-portal-28](#pb-125). Sprint 8 **feature-71**. |
| 2026-10-07 | [ADR-110](./adr/ADR-110-embedded-external-page-tab.md): tab type `embedded_external_page`. [Web-portal-27](#pb-124) Learn Scrum URLs are all `https://sdd.works/en/learn/`. |
| 2026-10-07 | [ADR-111](./adr/ADR-111-guide-header-sticky.md): guide logo, tagline, and tabs stay on screen. Tagline hairline removed. Added [Web-portal-29](#pb-126). Unscheduled. |
| 2026-10-07 | [ADR-112](./adr/ADR-112-learn-embed-frame.md): Learn iframe is square and has no border. URL stays `https://sdd.works/en/learn/`. |
| 2026-10-07 | [ADR-113](./adr/ADR-113-learn-embed-copy-and-fallback.md): Learn intro and fallback copy. Fallback opens `https://learn.sdd.works`. Embed URL unchanged. |
| 2026-10-07 | [ADR-114](./adr/ADR-114-learn-embed-auto-height.md): Learn iframe auto height via postMessage. Supersedes ADR-112 square aspect ratio. sdd.works embed layout is a dependency. |
| 2026-10-07 | User confirmed feature-55, feature-56, feature-58–60, feature-69–71 usable. Parent PBIs **Done**: [Web-portal-17](#pb-98), [Web-portal-18](#pb-99), [Spec-seeds-16](#pb-110), [Web-portal-24](#pb-111), [Web-portal-25](#pb-112), [Skill-24](#pb-120), [Web-portal-27](#pb-124), [Web-portal-28](#pb-125). [Spec-seeds-15](#pb-97) stays **ToDo** until [MCP-07](#pb-105). |
| 2026-10-07 | Added [Web-portal-30](#pb-127) hostname cutover: WordPress → `learn.sdd.works`, portal → `sdd.works`. Sprint 9 **feature-72**. |
| 2026-10-07 | [ADR-115](./adr/ADR-115-get-secret-on-learn-tab.md): Get secret on Learn tab under iframe. Added [Web-portal-31](#pb-128). Sprint 9 **feature-73**. |




[Back to top](#index)