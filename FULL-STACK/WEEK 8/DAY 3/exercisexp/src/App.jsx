import { useTheme } from './context/ThemeContext.jsx'
import ThemeSwitcher from './components/ThemeSwitcher.jsx'
import CharacterCounter from './components/CharacterCounter.jsx'
import './App.css'

export default function App() {
  const { theme } = useTheme()

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Blue Notes home">
          <span className="wordmark-icon">b.</span>
          <span>BLUE NOTES <i>/</i> REACT HOOKS</span>
        </a>
        <span className="edition">WEEK 08 <b>·</b> DAY 03</span>
      </header>

      <section className="hero" id="top">
        <p className="eyebrow"><span /> TWO SMALL STUDIES IN REACT</p>
        <h1>Make it <em>respond.</em></h1>
        <p className="hero-copy">
          A theme with a mind of its own, and a little note that counts as you write. Two everyday moments, made with React hooks.
        </p>
        <div className="hero-note">
          <span>THEME IN USE</span>
          <strong>{theme === 'dark' ? 'After hours' : 'Daylight'}</strong>
          <span><i /> {theme.toUpperCase()}</span>
        </div>
      </section>

      <section className="exercise-grid" aria-label="React hook exercises">
        <ThemeSwitcher />
        <CharacterCounter />
      </section>

      <footer className="page-footer">
        <span>BUILT ONE HOOK AT A TIME</span>
        <span>USE CONTEXT <i>·</i> USE REF <i>·</i> USE STATE</span>
        <span>BLUE NOTES / 02</span>
      </footer>
    </main>
  )
}
