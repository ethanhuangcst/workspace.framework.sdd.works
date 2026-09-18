# MCP Test Strategy and Plan

**Area:** MCP server (TRAN / MCPL / MCPK / MCPI / MCPU)
**Stories:** [`mcp-stories.md`](./mcp-stories.md) · **Design:** [`mcp-design.md`](./mcp-design.md)
**Quality bar:** common-test-strategy — critical path 100%, overall ≥80% where measurable.

---

## 1. Strategy

| Layer | Scope | Default CI | Live opt-in |
| --- | --- | --- | --- |
| **Unit** | Path map table validation, resolver, path-policy, path-detect (MCPI-05), LLM schema validation, idempotent update logic, sync job, package cache, package-fetch | Always | — |
| **Integration** | Tool contracts on in-process stdio fixture + HTTP transport; package REST API; fixture Qwen | Always | — |
| **E2E** | Real client (Cursor / Claude Code) over stdio or HTTP sibling process; sync job against real GitHub test repo | Manual / opt-in | `SDD_E2E_GITHUB_REPO` + `GITHUB_TOKEN`, live Qwen, real client |
| **Freshness regression** | ADR-055 install/sync defects (F1–F10 fixture; LE1–LE4 live) | Always (fixture); opt-in (live) | `npm run test:regression:freshness` |

**Principles**

- Prefer fixture LLM and fixture GitHub in default CI (no network secrets required). After a suite sets `GITHUB_FIXTURE` or overwrites `Setting.githubUrl`, restore the previous live values when tests finish.
- Fixture-green CI is not DoD. Marking MCP features Done requires an operator-verified live client path (stdio/HTTP against real keys and a real repo), not fixture-only contracts.
- Never assert on plaintext key values in logs; assert structured error codes and shape.
- Path allow-list and escape rejection are critical-path: 100% coverage.
- MCPI-05 deterministic detection is critical-path for Sprint 6: env var + `clientInfo.name` mapping + fallback chain.

---

## 2. Unit tests

| Module | Cases |
| --- | --- |
| `packages/sdd-paths` | Every client × OS resolves under HOME/USERPROFILE; no `..`; every client has `default`; trailing slashes consistent |
| `path-policy` | Accept allow-listed roots; reject `/`, `/etc`, `..`, escape after expand |
| `path-detect` (MCPI-05) | `detectClient` maps cursor / claude-code / aliases; unrecognized → `client_unknown`; env var overrides seed; config probe when present; missing env+config → seed; cache key stability |
| `path-resolve-llm` | Valid JSON schema accepted; low confidence → seed; escape path → `path_rejected`; fixture Qwen responses |
| `get-key` | Found → plaintext; missing → `not_found`; unauthorized → `unauthorized`; no other-key leakage |
| install / update | Uses `package-fetch` mock (not `package-resolve`); idempotent when `package_version` + `package_commit` match and files intact → `already_up_to_date`; same ref label + new commit SHA → reinstall; manifest files deleted → self-heal; missing `package_commit` → reinstall; `force: true` → reinstall; summary includes `resolution_source` |
| sync job | Initial sync stores files + manifest; same commit → unchanged; GitHub error preserves cache; new commit updates manifest |
| package cache | resolveCachedVersion: sync_pending, latest, version_not_found; openCachedPackageTar streams tarball |
| package-fetch | Override returns package or package_unavailable |

Commands: `npx vitest run packages/sdd-paths src/core src/app/api/sdd src/auth src/lib/keys-crypto.test.ts`.

---

## 3. Integration tests

