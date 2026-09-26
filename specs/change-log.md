# Change log (framework.sdd.works)

> This file records conclusion-level changes for Phase 2: what changed, why, and how it was verified.
> Step-by-step detail stays in `git log` and in each spec. This file does not replace any spec.
> **Scope**: [`product-backlog.md`](./product-backlog.md) · [`sprint-backlog.md`](./sprint-backlog.md) · [`artifacts-map.md`](./artifacts-map.md) · [`framework.seeds/templates/EN/sdd-scrum-practices.md`](./framework.seeds/templates/EN/sdd-scrum-practices.md) · [`framework.seeds/templates/EN/sdd-scrum-guide.md`](./framework.seeds/templates/EN/sdd-scrum-guide.md) · [`agent-ethan/agent-design.md`](./agent-ethan/agent-design.md)
> Phase 1 history stays in git and [`phase1-process-specs/`](./phase1-process-specs/). Do not put secrets here.

---

## 2026-09-26

### Sprint 2 closed

**Why**: Every Sprint 2 SBI is Done. Go-live pack copy, GitHub Releases, and admin-portal sync were never Sprint 2 stories.

**What changed**: Sprint 2 status is Done. Current sprint is Sprint 3. [MCP-01](./product-backlog.md#pb-16) stays ToDo for the go-live slice. [ADR-064](./adr/ADR-064-e2e-must-not-wipe-seed-admin.md): Playwright must not delete the operator seed admin.

**Verification**: Sprint backlog SBI rows are Done. Retrospective recorded on the Sprint 2 section.

### Tracking cleanup

**Why**: `status.md` had copied every Sprint 2 SBI and still listed finished on-going tasks.

**What changed**: Sprint status is a projection table. Finished OGTs are removed. Sprint 2’s section heading is Done. [Agent-01](./product-backlog.md#pb-6) is Done with the closed Sprint 1 spike.

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

**What changed**: Issues WA-08 and WA-09. [Web-portal-11](./product-backlog.md#pb-79). Extended [Web-portal-08](./product-backlog.md#pb-74). Stories, design, mockups, app-test, Sprint 3 feature-10 and feature-06. Specs and mockups only.

**Verification**: Specs and mockups updated. Application code is a later pass (feature-10 then feature-06).

**Boundary**: Does not change live React or API routes in this change.

### Reset mail skipped on interactive dev (WA-07)

**Why**: Port 3040 was left with Playwright capture env. Reset returned `{ ok: true }` without Resend; the success screen kept the request lead, so the page looked unchanged and no mail arrived.

**What changed**: Skip Resend only when `E2E_SKIP_MAIL=1`. Capture paths (`E2E_RESET_FILE` / `E2E_INVITE_FILE`) name the file only. Playwright `webServer` sets the skip flag and does not reuse an existing server. Reset success hides `admin.reset.lead`. Issue WA-07 in [`issues-log.md`](./issues-log.md).

**Verification**: Unit `ResetPasswordPage` (lead hidden on success). Playwright `e2e/auth.spec.ts` + `e2e/accounts.spec.ts`. Browser reset on clean `npm run dev` (no skip flag).

**Boundary**: Does not change Resend templates or set-password token rules.

### MCP tools without sdd_list_versions (MCP-03)

**Why**: The person installs latest. `sdd_install_framework` already resolves omitted `version`. MCP has no private tool, so a registered catalog tool is a wasted round trip. Pack inventory for people is the Features tab.

**What changed**: [MCP-03](./product-backlog.md#pb-78) and [ADR-063](./adr/ADR-063-unregister-sdd-list-versions.md). Sprint 3 feature-08 unregisters the tool on stdio and HTTP and updates the tool-list tests. Feature-09 updates `GET /setup` (setup version `2026-09-26.v5`) and the instructions Tools table. `listVersions()` and `GET /api/sdd/versions` stay server-internal. No MCP resource.

**Verification**: `create-server.test.ts`, `local-binary.test.ts`, `InstructionsPage.test.tsx`, `sdd-api.test.ts`, `list-versions.test.ts`. Ethan confirmed both stories usable on 2026-09-26.

**Boundary**: Does not delete `listVersions()`. Does not rebuild `~/.sdd/sdd-mcp`. The placed binary stays on the previous tool list until `npm run mcp:build` and `npm run mcp:place`.

### Reset submit and Features tab (Web-portal-10)

**Why**: Reset mail submit reloaded the form with no success or error. The Features tab on the instructions guide did not open the features panel.

**What changed**: [Web-portal-10](./product-backlog.md#pb-77). Issues WA-05–WA-06. Reset stays on `/reset-password` with success callout or keyed error. Features tabs sit above the hero hit area. Mockup reset form intercepts submit.

**Verification**: Stories, design, tests, mockups. Unit: `ResetPasswordPage` + `InstructionsPage`. Playwright `e2e/auth.spec.ts` + `e2e/instructions.spec.ts` (11 passed). Browser: Features selects panel; reset stays on `/reset-password` with success callout. WA-05–WA-06 closed in [`issues-log.md`](./issues-log.md).

**Boundary**: Does not implement secret lookup (feature-05 / feature-06).

### Web-app UI fixes (Web-portal-09)

**Why**: `/` still showed the logo-card home. Footer scrolled away. Reset success linked to home. Accounts with a password stayed on the empty-account set-password screen.

**What changed**: [Web-portal-09](./product-backlog.md#pb-76). Issues WA-01–WA-04 in [`issues-log.md`](./issues-log.md). `/` serves the instructions guide. Footer is fixed. Reset success uses Back to login. Set-password redirects when `passwordHash` is already set. E2E setup does not overwrite an existing seed password hash.

**Verification**: Stories, design, tests, mockups. Unit: `ResetPasswordPage` + `InstructionsPage`. Playwright `e2e/auth.spec.ts` + `e2e/instructions.spec.ts` (10 passed). WA-01–WA-04 closed in [`issues-log.md`](./issues-log.md).

**Boundary**: Does not implement secret lookup (feature-05 / feature-06).

### Sprint 3 feature-04 — secret form design

**Why**: Feature-04 is the Features-tab form chrome for [Web-portal-08](./product-backlog.md#pb-74). The sprint row named 繁體 without writing the strings. Stories, design, and tests needed enough coverage before implementation.

**What changed**: [`app-stories.md`](./admin-portal/app-stories.md) AC7 covers placement, three locale strings, Setup-tab absence, and inert submit. [`app-design.md`](./admin-portal/app-design.md) `/instructions` specifies the form layout, keys, CSS sizes, and reserves result nodes for feature-06. [`app-test.md`](./admin-portal/app-test.md) adds unit and E2E cases. Sprint 3 feature-04 and [Web-portal-08](./product-backlog.md#pb-74) name the 繁體 hint and button.

**Verification**: Specs only. Catalog already in `messages/{en,zh-Hans,zh-Hant}.json` and mock [`13-instructions.html`](./admin-portal/ui-mockup/13-instructions.html).

**Boundary**: No UI code in this pass. Feature-05 owns the lookup. Feature-06 owns showing a value or not-found. Status stays ToDo until implementation.

## 2026-09-25

### Spec-seeds-01 constants.md confirmed

**Why**: Sprint 2 feature-04. Pack lookup needs a confirmed seed on the client root.

**What changed**: Spec-seeds-01 and Sprint 2 feature-04 are Done. User confirmed the seed and practices writing guidance. Cross-review: seed, practices, ADR-060, and ethan/agent links match. Filename is `constants.md`; not copied into workspace `specs/`.

**Verification**: User confirmed 2026-09-25. Seed at [`templates/constants.md`](./framework.seeds/templates/constants.md).

**Boundary**: Go-live pack copy stays separate. Does not close Sprint 2.

### Local binary ~/.sdd/sdd-mcp (MCP-02)

**Why**: The setup prompt named `~/.sdd/sdd-mcp`, and no Product Backlog row owned building that program. Agent tools block downloading an executable from the network.

**What changed**: [MCP-02](./product-backlog.md#pb-75) is Sprint 2 feature-14. `npm run mcp:build` compiles five OS/arch targets. `npm run mcp:place` copies the host file to `~/.sdd/sdd-mcp`. The stdio entry uses `createStdioMcpServer` so Prisma stays out of the binary. `GET /setup` starts that local file when present and does not download an executable. `npm run mcp:stdio` stays the contributor entry.

**Verification**: [`mcp/mcp-stories.md`](./mcp/mcp-stories.md) `sdd-mcp-local-binary`; [`src/mcp/local-binary.test.ts`](../src/mcp/local-binary.test.ts); `/setup` tests in [`sdd-api.test.ts`](../src/app/api/sdd/sdd-api.test.ts). Host binary placed at `~/.sdd/sdd-mcp`. Ethan confirmed usable from TRAE CN on 2026-09-26 (`tools/list` + `sdd_list_versions` against local `SDD_SERVER_URL`).

**Boundary**: GitHub Release upload is not this story.

### Instructions page re-design (feature-10)

**Why**: Sprint 2 [Web-portal-05](./product-backlog.md#pb-71). The public instructions page must match the Setup / Features mock after the stdio transport change. The old PBI title (“shows the ethan prompt”) was wrong.

**What changed**: PBI and SBI renamed to Instructions page re-design. `/instructions` gains Setup and Features tabs, the one-line `/setup` copy, one stdio `mcp.json`, a fixed Features catalog, and an inert secret form. Pack `features.md` sync and live secret lookup stay later items.

**Verification**: [`app-stories.md`](./admin-portal/app-stories.md) AC1, AC5, AC6; [`InstructionsPage.test.tsx`](../src/components/features/InstructionsPage.test.tsx); mock [`01-home.html`](./admin-portal/ui-mockup/01-home.html). User confirmed usable 2026-09-25.

**Boundary**: Does not implement [Web-portal-07](./product-backlog.md#pb-73) or [Web-portal-08](./product-backlog.md#pb-74) live lookup. Does not change `GET /setup` (backend-01).

### Instructions page looks up one secret (Web-portal-08)

**Why**: `sdd_get_key` is HTTP-only, so the stdio setup path cannot return a secret without a token in `mcp.json`. The lookup moves to the instructions page. The one-line setup prompt stays without a key.

**What changed**: [Web-portal-08](./product-backlog.md#pb-74) is Sprint 3 feature-04, feature-05, and feature-06. The Features tab mock has a name field and a Get secret button after the template list. A click in the mock shows a stand-in value. The live lookup is Sprint 3.

**Verification**: Product backlog row, Sprint 3 rows, and [`01-home.html`](./admin-portal/ui-mockup/01-home.html).

**Boundary**: No new admin token system. Stdio does not gain `sdd_get_key`. The setup prompt does not embed `MCP_AUTH_TOKEN`.

### Setup prompt URL is /setup (ADR-061)

**Why**: The instructions page keeps one paste sentence. The stdio contract stays in the markdown that sentence fetches. The public path should be `https://framework.sdd.works/setup`. Manual setup is one `mcp.json`.

**What changed**: [ADR-061](./adr/ADR-061-setup-prompt-public-path.md). Paste text is `Fetch and execute the setup instructions from https://framework.sdd.works/setup`. `GET /agent-setup` redirects to `GET /setup`. Source file stays `public/agent-setup/prompt.md`. Manual setup shows the `command` entry only. No second HTTP `mcp.json` and no `curl | sh` on that section. Feature-11 owns the page copy sentence. `backend-01` owns the public `/setup` route and redirect. Feature-12 owns the single sample. Feature-13 tests both.

**Verification**: ADR-061, [`mcp-design.md`](./mcp/mcp-design.md) §2.1, [`app-design.md`](./admin-portal/app-design.md) `/instructions`, [`app-stories.md`](./admin-portal/app-stories.md) AC3 and AC4, sprint feature-11–13 and `backend-01`, and the instructions mockup. The app route is not changed in this pass.

**Boundary**: HTTP fallback stays inside the fetched markdown. Terminal install stays in go-live. Closed Phase 1 snapshots that still say `/agent-setup` stay as history.

### Sprint 2 backend-01; Features tab to Sprint 3

**Why**: The one-line pastes needs a Backend SBI for the route that connects agent tools to MCP. The Features tab is not required to close Sprint 2.

**What changed**: Sprint 2 `backend-01` (Module MCP, Type Backend): one-line prompt automatically connects agent tools to MCP. [Web-portal-07](./product-backlog.md#pb-73) moved to Sprint 3 as feature-07.

**Verification**: [`sprint-backlog.md`](./sprint-backlog.md) Sprint 2 and Sprint 3. Product backlog Sprint column for pb-73 is Sprint 3.

### Features tab reads pack features.md (Web-portal-07)

**Why**: The Features list should change with the pack, using the sync cache that already updates on manual sync and every 30 minutes. An admin editor would be a second store.

**What changed**: [Web-portal-07](./product-backlog.md#pb-73) is Sprint 3 feature-07 (moved from Sprint 2). `features.md` at the pack root is the catalog. The public Features tab reads it from `.data/sdd-packages/<commit>/`. Four headings only: Agents, Skills, Rules, Templates. Each row is `name: sentence`. No admin editor and no parsed sidecar. Install does not copy the file onto `{client_root}`.

**Verification**: Product backlog row and Sprint 3 feature-07. Not implemented.

**Boundary**: Page chrome stays i18n keys. Sentences stay in the language of `features.md`.

### Instructions page becomes the public landing page (feature-10)

**Why**: Sprint 2 [Web-portal-05](./product-backlog.md#pb-71). The public site should open on install instructions. The old paste prompt and WoodenSward Dojo tools intro no longer match stdio-primary setup (ADR-058) or the ethan ledger gate.

**What changed** (requirement; live site not implemented in this pass). The paste sentence and the manual `mcp.json` in the bullets below are superseded by [ADR-061](./adr/ADR-061-setup-prompt-public-path.md) in the entry above:

- `/` is the instructions page. The logo-card home goes away. There is no Back to home link.
- Two tabs: **Setup** and **Features**.
- Remove the “Paste this prompt…” body, the “Paste this prompt” label, and the fetch-`/agent-setup` code block.
- Copy button and manual setup use a connect prompt with local `sdd-mcp` (`command` + `SDD_SERVER_URL`) first and HTTP `"url": "https://framework.sdd.works/mcp"` as fallback. Manual setup shows the command block first and the URL block as fallback. The terminal `curl | sh` block stays.
- Remove the Tools intro that mentions WoodenSward Dojo. Tools table drops the Channel column. Install description: “Install agents, skills, rules, and other capabilities from framework.sdd.works.” Update description: “Update the framework.”
- Body text and code blocks share one content width.
- Footer, right edge aligned to that column: Admin portal link, then `copyright © Ethan Huang`.
- Features tab lists only Agents, Skills, Rules, and Templates from [`sdd-scrum-guide.md`](./framework.seeds/templates/EN/sdd-scrum-guide.md) lines 314–349 (Artifacts map to Templates). Workflows and Knowledge are omitted. Each row is a name and one sentence.

**Verification**: UI mock at [`admin-portal/ui-mockup/01-home.html`](./admin-portal/ui-mockup/01-home.html) and [`13-instructions.html`](./admin-portal/ui-mockup/13-instructions.html). User confirms the mock before app implementation.

**Boundary**: Does not change `src/` or the live site. Per-client call-up research stays Sprint 13.

### Pack lookup renamed to constants.md

**Why**: The lookup file was named `project-constants.md`, which suggested a workspace copy under `specs/`. Ethan must read one pack file on the client root.

**What changed**: Filename is `constants.md`. Authoring seed is `specs/framework.seeds/templates/constants.md`. Live path is `{client_root}/templates/framework.sdd.works/constants.md`. Not copied into the workspace or into `specs/`. [ADR-060](./adr/ADR-060-constants-on-client-root.md). Writing guidance is under Templates in the EN practices. Spec-seeds-01, ethan, agent specs, MCP ledger examples, and the install fixture name the new file.

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

**What changed**: [Spec-seeds-11](./product-backlog.md#pb-66) is the `.secrets` seed (the guide spelling). [Spec-seeds-08](./product-backlog.md#pb-39) is Sprint 5. [Spec-seeds-09](./product-backlog.md#pb-40), [Spec-seeds-10](./product-backlog.md#pb-41), and Spec-seeds-11 are Sprint 14. Sprint 1 records Spec-01 and the open HanT guide and HanS/HanT practices copies.

**Verification**: Each PBI code in `product-backlog.md` appears as a parent on at least one sprint row. No product row has an empty Sprint cell.

**Boundary**: Does not write the `.secrets` file or copy secret values.

### Sprint item columns and one retrospective per sprint

**Why**: Sprint rows used `#` and Category. A second retrospective in the same sprint was a second section.

**What changed**: Sprint tables use Code, Parent PBI, Module, Type, SBI. Code is the type plus a number, such as `feature-01`. A seed is a Feature. Research, Bug-fix, and Documentation are the other named types. Task is supporting work that is none of those. An SBI and a PBI status is only `ToDo`, `WIP`, or `Done`. Apply the Definition of Done rule before `Done`. Parent PBI shows the code and the name. The product backlog column stays Category. One Retrospective section per sprint, with timestamped Learnings and Opportunities. Shape: [`framework.seeds/templates/EN/framework-design.md`](./framework.seeds/templates/EN/framework-design.md). Same-category product rows: [`framework.seeds/templates/EN/sdd-scrum-practices.md`](./framework.seeds/templates/EN/sdd-scrum-practices.md) §3.1.

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

**What changed**: [`agent-ethan/agent-design.md`](./agent-ethan/agent-design.md) records presence, jobs, knowledge loading, and MVP capabilities. [D1](./sprint-backlog.md#rid-d1) is Closed (local Cursor agent). [`architecture.md`](./architecture.md) §2, [`artifacts-map.md`](./artifacts-map.md), and coach rows in [`product-backlog.md`](./product-backlog.md) point at that design.

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
