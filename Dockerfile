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

# Standalone server: project tree sits at standalone/app/web; flatten to /app so
# server.js stays at the image root and process.cwd()-relative reads keep working.
COPY --from=builder /app/app/web/.next/standalone/app/web ./
COPY --from=builder /app/app/web/.next/standalone/node_modules ./node_modules
COPY --from=builder /app/app/web/.next/static ./.next/static
COPY --from=builder /app/lite-prompts ./lite-prompts
# TS sources for the MCP container (tsx runs them directly) and fs-read fallback data.
COPY --from=builder /app/app/mcp ./app/mcp
COPY --from=builder /app/app/shared ./app/shared
COPY docker-entrypoint-web.sh ./docker-entrypoint-web.sh
RUN chmod +x docker-entrypoint-web.sh

# Prisma migrate/seed + MCP (tsx) — not bundled in Next standalone output.
COPY package.json package-lock.json ./
RUN npm install --no-save prisma@6.16.0 tsx@4.20.5 \
  && npx prisma generate --schema=app/shared/prisma/schema.prisma \
  && chown -R nextjs:nodejs /app

USER nextjs
EXPOSE 3000 3041
CMD ["./docker-entrypoint-web.sh"]
