# ADR-070: Change log and issues log are both process files

## Status
Accepted

## Context
Process files sit directly under `artifacts_root`. The set is `product-backlog.md`, `sprint-backlog.md`, `status.md`, `changes-log.md`, and `issues-log.md`.

`changes-log.md` already records a conclusion: what changed, why, and how it was verified. This repo’s `issues-log.md` records a defect while it is open and keeps the row after it is closed. Putting both jobs in the change log, or treating an open defect as a sprint OGT only, mixes a finished change with a problem that is still open.

## Decision
1. `changes-log.md` is the conclusion record. A row is written when a change is done. It states what changed, why, and how it was verified.
2. `issues-log.md` is the defect record. A row is opened when a defect is found and stays after it is closed. The two tables and the status values are in [ADR-075](./ADR-075-issues-log-tables.md).
3. `status.md` keeps the current sprint, the current SBI, what is next, and the OGT table for the sprint item in progress. An open defect is not an OGT row.
4. An audit gap that is a defect is recorded in `issues-log.md` after the user confirms the gap. The change log gets a row only when a fix is concluded.
5. Both files are process files under `artifacts_root`. EN starters for both are Sprint 3. HanS and HanT bodies are not this decision.

## Rationale
A reader can tell a finished change from an open defect by which file the row is in. The sprint OGT table stays a short list for the item in progress.

## Consequences
- [Spec-seeds-08](product-backlog.md#L255) moves from Sprint 5 to Sprint 3. [Spec-seeds-13](product-backlog.md#L258) is the issues-log seed, also Sprint 3. Sprint 3 feature-21 writes both EN starters.
- Sprint 5 no longer has a change-log seed row.
- `sdd-audit-artifacts` does not invent a third log. Confirmed defects go to `issues-log.md`.

## Date
2026-09-27
