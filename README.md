# ix-helpdesk-frontend

An enterprise-style IT Helpdesk web app ("HelpDesk") for managing support tickets. Customers
can submit and track their own tickets; agents and admins triage, assign, comment on and resolve
tickets from a shared dashboard; admins additionally manage user accounts and roles.

## Tech stack

React + TypeScript, Vite, Tailwind CSS, React Router, TanStack Query, axios, react-hot-toast.

## Getting started

```
npm install --legacy-peer-deps
cp .env.example .env
npm run dev
```

Then open http://localhost:33829

## Environment variables

See `.env.example`. `VITE_API_URL` is the base origin of the REST backend (requests are sent to
`${VITE_API_URL}/api/v1/...`). Leave it empty to call same-origin `/api/v1/...` paths (useful
behind a reverse proxy). This app has **no mock data layer** — every screen calls the real API
described in the project's API contract, so a backend implementing that contract must be running
and reachable for the app to show real data. Until then, screens will show their loading and
error states.

## Authentication model

The access token is kept in memory only (never persisted) and the refresh token is kept in
`localStorage` so a session survives a page reload. On a `401` response the API client calls
`POST /api/v1/auth/refresh` once, retries the original request, and logs the user out if the
refresh also fails.

## Project structure

- `src/pages` — one component per screen (Login, Register, Dashboard, Tickets, Ticket Detail, etc.)
- `src/components` — shared, reusable UI building blocks (layout, chips, charts, tables, dialogs)
- `src/api` — typed REST client functions grouped by resource (auth, users, tickets, dashboard)
- `src/auth` — auth context/provider and route guards (`RequireAuth`, `RequireRole`)
- `src/types` — shared TypeScript types for all entities
- `src/constants` — route paths, enums/labels, pagination defaults
- `src/validation` — reusable field-level validation functions
- `src/utils` — generic formatting helpers (dates, etc.)
- `src/hooks` — shared custom hooks (e.g. `useDebouncedValue`)

## Testing

```
npm run test
```

Runs Vitest + React Testing Library smoke tests for every page, a route-guard redirect test, and
ticket-list filtering interaction tests.
