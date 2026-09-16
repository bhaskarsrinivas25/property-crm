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

  if (Number.isNaN(date.getTime())) {
    return dateValue
  }

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatTime(timeValue) {
  if (!timeValue) return '—'

  const [hours, minutes] = timeValue.split(':')

  if (!hours || !minutes) {
    return timeValue
  }

  const date = new Date()
  date.setHours(Number(hours), Number(minutes), 0, 0)

  return date.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

function getStatusClass(status) {
  return {
    SCHEDULED: 'status-scheduled',
    COMPLETED: 'status-completed',
    CANCELLED: 'status-cancelled',
  }[status] || 'status-neutral'
}

function SiteVisitTable({
  siteVisits,
  onEdit,
  onDelete,
}) {
  return (
    <table className="crm-table site-visit-table">
      <thead>
        <tr>
          <th>Customer</th>
          <th>Phone</th>
          <th>Property</th>
          <th>Visit Date</th>
          <th>Time</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {siteVisits.length === 0 ? (
          <tr>
            <td colSpan="7" className="empty-state">
              No site visits found.
            </td>
          </tr>
        ) : (
          siteVisits.map((siteVisit) => (
            <tr key={siteVisit.id}>
              <td>
                <strong>{siteVisit.customerName}</strong>
              </td>

              <td>{siteVisit.customerPhone || '—'}</td>

              <td>{siteVisit.property || '—'}</td>

              <td>
                <div className="site-visit-date-cell">
                  <strong>
                    {formatDate(siteVisit.visitDate)}
                  </strong>
                </div>
              </td>

              <td>
                {formatTime(siteVisit.visitTime)}
              </td>

              <td>
                <span
                  className={`site-visit-status-badge ${getStatusClass(
                    siteVisit.status,
                  )}`}
                >
                  {formatLabel(siteVisit.status)}
                </span>
              </td>

              <td>
                <div className="row-actions">
                  <button
                    className="table-action"
                    type="button"
                    onClick={() => onEdit(siteVisit)}
                  >
                    Edit
                  </button>

                  <button
                    className="table-action danger-action"
                    type="button"
                    onClick={() => onDelete(siteVisit)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  )
}

export default SiteVisitTable