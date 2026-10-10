# Test report

**Scope:** Full web-portal regression (Vitest + TypeScript + Next.js build + Lint + Playwright E2E)

**Run at:** 2026-10-10T09:57:00Z (local run ~17:57 UTC+8)

**Commit or ref:** `6b5548e` plus uncommitted fixes

## Summary

| Layer | Passed | Failed | Skipped |
| --- | --- | --- | --- |
| Unit and component | 447 | 0 | 5 |
| API and integration | 0 | 0 | 0 |
| Browser E2E | 41 | 0 | 0 |
| **Total (automated tests)** | **488** | **0** | **5** |

**Result:** pass (TypeScript, lint, production build, and all E2E green after fixes)

Vitest runs unit, component, and HTTP route tests in one suite; API cases are not counted separately here.

## Checks

| Check | Layer | Result | Evidence |
| --- | --- | --- | --- |
| Full Vitest suite | unit | pass | `npm test` — 73 files passed, 1 skipped; 447 passed, 5 skipped (9.8s) |
| TypeScript | gate | pass | `npm run typecheck` — exit 0 |
| ESLint | gate | pass | `npm run lint` — exit 0 (`--max-warnings 0`) |
| Next.js production build | gate | pass | `npm run build` — exit 0 |
| `e2e/auth.spec.ts` | browser | pass | Playwright — public home, login, reset flows |
| `e2e/keys.spec.ts` | browser | pass | Playwright — validation and CRUD |
| `e2e/accounts.spec.ts` | browser | pass | Playwright — invite, accept, delete |
| `e2e/instructions.spec.ts` | browser | pass | Playwright — guide, tabs, Knowledge, Learn secret, horizontal scroll |
| `e2e/visitor-locale.spec.ts` | browser | pass | Playwright — 8 Accept-Language scenarios |
| `e2e/settings-framework.spec.ts` | browser | pass | Playwright — 6 passed (was 4 failed) |

## Commands run

- `npm test`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npx playwright test`

## Fixes applied this run

- `src/core/sync/sync-job.test.ts`: narrow `SyncResult` union with `"status" in result` before reading `.status`.
- `src/mail/resend.locale.test.ts`: type the Resend mock payload so `send.mock.calls[0]?.[0]` is typed.
- `src/github/sync.ts`: `getGitHubPortForRepo` returns the in-process fixture port when `GITHUB_FIXTURE=1` and `NODE_ENV !== "production"`. Production is unchanged.
- `playwright.config.ts`: set `GITHUB_FIXTURE=1` in `webServer.env` so Settings/Framework E2E does not hit live GitHub.
- `src/components/features/LearnScrumEmbedPanel.tsx`: drop synchronous `setState` resets from the effect; reset on `embedUrl` change via `key` on the parent (`InstructionsPage.tsx`).
- `src/components/features/LearnScrumEmbedPanel.test.tsx`: pass `key` on rerender for the skeleton-reappear test; remove unused import.
- `src/components/features/InstructionsPage.test.tsx`: replace trailing comma expression with a statement.
- `eslint.config.mjs`: add `argsIgnorePattern`/`varsIgnorePattern`/`caughtErrorsIgnorePattern` `^_` for `@typescript-eslint/no-unused-vars`.
- `specs/admin-portal/app-tests.md`: document the dev-only `GITHUB_FIXTURE` fixture port.

## Notes

- Postgres: `localhost:5435/framework_sdd` (Playwright `global-setup.ts` and `webServer.env` defaults).
- Dev server: `http://localhost:3040`, `E2E_SKIP_MAIL=1`, fixture `KEYS_ENCRYPTION_KEY`, `GITHUB_FIXTURE=1`.
- Production never selects the fixture port (`NODE_ENV=production` ignores `GITHUB_FIXTURE`).

## Failures

None.
