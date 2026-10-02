import { useState } from 'react'
import './Forms.css'

function Forms() {
  const [username, setUsername] = useState('')
  const [age, setAge] = useState(null)
  const [errormessage, setErrormessage] = useState('')
  const [about, setAbout] = useState('I enjoy learning new things and making useful projects.')
  const [car, setCar] = useState('Volvo')

  let header = null

  if (username.trim() && age && !errormessage) {
    header = (
      <div className="user-preview" role="status">
        <p className="exercise-kicker">Profile preview</p>
        <h2>Hello, {username.trim()}.</h2>
        <p>You are {age} years old.</p>
      </div>
    )
  }

  function handleChange(event) {
    const { name, value } = event.target

    if (name === 'username') {
      setUsername(value)
      return
    }

    if (name === 'age') {
      setAge(value)
      setErrormessage(
        value && !/^\d+$/.test(value.trim())
          ? 'Age must contain numbers only.'
          : '',
      )
    }
  }

  function mySubmitHandler(event) {
    event.preventDefault()

    if (username.trim() && age && !errormessage) {
      window.alert(username.trim())
    }
  }

  return (
    <div className="exercise-stack">
      <section className="exercise-panel profile-exercise" aria-labelledby="profile-title">
        <div className="exercise-heading">
          <span className="exercise-number">01</span>
          <div>
            <p className="exercise-kicker">React forms</p>
            <h2 id="profile-title">Your profile</h2>
          </div>
        </div>

        {header}

        <form className="exercise-form profile-form" onSubmit={mySubmitHandler}>
          <div className="exercise-field">
            <label htmlFor="username">Name</label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="name"
              value={username}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="exercise-field">
            <label htmlFor="age">Age</label>
            <input
              id="age"
              name="age"
              type="text"
              inputMode="numeric"
              value={age ?? ''}
              onChange={handleChange}
              aria-invalid={Boolean(errormessage)}
              aria-describedby={errormessage ? 'age-error' : undefined}
              placeholder="Enter your age"
              required
            />
            {errormessage && <p className="exercise-error" id="age-error" role="alert">{errormessage}</p>}
          </div>
          <button className="exercise-button" type="submit">Submit <span aria-hidden="true">↗</span></button>
        </form>

        <div className="profile-extras">
          <div className="exercise-field">
            <label htmlFor="about">About you</label>
            <textarea
              id="about"
              name="about"
              rows="4"
              value={about}
              onChange={(event) => setAbout(event.target.value)}
            />
          </div>
          <div className="exercise-field">
            <label htmlFor="car">Favorite car</label>
            <select id="car" name="car" value={car} onChange={(event) => setCar(event.target.value)}>
              <option value="Volvo">Volvo</option>
              <option value="Saab">Saab</option>
              <option value="Mercedes">Mercedes</option>
              <option value="Audi">Audi</option>
            </select>
          </div>
          <p className="car-selection">Selected car: <strong>{car}</strong></p>
        </div>
      </section>
    </div>
  )
}

export default Forms