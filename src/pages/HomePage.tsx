import { useSearchParams } from 'react-router-dom'
import type { GameQuery } from '@/services/api-client'
import ActiveFilters from '@/components/ActiveFilters'
import FeaturedHero from '@/components/FeaturedHero'
import GameGrid from '@/components/GameGrid'
import GenreList from '@/components/GenreList'
import PlatformSelector from '@/components/PlatformSelector'
import SearchInput from '@/components/SearchInput'
import SortSelector from '@/components/SortSelector'

// The discovery view. The filters live in the URL's query string
// (e.g. /?genres=4&search=witcher) instead of component state, so a filtered
// view survives navigation/refresh and can be bookmarked or shared.
function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Derive the GameQuery from the URL — the URL is the single source of truth.
  const gameQuery: GameQuery = {
    genreId: searchParams.get('genres')
      ? Number(searchParams.get('genres'))
      : null,
    platformId: searchParams.get('platforms')
      ? Number(searchParams.get('platforms'))
      : null,
    searchText: searchParams.get('search') ?? '',
    sortOrder: searchParams.get('ordering') ?? '',
  }

  // Apply a partial change and write the result back into the URL. Empty/null
  // fields are omitted so the URL stays clean (no ?genres=&search=).
  function updateQuery(patch: Partial<GameQuery>) {
    const next = { ...gameQuery, ...patch }
    const params: Record<string, string> = {}
    if (next.genreId) params.genres = String(next.genreId)
    if (next.platformId) params.platforms = String(next.platformId)
    if (next.searchText) params.search = next.searchText
    if (next.sortOrder) params.ordering = next.sortOrder
    setSearchParams(params)
  }

  // Searching starts a fresh browse: clear the genre/platform filters so the
  // results aren't narrowed by stale selections. Clearing the search leaves
  // any filters alone.
  function handleSearch(searchText: string) {
    updateQuery(
      searchText
        ? { searchText, genreId: null, platformId: null }
        : { searchText },
    )
  }

  // The featured hero headlines the default view, but a big "featured game"
  // banner makes no sense over a search or filtered list — so hide it whenever
  // the user is actively narrowing results.
  const isFiltering = Boolean(
    gameQuery.genreId || gameQuery.platformId || gameQuery.searchText,
  )

  return (
    <div className="flex flex-col gap-6">
      {!isFiltering && <FeaturedHero />}

      <GenreList
        selectedGenreId={gameQuery.genreId}
        onSelectGenre={(genreId) => updateQuery({ genreId })}
      />

      {/* Toolbar: search grows to fill the row; the selects sit beside it. */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-[240px] flex-1">
          <SearchInput
            searchText={gameQuery.searchText}
            onSearch={handleSearch}
          />
        </div>
        <PlatformSelector
          selectedPlatformId={gameQuery.platformId}
          onSelectPlatform={(platformId) => updateQuery({ platformId })}
        />
        <SortSelector
          sortOrder={gameQuery.sortOrder}
          onChangeSortOrder={(sortOrder) => updateQuery({ sortOrder })}
        />
      </div>

      <ActiveFilters
        gameQuery={gameQuery}
        onClearGenre={() => updateQuery({ genreId: null })}
        onClearPlatform={() => updateQuery({ platformId: null })}
      />

      <GameGrid gameQuery={gameQuery} />
    </div>
  )
}

export default HomePage
