import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login, logout } from '../features/auth/authSlice.js'

function AuthForm({ onClose }) {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const displayName = name.trim()
    const normalizedEmail = email.trim()
    if (!displayName || !normalizedEmail) return

    dispatch(login({ name: displayName, email: normalizedEmail }))
    onClose()
  }

  if (user) {
    return (
      <div className="auth-content">
        <span className="modal-kicker">YOUR ACCOUNT</span>
        <h2>Welcome, {user.name}.</h2>
        <p className="auth-email">{user.email}</p>
        <button
          className="auth-submit"
          type="button"
          onClick={() => {
            dispatch(logout())
            onClose()
          }}
        >
          Sign out
        </button>
      </div>
    )
  }

  return (
    <form className="auth-content" onSubmit={handleSubmit}>
      <span className="modal-kicker">A GOOD PLACE TO START</span>
      <h2>Sign in for checkout.</h2>
      <p className="auth-description">This demo uses a simulated account. No password needed.</p>
      <label className="auth-field">
        Your name
        <input
          autoComplete="name"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Alex Morgan"
        />
      </label>
      <label className="auth-field">
        Email address
        <input
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
        />
      </label>
      <button className="auth-submit" type="submit">Continue</button>
    </form>
  )
}

export default AuthForm
