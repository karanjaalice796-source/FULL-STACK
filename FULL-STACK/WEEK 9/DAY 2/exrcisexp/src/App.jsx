import { useState } from 'react'
import { connect } from 'react-redux'
import {
  addTodo,
  clearCompleted,
  removeTodo,
  toggleTodo,
} from './redux/actions.js'
import './App.css'

const filters = ['All', 'Active', 'Completed']

function TodoApp({
  todos,
  onAddTodo,
  onToggleTodo,
  onRemoveTodo,
  onClearCompleted,
}) {
  const [text, setText] = useState('')
  const [filter, setFilter] = useState('All')
  const remainingCount = todos.filter((todo) => !todo.completed).length
  const completedCount = todos.length - remainingCount
  const visibleTodos = todos.filter((todo) => {
    if (filter === 'Active') return !todo.completed
    if (filter === 'Completed') return todo.completed
    return true
  })

  function handleSubmit(event) {
    event.preventDefault()
    const trimmedText = text.trim()
    if (!trimmedText) return

    onAddTodo(trimmedText)
    setText('')
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Little List home">
          <span className="brand-mark" aria-hidden="true">L</span>
          little list
        </a>
        <span className="topbar-note">A little more clarity, every day.</span>
      </header>

      <section className="todo-panel" aria-labelledby="page-title">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">YOUR SPACE TO FOCUS</p>
            <h1 id="page-title">Make room for<br />what matters.</h1>
            <p className="intro">One thing at a time. You’ve got this.</p>
          </div>
          <div className="sparkle" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>

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

        <div className="list-toolbar">
          <div className="list-title">
            <h2>Your list</h2>
            <span className="task-count">{todos.length}</span>
          </div>
          <div className="filter-tabs" role="group" aria-label="Filter tasks">
            {filters.map((name) => (
              <button
                className={`filter-tab${filter === name ? ' is-selected' : ''}`}
                key={name}
                type="button"
                aria-pressed={filter === name}
                onClick={() => setFilter(name)}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {visibleTodos.length > 0 ? (
          <ul className="todo-list">
            {visibleTodos.map((todo) => (
              <li className={`todo-item${todo.completed ? ' is-complete' : ''}`} key={todo.id}>
                <label className="todo-label">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => onToggleTodo(todo.id)}
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
                  onClick={() => onRemoveTodo(todo.id)}
                >
                  <svg viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M5 5l10 10M15 5 5 15" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        ) : (
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
        )}

        <footer className="list-footer">
          <span>
            {remainingCount === 0
              ? todos.length === 0 ? 'A fresh start.' : 'Everything is done.'
              : `${remainingCount} ${remainingCount === 1 ? 'task' : 'tasks'} left`}
          </span>
          {completedCount > 0 && (
            <button className="clear-button" type="button" onClick={onClearCompleted}>
              Clear completed
            </button>
          )}
        </footer>
      </section>

      <p className="page-note">Small steps still move you forward.</p>
    </main>
  )
}

const mapStateToProps = (state) => ({
  todos: state.todos,
})

const mapDispatchToProps = {
  onAddTodo: addTodo,
  onToggleTodo: toggleTodo,
  onRemoveTodo: removeTodo,
  onClearCompleted: clearCompleted,
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoApp)
