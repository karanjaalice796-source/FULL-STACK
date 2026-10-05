import { Component } from 'react'
import FormComponent from './FormComponent.jsx'
import './App.css'

const initialFormData = {
  firstName: '',
  lastName: '',
  age: '',
  gender: '',
  destination: '',
  lactoseFree: false,
}

export default class App extends Component {
  state = { formData: initialFormData }

  handleChange = (event) => {
    const { name, value, type, checked } = event.target

    this.setState(({ formData }) => ({
      formData: {
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      },
    }))
  }

  render() {
    return (
      <main className="notebook">
        <header className="page-header">
          <a className="wordmark" href="#top" aria-label="The Travel Notebook home">
            <span className="wordmark-icon" aria-hidden="true">✳</span>
            <span>THE TRAVEL NOTEBOOK</span>
          </a>
          <span className="header-edition">FIELD NOTE No. 08.03</span>
        </header>

        <section className="intro" id="top">
          <p className="chapter"><span>08</span> / DAY THREE <i>·</i> FORM STUDY</p>
          <h1>A trip begins<br />with <em>a few details.</em></h1>
          <p className="intro-note">
            Jot down who’s coming and where you’d like to go. We’ll keep your notes close as you fill them in.
          </p>
          <span className="intro-doodle" aria-hidden="true">✎</span>
        </section>

        <FormComponent formData={this.state.formData} onChange={this.handleChange} />

        <footer className="page-footer">
          <span>TAKE YOUR TIME — THE JOURNEY STARTS HERE</span>
          <span className="footer-mark">✳ &nbsp; ONE PAGE AT A TIME</span>
        </footer>
      </main>
    )
  }
}
