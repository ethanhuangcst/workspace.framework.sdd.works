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
| **Integration** | Admin API routes with test DB; injectable GitHub port | Always (in-process double) | Live GitHub / Resend |
| **E2E** | Playwright against Next on `:3040` | The server uses the real GitHub port | Live mail / GitHub |

**Principles**

- Critical path: login, session cookie, CSRF mutations, keys CRUD encrypt/decrypt, settings save reachability, framework tree error shell.
- Never commit secrets; CI uses a fixture `KEYS_ENCRYPTION_KEY`. The server ignores `GITHUB_FIXTURE`. Production has no fixture port.
- Prefer role / text / `data-testid` selectors over brittle CSS.
- Isolated test DB; never production data.
- When a suite injects an in-process GitHub double, clear it in `afterEach` / `afterAll`. Do not point `npm run dev` at fixture pack data.
- Fixture-green CI is not DoD. Marking SETT/FRMW Done requires a live save + Framework view against a real reachable repo.

---

## 2. Unit tests

| Module | Cases |
| --- | --- |
| Session / CSRF | Valid cookie; rejected CSRF; CSRF-safe mutations |
| Password | Hash verify; empty hash → set-password path |
| Rate limit | Helper still used by reset/invite (login not rate-limited) |
| Keys crypto | Round-trip encrypt/decrypt; missing key; wrong key / tampered ciphertext → clear error |
| Locale | Cookie wins; missing or invalid cookie negotiates `Accept-Language` per **AC51–AC56** and §34; missing message key falls back to `en` then the key name |
| Keys / settings Zod | Valid names; reject CJK in `key_value`; invalid GitHub URL |
| ResetPasswordPage | After sent, link uses `admin.common.back_login` and href `/login` (WA-03). Failed request keeps the form and shows `reset-error` with a keyed message; no navigation (WA-05). Success callout uses the previous `admin.reset.sent` sentence with no `{email}`; request lead is hidden; URL has no `?email=` (WA-08 / WA-10 / Web-portal-11) |
| Password set gate | No token + existing hash → redirect away from empty-account form; empty hash still allows set (WA-04) |
| InstructionsPage | Tab switch Setup / Features; Features `aria-selected` and `panel-features` visibility (WA-06); copy value is the `/setup` sentence; one stdio `mcp.json`. **feature-56:** no `copy-lite-setup-prompt` on Setup; full `copy-setup-prompt` unchanged. **feature-07:** `features-body` shows fixture markdown for the active locale; a missing zh file in the cache shows the English cache file; a missing cache shows the file from `src/content/features/`; a `<script>` in the fixture is not executed; the fixed Agents / Skills / Rules / Templates lists are absent. **feature-04 / ADR-115:** `secret-lookup` is on Learn Scrum (`#learn-secret`) between iframe and fallback; Setup and Features have no `secret-lookup`; hint and button keys resolve in three locales per AC7 catalog. **feature-05 / WA-09 / WA-11 / ADR-115:** Get secret on `tab=learn-scrum-in-sdd` does not change tab; scroll into view for result or error; known, unknown, and empty cases match feature-05. **feature-60:** Tab bar order follows resolved config; load without `?tab=` selects Setup; `?tab=features` opens the content panel; each tab label uses its `labelKey`; unknown `?tab=` falls back to Setup; Setup has copy prompt only (no Get secret) |
| **Web-portal-26** `admin-note.ts` | Cache file wins over package; missing cache reads `src/content/.admin-note.md`; HTML includes `content-table` for tables; fenced json becomes `codeblock--file`; `<script>` stripped; json pre preserves two-space indent from fixture markdown |
| **Web-portal-26** `FrameworkView` | `framework-admin-note` visible when repo block shown; open adds `is-open` on backdrop; body has `guide-section` + `guide-md-body--prose`; Close and Escape hide modal; optional fetch error shows keyed callout |

Commands: `npx vitest run src/auth src/lib src/lib/admin-note.test.ts src/components/features/FrameworkView.test.ts src/components/features/InstructionsPage.test.ts`

---

## 3. Integration tests

