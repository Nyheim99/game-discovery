import { Route, Routes } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import Layout from '@/components/Layout'
import HomePage from '@/pages/HomePage'
import GameDetailPage from '@/pages/GameDetailPage'
import FavoritesPage from '@/pages/FavoritesPage'
import NotFoundPage from '@/pages/NotFoundPage'

// App is now just the route map. The outer Route renders Layout (the shared
// header), and its child routes render into Layout's <Outlet />:
//   "/"             -> HomePage   (index = the default child)
//   "/games/:slug"  -> GameDetailPage
//   "/wishlist"     -> FavoritesPage
//   "*"             -> NotFoundPage (any URL that matches nothing above)
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="games/:slug" element={<GameDetailPage />} />
          <Route path="wishlist" element={<FavoritesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <Analytics />
      <SpeedInsights />
    </>
  )
}

export default App
