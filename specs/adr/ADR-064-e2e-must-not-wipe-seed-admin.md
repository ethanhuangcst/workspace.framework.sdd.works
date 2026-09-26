# ADR-064: Playwright must not wipe the operator seed admin

## Status
Accepted

## Context
Local password reset returned success and did not send mail. The handler skips Resend when the address is not an ACTIVE admin. `me@ethanhuang.com` was missing because `e2e/accounts.spec.ts` deleted every admin except `e2e-admin@ethanhuang.com` on the same Postgres the dev server uses. A shared port-3040 process started with `E2E_SKIP_MAIL=1` had the same effect earlier: success UI, no Resend call. Production never runs that way.

## Decision
Playwright may clean fixture admins it creates. It must not delete `ADMIN_SEED_EMAIL` (default `me@ethanhuang.com`). Interactive `npm run dev` must not set `E2E_SKIP_MAIL`. Playwright starts its own server with that flag and does not reuse port 3040. After a Playwright run, restart dev without the flag before a human reset.

A separate E2E database was not adopted. The seed-email exclusion is enough for the shared local database.

## Rationale
Unknown addresses return `{ ok: true }` so the reset form does not reveal whether an account exists. That response is correct only when the operator account still exists. Deleting it makes every local reset look successful and send nothing. Keeping the seed row preserves the production-shaped path. A second database would isolate tests more strictly and was left for later.

## Consequences
The accounts invite test keeps the seed admin and the Playwright admin. A web-app Playwright run no longer removes the address used for live reset. Reset for a missing address still returns success without mail; that is the non-disclosure rule, not a send.

## Date
2026-09-26
