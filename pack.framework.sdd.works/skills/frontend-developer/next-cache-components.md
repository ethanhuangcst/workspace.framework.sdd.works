# Next.js Cache Components

Load this file when the project has `cacheComponents: true` in `next.config`. Read the installed Next.js docs under `node_modules/next/dist/docs/` when API details differ by version.

Cache Components enable Partial Prerendering: a static shell, cached segments, and dynamic content inside Suspense.

## Detection

```bash
grep -r "cacheComponents" next.config.* 2>/dev/null
```

When enabled, apply these patterns to Server Components, data fetching, Server Actions, and performance work in that project.

## Deprecated segment exports

Replace segment config with compositional caching:

| Avoid | Prefer |
| --- | --- |
| `export const revalidate` | `cacheLife()` inside `'use cache'` |
| `export const dynamic = 'force-static'` | `'use cache'` and Suspense boundaries |

## Choose caching

- Data the same for all users: `'use cache'`, plus `cacheTag()` and `cacheLife()`.
- Request context (`cookies`, `headers`, `searchParams`): keep outside `'use cache'`; wrap in `<Suspense>`.
- `'use cache'` functions must be `async`. Put `'use cache'` first in the function body.

After mutations, invalidate with `updateTag()` for read-your-writes, or `revalidateTag()` for background revalidation, from Server Actions.

## Page composition

Typical page: static header, cached content block, dynamic user block inside Suspense with a visible fallback.

## Dynamic routes

With Cache Components, `generateStaticParams` must return at least one param set when the route uses params. An empty array can fail the build.

## Build errors (guide toward fixes)

- Cookies, headers, or searchParams outside Suspense: wrap the dynamic part in Suspense.
- Uncached data outside Suspense: cache it or wrap in Suspense.
- Request data inside `'use cache'`: move runtime reads outside the cached function.

## Review checklist

- Data that could be cached uses `'use cache'` with tags and life.
- Server Actions that mutate cached data call `updateTag()` or `revalidateTag()`.
- No `cookies()` or `headers()` inside `'use cache'`.
- Dynamic async UI has a Suspense boundary and fallback.
- No empty `generateStaticParams()` when params drive the route.
