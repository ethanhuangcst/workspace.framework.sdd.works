# Product overview — framework.sdd.works

> **Purpose**: Record what framework.sdd.works must do in Phase 2, where the boundary is, and how to accept it.
> **Status**: v1.3 · as_of 2026-09-23
> **Related**: [`architecture.md`](./architecture.md) · [`deployment.md`](./deployment.md) · [`sprint-backlog.md`](./sprint-backlog.md) · [`artifacts-map.md`](./artifacts-map.md)
> **Practices**: [`sdd-scrum-practices.md`](./sdd-scrum-practices.md) is what, how, and when (jobs, templates, table conventions).
> **Framework**: [`sdd-scrum-guide.md`](./sdd-scrum-guide.md) is names and meaning.
> **Schedule**: The `Sprint` field on each backlog item is a projection of [`sprint-backlog.md`](./sprint-backlog.md). Schedule changes belong in that file.
> **Phase 1 archive**: [`phase1-specs/`](./phase1-specs/) (closed). Do not reopen those items here.

framework.sdd.works is an MCP service plus an admin portal that installs and updates an SDD framework in the calling AI client. Phase 1 is closed. Phase 2 defines the sdd-scrum specs, the ethan agent, and the SDD harness (rules and skills).

---------
## Scope boundary

### What Phase 2 does

- Define [`sdd-scrum-guide.md`](./sdd-scrum-guide.md): the methodological definition of sdd-scrum, including terminologies, events, artifacts and so on.
- Define [`sdd-scrum-practices.md`](./sdd-scrum-practices.md): the operational hand-book on how to implement sdd-scrum with detailed guideline in each events.
- Define artifacts template, path mapping file (artifacts-map.md) and it's governance guide to ensure the content is aligned with sdd-scrum.
- Build sdd harness assets including rules, skills, workflows(when needed), and knowledge management mechanism.
- Build agent `ethan` to facilitate sdd-scrum events for human and agents. It's presence is a **local Cursor agent** ([D1](./sprint-backlog.md#rid-d1) Closed). Design: [`agent-ethan/agent-design.md`](./agent-ethan/agent-design.md).
- Expand framework.sdd.works service functionalities, such as expand assets from rules/skills/agents/workflows to all folders under repo, more documentation etc

