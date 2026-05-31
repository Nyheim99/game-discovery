import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import GameCard from './GameCard'
import type { Game } from '@/services/api-client'

const game: Game = {
  id: 1,
  slug: 'the-witcher-3',
  name: 'The Witcher 3',
  background_image: 'https://example.com/witcher.jpg',
  metacritic: 92,
  rating: 4.6,
  parent_platforms: [],
}

describe('GameCard', () => {
  it('links to the game detail page using the slug', () => {
    renderWithProviders(<GameCard game={game} />)

    const link = screen.getByRole('link', { name: /the witcher 3/i })
    expect(link).toHaveAttribute('href', '/games/the-witcher-3')
  })
})
