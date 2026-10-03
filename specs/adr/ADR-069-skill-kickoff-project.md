# ADR-069: Start-project skill is `sdd-kickoff-project`

## Status
Superseded by [ADR-078](./ADR-078-update-project-one-skill.md) on 2026-10-03. Do not ship `sdd-kickoff-project` or `skill_start_project`. The decision text below remains the 2026-09-27 record.

## Context
Practices job 2 is “Start a new project”. The pack named that job’s skill folder `sdd-new-project` with key `skill_start_project`. The folder does not exist yet. Sprint 3 feature-01 writes the skill.

`new-project` reads like a product verb. The job kicks off an SDD-Scrum project under the agent tools. The skill id should say that without renaming the practices heading or the constants key.

Ethan’s prompt previously said there is no `kickoff-project` skill, meaning do not add a **second** skill for the framework check. That sentence must not conflict with the folder name.

## Decision
1. The skill folder is `sdd-kickoff-project`. The constants key stays `skill_start_project`.
2. Practices job 2 stays titled “Start a new project”. Ethan’s job index keeps that title and points it at `skill_start_project`.
3. Do not ship `sdd-new-project`. Feature-01 writes `sdd-kickoff-project`.
4. Living specs, Features markdown, mocks, and locale keys that name the skill use `sdd-kickoff-project`. Dated history and `samectx-notes/` stay as written.
5. Ethan and agent-design state that job 2 uses only `sdd-kickoff-project`. Do not add a second skill for starting a project.

## Rationale
The skill is not built, so renaming the id now does not move an installed folder or a ledger entry. `kickoff-project` names the start of an SDD project without changing the practices job title or the key ethan matches.

## Consequences
- [Skill-03](../product-backlog.md#pb-23) and [Agent-08](../product-backlog.md#pb-42) use the new id. Sprint 3 feature-01 ships `sdd-kickoff-project`.
- Sprint 3 feature-20 is the spec rename. It does not write `SKILL.md`.
- A later install must not list `skills/sdd-new-project/SKILL.md`.

## Date
2026-09-27
