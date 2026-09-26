# Knowledge — Why the same Web-app reset and tab bugs keep returning

**Date:** 2026-09-26 (updated: accounts test must not delete the seed admin)  
**Area:** admin portal / public instructions (Web-app issues WA-05–WA-11)  
**Related:** [`issues-log.md`](../../issues-log.md) · [`admin-portal-seed-and-logo.md`](./admin-portal-seed-and-logo.md) · [`incremental-delivery`](../../../AGENTS.md)

## Finding

The repeating break is the **local server and the reset contract being changed to satisfy the last test**, not the last user click. Production stayed healthy for ACTIVE-admin Resend while local “fixed” paths kept recreating flash, wrong copy, skipped mail, and Features/Get secret regressions.

## Mechanisms

1. **One port-3040 process for browser and Playwright.** Capture tests needed `E2E_RESET_FILE` / `E2E_SKIP_MAIL`. The shared `next dev` was started with that env. The next human click then skipped Resend and still showed success. Production never runs in that mode. See [`admin-portal-seed-and-logo.md`](./admin-portal-seed-and-logo.md) (Local reset “success” with no inbox mail).

2. **Layer-hopping “done” marks.** Each fix changed a different layer (hide the lead, rename the success sentence, `type="submit"` vs `type="button"`) and marked the story done. The user’s path — click, stay on the page, previous sentence, mail actually sent — was not rechecked after the next edit.

3. **Tests followed the last edit, not the product sentence.** Unit and Playwright expectations moved to the new `{email}` sentence and the capture-file `200`, so the suite stayed green while inbox delivery and the previous catalog copy regressed.

4. **Multi-story edits in one cycle.** Get secret and reset were changed together, so a form `type="submit"` reload (reset, then Get secret) came back after an earlier `preventDefault` fix.

5. **Playwright deleted the operator admin.** `e2e/accounts.spec.ts` deleted every admin except `e2e-admin@ethanhuang.com` on the shared database. The next human reset for `me@ethanhuang.com` was a sub-100ms `200` and did not call Resend. Decision: [ADR-064](../../adr/ADR-064-e2e-must-not-wipe-seed-admin.md). The test now keeps `ADMIN_SEED_EMAIL`.

## Guard for the next code pass

- One story at a time (`incremental-delivery`).
- Do not start the interactive dev server with `E2E_SKIP_MAIL`.
- After a reset change, one browser click must show the previous `admin.reset.sent` sentence and a Resend-duration response (about 1s or more), not a sub-100ms `200`.
- Do not update tests to accept a weaker user path (wrong copy, capture-only success) without closing the matching issue against the restored contract.
