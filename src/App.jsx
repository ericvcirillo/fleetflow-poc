import { useEffect, useState } from 'react'
import { currentUser, signOut } from './data.js'
import Login from './components/Login.jsx'
import Dashboard from './components/Dashboard.jsx'

export default function App() {
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    currentUser().then(setUser)
  }, [])

  if (user === undefined) return null
  if (!user) return <Login onSignIn={setUser} />
  return (
    <Dashboard
      user={user}
      onSignOut={async () => {
        await signOut()
        setUser(null)
      }}
    />
  )
}
