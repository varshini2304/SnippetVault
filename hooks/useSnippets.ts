'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchUserSnippets } from '@/lib/api'
import type { Snippet } from '@/types'

export const useSnippets = (userId: string | null) => {
  return useQuery<Snippet[], Error>({
    queryKey: ['snippets', userId],
    queryFn: () => fetchUserSnippets(userId as string),
    enabled: Boolean(userId),
    staleTime: 60_000,
  })
}
