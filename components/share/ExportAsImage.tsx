'use client'

import { useMemo, useRef, useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { truncateLines, getLanguageColor } from '@/lib/utils'
import type { Snippet } from '@/types'
import { useImageExport } from '@/hooks/useImageExport'

interface ExportAsImageProps {
  snippet: Snippet
}

export default function ExportAsImage({ snippet }: ExportAsImageProps) {
  const { toast } = useToast()
  const [includeTitle, setIncludeTitle] = useState(true)
  const [includeWatermark, setIncludeWatermark] = useState(true)
  const previewRef = useRef<HTMLDivElement | null>(null)
  const exportRef = useRef<HTMLDivElement | null>(null)
  const { exportImage, isExporting } = useImageExport()

  const previewCode = useMemo(() => truncateLines(snippet.code, 8), [snippet.code])
  const exportCode = useMemo(() => truncateLines(snippet.code, 50), [snippet.code])
  const colors = getLanguageColor(snippet.language)
  const lineCount = snippet.code.split('\n').length

  const handleExport = async () => {
    try {
      if (!exportRef.current) return
      await exportImage(exportRef.current, `${snippet.title}.png`)
      toast({ title: '✓ Downloaded!' })
    } catch {
      toast({ title: 'Failed to export image', variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-4">
      <div ref={previewRef} className="rounded-2xl border border-[var(--border)] bg-[var(--syntax-bg)] p-4 text-xs text-[var(--text-secondary)]">
        {includeTitle ? (
          <div className="mb-3 font-display text-sm text-[var(--text-primary)]">{snippet.title}</div>
        ) : null}
        <span
          className="inline-flex rounded-full border px-2 py-0.5 text-[10px]"
          style={{ backgroundColor: colors.bg, color: colors.text, borderColor: colors.border }}
        >
          {snippet.language}
        </span>
        <pre className="mt-3 whitespace-pre-wrap font-code text-[11px] text-[var(--text-secondary)]">
{previewCode}
        </pre>
        {includeWatermark ? (
          <div className="mt-3 text-[10px] text-[var(--text-tertiary)]">SnippetVault</div>
        ) : null}
      </div>

      <div
        ref={exportRef}
        style={{ position: 'absolute', left: '-9999px', top: 0 }}
        className="rounded-2xl border border-[var(--border)] bg-[var(--syntax-bg)] p-4 text-xs text-[var(--text-secondary)]"
      >
        {includeTitle ? (
          <div className="mb-3 font-display text-sm text-[var(--text-primary)]">{snippet.title}</div>
        ) : null}
        <span
          className="inline-flex rounded-full border px-2 py-0.5 text-[10px]"
          style={{ backgroundColor: colors.bg, color: colors.text, borderColor: colors.border }}
        >
          {snippet.language}
        </span>
        <pre className="mt-3 whitespace-pre-wrap font-code text-[11px] text-[var(--text-secondary)]">
{exportCode}
        </pre>
        {includeWatermark ? (
          <div className="mt-3 text-[10px] text-[var(--text-tertiary)]">SnippetVault</div>
        ) : null}
      </div>

      <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
        <label className="flex items-center gap-2">
          <Checkbox checked={includeTitle} onCheckedChange={(v) => setIncludeTitle(Boolean(v))} />
          Include Title
        </label>
        <label className="flex items-center gap-2">
          <Checkbox checked={includeWatermark} onCheckedChange={(v) => setIncludeWatermark(Boolean(v))} />
          Include Watermark
        </label>
      </div>

      <Button className="h-11 w-full bg-[var(--accent)] text-white" onClick={handleExport} disabled={isExporting}>
        {isExporting ? 'Generating image...' : '🖼 Export as PNG'}
      </Button>

      {lineCount > 50 ? (
        <div className="rounded-xl border border-[var(--warning)]/60 bg-[var(--warning)]/10 p-3 text-xs text-[var(--warning)]">
          ⚠️ Long snippets are capped at 50 lines in exports
        </div>
      ) : null}
    </div>
  )
}

