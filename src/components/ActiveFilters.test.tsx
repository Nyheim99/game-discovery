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

// Helper to render with the clear-callbacks stubbed, returning the spies so a
// test can assert which one fired.
function renderFilters(query: GameQuery) {
  const onClearGenre = vi.fn()
  const onClearPlatform = vi.fn()

  render(
    <ActiveFilters
      gameQuery={query}
      onClearGenre={onClearGenre}
      onClearPlatform={onClearPlatform}
    />,
  )

  return { onClearGenre, onClearPlatform }
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
        onClearGenre={vi.fn()}
        onClearPlatform={vi.fn()}
      />,
    )

    // The component returns null, so it produces no DOM at all.
    expect(container).toBeEmptyDOMElement()
  })

  it('does not show a chip for the search term (the search box owns it)', () => {
    const { container } = render(
      <ActiveFilters
        gameQuery={{ ...emptyQuery, searchText: 'witcher' }}
        onClearGenre={vi.fn()}
        onClearPlatform={vi.fn()}
      />,
    )

    // Search alone produces no chips.
    expect(container).toBeEmptyDOMElement()
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
    const { onClearGenre, onClearPlatform } = renderFilters({
      ...emptyQuery,
      genreId: 4,
      platformId: 1,
    })

    await user.click(
      screen.getByRole('button', { name: 'Remove filter: Genre: Action' }),
    )

    expect(onClearGenre).toHaveBeenCalledOnce()
    expect(onClearPlatform).not.toHaveBeenCalled()
  })
})
