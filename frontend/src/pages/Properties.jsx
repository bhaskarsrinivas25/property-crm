import { useMemo, useState } from 'react'
import PropertyForm from '../components/PropertyForm'
import PropertyTable from '../components/PropertyTable'
import { blankProperty, formatPropertyOption, listingTypes, propertyStatuses, propertyTypes } from '../data/propertyOptions'

const sampleProperties = [
  { id: 1, title: 'Oak Street Apartment', propertyType: 'APARTMENT', listingType: 'RENT', location: 'North Beach, SF', address: '184 Oak Street, San Francisco, CA', price: 3200, bedrooms: 2, bathrooms: 2, area: 1180, description: 'Bright two-bedroom apartment with a renovated kitchen and shared courtyard.', status: 'AVAILABLE', ownerName: 'Taylor Brooks', ownerPhone: '+1 (415) 555-0128' },
  { id: 2, title: 'Harbor View Townhouse', propertyType: 'HOUSE', listingType: 'SALE', location: 'Sausalito, CA', address: '27 Harbor View Lane, Sausalito, CA', price: 1240000, bedrooms: 3, bathrooms: 2, area: 2140, description: 'Family townhouse with bay views, private patio, and a two-car garage.', status: 'RESERVED', ownerName: 'Maya Chen', ownerPhone: '+1 (415) 555-0172' },
  { id: 3, title: 'Cedar Lane Residence', propertyType: 'VILLA', listingType: 'SALE', location: 'Palo Alto, CA', address: '63 Cedar Lane, Palo Alto, CA', price: 2850000, bedrooms: 4, bathrooms: 3, area: 3260, description: 'Modern villa with a home office, landscaped garden, and pool.', status: 'AVAILABLE', ownerName: 'Robert Hayes', ownerPhone: '+1 (650) 555-0141' },
  { id: 4, title: 'Mission District Retail', propertyType: 'SHOP', listingType: 'RENT', location: 'Mission District, SF', address: '410 Valencia Street, San Francisco, CA', price: 7800, bedrooms: null, bathrooms: 1, area: 1480, description: 'Street-level retail space with strong pedestrian traffic and flexible frontage.', status: 'RENTED', ownerName: 'Elena Garcia', ownerPhone: '+1 (415) 555-0193' },
  { id: 5, title: 'East Bay Development Parcel', propertyType: 'LAND', listingType: 'SALE', location: 'Oakland, CA', address: '901 Skyline Boulevard, Oakland, CA', price: 475000, bedrooms: null, bathrooms: null, area: 12400, description: 'Level parcel with preliminary plans available for review.', status: 'INACTIVE', ownerName: 'Samuel Ortiz', ownerPhone: '+1 (510) 555-0116' },
]

function Modal({ title, children, onClose, wide = false }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div className={`modal-card${wide ? ' modal-wide' : ''}`} role="dialog" aria-modal="true" aria-labelledby="property-modal-title"><div className="modal-heading"><h2 id="property-modal-title">{title}</h2><button className="modal-close" type="button" aria-label="Close dialog" onClick={onClose}>×</button></div>{children}</div></div>
}

function PropertyDetails({ property, onClose }) {
  return <Modal title="Property details" onClose={onClose}><div className="property-details"><div><span>Title</span><strong>{property.title}</strong></div><div><span>Status</span><strong>{formatPropertyOption(property.status)}</strong></div><div><span>Property type</span><strong>{formatPropertyOption(property.propertyType)}</strong></div><div><span>Listing type</span><strong>{formatPropertyOption(property.listingType)}</strong></div><div><span>Location</span><strong>{property.location}</strong></div><div><span>Address</span><strong>{property.address || 'Not provided'}</strong></div><div><span>Price</span><strong>${Number(property.price).toLocaleString()}</strong></div><div><span>Specifications</span><strong>{property.bedrooms ?? '—'} bedrooms · {property.bathrooms ?? '—'} bathrooms · {property.area ? `${Number(property.area).toLocaleString()} sq ft` : 'Area not provided'}</strong></div><div><span>Owner</span><strong>{property.ownerName}</strong></div><div><span>Owner phone</span><strong>{property.ownerPhone}</strong></div><div className="details-wide"><span>Description</span><strong>{property.description || 'No description added.'}</strong></div></div><div className="modal-actions"><button className="secondary-button" type="button" onClick={onClose}>Close</button></div></Modal>
}

