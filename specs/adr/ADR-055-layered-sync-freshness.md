# ADR-055 — Layered sync freshness

**Status:** Accepted  
**Date:** 2026-09-18  
**Context:** ADR-053, ADR-054, SYNK-01

## Problem

The operator package cache (`.data/sdd-packages/`) only refreshed via manual `POST /api/admin/sync`. After a GitHub repo change, HTTP `sdd_install_framework` could compare `installed_commit` against a **stale** cached SHA and return `already_up_to_date`, or serve an outdated tarball. Webhook and scheduled sync were spec'd but never implemented.

## Decision

Three defense-in-depth layers keep the cache fresh and surface staleness to the AI/user:

| Layer | Mechanism | Role |
| --- | --- | --- |
| 1 | `POST /api/github/webhook` — HMAC `GITHUB_WEBHOOK_SECRET`, `push` + `release` | Near-real-time sync on repo change |
| 2 | `instrumentation.ts` 30-min interval + `POST /api/sync/cron` (`CRON_SECRET`) | Catch-up when webhook misses |
| 3 | HTTP install — compare cache `latestCommit` to live GitHub tip; sync if different; expose `cache_synced_at`, `cache_age_minutes`, `cache_stale` | Safety net + observability |

**Install never blocks on staleness.** Layer 3 syncs when cache differs from live tip; advisory `cache_stale` warns when `syncedAt` age exceeds 30 minutes.

## Consequences

- Operator configures GitHub webhook → `https://framework.sdd.works/api/github/webhook` once.
- Self-hosted Node runs scheduled sync via Next.js `register()`; host crontab can call `/api/sync/cron` as backup.
- Webhook returns 200 on sync failure (logged) to avoid GitHub retry storms; cron catches up.
- HTTP idempotency: AI must verify local files exist before passing `installed_commit` (documented in install instructions + mcp-design).

## Alternatives considered

- **Auto-sync on every install:** rejected — latency and GitHub API cost on each MCP call.
- **Observability-only Layer 3 (no sync):** rejected — user requirement to sync when cache differs from live tip.
