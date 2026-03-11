'use client'

import { useState } from 'react'
import SignUpForm from './SignUpForm'
import AvatarPreview from './AvatarPreview'

export default function SignUpShell() {
  const [displayName, setDisplayName] = useState('')

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <section className="relative hidden overflow-hidden bg-[var(--bg-secondary)] lg:flex lg:flex-col">
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='160' height='160' viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='.25'/%3E%3C/svg%3E\")",
            }}
          />
          <div className="relative z-10 flex h-full flex-col justify-between px-12 py-12">
            <div>
              <div className="font-display text-4xl font-bold text-[var(--text-primary)]">
                Join 10,000+ developers
              </div>
              <ul className="mt-6 space-y-3 text-sm text-[var(--text-secondary)]">
                <li className="flex items-center gap-2">
                  <span className="text-[var(--accent)]">✦</span> Syntax-highlighted code storage
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[var(--accent)]">✦</span> Public profiles &amp; shareable links
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[var(--accent)]">✦</span> Export snippets as images
                </li>
              </ul>
            </div>

            <div className="mt-10">
              <div className="text-sm text-[var(--text-secondary)]">Profile preview</div>
              <div className="mt-4 animate-[scaleIn_300ms_ease_forwards]">
                <AvatarPreview displayName={displayName} />
              </div>
            </div>

            <div className="mt-10 flex items-center gap-3 text-sm text-[var(--text-secondary)]">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className="h-8 w-8 rounded-full border border-[var(--border)] bg-[var(--bg-tertiary)]"
                  />
                ))}
              </div>
              <span>Trusted by 10,000+ developers</span>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <SignUpForm onDisplayNameChange={setDisplayName} />
          </div>
        </section>
      </div>
    </main>
  )
}
