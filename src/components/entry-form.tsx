import type { Gender } from '@/types'
import { useState } from 'react'
import { CategoryGroupSelect } from './category-select'
import { GenderSwitch } from './gender-switch'

export function EntryForm() {
  const [gender, setGender] = useState<Gender>('MASCULINO')
  const [group, setGroup] = useState('')

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault()

        if (!gender || !group)
          return

        window.location.href = `/${gender}-${group}`
      }}
    >
      <div className="space-y-3">
        <GenderSwitch
          label="Genero"
          name="gender"
          value={gender}
          onChange={(nextGender) => {
            setGender(nextGender)
            setGroup('')
          }}
        />

        <CategoryGroupSelect
          label="Categoria / Grupo"
          name="group"
          gender={gender}
          value={group}
          onChange={setGroup}
        />
      </div>

      <button
        type="submit"
        className="w-full cursor-pointer rounded-md border border-(--color-cantabria-red) bg-(--color-cantabria-red) px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#b71c1c] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Entrar al chat
      </button>
    </form>
  )
}
