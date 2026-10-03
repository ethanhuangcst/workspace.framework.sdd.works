# ADR-078: Start and update are one skill

## Status
Accepted. Decision 2 is superseded by [ADR-079](./ADR-079-one-job-update-project.md) on 2026-10-03. Decisions 1, 3, 4, and 5 remain.

## Context

[ADR-069](./ADR-069-skill-kickoff-project.md) named the start skill `sdd-kickoff-project` with key `skill_start_project`. Update stayed a second skill, `sdd-update-project`, with key `skill_update_project`.

Both skills write `{workspace}/artifacts-map.md` and copy a seed only where the target file is missing. Start runs after an `Uninitialized` audit. Update runs after `Index broken`, an empty `locale`, or a request to change project settings. Neither folder exists in the seed tree yet.

## Decision

1. The skill folder is `sdd-update-project`. The constants key is `skill_update_project`. The pack ships no `sdd-kickoff-project` folder and no `skill_start_project` key.
2. Practices job 2, Start a new project, and practices job 3, Update project settings, both use that skill. The job titles stay.
3. After the user confirms, `Uninitialized` and `Index broken` both follow `sdd-update-project`.
4. The skill asks for the product name, `artifacts_root`, locale, and module folders when the map is missing. It writes the map. It copies a seed only where the target file is missing. It does not overwrite a process file that already has content. It repairs a stored path after `Index broken`. It updates locale and other map settings when a map is already in use.
5. [Skill-03](../product-backlog.md#pb-23) is retired. Sprint 5 feature-01 and feature-20 are retired. They are not Done. Sprint 5 feature-25 holds the skill file.

## Rationale

The two skills are the same write with two entry points. One folder keeps the confirm-before-write rule in one place.

## Consequences

- [ADR-069](./ADR-069-skill-kickoff-project.md) is superseded on 2026-10-03. Its decision text stays as the 2026-09-27 record.
- [Agent-08](../product-backlog.md#pb-42) and [Agent-09](../product-backlog.md#pb-43) both use `skill_update_project`.
- Sprint 5 feature-02 and feature-26 stay ToDo. They run the one skill.
- Dated history in `changes-log.md` stays as written.

## Date
2026-10-03
