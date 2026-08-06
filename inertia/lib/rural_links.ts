/** Normalize what3words for URLs (strip leading slashes). */
export function normalizeWhat3Words(value: string | null | undefined) {
  return (value ?? '').trim().replace(/^\/+/, '')
}

export function what3wordsUrl(value: string | null | undefined) {
  const words = normalizeWhat3Words(value)
  return words ? `https://w3w.co/${words}` : '#'
}

export function googleMapsUrl(latitude: number, longitude: number) {
  return `https://www.google.com/maps?q=${latitude},${longitude}`
}

export function appleMapsUrl(latitude: number, longitude: number) {
  return `https://maps.apple.com/?q=${latitude},${longitude}`
}
