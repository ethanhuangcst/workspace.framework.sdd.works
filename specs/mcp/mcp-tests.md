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

- Unit tests may inject an in-process GitHub double and must clear it after the test. The running server ignores `GITHUB_FIXTURE`. Production has no fixture port. After a suite overwrites `Setting.githubUrl`, restore the previous value when tests finish.
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
| `get-key` | Found → plaintext string only, not a tool error; missing or decrypt failure → text `not_found`, not a tool error ([MC-09](../issues-log.md)); unauthorized and empty name → tool error with code only; no other-key leakage |
| install / update | Uses `package-fetch` mock (not `package-resolve`); idempotent when `package_version` + `package_commit` match and files intact → `already_up_to_date`; same ref label + new commit SHA → reinstall; manifest files deleted → self-heal; missing `package_commit` → reinstall; `force: true` → reinstall; summary includes `resolution_source`; **ADR-057 / ADR-058 / ADR-059:** stdio writes `.sdd-installed.json` once with `pack_complete: true` and `files` entries that are pack file paths, not folder names; failed install does not set `pack_complete` true; no `framework.sdd.works.json`; `src`/`prisma` in the unpacked tree are not copied; `templates/` copies to `{client_root}/templates`; client-root scenarios C1–C8 and C2b |
| sync job | Initial sync stores files + manifest; same commit → unchanged; GitHub error preserves cache; new commit updates manifest |
| package cache | resolveCachedVersion: sync_pending, latest, version_not_found; openCachedPackageTar streams tarball |
| package-fetch | Override returns package or package_unavailable |

Commands: `npx vitest run packages/sdd-paths src/core src/app/api/sdd src/auth src/lib/keys-crypto.test.ts`.

---

## 3. Integration tests

| Scenario | Assert |
| --- | --- |
| stdio tool list | Two tools registered (`sdd_install_framework`, `sdd_update_framework`); no `sdd_get_key`; no `sdd_list_versions`; `serverInfo.name` = `framework.sdd.works` |
| HTTP unauthorized | Missing/wrong bearer → 401 / `unauthorized` before tool body |
| HTTP open mode (ADR-050) | Unset `MCP_AUTH_TOKEN` → tools callable on loopback |
| HTTP tool list | Three tools: install, update, `sdd_get_key`; `sdd_list_versions` absent ([ADR-063](../adr/ADR-063-unregister-sdd-list-versions.md)) |
| Versions REST (not MCP tool) | `GET /api/sdd/versions` reads sync cache; no key values; `paths_version` present; 409 when sync_pending |
| `sdd_get_key` | HTTP only. Known name: text is the secret only and `isError` is absent. Missing name: text is `not_found` and `isError` is absent. Unauthorized: `isError` true and code `unauthorized` |
| Package API | `GET /api/sdd/versions` 200 after sync, 409 sync_pending; `GET /api/sdd/package` tarball + headers, 404 unknown version |
| Admin sync | `POST /api/admin/sync` triggers sync job (admin auth) |
| HTTP install | No inventory returns `writer_required` and `packageUrl` on this server. Inventory returns a plan. No server disk writes. No git host in the result |
| HTTP install receipt (MCP-01) | An `apply` plan names the ledger path. The instruction writes the ledger last. The result does not say to extract an archive into the client root |
| Agent setup (SETUP-01) | `GET /setup` returns markdown with one URL entry and no `command`. `GET /agent-setup` redirects |
| Install/update (local program) | Posts the ledger and the accepted root. Copies planned paths from the pack on this server. Writes the ledger last |
| Install with injected env (Sprint 6+) | `CLAUDE_CONFIG_DIR` / `CODEX_HOME` → `resolution_source: "env"` |

---

## 4. E2E (real clients)

Prerequisites: `npm run mcp:stdio` or `mcp:http` with Settings GitHub configured; portal running if keys needed.

