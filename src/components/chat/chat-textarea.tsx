import type { TextareaHTMLAttributes } from 'react'
import { cn } from '@/utils/classes'

export interface ChatTextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'style'> {
  ref?: React.RefObject<HTMLTextAreaElement>
  value: string
  maxHeightPx?: number
}

export function ChatTextarea({
  ref,
  className,
  ...props
}: ChatTextareaProps) {
  return (
    <textarea
      ref={ref}
      className={cn(
        'min-h-14 w-full resize-none overflow-y-auto rounded-md border border-cantabria-border bg-cantabria-surface py-2.5 pl-3 pr-3 text-base text-cantabria-text',
        'transition-colors duration-150',
        'placeholder:text-cantabria-muted',
        'hover:border-cantabria-dark hover:bg-cantabria-dark-muted',
        'focus:border-cantabria-dark focus:outline-none focus:ring-1 focus:ring-cantabria-dark',
        'disabled:cursor-not-allowed disabled:opacity-50 field-sizing-content',
        className,
      )}
      {...props}
    />
  )
}
