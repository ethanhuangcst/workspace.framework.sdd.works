<a id="sprint-backlog-frameworksddworks"></a>

# sprint-backlog, framework.sdd.works

> Type: Framework (process) artifact of framework.sdd.works
> as_of: 2026-10-07
> [Definition](../pack.framework.sdd.works/templates/EN/sdd-scrum-practices.md#sprint-backlogmd)



## Current project progress

- Total sprints: 8
- Current WIP sprint: [Sprint 8](#sprint-8)
- Sprint goal: Ethan routes named jobs and guiding proposals; lite HTTP install ships manifest, links, prompt, and copy; instructions tabs come from pack JSON; sdd-retrospective meets the current pack skill bar.



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



<a id="rid-log-risksimpediments-dependencies"></a>

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

Every sprint item uses the same checklist as Product Backlog items: [`sdd-dod.mdc`](../pack.framework.sdd.works/rules/sdd-dod.mdc) and [Definition of Done in product-backlog.md](./product-backlog.md#definition-of-done). Mark the row **Done** only when every check passes.

Sprints 3 and 4 use this checklist instead:

- Confirmed usable by user
- Whole pack cross-reviewed and updated accordingly
- Reviewed to ensure it follows TRUE AGENT principle

Additional Done Criteria, on top of the Definition of Done, is the check for one row under that sprint. It does not add a table column.

---



<a id="sprint-1"></a>

## Sprint 1

[Back to the top](#sprint-backlog-frameworksddworks)

Sprint Goal: framework.sdd.works R2 ships an agent spike and POC, with the pack seeds in this repo and ethan callable as a local agent.

**Status: Done** (EN guide and practices confirmed; call-up recorded; Phase 1 archive under `phase1-process-specs/`)

HanS and HanT sit in [Unplanned PBIs](#unplanned-pbis) until scheduled.

### **Done**


| #   | Code             | SBI                                   | Parent PBI                                                                                                                                     | Module/Type             | Related specs                                                                                                                                                                                                   | Status   |
| --- | ---------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | feature-04       | Archived Phase 1 Scrum files          | [`phase1-process-specs/`](./phase1-process-specs/)                                                                               | Framework/Feature       | [artifacts-map.json](../artifacts-map.json)                                                                                                                                                                          | **Done** |
| 2   | feature-03       | Agent call to ethan                   | [Agent-01 agent ethan: POC](./product-backlog.md#L63)                                                                                         | Agent/Feature           | - [framework/framework-design.md](./framework/framework-design.md) - [D-1](#rid-d1)                                                                                              | **Done** |
| 3   | feature-01       | Latest guide and practices seeds      | - [Spec-seeds-01 Seed: scrum-in-sdd.md](./product-backlog.md#L227) - [Spec-seeds-02 Seed: sdd-scrum-practices.md](./product-backlog.md#L230) | Framework/Feature       | - [pack.framework.sdd.works/templates/EN/scrum-in-sdd.md](../pack.framework.sdd.works/templates/EN/scrum-in-sdd.md) - [pack.framework.sdd.works/templates/EN/sdd-scrum-practices.md](../pack.framework.sdd.works/templates/EN/sdd-scrum-practices.md) | **Done** |
| 4   | documentation-01 | Process docs pointed at the seed tree | [Spec-seeds-01 Seed: scrum-in-sdd.md](./product-backlog.md#L227)                                                                              | Framework/Documentation | [artifacts-map.json](../artifacts-map.json)                                                                                                                                                                          | **Done** |




### Retrospective

**Learnings**

#### 1. [Sep 24, 2026], feature-01 done

- [The guide and practices have one authoring place](../pack.framework.sdd.works/templates/EN/sdd-scrum-practices.md)
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

- The HanS guide, the HanT guide, and the HanS and HanT practices sit in [Unplanned PBIs](#unplanned-pbis) ([i18n-04](./product-backlog.md#L298), [i18n-05](./product-backlog.md#L301)). `constants.json` is Sprint 2.

**Future actions**

#### 2. [Sep 25, 2026], feature-03 done

- Receipt enforcement stays on Sprint 2.



#### 3. [Sep 25, 2026], Sprint-end

- Start Sprint 2: installer ledger with `pack_complete`, then the ethan start gate.

---



<a id="sprint-2"></a>

## Sprint 2

[Back to the top](#sprint-backlog-frameworksddworks)

Sprint Goal: Install or update writes the pack and a ledger that lists each pack file (ADR-059), end users connect via a local program (ADR-058) with HTTP as fallback, and Ethan starts only when `pack_complete` is true.

Depends on Sprint 1 only for the seed files already in this repo. It does not wait on a new-project skill.

**Status: Done**

### **Done**


| #   | Code       | SBI                                                  | Parent PBI                                                                            | Module/Type        | Related specs                                                                                                                                                                                                                                                                              | Status   |
| --- | ---------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| 1   | feature-14 | Published binary at ~/.sdd/sdd-mcp                   | [MCP-02 Local binary: ~/.sdd/sdd-mcp](./product-backlog.md#L328)                     | MCP/Feature        | - [ADR-051](./adr/ADR-051-zero-dep-stdio-binary.md) - [mcp/mcp-design.md](./mcp/mcp-design.md) §2.1 and §4.1 - [feature-14-zero-dep](../spikes/feature-14-zero-dep/)                                                                                                                       | **Done** |
| 2   | feature-13 | One-line setup URL as the copied prompt              | [Web-portal-06 Instructions: MCP auto-connect prompt](./product-backlog.md#L368)     | Web-portal/Feature | [InstructionsPage.test.tsx](../src/components/features/InstructionsPage.test.tsx)                                                                                                                                                                                                          | **Done** |
| 3   | feature-12 | One mcp.json for manual setup                        | [Web-portal-06 Instructions: MCP auto-connect prompt](./product-backlog.md#L368)     | Web-portal/Feature | - [mcp/mcp-design.md](./mcp/mcp-design.md) §2.1 - [ADR-061](./adr/ADR-061-setup-prompt-public-path.md) - [InstructionsPage.tsx](../src/components/features/InstructionsPage.tsx)                                                                                                           | **Done** |
| 4   | feature-11 | One-line setup prompt on the instructions page       | [Web-portal-06 Instructions: MCP auto-connect prompt](./product-backlog.md#L368)     | Web-portal/Feature | - [mcp/mcp-design.md](./mcp/mcp-design.md) §2.1 - [ADR-061](./adr/ADR-061-setup-prompt-public-path.md) - [InstructionsPage.tsx](../src/components/features/InstructionsPage.tsx)                                                                                                           | **Done** |
| 5   | feature-10 | Instructions page re-design                          | [Web-portal-05 Instructions page re-design](./product-backlog.md#L363)               | Web-portal/Feature | - [admin-portal/ui-mockup/01-home.html](./admin-portal/ui-mockup/01-home.html) - [InstructionsPage.tsx](../src/components/features/InstructionsPage.tsx) - [ADR-061](./adr/ADR-061-setup-prompt-public-path.md)                                                                            | **Done** |
| 6   | feature-09 | Unchanged client folder after a failed download      | [MCP-01 Installer: pack allow-list + ledger](./product-backlog.md#L315)              | MCP/Feature        | - [mcp/mcp-stories.md](./mcp/mcp-stories.md) scenario 8 - [mcp/mcp-tests.md](./mcp/mcp-tests.md) C8, P2                                                                                                                                                                                      | **Done** |
| 7   | feature-08 | Replaced recorded files and the flag on a new commit | [MCP-01 Installer: pack allow-list + ledger](./product-backlog.md#L315)              | MCP/Feature        | - [mcp/mcp-stories.md](./mcp/mcp-stories.md) scenarios 2, 6b, 7b - [mcp/mcp-tests.md](./mcp/mcp-tests.md) C2, C6b, C7b                                                                                                                                                                       | **Done** |
| 8   | feature-07 | Unchanged file bytes on the same commit              | [MCP-01 Installer: pack allow-list + ledger](./product-backlog.md#L315)              | MCP/Feature        | - [mcp/mcp-stories.md](./mcp/mcp-stories.md) scenarios 3, 6a, 7a - [mcp/mcp-tests.md](./mcp/mcp-tests.md) C3, C6a, C7a                                                                                                                                                                       | **Done** |
| 9   | feature-06 | Update that deletes recorded pack files only         | [MCP-01 Installer: pack allow-list + ledger](./product-backlog.md#L315)              | MCP/Feature        | - [mcp/mcp-stories.md](./mcp/mcp-stories.md) scenario 5 and AC2b - [mcp/mcp-tests.md](./mcp/mcp-tests.md) C5, C2b - [ADR-059](./adr/ADR-059-ledger-lists-pack-files.md)                                                                                                                      | **Done** |
| 10  | feature-05 | Website paste prompt for stdio MCP                   | [Web-portal-04 Agent-setup: stdio prompt + HTTP fallback](./product-backlog.md#L359) | Web-portal/Feature | - [mcp/mcp-design.md](./mcp/mcp-design.md) §2.1 - [mcp/mcp-stories.md](./mcp/mcp-stories.md) `sdd-mcp-prompt-setup` - [ADR-058](./adr/ADR-058-stdio-end-user-http-fallback.md) - [prompt.md](../public/agent-setup/prompt.md)                                                              | **Done** |
| 11  | feature-04 | Seed constants                                       | [Spec-seeds-03 Seed: constants.json](./product-backlog.md#L234)                       | Framework/Feature  | - [pack.framework.sdd.works/templates/constants.json](../pack.framework.sdd.works/templates/constants.json) - [pack.framework.sdd.works/templates/EN/sdd-scrum-practices.md](../pack.framework.sdd.works/templates/EN/sdd-scrum-practices.md) - [ADR-060](./adr/ADR-060-constants-on-client-root.md) · [ADR-081](./adr/ADR-081-constants-json.md) | **Done** |
| 12  | feature-03 | Ethan start from the ledger only                     | [Agent-04 Agent ethan onboard with pack receipt start gate](./product-backlog.md#L76)           | Agent/Feature      | - [framework/framework-design.md](./framework/framework-design.md) §2.4 - [framework/framework-stories.md](./framework/framework-stories.md) - [framework/framework-tests.md](./framework/framework-tests.md) CE-GATE - [pack.framework.sdd.works/agents/ethan.md](../pack.framework.sdd.works/agents/ethan.md) | **Done** |
| 13  | feature-02 | ethan.md shipped in the pack                         | [Agent-01 Local Cursor agent](./product-backlog.md#L63)                     | Agent/Feature      | - [framework/framework-design.md](./framework/framework-design.md) - [framework/framework-design.md](./framework/framework-design.md)                                                                                                                                                      | **Done** |
| 14  | feature-01 | First install with an allow-list and a file ledger   | [MCP-01 Installer: pack allow-list + ledger](./product-backlog.md#L315)              | MCP/Feature        | - [mcp/mcp-stories.md](./mcp/mcp-stories.md) scenarios 1 and 4 - [mcp/mcp-tests.md](./mcp/mcp-tests.md) C1, C4, P1–P4 - [ADR-057](./adr/ADR-057-install-ledger-pack-complete.md) - [ADR-059](./adr/ADR-059-ledger-lists-pack-files.md)                                                       | **Done** |
| 15  | backend-01 | Automatic MCP connection from the one-line prompt    | [Web-portal-06 Instructions: MCP auto-connect prompt](./product-backlog.md#L368)     | MCP/Backend        | - [mcp/mcp-design.md](./mcp/mcp-design.md) §2.1 - [mcp/mcp-stories.md](./mcp/mcp-stories.md) `sdd-mcp-prompt-setup` - [ADR-061](./adr/ADR-061-setup-prompt-public-path.md) - [prompt.md](../public/agent-setup/prompt.md) - [next.config.ts](../next.config.ts)                            | **Done** |




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

- [MCP-01](./product-backlog.md#L315) is **Done** for the Sprint 2 installer slice. [MCP-04](./product-backlog.md#L320) owns go-live.

**Future actions**

#### 4. [Sep 26, 2026], Sprint-end

- Go-live is [MCP-04](./product-backlog.md#L320) in Unplanned PBIs: GitHub Releases for the five `sdd-mcp` binaries, pack copy, and admin-portal sync.

---



<a id="sprint-3"></a>

## Sprint 3

[Back to the top](#sprint-backlog-frameworksddworks)

Sprint Goal: Update the web portal and MCP to support framework.sdd.works R2.

Depends on Sprint 2.

**Status: Done**

MCP and web-portal rows stay here. A task that only completes another row is not its own increment. task-02 stays: it puts the framework files in the pack.

### **Done**


| #   | Code       | SBI                                          | Parent PBI                                                                                     | Module/Type        | Related specs                                                                                                                                                                                                                                                                                                                                                                                                                                 | Status   |
| --- | ---------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | feature-19 | Portal catalog with the scrum-in-sdd name    | [Web-portal-12 Instructions tab: sdd-scrum guide](./product-backlog.md#L379)                  | Web-portal/Feature | - [ADR-068](./adr/ADR-068-scrum-in-sdd-filename.md) - [features.en.md](../src/content/features/features.en.md) - [app-design.md](./admin-portal/app-design.md)                                                                                                                                                                                                                                                                                | **Done** |
| 2   | feature-17 | Get secret on Setup                          | [Web-portal-13 Get secret moves to Setup](./product-backlog.md#L384)                          | Web-portal/Feature | - [ADR-067](./adr/ADR-067-get-secret-on-setup.md) - [app-design.md](./admin-portal/app-design.md) - [13-instructions.html](./admin-portal/ui-mockup/13-instructions.html)                                                                                                                                                                                                                                                                     | **Done** |
| 3   | feature-16 | Guide tab on instructions                    | [Web-portal-12 Instructions tab: Scrum in SDD](./product-backlog.md#L379)                     | Web-portal/Feature | - [scrum-in-sdd.md](../pack.framework.sdd.works/templates/EN/scrum-in-sdd.md) - [app-design.md](./admin-portal/app-design.md) - [app-stories.md](./admin-portal/app-stories.md) AC18                                                                                                                                                                                                                                                                    | **Done** |
| 4   | feature-10 | Reset success with the previous sentence     | [Web-portal-11 Reset success stays on page with previous sentence](./product-backlog.md#L424) | Web-portal/Feature | - [issues-log.md](./issues-log.md) WA-08 - [issues-log.md](./issues-log.md) WA-10 - [app-stories.md](./admin-portal/app-stories.md) AC4b - [app-design.md](./admin-portal/app-design.md) - [03-reset.html](./admin-portal/ui-mockup/03-reset.html) - [app-tests.md](./admin-portal/app-tests.md)                                                                                                                                                                                                      | **Done** |
| 5   | feature-09 | Setup and instructions without the list tool | [MCP-03 MCP tools without sdd_list_versions](./product-backlog.md#L335)                       | MCP/Feature        | - [prompt.md](../public/agent-setup/prompt.md) - [InstructionsPage.tsx](../src/components/features/InstructionsPage.tsx) - [en.json](../messages/en.json) - [zh-Hans.json](../messages/zh-Hans.json) - [zh-Hant.json](../messages/zh-Hant.json)                                                                                                                                                                                               | **Done** |
| 6   | feature-08 | MCP tools without sdd_list_versions          | [MCP-03 MCP tools without sdd_list_versions](./product-backlog.md#L335)                       | MCP/Feature        | - [ADR-063](./adr/ADR-063-unregister-sdd-list-versions.md) - [mcp/mcp-design.md](./mcp/mcp-design.md) §3 - [mcp/mcp-tests.md](./mcp/mcp-tests.md) - [create-server.ts](../src/mcp/create-server.ts) - [create-server-stdio.ts](../src/mcp/create-server-stdio.ts) - [create-server.test.ts](../src/mcp/create-server.test.ts) - [local-binary.test.ts](../src/mcp/local-binary.test.ts) - [sdd-api.test.ts](../src/app/api/sdd/sdd-api.test.ts) | **Done** |
| 7   | feature-07 | Features tab of synced markdown              | [Web-portal-07 Features tab reads pack features.md](./product-backlog.md#L373)                | Web-portal/Feature | - [Web-portal-07](./product-backlog.md#L373) - [app-design.md](./admin-portal/app-design.md) Features catalog - [app-stories.md](./admin-portal/app-stories.md) AC12–AC16 - [app-tests.md](./admin-portal/app-tests.md)                                                                                                                                                                                                                   | **Done** |
| 8   | feature-05 | One secret value from Get secret             | [Web-portal-08 Instructions page: Get secret](./product-backlog.md#L419)                      | Web-portal/Feature | - [mcp/mcp-stories.md](./mcp/mcp-stories.md) `sdd-mcp-get-key` - [get-key.ts](../src/core/tools/get-key.ts) - [product-backlog.md](./product-backlog.md#L394) - [InstructionsPage.tsx](../src/components/features/InstructionsPage.tsx) - [issues-log.md](./issues-log.md) WA-09 - WA-11                                                                                                                                                     | **Done** |
| 9   | feature-04 | Secret form at the bottom of Features        | [Web-portal-08 Instructions page: Get secret](./product-backlog.md#L419)                      | Web-portal/Feature | - [app-stories.md](./admin-portal/app-stories.md) AC7 - [app-design.md](./admin-portal/app-design.md) `/instructions` - [app-tests.md](./admin-portal/app-tests.md) - [13-instructions.html](./admin-portal/ui-mockup/13-instructions.html)                                                                                                                                                                                    | **Done** |
| 10  | task-02    | Pack files for the Features tab              | [Web-portal-07 Features tab reads pack features.md](./product-backlog.md#L373)                | Web-portal/Task    | - [mcp/mcp-design.md](./mcp/mcp-design.md) sync cache - [app-design.md](./admin-portal/app-design.md)                                                                                                                                                                                                                                                                                                                                         | **Done** |




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



<a id="sprint-4"></a>

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
| 1   | feature-28 | ethan.md that reads the guide and practices for the step | - [Agent-02 Skill call for a named job](./product-backlog.md#L68) - [Agent-01 Local Cursor agent](./product-backlog.md#L63) | Agent/Feature     | - [ethan.md](../pack.framework.sdd.works/agents/ethan.md) - [scrum-in-sdd.md](../pack.framework.sdd.works/templates/EN/scrum-in-sdd.md) - [sdd-scrum-practices.md](../pack.framework.sdd.works/templates/EN/sdd-scrum-practices.md)                                                                                                                                                                                                                                                                                                             | **Done** |
| 2   | feature-23 | Initial sdd-audit-artifacts                              | [Skill-08 Skill: sdd-audit-artifacts](./product-backlog.md#L101)                                                                             | Skill/Feature     | - [framework-design.md](./framework/framework-design.md#sdd-audit-artifacts) - [framework-stories.md](./framework/framework-stories.md#sdd-audit-artifacts)                                                                                                                                                                                                                                                                                                                                                       | **Done** |
| 3   | feature-18 | Renamed guide file to scrum-in-sdd.md                    | [Spec-seeds-01 Seed: scrum-in-sdd.md](./product-backlog.md#L227)                                                                             | Framework/Feature | - [ADR-068](./adr/ADR-068-scrum-in-sdd-filename.md) - [scrum-in-sdd.md](../pack.framework.sdd.works/templates/EN/scrum-in-sdd.md)                                                                                                                                                                                                                                                                                                                                                                                           | **Done** |
| 4   | feature-11 | Updated agent ethan.md with onboard capability           | [Agent-02 Skill call for a named job](./product-backlog.md#L68)                                                                       | Agent/Feature     | - [framework-design.md](./framework/framework-design.md) §2.2 and §2.4 - [ADR-073](./adr/ADR-073-skill-get-status.md)                                                                                                                                                                                                                                                                                                                                                                                          | **Done** |
| 5   | feature-04 | Sprint-backlog seed                                      | [Spec-seeds-06 Seed: sprint-backlog.md](./product-backlog.md#L250)                                                                           | Framework/Feature | - [sprint-backlog.md](../pack.framework.sdd.works/templates/EN/sprint-backlog.md) - [sdd-scrum-practices.md](../pack.framework.sdd.works/templates/EN/sdd-scrum-practices.md#sprint-backlogmd) - [framework-design.md](./framework/framework-design.md#sprint-backlogmd) - [seed-artifacts-building-guide.md](./seed-artifacts-building-guide.md)                                                                                                                                                                                     | **Done** |
| 6   | feature-27 | Seed status.md                                           | [Spec-seeds-07 Seed: status.md](./product-backlog.md#L252)                                                                                   | Framework/Feature | - [status.md](../pack.framework.sdd.works/templates/EN/status.md) - [framework-design.md](./framework/framework-design.md#statusmd) - [sdd-scrum-practices.md](../pack.framework.sdd.works/templates/EN/sdd-scrum-practices.md#statusmd) - [seed-artifacts-building-guide.md](./seed-artifacts-building-guide.md)                                                                                                                                                                                                                     | **Done** |
| 7   | feature-29 | Merged agent-design in framework-design                  | [Agent-02 Skill call for a named job](./product-backlog.md#L68)                                                                       | Framework/Task    | [framework-design.md](./framework/framework-design.md)                                                                                                                                                                                                                                                                                                                                                                                                                                                            | **Done** |
| 8   | feature-03 | Project path file artifacts-map.json                     | [Spec-seeds-04 Seed: artifacts-map.json](./product-backlog.md#L238)                                                                          | Framework/Feature | - [ADR-080](./adr/ADR-080-no-artifacts-map-seed.md) - [ADR-082](./adr/ADR-082-artifacts-map-json.md) - [sdd-scrum-practices.md](../pack.framework.sdd.works/templates/EN/sdd-scrum-practices.md#artifacts-mapjson)                                                                                                                                                                                                                                                                                                               | **Done** |
| 9   | feature-21 | Change-log and issues-log seeds                          | - [Spec-seeds-08 Seed: changes-log.md](./product-backlog.md#L255) - [Spec-seeds-09 Seed: issues-log.md](./product-backlog.md#L258)          | Framework/Feature | - [ADR-070](./adr/ADR-070-change-log-and-issues-log.md) - [ADR-075](./adr/ADR-075-issues-log-tables.md) - [changes-log.md](../pack.framework.sdd.works/templates/EN/changes-log.md) - [issues-log.md](../pack.framework.sdd.works/templates/EN/issues-log.md) - [sdd-scrum-practices.md](../pack.framework.sdd.works/templates/EN/sdd-scrum-practices.md#changes-logmd) - [sdd-scrum-practices.md](../pack.framework.sdd.works/templates/EN/sdd-scrum-practices.md#issues-logmd) - [seed-artifacts-building-guide.md](./seed-artifacts-building-guide.md) | **Done**  |
| 10  | feature-30 | Practices job 6 for report status                        | [Skill-12 Skill: sdd-review-status](./product-backlog.md#L113)                                                                               | Skill/Feature     | - [ADR-076](./adr/ADR-076-review-status-one-skill.md) - [sdd-review-status](../pack.framework.sdd.works/skills/sdd-review-status/SKILL.md)                                                                                                                                                                                                                                                                                                                                                                                  | **Retired** |
| 11  | feature-24 | Skill sdd-review-status                                  | [Skill-12 Skill: sdd-review-status](./product-backlog.md#L113)                                                                               | Skill/Feature     | - [ADR-076](./adr/ADR-076-review-status-one-skill.md) - [ADR-073](./adr/ADR-073-skill-get-status.md) - [sdd-review-status](../pack.framework.sdd.works/skills/sdd-review-status/SKILL.md)                                                                                                                                                                                                                                                                                                                                   | **Done** |
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

- The HanS and HanT status.md seeds follow when [i18n-02](./product-backlog.md#L296) is scheduled.



#### 2. [Oct 1, 2026], feature-04 done

- The HanS and HanT sprint-backlog seeds follow when [i18n-02](./product-backlog.md#L296) is scheduled.

#### 3. [Oct 3, 2026], Sprint-end

- The Current OGT rows stay ToDo until a later sprint plan assigns them.
- HanS and HanT practices copies stay on [i18n-02](./product-backlog.md#L296) in Unplanned PBIs until scheduled.

---

<a id="sprint-5"></a>

## Sprint 5

[Back to the top](#sprint-backlog-frameworksddworks)

Sprint Goal: A developer finishes update-project, creates process files, refines the backlog, and plans the next sprint so that the SDD planning loop works on a new project.

Depends on Sprint 4 (agent ethan onboard, process seeds, and review-status skill).

**Status: Done**

The user confirmed Sprint 5 usable on 2026-10-05.

### **Done**


| #   | Code       | SBI                      | Parent PBI                                                                 | Module/Type   | Related specs                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Status   |
| --- | ---------- | ------------------------ | -------------------------------------------------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | feature-31 | Skill sdd-update-project | [Skill-03 Pack skill sdd-update-project](./product-backlog.md#L89)       | Skill/Feature | - [Agent-02](./product-backlog.md#L68)<br>- [ADR-079](./adr/ADR-079-one-job-update-project.md)<br>- [sdd-update-project](../pack.framework.sdd.works/skills/sdd-update-project/SKILL.md)                                                                                                                                                                                                                                                                                              | **Done** |
| 2   | feature-32 | Skill sdd-refine-backlog | [Skill-04 Pack skill sdd-refine-backlog](./product-backlog.md#L92)       | Skill/Feature | - [Agent-02](./product-backlog.md#L68)<br>- [sdd-refine-backlog](../pack.framework.sdd.works/skills/sdd-refine-backlog/SKILL.md)                                                                                                                                                                                                                                                                                                                                                       | **Done** |
| 3   | feature-33 | Skill sdd-plan-sprint    | [Skill-05 Pack skill sdd-plan-sprint](./product-backlog.md#L94)          | Skill/Feature | - [Agent-02](./product-backlog.md#L68)<br>- [sdd-plan-sprint](../pack.framework.sdd.works/skills/sdd-plan-sprint/SKILL.md)                                                                                                                                                                                                                                                                                                                                                           | **Done** |
| 4   | feature-34 | Skill sdd-create-skill   | [Skill-13 Pack skill sdd-create-skill](./product-backlog.md#L115)         | Skill/Feature | - [ADR-074](./adr/ADR-074-sdd-create-skill.md)<br>- [ADR-092](./adr/ADR-092-pack-authoring-skill-sdd-prefix.md)<br>- [sdd-create-skill](../pack.framework.sdd.works/skills/sdd-create-skill/SKILL.md)                                                                                                                                                                                                                                                                                   | **Done** |
| 5   | feature-35 | Skill sdd-build-agent    | [Skill-15 Pack skill sdd-build-agent](./product-backlog.md#L126)          | Skill/Feature | - [ADR-092](./adr/ADR-092-pack-authoring-skill-sdd-prefix.md)<br>- [framework-design § sdd-build-agent](./framework/framework-design.md#sdd-build-agent)<br>- [sdd-build-agent](../pack.framework.sdd.works/skills/sdd-build-agent/SKILL.md)                                                                                                                                                                                                                                          | **Done** |
| 6   | feature-36 | Skill sdd-create-rule    | [Skill-16 Pack skill sdd-create-rule](./product-backlog.md#L130)            | Skill/Feature | - [ADR-092](./adr/ADR-092-pack-authoring-skill-sdd-prefix.md)<br>- [sdd-create-rule](../pack.framework.sdd.works/skills/sdd-create-rule/SKILL.md)<br>- [framework-design § sdd-create-rule](./framework/framework-design.md#sdd-create-rule)                                                                                                                                                                                                                                             | **Done** |

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

<a id="sprint-6"></a>

## Sprint 6

[Back to the top](#sprint-backlog-frameworksddworks)

Sprint Goal: A developer runs the full Scrum-in-SDD process on a new project with pack rules, the remaining process skills, and EN seeds for the five process files.

Depends on Sprint 5 (planning loop and pack authoring skills).

**Status: Done**

The user confirmed every Sprint 6 SBI usable and the sprint goal on 2026-10-05.

### **Done**

Additional Done Criteria, on top of the Definition of Done:

- `task-01`: The five EN process seeds match practices Template and How to write. Live process files follow the same rules. Associated specs were updated where review found drift. Link audit and CE-TPL-01, CE-TPL-04, CE-TPL-08 through CE-TPL-11 passed for this scope.

| #   | Code       | SBI                                | Parent PBI                                                               | Module/Type  | Related specs                                                     | Status   |
| --- | ---------- | ---------------------------------- | ------------------------------------------------------------------------ | ------------ | ----------------------------------------------------------------- | -------- |
| 1   | feature-38 | Pack rule sdd-incremental-delivery.mdc | [Rule-02 Pack rule sdd-incremental-delivery.mdc](./product-backlog.md#L204) | Rule/Feature | [Spec-seeds-03 Seed constants.json](./product-backlog.md#L234)  | **Done** |
| 2   | feature-39 | Retire realtime-status (Option C)   | [Rule-03 Pack rule realtime-status.mdc](./product-backlog.md#L206)       | Rule/Feature | [ADR-091](./adr/ADR-091-retire-realtime-status-rule.md): rule removed; `sdd-dod.mdc` owns `status.md` on close. Parent PBI stays **Retired**. | **Done** |
| 3   | feature-41 | Retire sdd-close-sprint (Skill-07)                | [Skill-07 Pack skill sdd-close-sprint](./product-backlog.md#L99)         | Skill/Feature     | [ADR-076](./adr/ADR-076-review-status-one-skill.md): no `sdd-close-sprint` seed; sprint open/close stays in practices and planning skills. Parent PBI **Retired**. | **Done** |
| 4   | feature-43 | Pack rule sdd-realtime-status.mdc         | [Rule-03 Pack rule sdd-realtime-status.mdc](./product-backlog.md#L206)       | Rule/Feature      | [ADR-096](./adr/ADR-096-sdd-realtime-status-rule-name.md)<br>- [Spec-seeds-03 Seed constants.json](./product-backlog.md#L234)                                                                                                                                                                                                               | **Done** |
| 5   | feature-37 | Pack rule sdd-dod.mdc                 | [Rule-01 Pack rule sdd-dod.mdc](./product-backlog.md#L202)                | Rule/Feature      | [Spec-seeds-03 Seed constants.json](./product-backlog.md#L234)                                                                                                                                                                                                                                                                             | **Done** |
| 6   | feature-40 | Skill sdd-retrospective               | [Skill-06 Pack skill sdd-retrospective](./product-backlog.md#L96)        | Skill/Feature     | [Agent-02 Skill call for a named job](./product-backlog.md#L68)                                                                                                                                                                                                                                                                              | **Done** |
| 7   | feature-42 | Seed product-backlog.md               | [Spec-seeds-05 Seed product-backlog.md](./product-backlog.md#L247)        | Framework/Feature | - [MCP-01 Installer allow-list and file ledger](./product-backlog.md#L315)<br>- [i18n-02 HanS and HanT process artifacts](./product-backlog.md#L296)<br>- [product-backlog.md seed](../pack.framework.sdd.works/templates/EN/product-backlog.md)                                                                                                                                                                                      | **Done** |
| 8   | task-01    | Cross-review five process file seeds  | [Spec-seeds-06 Seed sprint-backlog.md](./product-backlog.md#L250)         | Framework/Task    | - [seed-artifacts-building-guide.md](./seed-artifacts-building-guide.md)<br>- [Spec-seeds-05](./product-backlog.md#L247)<br>- [Spec-seeds-07](./product-backlog.md#L252)<br>- [Spec-seeds-08](./product-backlog.md#L255)<br>- [Spec-seeds-09 Seed issues-log.md](./product-backlog.md#L258)                                            | **Done** |

### Retrospective

**Learnings**

#### 1. [Oct 5, 2026], feature-38 Pack rule sdd-incremental-delivery.mdc done, feature-39 Retire realtime-status (Option C) done, feature-41 Retire sdd-close-sprint (Skill-07) done, feature-43 Pack rule sdd-realtime-status.mdc done
- Harness rules use the `sdd-` prefix and `constants.json` keys `dod`, `incremental-delivery`, and `realtime-status` ([ADR-094](./adr/ADR-094-sdd-prefix-framework-rules.md), [ADR-096](./adr/ADR-096-sdd-realtime-status-rule-name.md)).
- Unprefixed `realtime-status.mdc` stays retired; WIP sync is `sdd-realtime-status.mdc` ([ADR-091](./adr/ADR-091-retire-realtime-status-rule.md), [ADR-093](./adr/ADR-093-keep-update-wip-rule.md)).
- `sdd-close-sprint` does not ship; Skill-07 is retired ([ADR-076](./adr/ADR-076-review-status-one-skill.md)).
- Closing SBIs from status review alone skipped the retrospective gate until catch-up ([dod-retrospective-before-sbi-done](./knowledge/agent/dod-retrospective-before-sbi-done.md)).

#### 2. [Oct 5, 2026], feature-42 Seed product-backlog.md done
- The EN [product-backlog.md](../pack.framework.sdd.works/templates/EN/product-backlog.md) seed is a placeholder template; `sdd-update-project` copies it only when the target is missing.
- The seed matches [framework-stories AC1](./framework/framework-stories.md) column order and Requirements link pattern. Five sections: Product overview, additional DoD, Requirements, Product Backlog, Change record.

#### 3. [Oct 5, 2026], feature-37 Pack rule sdd-dod.mdc done, feature-40 Skill sdd-retrospective done
- [`sdd-dod.mdc`](../pack.framework.sdd.works/rules/sdd-dod.mdc) is the pack close gate; `constants.json` key `dod` points at that file ([ADR-094](./adr/ADR-094-sdd-prefix-framework-rules.md)).
- [`sdd-retrospective`](../pack.framework.sdd.works/skills/sdd-retrospective/SKILL.md) runs before SBI or PBI **Done** writes and appends Learnings, Opportunities, and Future actions with incident triggers ([ADR-097](./adr/ADR-097-done-runs-retrospective.md)).

#### 4. [Oct 5, 2026], feature-42 Seed product-backlog.md done
- User re-confirmed usable after Sprint 6 set [feature-42](./sprint-backlog.md#sprint-6) **WIP** again when [feature-37](./sprint-backlog.md#sprint-6) and [feature-40](./sprint-backlog.md#sprint-6) closed.
- Sprint DoD links [Definition of Done](./product-backlog.md#definition-of-done) per [ADR-098](./adr/ADR-098-sprint-backlog-dod-link-product-backlog.md). EN seed matches [process-artifacts](./framework/framework-stories.md#process-artifacts) AC1. [i18n-02](./product-backlog.md#L296) is **Retired**; HanS and HanT process seeds are [i18n-05](./product-backlog.md#L301).

#### 5. [Oct 5, 2026], task-01 Cross-review five process file seeds done
- Live process files and EN seeds were reviewed against [`seed-artifacts-building-guide.md`](./seed-artifacts-building-guide.md) and practices sections for all five artifacts.
- Historical [`changes-log.md`](./changes-log.md) entries may still name retired paths; new edits use current seeds and [`artifacts-map.json`](../artifacts-map.json).

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

<a id="sprint-7"></a>

## Sprint 7

[Back to the top](#sprint-backlog-frameworksddworks)

Sprint Goal: A developer specifies and builds product work with pack engineering skills and EN engineering artifact seeds.

Depends on Sprint 6 (process loop and process seeds).

**Status: Done**

### **Done**

| #   | Code    | SBI                                      | Parent PBI                                                 | Module/Type    | Related specs                                                                                                                          | Status   |
| --- | ------- | ---------------------------------------- | ---------------------------------------------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | task-01 | Story mapping and US/AC writing guidance | [Skill-01 Pack skill atdd-expert](./product-backlog.md#L87) | Framework/Task | - [app-stories.md](./admin-portal/app-stories.md)<br>- [sdd-scrum-practices.md](../pack.framework.sdd.works/templates/EN/sdd-scrum-practices.md) | **Done** |
| 2   | feature-52 | Skill sdd-atdd          | [Skill-01 Pack skill atdd-expert](./product-backlog.md#L87)            | Skill/Feature     | —                                                                                                                      | **Done** |
| 3   | feature-44 | Skill sdd-update-specs  | [Skill-09 Pack skill sdd-update-specs](./product-backlog.md#L106)    | Skill/Feature     | [Skill-11 Pack skill sdd-spec-to-build](./product-backlog.md#L108)                                                    | **Done** |
| 4   | feature-46 | Skill improve-prompt    | [Skill-14 Pack skill improve-prompt](./product-backlog.md#L120)      | Skill/Feature     | [ADR-099](./adr/ADR-099-improve-prompt-skill-name.md), [framework-design § improve-prompt](./framework/framework-design.md#improve-prompt), [improve-prompt](../pack.framework.sdd.works/skills/improve-prompt/SKILL.md), **CE-SKILL-13** | **Done** |
| 5   | feature-47 | Seed architecture.md    | [Spec-seeds-10 Seed architecture.md](./product-backlog.md#L266)      | Framework/Feature | - [MCP-01](./product-backlog.md#L315)<br>- [i18n-03](./product-backlog.md#L304)                                    | **Done** |
| 6   | feature-48 | Seed release.md         | [Spec-seeds-11 Seed release.md](./product-backlog.md#L268)           | Framework/Feature | - [MCP-01](./product-backlog.md#L315)<br>- [release.md seed](../pack.framework.sdd.works/templates/EN/release.md)<br>- [i18n-03](./product-backlog.md#L304) | **Done** |
| 7   | feature-50 | Seed test-strategy.md   | [Spec-seeds-13 Seed test-strategy.md](./product-backlog.md#L274)     | Framework/Feature | - [Spec-seeds-02](./product-backlog.md#L230)<br>- [test-strategy.md seed](../pack.framework.sdd.works/templates/EN/test-strategy.md)<br>- [i18n-03](./product-backlog.md#L304) | **Done** |
| 8   | feature-49 | Seed .secrets           | [Spec-seeds-12 Seed .secrets](./product-backlog.md#L270)             | Framework/Feature | - [MCP-01](./product-backlog.md#L315)<br>- [.secrets seed](../pack.framework.sdd.works/templates/EN/.secrets)<br>- [i18n-03](./product-backlog.md#L304) | **Done** |
| 9   | feature-63 | Pack rule friendly-language.mdc | [Rule-04 Pack rule friendly-language.mdc](./product-backlog.md#L208) | Rule/Feature | - [Spec-seeds-03](./product-backlog.md#L234)<br>- [friendly-language.mdc](../pack.framework.sdd.works/rules/friendly-language.mdc)<br>- [framework-design § friendly-language.mdc](./framework/framework-design.md#friendly-languagemdc) | **Done** |
| 10  | feature-45 | Skill sdd-spec-to-build | [Skill-11 Pack skill sdd-spec-to-build](./product-backlog.md#L108) | Skill/Feature | - [sdd-spec-to-build/SKILL.md](../pack.framework.sdd.works/skills/sdd-spec-to-build/SKILL.md)<br>- [readiness.md](../pack.framework.sdd.works/skills/sdd-spec-to-build/readiness.md)<br>- [ADR-085](./adr/ADR-085-sdd-spec-to-build.md) | **Done** |
| 11  | feature-61 | Skill frontend-designer | [Skill-17 Pack skill frontend-designer](./product-backlog.md#L134) | Skill/Feature | - [ADR-105](./adr/ADR-105-frontend-designer-pack-skill-name.md)<br>- **CE-SKILL-15** | **Done** |
| 12  | feature-62 | Skill testing-expert | [Skill-18 Pack skill testing-expert](./product-backlog.md#L140) | Skill/Feature | - [ADR-102](./adr/ADR-102-testing-expert-pack-skill-name.md)<br>- **CE-SKILL-20** | **Done** |
| 13  | feature-64 | Skill frontend-developer | [Skill-19 Pack skill frontend-developer](./product-backlog.md#L150) | Skill/Feature | - [ADR-103](./adr/ADR-103-frontend-developer-pack-skill-name.md)<br>- **CE-SKILL-21** | **Done** |
| 14  | feature-65 | Skill fullstack-engineer | [Skill-20 Pack skill fullstack-engineer](./product-backlog.md#L158) | Skill/Feature | - [ADR-104](./adr/ADR-104-fullstack-engineer-pack-skill-name.md)<br>- **CE-SKILL-16** | **Done** |
| 15  | feature-66 | Skill ai-architect | [Skill-21 Pack skill ai-architect](./product-backlog.md#L165) | Skill/Feature | - **CE-SKILL-17** | **Done** |
| 16  | feature-67 | Skill mcp-expert | [Skill-22 Pack skill mcp-expert](./product-backlog.md#L174) | Skill/Feature | - **CE-SKILL-18** | **Done** |
| 17  | feature-68 | Skill rag-expert | [Skill-23 Pack skill rag-expert](./product-backlog.md#L182) | Skill/Feature | - **CE-SKILL-19** | **Done** |

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
- EN product-level seeds [architecture.md](../pack.framework.sdd.works/templates/EN/architecture.md), [release.md](../pack.framework.sdd.works/templates/EN/release.md), and [test-strategy.md](../pack.framework.sdd.works/templates/EN/test-strategy.md) match practices `#architecturemd`, `#releasemd`, and test-strategy section. HanS and HanT bodies stay on [i18n-03](./product-backlog.md#L304).

#### 3. [Oct 5, 2026], feature-49 done
- User confirmed the dotenv-shaped EN [`.secrets`](../pack.framework.sdd.works/templates/EN/.secrets) seed usable (`looks good`). No repo under `~/code` had a good `.secrets` example; the seed uses empty `KEY=` lines and `#` comments for where values live.
- [Spec-seeds-12](./product-backlog.md#L270) **Done** with [feature-49](./sprint-backlog.md#sprint-7). Practices `#secrets` documents the shape. No new ADR or knowledge file.

#### 4. [Oct 6, 2026], feature-61, feature-62, feature-64, feature-65, feature-66, feature-67, feature-68 done
- User **close confirm** in one message for seven domain pack skills. Seeds under `pack.framework.sdd.works/skills/` match [`framework-design` § Pack skill seed catalog](./framework/framework-design.md#pack-skill-seed-catalog) and **CE-SKILL-15** through **CE-SKILL-21**.
- [Skill-17](./product-backlog.md#L134) through [Skill-23](./product-backlog.md#L182) close with their Sprint 7 rows.
- No new ADR or knowledge file. L1 recorded passes for **CE-SKILL-15** through **21** stay optional follow-up per OGT 8.

#### 5. [Oct 6, 2026], Sprint-end
- User confirmed Sprint 7 usable and asked to mark the sprint **Done**. All seventeen SBIs **Done**. Sprint goal met: pack engineering skills and EN engineering artifact seeds shipped for spec-to-build workflows.
- [Sprint 8](./sprint-backlog.md#sprint-8) opens **WIP** with lite install, Ethan, tabs, and Skill-24 (replanned 2026-10-07; MCP-05 and task-03 dropped).

**Future actions**

#### 1. [Oct 5, 2026], feature-52, feature-44, feature-46, feature-47, feature-48, feature-50 done
- Run [CE-SKILL-12](./framework/framework-tests.md), [CE-SKILL-14](./framework/framework-tests.md), and [CE-SKILL-13](./framework/framework-tests.md) in L1 when a recorded pass is still open.

---

<a id="sprint-8"></a>

## Sprint 8

[Back to the top](#sprint-backlog-frameworksddworks)

Sprint Goal: Ethan routes named jobs and guiding proposals; lite HTTP install ships manifest, links, client receipt, prompt, and copy; instructions tabs come from pack JSON; sdd-retrospective meets the current pack skill bar.

Depends on Sprint 7 (engineering skills and seeds).

**Status: WIP**

### **Done**

| #   | Code       | SBI                        | Parent PBI                                                          | Module/Type     | Related specs                                                                                                      | Status   |
| --- | ---------- | -------------------------- | ------------------------------------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------ | -------- |
| 1   | feature-53 | Lite install manifest file | [Spec-seeds-15 Lite install manifest file](./product-backlog.md#L442) | Framework/Feature | - [ADR-107](./adr/ADR-107-lite-pack-allowlist-filename.md)<br>- [Web-portal-17](./product-backlog.md#L446)<br>- [MCP-07](./product-backlog.md#L325)<br>- **CE-LITE-01**, **CE-LITE-02** | **Done** |
| 2   | feature-57 | Lite install client receipt | [Spec-seeds-18 Lite install client receipt](./product-backlog.md#L449) | Framework/Feature | - [Spec-seeds-15](./product-backlog.md#L442)<br>- [Web-portal-17](./product-backlog.md#L446)<br>- [Web-portal-18](./product-backlog.md#L455)<br>- **CE-LITE-03**, **CE-LITE-04** | **Done** |

### **ToDo**


| #   | Code       | SBI                                        | Parent PBI                                                                 | Module/Type    | Related specs                                                                                                                                                                                                                                                          | Status   |
| --- | ---------- | ------------------------------------------ | -------------------------------------------------------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | feature-51 | Agent guiding proposals                    | [Agent-03 Guiding proposals from framework knowledge](./product-backlog.md#L73) | Agent/Feature  | - [scrum-in-sdd.md](../pack.framework.sdd.works/templates/EN/scrum-in-sdd.md)<br>- [coach-knowledge.md](../pack.framework.sdd.works/templates/EN/coach-knowledge.md)<br>- [sdd-scrum-practices.md](../pack.framework.sdd.works/templates/EN/sdd-scrum-practices.md)<br>- [ADR-106](./adr/ADR-106-coach-knowledge-file.md)<br>- [artifacts-map.json](../artifacts-map.json) | **WIP** |
| 2   | task-01    | Complete Agent-02 job index in ethan.md    | [Agent-02 Skill call for a named job](./product-backlog.md#L68)             | Agent/Task     | - [ethan.md](../pack.framework.sdd.works/agents/ethan.md)<br>- [Spec-seeds-03](./product-backlog.md#L234)<br>- [Skill-03](./product-backlog.md#L89)–[Skill-06](./product-backlog.md#L96), [Skill-08](./product-backlog.md#L101), [Skill-12](./product-backlog.md#L113), [Skill-13](./product-backlog.md#L115)–[Skill-16](./product-backlog.md#L130), [Skill-17](./product-backlog.md#L134)–[Skill-24](./product-backlog.md#L191) | **WIP** |
| 3   | feature-55 | Lite install file links API                | [Web-portal-17 Lite install file links API](./product-backlog.md#L446)            | Webapp/Feature | - [Spec-seeds-15](./product-backlog.md#L442)<br>- [Spec-seeds-18](./product-backlog.md#L449)<br>- [MCP-07](./product-backlog.md#L325)<br>- [`app-design.md`](./admin-portal/app-design.md) Lite install file links<br>- AC19 [`app-stories.md`](./admin-portal/app-stories.md)                                                                                                            | **ToDo** |
| 4   | feature-56 | Lite install prompt and one-line copy      | [Web-portal-18 Lite install prompt and one-line copy](./product-backlog.md#L455) | Webapp/Feature | - [Web-portal-17](./product-backlog.md#L446)<br>- [Spec-seeds-18](./product-backlog.md#L449)<br>- [Web-portal-04](./product-backlog.md#L359)<br>- [Web-portal-06](./product-backlog.md#L368)<br>- [ADR-061](./adr/ADR-061-setup-prompt-public-path.md)<br>- [`admin-portal/app-stories.md`](./admin-portal/app-stories.md) AC20–AC21 | **ToDo** |
| 5   | feature-58 | Pack instructions tabs JSON                | [Spec-seeds-16 Pack instructions tabs JSON](./product-backlog.md#L277)   | Framework/Feature | - [Web-portal-24](./product-backlog.md#L391)<br>- [Web-portal-25](./product-backlog.md#L394)<br>- [ADR-071](./adr/ADR-071-portal-content-paths.md)                                                                                              | **ToDo** |
| 6   | feature-59 | Instructions tabs config API               | [Web-portal-24 Instructions tabs config API](./product-backlog.md#L391) | Webapp/Feature | - [Spec-seeds-16](./product-backlog.md#L277)<br>- [MCP-01](./product-backlog.md#L315)<br>- [ADR-071](./adr/ADR-071-portal-content-paths.md)                                                                                                           | **ToDo** |
| 7   | feature-60 | Dynamic instructions tab UI               | [Web-portal-25 Dynamic instructions tab UI](./product-backlog.md#L394)   | Webapp/Feature | - [Web-portal-24](./product-backlog.md#L391)<br>- [Web-portal-05](./product-backlog.md#L363)<br>- [Web-portal-10](./product-backlog.md#L421)<br>- `[admin-portal/app-design.md](./admin-portal/app-design.md)`                                                    | **ToDo** |
| 8   | feature-69 | Skill sdd-retrospective                   | [Skill-24 Pack skill sdd-retrospective](./product-backlog.md#L191)       | Skill/Feature | - [Skill-06](./product-backlog.md#L96)<br>- [Skill-12](./product-backlog.md#L113)<br>- [Agent-02](./product-backlog.md#L68)<br>- [sdd-retrospective](../pack.framework.sdd.works/skills/sdd-retrospective/SKILL.md)<br>- **CE-SKILL-10** | **ToDo** |

### Retrospective

**Learnings**

#### 1. [Oct 7, 2026], feature-53 done
- User **close confirm** for the lite allow-list seed: [`lite-pack.allowlist.json`](../pack.framework.sdd.works/lite-pack.allowlist.json), [`validateLiteInstallManifest`](../src/core/seeds/lite-install-manifest.ts), and **CE-LITE-01** / **CE-LITE-02** in Vitest.
- Pack repo root copy of the same file is manual go-live; user confirmed that step done. [Spec-seeds-15](./product-backlog.md#L442) stays **ToDo** until [MCP-07](./product-backlog.md#L325) puts the manifest in sync cache and install tarball.
- [Web-portal-17](./product-backlog.md#L446) should reuse the validator when [feature-55](./sprint-backlog.md#sprint-8) ships. No new ADR or knowledge file.

#### 2. [Oct 7, 2026], feature-57 done
- User **close confirm** for lite receipt: [`.sdd-lite-installed.example.json`](../pack.framework.sdd.works/.sdd-lite-installed.example.json), [`validateLiteInstallReceipt`](../src/core/seeds/lite-install-receipt.ts), [`planLiteInstallReceipt`](../src/core/seeds/lite-install-receipt.ts), and **CE-LITE-03** / **CE-LITE-04** in Vitest.
- The example seed stays outside the MCP install allow-list (same pattern as `.sdd-installed.example.json`). Optional mirror under `pack.framework.sdd.works/` in the pack GitHub repo is operator go-live, not a server sync gate.
- [Web-portal-18](./product-backlog.md#L455) Part 1 and the local agent still apply these rules at runtime; no new ADR or knowledge file.

---

<a id="unplanned-pbis"></a>

## Unplanned PBIs

[Back to the top](#sprint-backlog-frameworksddworks)

> Product backlog items with no sprint assignment. The table matches the Product Backlog table in `product-backlog.md` without the `Sprint` column. Link each PBI code to `./product-backlog.md#L{line}` on the matching Requirements line. Do not add a `#pb-N` anchor in this file.


| # | Component | PBI Code | Description | Size | Related | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | framework | [i18n-03](./product-backlog.md#L304) | HanS and HanT engineering artifacts | Implementable | - [Spec-seeds-10](./product-backlog.md#L266)<br>- [Spec-seeds-11](./product-backlog.md#L268)<br>- [Spec-seeds-12](./product-backlog.md#L270)<br>- [Spec-seeds-13](./product-backlog.md#L274) | ToDo |
| 2 | framework | [i18n-04](./product-backlog.md#L298) | HanS and HanT scrum-in-sdd.md | Implementable | - [Spec-seeds-01](./product-backlog.md#L227) | ToDo |
| 3 | framework | [i18n-05](./product-backlog.md#L301) | HanS and HanT process template seeds | Implementable | - [Spec-seeds-05](./product-backlog.md#L247)–[Spec-seeds-08](./product-backlog.md#L255) | ToDo |
| 4 | mcp | [MCP-06](./product-backlog.md#L322) | sdd-mcp GitHub Releases | Implementable | - [MCP-02](./product-backlog.md#L328) | ToDo |
| 5 | mcp | [MCP-07](./product-backlog.md#L325) | Production pack sync for install | Implementable | - [MCP-01](./product-backlog.md#L315)<br>- [Spec-seeds-14](./product-backlog.md#L398) | ToDo |
| 6 | webapp | [Spec-seeds-14](./product-backlog.md#L398) | Seed features.md under content/features | Implementable | - [Web-portal-07](./product-backlog.md#L373)<br>- [MCP-07](./product-backlog.md#L325) | ToDo |
| 7 | webapp | [Web-portal-01](./product-backlog.md#L353) | Invoking agents, skills, and rules tab | Implementable | - [ADR-071](./adr/ADR-071-portal-content-paths.md)<br>- [Web-portal-07](./product-backlog.md#L373) | ToDo |
| 8 | webapp | [Web-portal-21](./product-backlog.md#L411) | Install-first public landing | Implementable | - [Web-portal-06](./product-backlog.md#L368)<br>- [Web-portal-18](./product-backlog.md#L449) | ToDo |
| 9 | webapp | [Web-portal-20](./product-backlog.md#L408) | Canonical public hostname | Implementable | - [Web-portal-09](./product-backlog.md#L403)<br>- [Web-portal-21](./product-backlog.md#L411)<br>- [Web-portal-22](./product-backlog.md#L414) | ToDo |
| 10 | webapp | [Web-portal-22](./product-backlog.md#L414) | Admin routes off public hostname | Implementable | - [Web-portal-09](./product-backlog.md#L403)<br>- [Web-portal-20](./product-backlog.md#L408) | ToDo |
| 11 | framework | [Spec-seeds-17](./product-backlog.md#L282) | Reviewed full pack seeds file | Implementable | - [MCP-01](./product-backlog.md#L315)<br>- [Agent-04](./product-backlog.md#L76)<br>- [ADR-057](./adr/ADR-057-install-ledger-pack-complete.md)<br>- [ADR-059](./adr/ADR-059-ledger-lists-pack-files.md)<br>- [seed-artifacts-building-guide.md](./seed-artifacts-building-guide.md) | ToDo |
| 12 | webapp | [Web-portal-26](./product-backlog.md#L419) | Pack repo file note on Admin Settings | Implementable | - [ADR-107](./adr/ADR-107-lite-pack-allowlist-filename.md)<br>- [Spec-seeds-15](./product-backlog.md#L437)<br>- [Spec-seeds-18](./product-backlog.md#L444)<br>- [MCP-07](./product-backlog.md#L325) | ToDo |