function BootstrapCard({ title, imageUrl, buttonLabel, buttonUrl, description }) {
  return (
    <article className="card celebrity-card" style={{ width: '30rem' }}>
      <img className="card-img-top celebrity-image" src={imageUrl} alt={title} />
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p className="card-text">{description}</p>
        <a
          className="btn btn-primary"
          href={buttonUrl}
          target="_blank"
          rel="noreferrer"
        >
          {buttonLabel}
        </a>
      </div>
    </article>
  )
}

export default BootstrapCard