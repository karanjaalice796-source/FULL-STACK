import { useSelector } from 'react-redux'
import TodoItem from './TodoItem.jsx'

function TodoList() {
  const todos = useSelector((state) => state.todos.items)
  const status = useSelector((state) => state.todos.status)

  if (status === 'loading' && todos.length === 0) {
    return <p className="list-message">Gathering your tasks…</p>
  }

  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon" aria-hidden="true">✳</span>
        <p>Nothing on your list yet. Add one small thing to get started.</p>
      </div>
    )
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => <TodoItem key={todo.id} todo={todo} />)}
    </ul>
  )
}

export default TodoList
