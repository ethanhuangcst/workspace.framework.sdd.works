---
title: Sprint Status can lag shipped code until close confirm
type: ops-lesson
status: active
as_of: 2026-10-07
tags:
  - dod
  - status
  - close-confirm
related_spec: pack.framework.sdd.works/rules/sdd-dod.mdc
related:
  - knowledge/agent/dod-retrospective-before-sbi-done.md
  - adr/ADR-097-done-runs-retrospective.md
---

# Sprint Status can lag shipped code until close confirm

## Summary

An SBI row can stay **ToDo** or **WIP** on `sprint-backlog.md` and `status.md` after the code, tests, and related specs already exist. Close confirm after an evidence check sets **Done**. Board Status alone is not proof that work never shipped.

## Evidence

- On 2026-10-07, Sprint 8 listed feature-55, feature-56, feature-58 through feature-60, feature-69, and feature-70 as **ToDo**, and feature-71 as **WIP**, while lite file-links routes, Setup install prompt coverage, `.instructions-tabs.json`, the tabs API and UI, the Learn Scrum embed, heading anchors, and the rewritten `sdd-retrospective` skill were already in the tree.
- `status.md` still named feature-55 as a next start item until the user confirmed those eight SBIs usable in one message.

## Lesson / guidance

- Before treating a **ToDo** SBI as unstarted, check routes, seeds, tests, and `changes-log.md` for shipped evidence.
- Do not invent **Done** from files alone. Wait for **close confirm**, then run **sdd-retrospective** and write the board.

## Links

- [`sdd-dod.mdc`](../../../pack.framework.sdd.works/rules/sdd-dod.mdc)
- [`sdd-retrospective`](../../../pack.framework.sdd.works/skills/sdd-retrospective/SKILL.md)
