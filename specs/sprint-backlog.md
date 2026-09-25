# sprint-backlog — [framework.sdd.works](http://framework.sdd.works)

> **Purpose**: Short-cycle execution list — what to do, what is blocked, and how to accept it.
> **Single source of truth for schedule and status**: this file. The `Sprint` column in `product-backlog.md` is a projection of this file.
> **Related**: `[architecture.md](./architecture.md)` · `[deployment.md](./deployment.md)` · `[artifacts-map.md](./artifacts-map.md)` · `[framework.seeds/templates/EN/sdd-scrum-guide.md](./framework.seeds/templates/EN/sdd-scrum-guide.md)` · `[status.md](./status.md)`
> **Numbering**: `Code` is the Type plus a two-digit number inside that sprint, such as `task-01`. When citing another document, prefer the item name. Shape: `[framework.seeds/templates/EN/framework-design.md](./framework.seeds/templates/EN/framework-design.md)`.
> **Practices**: `[sdd-scrum-practices.md](./framework.seeds/templates/EN/sdd-scrum-practices.md)` (what, how, when: jobs, templates, table conventions).
> **Framework**: `[sdd-scrum-guide.md](./framework.seeds/templates/EN/sdd-scrum-guide.md)` (names and meaning). HanS: `[sdd-scrum-guide-hans.md](./framework.seeds/templates/HanS/sdd-scrum-guide.md)`.
> **as_of**: 2026-09-25

Current sprint: Sprint 1 is Done. Next is Sprint 2, not started. Sprint 1 goal: framework.sdd.works R2 with an agent spike and POC.

Each later sprint is one small MVP. It ships a complete slice and does not wait on a later sprint.

---

## RID Registry (Risks / Impediments / Dependencies)

> This section records risks, impediments, and dependencies only. It does not belong to any sprint.


