# ADR-093: sdd-keep-update.mdc for WIP process sync

## Status
Superseded for filename and constants key by [ADR-096](./ADR-096-sdd-realtime-status-rule-name.md) (2026-10-05). WIP charter unchanged; pack file is `sdd-realtime-status.mdc`, key `realtime-status`.

## Status (historical)
Accepted

## Context

[ADR-091](./ADR-091-retire-realtime-status-rule.md) removed `realtime-status.mdc` because it duplicated DoD close writes for `status.md`. Option C left mid-SBI drift: the five process files could fall behind open work. [`sdd-review-status`](../framework/seeds/skills/sdd-review-status/SKILL.md) reconciles on user request but does not require WIP checkpoints during implementation.

## Decision

1. Ship pack rule `sdd-keep-update.mdc` with constants key `keep-update`. It applies on WIP checkpoints while a PBI, SBI, or OGT is not Done.
2. The rule drafts tier-1 and tier-2 updates, waits for user confirm, then writes. Tier 1 is `status.md`. Tier 2 is open defects on `issues-log.md`, WIP rows and Open RIDs on `sprint-backlog.md`, and PBI WIP on `product-backlog.md` only after the user confirmed that PBI is in progress.
3. The rule does not mark Done, close a sprint, close an RID, or write routine `changes-log.md` entries. Close stays on [`sdd-dod.mdc`](../framework/seeds/rules/sdd-dod.mdc).
4. Reopen [Rule-03](../product-backlog.md#L206) as the keep-update rule PBI. Do not restore `realtime-status.mdc`.

## Relationship to ADR-091

ADR-091 remains valid for retiring close-duplicating `realtime-status.mdc`. ADR-093 adds a replacement with a new name and a WIP-only charter.

## Consequences

- The pack lists four harness rules: `sdd-dod.mdc`, `sdd-incremental-delivery.mdc`, `sdd-keep-update.mdc`, and `friendly-language.mdc`.
- Practices `#statusmd` names WIP vs close owners.
- Operators install `sdd-keep-update.mdc` under `{client_root}/rules/` on pack update.

## Date
2026-10-05
