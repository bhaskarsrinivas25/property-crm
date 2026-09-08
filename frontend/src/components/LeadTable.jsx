import { formatOption } from '../data/leadOptions'

function getStatusTone(status) {
  return { NEW: 'blue', CONTACTED: 'neutral', INTERESTED: 'green', SITE_VISIT: 'orange', NEGOTIATION: 'violet', BOOKED: 'green', LOST: 'red' }[status] || 'neutral'
}

function LeadTable({ leads, onView, onEdit, onDelete }) {
  if (!leads.length) {
    return <div className="empty-state"><span className="empty-state-icon" aria-hidden="true">◎</span><h3>No leads found</h3><p>Try adjusting your search or add a new lead to get started.</p></div>
  }

  return (
    <div className="table-scroll">
      <table className="crm-table lead-table">
        <thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>Property type</th><th>Budget</th><th>Source</th><th>Status</th><th>Follow-up date</th><th><span className="sr-only">Actions</span></th></tr></thead>
        <tbody>{leads.map((lead) => <tr key={lead.id}><td><strong>{lead.name}</strong></td><td>{lead.phone}</td><td>{lead.email || '—'}</td><td>{formatOption(lead.propertyType)}</td><td>{lead.budget ? `$${Number(lead.budget).toLocaleString()}` : '—'}</td><td>{formatOption(lead.leadSource)}</td><td><span className={`status-badge ${getStatusTone(lead.status)}`}>{formatOption(lead.status)}</span></td><td>{lead.followUpDate || 'Not scheduled'}</td><td><div className="row-actions"><button type="button" onClick={() => onView(lead)}>View</button><button type="button" onClick={() => onEdit(lead)}>Edit</button><button className="danger-action" type="button" onClick={() => onDelete(lead)}>Delete</button></div></td></tr>)}</tbody>
      </table>
    </div>
  )
}

export default LeadTable
