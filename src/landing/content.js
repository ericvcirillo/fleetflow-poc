export const links = {
  demo: '/demo',
  code: 'https://github.com/ericvcirillo/fleetflow-poc',
  linkedin: 'https://www.linkedin.com/in/ericirillo/',
  site: 'https://ericcirillo.com',
}

export const why = [
  'I am applying for a Solutions Engineer role in embedded analytics. I could have listed courses. Instead I gave myself a technical test: run a proof of concept the way an SE would run one for a prospect, end to end, with a real database and a live demo.',
  'I am not trying to become a SQL specialist overnight. What I wanted to show is how I learn and how I deliver: I pick a real problem, use AI to move fast, and make sure I understand and can defend every number that comes out.',
  'The rule I followed: for every query in the model, KPI and security steps, I wrote it or explained it first. Only then did the AI correct me and explain the concept, always with an example from this case. The mistakes I made along the way are part of what I learned.',
]

export const pains = [
  { value: '25 h', label: 'per week of manual reporting across 3 Customer Success analysts' },
  { value: '4', label: 'Enterprise deals lost or discounted in two quarters for lack of analytics' },
  { value: 'Q1 2027', label: 'renewal season for the largest Enterprise customers' },
]

export const criteria = [
  { t: 'Tenant isolation', d: 'The same dashboard shows each customer only its own rows, driven by the login.', done: true },
  { t: 'Operational dashboard', d: 'Late rate, cost per kg, transit time and carrier ranking, with filters.', done: true },
  { t: 'Embedded in the product', d: 'Running inside a React app styled as FleetFlow.', done: true },
  { t: 'One actionable insight', d: 'Found in the data, not assumed upfront.', done: true },
  { t: 'Executive dashboard', d: 'MRR, churn and adoption across all tenants, for FleetFlow leadership.', done: false },
]

export const steps = [
  {
    n: '01', t: 'Discovery',
    did: 'Wrote a one-page discovery summary: the company, the pain, four personas and five success criteria, agreed before building anything.',
    concept: 'Success criteria first. A PoC without them never ends.',
    call: 'I skipped the role-play and let AI invent the customer answers. I wanted my time on the technical part.',
  },
  {
    n: '02', t: 'Data',
    did: 'Created six tables in Postgres on Supabase: tenants, subscriptions, users, carriers, shipments and dashboard_views (a usage log). 1,558 fictional shipments across 40 customers.',
    concept: 'Multi-tenant SaaS: every customer shares the same tables, separated by a tenant_id column.',
    call: 'Supabase, because it is real Postgres with authentication built in, free, and runs in the browser.',
  },
  {
    n: '03', t: 'Model',
    did: 'Built fact_shipments, a view with one row per delivered shipment, plus derived columns: days to deliver, a late flag and cost per kg.',
    concept: 'Define the grain before writing SQL. Facts hold events and numbers; dimensions hold context (a star schema).',
    call: 'Late as a 0/1 flag, so AVG gives the rate and SUM gives the count.',
  },
  {
    n: '04', t: 'KPIs',
    did: 'Wrote the queries for late rate by carrier, a carrier scorecard, a monthly trend and a drill-down into the worst month.',
    concept: 'Ratios need weighted averages: SUM(cost) / SUM(weight), never AVG(cost_per_kg).',
    call: 'Check volume before trusting a percentage, and treat the last month as incomplete.',
  },
  {
    n: '05', t: 'Security',
    did: 'Wrote Row Level Security policies that read the tenant from the login token, then tested them by impersonating customers inside a rolled-back transaction.',
    concept: 'A view runs with its owner\'s rights by default, so a view owned by the admin silently bypasses RLS. I saw the leak, then fixed it with security_invoker.',
    call: 'Tenant stored in app_metadata, which only the server can change.',
  },
  {
    n: '06', t: 'Embed',
    did: 'A React app where each login sees its own dashboard. The queries have no tenant filter at all: the database does the filtering.',
    concept: 'The app reads a view of additive measures (sums), so any filter can be re-aggregated correctly.',
    call: 'The browser key is public by design. Security lives in the database, not in the front end.',
  },
  {
    n: '07', t: 'Story',
    did: 'Turned the numbers into one insight a customer would act on, and built the demo around it.',
    concept: 'A dashboard is only as good as the decision it changes.',
    call: 'Lead with the customer\'s problem, show the insight, then show how they find it on their own.',
  },
]

export const carriers = [
  { name: 'NorthLine Freight', mode: 'Road', late: 40.1, kg: 0.93, focus: true },
  { name: 'BlueWave Maritime', mode: 'Sea', late: 24.0, kg: 0.39 },
  { name: 'RodoSul Transportes', mode: 'Road', late: 12.6, kg: 1.03 },
  { name: 'AeroLink Air', mode: 'Air', late: 9.3, kg: 5.27 },
  { name: 'Expressa Cargo', mode: 'Road', late: 8.9, kg: 1.24 },
]

export const ai = {
  ai: [
    'Invented the fictional company, the discovery answers and the dataset.',
    'Explained each new concept with an example from this case.',
    'Reviewed and corrected my SQL, and pointed out traps such as the view that bypassed security.',
    'Built the React app and this page.',
  ],
  me: [
    'Chose the case, the scope and the stack, and what to leave out.',
    'Defined the grain and the columns of the fact view.',
    'Wrote the KPI queries and the security policies, and fixed my own errors.',
    'Checked every number against the database before it went on screen.',
  ],
}

export const decisions = [
  {
    q: 'Why SUM / SUM instead of AVG for cost per kg?',
    a: 'AVG gives a 10 kg shipment the same weight as a 1,000 kg one. The real cost per kg is total cost divided by total weight.',
  },
  {
    q: 'Why did the view need security_invoker?',
    a: 'By default a Postgres view runs with its owner\'s rights, and the owner is the admin, who bypasses RLS. With security_invoker it runs as the logged-in user, so the policies apply.',
  },
  {
    q: 'Why app_metadata and not user_metadata?',
    a: 'Users can edit their own user_metadata from the browser. If the tenant lived there, anyone could switch to a neighbour\'s data. Only the server can write app_metadata.',
  },
  {
    q: 'Isn\'t the API key in the browser a risk?',
    a: 'It is a publishable key, meant to be public. It only lets the browser talk to the API as an anonymous or signed-in user, and RLS decides which rows each of them gets. The secret key, which bypasses RLS, never leaves the server.',
  },
  {
    q: 'Why does the app view store sums instead of rates?',
    a: 'Sums can be added up for any slice (a year, a carrier) and divided at the end. Rates cannot: averaging monthly rates gives the wrong answer.',
  },
]

export const sisense = [
  { here: 'Postgres Row Level Security, tenant from the login token', there: 'Data security (row-level rules per user or group), with users signed in through SSO / JWT' },
  { here: 'fact_shipments view, recalculated on every query', there: 'Live model, which queries the database directly (an ElastiCube would import the data instead)' },
  { here: 'kpi_carrier_month: additive measures', there: 'Measures that re-aggregate correctly under any filter' },
  { here: 'React app calling the database through Supabase', there: 'Compose SDK components embedded in the customer\'s React app' },
]

export const next = [
  'Executive dashboard for FleetFlow: MRR, churn and adoption, with an admin role that sees every tenant.',
  'Rebuild the dashboard with the Sisense Compose SDK on the same data.',
  'Single sign-on from the host app instead of demo accounts.',
]
