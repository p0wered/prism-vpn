import { useEffect, useRef } from 'react'
import { useReducedMotion, type MotionValue } from 'motion/react'
import { Geometry, Mesh, Program, Renderer, Triangle } from 'ogl'
import { hexToRgb, startRenderLoop } from '../backgrounds/loop'
import { createStream, type Particle } from './cometScene'
import { COMET_FRAG, COMET_VERT, FIELD_FRAG, FIELD_VERT } from './cometShader'

/**
 * Поток трафика секции Bypass: кометы упираются в мембрану-преграду, а с
 * прорывом уходят дальше вправо (решения — PROJECT.md → «Наполнение секций»).
 *
 * Два аддитивных прохода: мембрана с фоном (полноэкранный треугольник) и
 * кометы (инстансы, один draw call на весь поток).
 *
 * Кометы пока неподвижны — калибруем свет и композицию на статичных кадрах.
 * Скорость у них уже есть (`Comet.speed`), движение включается сдвигом головы
 * по времени, без пересборки геометрии.
 */

const COUNT = 170
// Квад заметно выше линии: в нём должна целиком поместиться вспышка удара
const GLOW_SPREAD = 11
// Сколько живёт гибель частицы после удара, с
const DEATH = 0.42

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1)
  return t * t * (3 - 2 * t)
}

