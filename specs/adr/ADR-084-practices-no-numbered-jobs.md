# ADR-084: Practices has no numbered job procedure sections

## Status
Accepted

## Context

[`sdd-scrum-practices.md`](../framework/seeds/templates/EN/sdd-scrum-practices.md) held a Jobs block: onboard, update project settings, refine backlog, sprint planning, report status, retrospective, and start a new sprint. Job 3 repeated `sdd-update-project`. Jobs 4, 5, 7, and 8 were empty. Job 6 repeated `sdd-review-status` and was Retired on Sprint 4 feature-30.

[ADR-079](./ADR-079-one-job-update-project.md) decision 2 kept job numbers 3 through 8. [ADR-076](./ADR-076-review-status-one-skill.md) decision 10 kept job 6 titled Report status.

The user decided those subsections are not needed. Workflow steps live in skills and agent PBIs.

## Decision

1. The EN practices file has no numbered job procedure subsections.
2. The heading at the end of that file is `## Scrum in SDD practices`. It may have no body until a later write.
3. Report status is `sdd-review-status` (`skill_get_status`). Update project settings is `sdd-update-project` (`skill_update_project`). Refine, plan, retrospective, and close or start a sprint stay on their skill keys and agent PBIs.
4. How to write each artifact stays in this practices file under Artifacts writing guideline.

## Rationale

A filled job section that restates a skill is a second procedure. An empty job section is not a procedure. Agent PBIs already name the skill to run.

## Consequences

- [ADR-076](./ADR-076-review-status-one-skill.md) decision 10 is superseded. How to write each process file stays in practices.
- [ADR-079](./ADR-079-one-job-update-project.md) decision 2 is superseded on job numbers 3 through 8. Decisions 1, 3, and 4 stay. The job name Update project settings stays.
- HanS and HanT practices copies stay on i18n-02.
- Sprint 5 Agent-02 still runs `sdd-update-project`. There is no practices job 3 to fill.

## Date
2026-10-03
