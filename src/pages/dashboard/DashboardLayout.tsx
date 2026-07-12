import { NavLink, Outlet } from 'react-router'

const navItems = [
  { to: '/dashboard', label: 'Overview', end: true },
  { to: '/dashboard/subscription', label: 'Subscription' },
  { to: '/dashboard/servers', label: 'Servers' },
  { to: '/dashboard/settings', label: 'Settings' },
]

export function DashboardLayout() {
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-8">
      <nav className="flex flex-wrap items-center gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `rounded-full px-4 py-2 text-sm transition-colors ${
                isActive ? 'bg-surface-2 text-fg' : 'text-fg-muted hover:text-fg'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  )
}
