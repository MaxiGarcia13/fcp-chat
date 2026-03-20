import type { Group, Ranking } from '@/types'
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

  const columns = [
    {
      key: 'team',
      label: 'Team',
    },
  ]

  const ranking: Ranking[] = data?.ranking ?? []

  return (
    <Table<Ranking>
      columns={columns}
      data={ranking}
      loading={loading}
      error={error}
      emptyMessage="No teams found"
    />
  )
}
