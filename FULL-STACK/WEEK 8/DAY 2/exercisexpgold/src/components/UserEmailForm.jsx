import { Component } from 'react'

const endpoint = 'https://jsonplaceholder.typicode.com/users/'

export default class UserEmailForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: '',
      email: '',
      sending: false,
      response: null,
      error: '',
    }
  }

  handleChange = (event) => {
    const { name, value } = event.target
    this.setState({ [name]: value, error: '' })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    const { user, email, sending } = this.state
    if (sending) return

    this.setState({ sending: true, response: null, error: '' })

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({ user, email }),
      })
      if (!response.ok) throw new Error(`The API responded with ${response.status} ${response.statusText}.`)

      const data = await response.json()
      console.log('User data posted with fetch:', data)
      this.setState({ response: data, sending: false })
    } catch (error) {
      console.error('Could not post user data with fetch:', error)
      this.setState({ error: error.message, sending: false })
    }
  }

  render() {
    const { user, email, sending, response, error } = this.state

    return (
      <article className="form-card fetch-card">
        <div className="form-card-heading">
          <span className="exercise-number">01</span>
          <div><span className="form-method method-fetch">FETCH API</span><h3>A person to say hello.</h3></div>
          <span className="heading-doodle" aria-hidden="true">✳</span>
        </div>
        <p className="card-description">A name and an email address, packed into a small JSON envelope.</p>

        <form onSubmit={this.handleSubmit}>
          <label htmlFor="fetch-user">YOUR NAME</label>
          <input
            id="fetch-user"
            name="user"
            type="text"
            placeholder="e.g. Alex Morgan"
            value={user}
            onChange={this.handleChange}
            autoComplete="name"
            maxLength={80}
            required
            disabled={sending}
          />
          <label htmlFor="fetch-email">EMAIL ADDRESS</label>
          <input
            id="fetch-email"
            name="email"
            type="email"
            placeholder="alex@example.com"
            value={email}
            onChange={this.handleChange}
            autoComplete="email"
            maxLength={254}
            required
            disabled={sending}
          />
          <button className="submit-button" type="submit" disabled={sending}>
            <span>{sending ? 'Sending your note…' : 'Send with fetch'}</span>
            <i aria-hidden="true">{sending ? '↻' : '↗'}</i>
          </button>
        </form>

        <ResultPanel response={response} error={error} method="fetch" />
        <div className="card-footnote"><span>POST</span><code>/users/</code><span className="footnote-rule" /><span>YOUR BROWSER CONSOLE HAS THE RESPONSE</span></div>
      </article>
    )
  }
}

function ResultPanel({ response, error, method }) {
  if (error) {
    return <div className="result-panel result-error" role="alert"><span>!</span><p>Your note didn’t make it through. {error}</p></div>
  }

  if (response) {
    return (
      <div className="result-panel result-success" aria-live="polite">
        <span className="result-check" aria-hidden="true">✓</span>
        <div><span className="result-label">POSTCARD DELIVERED <i>· {method}</i></span><p>{response.name || response.user || response.title || 'Your data'} is on its way. <code>id: {response.id}</code></p></div>
      </div>
    )
  }

  return <div className="result-panel result-idle"><span aria-hidden="true">↳</span><p>Your response will show up here after sending.</p></div>
}
