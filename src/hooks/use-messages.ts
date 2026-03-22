import type { Message, MessageRole } from '@/types/message'
import { useStore } from '@nanostores/react'
import { atom } from 'nanostores'

const messages = atom<Message[]>([])

export function useMessages(type: 'react' | 'astro' = 'react') {
  const addMessage = (message: string, id: string = crypto.randomUUID(), role: MessageRole = 'user') => {
    messages.set([
      ...messages.get(),
      {
        id,
        role,
        content: message,
      },
    ])
  }

  const removeMessage = (id: string) => {
    messages.set(messages.get().filter(message => message.id !== id))
  }

  const updateMessage = (id: string, message: Message) => {
    messages.set(messages.get().map(m => m.id === id ? message : m))
  }

  const clearMessages = () => {
    messages.set([])
  }

  return {
    messages: type === 'react' ? useStore(messages) : messages.get(),
    addMessage,
    removeMessage,
    updateMessage,
    clearMessages,
  }
}
