# ADR-113: Learn embed copy and fallback URL

## Status

Accepted

## Context

The Learn Scrum tab embeds the portfolio at `https://sdd.works/en/learn/` ([ADR-110](./ADR-110-embedded-external-page-tab.md), [ADR-112](./ADR-112-learn-embed-frame.md)). The panel shows an intro line, the iframe, and a new-tab link. Today the intro and the fallback both point at the embed URL.

Visitors who open the course site should land on `https://learn.sdd.works`, not the embed page. The intro should name the nine modules without referring to another tab.

Making the nine tiles 20% larger and aligning their left edge with the intro needs a grid-only page on sdd.works. The portal cannot change padding inside a cross-origin iframe without crop hacks that [ADR-112](./ADR-112-learn-embed-frame.md) rejects.

## Decision

1. **Intro** uses i18n key `admin.guide.learn_scrum_intro` with this meaning in English: complete these nine modules to learn Scrum in SDD. zh-Hans and zh-Hant catalogs carry the same meaning.
2. **Fallback link** is one control. Visible text is i18n key `admin.guide.learn_scrum_open_external`. `href` is always `https://learn.sdd.works`. It opens in a new tab with `rel="noopener noreferrer"`.
3. **Iframe `src`** stays the resolved embed URL from tab config (`https://sdd.works/en/learn-embedded/`). The fallback URL is not read from `urls` in `.instructions-tabs.json`.
4. Retire `admin.guide.learn_scrum_open_external_prefix` and `admin.guide.learn_scrum_open_external_link` after the single key ships.
5. **Grid size and tile alignment** are out of scope for framework.sdd.works until sdd.works publishes an embed view with no page chrome and tiles flush to the document edge. Track that work on sdd.works, not as a portal crop.

## Rationale

Two URLs match two jobs: embed the portfolio grid, open the full course site. One fallback sentence avoids an embed-failure tone when the frame is visible.

## Consequences

- [Web-portal-27](../product-backlog.md#L404) AC29 covers copy and fallback. AC28 still covers frame shape.
- Implementation adds a constant for the fallback URL (for example next to embed brand helpers). No change to embed host allowlist.
- Tests assert iframe `src` and fallback `href` differ.

## Date

2026-10-07
