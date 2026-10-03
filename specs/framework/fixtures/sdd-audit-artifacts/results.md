# Audit fixture results

CodeBuddy CN. Workspace is one case folder. Input is `onboard`. Do not confirm the next step.

| Case | Skill block | Onboard sentence | Note |
| --- | --- | --- | --- |
| CE-AUDIT-01 | Pass | Not in the paste | Block matches. No `locale` line. |
| CE-AUDIT-02 | Pass | Not in the paste | Block matches. No `locale` line. `specs/status.md` opened. |
| CE-AUDIT-03 | Pass | Not in the paste | Block matches. `docs/status.md` was not listed. |
| CE-AUDIT-04 | Pass | Not in the paste | Block matches. `Sprint 1` and `feature-01` were not in the paste. |
| CE-AUDIT-05 | Pass | Fail | Redo. Block matches. `locale` is `empty`. No `Sprint 1` and no `feature-01`. The reply asked to update the project. |
| CE-AUDIT-06 | Pass | Fail | Files and the ledger are unchanged. No `Sprint 1` and no `feature-01`. The reply pointed at `/ethan status`. |
| CE-AUDIT-07 | Pass | Not in the paste | Run before CE-AUDIT-06. Block matches. `specs/sprint-backlog.md` failed. |
| CE-AUDIT-08 | Pass | Fail | Redo after the skill copy. Block matches. The reply says the project is not yet initialized for SDD tracking. The next step in the reply is install/framework setup. Expected: the project is not initialized, and the next step is to start a new project. Ethan did not open `sdd-update-project`. |
| CE-AUDIT-09 | Pass | Pass | Block matches. The reply includes `Sprint 1` and `feature-01`. It also listed jobs and asked which job to run. |
| CE-AUDIT-10 | Pass | Pass | Block matches. `Usable` is not translated. Status text is Simplified Chinese. `Sprint 1` and `feature-01` stay as written. Process files are unchanged. The lines before the block are English, and the reply asked which job to run. |
| CE-AUDIT-11 | Pass | Pass | Block matches. Locale is `HanT`, not `HanS`. Status text is Traditional Chinese. `Sprint 1` and `feature-01` stay as written. Process files are unchanged. The lines before the block are English, and the reply asked which step to start. |
| CE-AUDIT-12 | Pass | Fail | Block matches. No `locale` line. The template map was not opened. The reply does not say the project is not initialized, and it does not say the next step is to start a new project. |
| CE-AUDIT-13 POSIX | Pass | Fail | Redo after the skill copy. Block matches. `specs/status.md` was not opened. The reply says the next step is to update the project and waits before `sdd-update-project`. The reply does not say the index does not match the files. |
| CE-AUDIT-13 Windows | Not observed | Not observed | Closed as Not observed. No further retry. The Windows file still stores `C:\Users\fixture\status.md`. No reply listed that path. |
| CE-AUDIT-14 | Pass | Fail | Redo after the skill copy. Block matches. No `locale` line. `docs/status.md` is not opened. The reply says the next step is to start a new project and waits before `sdd-update-project`. The reply does not say the project is not initialized. |
| CE-AUDIT-15 | Pass | Fail | Latest redo. Block matches. Locale line is `"FR"`. The reply does not include `Sprint 1` or `feature-01`. The reply does not follow `sdd-review-status`. |
| CE-AUDIT-16 | Pass | Pass | Labels are in order. The reply includes `Sprint 1` and `feature-01`. It also asked which job to run. |
| CE-AUDIT-17 | Pass | Fail | Redo with the map unreadable. Block matches. No `locale` line. Process files were not opened. The next step in the reply is to change file permissions and run onboard again. Expected: the index does not match the files, and the next step is to update the project. Read bit restored after the paste. |

Before CE-AUDIT-06, on `CE-AUDIT-05-empty-locale`:

- `artifacts-map.md` `24bc8b86b62ca0a21d661858a94034ea026a427ce13fd72eebd6414269b616e8`
- `specs/status.md` `726589db13a35ce8edeba0ffc48d0f7de7f1cbe595e776b1a3bc31c91b251c70`
- `specs/sprint-backlog.md` `7e4cba3cd7c9058aa369d3dbff225ff27aacbe4c720a2121c4f338aaeb1e8a40`
- `~/.codebuddy/.sdd-installed.json` `3ca28a24c9ab54eec95da86e28b17f1c3cfd9b4917112751c954a753128bad99`, `pack_complete` true

The user confirmed that paste was the CE-AUDIT-07 workspace. It is scored on the CE-AUDIT-07 row. CE-AUDIT-06 is scored. The four hashes above matched after that run.