Acceptance → [pb-1](#pb-1) · [pb-2](#pb-2) · [pb-3](#pb-3) · [pb-4](#pb-4) · [pb-5](#pb-5) · [pb-6](#pb-6)–[pb-11](#pb-11) · [pb-12](#pb-12) · [pb-13](#pb-13)

### Explicitly out of scope

- **Rewriting Phase 1 portal or MCP behavior.**
- **Hosting coach-ethan on remote MCP** (installer MCP stays separate; see agent design).

---------
# Requirements

> Executable detail is in the Product Backlog items below. Back-references prefer the item name.

---------
## [Specs] Process files and guide

### 1. Archive Phase 1 Scrum files. → [pb-1](#pb-1)

### 2. Develop specs

#### sdd-scrum framework definition → [pb-2](#pb-2)

- sdd-scrum-guide.md
- sdd-scrum-practices.md

#### process-artifacts → [pb-3](#pb-3)

- artifacts-map.md
- product-backlog.md
- sprint-backlog.md

#### engineering-specs → [pb-4](#pb-4)

- architecture.md
- deployment.md
- {component name}-stories.md
- {component name}-design.md
- {component name}-test.md

#### real-time tracking artifacts → [pb-5](#pb-5)

- change-log.md
- status.md

---------
## [agent] agent: ethan

- agent: ethan - POC → [pb-6](#pb-6)
- agent: ethan - initial capabilities → [pb-7](#pb-7)
- agent: ethan - facilitate events → [pb-8](#pb-8)
- agent: ethan - governance artifacts → [pb-9](#pb-9)
- agent: ethan - knowledgable coach → [pb-10](#pb-10)
- agent: ethan - chat → [pb-11](#pb-11)

---------
## [Framework] SDD harness

### Rules → [pb-12](#pb-12)

- **dod.mdc**: Definition of Done
- **incremental-delivery.mdc**: Incremental Delivery
- **realtime-status.mdc**: track status in real time and update **status.md** when each task is done

### Skills → [pb-13](#pb-13)

- **atdd**
- **tdd**
- **start-new-project**
- **update-project**
- **refine-pb**
- **plan-sprint**
- **update-status**
- **retrospective**
- **close-sprint**
- **audit-artifacts**
- **update-artifacts**

---------
## [User_Journey] framework.sdd.works R2 functionalities


### Initialize framework.sdd.works v2 POC → pb-14

- User creates an empty folder and open from IDE (user Cursor as example moving forward).
- Install framework.sdd.works MCP (done in R1), run sdd_install_framework or sdd_update_framework, get framework installed at user_root/.cursor/..
- User type '/ethan' can call up agent

---------
# Product Backlog

| # | Category | Parent | PBI | Description | Acceptance criteria | Related | Sprint | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | [Specs] | — | Phase 2 specs restructure (SPEC-01) | Archive Phase 1 under `phase1-specs/`. Live process files use this shape. | Phase 1 Scrum files are only under `phase1-specs/`. Live process files exist at `specs/` for this product. No application code change for this item. | [`artifacts-map.md`](./artifacts-map.md) | Sprint 1 | Done |
| 2 | [Specs] | Develop specs | sdd-scrum framework definition | [`sdd-scrum-guide.md`](./sdd-scrum-guide.md) is names and meaning. [`sdd-scrum-practices.md`](./sdd-scrum-practices.md) is what, how, and when. Practices does not redefine terms. | Both files exist under `specs/` and state the guide vs practices split for terminologies, events, and artifacts. | [`sdd-scrum-guide.md`](./sdd-scrum-guide.md) · [`sdd-scrum-practices.md`](./sdd-scrum-practices.md) · [Sprint 1 “sdd-scrum-guide.md draft”](./sprint-backlog.md) | Sprint 1 | ToDo |
| 3 | [Specs] | Develop specs | Process artifacts | Live process files: `artifacts-map.md`, `product-backlog.md`, `sprint-backlog.md`. | Those three files exist under `specs/` and are listed in [`artifacts-map.md`](./artifacts-map.md). | [`artifacts-map.md`](./artifacts-map.md) | — | ToDo |
| 4 | [Specs] | Develop specs | Engineering specs | Optional / JIT engineering docs: `architecture.md`, `deployment.md`, and `{component}-stories.md` / `{component}-design.md` / `{component}-test.md` when a component exists. | `architecture.md` and `deployment.md` exist. Component story/design/test files appear when a component is in scope and are indexed in [`artifacts-map.md`](./artifacts-map.md). | [`architecture.md`](./architecture.md) · [`deployment.md`](./deployment.md) · [`artifacts-map.md`](./artifacts-map.md) | — | ToDo |
| 5 | [Specs] | Develop specs | Real-time tracking artifacts | Tracking projection files: `change-log.md` and `status.md` (current sprint, SBI, next, OGT). | Both files exist under `specs/` and are listed under Tracking in [`artifacts-map.md`](./artifacts-map.md). | [`change-log.md`](./change-log.md) · [`status.md`](./status.md) | — | ToDo |
| 6 | [agent] | agent ethan | agent ethan — POC | Proof of concept for ethan as a local Cursor agent ([D1](./sprint-backlog.md#rid-d1) Closed). | A local Cursor agent prompt for ethan exists and can be invoked. Presence matches [D1](./sprint-backlog.md#rid-d1). Design: [`agent-ethan/agent-design.md`](./agent-ethan/agent-design.md). | [`agent-ethan/agent-design.md`](./agent-ethan/agent-design.md) · [D1](./sprint-backlog.md#rid-d1) | — | ToDo |
| 7 | [agent] | agent ethan | agent ethan — initial capabilities | Ethan answers what to do now and next from live process files without editing the repo. | From a chat turn, ethan answers “what now / what next” using the guide plus live backlog and sprint backlog, without writing files or calling skills. | [`agent-ethan/agent-design.md`](./agent-ethan/agent-design.md) · [pb-6](#pb-6) | — | ToDo |
| 8 | [agent] | agent ethan | agent ethan — facilitate events | Ethan runs sdd-scrum events by calling the matching skills. | Ethan can run at least one named event (for example `plan-sprint`) via its skill and leave a verifiable change in the process artifacts that event owns. | [pb-13](#pb-13) · [`agent-ethan/agent-design.md`](./agent-ethan/agent-design.md) | — | ToDo |
| 9 | [agent] | agent ethan | agent ethan — governance artifacts | Ethan maintains process and tracking artifacts within the rules the guide names. | From a chat turn, ethan applies one small backlog refinement and one change-log entry without violating guide maintenance rules. | [`change-log.md`](./change-log.md) · [pb-2](#pb-2) · [`agent-ethan/agent-design.md`](./agent-ethan/agent-design.md) | — | ToDo |
| 10 | [agent] | agent ethan | agent ethan — knowledgeable coach | Ethan coaches from the guide, practices, and knowledge trees (`adr/`, `knowledge/`). | Ethan answers a coaching question by citing the guide or practices (and knowledge when present) without inventing process rules. | [`sdd-scrum-guide.md`](./sdd-scrum-guide.md) · [`sdd-scrum-practices.md`](./sdd-scrum-practices.md) · [`artifacts-map.md`](./artifacts-map.md) | — | ToDo |
| 11 | [agent] | agent ethan | agent ethan — chat | Ethan replies from free-form chat input while staying inside harness and process boundaries. | A chat turn that is not an event verb still gets a useful reply grounded in live artifacts, without unauthorized file edits. | [`agent-ethan/agent-design.md`](./agent-ethan/agent-design.md) · [pb-7](#pb-7) | — | ToDo |
| 12 | [Framework] | SDD harness | Harness rules | Always-on rules: `dod.mdc`, `incremental-delivery.mdc`, `realtime-status.mdc` (update `status.md` when each task is done). | Those three rule files are present in the framework install set and named in the harness Requirements list. | [`artifacts-map.md`](./artifacts-map.md) | — | ToDo |
| 13 | [Framework] | SDD harness | Harness skills | Skills: `atdd`, `tdd`, `start-new-project`, `update-project`, `refine-pb`, `plan-sprint`, `update-status`, `retrospective`, `close-sprint`, `audit-artifacts`, `update-artifacts`. | Each named skill exists as an installable skill in the framework package. | [`artifacts-map.md`](./artifacts-map.md) · [pb-8](#pb-8) | — | ToDo |
| 14 | [User_Journey] | framework.sdd.works R2 functionalities | Initialize framework.sdd.works v2 POC | Empty folder opened in Cursor. Release 1 MCP is already installed. `sdd_install_framework` or `sdd_update_framework` installs the framework under `user_root/.cursor/`. `/ethan` calls up the agent. | User can open an empty folder in Cursor, run install or update, and invoke `/ethan`. | [Sprint 1 “Initialize framework.sdd.works v2 POC”](./sprint-backlog.md) | Sprint 1 | ToDo |

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
