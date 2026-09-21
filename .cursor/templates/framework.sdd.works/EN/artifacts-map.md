# Artifact index — [product name]

> **Purpose**: List process docs and optional domain docs so there is not a second catalog.
> **Example**: Pokymon Card Collection. Do not create a domain folder before the product has that surface.
> **Conventions**: [`sdd-scrum-practices.md`](./sdd-scrum-practices.md).

## Process docs

| Artifact | Path | Role |
| --- | --- | --- |
| Conventions | [`sdd-scrum-practices.md`](./sdd-scrum-practices.md) | How to write RID, sprint, backlog, and change log |
| Product backlog | [`product-backlog.md`](./product-backlog.md) | Requirements and acceptance |
| Sprint plan | [`sprint_plan.md`](./sprint_plan.md) | Current schedule and execution status |
| Change log | [`change-log.md`](./change-log.md) | Conclusion-level changes |
| Architecture | [`architecture.md`](./architecture.md) | Stack and decisions |
| Deployment | [`deployment.md`](./deployment.md) | Local startup and go-live steps |

## Optional domain docs

Add these when the product has that surface. Do not pre-create empty folders in the template pack.

| Artifact | When to add |
| --- | --- |
| `adr/` | When an architecture decision needs its own record |
| App stories and design | When there is a user-facing interface |
| Test notes | When there is a repeatable verification matrix that does not fit only in backlog acceptance criteria |
