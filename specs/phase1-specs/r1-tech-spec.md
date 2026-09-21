# Tech stack & dependencies — framework.sdd.works

Locked for **framework.sdd.works**: an MCP service (install / update / list / get key for the SDD framework) plus an **admin portal**. Requirements: [`r1-req-spec.md`](./r1-req-spec.md).

This file is **not** the places-agent / what2eat / where2play stack. Portal UI/BFF versions match that family so operators reuse the same Next.js patterns. Product behavior belongs in the requirements spec, not here.

Copy secrets into the deployable’s env (Portainer / `.env.local`) — never commit real key values. This spec lists **env codes only**.

---

## Product shape

| Surface | Role | Who calls it |
| --- | --- | --- |
| **MCP (stdio)** | Local desktop clients write framework files on the developer machine | Cursor, Kiro, VS Code, Copilot, etc. |
| **MCP (Streamable HTTP)** | Remote / shared / third-party apps; same tools, **no** local home-dir writes unless a local bridge exists | Cloud clients, Chatbox, operator web apps |
| **Admin portal** | Email/password auth, account CRUD, key CRUD, Settings (one GitHub repo URL), read-only live framework view | Operators |

**Product LLM (narrow):** **Qwen** (Aliyun Bailian, OpenAI-compatible) is used only for **MCP stdio** install/update **client-config path discovery** (ADR-047). The calling IDE’s own model still chooses tools. Do **not** add a portal chat LLM or image generation for v1 product UX.

---

## Stack

| Category | Tech | Version / note |
| --- | --- | --- |
| Admin portal + BFF | Next.js (App Router) · React · TypeScript | **16.3.0** · **19.2.8** · **7.0.2** |
| Styles / client data | Tailwind CSS · React Query · Zustand · RHF + Zod | **4.3.1** · **5.101.4** · **5.0.15** · **7.85.0** + **4.4.3** |
| MCP server | TypeScript / Node · `@modelcontextprotocol/sdk` · Zod | Pin SDK; verify `tool` / `registerTool` against the pinned release |
| MCP stdio packaging | **Bun `--compile`** (devDependency only) | Build-time only; ships single executable per OS/arch; see ADR-051 |
| Install idempotency | Commit SHA in manifest (`package_commit`, ADR-052) | Resolved via `repos.getCommit` on materialize; ref label alone is not identity |
| Shared domain | TypeScript — package resolve, path policy, key lookup | Transport-agnostic; used by stdio and HTTP |
| Mail | Resend | Admin password reset (and optional invite) |
| GitHub | GitHub REST (Octokit or `fetch`) | Read-only tree/content for Settings-linked repos |
| Durable store | PostgreSQL + Prisma | **Dev:** local PG · **Prod:** AliCloud PG · same schema (admins, sessions, keys, settings) |
| Test | Vitest · RTL · Playwright | **4.1.9** · **16.3.2** · **1.61.1** |

**Who uses which capability**

| Deployable | LLM | Persistence | External APIs |
| --- | --- | --- | --- |
| Admin portal (Next.js) | None (no portal chat) | Prisma → Postgres | Resend, GitHub (server-side) |
| MCP HTTP | None for path discovery (no caller home FS) | Same Postgres for `sdd_get_key`; package metadata from sync cache | GitHub (sync job only) |
| MCP stdio | **Qwen** — client-config path discovery (ADR-047) | Local FS writes only | Package fetch from operator REST API (`SDD_SERVER_URL`); Qwen Chat Completions |

Rules: minimal dependencies; prefer platform and stdlib. Secrets never ship to the browser.

## Minimum dependencies policy

- Use as few dependencies as possible — prefer the platform, stdlib, and this table before adding packages.
- Do not add map vendors, weather, or a **portal** chat LLM. Qwen is allowed only per ADR-047 (install path discovery).
- Do not add a third deployable for “just admin” or “just GitHub sync” — those are portal BFF capabilities.
- Pin `@modelcontextprotocol/sdk`; re-check registration APIs on upgrade.

## npm install

If the host is in Hong Kong / mainland and npmjs.org is slow, use the Aliyun mirror:

```bash
npm config set registry https://registry.npmmirror.com
# or one-off:
npm install --registry=https://registry.npmmirror.com
```

Other regions may use the default npm registry.

---

## Architecture (locked for v1)

