'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createSnippet } from '@/lib/api'
import type { CreateSnippetInput } from '@/types'

export const useCreateSnippet = (userId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateSnippetInput) => {
      if (!userId) throw new Error('Missing user')
      return createSnippet(input, userId)
    },
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ['snippets', userId] })
      }
    },
  })
}
