# ADR-097: Done writes run sdd-retrospective first

## Status
Accepted

## Context

Sprint 6 SBIs reached **Done** on `sprint-backlog.md` through **sdd-review-status** picks without running **sdd-retrospective**, even though [`sdd-dod.mdc`](../framework/seeds/rules/sdd-dod.mdc) requires the skill before PBI or SBI **Done**. Some sprints had **Done** rows and no `### Retrospective` section until catch-up.

## Decision

1. Any write that sets an SBI or PBI to **Done** runs **sdd-retrospective** in the same session **before** the **Done** row on `sprint-backlog.md` or `product-backlog.md`.
2. **sdd-review-status** delegates: after the user picks a **Done** line, the write pass runs **sdd-retrospective** first, then the existing process-file pick order.
3. **sdd-retrospective** creates a missing `### Retrospective` section under the sprint (practices template), then appends numbered Learnings, Opportunities, and Future actions.
4. Retrospective stays automatic in one turn (no second confirm after **Retrospective Summary**). User usable confirm for the deliverable stays on **sdd-dod.mdc**.

## Relationship to ADR-076

[ADR-076](./ADR-076-review-status-one-skill.md) retires a separate status-update skill. This ADR does not restore it. **sdd-review-status** still compares and waits for the user's pick; it adds a **Done** choreography step only.

## Consequences

- Seed updates: `sdd-retrospective`, `sdd-review-status`, `sdd-dod.mdc`.
- **CE-SKILL-10** covers create-if-missing on sprint **Retrospective**. **CE-SKILL-11** covers review-status **Done** picks.
- Knowledge: [`dod-retrospective-before-sbi-done.md`](../knowledge/agent/dod-retrospective-before-sbi-done.md) remains the ops lesson; skill text is the enforcement source.

## Date
2026-10-05