```
                    Cloudflare DNS
                    framework.sdd.works
                            |
              ┌─────────────┴─────────────┐
              │  reverse proxy (Caddy/Nginx) + TLS
              └─────────────┬─────────────┘
                            |
         ┌──────────────────┼──────────────────┐
         │                  │                  │
    / (portal)        /mcp  (HTTP)        stdio (local only)
    Next.js           Streamable HTTP     Bun-compiled binary
    App Router        same process or     developer machine
         │            sibling process            │
         └──────────────────┬──────────────────┘
                            │
                   shared TypeScript core
                   Prisma → PostgreSQL
                   GitHub read (sync job) + Resend
                   Package cache (.data/sdd-packages/)
                   Qwen client (stdio path discovery only)
```

### Deployables

| Process | Purpose |
| --- | --- |
| **portal** | Next.js: pages (framework view, Keys, Settings, accounts) + BFF routes |
| **mcp-http** | Streamable HTTP MCP on the same host (may be a Next.js route handler **or** a sibling Node process behind `/mcp`) |
| **mcp-stdio** | Separate stdio entry for local clients; distributed as a **Bun-compiled single executable** per OS/arch (ADR-051); **not** served on Server 2. Fetches packages from operator REST API (`SDD_SERVER_URL`); no DB/GitHub on client (ADR-053). Dev: `npm run mcp:stdio` (`tsx`). Prod/client: download binary from GitHub Releases — **no Node/npm on the client**. |

**Decision:** one **git repo**, two production processes on Server 2 if MCP HTTP is not inlined into Next.js; one **shared `packages/core`** (or `src/core`) for install/update/list/key logic. Prefer **sibling Node MCP** if the pinned SDK’s Streamable HTTP transport does not fit Next.js request lifecycle; otherwise a single Next.js process is allowed.

**Filesystem writes** (`sdd_install_framework` / `sdd_update_framework`) on stdio run where the process can see the **caller’s** home/config roots (dev contributors). **End users** use HTTP MCP: tools return `packageUrl` + manifest + instructions; the AI agent extracts via shell (ADR-054). HTTP MCP on Server 2 SHALL NOT write arbitrary paths on the server.

### MCP tools (canonical names)

| Tool | Side effects | Transport notes |
| --- | --- | --- |
| `sdd_list_versions` | None (read) | stdio (from REST API) + HTTP (from sync cache) |
| `sdd_install_framework` | Writes client paths (stdio) or returns tarball URL (HTTP) | stdio + HTTP (ADR-054) |
| `sdd_update_framework` | Same as install; idempotent on same version | same as install |
| `sdd_get_key` | None (returns plaintext `key_value`) | **HTTP only**; auth required |

Input schemas: Zod on every tool. Descriptions state parameters, success shape, and failure modes (`not_found`, `unauthorized`, `path_rejected`, `already_up_to_date`, `client_config_unresolved`, `llm_unavailable`).

Optional MCP **resources** (FR-M3): read-only URIs such as `sdd://framework/versions` — no side effects, no key values.

### Install path resolution (Qwen + seed map)

On **stdio** `sdd_install_framework` / `sdd_update_framework` (ADR-047):

1. Prefer explicit `client` when provided; otherwise attempt detection from process/env + config presence.
2. Load **seed path map** defaults for that client/OS (data file — not a growing encyclopedia of unrelated POIs).
3. Collect candidate config files under allow-listed user roots; read **redacted** snippets (path-related keys only).
4. Call **Qwen** Chat Completions (`QWEN_BASE_URL` + `QWEN_CHAT_MODEL`) with a structured JSON schema for proposed roots + confidence.
5. Validate every path with `path-policy`; write only after allow-list pass.
6. If Qwen fails or confidence is low → seed map + explicit `client`; if still unresolved → `client_config_unresolved`, no writes.

HTTP MCP does not run this LLM step against Server 2 disk (MCPI-03).

---

## Admin portal pages

| Route (indicative) | Behavior |
| --- | --- |
| `/` or `/framework` | Read-only, near-real-time GitHub tree/file view from Settings URLs |
| `/keys` | CRUD `key_id` / `key_name` / `key_description` / `key_value` — source of truth for `sdd_get_key` |
| `/settings` | View / save one GitHub repository URL (dirty Save; validate reachability before persist) |
| `/accounts` | Admin account management |
| `/login`, `/reset-password` | Email + password; Resend for reset mail |

i18n catalogs: **en**, **zh-Hans**, **zh-Hant**. No hard-coded UI copy. Dates/numbers via `Intl`. Missing key → default locale or key name (req-spec FR-A8).

---

## Local dev & production

### Databases (locked)

