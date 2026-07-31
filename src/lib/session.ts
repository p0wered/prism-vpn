import { useSyncExternalStore } from 'react'
import { initialUser } from '../data/mock'

/**
 * Мок-сессия. Реальной авторизации в проекте нет (логин пускает по любым
 * кредам), но хедеру лендинга нужно знать, показывать профиль или кнопку
 * входа, — а хедер живёт вне DashboardProvider. Отсюда крошечное внешнее
 * хранилище: факт «вошёл» + ник, в localStorage, чтобы переживало
 * перезагрузку. Остальной стейт dashboard по-прежнему сессионный.
 */

const KEY = 'prismvpn:session'

export type Session = { nickname: string }

function read(): Session | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Session) : null
  } catch {
    return null
  }
}

let session = read()
const listeners = new Set<() => void>()

function write(next: Session | null) {
  session = next
  try {
    if (next) localStorage.setItem(KEY, JSON.stringify(next))
    else localStorage.removeItem(KEY)
  } catch {
    // приватный режим / отключённое хранилище — работаем без persistence
  }
  listeners.forEach((l) => l())
}

export const signIn = (nickname: string = initialUser.nickname) => write({ nickname })
export const signOut = () => write(null)

/** Ник задаётся в Settings — держим хедер в курсе */
export const renameSession = (nickname: string) => {
  if (session) write({ nickname })
}

export const getSession = () => session

export function useSession() {
  return useSyncExternalStore(
    (onChange) => {
      listeners.add(onChange)
      return () => {
        listeners.delete(onChange)
      }
    },
    () => session,
  )
}
