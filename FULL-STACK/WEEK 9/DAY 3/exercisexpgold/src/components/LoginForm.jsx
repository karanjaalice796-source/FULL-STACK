import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginUser, setUser } from '../redux/authSlice.js'

function LoginForm() {
  const dispatch = useDispatch()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    dispatch(setUser({ name: name.trim(), email: email.trim() }))
    dispatch(loginUser())
    setPassword('')
  }

  return (
    <section className="auth-layout" aria-labelledby="login-title">
      <div className="welcome-copy">
        <p className="eyebrow">A LITTLE SPACE, JUST FOR YOU</p>
        <h1>Good things<br />start <em>here.</em></h1>
        <p className="welcome-description">
          Sign in to your Northstar account and pick up right where you left off.
        </p>
        <div className="welcome-decoration" aria-hidden="true">
          <span className="orbit orbit-one" />
          <span className="orbit orbit-two" />
          <span className="orbit orbit-three" />
          <span className="orbit-center">✳</span>
        </div>
        <p className="welcome-caption">Make a little room for what matters.</p>
      </div>

      <div className="form-card">
        <div className="form-heading">
          <span className="form-icon" aria-hidden="true">↗</span>
          <p className="eyebrow">YOUR NORTHSTAR ACCOUNT</p>
          <h2 id="login-title">Welcome back</h2>
          <p>Enter your details to continue.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Your name</label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Alex Morgan"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />

          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <div className="password-label">
            <label htmlFor="password">Password</label>
            <a href="#demo-note">Forgot password?</a>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter any password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <button className="submit-button" type="submit">
            Sign in <span aria-hidden="true">→</span>
          </button>
        </form>

        <p className="demo-note" id="demo-note">
          Demo mode: any name, email, and password will sign you in.
        </p>
      </div>
    </section>
  )
}

export default LoginForm
