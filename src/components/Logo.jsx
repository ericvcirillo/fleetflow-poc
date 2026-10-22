// FleetFlow mark: a rounded square with three bars of decreasing length.
// `light` inverts it for the teal sidebar.
export default function Logo({ light }) {
  return (
    <div className={`logo ${light ? 'logo-light' : ''}`}>
      <span className="logo-mark" aria-hidden="true">
        <span style={{ width: 14 }} />
        <span style={{ width: 10 }} />
        <span style={{ width: 7 }} />
      </span>
      <span className="logo-name">FleetFlow</span>
    </div>
  )
}
