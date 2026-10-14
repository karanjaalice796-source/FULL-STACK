import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addTodo } from '../redux/todosSlice.js'

function AddTodo() {
  const dispatch = useDispatch()
  const [text, setText] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const trimmedText = text.trim()
    if (!trimmedText) return

    dispatch(addTodo(trimmedText))
    setText('')
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="new-todo">Add a task</label>
      <span className="input-plus" aria-hidden="true">+</span>
      <input
        id="new-todo"
        type="text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="What needs doing?"
        maxLength={120}
      />
      <button className="add-button" type="submit" disabled={!text.trim()}>
        Add task
      </button>
    </form>
  )
}

export default AddTodo
