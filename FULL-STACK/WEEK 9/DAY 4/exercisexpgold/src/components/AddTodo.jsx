import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addTodo } from '../redux/todosSlice.js'

function AddTodo() {
  const dispatch = useDispatch()
  const [title, setTitle] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return

    dispatch(addTodo(trimmedTitle))
    setTitle('')
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <span className="input-plus" aria-hidden="true">+</span>
      <label className="sr-only" htmlFor="new-todo">Add a task</label>
      <input
        id="new-todo"
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="What needs your attention?"
        maxLength={120}
      />
      <button className="add-button" type="submit" disabled={!title.trim()}>
        Add task
      </button>
    </form>
  )
}

export default AddTodo
