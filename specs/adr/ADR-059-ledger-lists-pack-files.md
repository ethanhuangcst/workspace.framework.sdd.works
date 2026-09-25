# ADR-059: Install ledger lists pack files

## Status
Accepted

## Context
ADR-057 kept `files` grouped by skills, rules, agents, workflows, and templates, and said not to replace those groups with a flat list. The installer wrote folder names in those groups (`skills: ["tdd"]`). On update, a listed name was deleted as a directory, so a user file inside that folder (`skills/tdd/my-notes.md`) was removed with the pack skill.

Scenario 5 in [`mcp-design.md`](../mcp/mcp-design.md) requires the opposite: replace `skills/tdd/SKILL.md`, delete a pack file the new pack no longer ships (`old-step.md`), and leave `my-notes.md` because it was never recorded.

## Decision
1. Each entry in `files.skills`, `files.rules`, `files.agents`, `files.workflows`, and `files.templates` is a **file path relative to `{client_root}`**, for example `skills/tdd/SKILL.md` or `rules/dod.mdc`. Groups stay. Do not record a directory name (`tdd`, `tdd/`).
2. Update deletes only those recorded files that the new pack does not ship. It does not delete the parent directory. Files in that directory that are not in the ledger stay.
3. After a successful copy, the new ledger lists only the files this install wrote.
4. An older ledger that lists a directory name is not a delete of that directory. Copy the new pack files into place, leave other files in the directory, and rewrite the ledger with file paths.
5. Idempotency (ADR-052, ADR-057) checks that each recorded **file** exists. A missing recorded file is not already up to date.

## Rationale
The merge ledger can only protect a user file by not listing it. A folder name lists every file inside the folder.

## Consequences
- Amends ADR-057 decision 3: groups remain; entries are file paths, not folder names.
- [`mcp-design.md`](../mcp/mcp-design.md) write policy and scenario 2 expected follow this decision.
- Implementation is not in this ADR. Sprint 2 splits the installer so file-level delete is its own backlog item.

## Date
2026-09-25
