'use client'

import { useMemo } from 'react'
import type { Snippet } from '@/types'
import { useUIStore } from '@/store/uiStore'

export const useFilteredSnippets = (snippets: Snippet[]) => {
  const searchQuery = useUIStore((state) => state.searchQuery)
  const selectedTags = useUIStore((state) => state.selectedTags)
  const visibilityFilter = useUIStore((state) => state.visibilityFilter)

  return useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return snippets.filter((snippet) => {
      if (visibilityFilter === 'public' && !snippet.is_public) return false
      if (visibilityFilter === 'private' && snippet.is_public) return false

      if (selectedTags.length > 0) {
        const snippetTags = snippet.tags?.map((tag) => tag.name) ?? []
        const hasAll = selectedTags.every((tag) => snippetTags.includes(tag))
        if (!hasAll) return false
      }

      if (!normalizedQuery) return true

      const haystack = [
        snippet.title,
        snippet.language,
        snippet.description ?? '',
        ...(snippet.tags?.map((tag) => tag.name) ?? []),
      ]
        .join(' ')
        .toLowerCase()

      return haystack.includes(normalizedQuery)
    })
  }, [snippets, searchQuery, selectedTags, visibilityFilter])
}
