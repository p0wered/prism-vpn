import { useEffect, useRef, useState } from 'react'
import { useMotionValueEvent, useReducedMotion, type MotionValue } from 'motion/react'

/**
 * Слово в заголовке, которое проходит цензуру вместе с секцией: пока трафик
 * заблокирован — оно набрано мусорными глифами в плашках, к моменту прорыва
 * разбирается в нормальное слово (см. PROJECT.md → «Наполнение секций»).
 *
 * Механика взята из React Bits DecryptedText (`refs/`), но переписана: оригинал
 * держит React-стейт на каждый символ и перерисовывает все спаны каждые 50 мс
 * всё время жизни компонента. Здесь позиция раскрытия считается прямо из
 * прогресса скролла, а тасовка глифов работает только внутри окна перехода —
 * до и после него интервал остановлен.
 */

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&$@*/\\<>'
const SHUFFLE_MS = 55

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

export function DecodeWord({
  word,
  progress,
  from = 0.34,
  to = 0.74,
  className = '',
}: {
  word: string
  progress: MotionValue<number>
  /** Прогресс секции, на котором слово начинает разбираться */
  from?: number
  /** Прогресс, на котором оно уже читается целиком */
  to?: number
  className?: string
}) {
  const reduced = useReducedMotion()
  const [revealed, setRevealed] = useState(() => (reduced ? word.length : 0))
  // Счётчик кадров тасовки: меняет только нераскрытые глифы
  const [shuffle, setShuffle] = useState(0)
  const timerRef = useRef<number | null>(null)

  const stopShuffle = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  useMotionValueEvent(progress, 'change', (v) => {
    if (reduced) return
    const ratio = clamp01((v - from) / (to - from))
    const next = Math.round(ratio * word.length)
    setRevealed((prev) => (prev === next ? prev : next))

    const active = ratio > 0 && ratio < 1
    if (active && timerRef.current === null) {
      timerRef.current = window.setInterval(() => setShuffle((n) => n + 1), SHUFFLE_MS)
    } else if (!active) {
      stopShuffle()
    }
  })

  useEffect(() => stopShuffle, [])

  useEffect(() => {
    if (reduced) setRevealed(word.length)
  }, [reduced, word])

  // Считается прямо в рендере: он и так происходит только на смену revealed
  // или shuffle, а мемоизация по счётчику тасовки ничего бы не сэкономила
  void shuffle
  const chars = word.split('').map((char, i) => {
    if (i < revealed) return { char, done: true }
    return { char: GLYPHS[Math.floor(Math.random() * GLYPHS.length)], done: false }
  })

  return (
    /*
     * Ширину задаёт настоящее слово в скрытом слое, а мусорные глифы выведены
     * из потока абсолютом: они шире оригинала, и если дать им влиять на размер,
     * заголовок скачет — на калибровке он от этого перекладывался с двух строк
     * на одну ровно в момент, когда слово дочитывалось. `visibility: hidden`
     * скринридеры не читают, поэтому доступный текст отдаётся отдельно.
     */
    <span className={`relative inline-block ${className}`}>
      <span className="invisible">{word}</span>
      <span className="sr-only">{word}</span>
      <span aria-hidden className="absolute inset-0 whitespace-pre">
        {chars.map(({ char }, i) => (
          <span
            key={i}
          >
            {char}
          </span>
        ))}
      </span>
    </span>
  )
}
