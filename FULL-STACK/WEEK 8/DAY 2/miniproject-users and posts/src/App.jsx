import { Component } from 'react'
import PostList from './components/PostList.jsx'
import UsersList from './components/UsersList.jsx'
import './App.css'

export default class App extends Component {
  render() {
    return (
      <main className="site-shell">
        <header className="masthead">
          <a className="brand" href="#home" aria-label="Commonplace home">
            <span className="brand-mark">c.</span>
            <span>COMMONPLACE <i>/</i> API FIELD NOTES</span>
          </a>
          <span className="issue-label">WEB NOTES&nbsp; NO. 09</span>
        </header>

        <section className="intro" id="home">
          <p className="kicker"><span /> REACT EXERCISE / FETCH DATA</p>
          <div className="intro-copy">
            <h1>Stories, people<br />and <em>the thread</em><span>.</span></h1>
            <p>
              A small exercise in bringing a public API to life: fetch a collection,
              keep it in component state, then give every item a place on the page.
            </p>
          </div>
          <div className="intro-note" aria-label="A note about this exercise">
            <span>FIELD STUDY</span>
            <strong>01—03</strong>
            <span>POSTS &amp; PEOPLE</span>
          </div>
        </section>

        <nav className="section-index" aria-label="Page sections">
          <span>IN THIS NOTEBOOK</span>
          <a href="#posts"><b>01</b> Posts <span>↘</span></a>
          <a href="#users"><b>02</b> People <span>↘</span></a>
          <span className="index-caption">Fetched from JSONPlaceholder</span>
        </nav>

        <PostList />
        <UsersList />

        <footer className="site-footer">
          <span>MADE FOR THE LOVE OF LEARNING</span>
          <span>REACT STATE <i>·</i> JSX <i>·</i> FETCH</span>
          <a href="#home">BACK TO TOP ↑</a>
        </footer>
      </main>
    )
  }
}
