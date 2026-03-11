'use client'

import { useMemo } from 'react'
import { getInitials, hashColor } from '@/lib/utils'

interface AvatarPreviewProps {
  displayName: string
}

export default function AvatarPreview({ displayName }: AvatarPreviewProps) {
  const initials = useMemo(() => getInitials(displayName || 'Your Name'), [displayName])
  const color = useMemo(() => hashColor(displayName || 'SnippetVault'), [displayName])

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]/80 p-4 shadow-[0_0_30px_rgba(0,0,0,0.25)]">
      <div className="flex items-center gap-4">
        <div
          key={displayName}
          className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold text-white transition animate-[namePulse_300ms_ease]"
          style={{ backgroundColor: color }}
        >
          {initials}
        </div>
        <div>
          <div className="font-display text-lg font-semibold text-[var(--text-primary)] transition">
            {displayName || 'Your Name'}
          </div>
          <div className="text-xs text-[var(--text-tertiary)]">0 public snippets</div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        {['typescript', 'python', 'sql'].map((label) => (
          <span
            key={label}
            className="rounded-full border border-[var(--border)] bg-[var(--bg-tertiary)] px-2 py-1 text-[var(--text-secondary)]"
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
