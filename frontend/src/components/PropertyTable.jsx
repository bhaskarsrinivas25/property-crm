import { formatPropertyOption } from '../data/propertyOptions'

function getStatusTone(status) {
  return { AVAILABLE: 'green', RESERVED: 'orange', SOLD: 'violet', RENTED: 'blue', INACTIVE: 'red' }[status] || 'neutral'
}

function PropertyTable({ properties, onView, onEdit, onDelete }) {
  if (!properties.length) return <div className="empty-state"><span className="empty-state-icon" aria-hidden="true">⌂</span><h3>No properties found</h3><p>Try adjusting your search or filters, or add a new property to get started.</p></div>

  return <div className="table-scroll"><table className="crm-table property-table"><thead><tr><th>Title</th><th>Property type</th><th>Listing type</th><th>Location</th><th>Price</th><th>Area</th><th>Beds</th><th>Baths</th><th>Status</th><th>Owner</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{properties.map((property) => <tr key={property.id}><td><strong>{property.title}</strong></td><td>{formatPropertyOption(property.propertyType)}</td><td><span className={`status-badge listing-${property.listingType.toLowerCase()}`}>{formatPropertyOption(property.listingType)}</span></td><td>{property.location}</td><td>{`$${Number(property.price).toLocaleString()}`}</td><td>{property.area ? `${Number(property.area).toLocaleString()} sq ft` : '—'}</td><td>{property.bedrooms ?? '—'}</td><td>{property.bathrooms ?? '—'}</td><td><span className={`status-badge ${getStatusTone(property.status)}`}>{formatPropertyOption(property.status)}</span></td><td>{property.ownerName}</td><td><div className="row-actions"><button type="button" onClick={() => onView(property)}>View</button><button type="button" onClick={() => onEdit(property)}>Edit</button><button className="danger-action" type="button" onClick={() => onDelete(property)}>Delete</button></div></td></tr>)}</tbody></table></div>
}

export default PropertyTable
