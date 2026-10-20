import { useEffect, useRef, useState } from 'react'

export default function FocusExercise() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [focusCount, setFocusCount] = useState(0)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function focusInput() {
    inputRef.current?.focus()
    setFocusCount((count) => count + 1)
  }

  return (
    <div className="focus-demo">
      <div className="focus-copy">
        <p className="preview-kicker">HTMLINPUTELEMENT · NULL-SAFE</p>
        <h3>Put the cursor right here.</h3>
        <p>The input is focused on mount. Press the button to safely focus it again via <code>inputRef.current</code>.</p>
      </div>
      <div className="focus-control">
        <label className="field-label" htmlFor="focus-input">TRY TYPING SOMETHING</label>
        <input ref={inputRef} id="focus-input" type="text" placeholder="I’m ready for you…" />
        <button className="button-primary" type="button" onClick={focusInput}>
          Focus the input <span aria-hidden="true">↖</span>
        </button>
        <p className="focus-feedback" aria-live="polite">
          {focusCount ? `Focus requested ${focusCount} ${focusCount === 1 ? 'time' : 'times'}.` : 'Focus the input to see the counter update.'}
        </p>
      </div>
    </div>
  )
}
