# Framework — stories

Stories and acceptance criteria for framework artifacts. Design: `[framework-design.md](./framework-design.md)`. Tests: `[framework-tests.md](./framework-tests.md)`.

**Roles:** User (project owner). Ethan (local coach). The reference client for a manual check is Cursor. The same coach behavior applies on every first-class client in `[mcp-design.md](../mcp/mcp-design.md)` §4.1 once that client's user root holds the pack.

**Default Given:** unless a scenario says otherwise, the client has loaded `{client_root}/{agents_dir}/ethan.md`. `client_root` is the parent of that folder. `agents_dir` is `agents` until constants names another value. The prompt does not name `.cursor` or any other tool folder.

**Locales:** `EN`, `HanS`, and `HanT`. The host IDE language is not the project locale.

**Operating systems:** macOS, Windows, and Linux. `~` is the home on macOS and Linux. `%USERPROFILE%` is the home on Windows.

## Client environments

These scenarios apply to every later story. A story that only passes on macOS Cursor with locale `EN` is not done.

### `sdd-client-root` — The pack root follows the loaded file

**As a** user on macOS, Windows, or Linux
**I want** ethan to read the ledger next to the agent file the client loaded
**So that** a Windows profile or a non-Cursor client is not judged by a macOS `~/.cursor` path

#### AC1

```gherkin
Scenario Outline: Ledger path is the loaded file's parent
  Given the client has loaded "<agent file>"
  And pack_complete is true in "<ledger>"
  When the user starts ethan
  Then client_root is "<client root>"
  And ethan reads "<ledger>"
  And ethan does not read a ledger under a different tool folder

  Examples:
    | client root | agent file | ledger |
    | ~/.cursor | ~/.cursor/agents/ethan.md | ~/.cursor/.sdd-installed.json |
    | ~/.claude | ~/.claude/agents/ethan.md | ~/.claude/.sdd-installed.json |
    | ~/.codebuddy | ~/.codebuddy/agents/ethan.md | ~/.codebuddy/.sdd-installed.json |
    | ~/.trae | ~/.trae/agents/ethan.md | ~/.trae/.sdd-installed.json |
    | ~/.trae-cn | ~/.trae-cn/agents/ethan.md | ~/.trae-cn/.sdd-installed.json |
    | ~/.cline | ~/.cline/agents/ethan.md | ~/.cline/.sdd-installed.json |
```



#### AC2

```gherkin
Scenario: Windows home uses USERPROFILE
  Given the client has loaded "%USERPROFILE%\.cursor\agents\ethan.md"
  And "%USERPROFILE%\.cursor\.sdd-installed.json" has pack_complete set to true
  When the user starts ethan
  Then client_root is "%USERPROFILE%\.cursor"
  And ethan does not look for the ledger under "~/.cursor"
```



#### AC3

```gherkin
Scenario: A workspace copy of the ledger is not the gate
  Given the client-root ledger is missing
  And the workspace contains ".sdd-installed.json" with pack_complete set to true
  When the user starts ethan
  Then ethan treats the pack as incomplete
  And ethan does not read the workspace ledger
```

Tests: `[framework-tests.md](./framework-tests.md#agents)` CE-ENV-01 through CE-ENV-04, CE-ENV-06, CE-GATE-04.

### `sdd-client-callup` — Call-up is the client's gesture

**As a** user who installed the pack on a first-class client
**I want** the gesture that client documents to load ethan
**So that** a slash command copied from Cursor is not required on TRAE

#### AC1

```gherkin
Scenario: Cursor slash loads the user-root agent
  Given no project file "<workspace>/.cursor/agents/ethan.md" exists
  And "~/.cursor/agents/ethan.md" is installed
  When the user invokes /ethan in Cursor
  Then Cursor loads the user-root agent
```



#### AC2

```gherkin
Scenario: A project agent wins on Cursor
  Given both the user-root agent and "<workspace>/.cursor/agents/ethan.md" exist
  And the product did not create the workspace file
  When the user invokes /ethan
  Then Cursor loads the project agent
```



#### AC3

```gherkin
Scenario: A template copy does not register Cursor call-up
  Given the prompt exists only under the client templates tree
  And no agents/ethan.md is on the client root
  When the user invokes /ethan
  Then no coach starts
```



#### AC4

```gherkin
Scenario: Slash does not start TRAE
  Given Subagents are enabled
  And agents/ethan.md is installed on the TRAE or TRAE CN user root
  When the user types /ethan
  Then the coach does not start
```



#### AC5

```gherkin
Scenario: The at-gesture starts TRAE
  Given Subagents are enabled
  And agents/ethan.md is installed on the TRAE or TRAE CN user root
  When the user starts the agent from the at-gesture
  Then that client loads agents/ethan.md
```

TRAE CN's at-gesture is `@` or @智能体. Tests: CE-ENV-05.

Tests: CE-CALL-01, CE-CALL-02, CE-ENV-05.

### `sdd-artifact-locale` — Reply language follows the map

**As a** user whose project locale is EN, HanS, or HanT
**I want** ethan to speak and write job output in that locale
**So that** an English IDE or an English OS does not force English coaching

#### AC1

