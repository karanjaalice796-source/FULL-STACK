import { Component, createRef } from 'react'
import ErrorBoundary from './ErrorBoundary.jsx'
import './App.css'

export default class App extends Component {
  state = { errorInfo: null }
  errorBoundaryRef = createRef()

  handleError = (errorInfo) => {
    this.setState({ errorInfo })
  }

  clearError = () => {
    this.setState({ errorInfo: null })
  }

  render() {
    return (
      <main className="page-shell">
        <header className="masthead">
          <a className="brand" href="#home" aria-label="Ora exercises home">
            <span className="brand-mark" aria-hidden="true">O</span>
            <span>ORA<span className="brand-period">.</span></span>
          </a>
          <p className="masthead-note">A little calm when things go wrong</p>
          <span className="edition-mark">EXERCISE No. 01</span>
        </header>

        <section className="intro" id="home" aria-labelledby="page-title">
          <p className="overline"><span /> Creating a React modal / with error handling</p>
          <h1 id="page-title">A softer landing<br /><em>for the unexpected.</em></h1>
          <p className="intro-copy">
            Things don’t always go to plan. This little safety net catches a simulated error and lets you carry on.
          </p>
        </section>

        <section className="modal-workspace" aria-label="Error boundary exercise">
          <ErrorBoundary
            ref={this.errorBoundaryRef}
            errorInfo={this.state.errorInfo}
            onError={this.handleError}
            onClear={this.clearError}
          >
            <div className="modal-demo-card">
              <div className="demo-card-topline"><span>THE LITTLE SAFETY NET</span><span>01 — 01</span></div>
              <span className="demo-icon" aria-hidden="true">✳</span>
              <p className="card-kicker">A SMALL DEMONSTRATION</p>
              <h2>Try the safety net.</h2>
              <p className="demo-description">
                Press the button and the boundary will catch a simulated error, then show a calm, dismissible message.
              </p>
              <button className="open-modal-button" onClick={() => this.errorBoundaryRef.current.occurError()}>
                Show the error message <span aria-hidden="true">↗</span>
              </button>
              <p className="demo-footnote"><span className="status-dot" /> The rest of the page stays right where it is.</p>
            </div>
          </ErrorBoundary>

          <aside className="boundary-note">
            <p className="overline"><span /> A note on boundaries</p>
            <h2>Not every error is the same.</h2>
            <p>
              React error boundaries catch problems while rendering. They don’t catch errors thrown inside click handlers, so this button asks the boundary to show its fallback on purpose.
            </p>
            <div className="note-divider" />
            <p className="note-small">Close the message to reset the boundary and try again.</p>
            <span className="note-stamp" aria-hidden="true">CON<br />CALMA</span>
          </aside>
        </section>

        <footer className="page-footer">
          <span>MADE FOR THE MOMENT THINGS GO SIDEWAYS</span>
          <span className="footer-center">ORA <i>·</i> ERROR STUDY No. 001</span>
          <span>YOU CAN BEGIN AGAIN</span>
        </footer>
      </main>
    )
  }
}
