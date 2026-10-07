# ADR-074: Skill authoring skill is `sdd-create-skill`

## Folder name
[ADR-092](./ADR-092-pack-authoring-skill-sdd-prefix.md) restores pack folder `sdd-create-skill`. [ADR-089](./ADR-089-pack-authoring-skill-names.md) is superseded. Constants key `skill_create_skill` is unchanged.

## Status
Accepted

## Context
The pack contained two skill-authoring folders. `skill-creator` carries an eval viewer, graders, a description optimizer, and packaging scripts aimed at one agent product. `create-skill` is a useful authoring baseline, and the pack copy is written for one tool: it names that tool’s store, a project skills path, and a frontmatter flag that other tools do not share.

Skills in this framework install at `{client_root}/{skills_dir}/<name>/SKILL.md`. `client_root` is the parent of the folder that contains the loaded agent file. `skills_dir` is the Paths value in `constants.json`. The authoring skill must use that pair. It must not hard-code a tool folder.

## Decision
1. The pack skill folder is `sdd-create-skill`. The constants key is `skill_create_skill`. It is not a Scrum practices job.
2. Do not ship `skills/skill-creator/` or `skills/create-skill/`. An update must not leave those folders on `{client_root}`.
3. New skills are written only at `{client_root}/{skills_dir}/<name>/SKILL.md`. Read `skills_dir` from `{client_root}/templates/framework.sdd.works/constants.json`. If that file cannot be read, stop. Do not invent a folder. Do not hard-code a tool root, a built-in skills directory, or a personal store.
4. Frontmatter is `name` and `description` only. Do not add a tool-specific invocation flag unless the user names a tool that requires it.
5. This version is the authoring workflow: discover, confirm the path, write `SKILL.md`, check the file, and propose test prompts. The eval viewer, graders, description-optimizer loop, and skill-package step stay out.

## Rationale
One authoring skill can follow `create-skill`’s structure rules and still install the way this pack installs every other skill. Shipping both old folders would put two competing instructions on `{client_root}` and would teach the agent a path that is not `skills_dir`.

## Consequences
- [Skill-16](../product-backlog.md#L115) owns `sdd-create-skill`. The seed is `specs/framework/seeds/skills/sdd-create-skill/SKILL.md`.
- The guide skill lists name `sdd-create-skill`. `constants.json` maps `skill_create_skill` to that folder.
- A later install must not list `skills/skill-creator/` or `skills/create-skill/`.
- Adding a key to the `constants.json` `skills` object is a separate write. The skill proposes it after the skill folder is written and waits for a second confirm.
- The built-in skill that ships inside an agent tool is not part of this pack. This ADR does not edit it.

## Date
2026-09-29
