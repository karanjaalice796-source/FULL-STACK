import { Component } from 'react'
import axios from 'axios'

const endpoint = 'https://jsonplaceholder.typicode.com/posts'

export default class PostForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userId: '',
      title: '',
      body: '',
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
    const { userId, title, body, sending } = this.state
    if (sending) return

    this.setState({ sending: true, response: null, error: '' })

    try {
      const { data } = await axios.post(endpoint, {
        userId: Number(userId),
        title,
        body,
      }, {
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      })
      console.log('Post data sent with Axios:', data)
      this.setState({ response: data, sending: false })
    } catch (error) {
      console.error('Could not post data with Axios:', error)
      const message = error.response
        ? `The API responded with ${error.response.status} ${error.response.statusText}.`
        : error.message
      this.setState({ error: message, sending: false })
    }
  }

  render() {
    const { userId, title, body, sending, response, error } = this.state

    return (
      <article className="form-card axios-card">
        <div className="form-card-heading">
          <span className="exercise-number">02</span>
          <div><span className="form-method method-axios">AXIOS</span><h3>A story worth sharing.</h3></div>
          <span className="heading-doodle" aria-hidden="true">✦</span>
        </div>
        <p className="card-description">A title, a few lines, and the person sharing this little post.</p>

        <form onSubmit={this.handleSubmit}>
          <div className="field-row">
            <div>
              <label htmlFor="post-user-id">USER ID</label>
              <input
                id="post-user-id"
                name="userId"
                type="number"
                min="1"
                max="10"
                placeholder="1"
                value={userId}
                onChange={this.handleChange}
                required
                disabled={sending}
              />
            </div>
            <div>
              <label htmlFor="post-title">POST TITLE</label>
              <input
                id="post-title"
                name="title"
                type="text"
                placeholder="A day to remember"
                value={title}
                onChange={this.handleChange}
                maxLength={100}
                required
                disabled={sending}
              />
            </div>
          </div>
          <label htmlFor="post-body">YOUR STORY</label>
          <textarea
            id="post-body"
            name="body"
            placeholder="A few words about what happened…"
            value={body}
            onChange={this.handleChange}
            rows="3"
            maxLength={500}
            required
            disabled={sending}
          />
          <button className="submit-button" type="submit" disabled={sending}>
            <span>{sending ? 'Sending your story…' : 'Send with Axios'}</span>
            <i aria-hidden="true">{sending ? '↻' : '↗'}</i>
          </button>
        </form>

        <PostResult response={response} error={error} />
        <div className="card-footnote"><span>POST</span><code>/posts</code><span className="footnote-rule" /><span>YOUR BROWSER CONSOLE HAS THE RESPONSE</span></div>
      </article>
    )
  }
}

function PostResult({ response, error }) {
  if (error) {
    return <div className="result-panel result-error" role="alert"><span>!</span><p>Your story didn’t make it through. {error}</p></div>
  }

  if (response) {
    return (
      <div className="result-panel result-success" aria-live="polite">
        <span className="result-check" aria-hidden="true">✓</span>
        <div><span className="result-label">POSTCARD DELIVERED <i>· axios</i></span><p>{response.title} <code>id: {response.id}</code></p></div>
      </div>
    )
  }

  return <div className="result-panel result-idle"><span aria-hidden="true">↳</span><p>Your response will show up here after sending.</p></div>
}
