# ADR-110: Instructions tab type embedded_external_page

## Status

Accepted

## Context

Instructions tabs are `code` (a React panel such as Setup) or `content` (pack markdown). [Web-portal-27](../product-backlog.md#L404) needs a tab that embeds a page hosted elsewhere. The first page is the WordPress learn hub at [https://sdd.works/en/learn/](https://sdd.works/en/learn/). The tab name must use i18n keys. The embed URL must live in `content/.instructions-tabs.json` so an operator can change it without a new React panel.

A `code` tab cannot carry a URL. Hard-coding the URL in the app hides it from the pack file.

## Decision

1. The type string is `embedded_external_page`.
2. The row keeps `id`, `labelKey`, `queryParam`, and `panelTestId`. `labelKey` is the tab name. Catalog strings stay in `messages/en.json`, `messages/zh-Hans.json`, and `messages/zh-Hant.json`.
3. The row has `urls`. Keys are `en`, `zh-Hans`, and `zh-Hant`. `urls.en` is required. A missing locale uses `urls.en`.
4. Each URL is `https` only, has no userinfo, and has a host on the app allowlist. The first allowlist entry is `sdd.works` (and `www.sdd.works`).
5. The portal renders every row of this type with one iframe panel and an open-in-new-tab link to the same URL. The iframe is untrusted content.
6. `code` stays for built-in panels. `content` stays for pack markdown. `learn-scrum-in-sdd` is this type, not `code`.
7. Until separate locale pages exist, every `urls` value for Learn Scrum in SDD is `https://sdd.works/en/learn/`.

## Rationale

One generic panel covers later embeds. Per-locale URLs match the content-tab pattern. Requiring `urls.en` keeps a fallback. The host allowlist stops the pack file from framing an arbitrary site.

## Consequences

- [Web-portal-27](../product-backlog.md#L404) and Sprint 8 feature-70 follow this ADR.
- A blank frame is a host policy on sdd.works (`frame-ancestors`), not a portal bug. The fallback link remains.
- A reverse proxy is out of scope.

## Date

2026-10-07
