import type { TableColumn } from './types';
import { cn } from '@/utils/classes';

export interface TableHeaderProps<T extends Record<string, any>> {
  columns: TableColumn<T>[];
}

export function TableHeader<T extends Record<string, any>>({
  columns,
}: TableHeaderProps<T>) {
  return (
    <thead>
      <tr className="sticky top-0 z-10 bg-cantabria-dark-muted/80 backdrop-blur">
        {columns.map((col) => {
          return (
            <th
              key={String(col.key)}
              className={cn(
                'border-b border-cantabria-border/70 px-4 py-3 text-xs font-semibold tracking-wide text-cantabria-muted uppercase',
                col.className,
              )}
              style={{
                ...(col.maxWidth && { maxWidth: col.maxWidth }),
                ...(col.minWidth && { minWidth: col.minWidth }),
              }}
            >
              <span className="inline-flex items-center gap-1">
                {col.label}
              </span>
            </th>
          );
        })}
      </tr>
    </thead>
  );
}
