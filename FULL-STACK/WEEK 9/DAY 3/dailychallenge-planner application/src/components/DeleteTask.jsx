import { useDispatch } from 'react-redux'
import { deleteTask } from '../redux/plannerSlice.js'

function DeleteTask({ day, task }) {
  const dispatch = useDispatch()

  return (
    <button
      className="icon-button delete-button"
      type="button"
      aria-label={`Delete ${task.title}`}
      onClick={() => dispatch(deleteTask({ day, taskId: task.id }))}
    >
      <svg viewBox="0 0 20 20" aria-hidden="true">
        <path d="M5 6h10M8 6V4h4v2m-6 0 .7 10h6.6L14 6m-4 3v4m2-4v4" />
      </svg>
    </button>
  )
}

export default DeleteTask
