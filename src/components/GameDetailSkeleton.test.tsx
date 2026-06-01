import { render } from '@testing-library/react'
import GameDetailSkeleton from './GameDetailSkeleton'

describe('GameDetailSkeleton', () => {
  it('renders a decorative placeholder hidden from assistive tech', () => {
    const { container } = render(<GameDetailSkeleton />)

    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })
})
