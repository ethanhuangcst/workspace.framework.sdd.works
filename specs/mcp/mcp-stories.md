# framework.sdd.works — MCP service user stories

MCP server that installs and updates the SDD framework and resolves named keys. Stories and ACs for the **MCP** surface. Admin portal: [`app-stories.md`](../admin-portal/app-stories.md). Design: [`mcp-design.md`](./mcp-design.md). Tests: [`mcp-tests.md`](./mcp-tests.md). Backlog: [`product-backlog.md`](../product-backlog.md).

**Status (ADR-132):** HTTP-only install ([ADR-131](../adr/ADR-131-http-only-install-bundled-fallback.md)), bundled pack fallback at `pack.framework.sdd.works/`, tarball URL delivery. The agent sends `client`, `os`, and `ledger`. Known clients omit `root`; the server uses the seed-map root. Unknown clients get `root_required` until the person supplies `root`. No agent-side root detection chain. See [`mcp-design.md`](./mcp-design.md) and [ADR-132](../adr/ADR-132-simplified-install-root-and-templates.md).

**Tools:** `sdd_install_framework`, `sdd_update_framework`, `sdd_get_key` (HTTP only). `sdd_list_versions` is not registered ([ADR-063](../adr/ADR-063-unregister-sdd-list-versions.md)).

**Roles:** MCP client (IDE/agent), Developer, Admin.

**Default Given:** unless stated, the MCP client is connected over Streamable HTTP and authorized where the tool requires auth.

Open questions: ~~merge vs overwrite~~ (DECIDED: manifest-tracked merge, ADR-048); ~~auto-detect vs required `client`~~ (Cursor-first; prefer explicit `client` when ambiguous); ~~`sdd_get_key` credential type~~; ~~TRAE Agents first-class vs candidate~~ (CONFIRMED first-class via empirical spike 2026-09-17).

---

## `sdd-mcp-path-map` — Client path map (seed data + resolver)

Versioned data file `packages/sdd-paths/paths.json` + transport-agnostic resolver. Architecture foundation for install/update. v1 ships Cursor seed only. (PATH-01)

### User story 1 — Resolver returns allow-listed roots

**As the** install/update core
**I want** a single resolver that maps `(client, os)` to `{ skills, rules, other }` roots
**So that** writes always target documented client config dirs and never escape the user home

#### AC1

```gherkin
Scenario: Cursor roots resolve per OS
  Given the path map contains cursor with default and darwin/win32/linux entries
  When the resolver is called with client "cursor" and os "darwin"
  Then the result is { skills, rules, other } under ~/.cursor/... for darwin
  And the same call for win32 returns roots under %USERPROFILE%\.cursor\...
  And every returned path starts with the user home after expansion
```

#### AC2 — MC-16

```gherkin
Scenario: Known client uses the seed-map root when the agent omits root
  Given the resolver is called with client "cursor" and os "darwin"
  And the agent does not send a root
  When the server resolves the root
  Then the server uses the seed-map root
  And the install writes under the seed-map root
```

#### AC2b

```gherkin
Scenario: Unknown client with a valid root uses that root
  Given the resolver is called with a client not in the seed map
  And the agent sends a root inside the user home
  When the server validates the root
  Then the server uses the agent-sent root
  And the root passes path-policy before any write
```

#### AC2c — MC-16

```gherkin
Scenario: Unknown client without a root gets root_required
  Given the path map has no entry for client "unknown-cli"
  And the agent does not send a root
  When the server resolves the root
  Then the result code is root_required
  And no paths are returned
  And the message tells the agent to ask the person for the client config root
```

#### AC3

```gherkin
Scenario: Missing client or unknown OS is rejected
  Given the agent does not send a client
  When the resolver is called
  Then the result code is client_unknown
  Given the path map has cursor but no win32 entry and no default
  When the resolver is called with client "cursor" and os "win32"
  Then the result code is os_unsupported
```

#### AC4

```gherkin
Scenario: Escaped or out-of-root path is rejected
  Given any resolved or overridden path contains ".." or escapes the user home after expansion
  When path-policy validates it
  Then the result code is path_rejected
  And the path is not used for writes
```

### User story 2 — The map is versioned and validated in CI

**As a** maintainer
**I want** the path map to be a versioned JSON file validated by schema and unit tests on every PR
**So that** path changes are reviewable data edits, not code changes, and stale installs can warn

#### AC5

```gherkin
Scenario: CI rejects an invalid map
  Given a PR edits packages/sdd-paths/paths.json
  When the table-validation unit test runs
  Then every entry resolves under HOME or USERPROFILE
  And no entry contains ".."
  And every client has a default entry
  And trailing slashes are consistent
  And the PR fails CI if any of the above is violated
```

#### AC6

```gherkin
Scenario: Map version is exposed for staleness warnings
  Given the path map has version N
  When GET /api/sdd/versions returns a successful payload
  Then its output includes paths_version N
  So a local install whose stored map version is older than N can warn the user
```

### Notes

- The seed map is the single path source (ADR-132). No LLM at install time.
- The agent sends `client` and `os`. For a known client, the server uses the seed-map root. For an unknown client, the server returns `root_required` until the agent sends a validated `root`.

---

## `sdd-mcp-transport-stdio` — stdio transport — Retired (ADR-131)

**Retired.** ADR-131 removes the stdio transport. HTTP (Streamable HTTP on `/mcp`) is the only transport. No local program, no `~/.sdd/sdd-mcp` binary. The ACs below are retained for reference only and do not apply to the first release.

### User story 1 — Local client connects over stdio

**As a** developer using a local MCP client
**I want** the server to start on stdio and advertise the install and update tools
**So that** my IDE can call install and update without a catalog tool

#### AC1

```gherkin
Scenario: stdio server advertises SDD tools (no get_key, no list_versions)
  Given the MCP stdio process is started
  When the client completes initialize and lists tools
  Then the tool list includes sdd_install_framework and sdd_update_framework
  And the tool list does not include sdd_get_key
  And the tool list does not include sdd_list_versions
  And each tool description states parameters, success shape, and failure modes
```

#### AC2

```gherkin
Scenario: Invalid tool arguments are rejected before side effects
  Given the MCP stdio process is started
  When the client calls a registered tool with arguments that fail the input schema
  Then the call fails with a structured validation error
  And no files are written
  And no key values are returned
```

---

## `sdd-mcp-transport-http` — Streamable HTTP transport

HTTP entry on `/mcp` with bearer or session auth. This is the only transport (ADR-131). (TRAN-02)

### User story 1 — Remote client connects over HTTP

**As a** developer using a remote MCP client
**I want** to call the same tools on `/mcp` with a bearer token
**So that** cloud clients and third-party apps can use the service

#### AC1

```gherkin
Scenario: Authorized HTTP client lists tools
  Given Streamable HTTP MCP is available at /mcp
  And the client sends a valid bearer token
  When the client completes initialize and lists tools
  Then the tool list includes sdd_install_framework, sdd_update_framework, and sdd_get_key
  And the tool list does not include sdd_list_versions
```

#### AC2

```gherkin
Scenario: Missing or invalid bearer is rejected
  Given Streamable HTTP MCP is available at /mcp
  When the client calls /mcp without a valid bearer token
  Then the result is unauthorized
  And no tool runs
  And no stack trace is returned
```

---

## `sdd-mcp-tool-surface` — MCP tools without `sdd_list_versions` (MCP-03)

