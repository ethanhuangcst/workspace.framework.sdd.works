# ADR-086: PBI Size column and Implementable-only sprint planning

## Status
Accepted

## Context
Product backlog rows mixed umbrella outcomes, vague multi-path requirements, and shippable PBIs in one table. Sprint planning had no column to exclude rows that still need split or tighten. Readiness item 8 described the ladder on requirement bullets but did not tie it to table columns or SBIs.

## Decision
1. The Product Backlog table and Unplanned PBIs include a `Size` column after `Description`. Allowed values are `Epic`, `Theme`, and `Implementable`.
2. [Epic (PBI Size)](../../pack.framework.sdd.works/templates/sdd-scrum-practices.md#term-pbi-size-epic) is one outcome too broad to ship as one PBI. [Theme (PBI Size)](../../pack.framework.sdd.works/templates/sdd-scrum-practices.md#term-pbi-size-theme) is one area whose bullets still hide more than one path. [Implementable (PBI Size)](../../pack.framework.sdd.works/templates/sdd-scrum-practices.md#term-pbi-size-implementable) is one user-visible outcome that may get a sprint and SBIs.
3. Acceptance-criterion-level detail is not a `Size` value. User stories and acceptance criteria stay with `sdd-atdd` or `sdd-spec-to-build`.
4. `sdd-refine-backlog` sets `Size`, requirement bullets, and related process files after the user picks each readiness fail.
5. `sdd-plan-sprint` proposes only Implementable PBIs for sprint MVPs. Epic and Theme rows stay out of options until refine splits or tightens them.
6. MVP wording in practices uses smallest feature set, not smallest release.

## Rationale
Size makes the readiness ladder visible on the board. Plan-sprint no longer schedules umbrella rows. Refine owns classification so plan-sprint stays a scheduling skill.

## Consequences
- EN practices gain §4 Size product backlog, terminology rows, readiness item 9, and updated table templates.
- Living `product-backlog.md` and Unplanned PBIs gain `Size`; existing rows default to Implementable in the introducing pass.
- Pack skills `sdd-refine-backlog` and `sdd-plan-sprint` encode Size writes and Implementable-only candidates.

## Date
2026-10-04
