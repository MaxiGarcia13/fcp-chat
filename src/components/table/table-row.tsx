import type { TableColumn } from './types';
import { cn } from '@/utils/classes';
import { getNestedValue } from '@/utils/objects';

export interface TableRowProps<T extends Record<string, any>> {
  row: T;
  columns: TableColumn<T>[];
  onRowClick?: (row: T) => void;
}

export function TableRow<T extends Record<string, any>>({
  row,
  columns,
  onRowClick,
}: TableRowProps<T>) {
  const isInteractive = Boolean(onRowClick);

  return (
    <tr
      className={cn(
        'border-b border-cantabria-border/45 last:border-b-0',
        'transition-colors',
        isInteractive ? 'cursor-pointer hover:bg-cantabria-dark-muted/25' : 'hover:bg-cantabria-dark-muted/10',
      )}
      onClick={onRowClick ? () => onRowClick(row) : undefined}
      role={onRowClick ? 'button' : undefined}
    >
      {columns.map((col) => {
        const raw = getNestedValue(row as Record<string, unknown>, String(col.key));
        const content = col.render ? col.render(raw, row) : (raw as React.ReactNode);
        return (
          <td
            key={String(col.key)}
            className={cn('px-4 py-3.5 text-cantabria-text/95 align-middle', col.className)}
            style={{
              ...(col.maxWidth && { maxWidth: col.maxWidth }),
              ...(col.minWidth && { minWidth: col.minWidth }),
            }}
          >
            {content ?? '—'}
          </td>
        );
      })}
    </tr>
  );
}
