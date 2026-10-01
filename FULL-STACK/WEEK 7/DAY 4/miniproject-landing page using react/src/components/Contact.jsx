import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons'

function Contact() {
  const [draftReady, setDraftReady] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = formData.get('name')
    const email = formData.get('email')
    const message = formData.get('message')
    const subject = encodeURIComponent(`Studio inquiry from ${name}`)
    const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`)

    setDraftReady(true)
    window.location.href = `mailto:hello@morrow.studio?subject=${subject}&body=${body}`
  }

  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-title">
      <div className="container contact-layout row">
        <div className="col-lg-5 contact-intro">
          <p className="section-kicker">Have a good one in mind?</p>
          <h2 id="contact-title">Let’s make<br />something matter.</h2>
          <a className="email-link" href="mailto:hello@morrow.studio">
            <FontAwesomeIcon icon={faEnvelope} aria-hidden="true" />
            hello@morrow.studio
          </a>
          <div className="social-links" aria-label="Social links">
            <a href="https://www.instagram.com/" aria-label="Instagram">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="https://www.linkedin.com/" aria-label="LinkedIn">
              <FontAwesomeIcon icon={faLinkedinIn} />
            </a>
          </div>
        </div>

        <div className="col-lg-6 offset-lg-1 contact-form-wrap">
          <form onSubmit={handleSubmit}>
            <label htmlFor="contact-name">Your name</label>
            <input id="contact-name" name="name" autoComplete="name" required />

            <label htmlFor="contact-email">Email address</label>
            <input id="contact-email" name="email" type="email" autoComplete="email" required />

            <label htmlFor="contact-message">A little about your project</label>
            <textarea id="contact-message" name="message" rows="3" required />

            <button className="send-button" type="submit">
              Send a note
              <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
            </button>
            {draftReady && <p className="form-note" role="status">Your email draft is ready to send.</p>}
          </form>
        </div>
      </div>
    </section>
  )
}

export default Contact