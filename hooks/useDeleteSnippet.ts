'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteSnippet } from '@/lib/api'
import type { Snippet } from '@/types'

export const useDeleteSnippet = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteSnippet(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['snippets'] })
      const previous = queryClient.getQueriesData<Snippet[]>({ queryKey: ['snippets'] })

      previous.forEach(([key, data]) => {
        if (!data) return
        queryClient.setQueryData(
          key,
          data.filter((snippet) => snippet.id !== id)
        )
      })

      return { previous }
    },
    onError: (_err, _id, context) => {
      context?.previous.forEach(([key, data]) => {
        queryClient.setQueryData(key, data)
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['snippets'] })
    },
  })
}
