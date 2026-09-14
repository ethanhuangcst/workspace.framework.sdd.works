# framework.sdd.works — MCP service user stories

MCP server that installs and updates the SDD framework and resolves named keys. Stories and ACs for the **MCP** surface. Admin portal: [`app-stories.md`](../admin-portal/app-stories.md). Design: [`mcp-design.md`](./mcp-design.md). Backlog: [`product-backlog.md`](../product-backlog.md).

**Tools:** `sdd_install_framework`, `sdd_update_framework`, `sdd_list_versions`, `sdd_get_key`. Protocol ids are not localized.

**Roles:** MCP client (IDE/agent), Developer, Admin.

**Default Given:** unless stated, the MCP client is connected and authorized where the tool requires auth.

Open questions (do not block ACs that can use explicit `client`): merge vs overwrite; auto-detect vs required `client`; `sdd_get_key` credential type; TRAE Agents first-class vs candidate.

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

#### AC2

```gherkin
Scenario: Explicit overrides win
  Given the resolver is called with client "cursor" and os "darwin"
  And the caller supplies explicit skills/rules/other overrides
  Then the resolver returns the overrides
  And the overrides still pass path-policy before any write
```

#### AC3

```gherkin
Scenario: Unknown client or OS is rejected
  Given the path map has no entry for client "unknown-cli"
  When the resolver is called with client "unknown-cli"
  Then the result code is client_unknown
  And no paths are returned
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
  When sdd_list_versions is implemented (Sprint 5)
  Then its output includes paths_version N
  So a local install whose stored map version is older than N can warn the user
```

### Notes

- Updates are reactive (human PR, bump `version`), not scheduled. No daily job, no auto-discovery in v1.
- The map is mechanism (where to write files), not product knowledge. Do not grow it into a per-client POI encyclopedia (`no-city-encyclopedia`).
- Qwen discovery (MCPI-04) layers on top of this map as a fallback/refinement, never replacing it.

---

## `sdd-mcp-transport-stdio` — stdio transport

Node stdio entry registers tools with pinned `@modelcontextprotocol/sdk`. Core is transport-agnostic. (TRAN-01)

### User story 1 — Local client connects over stdio

**As a** developer using a local MCP client
**I want** the server to start on stdio and advertise the four SDD tools
**So that** my IDE can call install, update, list, and get_key

#### AC1

```gherkin
Scenario: stdio server advertises SDD tools
  Given the MCP stdio process is started
  When the client completes initialize and lists tools
  Then the tool list includes sdd_install_framework, sdd_update_framework, sdd_list_versions, and sdd_get_key
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

HTTP entry on `/mcp` with bearer or session auth. Same core as stdio. (TRAN-02)

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
  Then the tool list includes the same four SDD tools as stdio
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

## `sdd-mcp-list-versions` — `sdd_list_versions`

List available package versions and a high-level inventory. Read-only. No key values. (MCPL-01)

### User story 1 — Discover versions before install

**As an** MCP client
**I want** to list available framework versions and inventory
**So that** the model can choose a version before install or update

#### AC1

```gherkin
Scenario: List versions and inventory
  Given Settings contains a configured GitHub repository with at least one package version
  When the client calls sdd_list_versions
  Then the result includes one or more version identifiers
  And the result includes a high-level inventory of skills, rules, and other folders
  And no key values are present
  And no files are written
```

#### AC2

```gherkin
Scenario: List fails when the package source is unavailable
  Given the configured GitHub repository cannot be read
  When the client calls sdd_list_versions
  Then the result is a structured error
  And the call is not reported as empty success
```

---

## `sdd-mcp-get-key` — `sdd_get_key`

Caller passes `key_name`. MCP reads `key_value` from the store and returns it in plaintext when authorized. (MCPK-01)

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
  Then the plaintext key_value for that name is returned
```

#### AC2

```gherkin
Scenario: Missing key
  Given the client is authorized for sdd_get_key
  And no key named "missing-key" exists
  When the client calls sdd_get_key with key_name "missing-key"
  Then the result code is not_found
  And no other key names or values are returned
```

#### AC3

```gherkin
Scenario: Unauthorized get_key
  Given a key named "cursor-prod" exists
  And the client is not authorized for sdd_get_key
  When the client calls sdd_get_key with key_name "cursor-prod"
  Then the result code is unauthorized
  And the key value is not returned
```

