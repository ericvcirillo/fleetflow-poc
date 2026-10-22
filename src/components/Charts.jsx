import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { fmt } from '../metrics.js'

const BLUE = '#2a78d6'
const DIM = '#c9d0d5'
const GRID = '#eef0ee'
const AXIS = '#6b767e'
const MONO = "'JetBrains Mono', ui-monospace, monospace"
const monoTick = size => ({ fill: AXIS, fontSize: size, fontFamily: MONO })

function Tip({ active, payload, render }) {
  if (!active || !payload?.length) return null
  return <div className="tip">{render(payload[0].payload)}</div>
}

// Carrier names on the y axis, right-aligned, wrapped to two lines when long.
function CarrierTick({ x, y, payload }) {
  const words = String(payload.value).split(' ')
  const lines = payload.value.length > 15 && words.length > 1 ? [words.slice(0, -1).join(' '), words.at(-1)] : [payload.value]
  return (
    <text x={x} y={y} textAnchor="end" fill="#2f3b45" fontSize={12.5} fontFamily="DM Sans, system-ui, sans-serif">
      {lines.map((l, i) => (
        <tspan key={l} x={x} dy={i === 0 ? (lines.length > 1 ? -3 : 4) : 15}>{l}</tspan>
      ))}
    </text>
  )
}

export function CarrierChart({ rows, selected, onSelect }) {
  const max = Math.max(...rows.map(r => r.latePct ?? 0))
  const top = Math.max(10, Math.ceil((max + 0.001) / 10) * 10)
  const step = top <= 50 ? 10 : 20
  const ticks = Array.from({ length: Math.floor(top / step) + 1 }, (_, i) => i * step)
  const lit = r => !selected || selected === r.carrierId

  return (
    <ResponsiveContainer width="100%" height={rows.length * 46 + 36}>
      <BarChart data={rows} layout="vertical" margin={{ top: 4, right: 52, bottom: 0, left: 0 }} barSize={26}>
        <CartesianGrid horizontal={false} stroke={GRID} />
        <XAxis type="number" domain={[0, top]} ticks={ticks} tickFormatter={v => `${v}%`} tick={monoTick(11)} tickLine={false} axisLine={false} />
        <YAxis type="category" dataKey="carrier" width={120} tick={<CarrierTick />} tickLine={false} axisLine={false} interval={0} />
        <Tooltip
          cursor={{ fill: '#eef3fa' }}
          content={
            <Tip
              render={c => (
                <>
                  <strong>{c.carrier}</strong>
                  <span>Late rate {fmt.pct(c.latePct)}</span>
                  <span>{fmt.int(c.late)} late of {fmt.int(c.deliveries)}</span>
                  <span>Cost per kg {fmt.money(c.costPerKg)}</span>
                </>
              )}
            />
          }
        />
        <Bar dataKey="latePct" radius={[0, 4, 4, 0]} cursor="pointer" onClick={d => onSelect(d.carrierId ?? d.payload?.carrierId)} isAnimationActive={false}>
          {rows.map(r => (
            <Cell key={r.carrierId} fill={lit(r) ? BLUE : DIM} />
          ))}
          <LabelList
            dataKey="latePct"
            position="right"
            content={({ x, y, width, height, value, index }) => (
              <text
                x={x + width + 8}
                y={y + height / 2}
                dominantBaseline="central"
                fontSize={12}
                fontFamily={MONO}
                fill={lit(rows[index]) ? '#2f3b45' : '#98a2a9'}
              >
                {fmt.pct(value)}
              </text>
            )}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

// Two stacked charts on the same months: late rate (line) over deliveries (bars).
// They share a syncId, so hovering one highlights the same month in both.
export function TrendCharts({ rows }) {
  const narrow = useNarrow()
  const data = rows.map((m, i) => ({
    ...m,
    rate: m.deliveries ? m.latePct : null,
    count: m.deliveries || null,
    // A month with empty months on both sides: the line has no segment there,
    // so it gets a small dot instead of disappearing.
    lone: Boolean(m.deliveries) && !rows[i - 1]?.deliveries && !rows[i + 1]?.deliveries,
  }))
  const maxRate = Math.max(0, ...data.map(d => d.rate ?? 0))
  const rateTop = maxRate <= 60 ? 60 : 100
  const rateTicks = rateTop === 60 ? [0, 15, 30, 45, 60] : [0, 25, 50, 75, 100]
  const maxCount = Math.max(4, Math.ceil(Math.max(0, ...data.map(d => d.count ?? 0)) / 4) * 4)
  const countTicks = [0, maxCount / 2, maxCount]
  const last = data.length - 1
  const every = narrow ? 6 : 3
  const monthTicks = data.filter((_, i) => (last - i) % every === 0).map(d => d.month)
  const margin = { top: 6, right: 20, bottom: 0, left: 0 }
  const yAxis = { tickLine: false, axisLine: false, width: 40, tick: monoTick(10.5) }

  return (
    <div className="trend">
      <div className="mini-title">Late rate</div>
      <ResponsiveContainer width="100%" height={136}>
        <LineChart data={data} margin={margin} syncId="trend">
          <CartesianGrid vertical={false} stroke={GRID} />
          <XAxis dataKey="month" hide />
          <YAxis {...yAxis} domain={[0, rateTop]} ticks={rateTicks} tickFormatter={v => `${v}%`} />
          <Tooltip
            cursor={{ stroke: 'rgba(42,120,214,.25)', strokeWidth: 1 }}
            content={
              <Tip
                render={m => (
                  <>
                    <strong>{fmt.month(m.month)}</strong>
                    {m.deliveries ? (
                      <>
                        <span>Late rate {fmt.pct(m.latePct)}</span>
                        <span>{fmt.int(m.late)} late of {fmt.int(m.deliveries)}</span>
                      </>
                    ) : (
                      <span>No deliveries</span>
                    )}
                  </>
                )}
              />
            }
          />
          <Line
            dataKey="rate"
            stroke={BLUE}
            strokeWidth={2}
            dot={({ cx, cy, index, payload }) =>
              payload?.lone ? <circle key={index} cx={cx} cy={cy} r={2.5} fill={BLUE} /> : <g key={index} />
            }
            connectNulls={false}
            activeDot={{ r: 4.5, fill: '#fff', stroke: BLUE, strokeWidth: 2 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mini-title">Deliveries</div>
      <ResponsiveContainer width="100%" height={100}>
        <BarChart data={data} margin={margin} syncId="trend" barCategoryGap={1.5}>
          <CartesianGrid vertical={false} stroke={GRID} />
          <XAxis
            dataKey="month"
            ticks={monthTicks}
            interval={0}
            tickFormatter={fmt.month}
            tick={monoTick(10.5)}
            tickLine={false}
            axisLine={false}
            height={24}
          />
          <YAxis {...yAxis} domain={[0, maxCount]} ticks={countTicks} allowDecimals={false} />
          <Tooltip cursor={{ fill: 'rgba(42,120,214,.07)' }} content={() => null} />
          <Bar dataKey="count" fill={BLUE} radius={[3, 3, 0, 0]} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// On phone widths, label every 6th month instead of every 3rd so labels don't collide.
function useNarrow() {
  const query = '(max-width: 600px)'
  const [narrow, setNarrow] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setNarrow(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return narrow
}
