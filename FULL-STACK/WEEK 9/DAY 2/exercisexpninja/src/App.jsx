import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import {
  addTodo,
  authFailure,
  authRequest,
  authRestored,
  authSuccess,
  clearAuthError,
  clearNotice,
  logoutUser,
  persistenceFailure,
  removeTodo,
  toggleTodo,
} from './redux/actions.js'
import { login, logout, register, restoreSession } from './services/authService.js'
import { loadTodos, saveTodos } from './services/todoStorage.js'
import { store } from './redux/store.js'
import './App.css'

const filters = ['All', 'Active', 'Completed']

function describeError(error) {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.'
}

function AuthScreen({ error, isLoading, onLogin, onRegister, onClearError }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [formError, setFormError] = useState('')
  const isRegistering = mode === 'register'

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')

    if (isRegistering && password !== confirmPassword) {
      setFormError('Those passwords do not match yet.')
      return
    }

    const credentials = { email, password }
    if (isRegistering) credentials.name = name
    if (isRegistering) await onRegister(credentials)
    else await onLogin(credentials)
  }

  function changeMode(nextMode) {
    setMode(nextMode)
    setFormError('')
    onClearError()
  }

  return (
    <main className="auth-layout">
      <section className="auth-story">
        <a className="brand" href="/" aria-label="Little List home">
          <span className="brand-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M7 6h13M7 12h13M7 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01" /></svg>
          </span>
          <span>little list<span className="brand-period">.</span></span>
        </a>

        <div className="story-copy">
          <p className="eyebrow">A LITTLE SPACE, JUST FOR YOU</p>
          <h1>Make space<br />for what <em>matters.</em></h1>
          <p className="story-description">A quieter place for your to-dos. Sign in, settle in, and take things one step at a time.</p>
        </div>

        <div className="story-art" aria-hidden="true">
          <div className="art-sheet">
            <span className="sheet-title" />
            <span className="sheet-line line-long" />
            <span className="sheet-line" />
            <span className="sheet-line line-short" />
            <span className="sheet-check">✓</span>
            <span className="sheet-spark">✳</span>
          </div>
          <span className="art-shadow" />
          <span className="art-orbit" />
        </div>

        <p className="story-footer">A gentle reminder: one thing at a time is enough.</p>
      </section>

      <section className="auth-side" aria-labelledby="auth-heading">
        <div className="auth-card">
          <div className="mobile-brand">
            <span className="brand-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M7 6h13M7 12h13M7 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01" /></svg>
            </span>
            <span>little list<span className="brand-period">.</span></span>
          </div>

          <div className="auth-heading">
            <p className="section-label">{isRegistering ? 'YOUR OWN LITTLE CORNER' : 'WELCOME BACK'}</p>
            <h2 id="auth-heading">{isRegistering ? 'Create your account.' : 'Good to have you.'}</h2>
            <p>{isRegistering ? 'A fresh start is just a few details away.' : 'Sign in to pick up where you left off.'}</p>
          </div>

          <div className="auth-tabs" role="group" aria-label="Account action">
            <button
              className={mode === 'login' ? 'selected' : ''}
              type="button"
              aria-pressed={mode === 'login'}
              onClick={() => changeMode('login')}
            >
              Sign in
            </button>
            <button
              className={mode === 'register' ? 'selected' : ''}
              type="button"
              aria-pressed={mode === 'register'}
              onClick={() => changeMode('register')}
            >
              Create account
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {isRegistering && (
              <div className="form-field">
                <label htmlFor="name">Your name</label>
                <input
                  autoComplete="name"
                  id="name"
                  maxLength={60}
                  minLength={2}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="What should we call you?"
                  required
                  type="text"
                  value={name}
                />
              </div>
            )}
            <div className="form-field">
              <label htmlFor="email">Email address</label>
              <input
                autoComplete="email"
                id="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                type="email"
                value={email}
              />
            </div>
            <div className="form-field">
              <label htmlFor="password">Password</label>
              <input
                autoComplete={isRegistering ? 'new-password' : 'current-password'}
                id="password"
                minLength={8}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={isRegistering ? 'At least 8 characters' : 'Enter your password'}
                pattern={isRegistering ? '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}' : undefined}
                required
                title={isRegistering ? 'Use at least 8 characters, including uppercase, lowercase, and a number.' : undefined}
                type="password"
                value={password}
              />
              {isRegistering && <span className="field-hint">Use 8+ characters with uppercase, lowercase, and a number.</span>}
            </div>
            {isRegistering && (
              <div className="form-field">
                <label htmlFor="confirm-password">Confirm password</label>
                <input
                  autoComplete="new-password"
                  id="confirm-password"
                  minLength={8}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Enter your password again"
                  required
                  type="password"
                  value={confirmPassword}
                />
              </div>
            )}

            {(error || formError) && (
              <p className="auth-error" role="alert">
                <span aria-hidden="true">!</span>{formError || error}
              </p>
            )}

            <button className="primary-button auth-submit" disabled={isLoading} type="submit">
              {isLoading
                ? 'One moment…'
                : isRegistering ? 'Create my account' : 'Sign in'}
              {!isLoading && <span aria-hidden="true">→</span>}
            </button>
          </form>

          <p className="auth-switch">
            {isRegistering ? 'Already have a little list?' : 'New around here?'}
            {' '}
            <button type="button" onClick={() => changeMode(isRegistering ? 'login' : 'register')}>
              {isRegistering ? 'Sign in' : 'Create an account'}
            </button>
          </p>
          <p className="demo-disclaimer">
            Demo authentication only. Account data stays in this browser; don’t use a real password.
          </p>
        </div>
      </section>
    </main>
  )
}