| Scenario | Assert |
| --- | --- |
| stdio tool list | Three tools registered (no `sdd_get_key`); HTTP lists four tools; `serverInfo.name` = `framework.sdd.works` |
| HTTP unauthorized | Missing/wrong bearer → 401 / `unauthorized` before tool body |
| HTTP open mode (ADR-050) | Unset `MCP_AUTH_TOKEN` → tools callable on loopback |
| `sdd_list_versions` | HTTP reads sync cache; stdio fetches REST API; no key values; `paths_version` present |
| `sdd_get_key` | HTTP only; authorized plaintext for known `key_name` |
| Package API | `GET /api/sdd/versions` 200 after sync, 409 sync_pending; `GET /api/sdd/package` tarball + headers, 404 unknown version |
| Admin sync | `POST /api/admin/sync` triggers sync job (admin auth) |
| HTTP install (ADR-054) | Returns `packageUrl`, paths, manifest, instructions; no server disk writes |
| Agent setup (SETUP-01) | `GET /agent-setup` returns markdown with MCP URL |
| Install/update (stdio) | Writes local paths; fetches from REST API |
| Install with injected env (Sprint 6+) | `CLAUDE_CONFIG_DIR` / `CODEX_HOME` → `resolution_source: "env"` |

---

## 4. E2E (real clients)

Prerequisites: `npm run mcp:stdio` or `mcp:http` with Settings GitHub configured; portal running if keys needed.

| Scenario | Client | Assert |
| --- | --- | --- |
| List versions | Cursor HTTP MCP | Returns versions/inventory |
| Get key | Cursor HTTP MCP | Returns `key_value` for a seeded key |
| Install (Sprint 6+) | Cursor stdio | Files under allow-listed Cursor roots; summary has paths + `resolution_source` |
| Update same version | Cursor stdio | `already_up_to_date` |

---

## 5. Client path determination E2E (this Mac)

**Purpose.** Evaluate MCPI-05 on the operator’s macOS machine (`darwin`). Measure that the server picks the correct roots and reports `resolution_source` honestly.

**Environment (this Mac, verified 2026-09-17)**

| Signal | Observed |
| --- | --- |
| OS | `darwin` |
| Cursor home | `~/.cursor/` exists; **no** `~/.cursor/skills/` (skills live under `~/.claude/skills/` via Cursor→Claude compat alias) |
| Claude home | `~/.claude/skills/` populated (~41 skills); `CLAUDE_CONFIG_DIR` unset |
| CodeBuddy | `~/.codebuddy/` exists; skills from marketplace/plugins, not `~/.codebuddy/skills/` |
| Seed map default for Cursor | `~/.cursor/skills/`, `~/.cursor/rules/`, `~/.cursor/sdd/` |

**How to evaluate results**

1. Call the tool over **stdio** (so `process.env` and local FS are visible) with an explicit `client` / injected env for controlled cases.
2. Inspect the tool result JSON:
   - `resolution_source` ∈ `{ env, config, seed, llm }`
   - `paths.skills` / `paths.rules` / `paths.other` are absolute and under `$HOME`
3. After a successful write (when install is implemented), run:
   ```bash
   ls -la "$RESOLVED_SKILLS_ROOT"
   test -f "$RESOLVED_SKILLS_ROOT/<skill>/SKILL.md"
   ```
4. On failure cases, assert **no new files** under the candidate roots (snapshot `find` before/after or empty temp dirs).
5. Prefer temp dirs under `/tmp/sdd-path-e2e-*` for env-relocation tests so the operator home is not polluted.

### Test 1 — Cursor auto-detect (this session)

| Step | Action |
| --- | --- |
| Given | MCP connected from Cursor; `clientInfo.name` expected ≈ `cursor` |
| When | Call `sdd_install_framework` **without** `client` over stdio (or inspect detect-only helper if exposed) |
| Then | Internal client id = `cursor`; paths resolve (not `client_unknown`); `resolution_source` is `seed` or `llm` or `config` (not `env` unless Cursor gains an env var) |
| Mac check | Log `paths.skills`; expect `…/.cursor/skills/` from seed **or** document compat-alias behavior if detector prefers existing `~/.claude/skills/` |

### Test 2 — `CLAUDE_CONFIG_DIR` relocation

