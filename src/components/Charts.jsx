import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { fmt } from '../metrics.js'

const axis = { stroke: 'var(--text-muted)', fontSize: 12, tickLine: false, axisLine: false }

function Tip({ active, payload, render }) {
  if (!active || !payload?.length) return null
  return <div className="tip">{render(payload[0].payload)}</div>
}

export function CarrierChart({ rows, selected, onSelect }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={rows} layout="vertical" margin={{ left: 8, right: 40 }} barCategoryGap={6}>
        <CartesianGrid horizontal={false} stroke="var(--grid)" />
        <XAxis type="number" {...axis} unit="%" domain={[0, 'auto']} />
        <YAxis type="category" dataKey="carrier" {...axis} width={130} />
        <Tooltip
          cursor={{ fill: 'var(--hover)' }}
          content={
            <Tip
              render={c => (
                <>
                  <strong>{c.carrier}</strong>
                  <div>Late rate {fmt.pct(c.latePct)}</div>
                  <div>{fmt.int(c.late)} late of {fmt.int(c.deliveries)}</div>
                  <div>Cost per kg {fmt.money(c.costPerKg)}</div>
                </>
              )}
            />
          }
        />
        <Bar
          dataKey="latePct"
          radius={[0, 4, 4, 0]}
          label={{ position: 'right', fontSize: 12, fill: 'var(--text-secondary)', formatter: v => fmt.pct(v) }}
          onClick={d => onSelect(d.carrierId ?? d.payload?.carrierId)}
          cursor="pointer"
        >
          {rows.map(r => (
            <Cell key={r.carrierId} fill={!selected || selected === r.carrierId ? 'var(--series-1)' : 'var(--muted-mark)'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export function TrendCharts({ rows }) {
  return (
    <>
      <div className="mini-title">Late rate</div>
      <ResponsiveContainer width="100%" height={130}>
        <LineChart data={rows} margin={{ left: 0, right: 12, top: 6 }}>
          <CartesianGrid vertical={false} stroke="var(--grid)" />
          <XAxis dataKey="month" {...axis} tickFormatter={fmt.month} minTickGap={16} />
          <YAxis {...axis} unit="%" width={44} />
          <Tooltip
            cursor={{ stroke: 'var(--text-muted)' }}
            content={<Tip render={m => (<><strong>{fmt.month(m.month)}</strong><div>Late rate {fmt.pct(m.latePct)}</div><div>{fmt.int(m.late)} late of {fmt.int(m.deliveries)}</div></>)} />}
          />
          <Line dataKey="latePct" stroke="var(--series-1)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
      <div className="mini-title">Deliveries</div>
      <ResponsiveContainer width="100%" height={100}>
        <BarChart data={rows} margin={{ left: 0, right: 12 }} barCategoryGap={2}>
          <CartesianGrid vertical={false} stroke="var(--grid)" />
          <XAxis dataKey="month" {...axis} tickFormatter={fmt.month} minTickGap={16} />
          <YAxis {...axis} width={44} allowDecimals={false} />
          <Tooltip
            cursor={{ fill: 'var(--hover)' }}
            content={<Tip render={m => (<><strong>{fmt.month(m.month)}</strong><div>{fmt.int(m.deliveries)} deliveries</div></>)} />}
          />
          <Bar dataKey="deliveries" fill="var(--series-1)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </>
  )
}
