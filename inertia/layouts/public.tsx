import { type ReactNode } from 'react'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-full bg-neutral-200 text-slate-800">{children}</div>
}

export function withPublicLayout(page: ReactNode) {
  return <PublicLayout>{page}</PublicLayout>
}
