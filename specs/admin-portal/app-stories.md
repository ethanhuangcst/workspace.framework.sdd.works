# framework.sdd.works — Admin portal user stories

Operator web app at `framework.sdd.works`. Stories and ACs for the **app**. MCP tools live in [`mcp-stories.md`](../mcp/mcp-stories.md). Design: [`app-design.md`](./app-design.md). Mockups: [`ui-mockup/`](./ui-mockup/). Phase 1 backlog: [`r1-product-backlog.md`](../phase1-process-specs/r1-product-backlog.md). Phase 2 backlog: [`product-backlog.md`](../product-backlog.md).

**Phase 2 upcoming (no Gherkin yet):** [Web-portal-06](../product-backlog.md#L372) will update the Instructions page for full-repo install, templates, process skills, and coach-ethan. Acceptance scenarios are written when that story starts.

**Locales:** `en` (default), `zh-Hans`, `zh-Hant`. User-facing copy is i18n keys. Tests assert keys / `data-testid` / roles, not one language’s sentences. Protocol ids (`framework.sdd.works`, tool names, locale codes) are not localized.

**Roles:** Visitor, Admin, Operator, Invitee.

**Default Given:** unless stated, the admin exists, password is set, and the session is valid.

---

## `sdd-admin-home` — Public home

Public landing is the instructions guide. Labels and controls use i18n keys (`sdd-admin-i18n`). [Web-portal-09](../product-backlog.md#L430).

### User story 1 — `/` shows the instructions guide

**As a** visitor
**I want** the site root to be the MCP instructions page
**So that** I can connect an agent without finding a separate home card

#### AC1 — Web-portal-09 / WA-01

```gherkin
Scenario: Public root is the instructions guide
  Given the visitor is not signed in
  When the visitor opens /
  Then the guide with test id instructions-guide is shown
  And the Setup and Features tabs are shown
  And the logo-card controls admin-home-instructions and admin-login are not shown
```

### User story 2 — Footer stays fixed

**As a** visitor or admin
**I want** the site footer fixed to the bottom of the viewport
**So that** copyright and Admin portal stay visible while I scroll

#### AC1 — Web-portal-09 / WA-02

```gherkin
Scenario: Footer is fixed on public and admin shells
  Given the visitor is on / or /login or a signed-in admin page
  When the page content is taller than the viewport
  Then the site-footer stays visible at the bottom of the viewport
  And main content is not covered by the footer
```

---

## `sdd-admin-seed` — Default admin from env

First admin account is created by seed from operator-owned env. Email is fixed; password comes from `.env.local` / Portainer. (SEED-01 · Sprint 2)

### User story 1 — Seed default admin with env password

**As an** operator
**I want** the default admin seeded with email `me@ethanhuang.com` and a password from env
**So that** I can sign in after `make up` without a blank-password bootstrap

#### AC1

```gherkin
Scenario: Seed creates default admin from env
  Given ADMIN_SEED_PASSWORD is set to a non-empty value in the operator env
  When the operator runs the database seed
  Then an ACTIVE admin exists with email "me@ethanhuang.com"
  And that admin has username "admin"
  And that admin has a non-empty password hash
  And the plaintext password is not stored in the database
```

#### AC2

```gherkin
Scenario: Seed fails when env password is missing
  Given ADMIN_SEED_PASSWORD is missing or blank
  When the operator runs the database seed
  Then the seed exits with failure
  And no new default admin is created from an empty password
```

#### AC3

```gherkin
Scenario: Re-seed refreshes password from env
  Given an admin already exists with email "me@ethanhuang.com"
  And ADMIN_SEED_PASSWORD is set to a new non-empty value
  When the operator runs the database seed
  Then that admin can sign in with the new env password
  And the previous password no longer authenticates
```

### User story 2 — Operator signs in with seeded credentials

**As an** operator
**I want** to sign in with the seeded email and env password
**So that** I can reach the admin portal after seed

#### AC1

```gherkin
Scenario: Sign in with seeded env password
  Given the default admin was seeded with ADMIN_SEED_PASSWORD
  When the operator signs in with email "me@ethanhuang.com" and that password
  Then the operator reaches the signed-in landing
  And a session is established
```

---

## `sdd-admin-login` — Admin login

Email + password. Session cookie is httpOnly, SameSite, Secure in production. CSRF-safe. Not rate-limited. (ACCT-01)

### User story 1 — Sign in with email and password

**As an** admin
**I want** to sign in with email and password
**So that** I can reach the signed-in landing

#### AC1

```gherkin
Scenario: Sign in with correct email and password
  Given an admin exists with email "me@ethanhuang.com" and a non-empty password
  When the admin signs in with that email and the correct password
  Then the admin reaches the signed-in landing
  And a session is established
```

#### AC2

```gherkin
Scenario: Sign in with wrong password
  Given an admin exists with email "me@ethanhuang.com"
  When the admin signs in with that email and a wrong password
  Then the result key is errors.login_failed
  And the admin does not reach the landing
  And no session is established
```

#### AC3

```gherkin
Scenario: Seeded default admin does not use blank-password bootstrap
  Given the default admin was seeded with ADMIN_SEED_PASSWORD
  When the operator signs in with email "me@ethanhuang.com" and a blank password
  Then the result key is errors.login_failed
  And no session is established for blank password against a hashed account
```

### User story 2 — Public registration is closed

**As a** visitor
**I want** a clear notice that open registration is closed
**So that** I do not expect to create an account myself

#### AC1

```gherkin
Scenario: Visitor cannot self-register
  Given the visitor is on the sign-in page
  When the visitor looks for a new-user registration control
  Then registration is not available
  And the notice register-disabled is shown
  And the notice is composed from admin.register.disabled_prefix, admin.register.contact_admin, and admin.register.disabled_suffix
```

---

## `sdd-admin-password-reset` — Password reset

Request reset by email (Resend). Hashed, expiring, single-use token. Rate-limited. (ACCT-02)

### User story 1 — Request reset mail

**As an** admin
**I want** to request a password reset and receive mail via Resend
**So that** I can regain access without another person setting my password

#### AC1

```gherkin
Scenario: Reset mail is sent
  Given an admin exists with email "me@ethanhuang.com"
  And Resend is configured
  When the admin requests a password reset for that email
  Then a reset mail is sent via Resend
  And the mail body uses i18n keys
  And the mail contains an absolute set-password URL
```

#### AC2

```gherkin
Scenario: Resend cannot send
  Given Resend cannot send mail
  When the admin requests a password reset
  Then a keyed error is shown
  And the password is unchanged
```

#### AC3 — Web-portal-09 / WA-03

```gherkin
Scenario: After reset mail is sent the link is Back to login
  Given the visitor is on /reset-password
  When the visitor submits a valid admin email and the success callout is shown
  Then the back link uses key admin.common.back_login
  And that link goes to /login
```

#### AC4 — Web-portal-10 / WA-05

```gherkin
Scenario: Reset submit stays on the page with a success callout
  Given the visitor is on /reset-password
  And Resend is configured or the E2E capture file path is set
  When the visitor submits a valid admin email
  Then the document stays on /reset-password without a full reload
  And the success callout uses key admin.reset.sent
  And the email form is hidden
```

#### AC4b — Web-portal-11 / WA-08 / WA-10

```gherkin
Scenario: Reset success callout uses the previous sentence
  Given the visitor is on /reset-password
  And Resend is configured or E2E_SKIP_MAIL=1 with a capture file
  When the visitor submits email "e2e-admin@ethanhuang.com"
  Then the document stays on /reset-password with no email query string
  And the success callout uses key admin.reset.sent
  And in locale en the callout text is If that email is an admin account, a reset mail is on its way. Check inbox and junk.
  And the callout does not interpolate the submitted address
  And the request lead admin.reset.lead is hidden
  And the email form is hidden
  And the back link is Back to login
```

#### AC5 — Web-portal-10 / WA-05

```gherkin
Scenario: Failed reset request shows a keyed error and keeps the form
  Given the visitor is on /reset-password
  When the visitor submits and the reset request fails
  Then a keyed error is shown (errors.reset_mail_send_failed or the API error key)
  And the email form remains
  And the document stays on /reset-password
```

#### AC6 — Web-portal-10 / WA-05

```gherkin
Scenario: Unknown email still shows the success callout
  Given the visitor is on /reset-password
  When the visitor submits an email that is not an admin account
  Then the success callout uses key admin.reset.sent
  And no account existence is revealed
```

### User story 2 — Set password from reset link

**As an** admin with a valid reset token
**I want** to set a new password
**So that** I can sign in again

#### AC1

```gherkin
Scenario: Valid reset token sets a new password
  Given a valid unused reset token for "me@ethanhuang.com"
  When the admin submits matching new and confirm passwords
  Then the password is saved
  And the token cannot be reused
  And credentials do not appear in the browser URL
```

#### AC2

```gherkin
Scenario: Expired or used reset token
  Given an expired or already used reset token
  When the admin opens the set-password link
  Then the result keys include errors.reset_link_expired_title
  And the password form cannot be submitted
```

### User story 3 — Empty password gate

**As an** admin with an empty password
**I want** to be required to set a password before using the app
**So that** no one uses the portal with an empty password

#### AC1

```gherkin
Scenario: Empty password blocks the landing
  Given an admin account exists with an empty password
  When that admin tries to use the signed-in app
  Then the admin must set a password before the landing is available
  And the result key is errors.password_required until the password is set
```

#### AC2 — Web-portal-09 / WA-04

```gherkin
Scenario: Account with a password is not trapped on empty-account set-password
  Given an admin account exists with a non-empty passwordHash
  When that admin opens /set-password without a reset token
  Then the empty-account lead admin.set_password.lead is not shown
  And the visitor is redirected to /login or /admin/keys
  When that admin signs in with the correct password
  Then /admin/keys is available
```

#### AC3 — Web-portal-09 / WA-04

```gherkin
Scenario: Empty-hash account still sees the empty-account lead
  Given an admin account exists with an empty passwordHash
  When that admin reaches /set-password without a reset token
  Then the lead admin.set_password.lead is shown
  And the set-password form can be submitted
```

---

## `sdd-admin-invite` — Invite admin

Invite by email via Resend. Invitee completes profile + password at `/accept-invite`. Token is single-use. (ACCT-03)

### User story 1 — Invite by email

**As an** admin
**I want** to invite another admin by email
**So that** they can join without public registration

#### AC1

```gherkin
Scenario: Invite mail links to accept-invite
  Given a signed-in admin
  And Resend is configured
  When the admin invites "new.admin@example.com"
  Then an invite mail is sent via Resend
  And the mail contains an absolute accept-invite URL with a token query parameter
  And the URL path is /accept-invite
  And the invitee cannot use the app before completing onboarding
```

#### AC2

```gherkin
Scenario: Invitee sets profile and password
  Given a valid invite token for "new.admin@example.com"
  When the invitee opens the accept-invite link
  Then name, username, password, and confirm-password fields are shown
  And the invited email is shown as context
  When they submit matching passwords and a valid unique username
  Then the account is activated
  And they see a success state with a sign-in action
  And the invite token cannot be reused
```

#### AC3

```gherkin
Scenario: Expired or used invite token
  Given an expired or already used invite token
  When the invitee opens the accept-invite link
  Then a keyed expired-invite notice is shown
  And the profile form cannot be submitted
```

---

## `sdd-admin-accounts` — Admin accounts

List ACTIVE admins + pending invites; delete with confirm. Cannot delete self or last ACTIVE admin. Soft-deactivate UI deferred. (ACCT-03)

### User story 1 — List admins

**As an** admin
**I want** to see admin accounts
**So that** I know who can operate the portal

#### AC1

```gherkin
Scenario: Signed-in admin sees the accounts list
  Given a signed-in admin
  And at least one admin account exists
  When the admin opens the accounts page
  Then the accounts table is shown
  And each row includes email and status
```

### User story 2 — Delete another admin or pending invite

**As an** admin
**I want** to delete another admin or a pending invite after confirm
**So that** access can be revoked

#### AC1

```gherkin
Scenario: Confirm delete of another admin
  Given a signed-in admin
  And at least one other admin or pending invite exists
  When the signed-in admin chooses delete on that other row
  And confirms delete
  Then that account is removed from the list
```

#### AC2

```gherkin
Scenario: Admin cannot delete self
  Given a signed-in admin views the accounts list
  When the admin looks for a delete control on their own row
  Then their own row does not offer delete
  And an API attempt to delete their own id returns errors.cannot_delete_self
```

#### AC3

```gherkin
Scenario: Last admin cannot be deleted
  Given the system has exactly one admin account
  When an operator attempts to delete that admin
  Then the delete that would leave zero admins does not proceed
  And errors.cannot_delete_last_admin is applied
```

---

## `sdd-admin-landing` — Signed-in shell

Left nav: Keys, Settings, Framework, Admins. Header: hello, instructions, locale.

### User story 1 — Landing after sign-in

**As an** admin
**I want** a signed-in shell with navigation and greeting
**So that** I can reach Keys, Settings, Framework, and Admins

#### AC1

```gherkin
Scenario: Signed-in shell shows nav and hello
  Given a signed-in admin named "admin"
  When the admin is on a signed-in page
  Then nav items with keys admin.nav.keys, admin.nav.settings, admin.nav.framework, and admin.nav.admins are available
  And the hello control uses key admin.landing.hello
  And the instructions link with key admin.landing.instructions_link is available
  And that instructions link opens in a new browsing context
  And sign-out with key admin.nav.sign_out is available
```

#### AC2

```gherkin
Scenario: Unauthenticated visitor is sent to sign-in
  Given the visitor is not signed in
  When the visitor opens /admin/keys
  Then the visitor is sent to the sign-in page
  And no key values are shown
```

---

## `sdd-admin-keys` — Keys CRUD

Store `key_id` (UUID), `key_name`, `key_description`, and `key_value`. Unique English `key_name`. List shows name, description, and value. Copy / edit / delete — no regenerate. (KEYS-01)

### User story 1 — Create a key

**As an** admin
**I want** to save a named key with a description and a pasted value
**So that** MCP callers can resolve it with `sdd_get_key`

#### AC1

```gherkin
Scenario: Create key with English name, description, and value
  Given a signed-in admin
  When the admin creates a key with name "cursor-prod", a description, and a pasted key_value
  Then the system assigns a key_id
  And key_name, key_description, and key_value are stored
  And key_name is unique
```

#### AC2

```gherkin
Scenario: Duplicate key name is rejected
  Given a signed-in admin
  And a key named "cursor-prod" already exists
  When the admin creates another key named "cursor-prod"
  Then the create does not succeed
  And the result key is errors.key_name_taken
```

#### AC3

```gherkin
Scenario: Non-English key name is rejected
  Given a signed-in admin
  When the admin creates a key with a name that is not English letters, digits, underscore, or hyphen
  Then the create does not succeed
  And the result key is errors.key_name_invalid
```

### User story 2 — List and copy

**As an** admin
**I want** to see name, description, and key value on the list and copy the value
**So that** I can manage secrets without leaving the Keys page

#### AC1

```gherkin
Scenario: Keys list shows name, description, and value
  Given a signed-in admin
  And a stored key named "cursor-prod" exists with a description and value
  When the admin opens the keys page
  Then the row shows the key name, description, and key value
  And regenerate is not offered
```

#### AC2

```gherkin
Scenario: List copy writes the value to the clipboard
  Given a signed-in admin
  And a stored key named "cursor-prod" exists
  When the admin activates Copy on that row (admin.keys.copy_list)
  Then the full key_value is written to the clipboard
  And the control briefly shows admin.common.copied
```

#### AC3

```gherkin
Scenario: Empty keys list
  Given a signed-in admin
  And no keys exist
  When the admin opens the keys page
  Then the empty state with key admin.keys.empty is shown
```

### User story 3 — Edit and delete

**As an** admin
**I want** to edit name, description, or value, or delete a key after confirm
**So that** I can keep the store accurate and revoke unused keys

#### AC1

```gherkin
Scenario: Edit key fields
  Given a signed-in admin
  And a key named "cursor-prod" exists
  When the admin saves name "cursor-staging", an updated description, and an updated key_value
  Then the list shows the new name, description, and value
```

#### AC2

```gherkin
Scenario: Confirm delete key
  Given a signed-in admin
  And a key named "cursor-prod" exists
  When the admin confirms delete
  Then the key is removed from the list
  And sdd_get_key for that name returns not_found
```

#### AC3

```gherkin
Scenario: Unauthenticated request does not reveal key values
  Given the visitor is not signed in
  When the visitor requests the keys list
  Then no key values are returned
```

---

## `sdd-admin-settings` — GitHub repository URL

Single GitHub repository URL for the framework sync view. (SETT-01)

### User story 1 — Set the sync repository

**As an** admin
**I want** to save one GitHub repository URL
**So that** the framework page syncs from the repo I choose

#### AC1

```gherkin
Scenario: Save stays disabled when the URL is unchanged
  Given a signed-in admin
  And Settings shows the currently stored GitHub repository URL
  When the admin views the Settings page without changing the URL
  Then the save action is unavailable
```

#### AC2

```gherkin
Scenario: Save becomes available after the URL changes
  Given a signed-in admin
  And Settings shows the currently stored GitHub repository URL
  When the admin edits the URL to a different value
  Then the save action is available
```

#### AC3

```gherkin
Scenario: Save a reachable GitHub repository URL
  Given a signed-in admin
  And the admin has changed the repository URL
  And the new URL points to a reachable GitHub repository
  When the admin saves
  Then the system verifies the repository is reachable
  And a success tip is shown
  And the URL is stored
  And the framework page uses that URL for sync
```

#### AC4

```gherkin
Scenario: Reject unreachable GitHub repository
  Given a signed-in admin
  And the admin has changed the repository URL
  And the new URL cannot be reached as a GitHub repository
  When the admin saves
  Then a failure tip is shown
  And the stored URL is not changed
  And the result key is errors.settings_url_unreachable
```

#### AC5

```gherkin
Scenario: Reject malformed or non-GitHub URL
  Given a signed-in admin
  And the admin has changed the repository URL to a value that is not a GitHub repository URL
  When the admin saves
  Then the save does not succeed
  And the stored URL is not changed
  And the result key is errors.settings_url_invalid
```

---

## `sdd-admin-framework` — Framework live view

Read-only, near-real-time GitHub tree/file view from Settings. (FRMW-01)

### User story 1 — View synced framework contents

**As an** admin
**I want** a read-only live view of the configured GitHub repository
**So that** I can inspect SDD assets without editing them in the portal

#### AC1

```gherkin
Scenario: Framework page shows tree from Settings
  Given a signed-in admin
  And Settings contains a reachable GitHub repository URL
  When the admin opens the framework page
  Then a read-only tree or file list from that repository is shown
  And no edit or push control is available
```

#### AC2

```gherkin
Scenario: Sync failure does not blank the shell
  Given a signed-in admin
  And GitHub sync fails
  When the admin opens the framework page
  Then a keyed sync error is shown
  And the signed-in shell remains visible
```

#### AC3

```gherkin
Scenario: No GitHub link configured
  Given a signed-in admin
  And Settings has no repository URL
  When the admin opens the framework page
  Then an empty state with key admin.framework.empty is shown
  And the empty state points the admin to Settings
```

### User story 2 — Inspect local synced artifact tree (FRMW-02)

**As an** admin
**I want** the framework page to list folders and files from the local sync cache
**So that** I see the same package the MCP install API serves without live GitHub calls

#### AC4

```gherkin
Scenario: Tree expands one level by default
  Given a signed-in admin
  And Settings contains a reachable GitHub repository URL
  And the SYNK-01 package cache is populated
  When the admin opens the framework page
  Then top-level artifact folders (Agents, Rules, Skills, Workflows) are shown as title-case labels
  And each top-level folder is expanded to show immediate children indented beneath it
  And deeper nested folders remain collapsed until toggled
  And within each folder, child directories are listed before files, each group sorted by name
```

#### AC4b

```gherkin
Scenario: Skill folders list before README at skills root
  Given a signed-in admin
  And the SYNK-01 package cache includes skills with multiple skill folders and a README.md file
  When the admin opens the framework page
  Then every skill folder name appears above README.md under Skills
```

#### AC5

```gherkin
Scenario: Force sync refreshes tree from cache
  Given a signed-in admin
  And Settings contains a reachable GitHub repository URL
  When the admin clicks Sync with git repository
  Then POST /api/admin/sync is called with force true
  And the artifact tree reloads from the unpacked cache
```

### User story 3 — Pack file operator note (Web-portal-26)

**As an** admin maintaining the synced pack repository
**I want** to read the operator markdown from the Framework page
**So that** I know which files belong in the pack without opening Settings or the repo blindly

#### AC39 — Web-portal-26

```gherkin
Scenario: Admin note opens beside sync control
  Given a signed-in admin on the framework page
  And the repo block is visible
  When the admin activates Admin note next to Sync with git repository
  Then a modal with test id framework-admin-note-dialog is shown
  And the modal contains an element with class floating-frame
  And the body with test id framework-admin-note-body has classes guide-section, guide-md-body, and guide-md-body--prose
  And the body renders HTML from content/.admin-note.md when the sync cache has that file
  And a Close control with test id framework-admin-note-close is the only modal action
  And no edit or push control appears in the modal
```

#### AC40 — Web-portal-26

```gherkin
Scenario: Admin note uses bundled seed when cache file is absent
  Given a signed-in admin
  And the unpacked cache has no content/.admin-note.md
  When the admin opens Admin note
  Then the modal body matches src/content/.admin-note.md rendered as HTML
  And the API or resolver reports source package
```

#### AC41 — Web-portal-26

```gherkin
Scenario: Admin note is admin-only
  Given a visitor without an admin session
  When GET /api/admin/admin-note is requested
  Then the response is unauthorized
  And public instructions pages do not show Admin note
```

#### AC42 — Web-portal-26

```gherkin
Scenario: Close dismisses admin note
  Given a signed-in admin
  And the admin note modal is open
  When the admin activates Close or presses Escape
  Then the modal is hidden
  And focus returns to the Admin note control
```

#### AC43 — Web-portal-26

```gherkin
Scenario: Admin note file fences use codeblock with copy
  Given a signed-in admin
  And the admin note modal is open
  And the note markdown includes a fenced json block
  Then framework-admin-note-body contains an element with classes codeblock and codeblock--file
  And that block exposes a copy control for the fence contents
  And the rendered pre text keeps the same line indent as the markdown source fence
```

**Engineering:** [`app-design.md`](./app-design.md) Framework **Admin note** and **Technical design — Admin note**. Mockup [`12-framework.html`](./ui-mockup/12-framework.html) confirmed 2026-10-08 (`?admin-note=1`). Literal English **Admin note** and **Close** (no i18n keys for those labels).

---

## `sdd-admin-instructions` — MCP instructions

How to connect MCP clients. Public and signed-in entries. Feature-10 owns the page layout. Sprint 3 feature-04 owns the secret form chrome. Feature-05 owns the lookup and showing a value or not-found. Feature-07 owns the catalog body. Feature-17 ([ADR-067](../adr/ADR-067-get-secret-on-setup.md)) moved the form to Setup; [ADR-115](../adr/ADR-115-get-secret-on-learn-tab.md) moves it to the Learn Scrum tab (**AC31**). AC6, AC7, AC8, and the Features placement line in AC14 stay as the record of what shipped on Features before feature-17. AC17 is historical Setup placement only. AC18 is the guide tab before configurable tabs ([Web-portal-25](../product-backlog.md#L400), feature-60). Sprint 8 feature-53 and feature-55–57 cover lite manifest seed, lite file links API, lite client receipt spec ([Spec-seeds-18](../product-backlog.md#L482)), lite install prompt, and lite one-line copy. Sprint 8 feature-58–60 cover pack `.instructions-tabs.json`, the config API, and dynamic tab UI. Sprint 9 **feature-74** / [Web-portal-36](../product-backlog.md#pb-133) adds **`internal_page_folder`** ([ADR-124](../adr/ADR-124-internal-page-folder-index-json.md)); **AC38**.

### User story 1 — Read instructions

**As a** visitor or admin
**I want** instructions for connecting to framework.sdd.works over MCP
**So that** I can configure Cursor, Chatbox, or another client

#### AC1 — feature-10

```gherkin
Scenario: Public instructions are reachable from home
  Given the visitor is not signed in
  When the visitor opens instructions from home in a new browsing context
  Then the guide with key admin.guide.title is shown
  And the protocol id framework.sdd.works is shown as a literal
  And there is no back-home control
  And the Setup and Features tabs are shown
  And the agents roster with test id guide-agents lists Claude Code, Codex, Cursor, CodeBuddy CN / CodeBuddy / WorkBuddy CN, TraeCode CN / TRAE, GitHub Copilot, and AWS Kiro in that order
```

#### AC2

```gherkin
Scenario: Signed-in instructions open from the header
  Given a signed-in admin
  When the admin opens instructions from the header in a new browsing context
  Then the guide with key admin.guide.title is shown
```

#### AC3 — feature-11, superseded by AC21 (feature-56 / Web-portal-18 Part 2)

Shipped the one-line fetch for `GET /setup`. After [feature-56](../sprint-backlog.md#sprint-8), assert AC21 for the lite install URL (`GET /setup/install`).

```gherkin
Scenario: Setup copy is the one-line fetch prompt
  Given the visitor opens instructions
  When the visitor uses the setup copy control
  Then the copied text is Fetch and execute the setup instructions from https://sdd.works/setup
  And the setup label uses an i18n key
```

#### AC4 — feature-12, superseded by AC36 ([ADR-122](../adr/ADR-122-instructions-guide-hero-and-setup-tab.md))

Do not assert on-page Manual setup or Tools after Web-portal-35 ships.

```gherkin
Scenario: Manual setup shows one mcp.json
  Given the visitor opens instructions
  Then manual setup shows one mcp.json
  And that sample uses command ${userHome}/.sdd/sdd-mcp
  And that sample sets SDD_SERVER_URL to https://sdd.works
  And the page does not show a second mcp.json
  And the page does not show curl -fsSL https://sdd.works/install
```

#### AC5 — feature-10, superseded by AC12 (feature-07)

The fixed Agents, Skills, Rules, and Templates lists shipped with the page redesign. Feature-07 replaces that body. Do not assert those fixed names after feature-07.

```gherkin
Scenario: Features tab lists fixed catalog rows
  Given the visitor opens instructions
  When the visitor selects the Features tab
  Then Agents lists ethan
  And Skills lists sdd-atdd, sdd-update-project, sdd-refine-backlog, sdd-plan-sprint, sdd-tracking, sdd-retrospective, sdd-close-sprint, sdd-audit-artifacts, sdd-update-specs, and sdd-spec-to-build
  And Rules lists sdd-dod.mdc, sdd-incremental-delivery.mdc, sdd-realtime-status.mdc, and friendly-language.mdc
  And Templates lists product-backlog.md, sprint-backlog.md, status.md, changes-log.md, artifacts-map.json, architecture.md, release.md, test-strategy.md, and issues-log.md
  And each row shows a one-sentence summary from an i18n key
```

#### AC5b — Web-portal-10 / WA-06

```gherkin
Scenario: Features tab switches the panel and is the hit target
  Given the visitor opens / or /instructions
  When the visitor activates guide-tab-features
  Then guide-tab-features has aria-selected true
  And panel-features is shown
  And the element at the center of guide-tab-features is that control
  When the visitor activates guide-tab-setup
  Then panel-features is hidden
```

#### AC6 — feature-10

```gherkin
Scenario: Secret form is visible on Features
  Given the visitor opens the Features tab
  Then the secret name field and Get secret button are shown
  And the Setup tab panel does not contain test id secret-lookup
```

#### AC7 — feature-04

```gherkin
Scenario: Secret form sits after the catalog with three locale strings
  Given the visitor opens instructions
  When the visitor selects the Features tab
  Then the control with test id secret-lookup is after features-body
  And the input with test id secret-name has placeholder key admin.guide.secret_hint
  And the button with test id secret-get has label key admin.guide.secret_button
  And in locale en the placeholder is Enter the name of the secret, example: sdd-trial-googlemaps
  And in locale en the button label is Get secret
  And in locale zh-Hans the placeholder is 输入要获得的密钥名称，例如：sdd-trial-googlemaps
  And in locale zh-Hans the button label is 获取密钥
  And in locale zh-Hant the placeholder is 輸入要取得的密鑰名稱，例如：sdd-trial-googlemaps
  And in locale zh-Hant the button label is 獲取密鑰
  And the Setup tab panel does not contain test id secret-lookup
```

#### AC8 — feature-05 / WA-09

```gherkin
Scenario: Get secret stays on Features
  Given the visitor is on / or /instructions with the Features tab open
  When the visitor activates Get secret with a non-empty name
  Then the URL keeps tab=features
  And panel-features stays shown
  And the viewport stays on #features-secret
  And the document does not navigate to the Setup panel
```

#### AC9 — feature-05 / WA-09 / WA-11

```gherkin
Scenario: Known secret name shows the value in a code block with copy
  Given a key named "sdd-trial-googlemaps" exists in the admin key store
  And the visitor is on the Features tab
  When the visitor enters that exact name and activates Get secret
  Then test id secret-result is a code block that shows only that key's plaintext value
  And secret-result includes a copy control
  And secret-result width matches the secret-lookup row (name input plus Get secret button)
  And secret-result is scrolled into view
  And no other key names or values are shown
  And secret-error is not shown
```

#### AC10 — feature-05 / WA-09 / WA-11

```gherkin
Scenario: Unknown secret name shows not found in view
  Given no key named "add-trail-googlemaps" exists
  And the visitor is on the Features tab
  When the visitor enters that name and activates Get secret
  Then secret-error uses key admin.guide.secret_missing
  And secret-error is scrolled into view
  And secret-error width matches the secret-lookup row
  And secret-result is empty or hidden
  And no other key values are shown
```

#### AC11 — feature-05 / WA-09

```gherkin
Scenario: Empty secret name does not call the API
  Given the visitor is on the Features tab
  When the visitor activates Get secret with an empty name
  Then secret-error uses key admin.guide.secret_empty
  And the page does not call the secret lookup API
  And secret-result is empty or hidden
```

#### AC12 — feature-07

```gherkin
Scenario: Features body comes from the synced file for the active locale
  Given the latest sync cache contains content/features/features.en.md and content/features/features.zh-Hans.md
  And features.en.md contains the heading "Version info"
  And features.zh-Hans.md contains the heading "版本信息"
  When the visitor opens / or /instructions in locale en and selects the Features tab
  Then features-body shows Version info
  And features-body does not require Agents, Skills, Rules, or Templates headings
  When the visitor switches to locale zh-Hans and opens the Features tab again
  Then features-body shows 版本信息
  And the Setup tab is unchanged
```

#### AC13 — feature-07

```gherkin
Scenario: A missing Chinese file shows the English file
  Given the latest sync cache contains content/features/features.en.md
  And the cache does not contain content/features/features.zh-Hant.md
  When the visitor opens the Features tab in locale zh-Hant
  Then features-body shows the English file from the sync cache
```

#### AC14 — feature-07

```gherkin
Scenario: A missing sync cache shows the package file
  Given the sync cache has no features markdown
  And src/content/features/features.en.md contains the heading "Package copy"
  When the visitor opens the Features tab in locale en
  Then features-body shows Package copy
  And the old fixed Agents, Skills, Rules, and Templates lists are not shown
  And the Setup tab still shows the setup copy control
  And secret-lookup is still shown on the Features tab
```

#### AC15 — feature-07

```gherkin
Scenario: Raw HTML in the catalog file is not executed
  Given features.en.md contains a script tag and a javascript link
  When the visitor opens the Features tab in locale en
  Then the page does not run that script
  And the link is not a javascript URL
```

#### AC16 — feature-07

```gherkin
Scenario: A failed sync still shows the previous file
  Given the cache already has features.en.md
  And a later sync fails
  When the visitor opens the Features tab in locale en
  Then features-body still shows the previous file
```

#### AC17 — feature-17 / ADR-067 (historical; placement superseded by AC31 / ADR-115)

```gherkin
Scenario: Get secret sat at the bottom of Setup before ADR-115
  Given the visitor opens / or /instructions
  When the visitor selects the Setup tab
  Then secret-lookup was after the tools table
  And the section id was setup-secret
```

#### AC31 — feature-73 / Web-portal-31 / ADR-115

[ADR-115](../adr/ADR-115-get-secret-on-learn-tab.md). Lookup rules match feature-05 and ADR-067 item 3. No new i18n keys.

```gherkin
Scenario: Get secret sits on Learn Scrum below fallback link
  Given the visitor opens / or /instructions with tab=learn-scrum-in-sdd
  When the Learn Scrum panel is shown
  Then learn-scrum-iframe is before the link with admin.guide.learn_scrum_open_external
  And the fallback link is before secret-lookup in document order
  And the panel does not show admin.guide.learn_scrum_intro
  And the section id is learn-secret
  And panel-setup does not contain secret-lookup
  And panel-features does not contain secret-lookup
  And the placeholder and button keys stay admin.guide.secret_hint and admin.guide.secret_button

Scenario: Get secret stays on Learn Scrum after lookup
  Given the visitor is on / or /instructions with tab=learn-scrum-in-sdd
  When the visitor activates Get secret with a non-empty name
  Then the URL keeps tab=learn-scrum-in-sdd
  And panel-learn-scrum stays shown
  And the viewport stays on #learn-secret

Scenario: Known secret on Learn tab matches feature-05 behavior
  Given a key named "sdd-trial-googlemaps" exists in the admin key store
  And the visitor is on tab=learn-scrum-in-sdd
  When the visitor enters that exact name and activates Get secret
  Then test id secret-result is a code block that shows only that key's plaintext value
  And secret-result is scrolled into view below the sticky guide header when present
  And secret-error is not shown

Scenario: Unknown and empty secret names on Learn tab
  Given the visitor is on tab=learn-scrum-in-sdd
  When the visitor enters a name that does not exist and activates Get secret
  Then secret-error uses key admin.guide.secret_missing
  When the visitor activates Get secret with an empty name
  Then secret-error uses key admin.guide.secret_empty
  And the page does not call the secret lookup API
```

#### AC18 — feature-16 / Web-portal-12, superseded by AC24 (feature-60) for tab order and labels

Fixed Setup, Features, Scrum in SDD shipped before pack-driven tabs. After feature-60, assert AC24 for tab order from the config API while Setup stays first.

```gherkin
Scenario: Scrum in SDD tab reads the guide markdown
  Given the visitor opens / or /instructions
  Then the tab order is Setup, Features, Scrum in SDD
  And the Scrum in SDD label is admin.guide.tab_scrum with string Scrum in SDD in en, zh-Hans, and zh-Hant
  When the visitor selects the Scrum in SDD tab
  Then the URL sets tab=scrum-in-sdd
  And panel-scrum shows the rendered body of scrum-in-sdd for the active locale
  And the Features em-dash name/description split is not applied
  And secret-lookup is not in panel-scrum
  And Setup and Features still switch

Scenario: Guide locale falls back inside one source
  Given the chosen source has scrum-in-sdd.en.md and no scrum-in-sdd.zh-Hant.md
  When the visitor opens the Scrum in SDD tab in locale zh-Hant
  Then panel-scrum shows the English guide
  And sourceLocale is en

Scenario: Guide prefers the sync unpack
  Given the latest unpack has scrum-in-sdd.en.md
  When the visitor opens the Scrum in SDD tab in locale en
  Then the body is from the unpack with source cache
  When the unpack has no English guide
  Then the body is from src/content/scrum-in-sdd with source package

Scenario: Install omits the portal guide files
  Given a pack contains content/scrum-in-sdd/scrum-in-sdd.en.md, scrum-in-sdd.zh-Hans.md, and scrum-in-sdd.zh-Hant.md
  When install runs
  Then those three files are not on {client_root}
  And they are not listed in .sdd-installed.json
```

### User story 2 — Lite install of listed skills and rules

**As a** visitor
**I want** lite install instructions from the public site
**So that** I can copy listed pack skills and rules without the full MCP install

[Web-portal-18](../product-backlog.md#L488) delivers two parts: **AC20** (public agent markdown at `GET /setup/install`) and **AC21** (Setup copy control for that URL). Sprint SBI [feature-56](../sprint-backlog.md#sprint-8) covers both; the PBI is **Done** only when AC20 and AC21 pass.

#### AC19 — feature-55 / Web-portal-17

Public HTTP only. No admin session. The list route matches [Spec-seeds-18](../product-backlog.md#L482) server list fields (`package_version`, `package_commit`, combined `files`).

```gherkin
Scenario: Lite file list returns same-origin links for allow-listed paths
  Given the sync cache latest unpack includes lite-pack.allowlist.json at the pack root
  And that file lists valid sorted skill and rule paths that exist as files under the unpack
  When GET /api/sdd/lite/files is called with no version query or with version=latest
  Then the response status is 200
  And the body includes package_version and package_commit from the sync manifest
  And the body includes files as a sorted array of relative paths
  And the body includes downloads as an array of objects with path and url
  And each url is same-origin and targets GET /api/sdd/lite/file with that path encoded
  And downloads lists exactly the paths in files and no other paths
  And the handler does not call GitHub at request time

Scenario: Lite file download serves unpack bytes for one allow-listed path
  Given GET /api/sdd/lite/files returned a url for skills/testing-expert/SKILL.md
  When GET /api/sdd/lite/file is called with that path query
  Then the response status is 200
  And the body bytes match the file under the sync cache unpack at that relative path

Scenario: Path outside the lite allow-list is rejected on download
  Given the sync cache unpack includes lite-pack.allowlist.json
  When GET /api/sdd/lite/file is called with path agents/ethan.md
  Then the response is a structured error
  And the response status is not 200

Scenario: Path traversal or absolute path is rejected on download
  When GET /api/sdd/lite/file is called with path ../package.json
  Then the response is a structured error
  And the response status is not 200

Scenario: Missing lite manifest returns structured error
  Given the sync cache latest unpack exists without lite-pack.allowlist.json
  When GET /api/sdd/lite/files is called
  Then the response is a structured error with code lite_manifest_missing
  And the response does not include download links for pack paths

Scenario: Invalid lite manifest returns structured error
  Given lite-pack.allowlist.json is present but fails validateLiteInstallManifest against the unpack
  When GET /api/sdd/lite/files is called
  Then the response is a structured error with code lite_manifest_invalid
  And the response does not include download links for pack paths

Scenario: Sync not ready returns sync_pending
  Given no package sync manifest exists on the server
  When GET /api/sdd/lite/files is called
  Then the response status is 409
  And the error code is sync_pending
```

#### AC20 — feature-56 / Web-portal-18 Part 1 (agent markdown)

Engineering detail: [`app-design.md`](./app-design.md) **Lite install prompt (feature-56)** — source `public/agent-setup/install.md`, rewrite `GET /setup/install`.

```gherkin
Scenario: Lite install prompt is public without MCP tools
  When GET /setup/install is called
  Then the response status is 200
  And the body matches the public lite install markdown source
  And the body instructs the agent to fetch the lite link list and copy only those files
  And the body instructs resolving {client_root} for the running tool
  And the body does not instruct calling sdd_install_framework
  And the body does not instruct writing .sdd-installed.json

Scenario: Lite prompt references synced manifest paths
  Given lite-pack.allowlist.json exists in the sync cache
  When GET /setup/install is called
  Then the response tells the agent to use GET /api/sdd/lite/files
  And extract paths stay limited to paths in that manifest
```

#### AC21 — feature-56 / Web-portal-18 Part 2 (partner one-line)

Engineering detail: [`app-design.md`](./app-design.md) **Lite install prompt (feature-56)** and **Agent paste sentences file (feature-88)** — key **`lite_install`** in [`public/agent-setup/paste-sentences.json`](../../public/agent-setup/paste-sentences.json); not on framework.sdd.works Setup UI. After feature-88, [`LITE_PARTNER_SETUP_SENTENCE`](../../src/mcp/brand.ts) must match the loader output.

```gherkin
Scenario: Partner paste uses production lite URL
  Given a partner site (not framework.sdd.works Setup)
  When the visitor pastes the lite install one-line prompt into an agent
  Then the pasted text matches key lite_install in public/agent-setup/paste-sentences.json with origin https://sdd.works
  And that protocol sentence is the same in every locale

Scenario: framework.sdd.works Setup is full pack only
  Given the visitor opens / or /instructions on framework.sdd.works
  When the visitor opens the Setup tab
  Then there is no lite install copy control
  And the full MCP copy control for GET /setup remains
```

### User story 3 — Configurable instructions tabs

**As a** visitor
**I want** tab order and content tabs from the synced pack, and built-in Setup from the portal
**So that** operators can reorder tabs and add markdown tabs without a portal redeploy

#### AC22 — feature-58 / Spec-seeds-16

Pack contract verified through the portal sync cache ([Spec-seeds-16](../product-backlog.md#L277)).

```gherkin
Scenario: Synced pack includes default instructions tabs config
  Given operator sync completed from a pack that ships content/.instructions-tabs.json
  When the sync cache unpack is read
  Then content/.instructions-tabs.json exists
  And the file has version 1 and a tabs array
  And the tabs array includes a code tab with id setup
  And the tabs array includes content tabs for features and scrum-in-sdd
  And each tab includes type, id, labels with en, queryParam, and panelTestId
  And each content tab includes paths with at least en under the pack tree
```

#### AC23 — feature-59 / Web-portal-24

```gherkin
Scenario: Instructions tabs API returns parsed tabs for locale en
  Given content/.instructions-tabs.json exists in the sync cache
  When GET /api/sdd/instructions-tabs?locale=en is called
  Then the response lists tabs in file order including the setup code tab
  And each content tab includes resolved markdown metadata for locale en
  And the handler reads the sync cache only

Scenario: Missing or invalid cache config uses bundled JSON only
  Given the sync cache unpack has no content/.instructions-tabs.json or the file fails validation
  When GET /api/sdd/instructions-tabs?locale=en is called
  Then the response lists tabs from src/content/.instructions-tabs.json only
  And the response source for config is bundled
```

#### AC24 — feature-60 / Web-portal-25

```gherkin
Scenario: Guide default tab is Setup with dynamic tab order from config
  Given the resolved instructions tabs config includes setup, features, and scrum-in-sdd
  When the visitor opens / or /instructions without a tab query param
  Then guide-tab-setup has aria-selected true
  And panel-setup is shown
  And tab buttons appear in config array order
  And each tab button shows the label from config labels for the active locale
  And selecting a tab sets the URL query param from config queryParam

Scenario: Dynamic content tab loads markdown with locale fallback
  Given the config tab id is features
  And the sync cache contains content/features/features.en.md
  When the visitor selects that tab in locale en
  Then the panel identified by panelTestId shows rendered markdown for locale en
  When the visitor switches to locale zh-Hant and the cache has no zh-Hant file for that tab
  Then the panel shows the English file from the sync cache like AC13

Scenario: Tab switching preserves Setup surface and Learn secret placement
  Given the visitor opens the guide
  When the visitor selects a content tab then Setup
  Then panel-setup does not contain secret-lookup
  And content panels hide when not selected
  And manual setup and setup copy controls stay on Setup per AC4 and AC21
  When the visitor selects tab=learn-scrum-in-sdd
  Then secret-lookup is in panel-learn-scrum per AC31
```

#### AC33 — Web-portal-33 / ADR-119 / WA-16

[ADR-119](../adr/ADR-119-instructions-tab-labels-in-pack-config.md). Amends feature-58 validator and feature-60 UI. **`labelKey` is removed** from tab rows.

```gherkin
Scenario: Tab labels come from pack config labels map
  Given content/.instructions-tabs.json in the sync cache lists a tab with labels.en "Features"
  When GET /api/sdd/instructions-tabs?locale=en is called
  Then that tab in the response includes label "Features"
  And the response tab object does not include labelKey

Scenario: Tab label follows locale with en fallback
  Given a tab labels map has en "Setup" and zh-Hans "设置"
  When the visitor opens the guide in locale zh-Hans
  Then the Setup tab button shows "设置"
  When the visitor opens the guide in locale zh-Hant and labels.zh-Hant is absent
  Then that tab button shows the en label

Scenario: Config with labelKey fails validation
  Given content/.instructions-tabs.json uses labelKey instead of labels on a tab row
  When the instructions tabs config is validated
  Then validation fails
  And the portal serves tabs from bundled src/content/.instructions-tabs.json only when that bundled file is valid

Scenario: Operator renames a tab from the pack file only
  Given an operator changes labels.en for tab id features in the pack repo
  And sync completes
  When the visitor opens the guide in locale en
  Then the features tab button shows the new en string
  And portal messages catalogs were not required for that rename
```

#### AC25 — feature-71 / Web-portal-28

[ADR-109](../adr/ADR-109-content-tab-heading-anchors.md). Applies to every `content` tab. Pack markdown is not edited.

```gherkin
Scenario: Index link scrolls to the matching heading
  Given a content tab renders markdown that contains a heading "Part IV The 2020 Scrum Guide Summary"
  And the same markdown contains a link to #part-iv-the-2020-scrum-guide-summary
  When the visitor opens that tab and activates the link
  Then the page scrolls to that heading
  And the heading element id is part-iv-the-2020-scrum-guide-summary

Scenario: A later duplicate heading does not steal the first fragment
  Given a content tab renders two headings with the same plain text "Rules"
  When the visitor activates a link to #rules
  Then the page scrolls to the first Rules heading
  And the second Rules heading id is rules-1
```

#### AC26 — feature-70 / Web-portal-27

[ADR-110](../adr/ADR-110-embedded-external-page-tab.md). The Learn Scrum tab is `embedded_external_page`, not `code` and not the Scrum markdown tab.

```gherkin
Scenario: Learn Scrum tab embeds the shared learn URL
  Given content/.instructions-tabs.json lists learn-scrum-in-sdd with type embedded_external_page
  And urls.en, urls.zh-Hans, and urls.zh-Hant are https://learn.sdd.works/en/learn-embedded/
  When the visitor opens / or /instructions with tab=learn-scrum-in-sdd in locale en, zh-Hans, or zh-Hant
  Then guide-tab-learn-scrum has aria-selected true
  And the tab label resolves from admin.guide.tab_learn_scrum
  And learn-scrum-iframe src is https://learn.sdd.works/en/learn-embedded/
  And a link with the same href opens in a new tab
  And panel-setup is hidden

Scenario: An embed URL on a disallowed host fails config validation
  Given a tab type is embedded_external_page
  And urls.en is https://example.com/learn/
  When validateInstructionsTabsConfig runs
  Then the result is not ok
  And the error names the host
```

#### AC27 — Web-portal-29

[ADR-111](../adr/ADR-111-guide-header-sticky.md). Same chrome on `/` and `/instructions`. No new label keys. The tagline stays `admin.guide.lead`. Tab labels stay the existing tab keys. Open defect [WA-14](../issues-log.md) tracks horizontal page scroll; close it when AC27 and [`app-tests.md`](./app-tests.md) §19 pass.

```gherkin
Scenario: Title and tabs stay in view while the body scrolls
  Given the visitor opens / or /instructions
  And the guide body is taller than the viewport
  When the visitor scrolls the tab body
  Then the logo, the title with key admin.guide.title, the tagline with key admin.guide.lead, and the tab list stay at the top of the viewport
  And the tagline has no rule under it
  And the tab list keeps its underline
  And the selected tab keeps its mark on that underline

Scenario: The locale switch is not pinned with the title
  Given the visitor opens the guide
  When the visitor scrolls the tab body
  Then the locale switch leaves the viewport with the page
  And the site footer is not part of the pinned block

Scenario: A narrow viewport does not scroll the page sideways
  Given the viewport is 375px wide
  And the title wraps inside the pinned block
  When the visitor scrolls the tab names sideways inside the tab list
  Then the page itself does not scroll sideways
  And the logo, title, tagline, and tab list stay pinned

Scenario: A heading link clears the pinned block
  Given a content tab has a heading link per AC25
  When the visitor activates that link
  Then the heading is fully in view below the pinned logo, tagline, and tabs
```

#### AC28 — Web-portal-27 / ADR-112

[ADR-112](../adr/ADR-112-learn-embed-frame.md). The embed URL stays AC26. No new label keys. Square `aspect-ratio` checks are superseded by AC30 ([ADR-114](../adr/ADR-114-learn-embed-auto-height.md)).

```gherkin
Scenario: Learn embed frame has no border and fills column width
  Given the visitor opens / or /instructions with tab=learn-scrum-in-sdd
  When the Learn Scrum panel is shown
  Then learn-scrum-iframe has no border
  And the iframe width fills the guide column
  And the iframe does not use a viewport min-height
  And learn-scrum-iframe src is still https://learn.sdd.works/en/learn-embedded/
```

#### AC29 — Web-portal-27 / ADR-113

[ADR-113](../adr/ADR-113-learn-embed-copy-and-fallback.md). Embed URL stays AC26. Inner grid layout is sdd.works ([ADR-114](../adr/ADR-114-learn-embed-auto-height.md)).

```gherkin
Scenario: Learn fallback uses learn.sdd.works below iframe
  Given the visitor opens / or /instructions with tab=learn-scrum-in-sdd
  When the Learn Scrum panel is shown
  Then learn-scrum-iframe src is https://learn.sdd.works/en/learn-embedded/
  And a link directly below the iframe opens https://learn.sdd.works in a new tab
  And the link visible text resolves from admin.guide.learn_scrum_open_external
  And the panel does not render admin.guide.learn_scrum_intro

Scenario: Learn embed spacing below iframe (ADR-117)
  Given the visitor opens tab=learn-scrum-in-sdd
  When the Learn Scrum panel is shown
  Then the fallback link top margin from the iframe is 15px
  And the learn-secret block top margin from the fallback link is 45px

Scenario: Found secret row uses compact codeblock (ADR-117 / WA-15)
  Given the visitor opens tab=learn-scrum-in-sdd
  And a key named "sdd-trial-googlemaps" exists
  When the visitor activates Get secret with that name
  Then secret-result is a codeblock with class secret-result-block
  And the codeblock border is visible and border-radius is 0
  And the value row height matches secret-name field height at 2.125rem
  And secret-result-copy width matches secret-get width
```

#### AC30 — Web-portal-27 / ADR-114

[ADR-114](../adr/ADR-114-learn-embed-auto-height.md). Portal half only. sdd.works embed CSS and postMessage script are a dependency for a tight fit.

```gherkin
Scenario: Learn iframe height follows the embed document
  Given the visitor opens / or /instructions with tab=learn-scrum-in-sdd
  When the Learn Scrum panel is shown
  Then learn-scrum-iframe width fills the guide column
  And learn-scrum-iframe does not use aspect-ratio 1 / 1
  When the portal receives a valid sdd-learn-embed-height message from sdd.works
  Then learn-scrum-iframe height matches the reported height in pixels
  And the portal ignores postMessage from origins outside the embed host allowlist
```

#### AC32 — Learn embed loading skeleton / ADR-118

[ADR-118](../adr/ADR-118-learn-embed-loading-skeleton.md). Portal half only. All user-facing loading strings use i18n keys in `en`, `zh-Hans`, and `zh-Hant`.

```gherkin
Scenario: Learn embed shows a skeleton while the iframe loads
  Given the visitor opens / or /instructions with tab=learn-scrum-in-sdd
  When the Learn Scrum panel is shown
  And learn-scrum-iframe has not yet fired load
  Then test id learn-embed-loading is visible
  And the loading region uses aria-busy true
  And the loading label resolves from admin.guide.learn_scrum_embed_loading
  And the skeleton shows nine placeholder cells in a 3 by 3 grid
  And learn-embed-fallback and secret-lookup stay visible below the iframe host

Scenario: Learn embed hides the skeleton after iframe load
  Given the visitor is on tab=learn-scrum-in-sdd
  And learn-scrum-iframe has fired load
  Then test id learn-embed-loading is not visible
  And the iframe host uses aria-busy false
```

#### AC34 — Learn embed centered loading indicator / ADR-120 / WA-17

[ADR-120](../adr/ADR-120-learn-embed-centered-loading-indicator.md). Amends [ADR-118](../adr/ADR-118-learn-embed-loading-skeleton.md) overlay behavior. No new message keys. Open defect [WA-17](../issues-log.md).

```gherkin
Scenario: Learn embed shows a centered indicator while the iframe loads
  Given the visitor opens / or /instructions with tab=learn-scrum-in-sdd
  When the Learn Scrum panel is shown
  And learn-scrum-iframe has not yet fired load
  Then test id learn-embed-loading is visible
  And test id learn-embed-loading-indicator is visible
  And the indicator is centered in learn-embed-frame-host
  And learn-scrum-iframe is not visible until load
  And no loading spinner from the embed document is visible through the overlay

Scenario: Learn embed hides the indicator with the skeleton after load
  Given the visitor is on tab=learn-scrum-in-sdd
  And learn-scrum-iframe has fired load
  Then test id learn-embed-loading-indicator is not visible
  And learn-scrum-iframe is visible
```

#### AC35 — Web-portal-34 / ADR-121

[ADR-121](../adr/ADR-121-sdd-works-wordmark-logo.md). Wordmark only; `sdd-mark.png` unchanged.

```gherkin
Scenario: Logo component loads the deployed wordmark
  Given public/sdd-logo.png is a copy of src/618x618.logos.png
  When Logo renders for size header on any shell
  Then the image src is /sdd-logo.png
  And the image intrinsic width is 718 and height is 256

Scenario: Guide header shows the new wordmark at header scale
  Given the visitor opens / or /instructions
  Then the guide hero logo uses class logo-header-mark
  And the visible wordmark matches the SDD WORKS art from ADR-121
  And no opaque background is painted behind the logo image

Scenario: Auth and home shells show the wordmark at full scale
  Given the visitor opens /login or the home auth layout that uses logo-full
  Then the logo image src is /sdd-logo.png
  And CSS height tokens match app-design for logo-full and logo-home
```

#### AC36 — Web-portal-35 / ADR-122

[ADR-122](../adr/ADR-122-instructions-guide-hero-and-setup-tab.md). Guide hero typography and Setup tab content. Mockup approved before production parity check.

```gherkin
Scenario: Guide hero shows the new title and Antonio headline
  Given the visitor opens / or /instructions
  Then the title resolves from key admin.guide.title to Built on Harness. Ready for Scrum in en zh-Hans and zh-Hant
  And the hero headline uses font family Antonio via --font-hero
  And guide-hero-title aligns the wordmark and h1 on one row

Scenario: Setup tab shows highlight and install path without manual JSON
  Given the visitor opens instructions on the Setup tab
  Then test id setup-highlight shows text from admin.guide.setup_highlight
  And test id copy-setup-prompt copies Fetch and execute the setup instructions from https://sdd.works/setup
  And test id copy-install-phrase copies the localized install phrase from admin.guide.setup_install_phrase
  And test id copy-install-cmd copies sdd_install_framework
  And the page has no element with id manual-setup
  And the page has no element with id tools
  And the page has no test id copy-update-cmd

Scenario: Setup tab shows update hint and agents roster
  Given the visitor opens instructions on the Setup tab
  Then test id setup-update-preface shows text from admin.guide.setup_update_tool naming sdd_update_framework
  And test id guide-agents lists seven agent rows
  And the Setup tab has no agents intro paragraph keyed admin.guide.agents_intro
```

#### AC37 — feature-77 / Web-portal-37 / WA-18 / ADR-123

**Plain summary:** Features, Scrum, invoke/help articles, and any future markdown tab should look like one family: same heading rhythm, same table borders, same column widths on catalog tables. Features keeps its badge + two-column catalog shape; everything else uses prose shape. Technical detail: [ADR-123](../adr/ADR-123-unified-guide-markdown-body.md). Mockup approval before [WA-18](../issues-log.md) closes.

```gherkin
Scenario: Content tabs share guide-md-body presentation class
  Given the instructions guide loads a content tab from content/.instructions-tabs.json
  When the tab id is features
  Then the panel article has classes guide-md-body and guide-md-body--catalog
  When the tab id is scrum-in-sdd or invoke-agents
  Then the panel article has classes guide-md-body and guide-md-body--prose
  When the tab id is any other content row added in the pack config
  Then the panel article has classes guide-md-body and guide-md-body--prose by default

Scenario: Content tab markdown wraps tables for shared catalog CSS
  Given the server renders HTML for any content tab path under content/
  Then every table is inside a div with class content-table
  And table headers use sentence case guide styling not admin uppercase mono headers

Scenario: Catalog tables align across sections on Features
  Given the visitor opens the Features tab
  Then each content-table uses a fixed first column width from --guide-md-catalog-col1
  And catalog tables under h3 badges indent to align with the badge label inset
  And body copy uses the full guide column width up to --guide-max
```

#### AC38 — feature-74 / Web-portal-36 / ADR-124

**Plain summary:** The **Knowledge** tab is an in-guide mini browser over pack markdown. The pack ships a folder (for example `content/knowledge/`) and index files that list subfolders and articles. Visitors follow a path trail (not a Back button), open articles in the tab or in a new window, and share URLs with `?tab=`, `path=`, and `doc=`. Contract: [ADR-124](../adr/ADR-124-internal-page-folder-index-json.md). Mockup [`16-knowledge-folder-spike.html`](./ui-mockup/16-knowledge-folder-spike.html) confirmed (path trail, no Back, no list h2).

```gherkin
Scenario: Knowledge tab lists entries from root index
  Given content/.instructions-tabs.json includes a tab with type internal_page_folder and rootPath content/knowledge
  And content/knowledge/.index.json lists folders and files with labels for the active locale
  When the visitor opens the guide with query tab knowledge and no path or doc
  Then panel-knowledge shows a disc list of entry labels from the root index
  And the path trail shows knowledge as the current segment only
  And panel-knowledge does not show a folder h2

Scenario: Visitor opens a subfolder in the same tab
  Given the visitor is on the Knowledge tab root list
  When the visitor activates a folder row
  Then the URL includes tab knowledge and path with that folder id segment
  And the path trail shows knowledge as a link and the folder id as the current segment
  And panel-knowledge does not show a folder h2
  And activating the knowledge path link returns to the root list without path or doc

Scenario: same_tab file replaces the list with prose in the panel
  Given a file entry in the current folder index has open same_tab
  When the visitor activates that row without modifier keys
  Then the URL includes doc set to that entry id
  And the list is hidden and the article uses guide-md-body and guide-md-body--prose
  And the path trail includes doc as the current segment
  And activating the parent folder segment in the path trail clears doc and shows the folder list again

Scenario: new_tab file opens the full guide in a new browsing context
  Given a file entry has open new_tab
  When the visitor activates that row with a primary click
  Then the current tab URL keeps path without doc
  And a new tab opens with the same tab path and doc query params as same_tab would use
  And the new tab shows the guide hero tabs the path trail and the article prose

Scenario: Invalid index or missing markdown fails visibly
  Given an internal_page_folder tab points at rootPath with a broken index or missing paths.en file
  When the visitor selects that tab or navigates to an unknown doc id
  Then panel-knowledge shows a visible error state
  And the guide shell and other tabs still work
```

#### AC44 — feature-72 / Web-portal-30 / ADR-127

**Plain summary:** After cutover, visitors use **`sdd.works`** for the guide and setup, and **`learn.sdd.works`** for the WordPress course embedded in the Learn tab. App code, pack JSON, setup paste, and embed security rules all use those hosts; **`framework.sdd.works`** redirects to **`sdd.works`**. Detail: [ADR-127](../adr/ADR-127-public-hostnames-sdd-and-learn.md). Amends embed **`src`** in **AC26**, **AC28**, **AC29**, and **AC30** after **feature-72** ships. Amends setup host in **AC36** scenario copy-setup-prompt.

```gherkin
Scenario: Learn tab embeds WordPress on learn.sdd.works
  Given pack content/.instructions-tabs.json and bundled src/content/.instructions-tabs.json list learn-scrum-in-sdd with type embedded_external_page
  And urls.en urls.zh-Hans and urls.zh-Hant are https://learn.sdd.works/en/learn-embedded/
  When the visitor opens / or /instructions with tab=learn-scrum-in-sdd
  Then learn-scrum-iframe src is https://learn.sdd.works/en/learn-embedded/
  And a fallback link below the iframe opens https://learn.sdd.works in a new tab

Scenario: Embed host allowlist accepts learn.sdd.works only
  Given a tab type is embedded_external_page
  And urls.en is https://learn.sdd.works/en/learn-embedded/
  When validateInstructionsTabsConfig runs
  Then the result is ok
  When urls.en is https://sdd.works/en/learn-embedded/
  Then the result is not ok

Scenario: Learn postMessage accepts learn.sdd.works origin
  Given the visitor is on tab=learn-scrum-in-sdd on https://sdd.works
  When the portal receives sdd-learn-embed-height from origin https://learn.sdd.works
  Then learn-scrum-iframe height updates
  When the same message comes from https://example.com
  Then the portal ignores it

Scenario: Setup copy uses sdd.works
  Given the visitor opens the Setup tab on the public guide
  When the visitor activates copy-setup-prompt
  Then the copied text is Fetch and execute the setup instructions from https://sdd.works/setup

Scenario: framework.sdd.works redirects to sdd.works
  Given an HTTP client follows redirects for https://framework.sdd.works/
  Then the final URL host is sdd.works
```

#### AC48 — feature-84 / Web-portal-20

**Plain summary:** Operators and docs agree on **one** public hostname for the guide and install story (**`sdd.works`** after cutover). Alternate hostnames redirect there; setup and marketing copy do not point at two different “official” URLs.

```gherkin
Scenario: Public hostname policy is documented for operators
  Given the release or go-live notes for hostname cutover
  Then they name sdd.works as the canonical visitor entry for the instructions guide and GET /setup
  And they name learn.sdd.works as the canonical WordPress learn site
  And they state that framework.sdd.works redirects to sdd.works

Scenario: User-facing copy does not fork hosts after cutover
  Given feature-72 hostname work is Done
  When a visitor copies the Setup one-line prompt from the guide
  Then the URL host in that sentence is sdd.works only
```

#### AC49 — feature-85 / Web-portal-22

**Plain summary:** The URL visitors bookmark for the guide (**`sdd.works`**) is not the primary entry for Admin sign-in or operator tools. Login, reset, and Admin Framework stay reachable on a separate hostname or routing rule documented for operators.

```gherkin
Scenario: Public guide hostname is not the documented admin entry
  Given the operator routing doc for post-cutover hosts
  Then admin login and Admin Framework are documented on a host or path separate from the public instructions guide on sdd.works
  And the public guide footer may link to admin in a new tab without making sdd.works/login the only admin URL forever

Scenario: Unauthenticated admin paths still reject access
  Given a visitor opens /login or /admin without a session
  Then the app shows login or rejects access as today
  And no secret or operator-only data appears on the public guide tabs
```

#### AC50 — feature-83 / Web-portal-21

**Plain summary:** A **partner** marketing site (for example 2study.ai) is not this repo’s **`/`** page. That partner site should foreground install (lite or full MCP), link to **`https://sdd.works/setup`** (or lite install markdown), and link to the instructions guide. Framework portal **`/`** remains the guide ([Web-portal-09](../product-backlog.md#pb-76)).

```gherkin
Scenario: Partner landing leads with install
  Given the partner public landing for the SDD framework offer
  Then the primary call to action tells the visitor to install via agent setup markdown or the lite install one-line sentence
  And the page links to the framework instructions guide on sdd.works after cutover

Scenario: Framework portal home is unchanged
  Given a visitor opens / on the framework portal deployment
  Then they see the instructions guide with Setup as default tab
  And the page is not replaced by a partner-only marketing hero
```

#### AC45 — feature-88 / Web-portal-38 Part 1 (Node agent markdown)

Engineering detail: [`app-design.md`](./app-design.md) **Node.js setup prompt (feature-88)** — `public/agent-setup/node.md`, rewrite `GET /setup/node`.

```gherkin
Scenario: Node setup markdown is public
  When GET /setup/node is called
  Then the response status is 200
  And the Content-Type includes text/markdown
  And the body includes instructions to detect OS and CPU architecture
  And the body instructs GET /api/setup/node/catalog on the same origin
  And the body instructs a short npm registry probe and catalog fallback cn_hk
  And the body instructs node -e hello verification
  And the body documents the node_prerequisite paste sentence from paste-sentences.json
  And the body does not instruct sdd_install_framework
  And the body does not instruct lite file copy or .sdd-lite-installed.json

Scenario: Node setup markdown matches the source file after origin rewrite
  Given isLocalMcpDev is true
  When GET /setup/node is called
  Then production host strings in node.md are rewritten to the local portal origin
```

#### AC46 — feature-88 / Web-portal-38 Part 3 (Node catalog API)

Engineering detail: [`app-design.md`](./app-design.md) **Node.js setup prompt (feature-88)** — catalog JSON and `GET /api/setup/node/catalog`.

```gherkin
Scenario: Node catalog returns LTS and platform downloads
  When GET /api/setup/node/catalog is called
  Then the response status is 200
  And the JSON includes node_lts
  And downloads includes darwin-arm64 darwin-x64 and win32-x64 with https URLs
  And npm_registries includes default and cn_hk with https URLs
  And the response includes no secrets

Scenario: Node catalog is public
  When GET /api/setup/node/catalog is called without an admin session
  Then the response status is 200
```

#### AC47 — feature-88 / Web-portal-38 Part 2 (paste sentences file and Setup copy)

Engineering detail: [`app-design.md`](./app-design.md) **Agent paste sentences file (feature-88)** and Setup **`copy-node-setup-prompt`**.

```gherkin
Scenario: Paste sentences file defines lite and node agent prompts
  Given public/agent-setup/paste-sentences.json version is 1
  Then sentences includes lite_install and node_prerequisite
  And each value contains exactly one origin placeholder
  And resolvePasteSentence lite_install with origin https://sdd.works equals Fetch and execute the setup instructions from https://sdd.works/setup/install
  And resolvePasteSentence node_prerequisite with origin https://sdd.works equals Fetch and execute the setup instructions from https://sdd.works/setup/node

Scenario: Setup tab copies node prerequisite sentence
  Given the visitor opens / or /instructions on the Setup tab
  When the visitor activates copy-node-setup-prompt
  Then the copied text equals resolvePasteSentence node_prerequisite for the portal public origin
  And admin.guide.setup_node_section_title and setup_node_section_lead resolve in en zh-Hans and zh-Hant

Scenario: Lite partner sentence stays out of Setup UI
  Given the visitor opens the Setup tab on the public guide
  Then there is no copy-lite-setup-prompt control
  And copy-setup-prompt for GET /setup remains
```

---

## `sdd-admin-i18n` — Admin i18n

Catalogs `en`, `zh-Hans`, `zh-Hant`. Missing key falls back to default locale, then the key name. (I18N-01)

### User story 1 — Switch locale

**As an** admin or visitor
**I want** to switch among English, Simplified Chinese, and Traditional Chinese
**So that** labels match my language

#### AC1

```gherkin
Scenario: Switch locale without crash
  Given the visitor is on any admin page
  And the locale switcher shows labels EN, 简, and 繁
  When the visitor selects locale zh-Hans
  Then visible strings resolve from the zh-Hans catalog
  And missing keys fall back to en then to the key name
  And the page does not fail because a catalog entry is missing
```

#### AC2

```gherkin
Scenario: Dates and numbers follow the active locale
  Given a signed-in admin
  And the keys list includes an issued date
  When the locale is en
  Then the date is formatted with the en locale
  When the locale is zh-Hans
  Then the date is formatted with the zh-Hans locale
```
