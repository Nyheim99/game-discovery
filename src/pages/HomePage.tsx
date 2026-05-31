import { useSearchParams } from 'react-router-dom'
import type { GameQuery } from '@/services/api-client'
import ActiveFilters from '@/components/ActiveFilters'
import GameGrid from '@/components/GameGrid'
import GenreList from '@/components/GenreList'
import PlatformSelector from '@/components/PlatformSelector'
import SearchInput from '@/components/SearchInput'
import SortSelector from '@/components/SortSelector'

// The discovery view. The filters now live in the URL's query string
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

  return (
    <>
      <SearchInput onSearch={(searchText) => updateQuery({ searchText })} />
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <aside className="shrink-0 lg:w-52">
          <GenreList
            selectedGenreId={gameQuery.genreId}
            onSelectGenre={(genreId) => updateQuery({ genreId })}
          />
        </aside>
        <main className="min-w-0 flex-1">
          <div className="mb-5 flex flex-wrap gap-3">
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
            onClearSearch={() => updateQuery({ searchText: '' })}
            onClearGenre={() => updateQuery({ genreId: null })}
            onClearPlatform={() => updateQuery({ platformId: null })}
          />
          <GameGrid gameQuery={gameQuery} />
        </main>
      </div>
    </>
  )
}

export default HomePage
