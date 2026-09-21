# Product overview — framework.sdd.works

> **Purpose**: Record what framework.sdd.works must do in Phase 2, where the boundary is, and how to accept it.
> **Status**: v1.1 · as_of 2026-09-21
> **Related**: [`architecture.md`](./architecture.md) · [`deployment.md`](./deployment.md) · [`sprint-plan.md`](./sprint-plan.md) · [`artifacts-map.md`](./artifacts-map.md)
> **Conventions**: Column definitions and status meanings are in [`sdd-scrum-practices.md`](./sdd-scrum-practices.md).
> **Schedule**: The `Sprint` column in the backlog table is a projection of [`sprint-plan.md`](./sprint-plan.md). Schedule changes belong in that file.
> **Phase 1 archive**: [`phase1-specs/`](./phase1-specs/) (closed). Do not reopen those items here.

framework.sdd.works is an MCP service plus an admin portal that installs and updates an SDD framework in the calling AI client. Phase 1 (portal, keys, MCP install of skills / rules / workflows / agents) is closed. Phase 2 extends install to the whole git package, defines Scrum-with-SDD practices, ships process templates and skills, and adds the coach-ethan agent.

---------
## Scope boundary

### What Phase 2 does

- Install and update every top-level folder in the synced git package, not only skills, rules, workflows, and agents.
- Make [`sdd-scrum-practices.md`](./sdd-scrum-practices.md) the single source for the refined Scrum framework, SDD-mapped events and their skills, and how to maintain each artifact in [`artifacts-map.md`](./artifacts-map.md).
- Ship templates for `product-backlog.md`, `change-log.md`, `sprint-plan.md`, and `artifacts-map.md`.
- Add process skills (and matching rules or workflows where needed): `Initiate_project`, `organize_artifacts`, `backlog_refinement`, `plan`, `track`, `retrospective`.
- Add the `coach-ethan` agent (initial prompt, spike, presence still TBD).
- Update the portal Instructions page for the items above.

