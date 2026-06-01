import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import App from './App'
import { useGames } from '@/hooks/useGames'
import { useGenres } from '@/hooks/useGenres'
import { usePlatforms } from '@/hooks/usePlatforms'
import { fetchGameDetails } from '@/services/api-client'

// App is the route map; mock the data layer so each page can mount without
// touching the network. We only assert which page renders for which URL.
vi.mock('@/hooks/useGames')
vi.mock('@/hooks/useGenres')
vi.mock('@/hooks/usePlatforms')
vi.mock('@/services/api-client')

beforeEach(() => {
  vi.mocked(useGenres).mockReturnValue({
    data: [],
    error: null,
    isLoading: false,
  } as unknown as ReturnType<typeof useGenres>)
  vi.mocked(usePlatforms).mockReturnValue({
    data: [],
    error: null,
  } as unknown as ReturnType<typeof usePlatforms>)
  vi.mocked(useGames).mockReturnValue({
    data: { pages: [{ count: 0, next: null, results: [] }], pageParams: [1] },
    error: null,
    isLoading: false,
    fetchNextPage: vi.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
  } as unknown as ReturnType<typeof useGames>)
  vi.mocked(fetchGameDetails).mockResolvedValue({
    id: 1,
    slug: 'celeste',
    name: 'Celeste',
  } as Awaited<ReturnType<typeof fetchGameDetails>>)
})

describe('App routing', () => {
  it('renders the HomePage at /', () => {
    renderWithProviders(<App />, { route: '/' })
    expect(
      screen.getByRole('searchbox', { name: 'Search games' }),
    ).toBeInTheDocument()
  })

  it('renders the FavoritesPage at /wishlist', () => {
    renderWithProviders(<App />, { route: '/wishlist' })
    expect(
      screen.getByRole('heading', { name: 'Wishlist' }),
    ).toBeInTheDocument()
  })

  it('renders the GameDetailPage at /games/:slug', async () => {
    renderWithProviders(<App />, { route: '/games/celeste' })
    expect(
      await screen.findByRole('heading', { name: 'Celeste' }),
    ).toBeInTheDocument()
  })

  it('renders the NotFoundPage for an unknown route', () => {
    renderWithProviders(<App />, { route: '/no-such-page' })
    expect(
      screen.getByRole('heading', { name: 'Page not found' }),
    ).toBeInTheDocument()
  })
})
