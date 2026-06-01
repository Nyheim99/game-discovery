import { render, screen } from '@testing-library/react'
import ErrorBoundary from './ErrorBoundary'

// A child that always throws during render, to trip the boundary.
function Boom(): never {
  throw new Error('boom')
}

describe('ErrorBoundary', () => {
  it('renders its children when nothing throws', () => {
    render(
      <ErrorBoundary>
        <p>All good</p>
      </ErrorBoundary>,
    )

    expect(screen.getByText('All good')).toBeInTheDocument()
  })

  it('renders the fallback UI when a child throws', () => {
    // React (and our componentDidCatch) log caught render errors to
    // console.error. Silence it so the test output stays clean — we're not
    // asserting on the logging here, just the fallback.
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    )

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument()
    expect(screen.queryByText('All good')).not.toBeInTheDocument()

    consoleError.mockRestore()
  })
})
