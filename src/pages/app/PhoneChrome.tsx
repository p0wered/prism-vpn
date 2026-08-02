import { BarChart3, Globe, Shield, User } from 'lucide-react'
import { motion } from 'motion/react'

export type AppTab = 'home' | 'servers' | 'stats' | 'account'

/**
 * Системная строка iOS. Рисуем сами: без неё скрин читается как веб-страница,
 * а не как приложение. Динамический остров впечён в PNG рамки и стоит по
 * центру (≈143–252 px по ширине экрана), поэтому группы разведены к краям.
 *
 * Время — каноническое 9:41: фиксированное значение делает скриншоты
 * повторяемыми, а реальные часы каждый раз давали бы новый кадр.
 */
export function StatusBar({ connected }: { connected: boolean }) {
  return (
    <div className="relative z-30 flex h-[54px] shrink-0 items-center justify-between px-8 pt-4">
      <span className="font-sans text-[15px] font-semibold tracking-tight tabular-nums">9:41</span>

      <div className="flex items-center gap-1.5">
        {/* Бейдж VPN в статус-баре — то, что iOS показывает при активном туннеле */}
        <motion.span
          aria-hidden
          initial={false}
          animate={{ opacity: connected ? 1 : 0, scale: connected ? 1 : 0.85 }}
          transition={{ duration: 0.25 }}
          className="mr-0.5 rounded-[4px] bg-fg px-1 py-px font-sans text-[9px] leading-[1.3] font-bold text-black"
        >
          VPN
        </motion.span>

        {/* Сигнал, wi-fi и батарея — как глифы, векторно: иконки lucide тут
            выглядят слишком «веб», у iOS другая метрика */}
        <svg width="17" height="11" viewBox="0 0 17 11" aria-hidden className="fill-fg">
          <rect x="0" y="7.5" width="3" height="3.5" rx="1" />
          <rect x="4.7" y="5.2" width="3" height="5.8" rx="1" />
          <rect x="9.4" y="2.7" width="3" height="8.3" rx="1" />
          <rect x="14.1" y="0" width="3" height="11" rx="1" />
        </svg>

        {/* Три дуги: рисуются штрихом, а не заливкой — у заливочных путей
            верхняя дуга уезжала за viewBox и обрезалась */}
        <svg
          width="16"
          height="12"
          viewBox="0 0 16 12"
          aria-hidden
          fill="none"
          strokeWidth="1.9"
          strokeLinecap="round"
          className="stroke-fg"
        >
          <path d="M1.3 4.4a9.4 9.4 0 0 1 13.4 0" />
          <path d="M4.1 7.5a5.5 5.5 0 0 1 7.8 0" />
          <path d="M6.9 10.5a1.6 1.6 0 0 1 2.2 0" />
        </svg>

        <svg width="26" height="12" viewBox="0 0 26 12" aria-hidden>
          <rect x="0.5" y="0.5" width="21" height="11" rx="3.4" fill="none" stroke="currentColor" strokeOpacity=".38" className="text-fg" />
          <rect x="2.2" y="2.2" width="17.6" height="7.6" rx="2" className="fill-fg" />
          <path d="M23.2 4.2v3.6a2 2 0 0 0 0-3.6Z" className="fill-fg" opacity=".4" />
        </svg>
      </div>
    </div>
  )
}

const TABS: { id: AppTab; label: string; icon: typeof Shield; enabled: boolean }[] = [
  { id: 'home', label: 'Home', icon: Shield, enabled: true },
  { id: 'servers', label: 'Servers', icon: Globe, enabled: true },
  { id: 'stats', label: 'Stats', icon: BarChart3, enabled: false },
  { id: 'account', label: 'Account', icon: User, enabled: false },
]

/**
 * Таб-бар. Живые только Home и Servers — остальные вкладки существуют ради
 * достоверности кадра и намеренно не кликаются (disabled, не просто «мёртвые»:
 * иначе с клавиатуры на них можно уйти в никуда).
 */
export function TabBar({ value, onChange }: { value: AppTab; onChange: (t: AppTab) => void }) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-30 h-[84px] border-t border-white/8 bg-black/55 backdrop-blur-2xl">
      <div className="flex h-[60px] items-center justify-around px-2">
        {TABS.map(({ id, label, icon: Icon, enabled }) => {
          const active = value === id
          return (
            <button
              key={id}
              type="button"
              disabled={!enabled}
              aria-current={active ? 'page' : undefined}
              onClick={() => onChange(id)}
              className={`flex w-16 flex-col items-center gap-1 rounded-xl py-1 transition-colors ${
                enabled ? 'cursor-pointer' : 'cursor-default'
              } ${active ? 'text-fg' : enabled ? 'text-fg-muted' : 'text-fg-muted/35'}`}
            >
              <Icon
                size={21}
                strokeWidth={active ? 2.1 : 1.7}
                style={
                  active ? { filter: 'drop-shadow(0 0 7px rgb(255 255 255/.45))' } : undefined
                }
              />
              <span className="text-[10px] leading-none font-medium tracking-tight">{label}</span>
            </button>
          )
        })}
      </div>

      {/* Home indicator */}
      <div className="flex justify-center">
        <span aria-hidden className="h-[5px] w-[136px] rounded-full bg-fg/85" />
      </div>
    </div>
  )
}
