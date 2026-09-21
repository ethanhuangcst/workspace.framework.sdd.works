# Artifact index — framework.sdd.works

> **Purpose**: List process docs, domain docs, and the closed Phase 1 archive so there is not a second catalog.
> **Conventions**: [`sdd-scrum-practices.md`](./sdd-scrum-practices.md).

## Process docs

| Artifact | Path | Role |
| --- | --- | --- |
| Conventions | [`sdd-scrum-practices.md`](./sdd-scrum-practices.md) | How to write RID, sprint, backlog, and change log. After PRACTICES-01, also the only definition of the refined Scrum framework, SDD events and their skills, and how to maintain each artifact in this map |
| Product backlog | [`product-backlog.md`](./product-backlog.md) | Phase 2 requirements and acceptance |
| Sprint plan | [`sprint-plan.md`](./sprint-plan.md) | Current schedule and execution status |
| Change log | [`change-log.md`](./change-log.md) | Conclusion-level changes |
| Architecture | [`architecture.md`](./architecture.md) | Stack pointer and Phase 2 decisions |
| Deployment | [`deployment.md`](./deployment.md) | Pointer to operator release docs |

## Domain docs

| Tree | Path | Role |
| --- | --- | --- |
| ADRs | [`adr/`](./adr/) | Architecture decision records |
| MCP | [`mcp/`](./mcp/) | MCP stories, design, tests, client paths |
| Admin portal | [`admin-portal/`](./admin-portal/) | Portal stories, design, mockups, tests |
| Knowledge | [`knowledge/`](./knowledge/) | Reusable research and ops notes |
| Release / deploy | [`release/`](./release/) | Operator deployment instructions |

## Planned framework artifacts

Not created in the requirement-capture story. They become installable when their backlog item is the active story.

| Artifact | Backlog | Role |
| --- | --- | --- |
| Process skills | [Process skills](./product-backlog.md#pb-6) | `Initiate_project`, `organize_artifacts`, `backlog_refinement`, `plan`, `track`, `retrospective` |
| coach-ethan | [coach-ethan](./product-backlog.md#pb-3) | Scrum coach agent. Presence (MCP vs local) is TBD |
| Process templates | [Artifact templates](./product-backlog.md#pb-4) | `product-backlog.md`, `change-log.md`, `sprint-plan.md`, `artifacts-map.md` |

## Archive (Phase 1 — closed)

Index only. Do not copy Release 1 tables into the live backlog.

| Artifact | Path |
| --- | --- |
| Archive index | [`phase1-specs/README.md`](./phase1-specs/README.md) |
| Product backlog | [`phase1-specs/r1-product-backlog.md`](./phase1-specs/r1-product-backlog.md) |
| Requirements | [`phase1-specs/r1-req-spec.md`](./phase1-specs/r1-req-spec.md) |
| Tech stack | [`phase1-specs/r1-tech-spec.md`](./phase1-specs/r1-tech-spec.md) |
| Sprint plans MVP-1…7 | [`phase1-specs/sprint1-plan.md`](./phase1-specs/sprint1-plan.md) … [`sprint7-plan.md`](./phase1-specs/sprint7-plan.md) |
