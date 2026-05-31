const API_KEY = import.meta.env.VITE_RAWG_API_KEY
const BASE_URL = 'https://api.rawg.io/api'

// Every RAWG list endpoint returns this same wrapper shape. The <T> is a
// placeholder for "whatever kind of item this list holds".
export interface FetchResponse<T> {
  count: number
  next: string | null
  results: T[]
}

// One shared fetcher for all endpoints. `T` is decided by the caller.
async function fetchData<T>(
  endpoint: string,
  extraParams?: Record<string, string>,
): Promise<FetchResponse<T>> {
  const params = new URLSearchParams({ key: API_KEY, ...extraParams })

  const response = await fetch(`${BASE_URL}${endpoint}?${params}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint} from RAWG`)
  }

  return response.json()
}

// The shape of a single game (just the fields we care about for now).
export interface Game {
  id: number
  name: string
  background_image: string
}

// Everything the user can ask for, bundled into one object.
export interface GameQuery {
  genreId: number | null
  platformId: number | null
  searchText: string
  sortOrder: string
}

export function fetchGames(
  query: GameQuery,
  pageParam: number,
): Promise<FetchResponse<Game>> {
  const params: Record<string, string> = { page: String(pageParam) }
  if (query.genreId) {
    params.genres = String(query.genreId)
  }
  if (query.platformId) {
    params.parent_platforms = String(query.platformId)
  }
  if (query.searchText) {
    params.search = query.searchText
  }
  if (query.sortOrder) {
    params.ordering = query.sortOrder
  }

  return fetchData<Game>('/games', params)
}

// The shape of a single genre.
export interface Genre {
  id: number
  name: string
  image_background: string
}

export async function fetchGenres(): Promise<Genre[]> {
  const data = await fetchData<Genre>('/genres')
  return data.results
}

// The shape of a single platform (PC, PlayStation, Xbox, ...).
export interface Platform {
  id: number
  name: string
  slug: string
}

export async function fetchPlatforms(): Promise<Platform[]> {
  // `/platforms/lists/parents` returns the big families (PC, PlayStation,
  // Xbox, ...) rather than every individual console generation.
  const data = await fetchData<Platform>('/platforms/lists/parents')
  return data.results
}
