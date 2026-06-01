const API_KEY = import.meta.env.VITE_RAWG_API_KEY
const BASE_URL = 'https://api.rawg.io/api'

// Every RAWG list endpoint returns this same wrapper shape. The <T> is a
// placeholder for "whatever kind of item this list holds".
export interface FetchResponse<T> {
  count: number
  next: string | null
  results: T[]
}

// The lowest-level fetcher: hit any RAWG endpoint and return its JSON as T.
// Everything else builds on this so the URL/error/JSON logic lives in one place.
async function fetchFromRawg<T>(
  endpoint: string,
  extraParams?: Record<string, string>,
): Promise<T> {
  const params = new URLSearchParams({ key: API_KEY, ...extraParams })

  const response = await fetch(`${BASE_URL}${endpoint}?${params}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint} from RAWG`)
  }

  return response.json()
}

// List endpoints all return the `FetchResponse<T>` wrapper, so this is just
// `fetchFromRawg` with that wrapper type filled in.
function fetchData<T>(
  endpoint: string,
  extraParams?: Record<string, string>,
): Promise<FetchResponse<T>> {
  return fetchFromRawg<FetchResponse<T>>(endpoint, extraParams)
}

// RAWG nests each platform under a `platform` key in `parent_platforms`.
export interface ParentPlatform {
  platform: {
    id: number
    name: string
    slug: string
  }
}

// The shape of a single game (the fields we use).
export interface Game {
  id: number
  slug: string
  name: string
  background_image: string
  metacritic: number | null
  rating: number
  // Optional: RAWG omits this for some games, so callers must not assume it.
  parent_platforms?: ParentPlatform[]
}

// A named, slugged entity as it appears on a game's detail object — genres,
// developers, publishers all share this shape.
export interface NamedEntity {
  id: number
  name: string
  slug: string
}

// A descriptor tag (e.g. "Singleplayer", "Atmospheric"). RAWG returns tags in
// several languages, so `language` lets us keep just the English ones.
export interface Tag {
  id: number
  name: string
  slug: string
  language: string
}

// One slice of the user-rating breakdown (e.g. "exceptional", 80%).
export interface Rating {
  id: number
  title: string
  count: number
  percent: number
}

// The detail endpoint returns everything a Game has, plus richer fields we
// only need on the detail page. These extras are optional to be safe.
export interface GameDetails extends Game {
  description_raw: string
  released: string | null
  website: string
  genres?: NamedEntity[]
  developers?: NamedEntity[]
  publishers?: NamedEntity[]
  esrb_rating?: NamedEntity | null
  tags?: Tag[]
  ratings?: Rating[]
  // The detail object lists the stores (names) but not the buy URLs — those
  // come from the /stores sub-endpoint, joined on the store id.
  stores?: { store: NamedEntity }[]
}

// The detail endpoint (/games/{slug}) returns a single game object — NOT the
// list wrapper — so we ask fetchFromRawg for a GameDetails directly.
export function fetchGameDetails(slug: string): Promise<GameDetails> {
  return fetchFromRawg<GameDetails>(`/games/${slug}`)
}

// One screenshot of a game.
export interface Screenshot {
  id: number
  image: string
}

export async function fetchScreenshots(slug: string): Promise<Screenshot[]> {
  const data = await fetchData<Screenshot>(`/games/${slug}/screenshots`)
  return data.results
}

// A buy link: which store (by id) and the URL for this game in it.
export interface StoreLink {
  store_id: number
  url: string
}

export async function fetchGameStores(slug: string): Promise<StoreLink[]> {
  const data = await fetchData<StoreLink>(`/games/${slug}/stores`)
  return data.results
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
  } else if (query.searchText) {
    // No explicit sort while searching: order matches by popularity (how many
    // users have added the game) so big titles beat obscure exact-name hits,
    // instead of RAWG's default relevance ranking.
    params.ordering = '-added'
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
