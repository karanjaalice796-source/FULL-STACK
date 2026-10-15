function AgeDisplay({ age, loading }) {
  return (
    <section className="age-display" aria-live="polite" aria-busy={loading}>
      <p className="display-label">CURRENT AGE</p>
      <div className="age-value">
        {loading ? (
          <span className="spinner" role="status" aria-label="Updating age" />
        ) : (
          <span>{age}</span>
        )}
      </div>
      <p className="age-caption">{age === 1 ? 'year old' : 'years old'}</p>
    </section>
  )
}

export default AgeDisplay
