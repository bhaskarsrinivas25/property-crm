function CustomerTable({ customers, onView, onEdit, onDelete }) {
  return (
    <table className="crm-table customer-table">
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
            <td>
              <strong>{customer.name}</strong>
            </td>

            <td>{customer.phone}</td>

            <td>{customer.email || '—'}</td>

            <td>{customer.address || '—'}</td>

            <td>
              <div className="row-actions">
                <button
                  type="button"
                  onClick={() => onView(customer)}
                  title="View customer"
                >
                  View
                </button>

                <button
                  type="button"
                  onClick={() => onEdit(customer)}
                  title="Edit customer"
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="danger-action"
                  onClick={() => onDelete(customer)}
                  title="Delete customer"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default CustomerTable