```gherkin
Scenario Outline: A reported locale is the reply language
  Given the audit verdict is Usable
  And the audit reports locale "<locale>"
  When the user asks where the project is
  Then the reply is in "<language>"
  And ethan reads practices from the "<locale>" folder when the job needs them
  And ethan does not rewrite the process files into another language

  Examples:
    | locale | language |
    | EN | English |
    | HanS | Chinese (Simplified) |
    | HanT | Chinese (Traditional) |
```



#### AC2

```gherkin
Scenario: An empty locale does not become English
  Given the audit verdict is Usable
  And the audit reports that locale is empty
  When a later job needs a locale
  Then ethan does not assume English
  And the next step is to update the project
  And ethan waits for confirm before following sdd-update-project
```

Tests: CE-LOCALE-01 through CE-LOCALE-04, CE-SKILL-08, CE-AUDIT-05, CE-AUDIT-09 through CE-AUDIT-11.

## agents

Stories for the local ethan agent. Design: `[framework-design.md](./framework-design.md)` §2. Product backlog: `[product-backlog.md](../product-backlog.md)`.

**Sprint 2 feature-03 (Agent-04):** start gate on `{client_root}/.sdd-installed.json`. Story: `[sdd-ethan-pack-complete-gate](#sdd-ethan-pack-complete-gate)`. Design §2.4. Tests: `[framework-tests.md](./framework-tests.md#agents)` CE-GATE.

### `sdd-ethan-pack-complete-gate` — Install ledger start gate (Agent-04)

On every start, before any greeting or job list, ethan reads only `{client_root}/.sdd-installed.json`. He does not scan skills, rules, workflows, or templates to decide completeness. A ledger with no `pack_complete` field is not true. This gate is the same on macOS, Windows, and Linux, and on every client root in `[sdd-client-root](#sdd-client-root--the-pack-root-follows-the-loaded-file)`.

#### User story 1 — Fatal stop when the pack is not complete

**As the** user who started ethan
**I want** ethan to stop when the install ledger is missing or `pack_complete` is not true
**So that** I am sent to the instructions page instead of a half-installed coach

##### AC1

```gherkin
Scenario: Missing ledger stops with the instructions URL
  Given {client_root}/.sdd-installed.json does not exist
  And constants.json on that client root can be read
  When the user starts ethan
  Then ethan sends instructions_url from that constants.json
  And ethan stops with no job list
  And ethan does not read project files
  And ethan does not call sdd_install_framework or sdd_update_framework
  And ethan does not copy files
  And ethan does not create the ledger
```



##### AC2

```gherkin
Scenario: Missing constants uses the fallback URL
  Given the client-root ledger does not exist
  And constants.json cannot be read
  When the user starts ethan
  Then ethan sends https://framework.sdd.works/instructions
  And ethan does not create the ledger
  And pack_complete is not written
```



##### AC3

```gherkin
Scenario: Ledger without pack_complete stops
  Given {client_root}/.sdd-installed.json exists
  And the ledger has no pack_complete field
  And package_version and package_commit are set
  When the user starts ethan
  Then ethan treats the pack as incomplete
  And ethan sends the instructions URL and stops with no job list
  And package_version and package_commit stay unchanged
  And ethan does not scan the pack trees to decide completeness
```



##### AC4

```gherkin
Scenario: pack_complete false stops
  Given {client_root}/.sdd-installed.json has pack_complete set to false
  When the user starts ethan
  Then ethan sends the instructions URL and stops with no job list
  And ethan does not set pack_complete to true
```



#### User story 2 — Continue when pack_complete is true

**As the** user who started ethan
**I want** ethan to continue onboard when `pack_complete` is true
**So that** a complete install can coach even when the project is not initialized yet

##### AC5

```gherkin
Scenario: pack_complete true continues onboard
  Given {client_root}/.sdd-installed.json has pack_complete set to true
  When the user starts ethan
  Then ethan follows sdd-audit-artifacts
  And ethan does not scan the five framework trees to decide completeness
  And a missing artifacts-map.json is a verdict, not a pack-gate stop
```



#### User story 3 — A needed file that cannot be read clears only the flag

**As the** user who asked ethan for a job
**I want** ethan to set only `pack_complete` to false when a required skill, rule, or seed cannot be read
**So that** the next start stops until install or update writes true again

##### AC6

```gherkin
Scenario: A missing skill on the current step clears only the flag
  Given {client_root}/.sdd-installed.json has pack_complete set to true
  And package_version and package_commit are set
  And the skill for the step ethan is about to run cannot be read
  When ethan needs that skill
  Then ethan sets only pack_complete to false
  And package_version and package_commit stay unchanged
  And ethan sends the instructions URL and stops
  And ethan does not copy a replacement
  And ethan does not set pack_complete back to true
```



##### AC7

```gherkin
Scenario: A missing file that this step does not read leaves the flag
  Given pack_complete is true
  And the audit has returned Uninitialized
  And sdd-update-project cannot be read
  And the user has not confirmed a job
  When the user starts ethan
  Then ethan still says the next step is to start a new project
  And pack_complete stays true
```



##### AC8

```gherkin
Scenario Outline: Onboard stops when its own skill is missing
  Given pack_complete is true
  And package_version and package_commit are set
  And "<skill>" cannot be read
  And the audit result so far is "<so far>"
  When ethan reaches the step that needs "<skill>"
  Then ethan sets only pack_complete to false and stops
  And onboard does not continue

  Examples:
    | skill | so far |
    | sdd-audit-artifacts | not run |
    | sdd-review-status | Usable |
```

