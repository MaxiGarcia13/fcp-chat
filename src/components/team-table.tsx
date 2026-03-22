import type { TableColumn } from '@/components/table'
import type { Player, Team } from '@/types'
import { Table } from '@/components/table'
import { useResults } from '@/hooks/use-results'
import { request } from '@/utils/request'

const TEAM_CACHE_TTL_MS = 5 * 24 * 60 * 60 * 1000

interface TeamTableProps {
  gender: string
  group: string
  name: string
}

export function TeamTable({ gender, group, name }: TeamTableProps) {
  const { data, error, loading } = useResults<Team>(
    () => request<Team>('/api/team', {
      params: { gender, group, name },
      cacheTTL: TEAM_CACHE_TTL_MS,
    }),
    [gender, group, name],
  )

  const columns: TableColumn<Player>[] = [
    {
      key: 'position',
      label: '#',
      className: 'w-12 tabular-nums text-cantabria-text-muted',
    },
    {
      key: 'name',
      label: 'Name',
      className: 'font-medium',
    },
    {
      key: 'surname',
      label: 'Surname',
    },
    {
      key: 'totalPoints',
      label: 'Points',
      className: 'tabular-nums',
    },
  ]

  const players = data?.players ?? []

  return (
    <Table<Player>
      columns={columns}
      data={players}
      loading={loading}
      error={error}
      className="w-full"
      emptyMessage="No players found"
      getRowKey={(row, i) => `${row.name}-${row.surname}-${row.position}-${i}`}
    />
  )
}
