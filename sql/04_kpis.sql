-- FleetFlow PoC: KPI layer (runs on the star schema in 03_model.sql)
-- Each query answers one business question from the discovery (01-discovery.md).

-- KPI 1. Late delivery rate by carrier (the demo insight)
-- Question: which carrier delays my deliveries the most?
-- Grain: one row per carrier. is_late is a 0/1 flag, so AVG(is_late) is the late rate.
SELECT c.name,
       c.mode,
       ROUND(100 * AVG(f.is_late), 1) AS late_pct
FROM fact_shipments f
JOIN carriers c ON f.carrier_id = c.carrier_id
GROUP BY c.carrier_id, c.name, c.mode
ORDER BY late_pct DESC;
-- Result: NorthLine Freight 40.1%, BlueWave Maritime 24.0%, RodoSul 12.6%, AeroLink 9.3%, Expressa 8.9%.

-- KPI 2. Carrier scorecard (main table of the tenant dashboard)
-- Question: how does each carrier compare on volume, reliability, speed and price?
-- Cost per kg is a ratio of totals (weighted average): SUM(cost) / SUM(weight), never AVG(cost_per_kg).
SELECT c.name,
       COUNT(*) AS deliveries,
       ROUND(100 * AVG(f.is_late), 1) AS late_pct,
       ROUND(AVG(f.days_to_deliver), 2) AS avg_days_to_deliver,
       ROUND(SUM(f.cost) / SUM(f.weight_kg), 2) AS cost_per_kg
FROM fact_shipments f
JOIN carriers c ON f.carrier_id = c.carrier_id
GROUP BY c.carrier_id, c.name
ORDER BY late_pct DESC;
-- Insight: NorthLine is the cheapest road carrier (0.93/kg vs RodoSul 1.03, Expressa 1.24) but 40.1% of its deliveries are late.

-- KPI 3. Monthly trend (line chart)
-- Question: is volume growing, and is punctuality getting better or worse?
-- Month as 'YYYY-MM' text to avoid time zone shifts in chart tools. Last month is partial (shipments still in transit).
SELECT TO_CHAR(DATE_TRUNC('month', f.created_at), 'YYYY-MM') AS month,
       COUNT(*) AS deliveries,
       ROUND(100 * AVG(f.is_late), 1) AS late_pct
FROM fact_shipments f
GROUP BY month
ORDER BY month;
-- Volume: 55.5 deliveries/month in 2025 vs 90.2 in 2026. Late rate: 17.3% in 2025 vs 19.7% in 2026.

-- KPI 4. Drill-down: what caused the February 2026 spike (28.4% late)?
-- Same scorecard as KPI 2, filtered to one month. Use >= first day AND < first day of next month.
SELECT c.name,
       COUNT(*) AS deliveries,
       SUM(f.is_late) AS late_deliveries,
       ROUND(100 * AVG(f.is_late), 1) AS late_pct
FROM fact_shipments f
JOIN carriers c ON f.carrier_id = c.carrier_id
WHERE f.created_at >= '2026-02-01' AND f.created_at < '2026-03-01'
GROUP BY c.carrier_id, c.name
ORDER BY late_deliveries DESC;
-- NorthLine: 12 of the month's 25 late deliveries (66.7% late) with ~20% of the volume.
