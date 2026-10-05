export default function FormComponent({ formData, onChange }) {
  const previewName = [formData.firstName, formData.lastName].filter(Boolean).join(' ')

  return (
    <section className="form-layout" aria-label="Travel form and live summary">
      <form className="travel-form" method="get" action="/">
        <div className="form-heading">
          <div>
            <p className="form-kicker">YOUR TRAVEL PARTY</p>
            <h2>First, the basics.</h2>
          </div>
          <span className="paperclip" aria-hidden="true">⌁</span>
        </div>

        <div className="name-fields">
          <label className="field">
            <span>First name</span>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={onChange}
              placeholder="e.g. John"
              autoComplete="given-name"
              required
            />
          </label>
          <label className="field">
            <span>Last name</span>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={onChange}
              placeholder="e.g. Doe"
              autoComplete="family-name"
              required
            />
          </label>
        </div>

        <label className="field age-field">
          <span>How old are you?</span>
          <input
            type="number"
            name="age"
            min="1"
            max="120"
            value={formData.age}
            onChange={onChange}
            placeholder="Your age"
            required
          />
        </label>

        <fieldset className="choice-group">
          <legend>Gender</legend>
          <div className="choice-options">
            {['male', 'female', 'other'].map((gender) => (
              <label className="radio-choice" key={gender}>
                <input
                  type="radio"
                  name="gender"
                  value={gender}
                  checked={formData.gender === gender}
                  onChange={onChange}
                  required
                />
                <span className="custom-radio" aria-hidden="true" />
                <span>{gender[0].toUpperCase() + gender.slice(1)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="field destination-field">
          <span>Pick a destination</span>
          <select name="destination" value={formData.destination} onChange={onChange} required>
            <option value="" disabled>Choose somewhere...</option>
            <option value="Japan">Japan</option>
            <option value="Italy">Italy</option>
            <option value="France">France</option>
            <option value="Brazil">Brazil</option>
            <option value="New Zealand">New Zealand</option>
          </select>
          <span className="select-caret" aria-hidden="true">⌄</span>
        </label>

        <label className="checkbox-choice">
          <input
            type="checkbox"
            name="lactoseFree"
            checked={formData.lactoseFree}
            onChange={onChange}
          />
          <span className="custom-checkbox" aria-hidden="true">{formData.lactoseFree ? '✓' : ''}</span>
          <span>I’m lactose free <i>(help us look after you)</i></span>
        </label>

        <button className="submit-button" type="submit">
          Save my travel notes <span aria-hidden="true">→</span>
        </button>
        <p className="submit-note">Your answers will travel in the page address when you submit.</p>
      </form>

      <aside className="preview-card" aria-live="polite">
        <div className="preview-tape" aria-hidden="true" />
        <p className="preview-kicker"><span>✳</span> NOTES SO FAR</p>
        <h2>{previewName || 'Your name goes here'}</h2>
        <div className="preview-rule" />
        <dl className="preview-list">
          <div><dt>Age</dt><dd>{formData.age || '—'}</dd></div>
          <div><dt>Gender</dt><dd>{formData.gender || '—'}</dd></div>
          <div><dt>Destination</dt><dd>{formData.destination || 'Not picked yet'}</dd></div>
          <div><dt>Food note</dt><dd>{formData.lactoseFree ? 'Lactose free' : 'No note added'}</dd></div>
        </dl>
        <p className="preview-signoff">Every good trip starts somewhere.<span>✎</span></p>
      </aside>
    </section>
  )
}
