import { GlassCard } from '../../components/GlassCard'
import { Reveal } from '../../components/Reveal'
import gamesAsset from '../../assets/games_2x.png'

/**
 * Bento-мозаика фич (4 колонки, базовый ряд 190px):
 *
 * ┌─────────────┬──────┬──────┐
 * │ CENSOR 2×2  │Speed │Proto │   ряды 1–2
 * │ [ассет]     │ 1×2  │ 1×2  │
 * ├──────┬──────┼──────┴──────┤
 * │Split │ GAMING 2×2  │Client│   ряды 3–4
 * │Multi │ [ассет]     │ 1×2  │
 * ├──────┴─────────────┴──────┤
 * │ SERVERS 4×2 (текст+ассет) │   ряды 5–6
 * └───────────────────────────┘
 *
 * games_2x.png — примерка во всех трёх ассетных слотах: пользователь заменит
 * на свои ассеты (цензура / гейминг / серверы) в том же стиле. Чёрный фон
 * ассетов гасится mix-blend-screen — чистый #000 становится прозрачным.
 */

// График пропускной способности: линия + мягкая area-заливка
function ThroughputGraphic() {
  const line = '0,44 28,38 56,40 84,30 112,33 140,22 168,26 196,18 224,21 252,14 280,16'
  return (
    <svg
      viewBox="0 0 280 56"
      preserveAspectRatio="none"
      fill="none"
      className="mt-auto h-24 w-full"
      aria-hidden
    >
      <defs>
        <linearGradient id="speed-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="speed-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,56 ${line} 280,56`} fill="url(#speed-fill)" />
      <polyline
        points={line}
        stroke="url(#speed-line)"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        style={{ filter: 'drop-shadow(0 0 6px rgb(255 255 255 / 0.55))' }}
      />
    </svg>
  )
}

function Chip({ children }: { children: string }) {
  return (
    <span className="rounded-lg bg-surface-2 px-3 py-1.5 font-mono text-xs text-fg-muted">
      {children}
    </span>
  )
}

// Ассетная карточка: текст сверху (крупный заголовок), ассет в нижней части.
// horizontal — вариант для широкой карточки: текст слева, ассет справа.
function AssetCard({
  title,
  description,
  asset,
  horizontal = false,
}: {
  title: string
  description: string
  asset: string
  horizontal?: boolean
}) {
  if (horizontal) {
    return (
      <GlassCard className="flex h-full flex-col overflow-hidden p-7 sm:flex-row sm:items-center sm:gap-8">
        <div className="sm:w-2/5">
          <h3 className="text-3xl font-semibold tracking-tight text-balance">{title}</h3>
          <p className="mt-3 text-sm text-fg-muted">{description}</p>
        </div>
        <div className="relative mt-2 min-h-56 flex-1 sm:mt-0 sm:self-stretch">
          <img
            src={asset}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full scale-110 object-contain mix-blend-screen"
          />
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard className="flex h-full flex-col overflow-hidden p-7 pb-0">
      <h3 className="text-3xl font-semibold tracking-tight text-balance">{title}</h3>
      <p className="mt-3 max-w-md text-sm text-fg-muted">{description}</p>
      <div className="relative mt-2 min-h-56 flex-1">
        <img
          src={asset}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full scale-125 object-contain mix-blend-screen"
        />
      </div>
    </GlassCard>
  )
}

// Малая текстовая карточка мозаики
function SmallCard({ title, description }: { title: string; description: string }) {
  return (
    <GlassCard className="h-full p-7">
      <h3 className="font-semibold tracking-tight">{title}</h3>
      <p className="mt-2.5 text-sm text-fg-muted">{description}</p>
    </GlassCard>
  )
}

export function Features() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-28 lg:py-36">
      <Reveal>
        <h2 className="text-center text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Everything a VPN should be.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-lg text-balance text-fg-muted">
          Engineered for privacy, built for speed, tuned for play.
        </p>
      </Reveal>

      {/* grid-flow-dense: на 2-колоночном брейкпоинте малые карточки
          подтягиваются в дыры рядом с широкими, сетка без пропусков */}
      <div className="mt-14 grid grid-flow-dense gap-4 sm:grid-cols-2 lg:auto-rows-[190px] lg:grid-cols-4">
        {/* Ряды 1–2 */}
        <Reveal className="sm:col-span-2 lg:row-span-2" delay={0}>
          {/* TODO: свой ассет про обход цензуры */}
          <AssetCard
            title="Censorship isn't your problem anymore."
            description="Your traffic is disguised as ordinary HTTPS — invisible to DPI filters and national firewalls."
            asset={gamesAsset}
          />
        </Reveal>

        <Reveal className="lg:row-span-2" delay={0.06}>
          <GlassCard className="flex h-full flex-col gap-5 p-7">
            <div>
              <span className="font-mono text-5xl font-semibold text-fg [text-shadow:0_0_36px_rgb(255_255_255/0.45)]">
                10<span className="text-3xl text-fg-muted"> Gbps</span>
              </span>
              <p className="mt-3 text-sm text-fg-muted">
                Backbone on every location. Speed is never the bottleneck.
              </p>
            </div>
            <ThroughputGraphic />
          </GlassCard>
        </Reveal>

        <Reveal className="lg:row-span-2" delay={0.12}>
          <GlassCard className="flex h-full flex-col justify-between gap-5 p-7">
            {/* На высокой карточке чипы — столбиком, чтобы заполнить высоту */}
            <div className="flex flex-wrap gap-2 lg:flex-col lg:items-start">
              <Chip>VLESS</Chip>
              <Chip>REALITY</Chip>
              <Chip>Trojan</Chip>
              <Chip>Shadowsocks</Chip>
            </div>
            <p className="text-sm text-fg-muted">
              Protocols that look like normal traffic — because they are.
            </p>
          </GlassCard>
        </Reveal>

        {/* Ряды 3–4 */}
        <Reveal delay={0}>
          <SmallCard
            title="Split tunneling"
            description="Choose which apps go through the tunnel."
          />
        </Reveal>

        <Reveal className="sm:col-span-2 lg:row-span-2" delay={0.06}>
          {/* Ассет заменится на финальный геймпад пользователя */}
          <AssetCard
            title="Made for gaming."
            description="Dedicated low-latency routes with minimal packet loss. No throttling, ever."
            asset={gamesAsset}
          />
        </Reveal>

        <Reveal className="sm:col-span-2 lg:col-span-1 lg:row-span-2" delay={0.12}>
          <GlassCard className="flex h-full flex-col justify-between gap-5 p-7">
            <div>
              <h3 className="font-semibold tracking-tight text-balance">
                Works with the apps you already use.
              </h3>
              <p className="mt-3 text-sm text-fg-muted">
                One subscription link — paste it into any client and you're in.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Chip>v2RayTun</Chip>
              <Chip>Happ</Chip>
              <Chip>Streisand</Chip>
              <Chip>Hiddify</Chip>
            </div>
          </GlassCard>
        </Reveal>

        <Reveal delay={0.06}>
          <SmallCard title="Multi-hop" description="Route through two countries at once." />
        </Reveal>

        {/* Ряды 5–6: широкая горизонтальная карточка */}
        <Reveal className="sm:col-span-2 lg:col-span-4 lg:row-span-2" delay={0}>
          {/* TODO: свой ассет про сеть серверов */}
          <AssetCard
            horizontal
            title="Servers wherever you need them."
            description="40+ locations across the globe and counting — there is always a fast route nearby."
            asset={gamesAsset}
          />
        </Reveal>
      </div>
    </section>
  )
}
