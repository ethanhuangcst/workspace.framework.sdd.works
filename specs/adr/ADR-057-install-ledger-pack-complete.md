# ADR-057: Completeness flag on the install ledger

## Status
Accepted

## Context
`sdd_install_framework` and `sdd_update_framework` already write `{client_root}/.sdd-installed.json`. That file is the merge ledger: `package_version`, `package_commit`, `installed_at`, and the package-owned paths grouped under `files` (skills, rules, agents, workflows, templates). Install and update delete only those paths, then write the new tree. `already_up_to_date` is true only when the version, the commit, and those files on disk all match (ADR-052).

A later design added a second file, `{client_root}/framework.sdd.works.json`, with the same version, commit, time, and file list, plus `pack_complete`. Ethan’s start gate was specified to read only that second file. The two files can diverge. On HTTP the model must write the ledger after extract (ADR-054). A second last-write is the same failure on a second path.

`package_version` is the Git ref (`main`, a tag). It is present after the first successful install, including when a later file is missing. `package_commit` is the installer’s identity. Clearing either field to mean “stop” would make the next install treat the ledger as missing or pre-ADR-052. A missing ledger must not be used to delete files.

Ethan still needs a bit he can set false when a later job cannot read a skill, rule, or seed. Only install or update may set that bit true.

## Decision
1. `{client_root}/.sdd-installed.json` is the only install record. Do not write `framework.sdd.works.json`.
2. Add `pack_complete` to that ledger. The installer sets it `true` in the same write as `package_version`, `package_commit`, `installed_at`, and `files`, and only after the copy succeeds. A failed copy does not set it `true`.
3. Keep the existing `files` groups. Do not replace them with a flat list. **Amended by [ADR-059](./ADR-059-ledger-lists-pack-files.md):** each entry is a file path relative to `{client_root}`, not a folder name.
4. Idempotency ignores `pack_complete`. It still requires matching `package_version`, matching `package_commit`, the listed files on disk, and `force` unset (ADR-052).
5. On start, Ethan reads only `{client_root}/.sdd-installed.json`. Missing file, or `pack_complete` not `true`, is a fatal stop: instructions URL, then stop. He does not scan the pack to decide completeness.
6. When a later job cannot read a required skill, rule, or seed, Ethan sets `pack_complete` to `false` and stops. He does not change `package_version` or `package_commit`. He does not set the flag back to `true`. The next install or update sets it `true` only when that copy succeeds.
7. HTTP still does not write the caller disk. The tool result names this ledger path. The model writes the file last, after extract and verify, with `pack_complete: true`. Do not ship a finished ledger inside the tarball.
8. `specs/framework.seeds/framework.sdd.works.json` is not a pack receipt and must not be installed as proof that the pack is complete.

## Rationale
One file cannot drift from a second copy of the same version and file list. The version and commit stay the installer’s identity. The flag is the only field Ethan may change, so a stop does not destroy merge or idempotency.

## Consequences
- Implementation is not done in this ADR. The next change updates the installer, Ethan’s start rule, and the specs that still name `framework.sdd.works.json`: [`mcp-design.md`](../mcp/mcp-design.md), [`mcp-stories.md`](../mcp/mcp-stories.md), [`mcp-test.md`](../mcp/mcp-test.md), [`product-backlog.md`](../product-backlog.md) MCP-01 and Agent-07, [`sprint-backlog.md`](../sprint-backlog.md) Sprint 2 feature-01 and feature-03, and R1.
- Stdio writes the flag in `writeManifest`. HTTP returns the same object for the model to write last.
- A ledger from before this ADR has no `pack_complete`. Treat that as not true, so Ethan stops until the next successful install or update writes the flag.
- Agent design §2.4 and framework design “Install ledger” match this decision.

## Date
2026-09-25
