# Sprint 7 Plan — one story to DoD, automated E2E only

**Batch:** MVP-7 · **Status:** Done  
**Updated:** 2026-09-18  
**Accepted:** 2026-09-18 (cache-backed Framework + force sync Playwright; path-e2e; sync-scenarios; paths v3; MCP description i18n)  
**Backlog:** [`r1-product-backlog.md`](./r1-product-backlog.md) · **Req:** [`r1-req-spec.md`](./r1-req-spec.md) · **Tech:** [`r1-tech-spec.md`](./r1-tech-spec.md)

## Principle

**Incremental-delivery:** finish one backlog story (specs + TDD + implementation + automated E2E + DoD) before starting the next. No operator-manual gates — former Mac §5, M1–M2, and “user confirms” items are **vitest + Playwright**.

---

## Story 1 — FRMW-02 (portal) ✅

**AC (automated):**

1. Framework tree from unpacked package cache (not Octokit).
2. Settings empty → empty state; settings set, no cache → `cache_missing`.
3. “Change git repository in Settings” → `Button variant="page"` (`framework-change-repo`).
4. “Sync with git repository” → `POST /api/admin/sync` `{ force: true }`; rematerializes; tree refreshes (`framework-sync-repo`).
5. Local folders/files tree: top-level artifact dirs (**Agents**, **Rules**, **Skills**, …) expand one level by default; immediate children indented under each folder; deeper nesting collapsible via `+`/`−`; `aria-expanded` + i18n.

**Tests:** `src/core/sync/cache-tree.test.ts`, `src/app/api/admin/framework/route.test.ts`, `src/core/sync/sync-job.test.ts` (force), `e2e/settings-framework.spec.ts`.

---

## Story 2 — MCPI-05+ (env matrix) ✅

Copilot (`COPILOT_CUSTOM_INSTRUCTIONS_DIRS`), OpenCode (`XDG_DATA_HOME`), Cline (`CLINE_DATA_DIR`) in `path-detect.ts`.

**Tests:** `src/core/path-detect.test.ts`.

---

## Story 3 — MCPI-02 (cross-client seed) ✅

Expanded `packages/sdd-paths/paths.json` (v3): cline, codex, copilot, gemini, kiro, continue, windsurf, opencode × darwin/linux/win32.

**Tests:** `packages/sdd-paths/paths.test.ts`.

---

## Story 4 — VERIF (automated §5 / M1 / S2–S5) ✅

| Former gate | Automated suite |
| --- | --- |
| mcp-test §5 Tests 1–5 | `src/core/path-e2e.test.ts` |
| M1 rename + HTTP install inventory | `src/core/sync/sync-scenarios.test.ts` |
| S2–S5 sync scenarios | `src/core/sync/sync-scenarios.test.ts` + existing `sync-job.test.ts` |
| Framework force sync (M2 partial) | `e2e/settings-framework.spec.ts` sync button |

Live GitHub LE1–LE5 remains opt-in (`sync-e2e.test.ts`).

---

## Story 5 — I18N-02 (MCP descriptions) ✅

Tool descriptions from `messages/*` via `src/mcp/tool-descriptions.ts`.

**Tests:** `src/mcp/tool-descriptions.test.ts`.

---

## Exit criteria (DoD)

- [x] FRMW-02 cache-backed Framework page + force sync + Playwright E2E
- [x] MCPI-05+ env matrix unit tested
- [x] MCPI-02 paths.json v3 + resolver tests per client/OS
- [x] VERIF automated (no Mac operator §5 / M1–M2 manual gates)
- [x] I18N-02 MCP descriptions resolve for en / zh-Hans / zh-Hant
- [x] Regression: vitest core + paths green; Playwright framework spec green
