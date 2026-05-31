import { useData } from './useData'
import { fetchGenres, type Genre } from '@/services/api-client'

export function useGenres() {
  return useData<Genre>('genres', fetchGenres)
}
