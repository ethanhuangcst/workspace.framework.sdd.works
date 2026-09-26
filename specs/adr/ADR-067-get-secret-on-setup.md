# ADR-067: Get secret sits on Setup

## Status
Accepted

## Context
Get secret looks up one stored key by name. Sprint 3 feature-04 and feature-05 put that form at the bottom of the Features tab, after the catalog.

Features is the pack’s markdown catalog: what the framework contains. Setup is the path that installs the framework and connects a tool. A person who needs a key is finishing setup, not reading the catalog.

## Decision
1. The secret form moves to the bottom of the Setup panel, after the tools table.
2. The Features panel does not contain the form.
3. Lookup behavior stays: exact name, one plaintext value, not-found, empty name does not call the API, result scrolls into view, width matches the lookup row, labels stay the existing i18n keys.
4. Submit stays on Setup. The URL does not switch to `?tab=features`. The anchor is `#setup-secret`.
5. The setup paste sentence and `mcp.json` sample stay without a token. `sdd_get_key` stays off the stdio tool list.

## Rationale
Leaving the form on Features keeps a setup action under a reading list. Moving only the chrome, and not the lookup rules, avoids a second secret product.

## Consequences
- [Web-portal-13](../product-backlog.md#pb-83) is Sprint 3 feature-17. [Web-portal-08](../product-backlog.md#pb-74) stays Done for the lookup that shipped on Features.
- The live page renders the form on Setup after the tools table.
- The guide tab ([Web-portal-12](../product-backlog.md#pb-81)) does not contain the form.

## Date
2026-09-26
