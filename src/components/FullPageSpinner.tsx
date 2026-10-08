import { Loader2 } from 'lucide-react'

export function FullPageSpinner(): JSX.Element {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-canvas">
      <Loader2 className="h-8 w-8 animate-spin text-primary-500" aria-hidden="true" />
      <span className="sr-only">Loading...</span>
    </div>
  )
}
