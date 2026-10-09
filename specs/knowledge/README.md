# Knowledge Base

Reusable research conclusions, ops lessons, and domain notes (not code truth).
Product requirements live under `specs/`. Architecture decisions live under `specs/adr/`.

## Index

| Doc | Topic | Updated |
| --- | --- | --- |
| [`agent/cursor-agent-callup.md`](./agent/cursor-agent-callup.md) | Cursor `/name` registry vs WS-t templates | 2026-09-22 |
| [`agent/ide-agent-invoke.md`](./agent/ide-agent-invoke.md) | Which IDE gestures start Ethan, and which are not verified | 2026-09-30 |
| [`agent/ide-asset-precedence.md`](./agent/ide-asset-precedence.md) | Same-name project vs user-root assets across IDEs | 2026-09-23 |
| [`agent/admin-portal-seed-and-logo.md`](./agent/admin-portal-seed-and-logo.md) | Portal seed login, logo CSS, local reset vs production | 2026-09-26 |
| [`agent/web-app-fix-regression.md`](./agent/web-app-fix-regression.md) | Why reset and tab fixes kept regressing | 2026-09-26 |
| [`agent/features-markdown-em-dash.md`](./agent/features-markdown-em-dash.md) | A prose ` — ` in Features markdown becomes a name and description | 2026-09-26 |
| [`agent/scrum-body-heading-scale.md`](./agent/scrum-body-heading-scale.md) | Guide `h1` stays body-sized if it uses `.features-body` | 2026-09-27 |
| [`agent/cursor-markdown-preview-loose-list.md`](./agent/cursor-markdown-preview-loose-list.md) | Cursor preview stops at a loose list after a linked header blockquote | 2026-09-30 |
| [`agent/markdown-table-cell-bullets.md`](./agent/markdown-table-cell-bullets.md) | Bullets in a table cell use `<br>`, and heading preview ids drop punctuation | 2026-10-01 |
| [`agent/askquestion-user-view.md`](./agent/askquestion-user-view.md) | AskQuestion names the item and the result; findings stay out of a code block | 2026-10-03 |
| [`agent/dod-retrospective-before-sbi-done.md`](./agent/dod-retrospective-before-sbi-done.md) | sdd-retrospective before SBI Done; not status-review alone | 2026-10-05 |
| [`agent/board-status-lags-shipped-code.md`](./agent/board-status-lags-shipped-code.md) | Board Status can lag shipped code until close confirm | 2026-10-07 |
| [`ops/destructive-command-home-deletion-incident.md`](./ops/destructive-command-home-deletion-incident.md) | `rm -rf "$HOME"` incident, recovery runbook, prevention rules | 2026-09-26 |
| [`ops/trae-cn-user-mcp-path.md`](./ops/trae-cn-user-mcp-path.md) | TRAE CN Manage-page MCP file vs `~/.trae-cn/` | 2026-09-26 |
| [`ops/mcp-stdio-source-vs-binary.md`](./ops/mcp-stdio-source-vs-binary.md) | Cursor `tsx` stdio vs placed `~/.sdd/sdd-mcp` | 2026-09-26 |
| [`agent/install-writer-fixture-cache.md`](./agent/install-writer-fixture-cache.md) | Fixture cache and a GitHub URL in the install writer | 2026-10-09 |
| [`agent/mcp-expected-result-not-iserror.md`](./agent/mcp-expected-result-not-iserror.md) | Expected MCP lookup results must not set `isError` | 2026-10-09 |
