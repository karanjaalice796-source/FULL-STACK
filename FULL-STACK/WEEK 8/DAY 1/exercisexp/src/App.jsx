import { Component } from 'react'
import ErrorBoundary from './ErrorBoundary.jsx'
import './App.css'

const lessons = [
  { id: 'errors', number: '01', title: 'Error boundaries', tag: 'CATCH + RECOVER' },
  { id: 'updating', number: '02', title: 'Updating', tag: 'STATE + LIFECYCLE' },
  { id: 'unmounting', number: '03', title: 'Unmounting', tag: 'CLEANUP' },
]

class BuggyCounter extends Component {
  state = { counter: 0 }

  handleClick = () => {
    this.setState(({ counter }) => ({ counter: counter + 1 }))
  }

  render() {
    if (this.state.counter >= 5) {
      throw new Error('I crashed!')
    }

    return (
      <button className="counter-button" onClick={this.handleClick}>
        <span className="counter-label">BuggyCounter</span>
        <span className="counter-value">{this.state.counter}</span>
        <span className="counter-hint">click to count</span>
      </button>
    )
  }
}

class LifecycleColor extends Component {
  state = { favoriteColor: 'red' }
  timer = null

  componentDidMount() {
    this.timer = window.setTimeout(() => {
      this.setState({ favoriteColor: 'yellow' })
    }, 1800)
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.allowUpdates
  }

  getSnapshotBeforeUpdate() {
    console.log('in getSnapshotBeforeUpdate')
    return null
  }

  componentDidUpdate() {
    console.log('after update')
  }

  componentWillUnmount() {
    window.clearTimeout(this.timer)
  }

  render() {
    return (
      <div className="color-demo">
        <div className={`color-swatch swatch-${this.state.favoriteColor}`}>
          <span className="swatch-dot" />
          <span className="swatch-name">{this.state.favoriteColor}</span>
        </div>
        <p className="color-caption">Favorite color</p>
        <button className="action-button" onClick={() => this.setState({ favoriteColor: 'blue' })}>
          Change to blue <span aria-hidden="true">↗</span>
        </button>
      </div>
    )
  }
}

class Child extends Component {
  componentWillUnmount() {
    window.alert('Child component has unmounted.')
  }

  render() {
    return <h3 className="hello-child">Hello World!</h3>
  }
}

export default class App extends Component {
  state = {
    activeLesson: 'errors',
    simulation: 'shared',
    allowUpdates: true,
    show: true,
  }

  renderErrorLesson() {
    const { simulation } = this.state

    return (
      <>
        <div className="simulation-switch" role="group" aria-label="Choose an error boundary simulation">
          <button className={simulation === 'shared' ? 'selected' : ''} onClick={() => this.setState({ simulation: 'shared' })}>
            Shared boundary
          </button>
          <button className={simulation === 'separate' ? 'selected' : ''} onClick={() => this.setState({ simulation: 'separate' })}>
            Separate boundaries
          </button>
          <button className={simulation === 'none' ? 'selected' : ''} onClick={() => this.setState({ simulation: 'none' })}>
            No boundary
          </button>
        </div>

        <div className="simulation-note">
          {simulation === 'shared' && 'One boundary owns both counters. When either crashes, both are replaced.'}
          {simulation === 'separate' && 'Each counter has its own boundary, so one failure leaves the other running.'}
          {simulation === 'none' && 'No boundary catches this error. Reaching five will unmount the app; reload to reset.'}
        </div>

        <div className="counter-stage">
          {simulation === 'shared' && (
            <ErrorBoundary>
              <div className="counter-pair"><BuggyCounter /><BuggyCounter /></div>
            </ErrorBoundary>
          )}
          {simulation === 'separate' && (
            <div className="counter-pair">
              <ErrorBoundary><BuggyCounter /></ErrorBoundary>
              <ErrorBoundary><BuggyCounter /></ErrorBoundary>
            </div>
          )}
          {simulation === 'none' && <BuggyCounter />}
        </div>
      </>
    )
  }

