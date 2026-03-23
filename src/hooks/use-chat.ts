import type { Message, MessageRole } from '@/types/message'
import { atom } from 'nanostores'
import { useStorage } from './use-storage'

const messagesStore = atom<Message[]>([])

export function useChat(chatID?: string) {
  const storage = useStorage()

  const getErrorMessage = async (response: Response) => {
    try {
      const data = await response.json()
      if (typeof data?.message === 'string' && data.message.length > 0)
        return data.message
    } catch {
      // Ignore JSON parsing failures and fallback to status text.
    }

    return response.statusText || 'Request failed'
  }

  const clearMessages = () => {
    messagesStore.set([])
  }

  const restoreMessagesFormStorage = () => {
    if (!chatID)
      return

    messagesStore.set(storage.getJson(`messages-for-chat:${chatID}`) ?? [])
  }

  const fetchMessage = async () => {
    return await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: messagesStore.get() }),
    })
  }

  const updateMessage = async (id: string, content: string) => {
    messagesStore.set(messagesStore.get().map(message =>
      message.id === id
        ? { ...message, parts: [...message.parts, { type: 'text', text: content }] }
        : message))
  }

  const addMessage = (role: MessageRole, content: string, id: string) => {
    messagesStore.set([...messagesStore.get(), { id, role, parts: [{ type: 'text', text: content }] }])
  }

  const streamMessage = async (response: Response, chatID: string) => {
    const id = crypto.randomUUID()

    addMessage('assistant', '', id)

    storage.setJson(`messages-for-chat:${chatID}`, messagesStore.get())

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader?.read()
      if (done)
        break
      const chunk = decoder.decode(value, { stream: true })

      updateMessage(id, chunk)
    }
  }

  const sendMessage = async (message: string, chatID: string) => {
    addMessage('user', message, crypto.randomUUID())
    storage.setJson(`messages-for-chat:${chatID}`, messagesStore.get())

    try {
      const response = await fetchMessage()

      if (!response.ok) {
        const errorMessage = await getErrorMessage(response)
        throw new Error(errorMessage)
      }

      await streamMessage(response, chatID)

      storage.setJson(`messages-for-chat:${chatID}`, messagesStore.get())
    } catch (error) {
      console.error('Error sending message', error)
      const errorMessage = error instanceof Error ? error.message : 'Error sending message'
      addMessage('assistant', `Error: ${errorMessage}`, crypto.randomUUID())
      storage.setJson(`messages-for-chat:${chatID}`, messagesStore.get())
    }
  }

  return {
    store: messagesStore,
    sendMessage,
    clearMessages,
    restoreMessagesFormStorage,
  }
}
