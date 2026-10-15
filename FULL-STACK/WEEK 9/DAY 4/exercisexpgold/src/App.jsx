import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AddTodo from './components/AddTodo.jsx'
import TodoList from './components/TodoList.jsx'
import TodoSummary from './components/TodoSummary.jsx'
import { fetchTodos } from './redux/todosSlice.js'
import './App.css'

function App() {
  const dispatch = useDispatch()
  const status = useSelector((state) => state.todos.status)
  const error = useSelector((state) => state.todos.error)
  const todos = useSelector((state) => state.todos.items)
  const isLoading = status === 'loading'

  useEffect(() => {
    dispatch(fetchTodos())
  }, [dispatch])

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
          <button
            className="refresh-button"
            type="button"
            onClick={() => dispatch(fetchTodos())}
            disabled={isLoading}
          >
            {isLoading ? 'Syncing…' : '↻ Refresh'}
          </button>
        </div>

        {error && (
          <div className="error-message" role="alert">
            <span>{error}</span>
            <button type="button" onClick={() => dispatch(fetchTodos())}>Try again</button>
          </div>
        )}

        <div aria-live="polite" aria-busy={isLoading}>
          <TodoList />
        </div>

        <footer className="list-footer">
          <TodoSummary />
          <span>{isLoading ? 'Syncing your list…' : 'Your changes are saved for this session.'}</span>
        </footer>
      </section>

      <p className="page-note">Small steps still move you forward.</p>
    </main>
  )
}

export default App
