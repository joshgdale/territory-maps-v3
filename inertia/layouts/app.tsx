import { toast, Toaster } from 'sonner'
import { usePage } from '@inertiajs/react'
import { type ReactNode, useEffect } from 'react'
import { type Data } from '@generated/data'
import { Navbar } from '~/components/ui/Navbar'
import { type CongregationUser } from '~/lib/types'

type PageProps = Data.SharedProps & {
  user?: CongregationUser
}

export default function AppLayout({ children, title }: { children: ReactNode; title?: string }) {
  const { url, props } = usePage<PageProps>()

  useEffect(() => {
    toast.dismiss()
  }, [url])

  useEffect(() => {
    if (props.flash?.error) toast.error(props.flash.error)
    if (props.flash?.success) toast.success(props.flash.success)
  })

  return (
    <>
      <div className="pl-safe-left fixed left-12 right-0 top-0 z-50 sm:left-14">
        <div className="bg-slate-700"></div>
        <header className="flex items-center justify-between gap-2 bg-white px-4 py-2 shadow-md sm:px-6 sm:py-4">
          <div className="overflow-x-scroll" style={{ scrollbarWidth: 'none' }}>
            <h1 className="whitespace-nowrap text-2xl font-bold text-slate-800 sm:text-3xl">
              {title ?? 'Territory Maps'}
            </h1>
          </div>
          <div id="app-bar-tools" className="pr-safe-right flex gap-4 sm:gap-6"></div>
        </header>
      </div>
      <Navbar />
      <main className="pl-safe-left pr-safe-right ml-12 mt-[48px] h-full flex-1 overflow-y-scroll sm:ml-14 sm:mt-[68px]">
        <div className="p-4 sm:p-6">{children}</div>
        {props.user ? (
          <footer className="py-4 text-center text-xs text-slate-600 sm:py-6">
            <span>{props.user.name} Territory</span>
          </footer>
        ) : null}
      </main>
      <Toaster position="bottom-right" richColors />
    </>
  )
}

export function withAppLayout(page: ReactNode, title?: string) {
  return <AppLayout title={title}>{page}</AppLayout>
}
