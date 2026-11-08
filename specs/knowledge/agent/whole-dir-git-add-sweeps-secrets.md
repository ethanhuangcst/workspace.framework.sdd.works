---
title: Whole-directory git add sweeps untracked secrets
type: ops-lesson
status: active
as_of: 2026-11-08
tags:
  - ops
  - git
related_spec: specs/changes-log.md
related:
  - .gitignore
---

# Whole-directory git add sweeps untracked secrets

## Summary

A wide `git add specs/` swept in an untracked operator paste file `specs/go-live/20261008/.portainer.env` that held a real GitHub PAT and a Resend API key. GitHub push protection rejected the push, so the secrets never reached the remote, and the commit was redone without the file.

## Evidence

- Push of commit `a9a14c7` was rejected on 2026-11-08 with GH013 Push Protection naming `GitHub Personal Access Token` and `Resend API Key` under `specs/go-live/20261008/.portainer.env`.
- Root cause in `.gitignore`: the rules covered `specs/go-live/.portainer.env` and `specs/go-live/**/portainer.env` but not the dotted form in dated subfolders, so `20261008/.portainer.env` stayed untracked yet addable.
- Fix: added `specs/go-live/**/.portainer.env` to `.gitignore` (commit `58515f9`) and recommitted without the file (`0ff9a56`). The remote never received the secrets.

## Lesson / guidance

Stage with explicit file lists, never a whole directory that contains operator paste files. When a dated env-like path appears, check the ignore rules cover both dotted and plain spellings in every subfolder.

## Links

- [changes-log.md](../../changes-log.md) 2026-11-08 entries
- [ADR-135](../../adr/ADR-135-repo-structure-app-web-mcp-shared.md) restructure whose staging triggered the sweep