  renderLifecycleLesson(includeUnmounting = false) {
    const { allowUpdates, show } = this.state

    return (
      <>
        <div className="lifecycle-layout">
          <div className="lifecycle-copy">
            <p className="eyebrow">Mount → update → inspect</p>
            <h3>A color with a timeline.</h3>
            <p>It mounts red, then changes to yellow after a short timer. Trigger another update to blue and watch the lifecycle hooks in the console.</p>
            <div className="update-controls" role="group" aria-label="shouldComponentUpdate setting">
              <span>shouldComponentUpdate</span>
              <button className={allowUpdates ? 'choice-active' : ''} onClick={() => this.setState({ allowUpdates: true })}>true</button>
              <button className={!allowUpdates ? 'choice-active' : ''} onClick={() => this.setState({ allowUpdates: false })}>false</button>
            </div>
          </div>
          <LifecycleColor allowUpdates={allowUpdates} key="lifecycle-color" />
        </div>

        {includeUnmounting && (
          <div className="unmount-panel">
            <div className="unmount-heading">
              <div><p className="eyebrow">Unmounting phase</p><h3>Remove a child</h3></div>
              <button className="delete-button" onClick={() => this.setState({ show: false })} disabled={!show}>
                <span aria-hidden="true">×</span> Delete
              </button>
            </div>
            <div className="child-slot">{show ? <Child /> : <p className="removed-message">Child removed from the tree.</p>}</div>
          </div>
        )}
      </>
    )
  }

  render() {
    const { activeLesson } = this.state
    const active = lessons.find((lesson) => lesson.id === activeLesson)

    return (
      <main className="lab-shell">
        <header className="topbar">
          <a className="wordmark" href="#top" aria-label="React Lifecycle Lab home"><span className="mark">R</span><span>FIELDNOTES<span className="wordmark-slash"> / </span>REACT</span></a>
          <div className="topbar-right"><span className="live-dot" /> INTERACTIVE WORKBOOK <span className="edition">WEEK 08 · DAY 01</span></div>
        </header>

        <section className="intro-block" id="top">
          <div className="intro-copy">
            <p className="eyebrow">React fundamentals / lab 08.01</p>
            <h1>What happens<br /><em>when things change?</em></h1>
            <p className="intro-description">Three small experiments in component lifecycles, event handling, and recovering from errors.</p>
          </div>
          <div className="intro-stamp" aria-hidden="true"><span>CLASS</span><b>↻</b><span>COMPONENTS</span></div>
        </section>

        <div className="lesson-workspace">
          <nav className="lesson-nav" aria-label="Exercises">
            <p className="nav-label">EXERCISES <span>03</span></p>
            {lessons.map((lesson) => (
              <button key={lesson.id} className={`lesson-link ${activeLesson === lesson.id ? 'lesson-active' : ''}`} onClick={() => this.setState({ activeLesson: lesson.id })}>
                <span className="lesson-number">{lesson.number}</span>
                <span className="lesson-link-copy"><strong>{lesson.title}</strong><small>{lesson.tag}</small></span>
                <span className="lesson-arrow" aria-hidden="true">↗</span>
              </button>
            ))}
            <div className="nav-footnote"><span className="nav-rule" />
              <p>Read the state.<br />Observe the render.<br />Trace what happens next.</p>
            </div>
          </nav>

          <section className="lesson-panel" aria-labelledby="active-title">
            <div className="panel-heading">
              <div><p className="eyebrow">Exercise {active.number} <span className="eyebrow-divider">/</span> {active.tag}</p><h2 id="active-title">{active.title}</h2></div>
              <span className="panel-index">{active.number} <i>—</i> 03</span>
            </div>
            <div className="panel-content">
              {activeLesson === 'errors' && this.renderErrorLesson()}
              {activeLesson === 'updating' && this.renderLifecycleLesson()}
              {activeLesson === 'unmounting' && this.renderLifecycleLesson(true)}
            </div>
            <footer className="panel-footer"><span>CLASS COMPONENT STUDY</span><span>TRY IT <b>→</b></span></footer>
          </section>
        </div>

        <footer className="page-footer"><span>REACT LIFECYCLE LAB</span><span>EVENT HANDLERS · ERROR BOUNDARIES · LIFECYCLE</span><span>01 / 03</span></footer>
      </main>
    )
  }
}