# coach-ethan — agent user stories

Stories and acceptance criteria for the local ethan agent. Design: [`agent-design.md`](./agent-design.md). Tests: [`agent-test.md`](./agent-test.md). Product backlog: [`product-backlog.md`](../product-backlog.md).

**Sprint 2 feature-03 (Agent-07):** start gate on `{client_root}/.sdd-installed.json`. Story: [`sdd-ethan-pack-complete-gate`](#sdd-ethan-pack-complete-gate). Design: [`agent-design.md`](./agent-design.md) §2.4. Tests: [`agent-test.md`](./agent-test.md) §CE-GATE.

**Roles:** User (project owner), ethan (local Cursor agent).

**Default Given:** unless stated, the client has loaded `{client_root}/{agents_dir}/ethan.md`. `client_root` is the parent of that folder.

---

## `sdd-ethan-pack-complete-gate` — Install ledger start gate (Agent-07)

On every start, before any greeting or job list, ethan reads only `{client_root}/.sdd-installed.json`. He does not scan skills, rules, workflows, or templates to decide completeness. A ledger with no `pack_complete` field is not true.

### User story 1 — Fatal stop when the pack is not complete

**As the** user who invoked `/ethan`
**I want** ethan to stop when the install ledger is missing or `pack_complete` is not true
**So that** I am sent to the instructions page instead of a half-installed coach

#### AC1

```gherkin
Scenario: Missing ledger stops with instructions URL
  Given {client_root}/.sdd-installed.json does not exist
  When the user starts ethan
  Then ethan sends the user to instructions_url when constants.md can be read
  And otherwise sends https://framework.sdd.works/instructions
  And ethan stops with no job list
  And ethan does not read project files
  And ethan does not call sdd_install_framework or sdd_update_framework
  And ethan does not copy files
```

#### AC2

```gherkin
Scenario: Ledger without pack_complete stops
  Given {client_root}/.sdd-installed.json exists
  And the ledger has no pack_complete field
  When the user starts ethan
  Then ethan treats the pack as incomplete
  And ethan sends the instructions URL and stops with no job list
```

#### AC3

```gherkin
Scenario: pack_complete false stops
  Given {client_root}/.sdd-installed.json has pack_complete set to false
  When the user starts ethan
  Then ethan sends the instructions URL and stops with no job list
  And ethan does not list jobs
```

### User story 2 — Continue when pack_complete is true

**As the** user who invoked `/ethan`
**I want** ethan to continue start load when `pack_complete` is true
**So that** a complete install can coach even when the project is not initialized yet

#### AC4

```gherkin
Scenario: pack_complete true continues start load
  Given {client_root}/.sdd-installed.json has pack_complete set to true
  When the user starts ethan
  Then ethan continues start load
  And ethan does not scan the five framework trees to decide completeness
  And missing artifacts-map.md or status.md is a stage, not a stop
```

### User story 3 — Later missing framework file clears the flag

**As the** user who asked ethan for a job
**I want** ethan to set only `pack_complete` to false when a required skill, rule, or seed cannot be read
**So that** the next start stops until install or update writes true again

#### AC5

```gherkin
Scenario: Missing skill sets pack_complete false
  Given {client_root}/.sdd-installed.json has pack_complete set to true
  And package_version and package_commit are set
  And the user asks for a job whose skill folder cannot be read
  When ethan needs that skill
  Then ethan sets only pack_complete to false in the ledger
  And package_version and package_commit stay unchanged
  And ethan sends the same instructions URL and stops
  And ethan does not set pack_complete back to true
```
