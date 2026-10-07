import { useRef, useState } from 'react'
import { useTasks } from '../context/TaskContext.jsx'

export default function AddTask() {
  const { dispatch } = useTasks()
  const [text, setText] = useState('')
  const inputRef = useRef(null)

  function submitTask(event) {
    event.preventDefault()
    const cleanText = text.trim()

    if (!cleanText) {
      inputRef.current?.focus()
      return
    }

    dispatch({
      type: 'ADD_TASK',
      task: { id: crypto.randomUUID(), text: cleanText, completed: false },
    })
    setText('')
    inputRef.current?.focus()
  }

  return (
    <form className="add-task-form" onSubmit={submitTask}>
      <label className="visually-hidden" htmlFor="task-input">Add a task</label>
      <input
        ref={inputRef}
        id="task-input"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="What needs doing?"
        maxLength={140}
      />
      <button type="submit"><span aria-hidden="true">+</span> Add task</button>
    </form>
  )
}