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

**Pass criteria for this Mac gate**

- [ ] Tests 2–3 prove env override wins over seed
- [ ] Test 4 proves seed when deterministic signals absent
- [ ] Test 5 proves fail-closed with zero writes
- [ ] Test 1 documents actual Cursor `clientInfo.name` string observed in the field (update `path-detect` mapping if needed)

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

Fixture layout in [test.sdd](https://github.com/ethanhuangcst/test.sdd): `skills/{tdd,atdd,dod}/SKILL.md`, `rules/dod.mdc`, `agents/code-reviewer.md`, `workflows/new-feature.md`.

---

## 7. Out of scope for MCP tests

- Admin portal UI (see [`../admin-portal/app-test.md`](../admin-portal/app-test.md))
- Live Bailian Qwen spend in default CI
- Writing Server 2 disk from HTTP install (must assert packageUrl response, no local writes on server)
