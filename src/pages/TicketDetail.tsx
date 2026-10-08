import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Loader2, Pencil, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'
import { createComment, getTicket, listComments, listTicketHistory, updateTicket } from '../api/tickets'
import { listUsers } from '../api/users'
import { useAuth } from '../auth/AuthContext'
import { StatusChip, PriorityChip, SlaBadge } from '../components/Chips'
import { Skeleton } from '../components/Skeleton'
import { formatDateTime } from '../utils/format'
import { validateRequired } from '../validation'
import { CATEGORY_LABELS, STATUS_LABELS, STATUS_TRANSITIONS } from '../constants'
import type { TicketStatus } from '../types'

export function TicketDetail(): JSX.Element {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { role, user } = useAuth()
  const queryClient = useQueryClient()

  const canManage = role === 'admin' || role === 'agent'

  const [transitionError, setTransitionError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [commentBody, setCommentBody] = useState('')
  const [isInternal, setIsInternal] = useState(false)
  const [hasAttemptedCommentSubmit, setHasAttemptedCommentSubmit] = useState(false)

  const ticketQuery = useQuery({
    queryKey: ['ticket', id],
    queryFn: () => getTicket(id as string),
    enabled: Boolean(id),
  })

  const commentsQuery = useQuery({
    queryKey: ['ticket', id, 'comments'],
    queryFn: () => listComments(id as string),
    enabled: Boolean(id),
  })

  const historyQuery = useQuery({
    queryKey: ['ticket', id, 'history'],
    queryFn: () => listTicketHistory(id as string),
    enabled: Boolean(id),
  })

  const agentsQuery = useQuery({
    queryKey: ['users', 'agent'],
    queryFn: () => listUsers({ role: 'agent', page: 1, pageSize: 100 }),
    enabled: canManage,
  })

  const updateMutation = useMutation({
    mutationFn: (input: Parameters<typeof updateTicket>[1]) => updateTicket(id as string, input),
    onSuccess: (updatedTicket) => {
      queryClient.setQueryData(['ticket', id], updatedTicket)
      queryClient.invalidateQueries({ queryKey: ['ticket', id, 'history'] })
      setTransitionError('')
      setIsEditing(false)
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { status?: number; data?: { error?: { message?: string } } } }
      if (axiosError.response?.status === 409) {
        setTransitionError(axiosError.response.data?.error?.message || 'This status change is not allowed from the current state.')
      } else if (axiosError.response?.status === 403) {
        setTransitionError('You do not have permission to make this change.')
      } else {
        setTransitionError('Unable to update the ticket. Please try again.')
      }
    },
  })

  const commentMutation = useMutation({
    mutationFn: () => createComment(id as string, { body: commentBody.trim(), internal: isInternal }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', id, 'comments'] })
      setCommentBody('')
      setIsInternal(false)
      setHasAttemptedCommentSubmit(false)
      toast.success('Comment added')
    },
  })

  const ticket = ticketQuery.data
  const allowedTransitions = useMemo(() => {
    if (!ticket) return []
    return STATUS_TRANSITIONS[ticket.status] ?? []
  }, [ticket])

  const visibleComments = useMemo(() => {
    if (!commentsQuery.data) return []
    if (canManage) return commentsQuery.data
    return commentsQuery.data.filter((comment) => !comment.internal)
  }, [commentsQuery.data, canManage])

  if (ticketQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  if (ticketQuery.isError || !ticket) {
    return (
      <div className="rounded-card border border-border bg-surface p-6 text-center text-sm text-muted">
        Unable to load this ticket. It may not exist or you may not have access.
      </div>
    )
  }

  const handleTransition = (nextStatus: TicketStatus): void => {
    updateMutation.mutate({ status: nextStatus })
  }

  const handleAssigneeChange = (assigneeId: string): void => {
    updateMutation.mutate({ assigneeId: assigneeId || null })
  }

  const startEditing = (): void => {
    setEditTitle(ticket.title)
    setEditDescription(ticket.description)
    setIsEditing(true)
  }

  const handleEditSubmit = (event: FormEvent): void => {
    event.preventDefault()
    const titleError = validateRequired(editTitle, 'Title')
    const descriptionError = validateRequired(editDescription, 'Description')
    if (titleError || descriptionError) {
      return
    }
    updateMutation.mutate({ title: editTitle.trim(), description: editDescription })
  }

  const handleCommentSubmit = (event: FormEvent): void => {
    event.preventDefault()
    setHasAttemptedCommentSubmit(true)
    if (!commentBody.trim()) {
      return
    }
    commentMutation.mutate()
  }

  const canEditTicket = canManage || (role === 'customer' && ticket.requester.id === user?.id && ticket.status === 'open')

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <button
        type="button"
        onClick={() => navigate('/tickets')}
        className="flex items-center gap-1 text-sm font-medium text-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to tickets
      </button>

      <div className="rounded-card border border-border bg-surface p-6 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted">{ticket.number}</p>
            {isEditing ? (
              <form onSubmit={handleEditSubmit} className="mt-2 space-y-3">
                <div>
                  <label htmlFor="edit-title" className="sr-only">
                    Title
                  </label>
                  <input
                    id="edit-title"
                    value={editTitle}
                    onChange={(event) => setEditTitle(event.target.value)}
                    className="w-full rounded-md border border-border px-3 py-2 text-lg font-bold"
                  />
                </div>
                <div>
                  <label htmlFor="edit-description" className="sr-only">
                    Description
                  </label>
                  <textarea
                    id="edit-description"
                    rows={4}
                    value={editDescription}
                    onChange={(event) => setEditDescription(event.target.value)}
                    className="w-full rounded-md border border-border px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="rounded-md bg-primary-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-600"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-ink hover:bg-neutral-100"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <h1 className="mt-1 text-xl font-bold text-ink">{ticket.title}</h1>
            )}
          </div>
          {!isEditing && canEditTicket && (
            <button
              type="button"
              onClick={startEditing}
              className="flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-ink hover:bg-neutral-100"
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
              Edit
            </button>
          )}
        </div>

        {!isEditing && <p className="mt-3 whitespace-pre-wrap text-sm text-muted">{ticket.description}</p>}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <StatusChip status={ticket.status} />
          <PriorityChip priority={ticket.priority} />
          <SlaBadge slaBreached={ticket.slaBreached} slaDueAt={ticket.slaDueAt} />
          <span className="rounded-chip bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600">
            {CATEGORY_LABELS[ticket.category]}
          </span>
        </div>

        <dl className="mt-5 grid grid-cols-1 gap-4 border-t border-border pt-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase text-muted">Requester</dt>
            <dd className="text-ink">{ticket.requester.fullName}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-muted">Assignee</dt>
            <dd className="text-ink">
              {canManage ? (
                <select
                  aria-label="Assignee"
                  value={ticket.assignee?.id ?? ''}
                  onChange={(event) => handleAssigneeChange(event.target.value)}
                  className="mt-1 rounded-md border border-border px-2 py-1 text-sm"
                >
                  <option value="">Unassigned</option>
                  {agentsQuery.data?.items.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.fullName}
                    </option>
                  ))}
                </select>
              ) : (
                ticket.assignee?.fullName ?? 'Unassigned'
              )}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-muted">SLA due</dt>
            <dd className="text-ink">{formatDateTime(ticket.slaDueAt)}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-muted">Created / Updated</dt>
            <dd className="text-ink">
              {formatDateTime(ticket.createdAt)} / {formatDateTime(ticket.updatedAt)}
            </dd>
          </div>
          {ticket.resolvedAt && (
            <div>
              <dt className="text-xs font-medium uppercase text-muted">Resolved</dt>
              <dd className="text-ink">{formatDateTime(ticket.resolvedAt)}</dd>
            </div>
          )}
        </dl>

        {canManage && (
          <div className="mt-5 border-t border-border pt-4">
            <p className="mb-2 text-xs font-medium uppercase text-muted">Status workflow</p>
            {transitionError && (
              <div role="alert" className="mb-3 rounded-md bg-danger-50 px-3 py-2 text-sm text-danger-600">
                {transitionError}
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {allowedTransitions
                .filter((next) => next !== 'open')
                .map((next) => (
                  <button
                    key={next}
                    type="button"
                    disabled={updateMutation.isPending}
                    onClick={() => handleTransition(next)}
                    className="flex items-center gap-1 rounded-md bg-primary-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-600 disabled:opacity-60"
                  >
                    {updateMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />}
                    Move to {STATUS_LABELS[next]}
                  </button>
                ))}
              {ticket.status !== 'open' && (
                <button
                  type="button"
                  disabled={updateMutation.isPending}
                  onClick={() => handleTransition('open')}
                  className="flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-ink hover:bg-neutral-100 disabled:opacity-60"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  Reopen
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-card border border-border bg-surface p-6 shadow-card">
        <h2 className="mb-4 text-lg font-semibold text-ink">Comments</h2>

        {commentsQuery.isLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : visibleComments.length === 0 ? (
          <p className="text-sm text-muted">No comments yet.</p>
        ) : (
          <ul className="space-y-3">
            {visibleComments.map((comment) => (
              <li
                key={comment.id}
                className={`rounded-md border p-3 text-sm ${
                  comment.internal ? 'border-warning-500 bg-warning-50' : 'border-border bg-neutral-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-ink">{comment.author.fullName}</span>
                  <span className="text-xs text-muted">{formatDateTime(comment.createdAt)}</span>
                </div>
                {comment.internal && <p className="mt-0.5 text-xs font-semibold text-warning-600">Internal note</p>}
                <p className="mt-1 whitespace-pre-wrap text-ink">{comment.body}</p>
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={handleCommentSubmit} noValidate className="mt-4 space-y-2">
          <label htmlFor="comment-body" className="block text-sm font-medium text-ink">
            Add a comment
          </label>
          <textarea
            id="comment-body"
            rows={3}
            value={commentBody}
            onChange={(event) => setCommentBody(event.target.value)}
            className="w-full rounded-md border border-border px-3 py-2 text-sm"
          />
          {hasAttemptedCommentSubmit && !commentBody.trim() && (
            <p className="text-xs text-danger-600">Comment cannot be empty</p>
          )}
          <div className="flex items-center justify-between">
            {canManage ? (
              <label className="flex items-center gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={isInternal}
                  onChange={(event) => setIsInternal(event.target.checked)}
                />
                Internal note (not visible to customer)
              </label>
            ) : (
              <span />
            )}
            <button
              type="submit"
              disabled={commentMutation.isPending || (hasAttemptedCommentSubmit && !commentBody.trim())}
              className="flex items-center gap-2 rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {commentMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              Post comment
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-card border border-border bg-surface p-6 shadow-card">
        <h2 className="mb-4 text-lg font-semibold text-ink">History</h2>
        {historyQuery.isLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : !historyQuery.data || historyQuery.data.length === 0 ? (
          <p className="text-sm text-muted">No history recorded yet.</p>
        ) : (
          <ol className="space-y-4 border-l border-border pl-4">
            {historyQuery.data.map((entry) => (
              <li key={entry.id} className="relative">
                <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-primary-500" />
                <p className="text-sm font-medium text-ink">{entry.action}</p>
                <p className="text-xs text-muted">
                  {entry.actor.fullName} &middot; {formatDateTime(entry.createdAt)}
                </p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}
