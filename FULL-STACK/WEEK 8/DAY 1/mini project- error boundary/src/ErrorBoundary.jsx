import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { error: null, errorInfo: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    console.error('Caught by ErrorBoundary:', error, errorInfo)
  }

  render() {
    if (this.state.error) {
      return (
        <section className="error-fallback" role="alert">
          <p className="eyebrow">A child component stopped</p>
          <h3>We caught that.</h3>
          <p className="fallback-message">{this.state.error.toString()}</p>
          <details className="component-details">
            <summary>Component stack</summary>
            <div style={{ whiteSpace: 'pre-wrap' }}>
              {this.state.errorInfo?.componentStack}
            </div>
          </details>
          <button className="reload-button" onClick={() => window.location.reload()}>
            Reload the page
          </button>
        </section>
      )
    }

    return this.props.children
  }
}