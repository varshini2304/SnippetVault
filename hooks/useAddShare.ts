'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addShare } from '@/lib/api'

export const useAddShare = (snippetId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (email: string) => addShare(snippetId, email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shares', snippetId] })
    },
  })
}
