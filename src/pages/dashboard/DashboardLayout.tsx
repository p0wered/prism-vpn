import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router'
import {
  CreditCard,
  Globe,
  LayoutGrid,
  LogOut,
  Menu,
  MonitorSmartphone,
  PanelLeftClose,
  PanelLeftOpen,
  Rocket,
  Settings,
  X,
} from 'lucide-react'
import { ToastProvider } from '../../components/Toast'
import { Wordmark } from '../../components/Wordmark'
import { signOut } from '../../lib/session'
import { DashboardProvider, useDashboard } from './DashboardContext'

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: LayoutGrid, end: true },
  { to: '/dashboard/devices', label: 'Devices', icon: MonitorSmartphone },
  { to: '/dashboard/setup', label: 'Setup', icon: Rocket },
  { to: '/dashboard/subscription', label: 'Subscription', icon: CreditCard },
  { to: '/dashboard/servers', label: 'Servers', icon: Globe },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
]

function NavItems({ collapsed, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  return (
    <ul className="flex flex-col gap-1">
      {navItems.map(({ to, label, icon: Icon, end }) => (
        <li key={to}>
          <NavLink
            to={to}
            end={end}
            title={collapsed ? label : undefined}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex h-11 items-center gap-3 rounded-xl px-3 text-sm transition-colors ${
                isActive
                  ? 'bg-surface-2 text-fg'
                  : 'text-fg-muted hover:bg-surface-1 hover:text-fg'
              } ${collapsed ? 'justify-center px-0' : ''}`
            }
          >
            <Icon size={18} strokeWidth={1.75} className="shrink-0" aria-hidden />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        </li>
      ))}
    </ul>
  )
}

function UserChip({ collapsed }: { collapsed?: boolean }) {
  const { nickname, email } = useDashboard()
  const navigate = useNavigate()

  return (
    <div className={`flex items-center gap-3 ${collapsed ? 'flex-col' : ''}`}>
      <span
        aria-hidden
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-2 text-sm font-medium uppercase"
      >
        {nickname[0]}
      </span>
      {!collapsed && (
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block truncate text-sm">{nickname}</span>
          <span className="block truncate text-xs text-fg-muted">{email}</span>
        </span>
      )}
      <button
        type="button"
        title="Log out"
        onClick={() => {
          signOut()
          navigate('/')
        }}
        className="cursor-pointer rounded-lg p-2 text-fg-muted transition-colors hover:text-fg"
      >
        <LogOut size={16} strokeWidth={1.75} aria-hidden />
        <span className="sr-only">Log out</span>
      </button>
    </div>
  )
}

function DashboardShell() {
  const [collapsed, setCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const reduced = useReducedMotion()

  return (
    <div className="flex min-h-screen">
      {/* Sidebar — десктоп */}
      <aside
        className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-white/6 px-4 py-6 transition-[width] duration-300 lg:flex ${
          collapsed ? 'w-[76px]' : 'w-60'
        }`}
      >
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between pl-3'}`}>
          {!collapsed && <Wordmark />}
          <button
            type="button"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={() => setCollapsed((v) => !v)}
            className="cursor-pointer rounded-lg p-2 text-fg-muted transition-colors hover:text-fg"
          >
            {collapsed ? (
              <PanelLeftOpen size={18} strokeWidth={1.75} aria-hidden />
            ) : (
              <PanelLeftClose size={18} strokeWidth={1.75} aria-hidden />
            )}
            <span className="sr-only">{collapsed ? 'Expand sidebar' : 'Collapse sidebar'}</span>
          </button>
        </div>
        <nav className="mt-8 flex-1">
          <NavItems collapsed={collapsed} />
        </nav>
        <UserChip collapsed={collapsed} />
      </aside>

      {/* Топ-бар — мобила */}
      <div className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-white/6 bg-bg/80 px-4 backdrop-blur-xl lg:hidden">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="cursor-pointer rounded-lg p-2 text-fg-muted transition-colors hover:text-fg"
        >
          <Menu size={20} strokeWidth={1.75} aria-hidden />
          <span className="sr-only">Open menu</span>
        </button>
        <Wordmark />
        <span className="w-9" aria-hidden />
      </div>

      {/* Drawer — мобила */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setDrawerOpen(false)}
          >
            <motion.aside
              className="flex h-full w-72 flex-col border-r border-white/6 bg-bg px-4 py-6"
              initial={reduced ? {} : { x: '-100%' }}
              animate={{ x: 0 }}
              exit={reduced ? { opacity: 0 } : { x: '-100%' }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pl-3">
                <Wordmark />
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="cursor-pointer rounded-lg p-2 text-fg-muted transition-colors hover:text-fg"
                >
                  <X size={18} strokeWidth={1.75} aria-hidden />
                  <span className="sr-only">Close menu</span>
                </button>
              </div>
              <nav className="mt-8 flex-1">
                <NavItems onNavigate={() => setDrawerOpen(false)} />
              </nav>
              <UserChip />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative min-w-0 flex-1 px-5 pt-20 pb-10 lg:px-10 lg:pt-10">
        <div aria-hidden className="page-glow" />
        <div className="relative mx-auto max-w-5xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export function DashboardLayout() {
  return (
    <DashboardProvider>
      <ToastProvider>
        <DashboardShell />
      </ToastProvider>
    </DashboardProvider>
  )
}
