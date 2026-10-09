# ADR-127: Public hostnames sdd.works and learn.sdd.works

## Status

Accepted

## Context

**Plain terms:** **`sdd.works`** becomes the public home for the guide and install; **`learn.sdd.works`** hosts the WordPress course shown in the Learn tab; **`framework.sdd.works`** redirects so old links keep working ([feature-72](../sprint-backlog.md#sprint-9)). Operator guide to visitor and admin URLs: [Web-portal-20](../product-backlog.md#pb-106) (**feature-84**); [Web-portal-22](../product-backlog.md#pb-108) **Retired** (merged into Web-portal-20).

Before this change:

- The Next.js portal runs at **`framework.sdd.works`**.
- The WordPress learn course and portfolio grid live on **`sdd.works`** (including **`/en/learn-embedded/`** for the portal iframe).
- Pack **`content/.instructions-tabs.json`** points Learn Scrum embed **`urls`** at **`https://sdd.works/en/learn-embedded/`** ([ADR-110](./ADR-110-embedded-external-page-tab.md)).
- Setup paste and MCP public URLs use **`https://framework.sdd.works`** ([ADR-061](./ADR-061-setup-prompt-public-path.md), [ADR-058](./ADR-058-stdio-end-user-http-fallback.md)).

[Web-portal-30](../product-backlog.md#pb-127) (**feature-72**) moves WordPress to **`learn.sdd.works`**, makes the portal canonical at **`sdd.works`**, and redirects **`framework.sdd.works`** to **`sdd.works`**.

## Decision

### Host roles

| Host | Role after cutover |
| --- | --- |
| **`sdd.works`** | Canonical public portal: instructions guide, `/setup`, `/mcp`, package read APIs, admin when routed |
| **`learn.sdd.works`** | WordPress learn site and **`/en/learn-embedded/`** grid page for the portal iframe |
| **`framework.sdd.works`** | **301** (or equivalent) to **`sdd.works`**; keep until bookmarks and docs migrate |

### Learn embed (pack + portal)

1. In **`pack.framework.sdd.works/content/.instructions-tabs.json`** and bundled **`src/content/.instructions-tabs.json`**, tab **`learn-scrum-in-sdd`** **`urls.en`**, **`urls.zh-Hans`**, and **`urls.zh-Hant`** are **`https://learn.sdd.works/en/learn-embedded/`** (all locales until locale-specific embed pages exist).
2. **`embedded_external_page`** host allowlist ([`src/lib/embed-page-host-allowlist.ts`](../../src/lib/embed-page-host-allowlist.ts)) includes **`learn.sdd.works`** and **`www.learn.sdd.works`**. Remove **`sdd.works`** / **`www.sdd.works`** from the embed allowlist after cutover (embed no longer loads from the portal host).
3. Fallback link below the iframe stays **`https://learn.sdd.works`** ([ADR-113](./ADR-113-learn-embed-copy-and-fallback.md)).
4. **`postMessage`** height contract ([ADR-114](./ADR-114-learn-embed-auto-height.md)): embed document on **`learn.sdd.works`** posts to parent origins **`https://sdd.works`** and **`https://www.sdd.works`**. WordPress must allow **`frame-ancestors`** for the portal origin.

### Setup, MCP, and package URLs

1. Public setup sentence and **`GET /setup`** links use **`https://sdd.works/setup`** (path unchanged; host only). Supersedes the host in [ADR-061](./ADR-061-setup-prompt-public-path.md) decision 1.
2. HTTP MCP fallback URL in setup markdown: **`https://sdd.works/mcp`**.
3. Partner lite paste ([`LITE_PARTNER_SETUP_SENTENCE`](../../src/mcp/brand.ts)): **`https://sdd.works/setup/install`**.
4. Default production origin in code (`PUBLIC_BASE_URL`, package fetch default, setup markdown prod constants): **`https://sdd.works`** unless env overrides.
5. MCP **`initialize.name`** may stay **`framework.sdd.works`** (product id in existing client configs) until a separate story renames it; all **URL** strings in user-facing copy and fetched markdown use **`sdd.works`**.

### UI protocol strings

1. Page **`<title>`**, logo **`aria-label`**, and “do not localize” host literals in the guide use **`sdd.works`** after cutover (replace **`framework.sdd.works`** in those slots).
2. Repo and GitHub product name **`framework.sdd.works`** in operator docs and admin Framework copy may stay as the repository name.

### Operator (out of app repo scope)

1. DNS and TLS for **`sdd.works`**, **`www.sdd.works`**, **`learn.sdd.works`**, and redirect from **`framework.sdd.works`**.
2. NPM / reverse proxy: portal stack on **`sdd.works`**; WordPress on **`learn.sdd.works`**.
3. Redirect old WordPress paths on **`sdd.works`** to **`learn.sdd.works`** where needed ([Web-portal-30](../product-backlog.md#pb-127)).

## Rationale

One marketing and install host (**`sdd.works`**) matches the product brand. Learn content stays on WordPress under **`learn.sdd.works`**, so the embed URL must follow the site move. Pack JSON keeps embed URLs operator-editable without an app release for URL-only tweaks.

## Consequences

- **feature-72** implements app and pack JSON changes; **Web-portal-20** / **Web-portal-22** operator policy rows remain separate SBIs but share this cutover.
- Vitest and component tests that assert **`https://learn.sdd.works/en/learn-embedded/`** or **`https://sdd.works/setup`** update in the same change set ([`app-tests.md`](../admin-portal/app-tests.md) §29, **AC44**).
- Host redirect from **`framework.sdd.works`** skips **`/api/*`** so GitHub webhook POST and package GETs on the legacy host are not 301'd.
- [ADR-110](./ADR-110-embedded-external-page-tab.md) allowlist example and historical **`sdd.works`** embed URL are pre-cutover; **ADR-127** governs after **feature-72** ships.
- WordPress team must deploy embed page and **`frame-ancestors`** on **`learn.sdd.works`** before production iframe works.

## Date

2026-10-08
