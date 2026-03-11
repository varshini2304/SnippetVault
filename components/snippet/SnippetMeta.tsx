'use client'

import type { Snippet } from '@/types'
import { formatDate, formatRelativeTime } from '@/lib/utils'

interface SnippetMetaProps {
  snippet: Snippet
}

export default function SnippetMeta({ snippet }: SnippetMetaProps) {
  return (
    <div className="grid grid-cols-2 gap-4 text-sm text-[var(--text-secondary)]">
      <div>
        <div className="text-xs text-[var(--text-tertiary)]">📅 Created</div>
        <div className="mt-1 text-[var(--text-primary)]">{formatDate(snippet.created_at)}</div>
      </div>
      <div>
        <div className="text-xs text-[var(--text-tertiary)]">🔄 Updated</div>
        <div className="mt-1 text-[var(--text-primary)]">{formatRelativeTime(snippet.updated_at)}</div>
      </div>
      <div>
        <div className="text-xs text-[var(--text-tertiary)]">🌐 Visibility</div>
        <div className="mt-1 flex items-center gap-2 text-[var(--text-primary)]">
          <span
            className={`h-2 w-2 rounded-full ${
              snippet.is_public ? 'bg-[var(--success)]' : 'bg-[var(--warning)]'
            }`}
          />
          {snippet.is_public ? 'Public' : 'Private'}
        </div>
      </div>
      <div>
        <div className="text-xs text-[var(--text-tertiary)]">👁 Views</div>
        <div className="mt-1 text-[var(--text-primary)]">{snippet.view_count ?? 0}</div>
      </div>
    </div>
  )
}
