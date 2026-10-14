import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { editTask } from '../redux/plannerSlice.js'
import TaskForm from './TaskForm.jsx'

function EditTask({ day, task }) {
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        className="icon-button"
        type="button"
        aria-label={`Edit ${task.title}`}
        onClick={() => setIsOpen(true)}
      >
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="m12.9 4.1 3 3M4 16l3.2-.7L16 6.5a1.4 1.4 0 0 0-2-2l-8.8 8.8L4 16Z" />
        </svg>
      </button>
      {isOpen && (
        <TaskForm
          task={task}
          onClose={() => setIsOpen(false)}
          onSave={(updates) => dispatch(editTask({ day, taskId: task.id, updates }))}
        />
      )}
    </>
  )
}

export default EditTask
