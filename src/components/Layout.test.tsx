import { screen } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'
import { renderWithProviders } from '@/test/test-utils'
import Layout from './Layout'

// Layout renders the shared header and an <Outlet/> for the routed page, so we
// mount it as a parent route with a child route supplying the page content.
function renderLayout(route = '/') {
  return renderWithProviders(
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<p>Home page content</p>} />
        <Route path="/favorites" element={<p>Favorites content</p>} />
      </Route>
    </Routes>,
    { route },
  )
}

describe('Layout', () => {
  it('renders the brand, a Favorites link, and the theme toggle', () => {
    renderLayout()

    expect(
      screen.getByRole('link', { name: /game.*discovery/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /favorites/i })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /switch to .* mode/i }),
    ).toBeInTheDocument()
  })

  it('renders the routed page into the outlet', () => {
    renderLayout('/')
    expect(screen.getByText('Home page content')).toBeInTheDocument()
  })

  it('marks the Favorites link active on the favorites route', () => {
    renderLayout('/favorites')

    // NavLink adds aria-current="page" to the active link.
    expect(screen.getByRole('link', { name: /favorites/i })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })
})
