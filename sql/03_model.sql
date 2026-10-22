-- FleetFlow PoC: analytical model (star schema)
-- Fact: one row per DELIVERED shipment (the grain). Metrics pre-computed once so every dashboard uses the same rules.
-- Dimensions: tenants (also the security key), carriers, date (created_at).

DROP VIEW IF EXISTS fact_shipments;
CREATE VIEW fact_shipments WITH (security_invoker = true) AS
SELECT shipment_id,
       tenant_id,
       carrier_id,
       created_at,
       cost,
       weight_kg,
       delivered_at - created_at AS days_to_deliver,
       CASE WHEN delivered_at > promised_date THEN 1 ELSE 0 END AS is_late,
       cost / weight_kg AS cost_per_kg
FROM shipments
WHERE status = 'delivered';
