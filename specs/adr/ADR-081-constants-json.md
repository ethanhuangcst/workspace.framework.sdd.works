# ADR-081: constants lookup is JSON

## Status
Accepted. Amended 2026-10-09 by [ADR-130](./ADR-130-simplified-installer-url-only-and-empty-cache.md) decision 9: install path is `{client_root}/templates/`, not `{client_root}/templates/framework.sdd.works/`.

## Context

[ADR-060](./ADR-060-constants-on-client-root.md) named the pack lookup `constants.md`. The file holds directory names, `instructions_url`, skill keys, and rule keys. The opening paragraph repeats the design. The tables are the lookup.

`.sdd-installed.json` is the same kind of record: keys and paths, with no prose.

## Decision

1. The lookup file is `constants.json`.
2. After install it lives at `{client_root}/templates/framework.sdd.works/constants.json`.
3. The authoring seed is `specs/framework/seeds/templates/framework.sdd.works/constants.json`, beside the locale folders.
4. The file stores `agents_dir`, `skills_dir`, `rules_dir`, `workflows_dir`, `templates_dir`, `instructions_url`, skill key to folder, and rule key to file. The author paragraph stays in the design.
5. Do not copy `constants.json` into the workspace, into `{workspace}/specs`, or into the artifacts root.
6. [ADR-060](./ADR-060-constants-on-client-root.md) decision 1 is superseded on 2026-10-03. The client-root home and the no-copy rule stay.

## Rationale

A key returns one value. JSON names that key. A Markdown table asks the reader to find the row.

## Consequences

- The authoring seed is `specs/framework/seeds/templates/framework.sdd.works/constants.json`.
- Readers open `constants.json`.

## Date
2026-10-03
