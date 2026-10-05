# ADR-100: optional module folder and path-first resolution

## Status

Accepted

## Context

[ADR-082](./ADR-082-artifacts-map-json.md) stores engineering specs under `modules[]` with `folder`, optional `stem`, and a `files` list. Practices and `sdd-update-project` treat every module as `{artifacts_root}/{folder}/{stem}-design.md` (and stories, tests). Some projects have one engineering surface and no subfolder: files live directly under `{artifacts_root}` as `{stem}-*.md` or, for a single module only, as `design.md`, `stories.md`, and `tests.md`.

`sdd-audit-artifacts` already opens only paths listed in `files` and in each module `files` list. It does not require `folder`. Other skills and the confirm summary still reconstruct paths from `folder` and `stem`, which blocks flat layouts in docs and in update-project.

## Decision

1. **`modules[].files` is the path contract.** Skills resolve design, stories, and tests from those workspace-relative strings. They do not build `{artifacts_root}/{folder}/{stem}-*.md` when the map already lists the path.
2. **`folder` is optional.** When omitted, module files sit directly under `{artifacts_root}`. `sdd-update-project` does not create a module directory unless the user chose a subfolder and asked to create it.
3. **`stem` is optional.** When present, it labels the module and prefixes filenames. When absent, agents pick the matching entry in `files` by suffix (`*-stories.md`, `*-design.md`, `*-tests.md`) or by exact name (`stories.md`, `design.md`, `tests.md`).
4. **Three valid layouts** when `files` matches:
   - **Foldered:** `specs/web-app/app-stories.md` with `folder` `web-app` and optional `stem` `app`.
   - **Flat + stem:** `specs/app-stories.md` with no `folder` key (default when the user skips a subfolder).
   - **Singleton:** `specs/design.md`, `specs/stories.md`, `specs/tests.md` with no `folder` only when `modules` has exactly one entry.
5. A second module must use foldered or flat + stem. Unqualified `stories.md` is not shared across two module entries.
6. [ADR-082](./ADR-082-artifacts-map-json.md) remains the JSON format decision. This ADR clarifies module object shape only.

## Rationale

Explicit paths in JSON already work for audit. Documenting optional `folder` and path-first resolution aligns update-project and ATDD with audit without a second map format.

## Consequences

- Practices, `scrum-in-sdd.md`, and framework design document the three layouts and path-first rules.
- `sdd-update-project`, `sdd-atdd`, and `sdd-update-specs` read `modules[].files` first.
- Framework stories and tests add flat-module coverage.
- Existing foldered maps (including this repo) need no migration.

## Date

2026-10-05
