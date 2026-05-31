import { useEffect, useState, type ReactNode } from 'react'
import { FavoritesContext } from './favorites-context'

const STORAGE_KEY = 'favoriteGameIds'

export function FavoritesProvider({ children }: { children: ReactNode }) {
  // Lazy initial state: read localStorage once, on first render.
  const [favoriteIds, setFavoriteIds] = useState<number[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  })

  // Persist to localStorage whenever the favorites change.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds))
  }, [favoriteIds])

  function toggleFavorite(id: number) {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id],
    )
  }

  function isFavorite(id: number) {
    return favoriteIds.includes(id)
  }

  return (
    <FavoritesContext value={{ favoriteIds, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext>
  )
}
