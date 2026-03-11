'use client'

import { useEffect, useMemo, useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { useSnippets } from '@/hooks/useSnippets'
import { useFilteredSnippets } from '@/hooks/useFilteredSnippets'
import { useUIStore } from '@/store/uiStore'
import SnippetGrid from '@/components/dashboard/SnippetGrid'
import SearchBar from '@/components/dashboard/SearchBar'
import TagFilterChips from '@/components/dashboard/TagFilterChips'
import LanguageStatsBar from '@/components/dashboard/LanguageStatsBar'
import SnippetDetailPanel from '@/components/dashboard/SnippetDetailPanel'
import SnippetForm from '@/components/dashboard/SnippetForm'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function DashboardPage() {
  const { toast } = useToast()
  const supabase = useMemo(() => getSupabaseBrowserClient(), [])
  const [userId, setUserId] = useState<string | null>(null)
  const setSearchQuery = useUIStore((state) => state.setSearchQuery)
  const visibilityFilter = useUIStore((state) => state.visibilityFilter)
  const setVisibilityFilter = useUIStore((state) => state.setVisibilityFilter)

  // Form state: null = closed, 'create' = create mode, 'edit' = edit mode (handled by SnippetDetailPanel)
  const [formOpen, setFormOpen] = useState(false)

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user?.id) setUserId(data.user.id)
    }
    loadUser()
  }, [supabase])

  const { data: snippets, isLoading, error } = useSnippets(userId)
  const filtered = useFilteredSnippets(snippets ?? [])

  const totalCount = snippets?.length ?? 0
  const publicCount = snippets?.filter((snippet) => snippet.is_public).length ?? 0

  const allTags = useMemo(() => {
    const set = new Set<string>()
    ;(snippets ?? []).forEach((snippet) => snippet.tags?.forEach((tag) => set.add(tag.name)))
    return Array.from(set).sort()
  }, [snippets])

  const languageCounts = useMemo(() => {
    const map = new Map<string, number>()
    ;(snippets ?? []).forEach((snippet) => {
      map.set(snippet.language, (map.get(snippet.language) ?? 0) + 1)
    })
    return Array.from(map.entries())
  }, [snippets])

  useEffect(() => {
    if (error) {
      toast({
        title: 'Failed to load snippets',
        description: 'Please try again.',
        variant: 'destructive',
      })
    }
  }, [error, toast])

  return (
    <div className="relative space-y-8">
      <section className="rounded-2xl border border-transparent bg-[var(--bg-primary)] px-6 py-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold">My Snippets</h1>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {totalCount} snippets · {publicCount} public
            </p>
          </div>
          <Button
            className="h-11 bg-[var(--accent)] text-white"
            onClick={() => setFormOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Snippet
          </Button>
        </div>
        <div className="mt-6">
          <LanguageStatsBar
            counts={languageCounts}
            total={totalCount}
            onSelect={(language) => setSearchQuery(language)}
          />
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full lg:max-w-xl">
            <SearchBar />
          </div>
          <div className="flex w-full flex-wrap items-center justify-between gap-4">
            <TagFilterChips tags={allTags} />
            <div className="flex items-center rounded-full border border-[var(--border)] bg-[var(--bg-tertiary)] p-1 text-xs">
              {(['all', 'public', 'private'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setVisibilityFilter(value)}
                  className={`rounded-full px-3 py-1 transition ${
                    visibilityFilter === value
                      ? 'bg-[var(--accent)] text-white'
                      : 'text-[var(--text-secondary)]'
                  }`}
                >
                  {value[0].toUpperCase() + value.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <SnippetGrid
          snippets={filtered}
          isLoading={isLoading}
          hasAnySnippets={totalCount > 0}
        />
      </section>

      {/* Detail panel (handles its own edit form state) */}
      <SnippetDetailPanel userId={userId} />

      {/* Create form overlay */}
      {formOpen && (
        <SnippetForm
          mode="create"
          userId={userId}
          onClose={() => setFormOpen(false)}
        />
      )}
    </div>
  )
}
