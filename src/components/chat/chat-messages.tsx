import type { ChatMessage } from './types'
import { useEffect, useRef } from 'react'
import { PaperPlaneIcon } from '@/assets/icons/paper-plane'
import { cn } from '@/utils/classes'
import { ChatMessageBubble } from './chat-message-bubble'

export interface ChatMessagesProps {
  messages: ChatMessage[]
  className?: string
}

export function ChatMessages({ messages, className }: ChatMessagesProps) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages])

  function scrollToEnd() {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }

  return (
    <div className={cn('relative', className)}>
      <div
        className="flex max-h-[min(60vh,28rem)] min-h-48 flex-col gap-3 overflow-y-auto rounded-lg border border-cantabria-border bg-cantabria-surface/30 p-3 pb-14"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messages.map(msg => (
          <ChatMessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={endRef} aria-hidden />
      </div>
      <button
        type="button"
        onClick={scrollToEnd}
        aria-label="Ir al último mensaje"
        className={cn(
          'absolute bottom-3 right-3 z-10 inline-flex size-10 items-center justify-center rounded-md',
          'border border-cantabria-border bg-cantabria-dark-muted text-white shadow-md transition-colors',
          'hover:bg-cantabria-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cantabria-dark focus-visible:ring-offset-2 focus-visible:ring-offset-cantabria-bg',
        )}
      >
        <PaperPlaneIcon className="size-5" />
      </button>
    </div>
  )
}
