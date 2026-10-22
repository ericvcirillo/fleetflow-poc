import { useEffect, useMemo, useState } from 'react'
import { loadDashboard, demoMode } from '../data.js'
import { byCarrier, byMonth, fmt, monthRange, PERIODS, summarize } from '../metrics.js'
import Logo from './Logo.jsx'
import { CarrierChart, TrendCharts } from './Charts.jsx'

const NAV = ['Shipments', 'Carriers', 'Analytics', 'Settings']
const STATUS = { delivered: 'Delivered', in_transit: 'In transit', cancelled: 'Cancelled' }

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
    const shipments = data.shipments.filter(
      s => test(s.created_at) && (!carrierId || s.carrier_id === carrierId)
    )
    return {
      totals: summarize(selected),
      carriers: byCarrier(inPeriod),
      months: byMonth(selected, monthRange(data.kpi, period)),
      shipments: shipments.slice(0, 8),
    }
  }, [data, period, carrierId])

  const carrierName = data?.kpi.find(r => r.carrier_id === carrierId)?.carrier
  const toggleCarrier = id => setCarrierId(id === carrierId ? null : id)
  const clearFilters = () => {
    setPeriod('all')
    setCarrierId(null)
  }
  const empty = view && view.totals.deliveries === 0

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sidebar-top">
          <Logo light />
          <button className="signout signout-top" onClick={onSignOut}>Sign out</button>
        </div>
        <nav aria-label="FleetFlow">
          {NAV.map(n => (
            <a key={n} className={n === 'Analytics' ? 'active' : ''} aria-current={n === 'Analytics' ? 'page' : undefined}>
              {n}
            </a>
          ))}
          <a className="nav-about" href="/">← About</a>
        </nav>
        <a className="sidebar-back" href="/">← About this project</a>
        <div className="sidebar-foot">
          <span className="sidebar-email">{user.email}</span>
          <button className="signout" onClick={onSignOut}>Sign out</button>
        </div>
      </aside>

      <main>
        <header className="page-head">
          <div className="page-title">
            <h1>Carrier performance</h1>
            {data?.tenant && (
              <p>
                {data.tenant.name} · {data.tenant.industry} · {data.tenant.plan} plan
              </p>
            )}
          </div>
          <div className="head-actions">
            <a className="tenant-badge" href="#isolation" title="Row Level Security reads the tenant from the login token">
              <span className="dot" aria-hidden="true" />
              <span><strong>tenant_id {user.tenantId}</strong> from login token</span>
            </a>
            <button className="ghost-btn" onClick={onSignOut}>Switch customer</button>
            <a className="ghost-btn" href="/">← Case study</a>
          </div>
        </header>

        <div className="filters">
          <div className="segmented" role="group" aria-label="Period">
            {PERIODS.map(p => (
              <button key={p.id} aria-pressed={p.id === period} onClick={() => setPeriod(p.id)}>
                {p.label}
              </button>
            ))}
          </div>
          {carrierId && (
            <span className="chip">
              <span>Carrier: <strong>{carrierName}</strong></span>
              <button aria-label="Remove carrier filter" onClick={() => setCarrierId(null)}>×</button>
            </span>
          )}
        </div>

        {error && <p className="error" role="alert">{error}</p>}
        {!view && !error && <Skeleton />}

        {view && (
          <>
            <section className="tiles" aria-label="Key figures">
              <Tile label="Deliveries" value={fmt.int(view.totals.deliveries)} />
              <Tile label="Late rate" value={fmt.pct(view.totals.latePct)} note={empty ? '' : `${fmt.int(view.totals.late)} late`} />
              <Tile label="Cost per kg" value={fmt.money(view.totals.costPerKg)} />
              <Tile label="Avg. transit time" value={fmt.days(view.totals.avgDays)} />
            </section>

            <section className="charts">
              <div className="card">
                <CardHead title="Late rate by carrier" sub="Click a carrier to filter the page." />
                {view.carriers.length ? (
                  <CarrierChart rows={view.carriers} selected={carrierId} onSelect={toggleCarrier} />
                ) : (
                  <Empty onClear={clearFilters} />
                )}
              </div>
              <div className="card">
                <CardHead title={`Monthly trend${carrierName ? ` · ${carrierName}` : ''}`} sub="The last month may be incomplete." />
                {empty ? <Empty /> : <TrendCharts rows={view.months} />}
              </div>
            </section>

            <section className="card">
              <CardHead title="Carrier scorecard" />
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th scope="col">Carrier</th>
                      <th scope="col">Mode</th>
                      <th scope="col" className="num">Deliveries</th>
                      <th scope="col" className="num">Late rate</th>
                      <th scope="col" className="num">Cost per kg</th>
                      <th scope="col" className="num">Avg. days</th>
                    </tr>
                  </thead>
                  <tbody>
                    {view.carriers.map(c => (
                      <tr
                        key={c.carrierId}
                        className={`clickable ${c.carrierId === carrierId ? 'selected' : ''}`}
                        tabIndex={0}
                        aria-selected={c.carrierId === carrierId}
                        onClick={() => toggleCarrier(c.carrierId)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            toggleCarrier(c.carrierId)
                          }
                        }}
                      >
                        <td className="strong">{c.carrier}</td>
                        <td>{c.mode}</td>
                        <td className="num">{fmt.int(c.deliveries)}</td>
                        <td className="num">{fmt.pct(c.latePct)}</td>
                        <td className="num">{fmt.money(c.costPerKg)}</td>
                        <td className="num">{fmt.days(c.avgDays)}</td>
                      </tr>
                    ))}
                    {!view.carriers.length && <EmptyRow cols={6} />}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="card">
              <CardHead title="Latest shipments" />
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Created</th>
                      <th scope="col">Route</th>
                      <th scope="col">Carrier</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {view.shipments.map(s => (
                      <tr key={s.shipment_id}>
                        <td className="mono">{s.shipment_id}</td>
                        <td className="soft">{s.created_at}</td>
                        <td>{s.origin_city} → {s.destination_city}</td>
                        <td>{s.carriers?.name}</td>
                        <td>
                          <span className={`status status-${s.status}`}>
                            <span className="status-dot" aria-hidden="true" />
                            {STATUS[s.status] ?? s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {!view.shipments.length && <EmptyRow cols={5} />}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="card how" id="isolation">
              <div className="card-head-row">
                <h2>How tenant isolation works</h2>
                <span className="pill-mono pill-green">Postgres RLS</span>
              </div>
              <p>
                The app sends the same queries for every customer, with no tenant filter. Postgres Row Level Security
                reads <code>tenant_id</code> from the login token and returns only that customer's rows.
              </p>
              <pre className="code">
                <code>
                  <span className="c-com">-- what the app asks for</span>
                  {'\n'}<span className="c-kw">SELECT</span> * <span className="c-kw">FROM</span> kpi_carrier_month;
                  {'\n\n'}<span className="c-com">-- what the database enforces on every row</span>
                  {'\n'}<span className="c-kw">CREATE POLICY</span> tenant_isolation <span className="c-kw">ON</span> shipments
                  {'\n'}<span className="c-kw">FOR SELECT TO</span> authenticated
                  {'\n'}<span className="c-kw">USING</span> (tenant_id = (auth.jwt() -&gt; <span className="c-str">'app_metadata'</span> -&gt;&gt;{' '}
                  <span className="c-str">'tenant_id'</span>)::int);
                </code>
              </pre>
              <p className="foot">
                {demoMode
                  ? 'Offline demo mode: showing a snapshot of the data each account can see.'
                  : 'Live data: every query above runs as the signed-in user.'}
              </p>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

function CardHead({ title, sub }) {
  return (
    <div className="card-head">
      <h2>{title}</h2>
      {sub && <p>{sub}</p>}
    </div>
  )
}

function Tile({ label, value, note = '' }) {
  return (
    <div className="tile">
      <div className="tile-label">{label}</div>
      <div className="tile-value">{value}</div>
      <div className="tile-note">{note}</div>
    </div>
  )
}

function Empty({ onClear }) {
  return (
    <div className="empty">
      <p className="empty-title">No shipments match these filters</p>
      <p>Try another period or remove the carrier filter.</p>
      {onClear && <button className="ghost-btn" onClick={onClear}>Clear filters</button>}
    </div>
  )
}

function EmptyRow({ cols }) {
  return (
    <tr>
      <td colSpan={cols} className="empty-row">No shipments match these filters.</td>
    </tr>
  )
}

function Skeleton() {
  return (
    <div className="skeleton" aria-busy="true">
      <span className="sr-only">Loading carrier performance</span>
      <div className="tiles">
        {[0, 1, 2, 3].map(i => <div key={i} className="sk sk-tile" />)}
      </div>
      <div className="charts">
        <div className="sk sk-chart" />
        <div className="sk sk-chart" />
      </div>
      <div className="sk sk-table" />
    </div>
  )
}
