import Link from 'next/link'
import type { Snippet } from '@/types'
import { getLanguageColor, formatRelativeTime, truncateLines } from '@/lib/utils'

interface PublicSnippetCardProps {
  snippet: Snippet
}

export default function PublicSnippetCard({ snippet }: PublicSnippetCardProps) {
  const colors = getLanguageColor(snippet.language)

  return (
    <Link
      href={`/s/${snippet.id}`}
      className="block rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-[0_0_24px_var(--accent-glow)]"
    >
      <div className="flex items-center justify-between">
        <span
          className="rounded-full border px-3 py-1 text-xs"
          style={{ backgroundColor: colors.bg, color: colors.text, borderColor: colors.border }}
        >
          {snippet.language}
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
        <span>👁 {snippet.view_count ?? 0}</span>
      </div>
    </Link>
  )
}
