'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { removeShare } from '@/lib/api'

export const useRemoveShare = (snippetId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (shareId: string) => removeShare(shareId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shares', snippetId] })
    },
  })
}
