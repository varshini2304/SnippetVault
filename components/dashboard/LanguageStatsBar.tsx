'use client'

import { useMemo } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { getLanguageColor } from '@/lib/utils'

interface LanguageStatsBarProps {
  counts: Array<[string, number]>
  total: number
  onSelect?: (language: string) => void
}

export default function LanguageStatsBar({ counts, total, onSelect }: LanguageStatsBarProps) {
  const ordered = useMemo(() => counts.sort((a, b) => b[1] - a[1]), [counts])

  return (
    <div className="space-y-3">
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-[var(--bg-tertiary)]">
        {ordered.map(([language, count]) => {
          const colors = getLanguageColor(language)
          const width = total > 0 ? (count / total) * 100 : 0
          return (
            <TooltipProvider key={language} delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => onSelect?.(language)}
                    style={{ width: `${width}%`, backgroundColor: colors.text }}
                    className="h-full transition"
                    aria-label={`${language} · ${count} snippets`}
                  />
                </TooltipTrigger>
                <TooltipContent className="border-[var(--border)] bg-[var(--bg-elevated)] text-xs">
                  {language} · {count} snippets
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        })}
      </div>
      <div className="flex flex-wrap gap-2 text-xs text-[var(--text-secondary)]">
        {ordered.map(([language, count]) => {
          const colors = getLanguageColor(language)
          return (
            <span key={language} className="flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-1">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: colors.text }} />
              {language} · {count}
            </span>
          )
        })}
      </div>
    </div>
  )
}