| Route / area | Cases |
| --- | --- |
| `POST /api/admin/login` | Success; wrong password → `errors.login_failed`; no rate-limit 429 |
| Password reset | Request creates token; set-password consumes token; expired → error |
| Public secret lookup (feature-05) | Exact known `key_name` returns only that plaintext; unknown name → keyed not found; response lists no other names; empty name rejected |
| `GET /api/sdd/features` (feature-07) | Cache `en` returns that file’s HTML with `source` `cache`; cache `zh-Hans` returns the Chinese file when present; missing cache `zh-Hant` returns cache English HTML, `source` `cache`, and `sourceLocale` `en`; no cache English file returns the package file with `source` `package`; response has no key values; raw HTML in the file is escaped. **AC59:** no `locale` query and `Accept-Language: zh-CN` still returns `locale` `en` |
| `GET /api/sdd/lite/files` (feature-55) | With fixture unpack + valid `lite-pack.allowlist.json` at pack root: 200; body has `package_version`, `package_commit`, sorted `files`, and `downloads` with same-origin `url` per path; no GitHub fetch. Empty cache manifest → 409 `sync_pending`. Unpack without allow-list file → `lite_manifest_missing`. Bad allow-list (unsorted skills, missing file on disk, disallowed path) → `lite_manifest_invalid`; no `downloads`. |
| `GET /api/sdd/lite/file` (feature-55) | Allow-listed path → 200 and bytes match unpack file. Path not in allow-list → `path_not_allowed`. `../` or absolute path → `path_invalid`. |
| `GET /setup/install` (feature-56) | Public rewrite → install handler: 200, `Content-Type` includes `text/markdown`. Body matches `public/agent-setup/install.md` after local origin rewrite. Body includes **`lite_install`** paste text from [`paste-sentences.json`](../../public/agent-setup/paste-sentences.json) (or legacy `LITE_PARTNER_SETUP_SENTENCE` until feature-88), lite file list route, per-file download route, `{client_root}`, `.sdd-lite-installed.json` / receipt merge, and excludes `sdd_install_framework` and `.sdd-installed.json`. With fixture cache, body references `GET /api/sdd/lite/files`. No admin session. |
| `paste-sentences.json` (feature-88) | File exists with `version` 1 and keys `lite_install`, `node_prerequisite`. Loader substitutes `{origin}`. Unit: resolved strings match **AC47**. `LITE_PARTNER_SETUP_SENTENCE` equals `lite_install` for production origin after refactor. |
| `GET /setup/node` (feature-88) | Public rewrite → node handler: 200 markdown; body matches `public/agent-setup/node.md` after origin rewrite; includes catalog route, registry probe, hello check, authorization boundary; excludes MCP and lite copy. **AC45**. |
| `GET /api/setup/node/catalog` (feature-88) | 200 JSON with `node_lts`, platform `downloads`, `npm_registries.default` and `cn_hk`; HTTPS URLs only; no admin session. **AC46**. |
| Setup Node UI retired (WA-20 / AC47) | Component: Setup has no `copy-node-setup-prompt` and no Install Node.js first section. Paste file and `/setup/node` still covered above. |
| Visitor paste origin (WA-19) | Unit: `getVisitorPasteOrigin` in production forces `https://sdd.works` even when `PUBLIC_BASE_URL` is localhost; setup paste sentence uses that origin. |
| `GET /setup` (feature-56 regression) | Still 200 stdio-primary markdown from `prompt.md`; body is not `install.md`. |
| `GET /api/sdd/instructions-tabs` (feature-59) | Cache `content/.instructions-tabs.json` valid → 200; `tabs` order matches file; `setup` code tab present; each `content` tab has `html` for `locale=en` from cache path; top-level `source` `cache`. Missing or invalid cache file → 200 from bundled [`src/content/.instructions-tabs.json`](../../src/content/.instructions-tabs.json) only; top-level `source` `bundled`. Duplicate `queryParam` or unknown `code.id` → bundled fallback. Content path `../` → bundled fallback. Missing zh path → `sourceLocale` `en` for that tab. Per-tab markdown uses `contentSource` `cache` or `package` like Features. No GitHub fetch; no key values |
| Instructions tabs resolver (feature-58 / feature-59) | Unit: parse and validate schema v1; reject empty `tabs`, duplicate `id` / `queryParam`, disallowed `code.id`, content row without `paths.en`, unsafe paths. Path values are relative to sync unpack root (`content/features/…`). File-existence checks use that root (fixture unpack or `pack.framework.sdd.works/`). Runtime package fallback maps those paths under `src/content/` (same as Features) |
| Keys CRUD | Create / list / update / delete; decrypt with current `KEYS_ENCRYPTION_KEY` |
| Users invite | Rate-limit invite; cannot delete self / last admin. **AC57:** invite mail keys resolve for the request `resolveLocale` (`zh-Hans` when cookie or `Accept-Language` says so) |
| Password reset mail | **AC58:** reset mail keys resolve for the request `resolveLocale` |
| Settings | Dirty-only Save; unreachable URL does not persist |
| Framework | Tree from SYNK cache; top-level one-level expand + indented child rows; force sync; sync error keeps shell |
| `GET /api/admin/admin-note` (**Web-portal-26**) | No session → 401. With session + fixture unpack containing `content/.admin-note.md` → 200, `source` `cache`, `html` contains `Notes to the admin` and `content-table`. Empty/missing cache file → 200, `source` `package`, body matches bundled seed substring. Response has no session secrets |

**feature-04 / feature-05:** Feature-04 is the form. Feature-05 owns the public exact-name lookup and the value / not-found / empty UI. The old feature-06 row is merged into feature-05. Those cases still describe the form on Features, which is what shipped.

**feature-17 / ADR-067 (historical):** Setup placement shipped Sprint 3. **ADR-115** replaces placement with Learn tab only; ADR-067 lookup rules still apply.

**feature-73 / ADR-115:** [ADR-115](../adr/ADR-115-get-secret-on-learn-tab.md). `secret-lookup` is in `learn-scrum-embed` after `learn-scrum-iframe` and before the learn.sdd.works fallback link, anchor `#learn-secret`. Setup and Features have no `secret-lookup`. Submit does not leave `tab=learn-scrum-in-sdd`. Hint, button, found, missing, empty, scroll, and width stay as feature-05. Mockup [`13-instructions.html`](./ui-mockup/13-instructions.html) shows the Learn panel block; Setup panels in mockups have no secret form.

**feature-07:** task-03 owns the cache read. task-04 owns the body. task-05 owns the package-file fallback. task-06 runs §7 before the feature is Done.

---

## 4. E2E (Playwright)

| Spec area | Scenarios |
| --- | --- |
| Public home | `/` shows `instructions-guide` (not logo-card home); footer fixed (WA-01, WA-02) |
| Instructions | Guide title visible; Setup and Features tabs; Features click shows `panel-features` and the tab is the hit target at its center (WA-06); agents roster lists seven names in order. **feature-07:** Features shows `features-body` text from the cache fixture for `en` and `zh-Hans`; `zh-Hant` with no cache file shows the English cache body; a missing cache shows the body from `src/content/features/`; Setup still shows `copy-setup-prompt`. **feature-56:** Setup does not show `copy-lite-setup-prompt`; full MCP copy unchanged. **ADR-115:** Setup has no `secret-lookup`; Learn tab shows `secret-name` and `secret-get` between iframe and fallback; locale switch updates placeholder and button. **feature-05 on Learn:** Get secret at `#learn-secret` keeps `tab=learn-scrum-in-sdd`; result and error in view; known, unknown, and empty cases. **feature-60:** `/` load without query opens Setup; reorder fixture config puts Scrum before Features in the tab bar; `?tab=scrum-in-sdd` deep-links; Scrum and Features panels still load markdown from configured paths |
| Login | Seeded admin reaches keys landing; empty-password admin → set-password; hashed admin is not trapped on empty-account set-password (WA-04) |
| Password reset | Submit keeps URL `/reset-password` and shows success callout or `reset-error` (WA-05); success callout is the previous `admin.reset.sent` sentence with no `{email}` and has no `?email=` query (WA-08 / WA-10); mail capture / fixture path when configured; after send, Back to login → `/login` (WA-03) |
| Keys | Create, list shows value, copy, edit, delete, bulk delete |
| Admins | Invite list; delete confirm; self/last-admin blocked |
| Settings | Save valid URL; unreachable rejected |
| Framework | Cache-backed tree; one-level default expand; indented child entries; dirs before files then name sort at each level; sync button; change-repo navigates; collapse/expand top-level folder; empty → Settings CTA |
| Framework admin note (**Web-portal-26**) | Signed-in on `/admin/framework`: **Admin note** opens dialog; `framework-admin-note-body` shows pack-file table row (for example `lite-pack.allowlist.json`); json fence shows `codeblock--file` with Copy; Close returns to tree without navigation |
| i18n | Locale switch updates chrome copy. **Web-portal-39:** one browser check with no `sdd_locale` and `Accept-Language: zh-TW` loads `/` with `html lang` `zh-Hant` and stores `sdd_locale=zh-Hant` (**AC52**) |

