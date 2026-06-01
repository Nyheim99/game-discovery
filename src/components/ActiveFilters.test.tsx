import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ActiveFilters from './ActiveFilters'
import { useGenres } from '@/hooks/useGenres'
import { usePlatforms } from '@/hooks/usePlatforms'
import type { GameQuery } from '@/services/api-client'

// Replace the data hooks with fakes so this test never touches the network or
// TanStack Query — we control exactly what genres/platforms come back.
vi.mock('@/hooks/useGenres')
vi.mock('@/hooks/usePlatforms')

const genres = [{ id: 4, name: 'Action', image_background: '' }]
const platforms = [{ id: 1, name: 'PC', slug: 'pc' }]

// No filters selected — each test overrides only the fields it cares about.
const emptyQuery: GameQuery = {
  genreId: null,
  platformId: null,
  searchText: '',
  sortOrder: '',
}

// Helper to render with all three clear-callbacks stubbed, returning the spies
// so a test can assert which one fired.
function renderFilters(query: GameQuery) {
  const onClearSearch = vi.fn()
  const onClearGenre = vi.fn()
  const onClearPlatform = vi.fn()

  render(
    <ActiveFilters
      gameQuery={query}
      onClearSearch={onClearSearch}
      onClearGenre={onClearGenre}
      onClearPlatform={onClearPlatform}
    />,
  )

  return { onClearSearch, onClearGenre, onClearPlatform }
}

describe('ActiveFilters', () => {
  beforeEach(() => {
    // Point the mocked hooks at our fixture data. `vi.mocked` is just a typed
    // wrapper so TS knows these are mocks with .mockReturnValue.
    vi.mocked(useGenres).mockReturnValue({
      data: genres,
    } as unknown as ReturnType<typeof useGenres>)
    vi.mocked(usePlatforms).mockReturnValue({
      data: platforms,
    } as unknown as ReturnType<typeof usePlatforms>)
  })

  it('renders nothing when no filters are active', () => {
    const { container } = render(
      <ActiveFilters
        gameQuery={emptyQuery}
        onClearSearch={vi.fn()}
        onClearGenre={vi.fn()}
        onClearPlatform={vi.fn()}
      />,
    )

    // The component returns null, so it produces no DOM at all.
    expect(container).toBeEmptyDOMElement()
  })

  it('shows a chip for the active search term', () => {
    renderFilters({ ...emptyQuery, searchText: 'witcher' })

    expect(screen.getByText('Search: witcher')).toBeInTheDocument()
  })

  it('shows a chip with the genre name looked up from the id', () => {
    renderFilters({ ...emptyQuery, genreId: 4 })

    expect(screen.getByText('Genre: Action')).toBeInTheDocument()
  })

  it('shows a chip with the platform name looked up from the id', () => {
    renderFilters({ ...emptyQuery, platformId: 1 })

    expect(screen.getByText('Platform: PC')).toBeInTheDocument()
  })

  it('calls only the matching clear callback when a chip is removed', async () => {
    const user = userEvent.setup()
    const { onClearGenre, onClearSearch, onClearPlatform } = renderFilters({
      ...emptyQuery,
      searchText: 'witcher',
      genreId: 4,
    })

    await user.click(
      screen.getByRole('button', { name: 'Remove filter: Genre: Action' }),
    )

    expect(onClearGenre).toHaveBeenCalledOnce()
    expect(onClearSearch).not.toHaveBeenCalled()
    expect(onClearPlatform).not.toHaveBeenCalled()
  })
})
