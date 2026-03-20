import type { TableColumn } from './types'
import { cn } from '@/utils/classes'
import { Skeleton } from '../skeleton'
import { TableEmptyRow } from './table-empty-row'
import { TableHeader } from './table-header'
import { TableRow } from './table-row'

export interface TableProps<T extends Record<string, any>> {
  columns: TableColumn<T>[]
  data: T[]
  className?: string
  getRowKey?: (row: T, index: number) => string | number
  emptyMessage?: string
  error?: Error | null
  onRetry?: () => void
  fillHeight?: boolean
  onRowClick?: (row: T) => void
  loading?: boolean
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  className,
  getRowKey = (row, i) => {
    const id = (row as Record<string, unknown>).id
    return id != null ? String(id) : i
  },
  emptyMessage = 'No data',
  error = null,
  fillHeight = false,
  onRowClick,
  loading,
  ...props
}: TableProps<T>) {
  const loadingWidths = ['88%', '72%', '64%', '79%', '69%']

  return (
    <div
      className={cn(
        'min-w-0 overflow-hidden rounded-xl border border-cantabria-border/60 bg-cantabria-surface shadow-sm',
        fillHeight && 'flex min-h-0 flex-1 flex-col',
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          'min-w-0 overflow-x-auto overflow-y-auto',
          fillHeight && 'min-h-0 flex-1',
        )}
      >
        <table className="w-full border-separate border-spacing-0 text-left text-sm text-cantabria-text">
          <TableHeader columns={columns} />
          <tbody className="w-full">
            {
              loading
                ? Array.from({ length: 5 }, (_, rowIndex) => (
                    <TableRow
                      key={rowIndex}
                      row={{ id: rowIndex } as unknown as T}
                      onRowClick={undefined}
                      columns={columns.map(col =>
                        ({
                          ...col,
                          render: (_value: any, _row: any) =>
                            <Skeleton
                              className="h-3.5 bg-white/18"
                              width={loadingWidths[rowIndex % loadingWidths.length]}
                            />,
                        }))}
                    />
                  ))
                : error
                  ? (
                      <TableEmptyRow
                        colSpan={columns.length}
                        message={error.message}
                      />
                    )
                  : data.length === 0
                    ? (
                        <TableEmptyRow
                          colSpan={columns.length}
                          message={emptyMessage}
                        />
                      )
                    : (
                        data.map((row, index) => (
                          <TableRow
                            key={getRowKey(row, index)}
                            row={row}
                            columns={columns}
                            onRowClick={onRowClick}
                          />
                        ))
                      )
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}
