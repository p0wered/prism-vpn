import { GlassCard } from '../../components/GlassCard'
import { Reveal } from '../../components/Reveal'
import gamesAsset from '../../assets/games_2x.png'
import swiftuiAsset from '../../assets/swiftui_2x.png'

function ThroughputGraphic() {
  const line = '0,48 16,44 32,47 48,35 64,39 80,26 96,33 112,22 128,30 144,18 160,24'

  return (
    <div className="mt-auto">
      <div className="mb-2.5 flex items-center justify-between gap-2 font-mono text-xs text-fg-muted">
        <span>24H LOAD</span>
        <span className="text-fg">7.1G</span>
      </div>
      <svg viewBox="0 0 160 60" fill="none" className="h-24 w-full" aria-hidden>
        <defs>
          <linearGradient id="speed-line" x1="0" y1="0" x2="160" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0.25" />
            <stop offset="0.55" stopColor="#fff" stopOpacity="0.95" />
            <stop offset="1" stopColor="#fff" stopOpacity="0.65" />
          </linearGradient>
          <linearGradient id="speed-fill" x1="0" y1="8" x2="0" y2="56">
            <stop offset="0" stopColor="#fff" stopOpacity="0.12" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g stroke="rgb(161 161 166 / 0.16)" strokeWidth="0.75">
          <path d="M0 8H160" strokeDasharray="3 4" />
          <path d="M0 32H160" strokeDasharray="3 4" />
          <path d="M0 56H160" />
        </g>
        <polygon points={`0,56 ${line} 160,56`} fill="url(#speed-fill)" />
        <polyline
          points={line}
          stroke="url(#speed-line)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          style={{ filter: 'drop-shadow(0 0 6px rgb(255 255 255 / 0.45))' }}
        />
        <circle cx="160" cy="24" r="2.5" fill="var(--color-fg)" />
      </svg>
      <div className="mt-1 flex justify-between font-mono text-[10px] text-fg-muted">
        <span>00</span>
        <span>12</span>
        <span>NOW</span>
      </div>
    </div>
  )
}

function SpeedCard() {
  return (
    <GlassCard halo className="flex h-full min-h-64 flex-col gap-4 p-6 sm:min-h-0">
      <div>
        <span className="font-mono text-5xl font-semibold text-fg [text-shadow:0_0_36px_rgb(255_255_255/0.45)]">
          10<span className="text-2xl text-fg-muted"> Gbps</span>
        </span>
        <p className="mt-2.5 text-sm leading-5 text-fg-muted">Full capacity at every location.</p>
      </div>
      <ThroughputGraphic />
    </GlassCard>
  )
}

function ProtocolsCard() {
  return (
    <GlassCard halo className="flex h-full min-h-36 flex-col justify-between p-5 sm:min-h-0">
      <h3 className="text-sm font-medium text-fg-muted">Built to blend in.</h3>
      <div>
        <p className="font-mono text-2xl font-semibold tracking-[-0.05em]">
          VLESS <span className="text-fg-muted">/ REALITY</span>
        </p>
      </div>
    </GlassCard>
  )
}

function Chip({ children }: { children: string }) {
  return (
    <span className="rounded-lg bg-surface-2 px-3 py-1.5 font-mono text-xs text-fg-muted">
      {children}
    </span>
  )
}

function ClientsCard() {
  return (
    <GlassCard halo className="flex h-full min-h-36 flex-col justify-between gap-4 p-5 sm:min-h-0">
      <h3 className="text-sm font-medium text-fg-muted">Use any client.</h3>
      <div className="flex flex-wrap gap-2">
        <Chip>v2RayTun</Chip>
        <Chip>Happ</Chip>
        <Chip>Streisand</Chip>
        <Chip>Hiddify</Chip>
      </div>
    </GlassCard>
  )
}

