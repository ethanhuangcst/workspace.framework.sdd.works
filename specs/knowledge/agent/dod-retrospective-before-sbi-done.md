---
title: Run sdd-retrospective before SBI Done, not only board sync
type: ops-lesson
status: active
as_of: 2026-10-05
tags:
  - dod
  - retrospective
  - sdd-review-status
related_spec: specs/framework/seeds/skills/sdd-retrospective/SKILL.md
related:
  - adr/ADR-097-done-runs-retrospective.md
  - adr/ADR-091-retire-realtime-status-rule.md
  - adr/ADR-096-sdd-realtime-status-rule-name.md
  - knowledge/agent/askquestion-user-view.md
---

# Run sdd-retrospective before SBI Done, not only board sync

## Summary

An SBI row can show **Done** while **sdd-dod.mdc** is incomplete if the agent only runs **sdd-review-status** writes. The retrospective gate is **sdd-retrospective** in the same session, before or with the Done row, not a separate user confirm step after the summary.

## Evidence

- Sprint 6 **feature-37** through **feature-43** were marked **Done** from status-review picks without a Sprint 6 **Retrospective** section.
- **sdd-dod.mdc** SBI defaults require **sdd-retrospective** completed or an explicit empty retrospective.
- **sdd-review-status** applies backlog picks after the user chooses; it does not run **sdd-retrospective** for SBI **Done**.

## Lesson / guidance

- Before `sprint-backlog.md` or `product-backlog.md` shows an SBI **Done**, run **sdd-retrospective** (by rule or `/sdd-retrospective`).
- The skill persists ADR, knowledge, and sprint **Retrospective** in one pass and then sends **Retrospective Summary**. No second confirm.
- Status-review picks that set **Done** should name retrospective complete or trigger **sdd-retrospective** in the same turn before the write.

## Links

- [`sdd-retrospective`](../../framework/seeds/skills/sdd-retrospective/SKILL.md)
- [`sdd-dod.mdc`](../../framework/seeds/rules/sdd-dod.mdc)
- [`sdd-review-status`](../../framework/seeds/skills/sdd-review-status/SKILL.md)
