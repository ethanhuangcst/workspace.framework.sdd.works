# sprint-backlog — [framework.sdd.works](http://framework.sdd.works)

> **Purpose**: Short-cycle execution list — what to do, what is blocked, and how to accept it.
> **Single source of truth for schedule and status**: this file. The `Sprint` column in `product-backlog.md` is a projection of this file.
> **Related**: `[architecture.md](./architecture.md)` · `[deployment.md](./deployment.md)` · `[artifacts-map.md](./artifacts-map.md)` · `[framework.seeds/templates/EN/scrum-in-sdd.md](./framework.seeds/templates/EN/scrum-in-sdd.md)` · `[status.md](./status.md)`
> **Numbering**: `Code` is the second column, between `#` and `SBI`. `Code` is the Type plus a two-digit number inside that sprint, such as `task-01`. When citing another document, prefer the item name. Shape: `[framework.seeds/framework-design.md](./framework.seeds/framework-design.md)`.
> **Order**: In each sprint table, row order is priority, top to bottom. When updating this file, place a row by priority. `WIP` sits above `ToDo`. `Done` sits below open work. Do not append a row only because it is new, and do not group by Type or by the order the row was added. [framework-design.md](./framework.seeds/framework-design.md) Sprint item table.
> **Practices**: `[sdd-scrum-practices.md](./framework.seeds/templates/EN/sdd-scrum-practices.md)` (what, how, when: jobs, templates, table conventions).
> **Framework**: `[scrum-in-sdd.md](./framework.seeds/templates/EN/scrum-in-sdd.md)` (names and meaning). HanS: `[scrum-in-sdd.md](./framework.seeds/templates/HanS/scrum-in-sdd.md)`.
> **as_of**: 2026-09-28

Current sprint: Sprint 3. Status: WIP. Sprint 1 is Done. Sprint 2 is Done.

Each later sprint is one small MVP. It ships a complete slice and does not wait on a later sprint.

---



## RID Registry (Risks / Impediments / Dependencies)

> This section records risks, impediments, and dependencies only. It does not belong to any sprint.


