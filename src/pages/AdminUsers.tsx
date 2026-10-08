import { useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { createUser, listUsers, updateUser } from '../api/users'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { EmptyState } from '../components/EmptyState'
import { Pagination } from '../components/Pagination'
import { SkeletonRows } from '../components/Skeleton'
import { validateEmail, validatePassword, validateRequired } from '../validation'
import { DEFAULT_PAGE_SIZE, ROLES } from '../constants'
import type { Role, User } from '../types'

export function AdminUsers(): JSX.Element {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [searchInput, setSearchInput] = useState('')

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [pendingDeactivation, setPendingDeactivation] = useState<User | null>(null)

  const usersQuery = useQuery({
    queryKey: ['admin-users', { page, pageSize, q: searchInput }],
    queryFn: () => listUsers({ page, pageSize, q: searchInput || undefined }),
  })

  const toggleActiveMutation = useMutation({
    mutationFn: (user: User) => updateUser(user.id, { isActive: !user.isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success('User status updated')
    },
  })

  const changeRoleMutation = useMutation({
    mutationFn: ({ user, role }: { user: User; role: Role }) => updateUser(user.id, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success('User role updated')
    },
  })

  const handleDeactivateConfirm = (): void => {
    if (pendingDeactivation) {
      toggleActiveMutation.mutate(pendingDeactivation)
    }
    setPendingDeactivation(null)
  }

  const handleToggleActive = (user: User): void => {
    if (user.isActive) {
      setPendingDeactivation(user)
    } else {
      toggleActiveMutation.mutate(user)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-ink">Users</h1>
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Create user
        </button>
      </div>

      <div className="rounded-card border border-border bg-surface p-4 shadow-card">
        <input
          type="search"
          value={searchInput}
          onChange={(event) => {
            setSearchInput(event.target.value)
            setPage(1)
          }}
          placeholder="Search by name or email..."
          aria-label="Search users"
          className="w-full max-w-sm rounded-md border border-border px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>

      <div className="overflow-x-auto rounded-card border border-border bg-surface shadow-card">
        {usersQuery.isLoading ? (
          <div className="p-4">
            <SkeletonRows rows={5} columns={5} />
          </div>
        ) : usersQuery.isError ? (
          <div className="p-8 text-center text-sm text-muted">Unable to load users right now.</div>
        ) : !usersQuery.data || usersQuery.data.items.length === 0 ? (
          <EmptyState title="No users found" description="Try a different search or create a new user." />
        ) : (
          <>
            <table className="min-w-full divide-y divide-border text-left text-sm">
              <thead className="bg-neutral-50 text-xs font-semibold uppercase text-muted">
                <tr>
                  <th className="px-4 py-3">Full name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {usersQuery.data.items.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-3 font-medium text-ink">{user.fullName}</td>
                    <td className="px-4 py-3 text-muted">{user.email}</td>
                    <td className="px-4 py-3">
                      <select
                        aria-label={`Role for ${user.fullName}`}
                        value={user.role}
                        onChange={(event) => changeRoleMutation.mutate({ user, role: event.target.value as Role })}
                        className="rounded-md border border-border px-2 py-1 text-sm"
                      >
                        {ROLES.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-chip px-2.5 py-1 text-xs font-medium ${
                          user.isActive ? 'bg-success-50 text-success-600' : 'bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(user)}
                        disabled={toggleActiveMutation.isPending}
                        className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-ink hover:bg-neutral-100 disabled:opacity-60"
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              page={usersQuery.data.page}
              pageSize={usersQuery.data.pageSize}
              total={usersQuery.data.total}
              onPageChange={setPage}
              onPageSizeChange={(nextPageSize) => {
                setPageSize(nextPageSize)
                setPage(1)
              }}
            />
          </>
        )}
      </div>

      <CreateUserModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />

      <ConfirmDialog
        isOpen={Boolean(pendingDeactivation)}
        title="Deactivate user"
        message={`Are you sure you want to deactivate ${pendingDeactivation?.fullName}? They will no longer be able to log in.`}
        confirmLabel="Deactivate"
        isDanger
        onConfirm={handleDeactivateConfirm}
        onCancel={() => setPendingDeactivation(null)}
      />
    </div>
  )
}

function CreateUserModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }): JSX.Element | null {
  const queryClient = useQueryClient()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('agent')
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const createMutation = useMutation({
    mutationFn: () => createUser({ fullName: fullName.trim(), email: email.trim(), password, role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success('User created')
      setFullName('')
      setEmail('')
      setPassword('')
      setRole('agent')
      setHasAttemptedSubmit(false)
      onClose()
    },
    onError: (error: unknown) => {
      const message = (error as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error
        ?.message
      setSubmitError(message || 'Unable to create the user. Please try again.')
    },
  })

  if (!isOpen) {
    return null
  }

  const fullNameError = validateRequired(fullName, 'Full name')
  const emailError = validateEmail(email)
  const passwordError = validatePassword(password)
  const isValid = !fullNameError && !emailError && !passwordError

  const handleSubmit = (event: FormEvent): void => {
    event.preventDefault()
    setHasAttemptedSubmit(true)
    setSubmitError('')
    if (!isValid) {
      return
    }
    createMutation.mutate()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-user-title"
    >
      <div className="w-full max-w-md rounded-card bg-surface p-6 shadow-card">
        <h2 id="create-user-title" className="text-lg font-semibold text-ink">
          Create user
        </h2>

        {submitError && (
          <div role="alert" className="mt-3 rounded-md bg-danger-50 px-3 py-2 text-sm text-danger-600">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-4">
          <div>
            <label htmlFor="new-user-fullname" className="mb-1 block text-sm font-medium text-ink">
              Full name
            </label>
            <input
              id="new-user-fullname"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
            />
            {hasAttemptedSubmit && fullNameError && <p className="mt-1 text-xs text-danger-600">{fullNameError}</p>}
          </div>

          <div>
            <label htmlFor="new-user-email" className="mb-1 block text-sm font-medium text-ink">
              Email
            </label>
            <input
              id="new-user-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
            />
            {hasAttemptedSubmit && emailError && <p className="mt-1 text-xs text-danger-600">{emailError}</p>}
          </div>

          <div>
            <label htmlFor="new-user-password" className="mb-1 block text-sm font-medium text-ink">
              Temporary password
            </label>
            <input
              id="new-user-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
            />
            <p className="mt-1 text-xs text-muted">
              {hasAttemptedSubmit && passwordError ? (
                <span className="text-danger-600">{passwordError}</span>
              ) : (
                'At least 8 characters, including one letter and one digit.'
              )}
            </p>
          </div>

          <div>
            <label htmlFor="new-user-role" className="mb-1 block text-sm font-medium text-ink">
              Role
            </label>
            <select
              id="new-user-role"
              value={role}
              onChange={(event) => setRole(event.target.value as Role)}
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
            >
              {ROLES.map((roleOption) => (
                <option key={roleOption} value={roleOption}>
                  {roleOption}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-border px-4 py-2 text-sm font-medium text-ink hover:bg-neutral-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={(hasAttemptedSubmit && !isValid) || createMutation.isPending}
              className="flex items-center gap-2 rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              Create user
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
