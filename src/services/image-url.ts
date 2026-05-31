// RAWG's media server can crop/resize on the fly by inserting a transform
// segment right after "/media/". We request small cropped thumbnails for cards
// instead of the full-size images (which can be several MB each).
//
// e.g. https://media.rawg.io/media/games/abc.jpg
//   -> https://media.rawg.io/media/crop/600/400/games/abc.jpg
export function getCroppedImageUrl(url: string): string {
  const marker = '/media/'
  const index = url.indexOf(marker)
  if (index === -1) return url

  const insertAt = index + marker.length
  return `${url.slice(0, insertAt)}crop/600/400/${url.slice(insertAt)}`
}
