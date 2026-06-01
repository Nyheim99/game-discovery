import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import GameGrid from './GameGrid'
import { useGames } from '@/hooks/useGames'
import type { GameQuery, Game } from '@/services/api-client'

vi.mock('@/hooks/useGames')

const query: GameQuery = {
  genreId: null,
  platformId: null,
  searchText: '',
  sortOrder: '',
}

const game: Game = {
  id: 1,
  slug: 'celeste',
  name: 'Celeste',
  background_image: '',
  metacritic: 92,
  rating: 4.5,
  parent_platforms: [],
}

// Build a useGames return value, overriding only the fields a test cares about.
function mockGames(state: Partial<ReturnType<typeof useGames>>) {
  vi.mocked(useGames).mockReturnValue({
    data: undefined,
    error: null,
    isLoading: false,
    fetchNextPage: vi.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
    ...state,
  } as unknown as ReturnType<typeof useGames>)
}

function pages(results: Game[], count: number, next: string | null = null) {
  return { pages: [{ count, next, results }], pageParams: [1] }
}

describe('GameGrid', () => {
  it('announces loading and shows no count while fetching the first page', () => {
    mockGames({ isLoading: true })

    renderWithProviders(<GameGrid gameQuery={query} />)

    expect(screen.getByText('Loading games…')).toBeInTheDocument()
    expect(screen.queryByText(/games found/)).not.toBeInTheDocument()
  })

  it('shows an error message when the query fails', () => {
    mockGames({ error: new Error('Network down') })

    renderWithProviders(<GameGrid gameQuery={query} />)

    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('Error: Network down')
  })

  it('shows an empty state when there are no results', () => {
    mockGames({ data: pages([], 0) })

    renderWithProviders(<GameGrid gameQuery={query} />)

    expect(screen.getByText('No games found.')).toBeInTheDocument()
  })

  it('renders the total count and a card per game', () => {
    mockGames({ data: pages([game], 42) })

    renderWithProviders(<GameGrid gameQuery={query} />)

    expect(screen.getByText('42 games found')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Celeste' })).toBeInTheDocument()
  })

  it('shows a "Loading more…" indicator while fetching the next page', () => {
    mockGames({
      data: pages([game], 42, 'next-url'),
      hasNextPage: true,
      isFetchingNextPage: true,
    })

    renderWithProviders(<GameGrid gameQuery={query} />)

    expect(screen.getByText('Loading more…')).toBeInTheDocument()
  })

  it('fetches the next page when the sentinel scrolls into view', () => {
    // An IntersectionObserver that immediately reports the sentinel visible,
    // so the effect's callback runs and triggers fetchNextPage.
    class TriggeringObserver {
      private cb: IntersectionObserverCallback
      constructor(cb: IntersectionObserverCallback) {
        this.cb = cb
      }
      observe() {
        this.cb(
          [{ isIntersecting: true } as IntersectionObserverEntry],
          this as unknown as IntersectionObserver,
        )
      }
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return []
      }
    }
    vi.stubGlobal('IntersectionObserver', TriggeringObserver)

    const fetchNextPage = vi.fn()
    mockGames({
      data: pages([game], 42, 'next-url'),
      hasNextPage: true,
      isFetchingNextPage: false,
      fetchNextPage,
    })

    renderWithProviders(<GameGrid gameQuery={query} />)

    expect(fetchNextPage).toHaveBeenCalled()
    vi.unstubAllGlobals()
  })
})
