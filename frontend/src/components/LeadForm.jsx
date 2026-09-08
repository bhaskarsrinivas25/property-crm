import { useState } from 'react'
import { blankLead, formatOption, leadSources, leadStatuses, propertyTypes } from '../data/leadOptions'

function LeadForm({ initialLead, onCancel, onSubmit }) {
  const [form, setForm] = useState({ ...blankLead, ...initialLead })
  const [errors, setErrors] = useState({})

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  function validate() {
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Name is required.'
    if (!form.phone.trim()) nextErrors.phone = 'Phone is required.'
    else if (!/^[+\d][\d\s().-]{7,}$/.test(form.phone.trim())) nextErrors.phone = 'Enter a valid phone number.'
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = 'Enter a valid email address.'
    if (!form.propertyType) nextErrors.propertyType = 'Select a property type.'
    if (!form.requirement.trim()) nextErrors.requirement = 'Property interest is required.'
    if (!form.preferredLocation.trim()) nextErrors.preferredLocation = 'Preferred location is required.'
    if (form.budget !== '' && Number(form.budget) < 0) nextErrors.budget = 'Budget cannot be negative.'
    if (!form.leadSource) nextErrors.leadSource = 'Select a lead source.'
    if (!form.status) nextErrors.status = 'Select a status.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (validate()) onSubmit(form)
  }

  return (
    <form className="lead-form" noValidate onSubmit={handleSubmit}>
      <div className="form-grid">
        <label className="field"><span>Name *</span><input name="name" value={form.name} onChange={updateField} placeholder="e.g. Jordan Lee" />{errors.name && <small className="field-error">{errors.name}</small>}</label>
        <label className="field"><span>Phone *</span><input name="phone" value={form.phone} onChange={updateField} placeholder="+1 (415) 555-0184" inputMode="tel" />{errors.phone && <small className="field-error">{errors.phone}</small>}</label>
        <label className="field"><span>Email</span><input name="email" type="email" value={form.email} onChange={updateField} placeholder="name@example.com" />{errors.email && <small className="field-error">{errors.email}</small>}</label>
        <label className="field"><span>Property type *</span><select name="propertyType" value={form.propertyType} onChange={updateField}><option value="">Select type</option>{propertyTypes.map((type) => <option key={type} value={type}>{formatOption(type)}</option>)}</select>{errors.propertyType && <small className="field-error">{errors.propertyType}</small>}</label>
        <label className="field field-wide"><span>Property interest / requirement *</span><input name="requirement" value={form.requirement} onChange={updateField} placeholder="e.g. Two-bedroom apartment near transit" />{errors.requirement && <small className="field-error">{errors.requirement}</small>}</label>
        <label className="field"><span>Preferred location *</span><input name="preferredLocation" value={form.preferredLocation} onChange={updateField} placeholder="e.g. North Beach" />{errors.preferredLocation && <small className="field-error">{errors.preferredLocation}</small>}</label>
        <label className="field"><span>Budget</span><input name="budget" type="number" min="0" step="1000" value={form.budget} onChange={updateField} placeholder="0" />{errors.budget && <small className="field-error">{errors.budget}</small>}</label>
        <label className="field"><span>Source *</span><select name="leadSource" value={form.leadSource} onChange={updateField}><option value="">Select source</option>{leadSources.map((source) => <option key={source} value={source}>{formatOption(source)}</option>)}</select>{errors.leadSource && <small className="field-error">{errors.leadSource}</small>}</label>
        <label className="field"><span>Status *</span><select name="status" value={form.status} onChange={updateField}>{leadStatuses.map((status) => <option key={status} value={status}>{formatOption(status)}</option>)}</select>{errors.status && <small className="field-error">{errors.status}</small>}</label>
        <label className="field"><span>Follow-up date</span><input name="followUpDate" type="date" value={form.followUpDate} onChange={updateField} /></label>
        <label className="field field-wide"><span>Notes</span><textarea name="notes" rows="3" value={form.notes} onChange={updateField} placeholder="Add context for the next conversation" /></label>
      </div>
      <div className="modal-actions"><button className="secondary-button" type="button" onClick={onCancel}>Cancel</button><button className="primary-button" type="submit">Save lead</button></div>
    </form>
  )
}

export default LeadForm
