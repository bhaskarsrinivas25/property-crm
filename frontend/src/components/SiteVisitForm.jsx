import { useEffect, useState } from 'react'

const emptyForm = {
  customerName: '',
  customerPhone: '',
  property: '',
  visitDate: '',
  visitTime: '',
  status: 'SCHEDULED',
  notes: '',
}

function SiteVisitForm({
  siteVisit,
  onSubmit,
  onCancel,
  saving = false,
}) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (siteVisit) {
      setForm({
        customerName: siteVisit.customerName || '',
        customerPhone: siteVisit.customerPhone || '',
        property: siteVisit.property || '',
        visitDate: siteVisit.visitDate || '',
        visitTime: siteVisit.visitTime || '',
        status: siteVisit.status || 'SCHEDULED',
        notes: siteVisit.notes || '',
      })
    } else {
      setForm({ ...emptyForm })
    }

    setErrors({})
  }, [siteVisit])

  function handleChange(event) {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: '',
      }))
    }
  }

  function validate() {
    const newErrors = {}

    if (!form.customerName.trim()) {
      newErrors.customerName = 'Customer name is required'
    } else if (form.customerName.trim().length > 100) {
      newErrors.customerName =
        'Customer name must not exceed 100 characters'
    }

    if (!form.customerPhone.trim()) {
      newErrors.customerPhone = 'Customer phone is required'
    } else if (form.customerPhone.trim().length > 20) {
      newErrors.customerPhone =
        'Customer phone must not exceed 20 characters'
    }

    if (!form.property.trim()) {
      newErrors.property = 'Property is required'
    } else if (form.property.trim().length > 150) {
      newErrors.property =
        'Property must not exceed 150 characters'
    }

    if (!form.visitDate) {
      newErrors.visitDate = 'Visit date is required'
    }

    if (!form.visitTime) {
      newErrors.visitTime = 'Visit time is required'
    }

    if (!form.status) {
      newErrors.status = 'Status is required'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!validate()) {
      return
    }

    onSubmit({
      customerName: form.customerName.trim(),
      customerPhone: form.customerPhone.trim(),
      property: form.property.trim(),
      visitDate: form.visitDate,
      visitTime: form.visitTime,
      status: form.status,
      notes: form.notes.trim() || null,
    })
  }

  return (
    <form className="lead-form site-visit-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="customerName">
            Customer Name <span>*</span>
          </label>

          <input
            id="customerName"
            name="customerName"
            type="text"
            value={form.customerName}
            onChange={handleChange}
            placeholder="Enter customer name"
            disabled={saving}
          />

          {errors.customerName && (
            <p className="field-error">{errors.customerName}</p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="customerPhone">
            Customer Phone <span>*</span>
          </label>

          <input
            id="customerPhone"
            name="customerPhone"
            type="text"
            value={form.customerPhone}
            onChange={handleChange}
            placeholder="Enter phone number"
            disabled={saving}
          />

          {errors.customerPhone && (
            <p className="field-error">{errors.customerPhone}</p>
          )}
        </div>

        <div className="form-field form-field-full">
          <label htmlFor="property">
            Property <span>*</span>
          </label>

          <input
            id="property"
            name="property"
            type="text"
            value={form.property}
            onChange={handleChange}
            placeholder="Enter property name"
            disabled={saving}
          />

          {errors.property && (
            <p className="field-error">{errors.property}</p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="visitDate">
            Visit Date <span>*</span>
          </label>

          <input
            id="visitDate"
            name="visitDate"
            type="date"
            value={form.visitDate}
            onChange={handleChange}
            disabled={saving}
          />

          {errors.visitDate && (
            <p className="field-error">{errors.visitDate}</p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="visitTime">
            Visit Time <span>*</span>
          </label>

          <input
            id="visitTime"
            name="visitTime"
            type="time"
            value={form.visitTime}
            onChange={handleChange}
            disabled={saving}
          />

          {errors.visitTime && (
            <p className="field-error">{errors.visitTime}</p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="status">
            Status <span>*</span>
          </label>

          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
            disabled={saving}
          >
            <option value="SCHEDULED">Scheduled</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {errors.status && (
            <p className="field-error">{errors.status}</p>
          )}
        </div>

        <div className="form-field form-field-full">
          <label htmlFor="notes">Notes</label>

          <textarea
            id="notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Add any additional notes..."
            rows="4"
            disabled={saving}
          />
        </div>
      </div>

      <div className="form-actions">
        <button
          className="secondary-button"
          type="button"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </button>

        <button
          className="primary-button"
          type="submit"
          disabled={saving}
        >
          {saving
            ? 'Saving...'
            : siteVisit
              ? 'Update site visit'
              : 'Add site visit'}
        </button>
      </div>
    </form>
  )
}

export default SiteVisitForm