import { useEffect, useState } from 'react'
import './App.css'

const operators = {
  add: { symbol: '+', calculate: (first, second) => first + second },
  subtract: { symbol: '−', calculate: (first, second) => first - second },
  multiply: { symbol: '×', calculate: (first, second) => first * second },
  divide: { symbol: '÷', calculate: (first, second) => first / second },
}

const keypad = [
  { label: 'AC', action: 'clear', style: 'utility' },
  { label: '±', action: 'sign', style: 'utility' },
  { label: '%', action: 'percent', style: 'utility' },
  { label: '÷', action: 'divide', style: 'operator' },
  { label: '7', action: 'digit' },
  { label: '8', action: 'digit' },
  { label: '9', action: 'digit' },
  { label: '×', action: 'multiply', style: 'operator' },
  { label: '4', action: 'digit' },
  { label: '5', action: 'digit' },
  { label: '6', action: 'digit' },
  { label: '−', action: 'subtract', style: 'operator' },
  { label: '1', action: 'digit' },
  { label: '2', action: 'digit' },
  { label: '3', action: 'digit' },
  { label: '+', action: 'add', style: 'operator' },
  { label: '⌫', action: 'backspace', style: 'utility' },
  { label: '0', action: 'digit', style: 'zero' },
  { label: '.', action: 'decimal' },
  { label: '=', action: 'equals', style: 'equals' },
]

function formatResult(value) {
  if (!Number.isFinite(value)) {
    return String(value)
  }

  return String(Number(value.toPrecision(11)))
}

function App() {
  const [display, setDisplay] = useState('0')
  const [storedValue, setStoredValue] = useState(null)
  const [pendingOperation, setPendingOperation] = useState(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [justCalculated, setJustCalculated] = useState(false)
  const [error, setError] = useState('')

  function clearCalculator() {
    setDisplay('0')
    setStoredValue(null)
    setPendingOperation(null)
    setWaitingForOperand(false)
    setJustCalculated(false)
    setError('')
  }

  function enterDigit(digit) {
    setError('')
    if (waitingForOperand || justCalculated) {
      setDisplay(digit)
      setWaitingForOperand(false)
      setJustCalculated(false)
      return
    }

    setDisplay((current) => current === '0' ? digit : current.length < 14 ? current + digit : current)
  }

  function enterDecimal() {
    setError('')
    if (waitingForOperand || justCalculated) {
      setDisplay('0.')
      setWaitingForOperand(false)
      setJustCalculated(false)
      return
    }

    setDisplay((current) => current.includes('.') ? current : `${current}.`)
  }

  function calculate(first, second, operation) {
    if (operation === 'divide' && second === 0) {
      setError('Cannot divide by zero')
      setDisplay('Error')
      setStoredValue(null)
      setPendingOperation(null)
      setWaitingForOperand(true)
      return null
    }

    return operators[operation].calculate(first, second)
  }

  function chooseOperation(operation) {
    if (error) {
      return
    }

    const currentValue = Number(display)
    if (pendingOperation && storedValue !== null && !waitingForOperand) {
      const result = calculate(storedValue, currentValue, pendingOperation)
      if (result === null) {
        return
      }
      setDisplay(formatResult(result))
      setStoredValue(result)
    } else {
      setStoredValue(currentValue)
    }

    setPendingOperation(operation)
    setWaitingForOperand(true)
    setJustCalculated(false)
  }

  function calculateResult() {
    if (!pendingOperation || storedValue === null || waitingForOperand || error) {
      return
    }

    const result = calculate(storedValue, Number(display), pendingOperation)
    if (result === null) {
      return
    }

    setDisplay(formatResult(result))
    setStoredValue(null)
    setPendingOperation(null)
    setWaitingForOperand(true)
    setJustCalculated(true)
  }

  function performAction(action, label) {
    if (/^\d$/.test(label)) {
      enterDigit(label)
      return
    }

    if (action in operators) {
      chooseOperation(action)
      return
    }

    if (action === 'decimal') {
      enterDecimal()
    } else if (action === 'clear') {
      clearCalculator()
    } else if (action === 'equals') {
      calculateResult()
    } else if (action === 'sign' && !error) {
      setDisplay((current) => current === '0' ? current : current.startsWith('-') ? current.slice(1) : `-${current}`)
    } else if (action === 'percent' && !error) {
      setDisplay((current) => formatResult(Number(current) / 100))
    } else if (action === 'backspace' && !error) {
      setDisplay((current) => current.length > 1 ? current.slice(0, -1) : '0')
    }
  }

  useEffect(() => {
    function handleKeyDown(event) {
      const { key } = event
      if (/^\d$/.test(key)) {
        enterDigit(key)
      } else if (key === '.') {
        enterDecimal()
      } else if (key === '+') {
        chooseOperation('add')
      } else if (key === '-') {
        chooseOperation('subtract')
      } else if (key === '*') {
        chooseOperation('multiply')
      } else if (key === '/') {
        event.preventDefault()
        chooseOperation('divide')
      } else if (key === 'Enter' || key === '=') {
        calculateResult()
      } else if (key === 'Backspace') {
        performAction('backspace', '')
      } else if (key === 'Escape') {
        clearCalculator()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  })

  const expression = pendingOperation && storedValue !== null
    ? `${formatResult(storedValue)} ${operators[pendingOperation].symbol}`
    : 'Ready when you are'

  return (
    <main className="page">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Everyday Calculator home">
          <span className="brand-icon" aria-hidden="true">+</span>
          <span>everyday<span className="brand-light"> calc</span></span>
        </a>
        <span className="topbar-label">SIMPLE THINGS, SUMMED UP</span>
      </header>

      <section className="calculator-section" aria-label="Calculator">
        <div className="calculator">
          <div className="calculator-top">
            <div className="display" aria-live="polite" aria-atomic="true">
              <p className="expression">{error || expression}</p>
              <output className="display-value" aria-label="Current value">
                {display}
              </output>
            </div>
          </div>

          <div className="keypad" aria-label="Calculator keys">
            {keypad.map((key) => (
              <button
                className={`key ${key.style || 'number'}${key.action === pendingOperation ? ' selected' : ''}`}
                type="button"
                key={key.label}
                onClick={() => performAction(key.action, key.label)}
                aria-label={key.action === 'backspace' ? 'Backspace' : key.label}
              >
                {key.label}
              </button>
            ))}
          </div>
          <p className="keyboard-hint">Tip: your keyboard works here too</p>
        </div>
      </section>

      <footer className="footer">
        <span>MADE FOR THE CURIOUS</span>
        <span>GOOD THINGS ADD UP</span>
      </footer>
    </main>
  )
}

export default App
