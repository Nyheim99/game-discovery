import { renderHook, waitFor } from '@testing-library/react'
import { usePlatforms } from './usePlatforms'
import { createQueryWrapper } from '@/test/test-utils'
import { fetchPlatforms } from '@/services/api-client'

vi.mock('@/services/api-client')

describe('usePlatforms', () => {
  it('returns the platforms from fetchPlatforms', async () => {
    const platforms = [{ id: 1, name: 'PC', slug: 'pc' }]
    vi.mocked(fetchPlatforms).mockResolvedValue(platforms)

    const { result } = renderHook(() => usePlatforms(), {
      wrapper: createQueryWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(platforms)
  })
})
