# Issues log ([product name])

> This file records defects. A row is opened when a defect is found and stays after it is closed.
> Not the change log. When a fix is concluded, the change log gets its own entry. See [`changes-log.md`](./changes-log.md).
> An open defect is not an OGT row in [`status.md`](./status.md).
> **Practices**: [`sdd-scrum-practices.md`](./sdd-scrum-practices.md) (what, how, when).
> **Framework**: [`scrum-in-sdd.md`](./scrum-in-sdd.md) (names and meaning).

`Id` stays the same when a row is sorted or moves. `Description` is under 3 lines. `Close Check` is shorter. Use bullets when a sentence is not enough. `Related` is a spec id, a link, and the name. `Component` is the part that owns the defect. Use one term for that part in the whole file. `Priority` is `Fatal`, `High`, `Medium`, or `Low`.

The Open table status is `Open`, `Fixed`, or `Deferred`. `Fixed` means a fix exists and the close check is not confirmed. `Deferred` means the defect is accepted and not scheduled. A row moves to Closed issues only when it is `Closed`.

Sort each table by component A to Z, then by time, oldest first. Open uses `Added time`. Closed uses `Closed time`. Write the date as `30/Sep/2026`.

## Open issues

| Id | Title | Component | Priority | Description | Related | Close Check | Status | Added time |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | | |

<!--
Sample row. Delete this comment after the first real defect. Do not copy another product's rows.

| WA-01 | Home is still the logo card | Web-app | High | `/` still shows the logo card. The guide should be the home page. | [Web-portal-09](./product-backlog.md#pb-76) Public landing, footer, reset link, password gate | `e2e/auth.spec.ts` shows the instructions guide on `/` | Open | 30/Sep/2026 |
-->

## Closed issues

| Id | Title | Component | Priority | Description | Related | Close Check | Closed Sprint | Closed time |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | | |
