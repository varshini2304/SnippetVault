'use client'

import { useMemo, useState } from 'react'
import { Copy, ExternalLink, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { buildShareUrl } from '@/lib/utils'
import { useUpdateSnippet } from '@/hooks/useUpdateSnippet'
import type { Snippet } from '@/types'

interface SharePublicUrlProps {
  snippet: Snippet
}

export default function SharePublicUrl({ snippet }: SharePublicUrlProps) {
  const { toast } = useToast()
  const updateMutation = useUpdateSnippet()
  const [copied, setCopied] = useState(false)

  const url = useMemo(() => buildShareUrl(snippet.id), [snippet.id])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast({ title: 'Copy failed', variant: 'destructive' })
    }
  }

  const makePublic = async () => {
    try {
      await updateMutation.mutateAsync({ id: snippet.id, is_public: true })
      toast({ title: 'Snippet is now public' })
    } catch (err: any) {
      toast({ title: 'Update failed', description: err?.message, variant: 'destructive' })
    }
  }

  if (!snippet.is_public) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-[var(--warning)]/60 bg-[var(--warning)]/10 p-4 text-sm">
          <div className="flex items-center gap-2 text-[var(--warning)]">
            <Lock className="h-4 w-4" />
            <span className="font-semibold">This snippet is private</span>
          </div>
          <p className="mt-2 text-[var(--text-secondary)]">Make it public to generate a shareable link.</p>
          <Button className="mt-3 h-9 bg-[var(--accent)] text-white" onClick={makePublic}>
            Make Public
          </Button>
        </div>
        <Separator />
        <p className="text-xs text-[var(--text-tertiary)]">
          Tip: You can share with specific people below using their email.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="text-xs uppercase text-[var(--text-secondary)]">Public URL</div>
      <div className="relative">
        <Input value={url} readOnly className="pr-10" />
        <button
          type="button"
          onClick={handleCopy}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] transition hover:text-[var(--text-primary)]"
        >
          {copied ? 'Copied!' : <Copy className="h-4 w-4" />}
        </button>
      </div>
      <span className="inline-flex w-fit items-center rounded-full border border-[var(--success)] px-3 py-1 text-xs text-[var(--success)]">
        🟢 Publicly accessible
      </span>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
      >
        Open in new tab <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  )
}

