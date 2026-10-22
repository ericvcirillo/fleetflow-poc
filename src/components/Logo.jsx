export default function Logo({ light }) {
  return (
    <div className={`logo ${light ? 'logo-light' : ''}`}>
      <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
        <rect width="26" height="26" rx="7" fill="currentColor" />
        <path d="M7 17h8M7 13h12M7 9h6" stroke="var(--logo-ink)" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
      <span>FleetFlow</span>
    </div>
  )
}
