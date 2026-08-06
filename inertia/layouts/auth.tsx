import { toast, Toaster } from 'sonner'
import { usePage } from '@inertiajs/react'
import { type ReactNode, useEffect } from 'react'
import { type Data } from '@generated/data'

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { url, props } = usePage<Data.SharedProps>()

  useEffect(() => {
    toast.dismiss()
  }, [url])

  useEffect(() => {
    if (props.flash?.error) toast.error(props.flash.error)
    if (props.flash?.success) toast.success(props.flash.success)
  })

  return (
    <div className="flex min-h-full flex-col justify-center">
      {children}
      <Toaster position="bottom-right" richColors />
    </div>
  )
}

export function withAuthLayout(page: ReactNode) {
  return <AuthLayout>{page}</AuthLayout>
}
