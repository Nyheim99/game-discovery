import { useState } from 'react'
import type { GameQuery } from '@/services/api-client'
import ActiveFilters from '@/components/ActiveFilters'
import GameGrid from '@/components/GameGrid'
import GenreList from '@/components/GenreList'
import PlatformSelector from '@/components/PlatformSelector'
import SearchInput from '@/components/SearchInput'
import SortSelector from '@/components/SortSelector'

// The discovery view: search + filters + the game grid. This used to be the
// whole of App; now it's just the page rendered at "/".
function HomePage() {
  const [gameQuery, setGameQuery] = useState<GameQuery>({
    genreId: null,
    platformId: null,
    searchText: '',
    sortOrder: '',
  })

  return (
    <>
      <SearchInput
        onSearch={(searchText) => setGameQuery({ ...gameQuery, searchText })}
      />
      <div className="content">
        <aside className="sidebar">
          <GenreList
            selectedGenreId={gameQuery.genreId}
            onSelectGenre={(genreId) => setGameQuery({ ...gameQuery, genreId })}
          />
        </aside>
        <main className="main">
          <div className="toolbar">
            <PlatformSelector
              selectedPlatformId={gameQuery.platformId}
              onSelectPlatform={(platformId) =>
                setGameQuery({ ...gameQuery, platformId })
              }
            />
            <SortSelector
              sortOrder={gameQuery.sortOrder}
              onChangeSortOrder={(sortOrder) =>
                setGameQuery({ ...gameQuery, sortOrder })
              }
            />
          </div>
          <ActiveFilters
            gameQuery={gameQuery}
            onClearSearch={() => setGameQuery({ ...gameQuery, searchText: '' })}
            onClearGenre={() => setGameQuery({ ...gameQuery, genreId: null })}
            onClearPlatform={() =>
              setGameQuery({ ...gameQuery, platformId: null })
            }
          />
          <GameGrid gameQuery={gameQuery} />
        </main>
      </div>
    </>
  )
}

export default HomePage