function Properties() {
  const [properties, setProperties] = useState(sampleProperties)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [listingFilter, setListingFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [modal, setModal] = useState(null)
  const [selectedProperty, setSelectedProperty] = useState(null)

  const filteredProperties = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return properties.filter((property) => {
      const matchesQuery = !normalizedQuery || [property.title, property.location, property.propertyType, property.ownerName].some((value) => value.toLowerCase().includes(normalizedQuery))
      return matchesQuery && (!statusFilter || property.status === statusFilter) && (!listingFilter || property.listingType === listingFilter) && (!typeFilter || property.propertyType === typeFilter)
    })
  }, [listingFilter, properties, query, statusFilter, typeFilter])

  function openAddModal() { setSelectedProperty(null); setModal('form') }
  function openEditModal(property) { setSelectedProperty(property); setModal('form') }
  function handleSave(form) {
    if (selectedProperty) setProperties((current) => current.map((property) => property.id === selectedProperty.id ? { ...property, ...form } : property))
    else setProperties((current) => [...current, { ...form, id: Date.now() }])
    setModal(null)
    setSelectedProperty(null)
  }
  function openDeleteModal(property) { setSelectedProperty(property); setModal('delete') }
  function confirmDelete() { setProperties((current) => current.filter((property) => property.id !== selectedProperty.id)); setModal(null); setSelectedProperty(null) }

  return <div className="properties-page">
    <section className="properties-intro"><div><p className="eyebrow">Property portfolio</p><h2>Properties</h2><p className="muted">Manage listings, availability, and owner information from one workspace.</p></div><button className="primary-button" type="button" onClick={openAddModal}>+ Add property</button></section>
    <section className="properties-panel panel">
      <div className="properties-toolbar"><div><h2>All properties</h2><p className="muted">{filteredProperties.length} of {properties.length} properties shown</p></div><label className="search-field"><span aria-hidden="true">⌕</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, location, owner" aria-label="Search properties" /></label></div>
      <div className="filter-row"><label><span>Status</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter by status"><option value="">All statuses</option>{propertyStatuses.map((status) => <option key={status} value={status}>{formatPropertyOption(status)}</option>)}</select></label><label><span>Listing</span><select value={listingFilter} onChange={(event) => setListingFilter(event.target.value)} aria-label="Filter by listing type"><option value="">All listings</option>{listingTypes.map((type) => <option key={type} value={type}>{formatPropertyOption(type)}</option>)}</select></label><label><span>Property type</span><select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} aria-label="Filter by property type"><option value="">All types</option>{propertyTypes.map((type) => <option key={type} value={type}>{formatPropertyOption(type)}</option>)}</select></label>{(statusFilter || listingFilter || typeFilter || query) && <button className="clear-filters" type="button" onClick={() => { setQuery(''); setStatusFilter(''); setListingFilter(''); setTypeFilter('') }}>Clear filters</button>}</div>
      <PropertyTable properties={filteredProperties} onView={(property) => { setSelectedProperty(property); setModal('view') }} onEdit={openEditModal} onDelete={openDeleteModal} />
    </section>
    {modal === 'form' && <Modal title={selectedProperty ? 'Edit property' : 'Add property'} onClose={() => setModal(null)} wide><PropertyForm initialProperty={selectedProperty || blankProperty} onCancel={() => setModal(null)} onSubmit={handleSave} /></Modal>}
    {modal === 'view' && selectedProperty && <PropertyDetails property={selectedProperty} onClose={() => setModal(null)} />}
    {modal === 'delete' && selectedProperty && <Modal title="Delete property" onClose={() => setModal(null)}><div className="confirm-copy"><p>Are you sure you want to remove <strong>{selectedProperty.title}</strong> from your property portfolio?</p><span>This action only changes the local demo data.</span></div><div className="modal-actions"><button className="secondary-button" type="button" onClick={() => setModal(null)}>Cancel</button><button className="danger-button" type="button" onClick={confirmDelete}>Delete property</button></div></Modal>}
  </div>
}

export default Properties
