import { useEffect, useMemo, useState } from 'react'
import CustomerForm from '../components/CustomerForm'
import CustomerTable from '../components/CustomerTable'
import {
  createCustomer,
  deleteCustomer,
  getCustomers,
  updateCustomer,
} from '../services/customerService'

function Customers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [viewingCustomer, setViewingCustomer] = useState(null)

  useEffect(() => {
    loadCustomers()
  }, [])

  async function loadCustomers() {
    try {
      setLoading(true)
      setError('')

      const data = await getCustomers()
      setCustomers(data)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(customerData) {
    try {
      setSaving(true)
      setError('')

      if (editingCustomer) {
        const updatedCustomer = await updateCustomer(
          editingCustomer.id,
          customerData
        )

        setCustomers((previous) =>
          previous.map((customer) =>
            customer.id === updatedCustomer.id
              ? updatedCustomer
              : customer
          )
        )
      } else {
        const newCustomer = await createCustomer(customerData)

        setCustomers((previous) => [
          ...previous,
          newCustomer,
        ])
      }

      setShowForm(false)
      setEditingCustomer(null)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  function handleAdd() {
    setEditingCustomer(null)
    setShowForm(true)
    setViewingCustomer(null)
    setError('')
  }

  function handleEdit(customer) {
    setEditingCustomer(customer)
    setShowForm(true)
    setViewingCustomer(null)
    setError('')
  }

  function handleView(customer) {
    setViewingCustomer(customer)
    setShowForm(false)
    setError('')
  }

  async function handleDelete(customer) {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${customer.name}"?`
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')

      await deleteCustomer(customer.id)

      setCustomers((previous) =>
        previous.filter((item) => item.id !== customer.id)
      )

      if (viewingCustomer?.id === customer.id) {
        setViewingCustomer(null)
      }
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  function handleCancel() {
    setShowForm(false)
    setEditingCustomer(null)
    setError('')
  }

  const filteredCustomers = useMemo(() => {
    const search = searchTerm.trim().toLowerCase()

    if (!search) {
      return customers
    }

    return customers.filter((customer) =>
      [
        customer.name,
        customer.phone,
        customer.email,
        customer.address,
      ]
        .filter(Boolean)
        .some((value) =>
          value.toLowerCase().includes(search)
        )
    )
  }, [customers, searchTerm])

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Customers</h1>
          <p>Manage your property customers and their information.</p>
        </div>

        {!showForm && (
          <button
            type="button"
            className="primary-button"
            onClick={handleAdd}
          >
            + Add Customer
          </button>
        )}
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {showForm ? (
        <div className="form-card">
          <div className="section-header">
            <div>
              <h2>
                {editingCustomer
                  ? 'Edit Customer'
                  : 'Add Customer'}
              </h2>

              <p>
                {editingCustomer
                  ? 'Update customer information.'
                  : 'Enter the customer details below.'}
              </p>
            </div>
          </div>

          <CustomerForm
            customer={editingCustomer}
            onSubmit={handleSave}
            onCancel={handleCancel}
            saving={saving}
          />
        </div>
      ) : viewingCustomer ? (
        <div className="details-card">
          <div className="section-header">
            <div>
              <h2>Customer Details</h2>
              <p>Complete information about this customer.</p>
            </div>

            <button
              type="button"
              className="secondary-button"
              onClick={() => setViewingCustomer(null)}
            >
              Close
            </button>
          </div>

          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Name</span>
              <span className="detail-value">
                {viewingCustomer.name}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Phone</span>
              <span className="detail-value">
                {viewingCustomer.phone}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Email</span>
              <span className="detail-value">
                {viewingCustomer.email || '—'}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Address</span>
              <span className="detail-value">
                {viewingCustomer.address || '—'}
              </span>
            </div>

            <div className="detail-item detail-item-full">
              <span className="detail-label">Notes</span>
              <span className="detail-value">
                {viewingCustomer.notes || '—'}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Created At</span>
              <span className="detail-value">
                {formatDate(viewingCustomer.createdAt)}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Last Updated</span>
              <span className="detail-value">
                {formatDate(viewingCustomer.updatedAt)}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="toolbar">
            <input
              type="text"
              className="search-input"
              placeholder="Search customers by name, phone, email or address..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />
          </div>

          {loading ? (
            <div className="empty-state">
              <p>Loading customers...</p>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="empty-state">
              <h3>
                {searchTerm
                  ? 'No customers found'
                  : 'No customers yet'}
              </h3>

              <p>
                {searchTerm
                  ? 'Try a different search term.'
                  : 'Add your first customer to get started.'}
              </p>

              {!searchTerm && (
                <button
                  type="button"
                  className="primary-button"
                  onClick={handleAdd}
                >
                  + Add Customer
                </button>
              )}
            </div>
          ) : (
            <CustomerTable
              customers={filteredCustomers}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </>
      )}
    </div>
  )
}

function getErrorMessage(error) {
  if (error.response?.data?.message) {
    return error.response.data.message
  }

  if (error.response?.data?.errors) {
    return Object.values(error.response.data.errors).join(', ')
  }

  if (error.response) {
    return 'Something went wrong while communicating with the server.'
  }

  return 'Unable to reach the backend. Check that the Spring Boot server is running.'
}

function formatDate(value) {
  if (!value) {
    return '—'
  }

  return new Date(value).toLocaleString('en-IN')
}

export default Customers