function SplitCard() {
  return (
    <GlassCard halo className="flex h-full min-h-36 flex-col p-5 sm:min-h-0">
      <h3 className="font-semibold tracking-tight">Split tunneling</h3>
      <svg viewBox="0 0 180 52" className="mt-auto h-12 w-full" fill="none" aria-hidden>
        <path d="M8 26h48c20 0 20-17 40-17h68" stroke="rgb(245 245 247 / 0.7)" />
        <path d="M56 26c20 0 20 17 40 17h68" stroke="rgb(161 161 166 / 0.45)" />
        <circle cx="8" cy="26" r="3" fill="var(--color-fg)" />
        <circle cx="164" cy="9" r="3" fill="var(--color-fg)" />
        <circle cx="164" cy="43" r="3" fill="var(--color-fg-muted)" />
        <text x="104" y="8" fill="var(--color-fg-muted)" fontSize="8" fontFamily="monospace">
          VPN
        </text>
        <text x="104" y="51" fill="var(--color-fg-muted)" fontSize="8" fontFamily="monospace">
          DIRECT
        </text>
      </svg>
    </GlassCard>
  )
}

function MultiHopCard() {
  return (
    <GlassCard halo className="flex h-full min-h-36 flex-col p-5 sm:min-h-0">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-semibold tracking-tight">Multi-hop</h3>
        <span className="font-mono text-[10px] text-fg-muted">2 exits</span>
      </div>
      <div className="mt-auto flex items-center gap-2 font-mono text-[10px] text-fg-muted">
        <span className="text-fg">YOU</span>
        <span className="h-px flex-1 bg-[linear-gradient(to_right,var(--color-fg),var(--color-fg-muted))]" />
        <span className="rounded-md bg-surface-2 px-2 py-1">NL</span>
        <span className="h-px flex-1 bg-fg-muted" />
        <span className="rounded-md bg-surface-2 px-2 py-1">FI</span>
        <span className="h-px flex-1 bg-fg-muted" />
        <span>WEB</span>
      </div>
    </GlassCard>
  )
}

function NodeMap() {
  return (
    <svg
      viewBox="0 0 190 150"
      preserveAspectRatio="xMidYMax meet"
      className="h-full w-full"
      fill="none"
      aria-hidden
    >
      <g stroke="rgb(161 161 166 / 0.22)" strokeWidth="0.8">
        <path d="M15 112 48 76 88 91 121 44 174 70" />
        <path d="M48 76 73 27 121 44 146 116 174 70" />
        <path d="M15 112 65 135 88 91 146 116" />
        <path d="M73 27 103 16 121 44 174 70" />
      </g>
      <g fill="var(--color-fg)">
        <circle cx="15" cy="112" r="2.5" />
        <circle cx="48" cy="76" r="3.5" />
        <circle cx="73" cy="27" r="2.5" />
        <circle cx="88" cy="91" r="4" />
        <circle cx="103" cy="16" r="2.5" />
        <circle cx="121" cy="44" r="3" />
        <circle cx="146" cy="116" r="2.5" />
        <circle cx="174" cy="70" r="3.5" />
      </g>
      <circle
        cx="88"
        cy="91"
        r="13"
        stroke="rgb(245 245 247 / 0.18)"
        style={{ filter: 'drop-shadow(0 0 9px rgb(255 255 255 / 0.55))' }}
      />
    </svg>
  )
}

