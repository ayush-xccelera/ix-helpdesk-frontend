import { useQuery } from '@tanstack/react-query'
import { AlertTriangle, Clock, Inbox } from 'lucide-react'
import { fetchDashboardSummary } from '../api/dashboard'
import { KpiCard } from '../components/KpiCard'
import { BarChart } from '../components/BarChart'
import { MiniLineChart } from '../components/MiniLineChart'
import { SkeletonCard } from '../components/Skeleton'
import { STATUS_LABELS, PRIORITY_LABELS } from '../constants'
import type { TicketPriority, TicketStatus } from '../types'

const STATUS_COLORS: Record<string, string> = {
  open: 'bg-primary-500',
  in_progress: 'bg-warning-500',
  resolved: 'bg-success-500',
  closed: 'bg-neutral-400',
}

const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-neutral-400',
  medium: 'bg-warning-500',
  high: 'bg-orange-500',
  urgent: 'bg-danger-500',
}

export function Dashboard(): JSX.Element {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: fetchDashboardSummary,
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="rounded-card border border-border bg-surface p-6 text-center text-sm text-muted">
        Unable to load dashboard data right now. Please try again shortly.
      </div>
    )
  }

  const statusData = Object.entries(data.byStatus).map(([status, value]) => ({
    label: STATUS_LABELS[status as TicketStatus] ?? status,
    value,
    colorClassName: STATUS_COLORS[status] ?? 'bg-primary-500',
  }))

  const priorityData = Object.entries(data.byPriority).map(([priority, value]) => ({
    label: PRIORITY_LABELS[priority as TicketPriority] ?? priority,
    value,
    colorClassName: PRIORITY_COLORS[priority] ?? 'bg-primary-500',
  }))

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-ink">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard label="Open tickets" value={data.totalOpen} icon={Inbox} accentClassName="bg-primary-50 text-primary-500" />
        <KpiCard
          label="SLA breached"
          value={data.slaBreached}
          icon={AlertTriangle}
          accentClassName="bg-danger-50 text-danger-500"
        />
        <KpiCard
          label="Avg. resolution (hrs)"
          value={data.avgResolutionHours.toFixed(1)}
          icon={Clock}
          accentClassName="bg-success-50 text-success-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <BarChart title="Tickets by status" data={statusData} />
        <BarChart title="Tickets by priority" data={priorityData} />
      </div>

      <MiniLineChart title="Tickets created — last 7 days" data={data.createdLast7Days} />
    </div>
  )
}
