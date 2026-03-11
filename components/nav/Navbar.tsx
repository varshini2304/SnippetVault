'use client'

import { Bell } from 'lucide-react'
import SearchBar from '@/components/dashboard/SearchBar'
import UserMenu from './UserMenu'

interface NavbarProps {
  profile: { display_name: string; username: string; avatar_url: string | null } | null
}

export default function Navbar({ profile }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-[var(--border)] bg-[var(--bg-secondary)]/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent)] text-sm font-bold text-white">
            SV
          </div>
          <span className="font-display text-lg font-bold">SnippetVault</span>
        </div>
        <div className="hidden w-full max-w-md px-6 lg:block">
          <SearchBar variant="navbar" />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-transparent text-[var(--text-secondary)] transition hover:bg-[var(--bg-tertiary)]"
          >
            <Bell className="h-4 w-4" />
          </button>
          <UserMenu profile={profile} />
        </div>
      </div>
    </header>
  )
}
