import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'
import ErrorBoundary from '@/components/ErrorBoundary'
import { FavoritesProvider } from '@/context/FavoritesProvider'
import { ThemeProvider } from '@/context/ThemeProvider'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      {/* BrowserRouter enables client-side routing for everything inside it,
          using the real URL bar (history API). */}
      <BrowserRouter>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <FavoritesProvider>
              <App />
            </FavoritesProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
