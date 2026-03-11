'use client'

import { useEffect, useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { debounce } from '@/lib/utils'
import { useUIStore } from '@/store/uiStore'

interface SearchBarProps {
  variant?: 'navbar' | 'default'
}

export default function SearchBar({ variant = 'default' }: SearchBarProps) {
  const searchQuery = useUIStore((state) => state.searchQuery)
  const setSearchQuery = useUIStore((state) => state.setSearchQuery)
  const [value, setValue] = useState(searchQuery)

  useEffect(() => {
    setValue(searchQuery)
  }, [searchQuery])

  const debounced = useMemo(() => debounce(setSearchQuery, 300), [setSearchQuery])

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-tertiary)]" />
      <Input
        value={value}
        onChange={(event) => {
          setValue(event.target.value)
          debounced(event.target.value)
        }}
        placeholder="Search snippets by title, tag, or language..."
        className={`h-11 pl-10 pr-20 ${variant === 'navbar' ? 'bg-[var(--bg-tertiary)]' : ''}`}
      />
      {value ? (
        <button
          type="button"
          onClick={() => {
            setValue('')
            setSearchQuery('')
          }}
          className="absolute right-12 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] transition hover:text-[var(--text-primary)]"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
      <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] text-[var(--text-tertiary)]">
        ⌘K
      </span>
    </div>
  )
}
