import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addTask } from '../redux/plannerSlice.js'
import TaskForm from './TaskForm.jsx'

function AddTask({
  day,
  buttonClass = 'add-task-button',
  label = 'Add a task',
  showPlus = true,
}) {
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button className={buttonClass} type="button" onClick={() => setIsOpen(true)}>
        {showPlus && <span aria-hidden="true">+</span>}
        {label}
      </button>
      {isOpen && (
        <TaskForm
          onClose={() => setIsOpen(false)}
          onSave={(task) => dispatch(addTask({ day, task }))}
        />
      )}
    </>
  )
}

export default AddTask
