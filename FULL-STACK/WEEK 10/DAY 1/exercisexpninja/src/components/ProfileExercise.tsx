import { useReducer, useState } from 'react'

interface Profile {
  name: string
  bio: string
}

type ProfileStatus = 'initial' | 'loading' | 'success' | 'error'

interface ProfileState {
  status: ProfileStatus
  profile: Profile | null
  error: string | null
}

type ProfileAction =
  | { type: 'updateStarted' }
  | { type: 'updateSucceeded'; profile: Profile }
  | { type: 'updateFailed'; error: string }

const initialProfileState: ProfileState = {
  status: 'initial',
  profile: null,
  error: null,
}

function profileReducer(state: ProfileState, action: ProfileAction): ProfileState {
  switch (action.type) {
    case 'updateStarted':
      return { ...state, status: 'loading', error: null }
    case 'updateSucceeded':
      return { status: 'success', profile: action.profile, error: null }
    case 'updateFailed':
      return { ...state, status: 'error', error: action.error }
  }
}

export default function ProfileExercise() {
  const [state, dispatch] = useReducer(profileReducer, initialProfileState)
  const [name, setName] = useState('Jordan Lee')
  const [bio, setBio] = useState('Building thoughtful things for the web.')

  async function saveProfile() {
    dispatch({ type: 'updateStarted' })
    await new Promise<void>((resolve) => window.setTimeout(resolve, 600))

    if (name.trim().toLowerCase() === 'error') {
      dispatch({ type: 'updateFailed', error: 'The profile could not be saved. Update the name and try again.' })
      return
    }

    dispatch({ type: 'updateSucceeded', profile: { name: name.trim(), bio: bio.trim() } })
  }

  return (
    <div className="demo-grid profile-demo">
      <div className="demo-form">
        <label className="field-label" htmlFor="profile-name">DISPLAY NAME</label>
        <input id="profile-name" value={name} onChange={(event) => setName(event.target.value)} maxLength={48} />
        <label className="field-label" htmlFor="profile-bio">SHORT BIO</label>
        <textarea id="profile-bio" value={bio} onChange={(event) => setBio(event.target.value)} rows={2} maxLength={120} />
        <button className="button-primary" type="button" onClick={() => void saveProfile()} disabled={state.status === 'loading' || !name.trim()}>
          {state.status === 'loading' ? 'Saving profile…' : 'Save profile'} <span aria-hidden="true">↗</span>
        </button>
        <p className="demo-hint">Tip: enter “error” as your name to preview the error state.</p>
      </div>
      <div className="state-preview" aria-live="polite">
        <p className="preview-kicker">REDUCER STATE</p>
        <span className={`state-pill state-${state.status}`}><i /> {state.status}</span>
        {state.status === 'initial' && <p className="state-copy">Your profile is ready to edit.</p>}
        {state.status === 'loading' && <p className="state-copy"><span className="mini-spinner" /> Saving your changes…</p>}
        {state.status === 'success' && state.profile && (
          <div className="profile-result">
            <span className="profile-avatar" aria-hidden="true">{state.profile.name.slice(0, 1).toUpperCase()}</span>
            <div><strong>{state.profile.name}</strong><p>{state.profile.bio || 'No bio added yet.'}</p></div>
          </div>
        )}
        {state.status === 'error' && <p className="error-copy" role="alert">{state.error}</p>}
      </div>
    </div>
  )
}
