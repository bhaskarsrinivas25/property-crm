import { useEffect, useMemo, useState } from 'react'
import LeadForm from '../components/LeadForm'
import LeadTable from '../components/LeadTable'
import { blankLead, formatOption } from '../data/leadOptions'
import { createLead, deleteLead, getErrorMessage, getLeadById, getLeads, updateLead } from '../services/leadService'

function Modal({ title, children, onClose, wide = false }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div className={`modal-card${wide ? ' modal-wide' : ''}`} role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-heading"><h2 id="modal-title">{title}</h2><button className="modal-close" type="button" aria-label="Close dialog" onClick={onClose}>×</button></div>{children}</div></div>
}

function LeadDetails({ lead, onClose }) {
  return <Modal title="Lead details" onClose={onClose}><div className="lead-details"><div><span>Name</span><strong>{lead.name}</strong></div><div><span>Phone</span><strong>{lead.phone}</strong></div><div><span>Email</span><strong>{lead.email || 'Not provided'}</strong></div><div><span>Property interest</span><strong>{lead.requirement}</strong></div><div><span>Preferred location</span><strong>{lead.preferredLocation}</strong></div><div><span>Budget</span><strong>{lead.budget ? `$${Number(lead.budget).toLocaleString()}` : 'Not specified'}</strong></div><div><span>Source</span><strong>{formatOption(lead.leadSource)}</strong></div><div><span>Status</span><strong>{formatOption(lead.status)}</strong></div><div><span>Notes</span><strong>{lead.notes || 'No notes added.'}</strong></div></div><div className="modal-actions"><button className="secondary-button" type="button" onClick={onClose}>Close</button></div></Modal>
}

function toLeadRequest(form) {
  return {
    name: form.name.trim(), phone: form.phone.trim(), email: (form.email || '').trim() || null, propertyType: form.propertyType,
    requirement: form.requirement.trim(), preferredLocation: form.preferredLocation.trim(), budget: form.budget === '' ? null : Number(form.budget),
    leadSource: form.leadSource, status: form.status, notes: (form.notes || '').trim() || null,
  }
}

function Leads() {
  const [leads, setLeads] = useState([])
  const [query, setQuery] = useState('')
  const [modal, setModal] = useState(null)
  const [selectedLead, setSelectedLead] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    let active = true
    async function loadLeads() {
      try {
        setLoading(true)
        setError('')
        const loadedLeads = await getLeads()
        if (active) setLeads(loadedLeads)
      } catch (requestError) {
        if (active) setError(getErrorMessage(requestError, 'Unable to load leads.'))
      } finally {
        if (active) setLoading(false)
      }
    }
    loadLeads()
    return () => { active = false }
  }, [])

  const filteredLeads = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return leads
    return leads.filter((lead) => [lead.name, lead.phone, lead.email, lead.requirement, lead.preferredLocation, lead.leadSource, lead.status].some((value) => String(value || '').toLowerCase().includes(normalizedQuery)))
  }, [leads, query])

  function openAddModal() { setSelectedLead(null); setFormError(''); setModal('form') }
  async function openEditModal(lead) {
    setSelectedLead(lead)
    setFormError('')
    setModal('form')
    try {
      const loadedLead = await getLeadById(lead.id)
      setSelectedLead(loadedLead)
      setFormError('')
    } catch (requestError) {
      setFormError(getErrorMessage(requestError, 'Unable to load this lead.'))
    }
  }

  async function handleSave(form) {
    try {
      setSubmitting(true)
      setFormError('')
      const savedLead = selectedLead ? await updateLead(selectedLead.id, toLeadRequest(form)) : await createLead(toLeadRequest(form))
      setLeads((current) => selectedLead ? current.map((lead) => lead.id === selectedLead.id ? savedLead : lead) : [...current, savedLead])
      setFormError('')
      setModal(null)
      setSelectedLead(null)
      setSuccess(selectedLead ? 'Lead updated successfully.' : 'Lead created successfully.')
    } catch (requestError) {
      setFormError(getErrorMessage(requestError, selectedLead ? 'Unable to update this lead.' : 'Unable to create this lead.'))
    } finally {
      setSubmitting(false)
    }
  }

  function openDeleteModal(lead) { setSelectedLead(lead); setFormError(''); setModal('delete') }

  async function confirmDelete() {
    try {
      setSubmitting(true)
      setFormError('')
      await deleteLead(selectedLead.id)
      setLeads((current) => current.filter((lead) => lead.id !== selectedLead.id))
      setFormError('')
      setModal(null)
      setSelectedLead(null)
      setSuccess('Lead deleted successfully.')
    } catch (requestError) {
      setFormError(getErrorMessage(requestError, 'Unable to delete this lead.'))
    } finally {
      setSubmitting(false)
    }
  }

  return <div className="leads-page">
    <section className="leads-intro"><div><p className="eyebrow">Sales pipeline</p><h2>Leads</h2><p className="muted">Manage prospects, property interests, and the next customer conversation.</p></div><button className="primary-button" type="button" onClick={openAddModal}>+ Add lead</button></section>
    {success && <div className="success-banner" role="status">{success}<button type="button" aria-label="Dismiss notification" onClick={() => setSuccess('')}>×</button></div>}
    <section className="leads-panel panel">
      <div className="leads-toolbar"><div><h2>All leads</h2><p className="muted">{loading ? 'Loading leads...' : `${filteredLeads.length} of ${leads.length} leads shown`}</p></div><label className="search-field"><span aria-hidden="true">⌕</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search leads" aria-label="Search leads" /></label></div>
      {loading && <div className="loading-state" role="status">Loading leads...</div>}
      {!loading && error && <div className="api-error" role="alert"><strong>Could not load leads</strong><span>{error}</span><button className="secondary-button" type="button" onClick={() => window.location.reload()}>Retry</button></div>}
      {!loading && !error && <LeadTable leads={filteredLeads} onView={(lead) => { setSelectedLead(lead); setModal('view') }} onEdit={openEditModal} onDelete={openDeleteModal} />}
    </section>
    {modal === 'form' && <Modal title={selectedLead ? 'Edit lead' : 'Add lead'} onClose={() => setModal(null)} wide><LeadForm initialLead={selectedLead || blankLead} serverError={formError} submitting={submitting} onCancel={() => setModal(null)} onSubmit={handleSave} /></Modal>}
    {modal === 'view' && selectedLead && <LeadDetails lead={selectedLead} onClose={() => setModal(null)} />}
    {modal === 'delete' && selectedLead && <Modal title="Delete lead" onClose={() => setModal(null)}><div className="confirm-copy"><p>Are you sure you want to remove <strong>{selectedLead.name}</strong> from your leads?</p><span>This will permanently delete the lead from the backend.</span>{formError && <small className="field-error">{formError}</small>}</div><div className="modal-actions"><button className="secondary-button" type="button" onClick={() => setModal(null)} disabled={submitting}>Cancel</button><button className="danger-button" type="button" onClick={confirmDelete} disabled={submitting}>{submitting ? 'Deleting...' : 'Delete lead'}</button></div></Modal>}
  </div>
}

export default Leads
