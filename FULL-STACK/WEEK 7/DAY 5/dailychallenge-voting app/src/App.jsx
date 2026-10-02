import { useState } from 'react'
import './App.css'

function App() {
  const [languages, setLanguages] = useState([
    { name: 'PHP', votes: 0 },
    { name: 'Python', votes: 0 },
    { name: 'JavaScript', votes: 0 },
    { name: 'Java', votes: 0 },
  ])

  const totalVotes = languages.reduce((total, language) => total + language.votes, 0)
  const leader = languages.reduce((top, language) => language.votes > top.votes ? language : top)

  function castVote(languageName) {
    setLanguages((currentLanguages) => currentLanguages.map((language) => (
      language.name === languageName
        ? { ...language, votes: language.votes + 1 }
        : language
    )))
  }

  return (
    <main className="vote-app">
      <header className="masthead">
        <a className="wordmark" href="#top" aria-label="Code Vote home">CV<span>.</span></a>
        <span className="masthead-note">A tiny poll for the people who build the web</span>
        <span className="edition-tag"><i /> OPEN BALLOT 01</span>
      </header>

      <section className="intro-block" id="top" aria-labelledby="page-title">
        <div className="intro-copy">
          <p className="eyebrow"><span>01</span> THE COMMUNITY POLL</p>
          <h1 id="page-title">Which language<br />gets your <em>vote?</em></h1>
          <p className="intro-description">Every great project starts with a choice. Pick the language you reach for first and see where the room lands.</p>
        </div>
        <div className="vote-stats" aria-live="polite">
          <div className="total-stat">
            <span className="stat-number">{String(totalVotes).padStart(2, '0')}</span>
            <span className="stat-caption">{totalVotes === 1 ? 'vote cast' : 'votes cast'}</span>
          </div>
          <div className="leader-stat">
            <span className="stat-caption">CURRENT FRONT-RUNNER</span>
            <strong>{leader.votes > 0 ? leader.name : 'Waiting on you'}</strong>
          </div>
          <span className="sun-mark" aria-hidden="true">✳</span>
        </div>
      </section>

      <section className="ballot" aria-labelledby="ballot-title">
        <div className="ballot-heading">
          <div>
            <p className="eyebrow">THE SHORTLIST</p>
            <h2 id="ballot-title">Make your pick</h2>
          </div>
          <p className="ballot-instruction">One click, one vote. Vote again any time.</p>
        </div>

        <ol className="language-list">
          {languages.map((language, index) => {
            const share = totalVotes ? Math.round((language.votes / totalVotes) * 100) : 0

            return (
              <li className="language-row" data-language={language.name.toLowerCase()} key={language.name}>
                <span className="language-rank">0{index + 1}</span>
                <div className="language-main">
                  <div className="language-line">
                    <h3>{language.name}</h3>
                    <span className="vote-share">{share}%</span>
                  </div>
                  <div
                    className="vote-track"
                    role="progressbar"
                    aria-label={`${language.name} vote share`}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-valuenow={share}
                  >
                    <span className="vote-fill" style={{ width: `${share}%` }} />
                  </div>
                </div>
                <span className="vote-count">{language.votes} {language.votes === 1 ? 'vote' : 'votes'}</span>
                <button className="vote-button" type="button" onClick={() => castVote(language.name)} aria-label={`Vote for ${language.name}`}>
                  Vote <span aria-hidden="true">↗</span>
                </button>
              </li>
            )
          })}
        </ol>

        <div className="ballot-footer">
          <span className="live-dot" /> LIVE RESULTS
          <span>Results update with every vote</span>
        </div>
      </section>

      <footer className="page-footer">
        <span>CODE VOTE <span className="footer-star">✳</span> COMMUNITY, COUNTED.</span>
        <span>BUILT FOR THE LOVE OF THE WEB</span>
      </footer>
    </main>
  )
}

export default App
