/**
 * Поток трафика для секции Bypass: частицы (кружок + прямой след).
 *
 * Считаются на CPU и уходят в инстансы одним draw call. Аналитическим полем в
 * шейдере это не рисуется: частиц сотни, у каждой своя длина, скорость и
 * яркость, а перебор в фрагменте стоит O(N) на каждый пиксель.
 *
 * Генератор случайных чисел засеян: набор потока одинаков от запуска к запуску,
 * иначе кадры невозможно сравнивать между итерациями.
 */

export interface Particle {
  /** Голова, логические px от левого верхнего угла */
  x: number
  y: number
  /** Длина следа, px */
  len: number
  /** Полутолщина линии, px */
  thick: number
  bright: number
  /** px/с */
  speed: number
  /**
   * Судьба решается один раз — на подходе к преграде. Так поток за ней
   * заполняется постепенно, фронтом: если вместо этого просто гасить всё
   * правее преграды, при открытии свет появляется сразу по всей ширине.
   */
  decided: boolean
  passed: boolean
  /** Секунды с момента удара; до удара — 0 */
  dying: number
  /** Свой сдвиг точки удара, px: ровная вертикаль читалась бы стеной */
  jitter: number
}

export interface StreamOptions {
  width: number
  centerY: number
  /** Полуширина полосы потока, px */
  band: number
  count: number
  seed?: number
}

/** Шаг между рельсами, px */
const RAIL_GAP = 26

function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Гауссово распределение поперёк потока: в середине плотно, к краям редеет */
function gaussian(rand: () => number) {
  const u = Math.max(rand(), 1e-6)
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand())
}

export function createStream({ width, centerY, band, count, seed = 7 }: StreamOptions) {
  const rand = rng(seed)

  /*
   * Рельсы: частицы идут не по случайным высотам, а по фиксированному набору
   * невидимых линий. Случайная высота на каждый спавн даёт рой; общие рельсы —
   * маршруты, по которым поток течёт.
   *
   * Шаг ровный, но у каждой рельсы свой небольшой сдвиг, заданный раз и
   * навсегда: идеально равномерная лесенка читается таблицей.
   */
  const railCount = Math.max(5, Math.round((band * 2) / RAIL_GAP))
  const rails: number[] = []
  for (let i = 0; i < railCount; i++) {
    const t = railCount === 1 ? 0.5 : i / (railCount - 1)
    rails.push(centerY + (t - 0.5) * band * 1.6 + (rand() - 0.5) * 5)
  }

  /**
   * @param initial при первом заполнении частицы раскиданы по всей ширине,
   * при возврате — уходят за левый край, откуда и втягиваются в кадр
   */
  const spawn = (p: Particle, initial: boolean) => {
    /*
     * Поток однородный. Разброс оставлен только на глубину: примерно четверть
     * частиц уходит «вдаль» — мельче, тусклее и с более коротким следом. Более
     * широкий разброс размеров пробовали: поток разваливался на несоразмерные
     * объекты и переставал читаться одним потоком.
     */
    const far = rand() < 0.26
    const jitter = rand()

    p.x = initial ? -240 + rand() * (width + 480) : -120 - rand() * 460
    // Рельсы к центру полосы гуще: середина потока плотнее краёв
    const pick = Math.min(
      railCount - 1,
      Math.round((0.5 + Math.max(-1, Math.min(1, gaussian(rand))) * 0.29) * (railCount - 1)),
    )
    p.y = rails[pick]
    p.len = far ? 52 + jitter * 26 : 116 + jitter * 46
    p.thick = far ? 0.75 + jitter * 0.15 : 1.15 + jitter * 0.25
    p.bright = far ? 0.5 + jitter * 0.14 : 1.0 + jitter * 0.18
    // Дальние идут медленнее — это и создаёт глубину, одной яркости мало
    p.speed = far ? 210 + jitter * 60 : 520 + jitter * 190
    p.decided = false
    p.passed = false
    p.dying = 0
    p.jitter = (rand() - 0.5) * 26
  }

  const particles: Particle[] = []
  for (let i = 0; i < count; i++) {
    const p: Particle = {
      x: 0,
      y: 0,
      len: 0,
      thick: 0,
      bright: 0,
      speed: 0,
      decided: false,
      passed: false,
      dying: 0,
      jitter: 0,
    }
    spawn(p, true)
    particles.push(p)
  }

  return { particles, spawn }
}
