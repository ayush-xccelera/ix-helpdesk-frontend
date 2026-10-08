import type { TicketPriority, TicketStatus } from '../types'
import { PRIORITY_LABELS, STATUS_LABELS } from '../constants'

const STATUS_STYLES: Record<TicketStatus, string> = {
  open: 'bg-primary-50 text-primary-600',
  in_progress: 'bg-warning-50 text-warning-600',
  resolved: 'bg-success-50 text-success-600',
  closed: 'bg-neutral-100 text-neutral-600',
}

const PRIORITY_STYLES: Record<TicketPriority, string> = {
  low: 'bg-neutral-100 text-neutral-600',
  medium: 'bg-warning-50 text-warning-600',
  high: 'bg-orange-500/10 text-orange-500',
  urgent: 'bg-danger-50 text-danger-600',
}

export function StatusChip({ status }: { status: TicketStatus }): JSX.Element {
  return (
    <span className={`inline-flex items-center rounded-chip px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  )
}

export function PriorityChip({ priority }: { priority: TicketPriority }): JSX.Element {
  return (
    <span className={`inline-flex items-center rounded-chip px-2.5 py-1 text-xs font-medium ${PRIORITY_STYLES[priority]}`}>
      {PRIORITY_LABELS[priority]}
    </span>
  )
}

export function SlaBadge({ slaBreached, slaDueAt }: { slaBreached: boolean; slaDueAt: string | null }): JSX.Element {
  let colorClasses = 'bg-success-50 text-success-600'
  let label = 'On track'

  if (slaBreached) {
    colorClasses = 'bg-danger-50 text-danger-600'
    label = 'Breached'
  } else if (slaDueAt) {
    const hoursRemaining = (new Date(slaDueAt).getTime() - Date.now()) / (1000 * 60 * 60)
    if (hoursRemaining <= 24) {
      colorClasses = 'bg-warning-50 text-warning-600'
      label = 'Approaching'
    }
  }

  return (
    <span className={`inline-flex items-center gap-1 rounded-chip px-2.5 py-1 text-xs font-medium ${colorClasses}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {label}
    </span>
  )
}
