# Admin Portal Test Strategy and Plan

**Area:** Admin portal (INF / ACCT / KEYS / SETT / FRMW / I18N / SEED)
**Stories:** [`app-stories.md`](./app-stories.md) · **Design:** [`app-design.md`](./app-design.md)
**Quality bar:** common-test-strategy — critical path 100%, overall ≥80% where measurable.

**Note:** MCPI-05 (client path detection) has **no portal UI**. Portal tests cover existing admin features only. MCP path detection is covered in [`../mcp/mcp-tests.md`](../mcp/mcp-tests.md).

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
| InstructionsPage | Tab switch Setup / Features; Features `aria-selected` and `panel-features` visibility (WA-06); copy value is the `/setup` sentence; one stdio `mcp.json`. **feature-56:** no `copy-lite-setup-prompt` on Setup; full `copy-setup-prompt` unchanged. **feature-07:** `features-body` shows fixture markdown for the active locale; a missing zh file in the cache shows the English cache file; a missing cache shows the file from `src/content/features/`; a `<script>` in the fixture is not executed; the fixed Agents / Skills / Rules / Templates lists are absent. **feature-04 / feature-17:** `secret-lookup` is after `#tools` on Setup (`#setup-secret`); Features panel has no `secret-lookup`; `admin.guide.secret_hint` and `admin.guide.secret_button` resolve in `en`, `zh-Hans`, and `zh-Hant` to the three catalog sentences in [`app-stories.md`](./app-stories.md) AC7. **feature-05 / WA-09 / WA-11 / feature-17:** Get secret stays on Setup (`#setup-secret`) and does not set `?tab=features`; after a result, `secret-result` or `secret-error` is scrolled into view; known exact name shows plaintext in a code block with copy control at lookup-row width; unknown name shows `admin.guide.secret_missing` on `secret-error` at the same width; empty name shows `admin.guide.secret_empty` and does not call the lookup API. **feature-60:** Tab bar order follows resolved config; load without `?tab=` selects Setup (`aria-selected` on `guide-tab-setup`, `panel-setup` visible); `?tab=features` opens the content panel for that `queryParam`; each tab label uses its `labelKey`; unknown `?tab=` falls back to Setup; Setup panel still has copy prompt and Get secret after dynamic tabs ship |

Commands: `npx vitest run src/auth src/lib src/components/features/InstructionsPage.test.ts`

---

## 3. Integration tests

