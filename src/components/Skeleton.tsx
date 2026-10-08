export function Skeleton({ className = '' }: { className?: string }): JSX.Element {
  return <div className={`animate-pulse rounded bg-neutral-200 ${className}`} />
}

export function SkeletonRows({ rows = 5, columns = 6 }: { rows?: number; columns?: number }): JSX.Element {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4">
          {Array.from({ length: columns }).map((__, columnIndex) => (
            <Skeleton key={columnIndex} className="h-6 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function SkeletonCard(): JSX.Element {
  return (
    <div className="rounded-card border border-border bg-surface p-5 shadow-card">
      <Skeleton className="mb-3 h-4 w-24" />
      <Skeleton className="h-8 w-16" />
    </div>
  )
}
