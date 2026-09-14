# Knowledge — Admin portal seed login and brand logo CSS

**Date:** 2026-09-14 (updated SEED-01)  
**Area:** admin portal (MVP-1 / MVP-2)  
**Related:** [`sprint2-plan.md`](../../sprint2-plan.md), [`app-design.md`](../../admin-portal/app-design.md), [`sdd-admin-seed`](../../admin-portal/app-stories.md#sdd-admin-seed)

## Default admin (SEED-01)

| Field | Source |
| --- | --- |
| Email | `ADMIN_SEED_EMAIL` (default `me@ethanhuang.com`) |
| Username | `ADMIN_SEED_USERNAME` (default `admin`) |
| Password | **`ADMIN_SEED_PASSWORD`** (required; operator `.env.local` / Portainer) |

Flow: set env → `make up` / `npx prisma db seed` → sign in with email + env password.

- Seed **fails** if `ADMIN_SEED_PASSWORD` is missing or blank.
- Re-seed with a new password updates the hash.
- Never commit plaintext passwords; never log them.

Blank-password first-login bootstrap for the **default** admin is retired. Empty-password gate still applies to other accounts that have no hash yet (e.g. incomplete invite).

## Brand logo rendering

- Asset `public/sdd-logo.png` is RGBA with transparent background.
- Do **not** set `.logo img { background: #000 }`.
- Display sizes (200% of original tokens): home `144px`, auth `112px`, header `72px`.
- Offsets: home `margin-left: -30px`; header `margin-left: -22px`.

## CI / E2E

CI sets `ADMIN_SEED_PASSWORD` and `E2E_ADMIN_PASSWORD` to the same fixture value.

| Capture env | Purpose |
| --- | --- |
| `E2E_RESET_FILE` | Password-reset link (Playwright fixture; **skips** Resend) |
| `E2E_INVITE_FILE` | Admin-invite accept URL (Playwright fixture; **skips** Resend) |

When either capture env is set, the server writes the URL to that file and does **not** call Resend (logs a warning if a Resend key is also present). Default CI sets both capture paths and does not set Resend.

**Operator pitfall:** do not export `E2E_INVITE_FILE` / `E2E_RESET_FILE` in a long-lived `npm run dev` shell if you expect real inbox delivery — restart `make dev` / `npm run dev` without those vars so Resend runs.
