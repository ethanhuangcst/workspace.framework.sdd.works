---
title: AskQuestion lines the user can act on
type: ops-lesson
status: active
as_of: 2026-10-03
tags:
  - askquestion
  - status
  - skills
related_spec: specs/framework/seeds/skills/sdd-review-status/SKILL.md
related:
  - adr/ADR-083-review-status-pick-then-one-write.md
---

# AskQuestion lines the user can act on

## Summary

A status handling question that only the agent can parse gets cancelled. The prompt names the item the user already sees. Each choice names what happens to that item.

## Evidence

Sprint 4 live runs of `sdd-review-status` on 2026-10-03:

- A prompt that only said `feature-03` was unread.
- "The table and status already say Retired. What should happen to that note?" was agent-view.
- "Update process artifacts now" did not say Retired, deleted, or Done.
- "Write a task" was the wrong name. The choice is Create an OGT (On-going Task) in `status.md`.
- Findings in a fenced code block truncated on screen.
- A yes-or-no after the AskQuestion pick was a second confirmation. The user dropped that step. [ADR-083](../../adr/ADR-083-review-status-pick-then-one-write.md).

## Lesson / guidance

- The prompt names the code and the name. It names the file that records one status and the file that records the other.
- A choice names the result for that item. Retired, WIP, Done, removed, left as it is, or an OGT in `status.md`.
- Findings are a wrapping list. Leave them out of a code block.
- Ask one mismatch. Record the pick. Ask the next. Write once after the last pick.

## Links

- [`sdd-review-status`](../../framework/seeds/skills/sdd-review-status/SKILL.md)
- [ADR-083](../../adr/ADR-083-review-status-pick-then-one-write.md)
