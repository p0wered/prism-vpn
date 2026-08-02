import { useMemo, useState } from 'react'
import { PillTabs } from '../../components/PillTabs'
import { servers, type Server } from '../../data/mock'
import { ServerRow } from './ServerRow'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'standard', label: 'Standard' },
  { id: 'gaming', label: 'Gaming' },
] as const

type Filter = (typeof FILTERS)[number]['id']

/**
 * Вкладка Servers — полный список. Сортировка по пингу: «ближайший сверху» —
 * единственный порядок, который на этом экране имеет смысл по умолчанию.
 */
export function ServersTab({
  current,
  onSelect,
}: {
  current: Server
  onSelect: (s: Server) => void
}) {
  const [filter, setFilter] = useState<Filter>('all')

  const list = useMemo(
    () =>
      servers
        .filter((s) => filter === 'all' || s.type === filter)
        .sort((a, b) => a.ping - b.ping),
    [filter],
  )

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 px-5 pt-2 pb-4">
        <h1 className="text-[26px] font-semibold tracking-tight text-fg">Servers</h1>
        <p className="mt-0.5 text-[12px] text-fg-muted">
          {list.length} locations · sorted by latency
        </p>
        <PillTabs
          value={filter}
          onChange={setFilter}
          options={FILTERS}
          ariaLabel="Server type"
          className="mt-4 w-fit"
          tabClassName="px-3.5 py-1 text-[12px]"
        />
      </div>

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-2 pb-[92px]">
        {list.map((s) => (
          <ServerRow key={s.id} server={s} selected={s.id === current.id} onSelect={onSelect} />
        ))}
      </div>
    </div>
  )
}
