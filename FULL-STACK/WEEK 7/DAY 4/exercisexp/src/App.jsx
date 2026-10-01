import UserFavoriteAnimals from './UserFavoriteAnimals.jsx'
import Exercise from './Exercise3.jsx'
import './App.css'

const user = {
  firstName: 'Bob',
  lastName: 'Dylan',
  favAnimals: ['Horse', 'Turtle', 'Elephant', 'Monkey'],
}

function App() {
  const myelement = <h1>I Love JSX!</h1>
  const sum = 5 + 5

  return (
    <main className="lesson">
      <header className="lesson-header">
        <p className="eyebrow">Week 7 / Day 4</p>
        <h1>React Exercises</h1>
      </header>

      <section className="exercise">
        <h2>Exercise 1: JSX</h2>
        <p>Hello World!</p>
        {myelement}
        <p>React is {sum} times better with JSX</p>
      </section>

      <section className="exercise">
        <h2>Exercise 2: Object &amp; props</h2>
        <h3>{user.firstName}</h3>
        <h3>{user.lastName}</h3>
        <UserFavoriteAnimals favAnimals={user.favAnimals} />
      </section>

      <section className="exercise">
        <h2>Exercise 3: HTML tags in React</h2>
        <Exercise />
      </section>
    </main>
  )
}

export default App