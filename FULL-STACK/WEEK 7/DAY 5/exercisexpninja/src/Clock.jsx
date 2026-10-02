import { useEffect, useState } from 'react'

function Clock() {
  const [currentDate, setCurrentDate] = useState(() => new Date())

  function tick() {
    setCurrentDate(new Date())
  }

  useEffect(() => {
    const intervalId = window.setInterval(tick, 1000)

    return () => window.clearInterval(intervalId)
  }, [])

  return (
    <section className="ninja-panel clock-panel" aria-labelledby="clock-title">
      <p className="ninja-kicker">Local time</p>
      <h2 id="clock-title">Live clock</h2>
      <time className="clock-time" dateTime={currentDate.toISOString()}>
        {currentDate.toLocaleTimeString()}
      </time>
      <p className="clock-date">
        {currentDate.toLocaleDateString(undefined, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>
    </section>
  )
}

export default Clock
