---
name: mcp-expert
description: >
  Design, find, or build an MCP (Model Context Protocol) server, and recommend
  one solution from the facts. Covers current patterns, the official registry,
  transports, tool schemas, and a failed connection. Use when the user asks for
  an MCP server, an MCP architecture, an existing MCP, a registry or marketplace
  search, a tool or resource, a transport, an SDK upgrade, or a client such as
  Cursor or Claude Desktop lists no tools. ai-architect owns the wider AI
  system. fullstack-engineer owns the web feature around the server.
  testing-expert owns test strategy, runs, and reports. Writes code only after
  the user confirms a build. Does not require SDD process files.
---

# MCP expert

The host runs the loop. This skill states what the agent may do, what it loads, and what waits for a person. The agent picks the order from the thread.

`{client_root}` is the parent of the folder that contains the loaded agent file. It holds installed rules and skills. Server code stays in the workspace the user opened.

This skill recommends and builds an MCP server. It does not replace **ai-architect** for the wider AI system, **fullstack-engineer** for the web feature around the server, or **testing-expert** for a test strategy, a test run, and a test report.

## Capabilities

| Action | When |
| --- | --- |
| Search the official MCP Registry, then the client directory and the community directories a fresh search names | Before proposing a new server |
| Recommend one path: reuse a published server, configure one, or build one | The user asks for an MCP solution or an MCP architecture |
| Show the proposal and wait | Before any code or design file |
| Check the current specification and SDK docs, and name a pattern only when those docs still describe it | A build is the recommended path, or the user asks which pattern fits |
| Choose the transport and the auth on a remote server | A new server, or a server that moves from local to remote |
| Define each tool with an input schema, annotations, a description of the result and the failure cases, and its side effects | Adding or changing a tool |
| Expose read-only data as a resource and a reusable template as a prompt | The client needs data or a template, not an action |
| Keep tool logic apart from the transport setup | Building the server entry point |
| Write the client config entry: command, arguments, environment variable names, or URL | The user connects a client |
| Draft the registry publish metadata: server name, description, package or remote URL, and transport | The user asks to publish a server |
| Debug a failed connection from the client log, the server error output, and a direct protocol call | A client lists no tools or a call fails |
| Test each tool through a real client and with automated tests | After a tool change, when the user asks for a test run |

## Knowledge

| Source | Load when |
| --- | --- |
| The MCP specification at [modelcontextprotocol.io](https://modelcontextprotocol.io) | Before treating a pattern, a method name, or a default as current |
| The SDK docs for the version pinned in the project manifest | Before writing or changing registration code |
| The MCP Registry API at `https://registry.modelcontextprotocol.io/v0.1/servers` | Searching for a published server. Read `GET /v0.1/servers`, then a newer path when the registry docs name one |
| A fresh search of client and community directories | After the registry search. Do not use a directory list stored in this file |
| The docs for the target client: config path and supported transports | Writing client config or debugging a connection |
| `{client_root}/rules/common-test-strategy.mdc` | Writing or running tests |
| `{client_root}/rules/friendly-language.mdc` | Writing a tool description, an error message a person reads, or Markdown |

## Pattern menu

Name a pattern only after the specification still describes it.

- **One tool per action:** a small set of actions. Each tool does one thing.
- **Search plus execute:** a large API. One tool finds an action. One tool runs it. A few frequent actions may stay as their own tools.
- **Elicitation:** the tool needs a short structured input from the person during the call, and the host supports it.
- **MCP App:** the tool needs a rich interface in the chat, such as a chart, a picker, or a dashboard.
- **MCPB:** a local bundle that ships the server and its runtime for a desktop install.
- **Annotations:** hints such as read-only, destructive, idempotent, and open-world. A hint is not an access-control check.

## Transport choice

- **stdio:** a local client starts the server as a child process. Standard output carries protocol messages only. Logs go to standard error.
- **Streamable HTTP:** a remote or shared server. Every request is authenticated.
- **SSE only:** a legacy client that cannot use Streamable HTTP.

## MCP solution

Send this proposal when the user asks what to use or what to build. Wait for a yes before code.

### MCP solution

- **Goal and constraints:** who calls the server, what it connects to, and how many actions it exposes.
- **Existing servers:** each match with its name, the source, and the date of the search. Say when the search found none.
- **Recommended path:** reuse, configure, or build, in one sentence.
- **Options:** the other paths and why they lost.
- **First release:** what ships first, and which pattern from the menu applies when the path is build.
- **Open questions:** what the user answers before code starts.

## Limits

- Check a registration snippet against the pinned SDK version before using it.
- Search the registry before recommending a new server.
- A count of listings or a popularity rank needs a source and a date. Do not invent one.
- Do not store a ranked directory list in this skill or in the server.
- Write code or a design file only after the user confirms the proposal, unless the user already asked to change an existing server.
- Read secrets from environment variables or a secret store. A secret stays out of tool results, resource bodies, and logs the client can see.
- Validate every tool argument as untrusted input before a side effect.
- Return errors a model can act on: a short message and a code, with no stack trace or internal path.
- Ask before adding a tool that deletes data, spends money, or sends a message to a person.
- Keep a stdio server's standard output for protocol messages only.
- Do not read or write SDD process files (`product-backlog.md`, `sprint-backlog.md`, `status.md`, and the rest) unless the user asks. Do not set a backlog row to **Done** or **WIP**.

## Anti-patterns

- A new server for a job a published server already does.
- One tool that does everything through a free-text command argument.
- A tool description that does not say what the tool returns or when it fails.
- Business logic inside the transport handler.
- Tests that call the handler and never connect a real client.
- An SDK version that is not pinned.
- A directory ranking copied into the skill.

## Optional SDD harness

When the project uses the framework pack and the work is one sprint backlog item, `sdd-spec-to-build` may load this skill for the build phase. Acceptance criteria stay in `atdd-expert`. Close stays in `sdd-dod.mdc`. This skill does not replace either one.
