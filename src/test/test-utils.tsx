import { render } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FavoritesProvider } from '@/context/FavoritesProvider'
import { ThemeProvider } from '@/context/ThemeProvider'

// Most components depend on Router + Query + our Contexts to render. This wraps
// a component in all of them so individual tests don't have to repeat the
// boilerplate. `route` sets the starting URL (handy for routing tests).
export function renderWithProviders(
  ui: ReactElement,
  { route = '/' }: { route?: string } = {},
) {
  // A fresh client per test avoids cache bleeding between tests; no retries so
  // a failing query surfaces immediately instead of retrying.
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter initialEntries={[route]}>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <FavoritesProvider>{children}</FavoritesProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </MemoryRouter>
    )
  }

  return render(ui, { wrapper: Wrapper })
}

// A lighter wrapper for testing hooks in isolation with renderHook: just a
// QueryClientProvider (most of our custom hooks wrap TanStack Query). Each call
// gets a fresh client so cache never bleeds between tests.
export function createQueryWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return function QueryWrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }
}
