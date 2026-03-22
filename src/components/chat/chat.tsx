import type { ChatMessage } from './types'
import { cn } from '@/utils/classes'
import { ChatComposer } from './chat-composer'
import { ChatMessages } from './chat-messages'

export interface ChatProps {
  messages: ChatMessage[]
  onSend: (text: string) => void
  disabled?: boolean
  placeholder?: string
  emptyTitle?: string
  emptyDescription?: string
  className?: string
}

export function Chat({
  messages,
  onSend,
  disabled,
  placeholder,
  className,
}: ChatProps) {
  return (
    <section className={cn('flex flex-col gap-4', className)} aria-label="Chat">
      {
        messages.length > 0
        && (
          <ChatMessages
            messages={messages}
          />
        )
      }
      <ChatComposer onSend={onSend} disabled={disabled} placeholder={placeholder} />
    </section>
  )
}
