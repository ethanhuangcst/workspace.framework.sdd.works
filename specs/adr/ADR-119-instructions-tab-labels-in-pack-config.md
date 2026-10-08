# ADR-119: Instructions tab labels in pack config

## Status

Accepted

## Context

[Spec-seeds-16](../product-backlog.md#pb-110) and [Web-portal-25](../product-backlog.md#pb-112) (feature-60) made tab order, types, markdown paths, and embed URLs configurable from `content/.instructions-tabs.json`. Tab **visible text** still used `labelKey` pointers into the portal `messages/*.json` catalogs. Operators must edit two places to rename a tab or add a tab label, which breaks the “sync pack only” story for tab chrome. [WA-16](../issues-log.md) tracks the gap.

Content tab bodies and embed URLs already use per-locale maps in the same file (`paths`, `urls`). Tab titles should follow the same pattern.

## Decision

1. **Schema:** Every tab row (`code`, `content`, `embedded_external_page`) carries **`labels`**: a locale map with required **`en`** and optional **`zh-Hans`** and **`zh-Hant`**. Missing zh locales fall back to `en` at resolve time, same as content paths.
2. **Remove `labelKey`** from the instructions tabs schema. Validators reject unknown fields or explicit `labelKey` on tab rows (no dual source).
3. **Resolver:** `resolveInstructionsTabs(locale)` sets **`label: string`** on each resolved tab from `labels[locale]` → `labels.en`.
4. **API:** `GET /api/sdd/instructions-tabs` includes **`label`** on each tab in the response. Do not expose `labelKey`.
5. **UI:** `InstructionsPage` renders **`tab.label`** for tab buttons. Do not call `t(locale, labelKey)` for instructions tabs.
6. **i18n boundary:** Tab bar labels are **pack-authored plain text**, like markdown titles inside content tabs. Portal `messages/*.json` keeps guide chrome that is not in the pack (secret form, embed loading, setup copy, etc.). Remove obsolete `admin.guide.tab_*` keys after migration.
7. **Safety:** Labels are plain text only (no HTML). Validator rejects empty `labels.en` and unsafe control characters if needed.

## Rationale

One operator file matches ADR-071 path maps and ADR-110 embed URLs. Sync updates tab names without a portal message edit or redeploy for label-only changes.

## Consequences

- **Supersedes** [ADR-110](./ADR-110-embedded-external-page-tab.md) item 2 on `labelKey` and portal catalogs for tab names.
- **Amends** AC22, AC24, and feature-58 validator contract; new **AC33** and [Web-portal-33](../product-backlog.md#pb-130).
- Migrate pack `content/.instructions-tabs.json`, bundled `src/content/.instructions-tabs.json`, validator, resolver, API types, `InstructionsPage`, tests, mockup tab `data-i18n` if any, and both `.admin-note.md` copies.
- Invalid cache config that still uses `labelKey` fails validation → bundled fallback only if bundled file is migrated; ship pack and bundled JSON in the same release.

## Example row

```json
{
  "type": "embedded_external_page",
  "id": "learn-scrum-in-sdd",
  "labels": {
    "en": "Learn Scrum in SDD",
    "zh-Hans": "学习 Scrum in SDD",
    "zh-Hant": "學習 Scrum in SDD"
  },
  "queryParam": "learn-scrum-in-sdd",
  "panelTestId": "panel-learn-scrum",
  "urls": {
    "en": "https://sdd.works/en/learn-embedded/",
    "zh-Hans": "https://sdd.works/en/learn-embedded/",
    "zh-Hant": "https://sdd.works/en/learn-embedded/"
  }
}
```

## Date

2026-10-08
