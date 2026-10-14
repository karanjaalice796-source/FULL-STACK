import { useState } from 'react'
import Calendar from './components/Calendar.jsx'
import TaskList from './components/TaskList.jsx'
import { fromDayKey, toDayKey } from './utils/dates.js'
import './App.css'

function App() {
  const [selectedDay, setSelectedDay] = useState(() => toDayKey(new Date()))
  const selectedDate = fromDayKey(selectedDay)
  const todayKey = toDayKey(new Date())
  const dateLabel = new Intl.DateTimeFormat('en', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(selectedDate)

  function moveDay(amount) {
    const nextDate = fromDayKey(selectedDay)
    nextDate.setDate(nextDate.getDate() + amount)
    setSelectedDay(toDayKey(nextDate))
  }

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
          <span className="topbar-date">{new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(new Date())}</span>
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
          <Calendar selectedDay={selectedDay} onSelectDay={setSelectedDay} />
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
              <h2>{dateLabel}<span className="day-year">, {selectedDate.getFullYear()}</span></h2>
            </div>
            <div className="day-navigation" aria-label="Navigate days">
              <button type="button" aria-label="Previous day" onClick={() => moveDay(-1)}>‹</button>
              <button type="button" aria-label="Next day" onClick={() => moveDay(1)}>›</button>
            </div>
          </div>
          <TaskList day={selectedDay} />
        </div>
      </section>

      <footer className="page-footer">
        <span>Take a breath. You’re right on time.</span>
        <span>MADE FOR YOUR EVERYDAY <span aria-hidden="true">✳</span></span>
      </footer>
    </main>
  )
}

export default App
