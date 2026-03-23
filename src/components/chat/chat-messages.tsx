import { useStore } from '@nanostores/react'
import { navigate } from 'astro:transitions/client'
import { useEffect } from 'react'
import { useChat } from '@/hooks/use-chat'
import { cn } from '@/utils/classes'
import { ChatMessageBubble } from './chat-message-bubble'

export interface ChatMessagesProps {
  className?: string
}

export function ChatMessages({ className }: ChatMessagesProps) {
  const chatID = location.pathname.split('/').pop()

  const { store, clearMessages, restoreMessagesFormStorage } = useChat(chatID)
  const messages = useStore(store)

  useEffect(() => {
    restoreMessagesFormStorage()

    return () => {
      clearMessages()
    }
  }, [])

  return (
    <div
      className={cn(
        'flex h-full flex-1 w-full min-h-48 flex-col gap-3 overflow-y-auto rounded-lg border border-cantabria-border bg-cantabria-surface/30 p-3 pb-14',
        className,
      )}
      role="log"
      aria-live="polite"
      aria-relevant="additions"
    >
      {messages.map(message => (
        <ChatMessageBubble key={message.id} message={message} />
      ))}
    </div>
  )
}
