# ix-helpdesk-frontend — Routes & Navigation

## How to run
cd /workspace/frontend_runs/41d5d783-e4bd-474e-8865-7edecde14092/project
npm install --legacy-peer-deps && npm run dev
Then open http://localhost:33829

## Routes

| Route | Page file | Description |
|-------|-----------|-------------|
| /login | src/pages/Login.tsx | Public. Sign in with email/password. |
| /register | src/pages/Register.tsx | Public. Create a new customer account. |
| /forgot-password | src/pages/ForgotPassword.tsx | Public. Placeholder password-reset guidance screen. |
| / | redirects | Redirects to /dashboard (admin/agent) or /tickets (customer), based on role. |
| /dashboard | src/pages/Dashboard.tsx | Admin/agent only. KPI cards + status/priority/7-day charts. |
| /tickets | src/pages/TicketsList.tsx | All authenticated roles. Searchable, filterable, sortable, paginated ticket table. Customers see only their own tickets (enforced by the backend). |
| /tickets/new | src/pages/CreateTicket.tsx | All authenticated roles. Create-ticket form. |
| /tickets/:id | src/pages/TicketDetail.tsx | All authenticated roles. Ticket detail, status workflow, assignment, comments, history. |
| /admin/users | src/pages/AdminUsers.tsx | Admin only. Paginated user table, create user, activate/deactivate, change role. |
| /profile | src/pages/Profile.tsx | All authenticated roles. Current user info + logout. |
| /403 | src/pages/Forbidden.tsx | Shown when a signed-in user lacks permission for a route. |
| * | src/pages/NotFound.tsx | Catch-all 404 page with a Go Home link. |

## Navigation map
- Login -> Register (click "Create an account")
- Login -> ForgotPassword (click "Forgot password?")
- Login -> / → role-based redirect (successful sign in)
- Register -> Login (successful registration or click "Sign in")
- ForgotPassword -> Login (click "Back to sign in")
- Sidebar: Dashboard (admin/agent) -> /dashboard
- Sidebar: Tickets (all roles) -> /tickets
- Sidebar: Users (admin only) -> /admin/users
- Sidebar: Profile (all roles) -> /profile
- TopBar: Account button -> /profile
- TopBar: Logout button -> confirm dialog -> /login
- Tickets list -> Create ticket button -> /tickets/new
- Tickets list -> click a row -> /tickets/:id
- Tickets list -> empty state "Create your first ticket" -> /tickets/new
- Create ticket -> submits -> /tickets/:id (new ticket's detail page)
- Create ticket -> Cancel -> /tickets
- Ticket detail -> Back to tickets -> /tickets
- Ticket detail -> status workflow buttons (agent/admin) -> PATCH status, stays on page
- Ticket detail -> assignee dropdown (agent/admin) -> PATCH assignee, stays on page
- Ticket detail -> comment form -> POST comment, stays on page
- Profile -> Logout button -> confirm dialog -> /login
- Any protected route while signed out -> /login (RequireAuth)
- Any route the current role cannot access -> /403 (RequireRole)
- Forbidden page -> Back to Home -> /dashboard or /tickets depending on role
- Any unknown URL -> NotFound -> Go Home -> /

## Shared components
- `src/components/Sidebar.tsx` — role-aware left navigation using NavLink active styling.
- `src/components/TopBar.tsx` — API health status dot, account button, logout with confirm dialog.
- `src/components/ConfirmDialog.tsx` — generic confirm/cancel modal used for logout and deactivate-user.
- `src/components/Chips.tsx` — `StatusChip`, `PriorityChip`, `SlaBadge` color-coded pills.
- `src/components/KpiCard.tsx` — dashboard KPI summary card.
- `src/components/BarChart.tsx` — simple CSS/SVG bar chart for status/priority breakdowns.
- `src/components/MiniLineChart.tsx` — simple SVG line chart for the 7-day ticket trend.
- `src/components/Pagination.tsx` — page/page-size controls used by Tickets and Users tables.
- `src/components/EmptyState.tsx` — empty list placeholder with optional call-to-action.
- `src/components/Skeleton.tsx` — loading skeleton primitives (`Skeleton`, `SkeletonRows`, `SkeletonCard`).
- `src/components/FullPageSpinner.tsx` — full-page loading spinner shown while auth bootstraps.
- `src/auth/AuthContext.tsx` — auth state/provider (login, register, logout, token refresh bootstrap).
- `src/auth/RequireAuth.tsx` — route guard redirecting signed-out users to /login.
- `src/auth/RequireRole.tsx` — route guard redirecting unauthorized roles to /403.

## Design tokens
- `primary` (50/100/400/500/600/700) — brand blue, e.g. `#0066cc` at 500.
- `success` (50/500/600) — green, e.g. `#28a745` at 500.
- `warning` (50/500/600) — amber, e.g. `#ffc107` at 500.
- `danger` (50/500/600) — red, e.g. `#dc3545` at 500.
- `orange-500` — `#ff9800`, used for high-priority chip accents.
- `surface` — `#ffffff` card/background surface.
- `canvas` — `#f9fafb` app background.
- `border` — `#e5e7eb` hairline borders.
- `muted` — `#6b7280` secondary text.
- `ink` — `#111827` primary text.
- `neutral` (50–900) — grayscale ramp for chips, backgrounds, and disabled states.
- `rounded-card` (10px) and `rounded-chip` (9999px) — card and pill border radii.
- `shadow-card` — subtle elevation used on all card surfaces.