| Route / area | Cases |
| --- | --- |
| `POST /api/admin/login` | Success; wrong password → `errors.login_failed`; no rate-limit 429 |
| Password reset | Request creates token; set-password consumes token; expired → error |
| Public secret lookup (feature-05) | Exact known `key_name` returns only that plaintext; unknown name → keyed not found; response lists no other names; empty name rejected |
| `GET /api/sdd/features` (feature-07) | Cache `en` returns that file’s HTML with `source` `cache`; cache `zh-Hans` returns the Chinese file when present; missing cache `zh-Hant` returns cache English HTML, `source` `cache`, and `sourceLocale` `en`; no cache English file returns the package file with `source` `package`; response has no key values; raw HTML in the file is escaped |
| `GET /api/sdd/lite/files` (feature-55) | With fixture unpack + valid `lite-pack.allowlist.json` at pack root: 200; body has `package_version`, `package_commit`, sorted `files`, and `downloads` with same-origin `url` per path; no GitHub fetch. Empty cache manifest → 409 `sync_pending`. Unpack without allow-list file → `lite_manifest_missing`. Bad allow-list (unsorted skills, missing file on disk, disallowed path) → `lite_manifest_invalid`; no `downloads`. |
| `GET /api/sdd/lite/file` (feature-55) | Allow-listed path → 200 and bytes match unpack file. Path not in allow-list → `path_not_allowed`. `../` or absolute path → `path_invalid`. |
| `GET /setup/install` (feature-56) | Public rewrite → install handler: 200, `Content-Type` includes `text/markdown`. Body matches `public/agent-setup/install.md` after local origin rewrite. Body includes `LITE_PARTNER_SETUP_SENTENCE`, lite file list route, per-file download route, `{client_root}`, `.sdd-lite-installed.json` / receipt merge, and excludes `sdd_install_framework` and `.sdd-installed.json`. With fixture cache, body references `GET /api/sdd/lite/files`. No admin session. |
| `GET /setup` (feature-56 regression) | Still 200 stdio-primary markdown from `prompt.md`; body is not `install.md`. |
| `GET /api/sdd/instructions-tabs` (feature-59) | Cache `content/.instructions-tabs.json` valid → 200; `tabs` order matches file; `setup` code tab present; each `content` tab has `html` for `locale=en` from cache path; top-level `source` `cache`. Missing or invalid cache file → 200 from bundled [`src/content/.instructions-tabs.json`](../../src/content/.instructions-tabs.json) only; top-level `source` `bundled`. Duplicate `queryParam` or unknown `code.id` → bundled fallback. Content path `../` → bundled fallback. Missing zh path → `sourceLocale` `en` for that tab. Per-tab markdown uses `contentSource` `cache` or `package` like Features. No GitHub fetch; no key values |
| Instructions tabs resolver (feature-58 / feature-59) | Unit: parse and validate schema v1; reject empty `tabs`, duplicate `id` / `queryParam`, disallowed `code.id`, content row without `paths.en`, unsafe paths. Path values are relative to sync unpack root (`content/features/…`). File-existence checks use that root (fixture unpack or `pack.framework.sdd.works/`). Runtime package fallback maps those paths under `src/content/` (same as Features) |
| Keys CRUD | Create / list / update / delete; decrypt with current `KEYS_ENCRYPTION_KEY` |
| Users invite | Rate-limit invite; cannot delete self / last admin |
| Settings | Dirty-only Save; unreachable URL does not persist |
| Framework | Tree from SYNK cache; top-level one-level expand + indented child rows; force sync; sync error keeps shell |

**feature-04 / feature-05:** Feature-04 is the form. Feature-05 owns the public exact-name lookup and the value / not-found / empty UI. The old feature-06 row is merged into feature-05. Those cases still describe the form on Features, which is what shipped.

**feature-17:** [ADR-067](../adr/ADR-067-get-secret-on-setup.md). `secret-lookup` is at the bottom of Setup, after the tools table, anchor `#setup-secret`. Features has no `secret-lookup`. Submit does not set `?tab=features`. Hint, button, found, missing, empty, scroll, and width stay as feature-05. Mockups `01-home.html` and `13-instructions.html` match the live page.

**feature-07:** task-03 owns the cache read. task-04 owns the body. task-05 owns the package-file fallback. task-06 runs §7 before the feature is Done.

---

## 4. E2E (Playwright)

| Spec area | Scenarios |
| --- | --- |
| Public home | `/` shows `instructions-guide` (not logo-card home); footer fixed (WA-01, WA-02) |
| Instructions | Guide title visible; Setup and Features tabs; Features click shows `panel-features` and the tab is the hit target at its center (WA-06); agents roster lists seven names in order. **feature-07:** Features shows `features-body` text from the cache fixture for `en` and `zh-Hans`; `zh-Hant` with no cache file shows the English cache body; a missing cache shows the body from `src/content/features/`; Setup still shows `copy-setup-prompt`. **feature-56:** Setup does not show `copy-lite-setup-prompt`; full MCP copy unchanged. **feature-04 / feature-17:** Setup shows `secret-name` and `secret-get` after the tools table; Features does not show `secret-lookup`; switching locale to `zh-Hans` and `zh-Hant` changes the placeholder and button to the catalog sentences. **feature-05 / WA-09 / WA-11 / feature-17:** Get secret stays on Setup at `#setup-secret` and does not set `?tab=features`; after a result, `secret-result` or `secret-error` is in view; known exact name shows a code block with copy at lookup-row width; unknown name shows `secret-error` with `admin.guide.secret_missing`; empty name shows `admin.guide.secret_empty` and stays on Setup. **feature-60:** `/` load without query opens Setup; reorder fixture config puts Scrum before Features in the tab bar; `?tab=scrum-in-sdd` deep-links; Scrum and Features panels still load markdown from configured paths |
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

