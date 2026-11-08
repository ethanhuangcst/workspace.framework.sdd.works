#!/bin/sh
set -eu

echo "[entrypoint] prisma migrate deploy"
npx prisma migrate deploy --schema=app/shared/prisma/schema.prisma

echo "[entrypoint] prisma db seed"
npx tsx app/shared/prisma/seed.ts

echo "[entrypoint] starting Next.js web"
if [ -f "./standalone/app/web/server.js" ]; then
  exec node standalone/app/web/server.js
fi

exec npx next start app/web -p "${PORT:-3000}"
