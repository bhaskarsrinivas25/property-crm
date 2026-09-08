function SummaryCard({ label, value, detail, icon, tone }) {
  return (
    <article className={`summary-card ${tone}-card`}>
      <div className="summary-card-top">
        <span>{label}</span>
        <span className="summary-icon" aria-hidden="true">{icon}</span>
      </div>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  )
}

export default SummaryCard
