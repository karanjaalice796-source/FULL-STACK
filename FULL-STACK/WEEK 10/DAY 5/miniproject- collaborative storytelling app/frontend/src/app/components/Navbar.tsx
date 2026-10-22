import { Link, NavLink } from "react-router-dom"
import { logout } from "../../features/auth/authSlice"
import { toggleTheme } from "../../features/theme/themeSlice"
import { useAppDispatch, useAppSelector } from "../hooks"

export default function Navbar() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const mode = useAppSelector((state) => state.theme.mode)

  return (
    <header className="nav">
      <Link to="/" className="brand">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c3.6 4.7 6 7.6 6 11a6 6 0 0 1-12 0c0-3.4 2.4-6.3 6-11z" /></svg>
        Inkwell
      </Link>
      <nav className="nav-links">
        {user ? (
          <>
            <NavLink to="/" end>Stories</NavLink>
            <NavLink to="/stories/new">Start a story</NavLink>
          </>
        ) : (
          <>
            <NavLink to="/login">Log in</NavLink>
            <NavLink to="/signup">Sign up</NavLink>
          </>
        )}
      </nav>
      <div className="nav-end">
        <button
          type="button"
          className="icon-btn"
          onClick={() => dispatch(toggleTheme())}
          aria-label={mode === "dark" ? "Switch to the light theme" : "Switch to the dark theme"}
          title={mode === "dark" ? "Light theme" : "Dark theme"}
        >
          {mode === "dark" ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="4.2" />
              <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" /></svg>
          )}
        </button>
        {user && (
          <>
            <span className="who">{user.username}</span>
            <button type="button" className="btn plain small" onClick={() => void dispatch(logout())}>Log out</button>
          </>
        )}
      </div>
    </header>
  )
}