Tests: CE-GATE-01 through CE-GATE-06, CE-PACK-01 through CE-PACK-05.

### `sdd-ethan-audit-verdict` — Ethan uses the audit result

**As the** user who started ethan after a complete install
**I want** the next step to be the one the audit returned
**So that** a missing file elsewhere does not pick a different next step

#### AC1

```gherkin
Scenario: Uninitialized proposes a new project
  Given pack_complete is true
  And the audit returns Uninitialized
  When the user starts ethan
  Then ethan says the project is not initialized
  And ethan says the next step is to start a new project
  And ethan does not write a project file
  And the ledger stays unchanged
  And ethan does not follow sdd-update-project until the user confirms
```



#### AC2

```gherkin
Scenario: Index broken proposes an update
  Given pack_complete is true
  And the audit returns Index broken
  When the user starts ethan
  Then ethan says the index does not match the files
  And ethan says the next step is to update the project
  And ethan does not write a project file before confirm
  And the ledger stays unchanged
```



#### AC3

```gherkin
Scenario: Usable follows get-status
  Given pack_complete is true
  And the audit returns Usable
  And sdd-review-status can be read
  When the user starts ethan
  Then ethan follows sdd-review-status
  And ethan does not write a project file during onboard
```



#### AC4

```gherkin
Scenario: Confirm runs only the skill for that verdict
  Given ethan has proposed starting a new project after Uninitialized
  And sdd-update-project can be read
  When the user confirms that next step
  Then ethan follows sdd-update-project
```



#### AC5

```gherkin
Scenario: He does not replace the verdict
  Given the audit returns one of Uninitialized, Index broken, or Usable
  And some other file the audit did not use is missing
  When the user starts ethan
  Then ethan uses the returned verdict
  And ethan does not pick a different verdict from that other file
```

Tests: CE-VERDICT-01 through CE-VERDICT-05.

### `sdd-ethan-prompt-identity` — The seed is the installed prompt

**As a** maintainer publishing the pack
**I want** the seed prompt and design §14 to be the same text
**So that** the file a client loads does not name a tool folder

#### AC1

```gherkin
Scenario: Seed matches design section 14
  Given design section 14 and specs/framework/seeds/agents/ethan.md are both readable
  When the two prompt bodies are compared
  Then the texts match
  And the body does not name .cursor, .claude, or .trae
```

Tests: CE-PROMPT-01.

## skills

Stories for skills whose behavior the design already decides. Tests: `[framework-tests.md](./framework-tests.md#skills)`.

The five process files are `product-backlog.md`, `sprint-backlog.md`, `status.md`, `changes-log.md`, and `issues-log.md`.

A skill that is only a product-backlog row has no scenario here. When its story is written, the Given must use `{client_root}`, a project write must wait for confirm, and the reply locale must be the audit locale on `EN`, `HanS`, and `HanT`.

### sdd-audit-artifacts

Read-only workspace verdict for Skill-08. Design: `[framework-design.md](./framework-design.md#sdd-audit-artifacts)`. The verdict token is the same word on every OS and in every locale.

#### User story 1 — Uninitialized when no process file opens

**As the** user who started ethan
**I want** the audit to say the workspace has no process file
**So that** the next step is to start a new project

##### AC1

```gherkin
Scenario: No map and no process files
  Given the workspace has no artifacts-map.json
  And none of the five process files exist under specs/
  When sdd-audit-artifacts runs
  Then the verdict is Uninitialized
  And the ledger is unchanged
```



##### AC2

```gherkin
Scenario: Map lists no process-file path
  Given artifacts-map.json is at the workspace root
  And it lists no process-file path
  When sdd-audit-artifacts runs
  Then the verdict is Uninitialized
```



##### AC3

```gherkin
Scenario: A map inside a template folder is ignored
  Given the workspace root has no artifacts-map.json
  And a map file exists only under a template folder
  And no process file exists under specs/
  When sdd-audit-artifacts runs
  Then the template map is not read
  And the verdict is Uninitialized
```



##### AC4

```gherkin
Scenario: A process file outside specs is ignored when the map is missing
  Given the workspace has no artifacts-map.json
  And status.md exists under docs/ and not under specs/
  When sdd-audit-artifacts runs
  Then that file is not opened
  And the verdict is Uninitialized
```



#### User story 2 — Index broken when a file and the map disagree

**As the** user who started ethan
**I want** the audit to say the index does not match the files
**So that** the next step is to update the project

##### AC5

```gherkin
Scenario: A process file exists and the map is missing
  Given the workspace has no artifacts-map.json
  And specs/status.md exists
  When sdd-audit-artifacts runs
  Then the verdict is Index broken
  And the report lists specs/status.md as opened
```



##### AC6

```gherkin
Scenario: A stored path does not open
  Given the map lists specs/status.md
  And that path does not open
  And the file exists at a different place in the workspace
  When sdd-audit-artifacts runs
  Then the verdict is Index broken
  And the report lists that path as failed
  And the other place is not used
```



##### AC7

```gherkin
Scenario: An absolute stored path is not rewritten
  Given the map stores an absolute machine path for status.md
  And a status.md also exists at the workspace-relative path
  When sdd-audit-artifacts runs
  Then the skill tries the stored path under the workspace
  And it does not strip the absolute path to a relative one
  And the verdict is Index broken when that open fails
```

