# ADR-094: sdd- prefix for framework-bound pack rules

## Status
Accepted

## Context

Pack rules install at `{client_root}/rules/`. [ADR-072](./ADR-072-rule-artifacts-map.md) recorded harness rules without an `sdd-` prefix. Several rules read or write **framework.sdd.works** process artifacts (`artifacts-map.json`, the five process files, practices templates). Portable rules such as `friendly-language.mdc` apply to all chat and Markdown without that dependency. [ADR-092](./ADR-092-pack-authoring-skill-sdd-prefix.md) governs skill folder names only.

## Decision

1. A pack rule file name starts with `sdd-` when the rule depends on framework process semantics: `{workspace}/artifacts-map.json`, the five process files, PBI/SBI/OGT/RID/sprint behavior tied to those files, or `{client_root}/templates/framework.sdd.works/sdd-scrum-practices.md` for write shape.
2. Portable harness rules that do not read or write those artifacts keep an unprefixed name. Today: `friendly-language.mdc`.
3. [`constants.json`](../framework/seeds/templates/constants.json) keeps stable keys (`dod`, `incremental-delivery`, `realtime-status`, `friendly-language`). Values for the three framework-bound rules are `sdd-dod.mdc`, `sdd-incremental-delivery.mdc`, and `sdd-realtime-status.mdc` ([ADR-096](./ADR-096-sdd-realtime-status-rule-name.md) renames the third rule from `sdd-keep-update.mdc`; key `keep-update` is removed).
4. [CE-RULE-05](../framework/framework-tests.md) expects the three `sdd-` rule files plus `friendly-language.mdc`. Only `friendly-language.mdc` has no `sdd-` prefix.

## Rationale

The prefix marks rules that apply only when the project uses the SDD pack layout. It separates them from portable copy rules and matches the `sdd-` skill namespace for framework jobs.

## Consequences

- Seed paths: `specs/framework/seeds/rules/sdd-dod.mdc`, `sdd-incremental-delivery.mdc`, `sdd-realtime-status.mdc`.
- After pack update, operators remove stale copies (`dod.mdc`, `incremental-delivery.mdc`, `keep-update.mdc`, `sdd-keep-update.mdc`, unprefixed `realtime-status.mdc`) from `{client_root}/rules/` if present.
- [ADR-093](./ADR-093-keep-update-wip-rule.md) WIP charter unchanged; filename and key per [ADR-096](./ADR-096-sdd-realtime-status-rule-name.md).

## Date
2026-10-05
