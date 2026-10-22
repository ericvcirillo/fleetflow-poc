-- Step 5: multi-tenant security (Row Level Security)
-- Each logged-in user sees only the rows of their own tenant.
-- The tenant comes from the login token (JWT), in app_metadata, which only the server can set.

ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_isolation ON shipments;
CREATE POLICY tenant_isolation ON shipments
FOR SELECT TO authenticated
USING ( tenant_id = (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::int );

-- Carriers are shared by all tenants: any logged-in user can read every row.
DROP POLICY IF EXISTS carriers_read_all ON carriers;
CREATE POLICY carriers_read_all ON carriers
FOR SELECT TO authenticated
USING (true);

-- A view runs with its owner's rights by default and would skip the policy.
-- security_invoker makes it run with the rights of the user who queries it.
ALTER VIEW fact_shipments SET (security_invoker = true);

-- Test: pretend to be a user of tenant 12 (nothing is saved, ROLLBACK at the end)
BEGIN;
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"app_metadata":{"tenant_id":12}}', true);
SELECT tenant_id, COUNT(*) FROM shipments GROUP BY tenant_id;       -- one row: 12 | 84
SELECT tenant_id, COUNT(*) FROM fact_shipments GROUP BY tenant_id;  -- one row: 12 | 80 (delivered only)
ROLLBACK;

-- Test users (created in Authentication > Users), each tied to one tenant.
-- app_metadata can only be changed by the server, so users cannot switch tenants.
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"tenant_id": 7}'
WHERE email = 'ops@tenant7.test';

UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"tenant_id": 12}'
WHERE email = 'ops@tenant12.test';
