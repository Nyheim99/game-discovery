import {
  fetchGames,
  fetchGenres,
  fetchPlatforms,
  fetchGameDetails,
  type GameQuery,
} from './api-client'

// Helper: make the next fetch() call resolve with this JSON body. `ok` controls
// the success/error branch in fetchFromRawg.
function mockFetchOnce(body: unknown, ok = true) {
  vi.mocked(fetch).mockResolvedValueOnce({
    ok,
    json: () => Promise.resolve(body),
  } as unknown as Response)
}

// Pull the URL that fetch was called with on its first (only) call.
function calledUrl(): URL {
  const arg = vi.mocked(fetch).mock.calls[0][0] as string
  return new URL(arg)
}

const emptyQuery: GameQuery = {
  genreId: null,
  platformId: null,
  searchText: '',
  sortOrder: '',
}

describe('api-client', () => {
  beforeEach(() => {
    // Replace the real network with a spy. Each test seeds its own response.
    vi.stubGlobal('fetch', vi.fn())
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('fetchGames', () => {
    it('requests /games with page and only the active filters', async () => {
      const body = { count: 1, next: null, results: [{ id: 1 }] }
      mockFetchOnce(body)

      const result = await fetchGames(
        {
          genreId: 4,
          platformId: null,
          searchText: 'witcher',
          sortOrder: '-rating',
        },
        2,
      )

      const url = calledUrl()
      expect(url.pathname).toBe('/api/games')
      expect(url.searchParams.get('page')).toBe('2')
      expect(url.searchParams.get('genres')).toBe('4')
      expect(url.searchParams.get('search')).toBe('witcher')
      expect(url.searchParams.get('ordering')).toBe('-rating')
      // platformId was null, so its param must be absent entirely.
      expect(url.searchParams.get('parent_platforms')).toBeNull()
      // fetchGames returns the full list wrapper, untouched.
      expect(result).toEqual(body)
    })

    it('omits every filter param when the query is empty', async () => {
      mockFetchOnce({ count: 0, next: null, results: [] })

      await fetchGames(emptyQuery, 1)

      const url = calledUrl()
      expect(url.searchParams.get('page')).toBe('1')
      expect(url.searchParams.get('genres')).toBeNull()
      expect(url.searchParams.get('parent_platforms')).toBeNull()
      expect(url.searchParams.get('search')).toBeNull()
      expect(url.searchParams.get('ordering')).toBeNull()
    })

    it('rejects when the response is not ok', async () => {
      mockFetchOnce(null, false)

      await expect(fetchGames(emptyQuery, 1)).rejects.toThrow(/Failed to fetch/)
    })
  })

  describe('fetchGenres', () => {
    it('hits /genres and unwraps the results array', async () => {
      const genres = [{ id: 1, name: 'Action', image_background: '' }]
      mockFetchOnce({ count: 1, next: null, results: genres })

      const result = await fetchGenres()

      expect(calledUrl().pathname).toBe('/api/genres')
      // Unwrapped: callers get the array, not the { count, next, results } shell.
      expect(result).toEqual(genres)
    })
  })

  describe('fetchPlatforms', () => {
    it('hits the parent-platforms endpoint and unwraps the results', async () => {
      const platforms = [{ id: 1, name: 'PC', slug: 'pc' }]
      mockFetchOnce({ count: 1, next: null, results: platforms })

      const result = await fetchPlatforms()

      expect(calledUrl().pathname).toBe('/api/platforms/lists/parents')
      expect(result).toEqual(platforms)
    })
  })

  describe('fetchGameDetails', () => {
    it('requests /games/{slug} and returns the object directly (no unwrap)', async () => {
      const details = { id: 1, slug: 'the-witcher-3', name: 'The Witcher 3' }
      mockFetchOnce(details)

      const result = await fetchGameDetails('the-witcher-3')

      expect(calledUrl().pathname).toBe('/api/games/the-witcher-3')
      expect(result).toEqual(details)
    })
  })
})
