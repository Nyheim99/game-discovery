import { renderHook, waitFor } from '@testing-library/react'
import { createQueryWrapper } from '@/test/test-utils'
import { useScreenshots } from './useScreenshots'
import { fetchScreenshots } from '@/services/api-client'

vi.mock('@/services/api-client')

describe('useScreenshots', () => {
  it('returns the screenshots for a slug', async () => {
    const shots = [{ id: 1, image: 'a.jpg' }]
    vi.mocked(fetchScreenshots).mockResolvedValue(shots)

    const { result } = renderHook(() => useScreenshots('celeste'), {
      wrapper: createQueryWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(shots)
    expect(fetchScreenshots).toHaveBeenCalledWith('celeste')
  })
})
