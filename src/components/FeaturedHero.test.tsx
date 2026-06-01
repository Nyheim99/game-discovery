import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/test-utils'
import FeaturedHero from './FeaturedHero'
import { useFeaturedGame } from '@/hooks/useFeaturedGame'
import { useGameDetails } from '@/hooks/useGameDetails'
import type { Game, GameDetails } from '@/services/api-client'

vi.mock('@/hooks/useFeaturedGame')
vi.mock('@/hooks/useGameDetails')

const game = {
  id: 1,
  slug: 'elden-ring',
  name: 'Elden Ring',
  background_image: 'https://example.com/elden.jpg',
  metacritic: 96,
  rating: 4.8,
  parent_platforms: [{ platform: { id: 1, name: 'PC', slug: 'pc' } }],
} as Game

const details = {
  ...game,
  description_raw: 'A vast fantasy action-RPG.',
  released: '2022-02-25',
  website: '',
} as GameDetails

function mockFeatured(state: Partial<ReturnType<typeof useFeaturedGame>>) {
  vi.mocked(useFeaturedGame).mockReturnValue(
    state as ReturnType<typeof useFeaturedGame>,
  )
}

beforeEach(() => {
  vi.mocked(useGameDetails).mockReturnValue({
    data: details,
  } as unknown as ReturnType<typeof useGameDetails>)
})

describe('FeaturedHero', () => {
  it('renders a skeleton while the featured game loads', () => {
    mockFeatured({ data: undefined, isLoading: true })

    renderWithProviders(<FeaturedHero />)

    expect(screen.queryByText('Elden Ring')).not.toBeInTheDocument()
    expect(screen.queryByText('★ Featured')).not.toBeInTheDocument()
  })

  it('renders nothing when there is no featured game', () => {
    mockFeatured({ data: undefined, isLoading: false })

    const { container } = renderWithProviders(<FeaturedHero />)

    expect(container).toBeEmptyDOMElement()
  })

  it('shows the featured game with score, description and a details link', () => {
    mockFeatured({ data: game, isLoading: false })

    renderWithProviders(<FeaturedHero />)

    expect(
      screen.getByRole('heading', { name: 'Elden Ring' }),
    ).toBeInTheDocument()
    expect(screen.getByText('96')).toBeInTheDocument()
    expect(screen.getByText('A vast fantasy action-RPG.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'View details' })).toHaveAttribute(
      'href',
      '/games/elden-ring',
    )
  })

  it('omits the score and description when those fields are missing', () => {
    mockFeatured({
      data: { ...game, metacritic: null, background_image: '' },
      isLoading: false,
    })
    vi.mocked(useGameDetails).mockReturnValue({
      data: { ...details, description_raw: '' },
    } as unknown as ReturnType<typeof useGameDetails>)

    renderWithProviders(<FeaturedHero />)

    expect(screen.queryByText('96')).not.toBeInTheDocument()
    expect(
      screen.queryByText('A vast fantasy action-RPG.'),
    ).not.toBeInTheDocument()
    // The title (and the rest of the hero) still renders fine.
    expect(
      screen.getByRole('heading', { name: 'Elden Ring' }),
    ).toBeInTheDocument()
  })

  it('toggles favorite state when the heart button is clicked', async () => {
    const user = userEvent.setup()
    mockFeatured({ data: game, isLoading: false })

    renderWithProviders(<FeaturedHero />)

    const favoriteButton = screen.getByRole('button', {
      name: 'Add Elden Ring to wishlist',
    })
    await user.click(favoriteButton)

    expect(
      screen.getByRole('button', { name: 'Remove Elden Ring from wishlist' }),
    ).toBeInTheDocument()
  })
})
