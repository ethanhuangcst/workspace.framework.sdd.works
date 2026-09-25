# ADR-061: Public setup prompt path is /setup

## Status
Accepted

## Context
End users paste one sentence. The agent fetches the markdown at that URL and follows it. [ADR-058](./ADR-058-stdio-end-user-http-fallback.md) put that markdown at `GET /agent-setup` (source `public/agent-setup/prompt.md`): download `~/.sdd/sdd-mcp`, write a `command` entry, and use the HTTP MCP URL only when a local program cannot be started.

The instructions page should keep that one-line paste. The stdio contract stays in the fetched markdown, not copied onto the page. The public path in the sentence should be short: `https://framework.sdd.works/setup`.

Prompts already pasted still say `/agent-setup`. Those fetches must keep returning the same instructions.

## Decision
1. The public setup URL is `GET /setup`. The paste sentence is: `Fetch and execute the setup instructions from https://framework.sdd.works/setup`.
2. That response is the stdio-primary markdown. It tells the agent to download the binary and write `command`. The HTTP URL `https://framework.sdd.works/mcp` stays inside that markdown as the fallback. The instructions page does not repeat that contract in the copy block.
3. The source file stays `public/agent-setup/prompt.md`. The public path changes. The API handler may stay `/api/agent-setup`; `GET /setup` rewrites to it.
4. `GET /agent-setup` redirects to `GET /setup` so a prompt already pasted still loads the instructions.
5. The instructions page Manual setup section shows one `mcp.json`: the `command` entry with `SDD_SERVER_URL`. It does not show a second `mcp.json` for the HTTP URL, and it does not show `curl | sh`. HTTP fallback remains in the markdown from decision 2. The terminal installer stays in go-live.
6. ADR-058 decision 3’s public path `/agent-setup` is superseded by this ADR. The stdio-primary body and the HTTP fallback inside that body stay.

## Rationale
One sentence on the page and one markdown file on the server avoid two copies of the connection contract. `/setup` is the URL a person pastes. A redirect keeps prompts that already name `/agent-setup`. A second `mcp.json` and a curl line on Manual setup look like extra transports. They are the same stdio connection, or the fallback already written in the markdown.

## Consequences
- Sprint 2 `backend-01` owns the `/setup` route (including the redirect). Feature-05 stays Done for the markdown body. Feature-11 owns the instructions-page copy sentence.
- Feature-12 owns the single manual `mcp.json`. Feature-13 tests the copy sentence and that one sample.
- Living specs name `GET /setup`. Closed Phase 1 snapshots that still say `GET /agent-setup` stay as history.

## Date
2026-09-25
