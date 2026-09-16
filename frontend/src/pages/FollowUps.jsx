import { useEffect, useMemo, useState } from 'react'
import FollowUpForm from '../components/FollowUpForm'
import {
  createFollowUp,
  deleteFollowUp,
  getFollowUps,
  updateFollowUp,
} from '../services/followUpService'

function FollowUps() {
  const [followUps, setFollowUps] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingFollowUp, setEditingFollowUp] = useState(null)

  useEffect(() => {
    loadFollowUps()
  }, [])

  async function loadFollowUps() {
    try {
      setLoading(true)
      setError('')

      const data = await getFollowUps()
      setFollowUps(data)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  function handleAdd() {
    setEditingFollowUp(null)
    setShowForm(true)
    setError('')
  }

  function handleEdit(followUp) {
    setEditingFollowUp(followUp)
    setShowForm(true)
    setError('')
  }

  function handleCancel() {
    setShowForm(false)
    setEditingFollowUp(null)
    setError('')
  }

  async function handleSave(followUpData) {
    try {
      setSaving(true)
      setError('')

      if (editingFollowUp) {
        const updatedFollowUp = await updateFollowUp(
          editingFollowUp.id,
          followUpData
        )

        setFollowUps((previous) =>
          previous.map((followUp) =>
            followUp.id === updatedFollowUp.id
              ? updatedFollowUp
              : followUp
          )
        )
      } else {
        const newFollowUp = await createFollowUp(followUpData)

        setFollowUps((previous) => [
          ...previous,
          newFollowUp,
        ])
      }

      setShowForm(false)
      setEditingFollowUp(null)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(followUp) {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete the follow-up for "${followUp.customerName}"?`
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')

      await deleteFollowUp(followUp.id)

      setFollowUps((previous) =>
        previous.filter(
          (item) => item.id !== followUp.id
        )
      )
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const filteredFollowUps = useMemo(() => {
    const search = searchTerm.trim().toLowerCase()

    const filtered = followUps.filter((followUp) => {
      if (!search) {
        return true
      }

      return [
        followUp.customerName,
        followUp.customerPhone,
        followUp.type,
        followUp.status,
        followUp.notes,
      ]
        .filter(Boolean)
        .some((value) =>
          value
            .toString()
            .toLowerCase()
            .includes(search)
        )
    })

    return [...filtered].sort((a, b) => {
      const priorityA = getFollowUpPriority(a)
      const priorityB = getFollowUpPriority(b)

      if (priorityA !== priorityB) {
        return priorityA - priorityB
      }

      return (
        getDateValue(a.followUpDate) -
        getDateValue(b.followUpDate)
      )
    })
  }, [followUps, searchTerm])

  return (
    <div className="follow-ups-page">
      <section className="follow-ups-intro">
        <div>
          <p className="eyebrow">
            Follow-up management
          </p>

          <h2>Follow-ups</h2>

          <p className="muted">
            Track customer conversations and upcoming follow-ups.
          </p>
        </div>

        {!showForm && (
          <button
            type="button"
            className="primary-button"
            onClick={handleAdd}
          >
            + Add Follow-up
          </button>
        )}
      </section>

      {error && (
        <div className="api-error">
          <strong>Something went wrong</strong>
          <span>{error}</span>
        </div>
      )}

      {showForm && (
        <section className="panel follow-ups-panel">
          <div className="follow-ups-toolbar">
            <div>
              <h2>
                {editingFollowUp
                  ? 'Edit Follow-up'
                  : 'Add Follow-up'}
              </h2>

              <p className="muted">
                {editingFollowUp
                  ? 'Update the follow-up information below.'
                  : 'Enter the follow-up details below.'}
              </p>
            </div>
          </div>

          <FollowUpForm
            followUp={editingFollowUp}
            onSubmit={handleSave}
            onCancel={handleCancel}
            saving={saving}
          />
        </section>
      )}

      {!showForm && (
        <section className="panel follow-ups-panel">
          <div className="follow-ups-toolbar">
            <div>
              <h2>Follow-up List</h2>

              <p className="muted">
                {followUps.length} follow-up
                {followUps.length === 1 ? '' : 's'} in your CRM.
              </p>
            </div>

            <label className="search-field">
              <span aria-hidden="true">⌕</span>

              <input
                type="search"
                placeholder="Search follow-ups..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                aria-label="Search follow-ups"
              />
            </label>
          </div>

          {loading ? (
            <div className="loading-state">
              Loading follow-ups...
            </div>
          ) : filteredFollowUps.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                📞
              </div>

              <h3>
                {searchTerm
                  ? 'No follow-ups found'
                  : 'No follow-ups yet'}
              </h3>

              <p>
                {searchTerm
                  ? 'Try a different search term.'
                  : 'Add your first follow-up to get started.'}
              </p>

              {!searchTerm && (
                <button
                  type="button"
                  className="primary-button"
                  onClick={handleAdd}
                >
                  + Add Follow-up
                </button>
              )}
            </div>
          ) : (
            <div className="table-scroll">
              <table className="crm-table follow-up-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredFollowUps.map((followUp) => {
                    const followUpState =
                      getFollowUpState(followUp)

                    return (
                      <tr key={followUp.id}>
                        <td>
                          <strong>
                            {followUp.customerName}
                          </strong>

                          <div className="table-subtext">
                            {followUp.customerPhone || '—'}
                          </div>
                        </td>

                        <td>
                          <div className="follow-up-date-cell">
                            <strong>
                              {formatDate(
                                followUp.followUpDate
                              )}
                            </strong>

                            <span
                              className={`follow-up-date-label ${followUpState.className}`}
                            >
                              {followUpState.label}
                            </span>
                          </div>
                        </td>

                        <td>
                          <span
                            className={`follow-up-type-badge type-${followUp.type.toLowerCase()}`}
                          >
                            {formatLabel(followUp.type)}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`follow-up-status-badge status-${followUp.status.toLowerCase()}`}
                          >
                            {formatLabel(followUp.status)}
                          </span>
                        </td>

                        <td>
                          {followUp.notes || '—'}
                        </td>

                        <td>
                          <div className="row-actions">
                            <button
                              type="button"
                              onClick={() =>
                                handleEdit(followUp)
                              }
                              title="Edit follow-up"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="danger-action"
                              onClick={() =>
                                handleDelete(followUp)
                              }
                              title="Delete follow-up"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  )
}

function getFollowUpState(followUp) {
  if (followUp.status === 'COMPLETED') {
    return {
      label: 'Completed',
      className: 'date-completed',
    }
  }

  if (followUp.status === 'CANCELLED') {
    return {
      label: 'Cancelled',
      className: 'date-cancelled',
    }
  }

  const today = getTodayDate()
  const followUpDate = followUp.followUpDate

  if (followUpDate < today) {
    return {
      label: 'Overdue',
      className: 'date-overdue',
    }
  }

  if (followUpDate === today) {
    return {
      label: 'Today',
      className: 'date-today',
    }
  }

  return {
    label: 'Upcoming',
    className: 'date-upcoming',
  }
}

function getFollowUpPriority(followUp) {
  if (followUp.status === 'COMPLETED') {
    return 4
  }

  if (followUp.status === 'CANCELLED') {
    return 5
  }

  const state = getFollowUpState(followUp)

  if (state.label === 'Overdue') {
    return 1
  }

  if (state.label === 'Today') {
    return 2
  }

  return 3
}

function getTodayDate() {
  const today = new Date()

  const year = today.getFullYear()
  const month = String(
    today.getMonth() + 1
  ).padStart(2, '0')
  const day = String(
    today.getDate()
  ).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function getDateValue(value) {
  if (!value) {
    return Number.MAX_SAFE_INTEGER
  }

  return new Date(
    `${value}T00:00:00`
  ).getTime()
}

function formatDate(value) {
  if (!value) {
    return '—'
  }

  return new Date(
    `${value}T00:00:00`
  ).toLocaleDateString('en-IN')
}

function formatLabel(value) {
  if (!value) {
    return '—'
  }

  return value
    .toLowerCase()
    .split('_')
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(' ')
}

function getErrorMessage(error) {
  if (error.response?.data?.message) {
    return error.response.data.message
  }

  if (error.response?.data?.errors) {
    return Object.values(
      error.response.data.errors
    ).join(', ')
  }

  if (error.response) {
    return 'Something went wrong while communicating with the server.'
  }

  return 'Unable to reach the backend. Check that the Spring Boot server is running.'
}

export default FollowUps