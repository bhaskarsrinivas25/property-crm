import { useMemo, useState } from 'react'
import LeadForm from '../components/LeadForm'
import LeadTable from '../components/LeadTable'
import { blankLead, formatOption } from '../data/leadOptions'

const sampleLeads = [
  { id: 1, name: 'Jordan Lee', phone: '+1 (415) 555-0184', email: 'jordan.lee@example.com', propertyType: 'APARTMENT', requirement: 'Two-bedroom apartment near transit', preferredLocation: 'North Beach', budget: 680000, leadSource: 'WEBSITE', status: 'NEW', followUpDate: '2026-09-08', notes: 'Prefers a quiet building with natural light.' },
  { id: 2, name: 'Morgan Ellis', phone: '+1 (415) 555-0139', email: 'morgan.ellis@example.com', propertyType: 'HOUSE', requirement: 'Family home with a garden', preferredLocation: 'Sausalito', budget: 1450000, leadSource: 'REFERRAL', status: 'QUALIFIED', followUpDate: '2026-09-10', notes: 'Ready to schedule a second viewing.' },
  { id: 3, name: 'Priya Shah', phone: '+1 (415) 555-0162', email: 'priya.shah@example.com', propertyType: 'VILLA', requirement: 'Modern villa with home office', preferredLocation: 'Palo Alto', budget: 2500000, leadSource: 'GOOGLE', status: 'SITE_VISIT', followUpDate: '2026-09-11', notes: '' },
  { id: 4, name: 'Daniel Kim', phone: '+1 (415) 555-0117', email: 'daniel.kim@example.com', propertyType: 'COMMERCIAL', requirement: 'Street-level retail space', preferredLocation: 'SoMa', budget: 900000, leadSource: 'FACEBOOK', status: 'NEGOTIATION', followUpDate: '2026-09-12', notes: 'Reviewing lease and purchase options.' },
  { id: 5, name: 'Ava Thompson', phone: '+1 (415) 555-0198', email: 'ava.thompson@example.com', propertyType: 'APARTMENT', requirement: 'Starter apartment for investment', preferredLocation: 'Mission District', budget: 540000, leadSource: 'WALK_IN', status: 'CONVERTED', followUpDate: '2026-09-15', notes: 'Converted after offer acceptance.' },
  { id: 6, name: 'Noah Williams', phone: '+1 (415) 555-0146', email: 'noah.williams@example.com', propertyType: 'LAND', requirement: 'Small parcel for development', preferredLocation: 'East Bay', budget: 300000, leadSource: 'OTHER', status: 'LOST', followUpDate: '', notes: 'Paused search until next quarter.' },
]

function Modal({ title, children, onClose, wide = false }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div className={`modal-card${wide ? ' modal-wide' : ''}`} role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-heading"><h2 id="modal-title">{title}</h2><button className="modal-close" type="button" aria-label="Close dialog" onClick={onClose}>×</button></div>{children}</div></div>
}

function LeadDetails({ lead, onClose }) {
  return <Modal title="Lead details" onClose={onClose}><div className="lead-details"><div><span>Name</span><strong>{lead.name}</strong></div><div><span>Phone</span><strong>{lead.phone}</strong></div><div><span>Email</span><strong>{lead.email || 'Not provided'}</strong></div><div><span>Property interest</span><strong>{lead.requirement}</strong></div><div><span>Preferred location</span><strong>{lead.preferredLocation}</strong></div><div><span>Budget</span><strong>{lead.budget ? `$${Number(lead.budget).toLocaleString()}` : 'Not specified'}</strong></div><div><span>Source</span><strong>{formatOption(lead.leadSource)}</strong></div><div><span>Status</span><strong>{formatOption(lead.status)}</strong></div><div><span>Notes</span><strong>{lead.notes || 'No notes added.'}</strong></div></div><div className="modal-actions"><button className="secondary-button" type="button" onClick={onClose}>Close</button></div></Modal>
}

function Leads() {
  const [leads, setLeads] = useState(sampleLeads)
  const [query, setQuery] = useState('')
  const [modal, setModal] = useState(null)
  const [selectedLead, setSelectedLead] = useState(null)

  const filteredLeads = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return leads
    return leads.filter((lead) => [lead.name, lead.phone, lead.email, lead.requirement, lead.preferredLocation, lead.leadSource, lead.status].some((value) => value.toLowerCase().includes(normalizedQuery)))
  }, [leads, query])

  function openAddModal() {
    setSelectedLead(null)
    setModal('form')
  }

  function openEditModal(lead) {
    setSelectedLead(lead)
    setModal('form')
  }

  function handleSave(form) {
    if (selectedLead) setLeads((current) => current.map((lead) => lead.id === selectedLead.id ? { ...lead, ...form } : lead))
    else setLeads((current) => [...current, { ...form, id: Date.now() }])
    setModal(null)
    setSelectedLead(null)
  }

  function openDeleteModal(lead) {
    setSelectedLead(lead)
    setModal('delete')
  }

  function confirmDelete() {
    setLeads((current) => current.filter((lead) => lead.id !== selectedLead.id))
    setModal(null)
    setSelectedLead(null)
  }

  return <div className="leads-page">
    <section className="leads-intro"><div><p className="eyebrow">Sales pipeline</p><h2>Leads</h2><p className="muted">Manage prospects, property interests, and the next customer conversation.</p></div><button className="primary-button" type="button" onClick={openAddModal}>+ Add lead</button></section>
    <section className="leads-panel panel">
      <div className="leads-toolbar"><div><h2>All leads</h2><p className="muted">{filteredLeads.length} of {leads.length} leads shown</p></div><label className="search-field"><span aria-hidden="true">⌕</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search leads" aria-label="Search leads" /></label></div>
      <LeadTable leads={filteredLeads} onView={(lead) => { setSelectedLead(lead); setModal('view') }} onEdit={openEditModal} onDelete={openDeleteModal} />
    </section>
    {modal === 'form' && <Modal title={selectedLead ? 'Edit lead' : 'Add lead'} onClose={() => setModal(null)} wide><LeadForm initialLead={selectedLead || blankLead} onCancel={() => setModal(null)} onSubmit={handleSave} /></Modal>}
    {modal === 'view' && selectedLead && <LeadDetails lead={selectedLead} onClose={() => setModal(null)} />}
    {modal === 'delete' && selectedLead && <Modal title="Delete lead" onClose={() => setModal(null)}><div className="confirm-copy"><p>Are you sure you want to remove <strong>{selectedLead.name}</strong> from your leads?</p><span>This action only changes the local demo data.</span></div><div className="modal-actions"><button className="secondary-button" type="button" onClick={() => setModal(null)}>Cancel</button><button className="danger-button" type="button" onClick={confirmDelete}>Delete lead</button></div></Modal>}
  </div>
}

export default Leads
