import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SummaryCard from '../components/SummaryCard'
import { getLeads } from '../services/leadService'
import { getProperties } from '../services/propertyService'
import { getCustomers } from '../services/customerService'
import { getFollowUps } from '../services/followUpService'

function StatusBadge({ children, tone = 'neutral' }) {
  return <span className={`status-badge ${tone}`}>{children}</span>
}

function getLeadTone(status) {
  return {
    NEW: 'blue',
    CONTACTED: 'neutral',
    INTERESTED: 'green',
    NEGOTIATION: 'orange',
    SITE_VISIT: 'violet',
    BOOKED: 'green',
    LOST: 'neutral',
  }[status] || 'neutral'
}

function getPropertyTone(status) {
  return status === 'AVAILABLE' ? 'green' : 'neutral'
}

function formatLabel(value) {
  if (!value) return '—'

  return value
    .toString()
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function formatDate(dateValue) {
  if (!dateValue) return '—'

  const date = new Date(`${dateValue}T00:00:00`)

  if (Number.isNaN(date.getTime())) return dateValue

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function getTodayDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function formatCurrency(value) {
  if (value === null || value === undefined || value === '') {
    return '—'
  }

  const number = Number(value)

  if (Number.isNaN(number)) return value

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(number)
}

function getErrorMessage(error) {
  if (error.response?.data?.message) {
    return error.response.data.message
  }

  if (error.response?.data?.error) {
    return error.response.data.error
  }

  if (error.message) {
    return error.message
  }

  return 'Unable to load dashboard data.'
}

function Dashboard() {
  const navigate = useNavigate()

  const [leads, setLeads] = useState([])
  const [properties, setProperties] = useState([])
  const [customers, setCustomers] = useState([])
  const [followUps, setFollowUps] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    try {
      setLoading(true)
      setError('')

      const [leadData, propertyData, customerData, followUpData] =
        await Promise.all([
          getLeads(),
          getProperties(),
          getCustomers(),
          getFollowUps(),
        ])

      setLeads(Array.isArray(leadData) ? leadData : [])
      setProperties(Array.isArray(propertyData) ? propertyData : [])
      setCustomers(Array.isArray(customerData) ? customerData : [])
      setFollowUps(Array.isArray(followUpData) ? followUpData : [])
    } catch (err) {
      console.error('Dashboard loading failed:', err)
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const today = getTodayDate()

  const availableProperties = useMemo(
    () => properties.filter((property) => property.status === 'AVAILABLE'),
    [properties],
  )

  const pendingFollowUps = useMemo(
    () => followUps.filter((followUp) => followUp.status === 'PENDING'),
    [followUps],
  )

  const todayFollowUps = useMemo(
    () =>
      followUps
        .filter(
          (followUp) =>
            followUp.followUpDate === today &&
            followUp.status === 'PENDING',
        )
        .sort((a, b) => a.id - b.id),
    [followUps, today],
  )

  const recentLeads = useMemo(
    () => [...leads].sort((a, b) => b.id - a.id).slice(0, 4),
    [leads],
  )

  const recentProperties = useMemo(
    () => [...properties].sort((a, b) => b.id - a.id).slice(0, 3),
    [properties],
  )

  const summaryCards = [
    {
      label: 'Total leads',
      value: loading ? '—' : leads.length,
      detail: 'All customer enquiries',
      icon: '◎',
      tone: 'orange',
    },
    {
      label: 'Available properties',
      value: loading ? '—' : availableProperties.length,
      detail: 'Currently available',
      icon: '⌂',
      tone: 'blue',
    },
    {
      label: 'Total customers',
      value: loading ? '—' : customers.length,
      detail: 'Customers in CRM',
      icon: '◉',
      tone: 'violet',
    },
    {
      label: 'Pending follow-ups',
      value: loading ? '—' : pendingFollowUps.length,
      detail: `${todayFollowUps.length} due today`,
      icon: '↻',
      tone: 'green',
    },
  ]

  return (
    <div className="dashboard-page">
      <section className="dashboard-intro">
        <div>
          <p className="eyebrow">
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>

          <h2>Dashboard</h2>

          <p className="muted">
            Overview of your property sales and customer activity.
          </p>
        </div>

        <button
          className="primary-button"
          type="button"
          onClick={() => navigate('/leads')}
        >
          + Add lead
        </button>
      </section>

      {error && (
        <div className="api-error" role="alert">
          <span>{error}</span>

          <button
            type="button"
            className="text-button"
            onClick={loadDashboard}
          >
            Try again
          </button>
        </div>
      )}

      <section className="summary-grid" aria-label="CRM summary">
        {summaryCards.map((card) => (
          <SummaryCard {...card} key={card.label} />
        ))}
      </section>

      <section className="dashboard-section panel">
        <div className="section-heading">
          <div>
            <h2>Recent leads</h2>
            <p className="muted">
              Latest customer enquiries and their next steps
            </p>
          </div>

          <button
            className="text-button"
            type="button"
            onClick={() => navigate('/leads')}
          >
            View all leads
          </button>
        </div>

        <div className="table-scroll">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>Property interest</th>
                <th>Source</th>
                <th>Status</th>
                <th>Updated</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="empty-state">
                    Loading leads...
                  </td>
                </tr>
              ) : recentLeads.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-state">
                    No leads found yet.
                  </td>
                </tr>
              ) : (
                recentLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      <strong>{lead.name}</strong>
                    </td>

                    <td>{lead.phone || '—'}</td>

                    <td>{lead.requirement || '—'}</td>

                    <td>{formatLabel(lead.leadSource)}</td>

                    <td>
                      <StatusBadge tone={getLeadTone(lead.status)}>
                        {formatLabel(lead.status)}
                      </StatusBadge>
                    </td>

                    <td>
                      {formatDate(
                        lead.updatedAt?.split?.('T')?.[0] ||
                          lead.createdAt?.split?.('T')?.[0],
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <div className="dashboard-lower-grid">
        <section className="dashboard-section panel">
          <div className="section-heading">
            <div>
              <h2>Recent properties</h2>
              <p className="muted">
                Listings recently added or updated
              </p>
            </div>

            <button
              className="text-button"
              type="button"
              onClick={() => navigate('/properties')}
            >
              View all properties
            </button>
          </div>

          <div className="table-scroll">
            <table className="crm-table properties-table">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Listing</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      Loading properties...
                    </td>
                  </tr>
                ) : recentProperties.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      No properties found yet.
                    </td>
                  </tr>
                ) : (
                  recentProperties.map((property) => (
                    <tr key={property.id}>
                      <td>
                        <strong>{property.title}</strong>
                      </td>

                      <td>{property.location || '—'}</td>

                      <td>{formatLabel(property.propertyType)}</td>

                      <td>{formatLabel(property.listingType)}</td>

                      <td>{formatCurrency(property.price)}</td>

                      <td>
                        <StatusBadge tone={getPropertyTone(property.status)}>
                          {formatLabel(property.status)}
                        </StatusBadge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="dashboard-section panel follow-up-panel">
          <div className="section-heading">
            <div>
              <h2>Today&apos;s follow-ups</h2>

              <p className="muted">
                Keep the pipeline moving
              </p>
            </div>

            <span className="count-label">
              {todayFollowUps.length} due
            </span>
          </div>

          <div className="follow-up-list">
            {loading ? (
              <div className="empty-state">
                Loading follow-ups...
              </div>
            ) : todayFollowUps.length === 0 ? (
              <div className="empty-state">
                No pending follow-ups for today.
              </div>
            ) : (
              todayFollowUps.map((followUp) => (
                <div
                  className="follow-up-item"
                  key={followUp.id}
                >
                  <div className="follow-up-marker orange" />

                  <div className="follow-up-details">
                    <strong>{followUp.customerName}</strong>

                    <span>
                      {formatLabel(followUp.type)}
                      {followUp.customerPhone
                        ? ` · ${followUp.customerPhone}`
                        : ''}
                    </span>
                  </div>

                  <div className="follow-up-action">
                    <time>{formatDate(followUp.followUpDate)}</time>

                    <StatusBadge tone="orange">
                      {formatLabel(followUp.status)}
                    </StatusBadge>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="follow-up-footer">
            <button
              className="text-button"
              type="button"
              onClick={() => navigate('/follow-ups')}
            >
              View all follow-ups
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Dashboard