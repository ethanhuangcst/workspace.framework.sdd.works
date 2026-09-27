# ADR-071: Portal markdown lives under content/

## Status
Accepted

## Context
The instructions page does not read GitHub. A sync job copies the Settings pack onto the server at `.data/sdd-packages/<commit>/unpacked`. The Features reader then opens `features.{locale}.md` at the root of that unpack, and falls back to `src/content/features/` when that unpack has no English file.

Those three files are portal copy. They sit beside agents, skills, rules, and templates at the pack root. The Scrum in SDD tab needs the same read order for its own files. Putting both catalogs at the root mixes portal pages with the installable pack.

## Decision
1. The sync job still materializes the whole pack tree into the local unpack. It does not fetch only the portal folders. Install continues to copy the allow-list from that unpack.
2. The Features reader looks in `<unpacked>/content/features/` for `features.{locale}.md`. It does not look at the unpack root.
3. The Scrum in SDD reader looks in `<unpacked>/content/scrum-in-sdd/` for `scrum-in-sdd.{locale}.md`.
4. Fallback stays the in-app seeds: `src/content/features/` and `src/content/scrum-in-sdd/`. A missing Chinese file falls back to English inside the source that was chosen. The page still does not call GitHub.
5. Install does not copy either folder onto `{client_root}`.

## Rationale
One local unpack serves install and the portal. The portal only needs two folders inside it. Keeping those folders under `content/` matches the in-app seed layout and leaves the pack root for installable artifacts.

## Consequences
- [Web-portal-07](../product-backlog.md#pb-73) pack path moves from the repo root to `content/features/`. The shipped reader still uses the root until this ADR is implemented.
- [Web-portal-12](../product-backlog.md#pb-81) reads `content/scrum-in-sdd/` on the same cache-then-package order.
- [Spec-seeds-12](../product-backlog.md#pb-82) finalizes the three Features files under `content/features/` in the pack repo, not at the root.
- An operator who already synced `features.*.md` at the pack root must move those files and sync again before the new reader serves them from cache.

## Date
2026-09-27
