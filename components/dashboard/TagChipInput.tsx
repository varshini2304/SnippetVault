'use client'

import { useEffect, useRef, useState, type KeyboardEvent } from 'react'

interface TagChipInputProps {
  value: string[]
  onChange: (next: string[]) => void
  maxTags?: number
}

export default function TagChipInput({ value, onChange, maxTags = 10 }: TagChipInputProps) {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!inputRef.current) return
    inputRef.current.value = input
  }, [input])

  const addTag = (raw: string) => {
    const tag = raw.trim().toLowerCase()
    if (!tag || value.includes(tag) || value.length >= maxTags) return
    onChange([...value, tag])
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      addTag(input)
      setInput('')
    }
  }

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag))
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)] p-3">
      <input
        ref={inputRef}
        type="text"
        placeholder="Add tag, press Enter..."
        className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)]"
        onChange={(event) => setInput(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="mt-3 flex flex-wrap gap-2">
        {value.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-1 text-xs text-[var(--text-secondary)] animate-[scaleIn_200ms_ease_forwards]"
          >
            #{tag}
            <button
              type="button"
              className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
              onClick={() => removeTag(tag)}
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  )
}
