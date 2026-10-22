# FleetFlow PoC: Discovery Summary

> Fictional scenario built for a portfolio project. FleetFlow and its data are invented.
> Status: final. Discovery answers are invented for the scenario.

## The company
FleetFlow is a B2B SaaS platform for shipment management. Its customers (tenants) are
shippers in Retail, E-commerce, Food & Beverage, Pharma and Manufacturing, mostly in
Latin America, plus a few in the US, Canada and Spain. Three plans: Starter, Growth
and Enterprise. Each tenant moves freight through shared carriers (road, air, sea).

## The pain
- Tenants keep asking "how are my carriers performing?" and "how much am I spending per lane?".
  Today the Customer Success team answers with CSV exports and spreadsheets, by hand: about 25 hours per week across 3 CS analysts.
- FleetFlow has a basic in-house reporting page (four static dashboards built by its own
  engineers). Adoption is low and every new chart competes with the core product roadmap.
- Leadership has no single view of MRR, churn and product adoption by tenant.
- Enterprise prospects ask for analytics in the sales process, and FleetFlow loses deals
  or discounts because it can't show it: 4 Enterprise deals lost or discounted in the last two quarters.

## Why now
Renewal season (Q1 2027) for the largest Enterprise tenants, and a competitor launched self-service reports.

## Personas
| Persona | Who | What they need |
|---|---|---|
| Tenant Operations Manager | End user inside each FleetFlow customer | On-time rate, cost per kg, transit time and carrier ranking for **their own** shipments only |
| FleetFlow Admin / CS | Internal team supporting tenants | Stop building reports by hand; see which tenants and users actually use the dashboards |
| FleetFlow CFO / Exec | Leadership | MRR, ARR, churn and adoption across all tenants |
| FleetFlow Engineering (technical buyer) | VP Eng / Tech Lead | Embed fast in the React app, keep tenant data isolated, no new infra to babysit |

## Technical landscape
- Multi-tenant database: all tenants share the same tables, separated by `tenant_id`.
- Front end in React; users log in through FleetFlow's own auth (candidate for SSO/JWT into the embed).
- Data today in a PostgreSQL OLTP database; no warehouse yet.
- Each user belongs to exactly one tenant; FleetFlow admins see all tenants.

## PoC success criteria
1. **Tenant isolation:** the same embedded dashboard shows two different tenants only their own rows (row-level security driven by the login).
2. **Operational dashboard for tenants:** on-time delivery rate, cost per kg, average transit days and carrier ranking, filterable by date and carrier.
3. **Executive dashboard for FleetFlow:** MRR, churn and dashboard adoption (active users, MAU) by tenant.
4. **Embedding:** dashboard running inside a simple React page, styled to look like FleetFlow.
5. **One actionable insight** from real data, e.g. a carrier delivering well below the others.

## Out of scope
Write-back, alerts, AI features, production deployment, historical data before 2025.

## Open questions for the next call
- How many tenants and users in 12 months? Any tenant with special data rules?
- Can a user belong to more than one tenant?
- Who signs off on the PoC, and what happens if all five criteria pass?
