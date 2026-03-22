import { useId, useState } from 'react'
import { PaperPlaneIcon } from '@/assets/icons/paper-plane'
import { cn } from '@/utils/classes'
import { ChatTextarea } from './chat-textarea'

export interface ChatComposerProps {
  onSend: (text: string) => void
  disabled?: boolean
  placeholder?: string
  sendLabel?: string
  className?: string
}

export function ChatComposer({
  onSend,
  disabled,
  placeholder = 'Escribe un mensaje…',
  sendLabel = 'Enviar',
  className,
}: ChatComposerProps) {
  const [value, setValue] = useState('')
  const inputId = useId()

  const trimmed = value.trim()
  const canSend = trimmed.length > 0 && !disabled

  function submit() {
    if (!canSend)
      return
    onSend(trimmed)
    setValue('')
  }

  return (
    <div className={cn('flex flex-col', className)}>
      <label htmlFor={inputId} className="sr-only">
        Mensaje
      </label>
      <div className="relative flex w-full justify-center">
        <ChatTextarea
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
      </div>
    </div>
  )
}
