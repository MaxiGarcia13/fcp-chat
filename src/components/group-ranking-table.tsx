import type { TableColumn } from '@/components/table'
import type { Group, Ranking } from '@/types'
import { navigate } from 'astro:transitions/client'
import { Table } from '@/components/table'
import { useResults } from '@/hooks/use-results'
import { request } from '@/utils/request'

interface GroupRankingTableProps {
  gender: string
  group: string
}

export function GroupRankingTable({ gender, group }: GroupRankingTableProps) {
  const { data, error, loading } = useResults<Group>(
    () => request<Group>(`/api/group?${new URLSearchParams({ gender, group }).toString()}`),
    [gender, group],
  )

  const columns: TableColumn<Ranking>[] = [
    {
      key: 'team',
      label: 'Team',
      className: 'font-medium',
      render: (value) => <span className="text-cantabria-text">{value as string}</span>,
    },
  ]

  const ranking: Ranking[] = data?.ranking ?? []
  const chatPath = (name: string) => `/${gender}-${group}/${name}`

  return (
    <Table<Ranking>
      columns={columns}
      data={ranking}
      loading={loading}
      error={error}
      className="w-full"
      emptyMessage="No teams found"
      onRowClick={row => navigate(chatPath(row.team))}
    />
  )
}
