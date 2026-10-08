# Changes log (framework.sdd.works)

> Type: Framework (process) artifact of framework.sdd.works
> as_of: 2026-10-08
> [Definition](../pack.framework.sdd.works/templates/EN/sdd-scrum-practices.md#changes-logmd)

---

## 2026-10-08

### ADR-121 SDD WORKS wordmark logo (Web-portal-34)

**Why**: The portal wordmark PNG was stale. The operator supplied `src/618x618.logos.png` (718×256 SDD WORKS art).

**What changed**: [ADR-121](./adr/ADR-121-sdd-works-wordmark-logo.md). [Web-portal-34](./product-backlog.md#pb-131) **ToDo**. AC35, [`app-tests.md`](./admin-portal/app-tests.md) §24, [`app-design.md`](./admin-portal/app-design.md) brand rows, [knowledge](./knowledge/agent/admin-portal-seed-and-logo.md). Mockup `assets/sdd-logo.png` updated for review. **Production `public/sdd-logo.png` and `Logo.tsx` wait on mockup approval.**

**Verification**: Open `specs/admin-portal/ui-mockup/13-instructions.html` in a browser. §24 after implementation.

### WA-17 Learn embed centered loading indicator

**Why**: While the Learn tab skeleton showed, the sdd.works iframe spinner appeared in one grid cell instead of the center of the embed host.

**What changed**: [ADR-120](./adr/ADR-120-learn-embed-centered-loading-indicator.md). [`LearnScrumEmbedPanel.tsx`](../src/components/features/LearnScrumEmbedPanel.tsx) adds `learn-embed-loading-indicator` and hides the iframe until `load`. [`portal.css`](../src/styles/portal.css) centers the ring, pulses skeleton background only, and uses `learn-embed-frame--loading`. AC34, [`app-tests.md`](./admin-portal/app-tests.md) §23, mockup `13-instructions.html`. Closed [WA-17](./issues-log.md).

**Verification**: `npm run test -- src/styles/learn-embed-loading.test.ts src/components/features/LearnScrumEmbedPanel.test.tsx` (19 passed with spacing tests). User confirmed usable 08/Oct/2026.

### OGT 2 closed: pack deliverable links

**Why**: Pack files linked into this product repo's `specs/adr/` and used literal `specs/knowledge` paths. Those trees are not in the install tarball.

**What changed**: [`check-pack-seed-links.sh`](../scripts/check-pack-seed-links.sh) fails markdown links to `specs/adr/` or `specs/knowledge/`. Pack [`content/.admin-note.md`](../pack.framework.sdd.works/content/.admin-note.md), scrum-in-sdd seeds, [`ethan.md`](../pack.framework.sdd.works/agents/ethan.md), and [`sdd-retrospective`](../pack.framework.sdd.works/skills/sdd-retrospective/SKILL.md) use placeholders. Mirrored [`src/content/.admin-note.md`](../src/content/.admin-note.md). Specs: [`framework-design.md`](./framework/framework-design.md#pack-deliverable-links), [`framework-stories.md`](./framework/framework-stories.md#sdd-pack-deliverable-links--ogt-2-pack-link-placeholders), CE-PACK-06/07.

**Verification**: `npm run check:pack-seeds`. Cross-review: no `](…specs/adr/` or `](…specs/knowledge/` under `pack.framework.sdd.works/`.

### ADR-119 Instructions tab labels in pack config (WA-16)

**Why**: Tab titles used `labelKey` plus portal `messages/*.json`, so operators could not configure tab names from `content/.instructions-tabs.json` alone.

**What changed**: [ADR-119](./adr/ADR-119-instructions-tab-labels-in-pack-config.md). [WA-16](./issues-log.md) open. [Web-portal-33](./product-backlog.md#pb-130) **ToDo**. AC33, [`app-tests.md`](./admin-portal/app-tests.md) §22. Amended AC22/AC24, [`app-design.md`](./admin-portal/app-design.md), [`framework-design.md`](./framework/framework-design.md), operator [`.admin-note.md`](../src/content/.admin-note.md). **Implementation not started:** JSON files and code still use `labelKey` until Web-portal-33 ships.

**Verification**: Spec review. Build gate: §22 after implementation.

## 2026-10-07

### WA-13 Footer Admin portal opens in a new tab

**Why**: The guide footer Admin portal link replaced the instructions tab with `/login`. Visitors should keep the guide open.

**What changed**: [`SiteFooter.tsx`](../src/components/layout/SiteFooter.tsx) guide variant uses `target="_blank"` and `rel="noopener noreferrer"`. Mockups `01-home.html` and `13-instructions.html` match. [`app-design.md`](./admin-portal/app-design.md) §8 documents the guide footer Admin portal link. Closed [WA-13](./issues-log.md).

**Verification**: `npm test -- src/components/layout/SiteFooter.test.tsx` (2 passed). `npm run typecheck` passed.

### ADR-116 Learn embed layout and secret result row (WA-15)

**Why**: Found-secret UI did not match the key row. Product removed Learn intro and moved the learn.sdd.works link under the iframe.

**What changed**: [ADR-116](./adr/ADR-116-learn-embed-layout-and-secret-result-row.md). [WA-15](./issues-log.md) open. Learn order: iframe → fallback → Get secret. `.secret-result-row` replaces `.codeblock` for values. Specs AC29/AC31, [`app-tests.md`](./admin-portal/app-tests.md) §20, mockup `13-instructions.html`.

**Verification**: Vitest on Learn and Instructions panels; browser check on `/?tab=learn-scrum-in-sdd`.

### ADR-115 Get secret on Learn Scrum tab

**Why**: Visitors who use the Learn embed need key lookup on that tab, not at the bottom of Setup.

**What changed**: [ADR-115](./adr/ADR-115-get-secret-on-learn-tab.md). [Web-portal-31](./product-backlog.md#pb-128) and Sprint 9 **feature-73**. Engineering specs: AC31 [`app-stories.md`](./admin-portal/app-stories.md), [`app-design.md`](./admin-portal/app-design.md), [`app-tests.md`](./admin-portal/app-tests.md) §18, mockups `13-instructions.html` / `01-home.html`, `.learn-embed-secret` in [`portal.css`](../src/styles/portal.css). Pack admin note: Get secret on Learn tab. Implementation not in this entry.

**Verification**: `sdd-spec-to-build` jobs 1–7 complete; build with TDD on `GuideSecretLookup` and panel tests.

### Sprint 8 closed

**Why**: User confirmed feature-51 and task-01 usable and asked whether Sprint 8 can close. Those were the last open SBIs. The sprint goal is met.

**What changed**: Marked [feature-51](./sprint-backlog.md#sprint-8) and [task-01](./sprint-backlog.md#sprint-8) **Done**. [Agent-03](./product-backlog.md#pb-10) and [Agent-02](./product-backlog.md#pb-8) **Done**. Sprint 8 **Status: Done**. All twelve SBIs **Done**. [Spec-seeds-15](./product-backlog.md#pb-97) stays **ToDo** until [MCP-07](./product-backlog.md#pb-105). Next scheduled work is [Sprint 9](./sprint-backlog.md#sprint-9) [feature-72](./sprint-backlog.md#sprint-9).

**Verification**: [`ethan.md`](../pack.framework.sdd.works/agents/ethan.md) Jobs match `constants.json` skill keys; Guiding proposals read one `coach-knowledge.md` heading and do not write without confirm. User close confirm in chat.

### Web-portal-30 hostnames learn.sdd.works and sdd.works

**Why**: The WordPress learn site and the framework portal need distinct public hostnames.

**What changed**: Implementable PBI [Web-portal-30](./product-backlog.md#pb-127) (`#pb-127`). WordPress moves to `learn.sdd.works`. The portal moves to `sdd.works` (from `framework.sdd.works`). [Sprint 9](./sprint-backlog.md#sprint-9) opens **ToDo** with SBI **feature-72**. [Web-portal-20](./product-backlog.md#pb-106) points at this cutover.

**Verification**: [`product-backlog.md`](./product-backlog.md) table row 85 and [`sprint-backlog.md`](./sprint-backlog.md#sprint-9) feature-72 row.

### Sprint 8 close confirm for eight shipped SBIs

**Why**: User confirmed feature-55, feature-56, feature-58, feature-59, feature-60, feature-69, feature-70, and feature-71 usable. Board Status still showed **ToDo** or **WIP** while routes, seeds, tests, and the pack skill were already in the tree.

**What changed**: Marked those eight SBIs **Done** on [`sprint-backlog.md`](./sprint-backlog.md#sprint-8). Set parent PBIs **Done**: [Web-portal-17](./product-backlog.md#L479), [Web-portal-18](./product-backlog.md#L488), [Spec-seeds-16](./product-backlog.md#L277), [Web-portal-24](./product-backlog.md#L395), [Web-portal-25](./product-backlog.md#L400), [Skill-24](./product-backlog.md#L191), [Web-portal-27](./product-backlog.md#L404), [Web-portal-28](./product-backlog.md#L413). [Spec-seeds-15](./product-backlog.md#L474) stays **ToDo** until [MCP-07](./product-backlog.md#L328). Knowledge: [`board-status-lags-shipped-code.md`](./knowledge/agent/board-status-lags-shipped-code.md). Sprint 8 stays **WIP** for [feature-51](./sprint-backlog.md#sprint-8) and [task-01](./sprint-backlog.md#sprint-8).

**Verification**: User close confirm in chat. Lite routes and tests under `src/app/api/sdd/lite/`; tabs under `.instructions-tabs.json`, `instructions-tabs` API, and `InstructionsPage`; Learn embed and heading-id renderer; pack [`sdd-retrospective/SKILL.md`](../pack.framework.sdd.works/skills/sdd-retrospective/SKILL.md).

### ADR-110 embedded external page tab

**Why**: Learn Scrum in SDD embeds a WordPress page. The URL and tab name belong in pack JSON, not a hard-coded React panel.

**What changed**: [ADR-110](./adr/ADR-110-embedded-external-page-tab.md). [Web-portal-27](./product-backlog.md#L404) uses type `embedded_external_page`. `urls.en`, `urls.zh-Hans`, and `urls.zh-Hant` are `https://sdd.works/en/learn/`. Stories AC26, [`app-design.md`](./admin-portal/app-design.md), and [`app-tests.md`](./admin-portal/app-tests.md) §12.

**Verification**: `npm test -- src/core/seeds/instructions-tabs-config.test.ts src/lib/instructions-tabs.test.ts src/lib/sdd-works-learn-url.test.ts src/components/features/LearnScrumEmbedPanel.test.tsx`.

### Web-portal-28 Content tab heading anchors

**Why**: Index links in content tabs use GitHub fragments. The portal renderer emits headings with no `id`, so those links do not scroll.

**What changed**: [ADR-109](./adr/ADR-109-content-tab-heading-anchors.md). Implementable PBI [Web-portal-28](./product-backlog.md#L413) (`#pb-125`). Sprint 8 SBI **feature-71**. Markdown files stay unchanged. `createRenderer` emits GitHub-style heading `id` values with a per-document slug counter (`slug`, then `slug-1`, `slug-2`). Features catalog em-dash rows keep working. `scroll-margin-top: 4.5rem` on content-tab headings in [`portal.css`](../src/styles/portal.css) and the instructions mockup CSS.

**Verification**: Vitest on `features-catalog`, `scrum-in-sdd-catalog`, and `instructions-tabs` heading-id cases. Browser: Scrum in SDD Index “Part I” scrolls to the matching heading.

### Web-portal-27 Learn Scrum in SDD tab

**Why**: Visitors need a **`code`** instructions tab that embeds the **WordPress portfolio** learn course on sdd.works per locale, separate from the pack **Scrum in SDD** markdown tab.

**What changed**: Implementable PBI [Web-portal-27](./product-backlog.md#L404) (`#pb-124`) on **Sprint 8** as **feature-70**. Requirements: `learn-scrum-in-sdd` in tab JSON and `CODE_TAB_REGISTRY`, locale-mapped iframe URLs, i18n keys for label and fallback copy. Spike code: `/learn`, `LearnScrumEmbedPanel`, `sddWorksLearnUrl`.

**Verification**: [`product-backlog.md`](./product-backlog.md) row 82; [`sprint-backlog.md`](./sprint-backlog.md#sprint-8) feature-70.

### Pack ledger field example basename

**Why**: Pack-root `.sdd-installed.json` looked like a client receipt. Install never copies it.

**What changed**: Renamed [`pack.framework.sdd.works/.sdd-installed.example.json`](../pack.framework.sdd.works/.sdd-installed.example.json). Living links in [`framework-design.md`](./framework/framework-design.md), [`framework-tests.md`](./framework/framework-tests.md), [`product-backlog.md`](./product-backlog.md) Spec-seeds-17, [`.pack-repo-scope.md`](../pack.framework.sdd.works/.pack-repo-scope.md), [`spec-review-check-list.md`](./framework/spec-review-check-list.md), [`sprint-backlog.md`](./sprint-backlog.md), and [`src/content/.admin-note.md`](../src/content/.admin-note.md). [ADR-107](./adr/ADR-107-lite-pack-allowlist-filename.md) decision 5 names the example basenames. Client path `{client_root}/.sdd-installed.json` and `MANIFEST_NAME` unchanged.

**Verification**: `rg 'pack\.framework\.sdd\.works/\.sdd-installed\.json'` is empty under living paths. `rg 'MANIFEST_NAME' src/core/tools/install.ts` still equals `.sdd-installed.json`.

### Pack root → `pack.framework.sdd.works`

**Why**: Operator clarity and OGT 6 monorepo step: pack authoring tree leaves `specs/framework/seeds/` for a root folder named like the product pack.

**What changed**: `git mv specs/framework/seeds pack.framework.sdd.works`. Living specs, Vitest seed roots, and [`scripts/check-pack-seed-links.sh`](../scripts/check-pack-seed-links.sh) default `ROOT` retarget to [`pack.framework.sdd.works/`](../pack.framework.sdd.works/). [`status.md`](./status.md) OGT 6 path updated; separate Git remote stays open. Historical ADR and older changes-log rows keep prior paths as history.

**Verification**: `rg 'specs/framework/seeds|framework/seeds' --glob '!specs/changes-log.md' --glob '!specs/adr/**'` is empty. `npm run check:pack-seeds`. `npm test -- src/core/seeds/lite-install-manifest.test.ts src/core/seeds/lite-install-receipt.test.ts`.

### No pack `sdd-build`; domain implement handoff ([ADR-108](./adr/ADR-108-no-pack-sdd-build-skill.md))

**Why**: One `sdd-build` skill is too narrow; implement skills already cover stack and layer scope.

**What changed**: [`sdd-spec-to-build`](./framework/seeds/skills/sdd-spec-to-build/SKILL.md) and [`readiness.md`](./framework/seeds/skills/sdd-spec-to-build/readiness.md) **Build handoff** table. [`framework-design.md`](./framework/framework-design.md), [`framework-tests.md`](./framework/framework-tests.md) **CE-SKILL-04**, Skill-11 text in [`product-backlog.md`](./product-backlog.md), [`fullstack-engineer`](./framework/seeds/skills/fullstack-engineer/SKILL.md) SDD note. [ADR-085](./adr/ADR-085-sdd-spec-to-build.md) living supersession note.

**Verification**: `rg 'propose \`sdd-build\`' specs/framework/seeds/skills/sdd-spec-to-build` has no hits.

### feature-57 Lite install client receipt done

**Why**: User close confirm after Spec-seeds-18 engineering readiness.

**What changed**: [`specs/framework/seeds/.sdd-lite-installed.example.json`](./framework/seeds/.sdd-lite-installed.example.json), [`lite-install-receipt.ts`](../src/core/seeds/lite-install-receipt.ts) (`validateLiteInstallReceipt`, `planLiteInstallReceipt`), Vitest **CE-LITE-03** / **CE-LITE-04**. [`sprint-backlog.md`](./sprint-backlog.md) marks **feature-57** **Done**. [`product-backlog.md`](./product-backlog.md) marks [Spec-seeds-18](./product-backlog.md#L482) **Done**.

**Verification**: `npm test -- src/core/seeds/lite-install-receipt.test.ts`.

### Lite pack allow-list filename ([ADR-107](./adr/ADR-107-lite-pack-allowlist-filename.md))

**Why**: Earlier basenames confused pack allow-list with client receipts or server-only config.

**What changed**: Pack-root file is [`lite-pack.allowlist.json`](./framework/seeds/lite-pack.allowlist.json). Code exports `LITE_PACK_ALLOWLIST_FILENAME` in [`lite-install-manifest.ts`](../src/core/seeds/lite-install-manifest.ts). Living specs and portal ACs updated. Rename the same basename at the pack GitHub repo root and re-sync.

**Verification**: `npm test -- src/core/seeds/lite-install-manifest.test.ts`; `rg 'lite\\.framework|lite-pack\\.config' specs src` has no hits in living paths.

### Admin Settings pack-file note (Web-portal-26)

**Why**: Operators need a signed-in note for which files belong in the pack GitHub repo, including the lite manifest, and which client receipts must stay off that repo.

**What changed**: [`product-backlog.md`](./product-backlog.md) adds [Web-portal-26](./product-backlog.md#L419). [`sprint-backlog.md`](./sprint-backlog.md) Unplanned PBIs row 12. [`status.md`](./status.md) unplanned count is 12. Not on Sprint 8. The note body loads from `content/.admin-note.md`. The authoring seed is [`src/content/.admin-note.md`](../src/content/.admin-note.md).

**Verification**: Requirements `#pb-123` and Product Backlog row 81 both name Web-portal-26. Sprint column is `—`. The seed file states not to commit client ledgers and names `lite-pack.allowlist.json` for lite only.

### Closed OGTs: sdd-build rename and constants.json pack scope

**Why**: User confirmed the two Sprint 7 OGTs are complete.

**What changed**: [`status.md`](./status.md) moves **Check the current skill name … rename it to `sdd-build`** and **Ensure skill-and-rule-only pack as constants.json** from Current OGT to **Last 15 closed OGTs** (Closed Sprint 8). Open OGT table renumbered to five rows.

**Verification**: Current OGT has no row for those task names; closed rows 1–2 name them with Closed Sprint 8.

### Status review sync (rows 1–4)

**Why**: `sdd-review-status` found PBI status drift and stale status header after Spec-seeds-18 refine.

**What changed**: [`product-backlog.md`](./product-backlog.md) sets [Agent-02](./product-backlog.md#L68) and [Agent-03](./product-backlog.md#L474) to **WIP**; Agent-03 **Related** adds `coach-knowledge.md` and [ADR-106](./adr/ADR-106-coach-knowledge-file.md). [`status.md`](./status.md) refreshes Sprint 8 note (ten SBIs, feature-55/57/56, Spec-seeds-18).

**Verification**: Agent-02 and Agent-03 **Status** cells are **WIP**; `rg 'coach-knowledge|ADR-106' specs/product-backlog.md` hits Agent-03 row and Requirements.

### Lite install client receipt PBI (Spec-seeds-18)

**Why**: Lite HTTP install needs a local receipt so re-runs can drop paths that left the manifest, without writing `.sdd-installed.json` or `pack_complete`.

**What changed**: [`product-backlog.md`](./product-backlog.md) adds [Spec-seeds-18](./product-backlog.md#L482) under the lite installer category, links related PBIs, and adds table row 67. [Web-portal-18](./product-backlog.md#L488) Part 1 references merge and receipt rules. [`sprint-backlog.md`](./sprint-backlog.md) reuses **feature-57** for the receipt SBI between file links and prompt; sprint goal names client receipt. Ten Sprint 8 SBIs total (one **Done**, nine **ToDo**).

**Verification**: `rg 'Spec-seeds-18|pb-122|feature-57' specs/product-backlog.md specs/sprint-backlog.md`.

### Merge Web-portal-19 into Web-portal-18

**Why**: User asked for one PBI with a description that states the two-part deliverable (agent markdown and Setup one-line copy).

**What changed**: [`product-backlog.md`](./product-backlog.md) [Web-portal-18](./product-backlog.md#L488) names Part 1 and Part 2; [Web-portal-19](./product-backlog.md#L492) **Retired**. [`sprint-backlog.md`](./sprint-backlog.md) drops **feature-57**; **feature-56** parents the merged PBI (nine Sprint 8 SBIs). [`admin-portal/app-stories.md`](./admin-portal/app-stories.md) AC20–AC21 map to Web-portal-18 and feature-56. [`status.md`](./status.md) lite HTTP range is feature-55–feature-56.

**Verification**: `rg 'Web-portal-19|feature-57' specs --glob '*.md'` hits history, retired rows, or merge notes only.

### feature-53 Lite install manifest file done

**Why**: [Spec-seeds-15](./product-backlog.md#L474) authoring slice and sprint SBI [feature-53](sprint-backlog.md#sprint-8) close after user **close confirm**.

**What changed**: Lite allow-list seed (later [ADR-107](./adr/ADR-107-lite-pack-allowlist-filename.md) `lite-pack.allowlist.json`; shipped then as `lite.framework.sdd.works.json`) lists twelve skills and `rules/friendly-language.mdc`. [`src/core/seeds/lite-install-manifest.ts`](../src/core/seeds/lite-install-manifest.ts) and Vitest **CE-LITE-01** / **CE-LITE-02**. User copied the manifest to the pack repo root manually. [`sprint-backlog.md`](./sprint-backlog.md) marks **feature-53** **Done**. [Spec-seeds-15](./product-backlog.md#L474) stays **ToDo** until [MCP-07](./product-backlog.md#L325) includes the file in sync and tarball.

**Verification**: `npm test -- src/core/seeds/lite-install-manifest.test.ts` passes.

### Spec sync after feature-53 (engineering artifacts)

**Why**: User asked to align specs with shipped lite manifest work.

**What changed**: [`framework-design.md`](./framework/framework-design.md#lite-install-manifest) documents validator paths and `validateLiteInstallManifest` options. [`framework-tests.md`](./framework/framework-tests.md#lite-install-manifest) names Vitest automation and **CE-LITE** layers. [`framework-stories.md`](./framework/framework-stories.md#lite-install-manifest) records close confirm. [`test-strategy.md`](./test-strategy.md) notes automated CE-LITE cases.

**Verification**: Open `#lite-install-manifest` in design, tests, and stories; paths match `src/core/seeds/`.

### One PBI anchor (`pb-N` only)

**Why**: Dual `req-pb-N` and `pb-N` ids duplicated anchors without benefit. Markdown preview fails on cross-file `#pb-N` links from `sprint-backlog.md`.

**What changed**: [`product-backlog.md`](./product-backlog.md) keeps `<a id="pb-N">` on each Requirements line only. The Product Backlog table links to `#pb-N`. EN seeds and [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) describe one id and `./product-backlog.md#L{line}` for cross-file PBI links. [`framework-design.md`](./framework/framework-design.md) and process-artifacts AC in [`framework-stories.md`](./framework/framework-stories.md) match. Cross-file links under `specs/` and `src/content/` retarget to `#L{line}` or `#definition-of-do`; removed PBI anchors are plain text.

**Verification**: `scripts/check-spec-links.sh` passes. `rg 'req-pb-' specs/product-backlog.md specs/framework/seeds/templates/EN/product-backlog.md` is empty.

### Remove Sprint 8 task-03 (2study.ai scope)

**Why**: User said install-first landing slice belongs to 2study.ai workspace, not framework.sdd.works Sprint 8.

**What changed**: [`sprint-backlog.md`](./sprint-backlog.md) drops **task-03**; Sprint 8 has ten SBIs. [`product-backlog.md`](./product-backlog.md) [Web-portal-21](./product-backlog.md#L438) `Sprint` is `—`; requirement names partner site. [`status.md`](./status.md) updated.

**Verification**: `rg task-03 specs/sprint-backlog.md` is empty.

### Sprint 8 replan from refined product backlog

**Why**: User replanned Sprint 8 after backlog refine; retired MCP-05 must not stay on the sprint board.

**What changed**: [`sprint-backlog.md`](./sprint-backlog.md) Sprint 8 goal and eleven SBIs (removed **feature-54**). Parent PBIs and `#pb-N` links match [`product-backlog.md`](./product-backlog.md). Unplanned PBIs synced (10 rows). [`status.md`](./status.md) Sprint 8 note updated.

**Verification**: Sprint 8 table has no **Retired** row. `rg feature-54 specs/sprint-backlog.md` is empty.

### Remove Web-portal-02 Install and update tab

**Why**: User dropped the extra instructions tab; Setup and MCP cover full install.

**What changed**: [`product-backlog.md`](./product-backlog.md) removes Web-portal-02 Requirements and table row. [`sprint-backlog.md`](./sprint-backlog.md) Unplanned PBIs drop the row.

**Verification**: `rg 'Web-portal-02|pb-49' product-backlog.md` matches change record only. Table has 79 rows.

### Merge Web-portal-01/14; retire Web-portal-08; clarify Web-portal-02

**Why**: User merged invoke tab with pack i18n markdown (no README). Get secret PBI consolidated on Setup. Install tab scope was unclear.

**What changed**: [`product-backlog.md`](./product-backlog.md) expands [Web-portal-01](./product-backlog.md#L357), retires [Web-portal-14](./product-backlog.md#L393), retires [Web-portal-08](./product-backlog.md#L419), rewrites [Web-portal-02](product-backlog.md) as Install and update tab. [`ADR-067`](./adr/ADR-067-get-secret-on-setup.md) consequence updated. Unplanned PBIs drop Web-portal-14.

**Verification**: Web-portal-08 table Status **Retired**. Web-portal-14 table Status **Retired**. Web-portal-02 Description is Install and update tab.

### Remove Web-portal-15, Web-portal-16, Web-portal-23 rows

**Why**: User removed split epic or theme PBIs after children were scheduled.

**What changed**: [`product-backlog.md`](./product-backlog.md) drops Requirements and table rows for Web-portal-15, Web-portal-16, and Web-portal-23. Related links on Web-portal-20 and Spec-seeds-16 point at the remaining PBIs only.

**Verification**: Table has 80 rows. `rg 'Web-portal-15|Web-portal-16|Web-portal-23' product-backlog.md` matches change record only.

### Product backlog readable requirements and lite installer

**Why**: Backlog plan: user-readable Requirements bullets, lite HTTP installer category, retire MCP-05 partial ledger.

**What changed**: [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) adds Requirements bullets guidance and good or bad examples. [`product-backlog.md`](./product-backlog.md) rewrites Requirements (framework groupings, mcp, web-portal subsections, lite category), updates table nouns and Related for Spec-seeds-15 and Web-portal-17–19, retires MCP-05. [`sprint-backlog.md`](./sprint-backlog.md) Sprint 8 feature-53–57 and feature-54 **Retired**; `#pb-N` links. Related specs: [`mcp-design.md`](./mcp/mcp-design.md) §2.1c, [`mcp-stories.md`](./mcp/mcp-stories.md) partial ledger withdrawn, [`app-stories.md`](./admin-portal/app-stories.md) AC19–21, [`ADR-061`](./adr/ADR-061-setup-prompt-public-path.md), EN seed [`product-backlog.md`](./framework/seeds/templates/EN/product-backlog.md).

**Verification**: `rg 'profiles/' product-backlog.md` empty. `rg 'install_profile|partial install ledger' product-backlog.md` matches only MCP-05 retired text. Practices file contains Requirements How to write examples.

### Review status apply rows 1–4 (Sprint 8)

**Why**: User chose option 2 after `sdd-review-status` listed four mismatches.

**What changed**: [`status.md`](./status.md) Sprint 8 note lists twelve ToDo SBIs including [feature-69](./sprint-backlog.md#sprint-8). [`sprint-backlog.md`](./sprint-backlog.md) **task-01** related specs add [Skill-17](./product-backlog.md#L134)–[Skill-24](./product-backlog.md#L191). Product backlog already had [Skill-24](./product-backlog.md#L191) on Sprint 8 from the same day.

**Verification**: Sprint 8 table row count is twelve **ToDo**. **task-01** lists Skill-17 through Skill-24. `status.md` `as_of` is 2026-10-07.

## 2026-10-06

### Review status apply rows 1–2 (Sprint 8)

**Why**: User chose option 2 after onboard `sdd-review-status` listed two mismatches.

**What changed**: [`status.md`](./status.md) closes OGT **Review ethan.md** to **Last 15 closed OGTs** (Closed Sprint 8). [`sprint-backlog.md`](./sprint-backlog.md) feature-51 related specs add [`coach-knowledge.md`](./framework/seeds/templates/EN/coach-knowledge.md) and [ADR-106](./adr/ADR-106-coach-knowledge-file.md).

**Verification**: Open OGT table has no **Review ethan.md** row. feature-51 row lists coach-knowledge and ADR-106.

### OGT 2 closed: module design writing guide in practices

**Why**: User confirmed OGT 2 done after EN [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) § [`{module-name}-design.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md#module-name-designmd) and `sdd-spec-to-build` wiring shipped.

**What changed**: [`status.md`](./status.md) moves the task from open OGT to **Last 15 closed OGTs** (Closed Sprint 8).

**Verification**: Open OGT table on `status.md` has no row for `*-design.md` UI content in practices.

### Module `{stem}-tests.md` guide and spec-to-build wiring

**Why**: `sdd-spec-to-build` job 3 targets `*-tests.md` but EN practices had no section template; jobs 2–3 lacked explicit practice loads on the skill and neighbors.

**What changed**: [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) § [`{module-name}-tests.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md#module-name-testsmd). [`sdd-spec-to-build`](./framework/seeds/skills/sdd-spec-to-build/SKILL.md) and [`readiness.md`](./framework/seeds/skills/sdd-spec-to-build/readiness.md) link stories and tests anchors. [`atdd-expert`](./framework/seeds/skills/atdd-expert/SKILL.md) and [`testing-expert`](./framework/seeds/skills/testing-expert/SKILL.md) Knowledge rows load those sections. [`framework-design.md`](./framework/framework-design.md) § `{stem}-tests.md` and **CE-SKILL-04** updated.

**Verification**: `rg 'module-name-testsmd' specs/framework/seeds/skills/sdd-spec-to-build/SKILL.md specs/framework/seeds/templates/EN/sdd-scrum-practices.md`.

### OGT 2: module `{stem}-design.md` writing guide in practices

**Why**: `sdd-spec-to-build` jobs 4–7 name UI and technical design sections; the EN practices file had no section templates.

**What changed**: [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) § [`{module-name}-design.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md#module-name-designmd) adds **What belongs where** (vs `architecture.md` and `release.md`), **UI design**, and **Technical design** templates. [`readiness.md`](./framework/seeds/skills/sdd-spec-to-build/readiness.md) links that anchor.

**Verification**: `rg '## UI design' specs/framework/seeds/templates/EN/sdd-scrum-practices.md`. `rg 'module-name-designmd' specs/framework/seeds/skills/sdd-spec-to-build/readiness.md`.

### Sprint 7 closed; Sprint 8 WIP (install-first MVP)

**Why**: User asked to mark Sprint 7 **Done** and plan Sprint 8.

**What changed**: [`sprint-backlog.md`](./sprint-backlog.md) Sprint 7 **Status: Done** and Sprint-end retrospective block 5. Sprint 8 **Status: WIP** with existing eleven **ToDo** SBIs (Option A schedule). [`status.md`](./status.md) Sprint 7 **Done**, Sprint 8 **WIP**, current sprint and next steps updated. Top-of-file current sprint pointer is Sprint 8.

**Verification**: `rg 'Sprint 7' specs/sprint-backlog.md` shows **Status: Done**. `rg 'Sprint 8' specs/sprint-backlog.md -A2` shows **Status: WIP**.

### Sprint 7: seven domain pack skills closed (feature-61–68)

**Why**: User **close confirm** that feature-61, feature-62, feature-64, feature-65, feature-66, feature-67, and feature-68 are usable.

**What changed**: [`sprint-backlog.md`](./sprint-backlog.md) Sprint 7 moves those rows to **Done**; WIP has no open rows. [`product-backlog.md`](./product-backlog.md) [Skill-17](./product-backlog.md#L134) through [Skill-23](./product-backlog.md#L182) **Done**. [`status.md`](./status.md) notes all Sprint 7 SBIs **Done**; sprint **Status** stays **WIP** until sprint close confirm. Sprint 7 **Retrospective** learning block 4 added.

**Verification**: No Sprint 7 row for feature-61 through feature-68 shows **WIP** on [`sprint-backlog.md`](./sprint-backlog.md). Product Backlog rows pb-113 through pb-119 show **Done**.

### Refine backlog: accept all six findings

**Why**: User accepted all rows after `sdd-refine-backlog` listed six readiness fails.

**What changed**: [`product-backlog.md`](./product-backlog.md) restores `pb-N` anchors on every Requirements line and Product Backlog table link, per practices `#product-backlogmd`. [Web-portal-21](./product-backlog.md#L438) Sprint is Sprint 8. [Skill-22](./product-backlog.md#L174) drops the confirmation bullet. Skill-18 and Skill-23 seed file lists were already fixed by the specs catalog sync below. [`sprint-backlog.md`](./sprint-backlog.md) removes Sprint 8 task-02 and the Web-portal-21 Unplanned row. [`status.md`](./status.md) adds the OGT "Refresh CE-SKILL catalog for shipped skills".

**Verification**: Every `#pb-N` link in `product-backlog.md` has a matching Requirements anchor. Sprint 8 task-03 parent Web-portal-21 shows Sprint 8 on the Product Backlog table.

### Pack skill seeds: engineering specs catalog sync

**Why**: User asked to update specs for all seeds under `specs/framework/seeds/skills/`.

**What changed**: [`framework-design.md`](./framework/framework-design.md) adds **Pack skill seed catalog**, § **sdd-spec-to-build**, § **sdd-refine-backlog**, § **sdd-update-project**, § **sdd-retrospective**, and `rag-expert` **reference.md** in the path table. [`framework-stories.md`](./framework/framework-stories.md) § **sdd-spec-to-build** names `readiness.md`. [`framework-tests.md`](./framework/framework-tests.md) **CE-SKILL-04**, **CE-SKILL-06**, **CE-SKILL-19**, and **CE-SKILL-20** match sibling files. [`product-backlog.md`](./product-backlog.md) Skill-01, Skill-11, Skill-18, and Skill-23 requirement bullets name sibling seed files. Retired seed folder `frontend-design` stays out of the tree per **CE-SKILL-15**.

**Verification**: `ls specs/framework/seeds/skills/*/SKILL.md | wc -l` is 20. `test ! -d specs/framework/seeds/skills/frontend-design`. `rg 'Pack skill seed catalog' specs/framework/framework-design.md`.

### Status review: apply rows 1–6 (atdd-expert names, table-reply OGT)

**Why**: User chose option 2 after `sdd-review-status` listed six mismatches.

**What changed**: [`sprint-backlog.md`](./sprint-backlog.md) Sprint 7 Done parent labels for task-01 and feature-52 use `atdd-expert`; header as_of 2026-10-06. [`status.md`](./status.md) adds OGT "Use a numbered table reply in compare and planning skills". [`framework-design.md`](./framework/framework-design.md) section and skill path table use `atdd-expert`. [`framework-tests.md`](./framework/framework-tests.md) CE-SKILL-12 and the CE-SKILL-07 shipped list use `atdd-expert`. This file's as_of is 2026-10-06.

**Verification**: `rg 'sdd-atdd' specs/sprint-backlog.md specs/framework/framework-design.md specs/framework/framework-tests.md` finds only historical SBI names, if any.

### Skill-17 renamed to frontend-designer (ADR-105)

**Why**: User ADR: rename pack skill from `frontend-design` to `frontend-designer` to pair with `frontend-developer` and state the designer role.

**What changed**: [ADR-105](./adr/ADR-105-frontend-designer-pack-skill-name.md). Seed folder `specs/framework/seeds/skills/frontend-designer/`. [Skill-17](./product-backlog.md#L134), Sprint 7 [feature-61](./sprint-backlog.md#sprint-7), [framework-design.md](./framework/framework-design.md) § frontend-designer, [framework-stories.md](./framework/framework-stories.md), [framework-tests.md](./framework/framework-tests.md) **CE-SKILL-15**, and neighbor skills reference `frontend-designer`.

**Verification**: `test -d specs/framework/seeds/skills/frontend-designer`. `rg 'seeds/skills/frontend-design/' specs` is empty except historical ADR-101. `rg 'name: frontend-designer' specs/framework/seeds/skills/frontend-designer/SKILL.md`.

### Status review: apply rows 1–8 and feature-64 WIP

**Why**: User chose option 2 after `sdd-review-status` with the numbered mismatch table.

**What changed**: [`status.md`](./status.md) current SBI and OGT rows. [`sprint-backlog.md`](./sprint-backlog.md) retrospective fixes; [feature-64](./sprint-backlog.md#sprint-7) **WIP**; Sprint 7 ToDo empty. [`product-backlog.md`](./product-backlog.md) Skill-01 and Skill-19 labels. EN [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) and EN/HanS [`scrum-in-sdd.md`](./framework/seeds/templates/EN/scrum-in-sdd.md) use `atdd-expert`. [`framework-tests.md`](./framework/framework-tests.md) CE-SKILL-19 expected results for rag-expert.

**Verification**: Open `sprint-backlog.md` Sprint 7 WIP lists seven rows. Current OGT on `status.md` has no atdd or fullstack rename rows.

### Sprint 7: feature-45 Skill sdd-spec-to-build Done

**Why**: User confirmed the pack seed usable after engineering-readiness rewrite and flat artifacts-map path rules.

**What changed**: [`sdd-spec-to-build/SKILL.md`](./framework/seeds/skills/sdd-spec-to-build/SKILL.md), [`readiness.md`](./framework/seeds/skills/sdd-spec-to-build/readiness.md). Sync to `~/.cursor/skills/` and personal store. [`product-backlog.md`](./product-backlog.md) [Skill-11](./product-backlog.md#L108) **Done**. [`sprint-backlog.md`](./sprint-backlog.md) [feature-45](./sprint-backlog.md#sprint-7) **Done**.

**Verification**: Seed describes readiness mode, seven applicable jobs, map match for `*-stories.md` or `stories.md` (and tests/design). User close confirm in chat.

### Skill-18 renamed to testing-expert (ADR-102)

**Why**: User wants the testing skill minimally dependent on the SDD framework. The folder name `sdd-tester` implied a framework-only job.

**What changed**: [ADR-102](./adr/ADR-102-testing-expert-pack-skill-name.md). [Skill-18](./product-backlog.md#L140) and Sprint 7 [feature-62](./sprint-backlog.md#sprint-7) use `testing-expert`. No seed file yet.

**Verification**: `rg 'sdd-tester' product-backlog.md specs/sprint-backlog.md specs/status.md` shows the name only in older change-record lines, if at all.

### Sprint 7: feature-61 and feature-62 WIP; Skill-19 frontend-developer

**Why**: User set feature-61 and feature-62 to WIP, added a frontend-developer PBI on Sprint 7, and widened feature-62 to generic testing.

**What changed**: [`sprint-backlog.md`](./sprint-backlog.md) WIP rows feature-62 and feature-61; ToDo feature-64. [`product-backlog.md`](./product-backlog.md) [Skill-17](./product-backlog.md#L134) and [Skill-18](./product-backlog.md#L140) **WIP**; [Skill-19](./product-backlog.md#L150) **ToDo**. Skill-18 requirement text covers web, API, and unit tests plus a short report. [`status.md`](./status.md) current SBI is feature-62.

**Verification**: Sprint 7 WIP lists feature-62 then feature-61. Sprint 7 ToDo lists feature-45 and feature-64.

### frontend-design pack skill and engineering specs (ADR-101)

**Why**: User renamed Skill-17 from `sdd-frontend-design` to `frontend-design` for minimal SDD coupling and synced the SkillsMP anthropics body.

**What changed**: [ADR-101](./adr/ADR-101-frontend-design-pack-skill-name.md). Seed [`frontend-design/SKILL.md`](./framework/seeds/skills/frontend-designer/SKILL.md) path later moved to `frontend-designer/` per ADR-105. [`framework-design.md`](./framework/framework-design.md) § frontend-designer. [`framework-tests.md`](./framework/framework-tests.md) **CE-SKILL-15**. [`framework-stories.md`](./framework/framework-stories.md) § frontend-designer. [`sdd-spec-to-build`](../framework/seeds/skills/sdd-spec-to-build/SKILL.md) loads `frontend-designer` for UI SBIs. [Skill-17](./product-backlog.md#L134) requirement text and Sprint 7 [feature-61](./sprint-backlog.md#sprint-7) row names updated.

**Verification**: Historical entry. Current folder is `frontend-designer` per ADR-105.

## 2026-10-05

### Status review: sync status.md with Sprint 7 board

**Why**: User picked apply updates after `sdd-review-status`.

**What changed**: [`status.md`](./status.md) Sprint 7 note (nine **Done**, three open **ToDo**), Unplanned count **12**, and **what could be the next** lines for [feature-61](./sprint-backlog.md#sprint-7) and [feature-62](./sprint-backlog.md#sprint-7).

**Verification**: [`status.md`](./status.md) matches [`sprint-backlog.md`](./sprint-backlog.md#sprint-7) **ToDo** rows feature-45, feature-61, feature-62.

### Sprint 7: Skill-17, Skill-18, Rule-04

**Why**: User assigned the two new skill PBIs and [Rule-04](./product-backlog.md#L208) to Sprint 7.

**What changed**: [`product-backlog.md`](./product-backlog.md) Sprint column **Sprint 7** for [Skill-17](./product-backlog.md#L134), [Skill-18](./product-backlog.md#L140), [Rule-04](./product-backlog.md#L208). [`sprint-backlog.md`](./sprint-backlog.md#sprint-7) **ToDo** [feature-61](./sprint-backlog.md#sprint-7), [feature-62](./sprint-backlog.md#sprint-7); **Done** [feature-63](./sprint-backlog.md#sprint-7) for Rule-04. Unplanned PBIs drops those three rows.

**Verification**: Sprint 7 **ToDo** lists feature-45, feature-61, feature-62.

### Product backlog: Skill-17 and Skill-18

**Why**: User asked for pack skills `sdd-frontend-design` and `sdd-tester`.

**What changed**: [`product-backlog.md`](./product-backlog.md) Requirements § skills and Product Backlog table rows [Skill-17](./product-backlog.md#L134), [Skill-18](./product-backlog.md#L140); [`sprint-backlog.md`](./sprint-backlog.md) Unplanned PBIs rows 14–15.

**Verification**: Both PBIs are **ToDo**, sprint `—`, no `seeds/skills/` folder yet.

### feature-49: EN .secrets seed (Spec-seeds-12)

**Why**: User confirmed the dotenv-shaped `.secrets` starter usable for new projects.

**What changed**: [`specs/framework/seeds/templates/EN/.secrets`](./framework/seeds/templates/EN/.secrets) (empty `KEY=` lines, `#` comments only); [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) `#secrets`; [`framework-design.md`](./framework/framework-design.md) § `.secrets`. [feature-49](./sprint-backlog.md#sprint-7) and [Spec-seeds-12](./product-backlog.md#L270) **Done**.

**Verification**: `rg '=' specs/framework/seeds/templates/EN/.secrets` shows only empty values after `=`; no token-like strings in the seed file.

### Sprint 7: six SBIs closed on user confirm

**Why**: User confirmed [feature-52](./sprint-backlog.md#sprint-7), [feature-44](./sprint-backlog.md#sprint-7), [feature-46](./sprint-backlog.md#sprint-7), [feature-47](./sprint-backlog.md#sprint-7), [feature-48](./sprint-backlog.md#sprint-7), and [feature-50](./sprint-backlog.md#sprint-7) usable.

**What changed**: [`sprint-backlog.md`](./sprint-backlog.md) **Done** rows; [`product-backlog.md`](./product-backlog.md) [Skill-01](./product-backlog.md#L87), [Skill-09](./product-backlog.md#L106), [Skill-14](./product-backlog.md#L120), [Spec-seeds-10](./product-backlog.md#L266), [Spec-seeds-11](./product-backlog.md#L268), [Spec-seeds-13](./product-backlog.md#L274) **Done**; [`status.md`](./status.md); Sprint 7 **Retrospective**; [`framework-design.md`](./framework/framework-design.md), [`framework-stories.md`](./framework/framework-stories.md), [`framework-tests.md`](./framework/framework-tests.md) catalog sync.

**Verification**: At entry time, [feature-49](./sprint-backlog.md#sprint-7) was still **ToDo**. Same-day closes added [feature-49](./sprint-backlog.md#sprint-7) and [feature-63](./sprint-backlog.md#sprint-7). Open **ToDo** now: [feature-45](./sprint-backlog.md#sprint-7), [feature-61](./sprint-backlog.md#sprint-7), [feature-62](./sprint-backlog.md#sprint-7).

### Sprint 8: Web-portal-23 split and tab config SBIs

**Why**: User asked to refine Web-portal-23 to Implementable PBIs and schedule them on Sprint 8.

**What changed**: [`product-backlog.md`](./product-backlog.md) retires Theme [Web-portal-23](product-backlog.md); adds [Spec-seeds-16](./product-backlog.md#L277), [Web-portal-24](./product-backlog.md#L395), [Web-portal-25](./product-backlog.md#L400) on Sprint 8. [`sprint-backlog.md`](./sprint-backlog.md) adds feature-58–60.

**Verification**: Open `sprint-backlog.md#sprint-8` for parent links to `#pb-110`–`#pb-112`.

### Theme Web-portal-23 configurable instructions tabs

**Why**: Instructions tabs are hard-coded; operators need pack-driven tab lists without redeploying the app for each new panel.

**What changed**: [`product-backlog.md`](./product-backlog.md) adds Theme [Web-portal-23](product-backlog.md). [`sprint-backlog.md`](./sprint-backlog.md) Unplanned PBIs lists the row.

**Verification**: Open `#pb-109` and table row `#pb-109` on `product-backlog.md`.

### Epic and Theme PBIs split to Implementable

**Why**: `sdd-refine-backlog` request to break down all Epic and Theme rows.

**What changed**: [`product-backlog.md`](./product-backlog.md) retires [i18n-01](./product-backlog.md#L297), [i18n-02](./product-backlog.md#L299), [MCP-04](./product-backlog.md#L323), [Web-portal-15](product-backlog.md), [Web-portal-16](product-backlog.md). Adds [i18n-04](./product-backlog.md#L301), [i18n-05](./product-backlog.md#L301), [MCP-06](./product-backlog.md#L325), [MCP-07](./product-backlog.md#L325), [Web-portal-20](./product-backlog.md#L435)–[Web-portal-22](./product-backlog.md#L441). [Agent-02](./product-backlog.md#L68) is **Implementable** on Sprint 8. [`sprint-backlog.md`](./sprint-backlog.md) task-03 parents [Web-portal-21](./product-backlog.md#L438). Unplanned PBIs table synced.

**Verification**: `rg 'Epic|Theme' product-backlog.md` shows Epic/Theme only on **Retired** parent rows.

### Sprint 8 schedule: Web-portal 15–19 slice

**Why**: User assigned Web-portal-15 through Web-portal-19 to Sprint 8.

**What changed**: [`sprint-backlog.md`](./sprint-backlog.md) Sprint 8 goal and SBIs feature-53–57, task-03. [`product-backlog.md`](./product-backlog.md) `Sprint` cells for [Spec-seeds-15](./product-backlog.md#L474), [MCP-05](./product-backlog.md#L344), [Web-portal-17](./product-backlog.md#L446)–[Web-portal-19](./product-backlog.md#L492). Epics [Web-portal-15](product-backlog.md) and [Web-portal-16](product-backlog.md) have no `Sprint` cell. [`status.md`](./status.md) Sprint 8 note updated.

**Verification**: Open `sprint-backlog.md#sprint-8` and confirm parent links for Web-portal-17–19.

### Split Web-portal-16 into Implementable PBIs

**Why**: Epic [Web-portal-16](product-backlog.md) needed Implementable rows before sprint planning (`sdd-refine-backlog`).

**What changed**: [`product-backlog.md`](./product-backlog.md) adds [Spec-seeds-15](./product-backlog.md#L474), [MCP-05](./product-backlog.md#L344), [Web-portal-17](./product-backlog.md#L446), [Web-portal-18](./product-backlog.md#L488), [Web-portal-19](./product-backlog.md#L492). Epic requirements point at those children. [`sprint-backlog.md`](./sprint-backlog.md) Unplanned PBIs lists the new unscheduled rows.

**Verification**: Open `product-backlog.md` Requirements web-portal and table rows `#pb-97` through `#pb-100` and `#pb-101`.

### Close confirm gate on sdd-dod and pack skills (no sdd-close-backlog-item)

**Why**: Agents marked SBIs **Done** after delivery without user **close confirm** (Sprint 7 task-01).

**What changed**: [`sdd-dod.mdc`](./framework/seeds/rules/sdd-dod.mdc) **Close confirm** section and **Do not** bullets. [`sdd-incremental-delivery.mdc`](./framework/seeds/rules/sdd-incremental-delivery.mdc), [`sdd-retrospective`](./framework/seeds/skills/sdd-retrospective/SKILL.md), [`sdd-review-status`](./framework/seeds/skills/sdd-review-status/SKILL.md), [`sdd-spec-to-build`](./framework/seeds/skills/sdd-spec-to-build/SKILL.md), [`sdd-atdd`](./framework/seeds/skills/sdd-atdd/SKILL.md). Standalone vs SDD scope on [`sdd-create-skill`](./framework/seeds/skills/sdd-create-skill/SKILL.md), [`sdd-create-rule`](./framework/seeds/skills/sdd-create-rule/SKILL.md), [`sdd-build-agent`](./framework/seeds/skills/sdd-build-agent/SKILL.md). EN practices **Done** row, knowledge [`dod-retrospective-before-sbi-done.md`](./knowledge/agent/dod-retrospective-before-sbi-done.md), **CE-RULE-01**.

**Verification**: `rg 'Close confirm' specs/framework/seeds/rules/sdd-dod.mdc`.

### Optional module folder and path-first map (ADR-100)

**Why**: Some projects keep design, stories, and tests under `{artifacts_root}` without a module subfolder; skills and update-project assumed `{folder}/{stem}-*`.

**What changed**: [ADR-100](./adr/ADR-100-optional-module-folder.md). EN [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) `#artifacts-mapjson` (optional `folder`, flat example, confirm summary). [`scrum-in-sdd.md`](./framework/seeds/templates/EN/scrum-in-sdd.md), HanS engineering line, [`framework-design.md`](./framework/framework-design.md). [`sdd-update-project`](./framework/seeds/skills/sdd-update-project/SKILL.md), [`sdd-atdd`](./framework/seeds/skills/sdd-atdd/SKILL.md), [`sdd-update-specs`](./framework/seeds/skills/sdd-update-specs/SKILL.md), [`sdd-audit-artifacts`](./framework/seeds/skills/sdd-audit-artifacts/SKILL.md). **CE-TPL-12** and engineering stories AC2. Live [`artifacts-map.json`](../artifacts-map.json) unchanged.

**Verification**: `test -f specs/adr/ADR-100-optional-module-folder.md`.

### Pack skill sdd-update-specs (feature-44)

**Why**: [Skill-09](./product-backlog.md#L106) needs a seed that compares current work with engineering specs and updates them after confirm.

**What changed**: Seed [`sdd-update-specs`](./framework/seeds/skills/sdd-update-specs/SKILL.md) (TRUE AGENT: capabilities, knowledge, limits, gap report). [`framework-design.md`](./framework/framework-design.md) § sdd-update-specs. **CE-SKILL-14**. Cross-link in [`sdd-spec-to-build`](./framework/seeds/skills/sdd-spec-to-build/SKILL.md). **CE-SKILL-07** drops `sdd-update-specs` from the no-seed list. Sprint 7 [feature-44](./sprint-backlog.md#sprint-7) stays **ToDo** until you confirm the skill usable.

**Verification**: `test -f specs/framework/seeds/skills/sdd-update-specs/SKILL.md`. `rg 'five process files' specs/framework/seeds/skills/sdd-update-specs/SKILL.md`. `rg 'CE-SKILL-14' specs/framework/framework-tests.md`.

### Pack skill improve-prompt (ADR-099)

**Why**: [Skill-14](./product-backlog.md#L120) needs a generic prompt-improvement skill without ECC catalogs or fixed slash-command tables.

**What changed**: [ADR-099](./adr/ADR-099-improve-prompt-skill-name.md). Seed folder `improve-prompt` replaces `prompt-optimizer`. TRUE AGENT body (capabilities, knowledge, limits, anti-patterns) and [examples.md](./framework/seeds/skills/improve-prompt/examples.md). **CE-SKILL-13**. No `constants.json` row.

**Verification**: `test -d specs/framework/seeds/skills/improve-prompt`. `rg 'prompt-optimizer' specs/framework/seeds` empty. `rg 'ECC|configure-ecc|/plan' specs/framework/seeds/skills/improve-prompt` empty.

### improve-prompt living specs sync

**Why**: Skill-14 seeds and design docs should match the shipped `improve-prompt` folder and CE-SKILL-13.

**What changed**: [framework-design.md](./framework/framework-design.md#improve-prompt) § improve-prompt. [product-backlog.md](./product-backlog.md#L120) requirement bullets and Related column. **CE-SKILL-13** and [framework-stories.md](./framework/framework-stories.md#improve-prompt) AC1. [sprint-backlog.md](./sprint-backlog.md#sprint-7) feature-46 Related specs. Seed description and [examples.md](./framework/seeds/skills/improve-prompt/examples.md) use English-only trigger and example copy; replies still follow the user's language.

**Verification**: `rg 'improve-prompt' specs/framework/framework-design.md`. `rg 'pb-89' product-backlog.md`.

### Sprint 7 kickoff: US/AC practices and pack skill sdd-atdd

**Why**: Sprint 7 [Skill-01](./product-backlog.md#L87) needs story-mapping guidance before the ATDD skill ships.

**What changed**: Sprint 7 **WIP**. [task-01](./sprint-backlog.md#sprint-7) adds ATDD and User Story Mapping terminology, expands [`{module-name}-stories.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md#module-name-storiesmd) Template and How to write, and adds [§6 User Story Mapping](./framework/seeds/templates/EN/sdd-scrum-practices.md#6-user-story-mapping). New seed [`sdd-atdd`](./framework/seeds/skills/sdd-atdd/SKILL.md), **CE-SKILL-12**, framework design and stories. [feature-52](./sprint-backlog.md#sprint-7) stays **ToDo** until you confirm the skill usable.

**Verification**: `test -f specs/framework/seeds/skills/sdd-atdd/SKILL.md`. Practices index links `#6-user-story-mapping` and `#term-atdd`.

### Sprint 6 closed

**Why**: User confirmed every Sprint 6 SBI usable and the sprint goal on 2026-10-05.

**What changed**: [Sprint 6](./sprint-backlog.md#sprint-6) **Status: Done** on [`sprint-backlog.md`](./sprint-backlog.md). Current WIP sprint is none. Retrospective Learnings **#6** (`Sprint-end`). [`status.md`](./status.md) Sprint 6 row **Done**.

**Verification**: Sprint 6 **Done** table has eight rows and no open ToDo or WIP tables. [`product-backlog.md`](./product-backlog.md) Sprint 6 PBIs are **Done** or **Retired** ([Skill-07](./product-backlog.md#L99)).

### Sprint 6 task-01 cross-review (five process files)

**Why**: Sprint 6 [task-01](./sprint-backlog.md#sprint-6) validates EN process seeds, live `specs/` process files, and [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) after ADR-098 and placeholder templating.

**What changed**: [pb-36](./product-backlog.md#L247) names a placeholder template seed. Live [`sprint-backlog.md`](./sprint-backlog.md) fixes stale `artifacts-map.md` and `/instructions` links. [`issues-log.md`](./issues-log.md) `as_of` aligned. Practices [`#artifacts-mapjson`](./framework/seeds/templates/EN/sdd-scrum-practices.md#artifacts-mapjson) example text separates map JSON sample from five templated process seeds.

**Verification**: CE-TPL-01, CE-TPL-04, CE-TPL-08 through CE-TPL-11 and framework-stories process-artifact AC1 and AC3 through AC13 read against EN seeds and live files. Link audit on live `product-backlog.md`, `sprint-backlog.md`, `status.md`, and `issues-log.md` passes. EN process seed relative links pass. [`artifacts-map.json`](../artifacts-map.json) lists the five process paths.

### Sprint 6 feature-42 Done (Spec-seeds-05, re-close)

**Why**: User confirmed [feature-42](./sprint-backlog.md#sprint-6) usable after the EN [product-backlog.md](./framework/seeds/templates/EN/product-backlog.md) seed and [ADR-098](./adr/ADR-098-sprint-backlog-dod-link-product-backlog.md) work.

**What changed**: [feature-42](./sprint-backlog.md#sprint-6) **Done** on [`sprint-backlog.md`](./sprint-backlog.md). [Spec-seeds-05](./product-backlog.md#L247) **Done** on [`product-backlog.md`](./product-backlog.md). Sprint 6 Retrospective Learnings **#4**. [`status.md`](./status.md) Sprint 6 note updated.

**Verification**: Open Sprint 6 **Done** table row 7. No **WIP** rows. [i18n-02](./product-backlog.md#L299) remains **ToDo**.

### Sprint-backlog DoD links product-backlog (ADR-098)

**Why**: Generic DoD bullets were duplicated in `sprint-backlog.md` and `product-backlog.md` and drifted.

**What changed**: [ADR-098](./adr/ADR-098-sprint-backlog-dod-link-product-backlog.md). [`product-backlog.md`](./product-backlog.md#definition-of-done) is the canonical additional checklist for PBIs and SBIs. [`sprint-backlog.md`](./sprint-backlog.md) DoD section links there; sprint replacement lists stay on the sprint file. EN seeds, [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md), [`sdd-dod.mdc`](./framework/seeds/rules/sdd-dod.mdc), design, stories, **CE-TPL-04**.

**Verification**: Sprint seed contains `product-backlog.md#definition-of-done`. No `Follow rule DoD` line in EN sprint-backlog seed.

### EN changes-log and issues-log seeds as placeholder templates

**Why**: Pokymon sample rows read like a real project after copy.

**What changed**: [`templates/EN/changes-log.md`](./framework/seeds/templates/EN/changes-log.md) and [`templates/EN/issues-log.md`](./framework/seeds/templates/EN/issues-log.md) use `[product name]` and bracket placeholders. [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) documents all five templated process seeds. [CE-TPL-11](./framework/framework-tests.md) covers the changes-log seed.

**Verification**: [CE-TPL-10](./framework/framework-tests.md) and CE-TPL-11 expected titles and shapes.

### EN status.md seed as placeholder template

**Why**: The Pokymon-filled status seed read like a real project after copy.

**What changed**: [`templates/EN/status.md`](./framework/seeds/templates/EN/status.md) uses `[product name]` and bracket placeholders; [`framework-design.md`](./framework/framework-design.md) § status projection matches.

**Verification**: [CE-TPL-08](./framework/framework-tests.md) expected title and section shape unchanged.

### Product-backlog section order and additional DoD

**Why**: DoD duplicated `sdd-dod.mdc` defaults and sat between Requirements and the table.

**What changed**: Live [`product-backlog.md`](./product-backlog.md) and EN seed use Product overview → Definition of Done (additional only) → Requirements → Product Backlog → Change record. [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md), [`sdd-dod.mdc`](./framework/seeds/rules/sdd-dod.mdc) PBI Extra, [`framework-design.md`](./framework/framework-design.md), and [`framework-stories.md`](./framework/framework-stories.md) AC1 match.

**Verification**: Readiness item 11 in practices; `rg "above the Product Backlog table" specs/` excludes historical change-log lines only.

### Simplify product-backlog live file and EN seed

**Why**: Scope boundary duplicated requirements. The Pokymon-filled seed was easy to copy as if it were the user's product.

**What changed**: Removed **Scope boundary** from [`product-backlog.md`](./product-backlog.md). Rewrote [`templates/EN/product-backlog.md`](./framework/seeds/templates/EN/product-backlog.md) as a placeholder template with no Pokymon content.

**Verification**: Index and Requirements open without `#scope-boundary`. Seed header uses `[product name]` and one sample PBI row.

### Sprint 6 feature-37 and feature-40 Done; feature-42 WIP

**Why**: User confirmed [Rule-01](./product-backlog.md#L202) and [Skill-06](./product-backlog.md#L96) usable. [Spec-seeds-05](./product-backlog.md#L247) returns to **WIP**.

**What changed**: Sprint 6 [feature-37](./sprint-backlog.md#sprint-6) and [feature-40](./sprint-backlog.md#sprint-6) **Done**; [feature-42](./sprint-backlog.md#sprint-6) **WIP**. [`status.md`](./status.md) and Sprint 6 Retrospective Learnings **#3** / Future actions **#2** after **sdd-retrospective**.

**Verification**: Pack seeds [`sdd-dod.mdc`](./framework/seeds/rules/sdd-dod.mdc) and [`sdd-retrospective/SKILL.md`](./framework/seeds/skills/sdd-retrospective/SKILL.md); `constants.json` keys `dod` and `skill_retrospective`.

### sdd-retrospective trigger line on sprint-backlog

**Why**: Sprint 6 Retrospective used `On demand` for by-rule and catch-up runs; `scrum-in-sdd.md` requires the incident (for example `feature-42 done`) for **By rule**.

**What changed**: [`sdd-retrospective/SKILL.md`](./framework/seeds/skills/sdd-retrospective/SKILL.md) **Write rules** name `{SBI code} {SBI name} done`. [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) Retrospective **How to write** clarifies when `On demand` is allowed.

**Verification**: Skill text bans `On demand` on the same run as an SBI or PBI **Done** write.

### Sprint 6 Retrospective trigger repair (live backlog)

**Why**: Live [Sprint 6 Retrospective](./sprint-backlog.md#sprint-6) still used `On demand` for catch-up **Done** SBIs after the skill and practices update.

**What changed**: Composite by-rule triggers for feature-38, 39, 41, and 43 on Learnings, Opportunities, and Future actions **#1**; feature-42 learnings under Learnings **#2** with `feature-42 Seed product-backlog.md done`.

**Verification**: No `On demand` under Sprint 6 Retrospective in [`sprint-backlog.md`](./sprint-backlog.md).

### Remove skill_close_sprint (Skill-07 retired)

**Why**: [Skill-07](./product-backlog.md#L99) and `sdd-close-sprint` do not ship ([ADR-076](./adr/ADR-076-review-status-one-skill.md)). Sprint 8 task-01 Related still pointed at Skill-07.

**What changed**: Removed `skill_close_sprint` from [`constants.json`](./framework/seeds/templates/constants.json). [`framework-design.md`](./framework/framework-design.md) job index matches ethan Capabilities. Sprint 8 [task-01](./sprint-backlog.md#sprint-8) Related lists shipped skills and marks Skill-07 **Retired**.

**Verification**: `rg skill_close_sprint specs/framework/seeds/templates/constants.json` is empty.

### Sprint 6 feature-42 Done (Spec-seeds-05)

**Why**: User confirmed the EN product-backlog seed usable; DoD met after **sdd-retrospective**.

**What changed**: [`sprint-backlog.md`](./sprint-backlog.md) moves [feature-42](./sprint-backlog.md#sprint-6) to **Done**. [Spec-seeds-05](./product-backlog.md#L247) **Done** on [`product-backlog.md`](./product-backlog.md). Sprint 6 **Retrospective** learnings #2. [`status.md`](./status.md) Sprint 6 note updated.

**Verification**: Seed path [`framework/seeds/templates/EN/product-backlog.md`](./framework/seeds/templates/EN/product-backlog.md). Open Sprint 6 ToDo: task-01 only.

### Status review picks (Sprint 6–7 alignment)

**Why**: User picked fixes after status review: unique SBI codes, Sprint 7 stays ToDo, ethan without close-sprint job, feature-37 back to WIP.

**What changed**: Sprint 7 **Skill sdd-atdd** is [feature-52](./sprint-backlog.md#sprint-7) (was duplicate feature-43). Sprint 7 WIP rows removed; feature-48 and feature-50 **ToDo**. Sprint 6 [feature-37](./sprint-backlog.md#sprint-6) **WIP**; [Rule-01](./product-backlog.md#L202) **WIP**. [`ethan.md`](./framework/seeds/agents/ethan.md) drops `skill_close_sprint` from Capabilities. [`status.md`](./status.md) notes updated.

**Verification**: One row per SBI code across sprints. Sprint 7 section has **ToDo** table only. ethan Capabilities has six jobs.

### Done writes run sdd-retrospective (ADR-097)

**Why**: Status-review **Done** picks skipped the **sdd-dod** retrospective gate; some sprints had no **Retrospective** section.

**What changed**: [ADR-097](./adr/ADR-097-done-runs-retrospective.md). [`sdd-retrospective`](./framework/seeds/skills/sdd-retrospective/SKILL.md) **Ensure Retrospective section** (create-if-missing). [`sdd-review-status`](./framework/seeds/skills/sdd-review-status/SKILL.md) runs retrospective before **Done** picks. [`sdd-dod.mdc`](./framework/seeds/rules/sdd-dod.mdc) states **Done** row timing. **CE-SKILL-10**, **CE-SKILL-11**, framework stories AC.

**Verification**: Seed `sdd-review-status` **Write the picks** names **sdd-retrospective** before **Done**. `rg 'Ensure Retrospective' specs/framework/seeds/skills/sdd-retrospective/SKILL.md` matches.

### sdd-retrospective auto-run (no second confirm)

**Why**: Retrospective was skipped when agents treated status-review writes as full DoD; a second confirm blocked the by-rule gate.

**What changed**: [`sdd-retrospective/SKILL.md`](./framework/seeds/skills/sdd-retrospective/SKILL.md) writes ADR, knowledge, changes-log, and sprint **Retrospective** in one pass, then sends **Retrospective Summary**. Removed **Your choice** confirm. **CE-SKILL-10** and framework stories AC updated. Catch-up: Sprint 6 **Retrospective** block; [`dod-retrospective-before-sbi-done.md`](./knowledge/agent/dod-retrospective-before-sbi-done.md).

**Verification**: Seed skill has **Steps** and no “Write only after that reply”. `rg 'Your choice' specs/framework/seeds/skills/sdd-retrospective` is empty.

### Sprint 6 status picks (feature-40–43, Skill-07)

**Why**: User confirmed [feature-43](./sprint-backlog.md#sprint-6) usable; [Skill-07](./product-backlog.md#L99) stays retired per [ADR-076](./adr/ADR-076-review-status-one-skill.md); [feature-40](./sprint-backlog.md#sprint-6) is active work.

**What changed**: [Rule-03](./product-backlog.md#L206) and Sprint 6 feature-43 **Done**. feature-41 **Done** (retire `sdd-close-sprint`; PBI **Retired**). [Skill-06](./product-backlog.md#L96) and feature-40 **WIP**. `sprint-backlog.md` header lists Sprint 6 as current WIP sprint. [`status.md`](./status.md) notes updated.

**Verification**: Sprint 6 Done table includes feature-43 and feature-41. Open ToDo/WIP table: feature-40 **WIP**, feature-42 and task-01 **ToDo**.

### Rename sdd-keep-update to sdd-realtime-status (ADR-096)

**Why**: Rule-03 WIP sync should use the historical realtime-status name with `sdd-` prefix; `keep-update` key and filename diverged.

**What changed**: [ADR-096](./adr/ADR-096-sdd-realtime-status-rule-name.md). Seed [sdd-realtime-status.mdc](./framework/seeds/rules/sdd-realtime-status.mdc); [constants.json](./framework/seeds/templates/constants.json) key `realtime-status` (removed `keep-update`). [ADR-093](./adr/ADR-093-keep-update-wip-rule.md) superseded for name/key only. Living guides, design, stories, tests, portal AC, and Features i18n updated. Unprefixed `realtime-status.mdc` stays retired ([ADR-091](./adr/ADR-091-retire-realtime-status-rule.md)).

**Verification**: `ls specs/framework/seeds/rules/sdd-realtime-status.mdc`. `rg 'sdd-keep-update|"keep-update"' specs/framework/seeds specs/sprint-backlog.md specs/framework/framework-design.md specs/framework/framework-stories.md specs/framework/framework-tests.md src/content` is empty. Remove stale `sdd-keep-update.mdc` from `{client_root}/rules/` after pack update.

### ADR and knowledge instance shapes in practices (ADR-095)

**Why**: Separate pack `adr.md` and `knowledge.md` duplicated shapes already documented in practices and added install surface ([ADR-095](./adr/ADR-095-adr-knowledge-shape-in-practices.md)).

**What changed**: Removed pack locale seeds `adr.md` and `knowledge.md`. Added **ADR instance shape** and **Knowledge instance shape** to EN [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md). Updated [`sdd-retrospective`](./framework/seeds/skills/sdd-retrospective/SKILL.md), [`framework-design.md`](./framework/framework-design.md), CE-SKILL-10, and framework stories.

**Verification**: `test ! -f specs/framework/seeds/templates/EN/adr.md`. `rg 'locale}/adr\\.md|locale}/knowledge\\.md' specs/framework/seeds/skills/sdd-retrospective` is empty.

### sdd- prefix for framework-bound pack rules (ADR-094)

**Why**: Rules that read or write SDD process artifacts should be distinguishable from portable rules such as `friendly-language.mdc`.

**What changed**: [ADR-094](./adr/ADR-094-sdd-prefix-framework-rules.md). Renamed seeds to `sdd-dod.mdc`, `sdd-incremental-delivery.mdc`, `sdd-keep-update.mdc`. [constants.json](./framework/seeds/templates/constants.json) values updated; keys unchanged. [sdd-create-rule](./framework/seeds/skills/sdd-create-rule/SKILL.md) naming split. CE-RULE-05 expects three `sdd-` rules plus `friendly-language.mdc`.

**Verification**: `ls specs/framework/seeds/rules/sdd-*.mdc`. No `dod.mdc`, `incremental-delivery.mdc`, or `keep-update.mdc` under `specs/framework/seeds/rules/`.

### Pack rule sdd-keep-update.mdc (WIP process sync)

**Why**: After [ADR-091](./adr/ADR-091-retire-realtime-status-rule.md), open work had no always-on rule to keep process files aligned before Done.

**What changed**: [ADR-093](./adr/ADR-093-keep-update-wip-rule.md). Seed [sdd-keep-update.mdc](./framework/seeds/rules/sdd-keep-update.mdc) and `keep-update` in [constants.json](./framework/seeds/templates/constants.json). [sdd-dod.mdc](./framework/seeds/rules/sdd-dod.mdc) points WIP checkpoints at `sdd-keep-update.mdc`. [Rule-03](./product-backlog.md#L206) reopened as keep-update. Sprint 6 [feature-43](./sprint-backlog.md#sprint-6) **WIP**. Four harness rules in design, stories, tests, guides, and portal AC.

**Verification**: `specs/framework/seeds/rules/sdd-keep-update.mdc` exists. `rg 'realtime-status' specs/framework/seeds` is empty. CE-RULE-05 lists four pack rules including `sdd-keep-update.mdc`.

### Pack skill sdd-retrospective and adr/knowledge pack seeds

**Why**: DoD and sprint practices need a pack skill that persists ADR and knowledge under map roots without embedding long templates in SKILL.md; file shape lives on the client template tree only.

**What changed**: New seed skill [`sdd-retrospective`](./framework/seeds/skills/sdd-retrospective/SKILL.md). Pack-only locale templates [`adr.md`](./framework/seeds/templates/EN/adr.md) and [`knowledge.md`](./framework/seeds/templates/EN/knowledge.md). [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) and [`framework-design.md`](./framework/framework-design.md) document pack-only install paths. EN [`scrum-in-sdd.md`](./framework/seeds/templates/EN/scrum-in-sdd.md) and portal copy name **sdd-retrospective**. [`framework-stories.md`](./framework/framework-stories.md) AC block and **CE-SKILL-10** in [`framework-tests.md`](./framework/framework-tests.md). OGT “Add pack seed templates adr.md and knowledge.md” closed in [`status.md`](./status.md).

**Verification**: `ls specs/framework/seeds/templates/EN/adr.md specs/framework/seeds/templates/EN/knowledge.md specs/framework/seeds/skills/sdd-retrospective/SKILL.md`. `rg 'retrospective skill' specs/framework/seeds/templates/EN/scrum-in-sdd.md src/content/scrum-in-sdd` is empty. Current OGT table has no open row for adr/knowledge seeds.

### Status review picks (RIDs + Sprint 7 WIP)

**Why**: `sdd-review-status` found stale open RIDs and board drift on Sprint 7 seed SBIs.

**What changed**: Closed **D-2**, **D-3**, and **R-1** on [sprint-backlog.md](./sprint-backlog.md) (MCP-01 and Agent-04 Done). [feature-48](./sprint-backlog.md#sprint-7) and [feature-50](./sprint-backlog.md#sprint-7) set **WIP**; [Spec-seeds-11](./product-backlog.md#L268) and [Spec-seeds-13](./product-backlog.md#L274) **WIP**. Sprint 7 **WIP** subsection added. [`status.md`](./status.md) Sprint 7 note updated.

**Verification**: Open RIDs table is empty. Sprint 7 lists WIP then ToDo without Done rows for feature-48 or feature-50.

### OGT 4–6: release.md, test-strategy.md, Core artifacts-map

**Why**: Close Sprint 5 OGTs: rename deployment starter, add product-level test strategy seed, classify `artifacts-map.json` as an SDD Core artifact.

**What changed**: `deployment.md` → [`release.md`](./framework/seeds/templates/EN/release.md) (seed and [`specs/release.md`](./release.md)). New [`test-strategy.md`](./framework/seeds/templates/EN/test-strategy.md) seed and [`specs/test-strategy.md`](./test-strategy.md). [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md), EN/HanS [`scrum-in-sdd.md`](./framework/seeds/templates/EN/scrum-in-sdd.md), [`framework-design.md`](./framework/framework-design.md), [`framework-stories.md`](./framework/framework-stories.md), `src/content/*`, [`artifacts-map.json`](../artifacts-map.json), Features i18n, and admin AC. [Spec-seeds-11](./product-backlog.md#L268) and [Spec-seeds-13](./product-backlog.md#L274) **Done**; Sprint 7 [feature-48](./sprint-backlog.md#sprint-7) and [feature-50](./sprint-backlog.md#sprint-7) **Done**. OGT 4–6 closed in [`status.md`](./status.md). [ADR-082](./adr/ADR-082-artifacts-map-json.md) context clarifies Core artifact vs process Markdown.

**Verification**: `ls specs/framework/seeds/templates/EN/` includes `release.md` and `test-strategy.md` with no `deployment.md`. `rg 'deployment\.md' specs/framework/seeds product-backlog.md specs/sprint-backlog.md specs/framework/framework-design.md specs/framework/framework-stories.md src/content artifacts-map.json` is empty. Root map lists `specs/release.md` and `specs/test-strategy.md`.

### Sprint 6 feature-37 and feature-38 Done

**Why**: Pack harness rules `sdd-dod.mdc` and `sdd-incremental-delivery.mdc` ship in seeds and constants; user confirmed usable.

**What changed**: [Rule-01](./product-backlog.md#L202) and [Rule-02](./product-backlog.md#L204) **Done**. [feature-37](./sprint-backlog.md#sprint-6)–[feature-39](./sprint-backlog.md#sprint-6) in Sprint 6 Done. Sprint 6 **WIP**. [Rule-03](./product-backlog.md#L206) stays **Retired**; feature-39 Done means Option C retirement verified ([ADR-091](./adr/ADR-091-retire-realtime-status-rule.md) decision item 4 updated).

**Verification**: `specs/framework/seeds/rules/sdd-dod.mdc` and `sdd-incremental-delivery.mdc` exist. `constants.json` `rules` keys `dod` and `incremental-delivery`. CE-RULE-05 lists three pack rules, not `realtime-status.mdc`.

### Pack authoring skill names revert to sdd- prefix (ADR-092)

**Why**: Cursor built-in `create-skill` and `create-rule` under `skills-cursor` collide with pack folders of the same name under `{client_root}/skills/`.

**What changed**: [ADR-092](./adr/ADR-092-pack-authoring-skill-sdd-prefix.md) supersedes [ADR-089](./adr/ADR-089-pack-authoring-skill-names.md). Seed folders `sdd-create-skill`, `sdd-build-agent`, `sdd-create-rule`. [`constants.json`](./framework/seeds/templates/constants.json) values restored. Product backlog, sprint backlog, framework design/stories/tests, EN/HanS `scrum-in-sdd`, and [`status.md`](./status.md) use `sdd-*` names and paths. [ADR-074](./adr/ADR-074-sdd-create-skill.md) supersession note updated.

**Verification**: `ls specs/framework/seeds/skills/` lists the three `sdd-*` folders only (no unprefixed trio). `rg '^name: (create-skill|create-rule|build-agent)$' specs/framework/seeds/skills/` is empty. `constants.json` maps `skill_build_agent`, `skill_create_skill`, and `skill_create_rule` to the `sdd-*` folder names. Remove stale `~/.cursor/skills/create-skill`, `create-rule`, and `build-agent` after copy from seeds.

### Retire realtime-status.mdc (Option C)

**Why**: `sdd-dod.mdc` and `realtime-status.mdc` duplicated confirm-then-write for `status.md`. One owner for close avoids two Done paths.

**What changed**: [ADR-091](./adr/ADR-091-retire-realtime-status-rule.md). Removed [realtime-status.mdc](./framework/seeds/rules/realtime-status.mdc) and the `realtime-status` key in [constants.json](./framework/seeds/templates/constants.json). [sdd-dod.mdc](./framework/seeds/rules/sdd-dod.mdc) adds when to update `status.md` and points at practices `#statusmd`. [Rule-03](./product-backlog.md#L206) and Sprint 6 feature-39 are **Retired**. Guides, `src/content`, framework design/stories/tests, and admin portal AC list three harness rules.

**Verification**: `rg 'realtime-status' specs/framework/seeds` is empty. `constants.json` `rules` has three keys. CE-RULE-05 names three rule files.

### sdd-review-status compares Open RIDs (OGT 8)

**Why**: Open risks and dependencies on sprint-backlog were not compared with related work during a status review.

**What changed**: [`sdd-review-status/SKILL.md`](./framework/seeds/skills/sdd-review-status/SKILL.md) adds Open RID compare, RID status-change suggestions, Capabilities/Knowledge/Limits, chat picks in one message, and no question card. **CE-SKILL-09** and **AC5** on sdd-review-status in [`framework-tests.md`](./framework/framework-tests.md) and [`framework-stories.md`](./framework/framework-stories.md). CE-SKILL-02 steps match one chat reply.

**Verification**: `rg AskQuestion specs/framework/seeds/skills/sdd-review-status/` is empty. Copy at `~/.cursor/skills/sdd-review-status/SKILL.md` matches the seed checksum.

### Feature break down in EN practices

**Why**: Refine and sprint planning needed one place for PBI split rules, Feature versus Task SBI rules, and good or bad examples without duplicating the Size ladder.

**What changed**: [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) adds [5. Feature break down](#5-feature-break-down). [`sdd-refine-backlog/SKILL.md`](./framework/seeds/skills/sdd-refine-backlog/SKILL.md) and [`sdd-plan-sprint/SKILL.md`](./framework/seeds/skills/sdd-plan-sprint/SKILL.md) load that heading in Knowledge.

**Verification**: Index link `#5-feature-break-down` resolves. `rg 'Feature break down' specs/framework/seeds/skills/sdd-refine-backlog specs/framework/seeds/skills/sdd-plan-sprint` shows Knowledge rows. Section 5 has no Plan mode text.

### Pack rule dod: four work types and write order

**Why**: One gate rule should name PBI, SBI, OGT, and sprint defaults, retrospective, and which process files to update after Done is confirmed.

**What changed**: [`sdd-dod.mdc`](./framework/seeds/rules/sdd-dod.mdc) lists default checks per type, artifact extra or replacement DoD, `retrospective` skill on PBI and SBI, and write order (changes-log, issues-log, status after confirm, sprint-backlog, product-backlog) per type.

**Verification**: The rule has sections PBI, SBI, RID, OGT, and Sprint. PBI and SBI defaults include a quality gate. RID defaults cover solution verify and close on the RID Log.

**Update 2026-10-05**: RID type and quality gate on PBI and SBI defaults added in the same file. Common quality gate is now a checklist in the same file for a software feature or another deliverable. PBI, SBI, and RID point at that section.

### Pack create-skill TRUE AGENT body shape

**Why**: The seed taught a nine-step procedure and a numbered example. Pack skills should default to capabilities, knowledge, and limits. Pack paths should use `{client_root}/templates/framework.sdd.works/...`, not `../` links.

**What changed**: [`sdd-create-skill/SKILL.md`](./framework/seeds/skills/sdd-create-skill/SKILL.md) rewrite. [`framework-design.md`](./framework/framework-design.md) sdd-create-skill paragraph notes the default body and fragile-job rule.

**Verification**: The seed has Capabilities, Knowledge, and Limits sections. Defined terms use a practices heading path with `{locale}`. CE-SKILL-03 unchanged: confirm then one write under `{client_root}/skills/sample-skill/SKILL.md`.

### Sprints 6–8 schedule (Option A each)

**Why**: Process loop (rules, retrospective, close-sprint, process seeds), then engineering skills and seeds, then Ethan job routing and Agent-03.

**What changed**: [`product-backlog.md`](./product-backlog.md) `Sprint` cells for Sprint 6 (Rule-01–03, Skill-06–07, Spec-seeds-05), Sprint 7 (Skill-01, 09, 11, 14 and Spec-seeds-10–13), Sprint 8 (Agent-03). [`sprint-backlog.md`](./sprint-backlog.md) adds Sprint 6–8 **ToDo** with Feature and Task SBIs. Unplanned PBIs drops 15 rows. [`status.md`](./status.md) adds OGT refine for [i18n-03](./product-backlog.md#L304).

**Verification**: Sprint 6 has seven SBIs (feature-37–42, task-01). Sprint 8 has Agent-03 plus two Task SBIs. Unplanned PBIs has 11 rows.

### Sprint 5 closed (DoD)

**Why**: User confirmed all six Sprint 5 skill features usable after DoD review.

**What changed**: [`sprint-backlog.md`](./sprint-backlog.md) Sprint 5 **Done**; feature-31 through feature-36 **Done**. [`product-backlog.md`](./product-backlog.md) Skill-03, Skill-04, Skill-05, Skill-13, Skill-15, Skill-16 **Done**. [`framework-design.md`](./framework/framework-design.md) lists `sdd-refine-backlog` seed path. Retrospective on Sprint 5.

**Verification**: Six seeds under `specs/framework/seeds/skills/` with matching `constants.json` keys. User acceptance recorded on 2026-10-05.

### Sprint 5 schedule (Option A)

**Why**: The next MVP is the SDD planning loop on a new project: update-project, process files, refine backlog, plan sprint, plus pack authoring skills.

**What changed**: [Skill-03](./product-backlog.md#L89), [Skill-04](./product-backlog.md#L92), [Skill-05](./product-backlog.md#L94), [Skill-13](./product-backlog.md#L115), [Skill-15](./product-backlog.md#L126), and [Skill-16](./product-backlog.md#L130) are **Sprint 5** in [`product-backlog.md`](./product-backlog.md). [`sprint-backlog.md`](./sprint-backlog.md) adds **Sprint 5** (ToDo) with six Feature SBIs and removes those PBIs from Unplanned PBIs. [`status.md`](./status.md) Project progress lists Sprint 5 ToDo.

**Verification**: Each listed PBI has `Sprint` **Sprint 5**. Unplanned PBIs has 26 rows. Sprint 5 table has feature-31 through feature-36 with Parent links to pb-24, pb-25, pb-26, pb-87, pb-93, pb-94.

### Product backlog refine (accept all)

**Why**: Readiness review found Unplanned PBIs out of sync with product-backlog, broken Related links, and coarse Size on i18n-02.

**What changed**: [i18n-02](./product-backlog.md#L299) Size **Theme**. [Skill-13](./product-backlog.md#L115), [Skill-15](./product-backlog.md#L126), and [Skill-16](./product-backlog.md#L130) gain ADR-089 install-folder bullets and seed Related links. Unplanned PBIs in [`sprint-backlog.md`](./sprint-backlog.md) match those rows. Agent-03 Related uses `../artifacts-map.json`. Change record states [Web-portal-15](product-backlog.md) Size **Epic**.

**Verification**: Unplanned Description and Related for pb-87, pb-93, and pb-94 match the Product Backlog table. `#build-agent` and `#create-rule` open in framework-design. i18n-02 Size is Theme in both files.

### adr and knowledge roots in artifacts-map.json

**Why**: ADR and Knowledge paths were convention only. Audit, Ethan, and update-project had no shared map keys for those trees.

**What changed**: [ADR-090](./adr/ADR-090-adr-knowledge-map-roots.md). Practices `#artifacts-mapjson`, `sdd-update-project`, `sdd-audit-artifacts`, and `ethan.md`. Live `{workspace}/artifacts-map.json` adds `"adr": "specs/adr"` and `"knowledge": "specs/knowledge"`. Audit fixtures CE-AUDIT-18 and CE-AUDIT-19. [Spec-seeds-04](./product-backlog.md#L238) requirement notes the optional keys.

**Verification**: Run CE-AUDIT-18 and CE-AUDIT-19 against the checked-in fixtures. Confirm `sdd-update-project` confirm summary includes `adr:` and `knowledge:` when the user keeps those keys.

### Pack skill folders build-agent, create-skill, create-rule

**Why**: Authoring skills used an `sdd-` folder prefix while constants keys stayed `skill_*`. Short folder names match `prompt-optimizer` and rule files.

**What changed**: [ADR-089](./adr/ADR-089-pack-authoring-skill-names.md). Seed folders renamed under `specs/framework/seeds/skills/`. [`constants.json`](./framework/seeds/templates/constants.json) values updated. Product backlog, sprint backlog, framework design/stories/tests, EN/HanS `scrum-in-sdd`, and [`status.md`](./status.md) use the new names. [ADR-074](./adr/ADR-074-sdd-create-skill.md) keeps historical context; folder name superseded by ADR-089.

**Verification**: `rg 'sdd-build-agent|sdd-create-skill|sdd-create-rule' specs/framework/seeds/skills/` is empty. `constants.json` maps `skill_build_agent`, `skill_create_skill`, and `skill_create_rule` to the new folder names. Remove stale `~/.cursor/skills/sdd-*` copies after pack update.

### Refine skill paths use the client root

**Why**: Relative links such as `../../templates/EN/` resolve from the skill file. They miss the pack after install. ADR files belong to this workspace only.

**What changed**: [sdd-refine-backlog](./framework/seeds/skills/sdd-refine-backlog/SKILL.md) loads practices from `{client_root}/templates/framework.sdd.works/{locale}/` and friendly-language from `{client_root}/{rules_dir}/`. It does not read an adr folder.

**Verification**: The skill file has no `../../` link and no `adr` path. Copy lives at `~/.cursor/skills/sdd-refine-backlog/SKILL.md`.

### Refine findings open with part and verdict

**Why**: `{part} is {verdict}` names the place that failed. The unreadable runs were the next sentence, which listed paths instead of the PBI.

**What changed**: [sdd-refine-backlog](./framework/seeds/skills/sdd-refine-backlog/SKILL.md) starts Issue with that sentence, then the PBI code, the short name, and what the person sees. The question-card ban is one sentence. The on-going task lists each finding as code and short name. [ADR-087](./adr/ADR-087-refine-one-confirm.md) matches.

**Verification**: The Issue section requires `{part} is {verdict}` and does not forbid it. The skill names AskQuestion in zero places. Copy lives at `~/.cursor/skills/sdd-refine-backlog/SKILL.md`.

## 2026-10-04

### Product backlog refine (accept all)

**Why**: `sdd-refine-backlog` found Unplanned PBIs drift, a missing Done row, stale Web-portal-05 text, and i18n-01 scope that implied HanS or HanT `sdd-scrum-practices.md` copies.

**What changed**: [`product-backlog.md`](./product-backlog.md) sets [Skill-05](./product-backlog.md#L94) to ToDo, tightens [i18n-01](./product-backlog.md#L297) requirements, and fixes [Web-portal-05](./product-backlog.md#L363) call-up wording. [`sprint-backlog.md`](./sprint-backlog.md) Unplanned PBIs adds [Rule-04](./product-backlog.md#L208), copies Related from the Product Backlog table for Spec-seeds-05 through Spec-seeds-12, and matches Skill-05 status.

**Verification**: Every Product Backlog row with Sprint `—` has a matching Unplanned PBIs row. Spec-seeds Related cells match between the two tables. i18n-01 requirements name EN-only practices and HanS or HanT `scrum-in-sdd.md`.

### friendly-language naming and four pack rules

**Why**: Public catalogs still listed three harness rules. The seed already shipped `friendly-language.mdc` under the canonical name (no `sdd-` prefix).

**What changed**: [`product-backlog.md`](./product-backlog.md) adds [Rule-04](./product-backlog.md#L208) Done. EN/HanS `scrum-in-sdd`, `src/content/scrum-in-sdd/*`, and `src/content/features/*` list `friendly-language.mdc`. [`framework-design.md`](./framework/framework-design.md), [`framework-stories.md`](./framework/framework-stories.md), and [`framework-tests.md`](./framework/framework-tests.md) expect four rule files. [`app-stories.md`](./admin-portal/app-stories.md) and UI mocks note the rule.

**Verification**: `rg -i 'sdd-friendly' specs/` is empty. `constants.json` maps `friendly-language` → `friendly-language.mdc`. Seed file at `specs/framework/seeds/rules/friendly-language.mdc`. Skills still link `../../rules/friendly-language.mdc`.

### Sprint options stay a similar size

**Why**: One plan message offered options of one Implementable sprint item and options of three, as if they were the same sprint.

**What changed**: [EN practices](./framework/seeds/templates/EN/sdd-scrum-practices.md) §1 says options in one message differ by at most one new Implementable Feature SBI. [sdd-plan-sprint](./framework/seeds/skills/sdd-plan-sprint/SKILL.md) applies that sentence before it sends the list.

**Verification**: §1 names the count and says not to pad a thin option. Step 4 in the skill points at that sentence.

### Sprint plan one instruction for the on-going task

**Why**: Step 4 still named the on-going task from the sprint job, and the example offered choices for a different sprint than the list above it.

**What changed**: [sdd-plan-sprint](./framework/seeds/skills/sdd-plan-sprint/SKILL.md) points step 4 at the chat template. The example is one sprint. The Now line for an Epic or Theme is why the job needs that outcome.

**Verification**: The skill has one on-going task name pattern. **Your choice** in the example is for Sprint 2 only.

### Sprint plan on-going task name

**Why**: 'Refine Agent-02 for Sprint 5 (named job workflow)' is not a readable task name.

**What changed**: [sdd-plan-sprint](./framework/seeds/skills/sdd-plan-sprint/SKILL.md) names the on-going task `Refine {Epic or Theme} PBI {code} {short name}`.

**Verification**: The favorite-a-card example uses 'Refine Epic PBI ACC-01 Account management'.

### Sprint plan: no question card

**Why**: A later plan run still opened a question card ("Which option for Sprint 5? The options are in chat.") and hid the list.

**What changed**: [sdd-plan-sprint](./framework/seeds/skills/sdd-plan-sprint/SKILL.md) opens with a ban on that card and on those sentences. The pick is the reply under **Your choice**.

**Verification**: The skill body does not tell the agent to call a question tool. The first section says send the list, then stop.

### Sprint plan pick in chat

**Why**: AskQuestion shows a question card before the chat text, so the proposal list appeared after the question.

**What changed**: [sdd-plan-sprint](./framework/seeds/skills/sdd-plan-sprint/SKILL.md) sends the numbered list, then the choices, in one message. The reply in chat is the pick. [ADR-088](./adr/ADR-088-mvp-plan-names-coarse-pbi.md) records that AskQuestion stays uncalled.

**Verification**: The skill has no AskQuestion step for the sprint pick. The example ends with **Your choice** under the list. Copy lives at `~/.cursor/skills/sdd-plan-sprint/SKILL.md`.

### Sprint plan candidates as a numbered list

**Why**: A three-column table was hard to read. The accept line did not name the sprint backlog item or the file.

**What changed**: [sdd-plan-sprint](./framework/seeds/skills/sdd-plan-sprint/SKILL.md) sends each candidate as **code — short name**, then Now, then If you accept. If you accept names the SBI in quotes and names `sprint-backlog.md`. [ADR-088](./adr/ADR-088-mvp-plan-names-coarse-pbi.md) notes that the option body is a list.

**Verification**: The skill examples for Card list view and Favorite a card use that list. No option template uses a PBI table. Copy lives at `~/.cursor/skills/sdd-plan-sprint/SKILL.md`.

### Sprint plan may name an Epic or Theme

**Why**: A sprint job can need an outcome that is still Epic or Theme. Keeping those rows off the plan hid the work. A fixed case list would hard-code product stories into the skill.

**What changed**: [ADR-088](./adr/ADR-088-mvp-plan-names-coarse-pbi.md). [EN practices](./framework/seeds/templates/EN/sdd-scrum-practices.md) §1, §2, readiness item 9, and §4. [sdd-plan-sprint](./framework/seeds/skills/sdd-plan-sprint/SKILL.md) names those PBIs in plain language, writes an on-going task on accept, and schedules only Implementable PBIs.

**Verification**: The skill chat template has “In this MVP, refine before the sprint delivers it” and an on-going task line. The write rules leave `Sprint` unchanged for a PBI that appears only in that block. Copy lives at `~/.cursor/skills/sdd-plan-sprint/SKILL.md`.

### Product backlog refine (chat picks 1, 3–6; Web-portal-15 Epic)

**Why**: Refine found a missing Features row, a duplicate portal PBI, stale Status and links, and Web-portal-15 Size out of sync with Requirements.

**What changed**: [`product-backlog.md`](./product-backlog.md) adds [Web-portal-07](./product-backlog.md#L377) row #47 (Sprint 3, Done), removes Web-portal-03, sets [Web-portal-12](./product-backlog.md#L383) Done, [Web-portal-15](product-backlog.md) Description **Unified public site** and Size **Epic**, and fixes Agent-03 `artifacts-map.json` link. [`sprint-backlog.md`](./sprint-backlog.md) adds `#rid-d1` on closed D-1 and sets Unplanned Web-portal-15 Size Epic.

**Verification**: `#pb-73` resolves on the table. No Web-portal-03 in Requirements or table. D1 links open the closed RID row. `../artifacts-map.json` opens from the backlog page.

### sdd-refine-backlog findings in plain English

**Why**: Findings used code-only titles and `{part} is {verdict}` plus path chains. That read like agent output, not a desk review.

**What changed**: [ADR-087](./adr/ADR-087-refine-one-confirm.md) and [sdd-refine-backlog/SKILL.md](./framework/seeds/skills/sdd-refine-backlog/SKILL.md) require headline `{PBI code} — {noun}` and one or two plain Issue sentences. Proposed fix stays one sentence.

**Verification**: Send the findings list in the skill names the em-dash headline and bans template openers and comma chains of paths. Copy lives at `~/.cursor/skills/sdd-refine-backlog/SKILL.md`.

### sdd-refine-backlog findings list

**Why**: A wide findings table was hard to copy. Issue and Reason split the mismatch from the board fact.

**What changed**: [ADR-087](./adr/ADR-087-refine-one-confirm.md) and [sdd-refine-backlog/SKILL.md](./framework/seeds/skills/sdd-refine-backlog/SKILL.md) use a numbered list. Each item has Issue and Proposed fix.

**Verification**: The skill section Send the findings list shows the numbered shape. The skill file is copied to `~/.cursor/skills/sdd-refine-backlog/SKILL.md`.

### Product backlog bidirectional PBI links

**Why**: Requirements and the Product Backlog table should cross-link by PBI code. External files keep `#pb-N` on the table row.

**What changed**: [EN sdd-scrum-practices](./framework/seeds/templates/EN/sdd-scrum-practices.md) product-backlog Requirements and table templates use one `#pb-N` anchor per Requirements line. Live [`product-backlog.md`](./product-backlog.md) and EN seed [`product-backlog.md`](./framework/seeds/templates/EN/product-backlog.md) match. [`framework-design.md`](./framework/framework-design.md) and [`framework-stories.md`](./framework/framework-stories.md) AC1 note the link rule.

**Verification**: A Requirements line has `<a id="pb-N">` and `[code](#pb-N)`. The table PBI Code cell links `[code](#pb-N)` to that line.

### One confirm for sdd-refine-backlog

**Why**: One AskQuestion per fail made refine slow. Fail text used readiness item numbers and Retire, which are not words on the board.

**What changed**: [ADR-087](./adr/ADR-087-refine-one-confirm.md) records one chat table and one AskQuestion with four choices: Accept all and update specs, I will enter instructions in chat, Create an OGT to record these findings and I will refine later, Leave it to me. Accept all is only for edits to an existing PBI. User-facing text uses the PBI code, noun, and status. Remove or delete replaces Retire. The skill file is not updated in this entry.

**Verification**: ADR-087 decision items 1 through 6 match this entry. `sdd-refine-backlog/SKILL.md` still asks one fail at a time until the table layout is chosen.

### sdd-refine-backlog findings before AskQuestion

**Why**: AskQuestion in the same turn as the findings table hid the table behind the question card until the user pressed Esc.

**What changed**: [ADR-087](./adr/ADR-087-refine-one-confirm.md) decision 1 splits findings chat and confirm into two turns. [sdd-refine-backlog/SKILL.md](./framework/seeds/skills/sdd-refine-backlog/SKILL.md) sends Design A table first, then AskQuestion on the next turn with a short prompt.

**Verification**: Limits ban AskQuestion in the findings turn. Confirm on the next turn does not point at chat above.

### Product backlog refine (Web-portal-15, Theme rows)

**Why**: Integration and site redesign sat on an Implementable row. Several rows were Theme or Epic scope but sized as Implementable.

**What changed**: [`product-backlog.md`](./product-backlog.md) sets [Web-portal-15](product-backlog.md) to Theme **Unified public site** with integration and redesign requirement bullets. Web-portal-03 is Done (public instructions on `/` from [Web-portal-09](./product-backlog.md#L430)). [Agent-02](./product-backlog.md#L68), [MCP-04](./product-backlog.md#L323), and [i18n-01](./product-backlog.md#L297) are Theme. [`sprint-backlog.md`](./sprint-backlog.md) Unplanned PBIs match; Done Web-portal-03 leaves Unplanned.

**Verification**: Web-portal-15 Description is Unified public site and Size is Theme. Web-portal-03 Status is Done on both tables. Unplanned PBIs count is 31.

### PBI Size column and Implementable-only sprint planning

**Why**: Sprint planning had no way to exclude Epic or Theme rows. The readiness ladder on requirement bullets did not appear on the board.

**What changed**: [EN sdd-scrum-practices](./framework/seeds/templates/EN/sdd-scrum-practices.md) adds Epic, Theme, and Implementable terminology, §4 Size product backlog, readiness item 9, MVP feature-set wording, and `Size` on Product Backlog and Unplanned PBIs templates. [product-backlog.md](./product-backlog.md) and [sprint-backlog.md](./sprint-backlog.md) Unplanned PBIs add `Size`; every existing row is Implementable. [sdd-refine-backlog](./framework/seeds/skills/sdd-refine-backlog/SKILL.md) and [sdd-plan-sprint](./framework/seeds/skills/sdd-plan-sprint/SKILL.md) set Size on refine and schedule only Implementable PBIs. [ADR-086](./adr/ADR-086-pbi-size.md) records the decision.

**Verification**: Product Backlog header is `#`, Component, PBI Code, Description, Size, Related, Sprint, Status. Readiness item 9 and §4 exist in practices. Plan-sprint step 3 limits candidates to Implementable.

### sdd-plan-sprint MVP candidates in chat

**Why**: AskQuestion repeated the PBI table and sprint goal. The user could not read the full MVP in chat before picking.

**What changed**: [`sdd-plan-sprint/SKILL.md`](./framework/seeds/skills/sdd-plan-sprint/SKILL.md) step 4 sends at least one MVP candidate per target sprint in chat (PBI table, Reason line, SBIs, extra tasks). AskQuestion carries sprint-level options only. Limits ban the PBI table inside AskQuestion.

**Verification**: Step 4 ends with MVP candidates in chat before Propose actions. Propose actions says the AskQuestion prompt is short and does not repeat the table.

### Product backlog refine after sdd-refine-backlog

**Why**: MCP-01 had Sprint — while Sprint 2 SBIs still parented it. Pack skills sdd-build-agent and sdd-create-rule had seeds but no PBI rows. Retired Skill-02 and Skill-10 stayed in the table without Requirements entries.

**What changed**: [`product-backlog.md`](./product-backlog.md) splits [MCP-01](./product-backlog.md#L318) (installer Done, Sprint 2) from [MCP-04](./product-backlog.md#L323) (go-live ToDo). Adds [Skill-15](./product-backlog.md#L126) and [Skill-16](./product-backlog.md#L130). Removes retired Skill-02 and Skill-10 rows. [Skill-05](./product-backlog.md#L94) is WIP. [`sprint-backlog.md`](./sprint-backlog.md) Unplanned PBIs match. [`constants.json`](./framework/seeds/templates/constants.json) drops `skill_tracking` and adds `skill_build_agent`. [`status.md`](./status.md) points at MCP-04 go-live.

**Verification**: MCP-01 Sprint 2 Done has Sprint 2 installer SBIs. MCP-04 is — with no SBIs. Unplanned count stays 32.

### sdd-plan-sprint step order and backlog paths

**Why**: Step 3 pointed at Response before Extra tasks. The Product Backlog table was read from the wrong file.

**What changed**: [`sdd-plan-sprint/SKILL.md`](./framework/seeds/skills/sdd-plan-sprint/SKILL.md) reads product-backlog and sprint-backlog separately. Response to user follows step 4. `{client_root}` is defined. OGT wording and parked OGT writes match status.md.

**Verification**: Step 4 ends with Then follow Response to user. Step 3 has no Response pointer.

### sdd-plan-sprint friendly-language pass

**Why**: The skill mixed EN practice links with `{locale}`, repeated Task rules, and user-facing labels for extra sprint work.

**What changed**: [`sdd-plan-sprint/SKILL.md`](./framework/seeds/skills/sdd-plan-sprint/SKILL.md) title is Sprint proposal. SBI and OGT expand once. Step 4 and the proposal use Extra tasks. Practices reads use `{locale}` headings only. Change PBIs re-runs step 4. Status and Limits use positive wording for OGT and status cells.

**Verification**: No `../../templates/EN/` links in the skill body. The proposal list includes Extra tasks before AskQuestion.

### Plan sprint lists shared tasks

**Why**: A PBI SBI can still leave a shared task out of the sprint. Effort that only builds that one SBI is not a second SBI.

**What changed**: `sdd-plan-sprint` step 4 lists extra Task SBIs after the PBI SBI is named. The same question includes them. The write adds only the extra tasks in the accepted choice. The Task and OGT rows in practices stay the rule.

**Verification**: The skill question names `Extra tasks` or `none`. A task that only builds that one SBI stays off the sprint table.

### When sections leave three skills

**Why**: Each `When` section repeated the trigger phrases already in the skill description. The description is the load trigger.

**What changed**: `## When` is removed from `sdd-plan-sprint`, `sdd-review-status`, and `sdd-refine-backlog`. The trigger phrases stay in each description.

**Verification**: Those three skill files have no `## When` heading. `prompt-optimizer` still has `## When to Use`.

### Sprint slice has a pass and a fail

**Why**: "Keep the set small" and "include every part" can both be true, so a planner has no pass or fail for one MVP.

**What changed**: [1. Plan sprints by MVP](./framework/seeds/templates/EN/sdd-scrum-practices.md#1-plan-sprints-by-mvp) names the PBIs that job needs. [2. Slice product to MVPs](./framework/seeds/templates/EN/sdd-scrum-practices.md#2-slice-product-to-mvps) states when the sprint passes and when it fails. `sdd-plan-sprint` reads those two sections from the locale practices file.

**Verification**: The slice section has no "Keep the set small" line. A sprint fails when a PBI can be removed and the job still finishes, and when the job is still unfinished after the release.

### Terminology in practice is a six-row table

**Why**: The Terminology in practice section repeated artifact definitions that already live in artifact section rules and in the guide.

**What changed**: [Terminology in practice](./framework/seeds/templates/EN/sdd-scrum-practices.md#terminology-in-practice) is a table with PBI, SBI, Feature, Task, OGT, and MVP. Harness and artifact names stay in [`scrum-in-sdd.md`](./framework/seeds/templates/EN/scrum-in-sdd.md#terminology). Process artifact headers link `#product-backlogmd`, `#sprint-backlogmd`, `#statusmd`, `#issues-logmd`, and `#changes-logmd` under Artifacts writing guideline. [`seed-artifacts-building-guide.md`](./seed-artifacts-building-guide.md) and [`framework-design.md`](./framework/framework-design.md) match.

**Verification**: The old `definition-of-*` anchors are gone from living headers. The guide Terminology line points at the practices table for the six work names.

### Spec-to-build replaces design, implement, and TDD pack skills

**Why**: One SBI needed one skill path. Separate `sdd-design`, `sdd-implement`, and `sdd-tdd` forced handoffs and kept a TDD folder with no seed.

**What changed**: [ADR-085](./adr/ADR-085-sdd-spec-to-build.md) supersedes [ADR-066](./adr/ADR-066-sdd-design-before-implementation.md). The seed is [`sdd-spec-to-build/SKILL.md`](./framework/seeds/skills/sdd-spec-to-build/SKILL.md). The `sdd-implement` seed is deleted. [`constants.json`](./framework/seeds/templates/constants.json) drops `sdd-tdd`, `sdd-design`, and `sdd-implement`, and adds `sdd-spec-to-build`. [Skill-11](./product-backlog.md#L108) owns the merged skill. Skill-02 and Skill-10 are Retired. Sprint 13 feature-13 is `sdd-spec-to-build`. feature-15 and feature-03 are Retired. feature-01 is `sdd-atdd` only. Living guides, Features catalogs, locale strings, stories, tests, and cross-skill seeds use the new name.

**Verification**: A search of living specs, Features markdown, and messages finds no `sdd-tdd`, `sdd-implement`, or living `sdd-design` except ADR-066 and dated history. The constants value is `sdd-spec-to-build`.

**Boundary**: Past change-log rows and ADR-066 body stay as written.

### Seed skill sdd-plan-sprint

**Why**: Sprint 7 needs a pack skill that assigns existing PBIs so each sprint is one MVP. The MVP rules already live in practices. The skill owns the propose-then-write loop.

**What changed**: Added [`specs/framework/seeds/skills/sdd-plan-sprint/SKILL.md`](./framework/seeds/skills/sdd-plan-sprint/SKILL.md). [`framework-design.md`](./framework/framework-design.md) points at that seed. [`framework-tests.md`](./framework/framework-tests.md) CE-SKILL-07 no longer lists `sdd-plan-sprint` as seedless. Constants key `skill_plan_sprint` was already `sdd-plan-sprint`. Skill-05 and Sprint 7 feature-01 stay ToDo until the skill is confirmed usable.

**Verification**: The seed folder opens. The Other skills table lists `sdd-plan-sprint`. The missing-seed row and CE-SKILL-07 no longer name `sdd-plan-sprint`.

### Unplanned PBIs section on sprint-backlog.md

**Why**: PBIs with no sprint assignment had no row in the schedule artifact, so unscheduled work was only visible in the Product Backlog `Sprint` cell.

**What changed**: [`sprint-backlog.md`](./sprint-backlog.md) adds **Unplanned PBIs** after the last sprint table. The table uses Product Backlog columns minus `Sprint`. The EN [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) template, the EN sprint-backlog seed, [`framework-design.md`](./framework/framework-design.md), and [`scrum-in-sdd.md`](./framework/seeds/templates/EN/scrum-in-sdd.md) match.

**Verification**: The sprint-backlog Index links Unplanned PBIs last. The section header row is `#`, Component, PBI Code, Description, Related, Status. Product Backlog rows with `Sprint` `—` appear in that table.

### Sprint 5–16 tables removed; work moved to Unplanned PBIs

**Why**: Forward sprint tables were placeholders. Planning should run through `sdd-plan-sprint` instead of a fixed sixteen-sprint map.

**What changed**: [`sprint-backlog.md`](./sprint-backlog.md) keeps Sprints 1–4 only. Sprint 5–16 sections and their SBIs are removed. Every PBI that was on Sprint 5–16 is in **Unplanned PBIs** (32 rows). [`product-backlog.md`](./product-backlog.md) sets `Sprint` to `—` for those PBIs. [`status.md`](./status.md) drops the Sprint 5–16 row and points at Unplanned PBIs.

**Verification**: No `## Sprint 5` heading in `sprint-backlog.md`. Unplanned PBIs follows Sprint 4. Product Backlog has no `Sprint 5` through `Sprint 16` in the table `Sprint` column.

### Refine skill folder is sdd-refine-backlog

**Why**: The living skill name should say backlog, matching the job, while the constants key stays stable for readers that already resolve `skill_refine_pb`.

**What changed**: [`constants.json`](./framework/seeds/templates/constants.json) sets `skill_refine_pb` to `sdd-refine-backlog`. Living guide lists, Features catalogs, [Skill-05](./product-backlog.md#L92), Sprint 6 feature-01, [`framework-design.md`](./framework/framework-design.md), [`framework-tests.md`](./framework/framework-tests.md), and [`app-stories.md`](./admin-portal/app-stories.md) use the new name. Job rows keep the key `skill_refine_pb`. Message keys `admin.guide.feat_sdd_refine_pb` stay. No `SKILL.md` in this change.

**Verification**: A search of living specs and Features markdown finds no `sdd-refine-pb`. The constants value is `sdd-refine-backlog`.

**Boundary**: Past change-log rows and dated history that named `sdd-refine-pb` stay as written.

## 2026-10-03

### Sprint 4 is Done

**Why**: The user confirmed Sprint 4 usable. Every sprint row is Done or Retired.

**What changed**: Sprint 4 in [`sprint-backlog.md`](./sprint-backlog.md) is Done. Current WIP sprint is none. [`status.md`](./status.md) records Sprint 1 - 4 as Done. Sprint 4 closed 2026-10-03. The next items stay Sprint 5 [feature-26](./sprint-backlog.md#sprint-5), [feature-25](./sprint-backlog.md#sprint-5), and [feature-02](./sprint-backlog.md#sprint-5).

**Verification**: The Sprint 4 status line is Done. The sprint table heading is Done. Current WIP sprint is none.

**Boundary**: The four Current OGT rows stay ToDo. Sprint 5 stays ToDo.

### Practices job sections are removed from the EN seed

**Why**: Numbered job sections in `sdd-scrum-practices.md` repeated skills and agent PBIs, or were empty. Workflow steps live in skills and agent PBIs.

**What changed**: The EN [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) index links [Scrum in SDD practices](./framework/seeds/templates/EN/sdd-scrum-practices.md#scrum-in-sdd-practices). Subsections 1 and 3–8 are gone. [feature-30](./sprint-backlog.md#sprint-4) Related specs no longer use `#6-report-status`. Agent-09–14 and Spec-seeds-03 in [`product-backlog.md`](./product-backlog.md) name the skills. Future-sprint feature-01 rows name the skill, not a practices job number. [`framework-design.md`](./framework/framework-design.md) says the EN practices file no longer lists numbered jobs.

**Verification**: The EN practices index has `Scrum in SDD practices`. Feature-30 does not link `#6-report-status`.

**Boundary**: Historical change-log rows and ADR decision text that name job numbers stay as written. HanS and HanT practices copies stay on i18n-02.

### Sprint 4 feature-03 is Done

**Why**: The path file, the missing template seed, and the practices example match the feature-03 done line.

**What changed**: Sprint 4 [feature-03](./sprint-backlog.md#sprint-4) Project path file artifacts-map.json is Done. [Spec-seeds-04](./product-backlog.md#L238) is Done. [`artifacts-map.json`](../artifacts-map.json) is the project path file. There is no template seed. The example is in [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md#artifacts-mapjson).

**Verification**: The Sprint 4 table shows feature-03 as Done. `specs/artifacts-map.md` and `specs/framework/seeds/templates/EN/artifacts-map.md` are absent.

**Boundary**: Sprint 4 stays WIP. Sprint 5 stays ToDo.

### Sprint 4 feature-30 is Retired

**Why**: Practices job 6 repeated `sdd-review-status`. That section is not needed.

**What changed**: Sprint 4 [feature-30](./sprint-backlog.md#sprint-4) Practices job 6 for report status is Retired. The row stays. It is not removed, and it is not Done. [### 6. Report status](./framework/seeds/templates/EN/sdd-scrum-practices.md#6-report-status) is Retired. Report status is `sdd-review-status` (`skill_get_status`). [Skill-15](./product-backlog.md#L113) is Done. [feature-24](./sprint-backlog.md#sprint-4) stays Done. Agent-12 stays ToDo on Sprint 8. Current SBI in [`status.md`](./status.md) is feature-03 Project path file artifacts-map.json.

**Verification**: The Sprint 4 table shows feature-30 as Retired and feature-03 as WIP. Practices job 6 is the Retired line.

**Boundary**: Decision 10 in [ADR-076](./adr/ADR-076-review-status-one-skill.md) stays as written. HanS and HanT practices copies stay on i18n-02.

### Sprint 4 feature-21 and feature-24 are Done

**Why**: The user confirmed those items as usable.

**What changed**: Sprint 4 [feature-21](./sprint-backlog.md#sprint-4) Change-log and issues-log seeds is Done. [feature-24](./sprint-backlog.md#sprint-4) Skill sdd-review-status is Done. [Spec-seeds-08](./product-backlog.md#L255) and [Spec-seeds-13](./product-backlog.md#L258) are Done. [Skill-15](./product-backlog.md#L113) stays WIP. [feature-30](./sprint-backlog.md#sprint-4) Practices job 6 for report status stays WIP. [feature-03](./sprint-backlog.md#sprint-4) is Project path file artifacts-map.json, WIP, not Retired. [Spec-seeds-04](./product-backlog.md#L238) is `artifacts-map.json`, WIP, with no template seed. The on-going task Review the issues-log seed is closed.

**Verification**: The Sprint 4 table shows feature-21 and feature-24 as Done, feature-30 and feature-03 as WIP. Current OGT no longer has Review the issues-log seed.

**Boundary**: Practices job 6 still says the skill writes after the second yes. That stays on feature-30.

### Three OGTs for skill files are closed

**Why**: The user confirmed OGT 1 through OGT 3 as done.

**What changed**: Current OGT in [`status.md`](./status.md) keeps Review ethan.md and Review the issues-log seed. Closed row 1 is Enhance sdd-review-status. Closed row 2 is the Reply. Sentence sections. Closed row 3 is Find common patterns for skills and update sdd-create-skill. [feature-24](./sprint-backlog.md) stays ToDo.

**Verification**: Open Current OGT has two rows. Last 15 closed OGTs starts with those three tasks.

### The module test spec is `{stem}-tests.md`

**Why**: The engineering test file is a test spec. The name `{stem}-test.md` looked like a single test.

**What changed**: The living name is `{stem}-tests.md`. [`app-tests.md`](./admin-portal/app-tests.md), [`mcp-tests.md`](./mcp/mcp-tests.md), and [`framework-tests.md`](./framework/framework-tests.md) open under those paths. Guides, design, practices, stories, the product backlog, the sprint backlog, and [`artifacts-map.json`](../artifacts-map.json) use the new name. The on-going task Change `{stem}-test.md` to `{stem}-tests.md` is closed.

**Verification**: The three files open. Living specs no longer name `{stem}-test.md` as the current filename.

**Boundary**: Past change-log sentences still name the old files. Historical knowledge notes still name `mcp-test.md`.

### The project path file is artifacts-map.json

**Why**: The map stores settings and paths. A Markdown list mixed settings lines with path lines.

**What changed**: The project path file is [`artifacts-map.json`](../artifacts-map.json) at the workspace root. The practices Settings, Paths, and Example blocks are JSON. Living design, stories, tests, guides, portal catalogs, `sdd-audit-artifacts`, `sdd-update-project`, and `sdd-review-status` name that file. Audit fixtures use JSON. [ADR-082](./adr/ADR-082-artifacts-map-json.md). The on-going task Change artifacts-map.md to JSON is closed.

**Verification**: `specs/artifacts-map.md` is absent. Fixture folders use `artifacts-map.json`. The practices example is a JSON fence.

**Boundary**: OGT Change `{stem}-test.md` to `{stem}-tests.md` stays open. Historical ADR bodies still name `artifacts-map.md`.

### The pack lookup is constants.json

**Why**: The lookup is keys and paths. A Markdown table asked the reader to find the row.

**What changed**: The authoring seed is [`constants.json`](./framework/seeds/templates/constants.json). Living specs, ethan, the design prompt, create skills, the guides, MCP ledger examples, and the install test name that file. The Cursor copy is `~/.cursor/templates/framework.sdd.works/constants.json`. [ADR-081](./adr/ADR-081-constants-json.md). The on-going task Change constants.md to JSON is closed.

**Verification**: `specs/framework/seeds/templates/constants.md` is absent. The install unit test that copies the lookup file passes.

**Boundary**: OGT Change artifacts-map.md to JSON stays open. Historical ADR-060 decision text still names `constants.md`.

### constants and artifacts-map become JSON

**Why**: Both files are settings and paths. `.sdd-installed.json` already stores that kind of record under keys.

**What changed**: [ADR-081](./adr/ADR-081-constants-json.md) names the lookup `constants.json`. [ADR-082](./adr/ADR-082-artifacts-map-json.md) names the project path file `artifacts-map.json`. The files are not converted in this entry. Two on-going tasks in [`status.md`](./status.md) hold that work.

**Verification**: ADR-081 and ADR-082 are Accepted. The on-going tasks are ToDo.

**Boundary**: `constants.md` and the Markdown artifacts-map example stay until those tasks run.

### No artifacts-map template seed

**Why**: A filled Pokymon map in the template folder looked like a starter a new project should copy.

**What changed**: [ADR-080](./adr/ADR-080-no-artifacts-map-seed.md). The template file is removed. The Pokymon map is the example in the artifacts-map section of [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md#artifacts-mapmd). `sdd-update-project` writes `{workspace}/artifacts-map.md` from the templates in that section. [Spec-seeds-04](./product-backlog.md#L238) and Sprint 4 feature-03 are Retired. [i18n-02](./product-backlog.md#L299) does not translate an artifacts-map seed.

**Verification**: `specs/framework/seeds/templates/EN/artifacts-map.md` is absent. The example is in the practices section.

**Boundary**: Audit fixtures stay. This repo's `specs/artifacts-map.md` stays. Feature-03 is Retired, not Done.

### The pack does not ship an artifacts-map rule

**Why**: `artifacts-map.mdc` does not see a delete, rename, or move the user makes in the file tree, so it does not keep the map current.

**What changed**: [ADR-077](./adr/ADR-077-no-artifacts-map-rule.md) supersedes [ADR-072](./adr/ADR-072-rule-artifacts-map.md). The constants row, the EN guide, the HanS guide, and the portal catalogs drop `artifacts-map.mdc`. The seed file is removed. Rule-04 and Sprint 4 feature-22 are Retired. `{workspace}/artifacts-map.md` stays the index. `sdd-audit-artifacts` reports a stored path that fails to open and does not repair the map.

**Verification**: Living EN specs no longer list `artifacts-map` as a rule key. Feature-22 is Retired, not Done.

**Boundary**: Feature-03 stays WIP. The map file stays.

### Start and update are one skill

**Why**: `sdd-kickoff-project` and `sdd-update-project` are the same write with two entry points.

**What changed**: [ADR-078](./adr/ADR-078-update-project-one-skill.md) supersedes [ADR-069](./adr/ADR-069-skill-kickoff-project.md). The constants key is `skill_update_project`. The folder is `sdd-update-project`. Practices job 2 and job 3 both use that skill. `Uninitialized` and `Index broken` both follow that skill after confirm. Skill-03 and Sprint 5 feature-01 and feature-20 are Retired. The EN guide, the HanS guide, and the portal catalogs drop `sdd-kickoff-project`.

**Verification**: Living specs name `sdd-update-project` for both jobs. Feature-01 and feature-20 are Retired, not Done.

**Boundary**: Sprint 5 feature-25, feature-02, and feature-26 stay ToDo. No `SKILL.md` is written in this change.

### Start and update are one job

**Why**: Two Capabilities rows used the same skill key, so the model had no second skill to choose.

**What changed**: [ADR-079](./adr/ADR-079-one-job-update-project.md) supersedes [ADR-078](./adr/ADR-078-update-project-one-skill.md) decision 2. The job name is Update project settings. Practices job 2 is removed. Its steps sit under job 3 as the case where the map is missing. Onboard still says two next steps. Agent-08 is Retired. Agent-09 is the job.

**Verification**: The Capabilities table has one row for `skill_update_project`. `ethan.md` matches the design prompt.

**Boundary**: Sprint 5 feature-02 stays ToDo. It is the `Uninitialized` confirm of this job.

## 2026-10-02

### Status review and the confirmed write are one skill

**Why**: A file-only status read can lag the implementation. The compare and the proposal are one job.

**What changed**: [ADR-076](./adr/ADR-076-review-status-one-skill.md) makes `sdd-review-status` the status skill. [ADR-073](./adr/ADR-073-skill-get-status.md) decision 4 and decision 6 are superseded. [ADR-065](./adr/ADR-065-skill-update-status.md) no longer ships a second folder. The seed [`sdd-review-status/SKILL.md`](./framework/seeds/skills/sdd-review-status/SKILL.md) drafts the four steps and the second yes. Practices job 6 points at `skill_get_status`. Skill-07 is retired. Sprint 4 feature-24 and feature-30 stay ToDo.

**Verification**: Living specs name `sdd-review-status` for report status. `skill_update_status` is not a constants key.

**Boundary**: The on-disk folder `specs/framework/seeds/skills/sdd-tracking/` stays and is not the status skill. HanS and HanT guides stay on i18n-02. Feature-24 and feature-30 are not Done.

## 2026-10-01

### Feature-04 sprint-backlog seed is Done

**Why**: The user confirmed every sprint-backlog section. The design file still carried the old item table and retrospective rules.

**What changed**: [`framework-design.md`](./framework/framework-design.md) `sprint-backlog.md` links the practices rules and states Additional Done Criteria, the sprint-heading row link, the three-key row order, and the three-label retrospective. [`scrum-in-sdd.md`](./framework/seeds/templates/EN/scrum-in-sdd.md), the HanS guide, and the three portal guide copies say the By-rule record names the incident. Sprint 4 feature-04 and [Spec-seeds-06](./product-backlog.md#L250) are Done. The live [`sprint-backlog.md`](./sprint-backlog.md) header and RID description cells are restored after an editor format pass. [markdown-table-cell-bullets](./knowledge/agent/markdown-table-cell-bullets.md) records the table-cell and heading-id lesson.

**Verification**: The design no longer says Item acceptance, `s1-feature-01`, or implementation order. The guide catalog and install tests pass, 46 of 46. The Sprint 4 table lists feature-04 Done between feature-11 and feature-03.

**Boundary**: The HanS and HanT sprint-backlog seeds stay on Sprint 16 i18n-02.

### Retrospective rules are Done

**Why**: The user confirmed the retrospective in the live file and the EN seed.

**What changed**: Retrospective rules left Current OGT and is row 1 of Last 15 closed OGTs in [`status.md`](./status.md). Current OGT has no open row. feature-04 stays open.

**Verification**: Closed row 1 is Retrospective rules. The live file and the EN seed name the incident, such as `feature-01 done`.

### Retrospective examples use three labels

**Why**: The user asked to test the retrospective shape on the live file and the EN seed.

**What changed**: [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) records the template. [`sprint-backlog.md`](./sprint-backlog.md) and the EN seed use Learnings, Opportunities, and Future actions. A later run is the next number under those labels.

**Verification**: Sprint 1 has records 1 through 4 under the labels that have a point. Sprint 2 in the EN seed has the three empty sentences.

### Skill-08 names the three retrospective headings

**Why**: The retrospective record must use Learnings, Opportunities, and Future actions. The skill that writes that record is `sdd-retrospective`.

**What changed**: [Skill-08](./product-backlog.md#L96) in [`product-backlog.md`](./product-backlog.md) states those three headings. The PBI already existed. It stays in Sprint 9.

**Verification**: The Skill-08 line and the Skill-08 table row both name Learnings, Opportunities, and Future actions.

### Sprint item table rules are Done

**Why**: The user confirmed the sprint item table in the live file and the EN seed.

**What changed**: Sprint item table rules left Current OGT and is row 1 of Last 15 closed OGTs in [`status.md`](./status.md). Retrospective rules is WIP.

**Verification**: Current OGT row 1 is Retrospective rules, status WIP. Closed row 1 is Sprint item table rules.

### Status words are bold

**Why**: The user required every status `ToDo`, `WIP`, and `Done` to be highlighted with `**`.

**What changed**: The sprint body and sprint item table rules in [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) say the status word is bold. [`sprint-backlog.md`](./sprint-backlog.md) and the EN seed use that bold word in the table heading and the status cell. The sprint line was already `**Status: {status}**`.

**Verification**: The live file has 16 bold table headings and 85 bold status cells. The EN seed has 2 bold headings and 6 bold status cells.

### Sprint 4 feature-28 parent cell breaks onto two lines

**Why**: The preview still showed Agent-02 and Agent-15 on one line, separated by a middle dot.

**What changed**: Multi-fact cells in [`sprint-backlog.md`](./sprint-backlog.md) use `- ` bullets separated by `<br>`. The feature-28 Parent PBI cell is the check. The how-to in [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) shows that cell as the example.

**Verification**: No SBI table cell still contains ` · `. The feature-28 parent cell is two bullets.

### SBI cells with more than one fact use bullets

**Why**: The user added a sprint item table rule: more than one fact in a cell uses bullet points on separate lines.

**What changed**: The how-to in [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) states that rule. Multi-fact cells in [`sprint-backlog.md`](./sprint-backlog.md) use `- ` bullets separated by `<br>`. The EN seed cells each have one fact, so they stay one line.

**Verification**: A cell with one fact is one line. A cell that had ` · ` between facts is now a bullet list.

### Sprint item tables match the related-spec rule

**Why**: A review of the live sprint backlog and the EN seed found related cells that were not links, and em dashes in the seed retrospective.

**What changed**: Related cells in [`sprint-backlog.md`](./sprint-backlog.md) and the EN seed are links. A row with no other spec links its parent PBI. The seed retrospective no longer uses an em dash.

**Verification**: Every SBI related cell contains a Markdown link. The seed retrospective lines are sentences.

### Sprint item table rule is a template

**Why**: The user confirmed the sprint item table, including Additional Done Criteria on top of the Definition of Done.

**What changed**: [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) records the template and the how-to. [`sprint-backlog.md`](./sprint-backlog.md) and the EN seed follow that table. Sprint item table rules stays WIP until the user confirms both files.

**Verification**: The practices file has the sprint item table template. The live Sprint 4 table and the EN seed tables use the new heading, the noun SBI, and the sort.

### Sprint body rules are Done

**Why**: The user confirmed the live sprint bodies and the EN seed.

**What changed**: Sprint body rules left Current OGT and is row 1 of Last 15 closed OGTs in [`status.md`](./status.md). Sprint item table rules is WIP.

**Verification**: Current OGT row 1 is Sprint item table rules, status WIP. Closed row 1 is Sprint body rules.

### Sprint body rule is a template

**Why**: The sprint heading, Sprint Goal, and status line had no template in `sdd-scrum-practices.md`.

**What changed**: [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) records the confirmed sprint body template and how-to notes. The old sprint heading notes are that template. The live sprint sections and the EN seed already follow it. Sprint body rules stays WIP until the user confirms both files.

**Verification**: Sprint 4 has a Sprint Goal, a depends line, `**Status: WIP**`, and a progress note. EN Sprint 1 has `**Status: Done** (every item is complete)` and no depends line.

### Definition of Done rules are Done

**Why**: The user confirmed the live Definition of Done section and the EN seed.

**What changed**: Definition of Done rules left Current OGT and is row 1 of Last 15 closed OGTs in [`status.md`](./status.md). Sprint body rules is WIP.

**Verification**: Current OGT row 1 is Sprint body rules, status WIP. Closed row 1 is Definition of Done rules.

### Definition of Done rule is a template

**Why**: The Definition of Done section had no template in `sdd-scrum-practices.md`.

**What changed**: [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) records the confirmed template and how-to notes. The live Definition of Done section in [`sprint-backlog.md`](./sprint-backlog.md) stays as it is. The EN seed names the quality link Definition of Done and adds the Item acceptance sentence. Definition of Done rules stays WIP until the user confirms both files.

**Verification**: The practices file has `#### Definition of Done` with `##### Template` and `##### How to write`. The live checklist is unchanged.

### RID Log rules are Done, and RID coverage is removed

**Why**: The user confirmed the RID Log. The coverage table is not part of that section.

**What changed**: RID Log rules left Current OGT. The RID coverage section is removed from [`sprint-backlog.md`](./sprint-backlog.md), the EN seed, and [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md). Definition of Done rules is WIP. The Definition of Done section is unchanged.

**Verification**: Neither sprint-backlog file has a RID coverage heading. The Definition of Done heading and its checklist remain.

### RID tables sort by time, then severity

**Why**: The RID tables had no row order.

**What changed**: The RID Log how-to in [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) sorts each table by time, newer first, then by severity: Fetal, Broken, Blocking, High, Medium, Low. Open RIDs use Created Sprint. Closed RIDs use Closed Sprint. The live Open RIDs already follow that order.

**Verification**: D-2 and D-3 are Blocking in Sprint 2, and R-1 is Medium in Sprint 2, so R-1 stays last.

### RID Log uses open and closed tables

**Why**: The RID Log used one table with type, status, handling note, and an open severity scale.

**What changed**: The RID Log rule in [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) is a template and how-to notes. [`sprint-backlog.md`](./sprint-backlog.md) and the EN seed use an intro, Open RIDs, and Closed RIDs. Severity is Fetal, Broken, Blocking, High, Medium, or Low. The id is `{type}-{number}`, such as `D-1` and `R-1`. RID Log rules stays WIP until the user confirms both files.

**Verification**: The live file has D-2, D-3, and R-1 in Open RIDs, and D-1 in Closed RIDs. The EN seed has R-1 in Open RIDs and D-1 in Closed RIDs.

### A section rule is a template plus how to write

**Why**: A section rule in `sdd-scrum-practices.md` listed the same facts again as narrative bullets.

**What changed**: [`seed-artifacts-building-guide.md`](./seed-artifacts-building-guide.md) says a section rule has a template and a how-to note for each placeholder. The notes are not restated as a narrative list. The header in [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) is that template and those notes. The template is in a code block.

**Verification**: The header section has `##### Template` and `##### How to write`. It has no Content, Format, Writing, or Terms list.

### Header rules for sprint-backlog.md are Done

**Why**: The user confirmed the live header and the EN seed header.

**What changed**: Header rules for `sprint-backlog.md` left Current OGT and is row 1 of Last 15 closed OGTs in [`status.md`](./status.md). RID Log rules for `sprint-backlog.md` is WIP. The oldest closed row dropped off the list of 15.

**Verification**: Current OGT row 1 is RID Log rules, status WIP. Closed row 1 is Header rules, closed in Sprint 4.

### Back to the top, and the section name is RID Log

**Why**: The return link opened the Index, and the section name was still RID Registry.

**What changed**: Each sprint and the RID section in [`sprint-backlog.md`](./sprint-backlog.md) and the EN seed use `[Back to the top](#sprint-backlog-frameworksddworks)` in the live file and `[Back to the top](#sprint-backlog-pokymon-card-collection)` in the seed. The target is the H1. The section heading is `## RID Log (Risks,Impediments, Dependencies)`, and the Index link is `#rid-log-risksimpediments-dependencies`. [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md), [`status.md`](./status.md), and [`framework-design.md`](./framework/framework-design.md) use the name RID Log.

**Verification**: The live file has the top link under the RID Log heading and under Sprint 1 through Sprint 16. The EN seed has the top link under the RID Log heading, Sprint 1, and Sprint 2.

### Each sprint links back to the index

**Why**: A reader who opens a sprint from the Index had no link back to that list.

**What changed**: The line after each `## Sprint` heading in [`sprint-backlog.md`](./sprint-backlog.md) and the EN seed is `[Back to the index](#index)`. The heading stays `## Sprint` plus the number, so the preview id stays `sprint-1` and the same pattern for each later sprint. [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) records that line under Sprint heading.

**Verification**: The live file has the link under Sprint 1 through Sprint 16. The EN seed has the link under Sprint 1 and Sprint 2. The target `#index` is the `### Index` heading.

### Index heading returns under Current project progress

**Why**: The jump links sat in the Current project progress list with no heading.

**What changed**: [`sprint-backlog.md`](./sprint-backlog.md) and the EN seed place `### Index` after the Sprint goal bullet. The RID Registry link and the sprint links stay under that heading. The header rules in [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) require that heading.

**Verification**: Both files show `### Index` before `[RID Registry](#rid-registry-risksimpediments-dependencies)`.

### RID Registry heading uses commas

**Why**: The heading with slashes produced the preview id `rid-registry-risks---impediments---dependencies`, and the jump link did not match it.

**What changed**: The heading in [`sprint-backlog.md`](./sprint-backlog.md) and the EN seed is `## RID Registry (Risks,Impediments, Dependencies)`. The jump link is `#rid-registry-risksimpediments-dependencies`. The header rules in [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) use that heading and that id.

**Verification**: Cursor turns spaces into hyphens, then removes commas and parentheses. That heading becomes `rid-registry-risksimpediments-dependencies`.

### RID Registry jump link uses the heading name

**Why**: The heading `RID Registry (Risks / Impediments / Dependencies)` gets the preview id `rid-registry-risks---impediments---dependencies`. The link `#rid-registry-risks-impediments-dependencies` did not match that id.

**What changed**: The heading in [`sprint-backlog.md`](./sprint-backlog.md) and the EN seed is `## RID Registry`. The jump link is `[RID Registry](./sprint-backlog.md#rid-registry)`. The Index heading is removed. The jump links stay in the Current project progress list. The header rules in [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) match that shape.

**Verification**: Cursor builds a heading id by turning spaces into hyphens, then removing punctuation. `## RID Registry` becomes `rid-registry`.

### Current project progress adds an index

**Why**: Current project progress named the WIP sprint and did not list a jump to the RID Registry or to every sprint.

**What changed**: The header rules in [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) add an Index under Current project progress. The Index links the RID Registry, then each sprint, in sprint order. The link text is the name only. [`sprint-backlog.md`](./sprint-backlog.md) lists Sprint 1 through Sprint 16. The EN seed lists Sprint 1 and Sprint 2. Header rules stays WIP until the user confirms both files.

**Verification**: Each Index link uses the heading slug for that section. The RID Registry link is `#rid-registry-risks-impediments-dependencies`. A sprint link is `#sprint-1` and the same pattern for each later sprint.

### Sprint planning principles link the terminology store

**Why**: The principle lines named Sprint Goal, Increment, MVP, SBI, and OGT with no link, and the terminology store was not named in the seed building guide.

**What changed**: [Terminology in practice](./framework/seeds/templates/EN/sdd-scrum-practices.md#terminology-in-practice) adds Sprint Goal and MVP. The principle lines in [`sprint-backlog.md`](./sprint-backlog.md) and the EN seed link Sprint Goal, Increment, MVP, SBI, and OGT there. Current WIP sprint is a bold heading link, and the bullet says to click the link to jump to that sprint. [`seed-artifacts-building-guide.md`](./seed-artifacts-building-guide.md) names Terminology in practice as the terminology store.

**Verification**: The live file links those five headings under `sdd-scrum-practices.md` and shows `[**Sprint 4**](./sprint-backlog.md#sprint-4)`. The EN seed links the same headings and shows Sprint 2.

### Sprint backlog header shows planning principles and progress

**Why**: The header stated the current sprint in one sentence and the sprint rule in another, with no jump to the current sprint.

**What changed**: The header rules in [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) add Sprint planning principles as the last blockquote item, and add a Current project progress section after the blockquote. Current project progress names the total sprints, links the current WIP sprint heading, and copies that Sprint Goal. [`sprint-backlog.md`](./sprint-backlog.md) and the EN seed follow those rules. Header rules stays WIP until the user confirms both files.

**Verification**: The live file links [Sprint 4](./sprint-backlog.md#sprint-4) and copies the Sprint 4 goal. The EN seed links Sprint 2 and copies the Sprint 2 goal. Sprint Goal, Increment, and OGT link [`scrum-in-sdd.md`](./framework/seeds/templates/EN/scrum-in-sdd.md).

### Sprint backlog header content

**Why**: The header purpose still described a short-cycle list, and the header still had a Framework line.

**What changed**: The header rules in [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) say `sprint-backlog.md` is the Sprint Backlog artifact and lists every sprint. The file owns the schedule, the item status, and the latest project progress. Related links are `artifacts-map.md`, `scrum-in-sdd.md`, `status.md`, `product-backlog.md`, and `sdd-scrum-practices.md`. [`sprint-backlog.md`](./sprint-backlog.md) and the EN seed follow those rules. Header rules stays WIP until the user confirms both files.

**Verification**: Neither header has a Framework line. The Sprint Backlog term links [`scrum-in-sdd.md`](./framework/seeds/templates/EN/scrum-in-sdd.md#sprint-backlog). The SBI term links [Terminology](./framework/seeds/templates/EN/scrum-in-sdd.md#terminology).

### The seed follows the live example

**Why**: A section was done when only the live artifact passed.

**What changed**: [`seed-artifacts-building-guide.md`](./seed-artifacts-building-guide.md) adds a step before the stop. After the live example passes, the same section is updated in the EN seed under `specs/framework/seeds/templates/EN/`, using the Pokymon Card Collection example. The pass checks cover both files, and the user confirms both files.

**Verification**: Step 5 is the seed update. Step 6 starts the next section only after both files are confirmed. The Pass section names both files.

### Seed artifacts building guide

**Why**: The method for writing an artifact seed was only in the chat.

**What changed**: [`seed-artifacts-building-guide.md`](./seed-artifacts-building-guide.md) records the method. Section rules stay only in [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md). A term that already has a meaning there is a link. [`artifacts-map.md`](./artifacts-map.md) lists the guide.

**Verification**: The user confirmed the draft. The file matches that draft.

### Sprint backlog header rules

**Why**: The header of `sprint-backlog.md` restated row order, and that sentence disagreed with the practices.

**What changed**: [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) records the header rules under `### sprint-backlog.md`. [`sprint-backlog.md`](./sprint-backlog.md) follows those rules. [`status.md`](./status.md) tracks seven section tasks, and Header rules is WIP. Sprint 4 feature-04 stays ToDo.

**Verification**: The header has one H1, one tight blockquote, plain links, and two sentences before the rule. Numbering and row order are not in the header.

**Boundary**: The RID Registry rules are not written yet.

### sdd-update-status moves to Sprint 4

**Why**: [ADR-065](./adr/ADR-065-skill-update-status.md) names the write skill `sdd-update-status`. The ship item was still Sprint 8 under the retired name `sdd-tracking`.

**What changed**: Sprint 4 feature-30 is ToDo, immediately after feature-04. Skill-07 projects Sprint 4. Sprint 8 keeps feature-02, Ethan updates status. [`status.md`](./status.md) lists feature-30 after feature-04.

**Verification**: Sprint 4 order is feature-04, feature-30, feature-24, feature-22. Skill-07 names `sdd-update-status` and `skill_update_status`.

**Boundary**: The seed folder is still `specs/framework/seeds/skills/sdd-tracking/`. `constants.md` still lists `skill_tracking`. This move does not rename those files.

## 2026-09-30

### Feature-23 initial sdd-audit-artifacts is Done

**Why**: Ethan confirmed the audit skill is working. The skill block is the feature-23 check.

**What changed**: Sprint 4 feature-23 is Done. [Skill-10](./product-backlog.md#L101) is Done. The seed is [`SKILL.md`](./framework/seeds/skills/sdd-audit-artifacts/SKILL.md). [`framework-design.md`](./framework/framework-design.md#sdd-audit-artifacts) records that. [`status.md`](./status.md) names feature-24 as the next item. The fixture OGT for `CE-AUDIT-01` through `CE-AUDIT-17` is closed.

**Verification**: [`results.md`](./framework/fixtures/sdd-audit-artifacts/results.md) marks every CE-AUDIT skill block Pass except CE-AUDIT-13 Windows.

**Boundary**: CE-AUDIT-13 Windows stays Not observed. Onboard sentence fails stay on `sdd-ethan-audit-verdict`. feature-24 stays ToDo.

### Feature-21 changes-log and issues-log seeds are Done

**Why**: The user confirmed both EN seeds are usable.

**What changed**: Sprint 4 feature-21 is Done. [Spec-seeds-08](./product-backlog.md#L255) and [Spec-seeds-13](./product-backlog.md#L258) are Done. The EN [`artifacts-map.md`](./framework/seeds/templates/EN/artifacts-map.md) seed now says Open issues hold Open, Fixed, and Deferred rows, and Closed issues hold Closed rows. [`status.md`](./status.md) drops feature-21 from the next items.

**Verification**: The seed tree names `changes-log.md` and the two issues-log tables the same way as [ADR-075](./adr/ADR-075-issues-log-tables.md), the design, and the practices. No seed says the issues-log status is only Open or Closed.

**Boundary**: HanS and HanT bodies stay on i18n-02.

### The writing rule is friendly-language.mdc

**Why**: The always-on writing rule file is now `friendly-language.mdc`.

**What changed**: The seed is `specs/framework/seeds/rules/friendly-language.mdc`. The heading is Rule - Friendly language. [`framework-design.md`](./framework/framework-design.md) names that file and the loaded path `~/.cursor/rules/friendly-language.mdc`. The personal copy and the rules catalog use the same name.

**Verification**: No spec or rule copy names `communication-friendly.mdc` or `write-friendly.mdc`. Mentions of `writing-style.mdc` stay, because that is the rule this one replaced.

### The read skill is sdd-review-status

**Why**: The read-only skill folder is now `sdd-review-status`.

**What changed**: The seed moved from `specs/framework/seeds/skills/sdd-get-status/` to `specs/framework/seeds/skills/sdd-review-status/`. The frontmatter name is `sdd-review-status`. The heading is Review status. Living specs use that name. The constants key stays `skill_get_status`. Feature-24 stays ToDo.

**Verification**: Living files name `sdd-review-status`. Closed OGT rows and older entries in this file still name `sdd-get-status`.

**Boundary**: The ADR-073 file name stays. This does not rewrite `~/.cursor`.

### The conclusion record is changes-log.md

**Why**: The conclusion record file is now `changes-log.md`.

**What changed**: This file moved from `specs/change-log.md` to `specs/changes-log.md`. The EN seed moved to `specs/framework/seeds/templates/EN/changes-log.md`. Both titles are Changes log. Living specs, skills, and the published guide name `changes-log.md`. [Spec-seeds-08](./product-backlog.md#L255) stays ToDo.

**Verification**: Those living files name `changes-log.md`. The 2026-09-27 product-backlog row still names `change-log.md`.

**Boundary**: The ADR-070 file name stays. This does not rewrite `~/.cursor`.

### Change log entries use one shape

**Why**: The live log and the EN seed described a conclusion, and they did not state the day order or the entry labels.

**What changed**: This file, [`changes-log.md`](./framework/seeds/templates/EN/changes-log.md), [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md), and [`framework-design.md`](./framework/framework-design.md) state the same shape. Days are `## YYYY-MM-DD`, newest first. Each entry is **Why**, **What changed**, and **Verification**. **Boundary** is optional. [Spec-seeds-08](./product-backlog.md#L255) stays ToDo.

**Verification**: The four files name those labels and the day order. This file's day headings run from `2026-09-30` down to `2026-09-21`.

### Feature-28 reads the guide and practices when the step needs them

**Why**: Reading both files during onboard pulls them into a reply that only needs the ledger and the audit.

**What changed**: [`agents/ethan.md`](./framework/seeds/agents/ethan.md) reads `scrum-in-sdd.md` when the user asks what a Scrum in SDD name means, and `sdd-scrum-practices.md` when a job from the table is about to run. Onboard does not open either file. [`framework-design.md`](./framework/framework-design.md) §7 and §14 match. Sprint 4 feature-28 is Done. The next item is feature-23.

**Verification**: The seed and §14 are the same text. Both file names and both read triggers are in the Knowledge section. Onboard still reads the ledger and follows `sdd-audit-artifacts`.

### The step is named onboard

**Why**: The prompt already named the once-per-chat step onboard. Living specs still used the previous name for that step.

**What changed**: That previous name is now onboard in [`framework-design.md`](./framework/framework-design.md), [`framework-stories.md`](./framework/framework-stories.md), [`framework-test.md`](./framework/framework-tests.md), [`sprint-backlog.md`](./sprint-backlog.md), [`status.md`](./status.md), [ADR-068](./adr/ADR-068-scrum-in-sdd-filename.md), [ADR-073](./adr/ADR-073-skill-get-status.md), the two skill descriptions, and the earlier entries in this file.

**Verification**: A search of the specs finds no previous name for this step. Feature-28 stays ToDo.

### Open OGT heading names the abbreviation

**Why**: The section title `Current OGT` did not say what the letters stand for.

**What changed**: The heading is `Current OGT(On-going Tasks)` in the EN status seed, [`status.md`](./status.md), [Spec-seeds-07](./product-backlog.md#L252), [`framework-design.md`](./framework/framework-design.md), [`framework-stories.md`](./framework/framework-stories.md) AC3, [`framework-test.md`](./framework/framework-tests.md) CE-TPL-08, and [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md).

**Verification**: A search of living specs finds `Current OGT` only in this file's earlier entry. The seed heading is `## Current OGT(On-going Tasks)`.

### Portal guide uses the three artifact groups

**Why**: The instructions-page copies of the guide still listed `artifacts-map.md` under Framework artifacts and used `{model_name}`.

**What changed**: [`scrum-in-sdd.en.md`](../src/content/scrum-in-sdd/scrum-in-sdd.en.md), [`scrum-in-sdd.zh-Hans.md`](../src/content/scrum-in-sdd/scrum-in-sdd.zh-Hans.md), and [`scrum-in-sdd.zh-Hant.md`](../src/content/scrum-in-sdd/scrum-in-sdd.zh-Hant.md) now list Core, Framework, and Engineering artifacts, plus pack files beside those groups. Engineering uses `{stem}` and includes `issues-log.md`. The Chinese ADD heading is `SDD 核心工件`, so it stays distinct from the KEEP heading `核心工件`.

**Verification**: None of the three portal files still contains `{model_name}`. The HanS seed stays on i18n-01. OGT 1 is closed.

### Guide names three artifact groups; missing seeds added

**Why**: The English guide put `artifacts-map.md` under Framework artifacts, had no Core group, omitted `issues-log.md`, and used `{model_name}`. The design named authoring seeds that were not in the seed tree.

**What changed**: [`scrum-in-sdd.md`](./framework/seeds/templates/EN/scrum-in-sdd.md) lists Core artifacts (`scrum-in-sdd.md`, `sdd-scrum-practices.md`, `artifacts-map.md`), Framework artifacts (`product-backlog.md`, `sprint-backlog.md`, `status.md`, `change-log.md`), and Engineering artifacts (`architecture.md`, `{stem}-stories.md`, `{stem}-design.md`, `{stem}-test.md`, `deployment.md`, `.secrets`, `issues-log.md`). `constants.md` and `.sdd-installed.json` are pack files beside those groups. The ADD Core group is not Scrum's KEEP core artifacts. New draft seeds: `seeds/.sdd-installed.json` (field example, `pack_complete: false`, outside the install allow-list), `templates/EN/issues-log.md`, `templates/EN/.secrets`, `rules/sdd-dod.mdc`, `rules/sdd-incremental-delivery.mdc`, `rules/realtime-status.mdc`, `rules/artifacts-map.mdc`, `skills/sdd-audit-artifacts/SKILL.md`, and `skills/sdd-get-status/SKILL.md`. [`framework-design.md`](./framework/framework-design.md) records the ledger example and the draft seeds. `skills/sdd-update-status/` was not added; `sdd-tracking` stays the status-write folder.

**Verification**: The seed tree has every authoring seed path the design names except the skills still listed as not in the tree and the HanS/HanT bodies. The `.secrets` seed has no value. The ledger example has `pack_complete: false`. OGT 2, feature-23, feature-24, Rule-01 through Rule-04, Spec-seeds-11, and Spec-seeds-13 stay open until the user confirms them.

## 2026-09-29

### Affected SBIs are bullets

**Why**: Several SBIs in one cell were one comma-separated line, so the list was hard to scan.

**What changed**: Each Affected SBIs item is its own bullet in the cell. The bullet is the code and the SBI name. Updated [Spec-seeds-07](./product-backlog.md#L252), [`framework-design.md`](./framework/framework-design.md), [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md), [`sdd-tracking`](./framework/seeds/skills/sdd-tracking/SKILL.md), [`framework-stories.md`](./framework/framework-stories.md), [`framework-test.md`](./framework/framework-tests.md), the EN status seed, and [`status.md`](./status.md).

**Verification**: The open OGT row that names four SBIs shows four bullets. The EN seed sample cell is a bullet list.

### status.md progress rows fold by status

**Why**: The progress table repeated a sprint goal that already lives on the sprint backlog, and it listed every sprint on its own row.

**What changed**: The progress table is `Sprint`, `Status`, `Note`. Consecutive Done sprints share one row. Consecutive ToDo sprints share one row. Where we are now adds one sentence after the sprint name. What is next follows the current sprint, the current SBI, and the sprint item order. Affected SBIs shows the code and the SBI name. The file ends with Last updated, a timestamp, and the agent name. Updated [Spec-seeds-07](./product-backlog.md#L252), [`framework-design.md`](./framework/framework-design.md), [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md), [`framework-stories.md`](./framework/framework-stories.md), [`framework-test.md`](./framework/framework-tests.md), the EN status seed, and [`status.md`](./status.md).

**Verification**: The live progress table has three sprint rows: Sprint 1 - 3 Done, Sprint 4 WIP, Sprint 5 - 16 ToDo. The EN seed sprint header has no Sprint Goal column. The live file ends with Last updated.

### status.md starter has one section list

**Why**: Design §2.3, the templates section, ADR-070, and `sdd-get-status` described different slices of `status.md`. Feature-27 had no story or test for the starter.

**What changed**: [`framework-design.md`](./framework/framework-design.md) §2.3 and the `status.md` template section name Project progress, where we are now, what could be the next, Current OGT, and the latest 15 closed OGTs. [`framework-stories.md`](./framework/framework-stories.md) AC3–AC8 and [`framework-test.md`](./framework/framework-tests.md) CE-TPL-08 and CE-TPL-09 cover that shape. The EN seed keeps its comments and samples. [`status.md`](./status.md) is reshaped for review. Feature-27 stays WIP.

**Verification**: The EN seed title is `The latest status of [product name]`. Its header has no `status:` line and no `as_of` line. The live status file uses the same five sections.

### Sprint items use one Definition of Done section

**Why**: Every sprint row repeated a DoD cell, and later sprints had put that row’s acceptance in the same cell.

**What changed**: [`sprint-backlog.md`](./sprint-backlog.md) and the EN sprint-backlog seed drop the DoD column. One Definition of Done checklist sits above the first sprint. Sprints 3, 4, and 5 state a replacement checklist. A row that had its own check keeps it as an item-acceptance line under that sprint. [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md), [`framework-design.md`](./framework/framework-design.md), [`framework-stories.md`](./framework/framework-stories.md), and [`framework-test.md`](./framework/framework-tests.md) match.

**Verification**: Sprint item headers are `#`, Code, SBI, Parent PBI, Module/Type, Related specs, Status. The EN seed header matches. No sprint item header still contains DoD.

### Product Backlog requirements leave the Description column

**Why**: The Description cell was holding the requirement, and every row repeated the same DoD checklist.

**What changed**: The requirement is a paragraph under the feature name. Description is a short summary. The Product Backlog DoD column is removed. One Definition of Done checklist sits above the Product Backlog table. Updated [`product-backlog.md`](./product-backlog.md), the EN product-backlog seed, [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md), [`framework-design.md`](./framework/framework-design.md), and [`framework-stories.md`](./framework/framework-stories.md).

**Verification**: The live table header is Category, PBI Code, PBI, Description, Related, Sprint, Status. The EN seed header matches. Spec-seeds-07’s status starter stays in the requirement paragraph under that feature.

### sdd-audit-artifacts design matches the stories

**Why**: Stories and tests already covered a template-folder map, a file outside `specs/`, an absolute stored path, and a locale value. The design section did not.

**What changed**: [`framework-design.md`](./framework/framework-design.md#sdd-audit-artifacts) now states those path and locale rules. The verdict table is unchanged. `SKILL.md` is still not added. Feature-23 stays ToDo.

**Verification**: AC3, AC4, AC7, and AC10–AC12 in [`framework-stories.md`](./framework/framework-stories.md#sdd-audit-artifacts) each have a sentence in that design section.

### sdd-audit-artifacts is specified

**Why**: Onboard follows the audit verdict, and the test plan still described the retired install-and-copy recovery.

**What changed**: [Skill-10](./product-backlog.md#L101) states the read-only verdict. [`framework-design.md`](./framework/framework-design.md#sdd-audit-artifacts) states how the skill reaches it. [`framework-stories.md`](./framework/framework-stories.md#sdd-audit-artifacts) and [`framework-test.md`](./framework/framework-tests.md) cover the three verdicts, an empty locale, and the read-only stop. Sprint 4 feature-23 stays ToDo. `SKILL.md` is not added.

**Verification**: The design verdict table is unchanged. Feature-23 related specs point at the design section and the stories. Feature-27 stays WIP. Feature-28 stays the ethan guide-and-practices read.

### Skill authoring skill is sdd-create-skill

**Why**: The pack had two authoring skills. One is tied to a single tool. The other ships an eval harness this pack does not run. New skills must land at `{client_root}/{skills_dir}/`.

**What changed**: [ADR-074](./adr/ADR-074-sdd-create-skill.md). Seed [`sdd-create-skill`](./framework/seeds/skills/sdd-create-skill/SKILL.md). Constants key `skill_create_skill`. [Skill-16](./product-backlog.md#L115) is not on the current sprint. Pack copies of `skill-creator` and `create-skill` are removed.

**Verification**: The skill file names only `{client_root}` and `skills_dir` from `constants.md`. The guide lists `sdd-create-skill`. OGT 9 is closed.

### Seed tree moves under specs/framework/seeds

**Why**: The pack seeds and the framework design belong in one folder.

**What changed**: `specs/framework.seeds/` is now [`specs/framework/seeds/`](./framework/seeds/). Living specs point at that path.

**Verification**: `framework.seeds` is gone from the tree. Links from the English practices seed resolve to `framework-design.md` and ADR-060.

### Framework design, stories, and tests live under specs/framework/

**Why**: The coach design and the artifact design were two files. One design covers every framework category.

**What changed**: [`framework-design.md`](./framework/framework-design.md) is the overall design, with sections for framework-artifacts, agents, rules, skills, and templates. [`framework-stories.md`](./framework/framework-stories.md) and [`framework-test.md`](./framework/framework-tests.md) hold the former agent stories and tests under agents, and add sections for skills, rules, core-artifacts, process-artifacts, and engineering-artifacts. `specs/agent-ethan/` and `specs/framework.seeds/framework-design.md` are removed.

**Verification**: Product backlog, sprint backlog, artifacts map, practices, and architecture links resolve to `specs/framework/`.

### Sprint 3 is the portal and MCP. Onboard moves to Sprint 4

**Why**: Sprint 3 was mixing the R2 portal and MCP work with Ethan’s onboard.

**What changed**: Sprint 3 keeps the MCP and web-portal rows, all Done. task-01 and task-03 through task-06 are not separate increments. task-02 stays. Framework rows move to Sprint 4, whose goal is that Ethan completes onboard. Kickoff and update-project move to Sprint 5. The former Sprint 5 through Sprint 15 become Sprint 6 through Sprint 16.

**Verification**: Sprint 3 status is Done. The current item is Sprint 4 feature-27.

### Sprint 3 adds the onboard prompt and the design merge

**Why**: Onboard does not yet read the guide and practices, and Ethan’s design still lives in a second file.

**What changed**: Sprint 3 feature-28 is `ethan.md` reading `scrum-in-sdd.md` and `sdd-scrum-practices.md` during onboard, and adding the skills that load names. feature-29 merges [`agent-design.md`](./framework/framework-design.md) into [`framework-design.md`](./framework/framework-design.md). Both sit after the status seed.

**Verification**: The open order is feature-27, feature-28, feature-29, then feature-23.

### status.md keeps the last 15 closed OGTs

**Why**: Finished on-going tasks were either struck through in the open list or dropped. The open list was no longer only open work.

**What changed**: [`status.md`](./status.md) keeps open OGTs in the current table. A new section holds the latest 15 closed OGTs, newest first. [`framework-design.md`](./framework/framework-design.md) states that rule.

**Verification**: The current table has tasks 3 and 6. The closed section has 15 rows.

### status.md is its own Sprint 3 item

**Why**: A Usable audit opens `status.md`, and `sdd-get-status` reads it. The seed was only a parent on the Done map-seed row, while [Spec-seeds-07](./product-backlog.md#L252) stayed ToDo.

**What changed**: Sprint 3 feature-27 is the `status.md` seed, after feature-23 and before feature-24. feature-03 now parents only the artifacts-map seed.

**Verification**: The open list names feature-27. Spec-seeds-07 remains Sprint 3 ToDo.

### Next SBI is sdd-audit-artifacts

**Why**: Onboard follows `sdd-audit-artifacts` immediately after the ledger. The row was Sprint 3 feature-23 at open place 26, after the artifacts-map rule.

**What changed**: Open Sprint 3 order follows onboard. Next is feature-23 `sdd-audit-artifacts`. Then feature-24 `sdd-get-status`, feature-25 `sdd-update-project`, feature-26 Ethan runs that skill, feature-21 the remaining seeds, feature-01 kickoff, feature-02 Ethan runs kickoff, and feature-22 the artifacts-map rule. Sprint 4 has no SBIs. Skill-15, Skill-04, and Agent-09 project Sprint 3.

**Verification**: The first open Sprint 3 row is feature-23.

### sdd-audit-artifacts moves to Sprint 3

**Why**: Onboard follows `sdd-audit-artifacts` before kickoff. The skill was scheduled in Sprint 4.

**What changed**: The initial skill is Sprint 3 feature-23, after the remaining seeds and before `sdd-kickoff-project`. Sprint 3 already uses feature-03 for the map seed, so the code is feature-23. [Skill-10](./product-backlog.md#L101) projects Sprint 3. Sprint 4 keeps `sdd-get-status` and `sdd-update-project`.

**Verification**: Sprint 3 open order is feature-22, feature-21, feature-23, feature-01, feature-02. Sprint 4 no longer contains the audit skill.

### Sprint 1 and Sprint 2 use the DoD rule

**Why**: Those sprint rows still held the old acceptance text after the column became DoD.

**What changed**: Every Sprint 1 and Sprint 2 row in [`sprint-backlog.md`](./sprint-backlog.md) uses the four default checks. Sprint 2 feature-12 and feature-13 are one row each again, with their related specs restored.

**Verification**: Sprint 1 has 4 rows and Sprint 2 has 15. Each DoD cell is the default checks. Status on the repaired rows is Done.

### Product Backlog DoD cells use the default checks

**Why**: The column was renamed to DoD, and the cells still held the old acceptance text.

**What changed**: Every row in [`product-backlog.md`](./product-backlog.md) uses the four default checks: the DoD rule, user confirmation, linked acceptance criteria, and the quality bar in [`agent-test.md`](./framework/framework-tests.md), [`mcp-test.md`](./mcp/mcp-tests.md), and [`app-test.md`](./admin-portal/app-tests.md).

**Verification**: The Product Backlog table has one DoD cell shape on every row.

### Code is the second sprint column, and Product Backlog uses DoD

**Why**: `Code` was hard to scan after the item name. The Product Backlog still called its done-check column acceptance criteria after the sprint table had moved to DoD.

**What changed**: Sprint item columns are `#`, `Code`, `SBI`, Parent PBI, Module/Type, DoD, Related specs, Status. The Product Backlog column is `DoD`. The English product-backlog seed uses the same default DoD checks as the sprint seed. This repo’s product backlog keeps each row’s existing checks under that header. [`framework-design.md`](./framework/framework-design.md) and [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) match.

**Verification**: Sprint tables have eight cells and `Code` is column 2. Product Backlog headers say `DoD`.

### Sprint item column is DoD

**Why**: The sprint row was mixing story acceptance criteria with the check that marks the row done.

**What changed**: The sprint-item column is `DoD` in [`sprint-backlog.md`](./sprint-backlog.md), the EN seed, [`framework-design.md`](./framework/framework-design.md), and [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md). The seed default is the DoD rule, user confirmation, linked acceptance criteria, and the quality standard. Sprint 3 uses its own three checks: confirmed usable, pack cross-review, and TRUE AGENT. Product Backlog acceptance criteria stay on the PBI.

**Verification**: Sprint tables use `DoD`. Sprint 4 and earlier sprints keep their previous cell text under that header. Sprint 3 feature-18 is one row again.

### Seed prompt matches the audit onboard

**Why**: `agents/ethan.md` still classified a project from a missing `artifacts-map.md`. The design already moved that judgment into `sdd-audit-artifacts`.

**What changed**: [`agents/ethan.md`](./framework/seeds/agents/ethan.md) now follows §2.2, §2.4, and the §3 job index in [`agent-design.md`](./framework/framework-design.md). Onboard is the pack gate, then `sdd-audit-artifacts`, then one of `sdd-kickoff-project`, `sdd-update-project`, or `sdd-get-status`. Report status stays `skill_update_status`, and the prompt says to use `skill_tracking` until `constants.md` is renamed.

**Verification**: The seed no longer treats a missing map as a new project. It does not call `sdd_install_framework` or `sdd_update_framework`.

### Prompt wording and §14 stay identical

**Why**: Locale is an address the job reads, and the job table must not invent skill folder names. The design and the seed had started to diverge.

**What changed**: [`agents/ethan.md`](./framework/seeds/agents/ethan.md) reads `locale` from `{workspace}/artifacts-map.md` when a job needs it. Allowed values include `EN`, `HanS`, and `HanT`. Onboard names four skills by folder. Jobs in the table use the folder from `constants.md`. [`agent-design.md`](./framework/framework-design.md) §14 is that same prompt. Sprint 3 feature-11 is Done.

**Verification**: §14 and the seed file match. Feature-11 acceptance criteria are met. Parent Agent-02 stays ToDo.

### Audit reports an empty locale

**Why**: A missing `locale` is a header field. Ethan was left to notice it himself, and a chat question does not write the map.

**What changed**: `sdd-audit-artifacts` reports `locale` empty only when it opened the map and the field is missing. That report does not change the verdict. On `Usable`, onboard still follows `sdd-get-status`. When a later job needs a locale and the report says it is empty, Ethan proposes `sdd-update-project` and waits for confirm. [`framework-design.md`](./framework/framework-design.md), [`agent-design.md`](./framework/framework-design.md) §2.2 and §14, and the seed prompt match. Skill-10 and Sprint 4 feature-03 include the report.

**Verification**: An empty `locale` is not `Uninitialized` or `Index broken`. §14 and the seed match.

---

## 2026-09-28

### Onboard uses an audit verdict

**Why**: A missing root `artifacts-map.md` is not enough to call a project new, and a readable map is not enough to call the tree healthy. Listing every layout in `ethan.md` does not scale.

**What changed**: [`agent-design.md`](./framework/framework-design.md) §2.2 and §2.4. After the pack gate, Ethan follows the skill `sdd-audit-artifacts`. `Uninitialized` proposes `sdd-kickoff-project`. `Index broken` proposes `sdd-update-project`. `Usable` follows the skill `sdd-get-status` ([ADR-073](./adr/ADR-073-skill-get-status.md)). A missing skill, rule, or seed template sets `pack_complete` to false. The MCP tools `sdd_install_framework` and `sdd_update_framework` are not pack files, and Ethan does not call them to repair a missing file. [`framework-design.md`](./framework/framework-design.md) records the three skills. [Skill-15](./product-backlog.md#L113) is Sprint 4. [Skill-10](./product-backlog.md#L101) and [Skill-04](./product-backlog.md#L89) move their initial files to Sprint 4. The seed `agents/ethan.md` is not updated yet.

**Verification**: §2.2 names the three verdicts. §6 no longer tells Ethan to call install. Sprint 4 lists feature-03 (`sdd-audit-artifacts`), feature-04 (`sdd-get-status`), feature-01 (`sdd-update-project`), and feature-02.

---

## 2026-09-27

### Constants rules and audit skill key

**Why**: The guide names rule files without an `sdd-` prefix and includes `artifacts-map.mdc`. `constants.md` still used the old prefixed names, omitted that rule, and keyed the audit skill by folder name while Skill-10 names `skill_audit_artifacts`.

**What changed**: [`constants.md`](./framework/seeds/templates/constants.md) rules are `sdd-dod.mdc`, `sdd-incremental-delivery.mdc`, `realtime-status.mdc`, and `artifacts-map.mdc`. The audit skill key is `skill_audit_artifacts`. Rule-01–03, Sprint 11 rows, the agent-design ledger example, ADR-065, and instruction mocks use the no-prefix names. Guide Rules lists and Features catalogs name `artifacts-map.mdc`. Feature-22 stays ToDo and does not write the `.mdc` file.

**Verification**: A search of living specs finds no `sdd-dod.mdc`, `sdd-incremental-delivery.mdc`, or `sdd-realtime-status.mdc`. `constants.md` lists four rules and `skill_audit_artifacts`.

### No combined ADR for the artifact index

**Why**: The artifact-index decisions are already in `framework-design.md`, ADR-070, and ADR-072. One more ADR would repeat them.

**What changed**: [`framework-design.md`](./framework/framework-design.md) states that those decisions are not restated in a combined ADR.

**Verification**: That sentence is in the Framework files section.

### Rule artifacts-map

**Why**: `sdd-audit-artifacts` runs only when asked. An ordinary turn can add a project file and leave the project map unchanged.

**What changed**: [ADR-072](./adr/ADR-072-rule-artifacts-map.md). The rule file is `artifacts-map.mdc`, with no `sdd-` prefix. The EN guide lists it. Rule-04 is Sprint 3 feature-22, which still has to write `specs/framework/seeds/rules/artifacts-map.mdc` and update the remaining spec lists.

**Verification**: Both Rules lists in `templates/EN/scrum-in-sdd.md` name `artifacts-map.mdc`. Sprint 3 feature-22 is ToDo.

### Portal markdown paths move under content/

**Why**: Features files at the pack root sit next to the installable pack. Scrum in SDD needs the same local-read path without joining that root.

**What changed**: [ADR-071](./adr/ADR-071-portal-content-paths.md). Sync still stores the whole pack locally. Features reads `<unpacked>/content/features/`. Scrum in SDD reads `<unpacked>/content/scrum-in-sdd/` with fallback `src/content/scrum-in-sdd/`. Third tab on `/` and `/instructions` (`?tab=scrum-in-sdd`). Label stays `Scrum in SDD` in all locales.

**Verification**: Unit tests for both readers and the tab. Install omit for both folders. Playwright instructions 5/5. Browser check on `localhost:3040`. Ethan confirmed the `.scrum-body` heading scale on 2026-09-27.

### Guide and practices stay on the client root

**Why**: The guide and the practices are framework text. Copying them into every project makes a second copy that drifts from the pack.

**What changed**: [`framework-design.md`](./framework/framework-design.md) keeps `scrum-in-sdd.md` and `sdd-scrum-practices.md` at `{client_root}/templates/framework.sdd.works/{locale}/`. Kickoff does not copy them into the project.

**Verification**: The Framework files section and kickoff step 3 state this.

### Change log and issues log are both process files

**Why**: A finished change and an open defect are different records. One file cannot hold both without mixing them.

**What changed**: [ADR-070](./adr/ADR-070-change-log-and-issues-log.md). Process files under `artifacts_root` are the product backlog, the sprint backlog, status, the change log, and the issues log. [Spec-seeds-08](./product-backlog.md#L255) moves to Sprint 3. [Spec-seeds-13](./product-backlog.md#L258) is the issues-log seed. Sprint 3 feature-21 writes both EN starters. Sprint 5 no longer schedules the change-log seed.

**Verification**: The ADR, the Process files section in `framework-design.md`, the product-backlog rows, and Sprint 3 feature-21 agree. Sprint 5 has no change-log seed row.

### Kickoff writes the map, then copies missing seeds

**Why**: A new project has no `artifacts-map.md`. Kickoff cannot start by reading that file.

**What changed**: [`framework-design.md`](./framework/framework-design.md) states the `sdd-kickoff-project` order: ask for the product name, `artifacts_root`, locale, and module folders; write the map; copy a seed only where the target file is missing. A file that already has content is left as it is.

**Verification**: The Kickoff section states this order.

### Module engineering files use a stem

**Why**: Identical basenames such as `design.md` collide in the `@` menu when a project has more than one module. The folder is not visible in that menu until the user picks a row.

**What changed**: [`framework-design.md`](./framework/framework-design.md) names module files `{stem}-design.md`, `{stem}-stories.md`, and `{stem}-test.md`. The default stem is the folder name. A shorter stem is stored once on that module, with the three local paths. Stems are unique across modules. Paths in the map are relative to `artifacts_root`. The worked line is `web-app/app-design.md` with `stem: app`.

**Verification**: The Module engineering files section states the stem rule, the `@` reason, and the path example.

### Sprint 3 feature-20: start-project skill is sdd-kickoff-project

**Why**: The designed folder `sdd-new-project` did not match how the job kicks off an SDD project, and Ethan’s “no kickoff-project skill” line would conflict once that folder name is used.

**What changed**: Skill-03 is `sdd-kickoff-project`. Constants key stays `skill_start_project`. Practices job 2 stays Start a new project. [ADR-069](./adr/ADR-069-skill-kickoff-project.md). Living guide lists, Features catalog, mocks, and locale keys updated. Ethan and agent-design say job 2 uses only that folder. No `SKILL.md` in this row; feature-01 still writes it.

**Verification**: A search of living specs and Features markdown finds no `sdd-new-project`. `samectx-notes/` left as history.

### Sprint 3 feature-16 design: Scrum in SDD tab

**Why**: Readers need the guide next to Features without hard-coding the body.

**What changed**: [Web-portal-12](#pb-81) requirement names the third tab, cache-first files, and `GET /api/sdd/scrum-in-sdd`. Feature-16 Notes list six tasks. Design pass builds HanT plus three `src/content/scrum-in-sdd/` files, AC18, and the mockup spike. Live page stays two tabs until Ethan confirms.

**Verification**: Specs and mockup only in this entry.

## 2026-09-26

### Guide filename is scrum-in-sdd.md

**Why**: The guide’s common name is Scrum-in-SDD; the seed path still said `sdd-scrum-guide.md`, so Ethan and catalogs opened a name that did not match the artifact label.

**What changed**: EN and HanS seeds are [`scrum-in-sdd.md`](./framework/seeds/templates/EN/scrum-in-sdd.md). Living pointers (Ethan, practices, maps, process headers, Spec-seeds-02 / i18n-01, Features catalog, instruction mocks, feature-16 / Web-portal-12) use the new name. [ADR-068](./adr/ADR-068-scrum-in-sdd-filename.md). Sprint 3 feature-18 (rename) and feature-19 (portal catalog and unbuilt tab path). Dated history keeps the old name. Practices stay `sdd-scrum-practices.md`.

**Verification**: Both locale seeds exist under the new name. Ethan onboard names `scrum-in-sdd.md`. A search of living specs and Features markdown finds no `sdd-scrum-guide.md` except dated history and `samectx-notes/`.

### Pokymon sample for the artifact index

**Why**: The labeled-list decision needed a worked file, and artifact seeds do not need their own status or last-update line.

**What changed**: [`framework-design.md`](./framework/framework-design.md) records that seeds omit status and last-update. The EN seed [`artifacts-map.md`](./framework/seeds/templates/EN/artifacts-map.md) is the Pokymon Card Collection labeled list. It replaces the old table catalog.

**Verification**: The seed is a labeled list with product name, `artifacts_root`, locale, and one block per file the example project already has. No status line and no timestamp on a row.

### Artifact index is a labeled config

**Why**: The map was acting as a reading catalog. Ethan needs a short config that names the product, the artifacts root, and the files this project has.

**What changed**: [`framework-design.md`](./framework/framework-design.md) now specifies a labeled list with no tables. Header fields are product name, `artifacts_root`, and locale. There is no new-project flag in the file. Each existing artifact has a name and a workspace-relative local path. Seed paths are pack-relative and omitted when they follow `templates/{locale}/<name>`. The seed template is not rewritten yet.

**Verification**: The Artifact index section in `framework-design.md` states this shape.

### Artifact index at the workspace root

**Why**: Ethan has to find the project index before he knows whether the artifacts root is `specs` or `docs`.

**What changed**: `{workspace}/artifacts-map.md` names `artifacts_root`. The default is `specs`. The user may set `docs`. Paths in the map are relative to that folder. The filename stays `artifacts-map.md`. [`framework-design.md`](./framework/framework-design.md) moved from `templates/EN/` to `specs/framework/seeds/`.

**Verification**: The old path is gone. Live links point at `specs/framework/framework-design.md`.

### Sprint 3 feature-17: Get secret moves to Setup

**Why**: Get secret is a setup action. The Features tab is the catalog.

**What changed**: [Web-portal-13](./product-backlog.md#L388) is Sprint 3 feature-17. [ADR-067](./adr/ADR-067-get-secret-on-setup.md). The form sits after the tools table on Setup. Features has no form. Lookup behavior is unchanged. The page matches the mockup.

**Verification**: InstructionsPage unit tests (14) and Playwright instructions (4) pass. Ethan confirmed usable 2026-09-26. Browser: Setup shows Get secret after Tools; Features does not; blank and unknown names stay on Setup.

### Sprint 3 feature-16 and Sprint 15 feature-07: two new backlog items

**Why**: The instructions page needs a tab for the sdd-scrum guide. The three Features markdown files at the pack root still need a review before go-live.

**What changed**: [Web-portal-12](./product-backlog.md#L383) is Sprint 3 feature-16. [Spec-seeds-12](./product-backlog.md#L270) is Sprint 15 feature-07, before the go-live copy.

**Verification**: Backlog rows only. No page change in this entry.

### Sprint 3 feature-07: Features tab reads synced markdown

**Why**: The Features tab needed the pack’s own markdown, in three locales, without an admin editor and without copying those files onto the client.

**What changed**: `/` and `/instructions` render `#features-body` from the latest unpack, then from `src/content/features/` when that unpack has no English file. `GET /api/sdd/features` uses the same reader. Install does not copy `features.en.md`, `features.zh-Hans.md`, or `features.zh-Hant.md`. Lists in that body use a disc and sit inset from the heading.

**Verification**: Unit and API tests cover cache, Chinese cache, English fallback, package fallback, and HTML escaping. Install test omits the three files. Ethan synced commit `30cde7ac` and confirmed the page usable on 2026-09-26. `source` was `cache`.

### Sprint 3 feature-15: implementation skill is sdd-implement

**Why**: The Features catalog already called the skill `sdd-implement`. The backlog id was still `sdd-implement-feature`.

**What changed**: Skill-13 is `sdd-implement`. [ADR-066](./adr/ADR-066-sdd-design-before-implementation.md) records the rename in the same decision as `sdd-design`. Initial file: `specs/framework/seeds/skills/sdd-implement/SKILL.md`. It loads `sdd-update-specs` and `sdd-tdd` when the SBI needs them, and it stops after that SBI.

**Verification**: Living specs, Features markdown, and locale strings use `sdd-implement`. The old id remains only in the 2026-09-24 backlog history lines and in this change log.

### Sprint 3 feature-13 and feature-14: sdd-design and initial sdd-tracking

**Why**: An SBI needs a design gate before implementation. The tracking skill id existed, and the file did not.

**What changed**: [Skill-14](./product-backlog.md#L108) is `sdd-design`. [ADR-066](./adr/ADR-066-sdd-design-before-implementation.md). Initial skills are `specs/framework/seeds/skills/sdd-design/SKILL.md` and `specs/framework/seeds/skills/sdd-tracking/SKILL.md`. Practices job 6 is still unfilled. Sprint 7 still owns that section and the install check. `sdd-design` is not a practices job. Implementation stays `sdd-implement-feature`.

**Verification**: Skill lists in the guides, constants, Features markdown, locale strings, and the instructions story include `sdd-design`. Both `SKILL.md` files use a frontmatter name that matches the folder.

### Sprint 3 feature-12: status skill is sdd-tracking

**Why**: The unbuilt skill id `sdd-update-status` named one file edit. Job 6 keeps the live project picture current.

**What changed**: The skill folder is `sdd-tracking` and the constants key is `skill_tracking`. Practices job 6 stays titled Report status. [ADR-065](./adr/ADR-065-skill-update-status.md). Sprint 7 still writes the skill file.

**Verification**: A search of living specs, Features markdown, and locale strings no longer finds `sdd-update-status` or `skill_update_status`.

### Sprint 3 feature-11: ethan onboard

**Why**: The seed prompt stopped after six files. It did not say which copy to read, and it did not read the other process and tracking files named in the map.

**What changed**: Sprint 3 feature-11 updates `agents/ethan.md`. Onboard is one numbered list: read the ledger, stop when `pack_complete` is not true, then read constants, the map, the guide, the practices, and the other process and tracking files. The first existing copy wins. `adr/` and `knowledge/` stay unread. Design §2.2 and §14 match that list. Toggle A install recovery stays out of the prompt.

**Verification**: Seed and [`agent-design.md`](./framework/framework-design.md) §14 use the same eight steps. Feature-11 is WIP until the start is confirmed usable.

### Features catalog plan, and Get secret is one feature

**Why**: The Features tab should show whatever markdown the pack publishes, in three languages, and still be usable when that file cannot be loaded. Get secret’s server lookup and its button were two feature rows for one product behavior.

**What changed**: [Web-portal-07](./product-backlog.md#L377) describes the three files. The page prefers the sync cache. If that cache cannot be read, it reads `src/content/features/features.en.md`, `features.zh-Hans.md`, and `features.zh-Hant.md` from the deployed `src/` tree. There is no unavailable message. Sprint 3 feature-05 absorbs the old feature-06. feature-07 stays ToDo, with task-01 through task-06 as the build order. Stories AC12–AC16, the instructions design, the mockups, and app-test §7 record the plan. No application code in this change.

**Verification**: Spec review only. Implementation has not started.

### MCP-01 scheduled on Sprint 15

**Why**: The installer stories are Done in Sprint 2. The remaining ToDo slice is go-live, and it waits until the seed folder is finalized.

**What changed**: [MCP-01](./product-backlog.md#L318) sprint is Sprint 15. Sprint 15 feature-06 covers pack copy, GitHub Releases for the five `sdd-mcp` binaries, and admin-portal sync. Sprint 2 installer stories stay Done.

**Verification**: Product backlog sprint column, Sprint 15 feature-06, and `status.md` name Sprint 15 for that slice.

### Sprint 2 closed

**Why**: Every Sprint 2 SBI is Done. Go-live pack copy, GitHub Releases, and admin-portal sync were never Sprint 2 stories.

**What changed**: Sprint 2 status is Done. Current sprint is Sprint 3. [MCP-01](./product-backlog.md#L318) stays ToDo for the go-live slice. [ADR-064](./adr/ADR-064-e2e-must-not-wipe-seed-admin.md): Playwright must not delete the operator seed admin.

**Verification**: Sprint backlog SBI rows are Done. Retrospective recorded on the Sprint 2 section.

### Tracking cleanup

**Why**: `status.md` had copied every Sprint 2 SBI and still listed finished on-going tasks.

**What changed**: Sprint status is a projection table. Finished OGTs are removed. Sprint 2’s section heading is Done. [Agent-01](./product-backlog.md#L63) is Done with the closed Sprint 1 spike.

**Verification**: Sprint 3 remains WIP. Open SBIs are feature-01, feature-02, feature-03, and feature-07.

### Fix reset copy, Get secret layout, and local admin (WA-10 / WA-11 / WA-12)

**Why**: Previous reset sentence and Get secret layout were still wrong in application code. Local Postgres had no seed admin and leftover empty-hash Playwright rows forced set-password.

**What changed**: Restored `admin.reset.sent` without `{email}`; reset route logs skip / Resend-accepted without printing the URL. Get secret scrolls the result; found value is `.codeblock` + copy at lookup-row width. Deleted leftover `empty-*` admins; Playwright cleans up its fixture; seed created the local seed admin and keeps an existing non-empty hash. WA-10, WA-11, and WA-12 closed.

**Verification**: Unit tests for ResetPasswordPage and InstructionsPage (17 passed). Browser: reset success shows the previous sentence; Get secret not-found stays on `?tab=features`, matches lookup width, and is in view.

### Reset copy, local mail cause, Get secret layout (WA-10 / WA-11) — specs only

**Why**: Success copy must be the previous `admin.reset.sent` (no `{email}`). Local reset showed success with no inbox mail while production sent. Get secret result must scroll into view as a code block with copy at lookup-row width. Same class of bugs kept returning after “fixes.”

**What changed**: Opened WA-10 and WA-11. Restored previous sent sentences in backlog, stories, design, mockups, app-test, and Sprint 3 feature-10 / feature-06. Documented local-vs-production mail cause in [`knowledge/agent/admin-portal-seed-and-logo.md`](./knowledge/agent/admin-portal-seed-and-logo.md). Documented regression pattern in [`knowledge/agent/web-app-fix-regression.md`](./knowledge/agent/web-app-fix-regression.md).

**Verification**: Specs and mockups updated. Application code (catalog restore, logging, Get secret UI) is a later pass.

### Reset success copy and Get secret (WA-08 / WA-09)

**Why**: Reset success did not name the email and could disappear on a document GET. Get secret left Features and never showed a value or not-found.

**What changed**: Reset control is `type="button"`; `admin.reset.sent` interpolates `{email}`. Public `POST /api/sdd/secret` exact-name lookup. Features Get secret stays on `?tab=features` and shows a code block or `admin.guide.secret_missing`. WA-08 and WA-09 closed. Web-portal-11 and Web-portal-08 Done.

**Verification**: Unit ResetPasswordPage + InstructionsPage. Playwright auth + instructions (12 passed). Browser: reset names email; Get secret not-found stays on Features.

**Boundary**: Exact name only; no fuzzy match.

### Reset success copy and Get secret display (specs)

**Why**: After reset mail sends, the success callout does not name the email and can disappear on a document GET. Get secret leaves Features and never shows a value or not-found.

**What changed**: Issues WA-08 and WA-09. [Web-portal-11](./product-backlog.md#L461). Extended [Web-portal-08](./product-backlog.md#L419). Stories, design, mockups, app-test, Sprint 3 feature-10 and feature-06. Specs and mockups only.

**Verification**: Specs and mockups updated. Application code is a later pass (feature-10 then feature-06).

**Boundary**: Does not change live React or API routes in this change.

### Reset mail skipped on interactive dev (WA-07)

**Why**: Port 3040 was left with Playwright capture env. Reset returned `{ ok: true }` without Resend; the success screen kept the request lead, so the page looked unchanged and no mail arrived.

**What changed**: Skip Resend only when `E2E_SKIP_MAIL=1`. Capture paths (`E2E_RESET_FILE` / `E2E_INVITE_FILE`) name the file only. Playwright `webServer` sets the skip flag and does not reuse an existing server. Reset success hides `admin.reset.lead`. Issue WA-07 in [`issues-log.md`](./issues-log.md).

**Verification**: Unit `ResetPasswordPage` (lead hidden on success). Playwright `e2e/auth.spec.ts` + `e2e/accounts.spec.ts`. Browser reset on clean `npm run dev` (no skip flag).

**Boundary**: Does not change Resend templates or set-password token rules.

### MCP tools without sdd_list_versions (MCP-03)

**Why**: The person installs latest. `sdd_install_framework` already resolves omitted `version`. MCP has no private tool, so a registered catalog tool is a wasted round trip. Pack inventory for people is the Features tab.

**What changed**: [MCP-03](./product-backlog.md#L339) and [ADR-063](./adr/ADR-063-unregister-sdd-list-versions.md). Sprint 3 feature-08 unregisters the tool on stdio and HTTP and updates the tool-list tests. Feature-09 updates `GET /setup` (setup version `2026-09-26.v5`) and the instructions Tools table. `listVersions()` and `GET /api/sdd/versions` stay server-internal. No MCP resource.

**Verification**: `create-server.test.ts`, `local-binary.test.ts`, `InstructionsPage.test.tsx`, `sdd-api.test.ts`, `list-versions.test.ts`. Ethan confirmed both stories usable on 2026-09-26.

**Boundary**: Does not delete `listVersions()`. Does not rebuild `~/.sdd/sdd-mcp`. The placed binary stays on the previous tool list until `npm run mcp:build` and `npm run mcp:place`.

### Reset submit and Features tab (Web-portal-10)

**Why**: Reset mail submit reloaded the form with no success or error. The Features tab on the instructions guide did not open the features panel.

**What changed**: [Web-portal-10](./product-backlog.md#L458). Issues WA-05–WA-06. Reset stays on `/reset-password` with success callout or keyed error. Features tabs sit above the hero hit area. Mockup reset form intercepts submit.

**Verification**: Stories, design, tests, mockups. Unit: `ResetPasswordPage` + `InstructionsPage`. Playwright `e2e/auth.spec.ts` + `e2e/instructions.spec.ts` (11 passed). Browser: Features selects panel; reset stays on `/reset-password` with success callout. WA-05–WA-06 closed in [`issues-log.md`](./issues-log.md).

**Boundary**: Does not implement secret lookup (feature-05 / feature-06).

### Web-app UI fixes (Web-portal-09)

**Why**: `/` still showed the logo-card home. Footer scrolled away. Reset success linked to home. Accounts with a password stayed on the empty-account set-password screen.

**What changed**: [Web-portal-09](./product-backlog.md#L430). Issues WA-01–WA-04 in [`issues-log.md`](./issues-log.md). `/` serves the instructions guide. Footer is fixed. Reset success uses Back to login. Set-password redirects when `passwordHash` is already set. E2E setup does not overwrite an existing seed password hash.

**Verification**: Stories, design, tests, mockups. Unit: `ResetPasswordPage` + `InstructionsPage`. Playwright `e2e/auth.spec.ts` + `e2e/instructions.spec.ts` (10 passed). WA-01–WA-04 closed in [`issues-log.md`](./issues-log.md).

**Boundary**: Does not implement secret lookup (feature-05 / feature-06).

### Sprint 3 feature-04 — secret form design

**Why**: Feature-04 is the Features-tab form chrome for [Web-portal-08](./product-backlog.md#L419). The sprint row named 繁體 without writing the strings. Stories, design, and tests needed enough coverage before implementation.

**What changed**: [`app-stories.md`](./admin-portal/app-stories.md) AC7 covers placement, three locale strings, Setup-tab absence, and inert submit. [`app-design.md`](./admin-portal/app-design.md) `/instructions` specifies the form layout, keys, CSS sizes, and reserves result nodes for feature-06. [`app-test.md`](./admin-portal/app-tests.md) adds unit and E2E cases. Sprint 3 feature-04 and [Web-portal-08](./product-backlog.md#L419) name the 繁體 hint and button.

**Verification**: Specs only. Catalog already in `messages/{en,zh-Hans,zh-Hant}.json` and mock [`13-instructions.html`](./admin-portal/ui-mockup/13-instructions.html).

**Boundary**: No UI code in this pass. Feature-05 owns the lookup. Feature-06 owns showing a value or not-found. Status stays ToDo until implementation.

## 2026-09-25

### Spec-seeds-01 constants.md confirmed

**Why**: Sprint 2 feature-04. Pack lookup needs a confirmed seed on the client root.

**What changed**: Spec-seeds-01 and Sprint 2 feature-04 are Done. User confirmed the seed and practices writing guidance. Cross-review: seed, practices, ADR-060, and ethan/agent links match. Filename is `constants.md`; not copied into workspace `specs/`.

**Verification**: User confirmed 2026-09-25. Seed at [`templates/constants.md`](./framework/seeds/templates/constants.md).

**Boundary**: Go-live pack copy stays separate. Does not close Sprint 2.

### Local binary ~/.sdd/sdd-mcp (MCP-02)

**Why**: The setup prompt named `~/.sdd/sdd-mcp`, and no Product Backlog row owned building that program. Agent tools block downloading an executable from the network.

**What changed**: [MCP-02](./product-backlog.md#L328) is Sprint 2 feature-14. `npm run mcp:build` compiles five OS/arch targets. `npm run mcp:place` copies the host file to `~/.sdd/sdd-mcp`. The stdio entry uses `createStdioMcpServer` so Prisma stays out of the binary. `GET /setup` starts that local file when present and does not download an executable. `npm run mcp:stdio` stays the contributor entry.

**Verification**: [`mcp/mcp-stories.md`](./mcp/mcp-stories.md) `sdd-mcp-local-binary`; [`src/mcp/local-binary.test.ts`](../src/mcp/local-binary.test.ts); `/setup` tests in [`sdd-api.test.ts`](../src/app/api/sdd/sdd-api.test.ts). Host binary placed at `~/.sdd/sdd-mcp`. Ethan confirmed usable from TRAE CN on 2026-09-26 (`tools/list` + `sdd_list_versions` against local `SDD_SERVER_URL`).

**Boundary**: GitHub Release upload is not this story.

### Instructions page re-design (feature-10)

**Why**: Sprint 2 [Web-portal-05](./product-backlog.md#L363). The public instructions page must match the Setup / Features mock after the stdio transport change. The old PBI title (“shows the ethan prompt”) was wrong.

**What changed**: PBI and SBI renamed to Instructions page re-design. `/instructions` gains Setup and Features tabs, the one-line `/setup` copy, one stdio `mcp.json`, a fixed Features catalog, and an inert secret form. Pack `features.md` sync and live secret lookup stay later items.

**Verification**: [`app-stories.md`](./admin-portal/app-stories.md) AC1, AC5, AC6; [`InstructionsPage.test.tsx`](../src/components/features/InstructionsPage.test.tsx); mock [`01-home.html`](./admin-portal/ui-mockup/01-home.html). User confirmed usable 2026-09-25.

**Boundary**: Does not implement [Web-portal-07](./product-backlog.md#L377) or [Web-portal-08](./product-backlog.md#L419) live lookup. Does not change `GET /setup` (backend-01).

### Instructions page looks up one secret (Web-portal-08)

**Why**: `sdd_get_key` is HTTP-only, so the stdio setup path cannot return a secret without a token in `mcp.json`. The lookup moves to the instructions page. The one-line setup prompt stays without a key.

**What changed**: [Web-portal-08](./product-backlog.md#L419) is Sprint 3 feature-04, feature-05, and feature-06. The Features tab mock has a name field and a Get secret button after the template list. A click in the mock shows a stand-in value. The live lookup is Sprint 3.

**Verification**: Product backlog row, Sprint 3 rows, and [`01-home.html`](./admin-portal/ui-mockup/01-home.html).

**Boundary**: No new admin token system. Stdio does not gain `sdd_get_key`. The setup prompt does not embed `MCP_AUTH_TOKEN`.

### Setup prompt URL is /setup (ADR-061)

**Why**: The instructions page keeps one paste sentence. The stdio contract stays in the markdown that sentence fetches. The public path should be `https://framework.sdd.works/setup`. Manual setup is one `mcp.json`.

**What changed**: [ADR-061](./adr/ADR-061-setup-prompt-public-path.md). Paste text is `Fetch and execute the setup instructions from https://framework.sdd.works/setup`. `GET /agent-setup` redirects to `GET /setup`. Source file stays `public/agent-setup/prompt.md`. Manual setup shows the `command` entry only. No second HTTP `mcp.json` and no `curl | sh` on that section. Feature-11 owns the page copy sentence. `backend-01` owns the public `/setup` route and redirect. Feature-12 owns the single sample. Feature-13 tests both.

**Verification**: ADR-061, [`mcp-design.md`](./mcp/mcp-design.md) §2.1, [`app-design.md`](./admin-portal/app-design.md) `/instructions`, [`app-stories.md`](./admin-portal/app-stories.md) AC3 and AC4, sprint feature-11–13 and `backend-01`, and the instructions mockup. The app route is not changed in this pass.

**Boundary**: HTTP fallback stays inside the fetched markdown. Terminal install stays in go-live. Closed Phase 1 snapshots that still say `/agent-setup` stay as history.

### Sprint 2 backend-01; Features tab to Sprint 3

**Why**: The one-line pastes needs a Backend SBI for the route that connects agent tools to MCP. The Features tab is not required to close Sprint 2.

**What changed**: Sprint 2 `backend-01` (Module MCP, Type Backend): one-line prompt automatically connects agent tools to MCP. [Web-portal-07](./product-backlog.md#L377) moved to Sprint 3 as feature-07.

**Verification**: [`sprint-backlog.md`](./sprint-backlog.md) Sprint 2 and Sprint 3. Product backlog Sprint column for pb-73 is Sprint 3.

### Features tab reads pack features.md (Web-portal-07)

**Why**: The Features list should change with the pack, using the sync cache that already updates on manual sync and every 30 minutes. An admin editor would be a second store.

**What changed**: [Web-portal-07](./product-backlog.md#L377) is Sprint 3 feature-07 (moved from Sprint 2). `features.md` at the pack root is the catalog. The public Features tab reads it from `.data/sdd-packages/<commit>/`. Four headings only: Agents, Skills, Rules, Templates. Each row is `name: sentence`. No admin editor and no parsed sidecar. Install does not copy the file onto `{client_root}`.

**Verification**: Product backlog row and Sprint 3 feature-07. Not implemented.

**Boundary**: Page chrome stays i18n keys. Sentences stay in the language of `features.md`.

### Instructions page becomes the public landing page (feature-10)

**Why**: Sprint 2 [Web-portal-05](./product-backlog.md#L363). The public site should open on install instructions. The old paste prompt and WoodenSward Dojo tools intro no longer match stdio-primary setup (ADR-058) or the ethan ledger gate.

**What changed** (requirement; live site not implemented in this pass). The paste sentence and the manual `mcp.json` in the bullets below are superseded by [ADR-061](./adr/ADR-061-setup-prompt-public-path.md) in the entry above:

- `/` is the instructions page. The logo-card home goes away. There is no Back to home link.
- Two tabs: **Setup** and **Features**.
- Remove the “Paste this prompt…” body, the “Paste this prompt” label, and the fetch-`/agent-setup` code block.
- Copy button and manual setup use a connect prompt with local `sdd-mcp` (`command` + `SDD_SERVER_URL`) first and HTTP `"url": "https://framework.sdd.works/mcp"` as fallback. Manual setup shows the command block first and the URL block as fallback. The terminal `curl | sh` block stays.
- Remove the Tools intro that mentions WoodenSward Dojo. Tools table drops the Channel column. Install description: “Install agents, skills, rules, and other capabilities from framework.sdd.works.” Update description: “Update the framework.”
- Body text and code blocks share one content width.
- Footer, right edge aligned to that column: Admin portal link, then `copyright © Ethan Huang`.
- Features tab lists only Agents, Skills, Rules, and Templates from [`sdd-scrum-guide.md`](./framework/seeds/templates/EN/sdd-scrum-guide.md) lines 314–349 (Artifacts map to Templates). Workflows and Knowledge are omitted. Each row is a name and one sentence.

**Verification**: UI mock at [`admin-portal/ui-mockup/01-home.html`](./admin-portal/ui-mockup/01-home.html) and [`13-instructions.html`](./admin-portal/ui-mockup/13-instructions.html). User confirms the mock before app implementation.

**Boundary**: Does not change `src/` or the live site. Per-client call-up research stays Sprint 13.

### Pack lookup renamed to constants.md

**Why**: The lookup file was named `project-constants.md`, which suggested a workspace copy under `specs/`. Ethan must read one pack file on the client root.

**What changed**: Filename is `constants.md`. Authoring seed is `specs/framework/seeds/templates/constants.md`. Live path is `{client_root}/templates/framework.sdd.works/constants.md`. Not copied into the workspace or into `specs/`. [ADR-060](./adr/ADR-060-constants-on-client-root.md). Writing guidance is under Templates in the EN practices. Spec-seeds-01, ethan, agent specs, MCP ledger examples, and the install fixture name the new file.

**Verification**: Grep for `project-constants` under live specs only hits ADR-056 and ADR-060 historical notes. Seed file exists at `templates/constants.md`.

**Boundary**: User review of the seed and seed-tree cross-review stay open on Sprint 2 feature-04. Does not implement portal UI.

### Sprint 1 closed

**Why**: The EN guide and practices seeds were confirmed. The archive path still said `phase1-specs/`.

**What changed**: Sprint 1 feature-01 and documentation-01 are Done. Spec-seeds-02 and Spec-seeds-03 are Done. Phase 1 archive links point at [`phase1-process-specs/`](./phase1-process-specs/). Sprint 1 status is Done. Next is Sprint 2.

**Verification**: Every Sprint 1 SBI is Done. Seed files are under `templates/EN/`. No remaining `phase1-specs/` path under live `specs/`.

**Boundary**: Does not add `constants.md`, `.secrets`, or HanS/HanT translations. Does not implement the installer.

## 2026-09-24

### Every product item has a sprint row

**Why**: `.secrets` is named in the guide and had no product item. Change-log, architecture, and deployment seeds had no sprint. Spec-01 and the remaining locale copies of the guide and practices had no sprint row.

**What changed**: [Spec-seeds-11](./product-backlog.md#L270) is the `.secrets` seed (the guide spelling). [Spec-seeds-08](./product-backlog.md#L255) is Sprint 5. [Spec-seeds-09](./product-backlog.md#L266), [Spec-seeds-10](./product-backlog.md#L268), and Spec-seeds-11 are Sprint 14. Sprint 1 records Spec-01 and the open HanT guide and HanS/HanT practices copies.

**Verification**: Each PBI code in `product-backlog.md` appears as a parent on at least one sprint row. No product row has an empty Sprint cell.

**Boundary**: Does not write the `.secrets` file or copy secret values.

### Sprint item columns and one retrospective per sprint

**Why**: Sprint rows used `#` and Category. A second retrospective in the same sprint was a second section.

**What changed**: Sprint tables use Code, Parent PBI, Module, Type, SBI. Code is the type plus a number, such as `feature-01`. A seed is a Feature. Research, Bug-fix, and Documentation are the other named types. Task is supporting work that is none of those. An SBI and a PBI status is only `ToDo`, `WIP`, or `Done`. Apply the Definition of Done rule before `Done`. Parent PBI shows the code and the name. The product backlog column stays Category. One Retrospective section per sprint, with timestamped Learnings and Opportunities. Shape: [`framework/framework-design.md`](./framework/framework-design.md). Same-category product rows: [`framework/seeds/templates/EN/sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) §3.1.

**Verification**: Live and seed `sprint-backlog.md` use the new columns. No second Retrospective heading in Sprint 1.

**Boundary**: Does not implement the installer or call `/ethan`.

## 2026-09-22

### Artifact taxonomy: guide vs practices; process / tracking / knowledge / optional

**Why**: Live pointers still said practices were “columns only.” The guide and map mixed process, tracking, and knowledge. Seeds under `.cursor/templates/` would reinstall that story.

**What changed**: [`sdd-scrum-guide.md`](./sdd-scrum-guide.md) names process, tracking, knowledge, and optional/JIT artifacts, plus seeds vs working copies. [`sdd-scrum-practices.md`](./sdd-scrum-practices.md) owns eight jobs and Templates (what/how/when). [`artifacts-map.md`](./artifacts-map.md) regroups by those categories. Sprint/product AC (`s2-guide`, pb-8), architecture/deployment headers, and agent-design/test pointers aligned. EN and HanS templates updated to match.

**Verification**: Map has Framework / Process / Tracking / Knowledge / Optional / This product sections. No remaining “writing conventions only” claim in live headers. Historical entries below keep their original wording.

**Boundary**: Does not fill remaining MVP 1 terms or implement Coach MVP 1.

### Rename agent-ethan folder and sprint-backlog file

**Why**: Shorter agent design path; the execution file is the Sprint Backlog, not a separate “plan” filename.

**What changed**: `specs/agent-coach-ethan/` → [`specs/agent-ethan/`](./agent-ethan/). Live and EN-template `sprint-plan.md` → [`sprint-backlog.md`](./sprint-backlog.md). Links in process docs retargeted. HanS template still uses `sprint_plan.md` until that pack is aligned.

**Verification**: No remaining `agent-coach-ethan` or `sprint-plan.md` paths under live `specs/` (Phase 1 `sprintN-plan.md` archive names unchanged).

**Boundary**: Does not implement the coach prompt or fill the Scrum guide.

### coach-ethan presence: local Cursor agent

**Why**: The coach must edit project specs, call Cursor skills, chat, and AskQuestion. Remote MCP cannot own the user’s `specs/` folder.

**What changed**: [`framework/framework-design.md`](./framework/framework-design.md) records presence, jobs, knowledge loading, and MVP capabilities. [D1](./sprint-backlog.md#rid-d1) is Closed (local Cursor agent). [`architecture.md`](./architecture.md) §2, [`artifacts-map.md`](./artifacts-map.md), and coach rows in [`product-backlog.md`](./product-backlog.md) point at that design.

**Verification**: Design file states local agent and non-goals. RID D1 status is Closed. No agent prompt file and no skill implementation in this change.

**Boundary**: This does not implement the coach prompt, fill the Scrum guide, or build process skills.

### Three MVPs for sdd-scrum-guide and coach-ethan

**Why**: The framework definition and the coach were one wide backlog row each. Feasibility needs small, complete loops of guide plus coach.

**What changed**: [`sdd-scrum-guide.md`](./sdd-scrum-guide.md) is the framework SSOT (stub sections). [`sdd-scrum-practices.md`](./sdd-scrum-practices.md) stays writing conventions only. coach-ethan is a parent with MVP 1–3 (pb-8–10) on Sprint 2–4. Install, templates, full skills, and Instructions leave the current sprint. D1 notes that local Cursor agent is the feasibility path; MCP is undecided.

**Verification**: Sprint 2 has guide + coach MVP 1 rows. Sprint 3 and 4 exist for MVP 2 and 3. pb-2, pb-4, pb-6, pb-7 have empty Sprint. No agent prompt body and no guide prose beyond stubs.

**Boundary**: This does not implement the coach, the `plan` skill, or fill the guide.

## 2026-09-21

### Phase 2 backlog split into install, practices, templates, skills, coach-ethan, and Instructions

**Why**: One coach item and a wide template list hid the practices file, the six process skills, and the Instructions page. coach-ethan presence was being treated as already chosen.

**What changed**: [`product-backlog.md`](./product-backlog.md) now has PRACTICES-01, SKILLS-01, and INSTRUCT-01. TEMPLATES-01 is the four process files only. COACH-01 is coach-ethan (prompt, spike, presence TBD). Sprint 2 lists those stories as ToDo. [D1](./sprint-backlog.md#rid-d1) records the MCP-vs-local dependency as Pending.

**Verification**: Each new requirement in the backlog overview has a backlog row (pb-2 through pb-7). Sprint 2 has a matching ToDo row. No application code, skill files, or Instructions UI were changed.

**Boundary**: This does not implement install, write `sdd-scrum-practices.md` as the Scrum framework, or pick MCP vs local.

### Phase 2 specs use the new process shape

**Why**: Phase 1 Scrum files and the copied sample product cannot both be the live backlog. Phase 2 needs process files that can take new stories.

**What changed**: Phase 1 Scrum files stay archived under [`phase1-process-specs/`](./phase1-process-specs/). Live [`product-backlog.md`](./product-backlog.md), [`sprint-backlog.md`](./sprint-backlog.md), and [`artifacts-map.md`](./artifacts-map.md) now describe framework.sdd.works Phase 2 only (SPEC-01 done; ARTIFACTS-01, COACH-01, TEMPLATES-01 not started). Earlier portal and MCP entries were removed from this log.

**Verification**: Live process files contain no sample-product rows. `*-old.md` copies are deleted. Links among backlog, sprint backlog, and artifacts map resolve.

**Boundary**: This does not change application code, install scope, or the Phase 1 archive contents.
