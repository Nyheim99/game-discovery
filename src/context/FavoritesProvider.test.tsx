import { renderHook, act } from '@testing-library/react'
import type { ReactNode } from 'react'
import { FavoritesProvider } from './FavoritesProvider'
import { useFavorites } from './favorites-context'

// A wrapper that puts the hook under test inside the real provider, so
// useFavorites() finds its context instead of throwing.
function wrapper({ children }: { children: ReactNode }) {
  return <FavoritesProvider>{children}</FavoritesProvider>
}

describe('FavoritesProvider / useFavorites', () => {
  // localStorage is shared across tests in jsdom, so reset it each time to keep
  // tests independent (no order-dependent state bleeding between them).
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts with no favorites when localStorage is empty', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper })

    expect(result.current.favoriteIds).toEqual([])
    expect(result.current.isFavorite(1)).toBe(false)
  })

  it('adds an id when toggled on', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper })

    act(() => {
      result.current.toggleFavorite(42)
    })

    expect(result.current.favoriteIds).toEqual([42])
    expect(result.current.isFavorite(42)).toBe(true)
  })

  it('removes an id when toggled a second time', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper })

    act(() => {
      result.current.toggleFavorite(42)
    })
    act(() => {
      result.current.toggleFavorite(42)
    })

    expect(result.current.favoriteIds).toEqual([])
    expect(result.current.isFavorite(42)).toBe(false)
  })

  it('persists favorites to localStorage', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper })

    act(() => {
      result.current.toggleFavorite(7)
    })

    expect(localStorage.getItem('favoriteGameIds')).toBe('[7]')
  })

  it('hydrates initial state from localStorage', () => {
    // Seed storage *before* the provider mounts; the lazy initializer should
    // pick it up on first render.
    localStorage.setItem('favoriteGameIds', '[1, 2, 3]')

    const { result } = renderHook(() => useFavorites(), { wrapper })

    expect(result.current.favoriteIds).toEqual([1, 2, 3])
    expect(result.current.isFavorite(2)).toBe(true)
  })

  it('throws if used outside a provider', () => {
    // Rendering the hook with no wrapper means no context is present.
    expect(() => renderHook(() => useFavorites())).toThrow(
      /must be used within a FavoritesProvider/i,
    )
  })
})
