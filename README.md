# framework.sdd.works

MCP service + admin portal for the SDD framework.

## Local setup

1. Copy `.env.example` → `.env.local` and fill secrets (operator-owned; do not commit).
2. `make up` — start Postgres on `:5435`, migrate, seed default admin (`ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD` from `.env.local`).
3. `make dev` — Next.js on http://localhost:3040
4. Sign in with the seeded email and `ADMIN_SEED_PASSWORD`.

## Commands

| Target | Action |
| --- | --- |
| `make help` | List targets |
| `make dev` | Dev server (port 3040) |
| `make up` / `make down` | Start / stop local Postgres |
| `make test` | Unit + integration (Vitest) |
| `make lint` | ESLint + typecheck |
| `npm run test:e2e` | Playwright (fixture-only; skips Resend via `E2E_SKIP_MAIL=1`) |

## Packages

- `packages/sdd-paths` — versioned client path map + resolver (PATH-01)
