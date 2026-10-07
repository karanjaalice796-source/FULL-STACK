import { Component } from 'react'

export default class Users extends Component {
  state = { users: [], loading: true, error: null }

  componentDidMount() {
    this.fetchUsers()
  }

  fetchUsers = async () => {
    this.setState({ loading: true, error: null })

    try {
      const response = await fetch('/users')
      if (!response.ok) {
        throw new Error(`Users request failed (${response.status} ${response.statusText})`)
      }

      const users = await response.json()
      if (!Array.isArray(users)) {
        throw new Error('The users response was not a JSON array.')
      }

      this.setState({ users, loading: false })
    } catch (error) {
      this.setState({ error: error.message || 'Could not load users.', loading: false })
    }
  }

  render() {
    const { users, loading, error } = this.state

    if (loading) {
      return <p className="request-state"><span className="loader" /> Asking the server for its users…</p>
    }

    if (error) {
      return (
        <div className="request-error" role="alert">
          <p>{error}</p>
          <button className="retry-button" onClick={this.fetchUsers}>Try again</button>
        </div>
      )
    }

    return (
      <div className="response-list" aria-label="Users returned by Express">
        {users.map((user, index) => (
          <article className="person-row" key={user.id}>
            <span className="person-index">{String(index + 1).padStart(2, '0')}</span>
            <span className="avatar" aria-hidden="true">{user.username.charAt(0).toUpperCase()}</span>
            <div className="person-copy">
              <strong>{user.username}</strong>
              <small>USER ID / {user.id}</small>
            </div>
            <span className="row-mark" aria-hidden="true">↗</span>
          </article>
        ))}
        {users.length === 0 && <p className="empty-state">The server returned an empty list.</p>}
      </div>
    )
  }
}
