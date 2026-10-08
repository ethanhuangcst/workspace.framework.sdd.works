# ADR-068: Guide filename is scrum-in-sdd.md

## Status

Superseded for **AI template** filename and locale copies. [ADR-126](./ADR-126-ai-read-pack-templates-and-pack-scrum-in-sdd-filename.md) names the AI-read guide **`pack-scrum-in-sdd.md`** under `templates/EN/` only. **Human-read** portal files remain **`content/scrum-in-sdd/scrum-in-sdd.{locale}.md`**.

## Context

The framework guide is the names-and-meaning document. Its seed lived as `sdd-scrum-guide.md` under each locale folder (`EN`, `HanS`). Practices stay in `sdd-scrum-practices.md`. The guide title and role already read as Scrum-in-SDD; the filename did not.

Ethan’s onboard, process headers, artifacts maps, Features catalog copy, and the unbuilt guide tab all named the old file. No TypeScript reads the filename; Features markdown and the agent prompt do.

## Decision

1. The guide filename is `scrum-in-sdd.md` in every locale folder under `templates/{EN|HanS|HanT}/`.
2. Practices stay `sdd-scrum-practices.md`.
3. Living pointers use the new name. Dated change-log paragraphs and dated product-backlog history keep the name that was true on that date.
4. When a HanT guide is added ([i18n-01](../product-backlog.md#L297)), it is `scrum-in-sdd.md` in `templates/HanT/`.

## Rationale

One filename that matches the artifact’s common name reduces mismatch between the index label “Scrum-in-SDD guide” and the path agents and catalogs open.

## Consequences

- Sprint 3 feature-18 renames the EN and HanS seeds and retargets Ethan, practices, maps, and process headers.
- Sprint 3 feature-19 retargets Features catalog copy, instruction mocks, and the Web-portal-12 / feature-16 guide-tab path. It does not build the tab.
- The next pack update deletes the ledger entry for the old path and writes the new file.

## Date

2026-09-26
