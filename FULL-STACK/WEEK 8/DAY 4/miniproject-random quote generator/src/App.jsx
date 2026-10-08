import { useState } from 'react'
import quotes from './quotes.js'

const themes = [
  { page: '#24574b', quote: '#b94b3b', button: '#e8c65a', buttonText: '#263c35' },
  { page: '#b74f3a', quote: '#28584d', button: '#f1d8bd', buttonText: '#57392f' },
  { page: '#426b83', quote: '#b45442', button: '#e8bd54', buttonText: '#293b45' },
  { page: '#55724b', quote: '#a5443d', button: '#e8d8c0', buttonText: '#344332' },
  { page: '#714853', quote: '#bc7436', button: '#d7e2c5', buttonText: '#3d3540' },
  { page: '#95643c', quote: '#375d54', button: '#e9cf62', buttonText: '#382f25' },
]

function shuffle(items) {
  const shuffled = [...items]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    const currentValue = shuffled[index]
    shuffled[index] = shuffled[swapIndex]
    shuffled[swapIndex] = currentValue
  }
  return shuffled
}

function createQuoteState() {
  const currentIndex = Math.floor(Math.random() * quotes.length)
  const remainingIndices = shuffle(
    quotes.map((_, index) => index).filter((index) => index !== currentIndex),
  )
  return { currentIndex, remainingIndices, numberShown: 1 }
}

function App() {
  const [quoteState, setQuoteState] = useState(createQuoteState)
  const [themeIndex, setThemeIndex] = useState(() => Math.floor(Math.random() * themes.length))
  const quote = quotes[quoteState.currentIndex]
  const theme = themes[themeIndex]

  function showAnotherQuote() {
    setQuoteState((current) => {
      const nextQueue = current.remainingIndices.length
        ? current.remainingIndices
        : shuffle(quotes.map((_, index) => index).filter((index) => index !== current.currentIndex))
      const [currentIndex, ...remainingIndices] = nextQueue
      return { currentIndex, remainingIndices, numberShown: current.numberShown + 1 }
    })
    setThemeIndex((current) => {
      const nextIndex = Math.floor(Math.random() * (themes.length - 1))
      return nextIndex >= current ? nextIndex + 1 : nextIndex
    })
  }

  return (
    <main
      className="quote-page"
      style={{
        '--page-color': theme.page,
        '--quote-color': theme.quote,
        '--button-color': theme.button,
        '--button-text': theme.buttonText,
      }}
    >
      <header className="quote-header">
        <a className="wordmark" href="#top" aria-label="A Few Good Words home">AFGW<span> / </span>VOL. 01</a>
        <span className="header-note">A FEW GOOD WORDS</span>
      </header>

      <section className="quote-stage" id="top" aria-label="Random quote">
        <p className="section-label">A thought to keep</p>
        <article className="quote-sheet" key={quoteState.currentIndex}>
          <span className="opening-mark" aria-hidden="true">“</span>
          <h1 className="quote-text">{quote.quote}</h1>
          <div className="quote-rule" />
          <p className="quote-author">{quote.author || 'Unknown'}</p>
        </article>

        <button className="next-quote" type="button" onClick={showAnotherQuote}>
          <span>Another thought</span>
          <span className="button-arrow" aria-hidden="true">↗</span>
        </button>
        <p className="quote-counter" aria-live="polite">
          NO. {String(((quoteState.numberShown - 1) % quotes.length) + 1).padStart(2, '0')} <span>/</span> {String(quotes.length).padStart(2, '0')}
        </p>
      </section>

      <footer className="quote-footer">
        <span>WORDS FOR THE IN-BETWEEN</span>
        <span>ONE QUOTE AT A TIME</span>
      </footer>
    </main>
  )
}

export default App
