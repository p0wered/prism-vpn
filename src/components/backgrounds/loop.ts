/**
 * Общий rAF-цикл для WebGL-фонов:
 * - пауза вне вьюпорта (IntersectionObserver);
 * - prefers-reduced-motion → один статичный кадр вместо анимации.
 * Возвращает функцию cleanup.
 */
export function startRenderLoop(
  container: HTMLElement,
  render: (timeMs: number) => void,
  staticTimeMs = 3000,
): () => void {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let raf = 0
  let running = false

  const frame = (t: number) => {
    render(t)
    if (running) raf = requestAnimationFrame(frame)
  }

  const start = () => {
    if (reduced) {
      render(staticTimeMs)
      return
    }
    if (!running) {
      running = true
      raf = requestAnimationFrame(frame)
    }
  }

  const stop = () => {
    running = false
    cancelAnimationFrame(raf)
  }

  const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), {
    threshold: 0.05,
  })
  io.observe(container)

  return () => {
    stop()
    io.disconnect()
  }
}

export const hexToRgb = (hex: string): [number, number, number] => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return m
    ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255]
    : [1, 1, 1]
}
