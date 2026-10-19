# Go-live plan — 2026-10-19 evening

> **Dated supplement** to [release.md](../../release.md). This release ships the current `origin/main` at **`9eae528c5e8c798b33b62796019c7335b3b72590`** (short **`9eae528`**). Operator handbook §6 deploy and §7 smoke stay authoritative; this plan only records tonight's values and what changed.

## What the new image adds

| Change | Detail | Commit |
| --- | --- | --- |
| Lite installer moves to **`GET /lite/install`** | Rewrite serves the same handler; **`GET /setup/install`** 3xx → `/lite/install`. Partner sentence and install version **`2026-10-19.v1`** ([ADR-134](../../adr/ADR-134-lite-install-public-path.md)) | `3f56293` |
| HTTP install client roots fixed | `workbuddy` normalizes to `codebuddy`; manual roots over HTTP reject only `..` and forbidden roots, never checked against the server home; `~` stays unexpanded ([MC-21](../../issues-log.md)) | `3f56293` |
| Legacy-host redirect loses the port | `framework.sdd.works` 301 was `https://sdd.works:3000/...` (unreachable through Cloudflare). Now `https://sdd.works/...` ([MC-22](../../issues-log.md)) | `9eae528` |

## Code gates (green)

- [x] `npm run typecheck`, `npm run lint`, `npm run build` — pass (2026-10-19)
- [x] Vitest **455 passed, 5 skipped**, 73 files (2026-10-19)
- [x] CI green on `3f56293` and `9eae528`
- [x] GHCR workflow succeeded on `9eae528c5e8c798b33b62796019c7335b3b72590` (2026-10-19T12:06Z run)
- [x] Middleware fix verified on a local production server: legacy host now 301s to `https://sdd.works/instructions` with no port

## Production state (audited 2026-10-19 20:00 UTC+8, old image)

| Endpoint | Result | Notes |
| --- | --- | --- |
| `GET /` | 200 | Portal works |
| `GET /setup` | 200 | Full setup markdown |
| `POST /mcp` (no bearer) | 200 | URL-only MCP stays ([MC-20](../../issues-log.md); keep `MCP_AUTH_TOKEN` unset) |
| `GET /setup/install` | 200, `Lite install version: 2026-10-07.v1` | Lite still at the old path |
| `GET /lite/install` | **404** | New path not on the old image |
| `GET framework.sdd.works/instructions` | **301 → `https://sdd.works:3000/instructions`** | Port 3000 times out through Cloudflare; MC-22 fix ships tonight |
| `GET /api/sdd/versions` | 200, pack commit `82af2e5…` | Sync is live |
| `GET /api/sdd/lite/files` | 200 | Lite manifest in cache |

## Operator steps tonight

1. **Record the current `IMAGE_TAG`** from Portainer stack `framework-sdd-works` env (rollback target). Last recorded deploy was **`4227f3e60af32e5a43d224ffb282ee25adc336d0`** (WA-23 Phase 2, 2026-10-11); confirm in Portainer before Recreate.
2. Set **`IMAGE_TAG=9eae528c5e8c798b33b62796019c7335b3b72590`** in the stack env ([`.portainer.env`](../20261008/.portainer.env) paste file also names it). Do not rotate any secret. `MCP_AUTH_TOKEN` stays unset.
3. Update the stack with **Pull** + **Recreate**. Wait for `framework-sdd-web` and `framework-sdd-mcp` running.
4. NPM → Proxy Host `sdd.works` → **Save**; repeat for `framework.sdd.works`. No other NPM or DNS change.
5. No admin re-sync needed: `/api/sdd/versions` already returns 200 and `/api/sdd/lite/files` returns 200 on the old image; the cache volume is shared. Re-run Force sync only if §7.3 smoke fails.

## Smoke (tonight's deltas first)

Handbook §7 stays. Tonight's specific checks:

```bash
# ADR-134
curl -sS https://sdd.works/lite/install | head -20
# Expect: Lite install version: 2026-10-19.v1; partner sentence https://sdd.works/lite/install

curl -sS -o /dev/null -w '%{http_code} %{redirect_url}\n' https://sdd.works/setup/install
# Expect: 3xx to /lite/install

# MC-22
curl -sI https://framework.sdd.works/instructions | grep -i location
# Expect: location: https://sdd.works/instructions   (no :3000)

# MC-21: no curl smoke; covered by unit tests §17 in mcp-tests.md. Optional manual: WorkBuddy CN sdd_install_framework with ~/.workbuddy.
```

Then §7.1 (portal, `www` 301, webhook not 301), §7.2 (`/setup`, `/setup/node`, catalog), §7.4 (MCP initialize, no bearer, **no 401** — `MCP_AUTH_TOKEN` stays unset), §7.6 (sibling stacks did not mass-restart).

## Rollback

1. Portainer → set **`IMAGE_TAG`** to the sha recorded in step 1 of Operator steps → Recreate + Pull.
2. Re-run §7.1, §7.2 lite checks on that tag. `/lite/install` returns 404 on the old image — that is the old behavior, not a failure of the rollback.
3. Do not revert DNS or NPM hosts. Postgres and the cache volume are not touched by an image rollback.

## Done when

- [x] `IMAGE_TAG` `9eae528c5e8c798b33b62796019c7335b3b72590` running on web and mcp (2026-10-19 evening)
- [x] `/lite/install` 200 with version `2026-10-19.v1`; `/setup/install` 307 to `/lite/install`
- [x] `framework.sdd.works` 301 has **no** port in `location`
- [x] §7.1, §7.2, §7.4 smokes pass; siblings unaffected (user browser confirm 2026-10-19)
- [x] Rollback sha recorded before Recreate (`4227f3e60af32e5a43d224ffb282ee25adc336d0`)

## References

- [release.md](../../release.md) — operator handbook
- [ADR-134](../../adr/ADR-134-lite-install-public-path.md) — lite public path decision
- [issues-log.md](../../issues-log.md) — MC-21, MC-22
- [20261010/go-live-plan.md](../20261010/go-live-plan.md) — previous dated supplement