import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { servers, type Server } from '../../data/mock'
import type { CorePhase } from './ConnectCore'

export type Phase = CorePhase

/** Длительность фейкового рукопожатия и разрыва, мс */
const CONNECT_MS = 2200
const DISCONNECT_MS = 700

/**
 * Разбор длительности из query: «41:12», «1:02:33» или просто секунды.
 * Возвращает null на мусоре — вызывающий откатится к значению по умолчанию.
 */
function parseDuration(raw: string | null): number | null {
  if (!raw) return null
  const parts = raw.split(':').map((p) => Number(p))
  if (parts.some((n) => !Number.isFinite(n) || n < 0)) return null
  if (parts.length === 1) return parts[0]
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  return null
}

const PHASE_ALIASES: Record<string, Phase> = {
  off: 'off',
  disconnected: 'off',
  connecting: 'connecting',
  on: 'on',
  connected: 'on',
  disconnecting: 'disconnecting',
}

export type AppParams = {
  phase: Phase | null
  seconds: number | null
  server: Server | null
  sheet: 'peek' | 'open' | null
  tab: 'home' | 'servers' | null
  /** Форсированное состояние по умолчанию заморожено — иначе кадр «уедет» */
  live: boolean
}

/**
 * Состояние экрана из query-строки: страница существует ради скриншотов,
 * поэтому любое состояние должно ставиться ссылкой, без кликов.
 * ?state=connected&t=41:12&server=ams-1&sheet=open&tab=home&live=1
 */
export function useAppParams(): AppParams {
  return useMemo(() => {
    const q = new URLSearchParams(window.location.search)
    const state = q.get('state')?.toLowerCase() ?? ''
    const serverId = q.get('server')
    const sheet = q.get('sheet')?.toLowerCase()
    const tab = q.get('tab')?.toLowerCase()

    return {
      phase: PHASE_ALIASES[state] ?? null,
      seconds: parseDuration(q.get('t')),
      server: servers.find((s) => s.id === serverId) ?? null,
      sheet: sheet === 'peek' || sheet === 'open' ? sheet : null,
      tab: tab === 'home' || tab === 'servers' ? tab : null,
      live: q.get('live') === '1',
    }
  }, [])
}

/**
 * Машина состояний подключения. Реального VPN нет: переходы — таймеры,
 * трафик и таймер сессии считаются от момента подключения.
 */
export function useConnection(params: AppParams) {
  const [phase, setPhase] = useState<Phase>(params.phase ?? 'off')
  const [waveKey, setWaveKey] = useState(0)
  const [server, setServer] = useState<Server>(
    params.server ?? [...servers].sort((a, b) => a.ping - b.ping)[0],
  )

  /*
   * Точка отсчёта сессии. Форсированное состояние стартует «в прошлом»:
   * ?t=41:12 означает, что подключение случилось 41 минуту назад.
   */
  const startedAtRef = useRef<number | null>(
    params.phase === 'on' ? Date.now() - (params.seconds ?? 0) * 1000 : null,
  )
  const [seconds, setSeconds] = useState(params.phase === 'on' ? (params.seconds ?? 0) : 0)

  /** Форсированный кадр не тикает: скриншот должен быть детерминирован */
  const frozen = params.phase !== null && !params.live

  const timers = useRef<number[]>([])
  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }
  useEffect(() => clearTimers, [])

  const toggle = useCallback(() => {
    clearTimers()
    setWaveKey((k) => k + 1)

    setPhase((current) => {
      if (current === 'off' || current === 'disconnecting') {
        timers.current.push(
          window.setTimeout(() => {
            startedAtRef.current = Date.now()
            setSeconds(0)
            setPhase('on')
            // Вторая волна — на момент, когда свет действительно вспыхнул
            setWaveKey((k) => k + 1)
          }, CONNECT_MS),
        )
        return 'connecting'
      }
      if (current === 'on' || current === 'connecting') {
        timers.current.push(
          window.setTimeout(() => {
            startedAtRef.current = null
            setPhase('off')
          }, DISCONNECT_MS),
        )
        return 'disconnecting'
      }
      return current
    })
  }, [])

  useEffect(() => {
    if (phase !== 'on' || frozen) return
    const id = window.setInterval(() => {
      const startedAt = startedAtRef.current
      if (startedAt !== null) setSeconds(Math.floor((Date.now() - startedAt) / 1000))
    }, 1000)
    return () => clearInterval(id)
  }, [phase, frozen])

  /*
   * Трафик сессии — производная от её длительности (детерминированно, чтобы
   * один и тот же ?t давал один и тот же скриншот). ~0.42 МБ/с — правдоподобный
   * средний расход при обычном сёрфинге.
   */
  const trafficMB = phase === 'on' ? seconds * 0.42 : 0

  return { phase, toggle, waveKey, seconds, trafficMB, server, setServer }
}
