import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { addTask, deleteTask, editTask } from './redux/actions.js'
import './App.css'

const weekdayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const fullWeekdayNames = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const categories = ['Personal', 'Work', 'Health', 'Study']

function toDayKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function fromDayKey(dayKey) {
  const [year, month, day] = dayKey.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function Calendar({ selectedDay, taskCounts, onSelectDay }) {
  const selectedDate = fromDayKey(selectedDay)
  const [month, setMonth] = useState(
    () => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
  )

  useEffect(() => {
    setMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1))
  }, [selectedDay])

  const firstDayOffset = (month.getDay() + 6) % 7
  const daysInMonth = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0,
  ).getDate()
  const cellCount = Math.ceil((firstDayOffset + daysInMonth) / 7) * 7
  const cells = Array.from({ length: cellCount }, (_, index) => {
    const dayNumber = index - firstDayOffset + 1
    if (dayNumber < 1 || dayNumber > daysInMonth) return null
    return toDayKey(new Date(month.getFullYear(), month.getMonth(), dayNumber))
  })

  function changeMonth(amount) {
    setMonth((currentMonth) => new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + amount,
      1,
    ))
  }

  return (
    <section className="calendar-card" aria-label="Choose a day">
      <div className="calendar-heading">
        <div>
          <p className="section-kicker">YOUR CALENDAR</p>
          <h2>{monthNames[month.getMonth()]} <span>{month.getFullYear()}</span></h2>
        </div>
        <div className="month-controls">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => changeMonth(-1)}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => changeMonth(1)}
          >
            ›
          </button>
        </div>
      </div>

      <div className="calendar-grid calendar-weekdays" aria-hidden="true">
        {weekdayNames.map((name) => <span key={name}>{name}</span>)}
      </div>
      <div className="calendar-grid calendar-days">
        {cells.map((dayKey, index) => {
          if (!dayKey) return <span className="calendar-blank" key={`blank-${index}`} />
          const date = fromDayKey(dayKey)
          const isSelected = dayKey === selectedDay
          const hasTasks = Boolean(taskCounts[dayKey])
          return (
            <button
              className={`calendar-day${isSelected ? ' is-selected' : ''}${hasTasks ? ' has-tasks' : ''}`}
              key={dayKey}
              type="button"
              aria-label={`${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}${hasTasks ? `, ${taskCounts[dayKey]} tasks` : ''}`}
              aria-pressed={isSelected}
              onClick={() => onSelectDay(dayKey)}
            >
              {date.getDate()}
              {hasTasks && <span className="day-dot" aria-hidden="true" />}
            </button>
          )
        })}
      </div>

      <div className="calendar-legend">
        <span className="legend-dot" />
        <span>Days with plans</span>
      </div>
    </section>
  )
}

const CalendarWithState = connect((state) => ({
  taskCounts: Object.fromEntries(
    Object.entries(state.tasksByDay).map(([day, tasks]) => [day, tasks.length]),
  ),
}))(Calendar)

