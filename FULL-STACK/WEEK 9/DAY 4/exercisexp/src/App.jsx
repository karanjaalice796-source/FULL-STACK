import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import UserProfile from './components/UserProfile.jsx'
import { fetchUser } from './redux/usersSlice.js'
import './App.css'

const userIds = Array.from({ length: 10 }, (_, index) => index + 1)

function App() {
  const dispatch = useDispatch()
  const status = useSelector((state) => state.users.status)
  const error = useSelector((state) => state.users.error)
  const [userId, setUserId] = useState('1')
  const isLoading = status === 'loading'

  function handleSubmit(event) {
    event.preventDefault()
    dispatch(fetchUser(Number(userId)))
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="People home">
          <span className="brand-mark" aria-hidden="true">P</span>
          people
        </a>
        <span className="topbar-note">A little directory, made simple.</span>
      </header>

      <section className="lookup-panel" aria-labelledby="page-title">
        <div className="panel-heading">
          <p className="eyebrow">DIRECTORY / LOOKUP</p>
          <h1 id="page-title">Good to know<br />who’s who.</h1>
          <p className="intro">Choose a user to fetch their profile from the directory.</p>
        </div>

        <form className="lookup-form" onSubmit={handleSubmit}>
          <label htmlFor="user-id">User ID</label>
          <div className="form-controls">
            <select
              id="user-id"
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
              disabled={isLoading}
            >
              {userIds.map((id) => (
                <option key={id} value={id}>User {id}</option>
              ))}
            </select>
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Finding user…' : 'Find user'}
              {!isLoading && <span aria-hidden="true">↗</span>}
            </button>
          </div>
          <p className="form-hint">Pick an ID from 1 to 10 to look up a sample profile.</p>
        </form>

        <div className="result-area" aria-live="polite" aria-busy={isLoading}>
          {isLoading && <p className="status-message">Fetching profile…</p>}
          {status === 'failed' && (
            <p className="error-message" role="alert">{error}</p>
          )}
          {!isLoading && status !== 'failed' && <UserProfile />}
        </div>
      </section>

      <p className="page-note">Powered by Redux Toolkit and JSONPlaceholder.</p>
    </main>
  )
}

export default App
