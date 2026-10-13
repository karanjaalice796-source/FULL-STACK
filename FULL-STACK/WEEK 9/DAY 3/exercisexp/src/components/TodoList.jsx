import { useSelector } from 'react-redux'
import TodoItem from './TodoItem.jsx'

function TodoList({ filter }) {
  const todos = useSelector((state) => state.todos)
  const visibleTodos = todos.filter((todo) => {
    if (filter === 'Active') return !todo.completed
    if (filter === 'Completed') return todo.completed
    return true
  })

  if (visibleTodos.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon" aria-hidden="true">
          {todos.length === 0 ? '✳' : filter === 'Active' ? '✓' : '○'}
        </span>
        <p>
          {todos.length === 0
            ? 'Your list is a blank page.'
            : filter === 'Active'
              ? 'All caught up. Nothing left to do.'
              : 'No completed tasks just yet.'}
        </p>
        <span>
          {todos.length === 0
            ? 'Add your first task above and start small.'
            : 'Try another filter to see your tasks.'}
        </span>
      </div>
    )
  }

  return (
    <ul className="todo-list">
      {visibleTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  )
}

export default TodoList
