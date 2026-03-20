import type { Gender } from '@/types'
import { useRef, useState } from 'react'
import { cn } from '@/utils/classes'
import { Field } from './field'

const options: { value: Gender, label: string }[] = [
  { value: 'MASCULINO', label: 'Masculino' },
  { value: 'FEMENINO', label: 'Femenino' },
]

export interface GenderSwitchProps {
  label?: string
  name?: string
  value?: Gender
  onChange?: (value: Gender) => void
}

export function GenderSwitch({ label, name, value = 'MASCULINO', onChange }: GenderSwitchProps) {
  const [active, setActive] = useState<Gender>(value)
  const buttonsRef = useRef<Array<HTMLButtonElement | null>>([])

  return (
    <Field
      id={name}
      label={label}
      role="radiogroup"
      aria-label={label}
    >
      <div className="inline-flex w-full overflow-hidden rounded-md border border-(--color-cantabria-border) bg-(--color-cantabria-surface)">
        {options.map((opt, i) => {
          const isActive = active === opt.value
          const isSecond = i === 1
          return (
            <button
              key={opt.value}
              ref={(el) => {
                buttonsRef.current[i] = el
              }}
              type="button"
              role="radio"
              tabIndex={value ? 0 : -1}
              aria-checked={isActive}
              onClick={() => {
                setActive(opt.value)
                onChange?.(opt.value)
              }}
              className={cn(
                'flex-1 cursor-pointer px-4 py-2.5 text-sm font-medium transition-colors',
                isSecond && 'border-l border-(--color-cantabria-border)',
                isActive
                  ? 'relative z-10 bg-(--color-cantabria-red) text-white'
                  : 'bg-transparent text-(--color-cantabria-text) hover:bg-(--color-cantabria-dark-muted)',
                'focus-visible:z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-cantabria-red) focus-visible:ring-inset',
              )}
            >
              {opt.label}
            </button>
          )
        })}
      </div>

      <input type="hidden" name={name} value={active} />
    </Field>
  )
}
