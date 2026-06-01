import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useLocation } from 'react-router-dom'
import { renderWithProviders } from '@/test/test-utils'
import HomePage from './HomePage'
import { useGames } from '@/hooks/useGames'
import { useGenres } from '@/hooks/useGenres'
import { usePlatforms } from '@/hooks/usePlatforms'
import { useFeaturedGame } from '@/hooks/useFeaturedGame'

vi.mock('@/hooks/useGames')
vi.mock('@/hooks/useGenres')
vi.mock('@/hooks/usePlatforms')
vi.mock('@/hooks/useFeaturedGame')

// Renders the current query string so tests can assert HomePage wrote the URL.
function LocationEcho() {
  const location = useLocation()
  return <div data-testid="search">{location.search}</div>
}

function renderHomePage(route = '/') {
  return renderWithProviders(
    <>
      <HomePage />
      <LocationEcho />
    </>,
    { route },
  )
}

beforeEach(() => {
  vi.mocked(useGenres).mockReturnValue({
    data: [{ id: 4, name: 'Action', image_background: '' }],
    error: null,
    isLoading: false,
  } as unknown as ReturnType<typeof useGenres>)

  vi.mocked(usePlatforms).mockReturnValue({
    data: [{ id: 1, name: 'PC', slug: 'pc' }],
    error: null,
  } as unknown as ReturnType<typeof usePlatforms>)

  // Keep the featured hero out of these tests — they focus on the filters.
  // With no featured game, the hero renders nothing.
  vi.mocked(useFeaturedGame).mockReturnValue({
    data: undefined,
    isLoading: false,
  } as unknown as ReturnType<typeof useFeaturedGame>)

  vi.mocked(useGames).mockReturnValue({
    data: { pages: [{ count: 0, next: null, results: [] }], pageParams: [1] },
    error: null,
    isLoading: false,
    fetchNextPage: vi.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
  } as unknown as ReturnType<typeof useGames>)
})

describe('HomePage', () => {
  it('derives active filters from the URL query string', () => {
    renderHomePage('/?genres=4&search=witcher')

    // The genre id 4 is resolved to its name via the (mocked) genres list.
    expect(screen.getByText('Genre: Action')).toBeInTheDocument()
    // The search term seeds the search box (it has no chip of its own).
    expect(screen.getByRole('searchbox', { name: 'Search games' })).toHaveValue(
      'witcher',
    )
  })

  it('writes the chosen genre into the URL', async () => {
    const user = userEvent.setup()
    renderHomePage('/')

    await user.click(screen.getByRole('button', { name: 'Action' }))

    expect(screen.getByTestId('search')).toHaveTextContent('genres=4')
  })

  it('clears the search from the URL via the clear button', async () => {
    const user = userEvent.setup()
    renderHomePage('/?search=witcher')

    await user.click(screen.getByRole('button', { name: 'Clear search' }))

    // With the search cleared, the query string is empty again.
    expect(screen.getByTestId('search')).toHaveTextContent('')
  })

  it('writes a submitted search term to the URL', async () => {
    const user = userEvent.setup()
    renderHomePage('/')

    await user.type(
      screen.getByRole('searchbox', { name: 'Search games' }),
      'halo{enter}',
    )

    expect(screen.getByTestId('search')).toHaveTextContent('search=halo')
  })

  it('writes the chosen platform to the URL', async () => {
    const user = userEvent.setup()
    renderHomePage('/')

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Filter by platform' }),
      'PC',
    )

    expect(screen.getByTestId('search')).toHaveTextContent('platforms=1')
  })

  it('writes the chosen sort order to the URL', async () => {
    const user = userEvent.setup()
    renderHomePage('/')

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Order games by' }),
      'Order by: Name',
    )

    expect(screen.getByTestId('search')).toHaveTextContent('ordering=name')
  })

  it('clears the genre filter when its chip is removed', async () => {
    const user = userEvent.setup()
    renderHomePage('/?genres=4')

    await user.click(
      screen.getByRole('button', { name: 'Remove filter: Genre: Action' }),
    )

    expect(screen.getByTestId('search')).toHaveTextContent('')
  })

  it('clears the platform filter when its chip is removed', async () => {
    const user = userEvent.setup()
    renderHomePage('/?platforms=1')

    await user.click(
      screen.getByRole('button', { name: 'Remove filter: Platform: PC' }),
    )

    expect(screen.getByTestId('search')).toHaveTextContent('')
  })
})
