import { useNavigate } from 'react-router'
import { Button } from '../../components/Button'

// Мок-авторизация: любые креды пускают в dashboard (этап 4)
export function LoginPage() {
  const navigate = useNavigate()

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <form
        className="flex w-full max-w-sm flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          navigate('/dashboard')
        }}
      >
        <h1 className="pl-2 text-2xl font-semibold tracking-tight">Sign in</h1>
        <input
          type="email"
          placeholder="Email"
          className="rounded-xl bg-surface-1 px-4 py-3 text-fg placeholder:text-fg-muted focus:outline-2 focus:outline-accent"
        />
        <input
          type="password"
          placeholder="Password"
          className="rounded-xl bg-surface-1 px-4 py-3 text-fg placeholder:text-fg-muted focus:outline-2 focus:outline-accent"
        />
        <Button type="submit" className="mt-2">
          Continue
        </Button>
      </form>
    </main>
  )
}
