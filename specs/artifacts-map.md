# Artifact index — framework.sdd.works

> **Purpose**: Required **process artifact** — this project’s index of live files and trees. Not framework definition (that is the guide and practices). Tracking is `status.md` and `change-log.md`. Knowledge is `adr/` and `knowledge/` (retrospective). Other docs link here; they do not keep a second catalog.
> **Practices**: [`sdd-scrum-practices.md`](./sdd-scrum-practices.md) (what, how, when: jobs, templates, table conventions).
> **Framework**: [`sdd-scrum-guide.md`](./sdd-scrum-guide.md) (names and meaning).

## Framework definition

| Artifact | Path | Role |
| --- | --- | --- |
| Scrum-in-SDD guide | [`sdd-scrum-guide.md`](./sdd-scrum-guide.md) | Names and meaning: terminologies, artifacts (process / tracking / knowledge / optional), events |
| Practices | [`sdd-scrum-practices.md`](./sdd-scrum-practices.md) | What, how, when: eight jobs, templates, RID and backlog table conventions |

## Process

| Artifact | Path | Role |
| --- | --- | --- |
| Product backlog | [`product-backlog.md`](./product-backlog.md) | Phase 2 requirements and acceptance |
| Sprint backlog | [`sprint-backlog.md`](./sprint-backlog.md) | Current schedule and execution status (SBI ToDo/WIP/Done) |
| Artifact index | [`artifacts-map.md`](./artifacts-map.md) | This file — project index |

## Tracking

| Artifact | Path | Role |
| --- | --- | --- |
| Status | [`status.md`](./status.md) | Current sprint, current SBI, next, OGT table (not a second sprint backlog) |
| Change log | [`change-log.md`](./change-log.md) | Conclusion-level changes |

## Knowledge

| Tree | Path | Role |
| --- | --- | --- |
| ADRs | [`adr/`](./adr/) | Durable architecture / process decisions (retrospective) |
| Knowledge | [`knowledge/`](./knowledge/) | Reusable research and ops notes that are not themselves a decision |

## Optional / JIT

| Artifact | Path | Role |
| --- | --- | --- |
| Architecture | [`architecture.md`](./architecture.md) | Stack pointer and Phase 2 decisions |
| Deployment | [`deployment.md`](./deployment.md) | Pointer to operator release docs |

## This product

| Tree | Path | Role |
| --- | --- | --- |
| coach-ethan design | [`agent-ethan/agent-design.md`](./agent-ethan/agent-design.md) | Presence, jobs, start load, missing-file recovery, MVP capabilities |
| coach-ethan tests | [`agent-ethan/agent-test.md`](./agent-ethan/agent-test.md) | Start-load and recovery test plan (`CE-LOAD-01`…`16`) |
| coach-ethan | [`agent-ethan/`](./agent-ethan/) | Coach agent design and tests |
| MCP | [`mcp/`](./mcp/) | MCP stories, design, tests, client paths |
| Admin portal | [`admin-portal/`](./admin-portal/) | Portal stories, design, mockups, tests |
| Release / deploy | [`release/`](./release/) | Operator deployment instructions |

## Planned framework artifacts

Not created until their backlog item is the active story.

| Artifact | Backlog | Role |
| --- | --- | --- |
| coach-ethan (MVP 1–3) | [coach-ethan](./product-backlog.md#pb-3) · [MVP 1](./product-backlog.md#pb-8) · [MVP 2](./product-backlog.md#pb-9) · [MVP 3](./product-backlog.md#pb-10) | Local Cursor agent. Design: [`agent-ethan/agent-design.md`](./agent-ethan/agent-design.md). Tests: [`agent-ethan/agent-test.md`](./agent-ethan/agent-test.md). D1 closed. |
| Process skills | [Process skills](./product-backlog.md#pb-6) | Full pack; MVP 2 needs a minimal `plan` skill only |
| Process templates | [Artifact templates](./product-backlog.md#pb-4) | `product-backlog.md`, `change-log.md`, `sprint-backlog.md`, `artifacts-map.md` |

## Archive (Phase 1 — closed)

Index only. Do not copy Release 1 tables into the live backlog.

| Artifact | Path |
| --- | --- |
| Archive index | [`phase1-specs/README.md`](./phase1-specs/README.md) |
| Product backlog | [`phase1-specs/r1-product-backlog.md`](./phase1-specs/r1-product-backlog.md) |
| Requirements | [`phase1-specs/r1-req-spec.md`](./phase1-specs/r1-req-spec.md) |
| Tech stack | [`phase1-specs/r1-tech-spec.md`](./phase1-specs/r1-tech-spec.md) |
| Sprint plans MVP-1…7 | [`phase1-specs/sprint1-plan.md`](./phase1-specs/sprint1-plan.md) … [`sprint7-plan.md`](./phase1-specs/sprint7-plan.md) |