| Environment | Store | Notes |
| --- | --- | --- |
| **Dev** | **Local PostgreSQL** | Host `localhost`, port **`5435`**, db `framework_sdd` (or Docker Compose equivalent on that port) |
| **Production** | **AliCloud (Aliyun) PostgreSQL** | Managed RDS / self-hosted PG on Aliyun; `DATABASE_URL` set in Portainer (or host env) on Server 2 — never commit the prod DSN |

Same Prisma schema in both environments. Do **not** point local `.env.local` at production AliCloud. Do **not** run migrations against prod from a laptop without an explicit ops step.

Suggested local DSN: `postgresql://framework_sdd:framework_sdd@localhost:5435/framework_sdd`.

Prod DSN shape (operator fills host/user/password/db): `postgresql://USER:PASSWORD@ALIYUN_HOST:5432/framework_sdd` (port may differ per Aliyun instance).

### Ports & URLs

| App | Local `PORT` | Local Postgres | Local public URL | Prod public URL |
| --- | --- | --- | --- | --- |
| Admin portal | **3040** | local `:5435` | `http://localhost:3040` | `https://framework.sdd.works` |
| MCP HTTP | **3041** (if sibling) or same as portal `/mcp` | same DB as portal | `http://localhost:3041/mcp` | `https://framework.sdd.works/mcp` |
| MCP stdio | n/a | optional (keys via remote HTTP) | process stdio | not deployed on Server 2 |

Production app: container listen **`3000`**; reverse proxy terminates TLS. DNS: Cloudflare **A/AAAA** (or CNAME) for `framework` → Server 2. WordPress on `sdd.works` (Server 1) is unchanged.

Makefile (when the repo is scaffolded): `dev`, `up`, `down` — portal + **local** Postgres (+ MCP HTTP if separate).

---

## 3rd party capabilities and API

### MCP SDK

- Package=`@modelcontextprotocol/sdk` (pin in `package.json`)
- Transports: **stdio** (local); **Streamable HTTP** (remote). Legacy HTTP/SSE only if a listed client requires it.
- Auth on HTTP: bearer or session token on the MCP endpoint — **not** “secret tool names.”
- On failure: structured MCP error — no stack traces, no other key names, no env dumps.

### GitHub (framework sync + package inventory)

Read-only live view and version listing. Settings store one repo URL; the BFF fetches trees/contents.

- API Configuration
  - Host=`GITHUB_API_HOST` = `api.github.com`
  - Base_URL=`GITHUB_API_BASE_URL` = `https://api.github.com`
  - Token=`GITHUB_TOKEN` (fine-grained or classic, **contents:read** only)
  - Webhook=`GITHUB_WEBHOOK_SECRET` → `POST /api/github/webhook` (push/release → sync cache; ADR-055)
  - Scheduled sync=`CRON_SECRET` → `POST /api/sync/cron` (backup); primary: Next.js `instrumentation.ts` 30-min interval
- Technical highlights
  - Server-side only. Never expose `GITHUB_TOKEN` to the browser.
  - Portal shows files; **no** in-portal edit or git push (req-spec out of scope).
  - Webhook + 30-min scheduled sync + install-time cache-vs-live check (ADR-055).
  - `sdd_list_versions` reads tags/releases or a version manifest from the configured repo(s) and/or a release artifact URL — see open question in req-spec.
  - On failure: show sync error in portal; MCP list/install returns structured error — never silent empty success.

### Resend (transactional email)

- API Configuration
  - Service=`Resend`
  - Host=`RESEND_HOST` = `api.resend.com`
  - API-Key=`RESEND_API_KEY`
  - Base_URL=`RESEND_BASE_URL`
  - From=`MAIL_FROM`
- Technical highlights
  - Password reset (FR-A2); optional admin invite later.
  - Rate-limit reset requests. CSRF-safe forms.
  - On failure: return error to the admin UI — do not claim send success without provider ack.

### PostgreSQL + Prisma

- **Dev:** local PostgreSQL (`DATABASE_URL` in `.env.local`).
- **Prod:** AliCloud PostgreSQL (`DATABASE_URL` in Portainer / server env only).
- Admins: email, password hash (argon2/bcrypt), status (active/deactivated)
- Sessions / reset tokens (hashed, expiry)
- Keys: `key_id` UUID, unique English `key_name`, `key_description`, encrypted or at-rest-protected `key_value`
- Settings: singleton GitHub repo URL, updated by admin
- Indexes: `admins.email` unique; `keys.key_name` unique

Key **values** leave the server only via authenticated Keys page (list/edit show plaintext to the session) or authorized `sdd_get_key` (plaintext). Never in logs, unauthenticated responses, or MCP resources. No system-generated regenerate flow.

### Qwen (Aliyun Bailian) — install path discovery

