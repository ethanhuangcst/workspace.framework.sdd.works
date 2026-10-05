# ADR-091: Retire realtime-status.mdc (Option C)

## Status
Accepted

## Context

The pack shipped `realtime-status.mdc` to update `status.md` after each task with draft, confirm, and write. The updated `dod.mdc` already lists `status.md` on PBI, SBI, OGT, and sprint close with the same confirm gate and a multi-file write order. Two always-on rules duplicated Done-adjacent behavior and confused agents. [ADR-065](./ADR-065-skill-update-status.md) and [ADR-076](./ADR-076-review-status-one-skill.md) keep read and compare on `skill_get_status` (`sdd-review-status`).

## Decision

1. Remove `realtime-status.mdc` from the pack. [constants.json](../framework/seeds/templates/constants.json) lists three harness rules: `dod.mdc`, `incremental-delivery.mdc`, and `friendly-language.mdc`.
2. **Option C:** Update `status.md` only when closing a PBI, SBI, OGT, or sprint under `dod.mdc`, or when the user explicitly asks for a status refresh. Do not require a status write after every internal task while an SBI stays WIP.
3. Section and column rules for `status.md` stay in `sdd-scrum-practices.md` `#statusmd`. `dod.mdc` points there when writing the file.
4. Retire [Rule-03](../product-backlog.md#pb-20) on the product backlog. Sprint 6 feature-39 closes **Done** when Option C is verified. Do not mark Rule-03 Done.

## Rationale

One owner for close and process writes keeps Done behavior in one place. Mid-SBI narrative can stay in chat; onboard still uses `sdd-review-status` when the audit verdict is Usable.

## Consequences

- Guides, framework design, tests, and admin portal AC name three rules.
- Operators remove stale `realtime-status.mdc` from `{client_root}/rules/` after pack update.
- Historical ADRs may still mention the retired rule name.

## Date
2026-10-05
