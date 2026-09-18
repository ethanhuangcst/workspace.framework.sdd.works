# Admin Portal Test Strategy and Plan

**Area:** Admin portal (INF / ACCT / KEYS / SETT / FRMW / I18N / SEED)
**Stories:** [`app-stories.md`](./app-stories.md) · **Design:** [`app-design.md`](./app-design.md)
**Quality bar:** common-test-strategy — critical path 100%, overall ≥80% where measurable.

**Note:** MCPI-05 (client path detection) has **no portal UI**. Portal tests cover existing admin features only. MCP path detection is covered in [`../mcp/mcp-test.md`](../mcp/mcp-test.md).

---

## 1. Strategy

| Layer | Scope | Default CI | Live opt-in |
| --- | --- | --- | --- |
| **Unit** | Auth helpers (session, CSRF, password, rate-limit for reset/invite), keys crypto, locale, Zod schemas | Always | — |
| **Integration** | Admin API routes with test DB; injectable GitHub port | Always (`GITHUB_FIXTURE=1`) | Live GitHub / Resend |
| **E2E** | Playwright against Next on `:3040` | Always (fixture GitHub) | Live mail / GitHub |

**Principles**

- Critical path: login, session cookie, CSRF mutations, keys CRUD encrypt/decrypt, settings save reachability, framework tree error shell.
- Never commit secrets; CI uses fixture `KEYS_ENCRYPTION_KEY` and `GITHUB_FIXTURE=1`.
- Prefer role / text / `data-testid` selectors over brittle CSS.
- Isolated test DB; never production data.
- When a suite switches from live GitHub / live Setting rows to fixture (`GITHUB_FIXTURE=1`, `fixture/*` URL), restore env vars and `Setting.githubUrl` in `afterEach` / `afterAll` so `npm run dev` is not left on fixture data.
- Fixture-green CI is not DoD. Marking SETT/FRMW Done requires a live save + Framework view against a real reachable repo.

---

## 2. Unit tests

| Module | Cases |
| --- | --- |
| Session / CSRF | Valid cookie; rejected CSRF; CSRF-safe mutations |
| Password | Hash verify; empty hash → set-password path |
| Rate limit | Helper still used by reset/invite (login not rate-limited) |
| Keys crypto | Round-trip encrypt/decrypt; missing key; wrong key / tampered ciphertext → clear error |
| Locale | Cookie → locale; missing-key fallback |
| Keys / settings Zod | Valid names; reject CJK in `key_value`; invalid GitHub URL |

Commands: `npx vitest run src/auth src/lib`

---

## 3. Integration tests

| Route / area | Cases |
| --- | --- |
| `POST /api/admin/login` | Success; wrong password → `errors.login_failed`; no rate-limit 429 |
| Password reset | Request creates token; set-password consumes token; expired → error |
| Keys CRUD | Create / list / update / delete; decrypt with current `KEYS_ENCRYPTION_KEY` |
| Users invite | Rate-limit invite; cannot delete self / last admin |
| Settings | Dirty-only Save; unreachable URL does not persist |
| Framework | Tree from fixture GitHub; sync error keeps shell |

---

## 4. E2E (Playwright)

| Spec area | Scenarios |
| --- | --- |
| Public home | Instructions + login link visible |
| Login | Seeded admin reaches keys landing; empty-password admin → set-password |
| Password reset | Mail capture / fixture path when configured |
| Keys | Create, list shows value, copy, edit, delete, bulk delete |
| Admins | Invite list; delete confirm; self/last-admin blocked |
| Settings | Save valid URL; unreachable rejected |
| Framework | Tree from configured repo; empty → Settings CTA |
| i18n | Locale switch updates chrome copy |

Config: `playwright.config.ts` injects fixture `KEYS_ENCRYPTION_KEY` and `GITHUB_FIXTURE=1`.

**Operator pitfall (this Mac):** Playwright’s fixture encryption key can differ from `.env.local`. Prefer a separate E2E database, or re-encrypt / delete rows encrypted under the fixture key before opening the Keys page in `npm run dev`.

---

## 5. Regression checklist (after Sprint 6 MCP work)

Portal must stay green while MCP install lands:

- [ ] Login + keys list still load after MCP changes
- [ ] Settings + Framework still work with `GITHUB_FIXTURE=1`
- [ ] No new portal routes required for MCPI-05

---

## 6. Out of scope

- MCP tool contracts and path detection E2E → [`../mcp/mcp-test.md`](../mcp/mcp-test.md)
- Live Resend / live GitHub in default CI
