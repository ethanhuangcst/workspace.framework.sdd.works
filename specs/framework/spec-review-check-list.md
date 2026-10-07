# Spec review checklist

A spec passes when every check below passes. Rewrite a failed check before the review ends.

## Communication

### Opening

- The first sentence gives the result, the limit, or the next action.
- The text does not tell a search story. A search story is what the agent searched, tried, or decided.
- A section stands alone for a later agent.

### Sentences

- The wording is short, clear, and concise.
- A sentence has one meaning.
- A line passes or fails, except where both allowed outcomes are named.
- One fact stays one sentence.
- A paragraph has one idea.
- Two or more facts under one heading use a lower heading and a bullet list.
- A continuation is indented two spaces under the bullet, with no blank line after the bullet.
- When the sentence names an action, the sentence names who does the action, to what, and with what result.
- A result with no actor passes.

### Names

- One concept keeps one name.
- The text has no invented short form.
- A specialist term has the plain meaning in the same sentence.
- The sentence repeats the noun.
- The sentence does not point with "this", "it", or "the above" alone.

### Claims

- A claim that the text does not show fails.
- A count in a heading matches the number of items under the heading.

### Tone

- The sentence states the fact.
- A sentence fails when the sentence adds warmth, eagerness, or a clever contrast and adds no fact.
- The text does not use "prefer", "try", or "consider".
- When two outcomes are both allowed, the text names both outcomes.

### Shape

- Items at one level are parallel.
- One list uses one order: alphabetical, numeric, or the order the reader does the work.
- A comparison is a table.
- The last section is visible in Cursor preview.

### Marks

- The text has no emoji, icon, image, decorative symbol, checkmark, or decorative arrow.
- An image the user asked for is allowed.
- The text has no em dash.
- The text has no spaced double hyphen used as a break.
- A labeled bad example may show a banned mark.
- The text has no raw HTML tag.
- A list is tight.

## Skill file

Apply the Skill file checks when the spec is a `SKILL.md`.

- The description states what the skill does and when to use the skill, in third person, with the trigger phrases.
- The description names the nearby skill when another skill owns the adjacent job.
- The description is under 1024 characters.
- The description does not say "I can" or "you can".
- Frontmatter is `name` and `description` only, unless the user names a tool that requires another field.
- The `name` is at most 64 characters and uses lowercase letters, numbers, and hyphens.
- The body is under 500 lines.
- The body uses one term for one concept.
- A file link is one level deep.
- The text has no dated instruction.
- The text has no backslash path.
- The skill folder is the confirmed folder `{client_root}/{skills_dir}/<name>/`.
- The seed copy and the installed copy match after a confirmed write.

## Paths

Apply the Paths checks when the spec names `artifacts-map.json` or `artifacts_root`.

- The file name is `artifacts-map.json`.
- The workspace path is `{workspace}/artifacts-map.json`.
- The skill does not read `artifacts-map.json` under a template folder.
- When `{workspace}/artifacts-map.json` is missing, the search folder is `{workspace}/specs/`.
- `artifacts_root` is unread when `{workspace}/artifacts-map.json` is missing.
- The default folder name is `specs`.
- When `{workspace}/artifacts-map.json` is present, the skill opens `{workspace}/<path>`.
- The stored path already includes the folder.
- The skill does not prefix `artifacts_root`.
- The skill does not strip an absolute machine path down to a relative one.
- A stored path that fails is `Index broken` even when `opened` is `none`.
- The skill does not open another copy of the file.

## Verdict and locale

Apply the Verdict and locale checks when the spec is `sdd-audit-artifacts`.

- The verdict token is `Uninitialized`, `Index broken`, or `Usable`.
- The skill does not translate the verdict token.
- A permission error means `{workspace}/artifacts-map.json` cannot be read.
- The unreadable-file verdict is `Index broken`.
- The unreadable-file report block fails `artifacts-map.json`.
- The unreadable-file report block has no `locale` line.
- The skill does not open the process files when `{workspace}/artifacts-map.json` cannot be read.
- The skill reports `locale` only after `{workspace}/artifacts-map.json` opened.
- A missing `locale` field is `empty`.
- An empty `locale` does not change the verdict.
- An unknown `locale` does not change the verdict.
- The skill quotes an unknown locale. `FR` is `"FR"`.
- The skill does not rewrite an unknown locale to `EN`.
- The report-block labels stay `verdict`, then `locale`, then `opened`, then `failed`.
- Sentences to the user stay outside the report block.

## Design and seed

- `specs/framework/framework-design.md` and the seed file state the same rule.
- A change to a verdict row updates the design table and the seed in the same change.
- The pack field example `pack.framework.sdd.works/.sdd-installed.example.json` stays `pack_complete` false. The live client ledger stays `{client_root}/.sdd-installed.json`.
