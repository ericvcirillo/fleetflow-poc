-- Step 6: what the app reads.

-- Each user can read only their own tenant's row (name, plan) for the page header.
DROP POLICY IF EXISTS tenant_read_own ON tenants;
CREATE POLICY tenant_read_own ON tenants
FOR SELECT TO authenticated
USING ( tenant_id = (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::int );

-- One row per month and carrier. It stores SUMS, not averages, so the app can
-- re-aggregate any slice (a year, a carrier) correctly: rate = SUM(part) / SUM(whole).
-- security_invoker = true: the view runs as the logged-in user, so RLS applies.
DROP VIEW IF EXISTS kpi_carrier_month;
CREATE VIEW kpi_carrier_month WITH (security_invoker = true) AS
SELECT DATE_TRUNC('month', f.created_at)::date AS month,
       c.carrier_id,
       c.name                 AS carrier,
       c.mode,
       COUNT(*)               AS deliveries,
       SUM(f.is_late)         AS late_deliveries,
       SUM(f.cost)            AS total_cost,
       SUM(f.weight_kg)       AS total_weight_kg,
       SUM(f.days_to_deliver) AS total_days
FROM fact_shipments f
JOIN carriers c ON c.carrier_id = f.carrier_id
GROUP BY 1, c.carrier_id, c.name, c.mode;
