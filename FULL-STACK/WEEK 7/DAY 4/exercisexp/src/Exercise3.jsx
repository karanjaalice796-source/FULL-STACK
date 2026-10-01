import { Component } from 'react'
import heroImg from './assets/hero.png'
import './Exercise.css'

class Exercise extends Component {
  render() {
    const style_header = {
      color: 'white',
      backgroundColor: 'DodgerBlue',
      padding: '10px',
      fontFamily: 'Arial',
    }

    return (
      <div className="tag-exercise">
        <h1 style={style_header}>This is a heading</h1>
        <p className="para">This is a paragraph styled with Exercise.css.</p>
        <a href="https://react.dev/">Learn about React</a>
        <form onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="favorite-color">Favorite color </label>
          <input id="favorite-color" name="favoriteColor" type="text" />
          <button type="submit">Submit</button>
        </form>
        <img src={heroImg} alt="Colorful React illustration" />
        <ul>
          <li>JSX</li>
          <li>Components</li>
          <li>Props</li>
        </ul>
      </div>
    )
  }
}

export default Exercise