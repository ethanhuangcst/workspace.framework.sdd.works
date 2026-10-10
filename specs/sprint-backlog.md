# sprint-backlog, [framework.sdd.works](http://framework.sdd.works)

> Type: Framework (process) artifact of framework.sdd.works
> as_of: 2026-10-08
> [Definition](../pack.framework.sdd.works/templates/framework.sdd.works/sdd-scrum-practices.md#sprint-backlogmd)

## Current project progress

- Total sprints: 9
- Current WIP sprint: [Sprint 9](#sprint-9)
- Sprint goal: Visitors use the portal at sdd.works and the WordPress learn course at learn.sdd.works; Get secret sits on the Learn tab under the course embed; a pack-driven **Knowledge** tab can browse a folder tree via `internal_page_folder` ([Web-portal-36](./product-backlog.md#pb-133)).
- Next planned sprint: none (Sprint 9 in progress)



### Index

- [RID Log](#rid-log-risksimpediments-dependencies)
- [Sprint 1](#sprint-1)
- [Sprint 2](#sprint-2)
- [Sprint 3](#sprint-3)
- [Sprint 4](#sprint-4)
- [Sprint 5](#sprint-5)
- [Sprint 6](#sprint-6)
- [Sprint 7](#sprint-7)
- [Sprint 8](#sprint-8)
- [Sprint 9](#sprint-9)
- [Unplanned PBIs](#unplanned-pbis)

---



## RID Log (Risks,Impediments, Dependencies)

[Back to the top](#sprint-backlog-frameworksddworks)

> This section records risks, impediments, and dependencies for the entire project. It does not belong to any sprint.



### Open RIDs


| #   | Severity | Title | Description | Impact | Solution | Related | Created Sprint |
| --- | -------- | ----- | ----------- | ------ | -------- | ------- | -------------- |




### Closed RIDs


| #   | Severity | Title                                     | Description                                                                                                                                                                                                                                                  | Impact                                                                         | Solution                                                                                                                            | Related                                                                                              | Closed Sprint |
| --- | -------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------- |
| D-1 | Blocking | coach-ethan ships as a local Cursor agent | - coach-ethan is a local Cursor agent in the client `agents/` tree. - Remote MCP stays the installer.                                                                                                                                                        | Agent-01 is delivered. One presence model covers the product and the MVPs.     | Record the local Cursor agent in the framework design. No separate ADR.                                                             | [framework-design.md](./framework/framework-design.md) Design for framework                          | Sprint 1      |
| D-2 | Blocking | Pack copy must use an allow-list          | - The pack tree includes files that are not pack files. - Copying every top-level name onto the client root is wrong.                                                                                                                                        | MCP-01 cannot be delivered, because the install would copy the whole git tree. | Copy the allow-list only, and map `skill` to `skills` and `Rules` to `rules`.                                                       | [mcp-design.md](./mcp/mcp-design.md) MCP design                                                      | Sprint 2      |
| D-3 | Blocking | templates/ has no installer root          | - ADR-056 and MCP-01 need `{client_root}/templates/`. - The seed map has no templates root. - applyPackage copies skills, rules, agents, and workflows only.                                                                                                 | MCP-01 cannot be delivered, because templates have no install path.            | Map `templates/` to `{client_root}/templates/`.                                                                                     | [ADR-056](./adr/ADR-056-single-user-root-framework-pack.md) One framework pack, on the user root     | Sprint 2      |
| R-1 | Medium   | HTTP MCP cannot write local ledger file   | - HTTP MCP cannot write the local `.sdd-installed.json` with `pack_complete: true`. - Skipping that file blocks Ethan's start gate. - stdio (ADR-058) writes the ledger in-process. A ledger baked into the tarball would mark a failed extract as complete. | MCP-01 and Agent-04 cannot be delivered, because Ethan does not start.         | Write the ledger last, after verify, name `manifestPath` in the instructions, and do not commit a true ledger in the pack git tree. | [ADR-058](./adr/ADR-058-stdio-end-user-http-fallback.md) End-user stdio installer with HTTP fallback | Sprint 2      |


---



## Definition of Done

Every sprint item uses the same checklist as Product Backlog items: `[sdd-dod.mdc](../pack.framework.sdd.works/rules/sdd-dod.mdc)` and [Definition of Done in product-backlog.md](./product-backlog.md#definition-of-done). Mark the row **Done** only when every check passes.

Sprints 3 and 4 use this checklist instead:

- Confirmed usable by user
- Whole pack cross-reviewed and updated accordingly
- Reviewed to ensure it follows TRUE AGENT principle

Additional Done Criteria, on top of the Definition of Done, is the check for one row under that sprint. It does not add a table column.

---



## Sprint 1

[Back to the top](#sprint-backlog-frameworksddworks)

Sprint Goal: framework.sdd.works R2 ships an agent spike and POC, with the pack seeds in this repo and ethan callable as a local agent.

**Status: Done** (EN guide and practices confirmed; call-up recorded; Phase 1 archive under `phase1-process-specs/`)

HanS and HanT sit in [Unplanned PBIs](#unplanned-pbis) until scheduled.

### **Done**


| #   | Code             | SBI                                   | Parent PBI                                                                                                                                   | Module/Type             | Related specs                                                                                                                                                                                                                                                                                                                         | Status   |
| --- | ---------------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | feature-04       | Archived Phase 1 Scrum files          | `[phase1-process-specs/](./phase1-process-specs/)`                                                                                           | Framework/Feature       | [artifacts-map.json](../artifacts-map.json)                                                                                                                                                                                                                                                                                           | **Done** |
| 2   | feature-03       | Agent call to ethan                   | [Agent-01 agent ethan: POC](./product-backlog.md#L63)                                                                                        | Agent/Feature           | - [framework/framework-design.md](./framework/framework-design.md) - [D-1](#rid-d1)                                                                                                                                                                                                                                                   | **Done** |
| 3   | feature-01       | Latest guide and practices seeds      | - [Spec-seeds-01 Seed: scrum-in-sdd.md](./product-backlog.md#L227) - [Spec-seeds-02 Seed: sdd-scrum-practices.md](./product-backlog.md#L230) | Framework/Feature       | - [pack.framework.sdd.works/templates/framework.sdd.works/EN/scrum-in-sdd.md](../pack.framework.sdd.works/templates/framework.sdd.works/EN/scrum-in-sdd.md) - [pack.framework.sdd.works/templates/framework.sdd.works/EN/sdd-scrum-practices.md](../pack.framework.sdd.works/templates/framework.sdd.works/EN/sdd-scrum-practices.md) | **Done** |
| 4   | documentation-01 | Process docs pointed at the seed tree | [Spec-seeds-01 Seed: scrum-in-sdd.md](./product-backlog.md#L227)                                                                             | Framework/Documentation | [artifacts-map.json](../artifacts-map.json)                                                                                                                                                                                                                                                                                           | **Done** |




### Retrospective

**Learnings**

#### 1. [Sep 24, 2026], feature-01 done

- [The guide and practices have one authoring place](../pack.framework.sdd.works/templates/framework.sdd.works/EN/sdd-scrum-practices.md)
- `/ethan` [uses Cursor agents trees](./knowledge/agent/cursor-agent-callup.md)
- [A second pack copy in the workspace does not override the user root](./adr/ADR-056-single-user-root-framework-pack.md)



#### 2. [Sep 25, 2026], feature-03 done

- The `/ethan` spike is recorded.



#### 3. [Sep 25, 2026], Sprint-end

- User confirmed the EN guide and practices seeds.
- Cross-review: Sprint 1 seeds match `templates/framework.sdd.works/EN/`. Later sprints own `constants.md`, `.secrets`, empty pack folders, `framework-design.md`, and HanS/HanT.
- Phase 1 archive path is `phase1-process-specs/`.

**Opportunities**

#### 4. [Sep 25, 2026], On demand

- The HanS guide, the HanT guide, and the HanS and HanT practices sit in [Unplanned PBIs](#unplanned-pbis) ([i18n-04](./product-backlog.md#L301), [i18n-05](./product-backlog.md#L301)). `constants.json` is Sprint 2.

**Future actions**

#### 2. [Sep 25, 2026], feature-03 done

- Receipt enforcement stays on Sprint 2.



#### 3. [Sep 25, 2026], Sprint-end

- Start Sprint 2: installer ledger with `pack_complete`, then the ethan start gate.

---



## Sprint 2

[Back to the top](#sprint-backlog-frameworksddworks)

Sprint Goal: Install or update writes the pack and a ledger that lists each pack file (ADR-059), end users connect via a local program (ADR-058) with HTTP as fallback, and Ethan starts only when `pack_complete` is true.

Depends on Sprint 1 only for the seed files already in this repo. It does not wait on a new-project skill.

**Status: Done**

### **Done**


| #   | Code       | SBI                                                  | Parent PBI                                                                            | Module/Type        | Related specs                                                                                                                                                                                                                                                                                                                                                                                                                     | Status   |
| --- | ---------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | feature-14 | Published binary at ~/.sdd/sdd-mcp                   | [MCP-02 Local binary: ~/.sdd/sdd-mcp](./product-backlog.md#L328)                      | MCP/Feature        | - [ADR-051](./adr/ADR-051-zero-dep-stdio-binary.md) - [mcp/mcp-design.md](./mcp/mcp-design.md) §2.1 and §4.1 - [feature-14-zero-dep](../spikes/feature-14-zero-dep/)                                                                                                                                                                                                                                                              | **Done** |
| 2   | feature-13 | One-line setup URL as the copied prompt              | [Web-portal-06 Instructions: MCP auto-connect prompt](./product-backlog.md#L372)      | Web-portal/Feature | [InstructionsPage.test.tsx](../src/components/features/InstructionsPage.test.tsx)                                                                                                                                                                                                                                                                                                                                                 | **Done** |
| 3   | feature-12 | One mcp.json for manual setup                        | [Web-portal-06 Instructions: MCP auto-connect prompt](./product-backlog.md#L372)      | Web-portal/Feature | - [mcp/mcp-design.md](./mcp/mcp-design.md) §2.1 - [ADR-061](./adr/ADR-061-setup-prompt-public-path.md) - [InstructionsPage.tsx](../src/components/features/InstructionsPage.tsx)                                                                                                                                                                                                                                                  | **Done** |
| 4   | feature-11 | One-line setup prompt on the instructions page       | [Web-portal-06 Instructions: MCP auto-connect prompt](./product-backlog.md#L372)      | Web-portal/Feature | - [mcp/mcp-design.md](./mcp/mcp-design.md) §2.1 - [ADR-061](./adr/ADR-061-setup-prompt-public-path.md) - [InstructionsPage.tsx](../src/components/features/InstructionsPage.tsx)                                                                                                                                                                                                                                                  | **Done** |
| 5   | feature-10 | Instructions page re-design                          | [Web-portal-05 Instructions page re-design](./product-backlog.md#L363)                | Web-portal/Feature | - [admin-portal/ui-mockup/01-home.html](./admin-portal/ui-mockup/01-home.html) - [InstructionsPage.tsx](../src/components/features/InstructionsPage.tsx) - [ADR-061](./adr/ADR-061-setup-prompt-public-path.md)                                                                                                                                                                                                                   | **Done** |
| 6   | feature-09 | Unchanged client folder after a failed download      | [MCP-01 Installer: pack allow-list + ledger](./product-backlog.md#L318)               | MCP/Feature        | - [mcp/mcp-stories.md](./mcp/mcp-stories.md) scenario 8 - [mcp/mcp-tests.md](./mcp/mcp-tests.md) C8, P2                                                                                                                                                                                                                                                                                                                           | **Done** |
| 7   | feature-08 | Replaced recorded files and the flag on a new commit | [MCP-01 Installer: pack allow-list + ledger](./product-backlog.md#L318)               | MCP/Feature        | - [mcp/mcp-stories.md](./mcp/mcp-stories.md) scenarios 2, 6b, 7b - [mcp/mcp-tests.md](./mcp/mcp-tests.md) C2, C6b, C7b                                                                                                                                                                                                                                                                                                            | **Done** |
| 8   | feature-07 | Unchanged file bytes on the same commit              | [MCP-01 Installer: pack allow-list + ledger](./product-backlog.md#L318)               | MCP/Feature        | - [mcp/mcp-stories.md](./mcp/mcp-stories.md) scenarios 3, 6a, 7a - [mcp/mcp-tests.md](./mcp/mcp-tests.md) C3, C6a, C7a                                                                                                                                                                                                                                                                                                            | **Done** |
| 9   | feature-06 | Update that deletes recorded pack files only         | [MCP-01 Installer: pack allow-list + ledger](./product-backlog.md#L318)               | MCP/Feature        | - [mcp/mcp-stories.md](./mcp/mcp-stories.md) scenario 5 and AC2b - [mcp/mcp-tests.md](./mcp/mcp-tests.md) C5, C2b - [ADR-059](./adr/ADR-059-ledger-lists-pack-files.md)                                                                                                                                                                                                                                                           | **Done** |
| 10  | feature-05 | Website paste prompt for stdio MCP                   | [Web-portal-04 Agent-setup: stdio prompt + HTTP fallback](./product-backlog.md#L363)  | Web-portal/Feature | - [mcp/mcp-design.md](./mcp/mcp-design.md) §2.1 - [mcp/mcp-stories.md](./mcp/mcp-stories.md) `sdd-mcp-prompt-setup` - [ADR-058](./adr/ADR-058-stdio-end-user-http-fallback.md) - [prompt.md](../public/agent-setup/prompt.md)                                                                                                                                                                                                     | **Done** |
| 11  | feature-04 | Seed constants                                       | [Spec-seeds-03 Seed: constants.json](./product-backlog.md#L234)                       | Framework/Feature  | - [pack.framework.sdd.works/templates/framework.sdd.works/constants.json](../pack.framework.sdd.works/templates/framework.sdd.works/constants.json) - [pack.framework.sdd.works/templates/framework.sdd.works/EN/sdd-scrum-practices.md](../pack.framework.sdd.works/templates/framework.sdd.works/EN/sdd-scrum-practices.md) - [ADR-060](./adr/ADR-060-constants-on-client-root.md) · [ADR-081](./adr/ADR-081-constants-json.md) | **Done** |
| 12  | feature-03 | Ethan start from the ledger only                     | [Agent-04 Agent ethan onboard with pack receipt start gate](./product-backlog.md#L76) | Agent/Feature      | - [framework/framework-design.md](./framework/framework-design.md) §2.4 - [framework/framework-stories.md](./framework/framework-stories.md) - [framework/framework-tests.md](./framework/framework-tests.md) CE-GATE - [pack.framework.sdd.works/agents/ethan.md](../pack.framework.sdd.works/agents/ethan.md)                                                                                                                   | **Done** |
| 13  | feature-02 | ethan.md shipped in the pack                         | [Agent-01 Local Cursor agent](./product-backlog.md#L63)                               | Agent/Feature      | - [framework/framework-design.md](./framework/framework-design.md) - [framework/framework-design.md](./framework/framework-design.md)                                                                                                                                                                                                                                                                                             | **Done** |
| 14  | feature-01 | First install with an allow-list and a file ledger   | [MCP-01 Installer: pack allow-list + ledger](./product-backlog.md#L318)               | MCP/Feature        | - [mcp/mcp-stories.md](./mcp/mcp-stories.md) scenarios 1 and 4 - [mcp/mcp-tests.md](./mcp/mcp-tests.md) C1, C4, P1–P4 - [ADR-057](./adr/ADR-057-install-ledger-pack-complete.md) - [ADR-059](./adr/ADR-059-ledger-lists-pack-files.md)                                                                                                                                                                                            | **Done** |
| 15  | backend-01 | Automatic MCP connection from the one-line prompt    | [Web-portal-06 Instructions: MCP auto-connect prompt](./product-backlog.md#L372)      | MCP/Backend        | - [mcp/mcp-design.md](./mcp/mcp-design.md) §2.1 - [mcp/mcp-stories.md](./mcp/mcp-stories.md) `sdd-mcp-prompt-setup` - [ADR-061](./adr/ADR-061-setup-prompt-public-path.md) - [prompt.md](../public/agent-setup/prompt.md) - [next.config.ts](../next.config.ts)                                                                                                                                                                   | **Done** |




### Retrospective

**Learnings**

#### 1. [Sep 25, 2026], feature-04 done

- [Pack lookup is](./adr/ADR-060-constants-on-client-root.md) `constants.md` [on the client root](./adr/ADR-060-constants-on-client-root.md)
- Writing rules live under Artifacts writing guideline in the EN practices. The seed is not copied into workspace `specs/`.



#### 2. [Sep 26, 2026], feature-14 done

- `npm run mcp:build` and `npm run mcp:place` place `~/.sdd/sdd-mcp`. Stdio uses `createStdioMcpServer` so Prisma stays out of the binary.
- TRAE CN Manage-page MCP is `~/Library/Application Support/Trae CN/User/mcp.json`.
- Ethan confirmed tools/list and `sdd_list_versions` from TRAE CN against a local server.



#### 3. [Sep 26, 2026], feature-12 and feature-13 done

- Manual setup on `/instructions` is one `command` `mcp.json`. The copy-sentence test covers `en`, `zh-Hans`, and `zh-Hant`.



#### 4. [Sep 26, 2026], Sprint-end

- Local reset must keep the seed admin. Playwright must not delete `ADMIN_SEED_EMAIL`. Decision: [ADR-064](./adr/ADR-064-e2e-must-not-wipe-seed-admin.md). Lesson: [web-app-fix-regression](./knowledge/agent/web-app-fix-regression.md).

**Opportunities**

#### 4. [Sep 26, 2026], Sprint-end

- [MCP-01](./product-backlog.md#L318) is **Done** for the Sprint 2 installer slice. [MCP-04](./product-backlog.md#L323) owns go-live.

**Future actions**

#### 4. [Sep 26, 2026], Sprint-end

- Go-live is [MCP-04](./product-backlog.md#L323) in Unplanned PBIs: GitHub Releases for the five `sdd-mcp` binaries, pack copy, and admin-portal sync.

---



## Sprint 3

[Back to the top](#sprint-backlog-frameworksddworks)

Sprint Goal: Update the web portal and MCP to support framework.sdd.works R2.

Depends on Sprint 2.

**Status: Done**

MCP and web-portal rows stay here. A task that only completes another row is not its own increment. task-02 stays: it puts the framework files in the pack.

### **Done**


| #   | Code       | SBI                                          | Parent PBI                                                                                    | Module/Type        | Related specs                                                                                                                                                                                                                                                                                                                                                                                                                                   | Status   |
| --- | ---------- | -------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | feature-19 | Portal catalog with the scrum-in-sdd name    | [Web-portal-12 Instructions tab: sdd-scrum guide](./product-backlog.md#L383)                  | Web-portal/Feature | - [ADR-068](./adr/ADR-068-scrum-in-sdd-filename.md) - [features.en.md](../src/content/features/features.en.md) - [app-design.md](./admin-portal/app-design.md)                                                                                                                                                                                                                                                                                  | **Done** |
| 2   | feature-17 | Get secret on Setup                          | [Web-portal-13 Get secret moves to Setup](./product-backlog.md#L388)                          | Web-portal/Feature | - [ADR-067](./adr/ADR-067-get-secret-on-setup.md) - [app-design.md](./admin-portal/app-design.md) - [13-instructions.html](./admin-portal/ui-mockup/13-instructions.html)                                                                                                                                                                                                                                                                       | **Done** |
| 3   | feature-16 | Guide tab on instructions                    | [Web-portal-12 Instructions tab: Scrum in SDD](./product-backlog.md#L383)                     | Web-portal/Feature | - [scrum-in-sdd.md](../pack.framework.sdd.works/templates/framework.sdd.works/EN/scrum-in-sdd.md) - [app-design.md](./admin-portal/app-design.md) - [app-stories.md](./admin-portal/app-stories.md) AC18                                                                                                                                                                                                                                        | **Done** |
| 4   | feature-10 | Reset success with the previous sentence     | [Web-portal-11 Reset success stays on page with previous sentence](./product-backlog.md#L461) | Web-portal/Feature | - [issues-log.md](./issues-log.md) WA-08 - [issues-log.md](./issues-log.md) WA-10 - [app-stories.md](./admin-portal/app-stories.md) AC4b - [app-design.md](./admin-portal/app-design.md) - [03-reset.html](./admin-portal/ui-mockup/03-reset.html) - [app-tests.md](./admin-portal/app-tests.md)                                                                                                                                                | **Done** |
| 5   | feature-09 | Setup and instructions without the list tool | [MCP-03 MCP tools without sdd_list_versions](./product-backlog.md#L339)                       | MCP/Feature        | - [prompt.md](../public/agent-setup/prompt.md) - [InstructionsPage.tsx](../src/components/features/InstructionsPage.tsx) - [en.json](../messages/en.json) - [zh-Hans.json](../messages/zh-Hans.json) - [zh-Hant.json](../messages/zh-Hant.json)                                                                                                                                                                                                 | **Done** |
| 6   | feature-08 | MCP tools without sdd_list_versions          | [MCP-03 MCP tools without sdd_list_versions](./product-backlog.md#L339)                       | MCP/Feature        | - [ADR-063](./adr/ADR-063-unregister-sdd-list-versions.md) - [mcp/mcp-design.md](./mcp/mcp-design.md) §3 - [mcp/mcp-tests.md](./mcp/mcp-tests.md) - [create-server.ts](../src/mcp/create-server.ts) - [create-server-stdio.ts](../src/mcp/create-server-stdio.ts) - [create-server.test.ts](../src/mcp/create-server.test.ts) - [local-binary.test.ts](../src/mcp/local-binary.test.ts) - [sdd-api.test.ts](../src/app/api/sdd/sdd-api.test.ts) | **Done** |
| 7   | feature-07 | Features tab of synced markdown              | [Web-portal-07 Features tab reads pack features.md](./product-backlog.md#L377)                | Web-portal/Feature | - [Web-portal-07](./product-backlog.md#L377) - [app-design.md](./admin-portal/app-design.md) Features catalog - [app-stories.md](./admin-portal/app-stories.md) AC12–AC16 - [app-tests.md](./admin-portal/app-tests.md)                                                                                                                                                                                                                         | **Done** |
| 8   | feature-05 | One secret value from Get secret             | [Web-portal-08 Instructions page: Get secret](./product-backlog.md#L456)                      | Web-portal/Feature | - [mcp/mcp-stories.md](./mcp/mcp-stories.md) `sdd-mcp-get-key` - [get-key.ts](../src/core/tools/get-key.ts) - [Web-portal-08](./product-backlog.md#L456) - [InstructionsPage.tsx](../src/components/features/InstructionsPage.tsx) - [issues-log.md](./issues-log.md) WA-09 - WA-11                                                                                                                                                             | **Done** |
| 9   | feature-04 | Secret form at the bottom of Features        | [Web-portal-08 Instructions page: Get secret](./product-backlog.md#L419)                      | Web-portal/Feature | - [app-stories.md](./admin-portal/app-stories.md) AC7 - [app-design.md](./admin-portal/app-design.md) `/instructions` - [app-tests.md](./admin-portal/app-tests.md) - [13-instructions.html](./admin-portal/ui-mockup/13-instructions.html)                                                                                                                                                                                                     | **Done** |
| 10  | task-02    | Pack files for the Features tab              | [Web-portal-07 Features tab reads pack features.md](./product-backlog.md#L377)                | Web-portal/Task    | - [mcp/mcp-design.md](./mcp/mcp-design.md) sync cache - [app-design.md](./admin-portal/app-design.md)                                                                                                                                                                                                                                                                                                                                           | **Done** |




### Retrospective

**Learnings**

#### 1. [Sep 26, 2026], feature-07 done

- The page reads the latest unpack first and `src/content/features/` only when that unpack has no English file. That choice is already in [app-design.md](./admin-portal/app-design.md).
- A prose bullet that contains `—` is split into a name and a description. Keep the em dash for `name — description` rows only. See [features-markdown-em-dash](./knowledge/agent/features-markdown-em-dash.md).
- Ethan confirmed the page usable on 2026-09-26 after sync.



#### 2. [Sep 26, 2026], feature-05 done

- Get secret is one feature. The server lookup and the button that shows the value are both feature-05. The old feature-06 row is removed. feature-07 and later codes are unchanged.



#### 3. [Sep 26, 2026], feature-10 done

- Reset success uses the previous `admin.reset.sent` sentence and does not name the address.
- The Get secret result is a code block whose right edge matches the Get secret button. The field stays 32rem and does not shrink.
- A sub-100ms reset `200` means Resend was not called. Playwright must keep the seed admin: [ADR-064](./adr/ADR-064-e2e-must-not-wipe-seed-admin.md).



#### 4. [Sep 26, 2026], feature-08 and feature-09 done

- MCP has no private tool. Unregister `sdd_list_versions`. Keep `listVersions()` and `GET /api/sdd/versions`. Decision: [ADR-063](./adr/ADR-063-unregister-sdd-list-versions.md).
- Cursor loads `tsx src/mcp/stdio.ts`. `~/.sdd/sdd-mcp` stays on the previous tool list until `npm run mcp:build` and `npm run mcp:place`. See [mcp-stdio-source-vs-binary](./knowledge/ops/mcp-stdio-source-vs-binary.md).
- Ethan confirmed both stories usable on 2026-09-26.

**Opportunities**

No opportunity is recorded yet.

**Future actions**

No future action is recorded yet.

---



## Sprint 4

[Back to the top](#sprint-backlog-frameworksddworks)

Sprint Goal: Agent Ethan completes his onboard.

Depends on Sprint 2 (the pack receipt) and Sprint 3 (the portal and MCP surface).

**Status: Done**

The user confirmed Sprint 4 usable on 2026-10-03.

### **Done**

Additional Done Criteria, on top of the Definition of Done:

- `feature-04`: The user has reviewed and confirmed this seed. It is stored in the seed tree. Associated specs are updated. The whole seed tree has been cross-reviewed and is consistent.
- `feature-03`: The project path file is `artifacts-map.json`. There is no template seed. The example lives in `sdd-scrum-practices.md`.
- `feature-27`: The user has reviewed and confirmed this seed. Section rules live in `sdd-scrum-practices.md` as Template and How to write. The live example and the EN seed match those rules.


| #   | Code       | SBI                                                      | Parent PBI                                                                                                                         | Module/Type       | Related specs                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Status      |
| --- | ---------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| 1   | feature-28 | ethan.md that reads the guide and practices for the step | - [Agent-02 Skill call for a named job](./product-backlog.md#L68) - [Agent-01 Local Cursor agent](./product-backlog.md#L63)        | Agent/Feature     | - [ethan.md](../pack.framework.sdd.works/agents/ethan.md) - [scrum-in-sdd.md](../pack.framework.sdd.works/templates/framework.sdd.works/EN/scrum-in-sdd.md) - [sdd-scrum-practices.md](../pack.framework.sdd.works/templates/framework.sdd.works/EN/sdd-scrum-practices.md)                                                                                                                                                                                                                                                                                                                                                               | **Done**    |
| 2   | feature-23 | Initial sdd-audit-artifacts                              | [Skill-08 Skill: sdd-audit-artifacts](./product-backlog.md#L101)                                                                   | Skill/Feature     | - [framework-design.md](./framework/framework-design.md#sdd-audit-artifacts) - [framework-stories.md](./framework/framework-stories.md#sdd-audit-artifacts)                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | **Done**    |
| 3   | feature-18 | Renamed guide file to scrum-in-sdd.md                    | [Spec-seeds-01 Seed: scrum-in-sdd.md](./product-backlog.md#L227)                                                                   | Framework/Feature | - [ADR-068](./adr/ADR-068-scrum-in-sdd-filename.md) - [scrum-in-sdd.md](../pack.framework.sdd.works/templates/framework.sdd.works/EN/scrum-in-sdd.md)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | **Done**    |
| 4   | feature-11 | Updated agent ethan.md with onboard capability           | [Agent-02 Skill call for a named job](./product-backlog.md#L68)                                                                    | Agent/Feature     | - [framework-design.md](./framework/framework-design.md) §2.2 and §2.4 - [ADR-073](./adr/ADR-073-skill-get-status.md)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | **Done**    |
| 5   | feature-04 | Sprint-backlog seed                                      | [Spec-seeds-06 Seed: sprint-backlog.md](./product-backlog.md#L250)                                                                 | Framework/Feature | - [sprint-backlog.md](../pack.framework.sdd.works/templates/framework.sdd.works/EN/sprint-backlog.md) - [sdd-scrum-practices.md](../pack.framework.sdd.works/templates/framework.sdd.works/EN/sdd-scrum-practices.md#sprint-backlogmd) - [framework-design.md](./framework/framework-design.md#sprint-backlogmd) - [seed-artifacts-building-guide.md](./seed-artifacts-building-guide.md)                                                                                                                                                                                                                                                 | **Done**    |
| 6   | feature-27 | Seed status.md                                           | [Spec-seeds-07 Seed: status.md](./product-backlog.md#L252)                                                                         | Framework/Feature | - [status.md](../pack.framework.sdd.works/templates/framework.sdd.works/EN/status.md) - [framework-design.md](./framework/framework-design.md#statusmd) - [sdd-scrum-practices.md](../pack.framework.sdd.works/templates/framework.sdd.works/EN/sdd-scrum-practices.md#statusmd) - [seed-artifacts-building-guide.md](./seed-artifacts-building-guide.md)                                                                                                                                                                                                                                                                                 | **Done**    |
| 7   | feature-29 | Merged agent-design in framework-design                  | [Agent-02 Skill call for a named job](./product-backlog.md#L68)                                                                    | Framework/Task    | [framework-design.md](./framework/framework-design.md)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | **Done**    |
| 8   | feature-03 | Project path file artifacts-map.json                     | [Spec-seeds-04 Seed: artifacts-map.json](./product-backlog.md#L238)                                                                | Framework/Feature | - [ADR-080](./adr/ADR-080-no-artifacts-map-seed.md) - [ADR-082](./adr/ADR-082-artifacts-map-json.md) - [sdd-scrum-practices.md](../pack.framework.sdd.works/templates/framework.sdd.works/EN/sdd-scrum-practices.md#artifacts-mapjson)                                                                                                                                                                                                                                                                                                                                                                                                    | **Done**    |
| 9   | feature-21 | Change-log and issues-log seeds                          | - [Spec-seeds-08 Seed: changes-log.md](./product-backlog.md#L255) - [Spec-seeds-09 Seed: issues-log.md](./product-backlog.md#L258) | Framework/Feature | - [ADR-070](./adr/ADR-070-change-log-and-issues-log.md) - [ADR-075](./adr/ADR-075-issues-log-tables.md) - [changes-log.md](../pack.framework.sdd.works/templates/framework.sdd.works/EN/changes-log.md) - [issues-log.md](../pack.framework.sdd.works/templates/framework.sdd.works/EN/issues-log.md) - [sdd-scrum-practices.md](../pack.framework.sdd.works/templates/framework.sdd.works/EN/sdd-scrum-practices.md#changes-logmd) - [sdd-scrum-practices.md](../pack.framework.sdd.works/templates/framework.sdd.works/EN/sdd-scrum-practices.md#issues-logmd) - [seed-artifacts-building-guide.md](./seed-artifacts-building-guide.md) | **Done**    |
| 10  | feature-30 | Practices job 6 for report status                        | [Skill-12 Skill: sdd-review-status](./product-backlog.md#L113)                                                                     | Skill/Feature     | - [ADR-076](./adr/ADR-076-review-status-one-skill.md) - [sdd-review-status](../pack.framework.sdd.works/skills/sdd-review-status/SKILL.md)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | **Retired** |
| 11  | feature-24 | Skill sdd-review-status                                  | [Skill-12 Skill: sdd-review-status](./product-backlog.md#L113)                                                                     | Skill/Feature     | - [ADR-076](./adr/ADR-076-review-status-one-skill.md) - [ADR-073](./adr/ADR-073-skill-get-status.md) - [sdd-review-status](../pack.framework.sdd.works/skills/sdd-review-status/SKILL.md)                                                                                                                                                                                                                                                                                                                                                                                                                                                 | **Done**    |
| 12  | feature-22 | Rule artifacts-map, retired                              | [ADR-077](./adr/ADR-077-no-artifacts-map-rule.md)                                                                                  | Rule/Feature      | - [ADR-077](./adr/ADR-077-no-artifacts-map-rule.md) - [ADR-072](./adr/ADR-072-rule-artifacts-map.md)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | **Retired** |




### Retrospective

**Learnings**

#### 1. [Oct 1, 2026], feature-27 done

- Section rules for `status.md` live only as Template and How to write in `sdd-scrum-practices.md`. See [seed-artifacts-building-guide.md](./seed-artifacts-building-guide.md).



#### 2. [Oct 1, 2026], feature-04 done

- A section rule lives once in the practices file, as a template plus one note per placeholder. See [seed-artifacts-building-guide.md](./seed-artifacts-building-guide.md).
- A table cell with more than one fact uses `-`  bullets separated by `<br>`. See [markdown-table-cell-bullets](./knowledge/agent/markdown-table-cell-bullets.md).



#### 3. [Oct 3, 2026], Sprint-end

- The AskQuestion pick is the confirmation. The write is one pass after the last pick. See [ADR-083](./adr/ADR-083-review-status-pick-then-one-write.md).
- Numbered job sections in practices repeated skills or were empty. Workflow stays in skills and agent PBIs. See [ADR-084](./adr/ADR-084-practices-no-numbered-jobs.md).
- A handling prompt names the item and the result. See [askquestion-user-view](./knowledge/agent/askquestion-user-view.md).

**Opportunities**

#### 3. [Oct 3, 2026], Sprint-end

- A choice that only the agent can parse gets cancelled. Put the user-view checks in the skill before the first live AskQuestion.

**Future actions**

#### 1. [Oct 1, 2026], feature-27 done

- The HanS and HanT status.md seeds follow when [i18n-02](./product-backlog.md#L299) is scheduled.



#### 2. [Oct 1, 2026], feature-04 done

- The HanS and HanT sprint-backlog seeds follow when [i18n-02](./product-backlog.md#L299) is scheduled.



#### 3. [Oct 3, 2026], Sprint-end

- The Current OGT rows stay ToDo until a later sprint plan assigns them.
- HanS and HanT practices copies stay on [i18n-02](./product-backlog.md#L299) in Unplanned PBIs until scheduled.

---



## Sprint 5

[Back to the top](#sprint-backlog-frameworksddworks)

Sprint Goal: A developer finishes update-project, creates process files, refines the backlog, and plans the next sprint so that the SDD planning loop works on a new project.

Depends on Sprint 4 (agent ethan onboard, process seeds, and review-status skill).

**Status: Done**

The user confirmed Sprint 5 usable on 2026-10-05.

### **Done**


| #   | Code       | SBI                      | Parent PBI                                                         | Module/Type   | Related specs                                                                                                                                                                                                                          | Status   |
| --- | ---------- | ------------------------ | ------------------------------------------------------------------ | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | feature-31 | Skill sdd-update-project | [Skill-03 Pack skill sdd-update-project](./product-backlog.md#L89) | Skill/Feature | - [Agent-02](./product-backlog.md#L68) - [ADR-079](./adr/ADR-079-one-job-update-project.md) - [sdd-update-project](../pack.framework.sdd.works/skills/sdd-update-project/SKILL.md)                                                     | **Done** |
| 2   | feature-32 | Skill sdd-refine-backlog | [Skill-04 Pack skill sdd-refine-backlog](./product-backlog.md#L92) | Skill/Feature | - [Agent-02](./product-backlog.md#L68) - [sdd-refine-backlog](../pack.framework.sdd.works/skills/sdd-refine-backlog/SKILL.md)                                                                                                          | **Done** |
| 3   | feature-33 | Skill sdd-plan-sprint    | [Skill-05 Pack skill sdd-plan-sprint](./product-backlog.md#L94)    | Skill/Feature | - [Agent-02](./product-backlog.md#L68) - [sdd-plan-sprint](../pack.framework.sdd.works/skills/sdd-plan-sprint/SKILL.md)                                                                                                                | **Done** |
| 4   | feature-34 | Skill sdd-create-skill   | [Skill-13 Pack skill sdd-create-skill](./product-backlog.md#L115)  | Skill/Feature | - [ADR-074](./adr/ADR-074-sdd-create-skill.md) - [ADR-092](./adr/ADR-092-pack-authoring-skill-sdd-prefix.md) - [sdd-create-skill](../pack.framework.sdd.works/skills/sdd-create-skill/SKILL.md)                                        | **Done** |
| 5   | feature-35 | Skill sdd-build-agent    | [Skill-15 Pack skill sdd-build-agent](./product-backlog.md#L126)   | Skill/Feature | - [ADR-092](./adr/ADR-092-pack-authoring-skill-sdd-prefix.md) - [framework-design § sdd-build-agent](./framework/framework-design.md#sdd-build-agent) - [sdd-build-agent](../pack.framework.sdd.works/skills/sdd-build-agent/SKILL.md) | **Done** |
| 6   | feature-36 | Skill sdd-create-rule    | [Skill-16 Pack skill sdd-create-rule](./product-backlog.md#L130)   | Skill/Feature | - [ADR-092](./adr/ADR-092-pack-authoring-skill-sdd-prefix.md) - [sdd-create-rule](../pack.framework.sdd.works/skills/sdd-create-rule/SKILL.md) - [framework-design § sdd-create-rule](./framework/framework-design.md#sdd-create-rule) | **Done** |




### Retrospective

**Learnings**

#### 1. [Oct 5, 2026], Sprint-end

- The planning loop (update-project, refine-backlog, plan-sprint) ran on this repo in one session after Sprint 5 was scheduled.
- Pack authoring skills use install folder names from [ADR-089](./adr/ADR-089-pack-authoring-skill-names.md); constants keys stay `skill_*`.

**Opportunities**

#### 1. [Oct 5, 2026], Sprint-end

- [CE-SKILL-07](./framework/framework-tests.md) still assumes `sdd-refine-backlog` has no seed. Add L1 cases for update-project, refine-backlog, and plan-sprint.

**Future actions**

#### 1. [Oct 5, 2026], Sprint-end

- Refresh Agent-02 Epic closure when Skill-06 and Skill-07 ship.
- Remove legacy duplicate seed folders after install paths are verified.

---



## Sprint 6

[Back to the top](#sprint-backlog-frameworksddworks)

Sprint Goal: A developer runs the full Scrum-in-SDD process on a new project with pack rules, the remaining process skills, and EN seeds for the five process files.

Depends on Sprint 5 (planning loop and pack authoring skills).

**Status: Done**

The user confirmed every Sprint 6 SBI usable and the sprint goal on 2026-10-05.

### **Done**

Additional Done Criteria, on top of the Definition of Done:

- `task-01`: The five EN process seeds match practices Template and How to write. Live process files follow the same rules. Associated specs were updated where review found drift. Link audit and CE-TPL-01, CE-TPL-04, CE-TPL-08 through CE-TPL-11 passed for this scope.


| #   | Code       | SBI                                    | Parent PBI                                                                  | Module/Type       | Related specs                                                                                                                                                                                                                                                                   | Status   |
| --- | ---------- | -------------------------------------- | --------------------------------------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | feature-38 | Pack rule sdd-incremental-delivery.mdc | [Rule-02 Pack rule sdd-incremental-delivery.mdc](./product-backlog.md#L204) | Rule/Feature      | [Spec-seeds-03 Seed constants.json](./product-backlog.md#L234)                                                                                                                                                                                                                  | **Done** |
| 2   | feature-39 | Retire realtime-status (Option C)      | [Rule-03 Pack rule realtime-status.mdc](./product-backlog.md#L206)          | Rule/Feature      | [ADR-091](./adr/ADR-091-retire-realtime-status-rule.md): rule removed; `sdd-dod.mdc` owns `status.md` on close. Parent PBI stays **Retired**.                                                                                                                                   | **Done** |
| 3   | feature-41 | Retire sdd-close-sprint (Skill-07)     | [Skill-07 Pack skill sdd-close-sprint](./product-backlog.md#L99)            | Skill/Feature     | [ADR-076](./adr/ADR-076-review-status-one-skill.md): no `sdd-close-sprint` seed; sprint open/close stays in practices and planning skills. Parent PBI **Retired**.                                                                                                              | **Done** |
| 4   | feature-43 | Pack rule sdd-realtime-status.mdc      | [Rule-03 Pack rule sdd-realtime-status.mdc](./product-backlog.md#L206)      | Rule/Feature      | [ADR-096](./adr/ADR-096-sdd-realtime-status-rule-name.md) - [Spec-seeds-03 Seed constants.json](./product-backlog.md#L234)                                                                                                                                                      | **Done** |
| 5   | feature-37 | Pack rule sdd-dod.mdc                  | [Rule-01 Pack rule sdd-dod.mdc](./product-backlog.md#L202)                  | Rule/Feature      | [Spec-seeds-03 Seed constants.json](./product-backlog.md#L234)                                                                                                                                                                                                                  | **Done** |
| 6   | feature-40 | Skill sdd-retrospective                | [Skill-06 Pack skill sdd-retrospective](./product-backlog.md#L96)           | Skill/Feature     | [Agent-02 Skill call for a named job](./product-backlog.md#L68)                                                                                                                                                                                                                 | **Done** |
| 7   | feature-42 | Seed product-backlog.md                | [Spec-seeds-05 Seed product-backlog.md](./product-backlog.md#L247)          | Framework/Feature | - [MCP-01 Installer allow-list and file ledger](./product-backlog.md#L318) - [i18n-02 HanS and HanT process artifacts](./product-backlog.md#L299) - [product-backlog.md seed](../pack.framework.sdd.works/templates/framework.sdd.works/EN/product-backlog.md)                  | **Done** |
| 8   | task-01    | Cross-review five process file seeds   | [Spec-seeds-06 Seed sprint-backlog.md](./product-backlog.md#L250)           | Framework/Task    | - [seed-artifacts-building-guide.md](./seed-artifacts-building-guide.md) - [Spec-seeds-05](./product-backlog.md#L247) - [Spec-seeds-07](./product-backlog.md#L252) - [Spec-seeds-08](./product-backlog.md#L255) - [Spec-seeds-09 Seed issues-log.md](./product-backlog.md#L258) | **Done** |




### Retrospective

**Learnings**

#### 1. [Oct 5, 2026], feature-38 Pack rule sdd-incremental-delivery.mdc done, feature-39 Retire realtime-status (Option C) done, feature-41 Retire sdd-close-sprint (Skill-07) done, feature-43 Pack rule sdd-realtime-status.mdc done

- Harness rules use the `sdd-` prefix and `constants.json` keys `dod`, `incremental-delivery`, and `realtime-status` ([ADR-094](./adr/ADR-094-sdd-prefix-framework-rules.md), [ADR-096](./adr/ADR-096-sdd-realtime-status-rule-name.md)).
- Unprefixed `realtime-status.mdc` stays retired; WIP sync is `sdd-realtime-status.mdc` ([ADR-091](./adr/ADR-091-retire-realtime-status-rule.md), [ADR-093](./adr/ADR-093-keep-update-wip-rule.md)).
- `sdd-close-sprint` does not ship; Skill-07 is retired ([ADR-076](./adr/ADR-076-review-status-one-skill.md)).
- Closing SBIs from status review alone skipped the retrospective gate until catch-up ([dod-retrospective-before-sbi-done](./knowledge/agent/dod-retrospective-before-sbi-done.md)).



#### 2. [Oct 5, 2026], feature-42 Seed product-backlog.md done

- The EN [product-backlog.md](../pack.framework.sdd.works/templates/framework.sdd.works/EN/product-backlog.md) seed is a placeholder template; `sdd-update-project` copies it only when the target is missing.
- The seed matches [framework-stories AC1](./framework/framework-stories.md) column order and Requirements link pattern. Five sections: Product overview, additional DoD, Requirements, Product Backlog, Change record.



#### 3. [Oct 5, 2026], feature-37 Pack rule sdd-dod.mdc done, feature-40 Skill sdd-retrospective done

- `[sdd-dod.mdc](../pack.framework.sdd.works/rules/sdd-dod.mdc)` is the pack close gate; `constants.json` key `dod` points at that file ([ADR-094](./adr/ADR-094-sdd-prefix-framework-rules.md)).
- `[sdd-retrospective](../pack.framework.sdd.works/skills/sdd-retrospective/SKILL.md)` runs before SBI or PBI **Done** writes and appends Learnings, Opportunities, and Future actions with incident triggers ([ADR-097](./adr/ADR-097-done-runs-retrospective.md)).



#### 4. [Oct 5, 2026], feature-42 Seed product-backlog.md done

- User re-confirmed usable after Sprint 6 set [feature-42](./sprint-backlog.md#sprint-6) **WIP** again when [feature-37](./sprint-backlog.md#sprint-6) and [feature-40](./sprint-backlog.md#sprint-6) closed.
- Sprint DoD links [Definition of Done](./product-backlog.md#definition-of-done) per [ADR-098](./adr/ADR-098-sprint-backlog-dod-link-product-backlog.md). EN seed matches [process-artifacts](./framework/framework-stories.md#process-artifacts) AC1. [i18n-02](./product-backlog.md#L299) is **Retired**; HanS and HanT process seeds are [i18n-05](./product-backlog.md#L301).



#### 5. [Oct 5, 2026], task-01 Cross-review five process file seeds done

- Live process files and EN seeds were reviewed against `[seed-artifacts-building-guide.md](./seed-artifacts-building-guide.md)` and practices sections for all five artifacts.
- Historical `[changes-log.md](./changes-log.md)` entries may still name retired paths; new edits use current seeds and `[artifacts-map.json](../artifacts-map.json)`.



#### 6. [Oct 5, 2026], Sprint-end

- Sprint 6 delivered pack close and WIP rules ([Rule-01](./product-backlog.md#L202)–[Rule-03](./product-backlog.md#L206)), [Skill-06](./product-backlog.md#L96) with auto-run retrospective ([ADR-097](./adr/ADR-097-done-runs-retrospective.md)), and EN process artifact seeds plus [task-01](./sprint-backlog.md#sprint-6) cross-review.
- [Skill-07](./product-backlog.md#L99) stays **Retired**; sprint open and close stay in practices and planning skills ([ADR-076](./adr/ADR-076-review-status-one-skill.md)).

**Opportunities**

#### 1. [Oct 5, 2026], feature-38 Pack rule sdd-incremental-delivery.mdc done, feature-39 Retire realtime-status (Option C) done, feature-41 Retire sdd-close-sprint (Skill-07) done, feature-43 Pack rule sdd-realtime-status.mdc done

- **sdd-review-status** can name **sdd-retrospective** before any pick that sets an SBI to **Done**.

**Future actions**

#### 1. [Oct 5, 2026], feature-38 Pack rule sdd-incremental-delivery.mdc done, feature-39 Retire realtime-status (Option C) done, feature-41 Retire sdd-close-sprint (Skill-07) done, feature-43 Pack rule sdd-realtime-status.mdc done

- [feature-40 Skill sdd-retrospective](./sprint-backlog.md#sprint-6) is **Done** on the board ([Skill-06](./product-backlog.md#L96)). [CE-SKILL-10](./framework/framework-tests.md) stays open until L1 is recorded.



#### 2. [Oct 5, 2026], feature-37 Pack rule sdd-dod.mdc done, feature-40 Skill sdd-retrospective done

- Run [CE-SKILL-10](./framework/framework-tests.md) in L1 when the sprint needs a recorded pass for the retrospective skill.



#### 3. [Oct 5, 2026], Sprint-end

- Run [CE-SKILL-10](./framework/framework-tests.md) before or during Sprint 7 if a recorded L1 pass for the retrospective skill is still open.

---



## Sprint 7

[Back to the top](#sprint-backlog-frameworksddworks)

Sprint Goal: A developer specifies and builds product work with pack engineering skills and EN engineering artifact seeds.

Depends on Sprint 6 (process loop and process seeds).

**Status: Done**

### **Done**


| #   | Code       | SBI                                      | Parent PBI                                                           | Module/Type       | Related specs                                                                                                                                                                                                                             | Status   |
| --- | ---------- | ---------------------------------------- | -------------------------------------------------------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | task-01    | Story mapping and US/AC writing guidance | [Skill-01 Pack skill atdd-expert](./product-backlog.md#L87)          | Framework/Task    | - [app-stories.md](./admin-portal/app-stories.md) - [sdd-scrum-practices.md](../pack.framework.sdd.works/templates/framework.sdd.works/EN/sdd-scrum-practices.md)                                                                         | **Done** |
| 2   | feature-52 | Skill sdd-atdd                           | [Skill-01 Pack skill atdd-expert](./product-backlog.md#L87)          | Skill/Feature     | —                                                                                                                                                                                                                                         | **Done** |
| 3   | feature-44 | Skill sdd-update-specs                   | [Skill-09 Pack skill sdd-update-specs](./product-backlog.md#L106)    | Skill/Feature     | [Skill-11 Pack skill sdd-spec-to-build](./product-backlog.md#L108)                                                                                                                                                                        | **Done** |
| 4   | feature-46 | Skill improve-prompt                     | [Skill-14 Pack skill improve-prompt](./product-backlog.md#L120)      | Skill/Feature     | [ADR-099](./adr/ADR-099-improve-prompt-skill-name.md), [framework-design § improve-prompt](./framework/framework-design.md#improve-prompt), [improve-prompt](../pack.framework.sdd.works/skills/improve-prompt/SKILL.md), **CE-SKILL-13** | **Done** |
| 5   | feature-47 | Seed architecture.md                     | [Spec-seeds-10 Seed architecture.md](./product-backlog.md#L266)      | Framework/Feature | - [MCP-01](./product-backlog.md#L318) - [i18n-03](./product-backlog.md#L304)                                                                                                                                                              | **Done** |
| 6   | feature-48 | Seed release.md                          | [Spec-seeds-11 Seed release.md](./product-backlog.md#L268)           | Framework/Feature | - [MCP-01](./product-backlog.md#L318) - [release.md seed](../pack.framework.sdd.works/templates/framework.sdd.works/EN/release.md) - [i18n-03](./product-backlog.md#L304)                                                                 | **Done** |
| 7   | feature-50 | Seed test-strategy.md                    | [Spec-seeds-13 Seed test-strategy.md](./product-backlog.md#L274)     | Framework/Feature | - [Spec-seeds-02](./product-backlog.md#L230) - [test-strategy.md seed](../pack.framework.sdd.works/templates/framework.sdd.works/EN/test-strategy.md) - [i18n-03](./product-backlog.md#L304)                                              | **Done** |
| 8   | feature-49 | Seed .secrets                            | [Spec-seeds-12 Seed .secrets](./product-backlog.md#L270)             | Framework/Feature | - [MCP-01](./product-backlog.md#L318) - [.secrets seed](../pack.framework.sdd.works/templates/framework.sdd.works/EN/.secrets) - [i18n-03](./product-backlog.md#L304)                                                                     | **Done** |
| 9   | feature-63 | Pack rule friendly-language.mdc          | [Rule-04 Pack rule friendly-language.mdc](./product-backlog.md#L208) | Rule/Feature      | - [Spec-seeds-03](./product-backlog.md#L234) - [friendly-language.mdc](../pack.framework.sdd.works/rules/friendly-language.mdc) - [framework-design § friendly-language.mdc](./framework/framework-design.md#friendly-languagemdc)        | **Done** |
| 10  | feature-45 | Skill sdd-spec-to-build                  | [Skill-11 Pack skill sdd-spec-to-build](./product-backlog.md#L108)   | Skill/Feature     | - [sdd-spec-to-build/SKILL.md](../pack.framework.sdd.works/skills/sdd-spec-to-build/SKILL.md) - [readiness.md](../pack.framework.sdd.works/skills/sdd-spec-to-build/readiness.md) - [ADR-085](./adr/ADR-085-sdd-spec-to-build.md)         | **Done** |
| 11  | feature-61 | Skill frontend-designer                  | [Skill-17 Pack skill frontend-designer](./product-backlog.md#L134)   | Skill/Feature     | - [ADR-105](./adr/ADR-105-frontend-designer-pack-skill-name.md) - **CE-SKILL-15**                                                                                                                                                         | **Done** |
| 12  | feature-62 | Skill testing-expert                     | [Skill-18 Pack skill testing-expert](./product-backlog.md#L140)      | Skill/Feature     | - [ADR-102](./adr/ADR-102-testing-expert-pack-skill-name.md) - **CE-SKILL-20**                                                                                                                                                            | **Done** |
| 13  | feature-64 | Skill frontend-developer                 | [Skill-19 Pack skill frontend-developer](./product-backlog.md#L150)  | Skill/Feature     | - [ADR-103](./adr/ADR-103-frontend-developer-pack-skill-name.md) - **CE-SKILL-21**                                                                                                                                                        | **Done** |
| 14  | feature-65 | Skill fullstack-engineer                 | [Skill-20 Pack skill fullstack-engineer](./product-backlog.md#L158)  | Skill/Feature     | - [ADR-104](./adr/ADR-104-fullstack-engineer-pack-skill-name.md) - **CE-SKILL-16**                                                                                                                                                        | **Done** |
| 15  | feature-66 | Skill ai-architect                       | [Skill-21 Pack skill ai-architect](./product-backlog.md#L165)        | Skill/Feature     | - **CE-SKILL-17**                                                                                                                                                                                                                         | **Done** |
| 16  | feature-67 | Skill mcp-expert                         | [Skill-22 Pack skill mcp-expert](./product-backlog.md#L174)          | Skill/Feature     | - **CE-SKILL-18**                                                                                                                                                                                                                         | **Done** |
| 17  | feature-68 | Skill rag-expert                         | [Skill-23 Pack skill rag-expert](./product-backlog.md#L182)          | Skill/Feature     | - **CE-SKILL-19**                                                                                                                                                                                                                         | **Done** |




### **WIP**

No open rows.

### **ToDo**

No open rows.

### Retrospective

**Learnings**

#### 1. [Oct 6, 2026], feature-45 Skill sdd-spec-to-build done

- User **close confirm** for the pack seed after engineering-readiness rewrite: [SKILL.md](../pack.framework.sdd.works/skills/sdd-spec-to-build/SKILL.md) and [readiness.md](../pack.framework.sdd.works/skills/sdd-spec-to-build/readiness.md). Readiness mode, applicable jobs (not always seven), flat map paths (`stories.md`, `tests.md`, `design.md`), and triggers such as prepare for implementation.
- Spec phase ends at readiness confirm; implement handoff uses domain skills, not `sdd-build` ([ADR-108](./adr/ADR-108-no-pack-sdd-build-skill.md)). [CE-SKILL-04](./framework/framework-tests.md) matches that handoff.



#### 2. [Oct 5, 2026], feature-52, feature-44, feature-46, feature-47, feature-48, feature-50 done

- User **close confirm** for six Sprint 7 SBIs in one message. **sdd-dod.mdc** **Close confirm** gate landed earlier the same day so agents stop writing **Done** without chat accept.
- [Skill-01](./product-backlog.md#L87), [Skill-09](./product-backlog.md#L106), and [Skill-14](./product-backlog.md#L120) close with their Sprint 7 feature rows. [Skill-11](./product-backlog.md#L108) closed with [feature-45](./sprint-backlog.md#sprint-7) on 2026-10-06.
- EN product-level seeds [architecture.md](../pack.framework.sdd.works/templates/framework.sdd.works/EN/architecture.md), [release.md](../pack.framework.sdd.works/templates/framework.sdd.works/EN/release.md), and [test-strategy.md](../pack.framework.sdd.works/templates/framework.sdd.works/EN/test-strategy.md) match practices `#architecturemd`, `#releasemd`, and test-strategy section. HanS and HanT bodies stay on [i18n-03](./product-backlog.md#L304).



#### 3. [Oct 5, 2026], feature-49 done

- User confirmed the dotenv-shaped EN `[.secrets](../pack.framework.sdd.works/templates/framework.sdd.works/EN/.secrets)` seed usable (`looks good`). No repo under `~/code` had a good `.secrets` example; the seed uses empty `KEY=` lines and `#` comments for where values live.
- [Spec-seeds-12](./product-backlog.md#L270) **Done** with [feature-49](./sprint-backlog.md#sprint-7). Practices `#secrets` documents the shape. No new ADR or knowledge file.



#### 4. [Oct 6, 2026], feature-61, feature-62, feature-64, feature-65, feature-66, feature-67, feature-68 done

- User **close confirm** in one message for seven domain pack skills. Seeds under `pack.framework.sdd.works/skills/` match `framework-design` [§ Pack skill seed catalog](./framework/framework-design.md#pack-skill-seed-catalog) and **CE-SKILL-15** through **CE-SKILL-21**.
- [Skill-17](./product-backlog.md#L134) through [Skill-23](./product-backlog.md#L182) close with their Sprint 7 rows.
- No new ADR or knowledge file. L1 recorded passes for **CE-SKILL-15** through **21** stay optional follow-up per OGT 8.



#### 5. [Oct 6, 2026], Sprint-end

- User confirmed Sprint 7 usable and asked to mark the sprint **Done**. All seventeen SBIs **Done**. Sprint goal met: pack engineering skills and EN engineering artifact seeds shipped for spec-to-build workflows.
- [Sprint 8](./sprint-backlog.md#sprint-8) opens **WIP** with lite install, Ethan, tabs, and Skill-24 (replanned 2026-10-07; MCP-05 and task-03 dropped).

**Future actions**

#### 1. [Oct 5, 2026], feature-52, feature-44, feature-46, feature-47, feature-48, feature-50 done

- Run [CE-SKILL-12](./framework/framework-tests.md), [CE-SKILL-14](./framework/framework-tests.md), and [CE-SKILL-13](./framework/framework-tests.md) in L1 when a recorded pass is still open.

---



## Sprint 8

[Back to the top](#sprint-backlog-frameworksddworks)

Sprint Goal: Ethan routes named jobs and guiding proposals; lite HTTP install ships manifest, links, client receipt, prompt, and copy; instructions tabs come from pack JSON including the Learn Scrum in SDD code tab; sdd-retrospective meets the current pack skill bar.

Depends on Sprint 7 (engineering skills and seeds).

**Status: Done**

### **Done**


| #   | Code       | SBI                                     | Parent PBI                                                                       | Module/Type       | Related specs                                                                                                                                                                                                                            | Status   |
| --- | ---------- | --------------------------------------- | -------------------------------------------------------------------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | feature-53 | Lite install manifest file              | [Spec-seeds-15 Lite install manifest file](./product-backlog.md#L474)            | Framework/Feature | - [ADR-107](./adr/ADR-107-lite-pack-allowlist-filename.md) - [Web-portal-17](./product-backlog.md#L446) - [MCP-07](./product-backlog.md#L325) - **CE-LITE-01**, **CE-LITE-02**                                                           | **Done** |
| 2   | feature-57 | Lite install client receipt             | [Spec-seeds-18 Lite install client receipt](./product-backlog.md#L482)           | Framework/Feature | - [Spec-seeds-15](./product-backlog.md#L474) - [Web-portal-17](./product-backlog.md#L446) - [Web-portal-18](./product-backlog.md#L488) - **CE-LITE-03**, **CE-LITE-04**                                                                  | **Done** |
| 3   | feature-55 | Lite install file links API             | [Web-portal-17 Lite install file links API](./product-backlog.md#L479)           | Webapp/Feature    | - [Spec-seeds-15](./product-backlog.md#L474) - [Spec-seeds-18](./product-backlog.md#L482) - AC19 `[app-stories.md](./admin-portal/app-stories.md)`                                                                                       | **Done** |
| 4   | feature-56 | Lite install prompt and one-line copy   | [Web-portal-18 Lite install prompt and one-line copy](./product-backlog.md#L488) | Webapp/Feature    | - AC20–AC21 `[app-stories.md](./admin-portal/app-stories.md)` - [ADR-061](./adr/ADR-061-setup-prompt-public-path.md)                                                                                                                     | **Done** |
| 5   | feature-58 | Pack instructions tabs JSON             | [Spec-seeds-16 Pack instructions tabs JSON](./product-backlog.md#L277)           | Framework/Feature | - `[.instructions-tabs.json](../pack.framework.sdd.works/content/.instructions-tabs.json)` - [ADR-071](./adr/ADR-071-portal-content-paths.md)                                                                                            | **Done** |
| 6   | feature-59 | Instructions tabs config API            | [Web-portal-24 Instructions tabs config API](./product-backlog.md#L395)          | Webapp/Feature    | - [Spec-seeds-16](./product-backlog.md#L277) - `GET /api/sdd/instructions-tabs`                                                                                                                                                          | **Done** |
| 7   | feature-60 | Dynamic instructions tab UI             | [Web-portal-25 Dynamic instructions tab UI](./product-backlog.md#L400)           | Webapp/Feature    | - [Web-portal-24](./product-backlog.md#L395) - `[InstructionsPage.tsx](../src/components/features/InstructionsPage.tsx)`                                                                                                                 | **Done** |
| 8   | feature-69 | Skill sdd-retrospective                 | [Skill-24 Pack skill sdd-retrospective](./product-backlog.md#L191)               | Skill/Feature     | - `[sdd-retrospective](../pack.framework.sdd.works/skills/sdd-retrospective/SKILL.md)` - **CE-SKILL-10**                                                                                                                                 | **Done** |
| 9   | feature-70 | Learn Scrum in SDD tab                  | [Web-portal-27 Learn Scrum in SDD tab](./product-backlog.md#L404)                | Webapp/Feature    | - [ADR-110](./adr/ADR-110-embedded-external-page-tab.md) - `[LearnScrumEmbedPanel](../src/components/features/LearnScrumEmbedPanel.tsx)`                                                                                                 | **Done** |
| 10  | feature-71 | Content tab heading anchors             | [Web-portal-28 Content tab heading anchors](./product-backlog.md#L413)           | Webapp/Feature    | - [ADR-109](./adr/ADR-109-content-tab-heading-anchors.md) - GitHub-style heading ids in content-tab renderers                                                                                                                            | **Done** |
| 11  | feature-51 | Agent guiding proposals                 | [Agent-03 Guiding proposals from framework knowledge](./product-backlog.md#L73)  | Agent/Feature     | - [coach-knowledge.md](../pack.framework.sdd.works/templates/framework.sdd.works/EN/coach-knowledge.md) - [ADR-106](./adr/ADR-106-coach-knowledge-file.md) - `[ethan.md](../pack.framework.sdd.works/agents/ethan.md)` Guiding proposals | **Done** |
| 12  | task-01    | Complete Agent-02 job index in ethan.md | [Agent-02 Skill call for a named job](./product-backlog.md#L68)                  | Agent/Task        | - `[ethan.md](../pack.framework.sdd.works/agents/ethan.md)` Jobs - `[constants.json](../pack.framework.sdd.works/templates/framework.sdd.works/constants.json)` `skills` keys                                                            | **Done** |
| 13  | feature-81 | Sticky guide header                     | [Web-portal-29 Sticky guide header](./product-backlog.md#pb-126)                 | Webapp/Feature    | - [ADR-111](./adr/ADR-111-guide-header-sticky.md) - `[InstructionsPage.tsx](../src/components/features/InstructionsPage.tsx)` - `[portal.css](../src/styles/portal.css)` `guide-sticky`                                                  | **Done** |




### **WIP**

No open rows.

### Retrospective

**Learnings**

#### 1. [Oct 7, 2026], feature-53 done

- User **close confirm** for the lite allow-list seed: `[lite-pack.allowlist.json](../pack.framework.sdd.works/lite-pack.allowlist.json)`, `[validateLiteInstallManifest](../src/core/seeds/lite-install-manifest.ts)`, and **CE-LITE-01** / **CE-LITE-02** in Vitest.
- Pack repo root copy of the same file is manual go-live; user confirmed that step done. [Spec-seeds-15](./product-backlog.md#L474) stays **ToDo** until [MCP-07](./product-backlog.md#L325) puts the manifest in sync cache and install tarball.
- [Web-portal-17](./product-backlog.md#L446) should reuse the validator when [feature-55](./sprint-backlog.md#sprint-8) ships. No new ADR or knowledge file.



#### 2. [Oct 7, 2026], feature-57 done

- User **close confirm** for lite receipt: `[.sdd-lite-installed.example.json](../pack.framework.sdd.works/.sdd-lite-installed.example.json)`, `[validateLiteInstallReceipt](../src/core/seeds/lite-install-receipt.ts)`, `[planLiteInstallReceipt](../src/core/seeds/lite-install-receipt.ts)`, and **CE-LITE-03** / **CE-LITE-04** in Vitest.
- The example seed stays outside the MCP install allow-list (same pattern as `.sdd-installed.example.json`). Optional mirror under `pack.framework.sdd.works/` in the pack GitHub repo is operator go-live, not a server sync gate.
- [Web-portal-18](./product-backlog.md#L488) Part 1 and the local agent still apply these rules at runtime; no new ADR or knowledge file.



#### 3. [Oct 7, 2026], feature-55 Lite install file links API done, feature-56 Lite install prompt and one-line copy done, feature-58 Pack instructions tabs JSON done, feature-59 Instructions tabs config API done, feature-60 Dynamic instructions tab UI done, feature-69 Skill sdd-retrospective done, feature-70 Learn Scrum in SDD tab done, feature-71 Content tab heading anchors done

- Board Status still said **ToDo** or **WIP** while the routes, seeds, tests, and pack skill were already shipped; close confirm after an evidence check closed the rows. [board-status-lags-shipped-code](./knowledge/agent/board-status-lags-shipped-code.md).



#### 4. [Oct 7, 2026], feature-51 Agent guiding proposals done, task-01 Complete Agent-02 job index in ethan.md done, Sprint-end

- Same-day board refresh after the eight-SBI close landed: `status.md` named the remaining WIP rows in that turn. [board-status-lags-shipped-code](./knowledge/agent/board-status-lags-shipped-code.md).
- Ethan’s Jobs list follows `constants.json` skill keys and Guiding proposals stay a chat-only next action with one coach-knowledge heading. `[ethan.md](../pack.framework.sdd.works/agents/ethan.md)`.

**Opportunities**

#### 3. [Oct 7, 2026], feature-55 Lite install file links API done, feature-56 Lite install prompt and one-line copy done, feature-58 Pack instructions tabs JSON done, feature-59 Instructions tabs config API done, feature-60 Dynamic instructions tab UI done, feature-69 Skill sdd-retrospective done, feature-70 Learn Scrum in SDD tab done, feature-71 Content tab heading anchors done

- When several SBIs ship in one day, refresh `status.md` before the next agent turn so a later agent does not treat shipped work as unstarted.



#### 4. [Oct 7, 2026], feature-51 Agent guiding proposals done, task-01 Complete Agent-02 job index in ethan.md done, Sprint-end

- When a later pack skill is added to `constants.json`, update Ethan’s Jobs bullet in the same change so Agent-02 does not lag the registry.

**Future actions**

#### 3. [Oct 7, 2026], feature-55 Lite install file links API done, feature-56 Lite install prompt and one-line copy done, feature-58 Pack instructions tabs JSON done, feature-59 Instructions tabs config API done, feature-60 Dynamic instructions tab UI done, feature-69 Skill sdd-retrospective done, feature-70 Learn Scrum in SDD tab done, feature-71 Content tab heading anchors done

- At the next Sprint-end, score whether same-day board refreshes after multi-SBI ships landed; inspect the next similar close batch.



#### 4. [Oct 7, 2026], feature-51 Agent guiding proposals done, task-01 Complete Agent-02 job index in ethan.md done, Sprint-end

- At the next similar SBI that adds a `skills` key, inspect whether `ethan.md` Jobs gained a matching bullet in the same change.

---



## Sprint 9

[Back to the top](#sprint-backlog-frameworksddworks)

Sprint Goal: Visitors use the portal at sdd.works and the WordPress learn course at learn.sdd.works; Get secret sits on the Learn tab under the course embed; a pack-driven **Knowledge** tab browses a folder tree via `internal_page_folder` ([Web-portal-36](./product-backlog.md#pb-133)); unified `guide-md-body` styling ([Web-portal-37](./product-backlog.md#pb-134)); approved wordmark and guide hero land in production ([Web-portal-34](./product-backlog.md#pb-131), [Web-portal-35](./product-backlog.md#pb-132)).

Depends on Sprint 8 (Learn embed tab and content tabs).

**Status: WIP**

### **Done**


| #   | Code       | SBI                                             | Parent PBI                                                                                     | Module/Type       | Related specs                                                                                                                                                                                                                                                                                                                                                                      | Status   |
| --- | ---------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | feature-73 | Get secret on Learn Scrum tab                   | [Web-portal-31 Get secret on Learn Scrum tab](./product-backlog.md#pb-128)                     | Webapp/Feature    | - [ADR-115](./adr/ADR-115-get-secret-on-learn-tab.md) - AC31 `[app-stories.md](./admin-portal/app-stories.md)` - [WA-14](./issues-log.md), [WA-15](./issues-log.md) still open                                                                                                                                                                                                     | **Done** |
| 2   | feature-75 | Learn embed loading skeleton                    | [Web-portal-32 Learn embed loading skeleton](./product-backlog.md#pb-129)                      | Webapp/Feature    | - [ADR-118](./adr/ADR-118-learn-embed-loading-skeleton.md) - AC32 `[app-stories.md](./admin-portal/app-stories.md)`                                                                                                                                                                                                                                                                | **Done** |
| 3   | feature-76 | Instructions tab labels in pack JSON            | [Web-portal-33 Instructions tab labels in pack JSON](./product-backlog.md#pb-130)              | Webapp/Feature    | - [ADR-119](./adr/ADR-119-instructions-tab-labels-in-pack-config.md) - AC33 `[app-stories.md](./admin-portal/app-stories.md)`                                                                                                                                                                                                                                                      | **Done** |
| 4   | feature-78 | SDD WORKS wordmark logo                         | [Web-portal-34 SDD WORKS wordmark logo](./product-backlog.md#pb-131)                           | Webapp/Feature    | - [ADR-121](./adr/ADR-121-sdd-works-wordmark-logo.md) - AC35 `[app-stories.md](./admin-portal/app-stories.md)`                                                                                                                                                                                                                                                                     | **Done** |
| 5   | feature-79 | Instructions guide hero and Setup tab           | [Web-portal-35 Instructions guide hero and Setup tab](./product-backlog.md#pb-132)             | Webapp/Feature    | - [ADR-122](./adr/ADR-122-instructions-guide-hero-and-setup-tab.md) - AC36 `[app-stories.md](./admin-portal/app-stories.md)`                                                                                                                                                                                                                                                       | **Done** |
| 6   | feature-86 | Reviewed full pack seeds manifest               | [Spec-seeds-17 Reviewed full pack seeds file](./product-backlog.md#pb-121)                     | Framework/Feature | - `npm run check:pack-seeds` - `[.sdd-installed.example.json](../pack.framework.sdd.works/.sdd-installed.example.json)`                                                                                                                                                                                                                                                            | **Done** |
| 7   | feature-87 | Admin note on Framework page                    | [Web-portal-26 Pack repo file note on Admin Framework](./product-backlog.md#pb-123)            | Webapp/Feature    | - `[src/content/.admin-note.md](../src/content/.admin-note.md)` - `[12-framework.html](./admin-portal/ui-mockup/12-framework.html)` - `[app-tests.md](./admin-portal/app-tests.md)` §28                                                                                                                                                                                            | **Done** |
| 8   | feature-72 | Hostname cutover: portal and learn course       | [Web-portal-30 Portal on sdd.works and course on learn.sdd.works](./product-backlog.md#pb-127) | Webapp/Feature    | - [ADR-127](./adr/ADR-127-public-hostnames-sdd-and-learn.md) - **AC44** `[app-stories.md](./admin-portal/app-stories.md)` - `[app-tests.md](./admin-portal/app-tests.md)` §29 - `[hostname-cutover-inventory.md](./go-live/20261008/hostname-cutover-inventory.md)`                                                                                                                | **Done** |
| 9   | feature-74 | Knowledge tab — browse pack articles in folders | [Web-portal-36 Knowledge tab — browse pack articles in folders](./product-backlog.md#pb-133)   | Webapp/Feature    | - [ADR-124](./adr/ADR-124-internal-page-folder-index-json.md) - [ADR-071](./adr/ADR-071-portal-content-paths.md) - Pack `content/knowledge/` + `.index.json` - `[KnowledgeFolderPanel](../../src/components/features/KnowledgeFolderPanel.tsx)` - AC38 `[app-stories.md](./admin-portal/app-stories.md)` - `[e2e/instructions.spec.ts](../e2e/instructions.spec.ts)`               | **Done** |
| 10  | feature-77 | Same typography for all markdown tabs           | [Web-portal-37 Same look for every markdown tab](./product-backlog.md#pb-134)                  | Webapp/Feature    | - [ADR-123](./adr/ADR-123-unified-guide-markdown-body.md) - [WA-18](./issues-log.md) closed - `[instructions-tabs-dom.ts](../../src/lib/instructions-tabs-dom.ts)` - AC37 `[app-stories.md](./admin-portal/app-stories.md)`                                                                                                                                                        | **Done** |
| 11  | feature-88 | Node.js setup prompt and instructions           | [Web-portal-38 Node.js setup prompt and agent instructions](./product-backlog.md#pb-135)       | Webapp/Feature    | - [ADR-061](./adr/ADR-061-setup-prompt-public-path.md) - `[paste-sentences.json](../public/agent-setup/paste-sentences.json)` - **AC45**–**AC47** `[app-stories.md](./admin-portal/app-stories.md)` - `[app-tests.md](./admin-portal/app-tests.md)` §30                                                                                                                            | **Done** |
| 12  | feature-97 | Visitor locale from browser language            | [Web-portal-39 Visitor locale from browser language](./product-backlog.md#pb-136)              | Webapp/Feature    | - AC51–AC59 `[app-stories.md](./admin-portal/app-stories.md)` - `[app-design.md](./admin-portal/app-design.md)` §8 - `[app-tests.md](./admin-portal/app-tests.md)` §34 - `[locale.ts](../src/lib/locale.ts)`, `[middleware.ts](../src/middleware.ts)`, `[e2e/visitor-locale.spec.ts](../e2e/visitor-locale.spec.ts)`, `[resend.locale.test.ts](../src/mail/resend.locale.test.ts)` | **Done** |
| 13  | feature-82 | Live site serves the pack after Admin sync      | [MCP-07 Go-live](./product-backlog.md#pb-105) **Retired**                                      | MCP/Feature       | - Localhost close 2026-10-10: versions, lite/files, package on port 3040. Commit `3d5880c`. Production check is [task-02 Go-live](./sprint-backlog.md#sprint-9). - `[mcp-tests.md](./mcp/mcp-tests.md#15-feature-82-production-pack-sync)` §15                                                                                                                                                    | **Done** |
| 14  | feature-84 | Operator guide to public URLs after cutover     | [Web-portal-20 Operator guide to public URLs after cutover](./product-backlog.md#pb-106)       | Webapp/Feature    | - [`release.md`](./release.md) §12 - **AC48**–**AC49** [`app-stories.md`](./admin-portal/app-stories.md) - [`app-tests.md`](./admin-portal/app-tests.md) §31–§32 - User doc review close 2026-10-10                                                                                                                                                                              | **Done** |
| 15  | task-01    | Write ADR-132 and sync all specs to the simplified install design                                                 | —                                                                                              | MCP/Task       | - [ADR-132](./adr/ADR-132-simplified-install-root-and-templates.md) partially supersedes [ADR-131](./adr/ADR-131-http-only-install-bundled-fallback.md) for root resolution and templates path. - Sync [mcp-design.md](./mcp/mcp-design.md), [mcp-stories.md](./mcp/mcp-stories.md), [mcp-tests.md](./mcp/mcp-tests.md), [client.paths.md](./mcp/client.paths.md), [framework-design.md](./framework/framework-design.md), [issues-log.md](./issues-log.md) to the simplified design.                                                                                                                                                                           | **Done** |
| 16  | feature-90 | Split the setup backend from the pack install backend into separate modules                                       | [MCP-08 MCP installer rewrite (setup connection only)](./product-backlog.md#pb-137)            | MCP/Feature    | - Setup serving (GET /setup, prompt.md) lives in a module with no pack install logic. - Pack install (install-http.ts) lives in a module with no setup logic. - [mcp-design.md](./mcp/mcp-design.md) §2.1.                                                                                                                                                                                                                                                                                                                                                                                                                                                      | **Done** |
| 17  | feature-91 | Fix setup prompt text: name WorkBuddy, Trae CN paths, current-client-only                                         | [MCP-08 MCP installer rewrite (setup connection only)](./product-backlog.md#pb-137)            | MCP/Feature    | - [prompt.md](../public/agent-setup/prompt.md) names WorkBuddy and WorkBuddy CN. - Names the Trae CN Application Support path and forbids ~/.trae-cn/mcp.json and ~/.trae/mcp.json for that user list. - Current-client-only rule. - Extends [sdd-api.test.ts](../src/app/api/sdd/sdd-api.test.ts). Closed [MC-10](./issues-log.md), [MC-12](./issues-log.md).                                                                                                                                                                                                                                                                                                  | **Done** |
| 18  | feature-92 | Make the live setup page work: sdd.works/setup returns 200, copy button, no Node card                             | [MCP-08 MCP installer rewrite (setup connection only)](./product-backlog.md#pb-137)            | Webapp/Feature | - Localhost close 2026-10-10; re-smoke live setup after [task-02 Go-live](./sprint-backlog.md#sprint-9). - Closed [WA-21](./issues-log.md), [WA-19](./issues-log.md), [WA-20](./issues-log.md).                                                                                                                                                                                                                                                                                                                                                                    | **Done** |
| 19  | feature-93 | Known client install: server picks the root, templates land at the nested path, tool text says send client and os | [MCP-09 sdd_install_framework and sdd_update_framework re-design](./product-backlog.md#pb-138) | MCP/Feature    | - [install-http.ts](../src/core/tools/install-http.ts) uses the seed-map root for known clients; no agent root detection. - Move pack.framework.sdd.works/templates/* under templates/framework.sdd.works/. - Tool i18n in en.json, zh-Hans.json, zh-Hant.json. - Stories: [mcp-stories.md](./mcp/mcp-stories.md) `sdd-mcp-path-map` AC2, `sdd-mcp-path-detect` story 3, `sdd-mcp-url-plan` AC6/AC11. - Tests: [mcp-tests.md](./mcp/mcp-tests.md#13-mcp-09-install-root) §13 feature-93 rows. - Tests in bundled-pack.test.ts, install.test.ts, tool-descriptions.test.ts. Closed [MC-16](./issues-log.md), [MC-18](./issues-log.md), [MC-15](./issues-log.md). | **Done** |
| 20  | feature-94 | Unknown client install: server returns root_required, agent asks the person, server validates                     | [MCP-09 sdd_install_framework and sdd_update_framework re-design](./product-backlog.md#pb-138) | MCP/Feature    | - [install-http.ts](../src/core/tools/install-http.ts) returns root_required for a client not in the seed map. - Agent asks the person, retries with root, server validates. - Stories: [mcp-stories.md](./mcp/mcp-stories.md) `sdd-mcp-path-map` AC2b/AC2c, `sdd-mcp-cross-client` AC2, `sdd-mcp-path-detect` story 2 AC2/AC3, `sdd-mcp-url-plan` AC6/AC9/AC10/AC11. - Tests: [mcp-tests.md](./mcp/mcp-tests.md#13-mcp-09-install-root) §13 feature-94 rows. - Closed [MC-16](./issues-log.md) unknown-client path.                                                                                                                                            | **Done** |
| 21  | feature-95 | Add the install page at /install that guides the agent through the MCP install sequence                           | [MCP-09 sdd_install_framework and sdd_update_framework re-design](./product-backlog.md#pb-138) | MCP/Feature    | - New public/agent-setup/install-full.md served at GET /install. - GET /setup links to it from an After setup note. - Stories: [mcp-stories.md](./mcp/mcp-stories.md) `sdd-mcp-install` AC8. - Tests: [mcp-tests.md](./mcp/mcp-tests.md#14-feature-95-install-page) §14. - Design: [mcp-design.md](./mcp/mcp-design.md) §2.0 (setup backend owns GET /install), §2.2 Install page. - Closed [MC-17](./issues-log.md).                                                                                                                                                                                                                                           | **Done** |
| 22  | feature-96 | Refresh the sync timestamp when the commit is unchanged                                                           | [MCP-09 sdd_install_framework and sdd_update_framework re-design](./product-backlog.md#pb-138) | MCP/Feature    | - [sync-job.ts](../src/core/sync/sync-job.ts) rewrites syncedAt: now when existing.latestCommit equals commitSha and not force. - Closed [MC-14](./issues-log.md).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | **Done** |




### **WIP**

No open rows.

### **ToDo**


| #   | Code    | SBI     | Parent PBI | Module/Type | Related specs                                                                                                                                                                                                 | Status |
| --- | ------- | ------- | ---------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 1   | task-02 | Go-live | —          | MCP/Task    | - [release.md](./release.md) §7.3 - After deploy, `https://sdd.works/api/sdd/lite/files` returns 200. Versions and package return a real pack commit. [Spec-seeds-15](./product-backlog.md#pb-97) stays **ToDo** until that check passes. | **ToDo** |
| 2   | feature-98 | Manual mcp.json setup guide on the Setup tab | [Web-portal-41 Manual mcp.json setup guide on the Setup tab](./product-backlog.md#pb-140) | Webapp/Feature | - [ADR-122](./adr/ADR-122-instructions-guide-hero-and-setup-tab.md) partly reversed; new ADR at implementation - [`prompt.md`](../public/agent-setup/prompt.md) is the source for the URL and client paths - [`SetupGuidePanel.tsx`](../src/components/features/SetupGuidePanel.tsx) | **ToDo** |


### Retrospective

**Learnings**

#### 1. [Oct 8, 2026], feature-73, feature-75, feature-76, feature-78, feature-79, feature-86 done

- User **close confirm** after Vitest on Learn embed, instructions tabs, and pack-seed link check. [feature-73](./sprint-backlog.md#sprint-9) closed while [WA-14](./issues-log.md) and [WA-15](./issues-log.md) stay open; one §19 CSS unit test still targets a removed selector (`[guide-horizontal-overflow.test.ts](../src/styles/guide-horizontal-overflow.test.ts)`).



#### 2. [Oct 8, 2026], feature-87 done

- User **close confirm** after Admin note modal on Framework. Vitest on resolver, API, and `FrameworkView`; Playwright row in `[settings-framework.spec.ts](../e2e/settings-framework.spec.ts)` was not run in the close session.



#### 3. [Oct 8, 2026], feature-72, feature-74, feature-77, feature-88 done

- Hostname cutover, Knowledge folder browser, unified `guide-md-body`, and Node setup closed together after user **close confirm**; [WA-18](./issues-log.md) closed with [feature-77](./sprint-backlog.md#sprint-9) while [WA-14](./issues-log.md) and [WA-15](./issues-log.md) stay open.



#### 4. [Oct 9, 2026], On demand

- The CodeBuddy install copied the GitHub fixture pack because the writer result named a GitHub release and the dev cache `latestCommit` was `sha-v1.0.0`. [install-writer-fixture-cache.md](./knowledge/agent/install-writer-fixture-cache.md)



#### 5. [Oct 10, 2026], feature-97 done

- User **close confirm** after Vitest on `locale.ts` and middleware, mail locale unit tests, and Playwright in `[visitor-locale.spec.ts](../e2e/visitor-locale.spec.ts)` with per-request `Accept-Language` override (Chromium otherwise sends its own language list).



#### 6. [Oct 10, 2026], feature-82 done

- User accepted localhost curls as close evidence because production deploy waits. [lite-pack-allowlist-is-a-pack-file.md](./knowledge/agent/lite-pack-allowlist-is-a-pack-file.md). Parent [MCP-07](./product-backlog.md#pb-105) stays **ToDo**.



#### 7. [Oct 10, 2026], On demand

- Deferred **close confirm** after ship left [feature-97](./sprint-backlog.md#sprint-9) open until a later chat re-ran visitor-locale tests; the agent had no memory of the first green run. [verify-usable-same-session-as-ship.md](./knowledge/agent/verify-usable-same-session-as-ship.md)



#### 8. [Oct 10, 2026], feature-84 done

- User **close confirm** after reading [`release.md`](./release.md) §12 against **AC48**–**AC49**; §31 production redirect verify stays open until [release.md](./release.md) §7.1 on a live host. [doc-only-sbi-verify-path.md](./knowledge/agent/doc-only-sbi-verify-path.md)



#### 9. [Oct 10, 2026], MCP-08, MCP-09 done

- User applied review-status rows 1–5 after all child SBIs were **Done**; epic rows stayed **ToDo** until this hygiene pass.

**Opportunities**

#### 1. [Oct 8, 2026], feature-73, feature-75, feature-76, feature-78, feature-79, feature-86 done

- Close or refresh open defects before the next multi-SBI batch so SBI **Done** rows do not list open WA ids.



#### 2. [Oct 8, 2026], feature-87 done

- Run the admin-note E2E in CI when the fixture sync job is stable so modal regressions surface before release.



#### 3. [Oct 8, 2026], feature-72, feature-74, feature-77, feature-88 done

- Operator URL runbook ([feature-84](./sprint-backlog.md#sprint-9)) stays one SBI after refine; [Web-portal-22](./product-backlog.md#pb-108) retired as duplicate policy row.



#### 4. [Oct 9, 2026], On demand

- Treat a green temp-cache unit run as short of an install check, because that run never reads the portal `manifest.json` the writer will copy.



#### 5. [Oct 10, 2026], feature-82 done

- When a live-site SBI closes on localhost, leave the parent PBI **ToDo** until the same curls pass on the public host.



#### 6. [Oct 10, 2026], On demand

- Closing an SBI days after ship forces a second verification pass because the agent cannot recall the first session’s test log.



#### 7. [Oct 10, 2026], feature-84 done

- Before **close confirm** on a documentation-only SBI, put deliverable path, AC ids, and doc review steps in the same reply. [doc-only-sbi-verify-path.md](./knowledge/agent/doc-only-sbi-verify-path.md)



#### 8. [Oct 10, 2026], MCP-08, MCP-09 done

- When the last epic child SBI closes, set the parent PBI **Done** in the same review-status pass or name the epic in the mismatch table.

**Future actions**

#### 1. [Oct 8, 2026], feature-73, feature-75, feature-76, feature-78, feature-79, feature-86 done

- At the next touch on Learn secret CSS, align §19 tests with ADR-117 markup and re-check [WA-14](./issues-log.md) / [WA-15](./issues-log.md) in a real browser.



#### 2. [Oct 8, 2026], feature-87 done

- On the next edit to `[content/.admin-note.md](../src/content/.admin-note.md)`, run `npx tsx scripts/sync-admin-note-mockup.mjs` so mockup sample HTML stays aligned.



#### 3. [Oct 8, 2026], feature-72, feature-74, feature-77, feature-88 done

- On the next Learn iframe check in production, confirm WordPress `frame-ancestors` allows `https://sdd.works` per `[hostname-cutover-inventory.md](./go-live/20261008/hostname-cutover-inventory.md)`.



#### 4. [Oct 9, 2026], On demand

- On the next install-path change, confirm production Framework sync ran and portal cache `latestCommit` is not the fixture `sha-v1.0.0` before you treat install as live-pack. Inspect at [feature-82](./sprint-backlog.md#sprint-9).



#### 5. [Oct 10, 2026], feature-97 done

- On the next edit to visitor locale, run `[visitor-locale.spec.ts](../e2e/visitor-locale.spec.ts)` in CI or locally; do not rely on curl alone for **AC52** first paint.



#### 6. [Oct 10, 2026], feature-82 done

- On the next production image, curl `https://sdd.works/api/sdd/lite/files` and close [MCP-07](./product-backlog.md#pb-105) only when that response is 200 JSON.



#### 7. [Oct 10, 2026], On demand

- On the next SBI, ask the agent for a usable check and **close confirm** in the same session as the last implementation commit or green test run.



#### 8. [Oct 10, 2026], feature-84 done

- On the next documentation-only SBI, inspect whether the close thread named file path, AC anchors, and verify steps before the user said usable.

---



## Unplanned PBIs

[Back to the top](#sprint-backlog-frameworksddworks)

> Product backlog items with no sprint assignment. The table matches the Product Backlog table in `product-backlog.md` without the `Sprint` column. Link each PBI code to `./product-backlog.md#L{line}` on the matching Requirements line. Do not add a `#pb-N` anchor in this file.


| #   | Component | PBI Code                                   | Description                                   | Size          | Related                                                                                                | Status |
| --- | --------- | ------------------------------------------ | --------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------ | ------ |
| 1   | webapp    | [Web-portal-21](./product-backlog.md#L512) | Partner install-first landing (separate site) | Implementable | - [Web-portal-06](./product-backlog.md#pb-72) - AC50 `[app-stories.md](./admin-portal/app-stories.md)` | ToDo   |
| 2   | webapp    | [Web-portal-40](./product-backlog.md#L476) | Setup paste sentence in the visitor locale    | Implementable | - [Web-portal-06](./product-backlog.md#pb-72) - [Web-portal-39](./product-backlog.md#pb-136) - `admin.guide.setup_prompt` | ToDo   |


