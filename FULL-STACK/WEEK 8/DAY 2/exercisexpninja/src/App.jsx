import { Component } from 'react'
import Customers from './components/Customers.jsx'
import Users from './components/Users.jsx'
import './App.css'

const exercises = [
  { id: 'users', number: '01', title: 'The users', endpoint: 'GET /users' },
  { id: 'customers', number: '02', title: 'The customers', endpoint: 'GET /api/customers/' },
]

export default class App extends Component {
  state = { activeExercise: 'users' }

  render() {
    const active = exercises.find((exercise) => exercise.id === this.state.activeExercise)

    return (
      <main className="app-shell">
        <header className="topbar">
          <a className="wordmark" href="#top" aria-label="Fieldnotes home">
            <span className="wordmark-icon" aria-hidden="true">F</span>
            <span>FIELDNOTES <i>/</i> REACT + EXPRESS</span>
          </a>
          <span className="edition">WEEK 08 <b>·</b> DAY 02</span>
        </header>

        <section className="hero" id="top">
          <p className="eyebrow"><span /> FETCH DATA / TWO SMALL FIELD STUDIES</p>
          <h1>A little server-side<br /><em>hello.</em></h1>
          <p className="hero-copy">
            Two simple trips from an Express backend to a React screen. The data comes back as JSON; the UI gives it a place to land.
          </p>
          <div className="hero-stamp" aria-hidden="true"><span>LIVE</span><b>↗</b><span>LOCAL API</span></div>
        </section>

        <section className="workspace" aria-label="Express data exercises">
          <nav className="exercise-nav" aria-label="Choose an exercise">
            <p className="nav-heading">YOUR EXERCISES <span>02</span></p>
            {exercises.map((exercise) => (
              <button
                className={`exercise-link ${exercise.id === this.state.activeExercise ? 'active' : ''}`}
                key={exercise.id}
                onClick={() => this.setState({ activeExercise: exercise.id })}
                aria-current={exercise.id === this.state.activeExercise ? 'page' : undefined}
              >
                <span className="exercise-number">{exercise.number}</span>
                <span className="exercise-info">
                  <strong>{exercise.title}</strong>
                  <small>{exercise.endpoint}</small>
                </span>
                <span className="exercise-arrow" aria-hidden="true">↗</span>
              </button>
            ))}
            <p className="nav-note">A tiny API, doing its job quietly in the background.</p>
          </nav>

          <section className="data-panel" aria-labelledby="panel-title">
            <header className="panel-header">
              <div>
                <p className="eyebrow">EXERCISE {active.number} <span className="slash">/</span> JSON RESPONSE</p>
                <h2 id="panel-title">{active.title}</h2>
              </div>
              <span className="endpoint-chip">{active.endpoint}</span>
            </header>
            <div className="panel-content">
              {this.state.activeExercise === 'users' ? <Users /> : <Customers />}
            </div>
            <footer className="panel-footer">
              <span>FETCHED FROM YOUR EXPRESS SERVER</span>
              <span><i /> PORT 3001</span>
            </footer>
          </section>
        </section>

        <footer className="page-footer">
          <span>ONE REQUEST AT A TIME</span>
          <span>REACT STATE <i>·</i> EXPRESS JSON</span>
          <span>FIELDNOTE 02 / 02</span>
        </footer>
      </main>
    )
  }
}
