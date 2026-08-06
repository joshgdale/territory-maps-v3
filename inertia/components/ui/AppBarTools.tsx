import { type ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface IAppBarTools {
  children: ReactNode
}

export function AppBarTools(props: IAppBarTools) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return createPortal(
    props.children,
    document.getElementById('app-bar-tools') || document.body
  )
}
