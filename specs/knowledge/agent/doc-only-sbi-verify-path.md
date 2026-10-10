---
title: Doc-only SBIs need an explicit verify path in chat
type: ops-lesson
status: active
as_of: 2026-10-10
tags:
  - documentation
  - dod
  - close-confirm
  - operator
related:
  - knowledge/agent/verify-usable-same-session-as-ship.md
---

# Doc-only SBIs need an explicit verify path in chat

## Summary

When an SBI ships only specs (no app diff), the operator cannot verify it in the browser. The agent must name the deliverable file, the AC anchors, and the review steps before **close confirm**.

## Evidence

- On 2026-10-10, [feature-84](../sprint-backlog.md#sprint-9) / [Web-portal-20](../product-backlog.md#pb-106) closed after the user read [`release.md`](../release.md) §12. An earlier reply described implementation status but not where to read the guide or how doc review maps to AC48–AC49.

## Lesson / guidance

- **What:** one sentence on the artifact (for example “§12 operator URL guide in `release.md`”).
- **Where:** full path to the section and to `app-stories.md` AC ids.
- **How:** doc read-through for the SBI; optional `npm test` or §7.1 curls only when they prove related app behavior, not the prose itself.
- Ask for **close confirm** only after that verify path is in the thread.