function TaskList({ day, tasks, onEdit, onDelete, onAdd }) {
  const formattedTasks = [...tasks].sort((first, second) =>
    first.time.localeCompare(second.time),
  )

  return (
    <section className="tasks-card" aria-labelledby="tasks-heading">
      <div className="tasks-heading">
        <div>
          <p className="section-kicker">YOUR SCHEDULE</p>
          <h2 id="tasks-heading">The day, at your pace.</h2>
        </div>
        <button className="add-task-button" type="button" onClick={onAdd}>
          <span aria-hidden="true">+</span>
          Add a task
        </button>
      </div>

      {formattedTasks.length > 0 ? (
        <ul className="task-list">
          {formattedTasks.map((task) => (
            <li className="task-row" key={task.id}>
              <time className="task-time" dateTime={task.time}>{task.time}</time>
              <span className={`task-marker marker-${task.category.toLowerCase()}`} aria-hidden="true" />
              <div className="task-details">
                <h3>{task.title}</h3>
                {task.notes && <p>{task.notes}</p>}
                <span className={`category-pill category-${task.category.toLowerCase()}`}>
                  {task.category}
                </span>
              </div>
              <div className="task-actions">
                <button
                  className="icon-button"
                  type="button"
                  aria-label={`Edit ${task.title}`}
                  onClick={() => onEdit(task)}
                >
                  <svg viewBox="0 0 20 20" aria-hidden="true">
                    <path d="m12.9 4.1 3 3M4 16l3.2-.7L16 6.5a1.4 1.4 0 0 0-2-2l-8.8 8.8L4 16Z" />
                  </svg>
                </button>
                <button
                  className="icon-button delete-button"
                  type="button"
                  aria-label={`Delete ${task.title}`}
                  onClick={() => onDelete(task.id)}
                >
                  <svg viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M5 6h10M8 6V4h4v2m-6 0 .7 10h6.6L14 6m-4 3v4m2-4v4" />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-day">
          <div className="empty-sun" aria-hidden="true">☼</div>
          <h3>A little space in your day.</h3>
          <p>Make a plan, or leave it open. Your day is yours.</p>
          <button type="button" onClick={onAdd}>Plan something</button>
        </div>
      )}

      <div className="task-summary">
        <span><strong>{tasks.length}</strong> {tasks.length === 1 ? 'plan' : 'plans'} for this day</span>
        <span>One step at a time <span aria-hidden="true">↗</span></span>
      </div>
    </section>
  )
}

const TaskListWithState = connect(
  (state, ownProps) => ({
    tasks: state.tasksByDay[ownProps.day] ?? [],
  }),
  (dispatch, ownProps) => ({
    onDelete: (taskId) => dispatch(deleteTask(ownProps.day, taskId)),
  }),
)(TaskList)

function TaskDialog({ day, task, onClose, onAddTask, onEditTask }) {
  const [title, setTitle] = useState(task?.title ?? '')
  const [time, setTime] = useState(task?.time ?? '09:00')
  const [category, setCategory] = useState(task?.category ?? 'Personal')
  const [notes, setNotes] = useState(task?.notes ?? '')
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      setError('Give your task a name before saving.')
      return
    }

    const taskDetails = {
      title: trimmedTitle,
      time,
      category,
      notes: notes.trim(),
    }
    if (task) onEditTask(day, task.id, taskDetails)
    else onAddTask(day, taskDetails)
    onClose()
  }

  return (
    <div
      className="dialog-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        className="task-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <div className="dialog-heading">
          <div>
            <p className="section-kicker">{task ? 'MAKE A CHANGE' : 'MAKE A PLAN'}</p>
            <h2 id="dialog-title">{task ? 'Edit your task' : 'Add to your day'}</h2>
          </div>
          <button className="dialog-close" type="button" aria-label="Close dialog" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="field-label" htmlFor="task-title">Task name</label>
          <input
            autoFocus
            id="task-title"
            className="text-field"
            type="text"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value)
              if (error) setError('')
            }}
            placeholder="e.g. Morning walk"
            maxLength={100}
            required
          />
          {error && <p className="form-error" role="alert">{error}</p>}

          <div className="field-row">
            <div>
              <label className="field-label" htmlFor="task-time">Time</label>
              <input
                id="task-time"
                className="text-field"
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
                required
              />
            </div>
            <div>
              <label className="field-label" htmlFor="task-category">Category</label>
              <select
                id="task-category"
                className="text-field"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {categories.map((name) => <option key={name}>{name}</option>)}
              </select>
            </div>
          </div>

          <label className="field-label" htmlFor="task-notes">
            Notes <span>Optional</span>
          </label>
          <textarea
            id="task-notes"
            className="text-field notes-field"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Anything you want to remember?"
            maxLength={300}
            rows={3}
          />

          <div className="dialog-actions">
            <button className="cancel-button" type="button" onClick={onClose}>Cancel</button>
            <button className="save-button" type="submit">{task ? 'Save changes' : 'Add to day'}</button>
          </div>
        </form>
      </section>
    </div>
  )
}

