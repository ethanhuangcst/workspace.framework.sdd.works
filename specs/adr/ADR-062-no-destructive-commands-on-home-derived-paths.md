# ADR-062: No destructive commands on `$HOME`-derived paths

## Status
Accepted

## Context
On 2026-09-25 at 19:38, a debug script executed `rm -rf "$HOME"` against `/Users/ethanhuang` — the real user home directory — because `$HOME` was not overridden to a test sandbox as the script assumed. The command deleted all unprotected files in the home folder before macOS protections stopped it. Recovery from a Time Machine local snapshot (19:34) and a network backup (18:29) took 3.5+ hours and continued beyond, with collateral damage to iCloud enrollment state, Mail accounts, keychain, and app preferences.

The root cause was not a typo or a wrong path literal. It was **trusting an environment variable (`$HOME`) to be safely overridden without verifying it**, then passing that variable to `rm -rf` — a command that destroys first and asks never.

## Decision

**Never pass `$HOME`, `$USER`, or any environment variable that can resolve to a real user directory into `rm -rf` or any destructive command.**

Destructive commands include: `rm -rf`, `rm -r`, `rsync --delete` on a live path, `find ... -delete`, `truncate`, `dd of=...`, `mkfs`, `chmod -R 777` on system paths, and any command that irreversibly modifies or deletes data.

### Rules

1. **Use absolute literal paths to sandbox directories only.** Hard-code the sandbox path in the script (e.g. `/tmp/sdd-test-$$`), not `$HOME/sandbox` or `$HOME` itself.

2. **Add a guard clause before any `rm -rf`.** The script must refuse to run if the target path is a real user home or an empty/undefined path:

   ```bash
   target="/tmp/sdd-test-$$"
   # Guard: reject if target is empty, root, a real home, or not under /tmp
   case "$target" in
     ""|/|"$HOME"|/Users/*|/home/*) echo "refusing to delete $target"; exit 1 ;;
   esac
   # Guard: reject if target is not under a known sandbox root
   case "$target" in
     /tmp/sdd-test-*|/var/folders/sdd-test-*) ;;
     *) echo "target $target not in a sandbox root"; exit 1 ;;
   esac
   rm -rf "$target"
   ```

3. **Prefer non-destructive alternatives.** Move to trash (`trash` CLI, `mv` to a `.trash` dir) instead of `rm -rf`. Use `rsync --delete` on a sandbox directory you created, not on a path derived from `$HOME`.

4. **Dry-run first.** Echo the command before executing it: `echo rm -rf "$target"`. Review the resolved path. Only then run the real command.

5. **Verify a backup exists before any destructive operation on user data.** If `tmutil latestbackup` is older than the last user change, stop.

6. **Never test destructive logic against the live home directory.** If a test needs a fake home, create one under `/tmp` or `/var/folders`, set `HOME` explicitly in a subshell, and verify it took effect before any destructive command:

   ```bash
   (
     export HOME="/tmp/fake-home-$$"
     mkdir -p "$HOME"
     # verify HOME is the fake one
     [ "$HOME" = "/tmp/fake-home-$$" ] || exit 1
     # now safe to run the test
   )
   ```

## Rationale

`$HOME` is an environment variable controlled by the shell, the OS, and the user. A script that assumes `$HOME` will be overridden is assuming a fact it never checked. When the assumption fails — and it will, eventually — `rm -rf "$HOME"` destroys the real home with no confirmation, no trash, and no undo.

Alternatives considered:

- **`rm -rf "$HOME/sandbox"`** — still dangerous. If `$HOME` is the real home, this deletes a real subdirectory. If the sandbox path is wrong, it deletes whatever is there.
- **`rm -rf "$HOME"` with a comment "make sure HOME is overridden"** — this is what failed. Comments do not enforce safety; guards do.
- **`find "$HOME" -delete`** — same risk, slower, still destructive.

Hard-coded sandbox paths with guard clauses are the only approach that fails safe: if the path is wrong, the guard rejects it instead of deleting the wrong thing.

## Consequences

- All scripts in this repo that use `rm -rf` must be audited. Any that reference `$HOME` or `$USER`-derived paths must be rewritten to use hard-coded sandbox paths with guards.
- A pre-commit or CI check should scan for `rm -rf.*\$HOME` and reject it.
- This ADR is referenced from the ops lesson `specs/knowledge/ops/destructive-command-home-deletion-incident.md` which records the full incident, recovery steps, and remaining work.

## Date
2026-09-26
