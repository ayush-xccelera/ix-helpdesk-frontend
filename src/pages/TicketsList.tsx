import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Plus, Search, ArrowUpDown } from 'lucide-react'
import { listTickets } from '../api/tickets'
import { listUsers } from '../api/users'
import { useAuth } from '../auth/AuthContext'
import { StatusChip, PriorityChip, SlaBadge } from '../components/Chips'
import { Pagination } from '../components/Pagination'
import { EmptyState } from '../components/EmptyState'
import { SkeletonRows } from '../components/Skeleton'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import {
  CATEGORY_LABELS,
  DEFAULT_PAGE_SIZE,
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
  TICKET_STATUSES,
} from '../constants'
import type { TicketCategory, TicketPriority, TicketStatus } from '../types'

const SORTABLE_COLUMNS: { key: string; label: string }[] = [
  { key: 'createdAt', label: 'Created' },
  { key: 'status', label: 'Status' },
  { key: 'priority', label: 'Priority' },
]

export function TicketsList(): JSX.Element {
  const navigate = useNavigate()
  const { role } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()

  const [searchInput, setSearchInput] = useState(searchParams.get('q') ?? '')
  const debouncedSearch = useDebouncedValue(searchInput, 300)

  const page = Number(searchParams.get('page') ?? '1')
  const pageSize = Number(searchParams.get('pageSize') ?? String(DEFAULT_PAGE_SIZE))
  const status = (searchParams.get('status') as TicketStatus | null) ?? ''
  const priority = (searchParams.get('priority') as TicketPriority | null) ?? ''
  const category = (searchParams.get('category') as TicketCategory | null) ?? ''
  const assigneeId = searchParams.get('assigneeId') ?? ''
  const sort = searchParams.get('sort') ?? 'createdAt:desc'

  function updateParams(patch: Record<string, string | number | undefined>): void {
    const next = new URLSearchParams(searchParams)
    Object.entries(patch).forEach(([key, value]) => {
      if (value === undefined || value === '') {
        next.delete(key)
      } else {
        next.set(key, String(value))
      }
    })
    setSearchParams(next)
  }

  // Keep the URL in sync with the debounced search text, resetting to page 1.
  useMemo(() => {
    if (debouncedSearch !== (searchParams.get('q') ?? '')) {
      updateParams({ q: debouncedSearch || undefined, page: 1 })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch])

  const canFilterByAssignee = role === 'admin' || role === 'agent'

  const { data: agentsData } = useQuery({
    queryKey: ['users', 'agent'],
    queryFn: () => listUsers({ role: 'agent', page: 1, pageSize: 100 }),
    enabled: canFilterByAssignee,
  })

  const { data, isLoading, isError } = useQuery({
    queryKey: ['tickets', { page, pageSize, status, priority, category, assigneeId, q: debouncedSearch, sort }],
    queryFn: () =>
      listTickets({
        page,
        pageSize,
        status: status || undefined,
        priority: priority || undefined,
        category: category || undefined,
        assigneeId: assigneeId || undefined,
        q: debouncedSearch || undefined,
        sort,
      }),
  })

  const [sortField, sortDirection] = sort.split(':') as [string, 'asc' | 'desc']

  function toggleSort(field: string): void {
    const nextDirection = sortField === field && sortDirection === 'desc' ? 'asc' : 'desc'
    updateParams({ sort: `${field}:${nextDirection}`, page: 1 })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-ink">Tickets</h1>
        <button
          type="button"
          onClick={() => navigate('/tickets/new')}
          className="flex items-center justify-center gap-2 rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Create ticket
        </button>
      </div>

      <div className="rounded-card border border-border bg-surface p-4 shadow-card">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search tickets by title..."
              aria-label="Search tickets"
              className="w-full rounded-md border border-border py-2 pl-9 pr-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          <select
            aria-label="Filter by status"
            value={status}
            onChange={(event) => updateParams({ status: event.target.value || undefined, page: 1 })}
            className="rounded-md border border-border px-3 py-2 text-sm"
          >
            <option value="">All statuses</option>
            {TICKET_STATUSES.map((value) => (
              <option key={value} value={value}>
                {value.replace('_', ' ')}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by priority"
            value={priority}
            onChange={(event) => updateParams({ priority: event.target.value || undefined, page: 1 })}
            className="rounded-md border border-border px-3 py-2 text-sm"
          >
            <option value="">All priorities</option>
            {TICKET_PRIORITIES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by category"
            value={category}
            onChange={(event) => updateParams({ category: event.target.value || undefined, page: 1 })}
            className="rounded-md border border-border px-3 py-2 text-sm"
          >
            <option value="">All categories</option>
            {TICKET_CATEGORIES.map((value) => (
              <option key={value} value={value}>
                {CATEGORY_LABELS[value]}
              </option>
            ))}
          </select>

          {canFilterByAssignee && (
            <select
              aria-label="Filter by assignee"
              value={assigneeId}
              onChange={(event) => updateParams({ assigneeId: event.target.value || undefined, page: 1 })}
              className="rounded-md border border-border px-3 py-2 text-sm"
            >
              <option value="">All assignees</option>
              {agentsData?.items.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.fullName}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-card border border-border bg-surface shadow-card">
        {isLoading ? (
          <div className="p-4">
            <SkeletonRows rows={6} columns={7} />
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-sm text-muted">Unable to load tickets right now.</div>
        ) : !data || data.items.length === 0 ? (
          <EmptyState
            title="No tickets yet"
            description="There are no tickets matching your current filters."
            action={
              <button
                type="button"
                onClick={() => navigate('/tickets/new')}
                className="mt-2 rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
              >
                Create your first ticket
              </button>
            }
          />
        ) : (
          <>
            <table className="min-w-full divide-y divide-border text-left text-sm">
              <thead className="bg-neutral-50 text-xs font-semibold uppercase text-muted">
                <tr>
                  <th className="px-4 py-3">Number</th>
                  <th className="px-4 py-3">Title</th>
                  {SORTABLE_COLUMNS.map((column) => (
                    <th key={column.key} className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleSort(column.key)}
                        className="flex items-center gap-1 hover:text-ink"
                      >
                        {column.label}
                        <ArrowUpDown className="h-3 w-3" aria-hidden="true" />
                      </button>
                    </th>
                  ))}
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Requester</th>
                  <th className="px-4 py-3">Assignee</th>
                  <th className="px-4 py-3">SLA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.items.map((ticket) => (
                  <tr
                    key={ticket.id}
                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                    className="cursor-pointer hover:bg-neutral-50"
                  >
                    <td className="px-4 py-3 font-medium text-ink">{ticket.number}</td>
                    <td className="px-4 py-3 text-ink">{ticket.title}</td>
                    <td className="px-4 py-3">
                      <StatusChip status={ticket.status} />
                    </td>
                    <td className="px-4 py-3">
                      <PriorityChip priority={ticket.priority} />
                    </td>
                    <td className="px-4 py-3 text-muted">{CATEGORY_LABELS[ticket.category]}</td>
                    <td className="px-4 py-3 text-muted">{ticket.requester.fullName}</td>
                    <td className="px-4 py-3 text-muted">{ticket.assignee?.fullName ?? 'Unassigned'}</td>
                    <td className="px-4 py-3">
                      <SlaBadge slaBreached={ticket.slaBreached} slaDueAt={ticket.slaDueAt} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              page={data.page}
              pageSize={data.pageSize}
              total={data.total}
              onPageChange={(nextPage) => updateParams({ page: nextPage })}
              onPageSizeChange={(nextPageSize) => updateParams({ pageSize: nextPageSize, page: 1 })}
            />
          </>
        )}
      </div>
    </div>
  )
}
