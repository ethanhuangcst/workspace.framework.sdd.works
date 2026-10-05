# ADR-096: Pack rule name sdd-realtime-status.mdc

## Status
Accepted

## Context

[ADR-093](./ADR-093-keep-update-wip-rule.md) shipped `sdd-keep-update.mdc` for WIP process sync after [ADR-091](./ADR-091-retire-realtime-status-rule.md) retired unprefixed `realtime-status.mdc`. The WIP charter fits Rule-03, but the `keep-update` label diverges from the historical realtime-status name operators still use in conversation.

## Decision

1. Pack rule file: `sdd-realtime-status.mdc`. Constants key: `realtime-status`. Remove key `keep-update`.
2. Rule behavior is unchanged from ADR-093: WIP checkpoints only; tier-1 and tier-2 draft, confirm, write; no Done, sprint close, or RID close. Close stays on [`sdd-dod.mdc`](../framework/seeds/rules/sdd-dod.mdc).
3. On pack update, remove stale `{client_root}/rules/sdd-keep-update.mdc`, `keep-update.mdc`, and unprefixed `realtime-status.mdc` when the ledger syncs. Do not modify Cursor's `skills-cursor` tree.
4. Unprefixed `realtime-status.mdc` from the pre-ADR-091 pack is **not** restored. ADR-091 Option C remains in force for close-duplicating behavior.

## Relationship to ADR-091 and ADR-093

- ADR-091: retired close-duplicating `realtime-status.mdc`.
- ADR-093: WIP-only replacement; **superseded for filename and constants key only** by this ADR.
- ADR-096: same charter, name `sdd-realtime-status.mdc` and key `realtime-status`.

## Consequences

- Four harness rules: `sdd-dod.mdc`, `sdd-incremental-delivery.mdc`, `sdd-realtime-status.mdc`, `friendly-language.mdc`.
- Seed path: `specs/framework/seeds/rules/sdd-realtime-status.mdc`.
- [CE-RULE-05](../framework/framework-tests.md) lists the four names above.

## Date
2026-10-05
