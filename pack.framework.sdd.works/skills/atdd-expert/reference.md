# ATDD reference

Portable rules for user stories and Gherkin acceptance criteria. Pack projects may also load `#acceptance-criteria-practices` in `sdd-scrum-practices.md` for an exact match.

## User story quality

- One user story is one user-visible outcome. Split when role or outcome differs.
- **As a** names the person who uses the result, not the implementer.
- **I want** names what they can do or reach, not a file, route, or sprint task.
- **So that** names value, not implementation detail.

**Good:** As a signed-in coach, I want to save a card note, so that I can resume pricing later.

**Bad:** As a developer, I want to add POST /cards, so that the API exists.

**Bad:** Four stories for login page, POST route, session storage, and API wiring for one sign-in feature. Use one vertical story with scenarios for happy and failure paths.

Trace optional: `#### AC1 — PBI-42 / WA-01` when the scenario maps to a backlog or external id.

## Scenario shape

- Use `Scenario:` with `Given`, `When`, and `Then`. Add `And` only to extend the same step kind.
- Name each scenario for the outcome the user or operator can observe, not the class or file under test.
- One scenario is one behavior. Split when `When` or `Then` would describe two unrelated outcomes.

```gherkin
Scenario: {observable outcome name}
  Given {precondition}
  When {action}
  Then {visible or API outcome}
```

## Coverage

- Each critical user story has at least one happy-path scenario.
- Each critical user story has at least one failure, empty, or denial scenario when the product must handle it (validation error, unauthorized, missing data).
- PBI requirement bullets stay on the product backlog. This skill authors Gherkin under stories, not backlog bullets.

## Assertions and i18n

- `Then` steps assert visible or API outcomes the user cares about, not internal flags or private fields.
- When the product has UI, prefer `role`, accessible name, or `data-testid` in steps. Use i18n keys in the spec narrative. Do not lock one locale's sentence as the only contract in Gherkin.

**Good:** `Then the guide with test id instructions-guide is shown`

**Bad:** `Then the page title is "Welcome"`

**Good:** `Then the seed exits with failure`

**Bad:** `Then process.exitCode equals 1`

## Shared preconditions

- State role, session, and fixture assumptions in `Given`, or once in the file **Default Given** line when every scenario shares them.
- Do not repeat the same long `Given` block in every scenario when the default already covers it.

## File shape for `*-stories.md`

Use when the caller wants a module stories file, not chat-only output.

~~~~markdown
# {Product or module} — user stories

{One paragraph: scope, related design file, default roles.}

**Locales:** {locale list when UI exists}. User-facing copy is i18n keys. Tests assert keys, roles, or `data-testid`, not one language's sentences.

**Roles:** {role list}

**Default Given:** unless stated, {shared precondition}.

---

## `{feature-id}` — {Feature title}

### User story 1 — {short title}

**As a** {role}
**I want** {capability}
**So that** {value}

#### AC1

```gherkin
Scenario: {observable outcome name}
  Given {precondition}
  When {action}
  Then {visible or API outcome}
```
~~~~

## Mapping

Use when the user asks to map before writing stories. Do not require a project map.

1. **Backbone:** List user activities left to right in the order the user does them.
2. **Slices:** Under each activity, list user tasks. Draw horizontal slices for MVP 1, MVP 2, and later increments.
3. **Pick the next slice:** Choose the top slice that delivers one job. Do not split that slice by frontend, API, or database layers on the sprint board.
4. **Write stories:** For each task in the chosen slice, write one user story and acceptance criteria using the rules above.

**Good MVP slice:** Save a card, see progress while saving, get a price, see matching notes. Each row is a vertical story the user can finish.

**Bad MVP slice:** UI-only stories while agent and search stories sit in a later MVP when the user cannot finish the job without them.

## Order and tools

- Write or revise acceptance criteria before production code for that story (ATDD). Unit and integration tests implement the scenarios; they do not replace the spec file.
- `testing-expert` and the project test spec own automated test files. This skill owns story and Gherkin text.

## Quality checklist

Before you show the ATDD summary, confirm:

- [ ] Each story is one outcome, not a layer or agent task.
- [ ] Each critical story has a happy path scenario.
- [ ] Failure, empty, or denial exists where the product must handle it.
- [ ] Each scenario is one behavior with an observable name.
- [ ] UI steps use stable selectors or keys, not locked English copy.
- [ ] Shared preconditions are in **Default Given** or short `Given` blocks, not duplicated everywhere.
