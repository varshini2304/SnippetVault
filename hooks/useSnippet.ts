'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchSnippetById } from '@/lib/api'
import type { Snippet } from '@/types'

export const useSnippet = (id: string | null) => {
  return useQuery<Snippet | null, Error>({
    queryKey: ['snippet', id],
    queryFn: () => fetchSnippetById(id as string),
    enabled: Boolean(id),
  })
}
