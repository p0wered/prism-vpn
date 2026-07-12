import { createBrowserRouter } from 'react-router'
import { LandingPage } from '../pages/landing/LandingPage'
import { LoginPage } from '../pages/login/LoginPage'
import { DashboardLayout } from '../pages/dashboard/DashboardLayout'
import { OverviewPage } from '../pages/dashboard/OverviewPage'
import { SubscriptionPage } from '../pages/dashboard/SubscriptionPage'
import { ServersPage } from '../pages/dashboard/ServersPage'
import { SettingsPage } from '../pages/dashboard/SettingsPage'

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
  // Песочница дизайн-системы: только dev-сборка, в прод не попадает вовсе
  // (динамические импорты внутри мёртвой ветки вырезаются вместе с чанками)
  ...(import.meta.env.DEV
    ? [
        {
          path: '/dev',
          lazy: async () => ({ Component: (await import('../pages/dev/DevPage')).DevPage }),
        },
        {
          path: '/dev/backgrounds',
          lazy: async () => ({
            Component: (await import('../pages/dev/BackgroundsPage')).BackgroundsPage,
          }),
        },
      ]
    : []),
])