function ServersCard() {
  return (
    <GlassCard halo className="relative flex h-full min-h-64 flex-col p-6 sm:min-h-0">
      <div className="relative z-10">
        <span className="font-mono text-5xl font-semibold [text-shadow:0_0_30px_rgb(255_255_255/0.35)]">
          40+
        </span>
        <h3 className="mt-1 font-semibold tracking-tight">global locations</h3>
        <p className="mt-1 max-w-48 text-xs leading-4 text-fg-muted">
          A fast route is always nearby.
        </p>
      </div>
      {/* Обрезка карты — во внутреннем слое, а не на корне: overflow-hidden
          на GlassCard срезал бы внешний halo-ореол */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
        <div className="absolute inset-x-[-10%] bottom-[-12%] h-[72%]">
          <NodeMap />
        </div>
      </div>
    </GlassCard>
  )
}

type AssetLayout = 'hero' | 'wide'

function AssetCard({
  title,
  description,
  layout,
}: {
  title: string
  description: string
  layout: AssetLayout
}) {
  if (layout === 'wide') {
    return (
      <GlassCard
        halo
        className="relative flex h-full min-h-60 p-6 before:z-20 after:z-10 sm:min-h-0 sm:items-center"
      >
        <div className="relative z-30 sm:w-[46%]">
          <h3 className="text-2xl font-semibold tracking-tight text-balance">{title}</h3>
          <p className="mt-2 max-w-sm text-sm leading-5 text-fg-muted">{description}</p>
        </div>
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
          <div className="absolute inset-x-0 bottom-[-10%] h-[58%] sm:inset-y-px sm:right-[-13%] sm:left-auto sm:h-auto sm:w-[58%]">
            <img
              src={gamesAsset}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full scale-125 object-contain object-bottom mix-blend-screen sm:object-center"
            />
          </div>
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard
      halo
      className="relative flex h-full min-h-[320px] flex-col p-6 before:z-20 after:z-10 sm:min-h-0 sm:p-7"
    >
      <div className="relative z-30 max-w-sm sm:max-w-[48%]">
        <h3 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">{title}</h3>
        <p className="mt-2.5 text-sm leading-5 text-fg-muted">{description}</p>
      </div>
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
        <div className="absolute inset-x-px bottom-px h-[58%] sm:inset-y-px sm:right-px sm:left-auto sm:h-auto sm:w-[57%]">
          <img
            src={swiftuiAsset}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full scale-[1.40] object-contain object-bottom mix-blend-screen sm:object-center"
          />
        </div>
      </div>
    </GlassCard>
  )
}

function FiveColumnGrid() {
  return (
    <div className="mt-12 grid gap-4 sm:auto-rows-[150px] sm:grid-cols-2 lg:grid-cols-5">
      <Reveal className="sm:col-span-2 sm:row-span-2 lg:col-start-2 lg:col-end-5 lg:row-start-2 lg:row-end-4">
        <AssetCard
          layout="hero"
          title="Censorship isn't your problem anymore."
          description="Ordinary-looking HTTPS slips past DPI filters and national firewalls."
        />
      </Reveal>

      <Reveal className="sm:row-span-2 lg:col-start-1 lg:row-start-1 lg:row-end-3" delay={0.05}>
        <SpeedCard />
      </Reveal>

      <Reveal className="lg:col-start-2 lg:col-end-4 lg:row-start-1" delay={0.1}>
        <ProtocolsCard />
      </Reveal>

      <Reveal className="lg:col-start-4 lg:col-end-6 lg:row-start-1" delay={0.12}>
        <ClientsCard />
      </Reveal>

      <Reveal className="sm:col-span-2 lg:col-start-3 lg:col-end-6 lg:row-start-4">
        <AssetCard
          layout="wide"
          title="Made for gaming."
          description="Low-latency routes with minimal packet loss. No throttling, ever."
        />
      </Reveal>

      <Reveal className="lg:col-start-1 lg:row-start-3" delay={0.05}>
        <SplitCard />
      </Reveal>

      <Reveal className="lg:col-start-1 lg:col-end-3 lg:row-start-4" delay={0.08}>
        <MultiHopCard />
      </Reveal>

      <Reveal className="sm:col-span-2 lg:col-start-5 lg:row-start-2 lg:row-end-4" delay={0.1}>
        <ServersCard />
      </Reveal>
    </div>
  )
}

export function Features() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 sm:py-24 lg:py-28">
      <Reveal>
        <h2 className="text-center text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Everything a VPN should be.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-lg text-balance text-fg-muted">
          Engineered for privacy, built for speed, tuned for play.
        </p>
      </Reveal>

      <FiveColumnGrid />
    </section>
  )
}
