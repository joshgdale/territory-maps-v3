import { type ReactNode, useState } from 'react'
import { Button } from './Button'

interface IDownloadLink {
  children: ReactNode
  url: string
  fileName: string
  className?: string
  intent?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline'
}

export function DownloadLink(props: IDownloadLink) {
  const [isLoading, setIsLoading] = useState(false)

  async function download() {
    try {
      setIsLoading(true)

      const response = await fetch(props.url)
      const blob = await response.blob()
      const a = document.createElement('a')
      const pdfUrl = window.URL.createObjectURL(blob)

      a.href = pdfUrl
      a.download = props.fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(pdfUrl)
    } catch {
      // download failed silently
    } finally {
      setIsLoading(false)
    }
  }

  if (props.className) {
    return (
      <button onClick={download} disabled={isLoading} className={props.className}>
        {props.children}
      </button>
    )
  }

  return (
    <Button intent={props.intent ?? 'outline'} onClick={download} disabled={isLoading} hasIcon>
      {props.children}
    </Button>
  )
}
