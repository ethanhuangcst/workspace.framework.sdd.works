# ADR-095: ADR and knowledge instance shapes live in sdd-scrum-practices

## Status

Accepted

## Context

Sprint 6 added pack locale files `adr.md` and `knowledge.md` under `templates/framework.sdd.works/{locale}/` so `sdd-retrospective` could read instance layout without embedding long templates in the skill. Other artifact shapes already live in `sdd-scrum-practices.md` (for example sprint Retrospective). Separate pack-only files duplicated that pattern, added install surface, and invited lookups in `constants.json` or `artifacts-map.json` that belong to other concerns ([ADR-081](./ADR-081-constants-json.md), [ADR-090](./ADR-090-adr-knowledge-map-roots.md)).

## Decision

1. Remove pack locale seed files `adr.md` and `knowledge.md`. MCP install no longer ships them.
2. Canonical shape for new ADR and knowledge **instances** is in `{client_root}/templates/framework.sdd.works/{locale}/sdd-scrum-practices.md` under **ADR instance shape** and **Knowledge instance shape** (`#adr-instance-shape`, `#knowledge-instance-shape`).
3. `sdd-retrospective` reads those practice sections for layout. It does not open separate `adr.md` or `knowledge.md` files.
4. [ADR-090](./ADR-090-adr-knowledge-map-roots.md) is unchanged: optional map keys `adr` and `knowledge` name workspace instance roots. Instance shapes are not copied into `{workspace}` and are not listed in `artifacts-map.json` `files`.
5. HanS translated shape sections defer to i18n / HanS practices work. Until then, HanS-locale projects use the EN practices sections for shape when HanS sections are absent.

## Rationale

One practices file already holds process and engineering writing rules. Keeping ADR and knowledge layout there matches Retrospective and header templates, reduces pack file count, and keeps `constants.json` and the map limited to directory names, skills, rules, and workspace paths.

## Consequences

- Authoring seeds: delete `specs/framework/seeds/templates/EN/adr.md` and `knowledge.md`; add shape subsections to EN `sdd-scrum-practices.md`.
- Update `sdd-retrospective`, framework design, framework tests (CE-SKILL-10), and framework stories.
- Client template trees drop the two files on the next `sdd_update_framework`. Stale copies on `{client_root}` are harmless until update.
- HanS `sdd-scrum-practices.md` gains matching sections in a later i18n story.

## Date

2026-10-05
