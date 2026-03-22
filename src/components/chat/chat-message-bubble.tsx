import type { Message } from '@/types/message'
import { cn } from '@/utils/classes'

export interface ChatMessageBubbleProps {
  message: Message
  className?: string
}

export function ChatMessageBubble({ message, className }: ChatMessageBubbleProps) {
  const isUser = message.role === 'user'
  const isSystem = message.role === 'system'

  return (
    <div
      className={cn(
        'flex w-full',
        isUser ? 'justify-end' : 'justify-start',
        className,
      )}
    >
      <div
        className={cn(
          'max-w-[min(100%,36rem)] rounded-lg px-3.5 py-2.5 text-sm leading-relaxed',
          isSystem && 'w-full border border-cantabria-border/80 bg-cantabria-surface/60 text-center text-cantabria-muted',
          isUser && 'bg-cantabria-red/90 text-white',
          !isUser && !isSystem && 'border border-cantabria-border bg-cantabria-surface text-cantabria-text',
        )}
      >
        <p className="whitespace-pre-wrap wrap-break-word">{message.content}</p>
      </div>
    </div>
  )
}
