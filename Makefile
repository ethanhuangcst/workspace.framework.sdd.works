.PHONY: help dev up down test lint typecheck seed

.DEFAULT_GOAL := help

DATABASE_URL ?= postgresql://framework_sdd:framework_sdd@localhost:5435/framework_sdd
export DATABASE_URL

help: ## Show available targets
	@grep -E '^[a-zA-Z_-]+:.*?##' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf " %-12s %s\n", $$1, $$2}'

dev: ## Start Next.js development server (foreground, port 3040)
	npm run dev

up: ## Start local Postgres + migrate + seed
	docker-compose up -d
	@echo "Waiting for Postgres..."
	@until docker-compose exec -T postgres pg_isready -U framework_sdd -d framework_sdd >/dev/null 2>&1; do sleep 1; done
	npx prisma migrate deploy
	npx prisma db seed

down: ## Stop local Postgres
	docker-compose down

test: ## Run unit + integration tests
	npm test

lint: ## Lint and typecheck
	npm run lint
	npm run typecheck

typecheck: ## TypeScript check
	npm run typecheck

seed: ## Seed database
	npx prisma db seed
