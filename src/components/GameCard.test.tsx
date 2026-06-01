import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/test-utils'
import GameCard from './GameCard'
import type { Game } from '@/services/api-client'

const game: Game = {
  id: 1,
  slug: 'the-witcher-3',
  name: 'The Witcher 3',
  background_image: 'https://media.rawg.io/media/games/witcher.jpg',
  metacritic: 92,
  rating: 4.6,
  parent_platforms: [],
}

describe('GameCard', () => {
  beforeEach(() => {
    // Favorites persist to localStorage; start each test from a clean slate.
    localStorage.clear()
  })

  it('links to the game detail page using the slug', () => {
    renderWithProviders(<GameCard game={game} />)

    const link = screen.getByRole('link', { name: /the witcher 3/i })
    expect(link).toHaveAttribute('href', '/games/the-witcher-3')
  })

  it('requests a cropped thumbnail for the cover image', () => {
    renderWithProviders(<GameCard game={game} />)

    expect(screen.getByRole('img', { name: 'The Witcher 3' })).toHaveAttribute(
      'src',
      'https://media.rawg.io/media/crop/600/400/games/witcher.jpg',
    )
  })

  it('falls back to a placeholder image when there is no cover', () => {
    renderWithProviders(<GameCard game={{ ...game, background_image: '' }} />)

    const img = screen.getByRole('img', { name: 'The Witcher 3' })
    // The imported SVG resolves to a placeholder URL, not a RAWG crop URL.
    expect(img.getAttribute('src')).not.toContain('/crop/')
  })

  it('shows the critic score when a metacritic rating exists', () => {
    renderWithProviders(<GameCard game={game} />)
    expect(screen.getByText('92')).toBeInTheDocument()
  })

  it('omits the critic score when metacritic is null', () => {
    renderWithProviders(<GameCard game={{ ...game, metacritic: null }} />)
    expect(screen.queryByText('92')).not.toBeInTheDocument()
  })

  it('toggles favorite state when the heart button is clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(<GameCard game={game} />)

    const addButton = screen.getByRole('button', {
      name: 'Add The Witcher 3 to wishlist',
    })
    expect(addButton).toHaveAttribute('aria-pressed', 'false')

    await user.click(addButton)

    // After toggling, the same button now offers to remove and is pressed.
    const removeButton = screen.getByRole('button', {
      name: 'Remove The Witcher 3 from wishlist',
    })
    expect(removeButton).toHaveAttribute('aria-pressed', 'true')
  })
})
