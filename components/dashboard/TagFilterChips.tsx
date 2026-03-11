'use client'

import { useUIStore } from '@/store/uiStore'

interface TagFilterChipsProps {
  tags: string[]
}

export default function TagFilterChips({ tags }: TagFilterChipsProps) {
  const selectedTags = useUIStore((state) => state.selectedTags)
  const toggleTag = useUIStore((state) => state.toggleTag)
  const clearFilters = useUIStore((state) => state.clearFilters)

  const isAll = selectedTags.length === 0

  return (
    <div className="flex w-full flex-1 items-center gap-2 overflow-x-auto pb-1">
      <button
        type="button"
        onClick={() => clearFilters()}
        className={`rounded-full px-3 py-1 text-xs transition ${
          isAll ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
        }`}
      >
        All
      </button>
      {tags.map((tag) => {
        const active = selectedTags.includes(tag)
        return (
          <button
            key={tag}
            type="button"
            onClick={() => toggleTag(tag)}
            className={`rounded-full border px-3 py-1 text-xs transition ${
              active
                ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                : 'border-[var(--border)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
            }`}
          >
            #{tag}
          </button>
        )
      })}
    </div>
  )
}
