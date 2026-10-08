import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import { RequireAuth } from '../auth/RequireAuth'
import { RequireRole } from '../auth/RequireRole'
import { Login } from '../pages/Login'
import { Register } from '../pages/Register'
import { ForgotPassword } from '../pages/ForgotPassword'
import { IndexRedirect } from '../pages/IndexRedirect'
import { Dashboard } from '../pages/Dashboard'
import { TicketsList } from '../pages/TicketsList'
import { CreateTicket } from '../pages/CreateTicket'
import { TicketDetail } from '../pages/TicketDetail'
import { AdminUsers } from '../pages/AdminUsers'
import { Profile } from '../pages/Profile'
import { Forbidden } from '../pages/Forbidden'
import { NotFound } from '../pages/NotFound'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <App />,
        children: [
          { index: true, element: <IndexRedirect /> },
          {
            element: <RequireRole roles={['admin', 'agent']} />,
            children: [{ path: 'dashboard', element: <Dashboard /> }],
          },
          { path: 'tickets', element: <TicketsList /> },
          { path: 'tickets/new', element: <CreateTicket /> },
          { path: 'tickets/:id', element: <TicketDetail /> },
          {
            element: <RequireRole roles={['admin']} />,
            children: [{ path: 'admin/users', element: <AdminUsers /> }],
          },
          { path: 'profile', element: <Profile /> },
          { path: '403', element: <Forbidden /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFound /> },
])
