import { Component } from 'react'
import './App.css'

export default class App extends Component {
  state = {
    greeting: '',
    input: '',
    reply: '',
    loadingGreeting: true,
    sending: false,
    error: '',
  }

  async componentDidMount() {
    await this.loadGreeting()
  }

  loadGreeting = async () => {
    this.setState({ loadingGreeting: true, error: '' })

    try {
      const response = await fetch('/api/hello')
      if (!response.ok) throw new Error(`The server replied with ${response.status}.`)

      const data = await response.json()
      this.setState({ greeting: data.message, loadingGreeting: false })
    } catch (error) {
      this.setState({
        error: `Couldn't reach the server. Make sure Express is running, then refresh. (${error.message})`,
        loadingGreeting: false,
      })
    }
  }

  sendMessage = async (message) => {
    if (!message || this.state.sending) return

    this.setState({ sending: true, error: '', reply: '' })

    try {
      const response = await fetch('/api/world', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || `The server replied with ${response.status}.`)

      this.setState({ reply: data.message, sending: false })
    } catch (error) {
      this.setState({ error: `Your message couldn't be delivered. ${error.message}`, sending: false })
    }
  }

  handleInputChange = (event) => {
    this.setState({ input: event.target.value, error: '' })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    await this.sendMessage(this.state.input.trim())
  }

  handleRetry = async () => {
    if (this.state.greeting) {
      await this.sendMessage(this.state.input.trim())
      return
    }

    await this.loadGreeting()
  }

  render() {
    const { greeting, input, reply, loadingGreeting, sending, error } = this.state

    return (
      <main className="page-shell">
        <header className="site-header">
          <a className="brand" href="/" aria-label="Message Exchange home">
            <span className="brand-icon" aria-hidden="true">↔</span>
            <span>little things <i>/</i> big connections</span>
          </a>
          <span className="header-note"><span className="header-dot" /> A REACT + EXPRESS EXERCISE</span>
        </header>

        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow"><span>DAILY CHALLENGE</span><i /> CLIENT TO SERVER</p>
            <h1>A little<br />message <em>exchange.</em></h1>
            <p className="hero-description">Type a thought, send it on its way, and see what comes back. A tiny conversation between React and Express.</p>
            <div className="learning-pills" aria-label="What you will learn">
              <span>React form</span><span>Express server</span><span>Fetch + JSON</span>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="orbit orbit-large" />
            <div className="orbit orbit-small" />
            <span className="spark spark-one">✳</span>
            <span className="spark spark-two">·</span>
            <div className="note note-sent"><span>YOU</span><b>hello there</b><i>↗</i></div>
            <div className="note note-returned"><span>EXPRESS</span><b>message received</b><i>↙</i></div>
            <span className="art-caption">A THOUGHT GOES<br />A LITTLE FURTHER</span>
          </div>
        </section>

        <section className="exchange-card" aria-labelledby="exchange-title">
          <div className="card-topline">
            <span className="step-tag"><span>01</span> THE EXCHANGE</span>
            <span className={`connection-status${loadingGreeting || error ? ' status-waiting' : ''}`} role="status">
              <i />{loadingGreeting ? 'CONNECTING' : error ? 'SERVER OFFLINE' : 'SERVER ONLINE'}
            </span>
          </div>

          <div className="greeting">
            <span className="greeting-label">A HELLO FROM THE OTHER SIDE</span>
            <h2 id="exchange-title">{loadingGreeting ? 'Listening for a hello…' : greeting || 'The server is taking a moment.'}</h2>
            <span className="greeting-flower" aria-hidden="true">✳</span>
          </div>

          <form className="message-form" onSubmit={this.handleSubmit}>
            <label htmlFor="message">YOUR TURN — WHAT WOULD YOU LIKE TO SAY?</label>
            <div className="input-wrap">
              <input
                id="message"
                name="message"
                type="text"
                value={input}
                onChange={this.handleInputChange}
                placeholder="Something kind, curious, or completely random…"
                maxLength={240}
                required
                disabled={sending}
              />
              <span className="character-count">{input.length}/240</span>
            </div>
            <div className="form-footer">
              <p>Your message takes a short trip to the Express server and back.</p>
              <button type="submit" disabled={!input.trim() || sending}>
                <span>{sending ? 'On its way…' : 'Send your message'}</span>
                <i aria-hidden="true">{sending ? '↻' : '↗'}</i>
              </button>
            </div>
          </form>

          <div className={`reply-area${reply ? ' reply-arrived' : ''}`} aria-live="polite">
            {reply ? (
              <>
                <div className="reply-avatar" aria-hidden="true">e.</div>
                <div className="reply-copy">
                  <span className="reply-label">A REPLY FROM EXPRESS <i>· JUST NOW</i></span>
                  <p>{reply}</p>
                </div>
                <span className="reply-spark" aria-hidden="true">✳</span>
              </>
            ) : (
              <div className="reply-placeholder">
                <span className="reply-arrow" aria-hidden="true">↳</span>
                <span>Your reply will find its way here.</span>
              </div>
            )}
          </div>

          {error && (
            <div className="error-message" role="alert">
              <span className="error-mark" aria-hidden="true">!</span>
              <p>{error}</p>
              <button type="button" onClick={this.handleRetry} disabled={sending || (Boolean(greeting) && !input.trim())}>
                {greeting ? 'Try again' : 'Reconnect'} <i aria-hidden="true">↻</i>
              </button>
            </div>
          )}
        </section>

        <footer className="page-footer">
          <span>MADE FOR LEARNING, SENT WITH CARE</span>
          <span>REACT <i>×</i> EXPRESS <i>×</i> YOU</span>
        </footer>
      </main>
    )
  }
}
