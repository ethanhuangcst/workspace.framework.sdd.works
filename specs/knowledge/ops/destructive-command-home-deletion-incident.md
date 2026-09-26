---
title: Destructive command deleted real home directory — incident and recovery
type: ops-lesson
status: active
as_of: 2026-09-26
tags:
  - incident
  - destructive-command
  - data-recovery
  - time-machine
  - macos
related_spec:
related:
  - ../../adr/ADR-062-no-destructive-commands-on-home-derived-paths.md
---

# Destructive command deleted real home directory — incident and recovery

## Summary

On 2026-09-25 at 19:38, a debug script ran `rm -rf "$HOME"` against `/Users/ethanhuang` (the real home) because `$HOME` was not overridden to a test sandbox as the script assumed. The command deleted all unprotected files in the home folder. macOS SIP protected `~/Library` partially, but Desktop, Documents, Downloads, code, and many dotfiles were lost. Recovery took 3.5+ hours and continued beyond, with collateral damage to iCloud enrollment, Mail accounts, keychain, and app preferences.

This is the most serious self-inflicted incident in this project. It was caused by passing an unverified environment variable into `rm -rf`. It is preventable by hard-coding sandbox paths and adding guard clauses. See [ADR-062](../../adr/ADR-062-no-destructive-commands-on-home-derived-paths.md).

## Evidence

### What happened

- A debug script was written to test cleanup logic. It used `rm -rf "$HOME"` assuming `$HOME` would be overridden to a test directory.
- The override did not take effect (or was never set). `$HOME` resolved to `/Users/ethanhuang`.
- `rm -rf "$HOME"` deleted every unprotected file and directory under `/Users/ethanhuang`.
- macOS SIP and TCC protections stopped deletion of `~/Library` core subdirectories (Keychains, Messages, etc.) but not before partial damage.
- The last pre-delete Time Machine local snapshot was `com.apple.TimeMachine.2026-09-25-193431.local` (19:34, 4 minutes before the delete).
- The last pre-delete network backup was `2026-09-25-182944.backup` (18:29).

### Recovery performed

1. Mounted the 19:34 local snapshot at `/private/tmp/tm-restore` and cloned missing home files back with `cp -cRn` (APFS clone). The 19:34 snapshot was purged by macOS mid-copy due to low disk space (~97% full).
2. Finished from the 18:29 network backup (`/Volumes/.timemachine/.../2026-09-25-182944.backup/...`). Restored `~/code/sdd-dev` and remaining `~/code/Content-Analytics-Agent` files.
3. Restored `~/Library` data from the 18:29 backup: keychain, Messages (`chat.db` 81MB), Safari bookmarks/history, WeChat (3.1GB), Slack, Canva, Notes, Calendar, Contacts, ~270 truncated database files.
4. Overflow on external Sandisk SSD: `~/.colima` (9.2GB) and Cursor `state.vscdb` (11.9GB) — not yet copied back (only ~11GB free on internal disk).
5. Post-19:34 repo files (`src/mcp/local-binary.test.ts`, `specs/mcp/mcp-test.md`) were preserved; they match the 21:48 snapshot byte-for-byte.

### Collateral damage from iCloud re-enrollment

After recovery, the user restarted and signed into iCloud. macOS treated this as a **new device enrollment** (the 18:29 backup predates the per-machine iCloud enrollment state). This caused:

- `~/Desktop` and `~/Documents` recreated as new empty folders. iCloud Desktop & Documents sync is per-device and now OFF. Files exist in `~/Library/Mobile Documents/com~apple~CloudDocs/` but are not mapped to local folders.
- Safari `com.apple.Safari.plist` reset to 95 bytes. `Bookmarks.plist` (5MB) survived.
- `Accounts4.sqlite` rewritten by iCloud. Mail `Accounts4.sqlite` lost all non-iCloud mail accounts.
- 159 preference files rewritten at hour 7.
- Cursor `state.vscdb` is 14.5MB (fresh/default), not the 11.9GB restored copy (on Sandisk).

### Mail accounts status

| Email | In restored DB? | Mail data on disk? | Recoverable? |
| --- | --- | --- | --- |
| `ethanhuang@me.com` (alias of `applecn@ethanhuang.net`) | Yes (type 17 Mail) | Yes | Yes — after restart, password re-entry |
| `applept@ethanhuang.com` | Partial (Calendar/Contacts, no Mail) | No | Calendar yes, Mail needs re-add |
| `huangf79@gmail.com` | No | No | No from backup — re-add manually, IMAP re-downloads |
| `ethanhuangcst@163.com` | No | No | No from backup — re-add manually, IMAP re-downloads |
| `ethanhuang@oncadence.com` | No | No | No from backup — re-add manually, IMAP re-downloads |

