import Clock from './Clock.jsx'
import Form from './Form.jsx'
import './App.css'

function App() {
  return (
    <div className="ninja-app">
      <header className="ninja-header">
        <a className="ninja-brand" href="#top">NINJA<span>.</span></a>
        <span>WEEK 9 / LIFECYCLE + VALIDATION</span>
      </header>
      <main id="top">
        <section className="ninja-intro">
          <p className="ninja-eyebrow">Exercise XP Ninja</p>
          <h1>Every second<br /><em>counts.</em></h1>
          <p className="ninja-intro-copy">A local clock, and a contact form that checks its own work.</p>
        </section>
        <div className="ninja-grid">
          <Clock />
          <Form />
        </div>
      </main>
      <footer className="ninja-footer">
        <span>REACT LIFECYCLE</span>
        <span>STATE / EFFECTS / FORMS</span>
      </footer>
    </div>
  )
}

export default App
