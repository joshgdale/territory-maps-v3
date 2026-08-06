import { appleMapsUrl, googleMapsUrl, what3wordsUrl } from '~/lib/rural_links'
import type { Rural } from '~/lib/types'

const buttonBase =
  'inline-flex shrink-0 items-center rounded-lg px-2 py-1.5 text-xs font-medium text-white hover:opacity-90 sm:text-sm'

export function RuralExternalLinks({ rural }: { rural: Rural }) {
  const w3w = rural.what3words?.trim()
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      {w3w ? (
        <a
          href={what3wordsUrl(w3w)}
          target="_blank"
          rel="noreferrer"
          className={`${buttonBase} bg-red-700/80`}
        >
          What3Words
        </a>
      ) : null}
      <a
        href={googleMapsUrl(rural.latitude, rural.longitude)}
        target="_blank"
        rel="noreferrer"
        className={`${buttonBase} bg-green-700/80`}
      >
        Google Maps
      </a>
      <a
        href={appleMapsUrl(rural.latitude, rural.longitude)}
        target="_blank"
        rel="noreferrer"
        className={`${buttonBase} bg-zinc-800/85`}
      >
        Apple Maps
      </a>
    </div>
  )
}

export function RuralMeta({ rural }: { rural: Rural }) {
  const lat = Number(rural.latitude)
  const lon = Number(rural.longitude)
  const coords =
    Number.isFinite(lat) && Number.isFinite(lon)
      ? `${lat.toFixed(5)}, ${lon.toFixed(5)}`
      : null
  const w3w = rural.what3words?.trim()

  if (!coords && !w3w) return null

  return (
    <span className="hidden min-w-0 truncate text-sm text-slate-500 md:inline">
      {coords}
      {coords && w3w ? ' · ' : null}
      {w3w}
    </span>
  )
}
