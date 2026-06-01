import { render } from '@testing-library/react'
import GameCardSkeleton from './GameCardSkeleton'

describe('GameCardSkeleton', () => {
  it('renders a decorative placeholder hidden from assistive tech', () => {
    const { container } = render(<GameCardSkeleton />)

    // It's a visual stand-in only, so it must be hidden from screen readers.
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })
})
