import { useReducer, type FormEvent } from 'react'

interface ContactFormState {
  name: string
  email: string
  message: string
  submitted: boolean
}

type ContactFormAction =
  | { type: 'updateField'; field: keyof Pick<ContactFormState, 'name' | 'email' | 'message'>; value: string }
  | { type: 'submit' }
  | { type: 'resetForm' }

const initialContactFormState: ContactFormState = {
  name: '',
  email: '',
  message: '',
  submitted: false,
}

function contactFormReducer(state: ContactFormState, action: ContactFormAction): ContactFormState {
  switch (action.type) {
    case 'updateField':
      return { ...state, [action.field]: action.value, submitted: false }
    case 'submit':
      return { ...state, submitted: true }
    case 'resetForm':
      return initialContactFormState
  }
}

export default function ContactFormExercise() {
  const [state, dispatch] = useReducer(contactFormReducer, initialContactFormState)
  const hasContent = Boolean(state.name.trim() || state.email.trim() || state.message.trim())

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (state.name.trim() && state.email.trim() && state.message.trim()) {
      dispatch({ type: 'submit' })
    }
  }

  return (
    <form className="contact-form-demo" onSubmit={handleSubmit}>
      <div className="contact-fields">
        <label className="field-label">
          NAME
          <input value={state.name} onChange={(event) => dispatch({ type: 'updateField', field: 'name', value: event.target.value })} placeholder="Your name" required />
        </label>
        <label className="field-label">
          EMAIL
          <input type="email" value={state.email} onChange={(event) => dispatch({ type: 'updateField', field: 'email', value: event.target.value })} placeholder="you@example.com" required />
        </label>
        <label className="field-label contact-message">
          MESSAGE
          <textarea value={state.message} onChange={(event) => dispatch({ type: 'updateField', field: 'message', value: event.target.value })} placeholder="What’s on your mind?" rows={3} required />
        </label>
      </div>
      <div className="contact-form-footer">
        <p className="form-state" aria-live="polite">
          {state.submitted ? <span className="success-copy">✓ Message ready to send. Thanks, {state.name}!</span> : hasContent ? 'State updates as you type.' : 'Your form state is waiting for input.'}
        </p>
        <div>
          <button className="button-quiet" type="button" onClick={() => dispatch({ type: 'resetForm' })} disabled={!hasContent && !state.submitted}>Reset</button>
          <button className="button-primary" type="submit">Review message <span aria-hidden="true">↗</span></button>
        </div>
      </div>
    </form>
  )
}
