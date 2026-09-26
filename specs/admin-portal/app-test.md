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
| ResetPasswordPage | After sent, link uses `admin.common.back_login` and href `/login` (WA-03). Failed request keeps the form and shows `reset-error` with a keyed message; no navigation (WA-05). Success callout uses the previous `admin.reset.sent` sentence with no `{email}`; request lead is hidden; URL has no `?email=` (WA-08 / WA-10 / Web-portal-11) |
| Password set gate | No token + existing hash → redirect away from empty-account form; empty hash still allows set (WA-04) |
| InstructionsPage | Tab switch Setup / Features; Features `aria-selected` and `panel-features` visibility (WA-06); copy value is the `/setup` sentence; one stdio `mcp.json`; Features lists ethan and fixed skill/rule/template names. **feature-04:** `secret-lookup` is after the Templates list; Setup panel has no `secret-lookup`; `admin.guide.secret_hint` and `admin.guide.secret_button` resolve in `en`, `zh-Hans`, and `zh-Hant` to the three catalog sentences in [`app-stories.md`](./app-stories.md) AC7. **feature-06 / WA-09 / WA-11:** Get secret stays on Features (`?tab=features`, `#features-secret`); after a result, `secret-result` or `secret-error` is scrolled into view; known exact name shows plaintext in a code block with copy control at lookup-row width; unknown name shows `admin.guide.secret_missing` on `secret-error` at the same width; empty name shows `admin.guide.secret_empty` and does not call the lookup API |

Commands: `npx vitest run src/auth src/lib src/components/features/InstructionsPage.test.ts`

---

## 3. Integration tests

| Route / area | Cases |
| --- | --- |
| `POST /api/admin/login` | Success; wrong password → `errors.login_failed`; no rate-limit 429 |
| Password reset | Request creates token; set-password consumes token; expired → error |
| Public secret lookup (feature-05) | Exact known `key_name` returns only that plaintext; unknown name → keyed not found; response lists no other names; empty name rejected |
| Keys CRUD | Create / list / update / delete; decrypt with current `KEYS_ENCRYPTION_KEY` |
| Users invite | Rate-limit invite; cannot delete self / last admin |
| Settings | Dirty-only Save; unreachable URL does not persist |
| Framework | Tree from SYNK cache; top-level one-level expand + indented child rows; force sync; sync error keeps shell |

**feature-04 / feature-05 / feature-06:** Feature-04 is the form. Feature-05 owns the public exact-name lookup route. Feature-06 owns the Features-tab UI for value / not-found / empty.

---

## 4. E2E (Playwright)

| Spec area | Scenarios |
| --- | --- |
| Public home | `/` shows `instructions-guide` (not logo-card home); footer fixed (WA-01, WA-02) |
| Instructions | Guide title visible; Setup and Features tabs; Features click shows `panel-features` and the tab is the hit target at its center (WA-06); Features shows ethan; agents roster lists seven names in order. **feature-04:** Features shows `secret-name` and `secret-get` after Templates; Setup does not show `secret-lookup`; switching locale to `zh-Hans` and `zh-Hant` changes the placeholder and button to the catalog sentences. **feature-06 / WA-09 / WA-11:** Get secret keeps `?tab=features` and stays on `#features-secret`; after a result, `secret-result` or `secret-error` is in view; known exact name shows a code block with copy at lookup-row width; unknown name shows `secret-error` with `admin.guide.secret_missing`; empty name shows `admin.guide.secret_empty` and does not navigate to Setup |
| Login | Seeded admin reaches keys landing; empty-password admin → set-password; hashed admin is not trapped on empty-account set-password (WA-04) |
| Password reset | Submit keeps URL `/reset-password` and shows success callout or `reset-error` (WA-05); success callout is the previous `admin.reset.sent` sentence with no `{email}` and has no `?email=` query (WA-08 / WA-10); mail capture / fixture path when configured; after send, Back to login → `/login` (WA-03) |
| Keys | Create, list shows value, copy, edit, delete, bulk delete |
| Admins | Invite list; delete confirm; self/last-admin blocked |
| Settings | Save valid URL; unreachable rejected |
| Framework | Cache-backed tree; one-level default expand; indented child entries; dirs before files then name sort at each level; sync button; change-repo navigates; collapse/expand top-level folder; empty → Settings CTA |
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
