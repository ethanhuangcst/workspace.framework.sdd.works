# Deployment — [product name]

> **Purpose**: How to start locally, and the order of steps at go-live. Do not write real host names, secrets, or customer environment names here. Optional / JIT (not a required process artifact).
> **Example**: Pokymon Card Collection.
> **Practices**: [`sdd-scrum-practices.md`](./sdd-scrum-practices.md) (what, how, when).
> **Framework**: [`scrum-in-sdd.md`](./scrum-in-sdd.md) (names and meaning).

## 1. Local

1. Install dependencies.
2. Prepare a local database (do not use production data).
3. Run `make up`.
4. Open the app, confirm the empty collection is visible, and catalog one sample card.

Acceptance matches [Local startup](./product-backlog.md#pb-6). Stop with `make down`.

## 2. Production (outline)

Replace the placeholders below with the real environment. Do not put secrets in this file.

| Item | Placeholder |
| --- | --- |
| App URL | `https://[product domain]` |
| Database | Managed Postgres. The connection string lives only in the runtime environment |
| Release | Build the image or artifact → deploy to the app host → run migrations → open the home page and catalog one card |

Before go-live, check [Scope gate](./product-backlog.md#pb-5): the page has no prices, no public marketplace, and no real brand names.

## 3. Upgrade

1. Back up the database.
2. Deploy the new version.
3. Run migrations.
4. Repeat the catalog check in §1.
5. If it fails, restore from the backup and record it in [`change-log.md`](./change-log.md).
