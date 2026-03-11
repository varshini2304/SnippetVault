'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchShares } from '@/lib/api'
import type { SnippetShare } from '@/types'

export const useShares = (snippetId: string) => {
  return useQuery<SnippetShare[], Error>({
    queryKey: ['shares', snippetId],
    queryFn: () => fetchShares(snippetId),
    enabled: Boolean(snippetId),
  })
}
