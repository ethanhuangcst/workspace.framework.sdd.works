# MCP Test Strategy and Plan

**Area:** MCP server (TRAN / MCPL / MCPK / MCPI / MCPU)
**Stories:** [`mcp-stories.md`](./mcp-stories.md) · **Design:** [`mcp-design.md`](./mcp-design.md)
**Status (ADR-132):** HTTP-only install, no writer binary, bundled pack fallback, tarball URL delivery, server resolves root for known clients, `root_required` for unknown clients.
**Quality bar:** common-test-strategy — critical path 100%, overall ≥80% where measurable.

---

## 1. Strategy

| Layer | Scope | Default CI | Live opt-in |
| --- | --- | --- | --- |
| **Unit** | Path map table validation, resolver, path-policy, idempotent update logic, sync job, package cache, package-fetch, bundled pack fallback | Always | — |
| **Integration** | Tool contracts on HTTP transport; package REST API; tarball URL delivery | Always | — |
| **E2E** | Real client (Cursor / Claude Code) over HTTP; sync job against real GitHub test repo | Manual / opt-in | `SDD_E2E_GITHUB_REPO` + `GITHUB_TOKEN`, real client |
| **Freshness regression** | ADR-055 install/sync defects (F1–F11 fixture; LE1–LE5 live) | Always (fixture); opt-in (live) | `npm run test:regression:freshness` |

**Principles**

- Unit tests may inject an in-process GitHub double and must clear it after the test. The running server ignores `GITHUB_FIXTURE`. Production has no fixture port. After a suite overwrites `Setting.githubUrl`, restore the previous value when tests finish.
- Fixture-green CI is not DoD. Marking MCP features Done requires an operator-verified live client path (HTTP against real keys and a real repo), not fixture-only contracts.
- Never assert on plaintext key values in logs; assert structured error codes and shape.
- Path allow-list and escape rejection are critical-path: 100% coverage.
- Known-client root resolution and `root_required` for unknown clients are critical-path (ADR-132).

---

## 2. Unit tests

| Module | Cases |
| --- | --- |
| `packages/sdd-paths` | Every client × OS resolves under HOME/USERPROFILE; no `..`; every client has `default`; trailing slashes consistent |
| `path-policy` | Accept allow-listed roots; reject `/`, `/etc`, `..`, escape after expand |
| install root (ADR-132) | Known client with omitted `root` → seed-map root; known client with wrong `root` sent → still seed-map root (ignore); unknown client without `root` → `root_required`; unknown client with valid `root` → that root; invalid path → `path_rejected`. |
| `path-resolve-llm` | Retained for deferred server-side endpoint; not called from install (ADR-130 decision 10, ADR-131). Valid JSON schema accepted; low confidence → seed; escape path → `path_rejected` |
| tool descriptions (ADR-132, feature-93) | `sdd_install_framework` and `sdd_update_framework` descriptions name `client` and `os` and tell the agent to omit `root` for a known client; the `root` field description says to omit it to let the server resolve from the path map; descriptions resolve for `en`, `zh-Hans`, `zh-Hant` with no missing-key fallback; asserted in `tool-descriptions.test.ts` |
| `get-key` | Found → plaintext string only, not a tool error; missing or decrypt failure → text `not_found`, not a tool error ([MC-09](../issues-log.md)); unauthorized and empty name → tool error with code only; no other-key leakage |
| install / update | Uses `package-fetch` mock (not `package-resolve`); idempotent when `package_version` + `package_commit` match and files intact → `noop`; same ref label + new commit SHA → `apply`; manifest files deleted → self-heal; missing `package_commit` → reinstall; `force: true` → reinstall; **ADR-057 / ADR-059 / ADR-131 / ADR-132:** result includes tarball URL on this server; result does not include `writer_required`, `accepted_root`, or `root_warning`; agent writes `.sdd-installed.json` once with `pack_complete: true` and `files` entries that are pack file paths, not folder names; failed install does not set `pack_complete` true; no `framework.sdd.works.json`; `src`/`prisma` in the unpacked tree are not copied; `templates/` copies to `{client_root}/templates/framework.sdd.works/`; known client uses seed-map root; unknown client uses validated agent `root` after `root_required`; client-root scenarios C1–C8 and C2b |
| sync job | Initial sync stores files + manifest; same commit → unchanged **and updates `syncedAt`**; GitHub error preserves cache; new commit updates manifest |
| package cache | `resolveCachedVersion`: no manifest → `sync_pending`; missing commit dir or tar → `version_not_found`; happy path returns unpacked path. `openCachedPackageTar` streams tarball. Bundled fallback is install-only (`install-http.ts`), not lite or package REST |
| package-fetch | Override returns package or package_unavailable |
| bundled pack fallback (ADR-131) | Empty cache or fixture commit reads bundled pack under `pack.framework.sdd.works/`; result is `apply` with bundled files; result does not return `cache_empty`, `fixture_pack`, or `sync_pending` |
| os validation | Unknown `os` returns `os_unsupported`; valid os with no per-os entry falls to `default` |

Commands: `npx vitest run packages/sdd-paths src/core src/app/api/sdd src/auth src/lib/keys-crypto.test.ts`.

---

## 3. Integration tests

