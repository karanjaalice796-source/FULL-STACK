import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { fromDayKey, toDayKey } from '../utils/dates.js'

const weekdayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function Calendar({ selectedDay, onSelectDay }) {
  const tasksByDay = useSelector((state) => state.tasksByDay)
  const selectedDate = fromDayKey(selectedDay)
  const [month, setMonth] = useState(
    () => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
  )

  useEffect(() => {
    setMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1))
  }, [selectedDay])

  const firstDayOffset = (month.getDay() + 6) % 7
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
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
          <button type="button" aria-label="Previous month" onClick={() => changeMonth(-1)}>‹</button>
          <button type="button" aria-label="Next month" onClick={() => changeMonth(1)}>›</button>
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
          const hasTasks = Boolean(tasksByDay[dayKey]?.length)
          return (
            <button
              className={`calendar-day${isSelected ? ' is-selected' : ''}${hasTasks ? ' has-tasks' : ''}`}
              key={dayKey}
              type="button"
              aria-label={`${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}${hasTasks ? `, ${tasksByDay[dayKey].length} tasks` : ''}`}
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

export default Calendar
