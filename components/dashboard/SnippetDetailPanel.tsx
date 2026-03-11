'use client'

import { useEffect, useMemo, useState } from 'react'
import { Pencil, Share2, Trash2, ArrowLeft } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { useSnippet } from '@/hooks/useSnippet'
import { useDeleteSnippet } from '@/hooks/useDeleteSnippet'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import CodeBlock from '@/components/snippet/CodeBlock'
import SnippetMeta from '@/components/snippet/SnippetMeta'
import ShareMenu from '@/components/share/ShareMenu'
import { getLanguageColor } from '@/lib/utils'

export default function SnippetDetailPanel() {
  const { toast } = useToast()
  const activeSnippetId = useUIStore((state) => state.activeSnippetId)
  const setActiveSnippet = useUIStore((state) => state.setActiveSnippet)
  const setShareMenuOpen = useUIStore((state) => state.setShareMenuOpen)
  const [showDelete, setShowDelete] = useState(false)

  const { data: snippet, isLoading, error, refetch } = useSnippet(activeSnippetId)
  const deleteMutation = useDeleteSnippet()

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveSnippet(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setActiveSnippet])

  useEffect(() => {
    if (!activeSnippetId) setShowDelete(false)
  }, [activeSnippetId])

  if (!activeSnippetId) return null

  const colors = snippet ? getLanguageColor(snippet.language) : null

  const handleDelete = async () => {
    if (!snippet) return
    try {
      await deleteMutation.mutateAsync(snippet.id)
      toast({ title: 'Snippet deleted' })
      setActiveSnippet(null)
    } catch {
      toast({ title: 'Delete failed', description: 'Please try again.', variant: 'destructive' })
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setActiveSnippet(null)} />
      <aside
        className="fixed bottom-0 right-0 z-50 h-screen w-full translate-x-0 animate-[fadeInUp_300ms_ease_forwards] overflow-y-auto border-l border-[var(--border)] bg-[var(--bg-elevated)] shadow-[-8px_0_32px_rgba(0,0,0,0.4)] md:top-16 md:h-[calc(100vh-64px)] md:w-[440px] md:animate-[slideInRight_300ms_ease_forwards] lg:w-[480px]"
      >
        <div className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--bg-elevated)]/95 px-5 py-4 backdrop-blur">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="text-[var(--text-secondary)]"
              onClick={() => setActiveSnippet(null)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium text-[var(--text-secondary)]">Snippet Details</div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-[var(--text-secondary)]">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-[var(--text-secondary)]"
                onClick={() => setShareMenuOpen(true)}
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-[var(--text-secondary)] hover:text-[var(--danger)]"
                onClick={() => setShowDelete((prev) => !prev)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div
            className={`overflow-hidden transition-all duration-200 ${showDelete ? 'max-h-40 mt-4' : 'max-h-0'}`}
          >
            <div className="rounded-xl border border-[var(--danger)]/60 bg-[var(--danger)]/10 p-4 text-sm">
              <div className="font-semibold text-[var(--danger)]">⚠️ Delete this snippet?</div>
              <p className="mt-1 text-[var(--text-secondary)]">This action cannot be undone.</p>
              <div className="mt-3 flex gap-2">
                <Button variant="outline" onClick={() => setShowDelete(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-[var(--danger)] text-white hover:bg-red-500"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 py-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-64" />
              <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
              </div>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-[var(--border)] p-6 text-center">
              <p className="text-sm text-[var(--text-secondary)]">Failed to load snippet.</p>
              <Button variant="outline" className="mt-4" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          ) : snippet ? (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">{snippet.title}</h2>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span
                    className="rounded-full border px-3 py-1 text-xs"
                    style={{ backgroundColor: colors?.bg, color: colors?.text, borderColor: colors?.border }}
                  >
                    {snippet.language}
                  </span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] ${
                      snippet.is_public
                        ? 'border-[var(--success)] text-[var(--success)]'
                        : 'border-[var(--warning)] text-[var(--warning)]'
                    }`}
                  >
                    {snippet.is_public ? '🌐 Public' : '🔒 Private'}
                  </span>
                </div>
                {snippet.description ? (
                  <p className="mt-2 text-sm italic text-[var(--text-secondary)]">{snippet.description}</p>
                ) : null}
              </div>

              <CodeBlock snippetId={snippet.id} language={snippet.language} code={snippet.code} />

              <SnippetMeta snippet={snippet} />

              <div>
                <div className="text-[11px] uppercase text-[var(--text-tertiary)]">Tags</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {snippet.tags?.length ? (
                    snippet.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="rounded-full border border-[var(--border)] bg-[var(--bg-tertiary)] px-2 py-1 text-[10px] text-[var(--text-secondary)]"
                      >
                        #{tag.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs italic text-[var(--text-tertiary)]">No tags</span>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="sticky bottom-0 border-t border-[var(--border)] bg-[var(--bg-elevated)]/95 p-4 backdrop-blur">
          {snippet ? (
            <ShareMenu
              snippet={snippet}
              trigger={
                <Button className="h-11 w-full bg-[var(--accent)] text-white">
                  Share Snippet ↗
                </Button>
              }
            />
          ) : (
            <Button className="h-11 w-full bg-[var(--accent)] text-white" disabled>
              Share Snippet ↗
            </Button>
          )}
        </div>
      </aside>
    </>
  )
}

