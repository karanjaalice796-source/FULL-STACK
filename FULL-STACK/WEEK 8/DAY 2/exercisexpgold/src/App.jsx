import { Component } from 'react'
import UserEmailForm from './components/UserEmailForm.jsx'
import PostForm from './components/PostForm.jsx'
import './App.css'

export default class App extends Component {
  render() {
    return (
      <main className="page-shell">
        <header className="site-header">
          <a className="brand" href="/" aria-label="Form notes home">
            <span className="brand-icon" aria-hidden="true">↗</span>
            <span>FIELDNOTES <i>/</i> REACT</span>
          </a>
          <span className="header-note"><i /> TWO WAYS TO SEND JSON <span>WEEK 09 · DAY 02</span></span>
        </header>

        <section className="hero">
          <div>
            <p className="eyebrow"><span>THE FORM STUDIO</span><i /> SEND SOMETHING OUT</p>
            <h1>A little data<br />goes <em>a long way.</em></h1>
            <p className="hero-copy">
              Fill in a few details, send them to a pretend API, and see what comes back.
              Two small experiments — one with fetch, one with Axios.
            </p>
            <div className="learning-pills" aria-label="What you will learn">
              <span>React forms</span><span>Events + state</span><span>POST JSON</span>
            </div>
          </div>
          <div className="hero-illustration" aria-hidden="true">
            <div className="paper-plane"><span>✳</span><i>↗</i></div>
            <div className="flight-path" />
            <div className="illustration-label">A NOTE, SENT<br />INTO THE WORLD</div>
          </div>
        </section>

        <div className="section-heading">
          <div><p>CHOOSE YOUR POSTCARD</p><h2>Two forms, <em>two routes.</em></h2></div>
          <span>01 <i>—</i> 02</span>
        </div>

        <section className="forms-grid" aria-label="POST JSON exercises">
          <UserEmailForm />
          <PostForm />
        </section>

        <footer className="page-footer">
          <span>MADE TO PRACTICE — NO PRESSURE</span>
          <span>FETCH <i>×</i> AXIOS <i>×</i> YOU</span>
        </footer>
      </main>
    )
  }
}
