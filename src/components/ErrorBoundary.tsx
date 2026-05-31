import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

// Error boundaries must be class components — React has no hook equivalent.
class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  // Called when a child throws during render. Returns the new state.
  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  // Called with the actual error — a good place to log to a service.
  componentDidCatch(error: unknown) {
    console.error('Caught by ErrorBoundary:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <p>Please try reloading the page.</p>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
