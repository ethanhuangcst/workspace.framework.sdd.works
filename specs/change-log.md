# Change log — framework.sdd.works

Track notable product, spec, and repo changes. Newest first.  
Source of truth for scope: [`product-backlog.md`](./product-backlog.md). Sprint plans: [`sprint1-plan.md`](./sprint1-plan.md)–[`sprint7-plan.md`](./sprint7-plan.md).

Format: `YYYY-MM-DD` · area · summary. Do not put secrets here.

---

## 2026-09-14

### MVP-4 closed (Sprint 4)

- Operator confirmed Settings + Framework **usable** (DoD).
- Features **Done**: SETT-01, FRMW-01.
- Follow-up: `fixture/*` owner uses in-process GitHub fixture even when `GITHUB_TOKEN` is set (avoids E2E leftover URL 404s).
- Knowledge: GitHub fixture notes in [`knowledge/agent/admin-portal-seed-and-logo.md`](./knowledge/agent/admin-portal-seed-and-logo.md). No new ADR.

### Sprint 4 — SETT-01 + FRMW-01

- Settings: dirty Save; validate `https://github.com/{owner}/{repo}`; reachability via injectable GitHub port; persist singleton `Setting.githubUrl` only on success.
- Framework: read-only tree; 30s server TTL cache + 30s client poll; empty → Settings CTA; sync error keeps shell.
- CI / Playwright: `GITHUB_FIXTURE=1` (no live `GITHUB_TOKEN` in default CI).
- Webhook invalidation deferred.

### MVP-3 closed (Sprint 3)

- Operator confirmed Keys management **usable** (DoD).
- Feature **Done**: KEYS-01.
- Polish: create-form validation UX; lead copy for `sdd_get_key`; reject CJK in `key_value`.
- ADR: [`ADR-048-keys-encryption-at-rest.md`](./adr/ADR-048-keys-encryption-at-rest.md). Knowledge: Keys validation notes in [`knowledge/agent/admin-portal-seed-and-logo.md`](./knowledge/agent/admin-portal-seed-and-logo.md).

### Sprint 3 — KEYS-01

- AES-256-GCM at-rest encryption (`KEYS_ENCRYPTION_KEY`); payload `v1:iv:tag:ciphertext`.
- BFF: `GET/POST /api/admin/keys`, `GET/PATCH/DELETE /api/admin/keys/[id]`, bulk `POST /api/admin/keys/delete`.
- UI: list wired to DB; `/admin/keys/new` and `/admin/keys/[id]` with RHF + Zod; Copy / Edit / Delete / bulk delete; `?saved=1` tip.
- CI + Playwright set fixture `KEYS_ENCRYPTION_KEY`; unit/integration/E2E green.
- MCP `sdd_get_key` remains Sprint 5.

### MVP-2 closed (Sprint 2)

- Operator confirmed accounts management (invite / accept / list / delete) **usable** (DoD).
- Features **Done**: SEED-01, ACCT-03.
- Soft-deactivate UI deferred; schema `DEACTIVATED` unused until a later story.
- Follow-up polish: invite input single-border focus; `E2E_INVITE_FILE` / `E2E_RESET_FILE` skip Resend with a console warning (operator must not leave those vars set on `npm run dev`).
- Knowledge: [`knowledge/agent/admin-portal-seed-and-logo.md`](./knowledge/agent/admin-portal-seed-and-logo.md). No new ADR.

### Sprint 2 — ACCT-03

- InviteToken model + migration; APIs: `GET/POST/DELETE` admin users, `GET/POST` invite accept.
- UI: `/admin/accounts`, `/accept-invite` (mockup-aligned); i18n error keys for delete guards and invite conflicts.
- E2E: `E2E_INVITE_FILE` capture (CI + Playwright webServer); invite → accept → list → delete other; expired token callout.

### Sprint 2 — SEED-01 (new requirement)

- Default admin: email `me@ethanhuang.com`, username `admin`, password from **`ADMIN_SEED_PASSWORD`** in `.env.local` / Portainer (SEED-01).
- ATDD ACs in `admin-portal/app-stories.md` (`sdd-admin-seed`); sprint2 plan + backlog updated (SEED-01 before ACCT-03).
- Replaces blank-password first-login bootstrap for the default admin.
- Env codes also listed in `tech-spec.md` and `.env.example` (empty). Operator-owned values stay in `.env.local` only.

### MVP-1 closed (Sprint 1)

