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
    setViewingCustomer(null)
    setShowForm(true)
    setError('')
  }

  function handleEdit(customer) {
    setEditingCustomer(customer)
    setViewingCustomer(null)
    setShowForm(true)
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
        previous.filter(
          (item) => item.id !== customer.id
        )
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

  function handleCloseDetails() {
    setViewingCustomer(null)
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
    <div className="customers-page">

      {/* Page Header */}

      <section className="customers-intro">
        <div>
          <p className="eyebrow">
            Customer management
          </p>

          <h2>Customers</h2>

          <p className="muted">
            Manage your property customers and their information.
          </p>
        </div>

        {!showForm && !viewingCustomer && (
          <button
            type="button"
            className="primary-button"
            onClick={handleAdd}
          >
            + Add Customer
          </button>
        )}
      </section>

      {/* API Error */}

      {error && (
        <div className="api-error">
          <strong>Something went wrong</strong>
          <span>{error}</span>
        </div>
      )}

      {/* Add / Edit Customer */}

      {showForm && (
        <section className="panel customers-panel">

          <div className="customers-toolbar">
            <div>
              <h2>
                {editingCustomer
                  ? 'Edit Customer'
                  : 'Add Customer'}
              </h2>

              <p className="muted">
                {editingCustomer
                  ? 'Update the customer information below.'
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

        </section>
      )}

      {/* Customer Details */}

      {!showForm && viewingCustomer && (
        <section className="panel customers-panel">

          <div className="customers-toolbar">
            <div>
              <h2>Customer Details</h2>

              <p className="muted">
                Complete information about this customer.
              </p>
            </div>

            <button
              type="button"
              className="secondary-button"
              onClick={handleCloseDetails}
            >
              Close
            </button>
          </div>

          <div className="customer-details">

            <div>
              <span>Name</span>
              <strong>
                {viewingCustomer.name}
              </strong>
            </div>

            <div>
              <span>Phone</span>
              <strong>
                {viewingCustomer.phone}
              </strong>
            </div>

            <div>
              <span>Email</span>
              <strong>
                {viewingCustomer.email || '—'}
              </strong>
            </div>

            <div>
              <span>Address</span>
              <strong>
                {viewingCustomer.address || '—'}
              </strong>
            </div>

            <div className="details-wide">
              <span>Notes</span>
              <strong>
                {viewingCustomer.notes || '—'}
              </strong>
            </div>

            <div>
              <span>Created At</span>
              <strong>
                {formatDate(viewingCustomer.createdAt)}
              </strong>
            </div>

            <div>
              <span>Last Updated</span>
              <strong>
                {formatDate(viewingCustomer.updatedAt)}
              </strong>
            </div>

          </div>
        </section>
      )}

      {/* Customer List */}

      {!showForm && !viewingCustomer && (
        <section className="panel customers-panel">

          <div className="customers-toolbar">

            <div>
              <h2>Customer List</h2>

              <p className="muted">
                {customers.length}{' '}
                customer
                {customers.length === 1
                  ? ''
                  : 's'} in your CRM.
              </p>
            </div>

            <label className="search-field">
              <span aria-hidden="true">⌕</span>

              <input
                type="search"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                aria-label="Search customers"
              />
            </label>

          </div>

          {loading ? (

            <div className="loading-state">
              Loading customers...
            </div>

          ) : filteredCustomers.length === 0 ? (

            <div className="empty-state">

              <div className="empty-state-icon">
                👤
              </div>

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

            <div className="table-scroll">
              <CustomerTable
                customers={filteredCustomers}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>

          )}

        </section>
      )}

    </div>
  )
}

function getErrorMessage(error) {
  if (error.response?.data?.message) {
    return error.response.data.message
  }

  if (error.response?.data?.errors) {
    return Object.values(
      error.response.data.errors
    ).join(', ')
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