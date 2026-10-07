# ADR-083: The handling pick is the confirmation, and the write is one pass

## Status
Accepted

## Context

[ADR-076](./ADR-076-review-status-one-skill.md) put compare, handling, and write in `sdd-review-status`. Decision 6 showed the exact text for one mismatch and wrote after a second yes. Decision 7 wrote that mismatch before the next question.

Live runs of the skill showed two costs:

- A second yes after AskQuestion repeated a choice the user already made.
- A write after each mismatch opened the five process files more than once in one review.

The user decided a second confirmation is not required, and that every handling is recorded first, then written once.

## Decision

1. The AskQuestion pick is the confirmation for that mismatch. Do not ask a second yes before the write.
2. After a pick, record the change that choice names. Leave the five process files unchanged. Ask the next mismatch.
3. After the last mismatch has a pick, write every recorded change in one pass, in this order: changes-log, issues-log, status, sprint-backlog, product-backlog.
4. The later default choice is "Create an OGT (On-going Task) in status.md". A choice that says "write a task" fails.
5. A user-facing choice names what happens to the item (Retired, WIP, Done, removed, or left as it is). A choice that only says "Update process artifacts now" fails.

## Rationale

The pick already names the result. A second yes adds a round and tokens without a new fact. One write pass keeps the five files consistent with every pick from that review.

## Consequences

- [ADR-076](./ADR-076-review-status-one-skill.md) decisions 6 and 7 are superseded. Decisions 1–5, 8, 9, and 11 stay. How to write each process file stays in `sdd-scrum-practices.md`.
- The seed [`sdd-review-status/SKILL.md`](../framework/seeds/skills/sdd-review-status/SKILL.md) records picks, then writes once.
- [Skill-15](product-backlog.md#L113) stays the status skill.

## Date
2026-10-03