Run AC7 once with a Windows absolute path and once with a macOS or Linux absolute path. Tests: CE-AUDIT-13.

##### AC8

```gherkin
Scenario: Opened and failed paths are both reported
  Given the stored path specs/sprint-backlog.md does not open
  And status.md opens
  When sdd-audit-artifacts runs
  Then the report lists the path that opened and the path that failed
  And the skill does not prefix artifacts_root onto the stored path
```



#### User story 3 — Usable when the map opens the process files

**As the** user who started ethan
**I want** the audit to say the workspace can be read
**So that** onboard can follow sdd-review-status

##### AC9

```gherkin
Scenario: Map opens the listed process files
  Given the map opens every process path it lists
  And those paths include status.md and sprint-backlog.md
  When sdd-audit-artifacts runs
  Then the verdict is Usable
```



#### User story 4 — Locale is a report, not a verdict

**As the** user who started ethan
**I want** the locale field reported without a different verdict
**So that** onboard does not assume English and does not invent a locale

##### AC10

```gherkin
Scenario: An opened map with no locale stays Usable
  Given the map opens and the locale field is missing
  And the tree would otherwise be Usable
  When sdd-audit-artifacts runs
  Then the report says locale is empty
  And the verdict stays Usable
```



##### AC11

```gherkin
Scenario Outline: A known locale is reported as stored
  Given the map opens and locale is "<locale>"
  And the tree would otherwise be Usable
  When sdd-audit-artifacts runs
  Then the report says locale "<locale>"
  And the verdict stays Usable
  And the report does not say the locale is empty

  Examples:
    | locale |
    | EN |
    | HanS |
    | HanT |
```



##### AC12

```gherkin
Scenario: An unknown locale is quoted and left alone
  Given the map opens and locale is FR
  And the tree would otherwise be Usable
  When sdd-audit-artifacts runs
  Then the report quotes FR
  And the verdict stays Usable
  And the skill does not rewrite the field to EN
```



#### User story 5 — The audit does not write

**As the** user who started ethan
**I want** the audit to leave the workspace and the ledger as they were
**So that** a later skill writes only after I confirm

##### AC13

```gherkin
Scenario: Audit is read-only on either path separator
  Given any workspace the audit can classify
  And the workspace path uses slash or backslash separators
  When sdd-audit-artifacts runs
  Then it does not create or edit a project file
  And it does not change .sdd-installed.json
  And it does not call install or update
  And it does not write artifacts-map.mdc
```

##### AC14

```gherkin
Scenario: The reply uses the four labels
  Given the map opens specs/status.md and specs/sprint-backlog.md
  And locale is EN
  When sdd-audit-artifacts runs
  Then the reply contains these lines, in this order
    """
    verdict: Usable
    locale: EN
    opened:
    - specs/status.md
    - specs/sprint-backlog.md
    failed:
    - none
    """
  And sentences to the user stay outside that block
```

##### AC15

```gherkin
Scenario: The root map cannot be read
  Given artifacts-map.json is at the workspace root
  And that file cannot be read
  And specs/status.md exists
  When sdd-audit-artifacts runs
  Then the verdict is Index broken
  And the report lists artifacts-map.json as failed
  And specs/status.md is not opened
  And the reply has no locale line
```

#### User story 6 — adr and knowledge roots

**As the** user who started ethan
**I want** configured ADR and Knowledge roots reported without breaking a Usable tree
**So that** I can fix missing folders while process files still open

##### AC16

```gherkin
Scenario: Missing adr or knowledge roots stay failed and Usable
  Given the map names adr and knowledge paths
  And those paths are not directories
  And the map opens specs/status.md and specs/sprint-backlog.md
  When sdd-audit-artifacts runs
  Then the verdict is Usable
  And the report lists each missing root under failed

Scenario: Existing adr and knowledge roots open
  Given the map names adr and knowledge paths
  And those paths are directories
  And the map opens specs/status.md and specs/sprint-backlog.md
  When sdd-audit-artifacts runs
  Then the verdict is Usable
  And the report lists each root under opened
```

Tests: CE-AUDIT-01 through CE-AUDIT-19.

### sdd-review-status

**As the** user who asked where the project is
**I want** the board compared with the current sprint's named work
**So that** each mismatch is listed and a file changes only after I accept the shown text

#### AC1

```gherkin
Scenario: Status read does not write before the user picks
  Given the audit verdict is Usable
  And the five process files open
  When the user asks where the project is
  Then sdd-review-status states status_from_board
  And it states status_from_implementation for the open items in the current sprint
  And it lists each mismatch
  And it does not create or edit a project file before the user picks in chat
  And it does not mark a product item Done
```

#### AC2

```gherkin
Scenario: HanS answer does not translate the files
  Given the audit reports locale HanS
  And the five process files still have English headings
  When the user asks where the project is
  Then the spoken answer is Chinese (Simplified)
  And the five files stay unchanged until the user says yes to shown text
```

#### AC3

```gherkin
Scenario: Each mismatch has its own handling
  Given two mismatches
  When the user picks Update process artifacts now for the first
  And the user picks Leave to me, I will manually update later for the second
  Then the skill shows the new sentences for the first mismatch only
  And the second mismatch writes nothing
```

#### AC4

```gherkin
Scenario: The user's pick writes the accepted text
  Given the user picked in chat the write for one mismatch
  When the skill writes
  Then it writes only that text
  And an untracked defect becomes the OGT text "track defect xyz in issues-log"
  And the skill does not mark a product item Done
```

