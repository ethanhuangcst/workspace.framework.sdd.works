---
title: Verify usable and close the SBI in the same session as the ship
type: ops-lesson
status: active
as_of: 2026-10-10
tags:
  - dod
  - close-confirm
  - testing-expert
  - ai-agent
related_spec: pack.framework.sdd.works/rules/sdd-dod.mdc
related:
  - knowledge/agent/board-status-lags-shipped-code.md
  - knowledge/agent/dod-retrospective-before-sbi-done.md
---

# Verify usable and close the SBI in the same session as the ship

## Summary

When implementation and tests finish, run the usable check and ask for **close confirm** in that same chat. A later session must rebuild context from files and may repeat the same test work.

## Evidence

- On 2026-10-10, [Web-portal-39](../product-backlog.md#pb-136) shipped in code on 2026-10-09 while [feature-97](../sprint-backlog.md#sprint-9) stayed **ToDo** until a separate thread ran Playwright and Vitest again before **Done**.

## Lesson / guidance

- After the last green test for an SBI, stop for **close confirm** in the same turn or the next message while the agent still holds the run log.
- Do not defer “is it usable?” to a later chat unless you accept re-running checks.
- The agent does not retain the earlier session’s test output; `changes-log.md` and specs are not a substitute for a fresh run when you need proof.

## Links

- [`sdd-dod.mdc`](../../../pack.framework.sdd.works/rules/sdd-dod.mdc)
- [`sdd-incremental-delivery.mdc`](../../../pack.framework.sdd.works/rules/sdd-incremental-delivery.mdc)
