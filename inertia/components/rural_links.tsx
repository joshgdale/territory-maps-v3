import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { MapPinIcon } from '@heroicons/react/20/solid'
import { appleMapsUrl, googleMapsUrl, what3wordsUrl } from '~/lib/rural_links'
import type { Rural } from '~/lib/types'

const buttonBase =
  'inline-flex shrink-0 items-center rounded-lg px-2 py-1.5 text-xs font-medium text-white hover:opacity-90 sm:text-sm'

const menuItemClass =
  'flex w-full items-center rounded-md px-2 py-2 text-sm text-slate-900 data-focus:bg-green-500/50'

type RuralLink = {
  href: string
  label: string
  className: string
}

function ruralLinks(rural: Rural): RuralLink[] {
  const w3w = rural.what3words?.trim()
  const links: RuralLink[] = []

  if (w3w) {
    links.push({
      href: what3wordsUrl(w3w),
      label: 'What3Words',
      className: `${buttonBase} bg-red-700/80`,
    })
  }

  links.push(
    {
      href: googleMapsUrl(rural.latitude, rural.longitude),
      label: 'Google Maps',
      className: `${buttonBase} bg-green-700/80`,
    },
    {
      href: appleMapsUrl(rural.latitude, rural.longitude),
      label: 'Apple Maps',
      className: `${buttonBase} bg-zinc-800/85`,
    }
  )

  return links
}

export function RuralExternalLinks({ rural }: { rural: Rural }) {
  const links = ruralLinks(rural)

  return (
    <>
      <div className="lg:hidden">
        <Menu>
          <MenuButton
            type="button"
            title="Map links"
            className="inline-flex items-center rounded-lg bg-slate-700 px-2 py-1.5 text-white hover:bg-slate-600"
          >
            <MapPinIcon className="h-4 w-4" aria-hidden />
            <span className="sr-only">Map links</span>
          </MenuButton>
          <MenuItems
            anchor={{ to: 'bottom end', gap: 4 }}
            portal
            className="z-50 w-44 origin-top-right rounded-md border border-slate-700 bg-white p-1 shadow-lg focus:outline-none"
          >
            {links.map((link) => (
              <MenuItem key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className={menuItemClass}
                >
                  {link.label}
                </a>
              </MenuItem>
            ))}
          </MenuItems>
        </Menu>
      </div>

      <div className="hidden shrink-0 items-center gap-1.5 lg:flex">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className={link.className}
          >
            {link.label}
          </a>
        ))}
      </div>
    </>
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
    <span className="min-w-0 truncate text-sm text-slate-500">
      {coords}
      {coords && w3w ? ' · ' : null}
      {w3w}
    </span>
  )
}
