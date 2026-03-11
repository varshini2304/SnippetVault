'use client'

import { useMemo, useState } from 'react'
import { Clipboard, Check } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface CopyButtonProps {
  snippetId: string
  code: string
}

export default function CopyButton({ snippetId, code }: CopyButtonProps) {
  const { toast } = useToast()
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const isCopied = copiedId === snippetId

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = code
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      setCopiedId(snippetId)
      toast({ title: 'Code copied to clipboard' })
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      toast({ title: 'Copy failed', description: 'Please try again.', variant: 'destructive' })
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-tertiary)] px-3 py-1 text-xs text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
    >
      {isCopied ? <Check className="h-3 w-3" /> : <Clipboard className="h-3 w-3" />}
      {isCopied ? 'Copied!' : 'Copy'}
    </button>
  )
}

