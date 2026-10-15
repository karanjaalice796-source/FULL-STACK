import { useDispatch, useSelector } from 'react-redux'
import AgeControls from './components/AgeControls.jsx'
import AgeDisplay from './components/AgeDisplay.jsx'
import { ageDownAsync, ageUpAsync } from './redux/ageSlice.js'
import './App.css'

function App() {
  const dispatch = useDispatch()
  const { age, loading } = useSelector((state) => state.age)

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Age Tracker home">
          <span className="brand-mark" aria-hidden="true">A</span>
          age tracker
        </a>
        <span className="topbar-note">A little perspective, one year at a time.</span>
      </header>

      <section className="tracker-card" aria-labelledby="page-title">
        <div className="card-heading">
          <p className="eyebrow">YOUR PERSONAL TIMELINE</p>
          <h1 id="page-title">Age is just<br />a number.</h1>
          <p className="intro">Make a change and watch your timeline update.</p>
        </div>

        <AgeDisplay age={age} loading={loading} />

        <AgeControls
          age={age}
          loading={loading}
          onAgeUp={() => dispatch(ageUpAsync())}
          onAgeDown={() => dispatch(ageDownAsync())}
        />

        <p className="update-note" aria-live="polite">
          {loading
            ? 'Updating your age…'
            : age === 0
              ? 'You’ve reached the beginning.'
              : 'Each change takes a moment.'}
        </p>
      </section>

      <p className="page-note">A small Redux Toolkit + Thunk exercise.</p>
    </main>
  )
}

export default App
