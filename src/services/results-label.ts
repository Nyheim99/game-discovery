import type { GameQuery } from './api-client'

// Each sort maps to an adjective that leads the heading, so a filtered/sorted
// browse describes itself (e.g. "Top-rated Action games"). The empty default
// sort is the "Popular" recent feed.
const SORT_PREFIX: Record<string, string> = {
  '': 'Popular',
  '-added': 'Most-added',
  '-metacritic': 'Critically acclaimed',
  '-rating': 'Top-rated',
}

interface ResolvedNames {
  genreName?: string
  platformName?: string
}

// The status line above the game grid. Raw totals (often tens of thousands) are
// meaningless to scroll, so prefer context: a search reports its result count,
// the bare default view is a "popular now" feed, and a filtered/sorted browse
// describes itself — e.g. "Critically acclaimed RPG games on PC".
export function buildResultsLabel(
  query: GameQuery,
  { genreName, platformName }: ResolvedNames,
  totalCount: number,
): string {
  if (query.searchText) {
    const n = totalCount.toLocaleString()
    return `${n} result${totalCount === 1 ? '' : 's'} for “${query.searchText}”`
  }

  if (!query.genreId && !query.platformId && !query.sortOrder) {
    return 'Popular right now'
  }

  const prefix = SORT_PREFIX[query.sortOrder] ?? 'Popular'
  // Genre name + "games", unless the name already ends in "games" (e.g. the
  // "Board Games" genre) so we don't get "Board Games games".
  const noun = genreName
    ? /games$/i.test(genreName)
      ? genreName
      : `${genreName} games`
    : 'games'
  const suffix = platformName ? ` on ${platformName}` : ''

  return `${prefix} ${noun}${suffix}`
}
