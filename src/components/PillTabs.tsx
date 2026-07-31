import { useId, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'

/**
 * Pill-переключатель: подложка активной опции переезжает между кнопками
 * (motion layoutId). reduced-motion — мгновенное переключение без анимации.
 */
export function PillTabs<T extends string | number>({
  value,
  onChange,
  options,
  ariaLabel,
  className = '',
  tabClassName = 'px-4 py-1.5 text-sm',
}: {
  value: T
  onChange: (v: T) => void
  options: readonly { id: T; label: ReactNode }[]
  ariaLabel: string
  className?: string
  /** Типографика и паддинги кнопок — целиком заменяет дефолт */
  tabClassName?: string
}) {
  const layoutId = useId()
  const reduced = useReducedMotion()

  return (
    <div className={`flex rounded-full bg-surface-2 p-1 ${className}`} role="tablist" aria-label={ariaLabel}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="tab"
          aria-selected={value === o.id}
          onClick={() => onChange(o.id)}
          className={`relative cursor-pointer rounded-full transition-colors ${
            value === o.id ? 'text-fg' : 'text-fg-muted hover:text-fg'
          } ${tabClassName}`}
        >
          {value === o.id && (
            <motion.span
              layoutId={layoutId}
              aria-hidden
              className="absolute inset-0 bg-white/12"
              style={{ borderRadius: 9999 }}
              transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 450, damping: 38 }}
            />
          )}
          <span className="relative">{o.label}</span>
        </button>
      ))}
    </div>
  )
}
