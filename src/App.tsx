import { useState } from 'react'
import './App.css'
import type { GameQuery } from '@/services/api-client'
import GameGrid from '@/components/GameGrid'
import GenreList from '@/components/GenreList'
import PlatformSelector from '@/components/PlatformSelector'
import SearchInput from '@/components/SearchInput'
import SortSelector from '@/components/SortSelector'

function App() {
  const [gameQuery, setGameQuery] = useState<GameQuery>({
    genreId: null,
    platformId: null,
    searchText: '',
    sortOrder: '',
  })

  return (
    <div className="app">
      <h1>Game Discovery</h1>
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
          <GameGrid gameQuery={gameQuery} />
        </main>
      </div>
    </div>
  )
}

export default App
