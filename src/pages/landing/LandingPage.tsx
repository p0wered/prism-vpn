import { Hero } from './Hero'
import { Features } from './Features'
import { Pricing } from './Pricing'

export function LandingPage() {
  return (
    <main>
      <Hero />
      <Features />
      <Pricing />
      {/* Этап 3: FAQ → Footer */}
    </main>
  )
}
