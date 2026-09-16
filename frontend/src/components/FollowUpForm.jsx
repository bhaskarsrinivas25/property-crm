import { useEffect, useState } from 'react'

const emptyForm = {
  customerName: '',
  customerPhone: '',
  followUpDate: '',
  type: 'CALL',
  status: 'PENDING',
  notes: '',
}

function FollowUpForm({
  followUp,
  onSubmit,
  onCancel,
  saving = false,
}) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (followUp) {
      setForm({
        customerName: followUp.customerName || '',
        customerPhone: followUp.customerPhone || '',
        followUpDate: followUp.followUpDate || '',
        type: followUp.type || 'CALL',
        status: followUp.status || 'PENDING',
        notes: followUp.notes || '',
      })
    } else {
      setForm({ ...emptyForm })
    }

    setErrors({})
  }, [followUp])

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

    if (form.customerPhone.trim().length > 20) {
      newErrors.customerPhone =
        'Customer phone must not exceed 20 characters'
    }

    if (!form.followUpDate) {
      newErrors.followUpDate = 'Follow-up date is required'
    }

    if (!form.type) {
      newErrors.type = 'Follow-up type is required'
    }

    if (!form.status) {
      newErrors.status = 'Follow-up status is required'
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
      customerPhone: form.customerPhone.trim() || null,
      followUpDate: form.followUpDate,
      type: form.type,
      status: form.status,
      notes: form.notes.trim() || null,
    })
  }

  return (
    <form className="lead-form follow-up-form" onSubmit={handleSubmit}>
      <div className="form-grid">

        <label className="field">
          <span>
            Customer Name <span className="required">*</span>
          </span>

          <input
            name="customerName"
            type="text"
            value={form.customerName}
            onChange={handleChange}
            placeholder="Enter customer name"
            disabled={saving}
          />

          {errors.customerName && (
            <span className="field-error">
              {errors.customerName}
            </span>
          )}
        </label>

        <label className="field">
          <span>Customer Phone</span>

          <input
            name="customerPhone"
            type="text"
            value={form.customerPhone}
            onChange={handleChange}
            placeholder="Enter phone number"
            disabled={saving}
          />

          {errors.customerPhone && (
            <span className="field-error">
              {errors.customerPhone}
            </span>
          )}
        </label>

        <label className="field">
          <span>
            Follow-up Date <span className="required">*</span>
          </span>

          <input
            name="followUpDate"
            type="date"
            value={form.followUpDate}
            onChange={handleChange}
            disabled={saving}
          />

          {errors.followUpDate && (
            <span className="field-error">
              {errors.followUpDate}
            </span>
          )}
        </label>

        <label className="field">
          <span>
            Type <span className="required">*</span>
          </span>

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            disabled={saving}
          >
            <option value="CALL">Call</option>
            <option value="WHATSAPP">WhatsApp</option>
            <option value="EMAIL">Email</option>
            <option value="MEETING">Meeting</option>
          </select>

          {errors.type && (
            <span className="field-error">
              {errors.type}
            </span>
          )}
        </label>

        <label className="field">
          <span>
            Status <span className="required">*</span>
          </span>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            disabled={saving}
          >
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {errors.status && (
            <span className="field-error">
              {errors.status}
            </span>
          )}
        </label>

        <label className="field field-wide">
          <span>Notes</span>

          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Add notes about this follow-up"
            rows="4"
            disabled={saving}
          />
        </label>

      </div>

      <div className="modal-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="primary-button"
          disabled={saving}
        >
          {saving
            ? 'Saving...'
            : followUp
              ? 'Update Follow-up'
              : 'Add Follow-up'}
        </button>
      </div>
    </form>
  )
}

export default FollowUpForm