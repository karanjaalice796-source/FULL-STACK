import { Component } from 'react'
import './App.css'

const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function getClockTime() {
  const now = new Date()

  return {
    year: now.getFullYear(),
    month: now.getMonth(),
    weekday: now.getDay(),
    day: now.getDate(),
    hour: now.getHours(),
    minute: now.getMinutes(),
    second: now.getSeconds(),
  }
}

function twoDigits(value) {
  return String(value).padStart(2, '0')
}

export default class App extends Component {
  state = getClockTime()
  intervalId = null

  componentDidMount() {
    this.intervalId = window.setInterval(() => {
      this.setState(getClockTime())
    }, 1000)
  }

  componentWillUnmount() {
    window.clearInterval(this.intervalId)
  }

  render() {
    const { year, month, weekday, day, hour, minute, second } = this.state
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const monthProgress = day / daysInMonth
    const weekProgress = (((weekday + 6) % 7) + (hour * 3600 + minute * 60 + second) / 86400) / 7
    const weekOfMonth = Math.ceil(day / 7)
    const minuteProgress = (minute * 60 + second) / 3600
    const secondProgress = second / 60
    const rings = [
      { id: 'month', label: 'Month', value: `${Math.round(monthProgress * 100)}%`, progress: monthProgress, size: '96%', color: '#d8bd7b' },
      { id: 'week', label: 'Week', value: `${weekOfMonth} of ${Math.ceil(daysInMonth / 7)}`, progress: weekProgress, size: '78%', color: '#79a9ba' },
      { id: 'minute', label: 'Minute', value: `${twoDigits(minute)} min`, progress: minuteProgress, size: '60%', color: '#d98d72' },
      { id: 'second', label: 'Second', value: `${twoDigits(second)} sec`, progress: secondProgress, size: '42%', color: '#d7d6bd' },
    ]

    return (
      <main className="page-shell">
        <header className="masthead">
          <a className="brand" href="#clock" aria-label="Ora clock home">
            <span className="brand-mark" aria-hidden="true">O</span>
            <span>ORA<span className="brand-period">.</span></span>
          </a>
          <p className="masthead-note">A little time, kept beautifully</p>
          <span className="edition-mark">STUDIO N° 01</span>
        </header>

        <section className="intro" aria-labelledby="page-title">
          <p className="overline"><span /> A React clock / made to mark the moment</p>
          <h1 id="page-title">Time, in its<br /><em>own good time.</em></h1>
          <p className="intro-copy">
            Four gentle rings follow the month, the week, each minute, and every passing second.
          </p>
        </section>

        <section className="clock-layout" id="clock" aria-label="Current date and time">
          <div className="compass-wrap">
            <div className="compass">
              <div className="compass-inner">
                <span className="dial-north" aria-hidden="true">N</span>
                {rings.map((ring) => (
                  <div
                    key={ring.id}
                    className={`orbit-ring orbit-${ring.id}`}
                    aria-hidden="true"
                    style={{
                      '--ring-size': ring.size,
                      '--ring-sweep': `${ring.progress * 360}deg`,
                      '--ring-angle': `${ring.progress * 360}deg`,
                      '--ring-color': ring.color,
                    }}
                  >
                    <span className="orbit-pointer" />
                  </div>
                ))}
                <div className="dial-center">
                  <span className="dial-center-label">{weekdayNames[weekday]}</span>
                  <strong>{twoDigits(day)}</strong>
                  <span className="dial-center-date">{monthNames[month]} · {year}</span>
                  <span className="dial-center-flourish" aria-hidden="true">✳</span>
                </div>
              </div>
            </div>
            <p className="compass-caption"><span>FIG. 01</span> · FOUR SMALL WAYS TO MARK TIME</p>
            <div className="ring-legend" aria-label="Clock ring progress">
              {rings.map((ring) => (
                <div className="ring-legend-item" key={ring.id}>
                  <span className={`legend-dot legend-${ring.id}`} />
                  <span className="legend-name">{ring.label}</span>
                  <strong>{ring.value}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="time-card">
            <p className="overline"><span /> L’ORA ESATTA</p>
            <p className="time-display" aria-label={`${twoDigits(hour)} hours, ${twoDigits(minute)} minutes, ${twoDigits(second)} seconds`}>
              <span>{twoDigits(hour)}</span><i>:</i><span>{twoDigits(minute)}</span><i>:</i><span className="seconds">{twoDigits(second)}</span>
            </p>
            <div className="time-rule" />
            <p className="full-date">{weekdayNames[weekday]}, {monthNames[month]} {day}, {year}</p>
            <p className="time-note">Local time · updated every second</p>
            <div className="time-stamp" aria-hidden="true">
              <span>IL TEMPO</span>
              <strong>✳</strong>
              <span>È PREZIOSO</span>
            </div>
          </div>
        </section>

        <footer className="page-footer">
          <span>DESIGNED WITH A SENSE OF TIME</span>
          <span className="footer-center">ORA <i>·</i> CLOCK No. 001</span>
          <span>MADE IN THE MOMENT</span>
        </footer>
      </main>
    )
  }
}
