import { connect } from 'react-redux'

function UserProfile({ user }) {
  if (!user) {
    return (
      <div className="empty-state">
        <span className="empty-icon" aria-hidden="true">↗</span>
        <p>Your user profile will appear here.</p>
      </div>
    )
  }

  return (
    <article className="profile-card" aria-label={`Profile for ${user.name}`}>
      <div className="avatar" aria-hidden="true">
        {user.name
          .split(' ')
          .map((part) => part[0])
          .slice(0, 2)
          .join('')}
      </div>
      <div className="profile-heading">
        <div>
          <p className="eyebrow">USER PROFILE</p>
          <h2>{user.name}</h2>
          <p className="username">@{user.username}</p>
        </div>
        <span className="user-id">ID / {user.id}</span>
      </div>
      <dl className="details-list">
        <div>
          <dt>Email</dt>
          <dd><a href={`mailto:${user.email}`}>{user.email}</a></dd>
        </div>
        <div>
          <dt>Phone</dt>
          <dd>{user.phone}</dd>
        </div>
        <div>
          <dt>Website</dt>
          <dd><a href={`https://${user.website}`} target="_blank" rel="noreferrer">{user.website}</a></dd>
        </div>
        <div>
          <dt>Company</dt>
          <dd>{user.company.name}</dd>
        </div>
        <div>
          <dt>Location</dt>
          <dd>{user.address.city}, {user.address.street}</dd>
        </div>
      </dl>
    </article>
  )
}

const mapStateToProps = (state) => ({
  user: state.users.user,
})

export default connect(mapStateToProps)(UserProfile)