---

## `sdd-mcp-install` — `sdd_install_framework` (stdio, Cursor)

Install skills (with `SKILL.md`), rules, and other folders into Cursor paths. Path allow-list. Structured summary. (MCPI-01)

### User story 1 — Install SDD framework for Cursor

**As a** developer on Cursor
**I want** to install the SDD framework into Cursor skill and rule paths
**So that** the IDE can use the package skills and rules

#### AC1

```gherkin
Scenario: Install writes skills, rules, and other folders
  Given the client is Cursor on the developer machine over stdio
  And a package version is available
  When the client calls sdd_install_framework for that version
  Then skills each containing SKILL.md are written under the Cursor skills root
  And rules are written under the Cursor rules root
  And other package folders are written to documented paths
  And the result includes paths, version, and asset counts
```

#### AC2

```gherkin
Scenario: Invalid or escaped path is rejected
  Given the client calls sdd_install_framework
  When the resolved target is outside allowed user config roots or contains path escape
  Then the result code is path_rejected
  And no files are written
```

---

## `sdd-mcp-update` — `sdd_update_framework` (stdio, Cursor)

Refresh an existing install. Idempotent on the same version. (MCPU-01)

### User story 1 — Update to a chosen or latest version

**As a** developer with an existing Cursor install
**I want** to update the SDD framework
**So that** skills and rules match the chosen package version

#### AC1

```gherkin
Scenario: Update to a newer version
  Given Cursor already has the SDD framework at version A
  And version B is available and newer than A
  When the client calls sdd_update_framework for version B
  Then the install matches version B
  And the result includes a structured summary of changes
```

#### AC2

```gherkin
Scenario: Same version is idempotent
  Given Cursor already has the SDD framework at version A
  When the client calls sdd_update_framework for version A
  Then the result code is already_up_to_date
  And existing user files are not rewritten without cause
```

---

## `sdd-mcp-cross-client` — Cross-client path resolution

Seed path maps for first-class clients across macOS, Windows, and Linux, plus **Qwen-assisted** search of local client configuration to determine install roots (ADR-047). TRAE Agents stays candidate until verified. (MCPI-02, MCPI-04)

### User story 1 — Install uses resolved client paths

**As a** developer on a first-class client
**I want** install and update to resolve that client’s skills/rules roots from seed maps and local config
**So that** assets land where the client loads skills and rules

#### AC1

```gherkin
Scenario: First-class client roots are resolved and used
  Given the client argument or detection is Cursor Agents, WorkBuddy, WorkBuddy CN, Claude Code, Cline, VS Code, Codex, or Copilot
  And the OS is macOS, Windows, or Linux
  When the client calls sdd_install_framework over stdio
  Then files are written only under that client’s resolved skills and rules roots for that OS
  And every written path passed the path allow-list
```

#### AC2

```gherkin
Scenario: Unknown or unverified client is rejected
  Given the client is not in the first-class seed map
  And Qwen cannot confidently resolve config roots
  When the client calls sdd_install_framework
  Then the result is a structured error
  And no files are written
```

---

## `sdd-mcp-path-llm` — Qwen client-config discovery

Use Qwen to search local client configuration when installing skills/rules across clients. Fallback to seed map. (MCPI-04)

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

## `sdd-mcp-http-install-policy` — HTTP install policy

HTTP MCP must not write Server 2 disk as if it were the user’s home. (MCPI-03, MCPU-02)

### User story 1 — Remote install does not write the server disk

**As a** developer calling MCP over HTTP
**I want** install and update to fail safely or return local-bridge instructions
**So that** the hosted server never writes another user’s `~/.cursor`

#### AC1

```gherkin
Scenario: HTTP install without a local bridge
  Given the client calls sdd_install_framework over Streamable HTTP
  And no documented local bridge is configured
  When the tool runs
  Then the result code is local_install_required or the result contains signed local-install instructions
  And the server disk is not written as a user config root
```

#### AC2

```gherkin
Scenario: HTTP update follows the same policy
  Given the client calls sdd_update_framework over Streamable HTTP
  And no documented local bridge is configured
  When the tool runs
  Then the result follows the same local_install_required or instructions policy
  And the server disk is not written as a user config root
```
