# Artifact index — [product name]

> **Purpose**: Required **process artifact** — this project’s index of live files and trees. Not framework definition (that is the guide and practices). Tracking is `status.md` and `change-log.md`. Knowledge is `adr/` and `knowledge/` (retrospective). Other docs link here; they do not keep a second catalog.
> **Example**: Pokymon Card Collection. Do not create a domain folder before the product has that surface.
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
| Product backlog | [`product-backlog.md`](./product-backlog.md) | Requirements and acceptance |
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
| ADRs | [`adr/`](./adr/) | Durable architecture / process decisions (retrospective). Create when needed. |
| Knowledge | [`knowledge/`](./knowledge/) | Reusable research and ops notes that are not themselves a decision. Create when needed. |

## Optional / JIT

| Artifact | Path | Role |
| --- | --- | --- |
| Architecture | [`architecture.md`](./architecture.md) | Stack and decisions |
| Deployment | [`deployment.md`](./deployment.md) | Local startup and go-live steps |

## Optional product surfaces

Add these when the product has that surface. Do not pre-create empty folders in the template pack.

| Artifact | When to add |
| --- | --- |
| App stories and design | When there is a user-facing interface |
| Test notes | When there is a repeatable verification matrix that does not fit only in backlog acceptance criteria |
