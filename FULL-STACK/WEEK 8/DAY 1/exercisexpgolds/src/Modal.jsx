import { Component } from 'react'
import { createPortal } from 'react-dom'

export default class Modal extends Component {
  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown)
  }

  handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      this.props.onClose()
    }
  }

  handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      this.props.onClose()
    }
  }

  render() {
    const { errorInfo, onClose } = this.props

    return createPortal(
      <div className="modal-background" onMouseDown={this.handleOverlayClick}>
        <section className="modal-body" role="alertdialog" aria-modal="true" aria-labelledby="error-title" aria-describedby="error-description">
          <button className="modal-close-icon" onClick={onClose} aria-label="Close error message">×</button>
          <span className="modal-ornament" aria-hidden="true">!</span>
          <p className="modal-eyebrow">A small interruption</p>
          <h2 id="error-title">Well, that was unexpected.</h2>
          <p id="error-description" className="modal-message">
            {errorInfo?.message || 'Something went wrong, but the rest of the page is still here.'}
          </p>
          {errorInfo?.componentStack && (
            <details className="modal-details">
              <summary>What happened?</summary>
              <pre>{errorInfo.componentStack}</pre>
            </details>
          )}
          <button className="modal-close-button" onClick={onClose}>Close this message</button>
          <p className="modal-signoff">Take a breath. You’re still in good hands.</p>
        </section>
      </div>,
      document.body,
    )
  }
}
