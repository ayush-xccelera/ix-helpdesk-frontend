import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Ticket, Users, UserCircle, LifeBuoy } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import type { Role } from '../types'

interface NavItem {
  label: string
  to: string
  icon: typeof LayoutDashboard
  roles: Role[]
}

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'agent'] },
  { label: 'Tickets', to: '/tickets', icon: Ticket, roles: ['admin', 'agent', 'customer'] },
  { label: 'Users', to: '/admin/users', icon: Users, roles: ['admin'] },
  { label: 'Profile', to: '/profile', icon: UserCircle, roles: ['admin', 'agent', 'customer'] },
]

export function Sidebar(): JSX.Element {
  const { role } = useAuth()
  const visibleItems = navItems.filter((item) => role && item.roles.includes(role))

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-surface">
      <div className="flex h-16 items-center gap-2 border-b border-border px-5">
        <LifeBuoy className="h-6 w-6 text-primary-500" aria-hidden="true" />
        <span className="text-lg font-bold text-ink">HelpDesk</span>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive ? 'bg-primary-500 text-white' : 'text-muted hover:bg-neutral-100'
              }`
            }
          >
            <item.icon className="h-4 w-4" aria-hidden="true" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
