import { getSmoothScroll } from './smoothScroll'

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Плавный скролл к секции лендинга по id; при reduced-motion — мгновенный.
 *
 * Когда включён инертный скролл, идём через его инстанс: нативный
 * `scrollIntoView` дерётся с Lenis за позицию — тот доводит скролл до своей
 * цели и отменяет прыжок браузера.
 */
export function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return

  const smooth = getSmoothScroll()
  if (smooth) {
    // duration вместо lerp: у перехода по ссылке должен быть предсказуемый
    // конец, а не докатывание, зависящее от длины прыжка
    smooth.scrollTo(el, { duration: 1.1 })
    return
  }

  el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}

export function scrollToTop() {
  const smooth = getSmoothScroll()
  if (smooth) {
    smooth.scrollTo(0, { duration: 1.1 })
    return
  }

  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}
