'use client'

import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import type { Profile, Snippet } from '@/types'
import PublicSnippetCard from '@/components/snippet/PublicSnippetCard'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

interface ProfilePageClientProps {
  profile: Profile
  snippets: Snippet[]
}

const sortOptions = ['latest', 'oldest', 'az'] as const

type SortOption = (typeof sortOptions)[number]

export default function ProfilePageClient({ profile, snippets }: ProfilePageClientProps) {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortOption>('latest')
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all')
  const [visibleCount, setVisibleCount] = useState(12)
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    const checkOwner = async () => {
      const supabase = getSupabaseBrowserClient()
      const { data } = await supabase.auth.getUser()
      setIsOwner(data.user?.id === profile.id)
    }
    checkOwner()
  }, [profile.id])

  const languages = useMemo(() => {
    const set = new Set(snippets.map((s) => s.language))
    return ['all', ...Array.from(set).sort()]
  }, [snippets])

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    let list = snippets.filter((snippet) => {
      if (selectedLanguage !== 'all' && snippet.language !== selectedLanguage) return false
      if (!normalized) return true
      const haystack = [
        snippet.title,
        snippet.language,
        snippet.description ?? '',
        ...(snippet.tags?.map((t) => t.name) ?? []),
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(normalized)
    })

    list = [...list].sort((a, b) => {
      if (sort === 'latest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      if (sort === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      return a.title.localeCompare(b.title)
    })

    return list
  }, [query, sort, selectedLanguage, snippets])

  const visible = filtered.slice(0, visibleCount)

  return (
    <div>
      <div className="sticky top-16 z-20 border-b border-[var(--border)] bg-[var(--bg-secondary)]/80 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Search ${profile.display_name}'s snippets...`}
            className="max-w-md"
          />
          <div className="flex flex-wrap items-center gap-3">
            <Select value={sort} onValueChange={(value) => setSort(value as SortOption)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent className="bg-[var(--bg-elevated)]">
                <SelectItem value="latest">Latest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
                <SelectItem value="az">A-Z</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 overflow-x-auto">
              {languages.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setSelectedLanguage(lang)}
                  className={`rounded-full border px-3 py-1 text-xs transition ${
                    selectedLanguage === lang
                      ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                      : 'border-[var(--border)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 py-10">
        {visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] py-16 text-center">
            <div className="text-5xl text-[var(--text-tertiary)]">&lt;/&gt;</div>
            <div className="mt-4 text-lg font-semibold text-[var(--text-primary)]">
              {profile.display_name} hasn&apos;t shared any snippets yet
            </div>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              {isOwner
                ? 'Go to your dashboard to make snippets public.'
                : 'Sign up to start sharing your own code.'}
            </p>
            <div className="mt-4">
              {isOwner ? (
                <Link href="/dashboard">
                  <Button className="bg-[var(--accent)] text-white">Go to dashboard →</Button>
                </Link>
              ) : (
                <Link href="/signup">
                  <Button className="bg-[var(--accent)] text-white">Sign up free →</Button>
                </Link>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {visible.map((snippet, index) => (
                <div key={snippet.id} style={{ animation: `fadeInUp 400ms ease ${index * 50}ms both` }}>
                  <PublicSnippetCard snippet={snippet} />
                </div>
              ))}
            </div>

            {filtered.length > visibleCount ? (
              <div className="mt-8 flex justify-center">
                <Button
                  variant="outline"
                  className="border-[var(--border)] bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
                  onClick={() => setVisibleCount((prev) => prev + 12)}
                >
                  Load more
                </Button>
              </div>
            ) : null}
          </>
        )}

        <footer className="mt-12 text-center text-xs text-[var(--text-tertiary)]">
          SnippetVault ·{' '}
          <Link href="/signup" className="text-[var(--accent)] hover:text-[var(--accent-hover)]">
            Sign up to create your own profile →
          </Link>
        </footer>
      </div>
    </div>
  )
}
