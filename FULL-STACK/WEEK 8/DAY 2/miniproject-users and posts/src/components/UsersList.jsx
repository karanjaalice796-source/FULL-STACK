import { Component } from 'react'

const USERS_URL = 'https://jsonplaceholder.typicode.com/users'

export default class UsersList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [],
      isLoaded: false,
      errorMsg: '',
    }
  }

  componentDidMount() {
    this.loadUsers()
  }

  loadUsers = async () => {
    try {
      const response = await fetch(USERS_URL)
      if (!response.ok) {
        throw new Error(`The people request failed (${response.status}).`)
      }

      const users = await response.json()
      if (!Array.isArray(users)) {
        throw new Error('The people response was not a list.')
      }

      this.setState({ users, isLoaded: true })
    } catch (error) {
      this.setState({
        errorMsg: error instanceof Error ? error.message : 'Could not load the people.',
        isLoaded: true,
      })
    }
  }

  render() {
    const { users, isLoaded, errorMsg } = this.state

    return (
      <section className="content-section people-section" id="users" aria-labelledby="users-heading">
        <header className="section-heading">
          <div>
            <p className="kicker"><span /> PART TWO / THE DIRECTORY</p>
            <h2 id="users-heading">People behind <em>the posts</em></h2>
          </div>
          <span className="count-label">{isLoaded ? `${users.length} PEOPLE` : 'FETCHING'}</span>
        </header>

        {!isLoaded && (
          <div className="loading-note" role="status">
            <span className="loader" /> Gathering names…
          </div>
        )}
        {isLoaded && errorMsg && (
          <div className="error-note" role="alert">
            <strong>The directory is taking a moment.</strong>
            <span>{errorMsg}</span>
            <button type="button" onClick={this.loadUsers}>Try again</button>
          </div>
        )}
        {isLoaded && !errorMsg && users.length > 0 && (
          <ul className="people-grid">
            {users.map((user, index) => (
              <li className="person-card" key={user.id}>
                <span className="person-number">{String(index + 1).padStart(2, '0')}</span>
                <span className={`person-initial initial-${index % 5}`} aria-hidden="true">
                  {user.name.charAt(0)}
                </span>
                <div className="person-details">
                  <h3>{user.name}</h3>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </div>
                <span className="person-arrow" aria-hidden="true">↗</span>
              </li>
            ))}
          </ul>
        )}
        {isLoaded && !errorMsg && users.length === 0 && (
          <p className="empty-note">No people came back this time.</p>
        )}
      </section>
    )
  }
}
