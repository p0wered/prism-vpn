import { useNavigate } from 'react-router'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { Wordmark } from '../../components/Wordmark'
import { signIn } from '../../lib/session'

// Мок-авторизация: любые креды пускают в dashboard (этап 4)
export function LoginPage() {
  const navigate = useNavigate()

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="fixed inset-x-0 top-0">
        <div className="mx-auto flex h-17 max-w-7xl items-center px-6">
          <Wordmark />
        </div>
      </div>

      <form
        className="flex w-full max-w-sm flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          signIn()
          navigate('/dashboard')
        }}
      >
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <Input label="Email" type="email" autoComplete="email" />
        <Input label="Password" type="password" autoComplete="current-password" />
        <Button type="submit" className="mt-2">
          Continue
        </Button>
      </form>
    </main>
  )
}
