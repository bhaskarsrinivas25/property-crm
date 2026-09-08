function Header({ title }) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Property CRM workspace</p>
        <h1>{title}</h1>
      </div>
      <button className="profile-button" type="button" aria-label="Open profile menu">
        <span className="avatar">AR</span>
        <span className="profile-copy"><strong>Alex Rivera</strong><small>Administrator</small></span>
        <span className="profile-chevron" aria-hidden="true">⌄</span>
      </button>
    </header>
  )
}

export default Header
