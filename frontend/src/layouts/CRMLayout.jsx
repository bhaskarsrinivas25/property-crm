import { Outlet, useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/leads': 'Leads',
  '/properties': 'Properties',
  '/customers': 'Customer Management',
  '/follow-ups': 'Follow-up Management',
  '/site-visits': 'Site Visits',
  '/settings': 'Settings',
}

function CRMLayout() {
  const location = useLocation()
  const title = pageTitles[location.pathname] || 'Dashboard'

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <Header title={title} />
        <Outlet />
      </main>
    </div>
  )
}

export default CRMLayout
