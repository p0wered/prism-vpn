import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import {
  DAY_MS,
  initialDevices,
  initialSubToken,
  initialTransactions,
  initialUser,
  generateSubToken,
  plan,
  type Device,
  type Transaction,
} from '../../data/mock'
import { getSession, renameSession } from '../../lib/session'

/**
 * Общий мутируемый стейт dashboard: профиль, баланс, устройства, транзакции,
 * ссылка-подписка. Живёт на время сессии (React state, без persistence) —
 * достаточно для мок-флоу: rename/revoke устройств, top up, reset link.
 */
type DashboardState = {
  nickname: string
  email: string
  balance: number
  devices: Device[]
  transactions: Transaction[]
  subToken: string
  /** Сколько дней подписки покрывает текущий баланс */
  daysLeft: number
  expiresAt: Date
  setNickname: (name: string) => void
  renameDevice: (id: string, name: string) => void
  revokeDevice: (id: string) => void
  topUp: (amount: number) => void
  resetSubToken: () => void
}

const DashboardContext = createContext<DashboardState | null>(null)

export function DashboardProvider({ children }: { children: ReactNode }) {
  // Ник — единственное поле, общее с мок-сессией: его показывает хедер
  // лендинга, который живёт вне провайдера
  const [nickname, setNicknameState] = useState(getSession()?.nickname ?? initialUser.nickname)
  const setNickname = (name: string) => {
    setNicknameState(name)
    renameSession(name)
  }
  const [balance, setBalance] = useState(initialUser.balance)
  const [devices, setDevices] = useState(initialDevices)
  const [transactions, setTransactions] = useState(initialTransactions)
  const [subToken, setSubToken] = useState(initialSubToken)

  const value = useMemo<DashboardState>(() => {
    const daysLeft = Math.floor(balance / plan.dailyRate)
    return {
      nickname,
      email: initialUser.email,
      balance,
      devices,
      transactions,
      subToken,
      daysLeft,
      expiresAt: new Date(Date.now() + daysLeft * DAY_MS),
      setNickname,
      renameDevice: (id, name) =>
        setDevices((prev) => prev.map((d) => (d.id === id ? { ...d, name } : d))),
      revokeDevice: (id) => setDevices((prev) => prev.filter((d) => d.id !== id)),
      topUp: (amount) => {
        setBalance((prev) => Math.round((prev + amount) * 100) / 100)
        setTransactions((prev) => [
          { id: `tx-topup-${Date.now()}`, date: new Date(), amount, label: 'Top up' },
          ...prev,
        ])
      },
      resetSubToken: () => setSubToken(generateSubToken()),
    }
  }, [nickname, balance, devices, transactions, subToken])

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}

export function useDashboard() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider')
  return ctx
}
