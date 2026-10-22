import { useState } from 'react'
import { DEMO_ACCOUNTS, DEMO_PASSWORD, demoMode, signIn } from '../data.js'
import Logo from './Logo.jsx'

export default function Login({ onSignIn }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e, account) {
    e?.preventDefault()
    setBusy(true)
    setError('')
    try {
      onSignIn(await signIn(account?.email ?? email, account ? DEMO_PASSWORD : password))
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <div className="login">
      <form className="login-card" onSubmit={submit}>
        <Logo />
        <h1>Sign in</h1>
        <p className="muted">Each account belongs to one customer of FleetFlow. Same dashboard, different data.</p>

        <div className="demo-accounts">
          {DEMO_ACCOUNTS.map(a => (
            <button type="button" key={a.email} className="demo-account" disabled={busy} onClick={e => submit(e, a)}>
              <span className="demo-name">{a.label}</span>
              <span className="muted small">{a.email}</span>
            </button>
          ))}
        </div>

        {!demoMode && (
          <>
            <div className="divider"><span>or</span></div>
            <label>
              Email
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </label>
            <label>
              Password
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </label>
            <button className="primary" disabled={busy}>Sign in</button>
          </>
        )}
        {error && <p className="error">{error}</p>}
        {demoMode && <p className="muted small">Offline demo mode: data comes from a snapshot of the database.</p>}
      </form>
    </div>
  )
}
