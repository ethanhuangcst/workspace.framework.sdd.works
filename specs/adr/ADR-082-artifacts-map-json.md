# ADR-082: artifacts-map is JSON

## Status
Accepted

## Context

`artifacts-map.md` is the path configuration for a project. It is not a Framework process Markdown artifact and not a copied template seed. It is an SDD Core artifact with the installed guide **`pack-scrum-in-sdd.md`**, **`sdd-scrum-practices.md`**, and the map file itself ([ADR-126](./ADR-126-ai-read-pack-templates-and-pack-scrum-in-sdd-filename.md)). Human portal guides under `content/scrum-in-sdd/` are not core artifacts on the project. After the simplify, the file stores `artifacts_root`, `locale`, and workspace-relative paths. Settings and paths share one bullet list, so a reader must skip the settings lines.

`.sdd-installed.json` stores the same kind of fact under keys.

## Decision

1. The project path file is `{workspace}/artifacts-map.json`.
2. The file stores `artifacts_root`, `locale`, a `files` list, and a `modules` list. A module has `folder`, `files`, and `stem` only when the stem differs from the folder.
3. `sdd-update-project` writes that JSON from the practices templates after the user confirms. The chat summary stays plain text.
4. [ADR-080](./ADR-080-no-artifacts-map-seed.md) still holds: there is no template seed, and the example is not a file a new project copies. The example in `sdd-scrum-practices.md` becomes JSON in the on-going task.

## Rationale

The remaining record is settings and paths. JSON keeps a settings line from being opened as a path.

## Consequences

- The project path file is `{workspace}/artifacts-map.json`.
- The practices example, `sdd-audit-artifacts`, `sdd-update-project`, and the audit fixtures use that file.
- Sprint 4 feature-03 is this JSON file. It is not Retired. There is still no template seed.

## Date
2026-10-03
