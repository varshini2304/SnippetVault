'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { getInitials, hashColor } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface UserMenuProps {
  profile: { display_name: string; username: string; avatar_url: string | null } | null
}

export default function UserMenu({ profile }: UserMenuProps) {
  const router = useRouter()
  const supabase = useMemo(() => getSupabaseBrowserClient(), [])
  const { toast } = useToast()

  const initials = profile?.display_name ? getInitials(profile.display_name) : 'SV'
  const color = hashColor(profile?.display_name ?? 'SnippetVault')

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleProfile = () => {
    if (!profile?.username) {
      toast({ title: 'Profile not ready', description: 'Finish sign up to set a username.' })
      return
    }
    router.push(`/u/${profile.username}`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white"
          style={{ backgroundColor: color }}
        >
          {profile?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatar_url} alt={profile.display_name} className="h-9 w-9 rounded-full object-cover" />
          ) : (
            initials
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 border-[var(--border)] bg-[var(--bg-elevated)]">
        <DropdownMenuItem onClick={handleProfile}>👤 View Profile</DropdownMenuItem>
        <DropdownMenuItem>⚙️ Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>🚪 Log Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
