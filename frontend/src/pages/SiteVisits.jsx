import { useEffect, useMemo, useState } from 'react'
import SiteVisitForm from '../components/SiteVisitForm'
import SiteVisitTable from '../components/SiteVisitTable'
import {
  createSiteVisit,
  deleteSiteVisit,
  getSiteVisits,
  updateSiteVisit,
} from '../services/siteVisitService'

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

  return 'Something went wrong. Please try again.'
}

function SiteVisits() {
  const [siteVisits, setSiteVisits] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingSiteVisit, setEditingSiteVisit] = useState(null)

  useEffect(() => {
    loadSiteVisits()
  }, [])

  async function loadSiteVisits() {
    try {
      setLoading(true)
      setError('')

      const data = await getSiteVisits()

      setSiteVisits(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load site visits:', err)
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  function handleAdd() {
    setEditingSiteVisit(null)
    setShowForm(true)
    setError('')
  }

  function handleEdit(siteVisit) {
    setEditingSiteVisit(siteVisit)
    setShowForm(true)
    setError('')
  }

  function handleCancel() {
    setShowForm(false)
    setEditingSiteVisit(null)
    setError('')
  }

  async function handleSave(siteVisitData) {
    try {
      setSaving(true)
      setError('')

      if (editingSiteVisit) {
        const updatedSiteVisit = await updateSiteVisit(
          editingSiteVisit.id,
          siteVisitData,
        )

        setSiteVisits((previous) =>
          previous.map((siteVisit) =>
            siteVisit.id === updatedSiteVisit.id
              ? updatedSiteVisit
              : siteVisit,
          ),
        )
      } else {
        const newSiteVisit = await createSiteVisit(siteVisitData)

        setSiteVisits((previous) => [
          ...previous,
          newSiteVisit,
        ])
      }

      setShowForm(false)
      setEditingSiteVisit(null)
    } catch (err) {
      console.error('Failed to save site visit:', err)
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(siteVisit) {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete the site visit for "${siteVisit.customerName}"?`,
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')

      await deleteSiteVisit(siteVisit.id)

      setSiteVisits((previous) =>
        previous.filter(
          (item) => item.id !== siteVisit.id,
        ),
      )
    } catch (err) {
      console.error('Failed to delete site visit:', err)
      setError(getErrorMessage(err))
    }
  }

  const filteredSiteVisits = useMemo(() => {
    const search = searchTerm.trim().toLowerCase()

    const sorted = [...siteVisits].sort((a, b) => {
      const dateA = `${a.visitDate || ''}T${a.visitTime || '00:00:00'}`
      const dateB = `${b.visitDate || ''}T${b.visitTime || '00:00:00'}`

      return dateA.localeCompare(dateB)
    })

    if (!search) {
      return sorted
    }

    return sorted.filter((siteVisit) =>
      [
        siteVisit.customerName,
        siteVisit.customerPhone,
        siteVisit.property,
        siteVisit.status,
        siteVisit.notes,
      ]
        .filter(Boolean)
        .some((value) =>
          value
            .toString()
            .toLowerCase()
            .includes(search),
        ),
    )
  }, [siteVisits, searchTerm])

  return (
    <div className="site-visits-page">
      <section className="site-visits-intro">
        <div>
          <p className="eyebrow">Property activity</p>

          <h2>Site Visits</h2>

          <p className="muted">
            Schedule and manage property visits with your customers.
          </p>
        </div>

        {!showForm && (
          <button
            className="primary-button"
            type="button"
            onClick={handleAdd}
          >
            + Add site visit
          </button>
        )}
      </section>

      {error && (
        <div className="api-error" role="alert">
          <span>{error}</span>

          <button
            type="button"
            className="text-button"
            onClick={loadSiteVisits}
          >
            Try again
          </button>
        </div>
      )}

      {showForm ? (
        <section className="panel site-visits-form-panel">
          <div className="section-heading">
            <div>
              <h2>
                {editingSiteVisit
                  ? 'Edit site visit'
                  : 'Add site visit'}
              </h2>

              <p className="muted">
                {editingSiteVisit
                  ? 'Update the scheduled property visit.'
                  : 'Enter the customer and property visit details.'}
              </p>
            </div>
          </div>

          <SiteVisitForm
            siteVisit={editingSiteVisit}
            onSubmit={handleSave}
            onCancel={handleCancel}
            saving={saving}
          />
        </section>
      ) : (
        <section className="panel site-visits-panel">
          <div className="site-visits-toolbar">
            <div>
              <h2>All site visits</h2>

              <p className="muted">
                {loading
                  ? 'Loading site visits...'
                  : `${filteredSiteVisits.length} site visit${
                      filteredSiteVisits.length === 1
                        ? ''
                        : 's'
                    }`}
              </p>
            </div>

            <div className="search-box">
              <input
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search site visits..."
                aria-label="Search site visits"
              />
            </div>
          </div>

          {loading ? (
            <div className="empty-state">
              Loading site visits...
            </div>
          ) : (
            <div className="table-scroll">
              <SiteVisitTable
                siteVisits={filteredSiteVisits}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          )}
        </section>
      )}
    </div>
  )
}

export default SiteVisits