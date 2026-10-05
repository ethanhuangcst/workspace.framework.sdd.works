# ADR-072: Rule `artifacts-map`

## Status
Superseded by [ADR-077](./ADR-077-no-artifacts-map-rule.md) on 2026-10-03. Do not ship `artifacts-map.mdc`. Rule filename prefix policy is superseded by [ADR-094](./ADR-094-sdd-prefix-framework-rules.md). The decision text below remains the 2026-09-27 record.

## Context
Harness rules in the guide had no `sdd-` prefix in 2026-09-27: `dod.mdc`, `incremental-delivery.mdc`, `realtime-status.mdc`.

`sdd-audit-artifacts` is a skill. It runs when someone asks for an audit, lists gaps, and waits for an instruction. Between audits, an agent can add or move a project file and leave `{workspace}/artifacts-map.md` unchanged.

The EN seed `templates/EN/artifacts-map.md` is a starter. It is not the list a live project must match.

## Decision
1. The rule name is `artifacts-map`. The file is `artifacts-map.mdc`. No `sdd-` prefix.
2. When a project artifact is created, renamed, or deleted, the same change updates `{workspace}/artifacts-map.md`.
3. The rule does not copy `scrum-in-sdd.md` or `sdd-scrum-practices.md` into the project. It does not move the five process files into a module folder.
4. The rule does not list the project files and does not fix gaps by itself. `sdd-audit-artifacts` stays the audit skill.
5. The English guide lists `artifacts-map.mdc` with the other three rules. The seed file and the remaining spec lists are Sprint 3 feature-22.

## Rationale
The rule is loaded on ordinary agent turns. The skill is not. Naming the rule `artifacts-map` matches the other rule filenames and names the index the agent must keep current.

## Consequences
- Rule-04 is Sprint 3. Sprint 11 still owns the first three rule files.
- The seed path is `specs/framework/seeds/rules/artifacts-map.mdc`.
- Constants, the HanS and HanT guides, and the Features catalogs are updated in that sprint item, not in this decision.

## Date
2026-09-27
