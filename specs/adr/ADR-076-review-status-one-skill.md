# ADR-076: Status review and the confirmed write are one skill

## Status
Accepted. Decisions 6 and 7 superseded by [ADR-083](./ADR-083-review-status-pick-then-one-write.md). Decision 10 superseded by [ADR-084](./ADR-084-practices-no-numbered-jobs.md).

## Context

### The earlier records

- [ADR-073](./ADR-073-skill-get-status.md) made `sdd-review-status` a read of the five process files.
- [ADR-065](./ADR-065-skill-update-status.md) made `sdd-update-status` the confirmed write of `status.md`.

### The gap

- A file-only read reports the board.
- When the board lags the implementation, that report is wrong about the work.
- Sprint Review inspects the outcome and identifies what to adapt.
- The outcome is the implementation.
- The five process files are the board.

### One job

- The compare and the proposal belong in one skill.

## Decision
1. The skill folder is `sdd-review-status`.
   The constants key is `skill_get_status`.
   The pack ships no `sdd-update-status` folder and no `skill_update_status` key.
2. The skill runs after a `Usable` audit.
   The skill also runs when the user asks where the project is, what to do next, whether the board matches the implementation, or to report status.
   Those requests use the same steps.
3. `status_from_board` is the summary of changes-log, issues-log, status, sprint-backlog, and product-backlog.
   The board is those five files.
   When they disagree, the summary says so.
   The sprint backlog stays the schedule.
4. `status_from_implementation` is the summary of the open items in the current sprint and the actual work those items name.
   An item that names no work is unchecked.
5. The skill lists each mismatch between those two summaries.
   Each mismatch gets its own handling, or the user types one.
   The three default handlings are:
   - Update process artifacts now
   - Record an OGT and update later
   - Leave to me, I will manually update later
6. The skill shows the exact text for that row.
   The skill writes that text after the user says yes.
7. "Update process artifacts now" writes the accepted sentences in this order: changes-log, issues-log, status, sprint-backlog, product-backlog.
   A file outside that row stays as it is.
8. "Record an OGT and update later" adds one on-going task (OGT) row to `status.md`.
   An OGT is a side task.
   When the mismatch is an untracked defect, the OGT text is "track defect xyz in issues-log".
   The issues-log row is a later write.
9. "Leave to me, I will manually update later" writes nothing for that mismatch.
   The next run shows that mismatch again.
10. Practices job 6 stays titled "Report status" and points at `skill_get_status`.
    How to write each process file stays in `sdd-scrum-practices.md`.
    The skill loads that section when a file is about to change.
11. A missing process file stops the skill.
    The skill leaves that file uncreated.
    A write stays inside the five process files named above.
    The skill marks an item Done when the user says Done and that item's definition of done is met.

## Rationale

### Why one skill

- One skill holds the compare, the per-row handling, and the second yes.
- The file templates stay in practices.
- The skill loads a template when a file is about to change.
- Onboard uses the same steps.
- Onboard writes a file after the user says yes to the shown text.

## Consequences

- This record replaces [ADR-073](./ADR-073-skill-get-status.md) decision 4 and decision 6.
- This record replaces the second folder in [ADR-065](./ADR-065-skill-update-status.md).
- [Skill-12](../product-backlog.md#pb-86) is the status skill.
- Skill-07 is retired.
- Sprint 4 feature-24 holds the skill seed.
- Sprint 4 feature-30 holds practices job 6.
- Sprint 4 feature-30 and practices job 6 are Retired. Report status is `sdd-review-status`.
- The constants key for report status is `skill_get_status`.
- The `skill_tracking` row stays until the `sdd-tracking` seed folder is removed.
- HanS and HanT guide copies stay on i18n-02.

## Date
2026-10-02