Config: `playwright.config.ts` injects a fixture `KEYS_ENCRYPTION_KEY`. It does not set `GITHUB_FIXTURE`. The server ignores that variable.

**Operator pitfall (this Mac):** Playwright’s fixture encryption key can differ from `.env.local`. Prefer a separate E2E database, or re-encrypt / delete rows encrypted under the fixture key before opening the Keys page in `npm run dev`.

---

## 5. Regression checklist (after Sprint 6 MCP work)

Portal must stay green while MCP install lands:

- [ ] Login + keys list still load after MCP changes
- [ ] Settings + Framework still work against the real GitHub port
- [ ] No new portal routes required for MCPI-05

---

## 7. Regression after feature-07

Run this after task-04 and task-05, before feature-07 is marked Done. Use `/` and `/instructions`. Desktop and a viewport under 640px for the secret row.

- [x] Setup copy control still copies `Fetch and execute the setup instructions from https://sdd.works/setup`
- [x] ~~Manual setup still shows one `mcp.json` and no `curl`~~ Superseded after [ADR-122](../adr/ADR-122-instructions-guide-hero-and-setup-tab.md): no on-page Manual setup
- [x] ~~Tools table has `sdd_install_framework` and `sdd_update_framework` and no `sdd_list_versions` row~~ Superseded after ADR-122: no Tools table on Setup
- [x] Features tab switch still sets `aria-selected` and shows `panel-features` (WA-06)
- [x] Get secret: known name shows `secret-result` in view; unknown name shows `secret-missing`; empty name shows `secret-empty` and does not call the API
- [x] Reset success still uses the previous `admin.reset.sent` sentence and stays on `/reset-password` with no `?email=`
- [x] Locale switch still changes tab labels, the secret hint, and the secret button
- [x] A missing sync cache still shows `features-body` from `src/content/features/` and does not remove Setup
- [ ] After ADR-115: Get secret on Learn tab only; Setup unchanged except no secret block
- [x] No console or server error on these paths

---

## 8. Out of scope

