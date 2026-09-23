# sprint-backlog — [framework.sdd.works](http://framework.sdd.works)

> **Purpose**: Short-cycle execution list — what to do, what is blocked, and how to accept it.
> **Single source of truth for schedule and status**: this file. The `Sprint` column in `product-backlog.md` is a projection of this file.
> **Related**: `[architecture.md](./architecture.md)` · `[deployment.md](./deployment.md)` · `[artifacts-map.md](./artifacts-map.md)` · `[sdd-scrum-guide.md](./sdd-scrum-guide.md)` · `[status.md](./status.md)`
> **Numbering**: `#N` is the item number inside that sprint. When citing another document, prefer the item name.
> **Practices**: `[sdd-scrum-practices.md](./sdd-scrum-practices.md)` (what, how, when: jobs, templates, table conventions).
> **Framework**: `[sdd-scrum-guide.md](./sdd-scrum-guide.md)` (names and meaning).
> **as_of**: 2026-09-23

Current sprint: Sprint 1. Two SBIs: `sdd-scrum-guide.md` draft (Done) and Initialize framework.sdd.works v2 POC.

---



## RID Registry (Risks / Impediments / Dependencies)

> This section records risks, impediments, and dependencies only. It does not belong to any sprint.


| #      | Severity     | Type       | Title                                             | Description                                                                                                                                                                                                                     | Impact                                             | Solution (→ product-backlog)                     | Related docs                                                                                   | Handling note                                                                   | Status | Updated    |
| ------ | ------------ | ---------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------ | ---------- |
| **D1** | **Blocking** | Dependency | coach-ethan product presence (local Cursor agent) | Ship coach-ethan as a local Cursor agent (installable prompt in the client `agents/` tree). Remote MCP stays the installer. Local stdio MCP coach is out of scope unless a second client must edit files without Cursor skills. | Resolved: one presence model for product and MVPs. | [agent ethan — POC](./product-backlog.md) (pb-6) | `[agent-design.md](./agent-ethan/agent-design.md)` · `[architecture.md](./architecture.md)` §2 | Decision recorded in agent-design.md. No separate ADR required for this choice. | Closed | 2026-09-22 |


> **Severity**: **Blocking** = blocked product ship until closed. D1 is Closed (local Cursor agent).
> **Type**: dependency = work or decision required before the related product item ships.



### RID coverage


| RID | Solution (Backlog item)                          | Acceptance criteria and design/test location                                                               | Sprint location                                 |
| --- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| D1  | [agent ethan — POC](./product-backlog.md) (pb-6) | `[agent-ethan/agent-design.md](./agent-ethan/agent-design.md)` · `[architecture.md](./architecture.md)` §2 | Closed: local Cursor agent for MVPs and product |


---



## Sprint 1

Sprint Goal: A draft of `sdd-scrum-guide.md` is in place, and a user can initialize framework.sdd.works v2 in an empty Cursor folder and call `/ethan`.

**Status: in progress** (guide draft Done; v2 POC not started)

### ToDo


| #   | SBI                                   | Parent PBI                                                          | Category | Module    | Acceptance criteria                                                                                                                                                                                                                                                                            | Related docs                                                                                   | Note                  | Status |
| --- | ------------------------------------- | ------------------------------------------------------------------- | -------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | --------------------- | ------ |
| 1   | sdd-scrum-guide.md draft              | [pb-2](./product-backlog.md) sdd-scrum framework definition         | Task     | Specs     | `[sdd-scrum-guide.md](./sdd-scrum-guide.md)` exists as a draft of the sdd-scrum methodological definition.                                                                                                                                                                                     | [pb-2](./product-backlog.md) · `[sdd-scrum-guide.md](./sdd-scrum-guide.md)`                    | Draft is in the repo. | Done   |
| 2   | Initialize framework.sdd.works v2 POC | [pb-14](./product-backlog.md) Initialize framework.sdd.works v2 POC | Task     | Framework | User creates an empty folder and opens it from the IDE (Cursor). framework.sdd.works MCP is already installed (Release 1). User runs `sdd_install_framework` or `sdd_update_framework` and the framework is installed at `user_root/.cursor/`. User types `/ethan` and the agent is called up. | [pb-14](./product-backlog.md) · `[agent-ethan/agent-design.md](./agent-ethan/agent-design.md)` | —                     | ToDo   |




### Retrospective

**What went well**

- The `sdd-scrum-guide.md` draft is in the repo.

**What to improve**

- Finish the v2 POC before opening another sprint.

**What we learned**

- `/ethan` uses Cursor `agents/` trees. Knowledge: `[knowledge/agent/cursor-agent-callup.md](./knowledge/agent/cursor-agent-callup.md)`. Design: `[agent-ethan/agent-design.md](./agent-ethan/agent-design.md)` §2.
- A second copy of the framework pack in the workspace does not override user-root skills or commands. Decision: [ADR-056](./adr/ADR-056-single-user-root-framework-pack.md). Evidence: `[knowledge/agent/ide-asset-precedence.md](./knowledge/agent/ide-asset-precedence.md)`.

