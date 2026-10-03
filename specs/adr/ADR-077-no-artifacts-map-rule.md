# ADR-077: No `artifacts-map` rule

## Status
Accepted

## Context

[ADR-072](./ADR-072-rule-artifacts-map.md) added `artifacts-map.mdc` so an ordinary turn would update `{workspace}/artifacts-map.md` when a project artifact was created, renamed, or deleted.

A rule is text loaded while a turn is already running. It does not see a delete, rename, or move the user makes in the file tree. After `product-backlog.md` is renamed to `pb.md`, the map stays on `specs/product-backlog.md`. The next audit returns Index broken. No notice is sent when the file changes.

That gap is the job the rule was asked to cover. The rule does not cover it.

## Decision

1. The pack does not ship `artifacts-map.mdc`.
2. There is no constants key `artifacts-map`.
3. `{workspace}/artifacts-map.md` stays the index. `sdd-audit-artifacts` reports a stored path that fails to open. The audit does not repair the map.
4. A turn updates a stored path when the user asks for that update.
5. [Rule-04](../product-backlog.md#pb-85) and Sprint 4 feature-22 are retired. They are not Done.

## Rationale

A standing rule that cannot see the file change does not keep the map current. The audit remains the check. A notice that a framework artifact was deleted, renamed, or moved is a separate decision.

## Consequences

- [ADR-072](./ADR-072-rule-artifacts-map.md) is superseded on 2026-10-03. Its decision text stays as the 2026-09-27 record.
- The seed `specs/framework/seeds/rules/artifacts-map.mdc` is removed.
- The EN guide, the HanS guide, and the portal catalogs drop the rule.
- Feature-03, the `artifacts-map.md` seed, stays WIP. This decision does not remove the map file.

## Date
2026-10-03
