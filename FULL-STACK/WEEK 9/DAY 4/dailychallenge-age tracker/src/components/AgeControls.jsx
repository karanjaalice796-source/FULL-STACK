function AgeControls({ age, loading, onAgeUp, onAgeDown }) {
  function handleSubmit(event) {
    event.preventDefault()
  }

  return (
    <form className="age-controls" onSubmit={handleSubmit}>
      <button
        className="control-button control-button--down"
        type="button"
        onClick={onAgeDown}
        disabled={loading || age === 0}
      >
        <span aria-hidden="true">−</span>
        Age down
      </button>
      <button
        className="control-button control-button--up"
        type="button"
        onClick={onAgeUp}
        disabled={loading}
      >
        <span aria-hidden="true">+</span>
        Age up
      </button>
    </form>
  )
}

export default AgeControls
