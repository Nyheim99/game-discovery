import { renderHook, waitFor } from '@testing-library/react'
import { useGames } from './useGames'
import { createQueryWrapper } from '@/test/test-utils'
import {
  fetchGames,
  type GameQuery,
  type FetchResponse,
  type Game,
} from '@/services/api-client'

vi.mock('@/services/api-client')

const query: GameQuery = {
  genreId: null,
  platformId: null,
  searchText: '',
  sortOrder: '',
}

// Minimal page fixtures — we only read id/next here, so cast the partial games
// to the full response type rather than spelling out every Game field.
function page(results: { id: number }[], next: string | null) {
  return {
    count: results.length,
    next,
    results,
  } as unknown as FetchResponse<Game>
}

describe('useGames', () => {
  it('fetches the first page and exposes the results', async () => {
    vi.mocked(fetchGames).mockResolvedValue(page([{ id: 1 }], null))

    const { result } = renderHook(() => useGames(query), {
      wrapper: createQueryWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(fetchGames).toHaveBeenCalledWith(query, 1)
    expect(result.current.data?.pages[0].results).toEqual([{ id: 1 }])
  })

  it('reports another page is available when RAWG returns a next link', async () => {
    vi.mocked(fetchGames).mockResolvedValue(
      page([{ id: 1 }], 'https://api.rawg.io/api/games?page=2'),
    )

    const { result } = renderHook(() => useGames(query), {
      wrapper: createQueryWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    // getNextPageParam returned a page number -> hasNextPage is true.
    expect(result.current.hasNextPage).toBe(true)
  })

  it('reports no more pages when next is null', async () => {
    vi.mocked(fetchGames).mockResolvedValue(page([{ id: 1 }], null))

    const { result } = renderHook(() => useGames(query), {
      wrapper: createQueryWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    // getNextPageParam returned undefined -> hasNextPage is false.
    expect(result.current.hasNextPage).toBe(false)
  })
})
