## Cloudflare — zone sdd.works

- Zone ID: `5a56c1dad8d28db67242565e2de20961`
- Account ID: `13b3c81bb167367d696685c9aae07a9c`
- Plan: **Free** (A1)
- SSL/TLS mode: **Full** (Custom SSL/TLS, A1). Visitor ↔ Cloudflare HTTPS; Cloudflare ↔ origin uses visitor scheme match (HTTPS to origin when visitor uses HTTPS). Prefer valid origin cert on **`38.55.199.241`** (WordPress) and NPM on **`38.55.192.140`** for proxied names.
- Redirect quota note: **10** Single Redirect rules per zone on Free ([Cloudflare Redirects](https://developers.cloudflare.com/rules/url-forwarding/))
- DNS export date: 2026-10-08 08:47 UTC

### A records (live)

| Name | Content | Proxy | Role |
| --- | --- | --- | --- |
| `@` (`sdd.works`) | `38.55.192.140` | **Proxied** | **Portal** (Next.js via NPM) — Phase 3 **done** 2026-10-08 |
| `learn` | `38.55.199.241` | **Proxied** | WordPress — Phase 1 **done** |
| `framework` | `38.55.192.140` | **Proxied** | Legacy portal hostname. Origin cert is Let's Encrypt for this name. HTTPS via Cloudflare **200** (2026-10-08). |
| `www` | `38.55.192.140` | **Proxied** | Single Redirect to apex (2026-10-08). |

| Name | Status |
| --- | --- |
| `www` redirect | **301** `www.sdd.works` + path and query → `https://sdd.works` + same path and query. |
| WordPress home on apex | **301** `/en/home-en` and `/en/home-en/` → `https://sdd.works/instructions` (query kept). |

### Email (do not change during hostname cutover)

| Name | Type | Purpose |
| --- | --- | --- |
| `send` | MX + TXT SPF | Amazon SES / Resend |
| `_dmarc` | TXT | DMARC |
| `resend._domainkey` | TXT | DKIM |

### Interpretation

- **Two origins:** WordPress **`38.55.199.241`** (**`learn`**) and portal **`38.55.192.140`** (apex **`@`** and **`framework`**, both proxied).
- **`framework.sdd.works`** is proxied. App **`middleware`** redirects that host to **`https://sdd.works`** after the feature-72 image deploy. Until then the hostname still serves the portal.
- **Do not edit** `send`, `_dmarc`, or `resend._domainkey` for this project.

## Cloudflare — Rules (read only)

- Single Redirect Rules: **www → apex**; **`/en/home-en` → `/instructions`** (2026-10-08)
- Bulk Redirect Rules: _optional check_
- Page Rules (legacy): _optional check_

## WordPress

- **`learn.sdd.works`** Phase 1 **done** (2026-10-08): k8s **`litespeed-conf`** map includes **`learn.sdd.works`**; WP **`home`/`siteurl`** → **`https://learn.sdd.works`**. **`/en/learn-embedded/`** → **200** on **`learn`**.
- Apex **`sdd.works`** no longer serves WordPress (Phase 3). Course embed URL in portal pack → **`https://learn.sdd.works/en/learn-embedded/`** (feature-72 in repo).
- **Operator todo:** **`frame-ancestors`** on **`learn-embedded`** for **`https://sdd.works`** so Learn tab iframe works in browser.
- SSH **`root@38.55.199.241:22`**: lockdown; allowlist operator IPs only.

## NPM + Portainer

### Proxy Host `sdd.works` (Phase 3 — **done**)

| Field | Value |
| --- | --- |
| Domain names | `sdd.works` |
| Scheme | `http` → `framework-sdd-web:3000` |
| Custom **`/mcp`** | `framework-sdd-mcp:3041` |
| SSL | Let's Encrypt + Force SSL (after apex DNS; fixes Cloudflare **525**) |

### Proxy Host `framework.sdd.works` (A4, Details)

| Field | Value |
| --- | --- |
| Domain names | `framework.sdd.works` |
| Scheme | `http` |
| Forward | `framework-sdd-web:3000` |
| Access | Publicly Accessible |
| Cache Assets | Off |
| Block Common Exploits | On |
| Websockets Support | On |

### A4b — Custom location (done)

| Location | Scheme | Forward | Port |
| --- | --- | --- | --- |
| `/mcp` | `http` | `framework-sdd-mcp` | `3041` |

### Portainer (**done** 2026-10-08)

- `PUBLIC_BASE_URL`: **`https://sdd.works`**
- `SDD_SERVER_URL`: **`https://sdd.works`**
- Stack reference: [`portainer.md`](./portainer.md)

### Verify (2026-10-08)

- **`curl -sI https://sdd.works/`** → **200**, Next.js, **`X-Served-By: sdd.works`**
- **`https://learn.sdd.works/`** → WordPress **301**
- **`/mcp`** → **502** on both hostnames (MCP upstream; separate fix)

## feature-72 (app repo)

- **WIP in repo:** pack + bundled **`.instructions-tabs.json`**, embed allowlist **`learn.sdd.works`**, defaults **`https://sdd.works`**, **`middleware`** redirect **`framework.sdd.works`** → **`sdd.works`**. **Deploy** new image to 野草云3 for production to match.
- Tests: app-tests **§29**, **AC44**

## Portal paths on apex

`/`, `/instructions`, `/setup`, `/setup/install`, `/mcp`, `/api/`, `/admin/`, `/login`, `/_next/`
