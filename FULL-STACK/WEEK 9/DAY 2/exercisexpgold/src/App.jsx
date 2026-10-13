import { useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { addTodo, removeTodo, toggleTodo } from './redux/actions.js'
import './App.css'

const filters = ['All', 'Active', 'Completed']

function App({
  categories,
  onAddTodo,
  onToggleTodo,
  onRemoveTodo,
}) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [filter, setFilter] = useState('All')
  const [text, setText] = useState('')
  const [newTodoCategory, setNewTodoCategory] = useState('personal')

  const allTodos = useMemo(
    () => categories.flatMap((category) =>
      category.todos.map((todo) => ({ ...todo, categoryId: category.id })),
    ),
    [categories],
  )
  const visibleTodos = allTodos.filter((todo) => {
    const matchesCategory = selectedCategory === 'all' || todo.categoryId === selectedCategory
    const matchesFilter = filter === 'All'
      || (filter === 'Active' && !todo.completed)
      || (filter === 'Completed' && todo.completed)
    return matchesCategory && matchesFilter
  })
  const activeCount = allTodos.filter((todo) => !todo.completed).length
  const completedCount = allTodos.length - activeCount
  const displayedActiveCount = allTodos.filter((todo) =>
    !todo.completed
    && (selectedCategory === 'all' || todo.categoryId === selectedCategory),
  ).length
  const heading = selectedCategory === 'all'
    ? 'Everything'
    : categories.find((category) => category.id === selectedCategory)?.name ?? 'Everything'

  function handleSubmit(event) {
    event.preventDefault()
    const cleanText = text.trim()
    if (!cleanText) return
    onAddTodo(newTodoCategory, cleanText)
    setText('')
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Little List home">
          <span className="brand-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M7 6h13M7 12h13M7 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01" />
            </svg>
          </span>
          <span>little list<span className="brand-period">.</span></span>
        </a>
        <div className="topbar-caption">
          <span className="caption-dot" />
          A calmer way to get things done
        </div>
        <span className="today-label">
          {new Intl.DateTimeFormat('en', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date())}
        </span>
      </header>

      <section className="welcome">
        <div>
          <p className="eyebrow">A LITTLE SPACE FOR YOUR PLANS</p>
          <h1>Clear your mind.<br /><em>One thing at a time.</em></h1>
          <p className="welcome-copy">Keep the little things in order, so you can focus on the big ones.</p>
        </div>
        <div className="welcome-art" aria-hidden="true">
          <span className="art-orbit orbit-one" />
          <span className="art-orbit orbit-two" />
          <span className="art-center">✳</span>
          <span className="art-dot" />
        </div>
      </section>

      <section className="workspace" aria-label="Todo list">
        <aside className="sidebar">
          <div className="sidebar-heading">
            <p className="section-label">YOUR LISTS</p>
            <span className="category-count">{categories.length}</span>
          </div>
          <nav className="category-nav" aria-label="Todo categories">
            <button
              className={`category-link all-category${selectedCategory === 'all' ? ' is-current' : ''}`}
              type="button"
              aria-pressed={selectedCategory === 'all'}
              onClick={() => setSelectedCategory('all')}
            >
              <span className="category-symbol all-symbol" aria-hidden="true">◫</span>
              <span>All tasks</span>
              <span className="category-total">{allTodos.length}</span>
            </button>
            {categories.map((category) => (
              <button
                className={`category-link${selectedCategory === category.id ? ' is-current' : ''}`}
                key={category.id}
                type="button"
                aria-pressed={selectedCategory === category.id}
                onClick={() => {
                  setSelectedCategory(category.id)
                  setNewTodoCategory(category.id)
                }}
              >
                <span className={`category-symbol symbol-${category.color}`} aria-hidden="true">
                  {category.id === 'personal' ? '♡' : category.id === 'work' ? '↗' : category.id === 'study' ? '⌘' : '⌂'}
                </span>
                <span>{category.name}</span>
                <span className="category-total">{category.todos.length}</span>
              </button>
            ))}
          </nav>

          <div className="sidebar-note">
            <span className="note-mark" aria-hidden="true">✦</span>
            <p className="section-label">A SMALL REMINDER</p>
            <p>You don’t need to do it all at once. Start with one.</p>
          </div>
        </aside>

        <div className="todo-panel">
          <div className="panel-top">
            <div>
              <p className="section-label">{selectedCategory === 'all' ? 'YOUR OVERVIEW' : 'CATEGORY VIEW'}</p>
              <h2>{heading}{' '}<span className="heading-count">{selectedCategory === 'all' ? allTodos.length : categories.find((category) => category.id === selectedCategory)?.todos.length}</span></h2>
              <p className="panel-subtitle">
                {displayedActiveCount === 0
                  ? 'Everything is wrapped up. Enjoy the breathing room.'
                  : `${displayedActiveCount} ${displayedActiveCount === 1 ? 'thing' : 'things'} on your mind. Let’s take them one by one.`}
              </p>
            </div>
            <div className="progress-card">
              <span className="progress-ring" style={{ '--progress': `${allTodos.length ? (completedCount / allTodos.length) * 100 : 0}%` }}>
                <span>{allTodos.length ? Math.round((completedCount / allTodos.length) * 100) : 0}<small>%</small></span>
              </span>
              <span className="progress-label">COMPLETE</span>
            </div>
          </div>

          <form className="add-form" onSubmit={handleSubmit}>
            <span className="add-plus" aria-hidden="true">+</span>
            <label className="sr-only" htmlFor="new-todo">Add a task</label>
            <input
              id="new-todo"
              type="text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="What would you like to get done?"
              maxLength={120}
            />
            <label className="sr-only" htmlFor="todo-category">Choose a category</label>
            <select
              id="todo-category"
              value={newTodoCategory}
              onChange={(event) => {
                setNewTodoCategory(event.target.value)
                if (selectedCategory !== 'all') {
                  setSelectedCategory(event.target.value)
                }
              }}
              aria-label="Task category"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <button type="submit" disabled={!text.trim()}>Add task</button>
          </form>

          <div className="list-toolbar">
            <h3>Tasks <span>{visibleTodos.length}</span></h3>
            <div className="filter-tabs" role="group" aria-label="Filter tasks">
              {filters.map((name) => (
                <button
                  className={filter === name ? 'is-selected' : ''}
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
              {visibleTodos.map((todo) => {
                const category = categories.find((item) => item.id === todo.categoryId)
                return (
                  <li className={`todo-row${todo.completed ? ' is-complete' : ''}`} key={`${todo.categoryId}-${todo.id}`}>
                    <label className="todo-check">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => onToggleTodo(todo.categoryId, todo.id)}
                      />
                      <span className="checkmark" aria-hidden="true">
                        <svg viewBox="0 0 16 16"><path d="m3.5 8 3 3 6-6" /></svg>
                      </span>
                      <span className="todo-name">{todo.text}</span>
                    </label>
                    <span className={`todo-category tag-${category.color}`}>{category.name}</span>
                    <button
                      className="remove-button"
                      type="button"
                      aria-label={`Remove ${todo.text}`}
                      onClick={() => onRemoveTodo(todo.categoryId, todo.id)}
                    >
                      <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5 5 15" /></svg>
                    </button>
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="empty-state">
              <span aria-hidden="true">{filter === 'Completed' ? '✓' : '✳'}</span>
              <h3>{allTodos.length === 0 ? 'A fresh page.' : filter === 'Completed' ? 'Nothing completed yet.' : 'All caught up.'}</h3>
              <p>{allTodos.length === 0 ? 'Add a task above and choose where it belongs.' : 'Try another filter or enjoy a moment of calm.'}</p>
            </div>
          )}

          <footer className="panel-footer">
            <span>{activeCount} {activeCount === 1 ? 'task' : 'tasks'} left to do</span>
            <span><span className="footer-spark" aria-hidden="true">✦</span> Progress over perfection</span>
          </footer>
        </div>
      </section>

      <footer className="page-footer">
        <span>Make a little progress today.</span>
        <span>MADE FOR YOUR EVERYDAY <span aria-hidden="true">✳</span></span>
      </footer>
    </main>
  )
}

const mapStateToProps = (state) => ({
  categories: state.categories,
})

const mapDispatchToProps = {
  onAddTodo: addTodo,
  onToggleTodo: toggleTodo,
  onRemoveTodo: removeTodo,
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
