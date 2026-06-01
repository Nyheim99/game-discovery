import { render, screen } from '@testing-library/react'
import RatingBreakdown from './RatingBreakdown'
import type { Rating } from '@/services/api-client'

describe('RatingBreakdown', () => {
  it('renders nothing when there are no ratings', () => {
    const { container } = render(<RatingBreakdown ratings={undefined} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('lists each tier with its percentage', () => {
    const ratings: Rating[] = [
      { id: 3, title: 'meh', count: 10, percent: 20 },
      { id: 1, title: 'exceptional', count: 50, percent: 60 },
      { id: 2, title: 'recommended', count: 15, percent: 20 },
      // An unrecognised tier falls back to the neutral colour.
      { id: 9, title: 'mysterious', count: 0, percent: 0 },
    ]

    render(<RatingBreakdown ratings={ratings} />)

    expect(
      screen.getByRole('heading', { name: 'Player ratings' }),
    ).toBeInTheDocument()
    expect(screen.getByText('exceptional')).toBeInTheDocument()
    expect(screen.getByText('60%')).toBeInTheDocument()
  })
})
