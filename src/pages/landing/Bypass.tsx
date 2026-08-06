import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { CometStream } from '../../components/light/CometStream'
import { DecodeWord } from '../../components/DecodeWord'
import { GrainOverlay } from '../../components/GrainOverlay'

const TRANSPORTS = ['VLESS', 'REALITY', 'XTLS-VISION', 'HYSTERIA2', 'TUIC', 'WIREGUARD']

/**
 * Секция обхода блокировок (см. PROJECT.md → «Наполнение секций»).
 *
 * Единственная секция лендинга, которую ведёт скролл: высокая обёртка + sticky
 * кадр, прогресс `useScroll` раздаётся световому полотну, слову в заголовке и
 * чипам транспортов. Pin делает нативный `position: sticky` — GSAP ради этого
 * не подключаем (обоснование там же в PROJECT.md).
 *
 * Композиция подчинена правилу контраста над WebGL: заголовок стоит выше
 * светового потока, чипы — ниже, поэтому текст не ложится на яркое.
 */
export function Bypass() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Чипы проявляются вместе с прорывом: до него называть транспорты нечем
  const chipsOpacity = useTransform(scrollYProgress, [0.58, 0.86], [0, 1])
  const chipsY = useTransform(scrollYProgress, [0.58, 0.86], [12, 0])

  return (
    <section id="features" ref={sectionRef} className="relative h-[320svh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* Поток опущен под заголовок: свет не должен лежать под текстом */}
        <CometStream progress={scrollYProgress} className="absolute inset-0 translate-y-[8%]" />

        {/* Grain — верхним слоем, как в Hero; к кромкам гаснет вместе со светом */}
        <GrainOverlay className="z-20 mask-[linear-gradient(to_bottom,transparent,black_18%,black_84%,transparent)]" />

        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col px-6">
          <div className="mt-[16svh] max-w-2xl">
            <p className="font-mono text-xs tracking-[0.18em] text-fg-muted uppercase">Access</p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tighter text-balance [text-shadow:0_2px_32px_rgb(0_0_0/0.55)] sm:text-6xl">
              The internet, <DecodeWord word="unfiltered" progress={scrollYProgress} />
            </h2>

            <p className="mt-5 max-w-md leading-6 text-fg-muted [text-shadow:0_1px_16px_rgb(0_0_0/0.7)]">
              News sites, messengers, streaming — whatever your country decided you shouldn't
              reach. And when the blocks move, we move first.
            </p>
          </div>

          <motion.div
            className="mt-auto mb-[10svh]"
            style={reduced ? undefined : { opacity: chipsOpacity, y: chipsY }}
          >
            <p className="font-mono text-[11px] tracking-[0.18em] text-fg-muted uppercase">
              Transports
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-2 gap-y-2">
              {TRANSPORTS.map((name) => (
                <li
                  key={name}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] tracking-[0.08em] text-fg/90"
                >
                  {name}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
