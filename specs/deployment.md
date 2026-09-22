# Deployment — framework.sdd.works

> **Purpose**: Point operators at the release docs. Do not copy host names, secrets, or step lists into this file. Optional / JIT (not a required process artifact).
> **Practices**: [`sdd-scrum-practices.md`](./sdd-scrum-practices.md) (what, how, when).
> **Framework**: [`sdd-scrum-guide.md`](./sdd-scrum-guide.md) (names and meaning).

## 1. Operator docs

Deploy and upgrade steps live under [`release/`](./release/):

- [`release/framework-sdd-works-deployment-instruction.md`](./release/framework-sdd-works-deployment-instruction.md)

## 2. Phase 2

No new deploy surface yet. When a Phase 2 story changes how the service is released, add the delta here and keep the full operator steps in `release/`.
