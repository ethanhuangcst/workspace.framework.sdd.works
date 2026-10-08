# ADR-098: Sprint-backlog DoD links to product-backlog

## Status
Accepted

## Context

`product-backlog.md` holds **Definition of Done** (additional PBI checks on top of [`sdd-dod.mdc`](../framework/seeds/rules/sdd-dod.mdc)). `sprint-backlog.md` duplicated the same generic bullets, so two process files drifted when the quality bar changed.

## Decision

1. **Canonical checklist** for both PBI and SBI close: [`sdd-dod.mdc`](../framework/seeds/rules/sdd-dod.mdc) defaults plus [`product-backlog.md`](../product-backlog.md#definition-of-done) **Definition of Done** (product-specific checks).
2. **`sprint-backlog.md`** keeps a short **Definition of Done** section above the first sprint table. It **links** to `./product-backlog.md#definition-of-done` and does not repeat the generic bullet list.
3. **Sprint-only content** stays on `sprint-backlog.md`: optional **replacement** checklist for named sprints, and the **Additional Done Criteria** note (per-row checks under a sprint heading).
4. EN seeds and [`sdd-scrum-practices.md`](../../pack.framework.sdd.works/templates/sdd-scrum-practices.md) sprint-backlog DoD template follow this shape.

## Consequences

- One place to edit product-specific DoD bullets (`product-backlog.md`).
- **CE-TPL-04** and process-artifact stories expect a link, not a duplicated checklist, in the sprint seed DoD section.
- [`sdd-dod.mdc`](../framework/seeds/rules/sdd-dod.mdc) SBI **Extra** names the link plus sprint replacement and Additional Done Criteria.

## Date
2026-10-05
