import de from 'circle-flags/flags/de.svg'
import fi from 'circle-flags/flags/fi.svg'
import fr from 'circle-flags/flags/fr.svg'
import gb from 'circle-flags/flags/gb.svg'
import jp from 'circle-flags/flags/jp.svg'
import nl from 'circle-flags/flags/nl.svg'
import pl from 'circle-flags/flags/pl.svg'
import se from 'circle-flags/flags/se.svg'
import sg from 'circle-flags/flags/sg.svg'
import tr from 'circle-flags/flags/tr.svg'
import us from 'circle-flags/flags/us.svg'

/**
 * Круглые флаги (circle-flags, MIT). Не эмодзи: у эмодзи-флагов нет глифов в
 * Windows — там браузер рисует вместо флага две буквы кода, а размер и посадка
 * на базовую линию задаются шрифтом, а не разметкой.
 *
 * Импорт пофайловый, а не по коду страны: в бандл попадают только те страны,
 * что реально есть в списке серверов. Каждый файл меньше 4 КБ, поэтому Vite
 * инлайнит их в JS как data-URI — сетевых запросов за флагами нет.
 */
const flags: Record<string, string> = { de, fi, fr, gb, jp, nl, pl, se, sg, tr, us }

type FlagProps = {
  /** ISO 3166-1 alpha-2 в нижнем регистре: 'de', 'nl', … */
  code: string
  /** Диаметр в px. */
  size?: number
}

/**
 * Декоративен: страна и город всегда написаны текстом рядом, поэтому флаг
 * скрыт от скринридеров. Кольцо внутрь — чтобы яркий круг не вибрировал
 * краем на почти чёрном фоне карточки.
 */
export function Flag({ code, size = 20 }: FlagProps) {
  const src = flags[code]

  // Неизвестный код (данные придут с бэкенда) — нейтральный кружок,
  // чтобы строка списка не съезжала.
  if (!src) {
    return (
      <span
        aria-hidden
        className="shrink-0 rounded-full bg-surface-2 ring-1 ring-white/15 ring-inset"
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <img
      src={src}
      alt=""
      aria-hidden
      width={size}
      height={size}
      draggable={false}
      className="shrink-0 rounded-full ring-1 ring-white/15 ring-inset select-none"
    />
  )
}
