# ADR-048: Encrypt admin key values at rest with AES-256-GCM

## Status
Accepted

## Context
KEYS-01 stores plaintext API keys (and similar secrets) that admins paste for later MCP `sdd_get_key`. Values must appear to authenticated admins in the portal list/edit UI, but must not sit as plaintext in Postgres or leak via backups and logs.

Alternatives considered: application-level encryption vs DB column encryption / KMS, and AES-GCM vs AES-CBC or envelope encryption with a cloud KMS.

## Decision
- Encrypt `key_value` in application code before persist; decrypt only for authenticated Keys BFF responses.
- Algorithm: AES-256-GCM.
- Wire format: `v1:<iv_b64url>:<tag_b64url>:<ciphertext_b64url>`.
- Master key from env `KEYS_ENCRYPTION_KEY` (64 hex chars or 32-byte base64). Fail closed if missing or invalid.
- No regenerate flow; delete removes the row.

## Rationale
- App-level AES-GCM gives authenticated encryption without requiring a cloud KMS for MVP.
- Explicit `v1:` prefix allows future algorithm rotation without rewriting readers blindly.
- Keeping plaintext off disk/backups matches the product rule that values appear only on authenticated Keys surfaces (and later MCP).

## Consequences
- Operators must set `KEYS_ENCRYPTION_KEY` in `.env.local` / Portainer; CI and Playwright inject a fixture.
- Rotating the master key requires a migration/re-encrypt job (not built in KEYS-01).
- Losing the master key makes stored values unrecoverable.

## Date
2026-09-14
