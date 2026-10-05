# ADR-090: adr and knowledge roots in artifacts-map.json

## Status
Accepted

## Context

Projects keep Architecture Decision Records under an `adr` tree and reusable notes under a `knowledge` tree. Those paths were convention only. Skills and Ethan had no single place to read the roots. [ADR-082](./ADR-082-artifacts-map-json.md) defines `artifacts_root`, `locale`, `files`, and `modules` only.

## Decision

1. `{workspace}/artifacts-map.json` may include two optional string keys: `adr` and `knowledge`. Each value is one workspace-relative directory root. The file does not list every ADR or knowledge file under `files`.
2. `sdd-update-project` asks for each root after `artifacts_root` is set. The user may omit a key. The skill creates a directory only when the user asks.
3. When a key is present, `sdd-audit-artifacts` reports that path. When the path is not a directory, the audit lists it under `failed`. That failure does not change the verdict from `Usable` when the five process files still open from the map.
4. After the install ledger passes, Ethan and other jobs read `adr` and `knowledge` from the map when they write or read those trees. They do not assume `specs/adr` or `specs/knowledge` when a key is absent.

## Rationale

Two named keys match the special meaning of ADR and Knowledge. A generic `folders` object would blur module folders and these trees. Root-only values keep the map small while giving retrospective and other writers a stable target.

## Consequences

- Practices, `sdd-update-project`, `sdd-audit-artifacts`, and `ethan.md` document the keys and the audit rule.
- Live projects add the keys when `sdd-update-project` confirms them. This repo sets `"adr": "specs/adr"` and `"knowledge": "specs/knowledge"`.

## Date
2026-10-05
