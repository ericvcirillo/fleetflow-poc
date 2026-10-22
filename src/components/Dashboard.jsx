import { useEffect, useMemo, useState } from 'react'
import { loadDashboard, demoMode } from '../data.js'
import { byCarrier, byMonth, fmt, monthRange, PERIODS, summarize } from '../metrics.js'
import Logo from './Logo.jsx'
import { CarrierChart, TrendCharts } from './Charts.jsx'

export default function Dashboard({ user, onSignOut }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [period, setPeriod] = useState('all')
  const [carrierId, setCarrierId] = useState(null)

  useEffect(() => {
    loadDashboard(user).then(setData).catch(e => setError(e.message))
  }, [user])

  const view = useMemo(() => {
    if (!data) return null
    const test = PERIODS.find(p => p.id === period).test
    const inPeriod = data.kpi.filter(r => test(r.month))
    const selected = carrierId ? inPeriod.filter(r => r.carrier_id === carrierId) : inPeriod
    return {
      totals: summarize(selected),
      carriers: byCarrier(inPeriod),
      months: byMonth(selected, monthRange(inPeriod)),
    }
  }, [data, period, carrierId])

  const carrierName = view?.carriers.find(c => c.carrierId === carrierId)?.carrier

  return (
    <div className="shell">
      <aside className="sidebar">
        <Logo light />
        <nav>
          <a>Shipments</a>
          <a>Carriers</a>
          <a className="active">Analytics</a>
          <a>Settings</a>
        </nav>
        <div className="sidebar-foot">
          <div className="small">{user.email}</div>
          <button className="link" onClick={onSignOut}>Sign out</button>
        </div>
      </aside>

      <main>
        <header className="page-head">
          <div>
            <h1>Carrier performance</h1>
            {data?.tenant && (
              <p className="muted">
                {data.tenant.name} · {data.tenant.industry} · {data.tenant.plan} plan
              </p>
            )}
          </div>
          <div className="tenant-badge" title="Row Level Security reads the tenant from the login token">
            <span className="dot" /> tenant_id {user.tenantId} from login token
          </div>
        </header>

        {error && <p className="error">{error}</p>}
        {!view && !error && <p className="muted">Loading…</p>}

        {view && (
          <>
            <div className="filters">
              <div className="segmented" role="group" aria-label="Period">
                {PERIODS.map(p => (
                  <button key={p.id} className={p.id === period ? 'on' : ''} onClick={() => setPeriod(p.id)}>
                    {p.label}
                  </button>
                ))}
              </div>
              {carrierId && (
                <button className="chip" onClick={() => setCarrierId(null)}>
                  Carrier: {carrierName} <span aria-hidden="true">×</span>
                </button>
              )}
            </div>

            <section className="tiles">
              <Tile label="Deliveries" value={fmt.int(view.totals.deliveries)} />
              <Tile label="Late rate" value={fmt.pct(view.totals.latePct)} note={`${fmt.int(view.totals.late)} late`} />
              <Tile label="Cost per kg" value={fmt.money(view.totals.costPerKg)} />
              <Tile label="Avg. transit time" value={fmt.days(view.totals.avgDays)} />
            </section>

            <section className="grid">
              <div className="card">
                <h2>Late rate by carrier</h2>
                <p className="muted small">Click a carrier to filter the page.</p>
                <CarrierChart rows={view.carriers} selected={carrierId} onSelect={id => setCarrierId(id === carrierId ? null : id)} />
              </div>
              <div className="card">
                <h2>Monthly trend{carrierName ? ` · ${carrierName}` : ''}</h2>
                <p className="muted small">The last month may be incomplete.</p>
                <TrendCharts rows={view.months} />
              </div>
            </section>

            <section className="card">
              <h2>Carrier scorecard</h2>
              <table>
                <thead>
                  <tr>
                    <th>Carrier</th><th>Mode</th><th className="num">Deliveries</th><th className="num">Late rate</th>
                    <th className="num">Cost per kg</th><th className="num">Avg. days</th>
                  </tr>
                </thead>
                <tbody>
                  {view.carriers.map(c => (
                    <tr key={c.carrierId} className={c.carrierId === carrierId ? 'selected' : ''} onClick={() => setCarrierId(c.carrierId === carrierId ? null : c.carrierId)}>
                      <td>{c.carrier}</td><td>{c.mode}</td><td className="num">{fmt.int(c.deliveries)}</td>
                      <td className="num">{fmt.pct(c.latePct)}</td><td className="num">{fmt.money(c.costPerKg)}</td>
                      <td className="num">{fmt.days(c.avgDays)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section className="card">
              <h2>Latest shipments</h2>
              <table>
                <thead>
                  <tr><th>#</th><th>Created</th><th>Route</th><th>Carrier</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {data.shipments.map(s => (
                    <tr key={s.shipment_id}>
                      <td>{s.shipment_id}</td><td>{s.created_at}</td>
                      <td>{s.origin_city} → {s.destination_city}</td><td>{s.carriers?.name}</td>
                      <td><span className={`status status-${s.status}`}>{s.status.replace('_', ' ')}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section className="card how">
              <h2>How tenant isolation works</h2>
              <p>
                The app sends the same queries for every customer, with no tenant filter. Postgres Row Level Security
                reads <code>tenant_id</code> from the login token and returns only that customer's rows.
              </p>
              <pre>{`-- what the app asks for
SELECT * FROM kpi_carrier_month;

-- what the database enforces on every row
CREATE POLICY tenant_isolation ON shipments
FOR SELECT TO authenticated
USING (tenant_id = (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::int);`}</pre>
              {demoMode && <p className="muted small">Offline demo mode: showing a snapshot of the data each account can see.</p>}
            </section>
          </>
        )}
      </main>
    </div>
  )
}

function Tile({ label, value, note }) {
  return (
    <div className="tile">
      <div className="tile-label">{label}</div>
      <div className="tile-value">{value}</div>
      {note && <div className="muted small">{note}</div>}
    </div>
  )
}
