import { useQuery } from '@tanstack/react-query'
import { fetchGenres } from '../services/api-client'

export function useGenres() {
  return useQuery({
    queryKey: ['genres'],
    queryFn: fetchGenres,
  })
}
