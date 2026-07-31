const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Плавный скролл к секции лендинга по id; при reduced-motion — мгновенный */
export function scrollToSection(id: string) {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}
