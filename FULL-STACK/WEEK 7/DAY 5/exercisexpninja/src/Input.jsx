function Input({ id, label, name, value, onChange, error, inputMode, autoComplete }) {
  return (
    <div className="ninja-field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type="text"
        value={value}
        onChange={onChange}
        inputMode={inputMode}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && <p className="ninja-error" id={`${id}-error`} role="alert">{error}</p>}
    </div>
  )
}

export default Input
