import { useEffect, useMemo, useState } from 'react'
import PropertyForm from '../components/PropertyForm'
import PropertyTable from '../components/PropertyTable'
import {
  blankProperty,
  formatPropertyOption,
  listingTypes,
  propertyStatuses,
  propertyTypes,
} from '../data/propertyOptions'
import {
  createProperty,
  deleteProperty,
  getProperties,
  updateProperty,
} from '../services/propertyService'

function Modal({ title, children, onClose, wide = false }) {
  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) =>
        event.target === event.currentTarget && onClose()
      }
    >
      <div
        className={`modal-card${wide ? ' modal-wide' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="property-modal-title"
      >
        <div className="modal-heading">
          <h2 id="property-modal-title">{title}</h2>
          <button
            className="modal-close"
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function PropertyDetails({ property, onClose }) {
  return (
    <Modal title="Property details" onClose={onClose}>
      <div className="property-details">
        <div>
          <span>Title</span>
          <strong>{property.title}</strong>
        </div>
        <div>
          <span>Status</span>
          <strong>{formatPropertyOption(property.status)}</strong>
        </div>
        <div>
          <span>Property type</span>
          <strong>{formatPropertyOption(property.propertyType)}</strong>
        </div>
        <div>
          <span>Listing type</span>
          <strong>{formatPropertyOption(property.listingType)}</strong>
        </div>
        <div>
          <span>Location</span>
          <strong>{property.location}</strong>
        </div>
        <div>
          <span>Address</span>
          <strong>{property.address || 'Not provided'}</strong>
        </div>
        <div>
          <span>Price</span>
          <strong>
            ₹{Number(property.price).toLocaleString('en-IN')}
          </strong>
        </div>
        <div>
          <span>Specifications</span>
          <strong>
            {property.bedrooms ?? '—'} bedrooms ·{' '}
            {property.bathrooms ?? '—'} bathrooms ·{' '}
            {property.area
              ? `${Number(property.area).toLocaleString('en-IN')} sq ft`
              : 'Area not provided'}
          </strong>
        </div>
        <div>
          <span>Owner</span>
          <strong>{property.ownerName}</strong>
        </div>
        <div>
          <span>Owner phone</span>
          <strong>{property.ownerPhone}</strong>
        </div>
        <div className="details-wide">
          <span>Description</span>
          <strong>
            {property.description || 'No description added.'}
          </strong>
        </div>
      </div>

      <div className="modal-actions">
        <button className="secondary-button" type="button" onClick={onClose}>
          Close
        </button>
      </div>
    </Modal>
  )
}

function Properties() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [listingFilter, setListingFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  const [modal, setModal] = useState(null)
  const [selectedProperty, setSelectedProperty] = useState(null)

  useEffect(() => {
    async function loadProperties() {
      try {
        setLoading(true)
        setError('')

        const data = await getProperties()
        setProperties(data)
      } catch (err) {
        console.error('Failed to load properties:', err)
        setError('Unable to load properties. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadProperties()
  }, [])

  const filteredProperties = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return properties.filter((property) => {
      const matchesQuery =
        !normalizedQuery ||
        [
          property.title,
          property.location,
          property.propertyType,
          property.ownerName,
        ].some((value) =>
          String(value ?? '').toLowerCase().includes(normalizedQuery)
        )

      return (
        matchesQuery &&
        (!statusFilter || property.status === statusFilter) &&
        (!listingFilter || property.listingType === listingFilter) &&
        (!typeFilter || property.propertyType === typeFilter)
      )
    })
  }, [listingFilter, properties, query, statusFilter, typeFilter])

  function openAddModal() {
    setSelectedProperty(null)
    setError('')
    setModal('form')
  }

  function openEditModal(property) {
    setSelectedProperty(property)
    setError('')
    setModal('form')
  }

  async function handleSave(form) {
    try {
      setError('')

      if (selectedProperty) {
        const updatedProperty = await updateProperty(
          selectedProperty.id,
          form
        )

        setProperties((current) =>
          current.map((property) =>
            property.id === selectedProperty.id
              ? updatedProperty
              : property
          )
        )
      } else {
        const newProperty = await createProperty(form)

        setProperties((current) => [...current, newProperty])
      }

      setModal(null)
      setSelectedProperty(null)
    } catch (err) {
      console.error('Failed to save property:', err)
      setError('Unable to save property. Please try again.')
    }
  }

  function openDeleteModal(property) {
    setSelectedProperty(property)
    setError('')
    setModal('delete')
  }

  async function confirmDelete() {
    try {
      setError('')

      await deleteProperty(selectedProperty.id)

      setProperties((current) =>
        current.filter(
          (property) => property.id !== selectedProperty.id
        )
      )

      setModal(null)
      setSelectedProperty(null)
    } catch (err) {
      console.error('Failed to delete property:', err)
      setError('Unable to delete property. Please try again.')
    }
  }

  return (
    <div className="properties-page">
      <section className="properties-intro">
        <div>
          <p className="eyebrow">Property portfolio</p>
          <h2>Properties</h2>
          <p className="muted">
            Manage listings, availability, and owner information from one
            workspace.
          </p>
        </div>

        <button
          className="primary-button"
          type="button"
          onClick={openAddModal}
        >
          + Add property
        </button>
      </section>

      <section className="properties-panel panel">
        <div className="properties-toolbar">
          <div>
            <h2>All properties</h2>
            <p className="muted">
              {filteredProperties.length} of {properties.length} properties
              shown
            </p>
          </div>

          <label className="search-field">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title, location, owner"
              aria-label="Search properties"
            />
          </label>
        </div>

        <div className="filter-row">
          <label>
            <span>Status</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter by status"
            >
              <option value="">All statuses</option>
              {propertyStatuses.map((status) => (
                <option key={status} value={status}>
                  {formatPropertyOption(status)}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Listing</span>
            <select
              value={listingFilter}
              onChange={(event) => setListingFilter(event.target.value)}
              aria-label="Filter by listing type"
            >
              <option value="">All listings</option>
              {listingTypes.map((type) => (
                <option key={type} value={type}>
                  {formatPropertyOption(type)}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Property type</span>
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              aria-label="Filter by property type"
            >
              <option value="">All types</option>
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {formatPropertyOption(type)}
                </option>
              ))}
            </select>
          </label>

          {(statusFilter || listingFilter || typeFilter || query) && (
            <button
              className="clear-filters"
              type="button"
              onClick={() => {
                setQuery('')
                setStatusFilter('')
                setListingFilter('')
                setTypeFilter('')
              }}
            >
              Clear filters
            </button>
          )}
        </div>

        {loading && <p className="muted">Loading properties...</p>}

        {error && <p className="field-error">{error}</p>}

        {!loading && (
          <PropertyTable
            properties={filteredProperties}
            onView={(property) => {
              setSelectedProperty(property)
              setModal('view')
            }}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
          />
        )}
      </section>

      {modal === 'form' && (
        <Modal
          title={selectedProperty ? 'Edit property' : 'Add property'}
          onClose={() => {
            setModal(null)
            setSelectedProperty(null)
          }}
          wide
        >
          <PropertyForm
            initialProperty={selectedProperty || blankProperty}
            onCancel={() => {
              setModal(null)
              setSelectedProperty(null)
            }}
            onSubmit={handleSave}
          />
        </Modal>
      )}

      {modal === 'view' && selectedProperty && (
        <PropertyDetails
          property={selectedProperty}
          onClose={() => {
            setModal(null)
            setSelectedProperty(null)
          }}
        />
      )}

      {modal === 'delete' && selectedProperty && (
        <Modal
          title="Delete property"
          onClose={() => {
            setModal(null)
            setSelectedProperty(null)
          }}
        >
          <div className="confirm-copy">
            <p>
              Are you sure you want to remove{' '}
              <strong>{selectedProperty.title}</strong> from your property
              portfolio?
            </p>
            <span>
              This action will permanently delete the property from the
              database.
            </span>
          </div>

          <div className="modal-actions">
            <button
              className="secondary-button"
              type="button"
              onClick={() => {
                setModal(null)
                setSelectedProperty(null)
              }}
            >
              Cancel
            </button>

            <button
              className="danger-button"
              type="button"
              onClick={confirmDelete}
            >
              Delete property
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default Properties