| Scenario | Assert |
| --- | --- |
| HTTP unauthorized | Missing/wrong bearer → 401 / `unauthorized` before tool body |
| HTTP open mode (ADR-050) | Unset `MCP_AUTH_TOKEN` → tools callable on loopback |
| HTTP tool list | Three tools: `sdd_install_framework`, `sdd_update_framework`, `sdd_get_key`; `sdd_list_versions` absent ([ADR-063](../adr/ADR-063-unregister-sdd-list-versions.md)) |
| Versions REST (not MCP tool) | `GET /api/sdd/versions` reads sync cache manifest only; no key values; `paths_version` present; empty cache → 409 `sync_pending` ([feature-82](./mcp-tests.md#15-feature-82-production-pack-sync) operator path fills cache) |
| `sdd_get_key` | HTTP only. Known name: text is the secret only and `isError` is absent. Missing name: text is `not_found` and `isError` is absent. Unauthorized: `isError` is true and code is `unauthorized` |
| Package API | After sync: `GET /api/sdd/versions` 200; `GET /api/sdd/package` tarball + `X-SDD-Commit` / `X-SDD-Version`; empty cache → 409 `sync_pending`; unknown version → 404. Cache-only (no bundled fallback on these routes) |
| Admin sync | `POST /api/admin/sync` triggers sync job (admin auth) |
| HTTP install | Agent sends `client`, `os`, `root` optional, `ledger`. Result is `noop`, `rewrite_ledger`, or `apply` with a tarball URL on this server. No `writer_required`. No `accepted_root`. No server disk writes. No git host in the result |
| HTTP install receipt (MCP-01) | An `apply` plan names the ledger. The instruction writes the ledger last. The result does not say to extract an archive into the client root |
| Bundled fallback (ADR-131) | Empty cache or fixture commit reads bundled pack under `pack.framework.sdd.works/`. Result is `apply` with bundled files. No `cache_empty`, `fixture_pack`, or `sync_pending` |
| Agent setup (SETUP-01) | `GET /setup` returns markdown with one URL entry and no `command`. No install section. `GET /agent-setup` redirects |
| Install root (ADR-132) | Known client: agent omits `root`; server uses seed-map root. Unknown client without `root`: `root_required`. Unknown client with `root`: server validates and uses it. Result includes the resolved root. No `root_warning` |

---

## 4. E2E (real clients)

Prerequisites: `npm run mcp:http` with Settings GitHub configured; portal running if keys needed.

| Scenario | Client | Assert |
| --- | --- | --- |
| Versions API (not MCP tool) | HTTP `GET /api/sdd/versions` | Returns versions/inventory after sync or bundled fallback; out of scope as a model tool call ([ADR-063](../adr/ADR-063-unregister-sdd-list-versions.md)) |
| Get key | Cursor HTTP MCP | Seeded key: result text is the secret only. Missing name: result text is `not_found` and the call is not a tool error |
| Install | Cursor HTTP MCP | Agent sends client and os; server resolves seed-map root. Files under allow-listed Cursor roots; summary has paths and resolved root |
| Pack + ledger | Cursor HTTP MCP (temp home) | Pack folders only; `.sdd-installed.json` has `pack_complete: true` |
| Update same version | Cursor HTTP MCP | `noop` |

---

## 5. Client path determination E2E (this Mac)

**Purpose.** Evaluate ADR-132 on the operator's macOS machine (`darwin`). Measure that known clients install at seed-map roots and unknown clients follow `root_required`.

**Environment (this Mac, verified 2026-09-17)**

| Signal | Observed |
| --- | --- |
| OS | `darwin` |
| Cursor home | `~/.cursor/` exists; **no** `~/.cursor/skills/` (skills live under `~/.claude/skills/` via Cursor→Claude compat alias) |
| Claude home | `~/.claude/skills/` populated (~41 skills); `CLAUDE_CONFIG_DIR` unset |
| CodeBuddy | `~/.codebuddy/` exists; skills from marketplace/plugins, not `~/.codebuddy/skills/` |
| Seed map default for Cursor | `~/.cursor/skills/`, `~/.cursor/rules/`, `~/.cursor/sdd/` |

**How to evaluate results**

1. The agent sends `client` and `os` over HTTP. Known clients omit `root`.
2. Inspect the tool result JSON:
   - `root` is absolute and under `$HOME`
   - Unknown clients without `root` return `root_required`
3. After a successful write (when install is implemented), run:
   ```bash
   ls -la "$RESOLVED_ROOT"
   test -f "$RESOLVED_ROOT/<skill>/SKILL.md"
   ```
4. On failure cases, assert **no new files** under the candidate roots (snapshot `find` before/after or empty temp dirs).
5. Prefer temp dirs under `/tmp/sdd-path-e2e-*` for env-relocation tests so the operator home is not polluted.

### Test 1 — Cursor auto-detect (this session)

| Step | Action |
| --- | --- |
| Given | MCP connected from Cursor; `clientInfo.name` expected ≈ `cursor` |
| When | Agent calls `sdd_install_framework` with client cursor and os darwin, omitting root |
| Then | Paths resolve (not `client_unknown`); result root matches seed-map Cursor darwin default |
| Mac check | Log `root`; expect `…/.cursor/` from seed **or** document compat-alias behavior if detector prefers existing `~/.claude/skills/` |

### Test 2 — Relocation limitation (documented, not auto-detected)

| Step | Action |
| --- | --- |
| Given | `CLAUDE_CONFIG_DIR` or `CODEX_HOME` points at a non-default directory |
| When | Agent calls `sdd_install_framework` with a known client and omits `root` |
| Then | The server still uses the seed-map root (ADR-132 known limitation) |
| Mac check | Pack files land under seed-map default, not the env-var directory |

### Test 3 — Seed map for known client

| Step | Action |
| --- | --- |
| Given | Unset relocating env vars; use `client: "cursor"` |
| When | Agent calls `sdd_install_framework` with client cursor |
| Then | `root` matches PATH-01 Cursor darwin default (`~/.cursor/` expanded) |
| Mac check | Expanded path equals `$HOME/.cursor/` |

### Test 4 — Unknown client

| Step | Action |
| --- | --- |
| Given | Client id not in the seed map; no `root` |
| When | Agent calls `sdd_install_framework` |
| Then | Result code `root_required`; **no files listed**. After the person supplies a valid `root`, retry installs there |
| Mac check | `find /tmp/sdd-path-e2e-* -type f` unchanged; home Cursor/Claude dirs unchanged |

**Pass criteria (automated — Sprint 7 VERIF)**

- [ ] ADR-132: known client omits `root` and installs at seed-map root (update `install.test.ts` / `path-e2e.test.ts` in feature-93)
- [ ] ADR-132: unknown client without `root` returns `root_required`
- [x] Legacy path-detect unit tests remain until code removes the chain in feature-93
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
| E1 | HTTP install after sync | Files under ~/.cursor/; manifest has package_commit |
| E2 | Push to test repo → sync → HTTP update | Updated files appear |

Run opt-in (operator test repo):

```bash
SDD_E2E_GITHUB_REPO=https://github.com/ethanhuangcst/test.sdd \
GITHUB_TOKEN=... \
npx vitest run src/core/sync/sync-e2e.test.ts
```

Fixture layout in [test.sdd](https://github.com/ethanhuangcst/test.sdd): `skills/{tdd,a-tdd}/SKILL.md`, `rules/sdd-dod.mdc`, `agents/code-reviewer.md`, `workflows/new-feature.md`.

---

## 7. Freshness regression suite (ADR-055)

**Purpose.** Regression coverage for the defects where HTTP install returned `noop` with deleted local files, or served stale cache after a repo update.

**Test repo:** [ethanhuangcst/test.sdd](https://github.com/ethanhuangcst/test.sdd) (`main` branch; skills `tdd`, `a-tdd`).

### 7.1 Fixture regression (default CI — no secrets)

Implementation: `src/core/sync/freshness-regression.test.ts` (+ route/unit companions).

| ID | Scenario | Given | When | Then |
| --- | --- | --- | --- | --- |
| **F1** | Local files deleted, same repo commit | Cache SHA-A; ledger says SHA-A; a recorded file is in `missing` | HTTP `sdd_install_framework` with that inventory | Plan is `apply` and includes that path. The result is not `noop` and does not say to extract an archive into the client root |
| **F2** | Repo updated → auto sync on install | Cache SHA-OLD; live tip SHA-NEW | HTTP install | `ensurePackageCacheFresh` syncs; response `commitSha` = SHA-NEW; inventory reflects rename (e.g. `a-tdd`) |
| **F3a** | Auto sync failed, cache exists | Live ahead; sync returns `sync_error`; cache exists | HTTP install | The existing cache is returned. The age gate is dropped (ADR-130 decision 5). A cache whose commit matches the live tip does not return `cache_stale` |
| **F3b** | Auto sync failed, no cache | Empty cache; GitHub unreachable | HTTP install | Falls back to bundled pack under `pack.framework.sdd.works/` (ADR-131). Result is `apply` with bundled files. No `cache_empty`, `fixture_pack`, or `sync_pending` |
| **F4a** | Scheduled sync interval | `GITHUB_TOKEN` set; server started | Advance clock 30 min × 2 | `runScheduledSync` called twice |
| **F4b** | Scheduled sync disabled | `GITHUB_TOKEN` unset | `startScheduledSyncInterval()` | No timer; no sync calls |
| **F5** | Repo/local commit mismatch | Local manifest SHA-OLD; cache refreshed to SHA-NEW | HTTP install with `installed_commit: SHA-OLD` | New `commitSha`; `local_commit_matches: false`; `cache_refresh: refreshed` |
| **F6** | Webhook push trigger | Valid HMAC; `push` event | `POST /api/github/webhook` | `syncFrameworkRepo` + `clearListVersionsCache` |
| **F7** | Cron backup trigger | Valid `CRON_SECRET` bearer | `POST /api/sync/cron` | `runScheduledSync` |
| **F8** | Live tip lookup fails | Cache exists; `resolveLatestLiveCommit` errors | `ensurePackageCacheFresh` | Falls back to full `syncFrameworkRepo` |
| **F9** | syncedAt updates on unchanged | Sync runs with the same commit as the cache | HTTP install | `syncedAt` updates to now; the install does not return `cache_stale` solely because of age (ADR-130 decision 5, MC-14) |
| **F10** | HTTP self-heal (contrast) | HTTP install; delete skill files; manifest intact | HTTP `sdd_install_framework` | Reinstalls files; result is **not** `noop` |
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
| **P1** | Ledger after copy | Unpacked pack has `skills/tdd` and `templates/x.md` | HTTP `sdd_install_framework` | Result includes ledger with `pack_complete` true and `files` listing those paths; no `framework.sdd.works.json` |
| **P2** | No complete ledger on reject | Path would escape home | HTTP install | `path_rejected`; no ledger with `pack_complete` true |
| **P3** | Non-pack folders ignored | Unpacked tree also has `src/app.ts` | HTTP install | `src` is not in the file list |
| **P4** | Templates target | Pack has `templates/framework.sdd.works/` | HTTP install | File list includes paths under `templates/framework.sdd.works/`, not under `sdd/` |
| **P5** | HTTP ledger payload | Cache has pack | HTTP `sdd_install_framework` | Body has `manifest.pack_complete === true`, ledger in response, instructions mention writing the ledger last; temp home unchanged |
| **P6** | HTTP still not noop | Matching `installed_commit` | HTTP install | `tarballUrl` present; manifest object still present |
| **C1** | First install keeps other skills | `samectx` and edited `tdd` present; no ledger | HTTP install | `samectx` kept; `tdd` replaced; ledger lists `tdd`; `pack_complete` true |
| **C2** | Update keeps unlisted skill and files inside the skill folder | Ledger lists `skills/tdd/SKILL.md`; `samectx` and `my-notes.md` present | HTTP update | `SKILL.md` replaced; directory not deleted; `samectx` and `my-notes.md` kept; new ledger lists the file path |
| **C2b** | Old folder name is not a directory delete | Ledger lists folder name `tdd`; `my-notes.md` inside it | HTTP update | `skills/tdd` directory remains; `my-notes.md` kept; new ledger lists `skills/tdd/SKILL.md` |
| **C3** | Same commit leaves edit | Ledger main/abc; edited `tdd` | HTTP install | `noop`; edit stays |
| **C4** | Notes folder kept | `notes/ideas.md` present | HTTP install | notes unchanged |
| **C5** | File-level keep | Ledger lists file paths; `my-notes.md` unlisted | HTTP update | `my-notes.md` kept; obsolete pack file removed; new ledger is file-level |
| **C6a** | Missing `pack_complete`, same commit | Old ledger shape; edit present | HTTP install | content kept; result is `rewrite_ledger`; ledger rewritten with `pack_complete` true |
| **C6b** | Missing `pack_complete`, new commit | Old ledger; server def | HTTP update | recorded files replaced; unrecorded kept; `pack_complete` true |
| **C7a** | `pack_complete` false, same commit | Flag false; files present | HTTP install | `noop`; flag stays false |
| **C7b** | `pack_complete` false, new commit | Flag false; server def | HTTP update | copy; `pack_complete` true |
| **C8** | Download fails | Complete ledger present | HTTP install with fetch error | files and ledger unchanged |
| **BF1** | Bundled fallback (ADR-131) | Empty cache or fixture commit | HTTP `sdd_install_framework` | Server reads bundled pack under `pack.framework.sdd.works/`; result is `apply` with bundled files; no `cache_empty`, `fixture_pack`, or `sync_pending` |
| **S1** | Agent-setup prompt | — | `GET /setup` | Markdown names one URL entry `https://sdd.works/mcp`, no `command`, no install section. Body does not name a git host. `GET /agent-setup` redirects to `/setup` ([ADR-061](../adr/ADR-061-setup-prompt-public-path.md)) |
| **S1 local** | Local URL rewrite | `PUBLIC_BASE_URL=http://127.0.0.1:3040` | `GET /setup` | Body uses that origin for the MCP URL; no production `https://sdd.works/mcp` fallback |

### 7.2 Live GitHub regression (opt-in — test.sdd)

Implementation: `src/core/sync/sync-e2e.test.ts`.

| ID | Scenario | Assert |
| --- | --- | --- |
| **LE1** | Initial sync + idempotent re-sync | `status: synced` then `unchanged`; skills include `tdd`, `a-tdd` |
| **LE2** | Live tip matches cache after sync | `resolveLatestLiveCommit` SHA = manifest `latestCommit`; `ensurePackageCacheFresh` → `fresh` |
| **LE3** | Stale manifest SHA forced on disk | After `ensurePackageCacheFresh`, manifest restored to live SHA (`refreshed`) |
| **LE4** | HTTP install against live cache | With inventory, the result is a plan. It does not tell the agent to extract an archive into the client root. An empty cache falls back to the bundled pack under `pack.framework.sdd.works/` (ADR-131) |
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
| M2 | Delete `~/.cursor/skills/*` locally; run install in Cursor | Agent receives tarball URL via HTTP; files restored; `.sdd-installed.json` has `pack_complete: true` |
| M3 | Change only `SKILL.md` text (same paths) | New commit SHA; install returns updated tarball |
| M4 | Stop `GITHUB_TOKEN` / block GitHub | Sync errors logged; existing cache still installable (F3a) |
| M5 | Feature-01 ledger | After a successful Cursor install | `{client_root}/.sdd-installed.json` has `pack_complete: true`; `src/` is not under `{client_root}` |

### 7.5 Pass criteria

- [x] `npm run test:regression:freshness` green in CI (fixture layer) — verified 2026-09-18
- [x] LE1–LE5 green locally with `SDD_E2E_GITHUB_REPO` + `GITHUB_TOKEN` — verified 2026-09-18
- [x] F11a–F11b green in CI (tarball content assertions) — verified via `package-content.test.ts` in regression run
- [x] M1 rename + HTTP install inventory — `src/core/sync/sync-scenarios.test.ts` (fixture)
- [x] M2 force sync rematerializes Framework tree — `e2e/settings-framework.spec.ts` sync button
- [x] P1–P4, P5–P6 Feature-01 install ledger + allow-list (HTTP returns ledger payload, no receipt)
- [x] C1, C4 first-install client-root scenarios
- [x] C5, C2b feature-06 update deletes recorded files only; old folder name is not a directory delete
- [x] C3, C6a, C7a feature-07 same commit does not replace file bytes
- [x] C2, C6b, C7b feature-08 new commit replaces recorded files and sets pack_complete
- [x] C8 feature-09 failed download leaves folder and ledger unchanged
- [x] S1 agent-setup prompt body (feature-05) — markdown names one URL entry `https://sdd.works/mcp`, no `command`, no install section
- [x] S1 path (`backend-01`) — public `GET /setup` serves that markdown; `GET /agent-setup` redirects to `/setup`
- [x] S1 local (`backend-01`) — with local `PUBLIC_BASE_URL`, body rewrites MCP URL to that origin
- [ ] BF1 bundled fallback (ADR-131) — empty cache or fixture commit reads bundled pack under `pack.framework.sdd.works/`; result is `apply` with bundled files; no `cache_empty`, `fixture_pack`, or `sync_pending`
- [ ] MC-18 templates nested path — install file list includes `templates/framework.sdd.works/{locale}/...`; after install `{client_root}/templates/framework.sdd.works/{locale}/` exists; `constants.json` and AI-read trio live under `templates/framework.sdd.works/`
- [ ] MC-16 ADR-132 root — known client omits `root`, uses seed-map root; unknown client gets `root_required`, then validated agent root
- [ ] MC-17 install page — `GET /install` serves markdown naming the MCP install sequence; `GET /setup` links to it from an After setup note; setup still has no install section

---

## 8. Out of scope for MCP tests

- Admin portal UI (see [`../admin-portal/app-tests.md`](../admin-portal/app-tests.md))
- Live Bailian Qwen spend in default CI (removed from install; deferred server-side endpoint only)
- Writing server disk from HTTP install (must assert tarball URL response, no local writes on server)
- Writer binary, stdio transport, per-OS builds (retired by ADR-131)

---

<a id="9-sprint-9-mcp-06-and-mcp-07"></a>

## 9. Sprint 9 — MCP-06 and MCP-07 (feature-80, feature-82)

Human-readable SBIs: [`sprint-backlog.md`](../sprint-backlog.md#sprint-9) **ToDo** table. Stories: [`mcp-stories.md`](./mcp-stories.md#mcp-github-release), [`mcp-stories.md`](./mcp-stories.md#mcp-production-pack-sync).

### 9.1 feature-80 — URL-only MCP setup; pack from this server

**Human check:** `GET /setup` registers the MCP URL only. Install uses HTTP tools and a tarball on this server ([§10](#10-adr-129-url-plan)). No GitHub Release binaries.

**Retired (ADR-131):** The old SBI was “push a `v*` tag and attach five `sdd-mcp-*` files.” That path is out of scope.

### 9.2 feature-82 — Production serves the synced pack for install

Human-readable SBI: [`sprint-backlog.md`](../sprint-backlog.md#sprint-9) **feature-82**. Stories: [`mcp-stories.md`](./mcp-stories.md#mcp-production-pack-sync). Design: [`mcp-design.md`](./mcp-design.md#25-production-pack-sync-feature-82--mcp-07). Detailed checks: [§15](#15-feature-82-production-pack-sync).

- [ ] **AC1–AC2** (feature-82) verified after production sync (§15 production pass criteria; lite route deploy pending)
- [ ] [Spec-seeds-15](../product-backlog.md#pb-97) marked **Done** when allow-list is confirmed in production cache unpack

---

<a id="15-feature-82-production-pack-sync"></a>

## 15. feature-82 / MCP-07 — Production pack sync (live cache for install)

Stories: [`mcp-stories.md`](./mcp-stories.md#mcp-production-pack-sync) **AC1–AC2**. Design: [`mcp-design.md`](./mcp-design.md#25-production-pack-sync-feature-82--mcp-07). Operator smoke: [`release.md`](../release.md) §7.3. Parent PBI: [MCP-07](../product-backlog.md#pb-105). Closes [Spec-seeds-15](../product-backlog.md#pb-97) when production cache holds `lite-pack.allowlist.json` at the pack unpack root.

**Scope:** After Admin → Framework → **Sync with git repository**, the shared cache volume holds the pack GitHub `main` (or configured ref) tree. Full MCP install, lite file links, and package GET routes read that cache. They do not call GitHub per request. MCP install still falls back to the bundled pack under `pack.framework.sdd.works/` when the cache is empty or holds a fixture commit ([ADR-131](../adr/ADR-131-http-only-install-bundled-fallback.md)); feature-82 verifies the **synced** path on production.

### Checks

| Check | Layer | Method |
| --- | --- | --- |
| Sync writes manifest + unpack | unit | `syncFrameworkRepo` in `src/core/sync/sync-job.test.ts` stores unpacked tree, tarball, and `manifest.json` with `latestCommit`, `inventory`, and `syncedAt` |
| Sync copies pack-root files | unit / integration | Materialized unpack includes top-level pack files (for example `lite-pack.allowlist.json`) when the GitHub tree contains them. Extend `sync-job.test.ts` or `sync-scenarios.test.ts` with one allow-list file at unpack root when implementing |
| Fixture commit refused for MCP install | unit | `isRefusedFixturePack` + `install-http.ts`: commit matching `sha-v\d+\.\d+\.\d+` or six-file stub unpack → `readBundledPack()` for MCP install only. Assert in `install.test.ts` / freshness **BF1** |
| Lite route is cache-only | integration | `GET /api/sdd/lite/files` in `sdd-api.test.ts`: seeded cache + allow-list → 200 with `downloads`; empty manifest → 409 `sync_pending`; unpack without allow-list → 404 `lite_manifest_missing`; invalid allow-list → 422 `lite_manifest_invalid` (no empty `files` success) |
| Package route is cache-only | integration | `GET /api/sdd/package` and `GET /api/sdd/versions` use `resolveCachedVersion` / manifest only; empty cache → 409 `sync_pending`. Assert in `sdd-api.test.ts` or `cache.test.ts` |
| Admin sync trigger | integration / E2E | `POST /api/admin/sync` (admin auth) runs `syncFrameworkRepo`. Playwright: [`e2e/settings-framework.spec.ts`](../../e2e/settings-framework.spec.ts) sync button (portal module) |
| Production commit is real | operator | After production sync, `GET https://sdd.works/api/sdd/versions` → 200; `latestCommit` is a git SHA from the pack repo, not `sha-v1.0.0` or other fixture id. `GITHUB_FIXTURE` unset in Portainer |
| Allow-list in production cache | operator | On the server, under `SDD_PACKAGE_CACHE_DIR` (production: `/data/sdd-packages`), the unpack dir for `latestCommit` contains `lite-pack.allowlist.json` at the pack root |
| Lite links after sync | operator | `curl -sS https://sdd.works/api/sdd/lite/files` → 200; body lists allow-listed paths and same-origin `downloads` |
| Full install uses synced cache | operator / E2E | After sync, HTTP `sdd_install_framework` tarball and file list match cache inventory (not the six-file fixture set). Optional: compare one skill path bytes to GitHub `main` ([freshness LE5](./mcp-tests.md#6-live-e2e-github-test-repo-opt-in)) |
| No per-request GitHub | review | Lite and package route handlers import cache helpers only, not live GitHub clients |

### Pass criteria — CI (automated)

- [x] Sync job stores unpack, tarball, and manifest (`sync-job.test.ts`, including `should_copy_lite_pack_allowlist_at_unpack_root`)
- [x] Root allow-list file maps to manifest `inventory.other` (`manifest.test.ts`)
- [x] Fixture commit → MCP install `pack_source: bundled`; real commit → `pack_source: cache` (`install.test.ts`)
- [x] Lite route cache-only errors and success paths (`sdd-api.test.ts`)
- [x] Package and versions routes cache-only (`cache.test.ts`, `sdd-api.test.ts`)
- [x] Fixture pack guard (`fixture-pack.test.ts`, freshness **F3b**)

### Pass criteria — production (operator)

- [x] `GET /api/sdd/versions` → 200; `latestCommit` is a real pack-repo commit (2026-10-10: `df8a7ffc823fbde9c31630f4798c9de30ed72692`, not `sha-v1.0.0`)
- [x] Manifest `inventory.other` lists `lite-pack.allowlist.json` (same probe)
- [x] `GET /api/sdd/package?version=latest` → 200; `X-SDD-Commit` matches `latestCommit` (same probe)
- [ ] Admin Framework sync re-run after this deploy (last `syncedAt` 2026-10-09; re-sync optional before close)
- [ ] `GET /api/sdd/lite/files` → 200 JSON on production (2026-10-10: **404** HTML; route missing on deployed image — ship a GHCR image that includes `src/app/api/sdd/lite/*`, then re-smoke)
- [ ] MCP full install on production serves pack files from synced cache (operator or E2E evidence)
- [ ] Parent [Spec-seeds-15](../product-backlog.md#pb-97) **Done** when allow-list is confirmed in production unpack and lite route returns 200

### Commands (CI)

```bash
npx vitest run src/core/sync/sync-job.test.ts src/core/sync/cache.test.ts src/core/sync/fixture-pack.test.ts src/core/sync/manifest.test.ts src/app/api/sdd/sdd-api.test.ts
npx vitest run src/core/tools/install.test.ts -t "should_use_cache_pack_source_for_a_real_commit|should_refuse_a_fixture_port_commit"
npx vitest run src/core/sync/freshness-regression.test.ts -t F3b
```

Operator commands: [`release.md`](../release.md) §7.3.

---

<a id="10-adr-129-url-plan"></a>

## 10. ADR-129 / ADR-130 / ADR-131 — URL plan, HTTP-only install, bundled fallback

Stories: [`mcp-stories.md`](./mcp-stories.md#sdd-mcp-url-plan) **AC1–AC16**, [`sdd-mcp-prompt-setup`](./mcp-stories.md#sdd-mcp-prompt-setup) **AC1–AC7**. Design: [`mcp-design.md`](./mcp-design.md). ADR-131 supersedes ADR-130 decisions 3, 4, 6. ADR-131 retires ADR-051, ADR-058. Prompt-setup AC numbers and url-plan AC numbers are separate.

| Check | Layer | Method |
| --- | --- | --- |
| First paste writes the URL only | API | `GET /setup` body tells the agent to write `"url": "https://sdd.works/mcp"` and no `command` (**AC1**) |
| Existing entry is replaced | API | The same body tells the agent to replace a `framework.sdd.works` entry that has `command` (**AC2**) |
| Setup is URL only, no install section | API | `GET /setup` is setup version `2026-10-09.v11`. The body has no install section. It does not name `--write`, `--client`, `--os`, `--client-root`, `SDD_SERVER_URL`, or `accepted_root` (ADR-131, prompt-setup **AC6**). The body names `CodeBuddy (international)` (CodeBuddy or WorkBuddy) and `CodeBuddy CN` (CodeBuddy CN or WorkBuddy CN), both with `~/.codebuddy/mcp.json`, and `.codebuddy/mcp.json` only when the user asked to configure this project. It names `TRAE (international)` with `~/.trae/mcp.json` and forbids the Trae CN Application Support path for that list. It names TRAE CN `Library/Application Support/Trae CN/User/mcp.json` and forbids `~/.trae-cn/mcp.json` and `~/.trae/mcp.json` for that user list. It tells the agent to change MCP config only for the agent running this session (MC-10). Assert in [`sdd-api.test.ts`](../../src/app/api/sdd/sdd-api.test.ts) `should_return_agent_setup_markdown` |
| Install tool result gives tarball URL | API | The `sdd_install_framework` tool result includes a tarball URL on this server. It does not name `--write`, `--client`, `--os`, `--client-root`, `SDD_SERVER_URL`, or `accepted_root` (ADR-131, prompt-setup **AC7**, MC-11). It does not name a git host |
| Setup sentences the test must assert | API | The same test asserts `WorkBuddy`, `WorkBuddy CN`, the project-file sentence for `.codebuddy/mcp.json`, and both Trae sentences that forbid the other path (prompt-setup **AC6**, MC-12) |
| Plan function | unit | Same ledger, same `missing`, same commit returns `noop`, `rewrite_ledger`, or `apply`. Matching version, commit, and no missing paths returns `noop` and does not list file writes (**AC3**) |
| Repair | unit | A path in `missing` returns `apply` and includes that path (**AC4**) |
| Root check | unit | A path outside the home directory, a path with `..`, or `/etc`, `/usr`, `/bin`, or `/sbin` returns `path_rejected` and lists no files. Known client: seed-map root, omit `root`. Unknown client without `root`: `root_required`. Unknown client with `root`: validate (**AC5**, **AC9**, **AC10**, ADR-132) |
| Plan request root | API | Known client body has client, os, ledger; no `root`. Unknown client after `root_required` includes validated `root`. No file contents (**AC11**, ADR-132) |
| Tarball URL | API | Known client sends `client`, `os`, `ledger` (no `root`). Unknown client sends `root` after `root_required`. A non-empty cache returns `apply` with a tarball URL on this server. The result does not include `writer_required` or `accepted_root`. The body has no git host (url-plan **AC8**, **AC15**, ADR-132) |
| Bundled fallback | API | An empty cache or fixture commit reads the bundled pack under `pack.framework.sdd.works/`. The result is `apply` with bundled files. The result does not return `cache_empty`, `fixture_pack`, or `sync_pending` (ADR-131, url-plan **AC8b**) |
| Fixture pointer | operator | After a pack sync, `latestCommit` is a git commit from the pack repository. `GET /api/sdd/package?version=latest` is not the six-file fixture set. The portal process ignores `GITHUB_FIXTURE` (url-plan **AC12**) |
| Fixture pack falls back | unit | Cached commit `sha-v1.0.0`, or the fixture file set, falls back to the bundled pack under `pack.framework.sdd.works/`. The result is `apply` with bundled files. No client file is written from the fixture (url-plan **AC13**, ADR-131) |
| No writer binary | review | No `dist/sdd-mcp-*` files. No `~/.sdd/sdd-mcp`. No writer binary build step. The result includes a tarball URL and the file list (**AC14**, ADR-131) |
| syncedAt on unchanged | unit | A sync with the same commit as the cache updates `syncedAt` to now. The install does not return `cache_stale` solely because of age (ADR-130 decision 5, MC-14) |
| Agent writes listed files | API | The tool result has the plan, the tarball URL, and the ledger. The instruction names planned paths and forbids extracting the archive into the client root. The agent writes the ledger last (url-plan **AC6**, **AC7**, ADR-131) |
| Get secret stays on HTTP | integration | HTTP `tools/list` includes `sdd_get_key`. A missing name returns the text `not_found` and is not a tool error (url-plan **AC16**, MC-07). Section 11 covers the same return shape |
| Retired setup block | review | [`mcp-design.md`](./mcp-design.md) does not tell the agent to download a GitHub release file. The setup body is `public/agent-setup/prompt.md` only (MC-08) |
| Ledger input | unit | The plan function reads the ledger JSON and `missing`. It does not read file bodies |
| LLM removed from install | review | No writer binary, no stdio program. The seed map is the single path source (ADR-130 decision 10, ADR-131) |
| Tool description text (ADR-132, feature-93, MC-16) | unit | `sdd_install_framework` and `sdd_update_framework` descriptions name `client` and `os` and tell the agent to omit `root` for a known client; the `root` field description says to omit it to let the server resolve from the path map; descriptions resolve for `en`, `zh-Hans`, `zh-Hant` with no missing-key fallback. Assert in `tool-descriptions.test.ts` |

Commands when this section is implemented: `npx vitest run src/core/tools src/app/api/sdd`.

- [ ] url-plan **AC1–AC2** setup markdown matches the URL contract
- [x] prompt-setup **AC6** (MC-10, MC-12) setup markdown is version `2026-10-09.v11`, has no install section, and the test asserts WorkBuddy, WorkBuddy CN, the project-file rule, both Trae path bans, and the current-client scope sentence
- [ ] prompt-setup **AC7** (MC-11) the install tool result gives a tarball URL; it does not name `--write`, `--client`, `--os`, `--client-root`, `SDD_SERVER_URL`, or `accepted_root`; `GET /setup` does not name any of those flags
- [ ] url-plan **AC3–AC5** and **AC9–AC10** plan and root checks green in Vitest
- [ ] url-plan **AC11** plan request carries root optional; server uses seed-map root for known clients, validates agent root for unknown clients
- [ ] url-plan **AC6–AC8** and **AC15** tarball URL and agent-writes-listed-files green in Vitest
- [ ] url-plan **AC8b** bundled fallback green in Vitest (ADR-131)
- [ ] url-plan **AC12–AC13** real pack pointer and fixture-pack falls back to bundled
- [ ] url-plan **AC14** no writer binary to build or version (ADR-131)
- [ ] syncedAt updates on unchanged commit (ADR-130 decision 5, MC-14) — in `sync-job.ts`, when `existing.latestCommit === commitSha` and `!force`, rewrite the manifest with `syncedAt: now` before returning `unchanged`
- [ ] url-plan **AC16** (MC-07) HTTP tool list includes `sdd_get_key` and a missing name is `not_found` without a tool error
- [ ] MC-08 review: `mcp-design.md` does not tell the agent to download a GitHub release file
- [ ] ADR-131 review: no writer binary, no stdio transport, no `~/.sdd/` directory
- [ ] Tool description text (ADR-132, feature-93, MC-16): `sdd_install_framework` and `sdd_update_framework` descriptions name `client` and `os` and tell the agent to omit `root` for a known client; `root` field description says to omit it; descriptions resolve for `en`, `zh-Hans`, `zh-Hant` with no missing-key fallback

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

---

## 12. feature-90 / MCP-08 — Setup and pack install backend module boundary

Stories: [`mcp-stories.md`](./mcp-stories.md#sdd-mcp-module-boundary) **AC1–AC5**. Design: [`mcp-design.md`](./mcp-design.md) **§2.0 Code module boundary**. The boundary is enforced by a static import check and by handler behavior tests. Section 2 unit rows and section 3 integration rows name the same checks in the running tables.

| Check | Layer | Method |
| --- | --- | --- |
| Setup backend import boundary | unit | An import-boundary test fails when any file under `src/app/api/agent-setup`, `src/mcp/setup-*`, `src/mcp/paste-sentences.ts`, or `src/mcp/node-setup-catalog.ts` imports from `src/core/tools` or `src/core/sync` (**story 1 AC1**) |
| `GET /setup` handler behavior | unit | The handler returns setup markdown and does not call `composeInstallPlan`, `apply-plan`, or `package-fetch` functions, and does not read the pack cache or bundled pack (**story 1 AC2**) |
| Pack install backend import boundary | unit | The import-boundary test fails when any file under `src/core/tools` or `src/core/sync` imports from `src/mcp/setup-markdown`, `src/mcp/setup-paths`, `src/mcp/paste-sentences`, `src/mcp/node-setup-catalog`, or `src/mcp/brand` (**story 2 AC1**) |
| `sdd_install_framework` handler behavior | unit | The handler resolves the root, builds the plan, and returns a tarball URL, and does not call setup-markdown, paste-sentences, or node-setup-catalog functions; the result has no setup markdown content (**story 2 AC2**) |
| Shared wiring point | unit | The import-boundary test confirms only `src/mcp/create-server.ts` and `src/mcp/http-server.ts` import from both modules; no other file imports from both (**story 3 AC1**) |

Command: `npx vitest run src/mcp/module-boundary.test.ts` (to be added in implementation).

- [x] **AC1** setup backend has no pack install imports
- [x] **AC2** `GET /setup` does not call install functions
- [x] **AC3** pack install backend has no setup imports
- [x] **AC4** `sdd_install_framework` does not call setup functions
- [x] **AC5** only the MCP server entry imports from both modules

---

<a id="13-mcp-09-install-root"></a>

## 13. feature-93 / feature-94 / MCP-09 — Simplified install root (ADR-132)

Stories: [`mcp-stories.md`](./mcp-stories.md) `sdd-mcp-path-map` AC2–AC2c, `sdd-mcp-cross-client` AC2, `sdd-mcp-path-detect` story 2 AC1–AC3, `sdd-mcp-url-plan` AC6/AC9–AC11. Design: [`mcp-design.md`](./mcp-design.md) §2.2 step 5, §4 Path resolution, §3 failure codes. ADR: [ADR-132](../adr/ADR-132-simplified-install-root-and-templates.md). Issues: [MC-16](../issues-log.md), [MC-18](../issues-log.md), [MC-15](../issues-log.md).

feature-93 owns the known-client path: server uses seed-map root, ignores agent-sent `root`, templates land at `templates/framework.sdd.works/`, tool text says send `client` and `os`. feature-94 owns the unknown-client path: `root_required` when `root` absent, validate when present. The two SBIs share one install-root module; tests below name which SBI owns each check.

### feature-93 — Known client install

| Check | Layer | Method | SBI |
| --- | --- | --- | --- |
| Known client omits `root` → seed-map root | unit | `install.test.ts`: call with `client: "cursor"`, `os: "darwin"`, no `root`. Result `root` equals seed-map `~/.cursor` expanded. `resolution_source` is `seed`. No `root_warning` (feature-93) | feature-93 |
| Known client sends wrong `root` → server ignores it | unit | `install.test.ts`: call with `client: "cursor"`, `os: "darwin"`, `root: "/tmp/wrong"`. Result `root` still equals seed-map root. No `path_rejected` (feature-93) | feature-93 |
| Templates nested path | unit | `bundled-pack.test.ts` + `install.test.ts`: pack `templates/` holds `framework.sdd.works/` subfolder. `inventoryFromUnpacked` lists `templates/framework.sdd.works/{locale}/...`. After install `{client_root}/templates/framework.sdd.works/{locale}/` exists. `constants.json` and AI-read trio live under `templates/framework.sdd.works/` (MC-18, MC-15) | feature-93 |
| Tool descriptions name `client` and `os` | unit | `tool-descriptions.test.ts`: `sdd_install_framework` and `sdd_update_framework` descriptions name `client` and `os`, tell the agent to omit `root` for a known client, say the server resolves `root` from `client` and `os`. `root` field description says to omit it to let the server resolve from the path map (MC-16) | feature-93 |
| Tool descriptions i18n | unit | `tool-descriptions.test.ts`: descriptions resolve for `en`, `zh-Hans`, `zh-Hant` with no missing-key fallback (MC-16) | feature-93 |
| Legacy path-detect chain removed | review | `install.ts` no longer calls `resolveClientPaths` from `path-detect` for known clients. `path-detect.ts` LLM and env-var chain is not on the install path. `path-resolve-llm.ts` is retained for the deferred server-side endpoint only (ADR-130 decision 10) | feature-93 |

### feature-94 — Unknown client install

| Check | Layer | Method | SBI |
| --- | --- | --- | --- |
| Unknown client without `root` → `root_required` | unit | `install.test.ts`: call with `client: "unknown-cli"`, `os: "darwin"`, no `root`. Result code is `root_required`. No files listed. No tarball URL. Message tells the agent to ask the person for the client config root (feature-94) | feature-94 |
| Unknown client with valid `root` → uses that root | unit | `install.test.ts`: call with `client: "unknown-cli"`, `os: "darwin"`, `root: "/tmp/sdd-test-home/.my-cli"`. Result `root` equals the expanded sent root. Plan proceeds (apply or noop) (feature-94) | feature-94 |
| Unknown client with invalid `root` → `path_rejected` | unit | `install.test.ts`: call with `root` outside home, containing `..`, or `/etc`/`/usr`/`/bin`/`/sbin`. Result code is `path_rejected`. No files listed (feature-94) | feature-94 |
| Unknown client retry flow | integration | After `root_required`, the agent retries with a valid `root`. The second call returns `apply` with the tarball URL and the resolved root. The ledger writes to the sent root (feature-94) | feature-94 |
| Missing client → `client_unknown` | unit | `install.test.ts`: call with no `client` and no `clientInfo`. Result code is `client_unknown`. No files listed (ADR-132 decision 4) | feature-94 |
| Result has no `root_warning` or `resolution_source` for unknown | unit | `install.test.ts`: unknown-client result has no `root_warning` field. `resolution_source` is absent or `agent` for the unknown-with-root path (ADR-132 decision 6) | feature-94 |

### Pass criteria

- [ ] feature-93: known client omits `root` and installs at seed-map root
- [ ] feature-93: known client with wrong `root` still uses seed-map root (server ignores it)
- [ ] feature-93: templates land at `templates/framework.sdd.works/{locale}/` (MC-18, MC-15)
- [ ] feature-93: tool descriptions name `client` and `os`, tell agent to omit `root`, resolve for `en`/`zh-Hans`/`zh-Hant` (MC-16)
- [ ] feature-93: legacy path-detect chain removed from install path
- [ ] feature-94: unknown client without `root` returns `root_required`
- [ ] feature-94: unknown client with valid `root` uses that root
- [ ] feature-94: unknown client with invalid `root` returns `path_rejected`
- [ ] feature-94: missing client returns `client_unknown`
- [ ] feature-94: no `root_warning` in any result (ADR-132 decision 6)

Command when these sections are implemented: `npx vitest run src/core/tools/install.test.ts src/core/tools/bundled-pack.test.ts src/mcp/tool-descriptions.test.ts src/core/path-e2e.test.ts`.

---

<a id="14-feature-95-install-page"></a>

## 14. feature-95 / MCP-09 — Install page at `GET /install` (MC-17)

Stories: [`mcp-stories.md`](./mcp-stories.md) `sdd-mcp-install` AC8. Design: [`mcp-design.md`](./mcp-design.md) §2.2 **Install page (MC-17)**, §2.0 module boundary (setup backend owns `GET /install`). ADR: [ADR-132](../adr/ADR-132-simplified-install-root-and-templates.md) decision 8. Issue: [MC-17](../issues-log.md).

`GET /install` serves `public/agent-setup/install-full.md`. An agent with MCP connected fetches this page before calling `sdd_install_framework`. The page names the MCP install sequence. `GET /setup` links to it from an "After setup" note. The setup boundary stays: `GET /setup` is MCP connection only and has no install section.

### Checks

| Check | Layer | Method |
| --- | --- | --- |
| `GET /install` serves markdown | API | Request `GET /install`. Response `Content-Type` is `text/markdown`. Body is `public/agent-setup/install-full.md` with origin rewriting applied (`rewriteSetupMarkdownOrigins`). Assert in a route test or `sdd-api.test.ts` |
| Body names the install sequence | API | Body names the sequence: read the ledger, call `sdd_install_framework` with `client` and `os`, download the tarball, extract listed paths, write the ledger last. Assert each step appears in the body |
| Body tells agent to omit `root` for known clients | API | Body says to omit `root` for a known client and let the server resolve from the path map. Body says to send `root` only after `root_required` for an unknown client (ADR-132) |
| Body does not name a git host | API | Body does not name `github.com`, a repository owner, or a release asset. The tarball URL is on this server only |
| `GET /setup` links to `GET /install` | API | `public/agent-setup/prompt.md` has an "After setup" note that links to `GET /install`. Assert the link appears in the setup markdown served by `GET /setup` |
| `GET /setup` still has no install section | API | The setup markdown still has no install section. The "After setup" note is a link, not an install sequence. Assert the setup body does not name `sdd_install_framework`, tarball, or ledger write steps |
| Module boundary | unit | `src/app/api/agent-setup/install-full/route.ts` is in `SETUP_BACKEND_FILES` in `module-boundary.test.ts`. The route imports from `src/mcp/setup-markdown` only, not from `src/core/tools` or `src/core/sync`. The route reads `public/agent-setup/install-full.md` and serves it with origin rewriting |
| Setup rewrite path | unit | `src/mcp/setup-paths.ts` `SETUP_REWRITES` maps `source: "/install"` to `destination: "/api/agent-setup/install-full"`. Assert in `setup-paths.test.ts` |

### Pass criteria

- [ ] `GET /install` returns `text/markdown` with the install sequence body
- [ ] Body names: read ledger, call `sdd_install_framework` with `client` and `os`, download tarball, extract listed paths, write ledger last
- [ ] Body tells agent to omit `root` for known clients; send `root` only after `root_required` for unknown clients
- [ ] Body does not name a git host or repository
- [ ] `GET /setup` has an "After setup" note linking to `GET /install`
- [ ] `GET /setup` still has no install section
- [ ] `install-full/route.ts` is in the setup backend module boundary list and does not import pack install modules
- [ ] `setup-paths.ts` rewrites `/install` to `/api/agent-setup/install-full`

Command when this section is implemented: `npx vitest run src/app/api/agent-setup/install-full src/mcp/module-boundary.test.ts src/mcp/setup-paths.test.ts src/app/api/sdd/sdd-api.test.ts`.
