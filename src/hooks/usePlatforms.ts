import { useData } from './useData'
import { fetchPlatforms, type Platform } from '@/services/api-client'

export function usePlatforms() {
  return useData<Platform>('platforms', fetchPlatforms)
}
