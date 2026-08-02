import { Power } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { ConnectCore, type CorePhase } from './ConnectCore'

type ConnectButtonProps = {
  phase: CorePhase
  waveKey: number
  onToggle: () => void
}

/**
 * Радиус кольца и его длина в единицах viewBox. Длина считается руками, а не
 * через pathLength={1}: motion сам держит pathLength и подменяет им
 * strokeDasharray, из-за чего заданный массив штрихов игнорируется и дуга
 * рассыпается на пунктир.
 */
const RING_R = 48
const RING_LEN = 2 * Math.PI * RING_R

const LABELS: Record<CorePhase, string> = {
  off: 'Connect',
  connecting: 'Cancel connection',
  on: 'Disconnect',
  disconnecting: 'Disconnecting',
}

/**
 * Кнопка подключения — центр экрана приложения.
 *
 * Три слоя, снизу вверх:
 *   1. световое ядро на шейдере (ConnectCore) — во всю ширину экрана;
 *   2. кольцо-диафрагма: несёт состояние (бежит на подключении, светится
 *      подключённым) — намеренно тонкое, чтобы не спорить со светом;
 *   3. матовый диск: backdrop-blur размывает ядро под собой, поэтому свет
 *      читается сквозь стекло, а не как картинка за кнопкой.
 *
 * Текста внутри нет: состояние проговаривает свет и блок статуса под кнопкой,
 * подпись на диске только шумела бы. Для скринридеров — aria-label.
 */
export function ConnectButton({ phase, waveKey, onToggle }: ConnectButtonProps) {
  const reduced = useReducedMotion()
  const busy = phase === 'connecting' || phase === 'disconnecting'
  const on = phase === 'on'

  return (
    <div className="relative flex h-[318px] shrink-0 items-center justify-center">
      {/* Канвас во всю ширину экрана: ореолу и ударной волне нужен разбег */}
      <ConnectCore phase={phase} waveKey={waveKey} className="absolute inset-0" />

      <div className="relative size-[212px]">
        {/* Кольцо-диафрагма */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90 overflow-visible">
          <circle cx="50" cy="50" r={RING_R} fill="none" stroke="rgb(255 255 255/.07)" strokeWidth="0.7" />

          {/* Подключено: ровное свечение по всему кольцу */}
          <motion.circle
            cx="50"
            cy="50"
            r={RING_R}
            fill="none"
            stroke="var(--color-ice)"
            strokeWidth="0.9"
            animate={{ opacity: on ? 0.32 : 0 }}
            transition={{ duration: 0.6 }}
            style={{ filter: 'drop-shadow(0 0 3px var(--color-ice))' }}
          />

          {/* Бегущая дуга: на переходах — быстрая, подключённым — медленный обход */}
          <motion.g
            style={{ transformOrigin: '50px 50px' }}
            animate={reduced ? {} : { rotate: 360 }}
            transition={{ duration: busy ? 1.1 : 9, ease: 'linear', repeat: Infinity }}
          >
            <motion.circle
              cx="50"
              cy="50"
              r={RING_R}
              fill="none"
              stroke="var(--color-fg)"
              strokeWidth="1.1"
              strokeLinecap="round"
              /*
               * Штрихи — обычным атрибутом, мимо motion: переданный в animate
               * strokeDasharray motion пересчитывает по-своему и дуга
               * рассыпается на пунктир. Интерполировать тут нечего — состояния
               * и так разводятся прозрачностью.
               */
              strokeDasharray={
                busy ? `${RING_LEN * 0.17} ${RING_LEN}` : `${RING_LEN * 0.3} ${RING_LEN}`
              }
              animate={{ opacity: busy ? 1 : on ? 0.8 : 0 }}
              transition={{ duration: 0.4 }}
              style={{ filter: 'drop-shadow(0 0 4px rgb(255 255 255/.6))' }}
            />
          </motion.g>
        </svg>

        {/* Матовый диск */}
        <motion.button
          type="button"
          onClick={onToggle}
          aria-label={LABELS[phase]}
          aria-pressed={on}
          whileTap={{ scale: 0.965 }}
          transition={{ type: 'spring', stiffness: 500, damping: 32 }}
          /*
           * Заливка почти нулевая, блюр средний: диск должен работать матовым
           * стеклом НАД светом, а не серой шайбой. При blur-xl турбулентность
           * ядра размывалась в ровный градиент и свет терял фактуру.
           */
          className="connect-disc absolute inset-[14px] flex cursor-pointer items-center justify-center rounded-full bg-white/2 backdrop-blur-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fg"
        >
          {/*
            Подключённым глиф стоит на выбитом в белое центре ядра, и белым по
            белому он пропадает. Отделяем его тёмным ореолом — это читается как
            глубина (глиф ближе к зрителю, свет за ним), а не как подложка.
          */}
          <motion.span
            animate={{
              opacity: on ? 1 : 0.55,
              filter: on
                ? 'drop-shadow(0 0 7px rgb(0 0 0/.6)) drop-shadow(0 0 2px rgb(0 0 0/.5))'
                : 'drop-shadow(0 0 0 rgb(0 0 0/0))',
            }}
            transition={{ duration: 0.5 }}
          >
            <Power size={34} strokeWidth={on ? 2 : 1.6} className="text-fg" />
          </motion.span>
        </motion.button>
      </div>
    </div>
  )
}
