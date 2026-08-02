import { ChevronUp } from 'lucide-react'
import { motion, useDragControls, useReducedMotion, type PanInfo } from 'motion/react'
import { Flag } from '../../components/Flag'
import { servers, type Server } from '../../data/mock'
import { ServerRow } from './ServerRow'

/** Полная высота шторки, включая запас под таб-бар */
const SHEET_H = 554
/** Сдвиг вниз в состоянии «выглядывает» */
export const PEEK_Y = 238

export type SheetState = 'peek' | 'open'

/**
 * Шторка серверов на главном экране.
 *
 * В покое выглядывает снизу: видно текущую локацию и две-три строки списка —
 * этого хватает, чтобы кадр обещал продолжение за краем экрана, и при этом
 * кнопка подключения остаётся в одиночестве наверху.
 *
 * Тянется только за шапку (dragListener={false} + dragControls): если повесить
 * drag на всю шторку, раскрытый список перестаёт скроллиться — жест перехватывает
 * перетаскивание.
 */
export function ServerSheet({
  state,
  onStateChange,
  current,
  onSelect,
}: {
  state: SheetState
  onStateChange: (s: SheetState) => void
  current: Server
  onSelect: (s: Server) => void
}) {
  const dragControls = useDragControls()
  const reduced = useReducedMotion()
  const open = state === 'open'

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const goingUp = info.offset.y < -60 || info.velocity.y < -400
    const goingDown = info.offset.y > 60 || info.velocity.y > 400
    if (goingUp) onStateChange('open')
    else if (goingDown) onStateChange('peek')
  }

  return (
    <motion.div
      drag="y"
      dragListener={false}
      dragControls={dragControls}
      dragConstraints={{ top: 0, bottom: PEEK_Y }}
      dragElastic={0.04}
      onDragEnd={handleDragEnd}
      initial={false}
      animate={{ y: open ? 0 : PEEK_Y }}
      transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 360, damping: 40 }}
      style={{ height: SHEET_H }}
      className="absolute inset-x-0 bottom-0 z-20 flex flex-col rounded-t-[28px] border-t border-white/10 bg-surface-1/85 pb-[84px] backdrop-blur-2xl"
    >
      {/* Шапка — она же ручка перетаскивания */}
      <div
        onPointerDown={(e) => dragControls.start(e)}
        className="shrink-0 cursor-grab touch-none active:cursor-grabbing"
      >
        <div className="flex justify-center pt-2.5 pb-1.5">
          <span aria-hidden className="h-1 w-9 rounded-full bg-white/20" />
        </div>

        <button
          type="button"
          onClick={() => onStateChange(open ? 'peek' : 'open')}
          className="flex w-full cursor-pointer items-center gap-3 px-5 pt-1 pb-3 text-left"
        >
          <Flag code={current.code} size={30} />
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] tracking-[0.09em] text-fg-muted uppercase">
              Current location
            </span>
            <span className="block truncate text-[15px] font-medium text-fg">
              {current.city}, {current.country}
            </span>
          </span>
          <span className="font-mono text-[13px] text-fg tabular-nums">{current.ping} ms</span>
          <motion.span
            aria-hidden
            animate={{ rotate: open ? 180 : 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.25 }}
            className="text-fg-muted"
          >
            <ChevronUp size={17} />
          </motion.span>
        </button>
      </div>

      <div className="mx-5 h-px shrink-0 bg-white/8" />

      <div
        className={`no-scrollbar min-h-0 flex-1 px-2 pt-2 ${open ? 'overflow-y-auto' : 'overflow-hidden'}`}
      >
        {servers.map((s) => (
          <ServerRow key={s.id} server={s} selected={s.id === current.id} onSelect={onSelect} />
        ))}
      </div>
    </motion.div>
  )
}
