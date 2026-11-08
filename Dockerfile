# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl

FROM base AS deps
COPY package.json package-lock.json ./
COPY app/shared/packages ./app/shared/packages
COPY app/shared/prisma ./app/shared/prisma
RUN npm ci

FROM deps AS builder
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx prisma generate --schema=app/shared/prisma/schema.prisma
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
ENV PATH="/app/node_modules/.bin:${PATH}"

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Keep the standalone tree NESTED: Turbopack materializes externalized packages
# (for example the generated Prisma client) as relative symlinks that assume this
# layout, and standalone server.js chdirs into its own directory.
COPY --from=builder /app/app/web/.next/standalone ./standalone
COPY --from=builder /app/app/web/.next/static ./standalone/app/web/.next/static
# Data read through process.cwd() after the chdir lives beside server.js.
COPY --from=builder /app/lite-prompts ./standalone/app/web/lite-prompts
COPY --from=builder /app/app/shared/content ./standalone/app/web/app/shared/content
COPY --from=builder /app/pack.framework.sdd.works ./standalone/app/web/pack.framework.sdd.works
# MCP container runs tsx from /app: alias config, sources, and full prod deps.
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/app/mcp ./app/mcp
COPY --from=builder /app/app/shared ./app/shared
# tsx and prisma are runtime dependencies (entrypoint migrate/seed + MCP tsx),
# so the production-only install carries both; postinstall regenerates the
# Prisma client for this stage.
RUN npm ci --omit=dev \
  && chown -R nextjs:nodejs /app

# The node image entrypoint runs the file with node when it is missing or not
# executable, which crash-loops the web container.
COPY --chmod=755 --chown=nextjs:nodejs docker-entrypoint-web.sh ./docker-entrypoint-web.sh

USER nextjs
EXPOSE 3000 3041
CMD ["./docker-entrypoint-web.sh"]
