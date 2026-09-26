# Knowledge — Admin portal seed login and brand logo CSS

**Date:** 2026-09-14 (updated SEED-01)  
**Area:** admin portal (MVP-1 / MVP-2)  
**Related:** [`sprint2-plan.md`](../../phase1-process-specs/sprint2-plan.md), [`app-design.md`](../../admin-portal/app-design.md), [`sdd-admin-seed`](../../admin-portal/app-stories.md#sdd-admin-seed)

## Default admin (SEED-01)

| Field | Source |
| --- | --- |
| Email | `ADMIN_SEED_EMAIL` (default `me@ethanhuang.com`) |
| Username | `ADMIN_SEED_USERNAME` (default `admin`) |
| Password | **`ADMIN_SEED_PASSWORD`** (required; operator `.env.local` / Portainer) |

Flow: set env → `make up` / `npx prisma db seed` → sign in with email + env password.

- Seed **fails** if `ADMIN_SEED_PASSWORD` is missing or blank.
- Re-seed with a new password updates the hash.
- Never commit plaintext passwords; never log them.

Blank-password first-login bootstrap for the **default** admin is retired. Empty-password gate still applies to other accounts that have no hash yet (e.g. incomplete invite).

## Brand logo rendering

- Asset `public/sdd-logo.png` is RGBA with transparent background.
- Do **not** set `.logo img { background: #000 }`.
- Display sizes (200% of original tokens): home `144px`, auth `112px`, header `72px`.
- Offsets: home `margin-left: -30px`; header `margin-left: -22px`.

## CI / E2E

CI sets `ADMIN_SEED_PASSWORD` and `E2E_ADMIN_PASSWORD` to the same fixture value.

| Capture env | Purpose |
| --- | --- |
| `E2E_SKIP_MAIL=1` | Skip Resend for Playwright / CI; write the URL to the capture file instead |
| `E2E_RESET_FILE` | Path for the password-reset link (used only when `E2E_SKIP_MAIL=1`) |
| `E2E_INVITE_FILE` | Path for the admin-invite accept URL (used only when `E2E_SKIP_MAIL=1`) |

Playwright’s `webServer` sets `E2E_SKIP_MAIL=1` plus both capture paths and does **not** reuse an existing server on port 3040. When `E2E_SKIP_MAIL=1`, the server writes the URL to the capture file and does **not** call Resend (logs a warning if a Resend key is also present). Default CI sets both capture paths and does not set Resend; Playwright injects `E2E_SKIP_MAIL=1`.

**Operator pitfall:** do not export `E2E_SKIP_MAIL=1` in a long-lived `npm run dev` shell if you expect real inbox delivery. Capture file paths alone no longer skip Resend. Restart `make dev` / `npm run dev` without `E2E_SKIP_MAIL` so Resend runs.

## Local reset “success” with no inbox mail (WA-10)

**Finding (2026-09-26):** Local `/reset-password` showed the success callout while the inbox stayed empty. Production still delivered reset mail for the same operator address.

**Cause (order checked):**

1. **Shared port-3040 process historically ran with capture env.** Browser and Playwright reused one `next dev` on 3040. When that process was started with `E2E_SKIP_MAIL=1` (and `E2E_RESET_FILE`), a human click returned `{ ok: true }` and skipped Resend. Production never sets `E2E_SKIP_MAIL`. Capture paths alone no longer skip mail (see table above); the flag must be unset for interactive use.
2. **Latest live clicks were the no-send branch, not a Resend failure.** Server log: `POST /api/admin/password/reset` **200 in 49ms** and **200 in 17ms**, right after a login **401**. A Resend send on this app takes about **1–10 seconds**. A sub-100ms `200` means the handler did **not** call `sendResetMail`: the address was not an ACTIVE admin (or historically capture mode). The page still shows success because unknown / inactive addresses return `{ ok: true }` (no account leak). A **429** would have kept the form and shown an error, so those clicks were not rate-limited.
3. **Production differs because the request hits Resend for an ACTIVE admin.** Same route, no `E2E_SKIP_MAIL`, ACTIVE row → Resend accepts → inbox delivery.

**Do not log** `RESEND_API_KEY`, `MAIL_FROM`, or the reset URL when diagnosing. Record only whether Resend was called (timing / one dev line on a later code pass).

**Guard for the next code pass:** do not start interactive `npm run dev` with `E2E_SKIP_MAIL`; after a reset change, one browser click must show the previous `admin.reset.sent` sentence and a Resend-duration response (about 1s or more), not a sub-100ms `200`.

**2026-09-26 15:56:** `POST /api/admin/password/reset` was **200 in 62ms** with `[mail] password reset: no mail sent (admin missing or not ACTIVE)`, right after login **401**. Resend was not called. The local database had only `e2e-admin@ethanhuang.com`. `e2e/accounts.spec.ts` `should_invite_accept_list_and_delete_other_admin` had deleted every admin except the Playwright account, including the seed admin, during the web-app Playwright run. That delete now keeps `ADMIN_SEED_EMAIL` (default `me@ethanhuang.com`).

## Keys at rest (KEYS-01)

- Env: `KEYS_ENCRYPTION_KEY` — 64 hex chars or 32-byte base64.
- Format stored in DB: `v1:<iv_b64url>:<tag_b64url>:<ciphertext_b64url>` (AES-256-GCM). Decision: [ADR-048](../../adr/ADR-048-keys-encryption-at-rest.md).
- CI / Playwright inject a fixture key; local `.env.local` must set the same (or another) secret or create/list of encrypted rows will fail closed.
- **Pitfall:** Playwright’s default `KEYS_ENCRYPTION_KEY` differs from a typical `.env.local` value. If E2E writes keys into the same Postgres as `npm run dev`, the Keys page decrypts with the env key and throws `Unsupported state or unable to authenticate data`. Fix: re-encrypt under the current env key, or delete those rows and recreate them in the portal. Prefer a separate E2E database when possible.
- Plaintext leaves the server only for authenticated Keys UI (and later `sdd_get_key`).

### Validation / UX

- `key_name`: `^[A-Za-z][A-Za-z0-9_-]*$` — must start with a letter (digit-only names like `1` fail client + server).
- `key_value`: reject CJK ideographs (`errors.key_value_no_chinese`); ASCII/API tokens expected.
- Surface field errors next to the control (`key-name-error` / `key-value-error`) plus a form-level alert — silent Zod failures are easy to miss on submit.
- Lead copy frames MCP usage (`sdd_get_key` + key name → key value); do not re-explain storage or “long AI API key” under the value field.

## GitHub settings + framework sync (SETT-01 / FRMW-01 / FRMW-02)

- Env: `GITHUB_TOKEN` (contents:read) + optional `GITHUB_API_BASE_URL`; **never** expose to the browser.
- CI / Playwright: set `GITHUB_FIXTURE=1` so `src/github/sync.ts` uses an in-process fixture port (reachable: `fixture/sdd-framework`; unreachable: `fixture/missing`).
- Tests may also call `setGitHubPortForTests(...)`.
- Owner `fixture` always uses the fixture port (even with a real token) so E2E leftover Settings URLs do not 404 against api.github.com.
- Framework tree: `GET /api/admin/framework` reads SYNK-01 unpacked cache (`.data/sdd-packages/<sha>/unpacked/`); no live Octokit on page load. UI polls every 30s; **Sync with git repository** calls `POST /api/admin/sync { force: true }`.
- Tree UX: top-level dirs (Agents, Rules, Skills, …) expand one level by default; children indented under each folder; deeper dirs use `+`/`−`.
- For live demos, save a real `https://github.com/{owner}/{repo}` the token can read — not the fixture URL.

## MCP server (Sprint 5)

- Stdio (dev): `npm run mcp:stdio` / `make mcp-stdio`. **Client distribution:** Bun-compiled binary per OS/arch from GitHub Releases (ADR-051) — no Node/npm on client.
- Build binaries: `npm run mcp:build`. Release workflow uploads on `v*` tags.
- HTTP: `npm run mcp:http` / `make mcp-http` on `http://127.0.0.1:3041/mcp`.
- Auth: `MCP_AUTH_TOKEN` when set for HTTP (ADR-049/050). Open local mode when unset.
- CI: `MCP_AUTH_TOKEN=ci-mcp-auth-token`, `GITHUB_FIXTURE=1`.
- Tools: list_versions + get_key + install/update. **HTTP:** returns `packageUrl` + portable paths + instructions (ADR-054); AI extracts locally. **stdio:** writes directly.
- Guide: `/instructions`.
