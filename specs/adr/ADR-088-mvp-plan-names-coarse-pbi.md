# ADR-088: An MVP plan may name an Epic or Theme

## Status
Accepted

## Context
`sdd-plan-sprint` kept every Epic and Theme off the sprint proposal. A job can still need that outcome before the row is small enough to schedule. A fixed list of cases (dependency, value, next step) would hard-code product stories into the skill.

[ADR-086](./ADR-086-pbi-size.md) keeps Size rules. Only an Implementable product backlog item (PBI) gets a sprint and sprint backlog items (SBIs).

## Decision
1. Practices [§1 Plan sprints by MVP](../../pack.framework.sdd.works/templates/framework.sdd.works/sdd-scrum-practices.md#1-plan-sprints-by-mvp) and [§2 Slice product to MVPs](../../pack.framework.sdd.works/templates/framework.sdd.works/sdd-scrum-practices.md#2-slice-product-to-mvps) state the rule. When the sprint job needs an Epic or Theme outcome, the plan names that PBI. When the job does not need it, the plan leaves it off. The skill does not copy a case list.
2. Naming the PBI does not schedule it. `Sprint` stays unset and no SBI is added until `sdd-refine-backlog` makes the row Implementable, or splits or tightens it into Implementable PBIs.
3. Accepting the option writes one on-going task (OGT) on `status.md` for each coarse PBI named in that option, so refine is tracked before the sprint is treated as delivering that outcome.
4. Chat uses plain sentences: the PBI code, the short name, why the job needs it, and that refine comes before the sprint schedules it.
5. The proposal list and the choices are one chat message. Leave AskQuestion uncalled. A question card in the same turn appears before the chat text, so the list would show only after the question. The reply in chat that names one choice is the confirmation.

## Rationale
The job in §2 is the test. The agent applies that test to the backlog in front of it. The skill only shows the result and writes the OGT.

## Consequences
- `sdd-plan-sprint` lists Implementable PBIs as a numbered list (Now, then If you accept). The list is not a table.
- Epic and Theme rows can appear under the option as “refine before the sprint delivers this,” with an OGT on accept.
- Readiness item 9 still blocks `Sprint` and SBIs on Epic and Theme.

## Date
2026-10-04
