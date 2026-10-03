# Framework — tests

Test plan for framework artifacts. Design: [`framework-design.md`](./framework-design.md). Stories: [`framework-stories.md`](./framework-stories.md).

A case is a fixture workspace plus the prompt, skill, rule, or template under test. It is not a browser test, an API test, or a search-order unit test. Playwright does not apply. Portal pages and the MCP installer stay in the portal test and the MCP test.

Skill cases other than the audit catalog use a temp workspace and a temp client root. They do not use a live `~/.cursor`, `%USERPROFILE%\.cursor`, or any other live client root. `sdd-audit-artifacts` uses the checked-in workspaces and the CodeBuddy CN folders in [Audit fixtures (CodeBuddy CN)](#audit-fixtures-codebuddy-cn). Copy the skill into that client's skills folder from [Pack folders](#pack-folders). Do not look for it in another client's folder or in a marketplace list.

## Layers

| Layer | Who runs it | What it proves | What it does not prove |
| --- | --- | --- | --- |
| **L1 — Agent fixture** | A coding agent or a scripted harness against a temp tree | Prompt text, skill verdict, allowed writes, and path rules expressed as `{client_root}` and `{workspace}` | That a vendor IDE actually lists the agent, or that a live home directory is intact |
| **L2 — Cursor, manual** | A person in a local Cursor window, disposable profile or a copied client root | Slash call-up, the pack-gate speech, the verdict speech, and project-agent precedence on the reference client ([D1](../sprint-backlog.md#rid-d1)) | The same gesture on every other client |
| **L3 — Other first-class clients, manual** | A person in that client, same pack files on that client's user root | The client loads the agent file by its own gesture, and the prompt still derives `client_root` from the loaded file | A full replay of every L1 case |
| **L4 — Out of this file** | MCP and portal suites | Installer extract, path-table CI, portal pages | Coach behavior |

L1 is the gate for every case except the audit catalog. `CE-AUDIT-01` through `CE-AUDIT-17` are the CodeBuddy CN fixture run, not an L1 temp tree and not the L3 smoke row. Every other case id is L1 unless the case says L2 or L3. L2 and L3 run the smoke set in [Environments](#environments), not the full catalog.

Do not mock an MCP install payload. Do not assert that ethan extracts a tarball. Do not boot the portal.

## How to read a case

Each case has three parts:

- **Pre-condition** — the fixture that already exists before the act.
- **Test steps** — the single act (start ethan, run one skill, apply one rule, or read one seed).
- **Expected results** — observable outcome. Pass or fail is decidable from the reply and the files.

**Pack-gate stop** means all of the following: ethan sends the instructions URL, stops, shows no job list, does not read project files, does not call `sdd_install_framework` or `sdd_update_framework`, and does not copy files.

**Instructions URL** is `instructions_url` from `{client_root}/templates/framework.sdd.works/constants.md` when that file can be read. Otherwise it is `https://framework.sdd.works/instructions`. A missing `constants.md` on a pack-gate stop does not change `pack_complete`.

## Environments

Behavior is written with `{client_root}` and `{workspace}`. The prompt does not name a tool folder. OS, client, and locale change the fixture, not the verdict rules.

### Operating systems

| OS | Home expansion | Path shape under test |
| --- | --- | --- |
| macOS | `~` is the user home | `{client_root}` is the parent of the loaded agent file, for example `~/.cursor` |
| Linux | `~` is the user home | Same shape as macOS. A different home (not `/Users/…`) must still resolve |
| Windows | `%USERPROFILE%` | Same relative layout, backslash separators, for example `%USERPROFILE%\.cursor` |

L1 asserts the logical path (`{client_root}/.sdd-installed.json`, `{client_root}/agents/ethan.md`). It does not require three OS runners. L2 records one expanded path per OS for Cursor. L3 records one Windows path for a second client (Claude Code or CodeBuddy CN).

### Clients

First-class install roots are [`mcp-design.md`](../mcp/mcp-design.md) §4.1. Candidate clients (Continue, Windsurf, Gemini CLI, OpenCode, Kiro) are not in this matrix.

| Client | User root (macOS / Linux) | Windows | Call-up under test | Layer |
| --- | --- | --- | --- | --- |
| Cursor, Cursor Agents | `~/.cursor` | `%USERPROFILE%\.cursor` | `/ethan` | L2 smoke on macOS; L2 path note on Windows and Linux |
| Claude Code | `~/.claude` | `%USERPROFILE%\.claude` | The client command that loads `agents/ethan.md` | L3 smoke |
| CodeBuddy CN | `~/.codebuddy` | `%USERPROFILE%\.codebuddy` | That client's agent list | L3 smoke |
| TRAE | `~/.trae` | `%USERPROFILE%\.trae` | `@` after Subagents is enabled. `/ethan` does not start it | L3 smoke |
| TRAE CN | `~/.trae-cn` | `%USERPROFILE%\.trae-cn` | `@` or @智能体. `/ethan` does not start it | L3 smoke |
| Cline | `~/.cline` | `%USERPROFILE%\.cline` | That client's agent list | L3 smoke, after the seed path in §4.1 is the one the case uses |
| Codex, Copilot | Not smoked | Not smoked | — | Enter this table only after §4.1 records a verified root |

Cursor project file `<workspace>/.cursor/agents/ethan.md` wins over the user-root agent when both exist. The product does not create that file. A copy under templates does not register call-up.

### Pack folders

`client_root` is the parent of the loaded `agents/ethan.md`. The pack then uses `{client_root}/skills/`, `{client_root}/rules/`, and `{client_root}/templates/`. Those three names are the same on every client. The folder that *is* `client_root` is not. A skill file copied onto the wrong client root is invisible to the client under test.

Paths below are the user-scope folders that loaded a marker file on 2026-09-17 ([`read-client-config-results.md`](../mcp/read-client-config-results.md)). Windows uses the same layout under `%USERPROFILE%`. Project-scope copies (`<workspace>/.cursor/skills/`, `<workspace>/.trae/skills/`, and the rest) are not the fixture target. [`client.paths.md`](../mcp/client.paths.md) is the longer catalog; its combined TRAE / TRAE CN row mixes the two homes, so this table is the one a fixture run uses.

| Client | `client_root` | Agent file | Skills folder (write the fixture here) | Also scanned (do not install the fixture here) | Rules folder |
| --- | --- | --- | --- | --- | --- |
| Cursor, Cursor Agents | `~/.cursor` | `~/.cursor/agents/ethan.md` | `~/.cursor/skills/<name>/SKILL.md` | `~/.claude/skills/` | `~/.cursor/rules/*.mdc` |
| Claude Code | `~/.claude` | `~/.claude/agents/ethan.md` | `~/.claude/skills/<name>/SKILL.md` | — (this folder is the shared one) | `~/.claude/rules/` |
| CodeBuddy CN | `~/.codebuddy` | `~/.codebuddy/agents/ethan.md` | `~/.codebuddy/skills/<name>/SKILL.md` | `~/.claude/skills/` when the Claude Code plugin is installed. Marketplace skills under `~/.codebuddy/skills-marketplace/` are a different store | `~/.codebuddy/Rules/` on the machine that was tested (capital R) |
| TRAE | `~/.trae` | `~/.trae/agents/ethan.md` | `~/.trae/skills/<name>/SKILL.md` | — | `~/.trae/rules/` |
| TRAE CN | `~/.trae-cn` | `~/.trae-cn/agents/ethan.md` | `~/.trae-cn/skills/<name>/SKILL.md` | `~/.trae/skills/`. A skill placed only there still loads in TRAE CN, and it also loads in international TRAE | `~/.trae-cn/rules/` |
| Cline | `~/.cline` | `~/.cline/agents/ethan.md` | `~/.cline/skills/<name>/SKILL.md` | — | `~/.cline/rules/` |

Cline's row is the documented default in [`client.paths.md`](../mcp/client.paths.md). It was not in the 2026-09-17 marker run. Codex and Copilot stay out of this table until [Clients](#clients) gives them a root.

The IDE's built-in skill list is not this table. A name that is missing there can still be a file under the skills folder. Ethan opens that file by path after `pack_complete` is true. He does not pick it from a marketplace.

### Languages

Artifact locale is `EN`, `HanS`, or `HanT`, taken from the audit report. The host IDE's UI language is not the contract.

| Locale | L1 | L2 / L3 |
| --- | --- | --- |
| `EN` | Default fixture for verdict and template cases | Cursor smoke may use `EN` |
| `HanS` | One agent case and one audit case | One manual reply on Cursor: chat and the proposed next step are Chinese (Simplified) |
| `HanT` | One agent case and one audit case | Not required on every client. One L2 or L3 check is enough |
| Empty | Verdict unchanged. Ethan does not assume English | Same speech on Cursor |

### Smoke set (L2 and L3)

Run these ids on the client and OS named in the case. Do not replay the rest by hand.

| Id | L2 Cursor | L3 other clients |
| --- | --- | --- |
| CE-GATE-01 | macOS. Repeat the speech once on Windows or Linux when that machine is available | One client on one OS |
| CE-VERDICT-01 | macOS | — |
| CE-VERDICT-03 | macOS | — |
| CE-CALL-01 | macOS | — |
| CE-ENV-01, CE-ENV-02, CE-ENV-03 | The OS named in the case | — |
| CE-ENV-04 | — | Claude Code or CodeBuddy CN, one OS |
| CE-ENV-05 | — | TRAE or TRAE CN |
| CE-LOCALE-02 | Cursor, `HanS` | — |

CE-ENV-05 stays a TRAE call-up check. The audit catalog is a separate CodeBuddy CN run: [Audit fixtures (CodeBuddy CN)](#audit-fixtures-codebuddy-cn) holds `CE-AUDIT-01` through `CE-AUDIT-17`. That catalog is not part of this smoke set.

## agents

### Strategy

The product under test is the ethan prompt. Assert what he says and which files he does not write.

L1 compares the reply and the fixture files. L2 checks that Cursor actually loads the file the prompt describes. L3 checks that another first-class client loads its own copy and that the prompt still refuses to name `.cursor`.

Do not treat a green L1 run as proof that `/ethan` appears in Cursor's list, or that TRAE's `@` list contains the agent.

### Plan

1. Run the pack gate first (CE-GATE). A ledger with no `pack_complete` field is not true.
2. When `pack_complete` is true, assert that he follows the audit verdict and does not choose it himself (CE-VERDICT).
3. Assert the missing-file rule (CE-PACK) separately from a pack-gate stop: he may set only `pack_complete` to false, and only when the step he is about to run cannot read a skill, a rule, or a seed template.
4. Assert locale (CE-LOCALE) after a `Usable` verdict. Allowed values are `EN`, `HanS`, and `HanT`.
5. Prompt identity (CE-PROMPT) is a text compare of design §14 and [`ethan.md`](./seeds/agents/ethan.md).
6. Call-up (CE-CALL) and environment (CE-ENV) cover project precedence, OS path shape, and the non-Cursor gesture. They do not add a second coach runtime.

### Cases

#### CE-GATE-01 — Missing ledger

- **Layer:** L1. L2 on Cursor macOS. L3 on one other client.
- **Pre-condition:** `{client_root}/.sdd-installed.json` does not exist. The workspace may contain project files. Those files are a trap: they must stay unread.
- **Test steps:** Start ethan.
- **Expected results:** Pack-gate stop. The ledger is not created.

#### CE-GATE-02 — Ledger without the field

- **Layer:** L1.
- **Pre-condition:** `{client_root}/.sdd-installed.json` exists and has no `pack_complete` field. `package_version` and `package_commit` may be set.
- **Test steps:** Start ethan.
- **Expected results:** Pack-gate stop. `package_version` and `package_commit` stay unchanged. He does not scan skills, rules, workflows, or templates to decide completeness.

#### CE-GATE-03 — Flag false

- **Layer:** L1.
- **Pre-condition:** The ledger has `pack_complete` set to false.
- **Test steps:** Start ethan.
- **Expected results:** Pack-gate stop. Same as CE-GATE-01. He does not set the flag to true.

#### CE-GATE-04 — Ledger is not in the workspace

- **Layer:** L1.
- **Pre-condition:** The client-root ledger is missing. `{workspace}/.sdd-installed.json` exists with `pack_complete` true.
- **Test steps:** Start ethan.
- **Expected results:** Pack-gate stop. The workspace file is not read and is not treated as the gate.

#### CE-GATE-05 — Instructions URL from constants

- **Layer:** L1.
- **Pre-condition:** The ledger is missing. `{client_root}/templates/framework.sdd.works/constants.md` can be read and its `instructions_url` is `https://framework.sdd.works/instructions`.
- **Test steps:** Start ethan.
- **Expected results:** The reply contains that URL. `pack_complete` is not written.

#### CE-GATE-06 — Fallback URL

- **Layer:** L1.
- **Pre-condition:** The ledger is missing. `constants.md` cannot be read.
- **Test steps:** Start ethan.
- **Expected results:** The reply contains `https://framework.sdd.works/instructions`. The ledger is not created. `pack_complete` is not set.

#### CE-VERDICT-01 — Uninitialized

- **Layer:** L1. L2 on Cursor macOS.
- **Pre-condition:** Ledger `pack_complete` is true. The audit returns `Uninitialized`.
- **Test steps:** Start ethan.
- **Expected results:** He says the project is not initialized and the next step is to start a new project. No project write. Ledger unchanged. He does not call install or update. He does not follow `sdd-update-project` until the user confirms.

#### CE-VERDICT-02 — Index broken

- **Layer:** L1.
- **Pre-condition:** Ledger `pack_complete` is true. The audit returns `Index broken`.
- **Test steps:** Start ethan.
- **Expected results:** He says the index does not match the files and the next step is to update the project. No project write before confirm. Ledger unchanged. He does not follow `sdd-update-project` until the user confirms.

#### CE-VERDICT-03 — Usable

- **Layer:** L1. L2 on Cursor macOS.
- **Pre-condition:** Ledger `pack_complete` is true. The audit returns `Usable`. `sdd-review-status` can be read.
- **Test steps:** Start ethan.
- **Expected results:** He follows `sdd-review-status`. No project write before the user says yes to the shown text. Ledger unchanged.

#### CE-VERDICT-04 — He does not invent the verdict

- **Layer:** L1.
- **Pre-condition:** Ledger `pack_complete` is true. The audit returns one of the three verdicts. A file the audit did not use is missing elsewhere in the tree.
- **Test steps:** Start ethan.
- **Expected results:** He uses the returned verdict. He does not pick a different one because some other file is missing.

#### CE-VERDICT-05 — Confirm starts the matching skill

- **Layer:** L1.
- **Pre-condition:** Onboard already proposed "start a new project" after `Uninitialized`. `sdd-update-project` can be read.
- **Test steps:** The user confirms that next step.
- **Expected results:** He follows `sdd-update-project`. Ledger unchanged.

#### CE-PACK-01 — Missing audit skill clears only the flag

- **Layer:** L1.
- **Pre-condition:** Ledger `pack_complete` is true. `package_version` and `package_commit` are set. `sdd-audit-artifacts` cannot be read.
- **Test steps:** Start ethan.
- **Expected results:** He sets only `pack_complete` to false. Version and commit stay. Pack-gate stop. He does not set the flag back to true. Onboard does not continue.

#### CE-PACK-02 — Missing status skill on a Usable verdict

- **Layer:** L1.
- **Pre-condition:** Ledger `pack_complete` is true. The audit returns `Usable`. `sdd-review-status` cannot be read.
- **Test steps:** Start ethan, after the audit result is in hand.
- **Expected results:** Same ledger write as CE-PACK-01. He does not answer where the project is from memory.

#### CE-PACK-03 — Missing skill after confirm

- **Layer:** L1.
- **Pre-condition:** The audit returned `Index broken`. The user confirmed update. `sdd-update-project` cannot be read. Version and commit are set.
- **Test steps:** He is about to follow that skill.
- **Expected results:** He sets only `pack_complete` to false, sends the instructions URL, and stops. He does not copy a replacement skill.

#### CE-PACK-04 — A file this step does not need

- **Layer:** L1.
- **Pre-condition:** Ledger `pack_complete` is true. The audit returns `Uninitialized`. `sdd-update-project` cannot be read. The user has not confirmed a job.
- **Test steps:** Start ethan.
- **Expected results:** He still reports `Uninitialized` and proposes starting a new project. The ledger stays true. He does not clear the flag for a skill this step does not open.

#### CE-PACK-05 — Missing rule the step needs

- **Layer:** L1.
- **Pre-condition:** Ledger `pack_complete` is true. The current step needs `dod.mdc` and that file cannot be read. Version and commit are set.
- **Test steps:** He is about to apply that rule.
- **Expected results:** He sets only `pack_complete` to false, sends the instructions URL, and stops. He does not copy the rule into the workspace.

#### CE-LOCALE-01 — Empty locale

- **Layer:** L1.
- **Pre-condition:** The audit returns `Usable` and reports `locale` empty. Onboard has already followed `sdd-review-status`.
- **Test steps:** A later job needs a locale.
- **Expected results:** He does not assume English. He does not chat as if the locale were `EN`. The next step is `sdd-update-project` after the user confirms. The verdict is not changed.

#### CE-LOCALE-02 — HanS

- **Layer:** L1. L2 on Cursor.
- **Pre-condition:** The audit returns `Usable` and reports locale `HanS`.
- **Test steps:** The user asks where the project is, in Chinese or in English.
- **Expected results:** The reply is Simplified Chinese. He reads the locale folder `HanS` for practices when the job needs them. He does not switch the reply to English because the host UI is English.

#### CE-LOCALE-03 — HanT

- **Layer:** L1.
- **Pre-condition:** The audit returns `Usable` and reports locale `HanT`.
- **Test steps:** The user asks where the project is.
- **Expected results:** The reply is Traditional Chinese. Practices for the job come from the `HanT` folder. He does not substitute `HanS` or `EN`.

#### CE-LOCALE-04 — EN

- **Layer:** L1.
- **Pre-condition:** The audit returns `Usable` and reports locale `EN`.
- **Test steps:** The user asks where the project is.
- **Expected results:** The reply is English. He does not translate it because the OS language is Chinese.

#### CE-PROMPT-01 — Seed matches the design

- **Layer:** L1.
- **Pre-condition:** Design §14 and `specs/framework/seeds/agents/ethan.md` are both readable.
- **Test steps:** Compare the prompt body, including frontmatter.
- **Expected results:** The two texts match. The body does not contain a hardcoded `.cursor`, `.claude`, or `.trae` folder name.

#### CE-CALL-01 — Project agent wins on Cursor

- **Layer:** L1. L2 on Cursor macOS.
- **Pre-condition:** `{workspace}/.cursor/agents/ethan.md` exists. `{client_root}/agents/ethan.md` also exists. The product did not create the workspace file.
- **Test steps:** Invoke `/ethan`.
- **Expected results:** Cursor loads the project agent. The installed prompt is not the one that runs. The product still does not create or refresh the workspace file.

#### CE-CALL-02 — Templates do not register call-up

- **Layer:** L1.
- **Pre-condition:** No `agents/ethan.md` on the client root. A copy of the prompt sits only under the client templates tree.
- **Test steps:** Invoke `/ethan` on Cursor.
- **Expected results:** No coach starts from that template copy.

#### CE-ENV-01 — macOS Cursor root

- **Layer:** L2.
- **Pre-condition:** The loaded file is `~/.cursor/agents/ethan.md` on macOS. The ledger is at `~/.cursor/.sdd-installed.json` with `pack_complete` true.
- **Test steps:** Start ethan with `/ethan`.
- **Expected results:** `client_root` is `~/.cursor`. He reads that ledger. He does not read `%USERPROFILE%\.cursor`.

#### CE-ENV-02 — Windows Cursor root

- **Layer:** L2.
- **Pre-condition:** The loaded file is `%USERPROFILE%\.cursor\agents\ethan.md`. The ledger beside it has `pack_complete` true.
- **Test steps:** Start ethan with `/ethan`.
- **Expected results:** `client_root` is `%USERPROFILE%\.cursor`. Separators are backslashes. He does not look under `~/.cursor`.

#### CE-ENV-03 — Linux Cursor root

- **Layer:** L2.
- **Pre-condition:** The loaded file is `~/.cursor/agents/ethan.md` on Linux. The home directory is not a macOS `/Users/…` path.
- **Test steps:** Start ethan with `/ethan`.
- **Expected results:** `client_root` is that Linux `~/.cursor`. The pack-gate and verdict rules match CE-GATE and CE-VERDICT. No macOS-only path is required.

#### CE-ENV-04 — A non-Cursor root

- **Layer:** L3. One of Claude Code or CodeBuddy CN.
- **Pre-condition:** The pack is installed on that client's user root from [Environments](#environments). The ledger there has `pack_complete` true. No Cursor profile is required.
- **Test steps:** Start the agent with that client's gesture.
- **Expected results:** `client_root` is the parent of the loaded agent file (`.claude` or `.codebuddy`). He reads the ledger on that root. He does not require `~/.cursor` to exist.

#### CE-ENV-05 — TRAE call-up

- **Layer:** L3. TRAE or TRAE CN.
- **Pre-condition:** Subagents are enabled. The agent file is on that client's row in [Pack folders](#pack-folders): `~/.trae/agents/ethan.md` or `~/.trae-cn/agents/ethan.md`. The ledger on that same root has `pack_complete` true. A skill installed only under the other TRAE home is not this case.
- **Test steps:** Type `/ethan`. Then start the agent from `@` (TRAE CN: `@` or @智能体).
- **Expected results:** `/ethan` does not start the coach. The `@` gesture loads the agent file. Pack-gate behavior matches CE-GATE when the ledger is then set incomplete.

#### CE-ENV-06 — Cline root

- **Layer:** L3, only when the §4.1 path used for Cline is the fixture root.
- **Pre-condition:** The loaded agent file's parent is the Cline user root. The ledger there has `pack_complete` true.
- **Test steps:** Start the agent from Cline's agent list.
- **Expected results:** `client_root` is that parent. He does not write the pack into the workspace.

## skills

### Strategy

A skill case feeds a fixture tree to the skill text and checks the verdict or the write it is allowed to make. The agent fixture (L1) is enough for every skill case except `sdd-audit-artifacts`, whose cases are the CodeBuddy CN catalog. For that catalog the skill file is `~/.codebuddy/skills/sdd-audit-artifacts/SKILL.md` ([Pack folders](#pack-folders)). A skill does not start a web server and is not application code.

The same fixture must yield the same verdict on macOS, Windows, and Linux. Only the spelling of `{workspace}` changes. Locale cases assert the report, not a translation of the verdict token. Verdict tokens stay `Uninitialized`, `Index broken`, and `Usable` in every locale.

Skills that are only a product-backlog row have no steps here. When a later story writes one, its case must use `{client_root}`, must not assume English, and must name confirm-before-write if it edits a project file.

### Plan

`sdd-audit-artifacts` cases are [Audit fixtures (CodeBuddy CN)](#audit-fixtures-codebuddy-cn): one case per verdict, per stop rule, per locale report, and per path trap. Each other designed skill has one case below that names the seed path and the read-only or confirm-before-write rule. Client and OS are not multiplied on those other ids. CE-ENV covers the root. CE-LOCALE on the agent covers the reply language after the audit reports a locale.

Process files are `product-backlog.md`, `sprint-backlog.md`, `status.md`, `changes-log.md`, and `issues-log.md`.

### Cases

#### CE-SKILL-01 — sdd-review-status

- **Layer:** L1.
- **Pre-condition:** Audit verdict is `Usable`. The five process files open. Seed: `specs/framework/seeds/skills/sdd-review-status/SKILL.md`.
- **Test steps:** Ask where the project is.
- **Expected results:** The skill states `status_from_board` and `status_from_implementation`. It lists each mismatch. It does not create or edit a project file before the user says yes to the shown text. It does not mark a product item Done.

#### CE-SKILL-02 — Second yes on sdd-review-status

- **Layer:** L1.
- **Pre-condition:** Two mismatches are listed. Seed: `specs/framework/seeds/skills/sdd-review-status/SKILL.md`.
- **Test steps:** Pick "Update process artifacts now" for one mismatch and "Leave to me, I will manually update later" for the other. Say yes to the shown text for the first.
- **Expected results:** Before the second yes, no project file changes. After the second yes, only the accepted text is written. The other mismatch writes nothing. An untracked defect uses the OGT text "track defect xyz in issues-log". The skill does not mark a product item Done.

#### CE-SKILL-03 — sdd-create-skill

- **Layer:** L1.
- **Pre-condition:** `skills_dir` in constants is `skills`. Seed: `specs/framework/seeds/skills/sdd-create-skill/SKILL.md`.
- **Test steps:** Ask to create a skill named `sample-skill`.
- **Expected results:** It waits for confirm. The only write is `{client_root}/skills/sample-skill/SKILL.md`, which is that client's skills folder in [Pack folders](#pack-folders). On TRAE CN that is `~/.trae-cn/skills/sample-skill/SKILL.md`, not `~/.trae/skills/`. It does not write production code. It does not write `skill-creator` or `create-skill`. It does not write under the workspace.

#### CE-SKILL-04 — sdd-design

- **Layer:** L1.
- **Pre-condition:** Seed `specs/framework/seeds/skills/sdd-design/SKILL.md` is the file under test.
- **Test steps:** Ask it to design one sprint backlog item.
- **Expected results:** It does not write production code.

#### CE-SKILL-05 — sdd-implement

- **Layer:** L1.
- **Pre-condition:** One sprint backlog item is the current item. A later item exists. Seed: `specs/framework/seeds/skills/sdd-implement/SKILL.md`.
- **Test steps:** Ask it to implement the current item.
- **Expected results:** It implements that item only. It does not start the next item.

#### CE-SKILL-06 — Do not ship both status folders

- **Layer:** L1.
- **Pre-condition:** The seed tree is the authoring tree.
- **Test steps:** List skill folders that would be copied to the pack.
- **Expected results:** `sdd-review-status` is the status skill. `sdd-tracking` and `sdd-update-status` are not shippable status folders. The on-disk folder `specs/framework/seeds/skills/sdd-tracking/` is not copied as the status skill.

#### CE-SKILL-07 — Backlog-only skills

- **Layer:** L1.
- **Pre-condition:** The names `sdd-atdd`, `sdd-tdd`, `sdd-update-project`, `sdd-refine-pb`, `sdd-plan-sprint`, `sdd-retrospective`, `sdd-close-sprint`, and `sdd-update-specs` have no seed in the tree yet.
- **Test steps:** Read the design section for those names.
- **Expected results:** This file adds no steps for them. Acceptance stays on the product-backlog row. A future case must still use `{client_root}`, must wait for confirm before a project write, and must not assume locale `EN`.

#### CE-SKILL-08 — get-status in HanS

- **Layer:** L1.
- **Pre-condition:** Audit reports locale `HanS` and verdict `Usable`. The five process files contain English headings from the EN seed.
- **Test steps:** Ask where the project is.
- **Expected results:** The spoken answer is Simplified Chinese. The skill does not rewrite the five files into Chinese.

## Audit fixtures (CodeBuddy CN)

This catalog runs two checks on each workspace. The skill check is the `sdd-audit-artifacts` block. The onboard check is Ethan’s first reply in a new chat: he shows that block, then the sentence for that verdict in [Onboard by verdict](#onboard-by-verdict). Call-up stays CE-ENV-05. The short agent cases stay CE-VERDICT. Other skills stay CE-SKILL.

Verdict tokens stay `Uninitialized`, `Index broken`, and `Usable` on every OS and in every locale. The five process files are `product-backlog.md`, `sprint-backlog.md`, `status.md`, `changes-log.md`, and `issues-log.md`.

### What each case proves

Cases are numbered in one sequence. They are not one scenario repeated. Read this index first. Several ids share the same two process files on purpose; the **Proves** line is the only difference.

| Ids | Proves | Do not confuse with |
| --- | --- | --- |
| 01, 02, 14 | Verdict when `{workspace}/artifacts-map.md` is absent | A file under `docs/` or under `templates/` is not a root map |
| 03, 04, 07, 08, 12, 13, 17 | Verdict when a root map is present, including a map that cannot be read | 12 is "map only in a template folder", which is the absent-map verdict |
| 05, 09, 10, 11, 15 | The `locale` line after the map opened. 09 repeats 04's files to lock the token `EN` | An empty or unknown locale does not change `Usable` |
| 16 | Label order `verdict`, `locale`, `opened`, `failed`. Same files as 04 | A correct verdict with the labels in another order fails this id |
| 06 | No project write and no ledger write. No folder of its own | Rerun 01 through 05. It is not a sixth verdict |

### Fixture environment

- IDE: CodeBuddy CN. Start `ethan` from that client's agent list. The gesture that opens the list is not verified here. A reply that looks for `sdd-audit-artifacts` in a marketplace list is not an audit result.
- The client root is `~/.codebuddy`. On Windows it is `%USERPROFILE%\.codebuddy`. The agent file is `~/.codebuddy/agents/ethan.md`. Skills are `~/.codebuddy/skills/<name>/SKILL.md` ([Pack folders](#pack-folders)). Copy the files in [Minimum framework installation](#minimum-framework-installation) into that live home, run the catalog, then delete those paths. Do not copy the skill to `~/.codebuddy/skills-marketplace/` or to `~/.claude/skills/`.
- One workspace per case, under `specs/framework/fixtures/sdd-audit-artifacts/`. The folder name is the case id plus the case name, for example `CE-AUDIT-01-no-map-and-no-process-files`. Open that folder as the CodeBuddy CN workspace. Do not open this product repo as the workspace.
- The ledger has `pack_complete` true before the audit runs. A pack-gate stop is not an audit result.
- A map uses `local:` lines, as in [`seeds/templates/EN/artifacts-map.md`](./seeds/templates/EN/artifacts-map.md). A process file that onboard does not read may be a one-line stub. Each `Usable` workspace names `Sprint 1` and `feature-01` in `specs/status.md` and `specs/sprint-backlog.md`, so `sdd-review-status` has a line to return.
- CE-AUDIT-17 clears the read bit on the checked-in map for the run, then restores it. The file in git stays readable.

### Minimum framework installation

Copy only these files. Paths are the CodeBuddy CN row of [Pack folders](#pack-folders). The rest of the pack is not required. `sdd-audit-artifacts` is not a marketplace skill. Ethan reads the file by path.

| Pack file | Live path on macOS or Linux | Seed |
| --- | --- | --- |
| Ledger, `pack_complete` true | `~/.codebuddy/.sdd-installed.json` | [`seeds/.sdd-installed.json`](./seeds/.sdd-installed.json). The seed ships `pack_complete` false. Set it to true in the copy |
| Agent | `~/.codebuddy/agents/ethan.md` | [`seeds/agents/ethan.md`](./seeds/agents/ethan.md) |
| Skill | `~/.codebuddy/skills/sdd-audit-artifacts/SKILL.md` | [`seeds/skills/sdd-audit-artifacts/SKILL.md`](./seeds/skills/sdd-audit-artifacts/SKILL.md) |
| Status read | `~/.codebuddy/skills/sdd-review-status/SKILL.md` | [`seeds/skills/sdd-review-status/SKILL.md`](./seeds/skills/sdd-review-status/SKILL.md). Onboard reads this only after a `Usable` block. Without it, that reply sets `pack_complete` to false |
| Constants | `~/.codebuddy/templates/framework.sdd.works/constants.md` | [`seeds/templates/constants.md`](./seeds/templates/constants.md) |

Quit CodeBuddy CN and open it again after the agent file is copied, so the agent list reloads.

### How to run a case

1. Open the case folder named in that case as the CodeBuddy CN workspace.
2. Confirm the live paths above exist and `pack_complete` is true.
3. Start a new chat and select `ethan` from the CodeBuddy CN agent list.
4. Send `onboard`.
5. Check both results. The skill result is the block in that case. The onboard result is the matching row below. Sentences sit outside the block. Compare the workspace and `~/.codebuddy/.sdd-installed.json` with their state before the run. Do not confirm a next step. Confirming would open `sdd-update-project`, and that file is not part of this install.

### Onboard by verdict

The block is the skill. The sentence is onboard. Ethan does not greet and does not list jobs.

| Verdict | Cases | Onboard, besides the block |
| --- | --- | --- |
| `Uninitialized` | 01, 08, 12, 14 | The project is not initialized. The next step is to start a new project. He does not open `sdd-update-project`. |
| `Index broken` | 02, 03, 07, 13, 17 | The index does not match the files. The next step is to update the project. He does not open `sdd-update-project`. |
| `Usable` | 04, 09, 16 | He follows `sdd-review-status`. The reply includes `Sprint 1` and `feature-01`. |
| `Usable`, locale empty | 05 | He follows `sdd-review-status`. The reply includes `Sprint 1` and `feature-01`. He does not treat the locale as `EN`. |
| `Usable`, `HanS` | 10 | The spoken answer is Simplified Chinese. `Sprint 1` and `feature-01` stay as written. He does not rewrite the process files. |
| `Usable`, `HanT` | 11 | The spoken answer is Traditional Chinese. He does not report `HanS`. `Sprint 1` and `feature-01` stay as written. |
| `Usable`, `FR` | 15 | The block quotes `FR`. He does not rewrite it to `EN`. He follows `sdd-review-status`. The reply includes `Sprint 1` and `feature-01`. |

### Test cases

#### CE-AUDIT-01 — No map and no process files

- **Proves:** absent map, nothing under `specs/` → `Uninitialized`, no `locale` line.
- **Layer:** CodeBuddy CN fixture.
- **Workspace:** `specs/framework/fixtures/sdd-audit-artifacts/CE-AUDIT-01-no-map-and-no-process-files/`.
- **Pre-condition:** No `artifacts-map.md`. No process file under `specs/`.
- **Test steps:** Follow [How to run a case](#how-to-run-a-case).
- **Expected results:**

```text
verdict: Uninitialized
opened:
- none
failed:
- none
```

No `locale` line. No project write. Ledger unchanged.

#### CE-AUDIT-02 — File exists, map missing

- **Proves:** absent map, one process file under `specs/` → `Index broken`. The missing four names are not opened.
- **Layer:** CodeBuddy CN fixture.
- **Workspace:** `specs/framework/fixtures/sdd-audit-artifacts/CE-AUDIT-02-file-exists-map-missing/`.
- **Pre-condition:** No `artifacts-map.md`. `specs/status.md` exists. The other four process files do not.
- **Test steps:** Follow [How to run a case](#how-to-run-a-case).
- **Expected results:**

```text
verdict: Index broken
opened:
- specs/status.md
failed:
- none
```

No `locale` line. The missing four names are not opened and are not listed as failed.

#### CE-AUDIT-03 — Stored path does not open

- **Proves:** the stored path is opened as written. A copy under `docs/` is not a substitute.
- **Layer:** CodeBuddy CN fixture.
- **Workspace:** `specs/framework/fixtures/sdd-audit-artifacts/CE-AUDIT-03-stored-path-does-not-open/`.
- **Pre-condition:** The root map lists `local: specs/status.md`. That path does not exist. `docs/status.md` exists.
- **Test steps:** Follow [How to run a case](#how-to-run-a-case).
- **Expected results:**

```text
verdict: Index broken
locale: EN
opened:
- none
failed:
- specs/status.md
```

`docs/status.md` is not opened.

#### CE-AUDIT-04 — Usable

- **Proves:** the map opens `status.md` and `sprint-backlog.md` → `Usable`.
- **Layer:** CodeBuddy CN fixture.
- **Workspace:** `specs/framework/fixtures/sdd-audit-artifacts/CE-AUDIT-04-usable/`.
- **Pre-condition:** The root map opens `specs/status.md` and `specs/sprint-backlog.md`. `locale` is `EN`.
- **Test steps:** Follow [How to run a case](#how-to-run-a-case).
- **Expected results:**

```text
verdict: Usable
locale: EN
opened:
- specs/status.md
- specs/sprint-backlog.md
failed:
- none
```

#### CE-AUDIT-05 — Empty locale

- **Proves:** a missing `locale` field is reported as `empty` and does not change `Usable`.
- **Layer:** CodeBuddy CN fixture.
- **Workspace:** `specs/framework/fixtures/sdd-audit-artifacts/CE-AUDIT-05-empty-locale/`.
- **Pre-condition:** Same files as CE-AUDIT-04. The map has no `locale` field.
- **Test steps:** Follow [How to run a case](#how-to-run-a-case).
- **Expected results:**

```text
verdict: Usable
locale: empty
opened:
- specs/status.md
- specs/sprint-backlog.md
failed:
- none
```

#### CE-AUDIT-06 — Read-only

- **Proves:** onboard and the skill do not write. Not a new verdict and not a new workspace.
- **Layer:** CodeBuddy CN fixture.
- **Workspace:** any of the `CE-AUDIT-01` through `CE-AUDIT-05` folders under `specs/framework/fixtures/sdd-audit-artifacts/`. Repeat once on a path that uses `\` and once on a path that uses `/` when both machines exist. One OS is enough to pass this id.
- **Pre-condition:** The tree is one of those five cases.
- **Test steps:** Follow [How to run a case](#how-to-run-a-case). Compare the workspace bytes and `{client_root}/.sdd-installed.json` with the copies taken before the run.
- **Expected results:** The block matches that case. The onboard sentence matches [Onboard by verdict](#onboard-by-verdict). Neither step creates or edits a project file. The ledger does not change. He does not call `sdd_install_framework` or `sdd_update_framework`. He does not write `artifacts-map.mdc`.

#### CE-AUDIT-07 — Opened and failed paths

- **Proves:** one stored path opens and another does not. Both are listed. `artifacts_root` is not prefixed.
- **Layer:** CodeBuddy CN fixture.
- **Workspace:** `specs/framework/fixtures/sdd-audit-artifacts/CE-AUDIT-07-opened-and-failed-paths/`.
- **Pre-condition:** The map lists `specs/status.md` and `specs/sprint-backlog.md`. `specs/status.md` exists. `specs/sprint-backlog.md` does not. `locale` is `EN`.
- **Test steps:** Follow [How to run a case](#how-to-run-a-case).
- **Expected results:**

```text
verdict: Index broken
locale: EN
opened:
- specs/status.md
failed:
- specs/sprint-backlog.md
```

The stored path is not prefixed with `artifacts_root`.

#### CE-AUDIT-08 — Map opens nothing

- **Proves:** a root map with no process-file `local:` line → `Uninitialized`, and `locale` is still reported.
- **Layer:** CodeBuddy CN fixture.
- **Workspace:** `specs/framework/fixtures/sdd-audit-artifacts/CE-AUDIT-08-map-opens-nothing/`.
- **Pre-condition:** `artifacts-map.md` is at the workspace root. It has `locale: EN` and no `local:` line for a process file.
- **Test steps:** Follow [How to run a case](#how-to-run-a-case).
- **Expected results:**

```text
verdict: Uninitialized
locale: EN
opened:
- none
failed:
- none
```

#### CE-AUDIT-09 — Locale EN

- **Proves:** the stored token `EN` is copied into the report. Same files as CE-AUDIT-04; this id locks the token.
- **Layer:** CodeBuddy CN fixture.
- **Workspace:** `specs/framework/fixtures/sdd-audit-artifacts/CE-AUDIT-09-locale-en/`.
- **Pre-condition:** Same shape as CE-AUDIT-04. `locale` is `EN`.
- **Test steps:** Follow [How to run a case](#how-to-run-a-case).
- **Expected results:**

```text
verdict: Usable
locale: EN
opened:
- specs/status.md
- specs/sprint-backlog.md
failed:
- none
```

The report does not say the locale is empty.

#### CE-AUDIT-10 — Locale HanS

- **Proves:** the stored token `HanS` is copied. The verdict word is not translated.
- **Layer:** CodeBuddy CN fixture.
- **Workspace:** `specs/framework/fixtures/sdd-audit-artifacts/CE-AUDIT-10-locale-hans/`.
- **Pre-condition:** Same shape as CE-AUDIT-04. `locale` is `HanS`.
- **Test steps:** Follow [How to run a case](#how-to-run-a-case).
- **Expected results:**

```text
verdict: Usable
locale: HanS
opened:
- specs/status.md
- specs/sprint-backlog.md
failed:
- none
```

The verdict token is not translated.

#### CE-AUDIT-11 — Locale HanT

- **Proves:** the stored token `HanT` is copied. It is not rewritten to `HanS`.
- **Layer:** CodeBuddy CN fixture.
- **Workspace:** `specs/framework/fixtures/sdd-audit-artifacts/CE-AUDIT-11-locale-hant/`.
- **Pre-condition:** Same shape as CE-AUDIT-04. `locale` is `HanT`.
- **Test steps:** Follow [How to run a case](#how-to-run-a-case).
- **Expected results:**

```text
verdict: Usable
locale: HanT
opened:
- specs/status.md
- specs/sprint-backlog.md
failed:
- none
```

The report does not say `HanS`. The verdict token is not translated.

#### CE-AUDIT-12 — Map only in a template folder

- **Proves:** a map under `templates/` is not the root map. The verdict is the absent-map verdict.
- **Layer:** CodeBuddy CN fixture.
- **Workspace:** `specs/framework/fixtures/sdd-audit-artifacts/CE-AUDIT-12-map-only-in-a-template-folder/`.
- **Pre-condition:** No root `artifacts-map.md`. `templates/framework.sdd.works/EN/artifacts-map.md` exists and lists process files. No process file exists under `specs/`.
- **Test steps:** Follow [How to run a case](#how-to-run-a-case).
- **Expected results:**

```text
verdict: Uninitialized
opened:
- none
failed:
- none
```

No `locale` line. The template map is not read.

#### CE-AUDIT-13 — Absolute path stored in the map

- **Proves:** an absolute stored path is not stripped to `specs/status.md`. Two workspaces, one rule.
- **Layer:** CodeBuddy CN fixture. Two workspaces of this id.
- **Workspace:** `specs/framework/fixtures/sdd-audit-artifacts/CE-AUDIT-13-absolute-path-stored-in-the-map-windows/` stores `local: C:\Users\fixture\status.md`. `specs/framework/fixtures/sdd-audit-artifacts/CE-AUDIT-13-absolute-path-stored-in-the-map-posix/` stores `local: /Users/fixture/status.md`. Each workspace also has `specs/status.md`.
- **Pre-condition:** The map `locale` is `EN`. The relative `specs/status.md` exists.
- **Test steps:** Follow [How to run a case](#how-to-run-a-case) once in each workspace.
- **Expected results:** `specs/status.md` is not opened. The POSIX workspace returns:

```text
verdict: Index broken
locale: EN
opened:
- none
failed:
- /Users/fixture/status.md
```

The Windows workspace returns the same block with `failed` equal to `C:\Users\fixture\status.md`. The 2026-09-30 CodeBuddy walk left that workspace Not observed. The expected block stays.

#### CE-AUDIT-14 — Process file outside specs when the map is missing

- **Proves:** with no root map, only `specs/` is searched. `docs/status.md` is ignored.
- **Layer:** CodeBuddy CN fixture.
- **Workspace:** `specs/framework/fixtures/sdd-audit-artifacts/CE-AUDIT-14-process-file-outside-specs-when-the-map-is-missing/`.
- **Pre-condition:** No root map. `docs/status.md` exists. No process file exists under `specs/`.
- **Test steps:** Follow [How to run a case](#how-to-run-a-case).
- **Expected results:**

```text
verdict: Uninitialized
opened:
- none
failed:
- none
```

`docs/status.md` is not opened. No `locale` line.

#### CE-AUDIT-15 — Unknown locale value

- **Proves:** an unknown stored value is quoted and is not rewritten to `EN`.
- **Layer:** CodeBuddy CN fixture.
- **Workspace:** `specs/framework/fixtures/sdd-audit-artifacts/CE-AUDIT-15-unknown-locale-value/`.
- **Pre-condition:** Same shape as CE-AUDIT-04. `locale` is `FR`.
- **Test steps:** Follow [How to run a case](#how-to-run-a-case).
- **Expected results:**

```text
verdict: Usable
locale: "FR"
opened:
- specs/status.md
- specs/sprint-backlog.md
failed:
- none
```

The skill does not rewrite the field to `EN`.

#### CE-AUDIT-16 — Report block

- **Proves:** label order. Same files as CE-AUDIT-04. A right verdict with the labels rearranged fails this id.
- **Layer:** CodeBuddy CN fixture.
- **Workspace:** `specs/framework/fixtures/sdd-audit-artifacts/CE-AUDIT-16-report-block/`.
- **Pre-condition:** The map opens `specs/status.md` and `specs/sprint-backlog.md`. `locale` is `EN`.
- **Test steps:** Follow [How to run a case](#how-to-run-a-case).
- **Expected results:** The reply contains these lines, in this order. Text to the user stays outside the block.

```text
verdict: Usable
locale: EN
opened:
- specs/status.md
- specs/sprint-backlog.md
failed:
- none
```

#### CE-AUDIT-17 — Root map cannot be read

- **Proves:** a root map that exists and cannot be read → `Index broken`. `specs/` is not opened. No `locale` line.
- **Layer:** CodeBuddy CN fixture.
- **Workspace:** `specs/framework/fixtures/sdd-audit-artifacts/CE-AUDIT-17-root-map-cannot-be-read/`.
- **Pre-condition:** `artifacts-map.md` is at the workspace root and is readable in git. `specs/status.md` exists. `locale` in the map is `EN`.
- **Test steps:** Clear the read bit on `artifacts-map.md`. Follow [How to run a case](#how-to-run-a-case). Restore the read bit before leaving the workspace.
- **Expected results:**

```text
verdict: Index broken
opened:
- none
failed:
- artifacts-map.md
```

No `locale` line. `specs/status.md` is not opened. No project write. Ledger unchanged.


## rules

### Strategy

A rule case is a fixture workspace and the `.mdc` text. Assert the map edit or the install path. Do not render a page and do not score the rule as application code.

`artifacts-map.mdc` is not a pack rule. [ADR-077](../adr/ADR-077-no-artifacts-map-rule.md) withdraws CE-RULE-01 through CE-RULE-04. CE-RULE-05 and CE-RULE-06 check that the file is absent. `dod.mdc`, `incremental-delivery.mdc`, and `realtime-status.mdc` have a name and a client-root path. Their bodies are not designed yet, so L1 does not invent steps for them.

The install path is `{client_root}/rules/<name>.mdc` on every OS. L1 uses that logical path. L2 checks the expanded Cursor path once per OS when a machine is available. The pack does not ship a rule that classifies the workspace or sets `pack_complete`.

### Plan

Check that `artifacts-map.mdc` is absent. One case for the three rule names. One case that a Windows client root does not receive `artifacts-map.mdc`.

### Cases

#### CE-RULE-01 — Create

- **Layer:** L1.
- **Pre-condition:** `{workspace}/artifacts-map.md` exists and does not list `specs/notes.md`. A project artifact is created at `specs/notes.md`.
- **Test steps:** Withdrawn by [ADR-077](../adr/ADR-077-no-artifacts-map-rule.md). Do not apply `artifacts-map.mdc`.
- **Expected results:** The map stays as it was. The ledger is unchanged.

#### CE-RULE-02 — Rename

- **Layer:** L1.
- **Pre-condition:** The map lists `specs/notes.md`. That artifact is renamed to `specs/decisions.md`.
- **Test steps:** Withdrawn by [ADR-077](../adr/ADR-077-no-artifacts-map-rule.md). Do not apply a rule.
- **Expected results:** The map still lists `specs/notes.md`.

#### CE-RULE-03 — Delete

- **Layer:** L1.
- **Pre-condition:** The map lists `specs/notes.md`. That artifact is deleted.
- **Test steps:** Withdrawn by [ADR-077](../adr/ADR-077-no-artifacts-map-rule.md). Do not apply a rule.
- **Expected results:** The map still lists `specs/notes.md`.

#### CE-RULE-04 — Not an audit

- **Layer:** L1.
- **Pre-condition:** Onboard is running, or a pack file is missing.
- **Test steps:** Withdrawn by [ADR-077](../adr/ADR-077-no-artifacts-map-rule.md). Do not apply `artifacts-map.mdc`.
- **Expected results:** Onboard does not load that rule. The ledger is unchanged.

#### CE-RULE-05 — Names and install path

- **Layer:** L1.
- **Pre-condition:** The three rule names are `dod.mdc`, `incremental-delivery.mdc`, and `realtime-status.mdc`. `artifacts-map.mdc` is not a pack rule.
- **Test steps:** Read the name and the install path.
- **Expected results:** No name has an `sdd-` prefix. The install path is `{client_root}/rules/<name>.mdc`. `artifacts-map.mdc` is absent. No behavior is asserted for `dod.mdc`, `incremental-delivery.mdc`, or `realtime-status.mdc` beyond that path.

#### CE-RULE-06 — Windows rules directory

- **Layer:** L2 on Windows Cursor, or L3 on one Windows client from the table.
- **Pre-condition:** `client_root` is `%USERPROFILE%\.cursor` or that other client's Windows root.
- **Test steps:** Look up `artifacts-map.mdc` after install.
- **Expected results:** The file is absent. The three pack rules are under `%USERPROFILE%\<client folder>\rules\`.

## templates

### Strategy

A template case reads the seed text and, where the design forbids a copy, checks that a kickoff fixture did not write that file into the project. It does not boot the portal.

Locale seeds are part of the template contract. `EN`, `HanS`, and `HanT` each have a home for `scrum-in-sdd.md` and `sdd-scrum-practices.md` when those bodies exist. A missing HanT body is a seed gap to report, not a reason to copy the EN file into the project under a HanT name.

`constants.md` has no locale and is never a project file. Path checks use `{workspace}/<stored path>` on every OS.

### Plan

Check the seed header, the map path rule, the files that stay on the client root, the locale folders, the sprint-item columns, the EN status seed, and the EN issues-log seed. One Windows fixture repeats the path join so a drive-letter workspace does not get `artifacts_root` prefixed twice.

### Cases

#### CE-TPL-01 — Seed header

- **Layer:** L1.
- **Pre-condition:** An authoring seed under `specs/framework/seeds/templates/`, including one file from `EN` and, when the file exists, one from `HanS` or `HanT`.
- **Test steps:** Read the header.
- **Expected results:** No status line (`initialized`, `draft`, `confirmed`, `updated`, or `status: active`). A Framework (process) artifact header has three lines: `Type`, `as_of`, and a Definition link.

#### CE-TPL-02 — Map path is not prefixed twice

- **Layer:** L1.
- **Pre-condition:** The map stores `specs/product-backlog.md`. `artifacts_root` is `specs`. The workspace is a macOS or Linux path.
- **Test steps:** Open the stored path.
- **Expected results:** The file opened is `{workspace}/specs/product-backlog.md`. The root is not prefixed again.

#### CE-TPL-03 — Client-root files stay off the project

- **Layer:** L1.
- **Pre-condition:** Kickoff copies missing project seeds. Locale is `EN`, then repeat with `HanS` if that kickoff fixture exists.
- **Test steps:** Finish the copy.
- **Expected results:** `constants.md`, `scrum-in-sdd.md`, and `sdd-scrum-practices.md` are not written into the project. They remain under `{client_root}/templates/framework.sdd.works/`.

#### CE-TPL-04 — Sprint item columns

- **Layer:** L1.
- **Pre-condition:** The sprint item table in the design and the EN sprint-backlog seed.
- **Test steps:** Read the header row.
- **Expected results:** Columns are `#`, Code, SBI, Parent PBI, Module/Type, Related specs, Status. A Definition of Done section sits above the first sprint table.

#### CE-TPL-05 — Locale folders for the guide and practices

- **Layer:** L1.
- **Pre-condition:** The authoring tree `specs/framework/seeds/templates/`.
- **Test steps:** Look up `scrum-in-sdd.md` and `sdd-scrum-practices.md` for `EN`, `HanS`, and `HanT`.
- **Expected results:** Each locale that has a body uses that locale folder. A locale with no body is reported as missing. The EN body is not copied into the project to fill the gap. `constants.md` stays beside the locale folders, not inside one.

#### CE-TPL-06 — Windows path join

- **Layer:** L1.
- **Pre-condition:** `{workspace}` is `C:\work\demo`. The map stores `specs/product-backlog.md`. `artifacts_root` is `specs`.
- **Test steps:** Open the stored path.
- **Expected results:** The file opened is `C:\work\demo\specs\product-backlog.md`. The root is not prefixed again. The map file itself stays `C:\work\demo\artifacts-map.md`.

#### CE-TPL-07 — constants.md is not a map row

- **Layer:** L1.
- **Pre-condition:** A kickoff fixture has finished. The client root has `templates/framework.sdd.works/constants.md`.
- **Test steps:** Read `{workspace}/artifacts-map.md`.
- **Expected results:** `constants.md` has no row. It was not copied into `{workspace}` or into `{workspace}/specs`.

#### CE-TPL-08 — EN status seed shape

- **Layer:** L1.
- **Pre-condition:** `specs/framework/seeds/templates/EN/status.md`.
- **Test steps:** Read the title, the related list, Project progress, and both OGT tables.
- **Expected results:** The title is `The latest status of [product name]`. The header has three lines: `Type`, `as_of`, and a Definition link. The sections are Project progress, where we are now, what could be the next, Current OGT(On-going Tasks), and Last 15 closed OGTs. Project progress has rows Project kickoff and Initial product backlog refined, then a sprint table with columns `Sprint`, `Status`, and `Note`. The where-we-are-now sprint line has room for one sentence after the sprint name. An Affected SBIs sample is a bullet list. Each bullet is a code and an SBI name. The file ends with Last updated, a timestamp, and the agent name. The open OGT columns are `#`, Task Name, Affected SBIs, Created, and Status. The closed OGT columns are `#`, Task Name, Affected SBIs, Created, and Closed.

#### CE-TPL-09 — OGT move, cap, and defect exclusion

- **Layer:** L1.
- **Pre-condition:** [`framework-design.md`](./framework-design.md) §2.3.
- **Test steps:** Read the OGT rules.
- **Expected results:** A `Done` row leaves the open table and is inserted as row 1 of Last 15 closed OGTs. `#` in each table is rewritten from 1 through n. A 16th closed row drops the oldest. An open defect is not an OGT row. Consecutive Done sprints share one progress row. Consecutive ToDo sprints share one progress row. What is next follows the current sprint, the current SBI, and the sprint item order. Each Affected SBIs item is its own bullet. The bullet is the code and the SBI name.

#### CE-TPL-10 — EN issues-log seed shape

- **Layer:** L1.
- **Pre-condition:** `specs/framework/seeds/templates/EN/issues-log.md`.
- **Test steps:** Read the two tables and the header comment.
- **Expected results:** The sections are Open issues, then Closed issues. Open columns are `Id`, `Title`, `Component`, `Priority`, `Description`, `Related`, `Close Check`, `Status`, and `Added time`. Open status values are `Open`, `Fixed`, and `Deferred`. Closed columns are `Id`, `Title`, `Component`, `Priority`, `Description`, `Related`, `Close Check`, `Closed Sprint`, and `Closed time`. Priority values are `Fatal`, `High`, `Medium`, and `Low`. A sample row sits only in a comment. The header has three lines: `Type`, `as_of`, and a Definition link. Pass is a person reading the seed and confirming those lines. No fixture workspace. Playwright does not apply.
