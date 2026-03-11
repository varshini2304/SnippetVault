'use client'

import { useState } from 'react'
import Link from 'next/link'
import { User, Calendar, Globe, Lock } from 'lucide-react'
import type { Snippet } from '@/types'
import CodeBlock from '@/components/snippet/CodeBlock'
import { getLanguageColor, formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface PublicSnippetViewProps {
  snippet: Snippet
}

export default function PublicSnippetView({ snippet }: PublicSnippetViewProps) {
  const colors = getLanguageColor(snippet.language)
  const author = snippet.profiles

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Top nav bar */}
      <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--bg-elevated)]/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link
            href="/"
            className="font-display text-lg font-bold tracking-tight text-[var(--accent)]"
          >
            SnippetVault
          </Link>
          <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
            {snippet.is_public ? (
              <span className="flex items-center gap-1 text-[var(--success)]">
                <Globe className="h-3.5 w-3.5" /> Public
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[var(--warning)]">
                <Lock className="h-3.5 w-3.5" /> Private
              </span>
            )}
            <Link
              href="/login"
              className="rounded-full border border-[var(--border)] px-3 py-1 transition hover:bg-[var(--bg-tertiary)]"
            >
              Sign in
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10 space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="rounded-full border px-3 py-1 text-xs font-medium"
              style={{
                backgroundColor: colors.bg,
                color: colors.text,
                borderColor: colors.border,
              }}
            >
              {snippet.language}
            </span>
            {snippet.view_count !== undefined && (
              <span className="rounded-full border border-[var(--border)] bg-[var(--bg-tertiary)] px-2 py-0.5 text-[10px] text-[var(--text-secondary)]">
                {snippet.view_count.toLocaleString()} views
              </span>
            )}
          </div>

          <h1 className="font-display text-3xl font-bold leading-tight">{snippet.title}</h1>

          {snippet.description && (
            <p className="text-[var(--text-secondary)]">{snippet.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-secondary)]">
            {author && (
              <Link
                href={`/u/${author.username}`}
                className="flex items-center gap-1.5 transition hover:text-[var(--text-primary)]"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] font-bold text-white">
                  {author.display_name.charAt(0).toUpperCase()}
                </span>
                <span>{author.display_name}</span>
              </Link>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(snippet.created_at)}
            </span>
          </div>

          {/* Tags */}
          {snippet.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {snippet.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-full border border-[var(--border)] bg-[var(--bg-tertiary)] px-2 py-0.5 text-[11px] text-[var(--text-secondary)]"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Code block */}
        <CodeBlock snippetId={snippet.id} language={snippet.language} code={snippet.code} />

        {/* Footer CTA */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 text-center">
          <p className="text-sm text-[var(--text-secondary)]">
            Save & manage your own code snippets with{' '}
            <span className="font-semibold text-[var(--accent)]">SnippetVault</span>
          </p>
          <Link
            href="/signup"
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Get started free →
          </Link>
        </div>
      </main>
    </div>
  )
}