- Operator confirmed login + password reset **usable** (DoD).
- Features **Done**: INF-01, INF-02, INF-03, PATH-01, I18N-01, ACCT-01, ACCT-02.
- Seeded admin: `me@ethanhuang.com` / username `admin` / empty password until first `/set-password`.
- Login password field is optional (not HTML-`required`) so blank first login works; i18n hint `admin.login.password_first_hint`.
- Brand logo polish: transparent PNG (remove `.logo img { background: #000 }`); display size **200%** of prior tokens; home `margin-left: -30px`; header `margin-left: -22px`. Mockups + `app-design.md` synced.
- Knowledge: [`knowledge/agent/admin-portal-seed-and-logo.md`](./knowledge/agent/admin-portal-seed-and-logo.md). No new ADR for logo/login polish (ADR-047 already covers Qwen).

### LLM — Qwen install path discovery

- Accepted [ADR-047](./adr/ADR-047-qwen-install-path-discovery.md): Qwen (Aliyun Bailian, OpenAI-compatible) for MCP **stdio** client-config path discovery only.
- Supersedes tech-spec “no product LLM” for this narrow use case; no portal chat LLM.
- New backlog feature **MCPI-04** (MVP-6); MCPI-02 revised to seed + Qwen cross-client resolution.
- Specs updated: `tech-spec.md`, `req-spec.md` (FR-M11–M14, NFR-8), `mcp/mcp-design.md`, `mcp/mcp-stories.md`, `product-backlog.md`, `sprint6-plan.md`, `sprint7-plan.md`.
- Env codes: `QWEN_*` listed in tech-spec (operator-owned values; do not commit secrets).

### Specs & planning

- Added `specs/sprint1-plan.md` … `specs/sprint7-plan.md` (one sprint per MVP-1…MVP-7).
- Added this `specs/change-log.md`.
- Product backlog, req-spec, tech-spec, admin-portal / mcp stories and designs in place for framework.sdd.works (MCP + admin portal).

### Architecture — client path map (PATH-01)

- New feature **PATH-01 — Client path map (seed data + resolver)** added as an architecture-level foundation in **MVP-1 / Sprint 1**.
- One versioned data file `packages/sdd-paths/paths.json` (JSON Schema-validated in CI) + transport-agnostic resolver `resolve(client, os, overrides?)`.
- v1 ships Cursor seed for macOS / Windows / Linux only.
- `paths_version` exposed via `sdd_list_versions` (Sprint 5) for stale-install warnings.
- Maintenance is reactive (human PR, bump `version`); no daily job, no auto-discovery in v1.
- MCPI-04 (Qwen discovery, Sprint 6) layers on PATH-01 as refinement/fallback; MCPI-02 (cross-client, Sprint 7) expands the same file.
- Updated `product-backlog.md` (new PATH module code + PATH-01 row + MVP-1 scope + dependency notes), `mcp/mcp-stories.md` (new `sdd-mcp-path-map` story with 6 ACs), `mcp/mcp-design.md` (§4.0 path map foundation, resolver contract, maintenance, module sketch, tests), `sprint1-plan.md`, `sprint6-plan.md`, `sprint7-plan.md`.

### Branding & cleanup

- Canonical logos: `public/sdd-logo.png` (wordmark), `public/sdd-mark.png` (square for mail).
- Removed places-agent leftovers: `agent-stories.md`, `agent-design.md`, `agent-logo.png` (public + mockup), `600x600.logos.png`.
- Removed empty stubs `app-test.md`, `mcp-test.md`; designs point at common-test-strategy until test docs are written.
- Email mockups `14` / `15` and `app-design.md` updated to `sdd-mark.png`.

### Environment & data

- Created `.env.local` (gitignored) with env codes; operator fills secrets.
- Locked DB: **dev** = local PostgreSQL; **prod** = AliCloud PostgreSQL (`DATABASE_URL` on Server 2 / Portainer only).
- Root `.gitignore` includes `.env` / `.env.local`.

### MCP tools (locked names)

- `sdd_install_framework`
- `sdd_update_framework`
- `sdd_list_versions`
- `sdd_get_key`

### Hosting (decision)

- Apex `sdd.works` WordPress remains Server 1; MCP + portal on Server 2 at `framework.sdd.works` (Cloudflare DNS).

---

## Template for future entries

```md
## YYYY-MM-DD

### Area
- What changed and why (1–3 bullets). Link sprint / feature codes when relevant.
```