| #      | Severity     | Type       | Title                                             | Description                                                                                                                                                                                                                                                                                                                                      | Impact                                                 | Solution (→ product-backlog)                                                       | Related docs                                                                                                            | Handling note                                                                                                                               | Status | Updated    |
| ------ | ------------ | ---------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ---------- |
| **D1** | **Blocking** | Dependency | coach-ethan product presence (local Cursor agent) | Ship coach-ethan as a local Cursor agent (installable prompt in the client `agents/` tree). Remote MCP stays the installer.                                                                                                                                                                                                                      | Resolved: one presence model for product and MVPs.     | [Agent-01](./product-backlog.md#pb-6)                                              | `[agent-ethan/agent-design.md](./agent-ethan/agent-design.md)` · `[architecture.md](./architecture.md)` §2              | Decision recorded in agent-design.md. No separate ADR required for this choice.                                                             | Closed | 2026-09-22 |
| **D2** | **Blocking** | Dependency | Pack allow-list vs extra GitHub top-level files   | Pack GitHub is `Setting.githubUrl` (not this service workspace; not hard-coded). Current operator URL is a pack-only tree ([framework.sdd.works](https://github.com/ethanhuangcst/framework.sdd.works)) with `skill/`, `Rules/`, `agents/`, `templates/`, plus non-pack files. Copying every top-level name onto `{client_root}` is still wrong. | Feature-01 cannot ship an unbounded git-tree copy.     | [MCP-01](./product-backlog.md#pb-16)                                               | `[mcp/mcp-design.md](./mcp/mcp-design.md)` §1.1 and pack allow-list · `[mcp/mcp-stories.md](./mcp/mcp-stories.md)` AC1b | Copy allow-list only; map `skill`→`skills`, `Rules`→`rules`. Admin may change the URL.                                                      | Open   | 2026-09-24 |
| **D3** | **Blocking** | Dependency | `templates/` has no installer root                | ADR-056 and MCP-01 need `{client_root}/templates/`. Seed map `PathRoots` has `other` (`~/.cursor/sdd/`), not `templates`. Current `applyPackage` copies only skills/rules/agents/workflows.                                                                                                                                                      | Templates would land in the wrong place or not at all. | [MCP-01](./product-backlog.md#pb-16) · [Spec-seeds-01](./product-backlog.md#pb-32) | `[mcp/mcp-design.md](./mcp/mcp-design.md)` · `[packages/sdd-paths](../packages/sdd-paths)`                              | Feature-01 maps `templates/` → `{client_root}/templates/`. Seed-map schema change is in this feature if HTTP `paths.templates` is required. | Open   | 2026-09-24 |
| **R1** | **Medium**   | Risk       | HTTP receipt is AI-written                        | HTTP MCP cannot write the caller disk. If the AI extracts the tarball but skips writing `framework.sdd.works.json`, Ethan’s start gate never passes. Baking `pack_complete: true` into the tarball would mark a failed extract as complete.                                                                                                      | Install looks successful; `/ethan` still stops.        | [MCP-01](./product-backlog.md#pb-16) · [Agent-07](./product-backlog.md#pb-17)      | `[mcp/mcp-design.md](./mcp/mcp-design.md)` AI executor steps                                                            | Write receipt last, after verify. Instructions must name `receiptPath`. Do not commit a true receipt in git.                                | Open   | 2026-09-24 |


> **Severity**: **Blocking** = blocked product ship until closed. D1 is Closed (local Cursor agent). D2 and D3 block Sprint 2 Feature-01 until the allow-list and templates root are implemented. R1 is accepted residual on HTTP.
> **Type**: dependency = work or decision required before the related product item ships. risk = residual after the planned design.

### RID coverage


| RID | Solution (Backlog item)               | Acceptance criteria and design/test location                                                               | Sprint location                                 |
| --- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| D1  | [Agent-01](./product-backlog.md#pb-6) | `[agent-ethan/agent-design.md](./agent-ethan/agent-design.md)` · `[architecture.md](./architecture.md)` §2 | Closed: local Cursor agent for MVPs and product |
| D2  | [MCP-01](./product-backlog.md#pb-16)  | `[mcp/mcp-stories.md](./mcp/mcp-stories.md)` AC1b · `[mcp/mcp-test.md](./mcp/mcp-test.md)` P3              | Sprint 2 Feature-01                             |
| D3  | [MCP-01](./product-backlog.md#pb-16)  | `[mcp/mcp-stories.md](./mcp/mcp-stories.md)` AC1 · `[mcp/mcp-test.md](./mcp/mcp-test.md)` P4               | Sprint 2 Feature-01                             |
| R1  | [MCP-01](./product-backlog.md#pb-16)  | `[mcp/mcp-stories.md](./mcp/mcp-stories.md)` AC4–AC5 · `[mcp/mcp-test.md](./mcp/mcp-test.md)` P5–P6        | Sprint 2 Feature-01                             |


---

## Sprint 1

Sprint Goal: framework.sdd.works R2 with an agent spike and POC. The pack seeds live in this repo, and ethan can be called as a local agent.

**Status: Done** (EN guide and practices confirmed; call-up recorded; Phase 1 archive under `phase1-process-specs/`). HanS and HanT are Sprint 15.

### ToDo


| Code             | Parent PBI                                                                                                                                      | Module    | Type          | SBI                                        | Acceptance criteria                                                                                                                                                                                       | Related docs                                                                                                                                                        | Note                                                                                                                                                                   | Status |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| feature-01       | [Spec-seeds-02 Seed: sdd-scrum-guide.md](./product-backlog.md#pb-33) · [Spec-seeds-03 Seed: sdd-scrum-practices.md](./product-backlog.md#pb-34) | Framework | Feature       | Store the latest guide and practices seeds | - The user has reviewed and confirmed this seed.<br>- It is stored in the seed tree.<br>- Associated specs are updated.<br>- The whole seed tree has been cross-reviewed and is consistent. | `[framework.seeds/templates/EN/sdd-scrum-guide.md](./framework.seeds/templates/EN/sdd-scrum-guide.md)` · `[framework.seeds/templates/EN/sdd-scrum-practices.md](./framework.seeds/templates/EN/sdd-scrum-practices.md)` | - User confirmed the EN guide and practices on 2026-09-25.<br>- Stored under `templates/EN/`.<br>- Process specs point at that path.<br>- Cross-review: Sprint 1 seeds match the tree.<br>- Later sprints own `templates/project-constants.md`, `templates/EN/.secrets`, empty `agents/` `rules/` `skills/`, `framework-design.md`, and HanS/HanT. | Done |
| feature-03       | [Agent-01 agent ethan — POC](./product-backlog.md#pb-6)                                                                                         | Agent     | Feature       | Agent spike: call ethan                    | - How agent ethan is called up, and his job, are recorded in [`agent-ethan/agent-design.md`](./agent-ethan/agent-design.md). | `[agent-ethan/agent-design.md](./agent-ethan/agent-design.md)` · [D1](#rid-d1)                                                                                      | - D1 is closed.<br>- This SBI is the recorded spike, not the installer. | Done   |
| feature-04       | [Spec-01 Archive Phase 1 Scrum files](./product-backlog.md#pb-1)                                                                                | Framework | Feature       | Archive Phase 1 Scrum files                | - Phase 1 Scrum files are only under `phase1-process-specs/`.<br>- Live process files stay at `specs/`. | `[artifacts-map.md](./artifacts-map.md)`                                                                                                                            | - Already accepted.<br>- Recorded here so the PBI has a sprint row. | Done   |
| documentation-01 | [Spec-seeds-02 Seed: sdd-scrum-guide.md](./product-backlog.md#pb-33)                                                                            | Framework | Documentation | Point process docs at the seed tree        | - The user has reviewed and confirmed this seed.<br>- It is stored in the seed tree.<br>- Associated specs are updated.<br>- The whole seed tree has been cross-reviewed and is consistent. | `[artifacts-map.md](./artifacts-map.md)`                                                                                                                            | - User confirmed the EN guide and practices on 2026-09-25.<br>- Root `specs/sdd-scrum-guide.md` and `specs/sdd-scrum-practices.md` are gone.<br>- Process specs point at `templates/EN/`.<br>- Cross-review: Sprint 1 seed links are consistent.<br>- `project-constants.md` is Sprint 2. | Done |


### Retrospective

Learnings:

[Sep 24, 2026], feature-01 completed

- [The guide and practices have one authoring place](./framework.seeds/templates/EN/sdd-scrum-practices.md)
- [`/ethan` uses Cursor agents trees](./knowledge/agent/cursor-agent-callup.md)
- [A second pack copy in the workspace does not override the user root](./adr/ADR-056-single-user-root-framework-pack.md)

----------------

[Sep 25, 2026], feature-03 completed

- The `/ethan` spike is recorded. Receipt enforcement stays on Sprint 2.

----------------

[Sep 25, 2026], Sprint 1 closed

- User confirmed the EN guide and practices seeds.
- Cross-review: Sprint 1 seeds match `templates/EN/`. Later sprints own `project-constants.md`, `.secrets`, empty pack folders, `framework-design.md`, and HanS/HanT.
- Phase 1 archive path is `phase1-process-specs/`.

Opportunities:

[Sep 25, 2026], HanS and HanT moved to Sprint 15

- The HanS guide, the HanT guide, and the HanS and HanT practices are [Sprint 15](#s15-feature-01). `project-constants.md` is Sprint 2.

----------------

[Sep 25, 2026], Sprint 1 closed

- Start Sprint 2: installer ledger with `pack_complete`, then ethan start gate.

---

## Sprint 2

Sprint Goal: Install or update writes the pack and the receipt. Ethan starts only when `pack_complete` is true.

Depends on Sprint 1 only for the seed files already in this repo. It does not wait on a new-project skill.


| Code       | Parent PBI                                                                   | Module    | Type    | SBI                                              | Acceptance criteria                                                                                                                                                                     | Related docs                                                                                                                            | Note                                                                                    | Status |
| ---------- | ---------------------------------------------------------------------------- | --------- | ------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ------ |
| feature-01 | [MCP-01 Installer: full pack + receipt](./product-backlog.md#pb-16)          | MCP       | Feature | Installer copies the pack and writes the receipt | - After install or update, every **pack allow-list** folder from the artifact repo is under `{client_root}`, and `framework.sdd.works.json` has `pack_complete: true` and a `files` list. | `[mcp/mcp-stories.md](./mcp/mcp-stories.md)` · `[mcp/mcp-design.md](./mcp/mcp-design.md)` · `[mcp/mcp-test.md](./mcp/mcp-test.md)` §7.6 | - [D2](#rid-d2) [D3](#rid-d3) [R1](#rid-r1) | ToDo   |
| feature-02 | [Agent-15 Pack file: agents/ethan.md](./product-backlog.md#pb-63)            | Agent     | Feature | Ship ethan.md in the pack                        | - `agents/ethan.md` is in the artifact repo and installs to `{client_root}/agents/ethan.md`. | `[agent-ethan/agent-design.md](./agent-ethan/agent-design.md)`                                                                          | — | ToDo   |
| feature-03 | [Agent-07 agent ethan — pack receipt start gate](./product-backlog.md#pb-17) | Agent     | Feature | Ethan start reads only the receipt               | - A start without a true receipt sends the instructions URL and stops with no job list.<br>- A start with `pack_complete: true` continues. | `[agent-ethan/agent-design.md](./agent-ethan/agent-design.md)` §2.4                                                                     | - The full instructions page is Sprint 13.<br>- The URL from project-constants is enough here. | ToDo   |
| feature-04 | [Spec-seeds-01 Seed: project-constants.md](./product-backlog.md#pb-32)       | Framework | Feature | Seed project-constants                           | - The user has reviewed and confirmed this seed.<br>- It is stored in the seed tree.<br>- Associated specs are updated.<br>- The whole seed tree has been cross-reviewed and is consistent. | `[framework.seeds/](./framework.seeds/)`                                                                                                | - Not copied into `specs/framework.seeds/` yet. | ToDo   |


---

## Sprint 3

Sprint Goal: Ethan can start a new project.

Depends on Sprint 2 (receipt must pass before the job runs).


| Code       | Parent PBI                                                                                                                       | Module    | Type    | SBI                            | Acceptance criteria                                                                                                                                                | Related docs                                                                                                                                      | Note                                                                                                                                                                                                                             | Status |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------- | --------- | ------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| feature-01 | [Skill-03 Skill: sdd-new-project](./product-backlog.md#pb-23)                                                                    | Skill     | Feature | Skill sdd-new-project          | - `sdd-new-project/SKILL.md` is in the artifact repo and installs under `{client_root}/skills/`. | [Agent-08 Job: Start a new project](./product-backlog.md#pb-42)                                                                                   | — | ToDo   |
| feature-02 | [Agent-08 Job: Start a new project](./product-backlog.md#pb-42)                                                                  | Agent     | Feature | Ethan runs start-a-new-project | - From a confirmed request, ethan opens `sdd-new-project` (practices job 2) and leaves `artifacts-map.md` and `status.md` under the artifacts root. | `[framework.seeds/templates/EN/sdd-scrum-practices.md](./framework.seeds/templates/EN/sdd-scrum-practices.md)`                                                              | — | ToDo   |
| feature-03 | [Spec-seeds-04 Seed: artifacts-map.md](./product-backlog.md#pb-35) · [Spec-seeds-07 Seed: status.md](./product-backlog.md#pb-38) | Framework | Feature | Seeds the job copies           | - The user has reviewed and confirmed this seed.<br>- It is stored in the seed tree.<br>- Associated specs are updated.<br>- The whole seed tree has been cross-reviewed and is consistent. | [Spec-seeds-01 Seed: project-constants.md](./product-backlog.md#pb-32) · [Spec-seeds-03 Seed: sdd-scrum-practices.md](./product-backlog.md#pb-34) | - Product backlog is Sprint 5.<br>- Sprint backlog is Sprint 6.<br>- Change log is Sprint 5.<br>- Architecture, deployment, and `.secrets` are Sprint 14.<br>- HanS and HanT bodies are Sprint 15.<br>- The job copies a locale seed when that seed exists. | ToDo   |


---

## Sprint 4

Sprint Goal: Ethan can update project settings without overwriting filled working copies unless the user confirms.

Depends on Sprint 3 (a project exists).


| Code       | Parent PBI                                                          | Module | Type    | SBI                                | Acceptance criteria                                                                                             | Related docs | Note | Status |
| ---------- | ------------------------------------------------------------------- | ------ | ------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------ | ---- | ------ |
| feature-01 | [Skill-04 Skill: sdd-update-project](./product-backlog.md#pb-24)    | Skill  | Feature | Skill sdd-update-project           | - The skill folder installs under `{client_root}/skills/`. | —            | — | ToDo   |
| feature-02 | [Agent-09 Job: Update project settings](./product-backlog.md#pb-43) | Agent  | Feature | Ethan runs update-project-settings | - Locale or artifacts-map changes land only after confirm when a working copy is already filled.<br>- Practices job 3. | —            | — | ToDo   |


---

## Sprint 5

Sprint Goal: Ethan can refine the product backlog.

Depends on Sprint 3. Does not depend on Sprint 4.


| Code       | Parent PBI                                                                                                                             | Module    | Type    | SBI                                         | Acceptance criteria                                                                                      | Related docs | Note                         | Status |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------- | --------- | ------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------ | ---------------------------- | ------ |
| feature-01 | [Skill-05 Skill: sdd-refine-pb](./product-backlog.md#pb-25) · [Spec-seeds-03 Seed: sdd-scrum-practices.md](./product-backlog.md#pb-34) | Skill     | Feature | Fill practices job 4 and ship sdd-refine-pb | - Practices job 4 is no longer *(to fill)*.<br>- The skill installs. | —            | — | ToDo   |
| feature-02 | [Agent-10 Job: Refine product backlog](./product-backlog.md#pb-44)                                                                     | Agent     | Feature | Ethan refines the backlog                   | - A confirmed request leaves a verifiable change in `product-backlog.md`. | —            | — | ToDo   |
| feature-03 | [Agent-04 agent ethan — governance artifacts](./product-backlog.md#pb-9)                                                               | Agent     | Feature | One governance edit                         | - Ethan applies one small backlog refinement and one change-log entry inside the guide rules. | —            | — | ToDo   |
| feature-04 | [Spec-seeds-05 Seed: product-backlog.md](./product-backlog.md#pb-36)                                                                   | Framework | Feature | Product-backlog seed                        | - The user has reviewed and confirmed this seed.<br>- It is stored in the seed tree.<br>- Associated specs are updated.<br>- The whole seed tree has been cross-reviewed and is consistent. | —            | - HanS and HanT are Sprint 15. | ToDo   |
| feature-05 | [Spec-seeds-08 Seed: change-log.md](./product-backlog.md#pb-39)                                                                        | Framework | Feature | Change-log seed                             | - The user has reviewed and confirmed this seed.<br>- It is stored in the seed tree.<br>- Associated specs are updated.<br>- The whole seed tree has been cross-reviewed and is consistent. | —            | - HanS and HanT are Sprint 15. | ToDo   |


---

## Sprint 6

Sprint Goal: Ethan can plan a sprint.

Depends on Sprint 5 (a backlog exists to plan from).


| Code       | Parent PBI                                                            | Module    | Type    | SBI                                           | Acceptance criteria                                                                      | Related docs | Note                         | Status |
| ---------- | --------------------------------------------------------------------- | --------- | ------- | --------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------ | ---------------------------- | ------ |
| feature-01 | [Skill-06 Skill: sdd-plan-sprint](./product-backlog.md#pb-26)         | Skill     | Feature | Fill practices job 5 and ship sdd-plan-sprint | - Practices job 5 is written.<br>- The skill installs. | —            | — | ToDo   |
| feature-02 | [Agent-11 Job: Sprint planning](./product-backlog.md#pb-45)           | Agent     | Feature | Ethan plans a sprint                          | - A confirmed request leaves a Sprint Backlog for the planned sprint. | —            | — | ToDo   |
| feature-03 | [Agent-03 agent ethan — facilitate events](./product-backlog.md#pb-8) | Agent     | Feature | One facilitated event                         | - The planning run is the one named event, with a verifiable change in the sprint backlog. | —            | — | ToDo   |
| feature-04 | [Spec-seeds-06 Seed: sprint-backlog.md](./product-backlog.md#pb-37)   | Framework | Feature | Sprint-backlog seed                           | - The user has reviewed and confirmed this seed.<br>- It is stored in the seed tree.<br>- Associated specs are updated.<br>- The whole seed tree has been cross-reviewed and is consistent. | —            | - HanS and HanT are Sprint 15. | ToDo   |


---

## Sprint 7

Sprint Goal: Ethan can report status.

Depends on Sprint 3 (`status.md` exists). Does not depend on Sprint 4–6.


| Code       | Parent PBI                                                      | Module | Type    | SBI                                             | Acceptance criteria                                            | Related docs | Note | Status |
| ---------- | --------------------------------------------------------------- | ------ | ------- | ----------------------------------------------- | -------------------------------------------------------------- | ------------ | ---- | ------ |
| feature-01 | [Skill-07 Skill: sdd-update-status](./product-backlog.md#pb-27) | Skill  | Feature | Fill practices job 6 and ship sdd-update-status | - Practices job 6 is written.<br>- The skill installs. | —            | — | ToDo   |
| feature-02 | [Agent-12 Job: Report status](./product-backlog.md#pb-46)       | Agent  | Feature | Ethan updates status                            | - A confirmed request leaves a verifiable update in `status.md`. | —            | — | ToDo   |


---

## Sprint 8

Sprint Goal: Ethan can run a retrospective.

Depends on Sprint 6 (a sprint exists to review).


| Code       | Parent PBI                                                      | Module | Type    | SBI                                             | Acceptance criteria                                                      | Related docs | Note | Status |
| ---------- | --------------------------------------------------------------- | ------ | ------- | ----------------------------------------------- | ------------------------------------------------------------------------ | ------------ | ---- | ------ |
| feature-01 | [Skill-08 Skill: sdd-retrospective](./product-backlog.md#pb-28) | Skill  | Feature | Fill practices job 7 and ship sdd-retrospective | - Practices job 7 is written.<br>- The skill installs. | —            | — | ToDo   |
| feature-02 | [Agent-13 Job: Retrospective](./product-backlog.md#pb-47)       | Agent  | Feature | Ethan records a retrospective                   | - A confirmed request leaves the retrospective record practices describes. | —            | — | ToDo   |


---

## Sprint 9

Sprint Goal: Ethan can start the next sprint.

Depends on Sprint 8.


| Code       | Parent PBI                                                       | Module | Type    | SBI                                            | Acceptance criteria                                                                | Related docs | Note | Status |
| ---------- | ---------------------------------------------------------------- | ------ | ------- | ---------------------------------------------- | ---------------------------------------------------------------------------------- | ------------ | ---- | ------ |
| feature-01 | [Skill-09 Skill: sdd-close-sprint](./product-backlog.md#pb-29)   | Skill  | Feature | Fill practices job 8 and ship sdd-close-sprint | - Practices job 8 (Start a new sprint) is written.<br>- The skill installs. | —            | — | ToDo   |
| feature-02 | [Agent-14 Job: Close / start sprint](./product-backlog.md#pb-48) | Agent  | Feature | Ethan opens the next sprint                    | - A confirmed request leaves the next sprint in `sprint-backlog.md` and `status.md`. | —            | — | ToDo   |


---

## Sprint 10

Sprint Goal: Ethan answers from the guide and the live project files without editing them.

Depends on Sprint 2 (start load) and Sprint 3 (a project to read).


| Code       | Parent PBI                                                               | Module | Type    | SBI                                     | Acceptance criteria                                                                        | Related docs | Note | Status |
| ---------- | ------------------------------------------------------------------------ | ------ | ------- | --------------------------------------- | ------------------------------------------------------------------------------------------ | ------------ | ---- | ------ |
| feature-01 | [Agent-02 agent ethan — initial capabilities](./product-backlog.md#pb-7) | Agent  | Feature | What now / what next                    | - A chat turn answers from the guide plus backlog and sprint backlog, without writing files. | —            | — | ToDo   |
| feature-02 | [Agent-05 agent ethan — knowledgeable coach](./product-backlog.md#pb-10) | Agent  | Feature | Coaching answer cites the guide         | - A coaching question is answered with a citation and no invented process rule. | —            | — | ToDo   |
| feature-03 | [Agent-06 agent ethan — chat](./product-backlog.md#pb-11)                | Agent  | Feature | Free-form chat stays inside the harness | - A turn that is not an event verb still gets a useful reply and does not edit files. | —            | — | ToDo   |


---

## Sprint 11

Sprint Goal: The three harness rules install and are named in project-constants.

Depends on Sprint 2 (the pack copy). Does not depend on the scrum jobs.


| Code       | Parent PBI                                                               | Module | Type    | SBI                               | Acceptance criteria                                                                 | Related docs | Note | Status |
| ---------- | ------------------------------------------------------------------------ | ------ | ------- | --------------------------------- | ----------------------------------------------------------------------------------- | ------------ | ---- | ------ |
| feature-01 | [Rule-01 Rule: sdd-dod.mdc](./product-backlog.md#pb-18)                  | Rule   | Feature | Rule sdd-dod.mdc                  | - The file installs under `{client_root}/rules/` and the key is in project-constants. | —            | — | ToDo   |
| feature-02 | [Rule-02 Rule: sdd-incremental-delivery.mdc](./product-backlog.md#pb-19) | Rule   | Feature | Rule sdd-incremental-delivery.mdc | - Same install bar. | —            | — | ToDo   |
| feature-03 | [Rule-03 Rule: sdd-realtime-status.mdc](./product-backlog.md#pb-20)      | Rule   | Feature | Rule sdd-realtime-status.mdc      | - Same install bar. | —            | — | ToDo   |


---

## Sprint 12

Sprint Goal: A feature can be implemented by updating specs, then TDD.

Depends on Sprint 3 (a project) and Sprint 11 (the rules the work follows).


| Code       | Parent PBI                                                                                                     | Module | Type    | SBI                         | Acceptance criteria                                                                                            | Related docs | Note | Status |
| ---------- | -------------------------------------------------------------------------------------------------------------- | ------ | ------- | --------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------ | ---- | ------ |
| feature-01 | [Skill-01 Skill: sdd-atdd](./product-backlog.md#pb-21) · [Skill-02 Skill: sdd-tdd](./product-backlog.md#pb-22) | Skill  | Feature | Skills sdd-atdd and sdd-tdd | - Both folders install under `{client_root}/skills/`. | —            | — | ToDo   |
| feature-02 | [Skill-12 Skill: sdd-update-specs](./product-backlog.md#pb-64)                                                 | Skill  | Feature | Skill sdd-update-specs      | - The skill names which spec files to update and does not leave them describing the previous behavior. | —            | — | ToDo   |
| feature-03 | [Skill-13 Skill: sdd-implement-feature](./product-backlog.md#pb-65)                                            | Skill  | Feature | Skill sdd-implement-feature | - The skill runs spec update, then the TDD cycle, and finishes with specs and code describing the same behavior. | —            | — | ToDo   |
| feature-04 | [Skill-10 Skill: sdd-audit-artifacts](./product-backlog.md#pb-30)                                              | Skill  | Feature | Skill sdd-audit-artifacts   | - The skill installs and can report a mismatch between the map and the files. | —            | — | ToDo   |


---

## Sprint 13

Sprint Goal: The public instructions page covers call-up, install, the receipt, and the fatal stop.

Depends on Sprint 2 for the behavior the page describes. The page is not required for Sprint 2 to send the URL.


| Code       | Parent PBI                                                                             | Module     | Type    | SBI                                | Acceptance criteria                                                                             | Related docs | Note | Status |
| ---------- | -------------------------------------------------------------------------------------- | ---------- | ------- | ---------------------------------- | ----------------------------------------------------------------------------------------------- | ------------ | ---- | ------ |
| feature-01 | [Web-portal-01 Instructions: per-client agent call-up](./product-backlog.md#pb-15)     | Web-portal | Feature | Per-client call-up, after research | - The section cites each client's docs.<br>- Cursor `/ethan` and TRAE CN `@` are the known cases. | —            | — | ToDo   |
| feature-02 | [Web-portal-02 Instructions: install, receipt, fatal stop](./product-backlog.md#pb-49) | Web-portal | Feature | Install, receipt, and fatal stop   | - A reader can install or update, find the receipt, and see that Ethan stops without a true flag. | —            | — | ToDo   |
| feature-03 | [Web-portal-03 Website shows instructions](./product-backlog.md#pb-50)                 | Web-portal | Feature | The live site shows that page      | - The instructions URL on framework.sdd.works shows this content.<br>- No new portal features. | —            | — | ToDo   |


---

## Sprint 14

Sprint Goal: A new project can copy the optional engineering starters: architecture, deployment, and the secrets file.

Depends on Sprint 2 (the pack copy). Does not depend on the scrum jobs.


| Code       | Parent PBI                                                        | Module    | Type    | SBI               | Acceptance criteria                                                                     | Related docs                                                                 | Note                                                               | Status |
| ---------- | ----------------------------------------------------------------- | --------- | ------- | ----------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------ |
| feature-01 | [Spec-seeds-09 Seed: architecture.md](./product-backlog.md#pb-40) | Framework | Feature | Architecture seed | - The user has reviewed and confirmed this seed.<br>- It is stored in the seed tree.<br>- Associated specs are updated.<br>- The whole seed tree has been cross-reviewed and is consistent. | —                                                                            | - HanS and HanT are Sprint 15. | ToDo   |
| feature-02 | [Spec-seeds-10 Seed: deployment.md](./product-backlog.md#pb-41)   | Framework | Feature | Deployment seed   | - The user has reviewed and confirmed this seed.<br>- It is stored in the seed tree.<br>- Associated specs are updated.<br>- The whole seed tree has been cross-reviewed and is consistent. | —                                                                            | - HanS and HanT are Sprint 15. | ToDo   |
| feature-03 | [Spec-seeds-11 Seed: .secrets](./product-backlog.md#pb-66)        | Framework | Feature | Secrets seed      | - The user has reviewed and confirmed this seed.<br>- It is stored in the seed tree.<br>- Associated specs are updated.<br>- The whole seed tree has been cross-reviewed and is consistent. | `[framework.seeds/templates/EN/sdd-scrum-guide.md](./framework.seeds/templates/EN/sdd-scrum-guide.md)` | - The guide spells the file `.secrets`.<br>- HanS and HanT are Sprint 15. | ToDo   |


---

## Sprint 15

Sprint Goal: Add i18n support. Locale template bodies are HanS and HanT translations of the EN seeds.

Depends on the EN seeds from earlier sprints. It does not replace those Spec-seeds items. File existence stays on those items. This sprint owns the translated bodies.


| Code       | Parent PBI                                                         | Module | Type    | SBI                                              | Acceptance criteria                                                                                                                                                                                              | Related docs                                                                           | Note                                                                                                             | Status |
| ---------- | ------------------------------------------------------------------ | ------ | ------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------ |
| feature-01 | [i18n-01 Framework definition locales](./product-backlog.md#pb-67) | i18n   | Feature | Add the HanS guide to the seed tree              | - `specs/framework.seeds/templates/HanS/sdd-scrum-guide.md` matches `~/.cursor/templates/framework.sdd.works/HanS/sdd-scrum-guide.md`, including the `sdd-` skill names. | `[framework.seeds/templates/HanS/sdd-scrum-guide.md](./framework.seeds/templates/HanS/sdd-scrum-guide.md)` | - Moved from Sprint 1.<br>- EN guide stays Sprint 1 feature-01. | Done   |
| feature-02 | [i18n-01 Framework definition locales](./product-backlog.md#pb-67) | i18n   | Feature | Add the HanT guide to the seed tree              | - `specs/framework.seeds/` holds a HanT guide that matches the HanT template, including the `sdd-` skill names. | `[framework.seeds/templates/EN/sdd-scrum-guide.md](./framework.seeds/templates/EN/sdd-scrum-guide.md)`           | - Moved from Sprint 1. | ToDo   |
| feature-03 | [i18n-01 Framework definition locales](./product-backlog.md#pb-67) | i18n   | Feature | Add the HanS and HanT practices to the seed tree | - HanS and HanT practices copies are in the seed tree and match the EN practices on jobs 1 and 2. | `[framework.seeds/templates/EN/sdd-scrum-practices.md](./framework.seeds/templates/EN/sdd-scrum-practices.md)`   | - Moved from Sprint 1.<br>- EN practices stay Sprint 1 feature-01.<br>- Jobs 4–8 stay on Sprints 5–9. | ToDo   |
| feature-04 | [i18n-02 Process artifact locales](./product-backlog.md#pb-68)     | i18n   | Feature | Translate the five process artifacts             | - HanS and HanT starters for `product-backlog.md`, `sprint-backlog.md`, `status.md`, `change-log.md`, and `artifacts-map.md` match the EN starters. | [i18n-02](./product-backlog.md#pb-68)                                                  | - EN starters stay on Sprints 3, 5, and 6.<br>- Not this repo's filled `specs/` files. | ToDo   |
| feature-05 | [i18n-03 Engineering artifact locales](./product-backlog.md#pb-69) | i18n   | Feature | Translate the engineering artifacts              | - HanS and HanT starters exist for `architecture.md`, `{model}-stories`, `{model}-design.md`, `{model}-test.md`, `deployment.md`, and `.secrets`, and they match the EN starters.<br>- `.secrets` has no secret values. | [i18n-03](./product-backlog.md#pb-69)                                                  | - EN architecture, deployment, and `.secrets` stay on Sprint 14.<br>- Stories, design, and test have no Spec-seeds row. | ToDo   |


