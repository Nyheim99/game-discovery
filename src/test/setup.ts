import '@testing-library/jest-dom/vitest'

// jsdom doesn't implement IntersectionObserver, which GameGrid uses to drive
// infinite scroll. Provide a no-op stub so components that create one can mount.
// (Tests don't trigger intersection; they assert the rendered states directly.)
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true, // let individual tests swap in their own observer
  value: IntersectionObserverStub,
})

// jsdom doesn't implement matchMedia, but ThemeProvider reads it on first
// render to pick up the OS light/dark preference. Provide a minimal stub.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }),
})