| Step | Action |
| --- | --- |
| Given | `mkdir -p /tmp/sdd-path-e2e-claude/skills` and export `CLAUDE_CONFIG_DIR=/tmp/sdd-path-e2e-claude` when starting `mcp:stdio` |
| When | Call `sdd_install_framework` with `client: "claude"` (or auto-detect as Claude Code) |
| Then | `resolution_source` = `env`; `paths.skills` starts with `/tmp/sdd-path-e2e-claude/skills` |
| Mac check | `ls /tmp/sdd-path-e2e-claude/skills` shows written `SKILL.md` dirs after install; tear down with `rm -rf /tmp/sdd-path-e2e-claude` |

### Test 3 — `CODEX_HOME` relocation

| Step | Action |
| --- | --- |
| Given | `mkdir -p /tmp/sdd-path-e2e-codex` and `CODEX_HOME=/tmp/sdd-path-e2e-codex` for the stdio process |
| When | Call `sdd_install_framework` with `client: "codex"` |
| Then | `resolution_source` = `env`; resolved roots under `/tmp/sdd-path-e2e-codex` |
| Mac check | Confirm no writes under default `~/.codex` or `~/.agents/skills` for this run |

### Test 4 — Seed fallback (no env, no useful config)

| Step | Action |
| --- | --- |
| Given | Unset relocating env vars; use `client: "cursor"`; Qwen fixture returns low confidence or is disabled |
| When | Call `sdd_install_framework` |
| Then | `resolution_source` = `seed`; paths match PATH-01 Cursor darwin defaults (`~/.cursor/skills/` expanded) |
| Mac check | Expanded path equals `$HOME/.cursor/skills/` |

### Test 5 — Unrecognized client

| Step | Action |
| --- | --- |
| Given | Fixture MCP client with `clientInfo.name` = `unknown-cli-xyz`; no `client` arg |
| When | Call `sdd_install_framework` |
| Then | Result code `client_unknown`; **no files written** |
| Mac check | `find /tmp/sdd-path-e2e-* -type f` unchanged; home Cursor/Claude dirs unchanged |

**Pass criteria (automated — Sprint 7 VERIF)**

- [x] Tests 2–3 prove env override wins over seed — `src/core/path-e2e.test.ts` + `path-detect.test.ts`
- [x] Test 4 proves seed when deterministic signals absent — `src/core/path-e2e.test.ts`
- [x] Test 5 proves fail-closed with zero writes — `src/core/path-e2e.test.ts`
- [x] Test 1 Cursor `clientInfo.name` mapping — `detectClient` unit tests (aliases)

---

## 6. Sync + package API E2E (opt-in)

Prerequisites: real GitHub test repo in `SDD_E2E_GITHUB_REPO`, `GITHUB_TOKEN`, operator server running.

| # | Scenario | Assert |
| --- | --- | --- |
| S1 | Initial sync | Files in `.data/sdd-packages/<sha>/`; manifest.json populated |
| S2 | New commit pushed to test repo → sync | New SHA dir; manifest updated |
| S3 | Skill renamed in test repo → sync | Cache inventory reflects rename |
| S4 | Skill deleted in test repo → sync | Removed from cache inventory |
| S5 | GitHub unavailable | sync_error; stale cache preserved |
| S6 | Same commit re-sync | status unchanged |
| S2–S5 (fixture) | Rename / delete / GitHub error | `src/core/sync/sync-scenarios.test.ts` (CI always) |
| A1 | GET /api/sdd/versions after sync | 200 with versions + inventory |
| A2 | GET /api/sdd/package?version=latest | 200 tarball; X-SDD-Commit header |
| E1 | stdio install after sync | Files under ~/.cursor/; manifest has package_commit |
| E2 | Push to test repo → sync → stdio update | Updated files appear |

Run opt-in (operator test repo):

