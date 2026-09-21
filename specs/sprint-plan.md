# sprint-plan — framework.sdd.works

> **Purpose**: Short-cycle execution list — what to do, what is blocked, and how to accept it.
> **Single source of truth for schedule and status**: this file. The `Sprint` column in `product-backlog.md` is a projection of this file.
> **Related**: [`architecture.md`](./architecture.md) · [`deployment.md`](./deployment.md) · [`artifacts-map.md`](./artifacts-map.md)
> **Numbering**: `#N` is the item number inside that sprint. When citing another document, prefer the item name.
> **Conventions**: [`sdd-scrum-practices.md`](./sdd-scrum-practices.md).
> **as_of**: 2026-09-21

---

## RID Registry (Risks / Impediments / Dependencies)

> This section records risks, impediments, and dependencies only. It does not belong to any sprint.

| # | Severity | Type | Title | Description | Impact | Solution (→ product-backlog) | Related docs | Handling note | Status | Updated |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| <a id="rid-d1"></a>**D1** | **Blocking** | Dependency | coach-ethan presence (MCP vs local) | The agent may run as an MCP tool or as a local installable agent. This capture does not choose. | Shipping coach-ethan before the choice splits the product into two presence models. | [coach-ethan](./product-backlog.md#pb-3) | [Sprint 2 “coach-ethan”](#s2-coach) · [`architecture.md`](./architecture.md) §2 | Registered as TBD. Spike and ADR wait until coach-ethan is the active story. | Pending | 2026-09-21 |

> **Severity**: **Blocking** = must be solved before that item ships.
> **Type**: dependency = work required before the solution can ship.

### RID coverage

| RID | Solution (Backlog item) | Acceptance criteria and design/test location | Sprint location |
|---|---|---|---|
| D1 | [coach-ethan](./product-backlog.md#pb-3) | [coach-ethan acceptance criteria](./product-backlog.md#pb-3) · [`architecture.md`](./architecture.md) §2 | [Sprint 2 “coach-ethan”](#s2-coach) |

---

## Sprint 1

Sprint Goal: Phase 1 Scrum files are archived, and live process files at `specs/` follow the new shape.

**Status: closed** (every item is complete)

### ToDo

| # | Item | Category | Module | Acceptance criteria | Related docs | Note | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| <a id="s1-spec"></a>1 | Phase 2 specs restructure | Task | Specs | Phase 1 files live only under `phase1-specs/`. Live backlog, sprint plan, and artifacts map use the new process columns. No application code change. | [Phase 2 specs restructure](./product-backlog.md#pb-1) · [`artifacts-map.md`](./artifacts-map.md) | Archive and process-shaped live files are in place. | Done |

### Retrospective

**What went well**

- Phase 1 stayed in `phase1-specs/` instead of being rewritten into the new backlog.

**What to improve**

- Start the next story only after one Sprint 2 item is chosen.

**What we learned**

- The `Sprint` column is a projection. Execution status stays in this file.

---

## Sprint 2

Sprint Goal: Phase 2 stories are registered and ready to start. One story at a time.

**Status: in progress** (items not started)

### ToDo

| # | Item | Category | Module | Acceptance criteria | Related docs | Note | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| <a id="s2-artifacts"></a>1 | Install whole git artifacts | Task | MCP | Install and update copy every top-level folder in the synced package. Stdio and HTTP stay consistent with ADR-054. | [Install whole git artifacts](./product-backlog.md#pb-2) | — | ToDo |
| <a id="s2-practices"></a>2 | Scrum-with-SDD practices | Task | Specs | `sdd-scrum-practices.md` defines the refined framework, each Scrum event and its skill, and maintenance rules for every process artifact in the artifacts map. | [Scrum-with-SDD practices](./product-backlog.md#pb-5) | — | ToDo |
| <a id="s2-templates"></a>3 | Artifact templates | Task | Framework | The pack is `product-backlog.md`, `change-log.md`, `sprint-plan.md`, and `artifacts-map.md`, and it installs with the framework. | [Artifact templates](./product-backlog.md#pb-4) | — | ToDo |
| <a id="s2-skills"></a>4 | Process skills | Task | Framework | `Initiate_project`, `organize_artifacts`, `backlog_refinement`, `plan`, `track`, and `retrospective` exist and each maps to one event in the practices file. | [Process skills](./product-backlog.md#pb-6) | — | ToDo |
| <a id="s2-coach"></a>5 | coach-ethan | Task | Framework | Initial prompt and spike exist. Presence remains TBD until the spike closes. | [coach-ethan](./product-backlog.md#pb-3) · [`architecture.md`](./architecture.md) §2 | Depends on D1 before ship. | ToDo |
| <a id="s2-instructions"></a>6 | Instructions page | Task | Portal | The page covers full-repo install, the four templates, the six skills, and coach-ethan. Copy uses i18n keys. | [Instructions page](./product-backlog.md#pb-7) | — | ToDo |

Only one of these is active at a time. Do not start the others until that story meets its definition of done.

### Retrospective

**What went well**

- —

**What to improve**

- —

**What we learned**

- —
