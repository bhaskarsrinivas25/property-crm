import { Navigate, Route, Routes } from 'react-router-dom'
import CRMLayout from './layouts/CRMLayout'
import Dashboard from './pages/Dashboard'
import Leads from './pages/Leads'
import Properties from './pages/Properties'
import Customers from './pages/Customers'
import FollowUps from './pages/FollowUps'
import SiteVisits from './pages/SiteVisits'
import PlaceholderPage from './pages/PlaceholderPage'

function App() {
  return (
    <Routes>
      <Route element={<CRMLayout />}>
        <Route
          index
          element={<Navigate replace to="/dashboard" />}
        />

        <Route
          path="dashboard"
          element={<Dashboard />}
        />

        <Route
          path="leads"
          element={<Leads />}
        />

        <Route
          path="properties"
          element={<Properties />}
        />

        <Route
          path="customers"
          element={<Customers />}
        />

        <Route
          path="follow-ups"
          element={<FollowUps />}
        />

        <Route
          path="site-visits"
          element={<SiteVisits />}
        />

        <Route
          path="settings"
          element={
            <PlaceholderPage
              title="Settings"
              description="Workspace preferences will be available here."
            />
          }
        />
      </Route>
    </Routes>
  )
}

export default App