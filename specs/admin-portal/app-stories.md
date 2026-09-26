# framework.sdd.works — Admin portal user stories

Operator web app at `framework.sdd.works`. Stories and ACs for the **app**. MCP tools live in [`mcp-stories.md`](../mcp/mcp-stories.md). Design: [`app-design.md`](./app-design.md). Mockups: [`ui-mockup/`](./ui-mockup/). Phase 1 backlog: [`r1-product-backlog.md`](../phase1-process-specs/r1-product-backlog.md). Phase 2 backlog: [`product-backlog.md`](../product-backlog.md).

**Phase 2 upcoming (no Gherkin yet):** [Instructions page](../product-backlog.md#pb-7) will update the Instructions page for full-repo install, templates, process skills, and coach-ethan. Acceptance scenarios are written when that story starts.

**Locales:** `en` (default), `zh-Hans`, `zh-Hant`. User-facing copy is i18n keys. Tests assert keys / `data-testid` / roles, not one language’s sentences. Protocol ids (`framework.sdd.works`, tool names, locale codes) are not localized.

**Roles:** Visitor, Admin, Operator, Invitee.

**Default Given:** unless stated, the admin exists, password is set, and the session is valid.

---

## `sdd-admin-home` — Public home

Public landing is the instructions guide. Labels and controls use i18n keys (`sdd-admin-i18n`). [Web-portal-09](../product-backlog.md#pb-76).

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

---

## `sdd-admin-instructions` — MCP instructions

How to connect MCP clients. Public and signed-in entries. Feature-10 owns the page layout. Sprint 3 feature-04 owns the secret form chrome. Feature-05 owns the lookup and showing a value or not-found. Feature-07 owns the catalog body. Feature-17 ([ADR-067](../adr/ADR-067-get-secret-on-setup.md)) moves the form to Setup. AC6, AC7, AC8, and the Features placement line in AC14 stay as the record of what shipped. AC17 is the placement to build.

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

#### AC3 — feature-11

```gherkin
Scenario: Setup copy is the one-line fetch prompt
  Given the visitor opens instructions
  When the visitor uses the setup copy control
  Then the copied text is Fetch and execute the setup instructions from https://framework.sdd.works/setup
  And the setup label uses an i18n key
```

#### AC4 — feature-12

```gherkin
Scenario: Manual setup shows one mcp.json
  Given the visitor opens instructions
  Then manual setup shows one mcp.json
  And that sample uses command ${userHome}/.sdd/sdd-mcp
  And that sample sets SDD_SERVER_URL to https://framework.sdd.works
  And the page does not show a second mcp.json
  And the page does not show curl -fsSL https://framework.sdd.works/install
```

#### AC5 — feature-10, superseded by AC12 (feature-07)

The fixed Agents, Skills, Rules, and Templates lists shipped with the page redesign. Feature-07 replaces that body. Do not assert those fixed names after feature-07.

```gherkin
Scenario: Features tab lists fixed catalog rows
  Given the visitor opens instructions
  When the visitor selects the Features tab
  Then Agents lists ethan
  And Skills lists sdd-atdd, sdd-tdd, sdd-new-project, sdd-update-project, sdd-refine-pb, sdd-plan-sprint, sdd-tracking, sdd-retrospective, sdd-close-sprint, sdd-audit-artifacts, sdd-update-specs, sdd-design, and sdd-implement
  And Rules lists dod.mdc, incremental-delivery.mdc, and realtime-status.mdc
  And Templates lists product-backlog.md, sprint-backlog.md, status.md, change-log.md, artifacts-map.md, architecture.md, design.md, test.md, and deployment.md
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
  Given the latest sync cache contains features.en.md and features.zh-Hans.md
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
  Given the latest sync cache contains features.en.md
  And the cache does not contain features.zh-Hant.md
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

#### AC17 — feature-17 / ADR-067

```gherkin
Scenario: Get secret sits at the bottom of Setup
  Given the visitor opens / or /instructions
  When the visitor selects the Setup tab
  Then secret-lookup is after the tools table
  And the section id is setup-secret
  And the Features tab panel does not contain secret-lookup
  And the placeholder and button keys stay admin.guide.secret_hint and admin.guide.secret_button
  When the visitor activates Get secret with a non-empty name
  Then the URL does not set tab=features
  And the Setup panel stays shown
  And the viewport stays on #setup-secret
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
