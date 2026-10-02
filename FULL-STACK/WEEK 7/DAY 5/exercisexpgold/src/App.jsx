import './App.css'
import Forms from './Forms.jsx'

function App() {
  return (
    <div className="form-app">
      <header className="site-header">
        <a className="brand-mark" href="#top" aria-label="Fieldnote home">FIELDNOTE<span>.</span></a>
        <span className="header-index">REACT PRACTICE / 07</span>
      </header>

      <main id="top">
        <section className="intro-band">
          <p className="eyebrow">A little introduction</p>
          <h1>Make yourself<br /><em>at home.</em></h1>
          <p className="intro-copy">A few details, a few preferences, and we’re acquainted.</p>
        </section>
        <Forms />
      </main>

      <footer className="site-footer">
        <span>FIELDNOTE / PERSONAL DETAILS</span>
        <span>BUILT WITH REACT</span>
      </footer>
    </div>
  )
}

export default App
