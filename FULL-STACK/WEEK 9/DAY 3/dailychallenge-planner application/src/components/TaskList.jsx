import { useSelector } from 'react-redux'
import AddTask from './AddTask.jsx'
import DeleteTask from './DeleteTask.jsx'
import EditTask from './EditTask.jsx'

function TaskList({ day }) {
  const tasks = useSelector((state) => state.tasksByDay[day] ?? [])
  const sortedTasks = [...tasks].sort((first, second) =>
    first.time.localeCompare(second.time),
  )

  return (
    <section className="tasks-card" aria-labelledby="tasks-heading">
      <div className="tasks-heading">
        <div>
          <p className="section-kicker">YOUR SCHEDULE</p>
          <h2 id="tasks-heading">The day, at your pace.</h2>
        </div>
        <AddTask day={day} />
      </div>

      {sortedTasks.length > 0 ? (
        <ul className="task-list">
          {sortedTasks.map((task) => (
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
                <EditTask day={day} task={task} />
                <DeleteTask day={day} task={task} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-day">
          <div className="empty-sun" aria-hidden="true">☼</div>
          <h3>A little space in your day.</h3>
          <p>Make a plan, or leave it open. Your day is yours.</p>
          <AddTask day={day} buttonClass="empty-add-button" label="Plan something" showPlus={false} />
        </div>
      )}

      <div className="task-summary">
        <span><strong>{tasks.length}</strong> {tasks.length === 1 ? 'plan' : 'plans'} for this day</span>
        <span>One step at a time <span aria-hidden="true">↗</span></span>
      </div>
    </section>
  )
}

export default TaskList
