import { useEffect, useRef, useState } from 'react'
import { useTasks } from './context/TaskContext.jsx'

const filters = [
  { id: 'all', label: 'All tasks' },
  { id: 'active', label: 'In progress' },
  { id: 'completed', label: 'Completed' },
]

function TaskItem({ task, index, onToggle, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef(null)
  const draftRef = useRef(task.text)

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [editing])

  function saveEdit() {
    const nextText = draftRef.current.trim()
    if (nextText) onEdit(task.id, nextText)
    else draftRef.current = task.text
    setEditing(false)
  }

  function cancelEdit() {
    draftRef.current = task.text
    setEditing(false)
  }

  return (
    <li className={`task-row${task.completed ? ' is-complete' : ''}`} style={{ '--row-index': index }}>
      <button
        className="task-check"
        type="button"
        aria-label={task.completed ? `Mark ${task.text} active` : `Complete ${task.text}`}
        onClick={() => onToggle(task.id)}
      >
        {task.completed ? '✓' : '○'}
      </button>

      {editing ? (
        <form
          className="edit-form"
          onSubmit={(event) => {
            event.preventDefault()
            saveEdit()
          }}
        >
          <input
            ref={inputRef}
            className="edit-input"
            defaultValue={task.text}
            aria-label="Edit task name"
            onChange={(event) => { draftRef.current = event.target.value }}
            onKeyDown={(event) => {
              if (event.key === 'Escape') cancelEdit()
            }}
          />
          <button className="icon-button save-edit" type="submit" aria-label="Save task">✓</button>
          <button className="icon-button" type="button" aria-label="Cancel editing" onClick={cancelEdit}>×</button>
        </form>
      ) : (
        <>
          <button className="task-name" type="button" onClick={() => setEditing(true)} title="Click to edit">
            {task.text}
          </button>
          <div className="task-actions">
            <button className="icon-button" type="button" aria-label={`Edit ${task.text}`} onClick={() => setEditing(true)} title="Edit task">✎</button>
            <button className="icon-button delete-button" type="button" aria-label={`Delete ${task.text}`} onClick={() => onDelete(task.id)} title="Delete task">×</button>
          </div>
        </>
      )}
    </li>
  )
}

export default function App() {
  const { tasks, filter, dispatch } = useTasks()
  const [newTask, setNewTask] = useState('')
  const addInputRef = useRef(null)
  const completedCount = tasks.filter((task) => task.completed).length
  const activeCount = tasks.length - completedCount
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed
    if (filter === 'completed') return task.completed
    return true
  })

  function addTask(event) {
    event.preventDefault()
    const text = newTask.trim()
    if (!text) {
      addInputRef.current?.focus()
      return
    }

    dispatch({ type: 'ADD_TASK', task: { id: crypto.randomUUID(), text, completed: false } })
    setNewTask('')
    addInputRef.current?.focus()
  }

  return (
    <main className="app-shell">
      <header className="masthead">
        <a className="brand" href="#top" aria-label="Daymark home">
          <span className="brand-mark"><span /></span>
          <span>daymark<span className="brand-period">.</span></span>
        </a>
        <div className="date-stamp"><span className="live-dot" /> PERSONAL WORKSPACE <span className="date-divider">/</span> TODAY</div>
      </header>

      <section className="workspace" id="top">
        <aside className="intro-column">
          <div className="section-index"><span>01</span> / YOUR DAY, IN VIEW</div>
          <h1>Make room<br />for <em>what matters.</em></h1>
          <p className="intro-copy">A clear list is a kind of momentum. Keep the next right thing close.</p>
          <div className="progress-block">
            <div className="progress-label"><span>DAILY PROGRESS</span><span>{tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0}%</span></div>
            <div className="progress-track" role="progressbar" aria-label="Tasks completed" aria-valuemin="0" aria-valuemax={tasks.length} aria-valuenow={completedCount}>
              <span style={{ width: `${tasks.length ? (completedCount / tasks.length) * 100 : 0}%` }} />
            </div>
            <p><strong>{completedCount}</strong> of {tasks.length} tasks finished</p>
          </div>
          <div className="side-note"><span className="note-rule" /> SMALL STEPS ADD UP <span className="note-spark">✳</span></div>
        </aside>

        <section className="task-panel" aria-labelledby="list-title">
          <div className="panel-heading">
            <div>
              <div className="panel-kicker"><span aria-hidden="true">▤</span> THE LIST</div>
              <h2 id="list-title">Today's tasks<span className="task-total">{tasks.length}</span></h2>
            </div>
            <button
              className="clear-button"
              type="button"
              disabled={completedCount === 0}
              onClick={() => dispatch({ type: 'CLEAR_COMPLETED' })}
            >
              Clear done <span className="clear-chevron" aria-hidden="true">⌄</span>
            </button>
          </div>

          <form className="add-form" onSubmit={addTask}>
            <label className="visually-hidden" htmlFor="new-task">Add a task</label>
            <input
              id="new-task"
              ref={addInputRef}
              value={newTask}
              onChange={(event) => setNewTask(event.target.value)}
              placeholder="What needs your attention?"
              maxLength={120}
            />
            <button className="add-button" type="submit" aria-label="Add task"><span aria-hidden="true">+</span><span>Add task</span></button>
          </form>

          <div className="list-toolbar">
            <div className="filter-tabs" role="group" aria-label="Filter tasks">
              {filters.map((item) => (
                <button
                  key={item.id}
                  className={`filter-tab${filter === item.id ? ' is-selected' : ''}`}
                  type="button"
                  aria-pressed={filter === item.id}
                  onClick={() => dispatch({ type: 'FILTER_TASKS', filter: item.id })}
                >
                  {item.label}
                  <span>{item.id === 'all' ? tasks.length : item.id === 'active' ? activeCount : completedCount}</span>
                </button>
              ))}
            </div>
            <span className="sort-label">MANUAL ORDER</span>
          </div>

          {filteredTasks.length > 0 ? (
            <ul className="task-list">
              {filteredTasks.map((task, index) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  index={index}
                  onToggle={(id) => dispatch({ type: 'TOGGLE_TASK', id })}
                  onEdit={(id, text) => dispatch({ type: 'EDIT_TASK', id, text })}
                  onDelete={(id) => dispatch({ type: 'DELETE_TASK', id })}
                />
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <span className="empty-icon" aria-hidden="true">✓</span>
              <strong>{filter === 'completed' ? 'Nothing completed just yet.' : filter === 'active' ? 'You’re all caught up.' : 'A clean slate.'}</strong>
              <span>{filter === 'all' ? 'Add a task above to get started.' : 'Try another view or add something new.'}</span>
            </div>
          )}

          <footer className="panel-footer">
            <span><span className="footer-dot" /> {activeCount} {activeCount === 1 ? 'task' : 'tasks'} left to focus on</span>
            <span>DAYMARK <i>·</i> 01</span>
          </footer>
        </section>
      </section>

      <footer className="page-footer"><span>AN INTENTIONAL LIST FOR AN UNINTERRUPTED DAY</span><span>KEEP GOING <i>↗</i></span></footer>
    </main>
  )
}