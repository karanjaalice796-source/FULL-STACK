import { useDispatch } from 'react-redux'
import { removeTodo, toggleTodo } from '../redux/todosSlice.js'

function TodoItem({ todo }) {
  const dispatch = useDispatch()

  return (
    <li className={`todo-item${todo.completed ? ' is-complete' : ''}`}>
      <label className="todo-label">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => dispatch(toggleTodo(todo.id))}
        />
        <span className="custom-checkbox" aria-hidden="true">
          <svg viewBox="0 0 16 16" focusable="false">
            <path d="m3.5 8 3 3 6-6" />
          </svg>
        </span>
        <span className="todo-text">{todo.text}</span>
      </label>
      <button
        className="remove-button"
        type="button"
        aria-label={`Remove ${todo.text}`}
        onClick={() => dispatch(removeTodo(todo.id))}
      >
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M5 5l10 10M15 5 5 15" />
        </svg>
      </button>
    </li>
  )
}

export default TodoItem
