import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { createTicket } from '../api/tickets'
import { validateMaxLength, validateRequired } from '../validation'
import { CATEGORY_LABELS, PRIORITY_LABELS, TICKET_CATEGORIES, TICKET_PRIORITIES, TITLE_MAX_LENGTH } from '../constants'
import type { TicketCategory, TicketPriority } from '../types'

export function CreateTicket(): JSX.Element {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TicketPriority>('medium')
  const [category, setCategory] = useState<TicketCategory>('software')
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const titleRequiredError = validateRequired(title, 'Title')
  const titleLengthError = validateMaxLength(title, TITLE_MAX_LENGTH, 'Title')
  const titleError = titleRequiredError || titleLengthError
  const descriptionError = validateRequired(description, 'Description')
  const isValid = !titleError && !descriptionError

  const handleSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault()
    setHasAttemptedSubmit(true)
    setSubmitError('')

    if (!isValid) {
      return
    }

    setIsSubmitting(true)
    try {
      const ticket = await createTicket({ title: title.trim(), description, priority, category })
      navigate(`/tickets/${ticket.id}`)
    } catch (error) {
      const message =
        (error as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message
      setSubmitError(message || 'Unable to create the ticket. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-ink">Create ticket</h1>

      {submitError && (
        <div role="alert" className="mb-4 rounded-md bg-danger-50 px-3 py-2 text-sm text-danger-600">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5 rounded-card border border-border bg-surface p-6 shadow-card">
        <div>
          <label htmlFor="ticket-title" className="mb-1 block text-sm font-medium text-ink">
            Title
          </label>
          <input
            id="ticket-title"
            type="text"
            value={title}
            maxLength={TITLE_MAX_LENGTH}
            onChange={(event) => setTitle(event.target.value)}
            aria-describedby="ticket-title-help"
            className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          <p id="ticket-title-help" className="mt-1 text-xs text-muted">
            {hasAttemptedSubmit && titleError ? (
              <span className="text-danger-600">{titleError}</span>
            ) : (
              `Up to ${TITLE_MAX_LENGTH} characters (${title.length}/${TITLE_MAX_LENGTH}).`
            )}
          </p>
        </div>

        <div>
          <label htmlFor="ticket-description" className="mb-1 block text-sm font-medium text-ink">
            Description
          </label>
          <textarea
            id="ticket-description"
            rows={6}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            aria-describedby="ticket-description-help"
            className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          <p id="ticket-description-help" className="mt-1 text-xs text-muted">
            {hasAttemptedSubmit && descriptionError ? (
              <span className="text-danger-600">{descriptionError}</span>
            ) : (
              'Describe the issue in as much detail as possible.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="ticket-priority" className="mb-1 block text-sm font-medium text-ink">
              Priority
            </label>
            <select
              id="ticket-priority"
              value={priority}
              onChange={(event) => setPriority(event.target.value as TicketPriority)}
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
            >
              {TICKET_PRIORITIES.map((value) => (
                <option key={value} value={value}>
                  {PRIORITY_LABELS[value]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="ticket-category" className="mb-1 block text-sm font-medium text-ink">
              Category
            </label>
            <select
              id="ticket-category"
              value={category}
              onChange={(event) => setCategory(event.target.value as TicketCategory)}
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
            >
              {TICKET_CATEGORIES.map((value) => (
                <option key={value} value={value}>
                  {CATEGORY_LABELS[value]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/tickets')}
            className="rounded-md border border-border px-4 py-2 text-sm font-medium text-ink hover:bg-neutral-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={(hasAttemptedSubmit && !isValid) || isSubmitting}
            className="flex items-center gap-2 rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            Create ticket
          </button>
        </div>
      </form>
    </div>
  )
}
