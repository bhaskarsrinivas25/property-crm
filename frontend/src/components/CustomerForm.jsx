import { useEffect, useState } from 'react'

const emptyForm = {
  name: '',
  phone: '',
  email: '',
  address: '',
  notes: '',
}

function CustomerForm({ customer, onSubmit, onCancel, saving = false }) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (customer) {
      setForm({
        name: customer.name || '',
        phone: customer.phone || '',
        email: customer.email || '',
        address: customer.address || '',
        notes: customer.notes || '',
      })
    } else {
      setForm({ ...emptyForm })
    }

    setErrors({})
  }, [customer])

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

    if (!form.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (form.name.trim().length > 100) {
      newErrors.name = 'Name must not exceed 100 characters'
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'Phone is required'
    } else if (form.phone.trim().length > 20) {
      newErrors.phone = 'Phone must not exceed 20 characters'
    }

    if (form.email.trim()) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      if (!emailPattern.test(form.email.trim())) {
        newErrors.email = 'Please enter a valid email'
      } else if (form.email.trim().length > 150) {
        newErrors.email = 'Email must not exceed 150 characters'
      }
    }

    if (form.address.trim().length > 255) {
      newErrors.address = 'Address must not exceed 255 characters'
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
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || null,
      address: form.address.trim() || null,
      notes: form.notes.trim() || null,
    })
  }

  return (
    <form className="lead-form customer-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label className="field">
          <span>
            Name <span className="required">*</span>
          </span>

          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter customer name"
            disabled={saving}
          />

          {errors.name && (
            <span className="field-error">{errors.name}</span>
          )}
        </label>

        <label className="field">
          <span>
            Phone <span className="required">*</span>
          </span>

          <input
            name="phone"
            type="text"
            value={form.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            disabled={saving}
          />

          {errors.phone && (
            <span className="field-error">{errors.phone}</span>
          )}
        </label>

        <label className="field">
          <span>Email</span>

          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter email address"
            disabled={saving}
          />

          {errors.email && (
            <span className="field-error">{errors.email}</span>
          )}
        </label>

        <label className="field">
          <span>Address</span>

          <input
            name="address"
            type="text"
            value={form.address}
            onChange={handleChange}
            placeholder="Enter customer address"
            disabled={saving}
          />

          {errors.address && (
            <span className="field-error">{errors.address}</span>
          )}
        </label>

        <label className="field field-wide">
          <span>Notes</span>

          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Add notes about this customer"
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
            : customer
              ? 'Update Customer'
              : 'Add Customer'}
        </button>
      </div>
    </form>
  )
}

export default CustomerForm