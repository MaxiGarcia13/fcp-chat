import { useStore } from '@nanostores/react'
import { navigate } from 'astro:transitions/client'
import { useEffect, useId, useRef, useState } from 'react'
import { PaperPlaneIcon } from '@/assets/icons/paper-plane'
import { StopIcon } from '@/assets/icons/stop'
import { useChat } from '@/hooks/use-chat'
import { cn } from '@/utils/classes'
import { ChatTextarea } from './chat-textarea'

export interface ChatComposerProps {
  disabled?: boolean
  placeholder?: string
  sendLabel?: string
  className?: string
  focus?: boolean
}

export function ChatComposer({
  disabled,
  placeholder = 'Escribe un mensaje…',
  sendLabel = 'Enviar',
  className,
}: ChatComposerProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { sendMessage, cancelRequest, isLoadingStore } = useChat()
  const isLoading = useStore(isLoadingStore)

  const [value, setValue] = useState('')
  const inputId = useId()

  const trimmed = value.trim()
  const canSend = trimmed.length > 0 && !disabled && !isLoading

  function submit() {
    if (!canSend)
      return

    const isEntrePage = location.pathname === '/'

    const chatID = isEntrePage ? crypto.randomUUID() : location.pathname.split('/').pop()

    sendMessage(trimmed, chatID)

    setValue('')

    if (isEntrePage) {
      navigate(`/${chatID}`)
    }
  }

  useEffect(() => {
    if (focus) {
      inputRef.current?.focus()
    }
  }, [focus])

  return (
    <div className={cn('flex flex-col', className)}>
      <label htmlFor={inputId} className="sr-only">
        Mensaje
      </label>
      <div className="relative flex w-full justify-center">
        <ChatTextarea
          ref={inputRef}
          id={inputId}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          rows={2}
          className="pr-14"
          onChange={e => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== 'Enter' || e.shiftKey)
              return
            e.preventDefault()
            submit()
          }}
        />
        {isLoading
          ? (
              <button
                type="button"
                onClick={cancelRequest}
                aria-label="Detener"
                className={cn(
                  'absolute bottom-2 right-2 inline-flex size-10 cursor-pointer items-center justify-center rounded-md',
                  'border border-cantabria-border bg-cantabria-dark-muted text-white transition-colors',
                  'hover:bg-cantabria-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cantabria-dark focus-visible:ring-offset-2 focus-visible:ring-offset-cantabria-bg',
                )}
              >
                <StopIcon className="size-5" />
              </button>
            )
          : (
              <button
                type="button"
                disabled={!canSend}
                onClick={submit}
                aria-label={sendLabel}
                className={cn(
                  'absolute bottom-2 right-2 inline-flex size-10 cursor-pointer items-center justify-center rounded-md',
                  'border border-cantabria-border bg-cantabria-dark-muted text-white transition-colors',
                  'hover:bg-cantabria-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cantabria-dark focus-visible:ring-offset-2 focus-visible:ring-offset-cantabria-bg',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                )}
              >
                <PaperPlaneIcon className="size-5" />
              </button>
            )}
      </div>
    </div>
  )
}
