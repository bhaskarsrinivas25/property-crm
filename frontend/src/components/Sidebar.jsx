import { NavLink } from 'react-router-dom'

const navigationItems = [
  { label: 'Dashboard', path: '/dashboard', icon: '⌂' },
  { label: 'Leads', path: '/leads', icon: '◎' },
  { label: 'Properties', path: '/properties', icon: '▦' },
  { label: 'Customers', path: '/customers', icon: '◌' },
  { label: 'Follow-ups', path: '/follow-ups', icon: '↻' },
  { label: 'Site Visits', path: '/site-visits', icon: '⌖' },
]

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">P</span>
        <span>Property CRM</span>
      </div>
      <nav className="sidebar-nav" aria-label="Main navigation">
        {navigationItems.map((item) => (
          <NavLink
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            key={item.path}
            to={item.path}
          >
            <span aria-hidden="true">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <NavLink
        className={({ isActive }) => `nav-item settings-link${isActive ? ' active' : ''}`}
        to="/settings"
      >
        <span aria-hidden="true">⚙</span>
        Settings
      </NavLink>
      <div className="sidebar-footer">
        <span className="status-dot" /> Workspace ready
      </div>
    </aside>
  )
}

export default Sidebar
