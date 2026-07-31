import { Header } from './Header'
import { Hero } from './Hero'

export function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <div style={{ height: '100vh' }}/>
      </main>
    </>
  )
}
