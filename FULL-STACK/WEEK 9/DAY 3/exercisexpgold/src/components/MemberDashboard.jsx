import { useSelector } from 'react-redux'
import LogoutButton from './LogoutButton.jsx'

function MemberDashboard() {
  const user = useSelector((state) => state.auth.user)
  const initial = user?.name?.charAt(0).toUpperCase() || '?'

  return (
    <section className="member-layout" aria-labelledby="member-title">
      <div className="member-card">
        <div className="member-card-top">
          <div className="member-mark" aria-hidden="true">N</div>
          <span className="member-badge">
            <span className="status-dot" aria-hidden="true" />
            Signed in
          </span>
        </div>

        <p className="eyebrow">YOUR PERSONAL SPACE</p>
        <h1 id="member-title">You’re right<br />where you <em>belong.</em></h1>
        <p className="member-intro">
          Welcome in, {user?.name || 'friend'}. Take a breath—your next step can wait
          until you’re ready.
        </p>

        <div className="profile-row">
          <div className="avatar" aria-hidden="true">{initial}</div>
          <div className="profile-details">
            <strong>{user?.name}</strong>
            <span>{user?.email}</span>
          </div>
          <span className="profile-check" aria-label="Account active">✓</span>
        </div>

        <LogoutButton />
      </div>
      <p className="member-footnote">Your account details are held in the Redux store for this session.</p>
    </section>
  )
}

export default MemberDashboard
