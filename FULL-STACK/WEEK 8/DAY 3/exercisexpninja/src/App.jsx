import { useTasks } from './context/TaskContext.jsx'
import AddTask from './components/AddTask.jsx'
import TaskList from './components/TaskList.jsx'

export default function App() {
  const { tasks } = useTasks()
  const completedCount = tasks.filter((task) => task.completed).length
  const progress = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0

  return (
    <main className="app-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Commonplace home">
          <span className="brand-symbol"><span /></span>
          commonplace<span className="brand-period">.</span>
        </a>
        <span className="header-meta"><span /> A SMALL SPACE FOR BIG PLANS</span>
      </header>

      <section className="dashboard" id="top">
        <aside className="intro-panel">
          <p className="eyebrow"><span>01</span> / THE DAILY BOARD</p>
          <h1>Get it out<br />of your <em>head.</em></h1>
          <p className="intro-copy">A place for the next steps, loose ends, and everything you don't want to forget.</p>
          <div className="progress-panel">
            <div className="progress-topline"><span>BOARD PROGRESS</span><span>{progress}%</span></div>
            <div className="progress-track" role="progressbar" aria-label="Task completion" aria-valuemin="0" aria-valuemax={tasks.length} aria-valuenow={completedCount}>
              <span style={{ width: `${progress}%` }} />
            </div>
            <p>{completedCount} of {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} completed</p>
          </div>
          <div className="margin-note"><span /> KEEP THE NEXT STEP VISIBLE</div>
        </aside>

        <div className="task-workspace">
          <AddTask />
          <TaskList />
        </div>
      </section>

      <footer className="site-footer">
        <span>ONE STEP AT A TIME IS STILL FORWARD</span>
        <span>WRITE IT DOWN <i>↗</i></span>
      </footer>
    </main>
  )
}