Acceptance: those themes stay in scope until each is done or explicitly dropped → [Backlog “Install whole git artifacts”](#pb-2) · [Backlog “Scrum-with-SDD practices”](#pb-5) · [Backlog “Artifact templates”](#pb-4) · [Backlog “Process skills”](#pb-6) · [Backlog “coach-ethan”](#pb-3) · [Backlog “Instructions page”](#pb-7)

### Explicitly out of scope

- **Rewriting Phase 1 portal or MCP behavior** — that work is closed under [`phase1-specs/`](./phase1-specs/) and the live `mcp/` and `admin-portal/` specs.
- **Choosing MCP vs local for coach-ethan in this capture** — presence stays TBD until the spike. See [architecture.md](./architecture.md) §2.
- **Expanding install, writing skills, or editing the Instructions UI before that story is the active one.**

Acceptance: those limits stay until a backlog item says otherwise → [Backlog “Install whole git artifacts”](#pb-2) · [Backlog “coach-ethan”](#pb-3)

---------
# Requirements

> This section states what is needed. Executable detail, acceptance criteria, and status are in the Product Backlog below.
> Every requirement has a matching backlog item. Back-references prefer the item name.

---------
## [Specs] Phase 2 process files

- Archive Phase 1 Scrum files and keep live process files at `specs/` in the new shape. → [Backlog “Phase 2 specs restructure”](#pb-1)
- Define the refined Scrum framework, SDD events and skills, and artifact maintenance in one file. → [Backlog “Scrum-with-SDD practices”](#pb-5)

---------
## [Framework] Install, templates, skills, coach

- **Install**: `sdd_install_framework` and `sdd_update_framework` copy every top-level folder from the synced package. → [Backlog “Install whole git artifacts”](#pb-2)
- **Templates**: the package includes the four process templates. → [Backlog “Artifact templates”](#pb-4)
- **Skills**: six process skills, each mapped to a Scrum event in the practices file. → [Backlog “Process skills”](#pb-6)
- **Coach**: `coach-ethan` has an initial prompt and a presence spike; MCP vs local is not decided here. → [Backlog “coach-ethan”](#pb-3)
- **Instructions**: the portal Instructions page describes the Phase 2 install set, templates, skills, and coach-ethan. → [Backlog “Instructions page”](#pb-7)

---------
# Product Backlog

| # | Category | Parent | Title | Description | Acceptance criteria | Related | Sprint | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| <a id="pb-1"></a>1 | [Specs] | — | Phase 2 specs restructure (SPEC-01) | Archive Phase 1 under `phase1-specs/`. Live process files use this shape. | Phase 1 Scrum files are only under `phase1-specs/`. Live process files exist at `specs/` for this product. No application code change for this item. | [Sprint 1 “Phase 2 specs restructure”](./sprint-plan.md#s1-spec) · [`artifacts-map.md`](./artifacts-map.md) | Sprint 1 | Done |
| <a id="pb-2"></a>2 | [Framework] | — | Install whole git artifacts (ARTIFACTS-01) | Install and update copy every top-level folder in the synced git package, not only skills, rules, agents, and workflows. | The copied set matches the package’s top-level folders. Stdio and HTTP follow ADR-054. MCP design and stories are updated when this story is implemented. | [Sprint 2 “Install whole git artifacts”](./sprint-plan.md#s2-artifacts) | Sprint 2 | ToDo |
| <a id="pb-3"></a>3 | [Framework] | — | coach-ethan (COACH-01) | Agent that coaches SDD-refined Scrum. Includes an initial prompt, a spike, and a presence choice that is still open (MCP or local). | A written initial prompt exists. A spike records what was tried. Presence stays TBD until the spike closes; no ADR before that. The agent is not shipped as both MCP and local in this item. | [Sprint 2 “coach-ethan”](./sprint-plan.md#s2-coach) · [`architecture.md`](./architecture.md) §2 | Sprint 2 | ToDo |
| <a id="pb-4"></a>4 | [Framework] | Scrum-with-SDD practices | Artifact templates (TEMPLATES-01) | Template pack of four files: `product-backlog.md`, `change-log.md`, `sprint-plan.md`, `artifacts-map.md`. | The pack contains those four files and no extra required architecture or deployment template. They install with the framework package. The artifacts map lists them. | [Sprint 2 “Artifact templates”](./sprint-plan.md#s2-templates) | Sprint 2 | ToDo |
| <a id="pb-5"></a>5 | [Specs] | — | Scrum-with-SDD practices (PRACTICES-01) | [`sdd-scrum-practices.md`](./sdd-scrum-practices.md) is the only definition of the refined Scrum framework, of Scrum events in SDD and the skill for each event, and of how to maintain each live artifact in the artifacts map. | The file defines the framework, lists each Scrum event with its skill, and gives maintenance rules for every process artifact in [`artifacts-map.md`](./artifacts-map.md). Other docs link here instead of restating those rules. | [Sprint 2 “Scrum-with-SDD practices”](./sprint-plan.md#s2-practices) · [`artifacts-map.md`](./artifacts-map.md) | Sprint 2 | ToDo |
| <a id="pb-6"></a>6 | [Framework] | Scrum-with-SDD practices | Process skills (SKILLS-01) | Skills, plus rules or workflows where needed: `Initiate_project`, `organize_artifacts`, `backlog_refinement`, `plan`, `track`, `retrospective`. | Each name exists as an installable skill. Each is mapped to one Scrum event in the practices file. | [Sprint 2 “Process skills”](./sprint-plan.md#s2-skills) · [Scrum-with-SDD practices](#pb-5) | Sprint 2 | ToDo |
| <a id="pb-7"></a>7 | [Portal] | coach-ethan | Instructions page (INSTRUCT-01) | Update the portal Instructions page for full-repo install, the four templates, the process skills, and coach-ethan. | The page states the install set, names the four templates and six skills, and names coach-ethan. Copy is i18n keys. Phase 1 instruction stories are not rewritten except for this update. | [Sprint 2 “Instructions page”](./sprint-plan.md#s2-instructions) · [`admin-portal/app-stories.md`](./admin-portal/app-stories.md) | Sprint 2 | ToDo |

---------

## Change record

| Date | Change |
| --- | --- |
| 2026-09-21 | Replaced the sample-product draft with Phase 2 items SPEC-01, ARTIFACTS-01, COACH-01, and TEMPLATES-01. |
| 2026-09-21 | Split Phase 2: practices SSOT, four templates, six process skills, coach-ethan (presence TBD), Instructions page. |
