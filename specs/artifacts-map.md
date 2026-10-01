# Artifact index — framework.sdd.works

> **Purpose**: Required **process artifact** — this project’s index of live files and trees. Not framework definition (that is the guide and practices). Tracking is `status.md` and `changes-log.md`. Knowledge is `adr/` and `knowledge/` (retrospective). Other docs link here; they do not keep a second catalog.
> **Practices**: [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) (what, how, when: jobs, templates, table conventions).
> **Framework**: [`scrum-in-sdd.md`](./framework/seeds/templates/EN/scrum-in-sdd.md) (names and meaning).

## Framework definition

| Artifact | Path | Role |
| --- | --- | --- |
| Scrum-in-SDD guide | [`framework/seeds/templates/EN/scrum-in-sdd.md`](./framework/seeds/templates/EN/scrum-in-sdd.md) | Names and meaning. HanS copy: [`scrum-in-sdd.md`](./framework/seeds/templates/HanS/scrum-in-sdd.md). |
| Practices | [`framework/seeds/templates/EN/sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) | What, how, when: jobs, templates, RID and backlog table conventions |
| Framework design | [`framework/framework-design.md`](./framework/framework-design.md) | Overall design for framework artifacts: framework-artifacts, agents, rules, skills, and templates |
| Seed building guide | [`seed-artifacts-building-guide.md`](./seed-artifacts-building-guide.md) | Method for writing an artifact seed, one section at a time |
| Pack lookup | [`framework/seeds/templates/constants.md`](./framework/seeds/templates/constants.md) | Path names, instructions URL, skill and rule keys. Live copy on client root only ([ADR-060](./adr/ADR-060-constants-on-client-root.md)) |

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
| Changes log | [`changes-log.md`](./changes-log.md) | Conclusion-level changes |

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
| IDE agent invoke | [`how-ide-invokes-agent.md`](./how-ide-invokes-agent.md) | Where each tool reads a custom agent, how to start it, and how long that start lasts |

## This product

| Tree | Path | Role |
| --- | --- | --- |
| Framework stories | [`framework/framework-stories.md`](./framework/framework-stories.md) | Stories. The agents section is the former coach stories. |
| Framework tests | [`framework/framework-test.md`](./framework/framework-test.md) | Tests. The agents section is the former coach test plan (`CE-LOAD-01`…`16`). |
| MCP | [`mcp/`](./mcp/) | MCP stories, design, tests, client paths |
| Admin portal | [`admin-portal/`](./admin-portal/) | Portal stories, design, mockups, tests |
| Release / deploy | [`release/`](./release/) | Operator deployment instructions |

## Planned framework artifacts

Not created until their backlog item is the active story.

| Artifact | Backlog | Role |
| --- | --- | --- |
| ethan | [Agent-01](./product-backlog.md#pb-6) through [Agent-15](./product-backlog.md#pb-63) | Local Cursor agent. Design: [`framework/framework-design.md`](./framework/framework-design.md). |
| Rules | [Rule-01](./product-backlog.md#pb-18) · [Rule-02](./product-backlog.md#pb-19) · [Rule-03](./product-backlog.md#pb-20) | Harness rules in the pack |
| Skills | [Skill-01](./product-backlog.md#pb-21) through [Skill-13](./product-backlog.md#pb-65) · [Skill-14](./product-backlog.md#pb-80) | Harness skills in the pack. Skill-11 is unused. |
| Seeds | [Spec-seeds-01](./product-backlog.md#pb-32) through [Spec-seeds-11](./product-backlog.md#pb-66) | Pack templates, including `.secrets` |

## Archive (Phase 1 — closed)

Index only. Do not copy Release 1 tables into the live backlog.

| Artifact | Path |
| --- | --- |
| Archive index | [`phase1-process-specs/README.md`](./phase1-process-specs/README.md) |
| Product backlog | [`phase1-process-specs/r1-product-backlog.md`](./phase1-process-specs/r1-product-backlog.md) |
| Requirements | [`phase1-process-specs/r1-req-spec.md`](./phase1-process-specs/r1-req-spec.md) |
| Tech stack | [`phase1-process-specs/r1-tech-spec.md`](./phase1-process-specs/r1-tech-spec.md) |
| Sprint plans MVP-1…7 | [`phase1-process-specs/sprint1-plan.md`](./phase1-process-specs/sprint1-plan.md) … [`sprint7-plan.md`](./phase1-process-specs/sprint7-plan.md) |


