---
title: Cursor markdown preview stops at a loose list
type: ops-lesson
status: active
as_of: 2026-09-30
tags:
  - markdown
  - cursor
  - preview
related_spec: pack.framework.sdd.works/templates/framework.sdd.works/sdd-scrum-practices.md
related:
  - knowledge/agent/features-markdown-em-dash.md
---

# Cursor markdown preview stops at a loose list

## Summary

Cursor markdown preview stopped rendering `product-backlog.md` after the Requirements intro. The cause was a loose list after a header blockquote with several links. A loose list is an item line, a blank line, then a two-space indented paragraph. The same file as a tight list renders in full.

## Evidence

Spike on 2026-09-30, bisected with small copies of `../../product-backlog.md` in a temporary folder:

- Full header blockquote plus a tight list rendered. The same header plus a loose list stopped.
- The loose list alone, or after a short header, rendered.
- Header blockquote lines 1–4 plus a loose list rendered. Adding the line with two links in one blockquote row stopped it.
- markdown-it and marked produced the same valid HTML for the files that rendered and the files that stopped. The fault is in the preview display, not in the Markdown.
- Removing `<a id>` anchors, changing the `---------` rule style, and adding blank lines after rules did not fix it. Restarting Cursor and installing other preview plugins did not fix it.

## Lesson / guidance

- Write every list tight: the continuation goes on the next line, indented two spaces, with no blank line.
- Use plain Markdown links. Do not write raw HTML anchors.
- After editing a long artifact, open the preview and check that the last section renders.
- Bisect with temporary copies: cut the file in half, then remove one block at a time, and ask "Do you see X?" at each step.

## Links

- [`sdd-scrum-practices.md`](../../../pack.framework.sdd.works/templates/framework.sdd.works/sdd-scrum-practices.md) Writing markdown
- [`product-backlog.md`](../../product-backlog.md)
