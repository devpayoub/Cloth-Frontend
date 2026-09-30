# Cloth — Next.js storefront + Medusa.js backend

Fashion e-commerce app: a Next.js 16 (App Router) storefront and a Medusa v2
backend, wired through a dedicated service layer so no page ever touches
backend URLs or tokens.

## Architecture

```
app/           Next.js pages — import data ONLY from @/api
api/           Frontend service layer (the only place env vars are read)
├── config.ts     MEDUSA_BACKEND_URL + publishable key from env
├── client.ts     fetch wrapper (x-publishable-api-key, caching, errors)
├── mappers.ts    Medusa products/variants → frontend Product shape
├── products.ts   listProducts / getProduct / resolveVariantId / listCategories
├── collections.ts  curated collections (mens / womens / new-arrivals)
├── regions.ts    default USD region
└── cart.ts       Medusa cart operations (create, line items)

backend/       Medusa v2 application (port 9000)
├── src/scripts/seed.ts   seeds region, key, categories, full catalog
├── scripts/db.mjs        project-local Postgres (no Docker needed)
└── docker-compose.yml    optional Postgres for production-like runs

store/cart.tsx Client cart context — localStorage state synced to a Medusa cart
```

## Running locally

From the repo root (`cloth/`), run `pnpm install` once — it installs both
`frontend/` and `backend/` as workspace packages.

1. **Backend** (`backend/.env` — currently points at the Neon Postgres):

   ```bash
   cd ../backend
   pnpm dev          # Medusa on http://localhost:9000
   pnpm seed         # one-time (idempotent): seeds catalog, prints the publishable key
   ```

   Using the local embedded Postgres instead of Neon:
   `pnpm db:setup` (once) → `pnpm db` (keeps it running) → `pnpm exec medusa db:migrate` → `pnpm seed`.

2. **Storefront** (this folder — `frontend/.env.local` holds the publishable key):

   ```bash
   pnpm dev          # http://localhost:3000
   ```

The seed is idempotent — re-running it reuses the region, key, categories and
products that already exist. `pnpm db:reset` wipes the database.

Admin dashboard: http://localhost:9000/app (create an admin user with
`pnpm --filter medusa-starter-default exec medusa user -e admin@cloth.test -p supersecret`).
