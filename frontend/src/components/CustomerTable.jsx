function CustomerTable({ customers, onView, onEdit, onDelete }) {
  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.name}</td>
              <td>{customer.phone}</td>
              <td>{customer.email || '—'}</td>
              <td>{customer.address || '—'}</td>

              <td>
                <div className="table-actions">
                  <button
                    type="button"
                    className="action-button view"
                    onClick={() => onView(customer)}
                  >
                    View
                  </button>

                  <button
                    type="button"
                    className="action-button edit"
                    onClick={() => onEdit(customer)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="action-button delete"
                    onClick={() => onDelete(customer)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CustomerTable