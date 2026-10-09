---
title: MCP expected lookup results must not set isError
date: 2026-10-09
related: MC-09, sdd_get_key
---

# MCP expected lookup results must not set isError

A tool result that the caller treats as a normal branch (for example a missing key name) must not set `isError: true`. Callers treat `isError` as a failure and then inspect the store, retry, or invent next steps.

For `sdd_get_key`, a missing name and a decrypt failure return the plain text `not_found` with no `isError`. Auth and empty input stay tool errors with a code only.
