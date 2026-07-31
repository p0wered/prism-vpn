import { useState, type FormEvent } from 'react'
import { Button } from '../../components/Button'
import { GlassCard } from '../../components/GlassCard'
import { Reveal } from '../../components/Reveal'
import { useToast } from '../../components/Toast'
import { useDashboard } from './DashboardContext'
import { PageHeader } from './PageHeader'

const inputCls =
  'w-full rounded-xl bg-surface-2 px-4 py-2.5 text-sm text-fg placeholder:text-fg-muted focus:outline-2 focus:outline-white/25'

export function SettingsPage() {
  const { nickname, email, setNickname } = useDashboard()
  const toast = useToast()
  const [nameDraft, setNameDraft] = useState(nickname)
  const [language, setLanguage] = useState<'en' | 'ru'>('en')
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')

  const saveProfile = (e: FormEvent) => {
    e.preventDefault()
    const name = nameDraft.trim()
    if (!name) return
    setNickname(name)
    toast('Profile updated')
  }

  const savePassword = (e: FormEvent) => {
    e.preventDefault()
    if (!currentPw || !newPw) return
    setCurrentPw('')
    setNewPw('')
    toast('Password updated')
  }

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <Reveal>
        <PageHeader title="Settings" sub="Account, language and security." />
      </Reveal>

      <Reveal delay={0.05}>
        <GlassCard className="p-6 lg:p-7">
          <form onSubmit={saveProfile} className="flex flex-col gap-4 pl-2">
            <h2 className="text-sm font-medium">Profile</h2>
            <label className="flex flex-col gap-1.5 text-xs text-fg-muted">
              Nickname — shown across the dashboard
              <input
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                className={inputCls}
                maxLength={24}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-xs text-fg-muted">
              Email
              <input value={email} disabled className={`${inputCls} opacity-50`} />
            </label>
            <div>
              <Button type="submit" variant="secondary" disabled={nameDraft.trim() === nickname}>
                Save
              </Button>
            </div>
          </form>
        </GlassCard>
      </Reveal>

      <Reveal delay={0.1}>
        <GlassCard className="p-6 lg:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4 pl-2">
            <div>
              <h2 className="text-sm font-medium">Language</h2>
              <p className="mt-1 text-xs text-fg-muted">
                Interface language. Russian arrives together with i18n.
              </p>
            </div>
            <div className="flex rounded-full bg-surface-2 p-1" role="tablist" aria-label="Language">
              {(['en', 'ru'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  role="tab"
                  aria-selected={language === lang}
                  onClick={() => {
                    setLanguage(lang)
                    if (lang === 'ru') toast('Русский появится вместе с i18n')
                  }}
                  className={`cursor-pointer rounded-full px-4 py-1.5 font-mono text-xs uppercase transition-colors ${
                    language === lang ? 'bg-white/12 text-fg' : 'text-fg-muted hover:text-fg'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </GlassCard>
      </Reveal>

      <Reveal delay={0.15}>
        <GlassCard className="p-6 lg:p-7">
          <form onSubmit={savePassword} className="flex flex-col gap-4 pl-2">
            <h2 className="text-sm font-medium">Change password</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 text-xs text-fg-muted">
                Current password
                <input
                  type="password"
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  className={inputCls}
                  autoComplete="current-password"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-xs text-fg-muted">
                New password
                <input
                  type="password"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  className={inputCls}
                  autoComplete="new-password"
                />
              </label>
            </div>
            <div>
              <Button type="submit" variant="secondary" disabled={!currentPw || !newPw}>
                Update password
              </Button>
            </div>
          </form>
        </GlassCard>
      </Reveal>
    </div>
  )
}
