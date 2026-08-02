/** Форматирование дат/чисел dashboard. Локаль en-US — основной язык портфолио. */

export const formatDate = (d: Date) =>
  d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

export const formatDateFull = (d: Date) =>
  d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export const formatMoney = (n: number) => {
  const abs = Math.abs(n).toFixed(2)
  return `${n < 0 ? '−' : ''}$${abs}`
}

export const formatGB = (n: number) =>
  n >= 100 ? `${Math.round(n)} GB` : `${n.toFixed(1)} GB`

/** Трафик сессии: до гигабайта — в МБ, дальше в ГБ («1038.2 MB» не читается) */
export const formatTrafficMB = (mb: number) =>
  mb >= 1024 ? `${(mb / 1024).toFixed(2)} GB` : `${mb.toFixed(1)} MB`

/**
 * Длительность сессии: 00:41:12. Часы всегда двузначные, а рядом обязателен
 * tabular-nums: иначе на каждой секунде строка меняет ширину и таймер дёргается.
 */
export function formatDuration(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds))
  return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60]
    .map((n) => String(n).padStart(2, '0'))
    .join(':')
}

/** «2 min ago» / «3 h ago» / «yesterday» / дата */
export function relativeTime(d: Date) {
  const diffMin = Math.round((Date.now() - d.getTime()) / 60000)
  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin} min ago`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `${diffH} h ago`
  if (diffH < 48) return 'yesterday'
  return formatDate(d)
}
