## What the framework does

Scrum in SDD: Defines a Scrum-aligned approach to Spec-Driven Development.
SDD.works: Installs a framework pack for implementing Scrum in SDD under Harness Engineering governance.

## Features

### Agents


| Name  | Role                                                |
| ----- | --------------------------------------------------- |
| ethan | Local Scrum in SDD coach; does not install the pack |


### Skills (Scrum and process)


| Name                | Role                                                                      |
| ------------------- | ------------------------------------------------------------------------- |
| sdd-update-project  | Set specs folder and module map; write `artifacts-map.json` after confirm |
| sdd-audit-artifacts | Read-only audit: Uninitialized, Index broken, or Usable                   |
| sdd-review-status   | Compare the five process files and propose next steps                     |
| sdd-refine-backlog  | Review product backlog readiness; write after the user picks              |
| sdd-plan-sprint     | Assign PBIs to sprints; sprint open and close in one skill                |
| sdd-retrospective   | Retrospective after DoD, sprint-end, or on demand                         |
| sdd-spec-to-build   | Engineering readiness then build for one SBI                              |
| sdd-update-specs    | Sync engineering specs with the implementation                            |
| atdd-expert         | User stories and Gherkin acceptance criteria                              |
| sdd-build-agent     | Create or revise an agent file after confirm                              |
| sdd-create-skill    | Create or revise a skill file after confirm                               |
| sdd-create-rule     | Create or revise a rule file after confirm                                |




### Skills (Build helpers)


| Name               | Role                                        |
| ------------------ | ------------------------------------------- |
| testing-expert     | Test strategy, layers, and execution        |
| fullstack-engineer | Web feature end to end in the project stack |
| frontend-developer | UI components, pages, and client wiring     |
| frontend-designer  | Visual design for new or redesigned UI      |
| ai-architect       | AI and ML system design                     |
| rag-expert         | RAG architecture and recommendations        |
| mcp-expert         | MCP server design and integration           |
| improve-prompt     | Rewrite a draft prompt for paste            |


Lite HTTP install ships a subset of build helpers and `friendly-language.mdc` only.

### Rules


| File                         | Role                                     |
| ---------------------------- | ---------------------------------------- |
| sdd-dod.mdc                  | Definition of Done; backlog close writes |
| sdd-incremental-delivery.mdc | Finish one SBI before the next           |
| sdd-realtime-status.mdc      | WIP checkpoints on process files         |
| friendly-language.mdc        | Clear chat and Markdown                  |




## Artifacts



### Framework templates


| File                   | Role                                    |
| ---------------------- | --------------------------------------- |
| scrum-in-sdd.md        | Names and meaning for Scrum in SDD      |
| sdd-scrum-practices.md | What, how, and when for each job        |
| artifacts-map.json     | Workspace index at the repo root        |
| constants.json         | Skill keys, rule keys, instructions URL |




### Process (five files)


| File               | Role                                |
| ------------------ | ----------------------------------- |
| product-backlog.md | PBIs and product Definition of Done |
| sprint-backlog.md  | Sprint goal, SBIs, and RIDs         |
| status.md          | Current item and open OGTs          |
| changes-log.md     | Shipped change history              |
| issues-log.md      | Defect log                          |




### Engineering (per module)


| Pattern             | Role                                       |
| ------------------- | ------------------------------------------ |
| `{stem}-stories.md` | User stories and acceptance criteria       |
| `{stem}-design.md`  | Design spec                                |
| `{stem}-tests.md`   | Test spec                                  |
| architecture.md     | Product architecture template              |
| release.md          | Local start and go-live order              |
| test-strategy.md    | Product test strategy                      |
| `.secrets`          | Secret names only; values stay outside git |


