import { renderHook, waitFor } from '@testing-library/react'
import { createQueryWrapper } from '@/test/test-utils'
import { useGameStores } from './useGameStores'
import { fetchGameStores } from '@/services/api-client'

vi.mock('@/services/api-client')

describe('useGameStores', () => {
  it('returns the store links for a slug', async () => {
    const links = [{ store_id: 1, url: 'https://store/celeste' }]
    vi.mocked(fetchGameStores).mockResolvedValue(links)

    const { result } = renderHook(() => useGameStores('celeste'), {
      wrapper: createQueryWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(links)
    expect(fetchGameStores).toHaveBeenCalledWith('celeste')
  })
})
