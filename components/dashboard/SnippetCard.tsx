'use client'

import { MoreHorizontal, Pencil, Share2, Trash2 } from 'lucide-react'
import type { Snippet } from '@/types'
import { useUIStore } from '@/store/uiStore'
import { getLanguageColor, formatRelativeTime, truncateLines } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface SnippetCardProps {
  snippet: Snippet
  onOpen: () => void
}

export default function SnippetCard({ snippet, onOpen }: SnippetCardProps) {
  const activeSnippetId = useUIStore((state) => state.activeSnippetId)
  const isActive = activeSnippetId === snippet.id
  const colors = getLanguageColor(snippet.language)

  return (
    <div
      onClick={onOpen}
      className={`cursor-pointer rounded-2xl border bg-[var(--bg-secondary)] p-4 transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-[0_0_24px_var(--accent-glow)] ${
        isActive ? 'border-[var(--accent)] bg-[var(--bg-elevated)]' : 'border-[var(--border)]'
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className="rounded-full border px-3 py-1 text-xs"
          style={{ backgroundColor: colors.bg, color: colors.text, borderColor: colors.border }}
        >
          {snippet.language}
        </span>
        <span
          className={`rounded-full border px-2 py-0.5 text-[10px] ${
            snippet.is_public
              ? 'border-[var(--success)] text-[var(--success)]'
              : 'border-[var(--warning)] text-[var(--warning)]'
          }`}
        >
          {snippet.is_public ? '🌐 Public' : '🔒 Private'}
        </span>
      </div>

      <div className="mt-4 text-base font-semibold text-[var(--text-primary)]">{snippet.title}</div>

      <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--syntax-bg)] p-3 font-code text-xs text-[var(--text-secondary)]">
        {truncateLines(snippet.code, 3)
          .split('\n')
          .map((line, idx) => (
            <div key={idx} className="truncate">
              {line}
            </div>
          ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {(snippet.tags ?? []).slice(0, 3).map((tag) => (
          <span
            key={tag.id}
            className="rounded-full border border-[var(--border)] bg-[var(--bg-tertiary)] px-2 py-0.5 text-[10px] text-[var(--text-secondary)]"
          >
            #{tag.name}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-[var(--text-tertiary)]">
        <span>📅 {formatRelativeTime(snippet.updated_at)}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-transparent text-[var(--text-secondary)] transition hover:border-[var(--border)] hover:bg-[var(--bg-tertiary)]"
              onClick={(event) => event.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 border-[var(--border)] bg-[var(--bg-elevated)]">
            <DropdownMenuItem onClick={(event) => event.stopPropagation()}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(event) => event.stopPropagation()}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-[var(--danger)]"
              onClick={(event) => event.stopPropagation()}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
