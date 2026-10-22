import { useState } from 'react'
import { DEMO_ACCOUNTS, DEMO_PASSWORD, demoMode, signIn } from '../data.js'
import Logo from './Logo.jsx'

const ERROR = 'Email or password is incorrect. Try one of the demo accounts above.'

export default function Login({ onSignIn }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  // Demo account buttons sign in with the shared demo password.
  // The form needs a password; in offline mode any non-empty one works.
  async function attempt(address, pass, fromForm) {
    setBusy(true)
    setError('')
    try {
      if (fromForm && !pass) throw new Error(ERROR)
      onSignIn(await signIn(address, pass))
    } catch {
      setError(ERROR)
      setBusy(false)
    }
  }

  function edit(setter) {
    return e => {
      setter(e.target.value)
      if (error) setError('')
    }
  }

  return (
    <main className="login">
      <div className="login-card">
        <div className="login-top">
          <Logo />
          <span className="pill-mono">Demo</span>
        </div>

        <div className="login-title">
          <h1>Sign in</h1>
          <p>Each account belongs to one customer of FleetFlow. Same dashboard, different data.</p>
        </div>

        <div className="accounts">
          <div className="accounts-head">
            <span className="accounts-label">Pick a customer</span>
            <span className="accounts-hint">Try both and compare</span>
          </div>
          {DEMO_ACCOUNTS.map(a => (
            <button type="button" key={a.email} className="account" disabled={busy} onClick={() => attempt(a.email, DEMO_PASSWORD)}>
              <span className="account-initials" aria-hidden="true">{initials(a.label)}</span>
              <span className="account-text">
                <span className="account-name">{a.label}</span>
                <span className="account-email">{a.email}</span>
              </span>
              <span className="account-end">
                <span className="account-tag">tenant {a.tenantId}</span>
                <span aria-hidden="true" className="account-arrow">→</span>
              </span>
            </button>
          ))}
        </div>

        <div className="divider"><span>or</span></div>

        <form
          className="login-form"
          onSubmit={e => {
            e.preventDefault()
            attempt(email.trim(), password, true)
          }}
        >
          <label>
            Email
            <input type="email" autoComplete="username" placeholder="ops@tenant7.test" value={email} onChange={edit(setEmail)} required />
          </label>
          <label>
            Password
            <input type="password" autoComplete="current-password" value={password} onChange={edit(setPassword)} required />
          </label>
          <button className="primary" disabled={busy}>Sign in</button>
          {error && <p className="login-error" role="alert">{error}</p>}
        </form>

        <p className="login-foot">
          {demoMode
            ? 'Offline demo mode: data comes from a snapshot of the database.'
            : 'Live data from Postgres. Row Level Security decides which rows each account can see.'}
        </p>
      </div>

      <a className="login-back" href="/">← About this project</a>
    </main>
  )
}

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}
