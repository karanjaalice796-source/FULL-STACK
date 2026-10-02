import { useState } from 'react'

function Events() {
  const [isToggleOn, setIsToggleOn] = useState(true)

  const clickMe = () => window.alert('I was clicked')

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      window.alert(event.currentTarget.value)
    }
  }

  const toggle = () => setIsToggleOn((currentValue) => !currentValue)

  return (
    <div className="component-output event-output">
      <div className="event-row">
        <button className="button button-dark" type="button" onClick={clickMe}>Click me</button>
        <label className="input-field">
          <span>Press Enter to send</span>
          <input type="text" onKeyDown={handleKeyDown} placeholder="Type a message" />
        </label>
      </div>
      <div className="toggle-row">
        <span>Toggle state</span>
        <button
          className={`toggle-button ${isToggleOn ? 'is-on' : ''}`}
          type="button"
          onClick={toggle}
          aria-pressed={isToggleOn}
        >
          <span className="toggle-knob" />
          <span>{isToggleOn ? 'ON' : 'OFF'}</span>
        </button>
      </div>
    </div>
  )
}

export default Events