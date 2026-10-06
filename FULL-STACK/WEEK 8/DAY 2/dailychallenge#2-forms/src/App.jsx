import AutoCompletedText from './AutoCompletedText.jsx'
import './App.css'

export default function App() {
  return (
    <main className="page-shell">
      <header className="site-header">
        <a className="wordmark" href="/" aria-label="Somewhere in mind home">
          <span className="brand-mark" aria-hidden="true">↗</span>
          <span>FIELDNOTES <i>/</i> PLACES</span>
        </a>
        <span className="header-edition"><i /> INTERACTIVE EXERCISE <span>№ 08.04</span></span>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span>REACT FORMS</span><i /> EVENTS IN MOTION</p>
          <h1>Somewhere<br />in <em>mind.</em></h1>
          <p className="hero-description">There’s a place you keep coming back to. Type a few letters and see where they take you.</p>
          <div className="learning-list" aria-label="What you will learn">
            <span><i>01</i> React forms</span>
            <span><i>02</i> React events</span>
            <span><i>03</i> Autocomplete</span>
          </div>
        </div>
        <div className="hero-illustration" aria-hidden="true">
          <div className="globe-grid">
            <span className="globe-latitude latitude-one" />
            <span className="globe-latitude latitude-two" />
            <span className="globe-longitude longitude-one" />
            <span className="globe-longitude longitude-two" />
            <span className="globe-pin"><i /></span>
          </div>
          <span className="illustration-star star-one">✳</span>
          <span className="illustration-star star-two">✳</span>
          <span className="coordinates">40° 43' 55.3" N<br />73° 59' 11.4" W</span>
          <span className="illustration-caption">A WORLD OF<br />POSSIBILITIES</span>
        </div>
      </section>

      <section className="workbench">
        <div className="workbench-header">
          <div>
            <p className="workbench-kicker">A SMALL MOMENT OF DISCOVERY</p>
            <h2>Where to <em>next?</em></h2>
          </div>
          <span className="sparkle" aria-hidden="true">✳</span>
        </div>
        <AutoCompletedText />
      </section>

      <footer className="page-footer">
        <span>TAKE THE SCENIC ROUTE</span>
        <span>ONE LETTER AT A TIME <i>✳</i></span>
      </footer>
    </main>
  )
}