#### AC5

```gherkin
Scenario: Open RIDs are compared with related work
  Given the audit verdict is Usable
  And sprint-backlog.md has an Open RID whose Impact names a Done PBI
  When the user asks to review status
  Then the reply lists RID status-change suggestions or states the RID is still valid
  And the reply includes choices in the same message
  And no project file changes before the user picks
```

#### AC6

```gherkin
Scenario: Done pick runs retrospective before board write
  Given the user picked in chat to set an SBI or PBI to Done
  When the skill writes the pick
  Then sdd-retrospective runs in the same turn before the Done row on sprint-backlog or product-backlog
  And retrospective outputs are written before the Done status line
```

Tests: CE-SKILL-01, CE-SKILL-02, CE-SKILL-08, CE-SKILL-09, CE-SKILL-11.

### sdd-atdd

**As the** developer specifying a Feature before build
**I want** user stories and Gherkin acceptance criteria in `{stem}-stories.md`
**So that** implementation and tests trace to the spec

#### AC1

```gherkin
Scenario: Summary before write
  Given artifacts-map.json lists a module stories file
  When the user asks for ATDD or /sdd-atdd for one feature
  Then the reply includes an ATDD Summary with the target path
  And the stories file is unchanged before the user picks
```

#### AC2

```gherkin
Scenario: Scope limits
  Given the user confirmed apply writes
  When sdd-atdd finishes
  Then only the module stories file is updated
  And product-backlog.md is not edited
```

