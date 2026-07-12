import { useNavigate } from 'react-router'

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
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
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
        <button
          type="submit"
          className="rounded-xl bg-accent px-4 py-3 font-medium text-black transition-opacity hover:opacity-90"
        >
          Continue
        </button>
      </form>
    </main>
  )
}
