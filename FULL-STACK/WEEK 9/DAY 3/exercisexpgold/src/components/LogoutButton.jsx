import { useDispatch } from 'react-redux'
import { logoutUser } from '../redux/authSlice.js'

function LogoutButton() {
  const dispatch = useDispatch()

  return (
    <button
      className="logout-button"
      type="button"
      onClick={() => dispatch(logoutUser())}
    >
      Sign out
      <span aria-hidden="true">↗</span>
    </button>
  )
}

export default LogoutButton
