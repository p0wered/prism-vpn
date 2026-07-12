import { useNavigate } from 'react-router'
import { Button } from '../../components/Button'
import { GlassCard } from '../../components/GlassCard'
import { Reveal } from '../../components/Reveal'

/**
 * Pricing (этап 3): три мок-тарифа. Различия — трафик, устройства, игровые
 * маршруты. Featured-тариф — с внешним ореолом (halo) и primary CTA.
 */

type Tier = {
  name: string
  price: string
  tagline: string
  features: string[]
  featured?: boolean
}

const tiers: Tier[] = [
  {
    name: 'Starter',
    price: '3.99',
    tagline: 'For everyday browsing',
    features: ['200 GB traffic / month', '3 devices', 'All locations', 'Standard routes'],
  },
  {
    name: 'Plus',
    price: '6.99',
    tagline: 'Best for most people',
    features: ['Unlimited traffic', '5 devices', 'Gaming routes', 'Multi-hop'],
    featured: true,
  },
  {
    name: 'Ultra',
    price: '11.99',
    tagline: 'For power users',
    features: ['Everything in Plus', '10 devices', 'Dedicated IP', 'Priority support'],
  },
]

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" className="mt-0.5 size-4 shrink-0" fill="none" aria-hidden>
      <path
        d="M3.5 8.5 6.5 11.5 12.5 4.5"
        stroke="var(--color-fg-muted)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Pricing() {
  const navigate = useNavigate()

  return (
    <section id="pricing" className="mx-auto max-w-5xl scroll-mt-16 px-6 py-28 lg:py-36">
      <Reveal>
        <h2 className="text-center text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          One subscription. Every border.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-lg text-balance text-fg-muted">
          Cancel anytime. Your keys work in any client.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {tiers.map((tier, i) => (
          <Reveal key={tier.name} delay={i * 0.08}>
            <GlassCard halo={tier.featured} className="flex h-full flex-col p-7">
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-semibold tracking-tight">{tier.name}</h3>
                {tier.featured && (
                  <span className="font-mono text-xs tracking-wide text-accent">POPULAR</span>
                )}
              </div>
              <p className="mt-1 text-sm text-fg-muted">{tier.tagline}</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-mono text-5xl font-semibold [text-shadow:0_0_28px_rgb(255_255_255/0.3)]">
                  ${tier.price}
                </span>
                <span className="text-sm text-fg-muted">/ month</span>
              </div>

              <ul className="mt-7 flex flex-col gap-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-fg-muted">
                    <CheckIcon />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-1 items-end">
                <Button
                  variant={tier.featured ? 'primary' : 'secondary'}
                  className="w-full"
                  onClick={() => navigate('/login')}
                >
                  Get {tier.name}
                </Button>
              </div>
            </GlassCard>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <p className="mt-8 text-center text-sm text-fg-muted">
          This is a portfolio project — no real payments, no real VPN.
        </p>
      </Reveal>
    </section>
  )
}
