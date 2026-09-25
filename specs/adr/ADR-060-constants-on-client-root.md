# ADR-060: constants.md on the client root

## Status
Accepted

## Context
The pack needs one lookup file for path names, the instructions URL, skill keys, and rule keys. Ethan reads it after `{client_root}/.sdd-installed.json` has `pack_complete: true`, and on a failed start he reads `instructions_url` from it when the file can be read.

ADR-056 kept that lookup on the user-root templates tree and said not to copy it into the workspace or into `specs/`. The file was named `project-constants.md`. The authoring seed lived beside the locale folders under `templates/`. Jobs that copy locale seeds into the artifacts root must not treat this file the same way.

The product needs a shorter name and a durable rule that the live copy stays on the client root only.

## Decision
1. The lookup file is named **`constants.md`**.
2. After install it lives at `{client_root}/templates/framework.sdd.works/constants.md`. On Cursor, `client_root` is `~/.cursor`.
3. The authoring seed in this workspace is `specs/framework.seeds/templates/constants.md`. It sits beside `templates/EN/` and `templates/HanS/`, not inside a locale folder.
4. Do not copy `constants.md` into the workspace, into `{workspace}/specs`, or into the artifacts root. Locale seeds still copy into that root.
5. ADR-056 decisions 1–5 stay. ADR-056 decision 6’s filename `project-constants.md` is superseded by this ADR. The home (user-root templates tree) and the no-copy rule stay.

## Rationale
One pack on the user root already means ethan reads harness lookup from `client_root`. A second copy under `specs/` would drift from the installed pack and invite prompts to hard-code folder names. Renaming to `constants.md` keeps the same home and removes the “project” prefix that suggested a workspace file.

## Consequences
- Ethan, agent specs, MCP ledger examples, and Spec-seeds-01 name `constants.md`.
- Writing rules for the file live in [`sdd-scrum-practices.md`](../framework.seeds/templates/EN/sdd-scrum-practices.md) under Templates.
- Path and no-copy summary live in [`framework-design.md`](../framework.seeds/templates/EN/framework-design.md).

## Date
2026-09-25
