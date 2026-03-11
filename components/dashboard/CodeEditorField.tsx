'use client'

import { useMemo, useRef, type KeyboardEvent } from 'react'

interface CodeEditorFieldProps {
  id: string
  value: string
  onChange: (value: string) => void
  hasError?: boolean
}

export default function CodeEditorField({ id, value, onChange, hasError }: CodeEditorFieldProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const lines = useMemo(() => value.split('\n').length, [value])

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Tab') {
      event.preventDefault()
      const textarea = textareaRef.current
      if (!textarea) return
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newValue = `${value.slice(0, start)}  ${value.slice(end)}`
      onChange(newValue)
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2
      })
    }
  }

  return (
    <div
      className={`relative min-h-[280px] rounded-xl border bg-[var(--syntax-bg)] ${
        hasError ? 'border-[var(--danger)] animate-[shake_300ms_ease]' : 'border-[var(--border)]'
      }`}
    >
      <div className="absolute left-0 top-0 bottom-0 w-12 border-r border-[var(--border)] bg-[var(--bg-tertiary)]/20 text-right text-xs text-[var(--text-tertiary)]">
        {Array.from({ length: lines }).map((_, idx) => (
          <div key={idx} className="px-2 leading-6">{idx + 1}</div>
        ))}
      </div>
      <textarea
        id={id}
        ref={textareaRef}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        className="min-h-[280px] w-full resize-none bg-transparent px-14 py-3 font-code text-sm text-[var(--text-primary)] outline-none"
      />
    </div>
  )
}
