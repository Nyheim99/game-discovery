import { Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from '@/components/Layout'
import HomePage from '@/pages/HomePage'
import GameDetailPage from '@/pages/GameDetailPage'
import FavoritesPage from '@/pages/FavoritesPage'

// App is now just the route map. The outer Route renders Layout (the shared
// header), and its child routes render into Layout's <Outlet />:
//   "/"             -> HomePage   (index = the default child)
//   "/games/:slug"  -> GameDetailPage
//   "/favorites"    -> FavoritesPage
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="games/:slug" element={<GameDetailPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
      </Route>
    </Routes>
  )
}

export default App