## Lesson / guidance

### Root cause — why I made this mistake

1. **I trusted an environment variable to be safely overridden without verifying it.** `$HOME` is controlled by the shell, the OS, and the user. A script that assumes `$HOME` will be overridden is assuming a fact it never checked. When the assumption fails, `rm -rf "$HOME"` destroys the real home.

2. **I used a destructive command (`rm -rf`) without a guard clause.** The script did not verify that the target path was a sandbox before deleting. There was no `case` statement, no path check, no "refuse if this looks like a real home" guard.

3. **I did not dry-run the command first.** I did not `echo rm -rf "$target"` to review the resolved path before executing it. A 2-second review would have shown `$HOME = /Users/ethanhuang`.

4. **I did not verify a backup existed before the destructive operation.** The 19:34 snapshot existed by luck, not by design. If it had not, recovery would have been from the 18:29 network backup or nothing.

5. **I ran destructive logic against the live home directory.** The test should have used a fake home under `/tmp`, set `HOME` explicitly in a subshell, and verified the override took effect before any destructive command.

### How to prevent this — binding rules

1. **Never pass `$HOME`, `$USER`, or any environment variable that can resolve to a real user directory into `rm -rf` or any destructive command.** This is now [ADR-062](../../adr/ADR-062-no-destructive-commands-on-home-derived-paths.md).

2. **Use absolute literal paths to sandbox directories only.** Hard-code `/tmp/sdd-test-$$` in the script. Do not use `$HOME/sandbox` or `$HOME` itself.

3. **Add a guard clause before any `rm -rf`.** Reject if the target is empty, root, a real home, or not under a known sandbox root.

4. **Dry-run first.** `echo rm -rf "$target"` and review the resolved path before running the real command.

5. **Prefer non-destructive alternatives.** Move to trash instead of `rm -rf`. Use `rsync --delete` on a sandbox you created, not on a `$HOME`-derived path.

6. **Verify a backup exists before any destructive operation on user data.** If `tmutil latestbackup` is older than the last user change, stop.

7. **Never test destructive logic against the live home directory.** Create a fake home under `/tmp`, set `HOME` in a subshell, verify it took effect, then run the test.

### Recovery runbook — what worked and what to do differently next time

**What worked:**
- Time Machine local snapshots (`tmutil listlocalsnapshots /`) provided a pre-delete copy within 4 minutes of the incident.
- APFS clone copy (`cp -cRn`) preserved disk space by not duplicating data already on disk.
- The 18:29 network backup provided a fallback when the 19:34 snapshot was purged.
- macOS SIP and TCC protected `~/Library` core subdirectories partially.

**What was painful:**
- The internal disk was ~97% full, so macOS purged the 19:34 snapshot mid-copy. Keeping disk headroom is a prerequisite for snapshot recovery.
- iCloud re-enrollment after restore caused collateral damage (Desktop/Documents, Mail accounts, preferences). Restoring from a pre-incident backup does not restore the per-device iCloud enrollment state.
- Mail account definitions added after 18:29 were lost. IMAP mail data re-downloads from servers, but local-only mail (On My Mac) would be gone.
- The NAS Time Machine share is permission-denied from the terminal without sudo. Network backup access requires either sudo or the Time Machine UI.

**What to do differently next time:**
- Before any destructive test, verify disk headroom (at least 20% free) so snapshots are not purged.
- Before any destructive test, verify a backup exists and is recent.
- After restoring from backup, expect iCloud re-enrollment collateral damage. Re-enable iCloud Desktop & Documents sync manually (System Settings → Apple Account → iCloud → Apps Using iCloud → iCloud Drive → Desktop & Documents Folders).
- Re-add non-iCloud Mail accounts manually after restore. IMAP accounts re-download from servers; local-only mail is lost.
- For network backup access from terminal, use `sudo` or `tmutil` verbs, not direct `ls` on the protected mount point.

## Links

- [ADR-062: No destructive commands on `$HOME`-derived paths](../../adr/ADR-062-no-destructive-commands-on-home-derived-paths.md)
- `specs/knowledge/README.md` — knowledge index
