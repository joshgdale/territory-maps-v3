import {
  Cog6ToothIcon,
  DocumentTextIcon,
  LockClosedIcon,
  MagnifyingGlassIcon,
  MapIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline'
import { Link, router, usePage } from '@inertiajs/react'
import { type ReactNode } from 'react'

interface INavLink {
  href: string
  label: string
  icon: ReactNode
  inTopHalf: boolean
  isActive: (url: string) => boolean
}

export function Navbar() {
  const { url } = usePage()

  const links: INavLink[] = [
    {
      href: '/',
      label: 'Dashboard',
      icon: <Squares2X2Icon className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden />,
      inTopHalf: true,
      isActive: (path) => path === '/' || path === '/dashboard',
    },
    {
      href: '/search',
      label: 'Search',
      icon: <MagnifyingGlassIcon className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden />,
      inTopHalf: true,
      isActive: (path) => path.startsWith('/search'),
    },
    {
      href: '/maps?s=code',
      label: 'Maps',
      icon: <MapIcon className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden />,
      inTopHalf: true,
      isActive: (path) => path.startsWith('/maps'),
    },
    {
      href: '/documents',
      label: 'Documents',
      icon: <DocumentTextIcon className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden />,
      inTopHalf: true,
      isActive: (path) => path.startsWith('/documents'),
    },
    {
      href: '/settings',
      label: 'Settings',
      icon: <Cog6ToothIcon className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden />,
      inTopHalf: false,
      isActive: (path) => path.startsWith('/settings'),
    },
  ]

  const pathname = new URL(url, 'http://localhost').pathname

  return (
    <aside className="pl-safe-left fixed bottom-0 left-0 top-0 bg-slate-700 shadow-md">
      <div
        className="flex h-full w-12 flex-col items-center space-y-3 overflow-y-scroll py-3 sm:w-14 sm:space-y-0"
        style={{ scrollbarWidth: 'none' }}
      >
        {links
          .filter((l) => l.inTopHalf)
          .map((link) => (
            <DisplayLink {...link} key={link.href} pathname={pathname} />
          ))}
        <div className="min-h-[2rem] flex-1"></div>
        {links
          .filter((l) => !l.inTopHalf)
          .map((link) => (
            <DisplayLink {...link} key={link.href} pathname={pathname} />
          ))}
        <button
          title="Log Out"
          className="inline-flex w-full justify-center border-x-2 border-slate-700 py-2 text-white transition-colors hover:border-slate-600 hover:bg-slate-600 sm:py-3"
          type="button"
          onClick={() => router.post('/logout')}
        >
          <LockClosedIcon className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden />
          <span className="sr-only">Log Out</span>
        </button>
      </div>
    </aside>
  )
}

function DisplayLink(data: INavLink & { pathname: string }) {
  const classes =
    'py-2 text-white transition-colors sm:py-3 border-x-2 border-slate-700 inline-flex w-full justify-center'
  const isActive = data.isActive(data.pathname)

  return (
    <Link
      href={data.href}
      title={data.label}
      className={
        isActive
          ? ` border-l-white border-r-slate-800 bg-slate-800 ${classes}`
          : ` hover:border-slate-600 hover:bg-slate-600 ${classes}`
      }
    >
      {data.icon}
      <span className="sr-only">{data.label}</span>
    </Link>
  )
}
