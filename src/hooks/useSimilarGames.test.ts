import { renderHook, waitFor } from '@testing-library/react'
import { createQueryWrapper } from '@/test/test-utils'
import { useSimilarGames } from './useSimilarGames'
import { fetchGames } from '@/services/api-client'
import type { FetchResponse, Game } from '@/services/api-client'

vi.mock('@/services/api-client')

const page = {
  count: 3,
  next: null,
  results: [
    { id: 1, slug: 'a', name: 'A' },
    { id: 2, slug: 'b', name: 'B' },
    { id: 3, slug: 'c', name: 'C' },
  ],
} as unknown as FetchResponse<Game>

describe('useSimilarGames', () => {
  it('does not fetch until the genre is known', () => {
    renderHook(() => useSimilarGames(undefined, 1), {
      wrapper: createQueryWrapper(),
    })

    expect(fetchGames).not.toHaveBeenCalled()
  })

  it('fetches top-rated games in the genre and excludes the current game', async () => {
    vi.mocked(fetchGames).mockResolvedValue(page)

    const { result } = renderHook(() => useSimilarGames(4, 2), {
      wrapper: createQueryWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(fetchGames).toHaveBeenCalledWith(
      expect.objectContaining({ genreId: 4, sortOrder: '-rating' }),
      1,
    )
    // The current game (id 2) is filtered out of its own "similar" list.
    expect(result.current.data?.map((game) => game.id)).toEqual([1, 3])
  })
})
