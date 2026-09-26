# ADR-065: Status skill is `sdd-tracking`

## Status
Accepted

## Context
Practices job 6 is “Report status”. The pack named that job’s skill `sdd-update-status` with key `skill_update_status`. The folder does not exist yet. Sprint 7 is the first sprint that writes the skill.

“Update status” names one file edit. The job keeps `status.md` current for the whole project: where the sprint is, what is in progress, and what is next. The skill id should name that job, and it should not collide with the rule `sdd-realtime-status`.

## Decision
1. The skill folder is `sdd-tracking`. The constants key is `skill_tracking`.
2. Practices job 6 stays titled “Report status”. Ethan’s job index keeps that title and points it at `skill_tracking`.
3. Do not ship `sdd-update-status` or `skill_update_status`. Sprint 7 writes `sdd-tracking`.
4. Living specs, the three Features markdown files, and the locale strings that name the skill use `sdd-tracking`. Phase 1 archive files stay as history.

## Rationale
The skill is not built, so renaming the id now does not move an installed folder or a ledger entry. `tracking` matches the job (keep the live picture current) and stays distinct from the always-on rule `realtime-status`. Keeping the practices heading avoids a second rename of job 6, which is still *(to fill)*.

## Consequences
- [Skill-07](../product-backlog.md#pb-27) and [Agent-12](../product-backlog.md#pb-46) use the new id. Sprint 7 feature-01 ships `sdd-tracking`.
- Sprint 3 feature-12 is the spec rename. It does not write `SKILL.md`.
- A later install must not list `skills/sdd-update-status/SKILL.md`.

## Date
2026-09-26
