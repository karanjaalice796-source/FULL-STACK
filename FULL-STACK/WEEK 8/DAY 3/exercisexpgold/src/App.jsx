import { useReducer, useRef, useState } from 'react'

function todoReducer(todos, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [action.todo, ...todos]
    case 'REMOVE_TODO':
      return todos.filter((todo) => todo.id !== action.id)
    default:
      return todos
  }
}

export default function App() {
  const [todos, dispatch] = useReducer(todoReducer, [])
  const [newTodo, setNewTodo] = useState('')
  const inputRef = useRef(null)

  function addTodo(event) {
    event.preventDefault()
    const text = newTodo.trim()

    if (!text) {
      inputRef.current?.focus()
      return
    }

    dispatch({
      type: 'ADD_TODO',
      todo: { id: crypto.randomUUID(), text },
    })
    setNewTodo('')
    inputRef.current?.focus()
  }

  return (
    <main className="page">
      <header className="topbar">
        <a className="wordmark" href="#home" aria-label="Little List home">
          <span className="wordmark-icon"><span /></span>
          little list<span className="wordmark-dot">.</span>
        </a>
        <span className="topbar-note"><span className="status-dot" /> YOUR PERSONAL CHECKLIST</span>
      </header>

      <section className="todo-layout" id="home">
        <aside className="intro">
          <p className="eyebrow"><span>01</span> / MAKE A LITTLE SPACE</p>
          <h1>One thing<br />at a <em>time.</em></h1>
          <p className="intro-copy">Gather the small things here. Clear a little room to think.</p>
          <div className="list-count">
            <span className="count-number">{String(todos.length).padStart(2, '0')}</span>
            <span className="count-label">{todos.length === 1 ? 'THING ON YOUR LIST' : 'THINGS ON YOUR LIST'}</span>
          </div>
          <p className="aside-note"><span /> A GOOD PLACE TO BEGIN</p>
        </aside>

        <section className="todo-board" aria-labelledby="todo-heading">
          <div className="board-heading">
            <div>
              <p className="board-kicker">YOUR CHECKLIST <span>·</span> TODAY</p>
              <h2 id="todo-heading">To do <span>{todos.length}</span></h2>
            </div>
            <span className="board-mark" aria-hidden="true">✳</span>
          </div>

          <form className="add-form" onSubmit={addTodo}>
            <label className="visually-hidden" htmlFor="new-todo">Add a todo item</label>
            <input
              ref={inputRef}
              id="new-todo"
              value={newTodo}
              onChange={(event) => setNewTodo(event.target.value)}
              placeholder="Write something to remember..."
              maxLength={120}
            />
            <button type="submit" aria-label="Add todo"><span aria-hidden="true">+</span><span>Add</span></button>
          </form>

          {todos.length > 0 ? (
            <ul className="todo-list">
              {todos.map((todo, index) => (
                <li className="todo-item" key={todo.id} style={{ '--item-index': index }}>
                  <span className="todo-bullet" aria-hidden="true" />
                  <span className="todo-text">{todo.text}</span>
                  <button
                    className="remove-button"
                    type="button"
                    aria-label={`Remove ${todo.text}`}
                    title="Remove todo"
                    onClick={() => dispatch({ type: 'REMOVE_TODO', id: todo.id })}
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <span className="empty-symbol" aria-hidden="true">＋</span>
              <strong>A little room to begin.</strong>
              <span>Your list is clear. Add your first todo above.</span>
            </div>
          )}

          <footer className="board-footer">
            <span><span className="footer-dot" /> {todos.length ? `${todos.length} ${todos.length === 1 ? 'item' : 'items'} to get through` : 'Ready when you are'}</span>
            <span>LITTLE LIST <i>·</i> 01</span>
          </footer>
        </section>
      </section>

      <footer className="page-footer">
        <span>SMALL STEPS STILL MOVE YOU FORWARD</span>
        <span>KEEP IT SIMPLE <i>↗</i></span>
      </footer>
    </main>
  )
}