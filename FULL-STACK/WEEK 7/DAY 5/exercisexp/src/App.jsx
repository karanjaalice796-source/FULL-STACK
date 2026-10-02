import Car from './Components/Car.jsx'
import Color from './Components/Color.jsx'
import Events from './Components/Events.jsx'
import Phone from './Components/Phone.jsx'
import './App.css'

const carinfo = { name: 'Ford', model: 'Mustang' }

function App() {
  return (
    <main className="workbook">
      <header className="page-header">
        <div className="header-mark" aria-hidden="true">R.</div>
        <div>
          <p className="eyebrow">Frontend practice / 01</p>
          <h1>React, in motion</h1>
          <p className="intro">Components, state, events, and effects. Four small experiments, all in one place.</p>
        </div>
        <div className="lesson-count"><span>04</span><small>exercises</small></div>
      </header>

      <div className="exercise-list">
        <section className="exercise exercise-car" aria-labelledby="car-title">
          <div className="exercise-heading">
            <span className="exercise-number">01</span>
            <div><p className="eyebrow">Components + state</p><h2 id="car-title">Car and garage</h2></div>
          </div>
          <Car carInfo={carinfo} />
        </section>

        <section className="exercise exercise-events" aria-labelledby="events-title">
          <div className="exercise-heading">
            <span className="exercise-number">02</span>
            <div><p className="eyebrow">Event handlers</p><h2 id="events-title">Events</h2></div>
          </div>
          <Events />
        </section>

        <section className="exercise exercise-phone" aria-labelledby="phone-title">
          <div className="exercise-heading">
            <span className="exercise-number">03</span>
            <div><p className="eyebrow">Updating state</p><h2 id="phone-title">Phone</h2></div>
          </div>
          <Phone />
        </section>

        <section className="exercise exercise-color" aria-labelledby="color-title">
          <div className="exercise-heading">
            <span className="exercise-number">04</span>
            <div><p className="eyebrow">React lifecycle</p><h2 id="color-title">Color effect</h2></div>
          </div>
          <Color />
        </section>
      </div>
      <footer className="page-footer"><span>REACT EXERCISES</span><span>COMPONENTS · STATE · EFFECTS</span></footer>
    </main>
  )
}

export default App