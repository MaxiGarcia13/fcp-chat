import { cn } from '@/utils/classes';

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  children: React.ReactNode;
}

export function Field({ label, children, id, ...props }: FieldProps) {
  return (
    <div className={cn('block min-w-0', props.className)} {...props}>
      {
        label
        && (
          <label htmlFor={id} className="mb-1.5 block text-xs font-semibold tracking-wide text-(--color-cantabria-muted)">
            {label}
          </label>
        )
      }
      {children}
    </div>
  );
}
