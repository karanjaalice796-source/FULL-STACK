import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearCompleted } from './redux/todosSlice.js'
import AddTodo from './components/AddTodo.jsx'
import TodoList from './components/TodoList.jsx'
import './App.css'

const filters = ['All', 'Active', 'Completed']

function App() {
  const dispatch = useDispatch()
  const todos = useSelector((state) => state.todos)
  const [filter, setFilter] = useState('All')
  const remainingCount = todos.filter((todo) => !todo.completed).length
  const completedCount = todos.length - remainingCount

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

        <AddTodo />

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

        <TodoList filter={filter} />

        <footer className="list-footer">
          <span>
            {remainingCount === 0
              ? todos.length === 0 ? 'A fresh start.' : 'Everything is done.'
              : `${remainingCount} ${remainingCount === 1 ? 'task' : 'tasks'} left`}
          </span>
          {completedCount > 0 && (
            <button
              className="clear-button"
              type="button"
              onClick={() => dispatch(clearCompleted())}
            >
              Clear completed
            </button>
          )}
        </footer>
      </section>

      <p className="page-note">Small steps still move you forward.</p>
    </main>
  )
}

export default App
