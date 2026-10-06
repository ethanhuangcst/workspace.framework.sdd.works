# ADR-106: coach-knowledge.md for topics outside Scrum in SDD

## Status
Accepted

## Context

Ethan coaches Scrum in SDD and also uses harness engineering, XP (Extreme Programming), BDD (Behavior-Driven Development), Lean, and AI (artificial intelligence) in delivery. `scrum-in-sdd.md` and `sdd-scrum-practices.md` stay the Scrum in SDD guide and practice book. A name in `ethan.md` does not give every model the same pack meaning.

## Decision

1. The pack meaning of those five topics lives in `coach-knowledge.md`.
2. The authoring seed is `specs/framework/seeds/templates/EN/coach-knowledge.md`. After install, the file is `{client_root}/templates/framework.sdd.works/{locale}/coach-knowledge.md`.
3. Ethan reads one heading when a question or a guiding proposal needs that topic. The read starts at the heading and stops at the next heading of the same level. Onboard does not open the file.
4. `ethan.md` names the file and when to load it. The essays stay out of the agent file.
5. A request to design a model host, retrieval, or an AI system follows `ai-architect`. `coach-knowledge.md` does not hold that design.

## Rationale

A file is the shared meaning. The model can talk about the public words without a file, and two models can disagree. Scrum in SDD stays in its own guide and practice book, so these topics do not go there.

## Consequences

- EN is the first body. HanS and HanT copies are a later locale change.
- Install copies the seed onto the client root with the other locale templates. It is not a project file under `artifacts_root`.

## Date
2026-10-06
