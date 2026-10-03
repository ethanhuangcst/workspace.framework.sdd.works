# ADR-080: No artifacts-map template seed

## Status
Accepted. The filename `artifacts-map.md` is superseded by [ADR-082](./ADR-082-artifacts-map-json.md) on 2026-10-03. There is still no template seed.

## Context

`specs/framework/seeds/templates/EN/artifacts-map.md` was a filled Pokymon Card Collection map sitting in the template folder. A new project could copy that file and treat Pokymon paths as its own map. The templates for the map already live in the artifacts-map section of `sdd-scrum-practices.md`.

## Decision

1. The pack has no `artifacts-map.md` template seed. Do not add a HanS or HanT copy of that seed.
2. The Pokymon Card Collection map is the example in the artifacts-map section of `sdd-scrum-practices.md`. It is not a file a new project copies.
3. `sdd-update-project` writes `{workspace}/artifacts-map.md` from the Header, File, and Module templates in that section, after the user confirms.
4. [Spec-seeds-04](../product-backlog.md#pb-35) and Sprint 4 feature-03 are retired. They are not Done. [i18n-02](../product-backlog.md#pb-68) does not translate an artifacts-map seed.

## Rationale

One filled map in the template folder looked like a starter. The practices templates are the starter. The example stays next to those templates.

## Consequences

- Audit fixtures under `specs/framework/fixtures/` stay. They are test maps, not the template seed.
- This repo's `specs/artifacts-map.md` stays. It is the live map for this repo when that file is present.

## Date
2026-10-03