function TodoDashboard({
  user,
  todos,
  notice,
  onAddTodo,
  onToggleTodo,
  onRemoveTodo,
  onLogout,
  onClearNotice,
}) {
  const [text, setText] = useState('')
  const [filter, setFilter] = useState('All')
  const activeCount = todos.filter((todo) => !todo.completed).length
  const completedCount = todos.length - activeCount
  const visibleTodos = todos.filter((todo) => {
    if (filter === 'Active') return !todo.completed
    if (filter === 'Completed') return todo.completed
    return true
  })
  const firstName = user.name.split(/\s+/)[0]

  function handleSubmit(event) {
    event.preventDefault()
    const cleanText = text.trim()
    if (!cleanText) return
    onAddTodo(cleanText)
    setText('')
  }

  return (
    <main className="dashboard-shell">
      <header className="topbar dashboard-topbar">
        <a className="brand" href="/" aria-label="Little List home">
          <span className="brand-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M7 6h13M7 12h13M7 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01" /></svg>
          </span>
          <span>little list<span className="brand-period">.</span></span>
        </a>
        <div className="account-menu">
          <span className="account-avatar" aria-hidden="true">{firstName.charAt(0).toUpperCase()}</span>
          <span className="account-name">{user.name}</span>
          <button className="logout-button" type="button" onClick={onLogout}>Sign out</button>
        </div>
      </header>

      <section className="dashboard-welcome">
        <div>
          <p className="eyebrow">YOUR SPACE TO FOCUS</p>
          <h1>A little progress, <em>{firstName}.</em></h1>
          <p className="welcome-copy">Let’s make today feel a bit lighter.</p>
        </div>
        <div className="welcome-date">
          <span>{new Intl.DateTimeFormat('en', { weekday: 'long' }).format(new Date())}</span>
          <strong>{new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric' }).format(new Date())}</strong>
        </div>
      </section>

      <section className="todo-card" aria-label="Your private todo list">
        <header className="todo-card-heading">
          <div>
            <p className="section-label">YOUR PRIVATE LIST</p>
            <h2>What’s on your mind?</h2>
            <p>{activeCount === 0
              ? 'A clear list and a little breathing room.'
              : `${activeCount} ${activeCount === 1 ? 'task' : 'tasks'} to take one at a time.`}
            </p>
          </div>
          <div className="done-stat">
            <span>{completedCount}</span>
            <small>DONE</small>
          </div>
        </header>

        {notice && (
          <div className="storage-notice" role="alert">
            <span>{notice}</span>
            <button type="button" aria-label="Dismiss message" onClick={onClearNotice}>×</button>
          </div>
        )}

        <form className="todo-add-form" onSubmit={handleSubmit}>
          <span className="input-plus" aria-hidden="true">+</span>
          <label className="sr-only" htmlFor="new-todo">Add a task</label>
          <input
            id="new-todo"
            maxLength={120}
            onChange={(event) => setText(event.target.value)}
            placeholder="What would you like to get done?"
            type="text"
            value={text}
          />
          <button className="primary-button" disabled={!text.trim()} type="submit">Add task</button>
        </form>

        <div className="list-toolbar">
          <div className="list-title">
            <h3>Your tasks</h3>
            <span className="task-count">{todos.length}</span>
          </div>
          <div className="filter-tabs" role="group" aria-label="Filter tasks">
            {filters.map((name) => (
              <button
                className={filter === name ? 'selected' : ''}
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
              <li className={`todo-row${todo.completed ? ' is-complete' : ''}`} key={todo.id}>
                <label className="todo-label">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => onToggleTodo(todo.id)}
                  />
                  <span className="custom-checkbox" aria-hidden="true">
                    <svg viewBox="0 0 16 16"><path d="m3.5 8 3 3 6-6" /></svg>
                  </span>
                  <span className="todo-text">{todo.text}</span>
                </label>
                <button
                  className="remove-button"
                  type="button"
                  aria-label={`Remove ${todo.text}`}
                  onClick={() => onRemoveTodo(todo.id)}
                >
                  <svg viewBox="0 0 20 20"><path d="M5 5l10 10M15 5 5 15" /></svg>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state">
            <span aria-hidden="true">{todos.length === 0 ? '✳' : filter === 'Completed' ? '✓' : '○'}</span>
            <h3>{todos.length === 0 ? 'A fresh start.' : filter === 'Completed' ? 'Nothing finished just yet.' : 'All caught up.'}</h3>
            <p>{todos.length === 0 ? 'Add a task above and take it from there.' : 'Try a different filter or enjoy the calm.'}</p>
          </div>
        )}

        <footer className="todo-footer">
          <span>{activeCount} {activeCount === 1 ? 'task' : 'tasks'} left</span>
          <span>Little steps still count <span aria-hidden="true">✦</span></span>
        </footer>
      </section>
      <footer className="page-footer">
        <span>Your list, only for you.</span>
        <span>DEMO APP · LOCAL BROWSER STORAGE</span>
      </footer>
    </main>
  )
}

function App({
  auth,
  todos,
  notice,
  dispatch,
  onLogin,
  onRegister,
  onRestore,
  onLogout,
  onAddTodo,
  onToggleTodo,
  onRemoveTodo,
  onClearNotice,
}) {
  useEffect(() => {
    onRestore()
  }, [onRestore])

  if (auth.status === 'checking') {
    return (
      <main className="checking-screen" aria-live="polite">
        <span className="checking-mark" aria-hidden="true">✳</span>
        <p>Making a little space for you…</p>
      </main>
    )
  }

  if (auth.status !== 'authenticated' || !auth.user) {
    return (
      <AuthScreen
        error={auth.error}
        isLoading={auth.status === 'loading'}
        onClearError={() => dispatch(clearAuthError())}
        onLogin={onLogin}
        onRegister={onRegister}
      />
    )
  }

  return (
    <TodoDashboard
      user={auth.user}
      todos={todos}
      notice={notice}
      onAddTodo={onAddTodo}
      onToggleTodo={onToggleTodo}
      onRemoveTodo={onRemoveTodo}
      onLogout={onLogout}
      onClearNotice={onClearNotice}
    />
  )
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  todos: state.todos,
  notice: state.notice,
})

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  onRestore: () => {
    try {
      const session = restoreSession()
      dispatch(authRestored(session
        ? { ...session, todos: loadTodos(session.user.id) }
        : null))
    } catch (error) {
      dispatch(authFailure(describeError(error)))
    }
  },
  onLogin: async (credentials) => {
    dispatch(authRequest())
    try {
      const session = await login(credentials)
      dispatch(authSuccess({
        ...session,
        todos: loadTodos(session.user.id),
      }))
    } catch (error) {
      dispatch(authFailure(describeError(error)))
    }
  },
  onRegister: async (credentials) => {
    dispatch(authRequest())
    try {
      const session = await register(credentials)
      dispatch(authSuccess({
        ...session,
        todos: loadTodos(session.user.id),
      }))
    } catch (error) {
      dispatch(authFailure(describeError(error)))
    }
  },
  onLogout: () => {
    try {
      logout()
      dispatch(logoutUser())
    } catch (error) {
      dispatch(authFailure(describeError(error)))
    }
  },
  onAddTodo: (text) => {
    const userId = store.getState().auth.user?.id
    if (!userId) return
    dispatch(addTodo(text))
    try {
      saveTodos(userId, store.getState().todos)
    } catch (error) {
      dispatch(persistenceFailure(`Your task was added for this session, but it could not be saved: ${describeError(error)}`))
    }
  },
  onToggleTodo: (todoId) => {
    const userId = store.getState().auth.user?.id
    if (!userId) return
    dispatch(toggleTodo(todoId))
    try {
      saveTodos(userId, store.getState().todos)
    } catch (error) {
      dispatch(persistenceFailure(`Your change is active for this session, but it could not be saved: ${describeError(error)}`))
    }
  },
  onRemoveTodo: (todoId) => {
    const userId = store.getState().auth.user?.id
    if (!userId) return
    dispatch(removeTodo(todoId))
    try {
      saveTodos(userId, store.getState().todos)
    } catch (error) {
      dispatch(persistenceFailure(`Your task was removed for this session, but the change could not be saved: ${describeError(error)}`))
    }
  },
  onClearNotice: () => dispatch(clearNotice()),
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
