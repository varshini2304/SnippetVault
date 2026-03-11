'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { buildShareUrl, getLanguageColor, truncateLines } from '@/lib/utils'
import type { Snippet } from '@/types'

interface CopyLinkButtonProps {
  snippet: Snippet
}

export default function CopyLinkButton({ snippet }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false)
  const url = useMemo(() => buildShareUrl(snippet.id), [snippet.id])
  const colors = getLanguageColor(snippet.language)
  const preview = truncateLines(snippet.code, 3)

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = url
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-tertiary)] p-4 text-xs text-[var(--text-secondary)]">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--accent)] text-[10px] text-white">SV</div>
          <span className="text-[var(--text-secondary)]">SnippetVault</span>
        </div>
        <div className="text-sm font-semibold text-[var(--text-primary)]">{snippet.title}</div>
        <div className="mt-2 flex items-center gap-2">
          <span
            className="rounded-full border px-2 py-0.5 text-[10px]"
            style={{ backgroundColor: colors.bg, color: colors.text, borderColor: colors.border }}
          >
            {snippet.language}
          </span>
          <span className="text-[10px] text-[var(--text-tertiary)]">by {snippet.profiles?.display_name ?? 'you'}</span>
        </div>
        <pre className="mt-3 whitespace-pre-wrap font-code text-[10px] text-[var(--text-tertiary)]">
{preview}
        </pre>
      </div>

      <Button className="h-11 w-full bg-[var(--accent)] text-white" onClick={handleCopy}>
        {copied ? '✓ Link Copied!' : '📋 Copy Link'}
      </Button>

      {!snippet.is_public ? (
        <div className="rounded-xl border border-[var(--warning)]/60 bg-[var(--warning)]/10 p-3 text-xs text-[var(--warning)]">
          🔒 This link won't work for visitors until you make the snippet public. It will work for you as the owner.
        </div>
      ) : null}
    </div>
  )
}
