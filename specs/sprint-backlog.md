# sprint-backlog, framework.sdd.works

> Type: Framework (process) artifact of framework.sdd.works
> as_of: 2026-10-05
> [Definition](./framework/seeds/templates/EN/sdd-scrum-practices.md#sprint-backlogmd)



## Current project progress

- Total sprints: 8
- Current WIP sprint: [**Sprint 6**](#sprint-6)
- Sprint goal: A developer runs the full Scrum-in-SDD process on a new project with pack rules, the remaining process skills, and EN seeds for the five process files.



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
- [Unplanned PBIs](#unplanned-pbis)

---



## RID Log (Risks,Impediments, Dependencies)

[Back to the top](#sprint-backlog-frameworksddworks)

> This section records risks, impediments, and dependencies for the entire project. It does not belong to any sprint.



### Open RIDs


| #   | Severity | Title                                   | Description                                                                                                                                                                                                                                                  | Impact                                                                         | Solution                                                                                                                            | Related                                                                                              | Created Sprint |
| --- | -------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | -------------- |


### Closed RIDs


| #   | Severity | Title                                     | Description                                                                                           | Impact                                                                     | Solution                                                                | Related                                                                     | Closed Sprint |
| --- | -------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------- |
| <a id="rid-d1"></a>D-1 | Blocking | coach-ethan ships as a local Cursor agent | - coach-ethan is a local Cursor agent in the client `agents/` tree. - Remote MCP stays the installer. | Agent-01 is delivered. One presence model covers the product and the MVPs. | Record the local Cursor agent in the framework design. No separate ADR. | [framework-design.md](./framework/framework-design.md) Design for framework | Sprint 1      |
| D-2 | Blocking | Pack copy must use an allow-list | - The pack tree includes files that are not pack files. - Copying every top-level name onto the client root is wrong. | MCP-01 cannot be delivered, because the install would copy the whole git tree. | Copy the allow-list only, and map `skill` to `skills` and `Rules` to `rules`. | [mcp-design.md](./mcp/mcp-design.md) MCP design | Sprint 2 |
| D-3 | Blocking | templates/ has no installer root | - ADR-056 and MCP-01 need `{client_root}/templates/`. - The seed map has no templates root. - applyPackage copies skills, rules, agents, and workflows only. | MCP-01 cannot be delivered, because templates have no install path. | Map `templates/` to `{client_root}/templates/`. | [ADR-056](./adr/ADR-056-single-user-root-framework-pack.md) One framework pack, on the user root | Sprint 2 |
| R-1 | Medium | HTTP MCP cannot write local ledger file | - HTTP MCP cannot write the local `.sdd-installed.json` with `pack_complete: true`. - Skipping that file blocks Ethan's start gate. - stdio (ADR-058) writes the ledger in-process. A ledger baked into the tarball would mark a failed extract as complete. | MCP-01 and Agent-04 cannot be delivered, because Ethan does not start. | Write the ledger last, after verify, name `manifestPath` in the instructions, and do not commit a true ledger in the pack git tree. | [ADR-058](./adr/ADR-058-stdio-end-user-http-fallback.md) End-user stdio installer with HTTP fallback | Sprint 2 |


---



## Definition of Done

Every sprint item uses this checklist. Mark the row `Done` only when every check passes.

- Follow rule DoD
- Feature confirmed usable by user
- Acceptance criteria (story mapping spec names with links) passed
- Quality meets the test specs:
  - [agent test](./framework/framework-tests.md)
  - [MCP test](./mcp/mcp-tests.md)
  - [portal test](./admin-portal/app-tests.md)

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


| #   | Code             | SBI                                   | Parent PBI                                                                                                                                     | Module/Type             | Related specs                                                                                                                                                                                                   | Status   |
| --- | ---------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | feature-04       | Archived Phase 1 Scrum files          | [`phase1-process-specs/`](./phase1-process-specs/)                                                                               | Framework/Feature       | [artifacts-map.md](./artifacts-map.md)                                                                                                                                                                          | **Done** |
| 2   | feature-03       | Agent call to ethan                   | [Agent-01 agent ethan: POC](./product-backlog.md#pb-6)                                                                                         | Agent/Feature           | - [framework/framework-design.md](./framework/framework-design.md) - [D-1](#rid-log-risksimpediments-dependencies)                                                                                              | **Done** |
| 3   | feature-01       | Latest guide and practices seeds      | - [Spec-seeds-01 Seed: scrum-in-sdd.md](./product-backlog.md#pb-33) - [Spec-seeds-02 Seed: sdd-scrum-practices.md](./product-backlog.md#pb-34) | Framework/Feature       | - [framework/seeds/templates/EN/scrum-in-sdd.md](./framework/seeds/templates/EN/scrum-in-sdd.md) - [framework/seeds/templates/EN/sdd-scrum-practices.md](./framework/seeds/templates/EN/sdd-scrum-practices.md) | **Done** |
| 4   | documentation-01 | Process docs pointed at the seed tree | [Spec-seeds-01 Seed: scrum-in-sdd.md](./product-backlog.md#pb-33)                                                                              | Framework/Documentation | [artifacts-map.md](./artifacts-map.md)                                                                                                                                                                          | **Done** |




### Retrospective

**Learnings**

#### 1. [Sep 24, 2026], feature-01 done

- [The guide and practices have one authoring place](./framework/seeds/templates/EN/sdd-scrum-practices.md)
- `/ethan` [uses Cursor agents trees](./knowledge/agent/cursor-agent-callup.md)
- [A second pack copy in the workspace does not override the user root](./adr/ADR-056-single-user-root-framework-pack.md)



#### 2. [Sep 25, 2026], feature-03 done

- The `/ethan` spike is recorded.



#### 3. [Sep 25, 2026], Sprint-end

- User confirmed the EN guide and practices seeds.
- Cross-review: Sprint 1 seeds match `templates/EN/`. Later sprints own `constants.md`, `.secrets`, empty pack folders, `framework-design.md`, and HanS/HanT.
- Phase 1 archive path is `phase1-process-specs/`.

**Opportunities**

#### 4. [Sep 25, 2026], On demand

- The HanS guide, the HanT guide, and the HanS and HanT practices are [Sprint 15](#sprint-15). `constants.md` is Sprint 2.

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


| #   | Code       | SBI                                                  | Parent PBI                                                                            | Module/Type        | Related specs                                                                                                                                                                                                                                                                              | Status   |
| --- | ---------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| 1   | feature-14 | Published binary at ~/.sdd/sdd-mcp                   | [MCP-02 Local binary: ~/.sdd/sdd-mcp](./product-backlog.md#pb-75)                     | MCP/Feature        | - [ADR-051](./adr/ADR-051-zero-dep-stdio-binary.md) - [mcp/mcp-design.md](./mcp/mcp-design.md) §2.1 and §4.1 - [feature-14-zero-dep](../spikes/feature-14-zero-dep/)                                                                                                                       | **Done** |
| 2   | feature-13 | One-line setup URL as the copied prompt              | [Web-portal-06 Instructions: MCP auto-connect prompt](./product-backlog.md#pb-72)     | Web-portal/Feature | [InstructionsPage.test.tsx](../src/components/features/InstructionsPage.test.tsx)                                                                                                                                                                                                          | **Done** |
| 3   | feature-12 | One mcp.json for manual setup                        | [Web-portal-06 Instructions: MCP auto-connect prompt](./product-backlog.md#pb-72)     | Web-portal/Feature | - [mcp/mcp-design.md](./mcp/mcp-design.md) §2.1 - [ADR-061](./adr/ADR-061-setup-prompt-public-path.md) - [InstructionsPage.tsx](../src/components/features/InstructionsPage.tsx)                                                                                                           | **Done** |
| 4   | feature-11 | One-line setup prompt on the instructions page       | [Web-portal-06 Instructions: MCP auto-connect prompt](./product-backlog.md#pb-72)     | Web-portal/Feature | - [mcp/mcp-design.md](./mcp/mcp-design.md) §2.1 - [ADR-061](./adr/ADR-061-setup-prompt-public-path.md) - [InstructionsPage.tsx](../src/components/features/InstructionsPage.tsx)                                                                                                           | **Done** |
| 5   | feature-10 | Instructions page re-design                          | [Web-portal-05 Instructions page re-design](./product-backlog.md#pb-71)               | Web-portal/Feature | - [admin-portal/ui-mockup/01-home.html](./admin-portal/ui-mockup/01-home.html) - [InstructionsPage.tsx](../src/components/features/InstructionsPage.tsx) - [ADR-061](./adr/ADR-061-setup-prompt-public-path.md)                                                                            | **Done** |
| 6   | feature-09 | Unchanged client folder after a failed download      | [MCP-01 Installer: pack allow-list + ledger](./product-backlog.md#pb-16)              | MCP/Feature        | - [mcp/mcp-stories.md](./mcp/mcp-stories.md) scenario 8 - [mcp/mcp-tests.md](./mcp/mcp-tests.md) C8, P2                                                                                                                                                                                      | **Done** |
| 7   | feature-08 | Replaced recorded files and the flag on a new commit | [MCP-01 Installer: pack allow-list + ledger](./product-backlog.md#pb-16)              | MCP/Feature        | - [mcp/mcp-stories.md](./mcp/mcp-stories.md) scenarios 2, 6b, 7b - [mcp/mcp-tests.md](./mcp/mcp-tests.md) C2, C6b, C7b                                                                                                                                                                       | **Done** |
| 8   | feature-07 | Unchanged file bytes on the same commit              | [MCP-01 Installer: pack allow-list + ledger](./product-backlog.md#pb-16)              | MCP/Feature        | - [mcp/mcp-stories.md](./mcp/mcp-stories.md) scenarios 3, 6a, 7a - [mcp/mcp-tests.md](./mcp/mcp-tests.md) C3, C6a, C7a                                                                                                                                                                       | **Done** |
| 9   | feature-06 | Update that deletes recorded pack files only         | [MCP-01 Installer: pack allow-list + ledger](./product-backlog.md#pb-16)              | MCP/Feature        | - [mcp/mcp-stories.md](./mcp/mcp-stories.md) scenario 5 and AC2b - [mcp/mcp-tests.md](./mcp/mcp-tests.md) C5, C2b - [ADR-059](./adr/ADR-059-ledger-lists-pack-files.md)                                                                                                                      | **Done** |
| 10  | feature-05 | Website paste prompt for stdio MCP                   | [Web-portal-04 Agent-setup: stdio prompt + HTTP fallback](./product-backlog.md#pb-70) | Web-portal/Feature | - [mcp/mcp-design.md](./mcp/mcp-design.md) §2.1 - [mcp/mcp-stories.md](./mcp/mcp-stories.md) `sdd-mcp-prompt-setup` - [ADR-058](./adr/ADR-058-stdio-end-user-http-fallback.md) - [prompt.md](../public/agent-setup/prompt.md)                                                              | **Done** |
| 11  | feature-04 | Seed constants                                       | [Spec-seeds-03 Seed: constants.json](./product-backlog.md#pb-32)                       | Framework/Feature  | - [framework/seeds/templates/constants.json](./framework/seeds/templates/constants.json) - [framework/seeds/templates/EN/sdd-scrum-practices.md](./framework/seeds/templates/EN/sdd-scrum-practices.md) - [ADR-060](./adr/ADR-060-constants-on-client-root.md) · [ADR-081](./adr/ADR-081-constants-json.md) | **Done** |
| 12  | feature-03 | Ethan start from the ledger only                     | [Agent-04 Agent ethan onboard with pack receipt start gate](./product-backlog.md#pb-17)           | Agent/Feature      | - [framework/framework-design.md](./framework/framework-design.md) §2.4 - [framework/framework-stories.md](./framework/framework-stories.md) - [framework/framework-tests.md](./framework/framework-tests.md) CE-GATE - [framework/seeds/agents/ethan.md](./framework/seeds/agents/ethan.md) | **Done** |
| 13  | feature-02 | ethan.md shipped in the pack                         | [Agent-01 Local Cursor agent](./product-backlog.md#pb-6)                     | Agent/Feature      | - [framework/framework-design.md](./framework/framework-design.md) - [framework/framework-design.md](./framework/framework-design.md)                                                                                                                                                      | **Done** |
| 14  | feature-01 | First install with an allow-list and a file ledger   | [MCP-01 Installer: pack allow-list + ledger](./product-backlog.md#pb-16)              | MCP/Feature        | - [mcp/mcp-stories.md](./mcp/mcp-stories.md) scenarios 1 and 4 - [mcp/mcp-tests.md](./mcp/mcp-tests.md) C1, C4, P1–P4 - [ADR-057](./adr/ADR-057-install-ledger-pack-complete.md) - [ADR-059](./adr/ADR-059-ledger-lists-pack-files.md)                                                       | **Done** |
| 15  | backend-01 | Automatic MCP connection from the one-line prompt    | [Web-portal-06 Instructions: MCP auto-connect prompt](./product-backlog.md#pb-72)     | MCP/Backend        | - [mcp/mcp-design.md](./mcp/mcp-design.md) §2.1 - [mcp/mcp-stories.md](./mcp/mcp-stories.md) `sdd-mcp-prompt-setup` - [ADR-061](./adr/ADR-061-setup-prompt-public-path.md) - [prompt.md](../public/agent-setup/prompt.md) - [next.config.ts](../next.config.ts)                            | **Done** |




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

- [MCP-01](./product-backlog.md#pb-16) is **Done** for the Sprint 2 installer slice. [MCP-04](./product-backlog.md#pb-92) owns go-live.

**Future actions**

#### 4. [Sep 26, 2026], Sprint-end

- Go-live is [MCP-04](./product-backlog.md#pb-92) in Unplanned PBIs: GitHub Releases for the five `sdd-mcp` binaries, pack copy, and admin-portal sync.

---



## Sprint 3

[Back to the top](#sprint-backlog-frameworksddworks)

Sprint Goal: Update the web portal and MCP to support framework.sdd.works R2.

Depends on Sprint 2.

**Status: Done**

MCP and web-portal rows stay here. A task that only completes another row is not its own increment. task-02 stays: it puts the framework files in the pack.

### **Done**


| #   | Code       | SBI                                          | Parent PBI                                                                                     | Module/Type        | Related specs                                                                                                                                                                                                                                                                                                                                                                                                                                 | Status   |
| --- | ---------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | feature-19 | Portal catalog with the scrum-in-sdd name    | [Web-portal-12 Instructions tab: sdd-scrum guide](./product-backlog.md#pb-81)                  | Web-portal/Feature | - [ADR-068](./adr/ADR-068-scrum-in-sdd-filename.md) - [features.en.md](../src/content/features/features.en.md) - [app-design.md](./admin-portal/app-design.md)                                                                                                                                                                                                                                                                                | **Done** |
| 2   | feature-17 | Get secret on Setup                          | [Web-portal-13 Get secret moves to Setup](./product-backlog.md#pb-83)                          | Web-portal/Feature | - [ADR-067](./adr/ADR-067-get-secret-on-setup.md) - [app-design.md](./admin-portal/app-design.md) - [13-instructions.html](./admin-portal/ui-mockup/13-instructions.html)                                                                                                                                                                                                                                                                     | **Done** |
| 3   | feature-16 | Guide tab on instructions                    | [Web-portal-12 Instructions tab: Scrum in SDD](./product-backlog.md#pb-81)                     | Web-portal/Feature | - [scrum-in-sdd.md](./framework/seeds/templates/EN/scrum-in-sdd.md) - [app-design.md](./admin-portal/app-design.md) - [app-stories.md](./admin-portal/app-stories.md) AC18                                                                                                                                                                                                                                                                    | **Done** |
| 4   | feature-10 | Reset success with the previous sentence     | [Web-portal-11 Reset success stays on page with previous sentence](./product-backlog.md#pb-79) | Web-portal/Feature | - [issues-log.md](./issues-log.md) WA-08 - [issues-log.md](./issues-log.md) WA-10 - [app-stories.md](./admin-portal/app-stories.md) AC4b - [app-design.md](./admin-portal/app-design.md) - [03-reset.html](./admin-portal/ui-mockup/03-reset.html) - [app-tests.md](./admin-portal/app-tests.md)                                                                                                                                                                                                      | **Done** |
| 5   | feature-09 | Setup and instructions without the list tool | [MCP-03 MCP tools without sdd_list_versions](./product-backlog.md#pb-78)                       | MCP/Feature        | - [prompt.md](../public/agent-setup/prompt.md) - [InstructionsPage.tsx](../src/components/features/InstructionsPage.tsx) - [en.json](../messages/en.json) - [zh-Hans.json](../messages/zh-Hans.json) - [zh-Hant.json](../messages/zh-Hant.json)                                                                                                                                                                                               | **Done** |
| 6   | feature-08 | MCP tools without sdd_list_versions          | [MCP-03 MCP tools without sdd_list_versions](./product-backlog.md#pb-78)                       | MCP/Feature        | - [ADR-063](./adr/ADR-063-unregister-sdd-list-versions.md) - [mcp/mcp-design.md](./mcp/mcp-design.md) §3 - [mcp/mcp-tests.md](./mcp/mcp-tests.md) - [create-server.ts](../src/mcp/create-server.ts) - [create-server-stdio.ts](../src/mcp/create-server-stdio.ts) - [create-server.test.ts](../src/mcp/create-server.test.ts) - [local-binary.test.ts](../src/mcp/local-binary.test.ts) - [sdd-api.test.ts](../src/app/api/sdd/sdd-api.test.ts) | **Done** |
| 7   | feature-07 | Features tab of synced markdown              | [Web-portal-07 Features tab reads pack features.md](./product-backlog.md#pb-73)                | Web-portal/Feature | - [product-backlog.md](./product-backlog.md#pb-73) - [app-design.md](./admin-portal/app-design.md) Features catalog - [app-stories.md](./admin-portal/app-stories.md) AC12–AC16 - [app-tests.md](./admin-portal/app-tests.md)                                                                                                                                                                                                                   | **Done** |
| 8   | feature-05 | One secret value from Get secret             | [Web-portal-08 Instructions page: Get secret](./product-backlog.md#pb-74)                      | Web-portal/Feature | - [mcp/mcp-stories.md](./mcp/mcp-stories.md) `sdd-mcp-get-key` - [get-key.ts](../src/core/tools/get-key.ts) - [product-backlog.md](./product-backlog.md#pb-74) - [InstructionsPage.tsx](../src/components/features/InstructionsPage.tsx) - [issues-log.md](./issues-log.md) WA-09 - WA-11                                                                                                                                                     | **Done** |
| 9   | feature-04 | Secret form at the bottom of Features        | [Web-portal-08 Instructions page: Get secret](./product-backlog.md#pb-74)                      | Web-portal/Feature | - [app-stories.md](./admin-portal/app-stories.md) AC7 - [app-design.md](./admin-portal/app-design.md) [instructions](..//instructions) - [app-tests.md](./admin-portal/app-tests.md) - [13-instructions.html](./admin-portal/ui-mockup/13-instructions.html)                                                                                                                                                                                    | **Done** |
| 10  | task-02    | Pack files for the Features tab              | [Web-portal-07 Features tab reads pack features.md](./product-backlog.md#pb-73)                | Web-portal/Task    | - [mcp/mcp-design.md](./mcp/mcp-design.md) sync cache - [app-design.md](./admin-portal/app-design.md)                                                                                                                                                                                                                                                                                                                                         | **Done** |




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


| #   | Code       | SBI                                                      | Parent PBI                                                                                                                                    | Module/Type       | Related specs                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Status   |
| --- | ---------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | feature-28 | ethan.md that reads the guide and practices for the step | - [Agent-02 Skill call for a named job](./product-backlog.md#pb-8) - [Agent-01 Local Cursor agent](./product-backlog.md#pb-6) | Agent/Feature     | - [ethan.md](./framework/seeds/agents/ethan.md) - [scrum-in-sdd.md](./framework/seeds/templates/EN/scrum-in-sdd.md) - [sdd-scrum-practices.md](./framework/seeds/templates/EN/sdd-scrum-practices.md)                                                                                                                                                                                                                                                                                                             | **Done** |
| 2   | feature-23 | Initial sdd-audit-artifacts                              | [Skill-08 Skill: sdd-audit-artifacts](./product-backlog.md#pb-30)                                                                             | Skill/Feature     | - [framework-design.md](./framework/framework-design.md#sdd-audit-artifacts) - [framework-stories.md](./framework/framework-stories.md#sdd-audit-artifacts)                                                                                                                                                                                                                                                                                                                                                       | **Done** |
| 3   | feature-18 | Renamed guide file to scrum-in-sdd.md                    | [Spec-seeds-01 Seed: scrum-in-sdd.md](./product-backlog.md#pb-33)                                                                             | Framework/Feature | - [ADR-068](./adr/ADR-068-scrum-in-sdd-filename.md) - [scrum-in-sdd.md](./framework/seeds/templates/EN/scrum-in-sdd.md)                                                                                                                                                                                                                                                                                                                                                                                           | **Done** |
| 4   | feature-11 | Updated agent ethan.md with onboard capability           | [Agent-02 Skill call for a named job](./product-backlog.md#pb-8)                                                                       | Agent/Feature     | - [framework-design.md](./framework/framework-design.md) §2.2 and §2.4 - [ADR-073](./adr/ADR-073-skill-get-status.md)                                                                                                                                                                                                                                                                                                                                                                                          | **Done** |
| 5   | feature-04 | Sprint-backlog seed                                      | [Spec-seeds-06 Seed: sprint-backlog.md](./product-backlog.md#pb-37)                                                                           | Framework/Feature | - [sprint-backlog.md](./framework/seeds/templates/EN/sprint-backlog.md) - [sdd-scrum-practices.md](./framework/seeds/templates/EN/sdd-scrum-practices.md#sprint-backlogmd) - [framework-design.md](./framework/framework-design.md#sprint-backlogmd) - [seed-artifacts-building-guide.md](./seed-artifacts-building-guide.md)                                                                                                                                                                                     | **Done** |
| 6   | feature-27 | Seed status.md                                           | [Spec-seeds-07 Seed: status.md](./product-backlog.md#pb-38)                                                                                   | Framework/Feature | - [status.md](./framework/seeds/templates/EN/status.md) - [framework-design.md](./framework/framework-design.md#statusmd) - [sdd-scrum-practices.md](./framework/seeds/templates/EN/sdd-scrum-practices.md#statusmd) - [seed-artifacts-building-guide.md](./seed-artifacts-building-guide.md)                                                                                                                                                                                                                     | **Done** |
| 7   | feature-29 | Merged agent-design in framework-design                  | [Agent-02 Skill call for a named job](./product-backlog.md#pb-8)                                                                       | Framework/Task    | [framework-design.md](./framework/framework-design.md)                                                                                                                                                                                                                                                                                                                                                                                                                                                            | **Done** |
| 8   | feature-03 | Project path file artifacts-map.json                     | [Spec-seeds-04 Seed: artifacts-map.json](./product-backlog.md#pb-35)                                                                          | Framework/Feature | - [ADR-080](./adr/ADR-080-no-artifacts-map-seed.md) - [ADR-082](./adr/ADR-082-artifacts-map-json.md) - [sdd-scrum-practices.md](./framework/seeds/templates/EN/sdd-scrum-practices.md#artifacts-mapjson)                                                                                                                                                                                                                                                                                                               | **Done** |
| 9   | feature-21 | Change-log and issues-log seeds                          | - [Spec-seeds-08 Seed: changes-log.md](./product-backlog.md#pb-39) - [Spec-seeds-09 Seed: issues-log.md](./product-backlog.md#pb-84)          | Framework/Feature | - [ADR-070](./adr/ADR-070-change-log-and-issues-log.md) - [ADR-075](./adr/ADR-075-issues-log-tables.md) - [changes-log.md](./framework/seeds/templates/EN/changes-log.md) - [issues-log.md](./framework/seeds/templates/EN/issues-log.md) - [sdd-scrum-practices.md](./framework/seeds/templates/EN/sdd-scrum-practices.md#changes-logmd) - [sdd-scrum-practices.md](./framework/seeds/templates/EN/sdd-scrum-practices.md#issues-logmd) - [seed-artifacts-building-guide.md](./seed-artifacts-building-guide.md) | **Done**  |
| 10  | feature-30 | Practices job 6 for report status                        | [Skill-12 Skill: sdd-review-status](./product-backlog.md#pb-86)                                                                               | Skill/Feature     | - [ADR-076](./adr/ADR-076-review-status-one-skill.md) - [sdd-review-status](./framework/seeds/skills/sdd-review-status/SKILL.md)                                                                                                                                                                                                                                                                                                                                                                                  | **Retired** |
| 11  | feature-24 | Skill sdd-review-status                                  | [Skill-12 Skill: sdd-review-status](./product-backlog.md#pb-86)                                                                               | Skill/Feature     | - [ADR-076](./adr/ADR-076-review-status-one-skill.md) - [ADR-073](./adr/ADR-073-skill-get-status.md) - [sdd-review-status](./framework/seeds/skills/sdd-review-status/SKILL.md)                                                                                                                                                                                                                                                                                                                                   | **Done** |
| 12  | feature-22 | Rule artifacts-map, retired                            | [ADR-077](./adr/ADR-077-no-artifacts-map-rule.md)                                                                                 | Rule/Feature      | - [ADR-077](./adr/ADR-077-no-artifacts-map-rule.md) - [ADR-072](./adr/ADR-072-rule-artifacts-map.md)                                                                                                                                                                                                                                                                                                                                                                                                                  | **Retired** |




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

- The HanS and HanT status.md seeds follow when [i18n-02](./product-backlog.md#pb-68) is scheduled.



#### 2. [Oct 1, 2026], feature-04 done

- The HanS and HanT sprint-backlog seeds follow when [i18n-02](./product-backlog.md#pb-68) is scheduled.

#### 3. [Oct 3, 2026], Sprint-end

- The Current OGT rows stay ToDo until a later sprint plan assigns them.
- HanS and HanT practices copies stay on [i18n-02](./product-backlog.md#pb-68) in Unplanned PBIs until scheduled.

---

## Sprint 5

[Back to the top](#sprint-backlog-frameworksddworks)

Sprint Goal: A developer finishes update-project, creates process files, refines the backlog, and plans the next sprint so that the SDD planning loop works on a new project.

Depends on Sprint 4 (agent ethan onboard, process seeds, and review-status skill).

**Status: Done**

The user confirmed Sprint 5 usable on 2026-10-05.

### **Done**


| #   | Code       | SBI                      | Parent PBI                                                                 | Module/Type   | Related specs                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Status   |
| --- | ---------- | ------------------------ | -------------------------------------------------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | feature-31 | Skill sdd-update-project | [Skill-03 Pack skill sdd-update-project](./product-backlog.md#pb-24)       | Skill/Feature | - [Agent-02](./product-backlog.md#pb-8)<br>- [ADR-079](./adr/ADR-079-one-job-update-project.md)<br>- [sdd-update-project](./framework/seeds/skills/sdd-update-project/SKILL.md)                                                                                                                                                                                                                                                                                              | **Done** |
| 2   | feature-32 | Skill sdd-refine-backlog | [Skill-04 Pack skill sdd-refine-backlog](./product-backlog.md#pb-25)       | Skill/Feature | - [Agent-02](./product-backlog.md#pb-8)<br>- [sdd-refine-backlog](./framework/seeds/skills/sdd-refine-backlog/SKILL.md)                                                                                                                                                                                                                                                                                                                                                       | **Done** |
| 3   | feature-33 | Skill sdd-plan-sprint    | [Skill-05 Pack skill sdd-plan-sprint](./product-backlog.md#pb-26)          | Skill/Feature | - [Agent-02](./product-backlog.md#pb-8)<br>- [sdd-plan-sprint](./framework/seeds/skills/sdd-plan-sprint/SKILL.md)                                                                                                                                                                                                                                                                                                                                                           | **Done** |
| 4   | feature-34 | Skill sdd-create-skill   | [Skill-13 Pack skill sdd-create-skill](./product-backlog.md#pb-87)         | Skill/Feature | - [ADR-074](./adr/ADR-074-sdd-create-skill.md)<br>- [ADR-092](./adr/ADR-092-pack-authoring-skill-sdd-prefix.md)<br>- [sdd-create-skill](./framework/seeds/skills/sdd-create-skill/SKILL.md)                                                                                                                                                                                                                                                                                   | **Done** |
| 5   | feature-35 | Skill sdd-build-agent    | [Skill-15 Pack skill sdd-build-agent](./product-backlog.md#pb-93)          | Skill/Feature | - [ADR-092](./adr/ADR-092-pack-authoring-skill-sdd-prefix.md)<br>- [framework-design § sdd-build-agent](./framework/framework-design.md#sdd-build-agent)<br>- [sdd-build-agent](./framework/seeds/skills/sdd-build-agent/SKILL.md)                                                                                                                                                                                                                                          | **Done** |
| 6   | feature-36 | Skill sdd-create-rule    | [Skill-16 Pack skill sdd-create-rule](./product-backlog.md#pb-94)            | Skill/Feature | - [ADR-092](./adr/ADR-092-pack-authoring-skill-sdd-prefix.md)<br>- [sdd-create-rule](./framework/seeds/skills/sdd-create-rule/SKILL.md)<br>- [framework-design § sdd-create-rule](./framework/framework-design.md#sdd-create-rule)                                                                                                                                                                                                                                             | **Done** |

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

**Status: WIP**

The user confirmed [feature-38](./sprint-backlog.md#sprint-6), [feature-39](./sprint-backlog.md#sprint-6), [feature-41](./sprint-backlog.md#sprint-6), [feature-43](./sprint-backlog.md#sprint-6), and [feature-42](./sprint-backlog.md#sprint-6) on 2026-10-05.

### **Done**


| #   | Code       | SBI                                | Parent PBI                                                               | Module/Type  | Related specs                                                     | Status   |
| --- | ---------- | ---------------------------------- | ------------------------------------------------------------------------ | ------------ | ----------------------------------------------------------------- | -------- |
| 1   | feature-38 | Pack rule sdd-incremental-delivery.mdc | [Rule-02 Pack rule sdd-incremental-delivery.mdc](./product-backlog.md#pb-19) | Rule/Feature | [Spec-seeds-03 Seed constants.json](./product-backlog.md#pb-32)  | **Done** |
| 2   | feature-39 | Retire realtime-status (Option C)   | [Rule-03 Pack rule realtime-status.mdc](./product-backlog.md#pb-20)       | Rule/Feature | [ADR-091](./adr/ADR-091-retire-realtime-status-rule.md): rule removed; `sdd-dod.mdc` owns `status.md` on close. Parent PBI stays **Retired**. | **Done** |
| 3   | feature-41 | Retire sdd-close-sprint (Skill-07)                | [Skill-07 Pack skill sdd-close-sprint](./product-backlog.md#pb-29)         | Skill/Feature     | [ADR-076](./adr/ADR-076-review-status-one-skill.md): no `sdd-close-sprint` seed; sprint open/close stays in practices and planning skills. Parent PBI **Retired**. | **Done** |
| 4   | feature-43 | Pack rule sdd-realtime-status.mdc         | [Rule-03 Pack rule sdd-realtime-status.mdc](./product-backlog.md#pb-20)       | Rule/Feature      | [ADR-096](./adr/ADR-096-sdd-realtime-status-rule-name.md)<br>- [Spec-seeds-03 Seed constants.json](./product-backlog.md#pb-32)                                                                                                                                                                                                               | **Done** |
| 5   | feature-42 | Seed product-backlog.md               | [Spec-seeds-05 Seed product-backlog.md](./product-backlog.md#pb-36)        | Framework/Feature | - [MCP-01 Installer allow-list and file ledger](./product-backlog.md#pb-16)<br>- [i18n-02 HanS and HanT process artifacts](./product-backlog.md#pb-68)<br>- [product-backlog.md seed](./framework/seeds/templates/EN/product-backlog.md)                                                                                                                                                                                      | **Done** |

### **WIP**


| #   | Code       | SBI                                   | Parent PBI                                                                 | Module/Type       | Related specs                                                                                                                                                                                                                                                                                                                                 | Status   |
| --- | ---------- | ------------------------------------- | -------------------------------------------------------------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | feature-37 | Pack rule sdd-dod.mdc                 | [Rule-01 Pack rule sdd-dod.mdc](./product-backlog.md#pb-18)                | Rule/Feature      | [Spec-seeds-03 Seed constants.json](./product-backlog.md#pb-32)                                                                                                                                                                                                                                                                             | **WIP** |
| 2   | feature-40 | Skill sdd-retrospective               | [Skill-06 Pack skill sdd-retrospective](./product-backlog.md#pb-28)        | Skill/Feature     | [Agent-02 Skill call for a named job](./product-backlog.md#pb-8)                                                                                                                                                                                                                                                                              | **WIP** |

### **ToDo**


| #   | Code       | SBI                                   | Parent PBI                                                                 | Module/Type       | Related specs                                                                                                                                                                                                                                                                                                                                 | Status   |
| --- | ---------- | ------------------------------------- | -------------------------------------------------------------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | task-01    | Cross-review five process file seeds  | [Spec-seeds-06 Seed sprint-backlog.md](./product-backlog.md#pb-37)         | Framework/Task    | - [seed-artifacts-building-guide.md](./seed-artifacts-building-guide.md)<br>- [Spec-seeds-05](./product-backlog.md#pb-36)<br>- [Spec-seeds-07](./product-backlog.md#pb-38)<br>- [Spec-seeds-08](./product-backlog.md#pb-39)<br>- [Spec-seeds-09 Seed issues-log.md](./product-backlog.md#pb-84)                                            | **ToDo** |

### Retrospective

**Learnings**

#### 1. [Oct 5, 2026], feature-38 Pack rule sdd-incremental-delivery.mdc done, feature-39 Retire realtime-status (Option C) done, feature-41 Retire sdd-close-sprint (Skill-07) done, feature-43 Pack rule sdd-realtime-status.mdc done
- Harness rules use the `sdd-` prefix and `constants.json` keys `dod`, `incremental-delivery`, and `realtime-status` ([ADR-094](./adr/ADR-094-sdd-prefix-framework-rules.md), [ADR-096](./adr/ADR-096-sdd-realtime-status-rule-name.md)).
- Unprefixed `realtime-status.mdc` stays retired; WIP sync is `sdd-realtime-status.mdc` ([ADR-091](./adr/ADR-091-retire-realtime-status-rule.md), [ADR-093](./adr/ADR-093-keep-update-wip-rule.md)).
- `sdd-close-sprint` does not ship; Skill-07 is retired ([ADR-076](./adr/ADR-076-review-status-one-skill.md)).
- Closing SBIs from status review alone skipped the retrospective gate until catch-up ([dod-retrospective-before-sbi-done](./knowledge/agent/dod-retrospective-before-sbi-done.md)).

#### 2. [Oct 5, 2026], feature-42 Seed product-backlog.md done
- The EN [product-backlog.md](./framework/seeds/templates/EN/product-backlog.md) seed is the Pokymon starter; `sdd-update-project` copies it only when the target is missing.
- The seed matches [framework-stories AC1](./framework/framework-stories.md) column order and Requirements link pattern.

**Opportunities**

#### 1. [Oct 5, 2026], feature-38 Pack rule sdd-incremental-delivery.mdc done, feature-39 Retire realtime-status (Option C) done, feature-41 Retire sdd-close-sprint (Skill-07) done, feature-43 Pack rule sdd-realtime-status.mdc done
- **sdd-review-status** can name **sdd-retrospective** before any pick that sets an SBI to **Done**.

**Future actions**

#### 1. [Oct 5, 2026], feature-38 Pack rule sdd-incremental-delivery.mdc done, feature-39 Retire realtime-status (Option C) done, feature-41 Retire sdd-close-sprint (Skill-07) done, feature-43 Pack rule sdd-realtime-status.mdc done
- Finish **feature-40** and **CE-SKILL-10** with the auto-run skill shape.

---

## Sprint 7

[Back to the top](#sprint-backlog-frameworksddworks)

Sprint Goal: A developer specifies and builds product work with pack engineering skills and EN engineering artifact seeds.

Depends on Sprint 6 (process loop and process seeds).

**Status: ToDo**

### **ToDo**


| #   | Code       | SBI                     | Parent PBI                                                            | Module/Type       | Related specs                                                                                                          | Status   |
| --- | ---------- | ----------------------- | --------------------------------------------------------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | feature-52 | Skill sdd-atdd          | [Skill-01 Pack skill sdd-atdd](./product-backlog.md#pb-21)            | Skill/Feature     | —                                                                                                                      | **ToDo** |
| 2   | feature-44 | Skill sdd-update-specs  | [Skill-09 Pack skill sdd-update-specs](./product-backlog.md#pb-64)    | Skill/Feature     | [Skill-11 Pack skill sdd-spec-to-build](./product-backlog.md#pb-80)                                                    | **ToDo** |
| 3   | feature-45 | Skill sdd-spec-to-build | [Skill-11 Pack skill sdd-spec-to-build](./product-backlog.md#pb-80)   | Skill/Feature     | - [Skill-09](./product-backlog.md#pb-64)<br>- [Skill-01](./product-backlog.md#pb-21)<br>- [ADR-085](./adr/ADR-085-sdd-spec-to-build.md) | **ToDo** |
| 4   | feature-46 | Skill prompt-optimizer  | [Skill-14 Pack skill prompt-optimizer](./product-backlog.md#pb-89)    | Skill/Feature     | [prompt-optimizer](./framework/seeds/skills/prompt-optimizer/SKILL.md)                                               | **ToDo** |
| 5   | feature-47 | Seed architecture.md    | [Spec-seeds-10 Seed architecture.md](./product-backlog.md#pb-40)      | Framework/Feature | - [MCP-01](./product-backlog.md#pb-16)<br>- [i18n-03](./product-backlog.md#pb-69)                                    | **ToDo** |
| 6   | feature-48 | Seed release.md         | [Spec-seeds-11 Seed release.md](./product-backlog.md#pb-41)           | Framework/Feature | - [MCP-01](./product-backlog.md#pb-16)<br>- [release.md seed](./framework/seeds/templates/EN/release.md)<br>- [i18n-03](./product-backlog.md#pb-69) | **ToDo** |
| 7   | feature-49 | Seed .secrets           | [Spec-seeds-12 Seed .secrets](./product-backlog.md#pb-66)             | Framework/Feature | - [MCP-01](./product-backlog.md#pb-16)<br>- [Spec-seeds-11](./product-backlog.md#pb-41)<br>- [i18n-03](./product-backlog.md#pb-69) | **ToDo** |
| 8   | feature-50 | Seed test-strategy.md   | [Spec-seeds-13 Seed test-strategy.md](./product-backlog.md#pb-90)     | Framework/Feature | - [Spec-seeds-02](./product-backlog.md#pb-34)<br>- [test-strategy.md seed](./framework/seeds/templates/EN/test-strategy.md)<br>- [i18n-03](./product-backlog.md#pb-69) | **ToDo** |

---

## Sprint 8

[Back to the top](#sprint-backlog-frameworksddworks)

Sprint Goal: Ethan completes named-job routing and framework-guided proposals so the local agent matches the shipped skill catalog.

Depends on Sprint 7 (engineering skills and seeds).

**Status: ToDo**

### **ToDo**


| #   | Code       | SBI                                        | Parent PBI                                                                 | Module/Type    | Related specs                                                                                                                                                                                                                                                          | Status   |
| --- | ---------- | ------------------------------------------ | -------------------------------------------------------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | feature-51 | Agent guiding proposals                    | [Agent-03 Guiding proposals from framework knowledge](./product-backlog.md#pb-10) | Agent/Feature  | - [scrum-in-sdd.md](./framework/seeds/templates/EN/scrum-in-sdd.md)<br>- [sdd-scrum-practices.md](./framework/seeds/templates/EN/sdd-scrum-practices.md)<br>- [artifacts-map.json](../artifacts-map.json)                                                              | **ToDo** |
| 2   | task-01    | Complete Agent-02 job index in ethan.md    | [Agent-02 Skill call for a named job](./product-backlog.md#pb-8)             | Agent/Task     | - [ethan.md](./framework/seeds/agents/ethan.md)<br>- [Spec-seeds-03 Seed constants.json](./product-backlog.md#pb-32)<br>- [Skill-03](./product-backlog.md#pb-24)–[Skill-06](./product-backlog.md#pb-28), [Skill-08](./product-backlog.md#pb-30), [Skill-12](./product-backlog.md#pb-86), [Skill-13](./product-backlog.md#pb-87)–[Skill-16](./product-backlog.md#pb-94)<br>- [Skill-07](./product-backlog.md#pb-29) **Retired** ([ADR-076](./adr/ADR-076-review-status-one-skill.md)) | **ToDo** |
| 3   | task-02    | Refresh CE-SKILL catalog for shipped skills | [Skill-12 Pack skill sdd-review-status](./product-backlog.md#pb-86)        | Framework/Task | - [framework-tests.md](./framework/framework-tests.md)<br>- [CE-SKILL-07](./framework/framework-tests.md)                                                                                                                                                            | **ToDo** |

---

## Unplanned PBIs

[Back to the top](#sprint-backlog-frameworksddworks)

> Product backlog items with no sprint assignment. The table matches the Product Backlog table in `product-backlog.md` without the `Sprint` column. The `#pb-N` anchor stays on the Product Backlog row only.


| # | Component | PBI Code | Description | Size | Related | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | framework | [Agent-02](./product-backlog.md#pb-8) | Skill call for a named job | Epic | - `[framework/framework-design.md](./framework/framework-design.md)`<br>- [Skill-03](./product-backlog.md#pb-24)<br>- [Skill-04](./product-backlog.md#pb-25)<br>- [Skill-05](./product-backlog.md#pb-26)<br>- [Skill-12](./product-backlog.md#pb-86)<br>- [Skill-06](./product-backlog.md#pb-28)<br>- [Skill-07](./product-backlog.md#pb-29) **Retired** | ToDo |
| 2 | framework | [Rule-04](./product-backlog.md#pb-95) | Pack rule friendly-language.mdc | Implementable | - [Spec-seeds-03](./product-backlog.md#pb-32)<br>- [framework-design § friendly-language.mdc](./framework/framework-design.md#friendly-languagemdc) | Done |
| 3 | framework | [i18n-01](./product-backlog.md#pb-67) | HanS and HanT core artifacts | Theme | - `[scrum-in-sdd.md](./framework/seeds/templates/EN/scrum-in-sdd.md)`<br>- `[sdd-scrum-practices.md](./framework/seeds/templates/EN/sdd-scrum-practices.md)` | ToDo |
| 4 | framework | [i18n-02](./product-backlog.md#pb-68) | HanS and HanT process artifacts | Theme | - [Spec-seeds-05](./product-backlog.md#pb-36)<br>- [Spec-seeds-06](./product-backlog.md#pb-37)<br>- [Spec-seeds-07](./product-backlog.md#pb-38)<br>- [Spec-seeds-08](./product-backlog.md#pb-39) | ToDo |
| 5 | framework | [i18n-03](./product-backlog.md#pb-69) | HanS and HanT engineering artifacts | Implementable | - [Spec-seeds-10](./product-backlog.md#pb-40)<br>- [Spec-seeds-11](./product-backlog.md#pb-41)<br>- [Spec-seeds-12](./product-backlog.md#pb-66)<br>- [Spec-seeds-13](./product-backlog.md#pb-90) | ToDo |
| 6 | mcp | [MCP-04](./product-backlog.md#pb-92) | Pack go-live on the client root | Theme | - [MCP-01](./product-backlog.md#pb-16)<br>- [MCP-02](./product-backlog.md#pb-75)<br>- [ADR-058](./adr/ADR-058-stdio-end-user-http-fallback.md) | ToDo |
| 7 | webapp | [Spec-seeds-14](./product-backlog.md#pb-82) | Seed features.md under content/features | Implementable | - [Web-portal-07](./product-backlog.md#pb-73)<br>- [MCP-04](./product-backlog.md#pb-92) | ToDo |
| 8 | webapp | [Web-portal-01](./product-backlog.md#pb-15) | Per-client call-up on the instructions page | Implementable | - `[framework/framework-design.md](./framework/framework-design.md)`<br>- `[mcp/client.paths.md](./mcp/client.paths.md)` | ToDo |
| 9 | webapp | [Web-portal-02](./product-backlog.md#pb-49) | Install and update on the instructions page | Implementable | - [Web-portal-01](./product-backlog.md#pb-15)<br>- [MCP-01](./product-backlog.md#pb-16)<br>- [MCP-04](./product-backlog.md#pb-92)<br>- [Agent-04](./product-backlog.md#pb-17) | ToDo |
| 10 | webapp | [Web-portal-14](./product-backlog.md#pb-88) | README for IDE invoke differences | Implementable | - [Web-portal-01](./product-backlog.md#pb-15)<br>- `[framework-design.md](./framework/framework-design.md)`<br>- `[ide-agent-invoke.md](./knowledge/agent/ide-agent-invoke.md)` | ToDo |
| 11 | webapp | [Web-portal-15](./product-backlog.md#pb-91) | Unified public site | Epic | - [Web-portal-07](./product-backlog.md#pb-73)<br>- [Web-portal-09](./product-backlog.md#pb-76)<br>- [MCP-04](./product-backlog.md#pb-92) | ToDo |