import type { LucideIcon } from 'lucide-react'

interface KpiCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  accentClassName: string
}

export function KpiCard({ label, value, icon: Icon, accentClassName }: KpiCardProps): JSX.Element {
  return (
    <div className="rounded-card border border-border bg-surface p-5 shadow-card">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted">{label}</span>
        <span className={`rounded-full p-2 ${accentClassName}`}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-bold text-ink">{value}</p>
    </div>
  )
}
