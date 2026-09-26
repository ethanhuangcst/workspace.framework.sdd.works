---
title: Features markdown em dash splits a bullet
type: ops-lesson
status: active
as_of: 2026-09-26
tags:
  - features
  - markdown
related_spec: specs/admin-portal/app-design.md
related:
  - knowledge/agent/web-app-fix-regression.md
---

# Features markdown em dash splits a bullet

## Summary

Inside `#features-body`, the first ` — ` in a list item becomes the split between the mono name and the gray description. A prose sentence that uses the same dash is styled as a name plus a description.

## Evidence

- The renderer in `src/lib/features-catalog.ts` looks for ` — ` and wraps the two sides as `.feature-name` and `.feature-desc`.
- After the 2026-09-26 sync, the bullet “Install framework artifacts that set boundaries for AI agents — rules, skills, and related assets…” rendered with the first clause in bold mono and the rest in gray.

## Lesson / guidance

Use ` — ` only on rows that are `name — description` (a skill, a rule, or a file). In a normal sentence, use a comma, a colon, or parentheses.

## Links

- [`admin-portal/app-design.md`](../../admin-portal/app-design.md) Features catalog
