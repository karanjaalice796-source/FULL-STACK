import { useTheme } from '../context/ThemeContext.jsx'

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <section className="exercise-card theme-card" aria-labelledby="theme-title">
      <div className="card-topline">
        <span className="exercise-tag">EXERCISE 01</span>
        <span className="card-icon" aria-hidden="true">{isDark ? '☾' : '☼'}</span>
      </div>
      <p className="card-kicker">CONTEXT / STATE</p>
      <h2 id="theme-title">Set the <em>mood.</em></h2>
      <p className="card-description">
        One small switch, shared everywhere. The page listens to the theme context and changes with it.
      </p>
      <div className="theme-preview">
        <span className="preview-label">CURRENT PALETTE</span>
        <strong>{isDark ? 'After hours' : 'Daylight'}</strong>
        <span className="preview-indicator"><i /> {theme.toUpperCase()} MODE</span>
      </div>
      <button className="theme-button" type="button" onClick={toggleTheme} aria-pressed={isDark}>
        <span aria-hidden="true">{isDark ? '☼' : '☾'}</span>
        Switch to {isDark ? 'light' : 'dark'} mode
        <span className="button-arrow" aria-hidden="true">↗</span>
      </button>
    </section>
  )
}
