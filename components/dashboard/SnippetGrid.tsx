'use client'

import { useUIStore } from '@/store/uiStore'
import type { Snippet } from '@/types'
import SnippetCard from './SnippetCard'
import { Skeleton } from '@/components/ui/skeleton'

interface SnippetGridProps {
  snippets: Snippet[]
  isLoading: boolean
  hasAnySnippets: boolean
}

export default function SnippetGrid({ snippets, isLoading, hasAnySnippets }: SnippetGridProps) {
  const setActiveSnippet = useUIStore((state) => state.setActiveSnippet)
  const clearFilters = useUIStore((state) => state.clearFilters)

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <Skeleton key={idx} className="h-56 rounded-2xl bg-[var(--bg-secondary)]" />
        ))}
      </div>
    )
  }

  if (snippets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] py-16 text-center">
        <div className="text-lg font-semibold text-[var(--text-primary)]">
          {hasAnySnippets ? 'No snippets match your filters' : 'No snippets yet'}
        </div>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          {hasAnySnippets
            ? 'Try adjusting your search or filters.'
            : 'Create your first snippet to get started.'}
        </p>
        <button
          type="button"
          onClick={() => (hasAnySnippets ? clearFilters() : undefined)}
          className="mt-4 rounded-full border border-[var(--border)] px-4 py-2 text-xs text-[var(--text-secondary)] transition hover:bg-[var(--bg-tertiary)]"
        >
          {hasAnySnippets ? 'Clear filters' : 'Create your first snippet →'}
        </button>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {snippets.map((snippet) => (
        <SnippetCard key={snippet.id} snippet={snippet} onOpen={() => setActiveSnippet(snippet.id)} />
      ))}
    </div>
  )
}