| #      | Severity     | Type       | Title                                             | Description                                                                                                                                                                                                                                                                                                                                      | Impact                                                           | Solution (→ product-backlog)                                                       | Related docs                                                                                                              | Handling note                                                                                                                               | Status | Updated    |
| ------ | ------------ | ---------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ---------- |
| **D1** | **Blocking** | Dependency | coach-ethan product presence (local Cursor agent) | Ship coach-ethan as a local Cursor agent (installable prompt in the client `agents/` tree). Remote MCP stays the installer.                                                                                                                                                                                                                      | Resolved: one presence model for product and MVPs.               | [Agent-01](./product-backlog.md#pb-6)                                              | `[agent-ethan/agent-design.md](./agent-ethan/agent-design.md)` · `[architecture.md](./architecture.md)` §2                | Decision recorded in agent-design.md. No separate ADR required for this choice.                                                             | Closed | 2026-09-22 |
| **D2** | **Blocking** | Dependency | Pack allow-list vs extra GitHub top-level files   | Pack GitHub is `Setting.githubUrl` (not this service workspace; not hard-coded). Current operator URL is a pack-only tree ([framework.sdd.works](https://github.com/ethanhuangcst/framework.sdd.works)) with `skill/`, `Rules/`, `agents/`, `templates/`, plus non-pack files. Copying every top-level name onto `{client_root}` is still wrong. | Feature-01 cannot ship an unbounded git-tree copy.               | [MCP-01](./product-backlog.md#pb-16)                                               | `[mcp/mcp-design.md](./mcp/mcp-design.md)` §1.1 and pack allow-list · `[mcp/mcp-stories.md](./mcp/mcp-stories.md)` AC1b   | Copy allow-list only; map `skill`→`skills`, `Rules`→`rules`. Admin may change the URL.                                                      | Open   | 2026-09-24 |
| **D3** | **Blocking** | Dependency | `templates/` has no installer root                | ADR-056 and MCP-01 need `{client_root}/templates/`. Seed map `PathRoots` has `other` (`~/.cursor/sdd/`), not `templates`. Current `applyPackage` copies only skills/rules/agents/workflows.                                                                                                                                                      | Templates would land in the wrong place or not at all.           | [MCP-01](./product-backlog.md#pb-16) · [Spec-seeds-01](./product-backlog.md#pb-32) | `[mcp/mcp-design.md](./mcp/mcp-design.md)` · `[packages/sdd-paths](../packages/sdd-paths)`                                | Feature-01 maps `templates/` → `{client_root}/templates/`. Seed-map schema change is in this feature if HTTP `paths.templates` is required. | Open   | 2026-09-24 |
| **R1** | **Medium**   | Risk       | HTTP fallback ledger is AI-written                | HTTP MCP cannot write the caller disk. If the AI extracts the tarball but skips writing `.sdd-installed.json` with `pack_complete: true`, Ethan’s start gate never passes. Baking a finished ledger into the tarball would mark a failed extract as complete. Primary path is stdio (ADR-058), which writes the ledger in-process.               | Install looks successful on HTTP fallback; `/ethan` still stops. | [MCP-01](./product-backlog.md#pb-16) · [Agent-07](./product-backlog.md#pb-17)      | `[mcp/mcp-design.md](./mcp/mcp-design.md)` HTTP fallback steps · [ADR-058](./adr/ADR-058-stdio-end-user-http-fallback.md) | Write ledger last, after verify. Instructions must name `manifestPath`. Do not commit a true ledger in the pack git tree.                   | Open   | 2026-09-25 |


> **Severity**: **Blocking** = blocked product ship until closed. D1 is Closed (local Cursor agent). D2 and D3 block Sprint 2 Feature-01 until the allow-list and templates root are implemented. R1 is accepted residual on HTTP.
> **Type**: dependency = work or decision required before the related product item ships. risk = residual after the planned design.



### RID coverage


| RID | Solution (Backlog item)               | Acceptance criteria and design/test location                                                               | Sprint location                                 |
| --- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| D1  | [Agent-01](./product-backlog.md#pb-6) | `[agent-ethan/agent-design.md](./agent-ethan/agent-design.md)` · `[architecture.md](./architecture.md)` §2 | Closed: local Cursor agent for MVPs and product |
| D2  | [MCP-01](./product-backlog.md#pb-16)  | `[mcp/mcp-stories.md](./mcp/mcp-stories.md)` AC1b · `[mcp/mcp-test.md](./mcp/mcp-test.md)` P3              | Sprint 2 Feature-01                             |
| D3  | [MCP-01](./product-backlog.md#pb-16)  | `[mcp/mcp-stories.md](./mcp/mcp-stories.md)` AC1 · `[mcp/mcp-test.md](./mcp/mcp-test.md)` P4               | Sprint 2 Feature-01                             |
| R1  | [MCP-01](./product-backlog.md#pb-16)  | `[mcp/mcp-stories.md](./mcp/mcp-stories.md)` AC4–AC5 · `[mcp/mcp-test.md](./mcp/mcp-test.md)` P5–P6        | Sprint 2 Feature-01                             |


---



## Sprint 1

Sprint Goal: framework.sdd.works R2 with an agent spike and POC. The pack seeds live in this repo, and ethan can be called as a local agent.

**Status: Done** (EN guide and practices confirmed; call-up recorded; Phase 1 archive under `phase1-process-specs/`). HanS and HanT are Sprint 15.

### Done


| # | Code | SBI | Parent PBI | Module/Type | DoD | Related specs | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | feature-01 | Store the latest guide and practices seeds | [Spec-seeds-02 Seed: scrum-in-sdd.md](./product-backlog.md#pb-33) · [Spec-seeds-03 Seed: sdd-scrum-practices.md](./product-backlog.md#pb-34) | Framework/Feature | - Follow rule DoD<br>- Feature confirmed usable by user<br>- Acceptance criteria (story mapping spec names with links) passed<br>- Quality meets [agent test](./agent-ethan/agent-test.md) · [MCP test](./mcp/mcp-test.md) · [portal test](./admin-portal/app-test.md) | `[framework.seeds/templates/EN/scrum-in-sdd.md](./framework.seeds/templates/EN/scrum-in-sdd.md)` · `[framework.seeds/templates/EN/sdd-scrum-practices.md](./framework.seeds/templates/EN/sdd-scrum-practices.md)` | Done |
| 2 | feature-03 | Agent spike: call ethan | [Agent-01 agent ethan — POC](./product-backlog.md#pb-6) | Agent/Feature | - Follow rule DoD<br>- Feature confirmed usable by user<br>- Acceptance criteria (story mapping spec names with links) passed<br>- Quality meets [agent test](./agent-ethan/agent-test.md) · [MCP test](./mcp/mcp-test.md) · [portal test](./admin-portal/app-test.md) | `[agent-ethan/agent-design.md](./agent-ethan/agent-design.md)` · [D1](#rid-d1) | Done |
| 3 | feature-04 | Archive Phase 1 Scrum files | [Spec-01 Archive Phase 1 Scrum files](./product-backlog.md#pb-1) | Framework/Feature | - Follow rule DoD<br>- Feature confirmed usable by user<br>- Acceptance criteria (story mapping spec names with links) passed<br>- Quality meets [agent test](./agent-ethan/agent-test.md) · [MCP test](./mcp/mcp-test.md) · [portal test](./admin-portal/app-test.md) | `[artifacts-map.md](./artifacts-map.md)` | Done |
| 4 | documentation-01 | Point process docs at the seed tree | [Spec-seeds-02 Seed: scrum-in-sdd.md](./product-backlog.md#pb-33) | Framework/Documentation | - Follow rule DoD<br>- Feature confirmed usable by user<br>- Acceptance criteria (story mapping spec names with links) passed<br>- Quality meets [agent test](./agent-ethan/agent-test.md) · [MCP test](./mcp/mcp-test.md) · [portal test](./admin-portal/app-test.md) | `[artifacts-map.md](./artifacts-map.md)` | Done |




### Retrospective

Learnings:

[Sep 24, 2026], feature-01 completed

- [The guide and practices have one authoring place](./framework.seeds/templates/EN/sdd-scrum-practices.md)
- `/ethan` [uses Cursor agents trees](./knowledge/agent/cursor-agent-callup.md)
- [A second pack copy in the workspace does not override the user root](./adr/ADR-056-single-user-root-framework-pack.md)

---

[Sep 25, 2026], feature-03 completed

- The `/ethan` spike is recorded. Receipt enforcement stays on Sprint 2.

---

[Sep 25, 2026], Sprint 1 closed

- User confirmed the EN guide and practices seeds.
- Cross-review: Sprint 1 seeds match `templates/EN/`. Later sprints own `constants.md`, `.secrets`, empty pack folders, `framework-design.md`, and HanS/HanT.
- Phase 1 archive path is `phase1-process-specs/`.

Opportunities:

[Sep 25, 2026], HanS and HanT moved to Sprint 15

- The HanS guide, the HanT guide, and the HanS and HanT practices are [Sprint 15](#s15-feature-01). `constants.md` is Sprint 2.

---

[Sep 25, 2026], Sprint 1 closed

- Start Sprint 2: installer ledger with `pack_complete`, then ethan start gate.

---



## Sprint 2

Sprint Goal: Install or update writes the pack and a ledger that lists each pack file (ADR-059). End users connect via a local program (ADR-058) with HTTP as fallback. Ethan starts only when `pack_complete` is true.

Depends on Sprint 1 only for the seed files already in this repo. It does not wait on a new-project skill.

**Status: Done**

### Done


| # | Code | SBI | Parent PBI | Module/Type | DoD | Related specs | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | feature-01 | First install copies allow-list files and writes a file-level ledger | [MCP-01 Installer: pack allow-list + ledger](./product-backlog.md#pb-16) | MCP/Feature | - Follow rule DoD<br>- Feature confirmed usable by user<br>- Acceptance criteria (story mapping spec names with links) passed<br>- Quality meets [agent test](./agent-ethan/agent-test.md) · [MCP test](./mcp/mcp-test.md) · [portal test](./admin-portal/app-test.md) | `[mcp/mcp-stories.md](./mcp/mcp-stories.md)` scenarios 1 and 4 · `[mcp/mcp-test.md](./mcp/mcp-test.md)` C1, C4, P1–P4 · [ADR-057](./adr/ADR-057-install-ledger-pack-complete.md) · [ADR-059](./adr/ADR-059-ledger-lists-pack-files.md) | Done |
| 2 | feature-06 | Update deletes recorded pack files only | [MCP-01 Installer: pack allow-list + ledger](./product-backlog.md#pb-16) | MCP/Feature | - Follow rule DoD<br>- Feature confirmed usable by user<br>- Acceptance criteria (story mapping spec names with links) passed<br>- Quality meets [agent test](./agent-ethan/agent-test.md) · [MCP test](./mcp/mcp-test.md) · [portal test](./admin-portal/app-test.md) | `[mcp/mcp-stories.md](./mcp/mcp-stories.md)` scenario 5 and AC2b · `[mcp/mcp-test.md](./mcp/mcp-test.md)` C5, C2b · [ADR-059](./adr/ADR-059-ledger-lists-pack-files.md) | Done |
| 3 | feature-07 | Same commit does not replace file bytes | [MCP-01 Installer: pack allow-list + ledger](./product-backlog.md#pb-16) | MCP/Feature | - Follow rule DoD<br>- Feature confirmed usable by user<br>- Acceptance criteria (story mapping spec names with links) passed<br>- Quality meets [agent test](./agent-ethan/agent-test.md) · [MCP test](./mcp/mcp-test.md) · [portal test](./admin-portal/app-test.md) | `[mcp/mcp-stories.md](./mcp/mcp-stories.md)` scenarios 3, 6a, 7a · `[mcp/mcp-test.md](./mcp/mcp-test.md)` C3, C6a, C7a | Done |
| 4 | feature-08 | New commit replaces recorded files and sets the flag | [MCP-01 Installer: pack allow-list + ledger](./product-backlog.md#pb-16) | MCP/Feature | - Follow rule DoD<br>- Feature confirmed usable by user<br>- Acceptance criteria (story mapping spec names with links) passed<br>- Quality meets [agent test](./agent-ethan/agent-test.md) · [MCP test](./mcp/mcp-test.md) · [portal test](./admin-portal/app-test.md) | `[mcp/mcp-stories.md](./mcp/mcp-stories.md)` scenarios 2, 6b, 7b · `[mcp/mcp-test.md](./mcp/mcp-test.md)` C2, C6b, C7b | Done |
| 5 | feature-09 | Failed download leaves the client folder unchanged | [MCP-01 Installer: pack allow-list + ledger](./product-backlog.md#pb-16) | MCP/Feature | - Follow rule DoD<br>- Feature confirmed usable by user<br>- Acceptance criteria (story mapping spec names with links) passed<br>- Quality meets [agent test](./agent-ethan/agent-test.md) · [MCP test](./mcp/mcp-test.md) · [portal test](./admin-portal/app-test.md) | `[mcp/mcp-stories.md](./mcp/mcp-stories.md)` scenario 8 · `[mcp/mcp-test.md](./mcp/mcp-test.md)` C8, P2 | Done |
| 6 | feature-02 | Ship ethan.md in the pack | [Agent-15 Pack file: agents/ethan.md](./product-backlog.md#pb-63) | Agent/Feature | - Follow rule DoD<br>- Feature confirmed usable by user<br>- Acceptance criteria (story mapping spec names with links) passed<br>- Quality meets [agent test](./agent-ethan/agent-test.md) · [MCP test](./mcp/mcp-test.md) · [portal test](./admin-portal/app-test.md) | `[agent-ethan/agent-design.md](./agent-ethan/agent-design.md)` · `[framework.seeds/framework-design.md](./framework.seeds/framework-design.md)` | Done |
| 7 | feature-03 | Ethan start reads only the ledger | [Agent-07 agent ethan — pack receipt start gate](./product-backlog.md#pb-17) | Agent/Feature | - Follow rule DoD<br>- Feature confirmed usable by user<br>- Acceptance criteria (story mapping spec names with links) passed<br>- Quality meets [agent test](./agent-ethan/agent-test.md) · [MCP test](./mcp/mcp-test.md) · [portal test](./admin-portal/app-test.md) | `[agent-ethan/agent-design.md](./agent-ethan/agent-design.md)` §2.4 · `[agent-ethan/agent-stories.md](./agent-ethan/agent-stories.md)` · `[agent-ethan/agent-test.md](./agent-ethan/agent-test.md)` CE-GATE · `[framework.seeds/agents/ethan.md](./framework.seeds/agents/ethan.md)` | Done |
| 8 | feature-04 | Seed constants | [Spec-seeds-01 Seed: constants.md](./product-backlog.md#pb-32) | Framework/Feature | - Follow rule DoD<br>- Feature confirmed usable by user<br>- Acceptance criteria (story mapping spec names with links) passed<br>- Quality meets [agent test](./agent-ethan/agent-test.md) · [MCP test](./mcp/mcp-test.md) · [portal test](./admin-portal/app-test.md) | `[framework.seeds/templates/constants.md](./framework.seeds/templates/constants.md)` · `[framework.seeds/templates/EN/sdd-scrum-practices.md](./framework.seeds/templates/EN/sdd-scrum-practices.md)` · [ADR-060](./adr/ADR-060-constants-on-client-root.md) | Done |
| 9 | feature-05 | Website paste prompt configures stdio MCP | [Web-portal-04 Agent-setup: stdio prompt + HTTP fallback](./product-backlog.md#pb-70) | Web-portal/Feature | - Follow rule DoD<br>- Feature confirmed usable by user<br>- Acceptance criteria (story mapping spec names with links) passed<br>- Quality meets [agent test](./agent-ethan/agent-test.md) · [MCP test](./mcp/mcp-test.md) · [portal test](./admin-portal/app-test.md) | `[mcp/mcp-design.md](./mcp/mcp-design.md)` §2.1 · `[mcp/mcp-stories.md](./mcp/mcp-stories.md)` `sdd-mcp-prompt-setup` · [ADR-058](./adr/ADR-058-stdio-end-user-http-fallback.md) · `public/agent-setup/prompt.md` | Done |
| 10 | feature-10 | Instructions page re-design | [Web-portal-05 Instructions page re-design](./product-backlog.md#pb-71) | Web-portal/Feature | - Follow rule DoD<br>- Feature confirmed usable by user<br>- Acceptance criteria (story mapping spec names with links) passed<br>- Quality meets [agent test](./agent-ethan/agent-test.md) · [MCP test](./mcp/mcp-test.md) · [portal test](./admin-portal/app-test.md) | `[admin-portal/ui-mockup/01-home.html](./admin-portal/ui-mockup/01-home.html)` · `src/components/features/InstructionsPage.tsx` · [ADR-061](./adr/ADR-061-setup-prompt-public-path.md) | Done |
| 11 | feature-11 | Instructions page copies the one-line setup prompt | [Web-portal-06 Instructions: MCP auto-connect prompt](./product-backlog.md#pb-72) | Web-portal/Feature | - Follow rule DoD<br>- Feature confirmed usable by user<br>- Acceptance criteria (story mapping spec names with links) passed<br>- Quality meets [agent test](./agent-ethan/agent-test.md) · [MCP test](./mcp/mcp-test.md) · [portal test](./admin-portal/app-test.md) | `[mcp/mcp-design.md](./mcp/mcp-design.md)` §2.1 · [ADR-061](./adr/ADR-061-setup-prompt-public-path.md) · `src/components/features/InstructionsPage.tsx` | Done |
| 12 | backend-01 | One-line prompt automatically connects agent tools to MCP | [Web-portal-06 Instructions: MCP auto-connect prompt](./product-backlog.md#pb-72) | MCP/Backend | - Follow rule DoD<br>- Feature confirmed usable by user<br>- Acceptance criteria (story mapping spec names with links) passed<br>- Quality meets [agent test](./agent-ethan/agent-test.md) · [MCP test](./mcp/mcp-test.md) · [portal test](./admin-portal/app-test.md) | `[mcp/mcp-design.md](./mcp/mcp-design.md)` §2.1 · `[mcp/mcp-stories.md](./mcp/mcp-stories.md)` `sdd-mcp-prompt-setup` · [ADR-061](./adr/ADR-061-setup-prompt-public-path.md) · `public/agent-setup/prompt.md` · `next.config.ts` | Done |
| 13 | feature-14 | Build and publish ~/.sdd/sdd-mcp | [MCP-02 Local binary: ~/.sdd/sdd-mcp](./product-backlog.md#pb-75) | MCP/Feature | - Follow rule DoD<br>- Feature confirmed usable by user<br>- Acceptance criteria (story mapping spec names with links) passed<br>- Quality meets [agent test](./agent-ethan/agent-test.md) · [MCP test](./mcp/mcp-test.md) · [portal test](./admin-portal/app-test.md) | [ADR-051](./adr/ADR-051-zero-dep-stdio-binary.md) · `[mcp/mcp-design.md](./mcp/mcp-design.md)` §2.1 and §4.1 · `spikes/feature-14-zero-dep/` | Done |
| 14 | feature-12 | Manual setup shows one mcp.json | [Web-portal-06 Instructions: MCP auto-connect prompt](./product-backlog.md#pb-72) | Web-portal/Feature | - Follow rule DoD<br>- Feature confirmed usable by user<br>- Acceptance criteria (story mapping spec names with links) passed<br>- Quality meets [agent test](./agent-ethan/agent-test.md) · [MCP test](./mcp/mcp-test.md) · [portal test](./admin-portal/app-test.md) | [`mcp/mcp-design.md`](./mcp/mcp-design.md) §2.1 · [ADR-061](./adr/ADR-061-setup-prompt-public-path.md) · `src/components/features/InstructionsPage.tsx` | Done |
| 15 | feature-13 | Copied prompt is the one-line setup URL | [Web-portal-06 Instructions: MCP auto-connect prompt](./product-backlog.md#pb-72) | Web-portal/Feature | - Follow rule DoD<br>- Feature confirmed usable by user<br>- Acceptance criteria (story mapping spec names with links) passed<br>- Quality meets [agent test](./agent-ethan/agent-test.md) · [MCP test](./mcp/mcp-test.md) · [portal test](./admin-portal/app-test.md) | `src/components/features/InstructionsPage.test.tsx` | Done |




### Retrospective

Learnings:

[Sep 26, 2026], feature-14 completed

- `npm run mcp:build` + `npm run mcp:place` place `~/.sdd/sdd-mcp`. Stdio uses `createStdioMcpServer` so Prisma stays out of the binary.
- TRAE CN Manage-page MCP is `~/Library/Application Support/Trae CN/User/mcp.json`, not `~/.trae-cn/mcp.json` or `~/.trae/mcp.json`.
- Ethan confirmed tools/list and `sdd_list_versions` from TRAE CN against a local server.

[Sep 26, 2026], feature-12 and feature-13 completed

- Manual setup on `/instructions` is one `command` `mcp.json`. The copy-sentence test covers `en`, `zh-Hans`, and `zh-Hant`.

[Sep 25, 2026], feature-04 completed

- [Pack lookup is](./adr/ADR-060-constants-on-client-root.md) `constants.md` [on the client root](./adr/ADR-060-constants-on-client-root.md)
- Writing rules live under Templates in the EN practices; the seed is not copied into workspace `specs/`

Opportunities:

[Sep 26, 2026], Sprint 2 closed

- Go-live is Sprint 15 feature-06: GitHub Releases for the five `sdd-mcp` binaries, pack copy, admin-portal sync. Those are not Sprint 2 SBIs.
- [MCP-01](./product-backlog.md#pb-16) is ToDo on Sprint 15. Sprint 2 installer stories stay Done.
- Local reset must keep the seed admin. Playwright must not delete `ADMIN_SEED_EMAIL`. Decision: [ADR-064](./adr/ADR-064-e2e-must-not-wipe-seed-admin.md). Lesson: `[knowledge/agent/web-app-fix-regression.md](./knowledge/agent/web-app-fix-regression.md)`.

---



## Sprint 3

Sprint Goal: Ethan can start a new project. The instructions page looks up one secret by name. [MCP-03](./product-backlog.md#pb-78) removes `sdd_list_versions` from the model-facing tool list.

Depends on Sprint 2 (receipt must pass before the job runs).

**Status: WIP**

Done rows stay on top. Open rows follow start load: feature-27 (seed `status.md`, WIP), feature-23 (`sdd-audit-artifacts`), feature-24 (`sdd-get-status`), feature-25 (`sdd-update-project`), feature-26 (Ethan runs update-project), feature-21 (change-log and issues-log seeds), feature-01 (`sdd-kickoff-project`), feature-02 (Ethan runs that skill), feature-22 (rule `artifacts-map.mdc`). Column rules: `[sdd-scrum-practices.md](./framework.seeds/templates/EN/sdd-scrum-practices.md)`.

### WIP


| # | Code | SBI | Parent PBI | Module/Type | DoD | Related specs | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | feature-11 | Update ethan.md start load | [Agent-02 agent ethan — initial capabilities](./product-backlog.md#pb-7) | Agent/Feature | - Confirmed usable by user - Whole pack cross-reviewed and updated accordingly - Reviewed to ensure it follows TRUE AGENT principle | `[agent-design.md](./agent-ethan/agent-design.md)` §2.2 · §2.4 · [ADR-073](./adr/ADR-073-skill-get-status.md) | Done |
| 2 | feature-04 | Secret form at the bottom of Features | [Web-portal-08 Instructions page — Get secret](./product-backlog.md#pb-74) | Web-portal/Feature | - Confirmed usable by user - Whole pack cross-reviewed and updated accordingly - Reviewed to ensure it follows TRUE AGENT principle | `[app-stories.md](./admin-portal/app-stories.md)` AC7 · `[app-design.md](./admin-portal/app-design.md)` `/instructions` · `[app-test.md](./admin-portal/app-test.md)` · `[13-instructions.html](./admin-portal/ui-mockup/13-instructions.html)` | Done |
| 3 | feature-05 | Get secret returns and shows one value | [Web-portal-08 Instructions page — Get secret](./product-backlog.md#pb-74) | Web-portal/Feature | - Confirmed usable by user - Whole pack cross-reviewed and updated accordingly - Reviewed to ensure it follows TRUE AGENT principle | `[mcp/mcp-stories.md](./mcp/mcp-stories.md)` `sdd-mcp-get-key` · `src/core/tools/get-key.ts` · `[product-backlog.md](./product-backlog.md#pb-74)` · `src/components/features/InstructionsPage.tsx` · `[issues-log.md](./issues-log.md)` WA-09 · WA-11 | Done |
| 4 | feature-07 | Features tab reads synced markdown | [Web-portal-07 Features tab reads pack features.md](./product-backlog.md#pb-73) | Web-portal/Feature | - Confirmed usable by user - Whole pack cross-reviewed and updated accordingly - Reviewed to ensure it follows TRUE AGENT principle | `[product-backlog.md](./product-backlog.md#pb-73)` · `[app-design.md](./admin-portal/app-design.md)` Features catalog · `[app-stories.md](./admin-portal/app-stories.md)` AC12–AC16 · `[app-test.md](./admin-portal/app-test.md)` | Done |
| 5 | feature-08 | Unregister sdd_list_versions | [MCP-03 MCP tools without sdd_list_versions](./product-backlog.md#pb-78) | MCP/Feature | - Confirmed usable by user - Whole pack cross-reviewed and updated accordingly - Reviewed to ensure it follows TRUE AGENT principle | [ADR-063](./adr/ADR-063-unregister-sdd-list-versions.md) · `[mcp/mcp-design.md](./mcp/mcp-design.md)` §3 · `[mcp/mcp-test.md](./mcp/mcp-test.md)` · `src/mcp/create-server.ts` · `src/mcp/create-server-stdio.ts` · `src/mcp/create-server.test.ts` · `src/mcp/local-binary.test.ts` · `src/app/api/sdd/sdd-api.test.ts` | Done |
| 6 | feature-09 | Setup and instructions omit list tool | [MCP-03 MCP tools without sdd_list_versions](./product-backlog.md#pb-78) | MCP/Feature | - Confirmed usable by user - Whole pack cross-reviewed and updated accordingly - Reviewed to ensure it follows TRUE AGENT principle | `public/agent-setup/prompt.md` · `src/components/features/InstructionsPage.tsx` · `messages/en.json` · `messages/zh-Hans.json` · `messages/zh-Hant.json` | Done |
| 7 | feature-10 | Reset success uses previous sentence | [Web-portal-11 Reset success stays on page with previous sentence](./product-backlog.md#pb-79) | Web-portal/Feature | - Confirmed usable by user - Whole pack cross-reviewed and updated accordingly - Reviewed to ensure it follows TRUE AGENT principle | `[issues-log.md](./issues-log.md)` WA-08 · WA-10 · `[app-stories.md](./admin-portal/app-stories.md)` AC4b · `[app-design.md](./admin-portal/app-design.md)` `/reset-password` · `[app-test.md](./admin-portal/app-test.md)` | Done |
| 8 | feature-12 | Rename update-status to tracking | [Skill-07 Skill: sdd-tracking](./product-backlog.md#pb-27) | Skill/Feature | - Confirmed usable by user - Whole pack cross-reviewed and updated accordingly - Reviewed to ensure it follows TRUE AGENT principle | [ADR-065](./adr/ADR-065-skill-update-status.md) · `[constants.md](./framework.seeds/templates/constants.md)` | Done |
| 9 | feature-13 | Skill sdd-design | [Skill-14 Skill: sdd-design](./product-backlog.md#pb-80) | Skill/Feature | - Confirmed usable by user - Whole pack cross-reviewed and updated accordingly - Reviewed to ensure it follows TRUE AGENT principle | [ADR-066](./adr/ADR-066-sdd-design-before-implementation.md) · `[constants.md](./framework.seeds/templates/constants.md)` | Done |
| 10 | feature-14 | Initial sdd-tracking skill | [Skill-07 Skill: sdd-tracking](./product-backlog.md#pb-27) | Skill/Feature | - Confirmed usable by user - Whole pack cross-reviewed and updated accordingly - Reviewed to ensure it follows TRUE AGENT principle | [ADR-065](./adr/ADR-065-skill-update-status.md) | Done |
| 11 | feature-15 | Rename implement-feature to implement | [Skill-13 Skill: sdd-implement](./product-backlog.md#pb-65) | Skill/Feature | - Confirmed usable by user - Whole pack cross-reviewed and updated accordingly - Reviewed to ensure it follows TRUE AGENT principle | [ADR-066](./adr/ADR-066-sdd-design-before-implementation.md) · `[constants.md](./framework.seeds/templates/constants.md)` | Done |
| 12 | feature-16 | Guide tab on instructions | [Web-portal-12 Instructions tab: Scrum in SDD](./product-backlog.md#pb-81) | Web-portal/Feature | - Confirmed usable by user - Whole pack cross-reviewed and updated accordingly - Reviewed to ensure it follows TRUE AGENT principle | `[scrum-in-sdd.md](./framework.seeds/templates/EN/scrum-in-sdd.md)` · `[app-design.md](./admin-portal/app-design.md)` · `[app-stories.md](./admin-portal/app-stories.md)` AC18 | Done |
| 13 | feature-17 | Move Get secret to Setup | [Web-portal-13 Get secret moves to Setup](./product-backlog.md#pb-83) | Web-portal/Feature | - Confirmed usable by user - Whole pack cross-reviewed and updated accordingly - Reviewed to ensure it follows TRUE AGENT principle | [ADR-067](./adr/ADR-067-get-secret-on-setup.md) · `[app-design.md](./admin-portal/app-design.md)` · `[13-instructions.html](./admin-portal/ui-mockup/13-instructions.html)` | Done |
| 14 | feature-18 | Rename guide to scrum-in-sdd.md | [Spec-seeds-02 Seed: scrum-in-sdd.md](./product-backlog.md#pb-33) | Framework/Feature | - Confirmed usable by user - Whole pack cross-reviewed and updated accordingly - Reviewed to ensure it follows TRUE AGENT principle | [ADR-068](./adr/ADR-068-scrum-in-sdd-filename.md) · `[scrum-in-sdd.md](./framework.seeds/templates/EN/scrum-in-sdd.md)` | Done |
| 15 | feature-19 | Retarget guide name in portal catalog | [Web-portal-12 Instructions tab: sdd-scrum guide](./product-backlog.md#pb-81) | Web-portal/Feature | - Confirmed usable by user - Whole pack cross-reviewed and updated accordingly - Reviewed to ensure it follows TRUE AGENT principle | [ADR-068](./adr/ADR-068-scrum-in-sdd-filename.md) · `[features.en.md](../src/content/features/features.en.md)` · `[app-design.md](./admin-portal/app-design.md)` | Done |
| 16 | feature-20 | Rename new-project to kickoff-project | [Skill-03 Skill: sdd-kickoff-project](./product-backlog.md#pb-23) | Skill/Feature | - Confirmed usable by user - Whole pack cross-reviewed and updated accordingly - Reviewed to ensure it follows TRUE AGENT principle | [ADR-069](./adr/ADR-069-skill-kickoff-project.md) · `[constants.md](./framework.seeds/templates/constants.md)` | Done |
| 17 | task-01 | Write the three package files | [Web-portal-07 Features tab reads pack features.md](./product-backlog.md#pb-73) | Web-portal/Task | - Confirmed usable by user - Whole pack cross-reviewed and updated accordingly - Reviewed to ensure it follows TRUE AGENT principle | `[app-design.md](./admin-portal/app-design.md)` Features catalog · `Dockerfile` | Done |
| 18 | task-02 | Put the files in the pack | [Web-portal-07 Features tab reads pack features.md](./product-backlog.md#pb-73) | Web-portal/Task | - Confirmed usable by user - Whole pack cross-reviewed and updated accordingly - Reviewed to ensure it follows TRUE AGENT principle | `[mcp/mcp-design.md](./mcp/mcp-design.md)` sync cache · `[app-design.md](./admin-portal/app-design.md)` | Done |
| 19 | task-03 | Read the synced file for one locale | [Web-portal-07 Features tab reads pack features.md](./product-backlog.md#pb-73) | Web-portal/Task | - Confirmed usable by user - Whole pack cross-reviewed and updated accordingly - Reviewed to ensure it follows TRUE AGENT principle | `src/app/api/sdd/features/route.ts` · `[app-design.md](./admin-portal/app-design.md)` | Done |
| 20 | task-04 | Show the file on the Features tab | [Web-portal-07 Features tab reads pack features.md](./product-backlog.md#pb-73) | Web-portal/Task | - Confirmed usable by user - Whole pack cross-reviewed and updated accordingly - Reviewed to ensure it follows TRUE AGENT principle | `src/components/features/InstructionsPage.tsx` · `[13-instructions.html](./admin-portal/ui-mockup/13-instructions.html)` | Done |
| 21 | task-05 | Fallback to the package files | [Web-portal-07 Features tab reads pack features.md](./product-backlog.md#pb-73) | Web-portal/Task | - Confirmed usable by user - Whole pack cross-reviewed and updated accordingly - Reviewed to ensure it follows TRUE AGENT principle | `[app-stories.md](./admin-portal/app-stories.md)` AC14 | Done |
| 22 | task-06 | Tests and regression | [Web-portal-07 Features tab reads pack features.md](./product-backlog.md#pb-73) | Web-portal/Task | - Confirmed usable by user - Whole pack cross-reviewed and updated accordingly - Reviewed to ensure it follows TRUE AGENT principle | `[app-test.md](./admin-portal/app-test.md)` §7 | Done |
| 23 | feature-03 | Seeds the job copies | [Spec-seeds-04 Seed: artifacts-map.md](./product-backlog.md#pb-35) | Framework/Feature | - Confirmed usable by user - Whole pack cross-reviewed and updated accordingly - Reviewed to ensure it follows TRUE AGENT principle | [Spec-seeds-01 Seed: constants.md](./product-backlog.md#pb-32) · [Spec-seeds-03 Seed: sdd-scrum-practices.md](./product-backlog.md#pb-34) | Done |
| 24 | feature-27 | Seed status.md | [Spec-seeds-07 Seed: status.md](./product-backlog.md#pb-38) | Framework/Feature | - Confirmed usable by user - Whole pack cross-reviewed and updated accordingly - Reviewed to ensure it follows TRUE AGENT principle | [`status.md`](./framework.seeds/templates/EN/status.md) · [`framework-design.md`](./framework.seeds/framework-design.md) | WIP |
| 25 | feature-23 | Initial sdd-audit-artifacts | [Skill-10 Skill: sdd-audit-artifacts](./product-backlog.md#pb-30) | Skill/Feature | - Confirmed usable by user - Whole pack cross-reviewed and updated accordingly - Reviewed to ensure it follows TRUE AGENT principle | [ADR-073](./adr/ADR-073-skill-get-status.md) · `[agent-design.md](./agent-ethan/agent-design.md)` §2.2 | ToDo |
| 26 | feature-24 | Skill sdd-get-status | [Skill-15 Skill: sdd-get-status](./product-backlog.md#pb-86) | Skill/Feature | - Confirmed usable by user - Whole pack cross-reviewed and updated accordingly - Reviewed to ensure it follows TRUE AGENT principle | [ADR-073](./adr/ADR-073-skill-get-status.md) | ToDo |
| 27 | feature-25 | Skill sdd-update-project | [Skill-04 Skill: sdd-update-project](./product-backlog.md#pb-24) | Skill/Feature | - Confirmed usable by user - Whole pack cross-reviewed and updated accordingly - Reviewed to ensure it follows TRUE AGENT principle | [Agent-09](./product-backlog.md#pb-43) | ToDo |
| 28 | feature-26 | Ethan runs update-project-settings | [Agent-09 Job: Update project settings](./product-backlog.md#pb-43) | Agent/Feature | - Confirmed usable by user - Whole pack cross-reviewed and updated accordingly - Reviewed to ensure it follows TRUE AGENT principle | — | ToDo |
| 29 | feature-21 | Change-log and issues-log seeds | [Spec-seeds-08 Seed: change-log.md](./product-backlog.md#pb-39) · [Spec-seeds-13 Seed: issues-log.md](./product-backlog.md#pb-84) | Framework/Feature | - Confirmed usable by user - Whole pack cross-reviewed and updated accordingly - Reviewed to ensure it follows TRUE AGENT principle | [ADR-070](./adr/ADR-070-change-log-and-issues-log.md) | ToDo |
| 30 | feature-01 | Skill sdd-kickoff-project | [Skill-03 Skill: sdd-kickoff-project](./product-backlog.md#pb-23) | Skill/Feature | - Confirmed usable by user - Whole pack cross-reviewed and updated accordingly - Reviewed to ensure it follows TRUE AGENT principle | [Agent-08 Job: Start a new project](./product-backlog.md#pb-42) | ToDo |
| 31 | feature-02 | Ethan runs start-a-new-project | [Agent-08 Job: Start a new project](./product-backlog.md#pb-42) | Agent/Feature | - Confirmed usable by user - Whole pack cross-reviewed and updated accordingly - Reviewed to ensure it follows TRUE AGENT principle | `[framework.seeds/templates/EN/sdd-scrum-practices.md](./framework.seeds/templates/EN/sdd-scrum-practices.md)` | ToDo |
| 32 | feature-22 | Add rule artifacts-map | [Rule-04 Rule: artifacts-map.mdc](./product-backlog.md#pb-85) | Rule/Feature | - Confirmed usable by user - Whole pack cross-reviewed and updated accordingly - Reviewed to ensure it follows TRUE AGENT principle | [ADR-072](./adr/ADR-072-rule-artifacts-map.md) · `[scrum-in-sdd.md](./framework.seeds/templates/EN/scrum-in-sdd.md)` | ToDo |




### Retrospective

Learnings:

[Sep 26, 2026], feature-07 Features catalog

- The page reads the latest unpack first and `src/content/features/` only when that unpack has no English file. That choice is already in `[app-design.md](./admin-portal/app-design.md)`. No new ADR.
- A prose bullet that contains `—` is split into a name and a description. Keep the em dash for `name — description` rows only. See `[knowledge/agent/features-markdown-em-dash.md](./knowledge/agent/features-markdown-em-dash.md)`.
- Ethan confirmed the page usable 2026-09-26 after sync.

[Sep 26, 2026], feature-11 start load

- Start load in the design is the audit verdict, then `sdd-get-status` when the verdict is Usable. The seed `agents/ethan.md` and `agent-design.md` §14 are the same prompt. Feature-11 is Done 2026-09-29.

[Sep 26, 2026], feature-05 and feature-06 merged

- Get secret is one feature. The server lookup and the button that shows the value are both feature-05. The old feature-06 row is removed. feature-07 and later codes are unchanged.

[Sep 26, 2026], feature-06 and feature-10 completed

- Reset success uses the previous `admin.reset.sent` sentence and does not name the address.
- Get secret result is a code block whose right edge matches the Get secret button. The field stays 32rem and does not shrink.
- A sub-100ms reset `200` means Resend was not called. Playwright must keep the seed admin: [ADR-064](./adr/ADR-064-e2e-must-not-wipe-seed-admin.md).

[Sep 26, 2026], feature-08 and feature-09 completed

- MCP has no private tool. Unregister `sdd_list_versions`. Keep `listVersions()` and `GET /api/sdd/versions`. Decision: [ADR-063](./adr/ADR-063-unregister-sdd-list-versions.md).
- Cursor loads `tsx src/mcp/stdio.ts`. `~/.sdd/sdd-mcp` stays on the previous tool list until `npm run mcp:build` and `npm run mcp:place`. See `[knowledge/ops/mcp-stdio-source-vs-binary.md](./knowledge/ops/mcp-stdio-source-vs-binary.md)`.
- Ethan confirmed both stories usable 2026-09-26.

---



## Sprint 4

Sprint Goal: Start load for update and status now lives in Sprint 3. This sprint has no SBIs.

Depends on Sprint 3. `sdd-get-status` is Sprint 3 feature-24. `sdd-update-project` is Sprint 3 feature-25. Ethan runs that skill as Sprint 3 feature-26.

**Status: ToDo**

No SBIs. The three rows moved to Sprint 3 so they follow start load.


---



## Sprint 5

Sprint Goal: Ethan can refine the product backlog.

Depends on Sprint 3. Does not depend on Sprint 4.

**Status: ToDo**

### ToDo


| # | Code | SBI | Parent PBI | Module/Type | DoD | Related specs | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | feature-01 | Fill practices job 4 and ship sdd-refine-pb | [Skill-05 Skill: sdd-refine-pb](./product-backlog.md#pb-25) · [Spec-seeds-03 Seed: sdd-scrum-practices.md](./product-backlog.md#pb-34) | Skill/Feature | - Practices job 4 is no longer *(to fill)*. - The skill installs. | — | ToDo |
| 2 | feature-02 | Ethan refines the backlog | [Agent-10 Job: Refine product backlog](./product-backlog.md#pb-44) | Agent/Feature | - A confirmed request leaves a verifiable change in `product-backlog.md`. | — | ToDo |
| 3 | feature-03 | One governance edit | [Agent-04 agent ethan — governance artifacts](./product-backlog.md#pb-9) | Agent/Feature | - Ethan applies one small backlog refinement and one change-log entry inside the guide rules. | — | ToDo |
| 4 | feature-04 | Product-backlog seed | [Spec-seeds-05 Seed: product-backlog.md](./product-backlog.md#pb-36) | Framework/Feature | - The user has reviewed and confirmed this seed. - It is stored in the seed tree. - Associated specs are updated. - The whole seed tree has been cross-reviewed and is consistent. | — | ToDo |


---



## Sprint 6

Sprint Goal: Ethan can plan a sprint.

Depends on Sprint 5 (a backlog exists to plan from).

**Status: ToDo**

### ToDo


| # | Code | SBI | Parent PBI | Module/Type | DoD | Related specs | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | feature-01 | Fill practices job 5 and ship sdd-plan-sprint | [Skill-06 Skill: sdd-plan-sprint](./product-backlog.md#pb-26) | Skill/Feature | - Practices job 5 is written. - The skill installs. | — | ToDo |
| 2 | feature-02 | Ethan plans a sprint | [Agent-11 Job: Sprint planning](./product-backlog.md#pb-45) | Agent/Feature | - A confirmed request leaves a Sprint Backlog for the planned sprint. | — | ToDo |
| 3 | feature-03 | One facilitated event | [Agent-03 agent ethan — facilitate events](./product-backlog.md#pb-8) | Agent/Feature | - The planning run is the one named event, with a verifiable change in the sprint backlog. | — | ToDo |
| 4 | feature-04 | Sprint-backlog seed | [Spec-seeds-06 Seed: sprint-backlog.md](./product-backlog.md#pb-37) | Framework/Feature | - The user has reviewed and confirmed this seed. - It is stored in the seed tree. - Associated specs are updated. - The whole seed tree has been cross-reviewed and is consistent. | — | ToDo |


---



## Sprint 7

Sprint Goal: Ethan can report status.

Depends on Sprint 3 (`status.md` exists). Does not depend on Sprint 4–6.

**Status: ToDo**

### ToDo


| # | Code | SBI | Parent PBI | Module/Type | DoD | Related specs | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | feature-01 | Fill practices job 6 and ship sdd-tracking | [Skill-07 Skill: sdd-tracking](./product-backlog.md#pb-27) | Skill/Feature | - Practices job 6 is written. - The skill installs as `sdd-tracking`. | [ADR-065](./adr/ADR-065-skill-update-status.md) | ToDo |
| 2 | feature-02 | Ethan updates status | [Agent-12 Job: Report status](./product-backlog.md#pb-46) | Agent/Feature | - A confirmed request leaves a verifiable update in `status.md`. | — | ToDo |


---



## Sprint 8

Sprint Goal: Ethan can run a retrospective.

Depends on Sprint 6 (a sprint exists to review).

**Status: ToDo**

### ToDo


| # | Code | SBI | Parent PBI | Module/Type | DoD | Related specs | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | feature-01 | Fill practices job 7 and ship sdd-retrospective | [Skill-08 Skill: sdd-retrospective](./product-backlog.md#pb-28) | Skill/Feature | - Practices job 7 is written. - The skill installs. | — | ToDo |
| 2 | feature-02 | Ethan records a retrospective | [Agent-13 Job: Retrospective](./product-backlog.md#pb-47) | Agent/Feature | - A confirmed request leaves the retrospective record practices describes. | — | ToDo |


---



## Sprint 9

Sprint Goal: Ethan can start the next sprint.

Depends on Sprint 8.

**Status: ToDo**

### ToDo


| # | Code | SBI | Parent PBI | Module/Type | DoD | Related specs | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | feature-01 | Fill practices job 8 and ship sdd-close-sprint | [Skill-09 Skill: sdd-close-sprint](./product-backlog.md#pb-29) | Skill/Feature | - Practices job 8 (Start a new sprint) is written. - The skill installs. | — | ToDo |
| 2 | feature-02 | Ethan opens the next sprint | [Agent-14 Job: Close / start sprint](./product-backlog.md#pb-48) | Agent/Feature | - A confirmed request leaves the next sprint in `sprint-backlog.md` and `status.md`. | — | ToDo |


---



## Sprint 10

Sprint Goal: Ethan answers from the guide and the live project files without editing them.

Depends on Sprint 2 (start load) and Sprint 3 (a project to read).

**Status: ToDo**

### ToDo


| # | Code | SBI | Parent PBI | Module/Type | DoD | Related specs | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | feature-01 | What now / what next | [Agent-02 agent ethan — initial capabilities](./product-backlog.md#pb-7) | Agent/Feature | - A chat turn answers from the guide plus backlog and sprint backlog, without writing files. | — | ToDo |
| 2 | feature-02 | Coaching answer cites the guide | [Agent-05 agent ethan — knowledgeable coach](./product-backlog.md#pb-10) | Agent/Feature | - A coaching question is answered with a citation and no invented process rule. | — | ToDo |
| 3 | feature-03 | Free-form chat stays inside the harness | [Agent-06 agent ethan — chat](./product-backlog.md#pb-11) | Agent/Feature | - A turn that is not an event verb still gets a useful reply and does not edit files. | — | ToDo |


---



## Sprint 11

Sprint Goal: The three harness rules install and are named in constants.md.

Depends on Sprint 2 (the pack copy). Does not depend on the scrum jobs.

**Status: ToDo**

### ToDo


| # | Code | SBI | Parent PBI | Module/Type | DoD | Related specs | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | feature-01 | Rule dod.mdc | [Rule-01 Rule: dod.mdc](./product-backlog.md#pb-18) | Rule/Feature | - The file installs under `{client_root}/rules/` and the key is in constants.md. | — | ToDo |
| 2 | feature-02 | Rule incremental-delivery.mdc | [Rule-02 Rule: incremental-delivery.mdc](./product-backlog.md#pb-19) | Rule/Feature | - Same install bar. | — | ToDo |
| 3 | feature-03 | Rule realtime-status.mdc | [Rule-03 Rule: realtime-status.mdc](./product-backlog.md#pb-20) | Rule/Feature | - Same install bar. | — | ToDo |


---



## Sprint 12

Sprint Goal: A feature can be implemented by updating specs, then TDD.

Depends on Sprint 3 (a project) and Sprint 11 (the rules the work follows).

**Status: ToDo**

### ToDo


| # | Code | SBI | Parent PBI | Module/Type | DoD | Related specs | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | feature-01 | Skills sdd-atdd and sdd-tdd | [Skill-01 Skill: sdd-atdd](./product-backlog.md#pb-21) · [Skill-02 Skill: sdd-tdd](./product-backlog.md#pb-22) | Skill/Feature | - Both folders install under `{client_root}/skills/`. | — | ToDo |
| 2 | feature-02 | Skill sdd-update-specs | [Skill-12 Skill: sdd-update-specs](./product-backlog.md#pb-64) | Skill/Feature | - The skill names which spec files to update and does not leave them describing the previous behavior. | — | ToDo |
| 3 | feature-03 | Skill sdd-implement | [Skill-13 Skill: sdd-implement](./product-backlog.md#pb-65) | Skill/Feature | - The skill loads the skills the SBI needs, including spec update and TDD, and finishes that one SBI. | [ADR-066](./adr/ADR-066-sdd-design-before-implementation.md) | ToDo |
| 4 | feature-04 | Install sdd-audit-artifacts | [Skill-10 Skill: sdd-audit-artifacts](./product-backlog.md#pb-30) | Skill/Feature | - The skill installs under `{client_root}/skills/`. - The initial `SKILL.md` is Sprint 3 feature-23. | — | ToDo |


---



## Sprint 13

Sprint Goal: The public instructions page covers call-up, install, the receipt, and the fatal stop.

Depends on Sprint 2 for the behavior the page describes. The page is not required for Sprint 2 to send the URL.

**Status: ToDo**

### ToDo


| # | Code | SBI | Parent PBI | Module/Type | DoD | Related specs | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | feature-01 | Per-client call-up, after research | [Web-portal-01 Instructions: per-client agent call-up](./product-backlog.md#pb-15) | Web-portal/Feature | - The section cites each client's docs. - Cursor `/ethan` and TRAE CN `@` are the known cases. | — | ToDo |
| 2 | feature-02 | Install, receipt, and fatal stop | [Web-portal-02 Instructions: install, receipt, fatal stop](./product-backlog.md#pb-49) | Web-portal/Feature | - A reader can install or update, find the receipt, and see that Ethan stops without a true flag. | — | ToDo |
| 3 | feature-03 | The live site shows that page | [Web-portal-03 Website shows instructions](./product-backlog.md#pb-50) | Web-portal/Feature | - The instructions URL on framework.sdd.works shows this content. - No new portal features. | — | ToDo |


---



## Sprint 14

Sprint Goal: A new project can copy the optional engineering starters: architecture, deployment, and the secrets file.

Depends on Sprint 2 (the pack copy). Does not depend on the scrum jobs.

**Status: ToDo**

### ToDo


| # | Code | SBI | Parent PBI | Module/Type | DoD | Related specs | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | feature-01 | Architecture seed | [Spec-seeds-09 Seed: architecture.md](./product-backlog.md#pb-40) | Framework/Feature | - The user has reviewed and confirmed this seed. - It is stored in the seed tree. - Associated specs are updated. - The whole seed tree has been cross-reviewed and is consistent. | — | ToDo |
| 2 | feature-02 | Deployment seed | [Spec-seeds-10 Seed: deployment.md](./product-backlog.md#pb-41) | Framework/Feature | - The user has reviewed and confirmed this seed. - It is stored in the seed tree. - Associated specs are updated. - The whole seed tree has been cross-reviewed and is consistent. | — | ToDo |
| 3 | feature-03 | Secrets seed | [Spec-seeds-11 Seed: .secrets](./product-backlog.md#pb-66) | Framework/Feature | - The user has reviewed and confirmed this seed. - It is stored in the seed tree. - Associated specs are updated. - The whole seed tree has been cross-reviewed and is consistent. | `[framework.seeds/templates/EN/scrum-in-sdd.md](./framework.seeds/templates/EN/scrum-in-sdd.md)` | ToDo |


---



## Sprint 15

Sprint Goal: Add i18n support, then publish the pack. Locale template bodies are HanS and HanT translations of the EN seeds. [MCP-01](./product-backlog.md#pb-16) go-live copies the finalized seed folder, publishes the five `sdd-mcp` binaries, and syncs the admin portal.

Depends on the EN seeds from earlier sprints. It does not replace those Spec-seeds items. File existence stays on those items. This sprint owns the translated bodies. Go-live starts after those bodies are finalized.

**Status: ToDo**

### ToDo


| # | Code | SBI | Parent PBI | Module/Type | DoD | Related specs | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | feature-01 | Add the HanS guide to the seed tree | [i18n-01 Framework definition locales](./product-backlog.md#pb-67) | i18n/Feature | - `specs/framework.seeds/templates/HanS/scrum-in-sdd.md` matches `~/.cursor/templates/framework.sdd.works/HanS/scrum-in-sdd.md`, including the `sdd-` skill names. | `[framework.seeds/templates/HanS/scrum-in-sdd.md](./framework.seeds/templates/HanS/scrum-in-sdd.md)` | Done |
| 2 | feature-02 | Add the HanT guide to the seed tree | [i18n-01 Framework definition locales](./product-backlog.md#pb-67) | i18n/Feature | - `specs/framework.seeds/templates/HanT/scrum-in-sdd.md` matches the HanT template meaning, including the `sdd-` skill names. | `[framework.seeds/templates/EN/scrum-in-sdd.md](./framework.seeds/templates/EN/scrum-in-sdd.md)` | ToDo |
| 3 | feature-03 | Add the HanS and HanT practices to the seed tree | [i18n-01 Framework definition locales](./product-backlog.md#pb-67) | i18n/Feature | - HanS and HanT practices copies are in the seed tree and match the EN practices on jobs 1 and 2. | `[framework.seeds/templates/EN/sdd-scrum-practices.md](./framework.seeds/templates/EN/sdd-scrum-practices.md)` | ToDo |
| 4 | feature-04 | Translate the five process artifacts | [i18n-02 Process artifact locales](./product-backlog.md#pb-68) | i18n/Feature | - HanS and HanT starters for `product-backlog.md`, `sprint-backlog.md`, `status.md`, `change-log.md`, and `artifacts-map.md` match the EN starters. | [i18n-02](./product-backlog.md#pb-68) | ToDo |
| 5 | feature-05 | Translate the engineering artifacts | [i18n-03 Engineering artifact locales](./product-backlog.md#pb-69) | i18n/Feature | - HanS and HanT starters exist for `architecture.md`, `{model}-stories`, `{model}-design.md`, `{model}-test.md`, `deployment.md`, and `.secrets`, and they match the EN starters. - `.secrets` has no secret values. | [i18n-03](./product-backlog.md#pb-69) | ToDo |
| 6 | feature-06 | Go-live: pack copy, binary releases, admin sync | [MCP-01 Installer: pack allow-list + ledger](./product-backlog.md#pb-16) | MCP/Feature | - The finalized seed folder is copied into the framework pack repo and pushed. - GitHub Releases exist for the five `sdd-mcp` binaries. - The admin portal has synced that pack. | `[framework-design.md](./framework.seeds/framework-design.md#go-live)` · `[status.md](./status.md)` | ToDo |
| 7 | feature-07 | Finalize the three features.md seeds | [Spec-seeds-12 Seeds: features.md at pack root](./product-backlog.md#pb-82) | Framework/Feature | - The user has reviewed and confirmed `features.en.md`, `features.zh-Hans.md`, and `features.zh-Hant.md`. - The three files sit at `content/features/` in the pack repo ([ADR-071](./adr/ADR-071-portal-content-paths.md)). - Associated specs are updated. - Install does not copy them onto `{client_root}`. | [Web-portal-07](./product-backlog.md#pb-73) | ToDo |


