import { useId, type ComponentPropsWithoutRef } from 'react'

type InputProps = ComponentPropsWithoutRef<'input'> & {
  label: string
}

/*
 * Текстовое поле с плавающим лейблом: в покое лейбл лежит по центру поля,
 * при фокусе или заполнении уменьшается и поднимается к верхней кромке.
 * Механика подъёма — .float-label в index.css; placeholder=" " обязателен,
 * на нём держится детекция «поле заполнено» через :placeholder-shown.
 */
export function Input({ label, id, className = '', ...props }: InputProps) {
  const fallbackId = useId()
  const inputId = id ?? fallbackId

  return (
    <div className={`relative ${className}`}>
      <input
        id={inputId}
        placeholder=" "
        className="peer w-full rounded-xl bg-surface-2 px-4 pt-5.5 pb-2
        text-sm text-fg focus:outline-1 focus:outline-white/25 disabled:opacity-50"
        {...props}
      />
      <label
        htmlFor={inputId}
        className="float-label text-sm text-fg-muted peer-focus:text-fg/80 peer-disabled:opacity-50"
      >
        {label}
      </label>
    </div>
  )
}
