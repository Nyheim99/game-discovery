import { renderHook, waitFor } from '@testing-library/react'
import { useData } from './useData'
import { createQueryWrapper } from '@/test/test-utils'

describe('useData', () => {
  it('calls the fetch function and exposes its resolved data', async () => {
    const items = [{ id: 1 }, { id: 2 }]
    const fetchFn = vi.fn().mockResolvedValue(items)

    const { result } = renderHook(() => useData('things', fetchFn), {
      wrapper: createQueryWrapper(),
    })

    // The query starts in a loading state, then resolves asynchronously.
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(fetchFn).toHaveBeenCalledOnce()
    expect(result.current.data).toEqual(items)
  })

  it('surfaces an error when the fetch function rejects', async () => {
    const fetchFn = vi.fn().mockRejectedValue(new Error('nope'))

    const { result } = renderHook(() => useData('things', fetchFn), {
      wrapper: createQueryWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.data).toBeUndefined()
  })
})
