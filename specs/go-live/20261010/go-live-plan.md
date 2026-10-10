# Go-live plan — task-02 (2026-10-10)

> **SBI:** [task-02 Go-live](../../sprint-backlog.md#sprint-9). **Goal:** production `https://sdd.works` serves the portal, setup, lite installer, node installer, package API, and MCP from the current code on `origin/main` at `91c0852`.

## Current state (audited 2026-10-10 18:05 UTC+8)

### Production (running old image `5e047ef` from 2026-10-08)

| Endpoint | Result | Notes |
| --- | --- | --- |
| `GET https://sdd.works/` | 200 | Portal works |
| `GET https://sdd.works/instructions` | 200 | Guide works |
| `GET https://sdd.works/setup` | **404** | WA-21 fix not deployed |
| `GET https://sdd.works/agent-setup` | 200 | Old fallback redirect |
| `GET https://sdd.works/setup/install` | **404** | Lite installer not on old image |
| `GET https://sdd.works/setup/node` | **404** | Node setup not on old image |
| `GET https://sdd.works/api/setup/node/catalog` | **404** | Node catalog not on old image |
| `GET https://sdd.works/api/sdd/versions` | 200 | `latestCommit` `df8a7ffc…` (real pack commit) |
| `GET https://sdd.works/api/sdd/package?version=latest` | 200 | Tarball works |
| `GET https://sdd.works/api/sdd/lite/files` | **404** | Lite files not on old image |
| `POST https://sdd.works/mcp` (no auth, correct Accept) | **200** | MCP works but **unauthenticated** |
| `GET https://framework.sdd.works/instructions` | **200** | Old image does not redirect to `sdd.works` |
| `GET https://www.sdd.works/` | 301 | Cloudflare redirect works |

### Code (new, committed, pushed to `origin/main`)

- **HEAD:** `91c0852c1b620fe0a8dc0e35be32c8c2742c5d8d`
- **Working tree:** clean (only untracked `.cursor/`, `samectx-notes/`, `sha-old/`, `sha-same/`, `~/`)
- **Gates (localhost, 2026-10-10):** typecheck pass, lint pass, build pass, Vitest 447 passed 5 skipped, Playwright 41 passed
- **CI (GitHub Actions, 2026-10-10):** green on `91c0852` (first green CI since `cc8a2c4` on 2026-09-25)

### What the new image adds over `5e047ef`

| Fix | Issue | Commit |
| --- | --- | --- |
| `GET /setup` returns 200 | [WA-21](../../issues-log.md) | `a9d94ea` |
| `GET /setup/install` returns 200 | Lite installer | `1a89290` |
| `GET /setup/node` returns 200 | Node installer | `1a89290` |
| `GET /api/setup/node/catalog` returns 200 | Node catalog | `1a89290` |
| `GET /api/sdd/lite/files` returns 200 | Lite files | `1a89290` |
| `framework.sdd.works` → 301 redirect | [feature-72](../../sprint-backlog.md#sprint-9) | `5e047ef` (partial) |
| HTTP-only install, nested templates | [ADR-132](../../adr/ADR-132-simplified-install-root-and-templates.md) | `1a89290` |
| Setup tab manual MCP JSON guide | ADR-133 | `a9d94ea` |
| Dev fixture GitHub port for E2E | GITHUB_FIXTURE | `a9d94ea` |
| CI green (lite files URL + KnowledgeFolderPanel test) | CI was red since 2026-09-25 | `91c0852` |

## Unknowns and blockers

| # | Unknown | Status | Who resolves | Blocks |
| --- | --- | --- | --- | --- |
| U1 | Has a new GHCR image been built for `91c0852`? | **Yes** — GHCR workflow succeeded on `91c0852` (2026-10-10) | Resolved | Deploy |
| U2 | Is `MCP_AUTH_TOKEN` set on production? | **No** — confirmed MCP responds without Bearer | Operator sets it in Portainer before deploy | Security |
| U3 | Are all P0 secrets set in Portainer? | Partial — `DATABASE_URL` and `GITHUB_TOKEN` work; `MCP_AUTH_TOKEN` missing; `SESSION_SECRET`, `KEYS_ENCRYPTION_KEY`, `ADMIN_SEED_PASSWORD` unknown | Operator verifies in Portainer | Deploy |
| U4 | Has the seed admin password been rotated? | Unknown | Operator checks after first login | Security |
| U5 | Are API keys created in the admin portal? | Unknown — `sdd_get_key` needs at least one key | Operator creates keys after deploy | MCP `sdd_get_key` smoke |
| U6 | Is `RESEND_API_KEY` set for password reset mail? | Unknown | Operator | P1 mail flows |
| U7 | Is `GITHUB_WEBHOOK_SECRET` set for pack auto-sync? | Unknown | Operator | P2 freshness |
| U8 | Is `lite-pack.allowlist.json` in the production cache? | Unknown — `/api/sdd/lite/files` 404 on old image; new image may need a re-sync | Operator runs Force sync after deploy | Lite installer |

## Pre-flight checklist (agent can run all of these)

### Code gates (already green)

- [x] `npm run typecheck` — exit 0 (2026-10-10)
- [x] `npm run lint` — exit 0 (2026-10-10)
- [x] `npm run build` — exit 0 (2026-10-10)
- [x] `npm test` — 447 passed, 5 skipped (2026-10-10)
- [x] `npx playwright test` — 41 passed (2026-10-10)
- [x] `origin/main` at `91c0852` (committed and pushed)
- [x] CI green on `91c0852` (GitHub Actions, 2026-10-10)

### Manual e2e §16 (MCP installer)

- [x] CodeBuddy CN: TC-1 through TC-6 pass
- [x] TRAE CN: TC-1 through TC-6 pass
- [x] TC-7 through TC-9 once-per-run pass
- [ ] Codex: TC-1 through TC-9 not verified (token exhausted; [MC-19](../../issues-log.md) open for canonical TC-1)

### Operator pre-flight (operator only)

- [ ] Confirm GHCR image exists for `91c0852` (GitHub Actions → GHCR)
- [ ] Confirm Portainer can pull the image by full sha tag
- [ ] Set `MCP_AUTH_TOKEN` in Portainer (P0 security blocker)
- [ ] Verify all P0 secrets present in Portainer stack env
- [ ] Confirm Portainer endpoint 野草云3 is reachable
- [ ] Confirm NPM Proxy Host `sdd.works` and `framework.sdd.works` exist

## Deploy procedure

### Step 1 — Build GHCR image (operator or CI)

1. Push to `main` already done (`91c0852`).
2. GitHub Actions workflow `ghcr.yml` builds on push to `main`.
3. Check https://github.com/ethanhuangcst/workspace.framework.sdd.works/actions for a green run on `91c0852`.
4. If no run triggered, manually dispatch the workflow on `main`.
5. Wait for green. Record the full git sha as `IMAGE_TAG`: `91c0852c1b620fe0a8dc0e35be32c8c2742c5d8d`.

**Done when:** GHCR package page shows the tag `91c0852c1b620fe0a8dc0e35be32c8c2742c5d8d`.

### Step 2 — Portainer pull check (operator)

1. Portainer → Registries → confirm `ghcr.io` pull works.
2. If 401, add a PAT with `read:packages` to the registry entry.

**Done when:** Portainer can pull the image by the full sha tag.

### Step 3 — Set missing secrets (operator, before deploy)

| Secret | Action | Why |
| --- | --- | --- |
| `MCP_AUTH_TOKEN` | Generate `openssl rand -base64 32`, set in Portainer mcp env | MCP is currently open; this is a P0 security blocker |
| `SESSION_SECRET` | Verify present (16+ chars) | Admin login |
| `KEYS_ENCRYPTION_KEY` | Verify present (64 hex chars) | Keys CRUD |
| `ADMIN_SEED_PASSWORD` | Verify present | Seed admin |
| `GITHUB_TOKEN` | Verify present (`contents:read`) | Pack sync |

**Done when:** all P0 secrets present in Portainer stack env.

### Step 4 — Portainer Recreate (operator)

1. Portainer → 野草云3 → Stacks → `framework-sdd-works`.
2. Set `IMAGE_TAG` to `91c0852c1b620fe0a8dc0e35be32c8c2742c5d8d` in stack env.
3. Update the stack with **Pull** + **Recreate** (both web and mcp share the image).
4. Wait until `framework-sdd-web` and `framework-sdd-mcp` are **running**.
5. Glance at other stacks — they should not mass-restart.

**Done when:** both containers healthy on the new image.

### Step 5 — NPM Save (operator)

1. NPM → Proxy Host `sdd.works` → **Save** (even if unchanged).
2. NPM → Proxy Host `framework.sdd.works` → **Save** (even if unchanged).
3. Do not delete the `framework.sdd.works` host.

**Done when:** `https://sdd.works/` is not 502; `/mcp` reaches the MCP container.

### Step 6 — Admin portal configuration (operator, after deploy)

1. Sign in at `https://sdd.works/login` with seed admin.
2. Settings → verify framework GitHub repo URL is saved (it was, since sync returned a real commit on the old image).
3. Framework → **Sync with git repository** (Force sync) to populate the new cache layout for the new image.
4. Wait for sync to complete.
5. Keys → create at least one API key (for `sdd_get_key` smoke).
6. Rotate the seed admin password if it was shared.

**Done when:** Framework page shows a tree; at least one key exists; admin password rotated.

## Smoke tests (agent can run all curl checks)

### S1 — Portal and hostname

```bash
curl -sI https://sdd.works/ | head -5
# Expect: 200

curl -sI https://sdd.works/instructions | head -5
# Expect: 200

curl -sI https://www.sdd.works/ | head -5
# Expect: 301 Location: https://sdd.works/

curl -sI https://framework.sdd.works/instructions | head -5
# Expect: 301 Location: https://sdd.works/instructions (new image redirect)

curl -sI -X POST https://framework.sdd.works/api/github/webhook | head -5
# Expect: NOT 301 (401/400/200 depending on signature)
```

### S2 — Setup, lite installer, node installer

```bash
curl -sS -H 'Accept: text/markdown' https://sdd.works/setup | head -40
# Expect: markdown; mcp URLs use https://sdd.works; no localhost

curl -sS -o /dev/null -w '%{http_code}\n' https://sdd.works/agent-setup
# Expect: 3xx to /setup

curl -sS https://sdd.works/setup/install | head -40
# Expect: Lite install version; GET /api/sdd/lite/files

curl -sS https://sdd.works/setup/node | head -40
# Expect: Node setup version; GET /api/setup/node/catalog

curl -sS https://sdd.works/api/setup/node/catalog | head -c 400; echo
# Expect: 200 JSON with node_lts and downloads
```

### S3 — Package API and sync

```bash
curl -sS https://sdd.works/api/sdd/versions | jq '.latestCommit, .syncedAt, .inventory'
# Expect: latestCommit is a real git SHA (not sha-v1.0.0)

curl -sI "https://sdd.works/api/sdd/package?version=latest" | grep -E 'HTTP|X-SDD-'
# Expect: 200 and X-SDD-Commit matches latestCommit

curl -sS https://sdd.works/api/sdd/lite/files | head -c 500; echo
# Expect: 200 JSON with files and downloads (after sync + allowlist)
# Fail: 409 sync_pending — run Framework sync again
# Fail: 404 lite_manifest_missing — pack repo lacks lite-pack.allowlist.json in cache
```

### S4 — MCP

```bash
export MCP_TOKEN='<from Portainer>'
curl -sS -X POST https://sdd.works/mcp \
  -H "Authorization: Bearer $MCP_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"smoke","version":"1.0"}},"id":1}'
# Expect: 200 with JSON-RPC result

# Without Bearer (after MCP_AUTH_TOKEN is set):
curl -sS -X POST https://sdd.works/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"smoke","version":"1.0"}},"id":1}'
# Expect: 401 unauthorized
```

### S5 — Learn tab

1. Open `https://sdd.works/?tab=learn-scrum-in-sdd` in a browser.
2. Iframe `src` is `https://learn.sdd.works/en/learn-embedded/`.
3. Fallback link opens `https://learn.sdd.works`.
4. Blank iframe with working fallback means WordPress `frame-ancestors` is missing.

### S6 — Coexistence

```bash
curl -sS -o /dev/null -w '%{http_code}\n' https://places.agent-mate.ai/v1/health
curl -sS -o /dev/null -w '%{http_code}\n' https://kb.agent-mate.ai/healthz
curl -sS -o /dev/null -w '%{http_code}\n' https://mypoke.trade/
# Expect: each 200 or its normal code; none should mass-restart
```

## Rollback

1. Portainer → set `IMAGE_TAG` to `5e047ef418d3e7c25c040c13bf1efd854319f81d` → Recreate + Pull.
2. Re-run S1, S3, S4 on that tag.
3. Do not point apex `@` at `38.55.199.241` (WordPress).
4. Do not remove Cloudflare `www` or `/en/home-en` redirects.
5. Postgres `framework_sdd` is not reverted by image rollback. Restore a DB backup only if a bad migration shipped.
6. Volume `framework_sdd_packages` may stay. Never `docker network rm portainer_network`.

## Done when

- [ ] Image `91c0852c1b620fe0a8dc0e35be32c8c2742c5d8d` is running on web and mcp
- [ ] S1 through S4 pass
- [ ] S5 confirmed or WordPress `frame-ancestors` ticket opened
- [ ] S6 confirmed (no mass-restart of sibling apps)
- [ ] `MCP_AUTH_TOKEN` set and MCP rejects missing Bearer
- [ ] Seed admin password rotated if the seed value was shared
- [ ] At least one API key created (if testing `sdd_get_key`)
- [ ] `https://sdd.works/api/sdd/lite/files` returns 200 (after Force sync)
- [ ] Pack install for end users is not required for this handbook

## References

- [release.md](../../release.md) — operator handbook (this plan is a dated supplement)
- [framework-sdd-works-deployment-instruction.md](../framework-sdd-works-deployment-instruction.md) — full deploy guide
- [20261008/portainer.md](../20261008/portainer.md) — compose reference
- [20261008/hostname-cutover-inventory.md](../20261008/hostname-cutover-inventory.md) — DNS and redirect state
- [mcp-tests.md §16](../../mcp/mcp-tests.md#16-manual-e2e-before-go-live) — manual e2e results
- [test-report-20261010.md](../../test-report-20261010.md) — automated test report
