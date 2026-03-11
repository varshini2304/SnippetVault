import Link from 'next/link'
import type { Profile, Snippet } from '@/types'
import { Button } from '@/components/ui/button'
import { getInitials, hashColor, getLanguageColor } from '@/lib/utils'
import { format } from 'date-fns'

interface ProfileHeroProps {
  profile: Profile
  snippets: Snippet[]
}

export default function ProfileHero({ profile, snippets }: ProfileHeroProps) {
  const initials = getInitials(profile.display_name)
  const color = hashColor(profile.display_name)
  const languageSet = new Set(snippets.map((s) => s.language))
  const languages = Array.from(languageSet)
  const created = format(new Date(profile.created_at), 'MMM yyyy')

  return (
    <div>
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg-secondary)]/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent)] text-sm text-white">SV</span>
            SnippetVault
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" className="border-[var(--border)] bg-transparent text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-[var(--accent)] text-white">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-[var(--border)] bg-gradient-to-b from-[var(--bg-secondary)] to-[var(--bg-primary)]">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(255,255,255,0.05), rgba(255,255,255,0.05) 1px, transparent 1px, transparent 24px)',
          }}
        />
        <div className="relative mx-auto flex max-w-[1400px] flex-col items-center px-6 py-16 text-center">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt={profile.display_name}
              className="h-20 w-20 rounded-full border-2 border-[var(--accent)] ring-4 ring-[var(--bg-primary)]"
            />
          ) : (
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-[var(--accent)] text-lg font-semibold text-white ring-4 ring-[var(--bg-primary)]"
              style={{ backgroundColor: color }}
            >
              {initials}
            </div>
          )}
          <h1 className="mt-4 font-display text-3xl font-bold">{profile.display_name}</h1>
          <p className="mt-1 text-sm text-[var(--text-tertiary)]">@{profile.username}</p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--text-secondary)]">
            <div className="flex items-center gap-2">
              <span className="font-display text-lg text-[var(--text-primary)] animate-[countUp_800ms_ease_forwards]">
                {snippets.length}
              </span>
              <span>public snippets</span>
            </div>
            <div className="h-4 w-px bg-[var(--border)]" />
            <div className="flex items-center gap-2">
              <span className="font-display text-lg text-[var(--text-primary)] animate-[countUp_800ms_ease_forwards]">
                {languages.length}
              </span>
              <span>languages</span>
            </div>
            <div className="h-4 w-px bg-[var(--border)]" />
            <div className="flex items-center gap-2">
              <span className="font-display text-lg text-[var(--text-primary)] animate-[countUp_800ms_ease_forwards]">
                {created}
              </span>
              <span>member since</span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {languages.map((language, index) => {
              const colors = getLanguageColor(language)
              return (
                <span
                  key={language}
                  className="rounded-full border px-3 py-1 text-xs"
                  style={{
                    backgroundColor: colors.bg,
                    color: colors.text,
                    borderColor: colors.border,
                    animation: `fadeInUp 400ms ease ${index * 60}ms both`,
                  }}
                >
                  {language}
                </span>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
