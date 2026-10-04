# ADR-079: Start and update are one job

## Status
Accepted. Decision 2 (job numbers 3 through 8 stay) superseded by [ADR-084](./ADR-084-practices-no-numbered-jobs.md).

## Context

[ADR-078](./ADR-078-update-project-one-skill.md) made `sdd-update-project` the only skill for a missing map and for a map already in use. Decision 2 kept two job titles: Start a new project, and Update project settings. Both rows in the Capabilities table used `skill_update_project`.

The model has one skill to open. Two rows do not give it a second choice.

## Decision

1. The job name is Update project settings. The Capabilities table has one row for it. The skill key is `skill_update_project`.
2. Practices job 2 is removed. Its steps sit under practices job 3 as the case where the map is missing. Job numbers 3 through 8 stay.
3. Onboard still says two next steps. `Uninitialized` says the next step is to start a new project. `Index broken` says the next step is to update the project. After the user confirms, both follow `sdd-update-project`.
4. Agent-08 is retired. It is not Done. Agent-09 is the job.

## Rationale

One skill is one job. The two audit sentences stay, because they tell the user which case the confirm covers.

## Consequences

- [ADR-078](./ADR-078-update-project-one-skill.md) decision 2 is superseded on 2026-10-03. Decisions 1, 3, 4, and 5 stay.
- Sprint 5 feature-02 stays ToDo. It is the `Uninitialized` confirm of this job.

## Date
2026-10-03
