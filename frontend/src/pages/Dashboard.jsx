import SummaryCard from '../components/SummaryCard'

const summaryCards = [
  { label: 'Total leads', value: '128', detail: '+12% this month', icon: '◎', tone: 'orange' },
  { label: 'Available properties', value: '24', detail: '3 added this week', icon: '⌂', tone: 'blue' },
  { label: 'Follow-ups today', value: '08', detail: '2 need attention', icon: '↻', tone: 'green' },
  { label: 'Site visits', value: '16', detail: '5 scheduled this week', icon: '⌖', tone: 'violet' },
]

const recentLeads = [
  { name: 'Jordan Lee', phone: '+1 (415) 555-0184', interest: 'Oak Street Apartment', source: 'Website', status: 'New', followUp: 'Today, 2:30 PM' },
  { name: 'Morgan Ellis', phone: '+1 (415) 555-0139', interest: 'Harbor View Townhouse', source: 'Referral', status: 'Qualified', followUp: 'Sep 10, 10:00 AM' },
  { name: 'Priya Shah', phone: '+1 (415) 555-0162', interest: 'Cedar Lane Residence', source: 'Property portal', status: 'Viewing booked', followUp: 'Sep 11, 4:00 PM' },
  { name: 'Daniel Kim', phone: '+1 (415) 555-0117', interest: 'Maple Heights Villa', source: 'Social media', status: 'Contacted', followUp: 'Sep 12, 11:30 AM' },
]

const recentProperties = [
  { title: 'Oak Street Apartment', location: 'North Beach, SF', type: 'Apartment', listing: 'For rent', price: '$3,200 / mo', status: 'Available' },
  { title: 'Harbor View Townhouse', location: 'Sausalito, CA', type: 'Townhouse', listing: 'For sale', price: '$1.24M', status: 'Under review' },
  { title: 'Cedar Lane Residence', location: 'Palo Alto, CA', type: 'Single family', listing: 'For sale', price: '$2.85M', status: 'Available' },
]

const followUps = [
  { name: 'Jordan Lee', time: '2:30 PM', interest: 'Oak Street Apartment', status: 'Call due', tone: 'orange' },
  { name: 'Morgan Ellis', time: '4:00 PM', interest: 'Harbor View Townhouse', status: 'Email due', tone: 'blue' },
  { name: 'Priya Shah', time: '5:15 PM', interest: 'Cedar Lane Residence', status: 'Viewing reminder', tone: 'green' },
]

function StatusBadge({ children, tone = 'neutral' }) {
  return <span className={`status-badge ${tone}`}>{children}</span>
}

function getLeadTone(status) {
  return { New: 'blue', Qualified: 'green', 'Viewing booked': 'orange', Contacted: 'neutral' }[status] || 'neutral'
}

function getPropertyTone(status) {
  return status === 'Available' ? 'green' : 'neutral'
}

function Dashboard() {
  return (
    <div className="dashboard-page">
      <section className="dashboard-intro">
        <div>
          <p className="eyebrow">Tuesday, September 8, 2026</p>
          <h2>Dashboard</h2>
          <p className="muted">Overview of your property sales and customer activity.</p>
        </div>
        <button className="primary-button" type="button">+ Add lead</button>
      </section>

      <section className="summary-grid" aria-label="CRM summary">
        {summaryCards.map((card) => <SummaryCard {...card} key={card.label} />)}
      </section>

      <section className="dashboard-section panel">
        <div className="section-heading">
          <div><h2>Recent leads</h2><p className="muted">Latest customer enquiries and their next steps</p></div>
          <button className="text-button" type="button">View all leads</button>
        </div>
        <div className="table-scroll">
          <table className="crm-table">
            <thead><tr><th>Customer</th><th>Phone</th><th>Property interest</th><th>Source</th><th>Status</th><th>Follow-up</th></tr></thead>
            <tbody>{recentLeads.map((lead) => <tr key={lead.name}><td><strong>{lead.name}</strong></td><td>{lead.phone}</td><td>{lead.interest}</td><td>{lead.source}</td><td><StatusBadge tone={getLeadTone(lead.status)}>{lead.status}</StatusBadge></td><td>{lead.followUp}</td></tr>)}</tbody>
          </table>
        </div>
      </section>

      <div className="dashboard-lower-grid">
        <section className="dashboard-section panel">
          <div className="section-heading">
            <div><h2>Recent properties</h2><p className="muted">Listings recently added or updated</p></div>
            <button className="text-button" type="button">View all properties</button>
          </div>
          <div className="table-scroll">
            <table className="crm-table properties-table">
              <thead><tr><th>Property</th><th>Location</th><th>Type</th><th>Listing</th><th>Price</th><th>Status</th></tr></thead>
              <tbody>{recentProperties.map((property) => <tr key={property.title}><td><strong>{property.title}</strong></td><td>{property.location}</td><td>{property.type}</td><td>{property.listing}</td><td>{property.price}</td><td><StatusBadge tone={getPropertyTone(property.status)}>{property.status}</StatusBadge></td></tr>)}</tbody>
            </table>
          </div>
        </section>

        <section className="dashboard-section panel follow-up-panel">
          <div className="section-heading"><div><h2>Today&apos;s follow-ups</h2><p className="muted">Keep the pipeline moving</p></div><span className="count-label">{followUps.length} due</span></div>
          <div className="follow-up-list">{followUps.map((followUp) => <div className="follow-up-item" key={followUp.name}><div className={`follow-up-marker ${followUp.tone}`} /><div className="follow-up-details"><strong>{followUp.name}</strong><span>{followUp.interest}</span></div><div className="follow-up-action"><time>{followUp.time}</time><StatusBadge tone={followUp.tone}>{followUp.status}</StatusBadge></div></div>)}</div>
        </section>
      </div>
    </div>
  )
}

export default Dashboard
