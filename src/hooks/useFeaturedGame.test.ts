import { renderHook, waitFor } from '@testing-library/react'
import { createQueryWrapper } from '@/test/test-utils'
import { useFeaturedGame } from './useFeaturedGame'
import { fetchGames } from '@/services/api-client'
import type { FetchResponse, Game } from '@/services/api-client'

vi.mock('@/services/api-client')

const page = {
  count: 2,
  next: null,
  results: [
    { id: 1, slug: 'top-game', name: 'Top Game' },
    { id: 2, slug: 'runner-up', name: 'Runner Up' },
  ],
} as unknown as FetchResponse<Game>

describe('useFeaturedGame', () => {
  it('returns the single top game from the results', async () => {
    vi.mocked(fetchGames).mockResolvedValue(page)

    const { result } = renderHook(() => useFeaturedGame(), {
      wrapper: createQueryWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    // `select` reduces the page of results down to just the first game.
    expect(result.current.data).toEqual(page.results[0])
  })

  it('asks RAWG for the highest-Metacritic games', async () => {
    vi.mocked(fetchGames).mockResolvedValue(page)

    renderHook(() => useFeaturedGame(), { wrapper: createQueryWrapper() })

    await waitFor(() => expect(fetchGames).toHaveBeenCalled())

    expect(fetchGames).toHaveBeenCalledWith(
      expect.objectContaining({ sortOrder: '-metacritic' }),
      1,
    )
  })
})
