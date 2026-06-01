import {
  fetchGames,
  fetchGenres,
  fetchPlatforms,
  fetchGameDetails,
  fetchScreenshots,
  fetchGameStores,
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
          platformId: 18,
          searchText: 'witcher',
          sortOrder: '-rating',
        },
        2,
      )

      const url = calledUrl()
      expect(url.pathname).toBe('/api/games')
      expect(url.searchParams.get('page')).toBe('2')
      expect(url.searchParams.get('genres')).toBe('4')
      expect(url.searchParams.get('parent_platforms')).toBe('18')
      expect(url.searchParams.get('search')).toBe('witcher')
      expect(url.searchParams.get('ordering')).toBe('-rating')
      // fetchGames returns the full list wrapper, untouched.
      expect(result).toEqual(body)
    })

    it('omits the filters but defaults to popularity ordering when the query is empty', async () => {
      mockFetchOnce({ count: 0, next: null, results: [] })

      await fetchGames(emptyQuery, 1)

      const url = calledUrl()
      expect(url.searchParams.get('page')).toBe('1')
      expect(url.searchParams.get('genres')).toBeNull()
      expect(url.searchParams.get('parent_platforms')).toBeNull()
      expect(url.searchParams.get('search')).toBeNull()
      // No explicit sort defaults the home grid to popularity, not RAWG's order,
      // and constrains it to a recent date window ("popular now").
      expect(url.searchParams.get('ordering')).toBe('-added')
      expect(url.searchParams.get('dates')).toMatch(
        /^\d{4}-\d{2}-\d{2},\d{4}-\d{2}-\d{2}$/,
      )
    })

    it('orders search results by popularity but without the recent-date window', async () => {
      mockFetchOnce({ count: 0, next: null, results: [] })

      await fetchGames({ ...emptyQuery, searchText: 'witcher' }, 1)

      const url = calledUrl()
      expect(url.searchParams.get('search')).toBe('witcher')
      expect(url.searchParams.get('ordering')).toBe('-added')
      // Search spans all time — the date window is only for the default feed.
      expect(url.searchParams.get('dates')).toBeNull()
    })

    it('keeps the recent-date window when filtering under the default sort', async () => {
      mockFetchOnce({ count: 0, next: null, results: [] })

      await fetchGames({ ...emptyQuery, genreId: 4 }, 1)

      const url = calledUrl()
      expect(url.searchParams.get('genres')).toBe('4')
      expect(url.searchParams.get('ordering')).toBe('-added')
      // "Popular" stays recent even when filtered (distinct from -added all-time).
      expect(url.searchParams.get('dates')).toMatch(
        /^\d{4}-\d{2}-\d{2},\d{4}-\d{2}-\d{2}$/,
      )
    })

    it('keeps an explicit sort over the search-popularity default', async () => {
      mockFetchOnce({ count: 0, next: null, results: [] })

      await fetchGames(
        { ...emptyQuery, searchText: 'witcher', sortOrder: 'name' },
        1,
      )

      expect(calledUrl().searchParams.get('ordering')).toBe('name')
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

  describe('fetchScreenshots', () => {
    it('hits /games/{slug}/screenshots and unwraps the results', async () => {
      const shots = [{ id: 1, image: 'a.jpg' }]
      mockFetchOnce({ count: 1, next: null, results: shots })

      const result = await fetchScreenshots('celeste')

      expect(calledUrl().pathname).toBe('/api/games/celeste/screenshots')
      expect(result).toEqual(shots)
    })
  })

  describe('fetchGameStores', () => {
    it('hits /games/{slug}/stores and unwraps the results', async () => {
      const links = [{ store_id: 1, url: 'https://store/celeste' }]
      mockFetchOnce({ count: 1, next: null, results: links })

      const result = await fetchGameStores('celeste')

      expect(calledUrl().pathname).toBe('/api/games/celeste/stores')
      expect(result).toEqual(links)
    })
  })
})
