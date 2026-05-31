import type { ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ErrorBoundary from '@/components/ErrorBoundary'
import { FavoritesProvider } from '@/context/FavoritesProvider'
import { ThemeProvider } from '@/context/ThemeProvider'

// One client for the whole app's lifetime.
const queryClient = new QueryClient()

// All the app-wide context/providers in one place, so main.tsx stays focused
// on mounting and the nesting order lives somewhere obvious. Order matters:
// ErrorBoundary outermost (catch render errors), then routing, then our
// contexts. App renders as `children`.
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      {/* BrowserRouter enables client-side routing for everything inside it,
          using the real URL bar (history API). */}
      <BrowserRouter>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <FavoritesProvider>{children}</FavoritesProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