| Scenario | Client | Assert |
| --- | --- | --- |
| Versions API (not MCP tool) | HTTP `GET /api/sdd/versions` | Returns versions/inventory after sync; out of scope as a model tool call ([ADR-063](../adr/ADR-063-unregister-sdd-list-versions.md)) |
| Get key | Cursor HTTP MCP | Seeded key: result text is the secret only. Missing name: result text is `not_found` and the call is not a tool error |
| Install (Sprint 6+) | Cursor stdio | Files under allow-listed Cursor roots; summary has paths + `resolution_source` |
| Pack + ledger (Sprint 2 Feature-01) | Cursor stdio (temp home) | Pack folders only; `.sdd-installed.json` has `pack_complete: true` |
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

Fixture layout in [test.sdd](https://github.com/ethanhuangcst/test.sdd): `skills/{tdd,a-tdd}/SKILL.md`, `rules/sdd-dod.mdc`, `agents/code-reviewer.md`, `workflows/new-feature.md`.

---

## 7. Freshness regression suite (ADR-055)

**Purpose.** Regression coverage for the defects where HTTP install returned `already_up_to_date` with deleted local files, or served stale cache after a repo update.

**Test repo:** [ethanhuangcst/test.sdd](https://github.com/ethanhuangcst/test.sdd) (`main` branch; skills `tdd`, `a-tdd`).

### 7.1 Fixture regression (default CI — no secrets)

Implementation: `src/core/sync/freshness-regression.test.ts` (+ route/unit companions).

| ID | Scenario | Given | When | Then |
| --- | --- | --- | --- | --- |
| **F1** | Local files deleted, same repo commit | Cache SHA-A; ledger says SHA-A; a recorded file is in `missing` | HTTP `sdd_install_framework` with that inventory | Plan is `apply` and includes that path. The result is not `already_up_to_date` and does not say to extract an archive into the client root |
| **F2** | Repo updated → auto sync on install | Cache SHA-OLD; live tip SHA-NEW | HTTP install | `ensurePackageCacheFresh` syncs; response `commitSha` = SHA-NEW; inventory reflects rename (e.g. `a-tdd`) |
| **F3a** | Auto sync failed, cache exists | Live ahead; sync returns `sync_error`; cache age is 30 minutes or less | HTTP install | The young cache may still be returned. A cache older than 30 minutes returns `cache_stale` and no `packageUrl` |
| **F3b** | Auto sync failed, no cache | Empty cache; GitHub unreachable | HTTP install | `sync_pending` |
| **F4a** | Scheduled sync interval | `GITHUB_TOKEN` set; server started | Advance clock 30 min × 2 | `runScheduledSync` called twice |
| **F4b** | Scheduled sync disabled | `GITHUB_TOKEN` unset | `startScheduledSyncInterval()` | No timer; no sync calls |
| **F5** | Repo/local commit mismatch | Local manifest SHA-OLD; cache refreshed to SHA-NEW | HTTP install with `installed_commit: SHA-OLD` | New `commitSha`; `local_commit_matches: false`; `cache_refresh: refreshed` |
| **F6** | Webhook push trigger | Valid HMAC; `push` event | `POST /api/github/webhook` | `syncFrameworkRepo` + `clearListVersionsCache` |
| **F7** | Cron backup trigger | Valid `CRON_SECRET` bearer | `POST /api/sync/cron` | `runScheduledSync` |
| **F8** | Live tip lookup fails | Cache exists; `resolveLatestLiveCommit` errors | `ensurePackageCacheFresh` | Falls back to full `syncFrameworkRepo` |
| **F9** | Stale cache refused | `syncedAt` older than 30 minutes | HTTP install | Result code `cache_stale`. No write plan. No `packageUrl` |
| **F10** | Stdio self-heal (contrast) | stdio install; delete skill files; manifest intact | stdio `sdd_install_framework` | Reinstalls files; **not** `already_up_to_date` |
| **F11a** | Tarball bytes match unpacked | Real `pkg.tar.gz` built from cache | `GET /api/sdd/package` → extract | `skills/a-tdd/SKILL.md` in tarball = unpacked file |
| **F11b** | Content-only update (rename done) | Cache SHA-OLD `a-tdd`=`# atdd`; live SHA-NEW `# a-tdd` | HTTP install + package download | Extracted SKILL.md is `# a-tdd\n`, not `# atdd\n` |
| **F11c** | Stale bytes when SHA unchanged | Same SHA; old `# atdd` content | Package download | Still `# atdd` (documents expected stale behavior until push+sync) |

**Run (CI-safe):**

```bash
npm run test:regression:freshness
```

This runs fixture regression + webhook/cron/ensure-cache-fresh unit tests. Live GitHub cases skip when `SDD_E2E_GITHUB_REPO` / `GITHUB_TOKEN` unset.

### 7.6 Install ledger + allow-list + client-root scenarios (MCP-01 — Feature-01)

Fixture CI. Implement with `src/core/tools/install.test.ts`, HTTP install tests, and agent-setup route tests. Do not treat Feature-01 as Done until these pass.

| ID | Scenario | Given | When | Then |
| --- | --- | --- | --- | --- |
| **P1** | Stdio ledger after copy | Unpacked pack has `skills/tdd` and `templates/framework.sdd.works/x.md` | stdio `sdd_install_framework` | `.sdd-installed.json` exists; `pack_complete` true; `files` includes those paths; no `framework.sdd.works.json` |
| **P2** | Stdio no complete ledger on reject | Path would escape home | stdio install | `path_rejected`; no ledger with `pack_complete` true |
| **P3** | Non-pack folders ignored | Unpacked tree also has `src/app.ts` | stdio install | `{client_root}/src` does not exist |
| **P4** | Templates target | Pack has `templates/` | stdio install | Files under `{client_root}/templates/`, not `{client_root}/sdd/` |
| **P5** | HTTP ledger payload | Cache has pack | HTTP `sdd_install_framework` | Body has `manifest.pack_complete === true`, `manifestPath` ending `.sdd-installed.json`, instructions mention writing the ledger last; temp home unchanged |
| **P6** | HTTP still no already_up_to_date | Matching `installed_commit` | HTTP install | `packageUrl` present; manifest object still present |
| **C1** | First install keeps other skills | `samectx` and edited `tdd` present; no ledger | stdio install | `samectx` kept; `tdd` replaced; ledger lists `tdd`; `pack_complete` true |
| **C2** | Update keeps unlisted skill and files inside the skill folder | Ledger lists `skills/tdd/SKILL.md`; `samectx` and `my-notes.md` present | stdio update | `SKILL.md` replaced; directory not deleted; `samectx` and `my-notes.md` kept; new ledger lists the file path |
| **C2b** | Old folder name is not a directory delete | Ledger lists folder name `tdd`; `my-notes.md` inside it | stdio update | `skills/tdd` directory remains; `my-notes.md` kept; new ledger lists `skills/tdd/SKILL.md` |
| **C3** | Same commit leaves edit | Ledger main/abc; edited `tdd` | stdio install | `already_up_to_date`; edit stays |
| **C4** | Notes folder kept | `notes/ideas.md` present | stdio install | notes unchanged |
| **C5** | File-level keep | Ledger lists file paths; `my-notes.md` unlisted | stdio update | `my-notes.md` kept; obsolete pack file removed; new ledger is file-level |
| **C6a** | Missing `pack_complete`, same commit | Old ledger shape; edit present | stdio install | content kept; ledger rewritten with `pack_complete` true |
| **C6b** | Missing `pack_complete`, new commit | Old ledger; server def | stdio update | recorded files replaced; unrecorded kept; `pack_complete` true |
| **C7a** | `pack_complete` false, same commit | Flag false; files present | stdio install | `already_up_to_date`; flag stays false |
| **C7b** | `pack_complete` false, new commit | Flag false; server def | stdio update | copy; `pack_complete` true |
| **C8** | Download fails | Complete ledger present | stdio install with fetch error | files and ledger unchanged |
| **S1** | Agent-setup prompt | — | `GET /setup` | Markdown names `~/.sdd/sdd-mcp`, `command` entry, and fallback URL `https://sdd.works/mcp`. Body tells the agent not to download an executable and does not name a GitHub `releases/latest/download` URL. `GET /agent-setup` redirects to `/setup` ([ADR-061](../adr/ADR-061-setup-prompt-public-path.md)) |
| **S1 local** | Local URL rewrite | `PUBLIC_BASE_URL=http://127.0.0.1:3040` | `GET /setup` | Body sets `SDD_SERVER_URL` to that origin; fallback is `getMcpHttpUrl()` (default `http://127.0.0.1:3041/mcp`); no production `https://sdd.works/mcp` fallback |
| **B1** | Compiled host binary handshake | Host `dist/sdd-mcp-*` built with Bun | stdio `initialize` + `tools/list` | Tool list has install, update, list; no `sdd_get_key`. Process runs with PATH that has no Node, npm, or Bun |
| **B2** | Five build targets | `npm run mcp:build` | `dist/` | Files `sdd-mcp-darwin-arm64`, `sdd-mcp-darwin-x64`, `sdd-mcp-linux-arm64`, `sdd-mcp-linux-x64`, `sdd-mcp-windows-x64.exe` |
| **B3** | Setup has no binary download | — | `GET /setup` | Body does not contain `releases/latest/download`; body tells the agent not to download an executable |
| **B4** | Compiled binary writes pack ledger via fixture package server | Host binary + local `GET /api/sdd/package` fixture (gzip + `X-SDD-Commit` / `X-SDD-Version`; archive has `skills/spike/SKILL.md`) | stdio `sdd_install_framework` for `cursor` then `trae-cn` with temp `HOME`, `PATH=/usr/bin:/bin` | `~/.cursor/.sdd-installed.json` has `pack_complete: true` and `files` contain `skills/spike/SKILL.md`; skill file exists; no `framework.sdd.works.json`. `trae-cn` writes under `~/.trae-cn`, not `.cursor` |

### 7.2 Live GitHub regression (opt-in — test.sdd)

Implementation: `src/core/sync/sync-e2e.test.ts`.

| ID | Scenario | Assert |
| --- | --- | --- |
| **LE1** | Initial sync + idempotent re-sync | `status: synced` then `unchanged`; skills include `tdd`, `a-tdd` |
| **LE2** | Live tip matches cache after sync | `resolveLatestLiveCommit` SHA = manifest `latestCommit`; `ensurePackageCacheFresh` → `fresh` |
| **LE3** | Stale manifest SHA forced on disk | After `ensurePackageCacheFresh`, manifest restored to live SHA (`refreshed`) |
| **LE4** | HTTP install against live cache | With inventory, the result is a plan. It does not tell the agent to extract an archive into the client root. A cache older than 30 minutes returns `cache_stale` |
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
| M2 | Delete `~/.cursor/skills/*` locally; run install in Cursor | AI receives package via stdio primary or HTTP fallback; files restored; `.sdd-installed.json` has `pack_complete: true` |
| M3 | Change only `SKILL.md` text (same paths) | New commit SHA; install returns updated tarball |
| M4 | Stop `GITHUB_TOKEN` / block GitHub | Sync errors logged; existing cache still installable (F3a) |
| M5 | Feature-01 ledger | After a successful Cursor install | `{client_root}/.sdd-installed.json` has `pack_complete: true`; `src/` is not under `{client_root}` |

### 7.5 Pass criteria

- [x] `npm run test:regression:freshness` green in CI (fixture layer) — verified 2026-09-18
- [x] LE1–LE5 green locally with `SDD_E2E_GITHUB_REPO` + `GITHUB_TOKEN` — verified 2026-09-18
- [x] F11a–F11b green in CI (tarball content assertions) — verified via `package-content.test.ts` in regression run
- [x] M1 rename + HTTP install inventory — `src/core/sync/sync-scenarios.test.ts` (fixture)
- [x] M2 force sync rematerializes Framework tree — `e2e/settings-framework.spec.ts` sync button
- [x] P1–P4, P5–P6 Feature-01 install ledger + allow-list (stdio file-level ledger; HTTP returns ledger payload, no receipt)
- [x] C1, C4 first-install client-root scenarios
- [x] C5, C2b feature-06 update deletes recorded files only; old folder name is not a directory delete
- [x] C3, C6a, C7a feature-07 same commit does not replace file bytes
- [x] C2, C6b, C7b feature-08 new commit replaces recorded files and sets pack_complete
- [x] C8 feature-09 failed download leaves folder and ledger unchanged
- [x] S1 agent-setup stdio prompt body (feature-05) — markdown names `~/.sdd/sdd-mcp`, `command`, and HTTP fallback URL
- [x] S1 path (`backend-01`) — public `GET /setup` serves that markdown; `GET /agent-setup` redirects to `/setup`
- [x] S1 local (`backend-01`) — with local `PUBLIC_BASE_URL`, body rewrites pack base and MCP fallback URL
- [x] B1 feature-14 — compiled host binary handshake (install, update; no get_key). After [MCP-03](../product-backlog.md#L339) feature-08: no `sdd_list_versions` on tools/list either.
- [x] B2 feature-14 — five OS/arch build outputs
- [x] B3 feature-14 — `GET /setup` has no release-download instruction for the binary. Feature-80 replaces this rule: setup names the five GitHub Release assets. Do not treat B3 as the feature-80 contract.
- [x] B4 feature-14 — compiled host binary writes pack ledger via fixture package server (cursor + trae-cn)

---

## 8. Out of scope for MCP tests

- Admin portal UI (see [`../admin-portal/app-tests.md`](../admin-portal/app-tests.md))
- Live Bailian Qwen spend in default CI
- Writing Server 2 disk from HTTP install (must assert packageUrl response, no local writes on server)

---

<a id="9-sprint-9-mcp-06-and-mcp-07"></a>

## 9. Sprint 9 — MCP-06 and MCP-07 (feature-80, feature-82)

Human-readable SBIs: [`sprint-backlog.md`](../sprint-backlog.md#sprint-9) **ToDo** table. Stories: [`mcp-stories.md`](./mcp-stories.md#mcp-github-release), [`mcp-stories.md`](./mcp-stories.md#mcp-production-pack-sync).

### 9.1 feature-80 — Tagged release ships sdd-mcp on GitHub

Stories: [`mcp-stories.md`](./mcp-stories.md#mcp-github-release) **AC1–AC3**. Design: [`mcp-design.md`](./mcp-design.md) §2.1 **Publish the local program**.

| Check | Layer | Method |
| --- | --- | --- |
| Workflow uploads the five assets | unit | Assert [`.github/workflows/release.yml`](../../.github/workflows/release.yml) lists `dist/sdd-mcp-darwin-arm64`, `dist/sdd-mcp-darwin-x64`, `dist/sdd-mcp-linux-arm64`, `dist/sdd-mcp-linux-x64`, and `dist/sdd-mcp-windows-x64.exe`, and triggers on tag `v*` |
| Setup does not name a git host | API | `GET /setup` body does not contain `github.com` or `releases/latest/download`. `writer_required` `packageUrl` is `/api/sdd/package` on this server |
| Setup rejects any other host | API | The same body does not contain `Do not fetch a GitHub release asset` and does not name `github.com/ethanhuangcst/framework.sdd.works/releases` as the visitor download |
| Download failure path | API | The same body tells the agent to write the URL entry when the local program is missing. It does not name a git release asset |
| Real tag | operator | Push a `v*` tag or inspect the latest GitHub Release and confirm the five asset names |

Build updates `public/agent-setup/prompt.md` from the design server prompt, and replaces the assertion in `src/app/api/sdd/sdd-api.test.ts` that the body contains `Do not download an executable`.

- [x] **AC1** workflow file check green in Vitest (`src/mcp/github-release-workflow.test.ts`)
- [x] **AC2** and **AC3** `GET /setup` checks green in Vitest (`src/app/api/sdd/sdd-api.test.ts`)
- [ ] **AC1** confirmed on one real GitHub Release, with the five filenames listed above

### 9.2 feature-82 — Production serves the synced pack for install

| Check | Method |
| --- | --- |
| Sync populates cache | Admin Framework sync on staging or production; inspect `/data/sdd-packages` or equivalent |
| Lite allow-list in cache | File `lite-pack.allowlist.json` at pack root after sync |
| Lite APIs use cache | `GET /api/sdd/lite/files` after sync; **CE-LITE** unit tests green |
| Package GET uses cache | Existing sync job and package-fetch integration tests |

- [ ] **AC1–AC2** (feature-82) verified after production sync
- [ ] [Spec-seeds-15](../product-backlog.md#pb-97) marked **Done** when allow-list is confirmed in production tarball or cache

---

<a id="10-adr-129-url-plan"></a>

## 10. ADR-129 — URL plan and local writer

Stories: [`mcp-stories.md`](./mcp-stories.md#sdd-mcp-url-plan) **AC1–AC16** and [`sdd-mcp-prompt-setup`](./mcp-stories.md#sdd-mcp-prompt-setup) **AC6–AC7**. Design: [`mcp-design.md`](./mcp-design.md) Current steps. These rows are the install contract for MC-01 through MC-12. Prompt-setup AC numbers and url-plan AC numbers are separate.

| Check | Layer | Method |
| --- | --- | --- |
| First paste writes the URL only | API | `GET /setup` body tells the agent to write `"url": "https://sdd.works/mcp"` and no `command` (**AC1**) |
| Existing entry is replaced | API | The same body tells the agent to replace a `framework.sdd.works` entry that has `command` (**AC2**) |
| CodeBuddy and TRAE editions, current client scope | API | `GET /setup` is setup version `2026-10-09.v10`. The body names `CodeBuddy (international)` (CodeBuddy or WorkBuddy) and `CodeBuddy CN` (CodeBuddy CN or WorkBuddy CN), both with `~/.codebuddy/mcp.json`, and `.codebuddy/mcp.json` only when the user asked to configure this project. It names `TRAE (international)` with `~/.trae/mcp.json` and forbids the Trae CN Application Support path for that list. It names TRAE CN `Library/Application Support/Trae CN/User/mcp.json` and forbids `~/.trae-cn/mcp.json` and `~/.trae/mcp.json` for that user list. It tells the agent to change MCP config only for the agent running this session ([`sdd-mcp-prompt-setup`](./mcp-stories.md#sdd-mcp-prompt-setup) **AC6**, MC-10). Assert in [`sdd-api.test.ts`](../../src/app/api/sdd/sdd-api.test.ts) `should_return_agent_setup_markdown` |
| Install flags on the setup page | API | The same body names `--write`, `--client`, `--os`, `--client-root`, `SDD_SERVER_URL`, and `accepted_root`. `--client` is `codebuddy` for both CodeBuddy editions, `trae` for TRAE (international), and `trae-cn` for TRAE CN ([`sdd-mcp-prompt-setup`](./mcp-stories.md#sdd-mcp-prompt-setup) **AC7**, MC-11). |
| Setup sentences the test must assert | API | The same test asserts `WorkBuddy`, `WorkBuddy CN`, the project-file sentence for `.codebuddy/mcp.json`, and both Trae sentences that forbid the other path (prompt-setup **AC6**, MC-12). |
| Plan function | unit | Same ledger, same `missing`, same commit returns `noop`, `rewrite_ledger`, or `apply`. Matching version, commit, and no missing paths returns `noop` and does not list file writes (**AC3**) |
| Repair | unit | A path in `missing` returns `apply` and includes that path (**AC4**) |
| Root check | unit | A candidate outside the home directory, a path with `..`, or `/etc`, `/usr`, `/bin`, or `/sbin` returns `path_rejected` and writes nothing. A known client keeps the path-table root when the candidate differs (**AC5**, **AC9**, **AC10**) |
| Accepted root | API | `POST /api/sdd/install-plan` body includes the accepted root, the ledger, the client, the operating system, and `missing`. The body has no file contents (**AC11**) |
| Pack URL | API | No inventory and a cache younger than 30 minutes returns `writer_required`. `packageUrl` is on this server. The instructions name `--write`, `--client`, `--os`, `--client-root`, `SDD_SERVER_URL`, and `accepted_root`. The body has no git host (url-plan **AC8**, **AC15**) |
| Fixture pointer | operator | After a pack sync, `latestCommit` is a git commit from the pack repository. `GET /api/sdd/package?version=latest` is not the six-file fixture set. The portal process ignores `GITHUB_FIXTURE` (url-plan **AC12**) |
| Fixture pack | unit | Cached commit `sha-v1.0.0`, or the fixture file set, returns `fixture_pack` and writes no client file (url-plan **AC13**) |
| Built program | operator | `strings` on each `dist/sdd-mcp-*` and on `~/.sdd/sdd-mcp` shows `cache_stale`. `--write` against a cache older than 30 minutes copies no file (**AC14**) |
| Fallback contract | API | When the writer cannot run, the tool result has the plan, the instruction, and the pack URL. The instruction names planned paths and forbids extracting the archive into the client root. The call may include `accepted_root` (url-plan **AC6**, **AC7**) |
| Get secret stays on HTTP | integration | HTTP `tools/list` includes `sdd_get_key`. A missing name returns the text `not_found` and is not a tool error (url-plan **AC16**, MC-07). Section 11 covers the same return shape |
| Retired setup block | review | [`mcp-design.md`](./mcp-design.md) does not tell the agent to download a GitHub release file. The setup body is `public/agent-setup/prompt.md` only (MC-08) |
| Ledger input | unit | The plan function reads the ledger JSON and `missing`. It does not read file bodies |

Commands when this section is implemented: `npx vitest run src/core/tools src/app/api/sdd`.

- [ ] url-plan **AC1–AC2** setup markdown matches the URL contract
- [ ] prompt-setup **AC6** (MC-10, MC-12) setup markdown is version `2026-10-09.v10` and the test asserts WorkBuddy, WorkBuddy CN, the project-file rule, both Trae path bans, and the current-client scope sentence
- [ ] prompt-setup **AC7** (MC-11) setup markdown names `--write`, `--client`, `--os`, `--client-root`, `SDD_SERVER_URL`, and `accepted_root`
- [ ] url-plan **AC3–AC5** and **AC9–AC11** plan, root, and accepted-root checks green in Vitest
- [ ] url-plan **AC6–AC8** and **AC15** fallback and `writer_required` instructions green in Vitest
- [ ] url-plan **AC12–AC14** real pack pointer, `fixture_pack`, and built program checked before `--write`
- [ ] url-plan **AC16** (MC-07) HTTP tool list includes `sdd_get_key` and a missing name is `not_found` without a tool error
- [ ] MC-08 review: `mcp-design.md` does not tell the agent to download a GitHub release file

---

<a id="11-mc-09-get-key-not-found"></a>

## 11. MC-09 — `sdd_get_key` missing name

Stories: [`mcp-stories.md`](./mcp-stories.md#sdd-mcp-get-key) **AC1–AC4**. Design: [`mcp-design.md`](./mcp-design.md) **`sdd_get_key`**. Issue: [MC-09](../issues-log.md). Implemented in `get-key.ts` and `create-server.test.ts`. Sections 2–4 name the same checks in the running tables. MC-09 stays open until close confirm.

| Check | Layer | Method |
| --- | --- | --- |
| Existing key | integration | Authorized HTTP `sdd_get_key` for a seeded name. `isError` is absent. Text equals the secret and nothing else (**AC1**) |
| Missing name | integration | Authorized call for an unknown name. `isError` is absent. Text is `not_found`. The payload has no `error` object and no other key name or value (**AC2**) |
| Decrypt failure | unit | Stored ciphertext that does not decrypt returns the same result as a missing name (**AC2**) |
| Unauthorized | integration | `isError` is true. Text is `{"error":{"code":"unauthorized"}}`. The secret is absent (**AC3**) |
| Empty name | unit | `isError` is true. Code is `invalid_input` (**AC4**) |

Command: `npx vitest run src/mcp/create-server.test.ts src/mcp/tool-descriptions.test.ts` (13 passed, 09/Oct/2026).

- [x] **AC1** success text is the secret only
- [x] **AC2** missing name and decrypt failure are not tool errors
- [x] **AC3–AC4** unauthorized and empty name stay tool errors with a code and no message
