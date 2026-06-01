import { buildResultsLabel } from './results-label'
import type { GameQuery } from './api-client'

const base: GameQuery = {
  genreId: null,
  platformId: null,
  searchText: '',
  sortOrder: '',
}

describe('buildResultsLabel', () => {
  it('reports the result count (with context) when searching', () => {
    // (Use a separator-free count so the assertion isn't locale-dependent —
    // toLocaleString groups thousands differently per locale.)
    expect(buildResultsLabel({ ...base, searchText: 'witcher' }, {}, 42)).toBe(
      '42 results for “witcher”',
    )
  })

  it('uses the singular "result" for a single match', () => {
    expect(buildResultsLabel({ ...base, searchText: 'x' }, {}, 1)).toBe(
      '1 result for “x”',
    )
  })

  it('is "Popular right now" on the bare default view', () => {
    expect(buildResultsLabel(base, {}, 22000)).toBe('Popular right now')
  })

  it('describes a genre + platform filter under the default sort', () => {
    expect(
      buildResultsLabel(
        { ...base, genreId: 4, platformId: 1 },
        { genreName: 'Action', platformName: 'PC' },
        0,
      ),
    ).toBe('Popular Action games on PC')
  })

  it('weaves the chosen sort into the heading', () => {
    expect(
      buildResultsLabel(
        { ...base, genreId: 5, sortOrder: '-rating' },
        { genreName: 'RPG' },
        0,
      ),
    ).toBe('Top-rated RPG games')
    expect(
      buildResultsLabel(
        { ...base, platformId: 1, sortOrder: '-added' },
        { platformName: 'PC' },
        0,
      ),
    ).toBe('Most-added games on PC')
    expect(
      buildResultsLabel(
        { ...base, genreId: 5, sortOrder: '-metacritic' },
        { genreName: 'RPG' },
        0,
      ),
    ).toBe('Critically acclaimed RPG games')
  })

  it('avoids doubling "games" when the genre already ends in it', () => {
    expect(
      buildResultsLabel(
        { ...base, genreId: 9 },
        { genreName: 'Board Games' },
        0,
      ),
    ).toBe('Popular Board Games')
  })

  it('falls back to a bare noun while names are still resolving', () => {
    expect(buildResultsLabel({ ...base, genreId: 4 }, {}, 0)).toBe(
      'Popular games',
    )
  })
})
