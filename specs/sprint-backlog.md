# sprint-backlog, framework.sdd.works

> Type: Framework (process) artifact of framework.sdd.works
> as_of: 2026-10-01
> [Definition](./framework/seeds/templates/EN/sdd-scrum-practices.md#definition-of-sprint-backlogmd)



## Current project progress

- Total sprints: 16
- Current WIP sprint: **[Sprint 4](#sprint-4)**. Click the link to jump to Sprint 4.
- Sprint goal: Agent Ethan completes his onboard.



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
- [Sprint 10](#sprint-10)
- [Sprint 11](#sprint-11)
- [Sprint 12](#sprint-12)
- [Sprint 13](#sprint-13)
- [Sprint 14](#sprint-14)
- [Sprint 15](#sprint-15)
- [Sprint 16](#sprint-16)

---



## RID Log (Risks,Impediments, Dependencies)

[Back to the top](#sprint-backlog-frameworksddworks)

> This section records risks, impediments, and dependencies for the entire project. It does not belong to any sprint.



### Open RIDs


| #   | Severity | Title                                   | Description                                                                                                                                                                                                                                                  | Impact                                                                         | Solution                                                                                                                            | Related                                                                                              | Created Sprint |
| --- | -------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | -------------- |
| D-2 | Blocking | Pack copy must use an allow-list        | - The pack tree includes files that are not pack files. - Copying every top-level name onto the client root is wrong.                                                                                                                                        | MCP-01 cannot be delivered, because the install would copy the whole git tree. | Copy the allow-list only, and map `skill` to `skills` and `Rules` to `rules`.                                                       | [mcp-design.md](./mcp/mcp-design.md) MCP design                                                      | Sprint 2       |
| D-3 | Blocking | templates/ has no installer root        | - ADR-056 and MCP-01 need `{client_root}/templates/`. - The seed map has no templates root. - applyPackage copies skills, rules, agents, and workflows only.                                                                                                 | MCP-01 cannot be delivered, because templates have no install path.            | Map `templates/` to `{client_root}/templates/`.                                                                                     | [ADR-056](./adr/ADR-056-single-user-root-framework-pack.md) One framework pack, on the user root     | Sprint 2       |
| R-1 | Medium   | HTTP MCP cannot write local ledger file | - HTTP MCP cannot write the local `.sdd-installed.json` with `pack_complete: true`. - Skipping that file blocks Ethan's start gate. - stdio (ADR-058) writes the ledger in-process. A ledger baked into the tarball would mark a failed extract as complete. | MCP-01 and Agent-07 cannot be delivered, because Ethan does not start.         | Write the ledger last, after verify, name `manifestPath` in the instructions, and do not commit a true ledger in the pack git tree. | [ADR-058](./adr/ADR-058-stdio-end-user-http-fallback.md) End-user stdio installer with HTTP fallback | Sprint 2       |




### Closed RIDs


| #   | Severity | Title                                     | Description                                                                                           | Impact                                                                     | Solution                                                                | Related                                                                     | Closed Sprint |
| --- | -------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------- |
| D-1 | Blocking | coach-ethan ships as a local Cursor agent | - coach-ethan is a local Cursor agent in the client `agents/` tree. - Remote MCP stays the installer. | Agent-01 is delivered. One presence model covers the product and the MVPs. | Record the local Cursor agent in the framework design. No separate ADR. | [framework-design.md](./framework/framework-design.md) Design for framework | Sprint 1      |


---



## Definition of Done

Every sprint item uses this checklist. Mark the row `Done` only when every check passes.

- Follow rule DoD
- Feature confirmed usable by user
- Acceptance criteria (story mapping spec names with links) passed
- Quality meets the test specs:
  - [agent test](./framework/framework-test.md)
  - [MCP test](./mcp/mcp-test.md)
  - [portal test](./admin-portal/app-test.md)

Sprints 3, 4, and 5 use this checklist instead:

- Confirmed usable by user
- Whole pack cross-reviewed and updated accordingly
- Reviewed to ensure it follows TRUE AGENT principle

Additional Done Criteria, on top of the Definition of Done, is the check for one row under that sprint. It does not add a table column.

---



## Sprint 1

[Back to the top](#sprint-backlog-frameworksddworks)

Sprint Goal: framework.sdd.works R2 ships an agent spike and POC, with the pack seeds in this repo and ethan callable as a local agent.

**Status: Done** (EN guide and practices confirmed; call-up recorded; Phase 1 archive under `phase1-process-specs/`)

HanS and HanT are Sprint 16.

### **Done**


| #   | Code             | SBI                                   | Parent PBI                                                                                                                                     | Module/Type             | Related specs                                                                                                                                                                                                   | Status   |
| --- | ---------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | feature-04       | Archived Phase 1 Scrum files          | [Spec-01 Archive Phase 1 Scrum files](./product-backlog.md#pb-1)                                                                               | Framework/Feature       | [artifacts-map.md](./artifacts-map.md)                                                                                                                                                                          | **Done** |
| 2   | feature-03       | Agent call to ethan                   | [Agent-01 agent ethan: POC](./product-backlog.md#pb-6)                                                                                         | Agent/Feature           | - [framework/framework-design.md](./framework/framework-design.md) - [D-1](#rid-log-risksimpediments-dependencies)                                                                                              | **Done** |
| 3   | feature-01       | Latest guide and practices seeds      | - [Spec-seeds-02 Seed: scrum-in-sdd.md](./product-backlog.md#pb-33) - [Spec-seeds-03 Seed: sdd-scrum-practices.md](./product-backlog.md#pb-34) | Framework/Feature       | - [framework/seeds/templates/EN/scrum-in-sdd.md](./framework/seeds/templates/EN/scrum-in-sdd.md) - [framework/seeds/templates/EN/sdd-scrum-practices.md](./framework/seeds/templates/EN/sdd-scrum-practices.md) | **Done** |
| 4   | documentation-01 | Process docs pointed at the seed tree | [Spec-seeds-02 Seed: scrum-in-sdd.md](./product-backlog.md#pb-33)                                                                              | Framework/Documentation | [artifacts-map.md](./artifacts-map.md)                                                                                                                                                                          | **Done** |




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
| 6   | feature-09 | Unchanged client folder after a failed download      | [MCP-01 Installer: pack allow-list + ledger](./product-backlog.md#pb-16)              | MCP/Feature        | - [mcp/mcp-stories.md](./mcp/mcp-stories.md) scenario 8 - [mcp/mcp-test.md](./mcp/mcp-test.md) C8, P2                                                                                                                                                                                      | **Done** |
| 7   | feature-08 | Replaced recorded files and the flag on a new commit | [MCP-01 Installer: pack allow-list + ledger](./product-backlog.md#pb-16)              | MCP/Feature        | - [mcp/mcp-stories.md](./mcp/mcp-stories.md) scenarios 2, 6b, 7b - [mcp/mcp-test.md](./mcp/mcp-test.md) C2, C6b, C7b                                                                                                                                                                       | **Done** |
| 8   | feature-07 | Unchanged file bytes on the same commit              | [MCP-01 Installer: pack allow-list + ledger](./product-backlog.md#pb-16)              | MCP/Feature        | - [mcp/mcp-stories.md](./mcp/mcp-stories.md) scenarios 3, 6a, 7a - [mcp/mcp-test.md](./mcp/mcp-test.md) C3, C6a, C7a                                                                                                                                                                       | **Done** |
| 9   | feature-06 | Update that deletes recorded pack files only         | [MCP-01 Installer: pack allow-list + ledger](./product-backlog.md#pb-16)              | MCP/Feature        | - [mcp/mcp-stories.md](./mcp/mcp-stories.md) scenario 5 and AC2b - [mcp/mcp-test.md](./mcp/mcp-test.md) C5, C2b - [ADR-059](./adr/ADR-059-ledger-lists-pack-files.md)                                                                                                                      | **Done** |
| 10  | feature-05 | Website paste prompt for stdio MCP                   | [Web-portal-04 Agent-setup: stdio prompt + HTTP fallback](./product-backlog.md#pb-70) | Web-portal/Feature | - [mcp/mcp-design.md](./mcp/mcp-design.md) §2.1 - [mcp/mcp-stories.md](./mcp/mcp-stories.md) `sdd-mcp-prompt-setup` - [ADR-058](./adr/ADR-058-stdio-end-user-http-fallback.md) - [prompt.md](../public/agent-setup/prompt.md)                                                              | **Done** |
| 11  | feature-04 | Seed constants                                       | [Spec-seeds-01 Seed: constants.md](./product-backlog.md#pb-32)                        | Framework/Feature  | - [framework/seeds/templates/constants.md](./framework/seeds/templates/constants.md) - [framework/seeds/templates/EN/sdd-scrum-practices.md](./framework/seeds/templates/EN/sdd-scrum-practices.md) - [ADR-060](./adr/ADR-060-constants-on-client-root.md)                                 | **Done** |
| 12  | feature-03 | Ethan start from the ledger only                     | [Agent-07 agent ethan: pack receipt start gate](./product-backlog.md#pb-17)           | Agent/Feature      | - [framework/framework-design.md](./framework/framework-design.md) §2.4 - [framework/framework-stories.md](./framework/framework-stories.md) - [framework/framework-test.md](./framework/framework-test.md) CE-GATE - [framework/seeds/agents/ethan.md](./framework/seeds/agents/ethan.md) | **Done** |
| 13  | feature-02 | ethan.md shipped in the pack                         | [Agent-15 Pack file: agents/ethan.md](./product-backlog.md#pb-63)                     | Agent/Feature      | - [framework/framework-design.md](./framework/framework-design.md) - [framework/framework-design.md](./framework/framework-design.md)                                                                                                                                                      | **Done** |
| 14  | feature-01 | First install with an allow-list and a file ledger   | [MCP-01 Installer: pack allow-list + ledger](./product-backlog.md#pb-16)              | MCP/Feature        | - [mcp/mcp-stories.md](./mcp/mcp-stories.md) scenarios 1 and 4 - [mcp/mcp-test.md](./mcp/mcp-test.md) C1, C4, P1–P4 - [ADR-057](./adr/ADR-057-install-ledger-pack-complete.md) - [ADR-059](./adr/ADR-059-ledger-lists-pack-files.md)                                                       | **Done** |
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

- [MCP-01](./product-backlog.md#pb-16) is **ToDo** on Sprint 15. Sprint 2 installer stories stay **Done**.

**Future actions**

#### 4. [Sep 26, 2026], Sprint-end

- Go-live is Sprint 16 feature-06: GitHub Releases for the five `sdd-mcp` binaries, pack copy, and admin-portal sync.

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
| 4   | feature-10 | Reset success with the previous sentence     | [Web-portal-11 Reset success stays on page with previous sentence](./product-backlog.md#pb-79) | Web-portal/Feature | - [issues-log.md](./issues-log.md) WA-08 - [issues-log.md](./issues-log.md) WA-10 - [app-stories.md](./admin-portal/app-stories.md) AC4b - [app-design.md](./admin-portal/app-design.md) - [03-reset.html](./admin-portal/ui-mockup/03-reset.html) - [app-test.md](./admin-portal/app-test.md)                                                                                                                                                                                                      | **Done** |
| 5   | feature-09 | Setup and instructions without the list tool | [MCP-03 MCP tools without sdd_list_versions](./product-backlog.md#pb-78)                       | MCP/Feature        | - [prompt.md](../public/agent-setup/prompt.md) - [InstructionsPage.tsx](../src/components/features/InstructionsPage.tsx) - [en.json](../messages/en.json) - [zh-Hans.json](../messages/zh-Hans.json) - [zh-Hant.json](../messages/zh-Hant.json)                                                                                                                                                                                               | **Done** |
| 6   | feature-08 | MCP tools without sdd_list_versions          | [MCP-03 MCP tools without sdd_list_versions](./product-backlog.md#pb-78)                       | MCP/Feature        | - [ADR-063](./adr/ADR-063-unregister-sdd-list-versions.md) - [mcp/mcp-design.md](./mcp/mcp-design.md) §3 - [mcp/mcp-test.md](./mcp/mcp-test.md) - [create-server.ts](../src/mcp/create-server.ts) - [create-server-stdio.ts](../src/mcp/create-server-stdio.ts) - [create-server.test.ts](../src/mcp/create-server.test.ts) - [local-binary.test.ts](../src/mcp/local-binary.test.ts) - [sdd-api.test.ts](../src/app/api/sdd/sdd-api.test.ts) | **Done** |
| 7   | feature-07 | Features tab of synced markdown              | [Web-portal-07 Features tab reads pack features.md](./product-backlog.md#pb-73)                | Web-portal/Feature | - [product-backlog.md](./product-backlog.md#pb-73) - [app-design.md](./admin-portal/app-design.md) Features catalog - [app-stories.md](./admin-portal/app-stories.md) AC12–AC16 - [app-test.md](./admin-portal/app-test.md)                                                                                                                                                                                                                   | **Done** |
| 8   | feature-05 | One secret value from Get secret             | [Web-portal-08 Instructions page: Get secret](./product-backlog.md#pb-74)                      | Web-portal/Feature | - [mcp/mcp-stories.md](./mcp/mcp-stories.md) `sdd-mcp-get-key` - [get-key.ts](../src/core/tools/get-key.ts) - [product-backlog.md](./product-backlog.md#pb-74) - [InstructionsPage.tsx](../src/components/features/InstructionsPage.tsx) - [issues-log.md](./issues-log.md) WA-09 - WA-11                                                                                                                                                     | **Done** |
| 9   | feature-04 | Secret form at the bottom of Features        | [Web-portal-08 Instructions page: Get secret](./product-backlog.md#pb-74)                      | Web-portal/Feature | - [app-stories.md](./admin-portal/app-stories.md) AC7 - [app-design.md](./admin-portal/app-design.md) [instructions](..//instructions) - [app-test.md](./admin-portal/app-test.md) - [13-instructions.html](./admin-portal/ui-mockup/13-instructions.html)                                                                                                                                                                                    | **Done** |
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

**Status: WIP**

feature-03 and feature-21 are WIP. The first ToDo row is feature-30.

### **WIP**

Additional Done Criteria, on top of the Definition of Done:

- `feature-04`: The user has reviewed and confirmed this seed. It is stored in the seed tree. Associated specs are updated. The whole seed tree has been cross-reviewed and is consistent.
- `feature-03`: The user has reviewed and confirmed this seed. Section rules live in `sdd-scrum-practices.md` as Template and How to write. The live example and the EN seed match those rules.
- `feature-27`: The user has reviewed and confirmed this seed. Section rules live in `sdd-scrum-practices.md` as Template and How to write. The live example and the EN seed match those rules.


| #   | Code       | SBI                                                      | Parent PBI                                                                                                                                    | Module/Type       | Related specs                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Status   |
| --- | ---------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | feature-28 | ethan.md that reads the guide and practices for the step | - [Agent-02 agent ethan: initial capabilities](./product-backlog.md#pb-7) - [Agent-15 Pack file: agents/ethan.md](./product-backlog.md#pb-63) | Agent/Feature     | - [ethan.md](./framework/seeds/agents/ethan.md) - [scrum-in-sdd.md](./framework/seeds/templates/EN/scrum-in-sdd.md) - [sdd-scrum-practices.md](./framework/seeds/templates/EN/sdd-scrum-practices.md)                                                                                                                                                                                                                                                                                                             | **Done** |
| 2   | feature-23 | Initial sdd-audit-artifacts                              | [Skill-10 Skill: sdd-audit-artifacts](./product-backlog.md#pb-30)                                                                             | Skill/Feature     | - [framework-design.md](./framework/framework-design.md#sdd-audit-artifacts) - [framework-stories.md](./framework/framework-stories.md#sdd-audit-artifacts)                                                                                                                                                                                                                                                                                                                                                       | **Done** |
| 3   | feature-18 | Renamed guide file to scrum-in-sdd.md                    | [Spec-seeds-02 Seed: scrum-in-sdd.md](./product-backlog.md#pb-33)                                                                             | Framework/Feature | - [ADR-068](./adr/ADR-068-scrum-in-sdd-filename.md) - [scrum-in-sdd.md](./framework/seeds/templates/EN/scrum-in-sdd.md)                                                                                                                                                                                                                                                                                                                                                                                           | **Done** |
| 4   | feature-11 | Updated agent ethan.md with onboard capability           | [Agent-02 agent ethan: initial capabilities](./product-backlog.md#pb-7)                                                                       | Agent/Feature     | - [framework-design.md](./framework/framework-design.md) §2.2 and §2.4 - [ADR-073](./adr/ADR-073-skill-get-status.md)                                                                                                                                                                                                                                                                                                                                                                                          | **Done** |
| 5   | feature-04 | Sprint-backlog seed                                      | [Spec-seeds-06 Seed: sprint-backlog.md](./product-backlog.md#pb-37)                                                                           | Framework/Feature | - [sprint-backlog.md](./framework/seeds/templates/EN/sprint-backlog.md) - [sdd-scrum-practices.md](./framework/seeds/templates/EN/sdd-scrum-practices.md#sprint-backlogmd) - [framework-design.md](./framework/framework-design.md#sprint-backlogmd) - [seed-artifacts-building-guide.md](./seed-artifacts-building-guide.md)                                                                                                                                                                                     | **Done** |
| 6   | feature-27 | Seed status.md                                           | [Spec-seeds-07 Seed: status.md](./product-backlog.md#pb-38)                                                                                   | Framework/Feature | - [status.md](./framework/seeds/templates/EN/status.md) - [framework-design.md](./framework/framework-design.md#statusmd) - [sdd-scrum-practices.md](./framework/seeds/templates/EN/sdd-scrum-practices.md#statusmd) - [seed-artifacts-building-guide.md](./seed-artifacts-building-guide.md)                                                                                                                                                                                                                     | **Done** |
| 7   | feature-29 | Merged agent-design in framework-design                  | [Agent-02 agent ethan: initial capabilities](./product-backlog.md#pb-7)                                                                       | Framework/Task    | [framework-design.md](./framework/framework-design.md)                                                                                                                                                                                                                                                                                                                                                                                                                                                            | **Done** |
| 8   | feature-03 | Seed: artifacts-map.md                                   | [Spec-seeds-04 Seed: artifacts-map.md](./product-backlog.md#pb-35)                                                                            | Framework/Feature | - [artifacts-map.md](./framework/seeds/templates/EN/artifacts-map.md) - [sdd-scrum-practices.md](./framework/seeds/templates/EN/sdd-scrum-practices.md#artifacts-mapmd) - [framework-design.md](./framework/framework-design.md#artifacts-mapmd) - [seed-artifacts-building-guide.md](./seed-artifacts-building-guide.md)                                                                                                                                                                                         | **WIP**  |
| 9   | feature-21 | Change-log and issues-log seeds                          | - [Spec-seeds-08 Seed: changes-log.md](./product-backlog.md#pb-39) - [Spec-seeds-13 Seed: issues-log.md](./product-backlog.md#pb-84)          | Framework/Feature | - [ADR-070](./adr/ADR-070-change-log-and-issues-log.md) - [ADR-075](./adr/ADR-075-issues-log-tables.md) - [changes-log.md](./framework/seeds/templates/EN/changes-log.md) - [issues-log.md](./framework/seeds/templates/EN/issues-log.md) - [sdd-scrum-practices.md](./framework/seeds/templates/EN/sdd-scrum-practices.md#changes-logmd) - [sdd-scrum-practices.md](./framework/seeds/templates/EN/sdd-scrum-practices.md#issues-logmd) - [seed-artifacts-building-guide.md](./seed-artifacts-building-guide.md) | **WIP**  |
| 10  | feature-30 | Practices job 6 for report status                        | [Skill-15 Skill: sdd-review-status](./product-backlog.md#pb-86)                                                                               | Skill/Feature     | - [ADR-076](./adr/ADR-076-review-status-one-skill.md) - [sdd-scrum-practices.md](./framework/seeds/templates/EN/sdd-scrum-practices.md#6-report-status)                                                                                                                                                                                                                                                                                                                                                            | **ToDo** |
| 11  | feature-24 | Skill sdd-review-status                                  | [Skill-15 Skill: sdd-review-status](./product-backlog.md#pb-86)                                                                               | Skill/Feature     | - [ADR-076](./adr/ADR-076-review-status-one-skill.md) - [ADR-073](./adr/ADR-073-skill-get-status.md) - [sdd-review-status](./framework/seeds/skills/sdd-review-status/SKILL.md)                                                                                                                                                                                                                                                                                                                                   | **ToDo** |
| 12  | feature-22 | Rule artifacts-map                                       | [Rule-04 Rule: artifacts-map.mdc](./product-backlog.md#pb-85)                                                                                 | Rule/Feature      | - [ADR-072](./adr/ADR-072-rule-artifacts-map.md) - [scrum-in-sdd.md](./framework/seeds/templates/EN/scrum-in-sdd.md)                                                                                                                                                                                                                                                                                                                                                                                              | **ToDo** |




### Retrospective

**Learnings**

#### 1. [Oct 1, 2026], feature-27 done

- Section rules for `status.md` live only as Template and How to write in `sdd-scrum-practices.md`. See [seed-artifacts-building-guide.md](./seed-artifacts-building-guide.md).



#### 2. [Oct 1, 2026], feature-04 done

- A section rule lives once in the practices file, as a template plus one note per placeholder. See [seed-artifacts-building-guide.md](./seed-artifacts-building-guide.md).
- A table cell with more than one fact uses `-`  bullets separated by `<br>`. See [markdown-table-cell-bullets](./knowledge/agent/markdown-table-cell-bullets.md).

**Opportunities**

No opportunity is recorded yet.

**Future actions**

#### 1. [Oct 1, 2026], feature-27 done

- The HanS and HanT status.md seeds follow on Sprint 16 i18n-02.



#### 2. [Oct 1, 2026], feature-04 done

- The HanS and HanT sprint-backlog seeds follow on Sprint 16 i18n-02.

---



## Sprint 5

[Back to the top](#sprint-backlog-frameworksddworks)

Sprint Goal: Ethan helps kick off a new project, and update an on-going project.

Depends on Sprint 4 (onboard can return a verdict).

**Status: ToDo**

### **ToDo**


| #   | Code       | SBI                                               | Parent PBI                                                          | Module/Type   | Related specs                                                                                                  | Status   |
| --- | ---------- | ------------------------------------------------- | ------------------------------------------------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | feature-26 | Ethan run of update-project-settings              | [Agent-09 Job: Update project settings](./product-backlog.md#pb-43) | Agent/Feature | [Agent-09 Job: Update project settings](./product-backlog.md#pb-43)                                            | **ToDo** |
| 2   | feature-25 | Skill sdd-update-project                          | [Skill-04 Skill: sdd-update-project](./product-backlog.md#pb-24)    | Skill/Feature | [Agent-09](./product-backlog.md#pb-43)                                                                         | **ToDo** |
| 3   | feature-02 | Ethan run of start-a-new-project                  | [Agent-08 Job: Start a new project](./product-backlog.md#pb-42)     | Agent/Feature | [framework/seeds/templates/EN/sdd-scrum-practices.md](./framework/seeds/templates/EN/sdd-scrum-practices.md)   | **ToDo** |
| 4   | feature-20 | Renamed skill from new-project to kickoff-project | [Skill-03 Skill: sdd-kickoff-project](./product-backlog.md#pb-23)   | Skill/Feature | - [ADR-069](./adr/ADR-069-skill-kickoff-project.md) - [constants.md](./framework/seeds/templates/constants.md) | **ToDo** |
| 5   | feature-01 | Skill sdd-kickoff-project                         | [Skill-03 Skill: sdd-kickoff-project](./product-backlog.md#pb-23)   | Skill/Feature | [Agent-08 Job: Start a new project](./product-backlog.md#pb-42)                                                | **ToDo** |
| 6   | feature-31 | Remove ECC from prompt-optimizer                  | [Skill-17 Skill: prompt-optimizer](./product-backlog.md#pb-89)      | Skill/Feature | [prompt-optimizer](./framework/seeds/skills/prompt-optimizer/SKILL.md)                                         | **ToDo** |




### Retrospective

**Learnings**

No learning is recorded yet.

**Opportunities**

No opportunity is recorded yet.

**Future actions**

No future action is recorded yet.

---



## Sprint 6

[Back to the top](#sprint-backlog-frameworksddworks)

Sprint Goal: Ethan can refine the product backlog.

Depends on Sprint 5. A project exists to refine.

**Status: ToDo**

### **ToDo**

Additional Done Criteria, on top of the Definition of Done:

- `feature-01`: Practices job 4 is no longer *(to fill)*. The skill installs.
- `feature-02`: A confirmed request leaves a verifiable change in `product-backlog.md`.
- `feature-03`: Ethan applies one small backlog refinement and one change-log entry inside the guide rules.
- `feature-04`: The user has reviewed and confirmed this seed. It is stored in the seed tree. Associated specs are updated. The whole seed tree has been cross-reviewed and is consistent.


| #   | Code       | SBI                                         | Parent PBI                                                                                                                               | Module/Type       | Related specs                                                                                                                            | Status   |
| --- | ---------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | feature-04 | Product-backlog seed                        | [Spec-seeds-05 Seed: product-backlog.md](./product-backlog.md#pb-36)                                                                     | Framework/Feature | [Spec-seeds-05 Seed: product-backlog.md](./product-backlog.md#pb-36)                                                                     | **ToDo** |
| 2   | feature-03 | One governance edit                         | [Agent-04 agent ethan: governance artifacts](./product-backlog.md#pb-9)                                                                  | Agent/Feature     | [Agent-04 agent ethan: governance artifacts](./product-backlog.md#pb-9)                                                                  | **ToDo** |
| 3   | feature-02 | Ethan refinement of the backlog             | [Agent-10 Job: Refine product backlog](./product-backlog.md#pb-44)                                                                       | Agent/Feature     | [Agent-10 Job: Refine product backlog](./product-backlog.md#pb-44)                                                                       | **ToDo** |
| 4   | feature-01 | Practices job 4 and the sdd-refine-pb skill | - [Skill-05 Skill: sdd-refine-pb](./product-backlog.md#pb-25) - [Spec-seeds-03 Seed: sdd-scrum-practices.md](./product-backlog.md#pb-34) | Skill/Feature     | - [Skill-05 Skill: sdd-refine-pb](./product-backlog.md#pb-25) - [Spec-seeds-03 Seed: sdd-scrum-practices.md](./product-backlog.md#pb-34) | **ToDo** |




### Retrospective

**Learnings**

No learning is recorded yet.

**Opportunities**

No opportunity is recorded yet.

**Future actions**

No future action is recorded yet.

---



## Sprint 7

[Back to the top](#sprint-backlog-frameworksddworks)

Sprint Goal: Ethan can plan a sprint.

Depends on Sprint 6 (a backlog exists to plan from).

**Status: ToDo**

### **ToDo**

Additional Done Criteria, on top of the Definition of Done:

- `feature-01`: Practices job 5 is written. The skill installs.
- `feature-02`: A confirmed request leaves a Sprint Backlog for the planned sprint.
- `feature-03`: The planning run is the one named event, with a verifiable change in the sprint backlog.


| #   | Code       | SBI                                           | Parent PBI                                                           | Module/Type   | Related specs                                                        | Status   |
| --- | ---------- | --------------------------------------------- | -------------------------------------------------------------------- | ------------- | -------------------------------------------------------------------- | -------- |
| 1   | feature-03 | One facilitated event                         | [Agent-03 agent ethan: facilitate events](./product-backlog.md#pb-8) | Agent/Feature | [Agent-03 agent ethan: facilitate events](./product-backlog.md#pb-8) | **ToDo** |
| 2   | feature-02 | Ethan plan for a sprint                       | [Agent-11 Job: Sprint planning](./product-backlog.md#pb-45)          | Agent/Feature | [Agent-11 Job: Sprint planning](./product-backlog.md#pb-45)          | **ToDo** |
| 3   | feature-01 | Practices job 5 and the sdd-plan-sprint skill | [Skill-06 Skill: sdd-plan-sprint](./product-backlog.md#pb-26)        | Skill/Feature | [Skill-06 Skill: sdd-plan-sprint](./product-backlog.md#pb-26)        | **ToDo** |




### Retrospective

**Learnings**

No learning is recorded yet.

**Opportunities**

No opportunity is recorded yet.

**Future actions**

No future action is recorded yet.

---



## Sprint 8

[Back to the top](#sprint-backlog-frameworksddworks)

Sprint Goal: Ethan can report status.

Depends on Sprint 4 (`status.md` exists). Does not depend on Sprint 5–7.

**Status: ToDo**

### **ToDo**

Additional Done Criteria, on top of the Definition of Done:

- `feature-02`: A confirmed request leaves a verifiable update in `status.md`.


| #   | Code       | SBI                    | Parent PBI                                                | Module/Type   | Related specs                                             | Status   |
| --- | ---------- | ---------------------- | --------------------------------------------------------- | ------------- | --------------------------------------------------------- | -------- |
| 1   | feature-02 | Ethan update of status | [Agent-12 Job: Report status](./product-backlog.md#pb-46) | Agent/Feature | [Agent-12 Job: Report status](./product-backlog.md#pb-46) | **ToDo** |




### Retrospective

**Learnings**

No learning is recorded yet.

**Opportunities**

No opportunity is recorded yet.

**Future actions**

No future action is recorded yet.

---



## Sprint 9

[Back to the top](#sprint-backlog-frameworksddworks)

Sprint Goal: Ethan can run a retrospective.

Depends on Sprint 7 (a sprint exists to review).

**Status: ToDo**

### **ToDo**

Additional Done Criteria, on top of the Definition of Done:

- `feature-01`: Practices job 7 is written. The skill installs.
- `feature-02`: A confirmed request leaves the retrospective record practices describes.


| #   | Code       | SBI                                             | Parent PBI                                                      | Module/Type   | Related specs                                                   | Status   |
| --- | ---------- | ----------------------------------------------- | --------------------------------------------------------------- | ------------- | --------------------------------------------------------------- | -------- |
| 1   | feature-02 | Ethan retrospective record                      | [Agent-13 Job: Retrospective](./product-backlog.md#pb-47)       | Agent/Feature | [Agent-13 Job: Retrospective](./product-backlog.md#pb-47)       | **ToDo** |
| 2   | feature-01 | Practices job 7 and the sdd-retrospective skill | [Skill-08 Skill: sdd-retrospective](./product-backlog.md#pb-28) | Skill/Feature | [Skill-08 Skill: sdd-retrospective](./product-backlog.md#pb-28) | **ToDo** |




### Retrospective

**Learnings**

No learning is recorded yet.

**Opportunities**

No opportunity is recorded yet.

**Future actions**

No future action is recorded yet.

---



## Sprint 10

[Back to the top](#sprint-backlog-frameworksddworks)

Sprint Goal: Ethan can start the next sprint.

Depends on Sprint 9.

**Status: ToDo**

### **ToDo**

Additional Done Criteria, on top of the Definition of Done:

- `feature-01`: Practices job 8 (Start a new sprint) is written. The skill installs.
- `feature-02`: A confirmed request leaves the next sprint in `sprint-backlog.md` and `status.md`.


| #   | Code       | SBI                                            | Parent PBI                                                       | Module/Type   | Related specs                                                    | Status   |
| --- | ---------- | ---------------------------------------------- | ---------------------------------------------------------------- | ------------- | ---------------------------------------------------------------- | -------- |
| 1   | feature-02 | Next sprint opened by Ethan                    | [Agent-14 Job: Close / start sprint](./product-backlog.md#pb-48) | Agent/Feature | [Agent-14 Job: Close / start sprint](./product-backlog.md#pb-48) | **ToDo** |
| 2   | feature-01 | Practices job 8 and the sdd-close-sprint skill | [Skill-09 Skill: sdd-close-sprint](./product-backlog.md#pb-29)   | Skill/Feature | [Skill-09 Skill: sdd-close-sprint](./product-backlog.md#pb-29)   | **ToDo** |




### Retrospective

**Learnings**

No learning is recorded yet.

**Opportunities**

No opportunity is recorded yet.

**Future actions**

No future action is recorded yet.

---



## Sprint 11

[Back to the top](#sprint-backlog-frameworksddworks)

Sprint Goal: Ethan answers from the guide and the live project files without editing them.

Depends on Sprint 4 (onboard) and Sprint 5 (a project to read).

**Status: ToDo**

### **ToDo**

Additional Done Criteria, on top of the Definition of Done:

- `feature-01`: A chat turn answers from the guide plus backlog and sprint backlog, without writing files.
- `feature-02`: A coaching question is answered with a citation and no invented process rule.
- `feature-03`: A turn that is not an event verb still gets a useful reply and does not edit files.


| #   | Code       | SBI                                   | Parent PBI                                                              | Module/Type   | Related specs                                                           | Status   |
| --- | ---------- | ------------------------------------- | ----------------------------------------------------------------------- | ------------- | ----------------------------------------------------------------------- | -------- |
| 1   | feature-03 | Free-form chat inside the harness     | [Agent-06 agent ethan: chat](./product-backlog.md#pb-11)                | Agent/Feature | [Agent-06 agent ethan: chat](./product-backlog.md#pb-11)                | **ToDo** |
| 2   | feature-02 | Coaching answer with a guide citation | [Agent-05 agent ethan: knowledgeable coach](./product-backlog.md#pb-10) | Agent/Feature | [Agent-05 agent ethan: knowledgeable coach](./product-backlog.md#pb-10) | **ToDo** |
| 3   | feature-01 | What now / what next                  | [Agent-02 agent ethan: initial capabilities](./product-backlog.md#pb-7) | Agent/Feature | [Agent-02 agent ethan: initial capabilities](./product-backlog.md#pb-7) | **ToDo** |




### Retrospective

**Learnings**

No learning is recorded yet.

**Opportunities**

No opportunity is recorded yet.

**Future actions**

No future action is recorded yet.

---



## Sprint 12

[Back to the top](#sprint-backlog-frameworksddworks)

Sprint Goal: The three harness rules install and are named in constants.md.

Depends on Sprint 2 (the pack copy). Does not depend on the scrum jobs.

**Status: ToDo**

### **ToDo**

Additional Done Criteria, on top of the Definition of Done:

- `feature-01`: The file installs under `{client_root}/rules/` and the key is in constants.md.
- `feature-02`: Same install bar.
- `feature-03`: Same install bar.


| #   | Code       | SBI                           | Parent PBI                                                           | Module/Type  | Related specs                                                        | Status   |
| --- | ---------- | ----------------------------- | -------------------------------------------------------------------- | ------------ | -------------------------------------------------------------------- | -------- |
| 1   | feature-03 | Rule realtime-status.mdc      | [Rule-03 Rule: realtime-status.mdc](./product-backlog.md#pb-20)      | Rule/Feature | [Rule-03 Rule: realtime-status.mdc](./product-backlog.md#pb-20)      | **ToDo** |
| 2   | feature-02 | Rule incremental-delivery.mdc | [Rule-02 Rule: incremental-delivery.mdc](./product-backlog.md#pb-19) | Rule/Feature | [Rule-02 Rule: incremental-delivery.mdc](./product-backlog.md#pb-19) | **ToDo** |
| 3   | feature-01 | Rule dod.mdc                  | [Rule-01 Rule: dod.mdc](./product-backlog.md#pb-18)                  | Rule/Feature | [Rule-01 Rule: dod.mdc](./product-backlog.md#pb-18)                  | **ToDo** |




### Retrospective

**Learnings**

No learning is recorded yet.

**Opportunities**

No opportunity is recorded yet.

**Future actions**

No future action is recorded yet.

---



## Sprint 13

[Back to the top](#sprint-backlog-frameworksddworks)

Sprint Goal: A feature can be implemented by updating specs, then TDD.

Depends on Sprint 3 (a project) and Sprint 12 (the rules the work follows).

**Status: ToDo**

### **ToDo**

Additional Done Criteria, on top of the Definition of Done:

- `feature-01`: Both folders install under `{client_root}/skills/`.
- `feature-02`: The skill names which spec files to update and does not leave them describing the previous behavior.
- `feature-03`: The skill loads the skills the SBI needs, including spec update and TDD, and finishes that one SBI.
- `feature-04`: The skill installs under `{client_root}/skills/`. The initial `SKILL.md` is Sprint 4 feature-23.


| #   | Code       | SBI                                               | Parent PBI                                                                                                       | Module/Type   | Related specs                                                                                                             | Status   |
| --- | ---------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | feature-13 | Skill sdd-design                                  | [Skill-14 Skill: sdd-design](./product-backlog.md#pb-80)                                                         | Skill/Feature | - [ADR-066](./adr/ADR-066-sdd-design-before-implementation.md) - [constants.md](./framework/seeds/templates/constants.md) | **ToDo** |
| 2   | feature-15 | Renamed skill from implement-feature to implement | [Skill-13 Skill: sdd-implement](./product-backlog.md#pb-65)                                                      | Skill/Feature | - [ADR-066](./adr/ADR-066-sdd-design-before-implementation.md) - [constants.md](./framework/seeds/templates/constants.md) | **ToDo** |
| 3   | feature-04 | Installed sdd-audit-artifacts skill               | [Skill-10 Skill: sdd-audit-artifacts](./product-backlog.md#pb-30)                                                | Skill/Feature | [Skill-10 Skill: sdd-audit-artifacts](./product-backlog.md#pb-30)                                                         | **ToDo** |
| 4   | feature-03 | Skill sdd-implement                               | [Skill-13 Skill: sdd-implement](./product-backlog.md#pb-65)                                                      | Skill/Feature | [ADR-066](./adr/ADR-066-sdd-design-before-implementation.md)                                                              | **ToDo** |
| 5   | feature-02 | Skill sdd-update-specs                            | [Skill-12 Skill: sdd-update-specs](./product-backlog.md#pb-64)                                                   | Skill/Feature | [Skill-12 Skill: sdd-update-specs](./product-backlog.md#pb-64)                                                            | **ToDo** |
| 6   | feature-01 | Skills sdd-atdd and sdd-tdd                       | - [Skill-01 Skill: sdd-atdd](./product-backlog.md#pb-21) - [Skill-02 Skill: sdd-tdd](./product-backlog.md#pb-22) | Skill/Feature | - [Skill-01 Skill: sdd-atdd](./product-backlog.md#pb-21) - [Skill-02 Skill: sdd-tdd](./product-backlog.md#pb-22)          | **ToDo** |




### Retrospective

**Learnings**

No learning is recorded yet.

**Opportunities**

No opportunity is recorded yet.

**Future actions**

No future action is recorded yet.

---



## Sprint 14

[Back to the top](#sprint-backlog-frameworksddworks)

Sprint Goal: The public instructions page covers call-up, install, the receipt, and the fatal stop.

Depends on Sprint 2 for the behavior the page describes. The page is not required for Sprint 2 to send the URL.

**Status: ToDo**

### **ToDo**

Additional Done Criteria, on top of the Definition of Done:

- `feature-01`: The section cites each client's docs. Cursor `/ethan` and TRAE CN `@` are the known cases.
- `feature-02`: A reader can install or update, find the receipt, and see that Ethan stops without a true flag.
- `feature-03`: The instructions URL on framework.sdd.works shows this content. No new portal features.


| #   | Code       | SBI                                | Parent PBI                                                                             | Module/Type        | Related specs                                                                          | Status   |
| --- | ---------- | ---------------------------------- | -------------------------------------------------------------------------------------- | ------------------ | -------------------------------------------------------------------------------------- | -------- |
| 1   | feature-03 | Live site page for that content    | [Web-portal-03 Website shows instructions](./product-backlog.md#pb-50)                 | Web-portal/Feature | [Web-portal-03 Website shows instructions](./product-backlog.md#pb-50)                 | **ToDo** |
| 2   | feature-02 | Install, receipt, and fatal stop   | [Web-portal-02 Instructions: install, receipt, fatal stop](./product-backlog.md#pb-49) | Web-portal/Feature | [Web-portal-02 Instructions: install, receipt, fatal stop](./product-backlog.md#pb-49) | **ToDo** |
| 3   | feature-01 | Per-client call-up, after research | [Web-portal-01 Instructions: per-client agent call-up](./product-backlog.md#pb-15)     | Web-portal/Feature | [Web-portal-01 Instructions: per-client agent call-up](./product-backlog.md#pb-15)     | **ToDo** |




### Retrospective

**Learnings**

No learning is recorded yet.

**Opportunities**

No opportunity is recorded yet.

**Future actions**

No future action is recorded yet.

---



## Sprint 15

[Back to the top](#sprint-backlog-frameworksddworks)

Sprint Goal: A new project can copy the optional engineering starters: architecture, deployment, and the secrets file.

Depends on Sprint 2 (the pack copy). Does not depend on the scrum jobs.

**Status: ToDo**

### **ToDo**

Additional Done Criteria, on top of the Definition of Done:

- `feature-01`: The user has reviewed and confirmed this seed. It is stored in the seed tree. Associated specs are updated. The whole seed tree has been cross-reviewed and is consistent.
- `feature-02`: The user has reviewed and confirmed this seed. It is stored in the seed tree. Associated specs are updated. The whole seed tree has been cross-reviewed and is consistent.
- `feature-03`: The user has reviewed and confirmed this seed. It is stored in the seed tree. Associated specs are updated. The whole seed tree has been cross-reviewed and is consistent.


| #   | Code       | SBI               | Parent PBI                                                        | Module/Type       | Related specs                                                                                  | Status   |
| --- | ---------- | ----------------- | ----------------------------------------------------------------- | ----------------- | ---------------------------------------------------------------------------------------------- | -------- |
| 1   | feature-03 | Secrets seed      | [Spec-seeds-11 Seed: .secrets](./product-backlog.md#pb-66)        | Framework/Feature | [framework/seeds/templates/EN/scrum-in-sdd.md](./framework/seeds/templates/EN/scrum-in-sdd.md) | **ToDo** |
| 2   | feature-02 | Deployment seed   | [Spec-seeds-10 Seed: deployment.md](./product-backlog.md#pb-41)   | Framework/Feature | [Spec-seeds-10 Seed: deployment.md](./product-backlog.md#pb-41)                                | **ToDo** |
| 3   | feature-01 | Architecture seed | [Spec-seeds-09 Seed: architecture.md](./product-backlog.md#pb-40) | Framework/Feature | [Spec-seeds-09 Seed: architecture.md](./product-backlog.md#pb-40)                              | **ToDo** |




### Retrospective

**Learnings**

No learning is recorded yet.

**Opportunities**

No opportunity is recorded yet.

**Future actions**

No future action is recorded yet.

---



## Sprint 16

[Back to the top](#sprint-backlog-frameworksddworks)

Sprint Goal: Add i18n support, then publish the pack, with HanS and HanT bodies as translations of the EN seeds, and [MCP-01](./product-backlog.md#pb-16) go-live copying the finalized seed folder, publishing the five `sdd-mcp` binaries, and syncing the admin portal.

Depends on the EN seeds from earlier sprints. It does not replace those Spec-seeds items. File existence stays on those items. This sprint owns the translated bodies. Go-live starts after those bodies are finalized.

**Status: ToDo**

### **ToDo**

Additional Done Criteria, on top of the Definition of Done:

- `feature-01`: `specs/framework/seeds/templates/HanS/scrum-in-sdd.md` matches `~/.cursor/templates/framework.sdd.works/HanS/scrum-in-sdd.md`, including the `sdd-` skill names.
- `feature-02`: `specs/framework/seeds/templates/HanT/scrum-in-sdd.md` matches the HanT template meaning, including the `sdd-` skill names.
- `feature-03`: HanS and HanT practices copies are in the seed tree and match the EN practices on jobs 1 and 2.
- `feature-04`: HanS and HanT starters for `product-backlog.md`, `sprint-backlog.md`, `status.md`, `changes-log.md`, and `artifacts-map.md` match the EN starters.
- `feature-05`: HanS and HanT starters exist for `architecture.md`, `{model}-stories`, `{model}-design.md`, `{model}-test.md`, `deployment.md`, and `.secrets`, and they match the EN starters. `.secrets` has no secret values.
- `feature-06`: The finalized seed folder is copied into the framework pack repo and pushed. GitHub Releases exist for the five `sdd-mcp` binaries. The admin portal has synced that pack.
- `feature-07`: The user has reviewed and confirmed `features.en.md`, `features.zh-Hans.md`, and `features.zh-Hant.md`. The three files sit at `content/features/` in the pack repo ([ADR-071](./adr/ADR-071-portal-content-paths.md)). Associated specs are updated. Install does not copy them onto `{client_root}`.


| #   | Code       | SBI                                                | Parent PBI                                                                  | Module/Type       | Related specs                                                                                                | Status   |
| --- | ---------- | -------------------------------------------------- | --------------------------------------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------ | -------- |
| 1   | feature-01 | HanS guide in the seed tree                        | [i18n-01 Framework definition locales](./product-backlog.md#pb-67)          | i18n/Feature      | [framework/seeds/templates/HanS/scrum-in-sdd.md](./framework/seeds/templates/HanS/scrum-in-sdd.md)           | **Done** |
| 2   | feature-07 | Three finalized features.md seeds                  | [Spec-seeds-12 Seeds: features.md at pack root](./product-backlog.md#pb-82) | Framework/Feature | [Web-portal-07](./product-backlog.md#pb-73)                                                                  | **ToDo** |
| 3   | feature-06 | Go-live pack copy, binary releases, and admin sync | [MCP-01 Installer: pack allow-list + ledger](./product-backlog.md#pb-16)    | MCP/Feature       | - [framework-design.md](./framework/framework-design.md#go-live) - [status.md](./status.md)                  | **ToDo** |
| 4   | feature-05 | Translated engineering artifacts                   | [i18n-03 Engineering artifact locales](./product-backlog.md#pb-69)          | i18n/Feature      | [i18n-03](./product-backlog.md#pb-69)                                                                        | **ToDo** |
| 5   | feature-04 | Five translated process artifacts                  | [i18n-02 Process artifact locales](./product-backlog.md#pb-68)              | i18n/Feature      | [i18n-02](./product-backlog.md#pb-68)                                                                        | **ToDo** |
| 6   | feature-03 | HanS and HanT practices in the seed tree           | [i18n-01 Framework definition locales](./product-backlog.md#pb-67)          | i18n/Feature      | [framework/seeds/templates/EN/sdd-scrum-practices.md](./framework/seeds/templates/EN/sdd-scrum-practices.md) | **ToDo** |
| 7   | feature-02 | HanT guide in the seed tree                        | [i18n-01 Framework definition locales](./product-backlog.md#pb-67)          | i18n/Feature      | [framework/seeds/templates/EN/scrum-in-sdd.md](./framework/seeds/templates/EN/scrum-in-sdd.md)               | **ToDo** |




### Retrospective

**Learnings**

No learning is recorded yet.

**Opportunities**

No opportunity is recorded yet.

**Future actions**

No future action is recorded yet.