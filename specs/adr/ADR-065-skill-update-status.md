# ADR-065: Status write skill is `sdd-update-status`

## Status
Accepted

## Context
Practices job 6 is “Report status”. On 2026-09-26 this record named the write skill `sdd-tracking` with key `skill_tracking`, so the id would not sound like one field edit and would stay distinct from the rule `realtime-status.mdc`. The folder `sdd-update-status` was rejected. The file was `ADR-065-skill-tracking-not-update-status.md`.

The skill drafts a change to `status.md`, waits for confirm, and writes that picture. `sdd-tracking` does not say that. The read is a different skill, `sdd-get-status` ([ADR-073](./ADR-073-skill-get-status.md)). With the read split out, the write skill’s name is `sdd-update-status`.

## Decision
1. The skill folder is `sdd-update-status`. The constants key is `skill_update_status`.
2. The skill drafts an update of `status.md` from the sprint backlog, waits for confirm, and writes only the confirmed text. It does not mark a PBI Done.
3. Practices job 6 stays titled “Report status”. Ethan’s job index keeps that title and points it at `skill_update_status`.
4. Do not ship `sdd-tracking` or `skill_tracking`. This revision retires the 2026-09-26 names.
5. This skill does not answer “where are we” by reading the five process files. That read is `sdd-get-status`.

## Rationale
`sdd-update-status` names the action: update `status.md` after confirm. The 2026-09-26 id named the topic. The rule `realtime-status.mdc` stays the always-on rule. The skill stays the confirmed write. The two names are different kinds of artifact.

## Consequences
- Living specs, Features markdown, `constants.md`, and `specs/framework.seeds/skills/sdd-tracking/` still use the 2026-09-26 id. This record does not rename those files.
- Sprint 7 feature-01 installs the skill as `sdd-update-status`.
- A later install must not list `skills/sdd-tracking/SKILL.md`.
- [Skill-07](../product-backlog.md#pb-27) and [Agent-12](../product-backlog.md#pb-46) keep their PBI codes. Their skill id becomes `sdd-update-status` when those rows are updated.

## Date
2026-09-26, revised 2026-09-28