- MCP tool contracts and path detection E2E → [`../mcp/mcp-tests.md`](../mcp/mcp-tests.md)
- Live Resend / live GitHub in default CI
- Lite receipt merge on the server (agent + [Spec-seeds-18](../product-backlog.md#L482); **feature-57** **Done** in product repo)

---

## 9. Regression after feature-55

Run after feature-55 routes ship, before the SBI is **Done**. Use `SDD_PACKAGE_CACHE_DIR` for an isolated cache. Do not set `GITHUB_FIXTURE`.

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
- [ ] `GET /setup/install` body documents partner paste: `Fetch and execute the setup instructions from https://sdd.works/setup/install`
- [ ] ~~Manual setup still shows one stdio `mcp.json` and no `curl`~~ N/A after ADR-122 (see §25)
- [ ] Get secret on Learn tab only; Setup and Features unchanged
- [ ] No admin session required for `GET /setup/install`
- [ ] No console or server error on these paths

---

## 11. Regression after feature-58–feature-60

Run after dynamic tabs ship, before **feature-60** is **Done**. Isolated cache (`SDD_PACKAGE_CACHE_DIR`) plus bundled [`src/content/.instructions-tabs.json`](../../src/content/.instructions-tabs.json). Do not set `GITHUB_FIXTURE`.

- [ ] `GET /api/sdd/instructions-tabs?locale=en` returns 200 with `setup`, `features`, and `scrum-in-sdd` tabs
- [ ] `/` and `/instructions` without `?tab=` show Setup selected and `panel-setup` visible
- [ ] `?tab=features` and `?tab=scrum-in-sdd` open the correct panel on full load (WA-06)
- [ ] Setup copy still copies the `/setup` sentence; one stdio `mcp.json`; no Get secret on Setup
- [ ] `GET /api/sdd/features?locale=en` still returns 200 (legacy route until removed)
- [ ] Invalid cache `content/.instructions-tabs.json` still serves tabs from bundled JSON only
- [ ] No console or server error on these paths

## 12. Regression after feature-70

Re-run when Learn Scrum embed or instructions-tabs config changes. **feature-70** closed 2026-10-07. [ADR-110](../adr/ADR-110-embedded-external-page-tab.md). AC26 in [`app-stories.md`](./app-stories.md).

| Layer | Check |
| --- | --- |
| Unit | Bundled JSON `learn-scrum-in-sdd` is `embedded_external_page`. All three `urls` values are `https://learn.sdd.works/en/learn-embedded/`. A host outside `learn.sdd.works` fails validation. |
| Component | `?tab=learn-scrum-in-sdd` shows `learn-scrum-iframe` with that src in `en`, `zh-Hans`, and `zh-Hant`. Fallback link uses the same href. Setup stays default without `?tab=`. |
| Browser | Open `/?tab=learn-scrum-in-sdd`. Confirm the iframe or the fallback link. A blank frame is a `learn.sdd.works` framing policy, not a missing tab. |

## 13. Regression after feature-71

Re-run when content-tab markdown renderers or heading slug rules change. **feature-71** closed 2026-10-07. Unit tests in Vitest. No new API route. Markdown files stay unchanged.

| Case | Expect |
| --- | --- |
| `# **Part IV** The 2020 Scrum Guide Summary` through `renderPortalMarkdown` | `<h1 id="part-iv-the-2020-scrum-guide-summary">` |
| Two headings with plain text `Rules` in one document | ids `rules` and `rules-1` |
| A second `renderPortalMarkdown` call | slug counter starts again at the bare id |
| Features markdown with an `h2` and an em-dash list row | heading has an `id`; the row still uses `feature-name` and `feature-desc` |
| Browser | On `/instructions?tab=scrum-in-sdd`, activate the Part I index link and the Part IV index link (Scrum Guide summary). Each heading is in view and not under the tab bar. |

- [ ] Bold Part IV heading id matches the Index fragment
- [ ] Duplicate heading ids use `slug` then `slug-1`
- [ ] Features em-dash split still works and the heading has an id
- [ ] Index `#` fragments on the pack English file match rendered heading ids (Vitest `should_match_index_hrefs_to_rendered_heading_ids`)
- [ ] Part I and Part IV index links on the Scrum tab scroll to those headings
- [ ] No console or server error on that path

## 14. Regression after Web-portal-29

Run before [Web-portal-29](../product-backlog.md#L419) is **Done**. AC27 in [`app-stories.md`](./app-stories.md). [ADR-111](../adr/ADR-111-guide-header-sticky.md). No new API route and no new message keys.

| Layer | Check |
| --- | --- |
| Component | `guide-sticky` wraps `guide-hero` and `guide-tabs` on the instructions guide. `guide-hero` has no bottom border. `guide-tabs` keeps a bottom border. Locale markup stays outside `guide-sticky`. |
| Browser, happy | Open `/` and `/instructions`. Scroll the tab body. Logo, title, tagline, and the selected tab stay at the top. No hairline under the tagline. Tab underline and active mark remain. |
| Browser, edge | At 375px width, the title may wrap and the tab row may scroll inside the bar. The page does not scroll sideways. The locale switch leaves the viewport on scroll. |
| Browser, heading | On a content tab, activate a heading link from AC25. The heading sits fully below the pinned block. |

- [ ] `guide-sticky` contains the hero and the tab list, and not the locale switch
- [ ] Tagline has no bottom border; tab list keeps its bottom border
- [ ] Scroll on `/` and `/instructions` keeps logo, title, tagline, and tabs in view
- [ ] 375px viewport: no horizontal page scroll
- [ ] Heading fragment lands below the pinned block
- [ ] No console or server error on those paths

## 15. Regression after ADR-112

Run before the Learn embed frame change ships. AC28 in [`app-stories.md`](./app-stories.md). [ADR-112](../adr/ADR-112-learn-embed-frame.md). No new API route and no new message keys. The WordPress padding inside the frame is out of scope.

| Layer | Check |
| --- | --- |
| Component | `learn-scrum-iframe` is still in `learn-scrum-embed`. `src` is `https://learn.sdd.works/en/learn-embedded/`. The element has class `learn-embed-frame`. |
| CSS | `.learn-embed-frame` sets `aspect-ratio: 1 / 1`, `width: 100%`, `height: auto`, `border: 0`. It does not set `min-height: min(72vh, 780px)`. |
| Browser | On `/?tab=learn-scrum-in-sdd`, the frame is square, has no border, and the open-in-new-tab link still uses the same URL. |

- [ ] Iframe src is unchanged from AC26
- [ ] Frame has no border
- [ ] Frame aspect ratio is 1 / 1 and width is 100%
- [ ] Frame does not use the 72vh min-height
- [ ] No console or server error on that path

## 16. Regression after ADR-113

Run before the Learn copy and fallback change ships. AC29 in [`app-stories.md`](./app-stories.md). [ADR-113](../adr/ADR-113-learn-embed-copy-and-fallback.md). Embed host allowlist unchanged.

| Layer | Check |
| --- | --- |
| i18n | `admin.guide.learn_scrum_intro` and `admin.guide.learn_scrum_open_external` exist in `en`, `zh-Hans`, and `zh-Hant`. Prefix and split link keys are removed. |
| Component | `learn-scrum-iframe` `src` is still the embed URL from tab config. Fallback `href` is `https://learn.sdd.works`. Fallback text comes from `admin.guide.learn_scrum_open_external`. |
| Browser | On `/?tab=learn-scrum-in-sdd`, intro matches the active locale catalog. Fallback opens learn.sdd.works. Iframe still loads sdd.works embed. |

- [ ] Intro key updated in all three locale files
- [ ] Single fallback key; old prefix and link keys gone
- [ ] Iframe src unchanged; fallback href is learn.sdd.works
- [ ] No console or server error on that path

## 17. Regression after ADR-114

Run before the Learn auto-height change ships. AC30 in [`app-stories.md`](./app-stories.md). [ADR-114](../adr/ADR-114-learn-embed-auto-height.md). Supersedes ADR-112 square frame checks in §15 where they conflict.

| Layer | Check |
| --- | --- |
| CSS | `.learn-embed-frame` has `width: 100%`, `border: 0`, no `aspect-ratio: 1 / 1`, no `min(72vh`. |
| Component | `LearnScrumEmbedPanel` registers a `message` listener with origin allowlist. Valid `sdd-learn-embed-height` sets iframe `height`. Unknown types and bad origins are ignored. Fallback height applies before the first valid message. |
| Contract | Message type string `sdd-learn-embed-height` lives in one module (for example `src/lib/learn-embed-messaging.ts`) and is imported by the panel and tests. |
| Browser | On `/?tab=learn-scrum-in-sdd`, iframe width matches intro column. After sdd.works posts height, the frame height fits the grid without a large empty square. |

- [ ] No fixed square aspect ratio on the iframe
- [ ] postMessage origin gate tested
- [ ] Height update tested with a mocked message
- [ ] No console or server error on that path

**Dependency (sdd.works, manual or separate repo):** `learn-embedded` posts `sdd-learn-embed-height` and uses full-width embed CSS per ADR-114.

## 18. Regression after ADR-115

Run before **feature-73** / [Web-portal-31](../product-backlog.md#pb-128) is **Done**. AC31 in [`app-stories.md`](./app-stories.md). [ADR-115](../adr/ADR-115-get-secret-on-learn-tab.md). No new API route and no new message keys.

| Layer | Check |
| --- | --- |
| Component | `GuideSecretLookup` renders inside `learn-scrum-embed` after `.learn-embed-fallback`. `SetupGuidePanel` has no `secret-lookup`. |
| Unit | `LearnScrumEmbedPanel.test.tsx`: order iframe → fallback → secret; no intro copy. `InstructionsPage.test.tsx`: Setup panel lacks `secret-lookup`; Learn panel has it. |
| Integration | `POST /api/sdd/secret` unchanged; empty name rejected without fetch from Learn panel. |
| Browser | On `/?tab=learn-scrum-in-sdd`, run known-name Get secret; result in view. Switch to Setup; no secret form. |

- [ ] Secret block only on Learn tab with id `learn-secret`
- [ ] Order: iframe, then open learn.sdd.works link, then secret block
- [ ] Lookup behavior matches feature-05
- [ ] Setup tools table and copy prompt unchanged
- [ ] No console or server error on Setup and Learn paths

## 19. Regression after WA-14 (instructions horizontal scroll)

Run before [WA-14](../issues-log.md) closes. Reasserts [AC27](./app-stories.md) scenario **A narrow viewport does not scroll the page sideways** and the same rule on wider viewports. No new API route and no new message keys.

| Layer | Check |
| --- | --- |
| CSS | Guide shell and main column contain width: no child forces the document wider than the viewport. `.guide-tabs` keeps `overflow-x: auto` for tab labels only. Learn iframe uses `width: 100%` and `max-width: 100%`. Secret lookup row respects `max-width: 100%` at every breakpoint (including viewports between 640px and ~900px where a fixed `32rem` input can overflow). |
| Unit | Optional: stylesheet or layout test that `.secret-lookup .input-box` does not set a `min-width` larger than the guide column above the mobile breakpoint, or documents the breakpoint where it shrinks. |
| Browser | At **375px**, **768px**, and **≥1280px** width: open `/`, `/instructions`, and `/?tab=learn-scrum-in-sdd`. Assert `document.documentElement.scrollWidth <= document.documentElement.clientWidth`. Swipe or trackpad horizontal gesture does not move the page. Guide content stays centered in the viewport. |
| Browser, tabs | On Features and a content tab with a wide table, horizontal scroll stays inside `.content-table`, not on `html` / `body`. |

- [ ] No horizontal overflow on `/` at 375px, 768px, desktop
- [ ] No horizontal overflow on `/instructions` and Learn tab at those widths
- [ ] Tab row scrolls internally; page does not
- [ ] Learn iframe and secret block fit the guide column
- [ ] No console or server error on those paths

## 20. Regression after ADR-117 / WA-15

Run before **WA-15** closes. [ADR-117](../adr/ADR-117-learn-embed-spacing-and-codeblock-tokens.md). Learn spacing, global codeblock tokens, secret result row.

| Layer | Check |
| --- | --- |
| Component | No `learn-embed-intro`. Order: iframe → `.learn-embed-fallback` → `#learn-secret`. |
| CSS | `.learn-embed-fallback` `margin-top: 15px`. `.learn-embed-secret` `margin-top: 45px`. Global `.codeblock`: `border-radius: 0`, `1.5px` border, `var(--fill)`. `secret-result` is `.codeblock.secret-result-block`; row height **2.125rem**; Copy width = Get secret. |
| Unit | Panel tests assert order; result uses `codeblock` not `secret-result-row`. `learn-embed-spacing.test.ts` asserts 15px / 45px and global codeblock tokens. |
| Browser | Mockup `13-instructions.html` matches live Learn tab spacing and post-lookup result row. |

- [ ] 15px iframe to fallback link
- [ ] 45px fallback to Get secret
- [ ] Value row is codeblock with visible border, square corners
- [ ] Value row height matches key row; Copy width matches Get secret
- [ ] Setup `mcp.json` code blocks still readable after global codeblock token change
- [ ] `mcp.json` header row uses page background (`--bg`); JSON body uses `--fill`

## 21. Regression after ADR-118 (Learn embed loading skeleton)

Run before AC32 is **Done**. [ADR-118](../adr/ADR-118-learn-embed-loading-skeleton.md). No new API route.

| Layer | Check |
| --- | --- |
| i18n | `admin.guide.learn_scrum_embed_loading` in `en`, `zh-Hans`, and `zh-Hant`. |
| Component | `LearnScrumEmbedPanel` wraps iframe in `.learn-embed-frame-host`. While loading, `learn-embed-loading` is visible and host has `aria-busy="true"`. After iframe `load`, overlay hidden and `aria-busy="false"`. Changing `embedUrl` shows loading again until the next `load`. Fallback and `secret-lookup` remain in document order below the host. |
| CSS | `.learn-embed-skeleton` uses 3×3 grid; cells use guide fill and line tokens; overlay `pointer-events: none`. No pulse when `prefers-reduced-motion: reduce`. |
| Unit | `LearnScrumEmbedPanel.test.tsx`: skeleton visible before load; hidden after `fireEvent.load` on iframe. Optional CSS test for grid columns on skeleton class. |
| Browser | On `/?tab=learn-scrum-in-sdd`, throttle network or hard refresh: skeleton visible in embed area for slow loads; link and Get secret usable without waiting for iframe. Mockup `13-instructions.html` shows skeleton state for design confirm. |

- [ ] Loading label resolves in three locales
- [ ] Skeleton 3×3 visible until iframe load
- [ ] Fallback and Get secret not covered by overlay
- [ ] Reduced motion disables skeleton pulse

## 22. Regression after ADR-119 (Instructions tab labels)

Run before **WA-16** closes and **Web-portal-33** is **Done**. [ADR-119](../adr/ADR-119-instructions-tab-labels-in-pack-config.md). AC33.

| Layer | Check |
| --- | --- |
| Schema | Pack and bundled `content/.instructions-tabs.json` use **`labels`** on every tab row. No `labelKey`. |
| Validator | `validateInstructionsTabsConfig` fails when `labelKey` is present or `labels.en` is missing or empty. |
| Resolver / API | `GET /api/sdd/instructions-tabs?locale=` returns **`label`** per tab from `labels[locale]` with en fallback. Response tabs omit `labelKey`. |
| UI | `InstructionsPage` tab buttons show resolved **`label`**; no `t(locale, labelKey)` for tabs. |
| Pack | Operator doc [`content/.admin-note.md`](../../src/content/.admin-note.md) and pack copy describe **`labels` only**. |
| Unit | `instructions-tabs-config.test.ts`, `instructions-tabs.test.ts`, `InstructionsPage.test.tsx` use `labels` fixtures. |
| Browser | Change `labels.en` for one tab in cache config, sync, reload guide: tab bar shows new text without editing `messages/*.json`. |

- [ ] All tab types (`code`, `content`, `embedded_external_page`) use labels only
- [ ] zh-Hant missing uses en label
- [ ] Invalid labelKey config falls back to bundled JSON when bundled file is valid
- [ ] Obsolete `admin.guide.tab_*` message keys removed or unused

## 23. Regression after WA-17 / ADR-120 (Learn embed centered loader)

Run before [WA-17](../issues-log.md) closes. AC34 in [`app-stories.md`](./app-stories.md). [ADR-120](../adr/ADR-120-learn-embed-centered-loading-indicator.md). No new API route and no new message keys.

| Layer | Check |
| --- | --- |
| Component | While `!iframeLoaded`, `learn-embed-loading-indicator` is in `.learn-embed-frame-host` above the skeleton grid. After `fireEvent.load` on the iframe, indicator and skeleton are gone. `learn-scrum-iframe` uses a loading class or attribute that hides paint until load. |
| CSS | `.learn-embed-loading-indicator` is centered in the host (`inset: 0` + flex center, or equivalent). Spinner uses guide tokens only (no sdd.works blue). Skeleton pulse does not set whole-cell opacity below 1. `@media (prefers-reduced-motion: reduce)` disables indicator rotation. Loading iframe rule: `visibility: hidden` or documented equivalent. |
| Unit | `LearnScrumEmbedPanel.test.tsx`: indicator present before load; absent after load. Optional CSS contract in `learn-embed-loading.test.ts` for centered indicator and hidden iframe rules. |
| Browser | On `/?tab=learn-scrum-in-sdd`, throttle network or disable cache and hard refresh: one ring centered in the embed host; no misaligned spinner in a single tile; tiles appear after load. Fallback link and Get secret stay usable. Mockup `13-instructions.html` matches indicator placement. |

- [ ] Centered `learn-embed-loading-indicator` during load
- [ ] Iframe hidden from view until load
- [ ] No embed-origin spinner visible through overlay
- [ ] Reduced motion: no rotation on indicator
- [ ] AC32 skeleton and aria-busy behavior unchanged after load

## 24. Regression after ADR-121 (SDD WORKS wordmark)

Run before **Web-portal-34** is **Done**. [ADR-121](../adr/ADR-121-sdd-works-wordmark-logo.md). AC35. Mockup approved before production asset swap.

| Layer | Check |
| --- | --- |
| Asset | `src/618x618.logos.png` is 718×256 RGBA. `public/sdd-logo.png` matches the source byte-for-byte after copy. |
| Component | `Logo.tsx` uses `/sdd-logo.png` with width **718** and height **256** for all sizes. Classes `logo-full`, `logo-header-mark`, and size wrappers unchanged unless mockup adjusts offsets. |
| CSS | `.logo img` keeps transparent background and `object-fit: contain`. Heights: header **72px**, auth **112px**, home **144px** unless mockup review changes tokens. |
| Mockup | `specs/admin-portal/ui-mockup/assets/sdd-logo.png` matches source. `13-instructions.html`, `01-home.html`, `02-login.html` use width **718** height **256** on wordmark imgs. |
| Browser | `/instructions` header, `/login`, and `/` hero: wordmark sharp, no clipped splatter, no layout jump on load. Link `aria-label` still uses host string only. |
| Out of scope | `sdd-mark.png`, favicon, apple-icon unchanged. |

- [x] Operator approved mockup before `public/` update
- [ ] `/sdd-logo.png` serves new art in dev and CI
- [ ] No regression on sticky guide header (ADR-111)
- [ ] No console or server error on `/`, `/instructions`, `/login`

## 25. Regression after ADR-122 (guide hero and Setup tab)

Run before **Web-portal-35** is **Done**. [ADR-122](../adr/ADR-122-instructions-guide-hero-and-setup-tab.md). AC36. Mockup approved 2026-10-08.

| Layer | Check |
| --- | --- |
| i18n | `admin.guide.title` is Built on Harness. Ready for Scrum in en, zh-Hans, zh-Hant. Keys `setup_highlight`, `setup_install_phrase`, `setup_update_tool` present in all three catalogs. |
| Hero CSS | `--font-hero` loads Antonio. `.guide-hero-title` logo height **5.625rem**, `margin-left: -23px`, h1 **700** and clamp per `app-design.md`. |
| Setup DOM | `setup-highlight`, `copy-setup-prompt`, `copy-install-phrase`, `copy-install-cmd`, `setup-update-preface`, `guide-agents`. No `#manual-setup`, `#tools`, `copy-update-cmd`. |
| `/setup` API | `GET /setup` markdown still documents stdio `mcp.json` (portal does not duplicate it). |
| Component tests | `InstructionsPage.test.tsx` asserts Setup panel without manual MCP block or Tools table. |
| Mockup | `01-home.html` and `13-instructions.html` match production structure for hero and Setup. |

- [ ] Hero title and Antonio render on `/` and `/instructions`
- [ ] Setup highlight and update preface visible in three locales
- [ ] Install phrase copies localized text; install cmd copies `sdd_install_framework`
- [ ] Seven agents in roster; no agents intro
- [ ] No regression on ADR-111 sticky header or ADR-115 secret on Learn only
- [ ] No console or server error on `/instructions`

## 26. Regression after ADR-123 / feature-77 (same look for every markdown tab)

**What this proves:** Features, Scrum, help, and future markdown tabs share one table and heading style ([WA-18](../issues-log.md)). Run before [WA-18](../issues-log.md) closes. AC37. Mockup approved before production. [ADR-123](../adr/ADR-123-unified-guide-markdown-body.md).

| Layer | Check |
| --- | --- |
| DOM class | Every content tab article uses `guide-md-body`; Features adds `guide-md-body--catalog`; Scrum in SDD and invoke-agents use `guide-md-body--prose`; new content tabs default to `--prose`. Legacy `features-body`, `scrum-body`, and `portal-content-body` are not on the article. |
| HTML pipeline | `renderContentMarkdown` wraps `<table>` in `content-table` for all content paths, including `content/features/`. |
| CSS | One rule block in `portal.css` mirrors mockup `guide-md-body`; admin global `table` / `th` / `td` do not style content-tab tables. Token `--guide-md-catalog-col1` in `tokens.css`. |
| Width | Markdown body uses full `--guide-max` column; no inner `40rem` cap on paragraphs or tables. |
| Mockup | `13-instructions.html` Features and Scrum samples; `14-invoke-agents-review.html`; `01-home.html` Features tab. |

- [ ] User confirmed mockup for catalog tables and h3 alignment
- [ ] Features, Scrum, and invoke-agents match mockup at desktop width
- [ ] `instructions-tabs.test.ts` expects Features HTML to include `content-table`
- [ ] No horizontal scroll regression (AC27 / §19)

## 27. Regression after ADR-124 / feature-74 (Knowledge tab — folder browser)

**What this proves:** The Knowledge tab lists pack folders and articles, path links work, and articles use the shared markdown body. Run before **feature-74** / [Web-portal-36](../product-backlog.md#pb-133) is **Done**. AC38. Mockup path trail confirmed 2026-10-08.

| Layer | Check |
| --- | --- |
| Validator | `validateInstructionsTabsConfig` accepts `internal_page_folder` with `rootPath`; rejects `..` and missing root `.index.json` when file checks enabled. Index parser rejects duplicate file `id`, missing `open`, and non-`.md` paths. |
| API / resolver | Resolves `content/knowledge/.index.json` from bundled seeds; locale label fallback to `en`; returns `open` on file entries. |
| Unit / component | `KnowledgeFolderPanel`: path trail segments match `queryParam`, `path`, and `doc`; prefix links build correct hrefs; no **Back** control; no folder `h2` on lists; `same_tab` toggles list vs prose. |
| URL | `?tab=knowledge`, `?tab=knowledge&path=archived`, `?tab=knowledge&path=archived&doc=invoke-agent-trae`, `?tab=knowledge&doc=invoke-agents` deep-link without client-only blank panel. |
| new_tab | Row `href` matches same-tab article URL; `target="_blank"`; current tab stays on folder list without `doc`. |
| CSS | `.guide-folder-*` under `.guide-section.guide-folder-browser`; articles use `.guide-md-body--prose` like other content tabs; no **`.knowledge-*`** rules in `portal.css`. |
| E2E | Playwright: Knowledge root path → subfolder via list → `same_tab` article → root via path link on `knowledge`. |
| Seeds | `npm run check:pack-seeds` green after Knowledge tab row in `.instructions-tabs.json`. |

- [ ] User confirmed mockup before production (done 2026-10-08)
- [ ] Three locales smoke: `admin.guide.knowledge_path_label` and list entry labels resolve
- [ ] Broken `doc` id shows panel error, not a blank panel
- [ ] No regression on content tabs (§26) or Learn embed (§20–§25)
- [ ] No console or server error on Knowledge happy path

## 28. Regression after Web-portal-26 (Admin note on Framework)

Run before Web-portal-26 closes. AC39–AC43 in [`app-stories.md`](./app-stories.md).

| Layer | Check |
| --- | --- |
| Resolver | `readAdminNote`: cache `content/.admin-note.md` first; bundled `src/content/.admin-note.md` second; `source` `cache` or `package`; prose via `renderPortalMarkdown`; fences → `codeblock--file` with preserved pre indent. |
| API | `GET /api/admin/admin-note`: 401 without session; 200 with `{ html, source }`; no locale param; no secrets in body. |
| UI | `framework-admin-note` after sync button; `.floating-frame` inside `framework-admin-note-dialog`; `framework-admin-note-body` uses `guide-section` + `guide-md-body--prose`; literal **Admin note** and **Close**; Escape and backdrop dismiss; Copy on file fences. |
| CSS | Copy `.floating-frame*` from mockup to `portal.css`; ADR-123 prose + ADR-117 codeblock tokens. |
| E2E | Open note → table row from seed → json Copy does not navigate away → Close → tree present. |
| Settings | Settings page has no inline pack note block. |
| Mockup | [`12-framework.html`](./ui-mockup/12-framework.html), `?admin-note=1` — confirmed 2026-10-08. |

- [x] User confirmed mockup before production (2026-10-08)
- [ ] Sync then re-open shows updated markdown when cache file changes
- [ ] No regression on Framework tree (§3–§4) or Settings save
- [ ] No console or server error on Admin note happy path

## 29. Regression after ADR-127 / feature-72 (portal on sdd.works, course on learn.sdd.works)

**What this proves:** After cutover, the guide and setup live on **`sdd.works`**, the Learn iframe loads **`learn.sdd.works`**, and old **`framework.sdd.works`** URLs redirect. Run before **Web-portal-30** / **feature-72** is **Done**. **AC44** in [`app-stories.md`](./app-stories.md). [ADR-127](../adr/ADR-127-public-hostnames-sdd-and-learn.md). Operator DNS and WordPress **`frame-ancestors`** are prerequisites for browser iframe checks in production.

| Layer | Check |
| --- | --- |
| Pack JSON | `pack.framework.sdd.works/content/.instructions-tabs.json` and `src/content/.instructions-tabs.json` **`learn-scrum-in-sdd.urls.*`** are **`https://learn.sdd.works/en/learn-embedded/`**. |
| Allowlist | `EMBED_PAGE_HOST_ALLOWLIST` includes **`learn.sdd.works`** and **`www.learn.sdd.works`**. **`sdd.works`** is not an embed host after cutover. |
| Constants | `SDD_WORKS_LEARN_URL` (or successor) resolves to **`https://learn.sdd.works/en/learn-embedded/`**. `SDD_LEARN_SITE_URL` stays **`https://learn.sdd.works`**. |
| Setup / MCP | `SetupGuidePanel` and **`GET /setup`** markdown use production origin **`https://sdd.works`** (`/setup`, `/mcp`, lite `/setup/install`). Default **`PUBLIC_BASE_URL`** is **`https://sdd.works`**. |
| UI host | `layout` title and logo **`aria-label`** use **`sdd.works`**. |
| Unit | `instructions-tabs.test.ts`, `instructions-tabs-config.test.ts`, `learn-embed-messaging.test.ts`, `sdd-works-learn-url.test.ts`, `InstructionsPage.test.tsx`, `LearnScrumEmbedPanel.test.tsx` assert new URLs and allowlist. |
| Component | Learn iframe **`src`** and fallback **`href`** match **AC44**. Setup copy sentence uses **`sdd.works`**. |
| Browser | On production **`https://sdd.works/?tab=learn-scrum-in-sdd`**, iframe loads **`learn.sdd.works`** embed or fallback link works. **`https://framework.sdd.works/`** redirects to **`sdd.works`**. |
| Mockup | [`13-instructions.html`](./ui-mockup/13-instructions.html) shows post-cutover embed **`src`** and setup copy host. |

- [ ] Pack and bundled instructions-tabs JSON match **AC44**
- [ ] Validator rejects pre-cutover embed host **`sdd.works`**
- [ ] postMessage origin gate uses **`learn.sdd.works`**
- [x] Setup paste and `/setup` markdown URLs use **`sdd.works`**
- [ ] Redirect **`framework.sdd.works`** → **`sdd.works`** verified in staging or production
- [ ] WordPress **`learn-embedded`** allows portal **`frame-ancestors`**
- [ ] No regression on Learn loading (§21–§23) or secret on Learn (§18)

## 31. Checklist for feature-84 — visitor URLs (Web-portal-20)

**What this proves:** Your operator guide names **`sdd.works`** as the visitor bookmark and **`learn.sdd.works`** as the course host. Documentation only; app cutover is **feature-72** **Done**.

| Check | Method |
| --- | --- |
| Go-live doc names canonical hosts | Read release / go-live notes |
| Setup paste uses **`sdd.works`** only | **AC48**; §29 component checks |
| No durable second hostname in lite partner sentence | [`LITE_PARTNER_SETUP_SENTENCE`](../../src/mcp/brand.ts) after cutover |

- [x] **AC48** scenarios reviewed with operator
- [ ] Redirect **`framework.sdd.works`** → **`sdd.works`** documented and verified in staging or production

## 32. Checklist for feature-84 — admin URLs (Web-portal-20)

**What this proves:** The same operator guide documents where sign-in and Admin Framework live compared with the public guide on **`sdd.works`**. Matches **AC49**.

| Check | Method |
| --- | --- |
| Routing doc separates **`sdd.works`** guide from admin entry | Operator doc review |
| `/login` and `/admin` still require auth | Existing auth tests / manual |
| Guide tabs expose no admin secrets | §18 and public API smoke |

- [x] **AC49** scenarios reviewed with operator
- [x] Footer admin link behavior documented (new tab vs same host)

## 33. Checklist for Web-portal-21 (partner install-first landing; unplanned here)

**What this proves:** Partner marketing site foregrounds install; framework portal **`/`** stays the instructions guide.

| Check | Method |
| --- | --- |
| Partner landing CTA points at setup markdown or lite sentence | Partner site review (out of this repo) |
| Partner links to **`sdd.works`** instructions guide | Manual link check |
| Framework **`/`** still renders instructions guide | **AC50**; existing `/` tests |

- [ ] **AC50** scenarios accepted for partner property
- [ ] No regression on framework portal home (§25 hero / Setup)

## 30. Regression after feature-88 (Node setup and paste sentences)

Run before **Web-portal-38** / **feature-88** is **Done**. **AC45**–**AC47** in [`app-stories.md`](./app-stories.md).

- [ ] `public/agent-setup/paste-sentences.json` validates; loader resolves **lite_install** and **node_prerequisite**
- [ ] `GET /setup/node` returns 200 markdown per **AC45**; no MCP or lite instructions in body
- [ ] `GET /api/setup/node/catalog` returns 200 JSON per **AC46**
- [ ] `GET /setup/install` and `GET /setup` unchanged except lite paste text may come from JSON (**AC21** parity)
- [x] Setup has **no** **`copy-node-setup-prompt`** and still has no **`copy-lite-setup-prompt`** ([WA-20](../issues-log.md))
- [x] **`copy-setup-prompt`** still copies full MCP `/setup` sentence; in production origin is **`https://sdd.works`** ([WA-19](../issues-log.md))
- [ ] No admin session required for node markdown or catalog routes
- [ ] No console or server error on these paths

## 34. Checklist for Web-portal-39 (visitor locale)

**What this proves:** A first visit follows the browser language, stores `sdd_locale`, and later visits keep that choice. The switcher still wins. Public content APIs do not guess from `Accept-Language`. Invite and reset mail use the same resolver as the page. Matches **AC51–AC59** and [`app-design.md`](./app-design.md) §8.

**Tools:** Vitest for `src/lib/locale.ts` and route tests. Playwright for one first-visit check. No new browser matrix beyond that one path plus the existing locale-switch check.

**Pyramid:** unit cases carry the tag map (about 70%). Route tests cover cookie write, mail locale, and `GET /api/sdd/features` without `locale` (about 20%). One browser check covers first paint (about 10%).

| Check | Layer | Method |
| --- | --- | --- |
| `zh-CN`, `zh-SG`, `zh-Hans`, bare `zh` → `zh-Hans` | Unit | `negotiateLocale` / `resolveLocale` |
| `zh-TW`, `zh-HK`, `zh-MO`, `zh-Hant` → `zh-Hant` | Unit | same |
| `en` and `en-US` → `en`; `ja` alone → `en` | Unit | same |
| Higher q-value wins when two supported tags are listed | Unit | same |
| Valid cookie ignores `Accept-Language` | Unit | **AC54** |
| Invalid cookie negotiates and the helper result is the negotiated locale | Unit | **AC56** |
| Missing cookie and empty header → `en` | Unit | failure / empty |
| Middleware sets `sdd_locale` when the cookie is missing | API | request to `/` with `Accept-Language: zh-CN` and no cookie; `Set-Cookie` is `zh-Hans` |
| Middleware does not overwrite a valid cookie | API | `sdd_locale=en` plus `Accept-Language: zh-CN` stays `en` |
| Invite mail catalog follows `resolveLocale` | API | **AC57** |
| Reset mail catalog follows `resolveLocale` | API | **AC58** |
| `GET /api/sdd/features` without `locale` stays `en` | API | **AC59** |
| First visit `zh-TW` shows Traditional and stores the cookie | Browser | **AC52**; `html lang` is `zh-Hant` |
| Switcher still reloads into the chosen locale | Browser | existing i18n row; **AC55** |

- [x] Unit tag map and q-value cases pass
- [x] Invalid cookie is replaced, not left in place
- [x] Public features call with no `locale` query stays `en` even when `Accept-Language` is `zh-CN`
- [x] One browser load with no cookie and `Accept-Language: zh-TW` shows `lang=zh-Hant` and sets `sdd_locale`
- [x] Locale switch still updates chrome copy
