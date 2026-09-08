function PlaceholderPage({ title, description }) {
  return (
    <section className="placeholder-page">
      <div className="placeholder-icon" aria-hidden="true">+</div>
      <h2>{title}</h2>
      <p>{description}</p>
      <span className="coming-soon">Workspace ready for the next phase</span>
    </section>
  )
}

export default PlaceholderPage
