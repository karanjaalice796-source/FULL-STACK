import { useReducer, useState } from 'react'

type SurveyStatus = 'initial' | 'active' | 'submitting' | 'completed'

interface SurveyState {
  status: SurveyStatus
  feedback: string
}

type SurveyAction =
  | { type: 'start' }
  | { type: 'submissionStarted' }
  | { type: 'submit'; feedback: string }
  | { type: 'reset' }

const initialSurveyState: SurveyState = { status: 'initial', feedback: '' }

function surveyReducer(_state: SurveyState, action: SurveyAction): SurveyState {
  switch (action.type) {
    case 'start':
      return { status: 'active', feedback: '' }
    case 'submissionStarted':
      return { ..._state, status: 'submitting' }
    case 'submit':
      return { status: 'completed', feedback: action.feedback }
    case 'reset':
      return initialSurveyState
  }
}

export default function SurveyExercise() {
  const [state, dispatch] = useReducer(surveyReducer, initialSurveyState)
  const [feedback, setFeedback] = useState('')

  async function submitSurvey() {
    if (!feedback.trim()) return
    dispatch({ type: 'submissionStarted' })
    await new Promise<void>((resolve) => window.setTimeout(resolve, 550))
    dispatch({ type: 'submit', feedback: feedback.trim() })
    setFeedback('')
  }

  function resetSurvey() {
    dispatch({ type: 'reset' })
    setFeedback('')
  }

  return (
    <div className="survey-demo">
      <div className="survey-status">
        <span className={`state-pill state-${state.status}`}><i /> {state.status}</span>
        {state.status === 'initial' && <span>Ready when you are</span>}
        {state.status === 'active' && <span>Take your time—your thoughts matter.</span>}
        {state.status === 'submitting' && <span>Sending your thoughts…</span>}
        {state.status === 'completed' && <span>Thanks for taking a moment to share.</span>}
      </div>
      {state.status === 'completed' ? (
        <div className="feedback-result">
          <span className="quote-mark" aria-hidden="true">“</span>
          <p>{state.feedback}</p>
        </div>
      ) : (
        <label className="field-label" htmlFor="survey-feedback">
          YOUR THOUGHTS
          <textarea
            id="survey-feedback"
            value={feedback}
            onChange={(event) => setFeedback(event.target.value)}
            placeholder="What would make this experience even better?"
            rows={3}
            disabled={state.status !== 'active'}
          />
        </label>
      )}
      <div className="survey-actions">
        {state.status === 'initial' && <button className="button-primary" type="button" onClick={() => dispatch({ type: 'start' })}>Start survey <span aria-hidden="true">→</span></button>}
        {state.status === 'active' && (
          <>
            <button className="button-primary" type="button" onClick={() => void submitSurvey()} disabled={!feedback.trim()}>Submit feedback <span aria-hidden="true">↗</span></button>
            <button className="button-quiet" type="button" onClick={resetSurvey}>Reset</button>
          </>
        )}
        {state.status === 'submitting' && <button className="button-quiet" type="button" disabled>Sending…</button>}
        {state.status === 'completed' && <button className="button-quiet" type="button" onClick={resetSurvey}>Start over <span aria-hidden="true">↺</span></button>}
      </div>
    </div>
  )
}
