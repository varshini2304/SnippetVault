'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import { useShares } from '@/hooks/useShares'
import { useAddShare } from '@/hooks/useAddShare'
import { useRemoveShare } from '@/hooks/useRemoveShare'
import { getInitials, hashColor } from '@/lib/utils'
import type { Snippet, SnippetShare } from '@/types'

interface ShareWithUserProps {
  snippet: Snippet
}

export default function ShareWithUser({ snippet }: ShareWithUserProps) {
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)

  const { data, isLoading } = useShares(snippet.id)
  const addShare = useAddShare(snippet.id)
  const removeShare = useRemoveShare(snippet.id)

  const handleShare = async () => {
    setError(null)
    try {
      await addShare.mutateAsync(email)
      setEmail('')
    } catch (err: any) {
      const message = err?.message ?? ''
      if (message.includes('NO_ACCOUNT')) setError('No account found with that email')
      else if (message.includes('SELF_SHARE')) setError('You cannot share a snippet with yourself')
      else if (message.includes('ALREADY_SHARED')) setError('Already shared with this user')
      else setError('Failed to share')
    }
  }

  const handleRemove = async (share: SnippetShare) => {
    await removeShare.mutateAsync(share.id)
    toast({ title: 'Access removed' })
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter email address..."
        />
        <Button className="h-10 bg-[var(--accent)] text-white" onClick={handleShare}>
          Share
        </Button>
      </div>
      {error ? <p className="text-xs text-[var(--danger)]">{error}</p> : null}

      <div>
        <div className="text-xs uppercase text-[var(--text-secondary)]">Shared with ({data?.length ?? 0})</div>
        <div className="mt-3 space-y-2">
          {isLoading ? (
            <>
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </>
          ) : data && data.length > 0 ? (
            data.map((share) => {
              const name = share.profiles?.display_name ?? 'User'
              const initials = getInitials(name)
              const color = hashColor(name)
              return (
                <div
                  key={share.id}
                  className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)] px-3 py-2"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: color }}
                    >
                      {initials}
                    </div>
                    <div>
                      <div className="text-sm text-[var(--text-primary)]">{name}</div>
                      <div className="text-xs text-[var(--text-tertiary)]">@{share.profiles?.username}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(share)}
                    className="text-xs text-[var(--danger)] hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )
            })
          ) : (
            <div className="rounded-xl border border-dashed border-[var(--border)] py-8 text-center text-xs text-[var(--text-tertiary)]">
              Not shared with anyone yet
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

