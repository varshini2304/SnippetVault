'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateSnippet } from '@/lib/api'
import type { UpdateSnippetInput } from '@/types'

export const useUpdateSnippet = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateSnippetInput) => updateSnippet(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['snippets'] })
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: ['snippet', variables.id] })
      }
    },
  })
}
