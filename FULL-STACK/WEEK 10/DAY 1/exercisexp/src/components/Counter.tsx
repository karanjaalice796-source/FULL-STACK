import { useState } from 'react'

type CounterAction = 'incremented' | 'decremented' | 'reset'

export default function Counter() {
  const [count, setCount] = useState<number>(0)
  const [lastAction, setLastAction] = useState<CounterAction | null>(null)

  const increment = () => {
    setCount((currentCount) => currentCount + 1)
    setLastAction('incremented')
  }

  const decrement = () => {
    setCount((currentCount) => currentCount - 1)
    setLastAction('decremented')
  }

  const reset = () => {
    setCount(0)
    setLastAction('reset')
  }

  return (
    <div className="counter-preview">
      <div className="counter-display" aria-live="polite">{count}</div>
      <div className="counter-controls" aria-label="Counter controls">
        <button className="counter-button counter-secondary" type="button" onClick={decrement} aria-label="Decrement counter">−</button>
        <button className="counter-button counter-primary" type="button" onClick={increment}>Add one <span aria-hidden="true">＋</span></button>
        <button className="counter-button counter-secondary" type="button" onClick={reset}>Reset</button>
      </div>
      <p className="counter-status" aria-live="polite">
        {lastAction ? `Last action: ${lastAction}` : 'Tap a button to update state'}
      </p>
    </div>
  )
}
