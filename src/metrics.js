// The view kpi_carrier_month stores sums, not averages, so any slice
// (a period, a carrier) can be re-aggregated correctly:
// rates are SUM(part) / SUM(whole), never an average of averages.

export function summarize(rows) {
  const t = rows.reduce(
    (a, r) => ({
      deliveries: a.deliveries + Number(r.deliveries),
      late: a.late + Number(r.late_deliveries),
      cost: a.cost + Number(r.total_cost),
      weight: a.weight + Number(r.total_weight_kg),
      days: a.days + Number(r.total_days),
    }),
    { deliveries: 0, late: 0, cost: 0, weight: 0, days: 0 }
  )
  return {
    deliveries: t.deliveries,
    late: t.late,
    latePct: t.deliveries ? (100 * t.late) / t.deliveries : null,
    costPerKg: t.weight ? t.cost / t.weight : null,
    avgDays: t.deliveries ? t.days / t.deliveries : null,
  }
}

export function byCarrier(rows) {
  const groups = new Map()
  for (const r of rows) {
    const g = groups.get(r.carrier_id) ?? { carrierId: r.carrier_id, carrier: r.carrier, mode: r.mode, rows: [] }
    g.rows.push(r)
    groups.set(r.carrier_id, g)
  }
  return [...groups.values()]
    .map(g => ({ carrierId: g.carrierId, carrier: g.carrier, mode: g.mode, ...summarize(g.rows) }))
    .sort((a, b) => b.latePct - a.latePct)
}

export function byMonth(rows, allMonths) {
  const groups = new Map(allMonths.map(m => [m, []]))
  for (const r of rows) groups.get(r.month.slice(0, 7))?.push(r)
  return [...groups.entries()].map(([month, rs]) => ({ month, ...summarize(rs) }))
}

// The months on the trend axis: from January of the first year in the data
// to the last month with data, narrowed to one year when a year is picked.
// Months with no shipments stay on the axis and show as gaps.
export function monthRange(rows, period = 'all') {
  const keys = rows.map(r => r.month.slice(0, 7)).sort()
  if (!keys.length) return []
  const last = keys[keys.length - 1]
  let y = period === 'all' ? Number(keys[0].slice(0, 4)) : Number(period)
  let m = 1
  const out = []
  for (;;) {
    const key = `${y}-${String(m).padStart(2, '0')}`
    if (key > last || (period !== 'all' && y > Number(period))) return out
    out.push(key)
    m === 12 ? ((y += 1), (m = 1)) : (m += 1)
  }
}

export const PERIODS = [
  { id: 'all', label: 'All time', test: () => true },
  { id: '2025', label: '2025', test: m => m.startsWith('2025') },
  { id: '2026', label: '2026', test: m => m.startsWith('2026') },
]

export const fmt = {
  int: v => (v == null ? '–' : v.toLocaleString('en-US')),
  pct: v => (v == null ? '–' : `${v.toFixed(1)}%`),
  money: v => (v == null ? '–' : `$${v.toFixed(2)}`),
  days: v => (v == null ? '–' : `${v.toFixed(1)} d`),
  month: m => new Date(`${m}-01T12:00:00`).toLocaleString('en-US', { month: 'short', year: '2-digit' }),
}
