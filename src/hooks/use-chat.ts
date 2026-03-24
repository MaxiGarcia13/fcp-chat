import type { Message, MessageRole } from '@/types/message'
import { atom } from 'nanostores'
import { useStorage } from './use-storage'

const messagesStore = atom<Message[]>([])
const isLoadingStore = atom(false)

let activeAbortController: AbortController | null = null

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
    isLoadingStore.set(false)
  }

  const restoreMessagesFormStorage = () => {
    if (!chatID)
      return

    messagesStore.set(storage.getJson(`messages-for-chat:${chatID}`) ?? [])
  }

  const fetchMessage = async (signal: AbortSignal) => {
    return await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: messagesStore.get() }),
      signal,
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

  const streamMessage = async (response: Response, chatID: string, signal: AbortSignal) => {
    const id = crypto.randomUUID()

    addMessage('assistant', '', id)

    storage.setJson(`messages-for-chat:${chatID}`, messagesStore.get())

    const reader = response.body?.getReader()
    if (!reader)
      throw new Error('No response body')

    const decoder = new TextDecoder()

    const onAbort = () => {
      void reader.cancel()
    }
    signal.addEventListener('abort', onAbort)

    try {
      while (true) {
        if (signal.aborted)
          break
        let readResult: ReadableStreamReadResult<Uint8Array>
        try {
          readResult = await reader.read()
        } catch {
          if (signal.aborted)
            break
          throw new Error('Stream read failed')
        }
        const { done, value } = readResult
        if (done)
          break
        const chunk = decoder.decode(value, { stream: true })
        updateMessage(id, chunk)
      }
    } finally {
      signal.removeEventListener('abort', onAbort)
      storage.setJson(`messages-for-chat:${chatID}`, messagesStore.get())
    }
  }

  const cancelRequest = () => {
    activeAbortController?.abort()
  }

  const sendMessage = async (message: string, chatID: string) => {
    activeAbortController?.abort()
    const controller = new AbortController()
    activeAbortController = controller
    const { signal } = controller

    addMessage('user', message, crypto.randomUUID())
    storage.setJson(`messages-for-chat:${chatID}`, messagesStore.get())
    isLoadingStore.set(true)

    try {
      const response = await fetchMessage(signal)
      if (!response.ok) {
        const errorMessage = await getErrorMessage(response)
        throw new Error(errorMessage)
      }

      await streamMessage(response, chatID, signal)

      storage.setJson(`messages-for-chat:${chatID}`, messagesStore.get())
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError')
        return
      console.error('Error sending message', error)
      const errorMessage = error instanceof Error ? error.message : 'Error sending message'
      addMessage('assistant', `Error: ${errorMessage}`, crypto.randomUUID())
      storage.setJson(`messages-for-chat:${chatID}`, messagesStore.get())
    } finally {
      isLoadingStore.set(false)
      if (activeAbortController === controller)
        activeAbortController = null
    }
  }

  return {
    store: messagesStore,
    isLoadingStore,
    sendMessage,
    cancelRequest,
    clearMessages,
    restoreMessagesFormStorage,
  }
}
