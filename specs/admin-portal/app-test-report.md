# Test report

**Scope:** web portal go-live

**Run at:** 2026-10-09T03:47:55Z

**Commit or ref:** `8920a82`

## Summary

| Layer | Passed | Failed | Skipped |
| --- | --- | --- | --- |
| Unit and component | 183 | 0 | 0 |
| API and integration | 39 | 0 | 0 |
| Browser E2E | 32 | 0 | 0 |
| **Total** | **254** | **0** | **0** |

**Result:** pass

## Checks

| Check | Layer | Result | Evidence |
| --- | --- | --- | --- |
| Portal Vitest suites | unit / API | pass | `npx vitest run src/components src/app src/lib src/middleware.test.ts src/styles src/auth src/i18n src/mail` → 222 passed |
| Playwright e2e (auth, keys, accounts, settings-framework, instructions) | browser | pass | `npx playwright test --reporter=list` → 32 passed (41.7s) |

## Commands run

- Unit and API: `npx vitest run src/components src/app src/lib src/middleware.test.ts src/styles src/auth src/i18n src/mail`
- Browser E2E: `npx playwright test --reporter=list`

## Notes

- First Playwright attempts failed because a leftover `next-server` (PID 31395) held port 3040 and `.next/dev/lock`. Log: `Another next dev server is already running` / `Process from config.webServer was not able to start. Exit code: 1`.
- After force-killing that process and removing `.next/dev/lock`, Playwright started `npm run dev` and all 32 browser specs passed.
- Playwright `webServer` uses `reuseExistingServer: false` on port 3040 (`playwright.config.ts`).