Used only by MCP **stdio** path resolution (ADR-047). Not used by the admin portal UI.

- API Configuration
  - Mode = OpenAI-compatible Chat Completions (preferred for install discovery)
  - Base_URL = `QWEN_BASE_URL`
  - Native_Base_URL = `QWEN_NATIVE_BASE_URL` (Bailian native; reserved / fallback if needed)
  - API-Key = `QWEN_API_KEY`
  - Chat_Model = `QWEN_CHAT_MODEL`
  - Chat_Model_Fallback = `QWEN_CHAT_MODEL_FALLBACK`
  - Image_Model = `QWEN_IMAGE_MODEL` (**out of scope** for path discovery)
  - Host / Region = `QWEN_HOST` / `QWEN_REGION` (ops metadata)
- Technical highlights
  - Prompt + response schema versioned with the install core (treat as artifacts that affect writes).
  - Never send `key_value`, env secrets, or full credential-bearing config blobs to the model — redacted path/config snippets only.
  - Validate model-proposed paths with the same allow-list as static maps; LLM output is advisory until validated.
  - Default CI uses fixture LLM responses; live Qwen is opt-in.
  - On failure: fall back to seed map; if still unresolved → structured `llm_unavailable` or `client_config_unresolved` — no writes.
  - Cache successful resolutions keyed by `(client, os, config fingerprint)` with a short TTL to control cost.

---

## Environment

Copy keys into `.env.local` (dev) / Portainer on Server 2 (prod) — gitignored; do not commit. Spec lists **env codes only**. Do not create or rewrite env files without operator confirmation (`protect-eng`).

- **Dev `DATABASE_URL`:** local PostgreSQL (see `.env.local`).
- **Prod `DATABASE_URL`:** AliCloud PostgreSQL only in Portainer / host env — never in git or `.env.local`.

```env
# App
APP_NAME=framework.sdd.works
PORT=3000
PUBLIC_BASE_URL=http://localhost:3040
SESSION_SECRET=

# Default admin seed (SEED-01) — never commit real values
ADMIN_SEED_EMAIL=me@ethanhuang.com
ADMIN_SEED_USERNAME=admin
ADMIN_SEED_PASSWORD=

# Postgres — local for .env.local; AliCloud URL only on Server 2 / Portainer
DATABASE_URL=postgresql://framework_sdd:framework_sdd@localhost:5435/framework_sdd

# MCP HTTP
MCP_HTTP_PATH=/mcp
MCP_HTTP_PORT=3041
MCP_AUTH_TOKEN=

# stdio client → operator server (ADR-053)
SDD_SERVER_URL=http://localhost:3040
SDD_PACKAGE_CACHE_DIR=

# GitHub (server-side, read-only)
GITHUB_TOKEN=
GITHUB_API_HOST=api.github.com
GITHUB_API_BASE_URL=https://api.github.com
GITHUB_WEBHOOK_SECRET=
CRON_SECRET=

# Mail
RESEND_API_KEY=
RESEND_HOST=api.resend.com
RESEND_BASE_URL=
RESEND_KEY_MGMT_SITE=
MAIL_FROM=
SMTP_URL=

# Optional: encrypt key_value at rest
KEYS_ENCRYPTION_KEY=

# Qwen (Aliyun Bailian) — MCP stdio install path discovery only (ADR-047)
QWEN_API_KEY=
QWEN_BASE_URL=
QWEN_NATIVE_BASE_URL=
QWEN_CHAT_MODEL=
QWEN_CHAT_MODEL_FALLBACK=
QWEN_IMAGE_MODEL=
QWEN_HOST=
QWEN_REGION=
```

---

## Performance

| Path | Target |
| --- | --- |
| Admin page (cached GitHub tree) | Interactive well under 2s after first sync |
| GitHub refresh | Soft tip if > ~3s; do not block the whole shell |
| `sdd_list_versions` | Fast; cache release/tag list |
| `sdd_install_framework` / `sdd_update_framework` | Bound by local disk + package download; progress in tool result |
| `sdd_get_key` | Single indexed lookup |

No image generation, no multi-vendor fan-out. Do not add a 10s “timeout” copy contract from the places stack.

---

## Security

| Area | Contract |
| --- | --- |
| **Portal** | Session cookie (httpOnly, secure in prod, SameSite); CSRF-safe mutations; rate-limit reset (and invite); login not rate-limited |
| **MCP HTTP** | Authenticate every request; authorize `sdd_get_key` separately if keys are scoped |
| **MCP stdio** | Local process; still validate paths (allow-list under user config roots); no `..` escape |
| **Keys** | Values only on Keys page + `sdd_get_key`; never in `sdd_list_versions` or resources |
| **GitHub** | Token server-only; webhook signature check if used |
| **Errors** | Structured codes; no stacks, no other key names, no token fragments |
| **i18n** | User-visible strings are catalog keys (`en` / `zh-Hans` / `zh-Hant`) |

