# framework.sdd.works — Product Backlog

Source of truth: [`req-spec.md`](./req-spec.md) · [`tech-spec.md`](./tech-spec.md).  
Sprint plans (1 MVP = 1 sprint): [`sprint1-plan.md`](./sprint1-plan.md) … [`sprint7-plan.md`](./sprint7-plan.md).  
Change log: [`change-log.md`](./change-log.md).

## Part 1 — Feature List and MVP Batches

### Module codes

| Code | Module |
| --- | --- |
| INF | Infrastructure (scaffold, DB, CI, Makefile) |
| I18N | Internationalization |
| ACCT | Account / admin auth |
| KEYS | Keys management |
| SETT | Settings (GitHub repository URL) |
| FRMW | Framework view (read-only live sync) |
| TRAN | MCP transport (stdio / Streamable HTTP) |
| PATH | Client path map (versioned data + resolver) |
| MCPL | MCP `sdd_list_versions` |
| MCPI | MCP `sdd_install_framework` |
| MCPU | MCP `sdd_update_framework` |
| MCPK | MCP `sdd_get_key` |
| SYNK | Server-side framework sync job |
| PKAPI | Package REST API for stdio clients |

### Feature list

| # | Subsystem | Module | Feature code | Feature name | One-line description | User story map | MVP batch | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 01 | Admin Portal | INF | INF-01 | Project scaffold | Next.js App Router + TypeScript + Tailwind + Prisma + Postgres + Makefile (`dev`/`up`/`down`) | [INF-01](./admin-portal/app-stories.md) | MVP-1 | Done |
| 02 | Admin Portal | INF | INF-02 | Database schema & migrations | Prisma models for admins, sessions, reset tokens, keys, settings; unique indexes on `admins.email` and `keys.key_name` | [INF-02](./admin-portal/app-stories.md) | MVP-1 | Done |
| 03 | Admin Portal | INF | INF-03 | CI pipeline | GitHub Actions: lint, typecheck, unit, integration, E2E (fixture-only by default; live GitHub / Resend opt-in) | [INF-03](./admin-portal/app-stories.md) | MVP-1 | Done |
| 03a | MCP | PATH | PATH-01 | Client path map (seed data + resolver) | Versioned `packages/sdd-paths/paths.json` + JSON Schema + resolver (`resolve(client, os, overrides?)`); Cursor seed × macOS/Windows/Linux; table-validation unit test; `paths_version` exposed via `sdd_list_versions` once that tool exists | [PATH-01](./mcp/mcp-stories.md#sdd-mcp-path-map) | MVP-1 | Done |
| 04 | Admin Portal | I18N | I18N-01 | i18n foundation | Catalog setup for `en`, `zh-Hans`, `zh-Hant`; `t()` helper; missing-key fallback (default locale or key name) | [I18N-01](./admin-portal/app-stories.md#sdd-admin-i18n) | MVP-1 | Done |
| 05 | Admin Portal | ACCT | ACCT-01 | Admin login | Email + password login; httpOnly secure session cookie; CSRF-safe (login not rate-limited) | [ACCT-01](./admin-portal/app-stories.md#sdd-admin-login) | MVP-1 | Done |
| 06 | Admin Portal | ACCT | ACCT-02 | Password reset | Request reset by email; Resend transactional mail; hashed, expiring reset token; rate-limited | [ACCT-02](./admin-portal/app-stories.md#sdd-admin-password-reset) | MVP-1 | Done |
| 06a | Admin Portal | SEED | SEED-01 | Default admin from env | Seed `me@ethanhuang.com` / `admin` with password from `ADMIN_SEED_PASSWORD`; fail if unset | [SEED-01](./admin-portal/app-stories.md#sdd-admin-seed) | MVP-2 | Done |
| 07 | Admin Portal | ACCT | ACCT-03 | Admin account management | Invite by email, list ACTIVE admins + pending invites, delete with confirm (not self / not last admin); soft-deactivate deferred | [ACCT-03](./admin-portal/app-stories.md#sdd-admin-accounts) | MVP-2 | Done |
| 08 | Admin Portal | KEYS | KEYS-01 | Keys CRUD | Create / view / edit / delete keys (`key_id`, English unique `key_name`, `key_description`, `key_value`); list shows name, description, value; Copy / Edit / Delete — no regenerate | [KEYS-01](./admin-portal/app-stories.md#sdd-admin-keys) | MVP-3 | Done |
| 09 | Admin Portal | SETT | SETT-01 | GitHub repository URL | View / save one GitHub repository URL; Save enabled only when dirty; verify reachability before persist | [SETT-01](./admin-portal/app-stories.md#sdd-admin-settings) | MVP-4 | Done |
| 10 | Admin Portal | FRMW | FRMW-01 | Framework live view | Read-only, near-real-time GitHub tree/file view from the Settings URL; poll or webhook + short cache; sync error shown | [FRMW-01](./admin-portal/app-stories.md#sdd-admin-framework) | MVP-4 | Done |
| 11 | MCP | TRAN | TRAN-01 | MCP server bootstrap (stdio) | Node stdio entry that registers tools with pinned `@modelcontextprotocol/sdk`; transport-agnostic core | [TRAN-01](./mcp/mcp-stories.md#sdd-mcp-transport-stdio) | MVP-5 | Done |
| 12 | MCP | TRAN | TRAN-02 | MCP server bootstrap (Streamable HTTP) | HTTP entry on `/mcp` with bearer/session auth; same core as stdio | [TRAN-02](./mcp/mcp-stories.md#sdd-mcp-transport-http) | MVP-5 | Done |
| 13 | MCP | MCPL | MCPL-01 | `sdd_list_versions` | List available framework package versions and high-level inventory from configured repo(s) / release artifacts; read-only, no key values | [MCPL-01](./mcp/mcp-stories.md#sdd-mcp-list-versions) | MVP-5 | Done |
| 14 | MCP | MCPK | MCPK-01 | `sdd_get_key` | Caller passes `key_name`; return plaintext `key_value` from DB; structured `not_found` / `unauthorized`; no other-key leakage | [MCPK-01](./mcp/mcp-stories.md#sdd-mcp-get-key) | MVP-5 | Done |
| 15 | MCP | MCPI | MCPI-01 | `sdd_install_framework` (stdio + HTTP) | Stdio writes locally; HTTP returns tarball URL for AI extraction (ADR-054); path allow-list; structured summary | [MCPI-01](./mcp/mcp-stories.md#sdd-mcp-install) | MVP-6 | Done |
| 16 | MCP | MCPU | MCPU-01 | `sdd_update_framework` (stdio + HTTP) | Same as install; idempotent on same version | [MCPU-01](./mcp/mcp-stories.md#sdd-mcp-update) | MVP-6 | Done |
| 16a | MCP | SETUP | SETUP-01 | Prompt-based MCP setup | `GET /agent-setup`; Instructions page paste-prompt; HTTP URL only in mcp.json (ADR-054) | [SETUP-01](./mcp/mcp-stories.md#sdd-mcp-prompt-setup) | MVP-6 | Done |
| 17 | MCP | MCPI | MCPI-04 | Qwen path discovery | Qwen searches local client config to propose install roots; seed-map fallback; allow-list validation (ADR-047) | [MCPI-04](./mcp/mcp-stories.md#sdd-mcp-path-llm) | MVP-6 | ToDo |
| 17a | MCP | MCPI | MCPI-05 | Client path detection | Deterministically read client config (env vars + config files) to resolve install paths; fall back to Qwen + seed map if unresolved; auto-detect client from MCP clientInfo | [MCPI-05](./mcp/mcp-stories.md#sdd-mcp-path-detect) | MVP-6 | ToDo |
| 18 | MCP | MCPI | MCPI-02 | Cross-client path resolution | Seed maps + Qwen discovery for first-class clients (Cursor Agents, WorkBuddy / CN, Claude Code, Cline, VS Code, Codex, Copilot); OS variants | [MCPI-02](./mcp/mcp-stories.md#sdd-mcp-cross-client) | MVP-7 | ToDo |
| 19 | MCP | MCPI | MCPI-03 | HTTP install policy | HTTP MCP SHALL NOT write Server 2 disk; returns tarball URL + instructions for AI extraction (ADR-054) | [MCPI-03](./mcp/mcp-stories.md#sdd-mcp-http-install-policy) | MVP-6 | Done |
| 20 | MCP | MCPU | MCPU-02 | Update on HTTP | Same update semantics over HTTP transport under the HTTP install policy | [MCPU-02](./mcp/mcp-stories.md#sdd-mcp-http-install-policy) | MVP-7 | ToDo |
| 21 | Admin Portal | I18N | I18N-02 | MCP description i18n | MCP tool descriptions shown in client UI use the same catalogs (English source + locale overlay) | [I18N-02](./admin-portal/app-stories.md#sdd-admin-i18n) | MVP-7 | ToDo |
| 22 | MCP | SYNK | SYNK-01 | Server-side framework sync | Sync job fetches GitHub repo → local cache (`.data/sdd-packages/`); manifest with versions/inventory/commit SHA; manual + polling trigger | [SYNK-01](./mcp/mcp-stories.md#sdd-mcp-sync-job) | MVP-6 | Done |
| 23 | MCP | PKAPI | PKAPI-01 | Package REST API | `GET /api/sdd/versions`, `GET /api/sdd/package`; admin `POST /api/admin/sync`; stdio fetches from here (ADR-053) | [PKAPI-01](./mcp/mcp-stories.md#sdd-mcp-package-api) | MVP-6 | Done |

### MVP batch plan

**Principle.** Each MVP is small enough for incremental delivery, contains a complete business loop (no stub/mock/fixture for upstream/downstream), and is independently verifiable end-to-end through the UI or an MCP client.

**Definition of Done.** A feature MAY NOT be marked Done on fixture-, stub-, or mock-only test passes. Default CI fixtures are required, but Done still needs a live path: operator-verified portal or MCP client against real GitHub / keys / install targets (live GitHub, Resend, Qwen remain opt-in in CI).

| Batch | Theme | Business closure (what an end user can do and verify) | Features | Sprint plan |
| --- | --- | --- | --- | --- |
| MVP-1 | Portal foundation + admin auth + path-map foundation | An operator can run the portal locally, log in as a seeded admin, reset a forgotten password by email; the versioned client path map and resolver exist as the architecture foundation for install/update | INF-01, INF-02, INF-03, PATH-01, I18N-01, ACCT-01, ACCT-02 | [sprint1-plan.md](./sprint1-plan.md) |
| MVP-2 | Account management | Default admin is seeded from env; an admin can invite, list, and delete other admins (and pending invites) end-to-end in the portal | SEED-01, ACCT-03 | [sprint2-plan.md](./sprint2-plan.md) |
| MVP-3 | Keys management | An admin can create, view, edit, and delete keys (name, description, value); list shows all three; values are protected at rest and never appear unauthenticated | KEYS-01 | [sprint3-plan.md](./sprint3-plan.md) |
| MVP-4 | Settings + framework live view | An admin can configure one GitHub repo URL and see a read-only, near-real-time view of the framework repository in the portal | SETT-01, FRMW-01 | [sprint4-plan.md](./sprint4-plan.md) |
| MVP-5 | MCP server + discovery + key lookup | A supported MCP client can connect (stdio and HTTP), list framework versions, and resolve a key value via `sdd_get_key` with auth | TRAN-01, TRAN-02, MCPL-01, MCPK-01 | [sprint5-plan.md](./sprint5-plan.md) |
| MVP-6 | MCP install + update (Cursor, local) | A Cursor user can install the SDD framework locally and update it to a chosen version; re-running the same version is idempotent; path roots use deterministic client config detection first, then seed map + Qwen when needed; stdio fetches packages from operator server (ADR-053) | MCPI-01, MCPU-01, MCPI-04, MCPI-05, SYNK-01, PKAPI-01 | [sprint6-plan.md](./sprint6-plan.md) |
| MVP-7 | Cross-client + HTTP hardening | First-class clients across macOS / Windows / Linux resolve install paths (seed + Qwen); HTTP install follows the safe local-bridge policy; MCP descriptions are i18n-aware | MCPI-02, MCPI-03, MCPU-02, I18N-02 | [sprint7-plan.md](./sprint7-plan.md) |

Notes:
- MVP-5 depends on MVP-3 (keys store) and MVP-4 (GitHub links for version listing).
- MVP-6 depends on MVP-5 (transport + list versions), MVP-4 (package source), and MVP-1 PATH-01 (path map + resolver); includes MCPI-05 (deterministic client path detection) and MCPI-04 (Qwen path discovery layered on PATH-01).
- MVP-7 depends on MVP-6 and expands the path map (PATH-01) to first-class clients; resolves open questions on client path resolution and HTTP install policy.

## Part 2 — Feature Detail

### INF-01 — Project scaffold

- **Detail.** Initialize one git repo with the locked stack: Next.js 16.3 App Router, React 19.2, TypeScript 7.0, Tailwind 4.3, React Query, Zustand, RHF + Zod, Prisma, Vitest, RTL, Playwright. Add root `Makefile` with `dev`, `up`, `down`, `test`, `lint`, `help` per the `makefile` rule. Add `.env.example` with env codes only (including `QWEN_*` for MCP path discovery — ADR-047; no real values); do not create or edit `.env` / `.env.local` without operator confirmation (`protect-eng`).
- **Dependencies.** None.
- **User stories & AC.** [INF-01](./admin-portal/app-stories.md)
- **UI design & mockup.** [design.md — scaffold](./design.md#inf-01) (structure diagram only)

### INF-02 — Database schema & migrations

- **Detail.** Prisma schema for `admins` (email unique, password hash, status), `sessions`, `reset_tokens` (hashed, expiry), `keys` (`key_id` UUID, `key_name` unique English, `key_description`, `key_value` protected at rest), `settings` (singleton GitHub repo URL, audit fields). Migrations runnable via `make up`. Isolated test DB / temp data dir; never production data.
- **Dependencies.** INF-01.
- **User stories & AC.** [INF-02](./admin-portal/app-stories.md)
- **UI design & mockup.** [design.md — data model](./design.md#inf-02) (ER diagram)

### INF-03 — CI pipeline

- **Detail.** GitHub Actions on push / PR: lint, typecheck, unit (Vitest), integration (Prisma CRUD + MCP contracts), E2E (Playwright). Default fixture-only; live GitHub, Resend, and Qwen are opt-in jobs. Publish coverage when available. Failures block merge.
- **Dependencies.** INF-01.
- **User stories & AC.** [INF-03](./admin-portal/app-stories.md)
- **UI design & mockup.** n/a

### PATH-01 — Client path map (seed data + resolver)

- **Detail.** Architecture-level foundation for install/update. One versioned data file `packages/sdd-paths/paths.json` (JSON Schema-validated in CI) holding seed install roots per client × OS. A transport-agnostic resolver `resolve(client, os, overrides?)` returns `{ skills, rules, other }` or a structured error (`client_unknown`, `os_unsupported`, `path_rejected`). Resolution order: explicit caller overrides → `clients[client][os]` → `clients[client].default` → `client_unknown`. `~` / `%USERPROFILE%` expanded server-side; raw caller strings never reach `fs`. v1 ships Cursor seed for macOS / Windows / Linux only. `paths_version` is exposed via `sdd_list_versions` once that tool exists (Sprint 5), so a stale local install can warn. Updates are reactive (human PR, bump `version`), not scheduled; no auto-discovery in v1. Do not grow this into a per-client POI encyclopedia (`no-city-encyclopedia`); it is mechanism, not product knowledge.
- **Dependencies.** INF-01.
- **User stories & AC.** [PATH-01](./mcp/mcp-stories.md#sdd-mcp-path-map)
- **UI design & mockup.** n/a

### I18N-01 — i18n foundation

- **Detail.** Catalog setup for `en`, `zh-Hans`, `zh-Hant` with a `t()` helper and locale switcher. Missing key falls back to default locale, then key name (req-spec FR-A8). Dates and numbers via `Intl`. No hard-coded user-facing strings in components or routes. Traditional Chinese variant (TW vs HK vs one shared `zh-Hant`) follows the open question in req-spec; implementation MAY start with one `zh-Hant` file.
- **Dependencies.** INF-01.
- **User stories & AC.** [I18N-01](./admin-portal/app-stories.md#sdd-admin-i18n)
- **UI design & mockup.** [design.md — locale switcher](./design.md#i18n-01)

### ACCT-01 — Admin login

- **Detail.** Email + password login. Argon2/bcrypt hash verification. httpOnly, secure (prod), SameSite session cookie. CSRF-safe form. Login is not rate-limited (operator request). Structured errors (`invalid_credentials`) with no stack traces.
- **Dependencies.** INF-02, I18N-01.
- **User stories & AC.** [ACCT-01](./admin-portal/app-stories.md#sdd-admin-login)
- **UI design & mockup.** [design.md — login page](./design.md#acct-01)

### ACCT-02 — Password reset

- **Detail.** Admin requests reset by email; Resend sends a link with a hashed, expiring token. Rate-limit reset requests. CSRF-safe. On failure, return error to the UI; do not claim send success without provider ack. Token single-use; invalidated after success or expiry.
- **Dependencies.** ACCT-01, INF-02, I18N-01.
- **User stories & AC.** [ACCT-02](./admin-portal/app-stories.md#sdd-admin-password-reset)
- **UI design & mockup.** [design.md — reset password flow](./design.md#acct-02)

### SEED-01 — Default admin from env

- **Detail.** Database seed upserts the default admin: email `me@ethanhuang.com`, username `admin`, name `Admin`, status `ACTIVE`. Password plaintext is read only from `ADMIN_SEED_PASSWORD` (`.env.local` / Portainer); stored as scrypt hash. Seed **fails** if the env value is missing or blank. Re-running seed with a new `ADMIN_SEED_PASSWORD` updates the hash so the new password authenticates. Never log or print the plaintext password.
- **Dependencies.** INF-02.
- **User stories & AC.** [SEED-01](./admin-portal/app-stories.md#sdd-admin-seed)
- **UI design & mockup.** n/a (seed / ops)

### ACCT-03 — Admin account management

- **Detail.** First admin seeded via **SEED-01**. Authenticated admin invites by email (Resend + `/accept-invite`), lists ACTIVE admins and pending unused invites, and deletes another admin or pending invite after confirm. Cannot delete self or the last ACTIVE admin (BFF enforced). Soft-deactivate UI is deferred (`DEACTIVATED` unused in v1). Authorization enforced server-side; UI hiding is not the control.
- **Dependencies.** ACCT-01, INF-02, I18N-01, SEED-01.
- **User stories & AC.** [invite](./admin-portal/app-stories.md#sdd-admin-invite) · [accounts](./admin-portal/app-stories.md#sdd-admin-accounts)
- **UI design & mockup.** [app-design.md](./admin-portal/app-design.md) · [10-admins](./admin-portal/ui-mockup/10-admins.html) · [05-accept-invite](./admin-portal/ui-mockup/05-accept-invite.html)

### KEYS-01 — Keys CRUD

- **Detail.** Authenticated admin creates, views, edits, and deletes keys. Fields: `key_id` (UUID, system), `key_name` (admin, unique, English letters/digits/`_`/`-`, must start with a letter), `key_description` (admin), `key_value` (admin paste; no CJK; protected at rest with `KEYS_ENCRYPTION_KEY`, ADR-048). List shows name, description, and value. Actions: Copy, Edit, Delete — **no regenerate**. Values shown only to authenticated admins; never in unauthenticated responses or logs. Forms use RHF + Zod; CSRF-safe.
- **Dependencies.** ACCT-01, INF-02, I18N-01.
- **User stories & AC.** [KEYS-01](./admin-portal/app-stories.md#sdd-admin-keys)
- **UI design & mockup.** [app-design.md](./admin-portal/app-design.md) · [06-keys.html](./admin-portal/ui-mockup/06-keys.html)

### SETT-01 — GitHub repository URL

- **Detail.** Authenticated admin views and saves **one** GitHub repository URL used by the framework sync view. Save is unavailable while the field matches the stored value; available after edit. On save: validate host shape, then verify the repository is reachable via GitHub; success → tip + persist; failure → tip (`errors.settings_url_unreachable` or `errors.settings_url_invalid`) and **no** DB change. CSRF-safe. Changing the URL updates what the framework page syncs.
- **Dependencies.** ACCT-01, INF-02, I18N-01.
- **User stories & AC.** [SETT-01](./admin-portal/app-stories.md#sdd-admin-settings)
- **UI design & mockup.** [app-design.md — Settings](./admin-portal/app-design.md) · [11-settings.html](./admin-portal/ui-mockup/11-settings.html)

### FRMW-01 — Framework live view

- **Detail.** Read-only, near-real-time view of the GitHub repository tree/files from the Settings URL. Server-side fetch via GitHub REST (Octokit or `fetch`) using `GITHUB_TOKEN` (contents:read only); token never exposed to the browser. Poll or webhook + short cache; show a soft tip if refresh exceeds ~3s; do not blank the whole shell on partial failure. No in-portal edit or git push.
- **Dependencies.** SETT-01, INF-02, I18N-01.
- **User stories & AC.** [FRMW-01](./admin-portal/app-stories.md#sdd-admin-framework)
- **UI design & mockup.** [design.md — framework view](./design.md#frmw-01)

### TRAN-01 — MCP server bootstrap (stdio)

- **Detail.** Node stdio entry that registers `sdd_install_framework`, `sdd_update_framework`, `sdd_list_versions`, `sdd_get_key` with the pinned `@modelcontextprotocol/sdk`. Tool input schemas use Zod; descriptions state parameters, success shape, and failure modes. Core install/update/list/key logic lives in a shared transport-agnostic package. Validate paths (allow-list under user config roots; no `..` escape).
- **Dependencies.** INF-02, KEYS-01, SETT-01.
- **User stories & AC.** [TRAN-01](./mcp/mcp-stories.md#sdd-mcp-transport-stdio)
- **UI design & mockup.** n/a

### TRAN-02 — MCP server bootstrap (Streamable HTTP)

- **Detail.** HTTP entry on `/mcp` using the same shared core as stdio. Bearer or session token auth on every request; do not rely on obscure tool names. Structured MCP errors only; no stack traces, no other key names, no env dumps. May be a Next.js route handler or a sibling Node process per tech-spec decision.
- **Dependencies.** TRAN-01.
- **User stories & AC.** [TRAN-02](./mcp/mcp-stories.md#sdd-mcp-transport-http)
- **UI design & mockup.** n/a

### MCPL-01 — `sdd_list_versions`

- **Detail.** Read-only tool. Lists available framework package versions and a high-level inventory from the operator sync cache (HTTP) or REST API (stdio, ADR-053). No side effects, no key values. Optional MCP resources (e.g. `sdd://framework/versions`) MAY mirror the same data.
- **Dependencies.** TRAN-01, TRAN-02, SETT-01.
- **User stories & AC.** [MCPL-01](./mcp/mcp-stories.md#sdd-mcp-list-versions)
- **UI design & mockup.** n/a

### MCPK-01 — `sdd_get_key`

- **Detail.** Caller passes `key_name`. MCP reads the matching row from the key store and returns plaintext `key_value` when the caller is authorized and the key exists. Otherwise returns a structured error (`not_found` / `unauthorized`) without leaking other key names or values. Auth model follows the open question in req-spec (API key, MCP session token, or admin-issued credential); transport-agnostic core.
- **Dependencies.** TRAN-01, TRAN-02, KEYS-01.
- **User stories & AC.** [MCPK-01](./mcp/mcp-stories.md#sdd-mcp-get-key)
- **UI design & mockup.** n/a

### MCPI-01 — `sdd_install_framework` (stdio, Cursor)

- **Detail.** Installs the SDD framework package into Cursor paths on the developer machine: skills (each with `SKILL.md`), rules (`.mdc`), and other package folders. Fetches package from operator REST API (`SDD_SERVER_URL`, ADR-053) — no DB or GitHub on client. Detects or accepts an explicit `client` argument; resolves OS-specific paths via **MCPI-05 deterministic detection → PATH-01 seed map + Qwen config discovery** (MCPI-04 / ADR-047). Path allow-list rejects invalid or out-of-root targets. Returns a structured summary: paths written, version, asset counts, resolution source (`env` | `config` | `seed` | `llm`). Manifest-tracked merge (ADR-048).
- **Dependencies.** TRAN-01, MCPL-01, FRMW-01, PATH-01, MCPI-04, MCPI-05.
- **User stories & AC.** [MCPI-01](./mcp/mcp-stories.md#sdd-mcp-install)
- **UI design & mockup.** n/a

### MCPU-01 — `sdd_update_framework` (stdio, Cursor)

- **Detail.** Refreshes an existing Cursor install to a specified or latest version. Idempotent on same version (reports `already_up_to_date`). Applies the same path resolution (MCPI-05 + MCPI-04), allow-list, and merge/overwrite policy as install. Returns a structured summary of changes. Fails safely on invalid paths or would-overwrite without policy.
- **Dependencies.** MCPI-01, MCPI-05.
- **User stories & AC.** [MCPU-01](./mcp/mcp-stories.md#sdd-mcp-update)
- **UI design & mockup.** n/a

### MCPI-04 — Qwen client-config path discovery

- **Detail.** On stdio install/update, call Aliyun Bailian **Qwen** (OpenAI-compatible) with redacted local client config snippets to propose skills/rules roots. Validate with path-policy. Fall back to **PATH-01** seed map when LLM unavailable or low confidence; otherwise `client_config_unresolved` / `llm_unavailable` with no writes. No portal chat. Env: `QWEN_*` (tech-spec). ADR-047. Runs **after** MCPI-05 deterministic detection fails.
- **Dependencies.** TRAN-01, PATH-01, MCPI-05.
- **User stories & AC.** [MCPI-04](./mcp/mcp-stories.md#sdd-mcp-path-llm)
- **UI design & mockup.** n/a

### MCPI-05 — Client path detection

- **Detail.** Before Qwen discovery, deterministically resolve client install roots by: (1) reading client-specific env vars (`CLAUDE_CONFIG_DIR`, `CODEX_HOME`, `CLINE_DIR`, `KIRO_HOME`, `COPILOT_CUSTOM_INSTRUCTIONS_DIRS`, `XDG_DATA_HOME`), (2) probing client config files for customized paths. Auto-detect the calling client from MCP `clientInfo.name` when the explicit `client` arg is omitted. Fall back to MCPI-04 (Qwen) + PATH-01 seed map if deterministic resolution fails. stdio writes locally; HTTP returns tarball URL (ADR-054). Knowledge base: [`specs/mcp/client.paths.md`](./mcp/client.paths.md).
- **Dependencies.** TRAN-01, PATH-01, MCPI-04.
- **User stories & AC.** [MCPI-05](./mcp/mcp-stories.md#sdd-mcp-path-detect)
- **UI design & mockup.** n/a

### MCPI-02 — Cross-client path resolution

- **Detail.** Extends the **PATH-01** seed map and Qwen discovery to first-class clients beyond Cursor: Cursor Agents, WorkBuddy / WorkBuddy CN, Claude Code, Cline, VS Code, Codex, Copilot. OS variants for macOS, Windows, Linux. TRAE Agents included as candidate until MCP / install-path support is verified (req-spec open question 6). Prefer seed + LLM over growing a static path encyclopedia. Bump `paths_version` on every map change.
- **Dependencies.** MCPI-01, MCPU-01, MCPI-04, PATH-01.
- **User stories & AC.** [MCPI-02](./mcp/mcp-stories.md#sdd-mcp-cross-client)
- **UI design & mockup.** n/a

### MCPI-03 — HTTP install policy

- **Detail.** HTTP MCP SHALL NOT write Server 2 disk as if it were the user’s `~/.cursor`. Returns `packageUrl`, paths, manifest, and extraction instructions for AI shell execution (ADR-054). Same path allow-list contract as stdio install.
- **Dependencies.** TRAN-02, MCPI-01.
- **User stories & AC.** [MCPI-03](./mcp/mcp-stories.md#sdd-mcp-http-install-policy)
- **UI design & mockup.** n/a

### MCPU-02 — Update on HTTP

- **Detail.** Same update semantics as MCPU-01 over the Streamable HTTP transport, under the HTTP install policy (MCPI-03). Idempotent on same version; structured errors only.
- **Dependencies.** MCPU-01, MCPI-03.
- **User stories & AC.** [MCPU-02](./mcp/mcp-stories.md#sdd-mcp-http-install-policy)
- **UI design & mockup.** n/a

### SYNK-01 — Server-side framework sync job

- **Detail.** Operator server sync job reads Settings GitHub URL, fetches latest ref via `GitHubPort.materializePackage`, stores unpacked files + tarball under `.data/sdd-packages/<commit-sha>/`, writes manifest (versions, inventory, latestCommit). Idempotent on unchanged SHA. Triggers: `POST /api/admin/sync`, GitHub webhook, 30-min scheduled sync (+ cron route backup). HTTP install syncs when cache differs from live tip. ADR-053, ADR-055.
- **Dependencies.** SETT-01, FRMW-01.
- **User stories & AC.** [SYNK-01](./mcp/mcp-stories.md#sdd-mcp-sync-job)
- **UI design & mockup.** n/a

### PKAPI-01 — Package REST API for stdio clients

- **Detail.** Public `GET /api/sdd/versions` and `GET /api/sdd/package?version=<v>` serve sync cache to stdio binary. Returns `409 sync_pending` when empty, `404 version_not_found` for unknown versions. Package response includes `X-SDD-Commit` and `X-SDD-Version` headers. ADR-053.
- **Dependencies.** SYNK-01.
- **User stories & AC.** [PKAPI-01](./mcp/mcp-stories.md#sdd-mcp-package-api)
- **UI design & mockup.** n/a

### I18N-02 — MCP description i18n

- **Detail.** MCP tool descriptions shown in client UI use the same catalogs (English source + locale overlay for `zh-Hans` and `zh-Hant`). Operator-only log strings MAY stay English. Verifies that switching locale in a client does not produce missing-key crashes.
- **Dependencies.** I18N-01, TRAN-01, TRAN-02.
- **User stories & AC.** [I18N-02](./admin-portal/app-stories.md#sdd-admin-i18n)
- **UI design & mockup.** n/a
