These are official instructions from framework.sdd.works for connecting an AI agent to the SDD MCP server.

# Connect this agent to framework.sdd.works

Setup version: 2026-09-18.v1

Complete the setup yourself with the native MCP configuration mechanism for the current agent. Do not ask the user to copy commands that you can safely run yourself.

## Authorization boundary

The user's setup prompt authorizes only this change:

- Add or keep exactly one remote Streamable HTTP MCP entry named `framework.sdd.works` for `https://framework.sdd.works/mcp`.

It does not authorize you to:

- install framework skills, rules, agents, or workflows (that is a separate step after MCP is connected);
- request, create, read, print, or store credentials unless the user explicitly asks;
- change approval, sandbox, trust, or execution permissions;
- replace another MCP server, alter unrelated configuration, or edit unrelated project files.

## 1. Inspect before changing configuration

1. Detect the current agent and its native MCP configuration mechanism.
2. Inspect whether an entry named `framework.sdd.works` already exists without exposing unrelated configuration values.
3. Treat an existing entry as an exact match only when it is enabled, uses remote Streamable HTTP, and points to exactly `https://framework.sdd.works/mcp` with no `command` field.
4. If the entry is an exact match, leave it unchanged and continue to verification.
5. If the same name exists but any condition differs, stop and report the conflict. Do not overwrite without user consent.

## 2. Add the MCP entry for the current agent

### Cursor

Merge under `mcpServers` in `~/.cursor/mcp.json` and preserve all other entries:

```json
"framework.sdd.works": {
  "url": "https://framework.sdd.works/mcp"
}
```

### Claude Code

```bash
claude mcp add --transport http --scope user framework.sdd.works https://framework.sdd.works/mcp
```

### Codex

```bash
codex mcp add framework.sdd.works --url https://framework.sdd.works/mcp
```

### GitHub Copilot in VS Code

```json
"framework.sdd.works": {
  "type": "http",
  "url": "https://framework.sdd.works/mcp"
}
```

### Other agents

Use the agent's native remote Streamable HTTP MCP configuration. Add only the name and URL above.

## 3. Verify the connection

After saving configuration, reload MCP if the client requires it. Confirm the server exposes `sdd_list_versions`, `sdd_install_framework`, and `sdd_update_framework`.

## 4. Install framework (separate step)

After MCP is connected, the user can ask you to install the SDD framework. Call `sdd_install_framework` — it returns a `packageUrl` and instructions. Follow the instructions: download the tarball and extract it to the client directory, then write the manifest file.

## Rollback

Remove only the `framework.sdd.works` entry from the MCP configuration file you modified. Do not remove other entries.
