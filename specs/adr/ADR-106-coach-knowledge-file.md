# ADR-106: coach-knowledge.md for topics outside Scrum in SDD

## Status
Accepted. Amended 2026-10-09 by [ADR-130](./ADR-130-simplified-installer-url-only-and-empty-cache.md) decision 9: install path is `{client_root}/templates/`, not `{client_root}/templates/framework.sdd.works/`.

## Context

Ethan coaches Scrum in SDD and also uses harness engineering, XP (Extreme Programming), BDD (Behavior-Driven Development), Lean, and AI (artificial intelligence) in delivery. **`pack-scrum-in-sdd.md`** and **`sdd-scrum-practices.md`** stay the AI-read Scrum in SDD guide and practice book beside `constants.json` under `templates/` ([ADR-126](./ADR-126-ai-read-pack-templates-and-pack-scrum-in-sdd-filename.md)). **`coach-knowledge.md`** is the third AI-read essay in that set. A name in `ethan.md` does not give every model the same pack meaning.

## Decision

1. The pack meaning of those five topics lives in `coach-knowledge.md`.
2. The authoring seed is `pack.framework.sdd.works/templates/framework.sdd.works/coach-knowledge.md`. After install, the file is `{client_root}/templates/framework.sdd.works/coach-knowledge.md`. It is AI-read and EN-only with the same template policy as [ADR-126](./ADR-126-ai-read-pack-templates-and-pack-scrum-in-sdd-filename.md).
3. Ethan reads one heading when a question or a guiding proposal needs that topic. The read starts at the heading and stops at the next heading of the same level. Onboard does not open the file.
4. `ethan.md` names the file and when to load it. The essays stay out of the agent file.
5. A request to design a model host, retrieval, or an AI system follows `ai-architect`. `coach-knowledge.md` does not hold that design.

## Rationale

A file is the shared meaning. The model can talk about the public words without a file, and two models can disagree. Scrum in SDD stays in its own guide and practice book, so these topics do not go there.

## Consequences

- EN is the only shipped body for this ADR plus [ADR-126](./ADR-126-ai-read-pack-templates-and-pack-scrum-in-sdd-filename.md). HanS and HanT copies remain a later locale change if ever needed.
- Install copies the seed onto the client root under `templates/framework.sdd.works/` beside `constants.json`. It is not a project file under `artifacts_root`.

## Date
2026-10-06
