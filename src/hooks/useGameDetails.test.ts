import { renderHook, waitFor } from '@testing-library/react'
import { useGameDetails } from './useGameDetails'
import { createQueryWrapper } from '@/test/test-utils'
import { fetchGameDetails } from '@/services/api-client'

vi.mock('@/services/api-client')

describe('useGameDetails', () => {
  it('fetches the game for the given slug', async () => {
    const game = { id: 1, slug: 'celeste', name: 'Celeste' }
    vi.mocked(fetchGameDetails).mockResolvedValue(
      game as Awaited<ReturnType<typeof fetchGameDetails>>,
    )

    const { result } = renderHook(() => useGameDetails('celeste'), {
      wrapper: createQueryWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(fetchGameDetails).toHaveBeenCalledWith('celeste')
    expect(result.current.data).toEqual(game)
  })
})
