import '@testing-library/jest-dom/vitest'

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
