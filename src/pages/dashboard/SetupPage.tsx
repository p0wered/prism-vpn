import { useState } from 'react'
import { Link } from 'react-router'
import { Copy, QrCode } from 'lucide-react'
import iphoneMock from '../../assets/iphone-17-mock.png'
import { Button } from '../../components/Button'
import { GlassCard } from '../../components/GlassCard'
import { Reveal } from '../../components/Reveal'
import { useToast } from '../../components/Toast'
import { subLink } from '../../data/mock'
import { useDashboard } from './DashboardContext'
import { PageHeader } from './PageHeader'

type Platform = 'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'tv'

const platforms: { id: Platform; label: string }[] = [
  { id: 'ios', label: 'iOS' },
  { id: 'android', label: 'Android' },
  { id: 'macos', label: 'macOS' },
  { id: 'windows', label: 'Windows' },
  { id: 'linux', label: 'Linux' },
  { id: 'tv', label: 'Android TV' },
]

/** Первый клиент в списке — рекомендуемый (на мобильных — своё приложение) */
const clients: Record<Platform, string[]> = {
  ios: ['PrismVPN app', 'Happ', 'Streisand', 'v2RayTun'],
  android: ['PrismVPN app', 'v2RayTun', 'Happ', 'Hiddify'],
  macos: ['Happ', 'Streisand', 'Hiddify'],
  windows: ['Hiddify', 'v2rayN', 'NekoRay'],
  linux: ['Hiddify', 'NekoRay', 'sing-box (CLI)'],
  tv: ['Happ', 'v2RayTun'],
}

const thirdParty = [
  { name: 'v2RayTun', platforms: 'iOS · Android · TV' },
  { name: 'Happ', platforms: 'iOS · Android · macOS · TV' },
  { name: 'Streisand', platforms: 'iOS · macOS' },
  { name: 'Hiddify', platforms: 'Android · Windows · macOS · Linux' },
]

export function SetupPage() {
  const { subToken } = useDashboard()
  const toast = useToast()
  const [platform, setPlatform] = useState<Platform>('ios')

  const copyLink = () => {
    void navigator.clipboard.writeText(subLink(subToken))
    toast('Subscription link copied')
  }

  const [recommended, ...alternatives] = clients[platform]
  const isMobile = platform === 'ios' || platform === 'android'

  return (
    <div className="flex flex-col gap-6">
      <Reveal>
        <PageHeader title="Setup" sub="Connect a device in a couple of minutes." />
      </Reveal>

      {/* Hero своего приложения — рекомендуемый путь подключения */}
      <Reveal delay={0.05}>
        <GlassCard halo className="overflow-hidden">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-stretch">
            <div className="flex-1 p-7 pb-0 sm:py-9 sm:pl-9">
              <h2 className="pl-2 text-xl font-semibold tracking-tight lg:text-2xl">
                PrismVPN app
              </h2>
              <p className="mt-2 max-w-sm pl-2 text-sm leading-relaxed text-fg-muted">
                The fastest way in: install the app, tap once — your subscription, servers and
                settings import themselves. iOS and Android.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3 pl-2">
                <Button
                  onClick={() => {
                    copyLink()
                  }}
                >
                  Add subscription in one tap
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => toast('Demo project — the app is not published')}
                >
                  App Store
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => toast('Demo project — the app is not published')}
                >
                  Google Play
                </Button>
              </div>
            </div>
            <div className="flex justify-center sm:block">
              <img
                src={iphoneMock}
                alt="PrismVPN app on iPhone"
                className="pointer-events-none mt-2 max-h-72 object-contain object-bottom select-none sm:mt-8 sm:mr-10 sm:max-h-80"
              />
            </div>
          </div>
        </GlassCard>
      </Reveal>

      {/* Инструкция по платформам */}
      <Reveal delay={0.1}>
        <GlassCard className="p-5 lg:p-7">
          <div
            className="-mx-1 flex gap-1 overflow-x-auto rounded-full bg-surface-2 p-1 sm:mx-0 sm:w-fit"
            role="tablist"
            aria-label="Platform"
          >
            {platforms.map((p) => (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={platform === p.id}
                onClick={() => setPlatform(p.id)}
                className={`cursor-pointer rounded-full px-4 py-1.5 text-sm whitespace-nowrap transition-colors ${
                  platform === p.id ? 'bg-white/12 text-fg' : 'text-fg-muted hover:text-fg'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <ol className="mt-6 flex flex-col gap-5 pl-2">
            <li className="flex gap-4">
              <span className="font-mono text-sm text-fg-muted">01</span>
              <div className="text-sm leading-relaxed">
                Install <span className="font-medium">{recommended}</span>
                {isMobile && <span className="text-fg-muted"> — our own client, recommended</span>}
                .
                <span className="block text-fg-muted">
                  Alternatives: {alternatives.join(', ')}.
                </span>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="font-mono text-sm text-fg-muted">02</span>
              <div className="text-sm leading-relaxed">
                Copy your subscription link
                <span className="text-fg-muted">
                  {' '}
                  — or scan the QR code from the{' '}
                  <Link to="/dashboard/subscription" className="text-fg underline underline-offset-4">
                    Subscription page
                  </Link>
                  .
                </span>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  <Button variant="secondary" className="h-9 px-4 text-xs" onClick={copyLink}>
                    <Copy size={13} strokeWidth={1.75} className="mr-2" aria-hidden />
                    Copy link
                  </Button>
                  <Link to="/dashboard/subscription">
                    <Button variant="ghost" className="h-9 px-3 text-xs">
                      <QrCode size={13} strokeWidth={1.75} className="mr-2" aria-hidden />
                      Show QR
                    </Button>
                  </Link>
                </div>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="font-mono text-sm text-fg-muted">03</span>
              <div className="text-sm leading-relaxed">
                Import the link in the app
                <span className="block text-fg-muted">
                  The server list appears automatically — pick one and connect.
                </span>
              </div>
            </li>
          </ol>
        </GlassCard>
      </Reveal>

      {/* Сторонние клиенты */}
      <Reveal delay={0.15}>
        <div>
          <h2 className="pl-4 text-sm font-medium text-fg-muted">Third-party clients we support</h2>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {thirdParty.map((c) => (
              <GlassCard key={c.name} className="p-5">
                <div className="pl-2">
                  <div className="text-sm font-medium">{c.name}</div>
                  <div className="mt-1 font-mono text-xs text-fg-muted">{c.platforms}</div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  )
}