## 7. Regression after feature-07

Run this after task-04 and task-05, before feature-07 is marked Done. Use `/` and `/instructions`. Desktop and a viewport under 640px for the secret row.

- [x] Setup copy control still copies `Fetch and execute the setup instructions from https://framework.sdd.works/setup`
- [x] Manual setup still shows one `mcp.json` and no `curl`
- [x] Tools table has `sdd_install_framework` and `sdd_update_framework` and no `sdd_list_versions` row
- [x] Features tab switch still sets `aria-selected` and shows `panel-features` (WA-06)
- [x] Get secret: known name shows `secret-result` in view; unknown name shows `secret-missing`; empty name shows `secret-empty` and does not call the API
- [x] Reset success still uses the previous `admin.reset.sent` sentence and stays on `/reset-password` with no `?email=`
- [x] Locale switch still changes tab labels, the secret hint, and the secret button
- [x] A missing sync cache still shows `features-body` from `src/content/features/` and does not remove Setup or Get secret
- [x] No console or server error on these paths

---

## 8. Out of scope

- MCP tool contracts and path detection E2E → [`../mcp/mcp-tests.md`](../mcp/mcp-tests.md)
- Live Resend / live GitHub in default CI
- Lite receipt merge on the server (agent + [Spec-seeds-18](../product-backlog.md#L449); **feature-57** **Done** in product repo)

---

## 9. Regression after feature-55

Run after feature-55 routes ship, before the SBI is **Done**. Fixture cache only (`SDD_PACKAGE_CACHE_DIR`, `GITHUB_FIXTURE=1`).

- [ ] `GET /api/sdd/package?version=latest` still returns 200 with tarball headers when cache is seeded
- [ ] `GET /api/sdd/features?locale=en` still returns 200
- [ ] `GET /setup` still returns stdio-primary markdown (not lite install copy)
- [ ] No admin session required for lite list or lite file routes
- [ ] Lite list response has no key values or operator secrets

---

## 10. Regression after feature-56

Run after feature-56 ships, before the SBI is **Done**. Covers AC20 and AC21. Fixture cache optional for markdown API case; use `/` and `/instructions`.

- [ ] `GET /setup/install` returns 200 markdown with lite file API and receipt instructions; no `sdd_install_framework` or `.sdd-installed.json` in the body
- [ ] `GET /setup` still returns stdio-primary markdown (not lite install copy)
- [ ] `copy-setup-prompt` still copies the `/setup` sentence
- [ ] Setup has no `copy-lite-setup-prompt`
- [ ] `GET /setup/install` body documents partner paste: `Fetch and execute the setup instructions from https://framework.sdd.works/setup/install`
- [ ] Manual setup still shows one stdio `mcp.json` and no `curl`
- [ ] Get secret stays on Setup only; Features tab unchanged
- [ ] No admin session required for `GET /setup/install`
- [ ] No console or server error on these paths

---

## 11. Regression after feature-58–feature-60

Run after dynamic tabs ship, before **feature-60** is **Done**. Fixture cache (`SDD_PACKAGE_CACHE_DIR`, `GITHUB_FIXTURE=1`) plus bundled [`src/content/.instructions-tabs.json`](../../src/content/.instructions-tabs.json).

- [ ] `GET /api/sdd/instructions-tabs?locale=en` returns 200 with `setup`, `features`, and `scrum-in-sdd` tabs
- [ ] `/` and `/instructions` without `?tab=` show Setup selected and `panel-setup` visible
- [ ] `?tab=features` and `?tab=scrum-in-sdd` open the correct panel on full load (WA-06)
- [ ] Setup copy still copies the `/setup` sentence; one stdio `mcp.json`; Get secret on Setup only
- [ ] `GET /api/sdd/features?locale=en` still returns 200 (legacy route until removed)
- [ ] Invalid cache `content/.instructions-tabs.json` still serves tabs from bundled JSON only
- [ ] No console or server error on these paths