export function CometStream({
  progress,
  className = '',
}: {
  progress: MotionValue<number>
  className?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const progressRef = useRef(progress)
  progressRef.current = progress

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const dpr = Math.min(window.devicePixelRatio, 2)
    const renderer = new Renderer({ dpr, alpha: true, premultipliedAlpha: true, antialias: true })
    const gl = renderer.gl
    if (!('drawBuffers' in gl)) return // шейдеры требуют WebGL2
    gl.clearColor(0, 0, 0, 0)
    /*
     * Аддитивный блендинг задаётся на самих программах, а не глобально:
     * ogl в `Program.applyState` включает BLEND только при `transparent: true`
     * и иначе гасит его — глобальный `gl.enable(BLEND)` до первого draw call не
     * доживает, и второй проход просто затирает первый.
     */
    const additive = {
      transparent: true,
      depthTest: false,
      depthWrite: false,
      // Обязательно: ogl по умолчанию отсекает задние грани, а квады комет после
      // переворота Y в вершинном шейдере становятся именно задними — без этого
      // проход не рисует ни одного треугольника
      cullFace: null,
    }
    gl.canvas.style.width = '100%'
    gl.canvas.style.height = '100%'
    container.appendChild(gl.canvas)

    const css = getComputedStyle(document.documentElement)
    const token = (name: string, fallback: string) =>
      hexToRgb(css.getPropertyValue(name).trim() || fallback)
    const ice = token('--color-ice', '#aaccff')
    const beam = token('--color-beam', '#829bff')

    const fieldProgram = new Program(gl, {
      ...additive,
      vertex: FIELD_VERT,
      fragment: FIELD_FRAG,
      uniforms: {
        uResolution: { value: [1, 1] },
        uWallX: { value: 0 },
        uCenterY: { value: 0 },
        uBand: { value: 1 },
        uDpr: { value: dpr },
        uCharge: { value: 1 },
        uIce: { value: ice },
        uBeam: { value: beam },
      },
    })
    // Именно ONE/ONE: по умолчанию ogl ставит ONE / ONE_MINUS_SRC_ALPHA, и тогда
    // кометы вычитают из уже накопленного света вместо того, чтобы складываться
    fieldProgram.setBlendFunc(gl.ONE, gl.ONE)
    const fieldMesh = new Mesh(gl, { geometry: new Triangle(gl), program: fieldProgram })

    // Единичный квад: x — вдоль следа (1 — голова), y — поперёк
    // Единичный квад; запас под ореол за головой добавляет вершинный шейдер
    const quad = new Float32Array([0, -0.5, 1, -0.5, 1, 0.5, 0, -0.5, 1, 0.5, 0, 0.5])
    const heads = new Float32Array(COUNT * 2 + 64)
    const shapes = new Float32Array(COUNT * 3 + 96)
    // Пара на частицу: яркость линии и сила вспышки удара
    const state = new Float32Array((COUNT + 32) * 2)

    const geometry = new Geometry(gl, {
      position: { size: 2, data: quad },
      iHead: { size: 2, data: heads, instanced: 1 },
      iShape: { size: 3, data: shapes, instanced: 1 },
      iState: { size: 2, data: state, instanced: 1 },
    })
    const cometProgram = new Program(gl, {
      ...additive,
      vertex: COMET_VERT,
      fragment: COMET_FRAG,
      uniforms: {
        uResolution: { value: [1, 1] },
        uGlowSpread: { value: GLOW_SPREAD },
        uIce: { value: ice },
      },
    })
    cometProgram.setBlendFunc(gl.ONE, gl.ONE)
    const cometMesh = new Mesh(gl, { geometry, program: cometProgram })

    let particles: Particle[] = []
    let respawn: (p: Particle, initial: boolean) => void = () => {}
    let wallX = 0
    let width = 0

    const resize = () => {
      const { clientWidth: w, clientHeight: height } = container
      width = w
      renderer.setSize(width, height)

      const centerY = height * 0.56
      const band = Math.min(height * 0.34, 260)
      wallX = Math.round(width * 0.56)

      const stream = createStream({ width, centerY, band, count: COUNT })
      particles = stream.particles
      respawn = stream.spawn
      geometry.instancedCount = particles.length

      fieldProgram.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height]
      fieldProgram.uniforms.uWallX.value = wallX
      fieldProgram.uniforms.uCenterY.value = centerY
      fieldProgram.uniforms.uBand.value = band
      cometProgram.uniforms.uResolution.value = [width, height]
    }
    const ro = new ResizeObserver(resize)
    ro.observe(container)
    resize()

    let prevTime = 0

    const stopLoop = startRenderLoop(container, (time) => {
      const p = reduced ? 1 : progressRef.current.get()

      /*
       * Шаг ограничен сверху: после паузы вкладки rAF отдаёт разрыв в секунды,
       * и поток телепортируется через полкадра вместо того, чтобы течь.
       */
      const dt = prevTime ? Math.min((time - prevTime) / 1000, 0.05) : 0
      prevTime = time

      fieldProgram.uniforms.uCharge.value = 1 - smoothstep(0.35, 0.82, p)

      // Доля потока, которую преграда уже пропускает
      const beyond = smoothstep(0.45, 0.88, p)

      for (let i = 0; i < particles.length; i++) {
        const c = particles[i]
        const hitX = wallX + c.jitter

        /*
         * Судьба решается один раз, на подходе к преграде, жребием по доле
         * beyond. Поэтому правая половина заполняется фронтом, по мере того как
         * туда долетают выжившие, а не загорается разом по всей ширине.
         */
        if (!c.decided && c.x >= hitX) {
          c.decided = true
          c.passed = reduced || Math.random() < beyond
          if (!c.passed) c.x = hitX
        }

        const dying = c.decided && !c.passed
        if (!reduced && !dying) c.x += c.speed * dt

        let a = 1
        let flash = 0
        let lenScale = 1

        if (dying) {
          /*
           * Гибель отсчитывается по времени, а не по пройденному пути: на
           * скорости ~600 px/с частица проскакивала зону гашения за пару кадров
           * и вспышку невозможно было увидеть. Теперь частица встаёт в точке
           * удара — она во что-то упёрлась, а не пролетела сквозь.
           */
          c.dying += dt
          const t = c.dying
          // Хвост догоняет голову: линия схлопывается в точку удара
          lenScale = Math.max(0, 1 - t / 0.16)
          a = 1 - smoothstep(0, 0.14, t)
          flash = Math.exp(-Math.pow((t - 0.06) / 0.075, 2))
          if (t > DEATH) respawn(c, false)
        } else if (c.x - c.len > width + 40) {
          respawn(c, false)
        }

        heads[i * 2] = c.x
        heads[i * 2 + 1] = c.y
        shapes[i * 3] = Math.max(c.len * lenScale, 1)
        shapes[i * 3 + 1] = c.thick
        shapes[i * 3 + 2] = c.bright
        state[i * 2] = a
        state[i * 2 + 1] = flash
      }

      geometry.attributes.iHead.needsUpdate = true
      geometry.attributes.iShape.needsUpdate = true
      geometry.attributes.iState.needsUpdate = true

      renderer.render({ scene: fieldMesh })
      renderer.render({ scene: cometMesh, clear: false })
    })

    return () => {
      stopLoop()
      ro.disconnect()
      gl.getExtension('WEBGL_lose_context')?.loseContext()
      gl.canvas.remove()
    }
  }, [reduced])

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={`pointer-events-none overflow-hidden ${className}`}
    />
  )
}
