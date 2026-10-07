import { useRef, useState } from 'react'

const MAX_CHARACTERS = 180

export default function CharacterCounter() {
  const inputRef = useRef(null)
  const [characterCount, setCharacterCount] = useState(0)

  function handleInput() {
    setCharacterCount(inputRef.current?.value.length ?? 0)
  }

  return (
    <section className="exercise-card counter-card" aria-labelledby="counter-title">
      <div className="card-topline">
        <span className="exercise-tag">EXERCISE 02</span>
        <span className="card-icon counter-icon" aria-hidden="true">#</span>
      </div>
      <p className="card-kicker">REF / INPUT</p>
      <h2 id="counter-title">Words in <em>progress.</em></h2>
      <p className="card-description">
        Type a thought. A ref reads the input directly while the counter keeps up, character by character.
      </p>
      <label className="input-label" htmlFor="note-input">YOUR NOTE</label>
      <textarea
        id="note-input"
        ref={inputRef}
        onInput={handleInput}
        maxLength={MAX_CHARACTERS}
        placeholder="A good idea can start with just a few words…"
        rows={4}
        aria-describedby="counter-reading"
      />
      <div className="counter-footer" id="counter-reading" aria-live="polite">
        <span>{characterCount === 0 ? 'READY WHEN YOU ARE' : 'KEEP GOING'}</span>
        <strong><b>{characterCount}</b> / {MAX_CHARACTERS} <i>CHARS</i></strong>
      </div>
      <div className="counter-track" aria-hidden="true">
        <span style={{ width: `${(characterCount / MAX_CHARACTERS) * 100}%` }} />
      </div>
    </section>
  )
}
