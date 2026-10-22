import { useState, type FormEvent } from "react"
import { Link, Navigate } from "react-router-dom"
import { register } from "../../features/auth/authSlice"
import { useAppDispatch, useAppSelector } from "../hooks"

export default function Signup() {
  const dispatch = useAppDispatch()
  const { user, busy, error } = useAppSelector((state) => state.auth)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [problem, setProblem] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  if (user) return <Navigate to="/" replace />

  async function submit(event: FormEvent) {
    event.preventDefault()
    setSubmitted(true)
    if (username.trim().length < 2) {
      setProblem("Pick a name with at least 2 characters.")
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setProblem("That doesn't look like a valid email.")
      return
    }
    if (password.length < 8) {
      setProblem("Use a password of at least 8 characters.")
      return
    }
    setProblem(null)
    try {
      await dispatch(register({ username: username.trim(), email: email.trim(), password })).unwrap()
    } catch {
      // The auth slice provides the backend error for display below.
    }
  }

  return (
    <form onSubmit={(event) => void submit(event)} className="narrow" noValidate>
      <h1>Create an account</h1>
      <p className="note">Pick a name your co-writers will recognise.</p>
      <div className="field">
        <label htmlFor="username">Name</label>
        <input id="username" autoComplete="nickname" maxLength={50} value={username} onChange={(event) => setUsername(event.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <input id="password" type="password" autoComplete="new-password" maxLength={72} value={password} onChange={(event) => setPassword(event.target.value)} />
      </div>
      {(problem || (submitted && error)) && <p className="alert" role="alert">{problem ?? error}</p>}
      <button type="submit" className="btn" disabled={busy}>{busy ? "Creating account…" : "Create account"}</button>
      <p className="quiet">Already have one? <Link to="/login">Log in</Link></p>
    </form>
  )
}
