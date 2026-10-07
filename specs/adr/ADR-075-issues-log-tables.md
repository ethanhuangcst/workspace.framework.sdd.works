# ADR-075: Issues log uses an Open table and a Closed table

## Status
Accepted

## Context
[ADR-070](./ADR-070-change-log-and-issues-log.md) makes `issues-log.md` the defect record and says a row status is `Open` or `Closed`. A defect can be fixed and still waiting on its close check, or accepted and not scheduled. Those states are not closures. One table cannot show both an open defect and a closed one without mixing the sort keys.

## Decision
1. `issues-log.md` has two tables, in this order: Open issues, then Closed issues.
2. Open issues columns: `Id`, `Title`, `Component`, `Priority`, `Description`, `Related`, `Close Check`, `Status`, `Added time`. Status in this table is `Open`, `Fixed`, or `Deferred`.
3. Closed issues columns: `Id`, `Title`, `Component`, `Priority`, `Description`, `Related`, `Close Check`, `Closed Sprint`, `Closed time`. A row moves here only when it is `Closed`.
4. `Fixed` means a fix exists and the close check is not confirmed. `Deferred` means the defect is accepted and not scheduled.
5. Priority is `Fatal`, `High`, `Medium`, or `Low`.
6. `Id` stays the same when a row is sorted or moves tables.
7. `Description` is a short summary, under 3 lines. Bullets when a sentence is not enough. `Close Check` is shorter.
8. `Related` is a spec id, a link, and the name.
9. Both tables sort by component A to Z, then by time, oldest first. Open uses `Added time`. Closed uses `Closed time`. The date shape is `30/Sep/2026`.
10. An open defect is not an OGT row. A concluded fix still gets a change-log entry.

## Rationale
The Open table holds work that is not finished. The Closed table holds defects whose close check passed. Sorting by component, then by the date that belongs to that table, keeps a reader from hunting one part of the product across the file.

## Consequences
- [ADR-070](./ADR-070-change-log-and-issues-log.md) decision 2 no longer names the status values. This ADR does.
- [Spec-seeds-13](product-backlog.md#L258) and the EN seed `specs/framework/seeds/templates/EN/issues-log.md` follow these tables. HanS and HanT bodies stay on i18n-02.
- The live `specs/issues-log.md` uses these tables. The twelve Web-app rows closed in Sprint 3 sit in Closed issues.

## Date
2026-09-30
