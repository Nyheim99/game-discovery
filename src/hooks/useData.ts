import { useQuery } from '@tanstack/react-query'

// Shared hook for simple "reference list" data (genres, platforms, ...).
// These rarely change, so we mark the data fresh for a long time to avoid
// needless refetching.
export function useData<T>(queryKey: string, fetchFn: () => Promise<T[]>) {
  return useQuery({
    queryKey: [queryKey],
    queryFn: fetchFn,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  })
}
