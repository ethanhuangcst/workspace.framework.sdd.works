These are official instructions from sdd.works for connecting an AI agent to the SDD MCP server.

# Connect this agent to sdd.works

Setup version: 2026-10-09.v10

Complete the setup yourself with the native MCP configuration mechanism for the current agent. Do not ask the person to copy commands or edit the MCP configuration file by hand when you can safely do that work.

## Authorization boundary

The user's setup prompt authorizes only this change:

- Add or replace exactly one MCP entry named `framework.sdd.works`.
- The entry is only `"url": "https://sdd.works/mcp"`. It has no `command`.
- When an entry with that name already exists, check it and change it so it is this URL. Replace a previous `command`, a previous host, or a previous path.

It does not authorize you to:

- download or start `sdd-mcp` during setup (that happens later, when the user installs the framework);
- install framework skills, rules, agents, or workflows;
- request, create, read, print, or store credentials unless the user explicitly asks;
- change approval, sandbox, trust, or execution permissions;
- replace another MCP server, alter unrelated configuration, or edit unrelated project files.

## 1. Inspect before changing configuration

1. Detect the current agent and its native MCP configuration mechanism.
2. Inspect whether an entry named `framework.sdd.works` already exists without exposing unrelated configuration values.
3. When that entry already exists, replace it so it is only the URL below. Do not leave a `command` field.
4. Inspect and write only the MCP file named in the section for the agent that is running this session.

## Current client only

Change MCP configuration only for the agent that is running this session. Use only the section below that names that agent. Do not read or write another IDE's mcp.json unless the user names that IDE in this chat. When CodeBuddy or CodeBuddy CN is running, do not edit Cursor, TRAE, or TRAE CN MCP files.

## 2. Add the MCP entry

Use the agent's native remote Streamable HTTP configuration. Preserve every other entry. Do not ask the person to edit the MCP file by hand.

The entry name is `framework.sdd.works`. The value is only:

```json
"framework.sdd.works": {
  "url": "https://sdd.works/mcp"
}
```

### Cursor

Merge under `mcpServers` in `~/.cursor/mcp.json`.

### Claude Code

```bash
claude mcp add --transport http --scope user framework.sdd.works https://sdd.works/mcp
```

When the name already exists, remove it first, then add this URL.

### Codex

```bash
codex mcp add framework.sdd.works --url https://sdd.works/mcp
```

When the name already exists, remove it first, then add this URL.

### GitHub Copilot in VS Code

```json
"framework.sdd.works": {
  "type": "http",
  "url": "https://sdd.works/mcp"
}
```

### CodeBuddy (international)

Use this section when the running IDE is CodeBuddy or WorkBuddy, and it is not the CN-only build. Merge under `mcpServers` in `~/.codebuddy/mcp.json` and preserve all other entries. Use `.codebuddy/mcp.json` in the current workspace only when the user asked to configure this project. Do not write a TRAE, TRAE CN, or Cursor MCP file from this section.

```json
"framework.sdd.works": {
  "url": "https://sdd.works/mcp"
}
```

### CodeBuddy CN

Use this section when the running IDE is CodeBuddy CN or WorkBuddy CN. Merge under `mcpServers` in `~/.codebuddy/mcp.json` and preserve all other entries. Use `.codebuddy/mcp.json` in the current workspace only when the user asked to configure this project. Do not write a TRAE, TRAE CN, or Cursor MCP file from this section.

```json
"framework.sdd.works": {
  "url": "https://sdd.works/mcp"
}
```

### TRAE (international)

Use this section when the running IDE is TRAE (international), not TRAE CN. Merge under `mcpServers` in `~/.trae/mcp.json` and preserve all other entries. Do not use `~/Library/Application Support/Trae CN/User/mcp.json` or `~/.trae-cn/mcp.json` for this user MCP list.

```json
"framework.sdd.works": {
  "url": "https://sdd.works/mcp"
}
```

### TRAE CN

Use this section when the running IDE is TRAE CN. Merge under `mcpServers` in `~/Library/Application Support/Trae CN/User/mcp.json` (same directory as that app's `settings.json`) and preserve all other entries. Do not set `disabled`. Do not write `~/.trae-cn/mcp.json` or `~/.trae/mcp.json` for TRAE CN. Those files are not the Manage-page user MCP list.

```json
"framework.sdd.works": {
  "url": "https://sdd.works/mcp"
}
```

### Other agents

Add only the name and the URL above.

## 3. Verify the connection

After saving configuration, reload MCP if the client requires it. Confirm the server exposes `sdd_install_framework` and `sdd_update_framework`. On HTTP, it also exposes `sdd_get_key`.

## 4. Install framework (separate step)

After MCP is connected, the user can ask you to install the SDD framework.

Call `sdd_install_framework` on `https://sdd.works/mcp` with no inventory.

- When the tool returns `cache_stale` or `fixture_pack`, stop. Do not copy pack files onto the client. Tell the person the operator must refresh the pack on the server.
- When the tool returns `writer_required`, the download link is the pack on this server. Do not use a git host or a repository name. Follow the `instructions` field in that result. It matches the bullets below.
- Save the local program only under the home directory as `.sdd/sdd-mcp` (Windows: `sdd-mcp.exe` under the user profile). Expand home before you run it. When the program is already on this machine, run it once with `--write`, `--client`, `--os`, and `--client-root` when you have a candidate folder. Set `SDD_SERVER_URL` to `https://sdd.works`. Do not put that program path in `mcp.json`.
- Pass `--client` as `cursor`, `claude`, `codex`, or `copilot` for those sections above. Pass `codebuddy` for CodeBuddy (international), WorkBuddy, CodeBuddy CN, and WorkBuddy CN. Pass `trae` for TRAE (international). Pass `trae-cn` for TRAE CN. Pass `--os` as `darwin`, `linux`, or `win32`.
- The program rejects a candidate folder outside the home directory, a path containing `..`, or `/etc`, `/usr`, `/bin`, or `/sbin`. For a known IDE, the program keeps its path-table folder when your candidate differs.
- When the local program cannot be downloaded or cannot run, call `sdd_install_framework` again with `inventory`: the whole `.sdd-installed.json`, or `ledger: null` when that file is absent, plus `missing`. Set `accepted_root` to that same candidate folder when you have one. Follow the returned plan and instruction. Copy only the planned paths. Write `.sdd-installed.json` last. Do not extract the archive into the client root.
- Do not write `framework.sdd.works.json`.

## Rollback

Remove only the `framework.sdd.works` entry from the MCP configuration file you modified. Do not remove other entries.
