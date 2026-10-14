import { useSelector } from 'react-redux'
import LoginForm from './components/LoginForm.jsx'
import MemberDashboard from './components/MemberDashboard.jsx'
import './App.css'

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

  return (
    <main className="app-shell">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Northstar home">
          <span className="brand-symbol" aria-hidden="true">N</span>
          <span>northstar</span>
        </a>
        <span className="header-note">
          <span className="status-dot" aria-hidden="true" />
          {isAuthenticated ? 'Your space is ready' : 'A calmer way to get things done'}
        </span>
      </header>

      {isAuthenticated ? <MemberDashboard /> : <LoginForm />}

      <footer className="site-footer">
        <span>Thoughtful tools for your everyday.</span>
        <span>Privacy&nbsp; · &nbsp;Help&nbsp; · &nbsp;About</span>
      </footer>
    </main>
  )
}

export default App
