---
title: Bullets in a Markdown table cell and heading preview ids
type: ops-lesson
status: active
as_of: 2026-10-01
tags:
  - markdown
  - cursor
  - sprint-backlog
related_spec: pack.framework.sdd.works/templates/sdd-scrum-practices.md
related:
  - knowledge/agent/cursor-markdown-preview-loose-list.md
---

# Bullets in a Markdown table cell and heading preview ids

## Summary

A GitHub Flavored Markdown (GFM) table cell cannot hold a real line break. A cell with more than one fact uses `- fact<br>- fact`. A link to a heading uses the preview id that Cursor builds from the heading text.

## Evidence

Sprint 4 feature-04, the sprint-backlog seed, on 2026-10-01:

- A ` · ` between two links in one cell wrapped on screen and stayed one line. `- [A](a)<br>- [B](b)` showed two lines.
- A real newline inside a cell ended the table row.
- The heading `## RID Log (Risks,Impediments, Dependencies)` has the preview id `rid-log-risksimpediments-dependencies`.
- The title `# Sprint backlog (framework.sdd.works)` has the preview id `sprint-backlog-frameworksddworks`.
- An open editor buffer with unsaved changes wrote ` · ` back over a script's `<br>` edit on disk.

## Lesson / guidance

- A cell with one fact stays one line. A cell with more than one fact uses `- ` bullets separated by `<br>`.
- A heading preview id is the heading text trimmed, in lowercase, with spaces turned into hyphens, then punctuation removed.
- A link to a table row uses the heading above the table, such as `#sprint-1`. Do not add a raw HTML anchor.
- After a script edits an open file, read the file on disk again before the next edit.

## Links

- [`sdd-scrum-practices.md`](../../../pack.framework.sdd.works/templates/sdd-scrum-practices.md) Sprint item table and RID Log
- [`sprint-backlog.md`](../../sprint-backlog.md)
