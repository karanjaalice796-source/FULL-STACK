import { useTasks } from '../context/TaskContext.jsx'

function TaskRow({ task, index }) {
  const { dispatch } = useTasks()

  return (
    <li className={`task-row${task.completed ? ' is-complete' : ''}`} style={{ '--row-index': index }}>
      <button
        className="complete-button"
        type="button"
        aria-label={task.completed ? `Mark ${task.text} incomplete` : `Complete ${task.text}`}
        aria-pressed={task.completed}
        onClick={() => dispatch({ type: 'COMPLETE_TASK', id: task.id })}
      >
        {task.completed ? '✓' : ''}
      </button>
      <span className="task-text">{task.text}</span>
      <button
        className="remove-button"
        type="button"
        aria-label={`Remove ${task.text}`}
        title="Remove task"
        onClick={() => dispatch({ type: 'REMOVE_TASK', id: task.id })}
      >
        ×
      </button>
    </li>
  )
}

export default function TaskList() {
  const { tasks } = useTasks()
  const completedCount = tasks.filter((task) => task.completed).length

  return (
    <section className="tasks-section" aria-labelledby="tasks-heading">
      <div className="tasks-heading">
        <div>
          <p className="section-label">YOUR BOARD <span>·</span> TODAY</p>
          <h2 id="tasks-heading">All tasks <span>{tasks.length}</span></h2>
        </div>
        <div className="completion-summary">
          <strong>{completedCount}</strong>
          <span>DONE</span>
        </div>
      </div>

      {tasks.length ? (
        <ul className="task-list">
          {tasks.map((task, index) => <TaskRow key={task.id} task={task} index={index} />)}
        </ul>
      ) : (
        <div className="empty-state">
          <span className="empty-mark" aria-hidden="true">○</span>
          <strong>No tasks on the board.</strong>
          <span>Add one above and start from there.</span>
        </div>
      )}

      <footer className="list-footer">
        <span><i /> {tasks.length - completedCount} left to do</span>
        <span>COMMONPLACE <b>·</b> 01</span>
      </footer>
    </section>
  )
}