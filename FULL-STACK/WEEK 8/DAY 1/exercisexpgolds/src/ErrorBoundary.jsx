import { Component } from 'react'
import Modal from './Modal.jsx'

export default class ErrorBoundary extends Component {
  state = { hasError: false, errorInfo: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorInfo: { message: error.message } }
  }

  componentDidCatch(error, errorInfo) {
    const details = {
      message: error.message || 'An unexpected rendering error occurred.',
      componentStack: errorInfo.componentStack,
    }

    this.setState({ errorInfo: details })
    this.props.onError(details)
    console.error('Caught by ErrorBoundary:', error, errorInfo)
  }

  occurError = () => {
    const errorInfo = {
      message: 'A simulated error was caught. Your page is safe, and you can close this message to continue.',
      componentStack: 'Triggered deliberately from the exercise button.',
    }

    this.setState({ hasError: true, errorInfo })
    this.props.onError(errorInfo)
  }

  closeError = () => {
    this.setState({ hasError: false, errorInfo: null })
    this.props.onClear()
  }

  render() {
    if (this.state.hasError) {
      return <Modal errorInfo={this.state.errorInfo || this.props.errorInfo} onClose={this.closeError} />
    }

    return this.props.children
  }
}