The model cannot call `sdd_list_versions`. Version listing stays on `GET /api/sdd/versions` and `listVersions()`. ([ADR-063](../adr/ADR-063-unregister-sdd-list-versions.md), [MCP-03](../product-backlog.md#L339))

### User story 1 — Model sees install, update, and get_key

**As a** person using an agent that connects to framework.sdd.works MCP
**I want** the tool list to omit `sdd_list_versions`
**So that** install and update use latest without a catalog round trip

#### AC1

```gherkin
Scenario: HTTP tools/list omits sdd_list_versions and keeps get_key
  Given the HTTP MCP server is started
  When the client completes initialize and lists tools
  Then the tool list includes sdd_install_framework, sdd_update_framework, and sdd_get_key
  And the tool list does not include sdd_list_versions
```

#### AC2

```gherkin
Scenario: Install with omitted version still resolves latest
  Given the operator server has run a successful package sync
  When the client calls sdd_install_framework without a version argument
  Then the install uses the latest version from the sync cache
  And the call does not require sdd_list_versions
```

#### AC3

```gherkin
Scenario: Versions REST still returns the sync cache
  Given the operator server has run a successful package sync
  When GET /api/sdd/versions is requested
  Then the response includes version identifiers from the sync manifest
  And the response includes paths_version
  And no key values are present
```

---

## `sdd-mcp-get-key` — `sdd_get_key`

Caller passes `key_name`. When authorized and the name exists, the result text is only the plaintext secret. A missing name returns the text `not_found` and is not a tool error ([MC-09](../issues-log.md)). (MCPK-01)

### User story 1 — Resolve a named key

**As an** MCP client
**I want** to retrieve a key value by name
**So that** the calling tool can use operator-stored secrets (for example AI API keys) without storing them in the client repo

#### AC1

```gherkin
Scenario: Authorized get of an existing key
  Given a key named "cursor-prod" exists in the store with a key_value
  And the client is authorized for sdd_get_key
  When the client calls sdd_get_key with key_name "cursor-prod"
  Then the call is not a tool error
  And the result text is only the plaintext secret
  And the result text does not include key_name, key_description, or created_at
```

#### AC2

```gherkin
Scenario: Missing key
  Given the client is authorized for sdd_get_key
  And no key named "missing-key" exists
  When the client calls sdd_get_key with key_name "missing-key"
  Then the call is not a tool error
  And the result text is exactly not_found
  And the result text has no error object
  And no other key names or values are returned
```

#### AC3

```gherkin
Scenario: Unauthorized get_key
  Given a key named "cursor-prod" exists
  And the client is not authorized for sdd_get_key
  When the client calls sdd_get_key with key_name "cursor-prod"
  Then the call is a tool error
  And the result code is unauthorized
  And the result text has no message
  And the key value is not returned
```

#### AC4

```gherkin
Scenario: Empty key name
  Given the client is authorized for sdd_get_key
  When the client calls sdd_get_key with an empty key_name
  Then the call is a tool error
  And the result code is invalid_input
```

---

## `sdd-mcp-install` — `sdd_install_framework` (HTTP, all clients)

Install the **pack allow-list** (`agents`, `skills`, `rules`, `workflows`, `templates`) onto `{client_root}`. The server validates the root, checks cache or bundled pack, and returns a tarball URL. The agent downloads the tarball, extracts listed paths, and writes the ledger last. (MCPI-01, [MCP-01](../product-backlog.md#L318))

### User story 1 — Install SDD framework

**As a** developer
**I want** to install the SDD framework pack into my client root
**So that** the IDE can load agents, skills, rules, workflows, and templates

#### AC1

```gherkin
Scenario: Install returns a tarball URL and the agent writes listed files
  Given the client calls sdd_install_framework over HTTP
  And the agent sends client and os (and omits root for a known client)
  And the pack cache has a real commit
  When the tool runs
  Then the result action is apply
  And the result includes the resolved root, the version, the file list, deletions, and a tarball URL
  And the tarball URL is on this server
  And the result does not name a git host
  And the result does not include inline file contents
  And the result does not include writer_required
```

#### AC1b

```gherkin
Scenario: Non-pack top-level names are not copied
  Given the synced package also contains application folders such as src or prisma
  When the client calls sdd_install_framework
  Then those names are not in the file list
  And only agents, skills, rules, workflows, and templates from the package are listed
```

#### AC2

```gherkin
Scenario: Invalid or escaped path is rejected
  Given the agent sends a root outside the home directory or containing ..
  When the server validates the root
  Then the result code is path_rejected
  And no files are listed
  And no tarball URL is returned
```

#### AC3

```gherkin
Scenario: Manifest exists but files were deleted
  Given the client has .sdd-installed.json matching the requested version
  And the listed skill or rule folders have been manually deleted
  When the client calls sdd_install_framework for that version
  Then the result action is apply
  And the result includes the file list and a tarball URL
  And the result action is not noop
```

#### AC4

```gherkin
Scenario: Force reinstall when version matches
  Given the client has a complete install at version A
  When the client calls sdd_install_framework with force true for version A
  Then the result action is apply
  And the result includes the file list and a tarball URL for version A
```

#### AC5

```gherkin
Scenario: Same ref label but repo content changed
  Given the client has .sdd-installed.json for ref main at commit SHA-A
  And the GitHub repo at ref main now resolves to commit SHA-B with different skills
  When the client calls sdd_install_framework for main
  Then the result action is apply with files from SHA-B
  And stale package-owned skills from SHA-A are in the deletions list
  And the result action is not noop
```

#### AC6 — Bundled fallback (ADR-131)

```gherkin
Scenario: Empty cache falls back to bundled pack
  Given the pack cache is empty or has a fixture commit
  When the client calls sdd_install_framework
  Then the server reads the bundled pack under pack.framework.sdd.works/
  And the result action is apply with files from the bundled pack
  And the result does not return cache_empty or fixture_pack
  And the agent writes the files and the ledger
```

#### AC7 — MC-18, templates nested path

```gherkin
Scenario: Install writes templates under the framework.sdd.works level
  Given the pack templates folder holds a framework.sdd.works subfolder
  When the client calls sdd_install_framework
  Then the file list includes paths under templates/framework.sdd.works/
  And after install {client_root}/templates/framework.sdd.works/{locale}/ exists for each locale
  And constants.json and the AI-read trio live under {client_root}/templates/framework.sdd.works/
  And the paths resolve the references skills, rules, and agents make to {client_root}/templates/framework.sdd.works/...
```

#### AC8 — MC-17, install page

```gherkin
Scenario: An install page names the MCP install sequence
  When GET /install is requested
  Then the response Content-Type is text/markdown
  And the body names the sequence: read the ledger, call sdd_install_framework with client and os, download the tarball, extract listed paths, write the ledger last
  And the body tells the agent to omit root for known clients
  And the body does not name a git host or a repository
  And GET /setup links to GET /install from an After setup note
  And GET /setup still has no install section
```

---

## `sdd-mcp-install-ledger` — Install ledger (`.sdd-installed.json`, ADR-057)

After a successful install or update, the agent writes `{client_root}/.sdd-installed.json` once with `pack_complete: true`, version, commit, and `files`. The server returns the ledger in the plan. The agent writes it last. Do not write `framework.sdd.works.json`. ([MCP-01](../product-backlog.md#L318))

### User story 1 — Ledger after a successful copy

**As a** developer who installed the framework
**I want** one install record at `{client_root}/.sdd-installed.json`
**So that** the agent can tell the pack copy finished without a second receipt file

#### AC1

```gherkin
Scenario: Install result includes the ledger and the agent writes it last
  Given a successful sdd_install_framework that returned action apply
  When the agent extracts the listed files
  Then the agent writes {client_root}/.sdd-installed.json last
  And pack_complete is true
  And installed_at, package_version, and package_commit are set
  And files lists the pack-owned paths that were written
  And framework.sdd.works.json does not exist
```

#### AC2

```gherkin
Scenario: Failed install does not mark the pack complete
  Given sdd_install_framework is rejected with path_rejected or client_unknown
  When the tool returns
  Then no new .sdd-installed.json is written with pack_complete true
  And no pack files are written by the agent
```

#### AC3

```gherkin
Scenario: Update rewrites the ledger after a successful copy
  Given an existing install with .sdd-installed.json
  When sdd_update_framework returns action apply and the agent copies the new files
  Then .sdd-installed.json is rewritten with pack_complete true
  And files matches the new pack contents
```

### User story 2 — HTTP returns a plan and the ledger is written last

**As a** developer using HTTP MCP
**I want** the tool response to name the plan and the ledger
**So that** the ledger is written only after the planned files are copied

#### AC4

```gherkin
Scenario: HTTP install result includes the ledger in the plan
  Given the client calls sdd_install_framework over Streamable HTTP
  And the agent sends the ledger or no ledger
  When the tool runs
  Then the result is noop, rewrite_ledger, or apply
  And an apply result names the ledger in the response
  And the instruction says to write that ledger last
  And the instruction does not say to extract an archive into the client root
  And the result does not require framework.sdd.works.json
```

#### AC5

```gherkin
Scenario: HTTP does not return noop when a recorded file is missing
  Given the agent sends the ledger
  And a recorded path is missing on disk
  When sdd_install_framework runs over HTTP
  Then the result is apply
  And the result does not include writer_required
```

---

## `sdd-mcp-partial-install-ledger` — Withdrawn (MCP-05, feature-54)

**Retired.** Product backlog withdrew partial `.sdd-installed.json` merge for prompt-driven subset copy. Lite install ([Category: framework HTTP lite installer](../product-backlog.md#category-framework-http-lite-installer-through-local-agent)) copies allow-listed pack paths through HTTP links and a local agent only. It does not write `.sdd-installed.json`. Full install ledger stays in [`sdd-mcp-install-ledger`](#sdd-mcp-install-ledger). Portal ACs: [`app-stories.md`](../admin-portal/app-stories.md) AC19–21 (feature-55–57).

---

## `sdd-mcp-client-root-scenarios` — Client-root outcomes

The server uses the seed-map root for known clients. Unknown clients supply `root` after `root_required`. The agent writes listed files and keeps unlisted user files. ([MCP-01](../product-backlog.md#L318))

### User story 1 — Preserve user files and record pack files

**As a** developer with skills and notes under my client folder
**I want** install and update to keep my files and record each pack file
**So that** a later update does not delete my notes inside a pack skill folder

#### AC1

```gherkin
Scenario: First install replaces same path and keeps other skills
  Given ~/.cursor/skills/samectx/SKILL.md exists with content "my skill"
  And ~/.cursor/skills/tdd/SKILL.md exists with content "my tdd notes"
  And ~/.cursor/.sdd-installed.json does not exist
  And the pack has tdd and does not have samectx
  When sdd_install_framework runs over HTTP
  Then the file list includes skills/tdd/SKILL.md not skills/samectx/SKILL.md
  And the agent writes skills/tdd/SKILL.md with the pack text
  And the agent does not write skills/samectx/SKILL.md
  And samectx content stays "my skill"
  And the agent writes .sdd-installed.json listing skills/tdd/SKILL.md not samectx
  And pack_complete is true
  And framework.sdd.works.json does not exist
```

#### AC2

```gherkin
Scenario: Update replaces recorded pack files and keeps an unlisted user skill
  Given .sdd-installed.json lists skills/tdd/SKILL.md only
  And samectx exists with content "my skill"
  And skills/tdd/my-notes.md exists and is not listed
  When sdd_update_framework returns apply for a new pack that still has skills/tdd/SKILL.md
  Then the agent writes skills/tdd/SKILL.md with the new pack text
  And the skills/tdd directory is not deleted
  And my-notes.md stays
  And samectx stays "my skill"
  And the new ledger lists skills/tdd/SKILL.md not the folder name tdd
  And pack_complete is true
```

#### AC2b

```gherkin
Scenario: An old ledger that names a skill folder does not delete that folder
  Given .sdd-installed.json lists the folder name tdd under files.skills
  And skills/tdd/my-notes.md exists
  When sdd_update_framework returns apply for a new pack that has skills/tdd/SKILL.md
  Then skills/tdd is not removed as a directory
  And my-notes.md stays
  And the new ledger lists skills/tdd/SKILL.md
  And the new ledger does not list the folder name tdd
  And pack_complete is true
```

#### AC3

```gherkin
Scenario: Same version and commit leave a user edit in place
  Given .sdd-installed.json has main at commit abc and lists skills/tdd/SKILL.md
  And pack_complete is true
  And skills/tdd/SKILL.md content is "my edited tdd"
  And the server pack is still main at abc
  When sdd_install_framework runs over HTTP without force
  Then the result is noop
  And the content stays "my edited tdd"
```

#### AC4

```gherkin
Scenario: Notes folder outside the pack is left alone
  Given ~/.cursor/notes/ideas.md exists with content "my ideas"
  And notes is not in .sdd-installed.json
  When sdd_install_framework runs over HTTP
  Then notes/ideas.md stays "my ideas"
```

#### AC5

```gherkin
Scenario: File-level record keeps user note inside a pack skill folder
  Given .sdd-installed.json lists skills/tdd/SKILL.md and skills/tdd/old-step.md
  And skills/tdd/my-notes.md exists with content "my notes" and is not listed
  And the new pack has skills/tdd/SKILL.md "new pack tdd" and no old-step.md
  When sdd_update_framework runs over HTTP
  Then the agent writes SKILL.md with "new pack tdd"
  And the agent deletes old-step.md
  And my-notes.md stays "my notes"
  And the skills/tdd directory remains
  And the new ledger lists skills/tdd/SKILL.md only
  And pack_complete is true
```

#### AC6a

```gherkin
Scenario: Old ledger missing pack_complete with same commit returns rewrite_ledger
  Given .sdd-installed.json has main at abc, lists skills/tdd/SKILL.md, and has no pack_complete field
  And skills/tdd/SKILL.md content is "my edited tdd"
  And the server pack is main at abc
  When sdd_install_framework runs over HTTP
  Then the result is rewrite_ledger
  And the content stays "my edited tdd"
  And the agent writes .sdd-installed.json with pack_complete true and the same version and commit
```

#### AC6b

```gherkin
Scenario: Old ledger missing pack_complete with new commit returns apply
  Given .sdd-installed.json has main at abc with no pack_complete
  And the server pack is main at def with skills/tdd/SKILL.md "new pack tdd"
  When sdd_update_framework runs over HTTP
  Then the result is apply
  And the agent writes skills/tdd/SKILL.md with "new pack tdd"
  And unrecorded files such as my-notes.md stay
  And the agent writes the ledger with commit def and pack_complete true
```

#### AC7a

```gherkin
Scenario: pack_complete false with same commit returns noop
  Given .sdd-installed.json has main at abc, lists skills/tdd/SKILL.md, and pack_complete is false
  And all listed files exist
  And the server pack is main at abc
  When sdd_install_framework runs over HTTP without force
  Then the result is noop
  And the content is not replaced
  And pack_complete stays false
```

#### AC7b

```gherkin
Scenario: pack_complete false with new commit returns apply and sets true
  Given .sdd-installed.json has pack_complete false for main at abc
  And the server pack is main at def
  When sdd_update_framework runs over HTTP
  Then the result is apply
  And the agent replaces recorded pack files
  And unrecorded user files stay
  And the agent writes the ledger with pack_complete true for commit def
```

#### AC8

```gherkin
Scenario: Download failure writes nothing
  Given .sdd-installed.json has pack_complete true for main at abc
  And the tarball download fails
  When sdd_install_framework returns apply and the agent tries to download
  Then existing files are unchanged
  And .sdd-installed.json is unchanged
  And pack_complete stays true
  And the agent reports the error to the user
```

---

## `sdd-mcp-update` — `sdd_update_framework` (HTTP)

Refresh an existing install. Idempotent on the same version. (MCPU-01)

### User story 1 — Update to a chosen or latest version

**As a** developer with an existing install
**I want** to update the SDD framework
**So that** skills and rules match the chosen package version

#### AC1

```gherkin
Scenario: Update to a newer version
  Given the client already has the SDD framework at version A
  And version B is available and newer than A
  When the client calls sdd_update_framework for version B
  Then the result action is apply with files for version B
  And the result includes a tarball URL and the file list
```

#### AC2

```gherkin
Scenario: Same version is noop
  Given the client already has the SDD framework at version A
  When the client calls sdd_update_framework for version A
  Then the result is noop
  And existing user files are not rewritten without cause
```

---

## `sdd-mcp-cross-client` — Cross-client path resolution

Seed path maps for first-class clients across macOS, Windows, and Linux. The seed map is the single path source (ADR-132). For a known client, the server uses the seed-map root. For an unknown client, the server returns `root_required` or validates the agent-sent `root`. (MCPI-02)

### User story 1 — Install uses resolved client paths

**As a** developer on a first-class client
**I want** install and update to resolve that client's root from the seed map
**So that** assets land where the client loads skills and rules

#### AC1

```gherkin
Scenario: First-class client roots are resolved and used
  Given the client argument or detection is Cursor, CodeBuddy, TRAE, Claude Code, Codex, or Copilot
  And the OS is macOS, Windows, or Linux
  When the client calls sdd_install_framework over HTTP
  Then files are listed only under that client's resolved root for that OS
  And every listed path passed the path allow-list
```

#### AC2

```gherkin
Scenario: Unknown client without a root gets root_required
  Given the client is not in the first-class seed map
  And the agent does not send a root
  When the client calls sdd_install_framework
  Then the result code is root_required
  And no files are listed
```

---

## `sdd-mcp-path-llm` — Qwen client-config discovery — Retired from install (ADR-130 decision 10, ADR-131)

**Retired.** The local LLM discovery path is removed from the end-user install. No writer binary, no stdio program, no Qwen call at install time. The agent sends `client` and `os`; the server uses the seed map for known clients ([ADR-132](../adr/ADR-132-simplified-install-root-and-templates.md)). `src/core/path-resolve-llm.ts` is retained for a deferred server-side discover endpoint; that endpoint is not part of the first release.

The ACs below are retained for the deferred endpoint, not for the first release.

### User story 1 — LLM proposes roots from config snippets

**As a** developer installing the SDD framework on a supported client
**I want** the MCP server to inspect my local client config with Qwen
**So that** install targets match how that client is actually configured

#### AC1

```gherkin
Scenario: Qwen proposes allow-listed roots from redacted config
  Given stdio MCP on the developer machine
  And Qwen credentials are configured
  And candidate config files exist under allow-listed user roots
  When the client calls sdd_install_framework for a first-class client
  Then the server sends only redacted path-related config snippets to Qwen
  And Qwen returns structured skills and rules roots
  And those roots pass path-policy before any write
  And the install summary includes the resolution source llm or seed
```

#### AC2

```gherkin
Scenario: Qwen unavailable falls back to seed map
  Given Qwen is unavailable or returns low confidence
  And the seed path map has defaults for the explicit client argument
  When the client calls sdd_install_framework
  Then roots come from the seed map
  And files are written only under allow-listed seed roots
```

#### AC3

```gherkin
Scenario: Unresolved roots write nothing
  Given Qwen is unavailable or low confidence
  And the seed map cannot resolve the client
  When the client calls sdd_install_framework
  Then the result code is client_config_unresolved or llm_unavailable
  And no files are written
```

#### AC4

```gherkin
Scenario: LLM-proposed escape is rejected
  Given Qwen returns a path outside allow-listed roots or containing path escape
  When the client calls sdd_install_framework
  Then the result code is path_rejected
  And no files are written
```

---

## `sdd-mcp-path-detect` — Client identification (ADR-132)

The agent maps the running session to `client`. It does not run an env-var or config-file chain to choose `root`. The server resolves the root for known clients. Unknown clients use `root_required` and a person-supplied `root`. Env-var relocation stories from ADR-131 are retired. (MCPI-05)

### User story 1 — Agent identifies calling client

**As a** developer calling sdd_install_framework
**I want** the agent to send the correct `client` from the MCP handshake or the user
**So that** the server can resolve the seed-map root

#### AC1

```gherkin
Scenario: clientInfo.name maps to Cursor
  Given the MCP client sends clientInfo.name "cursor" or "Cursor" in the initialize handshake
  When the agent calls sdd_install_framework with client cursor and os darwin
  And the agent omits root
  Then the server uses the seed-map root for cursor
  And the result is not client_unknown
```

#### AC2

```gherkin
Scenario: clientInfo.name maps to Claude Code
  Given the MCP client sends clientInfo.name "claude-code" or "Claude Code"
  When the agent calls sdd_install_framework with client claude and os darwin
  And the agent omits root
  Then the server uses the seed-map root for claude
```

#### AC3

```gherkin
Scenario: Unrecognized clientInfo.name with no client argument is rejected
  Given the MCP client sends an unrecognized clientInfo.name
  And no explicit client argument is provided
  When the agent calls sdd_install_framework
  Then the result code is client_unknown
  And no files are listed
```

### User story 2 — Server-side resolution

**As a** developer
**I want** the server to use the seed-map root for known clients and root_required for unknown clients
**So that** install files land where the IDE loads them

#### AC1

```gherkin
Scenario: Known client omits root and the server uses the seed map
  When the agent calls sdd_install_framework with a known client and os
  And the agent omits root
  Then the server resolves the root from the seed map
  And the result includes the resolved root
```

#### AC2

```gherkin
Scenario: Unknown client without root gets root_required
  Given the client is not in the seed map
  And the agent does not send a root
  When the agent calls sdd_install_framework
  Then the result code is root_required
  And no files are listed
  And the message tells the agent to ask the person for the client config root
```

#### AC3

```gherkin
Scenario: Unknown client with an invalid root gets path_rejected
  Given the client is not in the seed map
  And the agent sends a root outside the home directory or containing ..
  When the server validates the root
  Then the result code is path_rejected
  And no files are listed
```

#### AC4 — ADR-132 decision 6

```gherkin
Scenario: The install result has no root_warning or resolution_source
  Given the client is known or unknown
  When the server resolves or validates the root
  Then the result does not include a root_warning field
  And the result does not include resolution_source
```

### User story 3 — Tool description tells the agent to send client and os (MC-16, feature-93)

**As an** agent calling `sdd_install_framework` or `sdd_update_framework`
**I want** the tool description and the `root` field description to tell me to send `client` and `os` and to omit `root` for a known client
**So that** I do not send a workspace folder as `root` and the server resolves the root from the seed map

#### AC1

```gherkin
Scenario: The install tool description names client and os and tells the agent to omit root for a known client
  When the agent reads the sdd_install_framework tool description
  Then the description names client and os as the inputs the agent sends
  And the description tells the agent to omit root unless it confirmed the path-map root for the running IDE
  And the description says the server resolves root from client and os
```

#### AC2

```gherkin
Scenario: The update tool description matches the install tool description
  When the agent reads the sdd_update_framework tool description
  Then the description matches the sdd_install_framework description for the root-omission rule
```

#### AC3

```gherkin
Scenario: The root field description tells the agent to omit it for a known client
  When the agent reads the root input schema description for sdd_install_framework or sdd_update_framework
  Then the description says to omit root to let the server resolve it from the path map
  And the description says to send root only when the agent confirmed the path-map root for the running IDE
```

#### AC4 — i18n

```gherkin
Scenario: The tool description is localized for every supported locale
  When the agent reads the sdd_install_framework or sdd_update_framework tool description for locale en, zh-Hans, or zh-Hant
  Then each localized description names client and os and tells the agent to omit root for a known client
  And no locale falls back to a missing key
```

---

## `sdd-mcp-sync-job` — Server-side framework sync (SYNK-01)

Operator server sync job fetches framework files from GitHub into local cache. (ADR-053)

### User story 1 — Sync framework from GitHub

**As the** operator server
**I want** to sync the configured GitHub repo into a local package cache
**So that** clients can install without direct GitHub or database access

#### AC1

```gherkin
Scenario: Initial sync stores files and manifest
  Given Settings contains a reachable GitHub repository
  When the sync job runs
  Then unpacked files are stored under .data/sdd-packages/<commit-sha>/
  And manifest.json records latestCommit, latestVersion, versions, and inventory
  And a pkg.tar.gz exists for the commit
```

#### AC2

```gherkin
Scenario: New commit triggers cache update
  Given a prior sync stored commit SHA-A
  And the GitHub repo default ref now resolves to commit SHA-B
  When the sync job runs
  Then files for SHA-B are stored
  And manifest.json latestCommit is SHA-B
```

#### AC3

```gherkin
Scenario: Skill renamed in repo
  Given the repo renamed skill tdd to test-driven-dev
  When the sync job runs after the push
  Then the cache inventory lists test-driven-dev
  And tdd is no longer in the cache inventory
```

#### AC4

```gherkin
Scenario: Skill deleted in repo
  Given the repo deleted skill dod
  When the sync job runs after the push
  Then dod is no longer in the cache inventory
```

#### AC5

```gherkin
Scenario: GitHub unavailable preserves stale cache
  Given a prior successful sync exists
  And GitHub is unreachable
  When the sync job runs
  Then the result is sync_error
  And the existing cache and manifest are unchanged
```

#### AC6

```gherkin
Scenario: Same commit is a no-op
  Given the sync job already stored commit SHA-A
  When the sync job runs again without a new commit
  Then the result status is unchanged
  And no duplicate storage is created
```

#### AC7 — GitHub webhook triggers sync (ADR-055)

```gherkin
Scenario: Valid push webhook refreshes cache
  Given GITHUB_WEBHOOK_SECRET is configured
  And a push event with valid HMAC signature
  When POST /api/github/webhook is called
  Then syncFrameworkRepo runs
  And list-versions cache is cleared
```

#### AC8 — Scheduled sync catch-up (ADR-055)

```gherkin
Scenario: Cron route runs scheduled sync
  Given CRON_SECRET is configured
  And Authorization Bearer matches CRON_SECRET
  When POST /api/sync/cron is called
  Then syncFrameworkRepo runs
```

#### AC9 — HTTP install uses cache or bundled fallback (ADR-131)

```gherkin
Scenario: HTTP install uses cache when available
  Given cache latestCommit is SHA-A
  And the live GitHub tip is SHA-A
  When sdd_install_framework runs on HTTP
  Then the server reads from the cache
  And the result includes a tarball URL on this server
  And the result does not name a git host
```

#### AC10 — ADR-130 decision 5, MC-14

```gherkin
Scenario: A successful sync updates syncedAt even when the commit is unchanged
  Given the sync job already stored commit SHA-A
  And the live git tip is still SHA-A
  When the sync job runs again
  Then the result status is unchanged
  And syncedAt is updated to now
  And the install does not return cache_stale solely because of age
  And a missing cache falls back to the bundled pack under pack.framework.sdd.works/ (ADR-131)
```

### E2E test plan (freshness regression)

| Test | Layer | Assertion |
| --- | --- | --- |
| `install.test.ts` — stale cache + live tip ahead | 3 | Returns new commitSha after refresh; not `noop` |
| `webhook/route.test.ts` | 1 | Valid HMAC → sync; bad HMAC → 401 |
| `sync/cron/route.test.ts` | 2 | Valid CRON_SECRET → sync |
| `ensure-cache-fresh.test.ts` | 3 | Sync when cache ≠ live; fresh when equal |
| Opt-in `sync-e2e.test.ts` | all | Real GitHub repo sync unchanged + idempotent |

---

## `sdd-mcp-package-api` — Package REST API (PKAPI-01)

Public REST API serves sync cache to clients. A missing cache falls back to the bundled pack (ADR-131). (ADR-053)

### User story 1 — Client downloads packages

**As a** client
**I want** to fetch package versions and tarballs from the operator server
**So that** I can install without DB, GitHub token, or Prisma

#### AC1

```gherkin
Scenario: Versions endpoint after sync
  Given the operator server has a populated sync cache
  When GET /api/sdd/versions is called
  Then the response is 200 with versions, inventory, paths_version, latestCommit
```

#### AC2

```gherkin
Scenario: Package download
  Given the operator server has a populated sync cache
  When GET /api/sdd/package?version=latest is called
  Then the response is 200 with application/gzip body
  And headers X-SDD-Commit and X-SDD-Version are present
```

#### AC3

```gherkin
Scenario: Empty cache falls back to bundled pack (ADR-131)
  Given no sync has run
  When GET /api/sdd/versions is called
  Then the response is 200 with the bundled pack version and inventory
  And the response does not return sync_pending
```

#### AC4

```gherkin
Scenario: Unknown version returns not found
  Given the sync cache does not contain version v9.9.9
  And the bundled pack does not contain version v9.9.9
  When GET /api/sdd/package?version=v9.9.9 is called
  Then the response is 404 with error code version_not_found
```

#### AC5

```gherkin
Scenario: Admin manual sync trigger
  Given an authenticated admin session
  When POST /api/admin/sync is called
  Then the sync job runs and returns synced or unchanged status
```

---

## `sdd-mcp-http-install-policy` — HTTP install policy (ADR-131)

HTTP MCP returns a plan with a tarball URL. The agent downloads the tarball, extracts listed paths, and writes the ledger last. The server does not write the caller disk. No writer binary, no `writer_required`, no `accepted_root`.

### User story 1 — Remote install returns a plan with a tarball URL

**As a** developer calling MCP over HTTP
**I want** install and update to return a plan and a tarball URL on this server
**So that** the hosted server never writes another user's client folder

#### AC1

```gherkin
Scenario: HTTP install returns a tarball URL
  Given the client calls sdd_install_framework over Streamable HTTP
  And the agent sends client, os, and the ledger or no ledger (no root for known clients; root after root_required for unknown clients)
  When the tool runs
  Then the result is noop, rewrite_ledger, or apply
  And an apply result includes a tarball URL on this server
  And the result does not name a git host
  And the result does not include writer_required
  And the result does not include accepted_root
  And the server disk is not written as a user config root
```

#### AC2

```gherkin
Scenario: HTTP update follows the same policy
  Given the client calls sdd_update_framework over Streamable HTTP
  When the tool runs
  Then the result includes a tarball URL and the file list
  And the server disk is not written as a user config root
```

#### AC3 — Bundled fallback (ADR-131)

```gherkin
Scenario: Empty cache falls back to bundled pack
  Given the pack cache is empty or has a fixture commit
  When sdd_install_framework runs over HTTP
  Then the server reads the bundled pack under pack.framework.sdd.works/
  And the result is apply with files from the bundled pack
  And the result does not return cache_empty or fixture_pack
```

---

## `sdd-mcp-prompt-setup` — Prompt-based MCP setup (SETUP-01, ADR-131)

End users paste one prompt. The agent writes one URL entry. The person does not edit the MCP file by hand. The agent does not download an executable and does not name a git host. The setup page has no install section. Install instructions live in the `sdd_install_framework` tool result.

### User story 1 — One-prompt setup

**As an** end user
**I want** to paste one prompt to connect framework.sdd.works MCP
**So that** my agent connects without me editing mcp.json

#### AC1

```gherkin
Scenario: Agent setup endpoint serves URL-only instructions
  When GET /setup is requested
  Then the response Content-Type is text/markdown
  And the body shows one URL entry for https://sdd.works/mcp
  And the body has no command entry
  And the body does not ask the person to edit the MCP file by hand
  And the body has no install section
  And the body does not name a git host or a repository
```

#### AC2

```gherkin
Scenario: No local program is needed
  When GET /setup is requested
  Then the body shows only the url https://sdd.works/mcp
  And the body does not mention a local program or a writer binary
  And the body does not name ~/.sdd/sdd-mcp
```

#### AC3 — backend-01

```gherkin
Scenario: Old setup path redirects
  When GET /agent-setup is requested
  Then the response redirects to GET /setup
```

#### AC4 — backend-01

```gherkin
Scenario: Local portal rewrites the MCP URL
  Given PUBLIC_BASE_URL is http://127.0.0.1:3040
  When GET /setup is requested
  Then the body uses the local MCP HTTP URL
  And the body does not use https://sdd.works/mcp
  And the body has no command entry
```

#### AC5 — OGT-2 / TRAE CN user MCP path

```gherkin
Scenario: Agent setup names the TRAE CN user MCP file
  When GET /setup is requested
  Then the body names ~/Library/Application Support/Trae CN/User/mcp.json as the TRAE CN user MCP file
  And the body tells the agent not to write ~/.trae-cn/mcp.json or ~/.trae/mcp.json for TRAE CN
```

#### AC6 — MC-10 / CodeBuddy and TRAE editions, current client only

```gherkin
Scenario: Agent setup names CodeBuddy and TRAE editions and limits scope to the running agent
  When GET /setup is requested
  Then the body setup version is 2026-10-09.v11
  And the body names CodeBuddy (international) for CodeBuddy or WorkBuddy
  And the body names CodeBuddy CN for CodeBuddy CN or WorkBuddy CN
  And both CodeBuddy sections name ~/.codebuddy/mcp.json
  And both CodeBuddy sections use .codebuddy/mcp.json only when the user asked to configure this project
  And the body names TRAE (international) and ~/.trae/mcp.json
  And the TRAE (international) section does not use the Trae CN Application Support path or ~/.trae-cn/mcp.json for that user MCP list
  And the body names the TRAE CN user MCP file under Library/Application Support/Trae CN/User/mcp.json
  And the TRAE CN section does not write ~/.trae-cn/mcp.json or ~/.trae/mcp.json for the TRAE CN user list
  And the body tells the agent to change MCP configuration only for the agent running this session
  And the body tells the agent not to read or write another IDE's mcp.json unless the user names that IDE
  And the body has no install section
  And the body does not name --write, --client, --os, --client-root, SDD_SERVER_URL, or accepted_root
```

#### AC7 — MC-11 / install lives in the tool result, not the setup prompt

```gherkin
Scenario: The install tool result gives a tarball URL
  Given the caller sends client, os, and root or no root
  And the pack cache is not empty
  When sdd_install_framework runs
  Then the result includes a tarball URL on this server
  And the result does not name --write, --client, --os, --client-root, SDD_SERVER_URL, or accepted_root
  And the result does not name a git host
  And GET /setup does not name any of those flags
```

---

## `sdd-mcp-module-boundary` — Setup and pack install backends are separate code modules (feature-90, MCP-08)

The setup backend and the pack install backend run in separate code modules. A change to one module cannot silently reach the other. The boundary is enforced by an import check and by handler behavior. See `mcp-design.md` §2.0 for the file table and boundary rules.

### User story 1 — Setup backend has no pack install logic

**As a** maintainer
**I want** the setup backend to contain no pack install code
**So that** a setup change cannot break install, update, or ledger behavior

#### AC1 — import boundary

```gherkin
Scenario: Setup backend files do not import from the pack install module
  When the import boundary check runs for the setup backend
  Then no file under src/app/api/agent-setup or src/mcp/setup-* imports from src/core/tools or src/core/sync
  And no file under src/mcp/paste-sentences.ts or src/mcp/node-setup-catalog.ts imports from src/core/tools or src/core/sync
```

#### AC2 — handler behavior

```gherkin
Scenario: GET /setup does not call install plan or tarball functions
  When GET /setup is requested
  Then the response is the setup markdown
  And the handler does not call composeInstallPlan, apply-plan, or package-fetch functions
  And the handler does not read the pack cache or the bundled pack
```

### User story 2 — Pack install backend has no setup logic

**As a** maintainer
**I want** the pack install backend to contain no setup serving code
**So that** an install change cannot alter what the person pastes or what GET /setup returns

#### AC1 — import boundary

```gherkin
Scenario: Pack install backend files do not import from the setup backend
  When the import boundary check runs for the pack install backend
  Then no file under src/core/tools or src/core/sync imports from src/mcp/setup-markdown, src/mcp/setup-paths, src/mcp/paste-sentences, src/mcp/node-setup-catalog, or src/mcp/brand
```

#### AC2 — handler behavior

```gherkin
Scenario: sdd_install_framework does not call setup functions
  When sdd_install_framework is called with client and os
  Then the handler resolves the root, builds the plan, and returns a tarball URL
  And the handler does not call setup-markdown, paste-sentences, or node-setup-catalog functions
  And the result has no setup markdown content
```

### User story 3 — MCP server entry is the only shared wiring

**As a** maintainer
**I want** only the MCP server entry to import from both modules
**So that** the boundary has one visible wiring point

#### AC1 — wiring point

```gherkin
Scenario: Only the MCP server entry imports from both modules
  When the import boundary check runs for the shared wiring
  Then only src/mcp/create-server.ts and src/mcp/http-server.ts import from both the setup backend and the pack install backend
  And no other file imports from both modules
```

---

## `sdd-mcp-local-binary` — Local program ~/.sdd/sdd-mcp — Retired (ADR-131)

**Retired.** ADR-131 removes the local program. No `~/.sdd/sdd-mcp` binary, no per-OS builds, no stdio writer. HTTP (Streamable HTTP on `/mcp`) is the only transport. The agent downloads a tarball and extracts listed files. The ACs below are retained for reference only and do not apply to the first release.

### User story 1 — Host binary speaks MCP and writes the pack

**As an** end user with `~/.sdd/sdd-mcp` already on the machine
**I want** that program to register install and update over stdio
**So that** my agent tool can write the pack without Node, npm, or Bun on the client

#### AC1 — feature-14

```gherkin
Scenario: Compiled host binary advertises stdio tools
  Given the matching sdd-mcp binary for this OS and CPU has been built
  And that file is started over stdio with no Node, npm, or Bun on PATH
  When the client completes initialize and lists tools
  Then the tool list includes sdd_install_framework and sdd_update_framework
  And the tool list does not include sdd_get_key
  And the tool list does not include sdd_list_versions
```

#### AC2 — feature-14

```gherkin
Scenario: Compiled binary uses the stdio write contract
  Given the compiled host binary is running over stdio
  And SDD_SERVER_URL points at a package server with a pack
  When the client calls sdd_install_framework
  Then the program copies the pack allow-list onto {client_root}
  And it writes {client_root}/.sdd-installed.json with pack_complete true and file paths
  And it does not write framework.sdd.works.json
```

#### AC3 — feature-14

```gherkin
Scenario: One build emits five OS and CPU targets
  When npm run mcp:build completes
  Then dist holds sdd-mcp-darwin-arm64, sdd-mcp-darwin-x64, sdd-mcp-linux-arm64, sdd-mcp-linux-x64, and sdd-mcp-windows-x64.exe
```

#### AC4 — feature-14

```gherkin
Scenario: Same command path for every listed client
  Given ~/.sdd/sdd-mcp is the MCP command for Cursor, Cursor Agents, CodeBuddy CN, TRAE, TRAE CN, Claude Code, or Cline
  When that client starts the program
  Then the program chooses the client root from the caller
  And there is not a separate binary per client
```

#### AC5 — feature-14

```gherkin
Scenario: Source does not embed operator secrets
  Given the stdio entry and the tools it imports for channel stdio
  Then the application source does not embed DATABASE_URL, GITHUB_TOKEN, or KEYS_ENCRYPTION_KEY as string literals for operator config
  And the stdio channel does not statically import the Prisma sync job
```

---

<a id="sdd-mcp-writer-stdout"></a>

## `sdd-mcp-writer-stdout` — Writer stdout reports — Retired (ADR-131)

**Retired.** ADR-131 removes the writer binary. No stdout contract, no `accepted_root` to echo, no `--write` mode. The agent downloads a tarball and extracts listed files. The server returns the resolved root and file list in the tool result. The ACs below are retained for reference only and do not apply to the first release.

### User story — The agent can confirm where files landed

**As an** agent running the writer binary
**I want** the writer stdout to name the accepted root and the written files
**So that** I can detect a wrong `--client` or `--os` before I trust the result

#### AC1

```gherkin
Scenario: Apply prints the accepted root and the file list
  Given the writer runs --write with a known client and a known os
  And the server plan is apply
  When the writer copies the planned files
  Then the stdout is valid JSON
  And the stdout action is apply
  And the stdout includes accepted_root as an absolute path
  And the stdout includes commit and version
  And the stdout includes files as a list of written paths
```

#### AC2

```gherkin
Scenario: Rewrite ledger prints the accepted root and the file list
  Given the writer runs --write with a known client and a known os
  And the server plan is rewrite_ledger
  When the writer rewrites the ledger
  Then the stdout is valid JSON
  And the stdout action is rewrite_ledger
  And the stdout includes accepted_root, commit, version, and files
```

#### AC3

```gherkin
Scenario: Noop prints the accepted root only
  Given the writer runs --write with a known client and a known os
  And the server plan is noop
  When the writer exits without copying files
  Then the stdout is valid JSON
  And the stdout action is noop
  And the stdout includes accepted_root
  And the stdout does not include files
```

#### AC4

```gherkin
Scenario: A wrong client or os is visible from the stdout
  Given the agent passes --client trae and --os darwin
  And the path table maps trae to ~/.trae/
  When the writer runs --write
  Then the stdout accepted_root is under ~/.trae/
  And the agent can detect that the root does not match the intended TRAE CN root
```

---

<a id="sdd-mcp-empty-cache"></a>

## `sdd-mcp-empty-cache` — Empty cache returns an empty framework — Retired (ADR-131)

**Retired.** ADR-131 replaces the empty-cache behavior with bundled pack fallback. When the cache is empty or has a fixture commit, the server reads the bundled pack under `pack.framework.sdd.works/`. The agent never sees `cache_empty`, `fixture_pack`, or `sync_pending`. The server always returns a plan. The ACs below are retained for reference only and do not apply to the first release.

### User story — Install proceeds without error on an empty cache

**As an** agent calling install before the operator synced the pack
**I want** the tool to return an empty framework, not an error
**So that** I do not fail and do not name a git host to the user

#### AC1

```gherkin
Scenario: Empty cache returns an empty framework
  Given the pack cache is empty
  When sdd_install_framework runs
  Then the result code is not sync_pending
  And the result has zero files
  And the result has an empty ledger
  And pack_complete is true
  And cache_empty is true
  And the result does not name a git host or a repository
```

#### AC2

```gherkin
Scenario: The agent writes nothing on an empty cache
  Given the pack cache is empty
  When sdd_install_framework returns an empty framework
  Then the agent does not write .sdd-installed.json
  And the agent does not write any pack file
  And the agent tells the user to sync the pack on the admin portal
```

#### AC3

```gherkin
Scenario: The next install after a sync gets real files
  Given the pack cache was empty
  And the operator synced the pack on the admin portal
  When sdd_install_framework runs again
  Then the result has real files
  And cache_empty is not true
  And the agent writes the pack files and the ledger
```

---

<a id="mcp-github-release"></a>

## `mcp-github-release` — Tagged release ships sdd-mcp — Retired (ADR-131)

**Plain summary (current work is [feature-80 / MCP-06](../product-backlog.md#pb-104), not this section):** Visitors connect with a **URL only** (`https://sdd.works/mcp`). Pack files come from a **tarball on this portal**, not from a GitHub Release and not from a local `sdd-mcp` binary. See [ADR-131](../adr/ADR-131-http-only-install-bundled-fallback.md) and [`sdd-mcp-url-plan`](#sdd-mcp-url-plan).

**Retired.** ADR-131 removes the local program. No per-OS binaries to publish on a GitHub release. The ACs below are kept for history only.

### User story — Operator publishes installers on GitHub

**As an** operator shipping a new MCP build
**I want** a tagged GitHub Release to attach all platform binaries
**So that** visitors install `~/.sdd/sdd-mcp` from one official download page

#### AC1 — feature-80

```gherkin
Scenario: Version tag publishes the five installer files
  Given .github/workflows/release.yml is on the default branch
  When an operator pushes a git tag matching v* on ethanhuangcst/workspace.framework.sdd.works
  Then GitHub Actions runs the release job successfully
  And the release assets are sdd-mcp-darwin-arm64, sdd-mcp-darwin-x64, sdd-mcp-linux-arm64, sdd-mcp-linux-x64, and sdd-mcp-windows-x64.exe
```

### User story — Visitor gets the local program from that release

**As a** visitor connecting an agent
**I want** setup to register the MCP URL and to name the pack on this server
**So that** the agent does not download from a git host

#### AC2 — feature-80

```gherkin
Scenario: Setup does not name a git host
  Given a visitor fetches GET /setup
  Then the instructions do not name a git host or a repository
  And sdd_install_framework download link is the pack on this server
  And the instructions do not tell the agent to save a GitHub release asset as ~/.sdd/sdd-mcp
  And the instructions do not name any other download host
```

#### AC3 — feature-80

```gherkin
Scenario: A missing local program still uses the URL
  Given ~/.sdd/sdd-mcp is missing
  When the agent follows GET /setup
  Then the agent writes an MCP entry whose url is https://sdd.works/mcp
  And the agent does not save an executable from a git host
```

---

<a id="mcp-production-pack-sync"></a>

## `mcp-production-pack-sync` — Production serves the synced pack (feature-82 / MCP-07)

**Plain summary:** On the live portal, Admin → Framework → Sync with git repository must refresh the pack tree that MCP install, lite file links, and package APIs read. That includes `lite-pack.allowlist.json` at the pack root.

**Parent PBI:** [MCP-07](../product-backlog.md#pb-105). **Portal:** Admin Framework sync ([Web-portal-26](../product-backlog.md#pb-123) **Done**). **Design:** [`mcp-design.md`](./mcp-design.md#25-production-pack-sync-feature-82--mcp-07) §2.5. **Tests:** [`mcp-tests.md`](./mcp-tests.md#15-feature-82-production-pack-sync) §15; closes [Spec-seeds-15](../product-backlog.md#pb-97) when verified in production.

### User story — Live install uses the synced pack commit

**As an** operator who synced the pack repo on production
**I want** full MCP install and lite install to read that commit from server cache
**So that** end users never install a stale or partial pack tree

#### AC1 — feature-82

```gherkin
Scenario: Sync materializes pack files in production cache
  Given a signed-in admin on Admin Framework
  When they run Sync with git repository against the pack GitHub repo
  Then the server cache for the latest commit includes agents, skills, rules, templates, and content paths from that commit
  And lite-pack.allowlist.json is present at the pack root in that cache
```

#### AC2 — feature-82

```gherkin
Scenario: Lite and package APIs read the sync cache only
  Given production finished a successful Framework sync with a real pack commit
  When a client calls GET /api/sdd/lite/files or GET /api/sdd/package
  Then responses are built from the synced cache volume (SDD_PACKAGE_CACHE_DIR)
  And the handler does not call GitHub at request time

Scenario: Missing sync or allow-list fails visibly
  Given the package cache has no manifest
  When a client calls GET /api/sdd/lite/files
  Then the response status is 409
  And the error code is sync_pending
  Given the cache unpack exists but lite-pack.allowlist.json is absent at the pack root
  When a client calls GET /api/sdd/lite/files
  Then the response status is 404
  And the error code is lite_manifest_missing
  And the body does not return an empty files array with status 200
```

**Note:** HTTP MCP install (`sdd_install_framework`) may still read the bundled pack when the cache is empty or holds a fixture commit ([ADR-131](../adr/ADR-131-http-only-install-bundled-fallback.md)). feature-82 verifies that production sync populated the cache so live install and lite routes serve the GitHub pack, not the fixture stub or bundled fallback alone.

---

<a id="sdd-mcp-url-plan"></a>

## `sdd-mcp-url-plan` — URL MCP and tarball install (ADR-129, ADR-131)

**Plain summary:** The person pastes one sentence. The agent registers `https://sdd.works/mcp`. Install calls the server, which validates the root, checks cache or bundled pack, and returns a plan with a tarball URL. The agent downloads the tarball, extracts listed paths, and writes the ledger last. No writer binary, no `accepted_root`, no `writer_required`.

Design: [`mcp-design.md`](./mcp-design.md). Tests: [`mcp-tests.md`](./mcp-tests.md#10-adr-129-url-plan).

### User story — Paste registers the URL

**As a** person setting up the framework
**I want** one paste to register the MCP URL
**So that** I do not edit `mcp.json` by hand

#### AC1

```gherkin
Scenario: First paste writes the URL entry
  Given mcp.json has no framework.sdd.works entry
  When the agent follows GET /setup
  Then mcp.json has one entry named framework.sdd.works
  And that entry is only the url https://sdd.works/mcp
  And that entry has no command
```

#### AC2

```gherkin
Scenario: An existing entry becomes the URL
  Given mcp.json has a framework.sdd.works entry with a command path
  When the agent follows GET /setup
  Then that entry is only the url https://sdd.works/mcp
  And the command path is gone
```

### User story — The agent downloads the tarball and writes listed files

**As a** person installing the framework
**I want** the agent to download the tarball and extract the listed files
**So that** my own files stay when the pack is already current

#### AC3

```gherkin
Scenario: Matching ledger and present files return noop
  Given .sdd-installed.json has the same version and commit as the pack
  And every recorded path exists
  When the agent calls sdd_install_framework with that ledger
  Then the result is noop
  And the agent does not change pack files
```

#### AC4

```gherkin
Scenario: A missing recorded file is repaired
  Given .sdd-installed.json lists skills/tdd/SKILL.md
  And that file is absent
  When the agent calls sdd_install_framework with the ledger and missing includes skills/tdd/SKILL.md
  Then the result is apply
  And the agent downloads the tarball, writes that file, and writes the ledger last with pack_complete true
```

#### AC5

```gherkin
Scenario: A path outside the home is rejected
  Given the agent sends a root outside the home directory
  When the server validates the root
  Then the result code is path_rejected
  And no tarball URL is returned
  And no pack file is written
```

#### AC6

```gherkin
Scenario: Known client omits root; unknown client sends validated root
  When the agent calls sdd_install_framework for a known client with client and os only
  Then the server uses the seed-map root
  And the result includes the resolved seed-map root
  And the agent writes only the paths in the plan
  And the agent writes the ledger last
  And the agent does not extract the archive into the client root
  Given the client is not in the seed map
  When the agent first calls without root
  Then the result code is root_required
  When the agent retries with a valid root inside the home directory
  Then the server uses that root
```

#### AC7

```gherkin
Scenario: No ledger is a first install
  Given .sdd-installed.json is absent
  When the agent calls sdd_install_framework with no ledger
  Then the result is apply for the pack allow-list
  And the agent downloads the tarball, writes those paths, and writes the ledger last
```

#### AC8 — MC-02

```gherkin
Scenario: Install names the tarball on this server
  Given the caller sends client, os, and root or no root
  And the pack cache is not empty
  When sdd_install_framework runs
  Then the result includes a tarball URL on this server
  And the result does not name a git host or a repository
  And the result does not include writer_required
```

#### AC8b — Bundled fallback (ADR-131)

```gherkin
Scenario: An empty cache falls back to the bundled pack
  Given the pack cache is empty or has a fixture commit
  When sdd_install_framework runs
  Then the server reads the bundled pack under pack.framework.sdd.works/
  And the result is apply with files from the bundled pack
  And the result does not return cache_empty or fixture_pack
  And the result does not name a git host or a repository
  And the agent writes the files and the ledger
```

#### AC9 — MC-04

```gherkin
Scenario: An unknown client with an agent-sent root uses that root
  Given the client is not in the seed map
  And the agent sends a root inside the home directory
  When the server validates the root
  Then the server uses the agent-sent root
  And the result includes that root
```

#### AC10 — MC-04

```gherkin
Scenario: A parent segment or a system path is rejected
  Given the agent sends a root containing .. or /etc, /usr, /bin, or /sbin
  When the server validates the root
  Then the result code is path_rejected
  And no tarball URL is returned
  And no pack file is written
```

#### AC11 — MC-05, ADR-132

```gherkin
Scenario: The plan request carries root only for unknown clients after root_required
  When the agent calls sdd_install_framework for a known client
  Then the body includes the client, the operating system, and the ledger or no ledger
  And the body does not include root
  And the body does not include file contents
  When the client is unknown and the person supplied a root
  Then the body includes root
  And the server validates that root
```

#### AC12 — MC-03

```gherkin
Scenario: The latest pack is a git commit from the pack repository
  Given the server cache latest pointer is the fixture commit sha-v1.0.0
  When an operator syncs the pack repository
  Then latestCommit is a git commit from that repository
  And GET /api/sdd/package?version=latest is not the six-file fixture set
  And the portal process ignores GITHUB_FIXTURE
  And a practice GitHub port does not replace latestCommit in the portal process
```

#### AC13 — MC-06, ADR-131

```gherkin
Scenario: A fixture commit falls back to the bundled pack
  Given the cached commit is sha-v1.0.0 or the cached tarball is the fixture file set
  When sdd_install_framework runs
  Then the server reads the bundled pack under pack.framework.sdd.works/
  And the result is apply with files from the bundled pack
  And no client file is written from the fixture
  And the result does not return fixture_pack
```

#### AC14 — MC-01, ADR-131

```gherkin
Scenario: No writer binary to be older than source
  Given the server source is current
  When sdd_install_framework runs
  Then there is no writer binary to build or version
  And the result includes a tarball URL and the file list
  And the agent writes the files and the ledger
```

#### AC15 — MC-11, ADR-131

```gherkin
Scenario: The install tool result gives a tarball URL
  Given the caller sends client, os, and root or no root
  And the pack cache is not empty
  When sdd_install_framework runs
  Then the result includes a tarball URL on this server
  And the result does not name --write, --client, --os, --client-root, SDD_SERVER_URL, or accepted_root
  And the result does not name a git host
```

#### AC16 — MC-07

```gherkin
Scenario: HTTP keeps get secret and a missing name is not a tool error
  Given an authorized client lists tools on HTTP
  Then the tool list includes sdd_install_framework, sdd_update_framework, and sdd_get_key
  And a call for a missing secret name returns the text not_found
  And that call is not a tool error
```
