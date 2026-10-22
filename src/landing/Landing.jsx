import { ai, carriers, criteria, decisions, links, next, pains, sisense, steps, why } from './content.js'
import './landing.css'

const BAR_MAX = 45

export default function Landing() {
  return (
    <div className="lp">
      <header className="lp-nav">
        <nav aria-label="Primary" className="lp-wrap lp-nav-row">
          <a href="#top" className="lp-brand">
            <span className="lp-brand-mark" aria-hidden="true" />
            <span className="lp-brand-name">Eric Cirillo</span>
            <span className="lp-brand-sub">/ FleetFlow PoC</span>
          </a>
          <div className="lp-nav-links">
            <a className="lp-nav-ghost" href={links.code}>Code</a>
            <a className="lp-nav-cta" href={links.demo}>Live demo</a>
          </div>
        </nav>
      </header>

      <main id="top">
        <section className="lp-wrap lp-hero" aria-labelledby="hero-title">
          <p className="lp-hero-eyebrow">
            <span className="lp-blue-dot" aria-hidden="true" />
            Case study · Embedded analytics PoC
          </p>
          <h1 id="hero-title">
            Same dashboard.<br />
            <span>Different data.</span>
          </h1>
          <div className="lp-hero-row">
            <p className="lp-hero-sub">
              A multi-tenant analytics proof of concept, built end to end the way a Solutions Engineer would run one
              for a prospect. By Eric Cirillo.
            </p>
            <div className="lp-buttons">
              <a className="lp-btn lp-btn-primary" href={links.demo}>
                Open the live demo <span aria-hidden="true">→</span>
              </a>
              <a className="lp-btn lp-btn-secondary" href={links.code}>
                View the code <span className="lp-btn-tag" aria-hidden="true">GitHub</span>
              </a>
            </div>
          </div>

          <div className="lp-shots">
            <figure className="lp-shot lp-shot-back">
              <figcaption><span className="lp-swatch lp-swatch-teal" aria-hidden="true" />Harbor Fresh, tenant 7</figcaption>
              <div className="lp-shot-frame">
                <img
                  src="/dashboard-harbor-fresh.png"
                  alt="FleetFlow carrier performance dashboard for Harbor Fresh, tenant 7: 37 deliveries, 16.2% late rate, $0.93 per kg."
                />
              </div>
            </figure>
            <figure className="lp-shot lp-shot-front">
              <figcaption><span className="lp-swatch lp-swatch-blue" aria-hidden="true" />Pampa Fresh, tenant 12</figcaption>
              <div className="lp-shot-frame">
                <img
                  src="/dashboard-pampa-fresh.png"
                  alt="The same FleetFlow dashboard for Pampa Fresh, tenant 12: 80 deliveries, 21.3% late rate, $0.78 per kg."
                />
              </div>
            </figure>
          </div>

          <dl className="lp-stats">
            <div><dt>tenants</dt><dd>40</dd></div>
            <div><dt>shipments</dt><dd>1,558</dd></div>
            <div><dt>tables</dt><dd>6</dd></div>
            <div><dt>success criteria met</dt><dd>4 <span>of 5</span></dd></div>
          </dl>
        </section>

        <Section id="why" eyebrow="02 — Motivation" title="Why I built this">
          <p className="lp-lead">{why[0]}</p>
          <p className="lp-muted">{why[1]}</p>
          <div className="lp-rule-block">
            <p className="lp-mono-label">The rule I followed</p>
            <p>{why[2].replace(/^The rule I followed: /, '').replace(/^f/, 'F')}</p>
          </div>
        </Section>

        <Section
          id="scenario"
          eyebrow="03 — Scenario"
          title="The prospect"
          aside={
            <p className="lp-lead">
              FleetFlow is a B2B SaaS for shipment management. Its customers (tenants) are shippers who move freight
              through shared carriers. They keep asking <em className="lp-quote">“how are my carriers performing?”</em> and
              Customer Success answers with spreadsheets.
            </p>
          }
          wide={
            <>
              <div className="lp-cards">
                {pains.map(p => (
                  <div key={p.value} className="lp-card">
                    <p className="lp-card-value">{p.value}</p>
                    <p className="lp-card-caption">{p.label.charAt(0).toUpperCase() + p.label.slice(1)}</p>
                  </div>
                ))}
              </div>
              <div className="lp-split lp-criteria-block">
                <div className="lp-split-left">
                  <h3 className="lp-h3">PoC success criteria</h3>
                  <p className="lp-mono-sub">Agreed before building · 4 of 5 met</p>
                </div>
                <ul className="lp-split-right lp-criteria">
                  {criteria.map(c => (
                    <li key={c.t}>
                      <span className={`lp-status ${c.done ? 'met' : ''}`}>
                        <span aria-hidden="true">{c.done ? '✓' : '○'}</span>
                        {c.done ? 'Met' : 'Next'}
                      </span>
                      <span>
                        <strong>{c.t}.</strong> <span className="lp-muted">{c.d}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          }
        />

        <Section
          id="method"
          eyebrow="04 — Methodology"
          title="Seven steps"
          aside={<p className="lp-muted">Each step records what I did, the concept behind it, and the call I made.</p>}
          wide={
            <ol className="lp-steps">
              {steps.map(s => (
                <li key={s.n} className="lp-split">
                  <div className="lp-split-left">
                    <span className="lp-step-n">{s.n}</span>
                    <h3 className="lp-step-title">{s.t}</h3>
                  </div>
                  <div className="lp-split-right lp-step-cols">
                    <div>
                      <p className="lp-step-label">What I did</p>
                      <p className="lp-step-did">{s.did}</p>
                    </div>
                    <div>
                      <p className="lp-step-label">The concept</p>
                      <p className="lp-step-concept">{s.concept}</p>
                    </div>
                    <div>
                      <p className="lp-step-label lp-teal">My call</p>
                      <p className="lp-step-did">{s.call}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          }
        />

        <section id="insight" className="lp-band" aria-labelledby="insight-title">
          <div className="lp-wrap">
            <p className="lp-eyebrow">05 — The insight</p>
            <h2 id="insight-title" className="lp-insight-title">The cheapest road carrier is also the least reliable.</h2>
            <div className="lp-insight-row">
              <div className="lp-insight-text">
                <p>
                  Across all 40 customers, NorthLine charges <strong>$0.93 per kg</strong>, less than the other road carriers ($1.03 and $1.24),
                  but delivers <strong>40.1% of shipments late</strong>, against 8.9% to 12.6% for the others.
                </p>
                <p>In February 2026, the worst month, it caused 12 of the 25 late deliveries.</p>
                <p className="lp-insight-close">
                  A customer looking at its own dashboard can see this trade-off in two clicks, without asking anyone
                  for a report.
                </p>
              </div>
              <figure className="lp-chart">
                <figcaption>
                  <span className="lp-chart-title">Late rate by carrier</span>
                  <span className="lp-mono-sub">% of shipments late · cost per kg</span>
                </figcaption>
                <div role="list">
                  {carriers.map(c => (
                    <div role="listitem" key={c.name} className={`lp-bar-row ${c.focus ? 'focus' : ''}`}>
                      <div className="lp-bar-name">
                        <div>{c.name}</div>
                        <div className="lp-bar-meta">{c.mode} · ${c.kg.toFixed(2)}/kg</div>
                      </div>
                      <div className="lp-bar-area">
                        <div className="lp-bar-track">
                          <div className="lp-bar" style={{ width: `${(c.late / BAR_MAX) * 100}%` }} />
                        </div>
                        <span className="lp-bar-value">{c.late.toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </figure>
            </div>
          </div>
        </section>

        <Section
          id="ai"
          eyebrow="06 — Process"
          title="How I worked with AI"
          aside={<p className="lp-lead">AI was my pair, not my substitute.</p>}
          wide={
            <div className="lp-ai">
              <div className="lp-ai-card">
                <h3>What AI did</h3>
                <ul>{ai.ai.map(x => <li key={x}>{x}</li>)}</ul>
              </div>
              <div className="lp-ai-card lp-ai-me">
                <h3>What I did</h3>
                <ul>{ai.me.map(x => <li key={x}>{x}</li>)}</ul>
              </div>
            </div>
          }
        />

        <Section id="decisions" eyebrow="07 — Q&A" title="Decisions I can defend">
          <div className="lp-faq">
            {decisions.map((d, i) => (
              <details key={d.q} open={i === 0}>
                <summary>
                  <span>{d.q}</span>
                  <span className="lp-chev" aria-hidden="true">+</span>
                </summary>
                <p>{d.a}</p>
              </details>
            ))}
          </div>
        </Section>

        <Section
          id="sisense"
          eyebrow="08 — Translation"
          title="How this maps to Sisense"
          wide={
            <div className="lp-table-card">
              <table>
                <thead>
                  <tr>
                    <th scope="col">In this PoC</th>
                    <th scope="col" className="lp-teal">In Sisense</th>
                  </tr>
                </thead>
                <tbody>
                  {sisense.map(r => (
                    <tr key={r.there}>
                      <td>{withCode(r.here)}</td>
                      <td>{r.there}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          }
        />

        <Section id="next" eyebrow="09 — Roadmap" title="What is next" last>
          <ol className="lp-next">
            {next.map(x => {
              const [lead, rest] = splitLead(x)
              return (
                <li key={x}>
                  <span className="lp-arrow" aria-hidden="true">→</span>
                  <span><strong>{lead}</strong> <span className="lp-muted">{rest}</span></span>
                </li>
              )
            })}
          </ol>
        </Section>
      </main>

      <footer className="lp-footer">
        <div className="lp-wrap">
          <div className="lp-footer-top">
            <div>
              <p className="lp-footer-name">Eric Cirillo</p>
              <p className="lp-footer-role">Solutions Engineer</p>
            </div>
            <a className="lp-btn lp-btn-light" href={links.demo}>
              Open the live demo <span aria-hidden="true">→</span>
            </a>
          </div>
          <div className="lp-footer-bottom">
            <nav aria-label="Contact">
              <a href={links.linkedin}>LinkedIn</a>
              <a href={links.site}>ericcirillo.com</a>
              <a href={links.code}>GitHub</a>
            </nav>
            <p>FleetFlow and its data are fictional.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Standard section: eyebrow + title on the left, content on the right.
// `wide` content spans the full container below the header row.
function Section({ id, eyebrow, title, aside, wide, children, last }) {
  return (
    <section id={id} className={`lp-wrap lp-section ${last ? 'lp-section-last' : ''}`} aria-labelledby={`${id}-title`}>
      <div className="lp-split">
        <div className="lp-split-left">
          <p className="lp-eyebrow">{eyebrow}</p>
          <h2 id={`${id}-title`}>{title}</h2>
        </div>
        <div className="lp-split-right">
          {aside}
          {children}
        </div>
      </div>
      {wide && <div className="lp-wide">{wide}</div>}
    </section>
  )
}

function withCode(text) {
  const m = text.match(/^(fact_shipments|kpi_carrier_month)(.*)$/)
  return m ? <><code>{m[1]}</code>{m[2]}</> : text
}

function splitLead(text) {
  const i = text.indexOf(': ')
  if (i > -1) return [text.slice(0, i + 1), text.slice(i + 2)]
  const j = text.search(/ (on the|instead of) /)
  return j > -1 ? [text.slice(0, j), text.slice(j + 1)] : [text, '']
}
