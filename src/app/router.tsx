import { createBrowserRouter } from 'react-router'
import { LandingPage } from '../pages/landing/LandingPage'
import { LoginPage } from '../pages/login/LoginPage'
import { DashboardLayout } from '../pages/dashboard/DashboardLayout'
import { OverviewPage } from '../pages/dashboard/OverviewPage'
import { SubscriptionPage } from '../pages/dashboard/SubscriptionPage'
import { ServersPage } from '../pages/dashboard/ServersPage'
import { SettingsPage } from '../pages/dashboard/SettingsPage'
import { DevPage } from '../pages/dev/DevPage'

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <OverviewPage /> },
      { path: 'subscription', element: <SubscriptionPage /> },
      { path: 'servers', element: <ServersPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
  // Песочница дизайн-системы, доступна только в dev-сборке
  ...(import.meta.env.DEV ? [{ path: '/dev', element: <DevPage /> }] : []),
])
