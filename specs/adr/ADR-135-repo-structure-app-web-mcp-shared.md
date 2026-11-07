# ADR-135: Repository structure with app/web, app/mcp, app/shared, and lite-prompts

## Status

Accepted

## Context

The repository is one Next.js deployment unit. Web pages, MCP service, and the shared business core all live under `src/`, and the lite setup prompt files live in `public/agent-setup/`. The pack authoring tree `pack.framework.sdd.works/` is already a top-level folder with its own push target. The operator wants a directory layout that names each product surface: the pack, the web app, the MCP service, and the lite prompt definitions.

Constraints: existing behavior must not break, and the change should stay as small as possible. Production runs one GHCR image (`workspace.framework.sdd.works/web`) for both `framework-sdd-web` and `framework-sdd-mcp` containers; the MCP container starts with `npx tsx src/mcp/http-server.ts`. Thirteen web API routes under `src/app` import `@/core`; `src/mcp/create-server.ts` also imports `@/core` and `@/lib/keys-crypto`. `src/mcp/module-boundary.test.ts` already enforces that `core` does not import `mcp` and that the setup backend stays separate from pack install.

## Decision

1. Target layout:
   - `pack.framework.sdd.works/` stays unchanged.
   - `app/web/` holds the Next.js web app: `src/app`, `src/components`, `src/content`, `src/styles`, `src/i18n`, `src/mail`, `src/auth` (admin sessions), `middleware.ts`, `messages/`, `e2e/`.
   - `app/mcp/` holds the MCP service: `http-server.ts`, `create-server.ts`, `auth.ts`, `tool-descriptions.ts`, and MCP-only assets.
   - `app/shared/` holds code both sides use: `src/core` (sync, tools, seeds), `src/github`, `src/lib`, the setup backend six (`brand.ts`, `paste-sentences.ts`, `setup-paths.ts`, `setup-markdown.ts`, `node-setup-catalog.ts`, `public-origin.ts`), `prisma/`, and `packages/sdd-paths`.
   - `lite-prompts/` holds the six prompt definition files moved from `public/agent-setup/`: `install.md`, `prompt.md`, `node.md`, `install-full.md`, `paste-sentences.json`, `node-catalog.json`. Public URLs (`/agent-setup/*.md`, `/lite/install`, `/setup/*`) do not change.
2. One `package.json` stays at the root. No npm workspaces. Import paths move through the `tsconfig.json` `paths` alias (`@/core/...` becomes `@/shared/core/...`, `@/components/...` becomes `@/web/components/...`), applied as a mechanical rewrite.
3. One GHCR image and the image name stay. The Next.js root becomes `app/web`; the Dockerfile and `docker-entrypoint-web.sh` adjust build and copy paths. The MCP container command changes to the new `app/mcp/http-server.ts` path; Portainer stack env is updated on the deploy that ships this change.
4. Dependency direction after the move: `web -> shared`, `mcp -> shared`, no `web <-> mcp` imports. `module-boundary.test.ts` keeps guarding that direction.
5. Execution is two phases, each shipping green on its own:
   - Phase 1: move `public/agent-setup/` to `lite-prompts/`, keep every public URL, update the seven reader call sites plus Dockerfile and tests.
   - Phase 2: the `app/web`, `app/mcp`, `app/shared` split with alias rewrite, config updates, one deploy with the Portainer mcp command edit.

## Rationale

- `shared` resolves the real coupling: the package, lite, versions, and sync APIs are web routes over the same core the MCP tools use. A two-way split without `shared` would force web to import from `mcp`.
- A single root `package.json` with `paths` aliases reaches the target layout without workspace, lockfile, or CI-matrix churn. Workspaces would add cost with no current need: one team, one repo, one image.
- Keeping one image preserves the Portainer deploy contract; only the mcp command line inside the stack changes.
- Phase order puts the small, low-risk move first so the ADR-134 surface (lite paths) is validated independently of the build-root change.

Alternatives rejected:

- Full npm workspaces with three `package.json` files: larger diff, lockfile and CI churn, against the minimal-change constraint.
- Splitting into two GHCR images: changes the Portainer contract twice and doubles build work for no functional gain.
- Keeping the current layout and only adding a README map: zero cost but does not reach the operator's target layout.

## Consequences

- About 138 files carry `@/` imports; the alias rewrite is mechanical but must pass full `tsc --noEmit`, Vitest, and Playwright gates.
- Build config is the risk surface: Next.js standalone output from `app/web`, Dockerfile copy list, vitest, eslint, and playwright configs all name root paths. Full regression and a production smoke follow the Phase 2 deploy.
- `specs/` carries 23 links with `../src/...` and `module-boundary.test.ts`, `Makefile`, and scripts hardcode `src/` paths; those update in Phase 2.
- The mcp container command inside the Portainer stack env changes once, on the Phase 2 deploy. Record the edit in the dated go-live plan for that release.
- This refactor is a separate backlog item with its own close; it is not bundled into feature work.

## Date

2026-11-08