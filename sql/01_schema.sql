-- FleetFlow PoC: source (OLTP) schema for PostgreSQL
-- Fictional SaaS logistics platform. Every tenant shares the same tables, separated by tenant_id.

DROP TABLE IF EXISTS dashboard_views, shipments, users, subscriptions, carriers, tenants CASCADE;

CREATE TABLE tenants (
  tenant_id   INTEGER PRIMARY KEY,
  name        TEXT NOT NULL,
  country     TEXT NOT NULL,
  industry    TEXT NOT NULL,
  plan        TEXT NOT NULL,          -- current plan: Starter, Growth, Enterprise
  signup_date DATE NOT NULL
);

CREATE TABLE subscriptions (
  subscription_id INTEGER PRIMARY KEY,
  tenant_id       INTEGER NOT NULL REFERENCES tenants(tenant_id),
  plan            TEXT NOT NULL,
  mrr             NUMERIC(10,2) NOT NULL,   -- monthly recurring revenue
  start_date      DATE NOT NULL,
  end_date        DATE                      -- NULL = active subscription
);

CREATE TABLE users (
  user_id    INTEGER PRIMARY KEY,
  tenant_id  INTEGER NOT NULL REFERENCES tenants(tenant_id),
  name       TEXT NOT NULL,
  email      TEXT,
  role       TEXT NOT NULL,           -- admin, analyst, viewer
  created_at DATE NOT NULL,
  last_login DATE                     -- NULL = never logged in
);

CREATE TABLE carriers (
  carrier_id INTEGER PRIMARY KEY,
  name       TEXT NOT NULL,
  mode       TEXT NOT NULL            -- Road, Air, Sea
);

CREATE TABLE shipments (
  shipment_id      INTEGER PRIMARY KEY,
  tenant_id        INTEGER NOT NULL REFERENCES tenants(tenant_id),
  carrier_id       INTEGER NOT NULL REFERENCES carriers(carrier_id),
  origin_city      TEXT NOT NULL,
  destination_city TEXT NOT NULL,
  weight_kg        NUMERIC(10,1) NOT NULL,
  cost             NUMERIC(12,2) NOT NULL,
  created_at       DATE NOT NULL,
  promised_date    DATE NOT NULL,
  delivered_at     DATE,              -- NULL = not delivered yet
  status           TEXT NOT NULL      -- delivered, in_transit, cancelled
);

CREATE TABLE dashboard_views (
  view_id   INTEGER PRIMARY KEY,
  user_id   INTEGER NOT NULL REFERENCES users(user_id),
  dashboard TEXT NOT NULL,
  viewed_at DATE NOT NULL
);
