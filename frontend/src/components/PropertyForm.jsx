import { useState } from 'react'
import { blankProperty, formatPropertyOption, listingTypes, propertyStatuses, propertyTypes } from '../data/propertyOptions'

function PropertyForm({ initialProperty, onCancel, onSubmit }) {
  const [form, setForm] = useState({ ...blankProperty, ...initialProperty })
  const [errors, setErrors] = useState({})

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  function validate() {
    const nextErrors = {}
    if (!form.title.trim()) nextErrors.title = 'Title is required.'
    if (!form.propertyType) nextErrors.propertyType = 'Select a property type.'
    if (!form.listingType) nextErrors.listingType = 'Select a listing type.'
    if (!form.location.trim()) nextErrors.location = 'Location is required.'
    if (form.price === '') nextErrors.price = 'Price is required.'
    else if (Number(form.price) < 0) nextErrors.price = 'Price cannot be negative.'
    if (form.area !== '' && Number(form.area) < 0) nextErrors.area = 'Area cannot be negative.'
    if (form.bedrooms !== '' && (!Number.isInteger(Number(form.bedrooms)) || Number(form.bedrooms) < 0 || Number(form.bedrooms) > 100)) nextErrors.bedrooms = 'Enter bedrooms from 0 to 100.'
    if (form.bathrooms !== '' && (!Number.isInteger(Number(form.bathrooms)) || Number(form.bathrooms) < 0 || Number(form.bathrooms) > 100)) nextErrors.bathrooms = 'Enter bathrooms from 0 to 100.'
    if (!form.status) nextErrors.status = 'Select a property status.'
    if (!form.ownerName.trim()) nextErrors.ownerName = 'Owner name is required.'
    if (!form.ownerPhone.trim()) nextErrors.ownerPhone = 'Owner phone is required.'
    else if (!/^[+\d][\d\s().-]{7,}$/.test(form.ownerPhone.trim())) nextErrors.ownerPhone = 'Enter a valid phone number.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (validate()) onSubmit(form)
  }

  return <form className="lead-form" noValidate onSubmit={handleSubmit}>
    <div className="form-grid">
      <label className="field field-wide"><span>Title *</span><input name="title" value={form.title} onChange={updateField} placeholder="e.g. Oak Street Apartment" />{errors.title && <small className="field-error">{errors.title}</small>}</label>
      <label className="field"><span>Property type *</span><select name="propertyType" value={form.propertyType} onChange={updateField}><option value="">Select type</option>{propertyTypes.map((type) => <option key={type} value={type}>{formatPropertyOption(type)}</option>)}</select>{errors.propertyType && <small className="field-error">{errors.propertyType}</small>}</label>
      <label className="field"><span>Listing type *</span><select name="listingType" value={form.listingType} onChange={updateField}><option value="">Select listing</option>{listingTypes.map((type) => <option key={type} value={type}>{formatPropertyOption(type)}</option>)}</select>{errors.listingType && <small className="field-error">{errors.listingType}</small>}</label>
      <label className="field"><span>Location *</span><input name="location" value={form.location} onChange={updateField} placeholder="e.g. North Beach, SF" />{errors.location && <small className="field-error">{errors.location}</small>}</label>
      <label className="field"><span>Address</span><input name="address" value={form.address} onChange={updateField} placeholder="Street address" /></label>
      <label className="field"><span>Price *</span><input name="price" type="number" min="0" step="1000" value={form.price} onChange={updateField} placeholder="0" />{errors.price && <small className="field-error">{errors.price}</small>}</label>
      <label className="field"><span>Area</span><input name="area" type="number" min="0" step="1" value={form.area} onChange={updateField} placeholder="Square feet" />{errors.area && <small className="field-error">{errors.area}</small>}</label>
      <label className="field"><span>Bedrooms</span><input name="bedrooms" type="number" min="0" max="100" step="1" value={form.bedrooms} onChange={updateField} placeholder="Optional" />{errors.bedrooms && <small className="field-error">{errors.bedrooms}</small>}</label>
      <label className="field"><span>Bathrooms</span><input name="bathrooms" type="number" min="0" max="100" step="1" value={form.bathrooms} onChange={updateField} placeholder="Optional" />{errors.bathrooms && <small className="field-error">{errors.bathrooms}</small>}</label>
      <label className="field"><span>Status *</span><select name="status" value={form.status} onChange={updateField}>{propertyStatuses.map((status) => <option key={status} value={status}>{formatPropertyOption(status)}</option>)}</select>{errors.status && <small className="field-error">{errors.status}</small>}</label>
      <label className="field"><span>Owner name *</span><input name="ownerName" value={form.ownerName} onChange={updateField} placeholder="e.g. Taylor Brooks" />{errors.ownerName && <small className="field-error">{errors.ownerName}</small>}</label>
      <label className="field"><span>Owner phone *</span><input name="ownerPhone" value={form.ownerPhone} onChange={updateField} placeholder="+1 (415) 555-0128" inputMode="tel" />{errors.ownerPhone && <small className="field-error">{errors.ownerPhone}</small>}</label>
      <label className="field field-wide"><span>Description</span><textarea name="description" rows="3" value={form.description} onChange={updateField} placeholder="Describe the property and its notable features" /></label>
    </div>
    <div className="modal-actions"><button className="secondary-button" type="button" onClick={onCancel}>Cancel</button><button className="primary-button" type="submit">Save property</button></div>
  </form>
}

export default PropertyForm
