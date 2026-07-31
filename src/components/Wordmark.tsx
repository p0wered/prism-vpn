import { Link } from 'react-router'
import { Pyramid } from 'lucide-react'

/**
 * Логотип PrismVPN. Один компонент на лендинг, логин и dashboard —
 * чтобы начертание и размер не разъезжались между разделами.
 */
export function Wordmark({ className = '', onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link to="/" onClick={onClick} className={`flex items-center gap-2.5 text-fg ${className}`}>
      <Pyramid size={20} strokeWidth={1.75} aria-hidden />
      <span className="text-[15px] font-semibold tracking-tight">
        Prism<span className="text-fg-muted">VPN</span>
      </span>
    </Link>
  )
}
