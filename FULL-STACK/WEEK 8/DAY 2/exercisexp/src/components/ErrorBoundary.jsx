import { Component } from 'react'
import { Link } from 'react-router-dom'

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  componentDidCatch(error, errorInfo) {
    this.setState({ hasError: true })
    console.error('A route failed to render:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-screen" role="alert">
          <span className="error-symbol" aria-hidden="true">!</span>
          <span className="screen-index">BOUNDARY CAUGHT AN ERROR</span>
          <h2>Well, that<br /><em>was unexpected.</em></h2>
          <p>The ShopScreen threw an error on purpose. This route boundary caught it, so the navigation and rest of the workbook are still here.</p>
          <NavBackHome />
          <span className="error-code">ERROR_BOUNDARY / RECOVERY READY</span>
        </div>
      )
    }

    return this.props.children
  }
}

function NavBackHome() {
  return <Link className="text-link" to="/">Return to Home <span>↗</span></Link>
}
