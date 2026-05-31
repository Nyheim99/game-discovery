import { useQuery } from '@tanstack/react-query'
import { fetchPlatforms } from '../services/api-client'

export function usePlatforms() {
  return useQuery({
    queryKey: ['platforms'],
    queryFn: fetchPlatforms,
  })
}
