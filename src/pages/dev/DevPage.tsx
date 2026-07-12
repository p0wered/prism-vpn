/**
 * Песочница дизайн-системы (только dev-сборка, см. router.tsx).
 * Здесь визуально проверяются токены и компоненты до использования в продукте.
 */

const colors = [
  { name: 'bg', className: 'bg-bg' },
  { name: 'surface-1', className: 'bg-surface-1' },
  { name: 'surface-2', className: 'bg-surface-2' },
  { name: 'fg', className: 'bg-fg' },
  { name: 'fg-muted', className: 'bg-fg-muted' },
  { name: 'accent', className: 'bg-accent' },
]

export function DevPage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-12 px-6 py-12">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Design system sandbox</h1>
        <p className="mt-2 text-fg-muted">Токены и компоненты PrismVPN. Только для разработки.</p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-medium">Colors</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {colors.map((c) => (
            <div key={c.name} className="flex items-center gap-3">
              <div className={`size-12 rounded-xl border border-surface-2 ${c.className}`} />
              <span className="font-mono text-sm text-fg-muted">{c.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-medium">Typography</h2>
        <p className="text-5xl font-semibold tracking-tight">Beyond borders. Съешь ещё.</p>
        <p className="text-fg-muted">
          Secondary text — descriptions and captions. Вторичный текст для описаний.
        </p>
        <p className="font-mono text-sm">
          geist mono · 51.210.14.88 · 12 ms · 1.4 TB · Съешь ещё этих мягких французских булок
        </p>
      </section>

      {/* Этап 1: сюда добавятся GlassCard, grain, кнопки */}
    </main>
  )
}
