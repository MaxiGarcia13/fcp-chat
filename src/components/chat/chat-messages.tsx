import { useStore } from '@nanostores/react'
import { useEffect, useRef } from 'react'
import { Skeleton } from '@/components/skeleton'
import { useChat } from '@/hooks/use-chat'
import { cn } from '@/utils/classes'
import { ChatMessageBubble } from './chat-message-bubble'

export interface ChatMessagesProps {
  className?: string
}

export function ChatMessages({ className }: ChatMessagesProps) {
  const messagesRef = useRef<HTMLDivElement>(null)

  const chatID = location.pathname.split('/').pop()

  const { store, isLoadingStore, clearMessages, restoreMessagesFormStorage } = useChat(chatID)
  const messages = useStore(store)
  const isLoading = useStore(isLoadingStore)

  useEffect(() => {
    messagesRef.current?.scrollTo({
      top: messagesRef.current?.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages])

  useEffect(() => {
    restoreMessagesFormStorage()

    return () => {
      clearMessages()
    }
  }, [])

  return (
    <div
      ref={messagesRef}
      className={cn(
        'flex h-0 min-h-0 min-w-0 flex-1 w-full flex-col gap-3 overflow-y-auto rounded-lg border border-cantabria-border bg-cantabria-surface/30 p-3 pb-14',
        className,
      )}
      role="log"
      aria-live="polite"
      aria-relevant="additions"
    >
      {messages.map(message => (
        <ChatMessageBubble key={message.id} message={message} />
      ))}
      {isLoading && (
        <div className="flex w-full justify-start" aria-label="Assistant is typing">
          <Skeleton className="h-3.5 w-[100px]" />
        </div>
      )}
    </div>
  )
}