function Planner({ onAddTask, onEditTask }) {
  const [selectedDay, setSelectedDay] = useState(() => toDayKey(new Date()))
  const [dialogTask, setDialogTask] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const selectedDate = fromDayKey(selectedDay)
  const todayKey = toDayKey(new Date())
  const dayLabel = `${fullWeekdayNames[selectedDate.getDay()]}, ${monthNames[selectedDate.getMonth()]} ${selectedDate.getDate()}`

  function openAddDialog() {
    setDialogTask(null)
    setIsDialogOpen(true)
  }

  function openEditDialog(task) {
    setDialogTask(task)
    setIsDialogOpen(true)
  }

  function moveDay(amount) {
    const nextDate = fromDayKey(selectedDay)
    nextDate.setDate(nextDate.getDate() + amount)
    setSelectedDay(toDayKey(nextDate))
  }

  useEffect(() => {
    if (!isDialogOpen) return undefined
    function closeOnEscape(event) {
      if (event.key === 'Escape') setIsDialogOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [isDialogOpen])

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Daylight planner home">
          <span className="brand-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></svg>
          </span>
          <span>daylight<span className="brand-period">.</span></span>
        </a>
        <div className="topbar-right">
          <span className="topbar-date">{monthNames[new Date().getMonth()]} {new Date().getFullYear()}</span>
          <span className="profile-avatar" aria-label="Your planner">Y</span>
        </div>
      </header>

      <section className="welcome-row">
        <div>
          <p className="welcome-kicker">A CLEARER KIND OF BUSY</p>
          <h1>Your days, with a little more <em>intention.</em></h1>
          <p className="welcome-copy">A place to put it all down, so you can focus on what’s here.</p>
        </div>
        <button className="today-button" type="button" onClick={() => setSelectedDay(todayKey)}>
          <span aria-hidden="true">⌖</span> Back to today
        </button>
      </section>

      <section className="planner-layout" aria-label="Daily planner">
        <aside className="sidebar">
          <CalendarWithState selectedDay={selectedDay} onSelectDay={setSelectedDay} />
          <div className="focus-note">
            <span className="note-sparkle" aria-hidden="true">✳</span>
            <p className="section-kicker">A GENTLE REMINDER</p>
            <p>You don’t have to do it all today. Just the next thing.</p>
          </div>
        </aside>

        <div className="day-column">
          <div className="day-heading">
            <div>
              <p className="section-kicker">{selectedDay === todayKey ? 'TODAY IS YOURS' : 'YOUR SELECTED DAY'}</p>
              <h2>{dayLabel}<span className="day-year">, {selectedDate.getFullYear()}</span></h2>
            </div>
            <div className="day-navigation" aria-label="Navigate days">
              <button type="button" aria-label="Previous day" onClick={() => moveDay(-1)}>‹</button>
              <button type="button" aria-label="Next day" onClick={() => moveDay(1)}>›</button>
            </div>
          </div>

          <TaskListWithState
            day={selectedDay}
            onAdd={openAddDialog}
            onEdit={openEditDialog}
          />
        </div>
      </section>

      <footer className="page-footer">
        <span>Take a breath. You’re right on time.</span>
        <span>MADE FOR YOUR EVERYDAY <span aria-hidden="true">✳</span></span>
      </footer>

      {isDialogOpen && (
        <TaskDialog
          day={selectedDay}
          task={dialogTask}
          onClose={() => setIsDialogOpen(false)}
          onAddTask={onAddTask}
          onEditTask={onEditTask}
        />
      )}
    </main>
  )
}

const mapDispatchToProps = {
  onAddTask: addTask,
  onEditTask: editTask,
}

export default connect(null, mapDispatchToProps)(Planner)
