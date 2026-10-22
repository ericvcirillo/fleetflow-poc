import { ai, carriers, criteria, decisions, links, next, pains, sisense, steps, why } from './content.js'
import './landing.css'

const nav = [
  ['why', 'Why'],
  ['scenario', 'Scenario'],
  ['method', 'Method'],
  ['insight', 'Insight'],
  ['ai', 'AI'],
  ['decisions', 'Decisions'],
]

export default function Landing() {
  const maxLate = Math.max(...carriers.map(c => c.late))
  return (
    <div className="lp">
      <header className="lp-nav">
        <div className="lp-wrap lp-nav-row">
          <a href="#top" className="lp-brand">
            <Mark /> FleetFlow <span>PoC</span>
          </a>
          <nav aria-label="Sections">
            {nav.map(([id, label]) => (
              <a key={id} href={`#${id}`}>{label}</a>
            ))}
          </nav>
          <a className="lp-btn lp-btn-dark lp-btn-sm" href={links.demo}>Live demo</a>
        </div>
      </header>

      <main id="top">
        <section className="lp-hero">
          <div className="lp-wrap">
            <p className="lp-eyebrow">Case study · Embedded analytics PoC</p>
            <h1>
              Same dashboard.<br />
              <em>Different data.</em>
            </h1>
            <p className="lp-lead">
              A multi-tenant analytics proof of concept, built end to end the way a Solutions Engineer would run
              one for a prospect. By <a href={links.linkedin}>Eric Cirillo</a>.
            </p>
            <div className="lp-ctas">
              <a className="lp-btn lp-btn-dark" href={links.demo}>Open the live demo <Arrow /></a>
              <a className="lp-btn lp-btn-ghost" href={links.code}>View the code</a>
            </div>

            <div className="lp-shots" aria-label="The same dashboard for two different customers">
              <figure className="lp-shot lp-shot-back">
                <img src="/dashboard-harbor-fresh.png" alt="FleetFlow dashboard for Harbor Fresh: 37 deliveries, 16.2% late" />
                <figcaption><span className="lp-dot" /> Harbor Fresh · tenant 7 · 37 deliveries</figcaption>
              </figure>
              <figure className="lp-shot lp-shot-front">
                <img src="/dashboard-pampa-fresh.png" alt="FleetFlow dashboard for Pampa Fresh: 80 deliveries, 21.3% late" />
                <figcaption><span className="lp-dot" /> Pampa Fresh · tenant 12 · 80 deliveries</figcaption>
              </figure>
            </div>

            <dl className="lp-stats">
              <div><dt>Tenants</dt><dd>40</dd></div>
              <div><dt>Shipments</dt><dd>1,558</dd></div>
              <div><dt>Tables</dt><dd>6</dd></div>
              <div><dt>Success criteria met</dt><dd>4<small> / 5</small></dd></div>
            </dl>
          </div>
        </section>

        <Section id="why" n="01" label="Why I built this" title="A technical test I gave myself.">
          <div className="lp-why">
            {why.map((p, i) => (
              <p key={i} className={i === 0 ? 'lp-why-first' : ''}>{p}</p>
            ))}
          </div>
        </Section>

        <Section id="scenario" n="02" label="The scenario" title="FleetFlow wants analytics inside its product.">
          <p className="lp-text">
            FleetFlow is a B2B SaaS for shipment management. Its customers (tenants) are shippers who move freight
            through shared carriers. They keep asking “how are my carriers performing?”, and Customer Success
            answers with spreadsheets.
          </p>
          <div className="lp-pains">
            {pains.map(p => (
              <div key={p.value} className="lp-card">
                <div className="lp-pain-value">{p.value}</div>
                <p>{p.label}</p>
              </div>
            ))}
          </div>
          <h3 className="lp-h3">PoC success criteria</h3>
          <ul className="lp-criteria">
            {criteria.map(c => (
              <li key={c.t} className={c.done ? 'done' : ''}>
                <span className="lp-check" aria-hidden="true">{c.done ? <Check /> : null}</span>
                <div>
                  <strong>{c.t}</strong>
                  <span className={`lp-tag ${c.done ? 'lp-tag-met' : ''}`}>{c.done ? 'Met' : 'Next'}</span>
                  <p>{c.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="method" n="03" label="Methodology" title="Seven steps, from discovery to demo.">
          <ol className="lp-steps">
            {steps.map(s => (
              <li key={s.n} className="lp-step">
                <div className="lp-step-head">
                  <span className="lp-step-n">{s.n}</span>
                  <h3>{s.t}</h3>
                </div>
                <div className="lp-step-body">
                  <div>
                    <span className="lp-mini">What I did</span>
                    <p>{s.did}</p>
                  </div>
                  <div>
                    <span className="lp-mini">The concept</span>
                    <p>{s.concept}</p>
                  </div>
                  <div className="lp-call">
                    <span className="lp-mini">My call</span>
                    <p>{s.call}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <section id="insight" className="lp-section lp-dark">
          <div className="lp-wrap lp-insight">
            <div>
              <p className="lp-eyebrow lp-eyebrow-light"><span>04</span> The insight</p>
              <h2>The cheapest road carrier is also the least reliable.</h2>
              <p className="lp-text">
                NorthLine charges <b>$0.93 per kg</b>, less than the other road carriers ($1.03 and $1.24), but
                delivers <b>40.1% of shipments late</b>, against 8.9% to 12.6% for the others. In February 2026,
                the worst month, it caused 12 of the 25 late deliveries.
              </p>
              <p className="lp-text">
                A customer looking at its own dashboard can see this trade-off in two clicks, without asking anyone
                for a report.
              </p>
            </div>
            <figure className="lp-chart">
              <figcaption>Late rate by carrier, all tenants</figcaption>
              {carriers.map(c => (
                <div key={c.name} className={`lp-bar-row ${c.focus ? 'focus' : ''}`}>
                  <div className="lp-bar-label">
                    {c.name}
                    <span>{c.mode} · ${c.kg.toFixed(2)}/kg</span>
                  </div>
                  <div className="lp-bar-track">
                    <div className="lp-bar" style={{ width: `${(c.late / maxLate) * 100}%` }} />
                    <span className="lp-bar-value">{c.late.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </figure>
          </div>
        </section>

        <Section id="ai" n="05" label="How I worked with AI" title="AI was my pair, not my substitute.">
          <p className="lp-text">
            For every query I wrote it or explained it first. Then the AI corrected me and explained the concept
            with an example from this case. That is how I want to work: fast, and still able to defend every number.
          </p>
          <div className="lp-ai">
            <div className="lp-card">
              <h3>What AI did</h3>
              <ul>{ai.ai.map(x => <li key={x}>{x}</li>)}</ul>
            </div>
            <div className="lp-card lp-card-accent">
              <h3>What I did</h3>
              <ul>{ai.me.map(x => <li key={x}>{x}</li>)}</ul>
            </div>
          </div>
        </Section>

        <Section id="decisions" n="06" label="Decisions I can defend" title="The questions I expect, answered.">
          <div className="lp-faq">
            {decisions.map((d, i) => (
              <details key={d.q} open={i === 0}>
                <summary>{d.q}<Plus /></summary>
                <p>{d.a}</p>
              </details>
            ))}
          </div>
        </Section>

        <Section id="sisense" n="07" label="How this maps to Sisense" title="Same ideas, product-grade tools.">
          <div className="lp-map" role="table" aria-label="How the PoC maps to Sisense">
            <div className="lp-map-row lp-map-head" role="row">
              <span role="columnheader">In this PoC</span>
              <span role="columnheader">In Sisense</span>
            </div>
            {sisense.map(r => (
              <div key={r.here} className="lp-map-row" role="row">
                <span role="cell">{r.here}</span>
                <span role="cell">{r.there}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section id="next" n="08" label="What is next" title="Where this goes from here.">
          <ul className="lp-next">
            {next.map(x => <li key={x}>{x}</li>)}
          </ul>
        </Section>

        <section className="lp-cta">
          <div className="lp-wrap">
            <h2>See it for yourself.</h2>
            <p>Log in as either customer. Same app, same queries, different data.</p>
            <div className="lp-ctas">
              <a className="lp-btn lp-btn-light" href={links.demo}>Open the live demo <Arrow /></a>
              <a className="lp-btn lp-btn-outline-light" href={links.code}>View the code</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="lp-footer">
        <div className="lp-wrap lp-footer-row">
          <div>
            <strong>Eric Cirillo</strong> · Solutions Engineer
          </div>
          <nav aria-label="Contact">
            <a href={links.linkedin}>LinkedIn</a>
            <a href={links.site}>ericcirillo.com</a>
            <a href={links.code}>GitHub</a>
          </nav>
          <p>FleetFlow and its data are fictional, created for this case study.</p>
        </div>
      </footer>
    </div>
  )
}

function Section({ id, n, label, title, children }) {
  return (
    <section id={id} className="lp-section">
      <div className="lp-wrap">
        <p className="lp-eyebrow"><span>{n}</span> {label}</p>
        <h2>{title}</h2>
        {children}
      </div>
    </section>
  )
}

function Mark() {
  return (
    <svg width="22" height="22" viewBox="0 0 26 26" aria-hidden="true">
      <rect width="26" height="26" rx="7" fill="#0f3d3e" />
      <path d="M7 17h8M7 13h12M7 9h6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const Check = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
    <path d="M2.5 6.2l2.3 2.3 4.7-4.9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const Plus = () => (
  <svg className="lp-plus" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)
