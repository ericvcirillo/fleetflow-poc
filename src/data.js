// Data access. With Supabase configured, every query runs as the logged-in user,
// and Row Level Security in Postgres decides which rows come back.
// None of the queries below filter by tenant: the database does it.
import { createClient } from '@supabase/supabase-js'
import tenant7 from './fixtures/t7.json'
import tenant12 from './fixtures/t12.json'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// No persisted session: every visit to the demo starts at the login screen,
// so visitors always pick a customer and see isolation from the start.
export const supabase = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null
export const demoMode = !supabase

export const DEMO_ACCOUNTS = [
  { email: 'ops@tenant7.test', label: 'Harbor Fresh', tenantId: 7 },
  { email: 'ops@tenant12.test', label: 'Pampa Fresh', tenantId: 12 },
]
export const DEMO_PASSWORD = import.meta.env.VITE_DEMO_PASSWORD || ''

const fixtures = { 7: tenant7, 12: tenant12 }

export async function signIn(email, password) {
  if (demoMode) {
    const account = DEMO_ACCOUNTS.find(a => a.email === email)
    if (!account) throw new Error('Unknown demo account')
    return { email, tenantId: account.tenantId }
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return sessionUser(data.session)
}

export async function signOut() {
  if (supabase) await supabase.auth.signOut()
}

export async function currentUser() {
  if (demoMode) return null
  const { data } = await supabase.auth.getSession()
  return data.session ? sessionUser(data.session) : null
}

function sessionUser(session) {
  return {
    email: session.user.email,
    tenantId: session.user.app_metadata?.tenant_id ?? null,
  }
}

export async function loadDashboard(user) {
  if (demoMode) return fixtures[user.tenantId]

  const [tenant, kpi, shipments] = await Promise.all([
    supabase.from('tenants').select('tenant_id, name, country, industry, plan').maybeSingle(),
    supabase.from('kpi_carrier_month').select('*'),
    supabase
      .from('shipments')
      .select('shipment_id, created_at, status, carrier_id, origin_city, destination_city, carriers(name)')
      .order('created_at', { ascending: false })
      .order('shipment_id', { ascending: false }),
  ])
  for (const r of [tenant, kpi, shipments]) if (r.error) throw r.error
  return { tenant: tenant.data, kpi: kpi.data, shipments: shipments.data }
}
