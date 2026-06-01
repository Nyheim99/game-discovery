import { renderHook, waitFor } from '@testing-library/react'
import { useGenres } from './useGenres'
import { createQueryWrapper } from '@/test/test-utils'
import { fetchGenres } from '@/services/api-client'

vi.mock('@/services/api-client')

describe('useGenres', () => {
  it('returns the genres from fetchGenres', async () => {
    const genres = [{ id: 4, name: 'Action', image_background: '' }]
    vi.mocked(fetchGenres).mockResolvedValue(genres)

    const { result } = renderHook(() => useGenres(), {
      wrapper: createQueryWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(genres)
  })
})