Tests: CE-SKILL-12. User confirmed usable 2026-10-05 ([feature-52](../sprint-backlog.md#sprint-7)).

### sdd-update-specs

**As the** developer aligning engineering specs with shipped work
**I want** a gap report and confirmed writes on module and product-level specs
**So that** the spec stays the source of truth without editing process files

#### AC1

```gherkin
Scenario: Gap report before write
  Given an SBI names related engineering specs
  When the user asks to update specs or runs sdd-update-specs
  Then the reply lists aligned and gap rows
  And no engineering file changes before the user confirms
```

#### AC2

```gherkin
Scenario: Process files stay out of scope
  Given the user confirmed spec updates
  When sdd-update-specs writes
  Then sprint-backlog.md and product-backlog.md are not edited
```

Tests: CE-SKILL-14. User confirmed usable 2026-10-05 ([feature-44](../sprint-backlog.md#sprint-7)).

### improve-prompt

**As the** user refining a task instruction
**I want** a diagnosis and a copy-paste prompt without the agent running the task
**So that** I can start execution in a normal turn with clearer wording

#### AC1

```gherkin
Scenario: Seed folder and advisory shape
  Given the authoring seed tree
  When the improve-prompt skill file is read
  Then the folder is improve-prompt under specs/framework/seeds/skills/
  And prompt-optimizer is not a seed folder
  And the description states advisory-only use
  And the body includes Capabilities, Knowledge, Limits, and Anti-patterns
  And the body does not include an ECC component catalog or fixed slash-command table
  And examples.md is linked from Knowledge
  And the seed description lists English trigger phrases only
```

#### AC2

```gherkin
Scenario: Vague prompt yields diagnosis and fenced prompt
  Given the user pastes a vague task prompt and asks to improve it
  When the improve-prompt skill runs
  Then the reply includes prompt diagnosis and a fenced optimized prompt
  And no project file is written for implementation
```

Tests: CE-SKILL-13. User confirmed usable 2026-10-05 ([feature-46](../sprint-backlog.md#sprint-7)).

### sdd-retrospective

**As the** agent closing work under **sdd-dod.mdc**
**I want** a retrospective that persists ADR and knowledge under map roots and appends the sprint record
**So that** durable lessons are not lost in chat

#### AC1

```gherkin
Scenario: Summary after automatic write
  Given artifacts-map.json has adr and knowledge keys
  And sdd-scrum-practices on the client root includes adr-instance-shape and knowledge-instance-shape
  When the user runs the retrospective gate or /sdd-retrospective
  Then the skill writes ADR, knowledge, or sprint-backlog Retrospective records in the same turn when classification finds durable lessons
  And the reply includes a Retrospective Summary that lists what was written or states an empty retrospective
  And the skill does not ask for a second confirm to apply those writes
```

#### AC2

```gherkin
Scenario: Missing map roots
  Given artifacts-map.json lacks adr or knowledge
  When the user runs sdd-retrospective
  Then the skill stops and names sdd-update-project
  And it does not write under guessed paths
```

#### AC3

```gherkin
Scenario: Create Retrospective section when missing
  Given a sprint has at least one Done SBI row
  And that sprint has no ### Retrospective section
  When sdd-retrospective runs for a by-rule or on-demand close on that sprint
  Then the skill inserts ### Retrospective after the item tables and before the next sprint divider
  And it appends the numbered Learnings, Opportunities, or Future actions block in the same turn
```

Tests: CE-SKILL-10.

### sdd-update-status

Retired by [ADR-076](../adr/ADR-076-review-status-one-skill.md). The confirmed write is AC4 of `sdd-review-status`. Do not add a second skill folder.

Tests: CE-SKILL-06.

### sdd-create-skill

**As the** user who asked for a new skill
**I want** the file written only on the client root after I confirm
**So that** the skill is not dropped into the project tree

#### AC1

```gherkin
Scenario: Create waits for confirm
  Given skills_dir in constants is skills
  When the user asks to create a skill named sample-skill
  Then no file is written
```



#### AC2

```gherkin
Scenario: Confirm writes one client-root skill file
  Given the user has confirmed a skill named sample-skill
  And skills_dir in constants is skills
  When the skill writes the file
  Then the only write is {client_root}/skills/sample-skill/SKILL.md
  And no production code is written
  And nothing is written under the workspace
```

Tests: CE-SKILL-03. The same path shape applies on Windows with backslashes.

### sdd-spec-to-build



#### AC1

```gherkin
Scenario: Spec phase does not write production code
  Given the seed specs/framework/seeds/skills/sdd-spec-to-build/SKILL.md is the skill
  When the user asks it to design one sprint backlog item
  Then it does not write production code
```



#### AC2

```gherkin
Scenario: Build stays on one item
  Given one sprint backlog item is current
  And a later item exists
  When the user asks sdd-spec-to-build to implement the current item
  Then it implements that item only
  And it does not start the later item
```

Tests: CE-SKILL-04.

### Folder rename



#### AC1

```gherkin
Scenario: Status skill ships as one folder
  Given the authoring seed tree
  When the pack copy list is reviewed
  Then sdd-review-status is the status skill
  And sdd-tracking and sdd-update-status are not shippable status folders
```

Tests: CE-SKILL-06. The on-disk folder `specs/framework/seeds/skills/sdd-tracking/` is not the status skill.

## rules

Design: `[framework-design.md](./framework-design.md#rules)`. Tests: `[framework-tests.md](./framework-tests.md#rules)`.

The four pack rule files install at `{client_root}/rules/<name>.mdc`. Framework-bound names use an `sdd-` prefix ([ADR-094](../adr/ADR-094-sdd-prefix-framework-rules.md)). On Windows the directory is `rules\` under that client root. `sdd-dod.mdc`, `sdd-incremental-delivery.mdc`, and `sdd-realtime-status.mdc` have behavior stories in the seed tree. Their path still has to match AC1. `friendly-language.mdc` ships in the seed tree ([Rule-04](../product-backlog.md#pb-95) Done). [Rule-03](../product-backlog.md#pb-20) is realtime-status WIP sync ([ADR-096](../adr/ADR-096-sdd-realtime-status-rule-name.md)). The pack does not ship `artifacts-map.mdc` or `realtime-status.mdc`. [ADR-077](../adr/ADR-077-no-artifacts-map-rule.md).

### `artifacts-map.mdc`

Retired by [ADR-077](../adr/ADR-077-no-artifacts-map-rule.md). AC2 through AC5 below are withdrawn.

#### AC1

```gherkin
Scenario Outline: The rule files live on the client root
  Given the client root is "<client root>"
  When the installed rules are listed
  Then sdd-dod.mdc, sdd-incremental-delivery.mdc, sdd-realtime-status.mdc, and friendly-language.mdc are at "<client root>/rules/"
  And realtime-status.mdc is not installed
  And artifacts-map.mdc is not installed
  And only friendly-language.mdc has no sdd- prefix
  And none of the four files is required under the workspace for the rule to be installed

  Examples:
    | client root |
    | ~/.cursor |
    | %USERPROFILE%\.cursor |
    | ~/.claude |
    | ~/.codebuddy |
```



#### AC2 through AC5

Withdrawn by [ADR-077](../adr/ADR-077-no-artifacts-map-rule.md). The pack does not apply `artifacts-map.mdc`. A create, a rename, or a delete updates the map when the user asks for that update.

Tests: CE-RULE-05 and CE-RULE-06. CE-RULE-01 through CE-RULE-04 are withdrawn.

## templates

Design: `[framework-design.md](./framework-design.md#templates)`. Tests: `[framework-tests.md](./framework-tests.md#templates)`.

### Files that stay on the client root

**As the** user who starts a new project
**I want** the guide, the practices, and constants to stay on the client root
**So that** the project copy is not a second pack, in any locale

#### AC1

```gherkin
Scenario Outline: Kickoff does not copy client-root prose into the project
  Given kickoff copies missing project seeds
  And the project locale is "<locale>"
  When the copy finishes
  Then constants.json is not in the project
  And scrum-in-sdd.md is not in the project
  And sdd-scrum-practices.md is not in the project
  And those files remain under {client_root}/templates/framework.sdd.works/
  And constants.json is not a row in artifacts-map.json

  Examples:
    | locale |
    | EN |
    | HanS |
```

HanT uses the same rule when that locale's kickoff fixture exists.

#### AC2

```gherkin
Scenario Outline: Guide and practices are read from the locale folder
  Given a locale body exists for "<locale>"
  When ethan needs the guide or the practices
  Then he reads {client_root}/templates/framework.sdd.works/<locale>/
  And he does not copy the EN body into the project to fill a missing locale

  Examples:
    | locale |
    | EN |
    | HanS |
    | HanT |
```



#### AC3

```gherkin
Scenario: A seed header has no status line
  Given an authoring seed under specs/framework/seeds/templates/
  When the header is read
  Then it has no status line initialized, draft, confirmed, updated, or status: active
  And a Framework (process) artifact header has Type, as_of, and a Definition link
```

Run AC3 on one `EN` seed and, when the file exists, one `HanS` or `HanT` seed.

Tests: CE-TPL-01, CE-TPL-03, CE-TPL-05, CE-TPL-07.

### Map paths

**As the** user whose artifacts root is specs
**I want** a stored path to open once
**So that** Windows and macOS both find the same file

#### AC1

```gherkin
Scenario Outline: The stored path is joined to the workspace once
  Given artifacts_root is specs
  And the map stores specs/product-backlog.md
  And the workspace is "<workspace>"
  When the stored path is opened
  Then the file is "<opened>"
  And artifacts_root is not prefixed again
  And the map file itself is "<map>"

  Examples:
    | workspace | opened | map |
    | /work/demo | /work/demo/specs/product-backlog.md | /work/demo/artifacts-map.json |
    | C:\work\demo | C:\work\demo\specs\product-backlog.md | C:\work\demo\artifacts-map.json |
```

Tests: CE-TPL-02, CE-TPL-06.

### Sprint item table

**As the** user reading a new sprint backlog
**I want** the starter columns to match the design
**So that** a HanS translation does not drop or reorder a column

#### AC1

```gherkin
Scenario: EN sprint seed header
  Given the EN sprint-backlog seed
  When the sprint item header row is read
  Then the columns are #, Code, SBI, Parent PBI, Module/Type, Related specs, Status
  And a Definition of Done section sits above the first sprint table
  And that section links to product-backlog.md#definition-of-done and names sdd-dod.mdc
```



#### AC2

```gherkin
Scenario: A translated sprint seed keeps the same columns
  Given a HanS or HanT sprint-backlog seed exists
  When its sprint item header row is read
  Then it has the same seven columns in the same order
  And the status values the seed offers are only ToDo, WIP, and Done
```

Tests: CE-TPL-04. AC2 applies when that locale seed exists. A missing translation is the i18n backlog, not a pass.

## core-artifacts

Core artifacts are `scrum-in-sdd.md`, `sdd-scrum-practices.md`, and `artifacts-map.json`.

`scrum-in-sdd.md` and `sdd-scrum-practices.md` are the client-root files in [templates](#templates). They are not project files.

`artifacts-map.json` is the project file in [Map paths](#map-paths). Its locale field is `EN`, `HanS`, or `HanT`. An empty locale is [sdd-artifact-locale](#sdd-artifact-locale--reply-language-follows-the-map). The audit verdicts are [sdd-audit-artifacts](#sdd-audit-artifacts).

No further core-artifact story is added here. Column and header rules for the map stay in the design. A new core story must name the OS path join and the three locales before it is accepted.

## process-artifacts

Process artifacts are `product-backlog.md`, `sprint-backlog.md`, `status.md`, and `changes-log.md`. `issues-log.md` is an engineering artifact and is one of the five process files the audit opens.

The sprint item columns are [Sprint item table](#sprint-item-table). The audit treats all five names as [sdd-audit-artifacts](#sdd-audit-artifacts).

#### AC1

```gherkin
Scenario: Product backlog columns on the EN seed
  Given the EN product-backlog seed
  When the header row is read
  Then the columns are #, Component, PBI Code, Description, Size, Related, Sprint, Status
  And Status values are only ToDo, WIP, and Done
  And body sections appear in order Product overview, Definition of Done, Requirements, Product Backlog, Change record
  And the Definition of Done section lists additional PBI checks on top of sdd-dod.mdc
  And each Requirements item has a PBI code, one noun, and bullets
  And the Requirements PBI code links to #pb-N on the Product Backlog table
  And the table PBI Code links to #req-pb-N on the Requirements line
  And Description is that noun
```



#### AC2

```gherkin
Scenario: A translated process seed keeps column order
  Given a HanS or HanT seed exists for product-backlog.md or sprint-backlog.md
  When its header row is read
  Then the column count and order match the EN seed
```

A missing HanS or HanT body stays on the i18n backlog. Do not treat a missing translation as a satisfied AC2.

### status.md starter

**As a** person starting a project
**I want** a blank `status.md` starter
**So that** the live status file can be filled without copying another product's sprint

#### AC3

```gherkin
Scenario: EN status seed has the five sections
  Given the EN status seed
  When the body is read
  Then the title is The latest status of [product name]
  And the sections are Project progress, where we are now, what could be the next, Current OGT(On-going Tasks), and Last 15 closed OGTs
  And scrum-in-sdd.md and sdd-scrum-practices.md are not in the related list
```

#### AC4

```gherkin
Scenario: Project progress names two milestones and one sprint table
  Given the EN status seed
  When the Project progress section is read
  Then it has a row Project kickoff and a row Initial product backlog refined
  And the sprint table columns are Sprint, Status, and Note
  And consecutive Done sprints share one row
  And consecutive ToDo sprints share one row
```

#### AC5

```gherkin
Scenario: An open OGT row uses the open columns
  Given the EN status seed
  When the Current OGT(On-going Tasks) table is read
  Then the columns are #, Task Name, Affected SBIs, Created, and Status
  And each Affected SBIs item is its own bullet
  And the bullet is the code and the SBI name
  And Status values are only ToDo, WIP, and Done
```

#### AC6

```gherkin
Scenario: A Done OGT becomes row 1 of the closed table
  Given an open OGT row is marked Done
  When the row is saved
  Then it leaves the open table
  And it is inserted as row 1 of Last 15 closed OGTs
  And # in each table is rewritten from 1 through n
  And the number it had while open is not kept
```

#### AC7

```gherkin
Scenario: The closed table keeps 15 rows
  Given Last 15 closed OGTs already has 15 rows
  When another OGT is closed
  Then the new row is row 1
  And the oldest row is dropped
```

#### AC8

```gherkin
Scenario: An open defect is not an OGT
  Given a defect is still open
  When status.md is updated
  Then the defect is not a row in either OGT table
  And the defect is recorded in issues-log.md
```

#### AC9

```gherkin
Scenario: Where we are now adds one sentence after the sprint
  Given the EN status seed
  When the where we are now section is read
  Then the sprint line names the sprint and its status
  And one sentence follows that sprint name
```

#### AC10

```gherkin
Scenario: What is next follows the sprint item order
  Given the current sprint and the current SBI are known
  When what could be the next is written
  Then the next items follow that sprint, that SBI, and the sprint item order
```

#### AC11

```gherkin
Scenario: The file ends with who updated it
  Given the EN status seed
  When the end of the file is read
  Then it has Last updated, a timestamp, and the agent name
```

Tests: CE-TPL-08, CE-TPL-09. A missing HanS or HanT status seed stays on i18n-02.

### issues-log.md starter

**As a** person starting a project
**I want** a blank `issues-log.md` starter
**So that** defects are recorded without copying another product's rows

#### AC12

```gherkin
Scenario: EN issues-log seed has two tables
  Given the EN issues-log seed
  When the body is read
  Then the sections are Open issues and Closed issues, in that order
  And the Open columns are Id, Title, Component, Priority, Description, Related, Close Check, Status, and Added time
  And the Open status values are Open, Fixed, and Deferred
  And the Closed columns are Id, Title, Component, Priority, Description, Related, Close Check, Closed Sprint, and Closed time
  And Priority values are Fatal, High, Medium, and Low
  And a sample row is only in a comment
  And the header has Type, as_of, and a Definition link
```

Tests: CE-TPL-10, CE-TPL-11. A missing HanS or HanT issues-log seed stays on i18n-02.

### changes-log.md starter

**As a** person starting a project
**I want** a blank `changes-log.md` starter
**So that** conclusions are recorded without copying another product's entries

#### AC13

```gherkin
Scenario: EN changes-log seed has one placeholder entry
  Given the EN changes-log seed
  When the body is read
  Then the title is Changes log ([product name])
  And one entry block has Why, What changed, and Verification labels
  And entry text uses bracket placeholders not a sample product name
  And the header has Type, as_of, and a Definition link
```

Tests: CE-TPL-11.

## engineering-artifacts

Engineering artifacts are `architecture.md`, `{stem}-stories.md`, `{stem}-design.md`, `{stem}-tests.md`, `release.md`, `test-strategy.md`, `.secrets`, and `issues-log.md`.

`architecture.md`, `release.md`, `test-strategy.md`, and `.secrets` have EN seeds under `specs/framework/seeds/templates/EN/`. Do not add them to a project map before the file exists.

#### AC1

```gherkin
Scenario: A module stem is the file prefix
  Given artifacts-map stores stem app for the folder specs/web-app
  When the stories file for that module is opened
  Then the path is {workspace}/specs/web-app/app-stories.md
  And the design file is {workspace}/specs/web-app/app-design.md
  And the test file is {workspace}/specs/web-app/app-tests.md
```

#### AC2

```gherkin
Scenario: Flat module paths without folder
  Given artifacts-map stores stem app with no folder key
  And files lists specs/app-stories.md specs/app-design.md and specs/app-tests.md
  When the stories file for that module is opened
  Then the path is {workspace}/specs/app-stories.md
  And the design file is {workspace}/specs/app-design.md
  And the test file is {workspace}/specs/app-tests.md
```

#### AC3

```gherkin
Scenario: Secrets seed holds no secret values
  Given the EN .secrets seed exists
  When the file is read
  Then the first line is a # comment with {product name} and secret names only
  And each secret line is NAME= with an empty value
  And end-of-line # comments name where values live without a pipe suffix
  And it contains no secret value
```

User confirmed EN `.secrets` seed usable 2026-10-05 ([Spec-seeds-12](../product-backlog.md#pb-66), [feature-49](../sprint-backlog.md#sprint-7)); AC3 passes. Post-close edits add grouped example keys; practices and CE-TPL-13 track the shape.

Tests: CE-TPL-12 for flat module paths (AC2). CE-TPL-13 for `.secrets` seed shape (AC3).

User confirmed EN seeds usable 2026-10-05 for [Spec-seeds-10](../product-backlog.md#pb-40) (`architecture.md`), [Spec-seeds-11](../product-backlog.md#pb-41) (`release.md`), [Spec-seeds-12](../product-backlog.md#pb-66) (`.secrets`), and [Spec-seeds-13](../product-backlog.md#pb-90) (`test-strategy.md`) via Sprint 7 [feature-47](../sprint-backlog.md#sprint-7), [feature-48](../sprint-backlog.md#sprint-7), [feature-49](../sprint-backlog.md#sprint-7), and [feature-50](../sprint-backlog.md#sprint-7). This repo's live [`architecture.md`](../architecture.md) and [`release.md`](../release.md) stay JIT pointers; the pack starters live under `specs/framework/seeds/templates/EN/`.