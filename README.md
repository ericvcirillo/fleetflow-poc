# FleetFlow embedded analytics PoC

A proof of concept for embedding customer-facing analytics in a multi-tenant SaaS product.
FleetFlow is a fictional shipment-management platform; its customers (tenants) share the same
tables, and each one must see only its own data.

> Work in progress. Fictional company and data. Built openly with AI assistance.

## What it shows
- **Tenant isolation:** the same dashboard and the same queries return different data depending
  on who is logged in. Postgres Row Level Security reads `tenant_id` from the login token (JWT).
- **Operational dashboard:** late rate, cost per kg and transit time by carrier, with a period
  filter and carrier drill-down.
- **One insight:** NorthLine is the cheapest road carrier, but it delivers about 40% of shipments late.

## Stack
- Supabase (Postgres, Auth, Row Level Security)
- React + Vite, Recharts
- Vercel

## Data model
| File | What it does |
|---|---|
| `sql/01_schema.sql` | Tables: tenants, subscriptions, users, carriers, shipments, dashboard_views |
| `sql/02_seed.sql` | Fictional data: 40 tenants, 6 carriers, 1,558 shipments |
| `sql/03_model.sql` | `fact_shipments` view: one row per delivered shipment (the grain) |
| `sql/04_kpis.sql` | KPI queries: late rate, carrier scorecard, monthly trend, drill-down |
| `sql/05_security.sql` | RLS policies and test users tied to a tenant |
| `sql/06_app_views.sql` | `kpi_carrier_month`: additive measures the app re-aggregates |

## Run locally
```bash
npm install
cp .env.example .env.local   # fill in the Supabase URL and publishable key
npm run dev
```
Without the env vars the app runs in offline demo mode with a snapshot of two tenants.
