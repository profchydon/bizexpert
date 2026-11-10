# BizExpert

Multi-location inventory and sales management for Nigerian wholesalers and retailers, with a Next.js dashboard and WhatsApp AI assistant.

## Stack

- **API:** NestJS, Prisma, PostgreSQL, Bull (Redis)
- **Web (`apps/main`):** Next.js, React 19, Remote / Untitled UI design system, BizExpert inventory mode via `NEXT_PUBLIC_PRODUCT=bizexpert`
- **Legacy web (`apps/web`):** Previous BizExpert-only dashboard (being replaced by `apps/main`)
- **Integrations:** Meta WhatsApp Cloud API, OpenAI

## Prerequisites

- Node.js 20+
- Docker (PostgreSQL 16 + Redis 7)
- Meta WhatsApp Business app credentials (for WhatsApp MVP)
- OpenAI API key

## Quick start

```bash
# 1. Infrastructure
docker compose up -d

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Environment
cp apps/api/.env.example apps/api/.env
cp apps/main/.env.example apps/main/.env
# Edit JWT_SECRET, and WhatsApp/OpenAI keys for full MVP

# 4. Database
npm run db:migrate
npm run db:seed

# 5. Run apps
npm run dev
```

- Web (main): http://localhost:3000 — set `NEXT_PUBLIC_PRODUCT=bizexpert` and `NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1` in `apps/main/.env`  

- API: http://localhost:3001/api/v1  
- Swagger: http://localhost:3001/api/v1/docs  

See [apps/web/CHANGELOG.md](apps/web/CHANGELOG.md) for web UI history.

### Demo credentials (after seed)

- Email: `owner@demo.bizexpert.ng`
- Password: `Demo1234!`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start API + web (Turbo) |
| `npm run build` | Production build |
| `npm run db:migrate` | Apply Prisma migrations (`prisma migrate deploy`) |
| `npm run db:migrate:dev` | Create/apply migrations in dev (`prisma migrate dev`) |
| `npm run db:seed` | Load demo data |
| `npm run test` | Run tests |

## WhatsApp webhook (live)

1. Set `WHATSAPP_VERIFY_TOKEN`, `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID` in `apps/api/.env`.
2. Expose `https://<your-host>/api/v1/whatsapp/webhook` (HTTPS required by Meta).
3. Link a phone in **Settings → WhatsApp** in the dashboard.

## Pilot backup

Postgres data is stored in the Docker volume `pgdata`. Back up with:

```bash
docker compose exec postgres pg_dump -U bizexpert bizexpert > backup.sql
```

Restore: `docker compose exec -T postgres psql -U bizexpert bizexpert < backup.sql`

## Pilot reconciliation checklist

Before go-live, verify:

1. **Inventory valuation** — `GET .../analytics/inventory-valuation` total equals sum of balance `totalValue` rows.
2. **Sales summary** — completed sales revenue matches sum of non-cancelled sale `totalAmount` for the same date range.
3. **Gross profit** — sale line `lineProfit` sums match analytics gross profit (excluding cancelled sales).
4. **COGS stability** — historical sale gross profit unchanged after new stock receipts (cost snapshots on `sale_items`).
5. **Tenant isolation** — user without membership receives 403 on another business id (see e2e test).
6. **Transfer in transit** — dispatch reduces source; receive at destination completes; cancel restores source.
7. **Stocktake** — variances apply only after manager approval (audit trail on adjustments).
8. **Collections** — `collection-summary` revenue vs cash collected vs outstanding credit matches payments + credit sales.

## Enterprise ops migration

After pulling enterprise features, run:

```bash
npm run db:migrate
```

Prisma migrations live under `apps/api/prisma/migrations/` (initial schema includes suppliers, GRNs, stocktakes, barcodes, in-transit transfers).

## Notifications (proactive)

With Redis + WhatsApp configured, scheduled jobs send **daily sales digest** and **low-stock alerts** to linked owner/manager numbers. Tune cron in `apps/api/src/notifications/notifications.service.ts`.

## Monitoring & backup drills

- Health: `GET /api/v1/health` (if enabled) + Postgres connection errors in API logs.
- Queue: monitor Bull/Redis for stuck WhatsApp jobs.
- **Quarterly drill**: restore `backup.sql` to a staging DB and run reconciliation checklist items 1–5.

## Project layout

```
apps/api/     NestJS backend
apps/main/    Primary Next.js dashboard (BizExpert inventory mode)
apps/web/     Legacy BizExpert dashboard (deprecated)
prd.md        Product specification
```
