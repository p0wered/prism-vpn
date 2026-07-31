import type { CSSProperties } from 'react'

/**
 * Прогрессивный блюр у кромки (по мотивам React Bits GradualBlur).
 * От исходника взято ядро приёма: стопка слоёв, у каждого свой
 * backdrop-filter и узкая градиентная маска с перекрытием соседей.
 * На чистом чёрном фоне слой невидим — «стекло» проявляется, только
 * когда под него заезжает контент.
 *
 * Формула силы переделана: у исходника блюр рос линейно крупными шагами —
 * между слоями читались полосы, а на краю зоны был скачок «резко → ~5px».
 * Здесь геометрическая прогрессия: каждый слой вдвое сильнее предыдущего,
 * самый слабый — доли пикселя. Соседние слои отличаются ≤2× (стыки не
 * видны), а кромка зоны растворяется в ноль без границы.
 *
 * Каждый слой — backdrop-filter, который браузер пересчитывает каждый кадр
 * поверх анимированного WebGL-фона, поэтому divCount держим малым.
 */

export function GradualBlur({
  position = 'top',
  height = '7rem',
  maxBlur = 0.75,
  divCount = 6,
  className = '',
}: {
  position?: 'top' | 'bottom'
  height?: string
  /** Сила блюра у самой кромки, rem */
  maxBlur?: number
  divCount?: number
  className?: string
}) {
  const increment = 100 / divCount
  const direction = position === 'top' ? 'to top' : 'to bottom'

  const layers: CSSProperties[] = []
  for (let i = 1; i <= divCount; i++) {
    const blur = maxBlur * 2 ** (i - divCount)

    // Маска слоя — полоса на своём участке с растушёванными краями;
    // соседние полосы перекрываются, чтобы ступени блюра сливались
    const p1 = Math.round((increment * i - increment) * 10) / 10
    const p2 = Math.round(increment * i * 10) / 10
    const p3 = Math.round((increment * i + increment) * 10) / 10
    const p4 = Math.round((increment * i + increment * 2) * 10) / 10
    let gradient = `transparent ${p1}%, black ${p2}%`
    if (p3 <= 100) gradient += `, black ${p3}%`
    if (p4 <= 100) gradient += `, transparent ${p4}%`

    const mask = `linear-gradient(${direction}, ${gradient})`
    layers.push({
      maskImage: mask,
      WebkitMaskImage: mask,
      backdropFilter: `blur(${blur.toFixed(3)}rem)`,
    })
  }

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 ${position === 'top' ? 'top-0' : 'bottom-0'} ${className}`}
      style={{ height }}
    >
      {layers.map((style, i) => (
        <div key={i} className="absolute inset-0" style={style} />
      ))}
    </div>
  )
}