```bash
SDD_E2E_GITHUB_REPO=https://github.com/ethanhuangcst/test.sdd \
GITHUB_TOKEN=... \
npx vitest run src/core/sync/sync-e2e.test.ts
```

Fixture layout in [test.sdd](https://github.com/ethanhuangcst/test.sdd): `skills/{tdd,a-tdd}/SKILL.md`, `rules/dod.mdc`, `agents/code-reviewer.md`, `workflows/new-feature.md`.

---

## 7. Freshness regression suite (ADR-055)

**Purpose.** Regression coverage for the defects where HTTP install returned `already_up_to_date` with deleted local files, or served stale cache after a repo update.

**Test repo:** [ethanhuangcst/test.sdd](https://github.com/ethanhuangcst/test.sdd) (`main` branch; skills `tdd`, `a-tdd`).

### 7.1 Fixture regression (default CI — no secrets)

Implementation: `src/core/sync/freshness-regression.test.ts` (+ route/unit companions).

| ID | Scenario | Given | When | Then |
| --- | --- | --- | --- | --- |
| **F1** | Local files deleted, same repo commit | Cache SHA-A; local manifest says SHA-A; skill dirs deleted | HTTP `sdd_install_framework` with `installed_commit` | **Not** `already_up_to_date`; `packageUrl` + `extract_recommended: true`; `local_commit_matches: true` |
| **F2** | Repo updated → auto sync on install | Cache SHA-OLD; live tip SHA-NEW | HTTP install | `ensurePackageCacheFresh` syncs; response `commitSha` = SHA-NEW; inventory reflects rename (e.g. `a-tdd`) |
| **F3a** | Auto sync failed, cache exists | Live ahead; sync returns `sync_error`; stale cache on disk | HTTP install | Still returns cached `packageUrl` (better stale than nothing) |
| **F3b** | Auto sync failed, no cache | Empty cache; GitHub unreachable | HTTP install | `sync_pending` |
| **F4a** | Scheduled sync interval | `GITHUB_TOKEN` set; server started | Advance clock 30 min × 2 | `runScheduledSync` called twice |
| **F4b** | Scheduled sync disabled | `GITHUB_TOKEN` unset | `startScheduledSyncInterval()` | No timer; no sync calls |
| **F5** | Repo/local commit mismatch | Local manifest SHA-OLD; cache refreshed to SHA-NEW | HTTP install with `installed_commit: SHA-OLD` | New `commitSha`; `local_commit_matches: false`; `cache_refresh: refreshed` |
| **F6** | Webhook push trigger | Valid HMAC; `push` event | `POST /api/github/webhook` | `syncFrameworkRepo` + `clearListVersionsCache` |
| **F7** | Cron backup trigger | Valid `CRON_SECRET` bearer | `POST /api/sync/cron` | `runScheduledSync` |
| **F8** | Live tip lookup fails | Cache exists; `resolveLatestLiveCommit` errors | `ensurePackageCacheFresh` | Falls back to full `syncFrameworkRepo` |
| **F9** | Stale cache advisory | `syncedAt` > 30 min ago | HTTP install | `cache_stale: true`; instructions mention stale cache |
| **F10** | Stdio self-heal (contrast) | stdio install; delete skill files; manifest intact | stdio `sdd_install_framework` | Reinstalls files; **not** `already_up_to_date` |
| **F11a** | Tarball bytes match unpacked | Real `pkg.tar.gz` built from cache | `GET /api/sdd/package` → extract | `skills/a-tdd/SKILL.md` in tarball = unpacked file |
| **F11b** | Content-only update (rename done) | Cache SHA-OLD `a-tdd`=`# atdd`; live SHA-NEW `# a-tdd` | HTTP install + package download | Extracted SKILL.md is `# a-tdd\n`, not `# atdd\n` |
| **F11c** | Stale bytes when SHA unchanged | Same SHA; old `# atdd` content | Package download | Still `# atdd` (documents expected stale behavior until push+sync) |

**Run (CI-safe):**

```bash
npm run test:regression:freshness
```

This runs fixture regression + webhook/cron/ensure-cache-fresh unit tests. Live GitHub cases skip when `SDD_E2E_GITHUB_REPO` / `GITHUB_TOKEN` unset.

### 7.2 Live GitHub regression (opt-in — test.sdd)

Implementation: `src/core/sync/sync-e2e.test.ts`.

| ID | Scenario | Assert |
| --- | --- | --- |
| **LE1** | Initial sync + idempotent re-sync | `status: synced` then `unchanged`; skills include `tdd`, `a-tdd` |
| **LE2** | Live tip matches cache after sync | `resolveLatestLiveCommit` SHA = manifest `latestCommit`; `ensurePackageCacheFresh` → `fresh` |
| **LE3** | Stale manifest SHA forced on disk | After `ensurePackageCacheFresh`, manifest restored to live SHA (`refreshed`) |
| **LE4** | HTTP install against live cache | Never `already_up_to_date`; always `packageUrl` + `extract_recommended` |
| **LE5** | **Content parity** with GitHub main | After sync, `unpacked/.../a-tdd/SKILL.md` bytes = raw GitHub `main` file |

**Run (operator machine with token):**

```bash
SDD_E2E_GITHUB_REPO=https://github.com/ethanhuangcst/test.sdd \
GITHUB_TOKEN=ghp_... \
npm run test:regression:freshness
```

### 7.3 Known gap (fixed in F11 / LE5)

Prior tests (F2, F5, LE1) asserted **skill folder names** (`a-tdd` vs `atdd`) and **commit SHA**, but not **file content bytes** inside the tarball. That missed the defect: folder renamed to `a-tdd` but `SKILL.md` still `# atdd` when cache lagged a content-only commit.

**Operator check:** if install renames folders but content looks old, compare:

```bash
curl -sL "https://raw.githubusercontent.com/ethanhuangcst/test.sdd/main/skills/a-tdd/SKILL.md"
cat .data/sdd-packages/$(jq -r .latestCommit .data/sdd-packages/manifest.json)/unpacked/skills/a-tdd/SKILL.md
```

If GitHub shows `# a-tdd` but cache shows `# atdd`, run `POST /api/admin/sync` (or wait for webhook/cron). If GitHub still shows `# atdd`, the content change was not pushed.

### 7.4 Manual operator scenarios (not automated)

Run after pushing to **test.sdd** when validating a release:

| Step | Action | Expected |
| --- | --- | --- |
| M1 | Push skill rename (`atdd` → `a-tdd`) to test.sdd | Webhook or 30-min cron refreshes cache; HTTP install returns new skill list |
| M2 | Delete `~/.cursor/skills/*` locally; run install in Cursor | AI receives `packageUrl`; runs `curl \| tar`; files restored |
| M3 | Change only `SKILL.md` text (same paths) | New commit SHA; install returns updated tarball |
| M4 | Stop `GITHUB_TOKEN` / block GitHub | Sync errors logged; existing cache still installable (F3a) |

### 7.5 Pass criteria

- [x] `npm run test:regression:freshness` green in CI (fixture layer) — verified 2026-09-18
- [x] LE1–LE5 green locally with `SDD_E2E_GITHUB_REPO` + `GITHUB_TOKEN` — verified 2026-09-18
- [x] F11a–F11b green in CI (tarball content assertions) — verified via `package-content.test.ts` in regression run
- [x] M1 rename + HTTP install inventory — `src/core/sync/sync-scenarios.test.ts` (fixture)
- [x] M2 force sync rematerializes Framework tree — `e2e/settings-framework.spec.ts` sync button

---

## 8. Out of scope for MCP tests

- Admin portal UI (see [`../admin-portal/app-test.md`](../admin-portal/app-test.md))
- Live Bailian Qwen spend in default CI
- Writing Server 2 disk from HTTP install (must assert packageUrl response, no local writes on server)
