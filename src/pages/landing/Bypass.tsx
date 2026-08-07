import { DecodeWord } from '../../components/DecodeWord'
import { GrainOverlay } from '../../components/GrainOverlay'
import { Reveal } from '../../components/Reveal'

const TRANSPORTS = ['VLESS', 'REALITY', 'XTLS-VISION', 'HYSTERIA2', 'TUIC', 'WIREGUARD']

/**
 * Секция обхода блокировок (см. PROJECT.md → «Наполнение секций»).
 *
 * Светового полотна и привязки к скроллу здесь нет: секция держится на
 * типографике, слово в заголовке разбирается при появлении в кадре, чипы
 * транспортов приходят общим `Reveal` — как в остальных контентных секциях.
 * Пропорции кадра (заголовок сверху, чипы у нижней кромки) сохранены от
 * sticky-версии: `min-h-svh` + `mt-auto`.
 */
export function Bypass() {
  return (
    <section id="features" className="relative flex min-h-svh flex-col overflow-hidden">
      {/* Grain — верхним слоем, как в Hero; к кромкам гаснет, чтобы не резать стык секций */}
      <GrainOverlay className="z-20 mask-[linear-gradient(to_bottom,transparent,black_18%,black_84%,transparent)]" />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-6">
        {/* Заголовок не ревилим: его событие — разбор слова, второй fade поверх
            только смазал бы момент */}
        <div className="mt-[16svh] max-w-2xl">
          <p className="font-mono text-xs tracking-[0.18em] text-fg-muted uppercase">Access</p>

          <h2 className="mt-4 text-4xl font-semibold tracking-tighter text-balance sm:text-6xl">
            The internet, <DecodeWord word="unfiltered" />
          </h2>

          <p className="mt-5 max-w-md leading-6 text-fg-muted">
            News sites, messengers, streaming — whatever your country decided you shouldn't reach.
            And when the blocks move, we move first.
          </p>
        </div>

        <Reveal className="mt-auto mb-[10svh]">
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
        </Reveal>
      </div>
    </section>
  )
}