---

## Implementation pitfalls (must follow)

| Area | Contract |
| --- | --- |
| **Tool names** | Only `sdd_install_framework`, `sdd_update_framework`, `sdd_list_versions`, `sdd_get_key` |
| **Transport** | Core logic transport-agnostic; wire stdio / Streamable HTTP only at bootstrap |
| **HTTP install** | Do not write Server 2 disk as if it were the user’s `~/.cursor` |
| **SDK** | Pin `@modelcontextprotocol/sdk`; verify APIs before coding |
| **Portal stack** | Next 16.3 / React 19.2 / TS 7.0 / Tailwind 4.3 / RQ / Zustand / RHF+Zod — do not swap for another UI stack in v1 |
| **Qwen scope** | `QWEN_*` only for MCP stdio path discovery (ADR-047); no portal chat; no OpenAI as primary |
| **Secrets** | Env / Portainer only — never commit real keys; never `NEXT_PUBLIC_*` for tokens |

---

## Localization (i18n)

Bound by workspace i18n: catalogs **en**, **zh-Hans**, **zh-Hant**. Traditional Chinese variant (TW vs HK vs one shared catalog) is still an open question in req-spec; implementation MAY start with one `zh-Hant` file until that is decided.

MCP tool **descriptions** shown in client UI SHOULD use the same catalogs (or English source + locale overlay). Operator-only log strings may stay English.

---

## Quality bar & testing

Extends **common-test-strategy** (do not weaken it):

- Unit tests for path allow-list, merge/overwrite policy, key lookup, version listing, **LLM output schema + allow-list validation** — **100%** of those critical paths
- Integration: Prisma CRUD (admins, keys, settings); MCP tool contracts (stdio fixture + HTTP if enabled)
- E2E (Playwright): login, password-reset request, Keys CRUD, Settings URL + framework view
- Isolated test DB / temp data dir — never production. Suites that temporarily switch a shared env (e.g. `GITHUB_FIXTURE`) or shared Setting rows MUST restore the previous live values after each test.
- Default CI: fixture GitHub payloads, **fixture Qwen responses**, and no live Resend. Live GitHub / Resend / Qwen are **opt-in**
- **DoD:** fixture/stub/mock-only green is not enough to mark a feature Done; confirm a live operator path (portal or MCP client) as well.
- Tests assert i18n **keys** / roles / test ids — not a single language’s copy (except catalog tests)

---

## Decisions (this spec)

| Topic | Decision |
| --- | --- |
| Portal stack | Same as previous product family: Next.js App Router, React, TS, Tailwind, React Query, Zustand, RHF, Zod (versions in Stack table) |
| Data | **Dev:** local PostgreSQL · **Prod:** AliCloud PostgreSQL · Prisma (not SQLite) |
| Mail | Resend |
| MCP | TypeScript + official SDK; stdio + Streamable HTTP |
| LLM | Qwen (install path discovery, stdio) — ADR-047 |
| Hosting | Server 2 + Cloudflare `framework.sdd.works`; apex WordPress stays on Server 1 |
| Process split | Shared core; portal Next.js; stdio binary local (Bun compile, ADR-051); HTTP MCP on Server 2 (route or sibling) |

## Open questions (carry from req-spec)

1. Traditional Chinese catalog: `zh-TW` vs `zh-HK` vs one `zh-Hant`.
2. Merge vs overwrite for existing user skills/rules.
3. Client detection UX when Qwen confidence is medium (prefer explicit `client`; fail closed vs ask) — ADR-047.
4. `sdd_get_key` credential: MCP bearer, per-key token, or admin-issued API key.
5. Package source: GitHub sync, release artifact, or both.
6. TRAE Agents verification.

ADR-worthy when implemented: HTTP MCP in Next.js vs sibling process; key-at-rest encryption. **Accepted:** [ADR-047](../adr/ADR-047-qwen-install-path-discovery.md), [ADR-051](../adr/ADR-051-zero-dep-stdio-binary.md), [ADR-052](../adr/ADR-052-commit-sha-identity.md), [ADR-053](../adr/ADR-053-server-side-sync-thin-stdio.md), [ADR-054](../adr/ADR-054-hybrid-http-ai-tarball.md).
