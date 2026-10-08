---
title: Scrum guide headings must not use the Features catalog class
type: ops-lesson
status: active
as_of: 2026-09-27
tags:
  - portal
  - markdown
  - css
related_spec: specs/admin-portal/app-design.md
related:
  - knowledge/agent/features-markdown-em-dash.md
  - adr/ADR-071-portal-content-paths.md
---

# Scrum guide headings must not use the Features catalog class

## Summary

Tailwind’s reset sets `h1`–`h6` to `font-size: inherit`. `.features-body` then sizes only `h2` and `h3` and sets every heading margin to zero at the base rule. A prose guide rendered in that class shows part titles (`h1`) smaller than section titles (`h2`), with no space above the part title.

## Evidence

- On 2026-09-27 the Scrum in SDD tab used `class="features-body"`. Measured `h1` was 17px and `h2` was 21.25px. The gap above the first part title was about 7px. English content runs Part I through Part IV in order. Part IV is the 2020 Scrum Guide summary.
- Moving the panel to `.scrum-body` set `h1` to 1.65rem with 2.75rem above later part titles, and `h2` to 1.2rem. Ethan confirmed that layout the same day.
- The Features list renderer also escaped list-item text, so `**Part I**` stayed as asterisks. The guide renderer parses inline markdown inside list items. The Features em-dash split stays on the Features path only.

## Lesson / guidance

Do not render a long-form guide on `.features-body` or `guide-md-body--catalog`. Catalog mode uses `h2` sections, gray `h3` chips, and tables. Scrum and invoke content use `guide-md-body--prose` with explicit `h1` / `h2` scale ([ADR-123](../../adr/ADR-123-unified-guide-markdown-body.md)).

## Links

- [`app-design.md`](../../admin-portal/app-design.md)
- [ADR-071](../../adr/ADR-071-portal-content-paths.md)
