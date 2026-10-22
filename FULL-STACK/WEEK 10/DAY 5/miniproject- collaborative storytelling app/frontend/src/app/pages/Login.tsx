import { useState, type FormEvent } from "react"
import { Link, Navigate, useLocation } from "react-router-dom"
import { login } from "../../features/auth/authSlice"
import { useAppDispatch, useAppSelector } from "../hooks"

export default function Login() {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const { user, busy, error } = useAppSelector((state) => state.auth)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [problem, setProblem] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const from = (location.state as { from?: string } | null)?.from ?? "/"

  if (user) return <Navigate to={from} replace />

  async function submit(event: FormEvent) {
    event.preventDefault()
    setSubmitted(true)
    if (!email.trim() || !password) {
      setProblem("Enter your email and password.")
      return
    }
    setProblem(null)
    try {
      await dispatch(login({ email: email.trim(), password })).unwrap()
    } catch {
      // The auth slice provides the backend error for display below.
    }
  }

  return (
    <form onSubmit={(event) => void submit(event)} className="narrow" noValidate>
      <h1>Log in</h1>
      <p className="note">Welcome back. Your stories are where you left them.</p>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <input id="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />
      </div>
      {(problem || (submitted && error)) && <p className="alert" role="alert">{problem ?? error}</p>}
      <button type="submit" className="btn" disabled={busy}>{busy ? "Logging in…" : "Log in"}</button>
      <p className="quiet">New here? <Link to="/signup">Create an account</Link></p>
    </form>
  )
}
